# Hiker Matching App
Full-stack web application that designed to connect hiking enthusiasts based on their location, profile and preferences.
Built with React, Spring Boot, WebSockets, and PostgreSQL, it supports rapid testing with 100+ seed users and is fully containerized with Docker.

## 🌟 Core Features

**🔒 JWT-Based Authentication:** Secure signup and login using JSON Web Tokens. Passwords are hashed with BCrypt to ensure user credential safety.

**👤 Profile Management:** User can create and update rich hiking profiles, including experience level, pace, regions, languages, and hike types.

**🤝 Recommendation Engine:** Suggests potential hiking partners using a scoring algorithm that compares user attributes and preferences for optimal matching.

**🔗 Connection Management:** A full connection lifecycle system allows users to send, accept, decline, and disconnect from other hikers.

**💬 Real-time chat:** Built with WebSocket (STOMP) and includes:
- Persistent chat history
- Typing indicators
- Unread message notifications

**🔐 Access Control:** Ensure users can only view profiles they are authorized to (e.g., connected users, pending requests, or matches from the recommendation engine)

**🧪 Data Seeding Support:** Can be started in a special seed mode to load 100+ realistic test profiles, with consistent results.

---

## 🛠️ Tech Stack

- **Frontend**: React + Ant Design
- **Backend**: Java + Spring Boot
- **Security**: Spring Security
- **Database**: Spring Data JPA / Hibernate with PostgreSQL
- **Real-Time**: Spring WebSockets with STOMP & SockJS
- **Authentication**: JSON Web Tokens (JWT)
- **Build Tool**: Apache Maven
- **Data Seeding**: Spring @Profile(seed-data) + Java Faker
- **Deployment**: Docker
- **API Documentation**: OpenAPI 3.0 (Swagger UI)

---

## 📂 Project Structure

```
├── src/                 # Backend source code (Java/Spring Boot)
├── frontend/            # Frontend source code (React)
├── data/                # Database data directory
├── docker-compose.yml   # Docker composition for database
├── pom.xml              # Maven build configuration
├── setup.sh             # Helper script for environment setup
└── .env.example         # Example environment variables
```

---

## 👩🏽‍💻 Setup Instructions

### 📦 Prerequisites

- ✅ Java 17+
- ✅ Maven 3.8+
- ✅ Docker & Docker Compose (required for PostgreSQL)
- ✅ Node.js & Yarn (for frontend development)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd repository
```

### Step 2: Configure the JWT Secret
A secure, random secret is required to sign the JSON Web Tokens.

1. Run the helper script:
   ```bash
   ./setup.sh
   ```
2. Edit the newly created `.env` and replace the placeholder value with a real long secret (32+ characters).
3. Run `./setup.sh` again to export the real values.

### Step 3: Start the Database with Docker
```bash
docker compose up -d
```
We use Docker to provide a consistent, pre-configured PostgreSQL service.

### Step 4: Build and Run the Backend

1. Build the application with Maven:
   ```bash
   mvn clean install
   ```
2. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The backend server will start on http://localhost:8080.

### Step 5: Run the Frontend

```bash
cd frontend
npm install
npm start
```
The frontend will be available at http://localhost:3000.

### 🧪 Optional: Load 100+ Fake Users for Testing

You can customize the number of users in `application-seed-data.properties`:
```properties
seed.count=100   # Change the value as you like, default number is 100
```

1. Run in seed mode:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=seed-data
   ```

   After the console shows that the seeding process is complete, stop the application (Ctrl+C).

2. Re-run the app in normal mode:
   ```bash
   mvn spring-boot:run
   ```

Once fake users are seeded, they're in the shared database, and new users can get matched with them.

---

## 🧠 How Matching Works

We calculate a compatibility score for every potential hiking partner.

### 1. The Candidate Pool
First, we filter the list of all users to create a valid candidate pool by excluding:
- Users you are already **connected** with.
- Users you have explicitly **dismissed**.
- Users with **pending connection requests** (sent or received).
- Users outside your **Preferred Region** (if specified).

### 2. The Scoring Algorithm
We calculate a match score for each candidate based on:

| Criterion | Type | Exact Match | No Preference | Partial Match |
| :--- | :--- | :---: | :---: | :--- |
| **Experience Level** | Single Choice | +20 pts | +10 pts | n/a |
| **Hiking Pace** | Single Choice | +20 pts | +10 pts | n/a |
| **Hike Types** | Multi-Choice | n/a | +5 pts | +10 pts (per shared) |
| **Languages** | Multi-Choice | n/a | +5 pts | +10 pts (per shared) |

### 3. The Result
- Candidates with a score **> 20** are considered valid matches.
- The top 10 highest-scoring profiles are presented in your Recommendations feed.

---

## 📚 Helpful Information

- **API Documentation:**  
  Once the backend is running, access interactive API docs via Swagger UI:   
  👉 http://localhost:8080/swagger-ui/index.html

- **Seeded User Credentials:**   
  To log in as one of the fake users for testing:
  - **Email**: `seed.user.{number}@email.test`   
    ( Replace `{number}` with any number from 0 to `seed.count` - 1 )
  - **Password**: `Password123!`
