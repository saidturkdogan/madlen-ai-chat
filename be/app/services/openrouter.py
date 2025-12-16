import httpx
import os
import asyncio
from typing import List, Dict, Any
from fastapi import HTTPException

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1"

# Fallback list of stable free models if API fails
FALLBACK_FREE_MODELS = [
    {
        "id": "meta-llama/llama-3.3-70b-instruct:free",
        "name": "Llama 3.3 70B Instruct",
        "provider": "Meta",
        "context_length": 131072,
        "is_free": True
    },
    {
        "id": "google/gemma-2-9b-it:free",
        "name": "Gemma 2 9B",
        "provider": "Google",
        "context_length": 8192,
        "is_free": True
    },
    {
        "id": "mistralai/mistral-7b-instruct:free",
        "name": "Mistral 7B Instruct",
        "provider": "Mistral AI",
        "context_length": 32768,
        "is_free": True
    },
    {
        "id": "deepseek/deepseek-chat:free",
        "name": "DeepSeek Chat",
        "provider": "DeepSeek",
        "context_length": 65536,
        "is_free": True
    }
]

async def get_models() -> List[Dict[str, Any]]:
    """
    Fetches the list of available free models from OpenRouter API.
    Filters models where pricing.prompt == "0" (free models).
    Falls back to a static list if the API call fails.
    """
    try:
        headers = {}
        if OPENROUTER_API_KEY:
            headers["Authorization"] = f"Bearer {OPENROUTER_API_KEY}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{OPENROUTER_URL}/models",
                headers=headers,
                timeout=15.0
            )
            response.raise_for_status()
            data = response.json()
            
            # Filter for free models (pricing.prompt == "0")
            free_models = []
            for model in data.get("data", []):
                pricing = model.get("pricing", {})
                prompt_price = pricing.get("prompt", "1")  # Default to non-free
                
                # Check if it's free (prompt price is "0")
                try:
                    if prompt_price == "0" or float(prompt_price) == 0:
                        # Extract provider from model id (e.g., "openai/gpt-4" -> "Openai")
                        model_id = model.get("id", "")
                        provider = model_id.split("/")[0].replace("-", " ").title() if "/" in model_id else "Unknown"
                        
                        free_models.append({
                            "id": model_id,
                            "name": model.get("name", model_id),
                            "provider": provider,
                            "context_length": model.get("context_length", 4096),
                            "is_free": True
                        })
                except (ValueError, TypeError):
                    continue
            
            # Sort by context length (larger first) and limit to top 15
            free_models.sort(key=lambda x: x.get("context_length", 0), reverse=True)
            
            if free_models:
                print(f"Fetched {len(free_models)} free models from OpenRouter API")
                return free_models[:15]
            
            print("No free models found from API, using fallback list")
            return FALLBACK_FREE_MODELS
            
    except Exception as e:
        print(f"Error fetching models from OpenRouter: {e}")
        return FALLBACK_FREE_MODELS

async def chat_completion(
    model: str, 
    messages: List[Dict[str, str]], 
    site_url: str = "http://localhost:3000", 
    app_name: str = "Madlen AI"
) -> Dict[str, Any]:
    
    if not OPENROUTER_API_KEY:
        # Fallback for dev without key
        print("WARNING: OPENROUTER_API_KEY not set. Returning mock response.")
        return {
            "choices": [{
                "message": {
                    "role": "assistant",
                    "content": "This is a mock response because OPENROUTER_API_KEY is missing in backend env."
                }
            }]
        }

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": site_url,
        "X-Title": app_name,
        "Content-Type": "application/json"
    }

    payload = {
        "model": model,
        "messages": messages
    }

    # Retry logic with exponential backoff for rate limiting
    max_retries = 3
    base_delay = 2  # seconds
    
    async with httpx.AsyncClient() as client:
        for attempt in range(max_retries):
            try:
                response = await client.post(
                    f"{OPENROUTER_URL}/chat/completions",
                    json=payload,
                    headers=headers,
                    timeout=60.0
                )
                response.raise_for_status()
                return response.json()
                
            except httpx.HTTPStatusError as e:
                error_text = e.response.text
                status_code = e.response.status_code
                
                # Handle rate limiting (429)
                if status_code == 429:
                    if attempt < max_retries - 1:
                        delay = base_delay * (2 ** attempt)  # Exponential backoff: 2s, 4s, 8s
                        print(f"Rate limited (429). Retrying in {delay}s... (attempt {attempt + 1}/{max_retries})")
                        await asyncio.sleep(delay)
                        continue
                    else:
                        print(f"Rate limit exceeded after {max_retries} attempts")
                        raise HTTPException(
                            status_code=429, 
                            detail="Rate limit exceeded. Please wait a moment and try again. Free models have strict usage limits."
                        )
                
                # Handle model not found (404)
                elif status_code == 404:
                    print(f"Model not found: {model}")
                    raise HTTPException(
                        status_code=404, 
                        detail=f"Model '{model}' not found or unavailable. Please select a different model."
                    )
                
                # Handle invalid model ID (400)
                elif status_code == 400:
                    print(f"Invalid model ID: {model}")
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Invalid model ID '{model}'. Please select a valid model from the list."
                    )
                
                # Other errors
                print(f"OpenRouter API Error: {error_text}")
                raise HTTPException(status_code=status_code, detail=f"OpenRouter Error: {error_text}")
                
            except httpx.TimeoutException:
                if attempt < max_retries - 1:
                    delay = base_delay * (2 ** attempt)
                    print(f"Request timeout. Retrying in {delay}s... (attempt {attempt + 1}/{max_retries})")
                    await asyncio.sleep(delay)
                    continue
                raise HTTPException(status_code=504, detail="Request timed out. Please try again.")
                
            except Exception as e:
                print(f"Network Error: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Internal Service Error: {str(e)}")

