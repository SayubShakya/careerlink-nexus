# 🚀 CareerLink: A Simple Job Portal

Welcome to **CareerLink**, a web application built by **Team Nexus** as our **College Final Assignment**.

## 📖 About the Project
**CareerLink** is a modern and easy-to-use job website. We noticed that finding a job today is stressful:
- Other sites have too many distractions (like a noisy social media feed).
- Job seekers apply but sometimes never hear back (known as "ghosting").
- Filling out the same application forms over and over again is tiring.

**Why We Built This:** This project was created as our final college assignment to demonstrate our ability to plan, design, and build a full-stack, real-world application from scratch. Our main goal was to create a simple, clear website where job seekers can save their profile once and apply to jobs with **one click**, while employers can easily post jobs and manage their candidates.

---

## 🧑‍💻 The Team & Roles
We worked as a team of 5, giving everyone a specific role to make sure the project succeeded:
- **Nihariks Shakya (Project Manager):** Keeps the team focused on our main goals and talks to our teacher.
- **Aayush Man Shakya (Start-Up Manager):** Makes sure the website solves a real problem for the users.
- **Sayub Shakya (Scheduling Manager):** Plans our tasks so the project finishes on time.
- **DipeshRaj Shrestha (Quality Manager):** Tests every feature to find and fix bugs.
- **Amogh Shakya (Risk Manager):** Checks for security issues to keep passwords and data safe.

*(Read more about our roles in `docs/2_TEAM_ROLES.md`)*

---

## 🛠️ Technology Stack
To make this project fast and secure, we used modern tools:
- **Frontend:** React.js (Vite)
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (with Sequelize ORM)
- **Authentication:** JWT (JSON Web Tokens), Google OAuth

---

## 💻 How to Clone and Run the Project
If you want to view, test, or run CareerLink on your own computer, follow these simple steps:

### 1. Clone the Repository
Open your terminal (or Command Prompt) and type:
```bash
git clone https://github.com/your-username/careerlink-nexus.git
cd careerlink-nexus
```

### 2. Setup the Backend (Server)
Open a terminal window and go to the `server` folder:
```bash
cd server
npm install
```
*Note: You will need to create a `.env` file inside the `server` folder. In this file, you must add your Database credentials (like DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET, and Google Client details).*

Once the `.env` file is ready, run the server:
```bash
npm start
```

### 3. Setup the Frontend (Client)
Open a **new** terminal window and go to the `client` folder:
```bash
cd client
npm install
npm run dev
```

### 4. View the Website
Once both the server and client are running, open your web browser and click this link:
[http://localhost:5173](http://localhost:5173)

---

## 📚 Detailed Documentation
If you are our teacher or just want to read exactly how we planned and built this project over 10 weeks, check out our full documentation in the `docs/` folder:

1. [Project Overview](docs/1_PROJECT_OVERVIEW.md) - Exact features, problems solved, and technology used.
2. [Team Roles](docs/2_TEAM_ROLES.md) - Detailed breakdown of what each team member did.
3. [Project Plan](docs/3_PROJECT_PLAN.md) - Our 4-step timeline from start to finish.
4. [Workflow](docs/4_WORKFLOW.md) - Our strict 5-step process for building code without breaking the website.
5. [Methodology](docs/5_METHODOLOGY.md) - How we used a method called "Scrumban" to plan our weeks.

---

> **Built to help students and professionals get hired, with no distractions. - Team Nexus**