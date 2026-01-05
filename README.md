# Flirty Friend Chat Back-end

**Project:** A chat app with streaming LLM (GPT-4o-mini) and a message moderation system

---

## Technologies

- **Backend:** Next.js API Routes
- **LLM:** OpenAI GPT-4o-mini
- **Moderation:** Banned word pairs with support for obfuscation, leet, and repeated letters
- **Streaming:** Web socket via Socket.io
- **Docker:** Project is containerized for quick setup

---

## How to Run

Locally

1. Clone the repository:

2. Create a .env file with your OpenAI key:

OPENAI_API_KEY=your_openai_api_key_here

3. Install dependencies and start Next.js:

```bash
npm install
nest start --watch
```

Docker

1. Build the Docker image:

```bash
docker build -t flirty-chat .
```

2. Run the container:

```bash
docker run -p 3000:3000

```
