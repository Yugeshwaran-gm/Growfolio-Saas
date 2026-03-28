GrowFolio

GrowFolio is a SaaS-based platform designed to help developers and creators build, manage, and showcase their portfolios while tracking their professional growth. The platform provides tools to organize projects, highlight skills, and analyze personal development over time.

Overview

GrowFolio helps users maintain a structured digital portfolio and monitor their progress in learning and project development. Unlike traditional portfolio websites, GrowFolio integrates project tracking and analytics so users can visualize their growth.

The platform is designed with a scalable backend architecture and a modern frontend interface, making it suitable for developers who want both portfolio management and productivity tracking in a single system.

Key Features
Portfolio Management

Users can create and manage a professional portfolio including:

Personal profile

Skills

Projects

Achievements

Project Tracking

Users can track their development progress by:

Adding projects

Updating project status

Documenting project descriptions and technologies used

Analytics Dashboard

Provides insights into:

Number of projects created

Skill growth over time

Development activity

Authentication System

Secure login and user authentication system that ensures:

Authorized access

User-specific data management

Scalable Backend

Designed with modular APIs and database structure to support future SaaS features such as:

Public portfolio pages

Collaboration features

Analytics expansion

Tech Stack
Frontend

React.js

JavaScript

HTML5

CSS3

Backend

Django

Django REST Framework

Database

PostgreSQL

Authentication

Token-based authentication

System Architecture

GrowFolio follows a modern full-stack architecture:

React Frontend
       │
       │ REST API
       ▼
Django Backend (DRF)
       │
       ▼
PostgreSQL Database

The React frontend handles the user interface.

The Django backend manages business logic and API endpoints.

PostgreSQL stores structured user and project data.

Installation Guide
1. Clone the Repository
git clone https://github.com/YOUR_GITHUB_USERNAME/growfolio.git
cd growfolio
2. Backend Setup

Navigate to the backend directory:

cd backend

Create virtual environment:

python -m venv venv

Activate environment:

Windows

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Run migrations:

python manage.py migrate

Start backend server:

python manage.py runserver
3. Frontend Setup

Navigate to frontend directory:

cd frontend

Install dependencies:

npm install

Start development server:

npm start
Folder Structure
growfolio
│
├── backend
│   ├── manage.py
│   ├── app
│   ├── config
│   └── requirements.txt
│
├── frontend
│   ├── src
│   ├── components
│   └── package.json
│
└── README.md
Future Improvements

Planned enhancements for GrowFolio include:

Public portfolio pages

Portfolio sharing links

Skill growth analytics

AI-based project recommendations

Collaboration tools

SaaS subscription features

Author

Yugeshwaran G

GitHub:
https://github.com/Yugeshwaran-gm

License

This project is open-source and available for learning and development purposes.