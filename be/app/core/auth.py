from fastapi import HTTPException, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
import os
import jwt
from jwt.algorithms import RSAAlgorithm
import json

security = HTTPBearer()

CLERK_ISSUER = os.getenv("CLERK_ISSUER")
CLERK_JWKS_URL = f"{CLERK_ISSUER}/.well-known/jwks.json"

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    
    try:
        if not CLERK_ISSUER:
            print("CRITICAL: CLERK_ISSUER env var is not set!")
            raise ValueError("CLERK_ISSUER not set")

        async with httpx.AsyncClient() as client:
            print(f"Fetching JWKS from: {CLERK_JWKS_URL}")
            response = await client.get(CLERK_JWKS_URL)
            response.raise_for_status()
            jwks = response.json()

        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")

        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == kid:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
                break
        
        if not rsa_key:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not find verifying key",
                headers={"WWW-Authenticate": "Bearer"},
            )

        public_key = RSAAlgorithm.from_jwk(json.dumps(rsa_key))

        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=os.getenv("CLERK_AUDIENCE"),
            issuer=CLERK_ISSUER,
            options={"verify_aud": False}
        )
        
        return payload
        
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
