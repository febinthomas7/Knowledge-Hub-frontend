# Knowledge Hub

A collaborative document management platform with AI-powered features, enabling teams to store, organize, and query documents intelligently.

---

## Features

### Document Cards

Each document displays:

- **Title**
- **Summary**
- **Tags**
- **Author**
- **Versions**
- **Date**
- **Edit / Delete Buttons**

### Button Actions per Document

- **Summarize with Gemini** – AI-generated summary of document content.
- **Generate Tags with Gemini** – AI-generated intelligent tags.

### Team Q\&A Tab

- Ask questions, and Gemini answers using stored team documents as context.

### Filtering & Search

- **Tag-Based Filtering (Chip-Style):** Filter documents based on selected tags.
- **Semantic Search:** Search using embeddings for relevance-based results.

### Version History

- Track changes in document content.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **AI Features:** Generative AI API (Gemini)
- **Authentication:** JWT-based

---

## Setup Instructions

### 1. Clone Repositories

**Frontend:**

```bash
git clone https://github.com/febinthomas7/Knowledge-Hub-frontend.git
cd Knowledge-Hub-frontend
```

**Backend:**

```bash
git clone https://github.com/febinthomas7/Knowledge-Hub-backend.git
cd Knowledge-Hub-backend
```

### 2. Install Dependencies

```bash
npm install
```

Run this command in both the frontend and backend directories.

### 3. Configure Environment Variables

**Frontend (`.env`):**

```bash
VITE_BASE_URL=http://localhost:5000
```

**Backend (`.env`):**

```bash
MONGODB_URI=mongodb+srv://tfebin54_db_user:DLaZ3Q1kdNNcu39R@hub.k2qpj6n.mongodb.net/?retryWrites=true&w=majority&appName=hub
PORT=5000
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173
APP_PASSWORD=password
EMAIL=id
JWT_SECRET=secret
GEMINI_API_KEY=key
GEMINI_MODEL=model
```

### 4. Run the Applications

**Frontend:**

```bash
npm run dev
```

**Backend:**

```bash
npm run dev
```

### 5. Access the App

Open your browser and go to:
[http://localhost:5173](http://localhost:5173)

---

## Notes

- Ensure your MongoDB Atlas cluster is accessible from your IP.
- Gemini API key is required for AI-powered features.
