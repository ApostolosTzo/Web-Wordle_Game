# 🟩 Wordle Web Clone

A fully functional, web-based clone of the popular game **Wordle**, featuring a global leaderboard and a speed-run timer.


---


## 📖 Overview

**Wordle Web** is a competitive spin on the classic daily word game. It features a real-time stopwatch and a persistent **Firebase Leaderboard** to track the fastest solve times.

The game validates guesses against a dictionary of over 12,000 words to ensure gameplay accuracy, while keeping target words accessible.

👉 [**Click here to play the live game**](https://wordle-web-d8405.firebaseapp.com/)

---
* [**Features**](#-Features) - *The synopsis of the project.*
* [**Tech Stack**](#-Tech-Stack) - *Leaderboard, Mechanics.*
* [**Project Structure**](#-Project-Structure)   - *Project Structure.* 
* [**How to Run Locally**](#-How-to-Run-Locally) - *Run locally in firebase the game.*
* [**Leaderboard Logic**](#-Leaderboard-Logic) - *Leaderboard logic in game.*
* [**Firebase Configuration**](#-Firebase-Configuration) - *Commands to run the game with firebase.*
---

## 🚀 Features

* **Dual Difficulty Modes:**
    * **Easy Mode:** 6 attempts.The solution is always a concrete, high-frequency noun (e.g., `APPLE`, `HOUSE`, `BEACH`).
    * **Medium Mode:** 4 attempts.The solution is often an abstract concept, adjective, or functional grammar word (e.g., `ABOUT`, `THINK`, `WOULD`).
* **Global Leaderboard:** Uses **Firebase Firestore** to track the fastest solve times worldwide.
* **Speed Timer:** Tracks exactly how long it takes you to solve the puzzle.
* **Dual Dictionary System:**
    * **Target Words:** Randomly selects answers from a curated list (`words.txt`).
    * **Valid Guesses:** Validates inputs against a massive dictionary of over 12,000 words (`All_the_Words.txt`) to ensure real words are used.
* **Visual Feedback:**
    * 🟩 **Green:** Correct letter, correct spot.
    * 🟨 **Yellow:** Correct letter, wrong spot.
    * ⬜ **Gray:** Letter not in the word.
* **Virtual Keyboard:** Updates key colors dynamically based on your guesses.

---

## 🏆 Leaderboard System

The leaderboard logic is custom-built to highlight the fastest daily solvers.

### Database Collections
Scores are separated into two Firestore collections to maintain distinct rankings for each difficulty:
* `placemate_easy`: Stores scores for Easy Mode (6 attempts).
* `placemate_medium`: Stores scores for Medium Mode (4 attempts).

### Data Structure
Each score entry documents the player's performance with the following fields:
* `name`: Player identifier (defaults to "Anonymous").
* `time`: Float value representing seconds elapsed.
* `mode`: The game difficulty ("easy" or "medium").
* `date`: ISO timestamp of completion.

### Ranking Algorithm
The application uses a client-side grouping strategy to display the leaderboard:
1.  **Query:** Fetches records from the selected mode's collection, ordered by `date` (descending).
2.  **Group:** Iterates through the results and groups players by the specific calendar date (YYYY-MM-DD).
3.  **Sort:** Within each date group, players are sorted by `time` (ascending).
4.  **Rank:** The player with the lowest time in that specific day is assigned Rank #1.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules).
* **Backend & Database:** Firebase Firestore.
* **Hosting:** Firebase Hosting.

---

## 📂 Project Structure

| File | Description |
| :--- | :--- |
| `index.html` | The main entry point containing the Game, Menu, and Leaderboard screens. |
| `script.js` | Handles game logic, DOM manipulation, and Firebase Firestore connections. |
| `style.css` | Custom styling for the grid, keyboard, and responsive layout. |
| `Easy_mode.txt` | Target word list for Easy mode (Concrete Nouns). |
| `Medium_mode.txt` | Target word list for Medium mode (Abstract/Grammar). |
| `All_the_Words.txt` | A large dictionary used to validate if a guess is a real English word. |
| `firebase.json` | Configuration settings for Firebase Hosting. |

---

## 💻 How to Run Locally

Because this project uses JavaScript Modules (`import` statements) and fetches external text files, you cannot simply open `index.html` in a browser. You must use a local server.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/wordle-web.git](https://github.com/yourusername/wordle-web.git)
    cd wordle-web
    ```

2.  **Start a Local Server:**
    * **Using Python:**
        ```bash
        python -m http.server 8000
        ```
    * **Using Node (http-server):**
        ```bash
        npx http-server .
        ```

3.  **Open in Browser:**
    Go to `http://localhost:8000`

---

## 🏆 Leaderboard Logic

The game connects to a Firestore collection named `placemate`.
1.  When a player wins, their **Name**, **Time**, and **Date** are saved to the database.
2.  The Leaderboard screen queries the database, sorts by time (ascending), and limits the view to the top 10 fastest players.

---

## 🔥 Firebase Configuration

This project is pre-configured to use Firebase Firestore for the leaderboard and Firebase Hosting.

### Database Logic
The game connects to a Firestore database with two specific collections:
* `placemate_easy`: Stores scores for Easy Mode.
* `placemate_medium`: Stores scores for Medium Mode.

### Hosting
The project includes `firebase.json` and `.firebaserc` for easy deployment.

To deploy to your own Firebase Hosting instance:
1.  Install Firebase CLI: `npm install -g firebase-tools`
2.  Login: `firebase login`
3.  Initialize (if needed): `firebase init`
4.  Deploy:
    ```bash
    firebase deploy
    ```
---

## 🛠 Technologies Used

* **Frontend:** HTML5, CSS3, JavaScript (ES6 Modules)
* **Backend:** Firebase Firestore (NoSQL Database)
* **Hosting:** Firebase Hosting
  
---

## 📝 Word Lists Credits

* **Easy Mode:** Curated list of physical objects and simple verbs.
* **Medium Mode:** Curated list of abstract concepts and grammar terms.
* **Validation:** Full English 5-letter word dictionary.
