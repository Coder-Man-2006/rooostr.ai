# rooostr.ai

## Overview
**rooostr.ai** is revolutionizing real estate investment by leveraging cutting-edge AI technology to streamline and enhance the property selection process. Our platform meticulously analyzes a diverse range of data sources — including financial reports, zoning laws, news articles, property listings, and even deeply buried emails — to uncover the most lucrative land and property investment opportunities, both on and off the market.

### Key Features
- **Data-Driven Insights**: Analyze financial reports, zoning laws, and more.
- **Advanced Filtering**: Use 36+ detailed filters to customize searches.
- **AI-Powered**: Uncover hidden investment opportunities using powerful AI algorithms.
- **Tailored to Investors**: Designed specifically for real estate investors and land developers.

Whether you're a seasoned investor or a development company seeking your next big opportunity, Rooostr.ai provides the insights and tools you need to make informed, profitable decisions in an increasingly complex market.

---

## Tech Stack

**rooostr.ai** is built using the FERN stack:
- **Firebase**: For backend services and authentication.
- **ExpressJS**: As the server-side framework.
- **ReactJS** (with Vite): For the frontend UI.
- **NodeJS**: For handling the server-side logic.
- **TypeScript**: Used throughout the project for type safety and code reliability.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or above)
- [npm](https://www.npmjs.com/) (or yarn, if you prefer)
- [Firebase CLI](https://firebase.google.com/docs/cli)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/rooostr.ai.git
    cd rooostr.ai
    ```

2. **Install dependencies** for both frontend and backend:
    ```bash
    # In /frontend directory
    cd frontend
    npm install
    
    # In /backend directory
    cd ../backend
    npm install
    ```

---

## Running Locally

To run the application locally, open **two terminal windows**:

1. **Backend**:
    Navigate to the `/backend` directory and start the server:
    ```bash
    cd backend
    npm run dev
    ```

2. **Frontend**:
    In a separate terminal, navigate to the `/frontend` directory and start the frontend:
    ```bash
    cd frontend
    npm run dev
    ```

Now open the link provided by Vite in the frontend terminal (usually [http://localhost:3000](http://localhost:3000)) to view the application.

---

## Firebase Setup

1. **Login to Firebase**:
    ```bash
    firebase login
    ```

2. **Initialize Firebase** (if not already set up):
    ```bash
    firebase init
    ```

3. Set up Firebase services required for authentication, Firestore, etc. Follow the on-screen instructions to complete setup.

---

## Project Structure

