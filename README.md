# 🟩 Wordle Web Clone

A fully functional, web-based clone of the popular game **Wordle**, featuring a global leaderboard and a speed-run timer.

### 🔗 **Play the Live Game:** [https://wordle-web-d8405.firebaseapp.com/](https://wordle-web-d8405.firebaseapp.com/)

---

## 🚀 Features

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
| `words.txt` | The list of potential **answers** (Target words). |
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

This project is configured for Firebase project `wordle-web-d8405`.

To deploy your own updates:
1.  Install Firebase CLI: `npm install -g firebase-tools`
2.  Login: `firebase login`
3.  Deploy:
    ```bash
    firebase deploy
    ```
