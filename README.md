# Madlen AI Chat

A full-stack AI chat application that allows users to interact with multiple AI models through OpenRouter.

## 🚀 Features

- **Multiple AI Models**: Access Llama, Gemma, Mistral, DeepSeek, and more
- **Real-time Chat**: Seamless conversation with AI models
- **Multi-modal Support**: Upload images for vision-capable models
- **Session Management**: Save and manage chat history
- **Dark/Light Theme**: Toggle between themes
- **Authentication**: Secure login with Clerk
- **OpenTelemetry**: Distributed tracing with Jaeger

## 🛠️ Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Clerk Authentication

### Backend
- FastAPI (Python)
- PostgreSQL
- SQLAlchemy ORM
- OpenRouter API

### DevOps
- Docker & Docker Compose
- OpenTelemetry + Jaeger

## 📦 Installation

### Prerequisites
- Node.js 20+
- Python 3.10+
- PostgreSQL
- Docker (optional)

### Environment Variables

#### Backend (`be/.env`)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/madlen_ai
OPENROUTER_API_KEY=your_openrouter_api_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

#### Frontend (`fe/.env.local`)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Local Development

```bash
# Backend
cd be
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd fe
npm install
npm run dev
```

### Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔍 OpenTelemetry Tracing

Start Jaeger for distributed tracing:

```bash
docker run -d --name jaeger \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  jaegertracing/all-in-one:latest
```

View traces at: http://localhost:16686

## 📁 Project Structure

```
madlen-ai-chat/
├── be/                 # Backend (FastAPI)
│   ├── app/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── main.py
│   ├── Dockerfile
│   └── requirements.txt
├── fe/                 # Frontend (Next.js)
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── services/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 📄 License

MIT License - See LICENSE for details.
