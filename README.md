🚗 DriveTrack

DriveTrack is a Driver Management Web Application built with React.js (frontend), FastAPI (backend), and MongoDB Atlas (database).
It helps organizations efficiently manage driver records with full CRUD operations, logs, and accountability features.

✨ Features

👤 Driver Management – Add, update, view, and delete driver records

📝 Change Logs – Track all updates with user accountability

🔐 Authentication – Simple demo login flow

📊 Dashboard – Clean UI with driver stats and today’s date

🎨 Modern UI – Built with React + TailwindCSS, fully responsive

☁️ Cloud-Ready – Backend with FastAPI + MongoDB Atlas

🛠️ Tech Stack

Frontend → React.js, TypeScript, TailwindCSS

Backend → FastAPI (Python)

Database → MongoDB Atlas

Deployment → Railway (backend + frontend) or Netlify (frontend only)

📂 Project Structure
DriveTrack/
├── backend/              # FastAPI backend
│   ├── main.py           # Entry point
│   ├── models/           # Pydantic & DB models
│   ├── routes/           # API routes (drivers, logs, auth)
│   └── requirements.txt  # Backend dependencies
│
├── frontend/             # React.js frontend
│   ├── public/
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Pages (Dashboard, Drivers, Logs, etc.)
│   │   └── App.tsx
│   └── package.json
│
├── data/
│   └── Drivers.json      # Sample driver records (optional)
│
├── Dockerfile            # For Railway full-stack deployment
├── Procfile              # (Used for Heroku deployment only)
├── .gitignore            # Ignore unnecessary files
└── README.md             # Project documentation

🚀 Getting Started
1. Clone the repository
git clone https://github.com/ghravi-cdr/DriveTrack.git
cd DriveTrack

2. Setup Backend (FastAPI)
cd backend
python -m venv .venv
.venv\Scripts\activate   # (Windows)
pip install -r requirements.txt
uvicorn main:app --reload


Backend runs on: http://127.0.0.1:8000

3. Setup Frontend (React)
cd frontend
npm install
npm start


Frontend runs on: http://localhost:3000

🌍 Deployment

Railway → Deploy both frontend & backend in one service (with Dockerfile)

Netlify/Vercel → Deploy frontend separately, backend hosted on Railway

📸 Screenshots

(Add UI screenshots: Dashboard, Driver List, Logs, etc.)

🧑‍💻 Author

Developed by Ravi Sankar (ghravi-cdr) ✨

📜 License

This project is licensed under the MIT License – free to use.
