# 📚 StudyBuddy AI

> **Hacktoberfest 2026 Challenge Entry** — Theme: *"Build for a Friend"*

![StudyBuddy AI Header](client/public/logo.jpg)

**StudyBuddy AI** is a lightweight, full-stack web application that transforms long, dense study notes into concise summaries, key takeaways, and practice exam questions with answers.

It uses **open-weight AI models available through Hugging Face Inference Providers**, with **Qwen/Qwen2.5-72B-Instruct** as the default model.

---

## 🎯 The Problem

Students often have to prepare for exams using long textbook chapters, lecture notes, and study material.

This creates two common problems:

- **Information Overload:** Students can spend a lot of time reading large amounts of material without identifying the most important concepts.
- **Passive Studying:** Creating practice questions manually takes additional time, even though active recall is useful for revision.

## 💡 The Solution

StudyBuddy AI converts raw study notes into a structured **Study Pack** containing:

1. **Concise Overview** — A short summary of the submitted notes.
2. **Key Takeaways** — Important concepts extracted from the material.
3. **5 Practice Questions** — Questions generated specifically from the submitted notes.
4. **Answers & Explanations** — Revealable answers that help students check their understanding.

The project was built around a simple idea:

> **Turn overwhelming study material into a structured and interactive study experience.**

---

## 🤝 Built for a Friend

This project was created for a friend who gets overwhelmed when preparing for exams from long study notes and textbook chapters.

Instead of manually creating summaries and practice questions, the student can paste their notes into StudyBuddy AI and receive a ready-to-use study pack.

---

## 🤖 How the AI Works

The application follows a simple full-stack AI workflow:

```text
Student Notes
     ↓
React Frontend
     ↓
Express.js Backend
     ↓
Hugging Face Router
     ↓
Open-Weight AI Model
     ↓
Structured Study Pack
     ↓
React UI


## 🛠️ Tech Stack

### Frontend

- **React 18** — Component-based user interface
- **Vite** — Fast frontend development and build tool
- **CSS3** — Custom responsive styling
- **Lucide React** — UI icons
- **Canvas Confetti** — Visual feedback after completing study activities

### Backend

- **Node.js** — JavaScript runtime
- **Express.js** — Backend API server
- **CORS** — Cross-origin request handling
- **Dotenv** — Environment variable management

### AI Integration

- **Hugging Face Router** — AI model inference
- **Hugging Face Inference Providers** — Access to compatible open-weight models
- **Qwen/Qwen2.5-72B-Instruct** — Default AI model

### Development Tools

- **Git & GitHub** — Version control and project hosting
- **npm** — Dependency management
- **Vite** — Frontend development and production builds

---

## 🧠 AI Architecture

StudyBuddy AI follows a simple full-stack AI architecture:

```text
┌─────────────────────┐
│    Student Notes    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   React Frontend    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Express Backend   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Hugging Face       │
│      Router         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Open-Weight AI      │
│      Model          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Structured Study  │
│        Pack         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    React UI         │
└─────────────────────┘

AI Workflow :

The student enters or pastes their study notes.
React sends the notes to the Express.js backend.
The backend creates a structured prompt.
The prompt is sent to the Hugging Face Router.
The selected open-weight model processes the notes.
The backend receives the generated response.
The response is structured into a study pack.
The React frontend displays the generated content.

The generated study pack contains :

Summary
Key Takeaways
5 Practice Questions
Answers
Explanations



🤖 Model Selection

The default model is:

Qwen/Qwen2.5-72B-Instruct

StudyBuddy AI also includes a dynamic model selector.

Instead of allowing users to enter arbitrary model IDs, the application retrieves currently available models from the Hugging Face Router and displays compatible models that have live inference providers.

This helps prevent users from selecting models that are unavailable through the configured inference service.




💡 Why Open-Weight AI?

StudyBuddy AI uses open-weight AI models through inference providers.

This approach provides:

Flexibility — Different compatible models can be used.
Experimentation — Developers can experiment with different open-weight models.
Deployment Options — Compatible models can potentially be deployed locally.
Provider Flexibility — Models can be accessed through inference infrastructure instead of requiring local hardware.
Developer Control — Open-weight models provide more control over model and deployment choices.



🎯 Features
📚 Study Pack Generation

Convert raw study notes into a structured study pack.

📝 AI Summaries

Generate concise summaries from lengthy notes.

🔑 Key Takeaways

Extract the most important concepts from the submitted material.

❓ Practice Questions

Generate five practice questions based on the student's notes.

💡 Answers & Explanations

Reveal answers and explanations to support self-testing and revision.

🤖 Dynamic AI Model Selection

Discover compatible models currently available through Hugging Face's inference providers.

🎨 Clean Study Interface

A simple interface designed specifically for quickly entering notes and reviewing generated study material.




## 🚀 Quick Start Guide (How to Install & Run Locally)

Follow these simple steps to run StudyBuddy AI locally on your computer.

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Step 1: Clone the Repository & Install Dependencies
```bash
# Navigate into the project folder
cd hacktoberfest-weekend-2026

# Install backend dependencies & auto-trigger client installation
npm install
```

### Step 2: Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
> **Note:** API keys are optional! If left blank, StudyBuddy AI will run in offline simulation mode or attempt public HF inference so you can test immediately without any API keys.
> 
> To connect a live API key, add your free token in `.env`:
> ```env
> HF_TOKEN=your_free_huggingface_token_here
> GROQ_API_KEY=your_groq_api_key_here
> ```

### Step 3: Run the Application
Start both the backend server and Vite React frontend concurrently:
```bash
npm run dev
```

Open your browser and navigate to:
👉 **`http://localhost:3000`** (or `http://localhost:5000` for API backend)

---

## 🧪 Production Build & Standalone Server

To build the optimized static bundle and run it on a single Express port:
```bash
# Build client
npm run build

# Start production server
npm start
```

---

## 📄 License
Released under the [MIT License](LICENSE). Built with ❤️ for Hacktoberfest 2026.
