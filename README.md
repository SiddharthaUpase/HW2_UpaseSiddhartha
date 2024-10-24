Assignment 2 - README
Overview
This document provides instructions on how to run Assignment 2. The project is developed using React for the frontend and Flask for the backend. The backend uses SQLite for local database management and is connected to a MongoDB account for remote data handling.

Tech Stack
Frontend: React
Backend: Flask
Database: SQLite (local) & MongoDB (remote)
Getting Started
To run the project locally, follow the steps below after unzipping the provided project files.

Prerequisites
Ensure that the following software is installed on your machine:

Python (v3.6 or higher)
Node.js (v14 or higher)
npm (comes with Node.js)
Flask (Python Flask library)
SQLite (Comes pre-installed with Python)
Setup Instructions
Unzip the Project Files

Unzip the downloaded project folder to a preferred location on your machine.
Set Up Backend (Flask)

Navigate to the unzipped project folder and then to the backend directory.

Run the Flask server with the following command:

bash
Copy code
python servercode.py
This will:

Start the Flask server.
Create a local SQLite database (productdb.sqlite) to store and fetch data.
Set Up Frontend (React)

In a new terminal window, navigate to the frontend directory within the unzipped project folder.

Install necessary dependencies and start the React development server:

bash
Copy code
npm install
npm start
This will:

Install all required frontend packages.
Start the React application, accessible at http://localhost:3000.
Backend and Database Configuration
The Flask backend is integrated with a remote MongoDB account for managing product data.
Locally, a SQLite database (productdb.sqlite) is automatically created by the Flask server to store and retrieve the necessary data.
Running the Application
Ensure the Flask backend is running:

bash
Copy code
python servercode.py
Ensure the React frontend is running:

bash
Copy code
npm start
Open your browser and navigate to:

arduino
Copy code
http://localhost:3000
This will display the React frontend connected to the Flask backend.

Additional Notes
Database: The backend creates an SQLite database (productdb.sqlite) locally. For remote storage, the backend connects to a MongoDB instance.
