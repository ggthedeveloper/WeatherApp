# 🌦️ Weather Web App (Full Stack)

A full-stack weather web application that provides real-time weather information, forecasts, air quality insights, and interactive visualizations using the OpenWeather API.

This project focuses not only on functionality but also on **real-world deployment, performance optimization, and API safety**.

---

## 🚀 Live Demo
🔗 Frontend: <add-your-frontend-link>  
🔗 Backend API: https://weatherapp-backend-7m69.onrender.com  

---

## 🛠️ Tech Stack

### Frontend
- HTML5  
- CSS3  
- JavaScript (Vanilla JS)  
- Chart.js (for temperature visualization)  
- Leaflet.js (interactive maps)  

### Backend
- Node.js  
- Express.js  
- OpenWeather API  

### Deployment & Tools
- Render (Backend hosting)  
- UptimeRobot (health monitoring)  
- dotenv (environment variables)  
- Helmet & Rate Limiting (security)  

---

## ✨ Features

- 🌍 Search weather by city name  
- 📍 Get weather using current location  
- 📊 Temperature chart visualization  
- 🗺️ Interactive map view  
- 🌫️ Air Quality Index (AQI) with health advice  
- 🎤 Voice-based city search  
- 🌗 Light / Dark mode  
- 📱 Responsive design  
- 🔐 Secure backend with rate limiting  

---

## ⚙️ How It Works

1. The frontend sends requests to the backend API.
2. The backend fetches data from the OpenWeather API.
3. Responses are processed and displayed using charts, maps, and UI components.
4. A `/health` endpoint is used to keep the backend active on the free hosting tier.

---

## 🔐 API Safety & Performance

- API keys are stored securely using environment variables.
- A dedicated `/health` route ensures uptime monitoring **without consuming API quota**.
- Rate limiting prevents abuse.
- Backend sleep issues on free hosting are handled using uptime monitoring.

---

## 📁 Project Structure
├── frontend
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── service-worker.js
│   └── manifest.json
│
├── backend
│   ├── server.js
│   ├── package.json
│   └── .env

---
