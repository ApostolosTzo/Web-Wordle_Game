import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- FIREBASE CONFIG ---
const firebaseConfig = {
    apiKey: "AIzaSyBMa-KsNVACyoIzhBqLRgwpRgVspi5Qo5g",
    authDomain: "wordle-web-d8405.firebaseapp.com",
    projectId: "wordle-web-d8405",
    storageBucket: "wordle-web-d8405.firebasestorage.app",
    messagingSenderId: "644713669574",
    appId: "1:644713669574:web:80b52c992d4fe0c5f888c7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- VARIABLES ---
const ATTEMPTS = 6;
let currentAttempt = 0;
let targetWord = "";
let startTime = 0;
let gameOver = false;
let playerName = "Anonymous";

let answerList = [];
let validGuessList = [];

// --- DOM ELEMENTS ---
const screenMenu = document.getElementById("screen-menu");
const screenName = document.getElementById("screen-name");
const screenGame = document.getElementById("screen-game");
const screenLeaderboard = document.getElementById("screen-leaderboard");

const nameInput = document.getElementById("player-name-input");
const guessInput = document.getElementById("guess-input");
const messageEl = document.getElementById("message");
const timerEl = document.getElementById("timer");
const playerDisplay = document.getElementById("player-display");
const board = document.getElementById("game-board");
const keyboardContainer = document.getElementById("keyboard-container"); // Ensure this exists in index.html!

// --- NAVIGATION ---
function showScreen(screenId) {
    [screenMenu, screenName, screenGame, screenLeaderboard].forEach(s => s.classList.add("hidden"));
    document.getElementById(screenId).classList.remove("hidden");
}

document.getElementById("btn-start").addEventListener("click", () => {
    showScreen("screen-name");
    nameInput.value = "";
    nameInput.focus();
});

document.getElementById("btn-leaderboard").addEventListener("click", () => {
    showScreen("screen-leaderboard");
    loadLeaderboard();
});

document.getElementById("btn-exit").addEventListener("click", () => {
    alert("Goodbye! (Close the tab to exit)");
    location.reload();
});

document.getElementById("btn-name-back").addEventListener("click", () => showScreen("screen-menu"));
document.getElementById("btn-game-back").addEventListener("click", () => showScreen("screen-menu"));
document.getElementById("btn-lb-back").addEventListener("click", () => showScreen("screen-menu"));

// Enter Key Logic
document.getElementById("btn-join").addEventListener("click", () => startGame());
nameInput.addEventListener("keydown", (e) => { if (e.key === "Enter") startGame(); });

document.getElementById("guess-btn").addEventListener("click", handleGuess);
guessInput.addEventListener("keydown", (e) => { if (e.key === "Enter") handleGuess(); });


// --- DATA LOADING ---
async function fetchWordLists() {
    try {
        const [answersResponse, guessesResponse] = await Promise.all([
            fetch('./words.txt'),
            fetch('./All_the_Words.txt')
        ]);

        if (!answersResponse.ok || !guessesResponse.ok) {
            throw new Error(`Files not found - answers: ${answersResponse.ok}, guesses: ${guessesResponse.ok}`);
        }

        const answersText = await answersResponse.text();
        const guessesText = await guessesResponse.text();

        answerList = answersText.split('\n').map(w => w.trim().toLowerCase()).filter(w => w && w.length === 5);
        validGuessList = guessesText.split('\n').map(w => w.trim().toLowerCase()).filter(w => w && w.length === 5);

        console.log(`Loaded ${answerList.length} answer words and ${validGuessList.length} valid guess words.`);

        if (answerList.length === 0 || validGuessList.length === 0) {
            throw new Error("No valid words found");
        }
    } catch (error) {
        console.error("Error loading word lists:", error);
        alert("Error loading word lists. Make sure words.txt and All_the_Words.txt exist in the same directory.");
    }
}

// --- KEYBOARD LOGIC ---
const keysLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

function initKeyboard() {
    if (!keyboardContainer) {
        console.error("Keyboard container not found! Did you update index.html?");
        return;
    }

    keyboardContainer.innerHTML = "";

    keysLayout.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "keyboard-row";

        row.forEach(char => {
            const btn = document.createElement("button");
            btn.textContent = char;
            btn.className = "key-btn";
            btn.id = `key-${char}`;

            btn.addEventListener("click", () => {
                if (!gameOver && guessInput.value.length < 5) {
                    guessInput.value += char;
                    guessInput.focus();
                }
            });

            rowDiv.appendChild(btn);
        });
        keyboardContainer.appendChild(rowDiv);
    });
}

function updateKeyboardColors(guess, feedback) {
    for (let i = 0; i < 5; i++) {
        const char = guess[i].toUpperCase();
        const color = feedback[i];
        const keyBtn = document.getElementById(`key-${char}`);

        if (keyBtn) {
            const currentColor = keyBtn.classList.contains("correct") ? "correct" :
                keyBtn.classList.contains("present") ? "present" :
                    keyBtn.classList.contains("absent") ? "absent" : "";

            if (color === "correct") {
                keyBtn.className = `key-btn correct`;
            } else if (color === "present" && currentColor !== "correct") {
                keyBtn.className = `key-btn present`;
            } else if (color === "absent" && currentColor === "") {
                keyBtn.className = `key-btn absent`;
            }
        }
    }
}


// --- GAME LOGIC ---
function startGame() {
    if (answerList.length === 0) {
        alert("Still loading dictionary...");
        return;
    }

    playerName = nameInput.value.trim() || "Anonymous";
    targetWord = answerList[Math.floor(Math.random() * answerList.length)];

    currentAttempt = 0;
    gameOver = false;
    guessInput.value = "";
    guessInput.disabled = false;
    messageEl.textContent = "";
    board.innerHTML = "";

    initKeyboard();

    for (let i = 0; i < ATTEMPTS * 5; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.id = `tile-${i}`;
        board.appendChild(tile);
    }

    updatePlayerInfo();
    showScreen("screen-game");
    guessInput.focus();

    startTime = performance.now();
}

function updatePlayerInfo() {
    playerDisplay.textContent = `Player: ${playerName}   Attempts: ${currentAttempt + 1}/${ATTEMPTS}`;
}

async function handleGuess() {
    if (gameOver) return;

    const guess = guessInput.value.toLowerCase().trim();

    if (guess.length !== 5) {
        messageEl.textContent = "Please enter exactly 5 letters.";
        return;
    }

    if (!validGuessList.includes(guess) && !answerList.includes(guess)) {
        messageEl.textContent = "Word not in list.";
        return;
    }

    messageEl.textContent = "";

    const feedback = getFeedback(guess, targetWord);
    renderFeedback(guess, feedback, currentAttempt);
    updateKeyboardColors(guess, feedback);

    if (guess === targetWord) {
        endGame(true);
    } else {
        currentAttempt++;
        if (currentAttempt >= ATTEMPTS) {
            endGame(false);
        } else {
            updatePlayerInfo();
        }
    }
    guessInput.value = "";
}

function getFeedback(guess, target) {
    let feedback = new Array(5).fill("absent");
    let targetChars = target.split("");

    for (let i = 0; i < 5; i++) {
        if (guess[i] === target[i]) {
            feedback[i] = "correct";
            targetChars[i] = null;
        }
    }
    for (let i = 0; i < 5; i++) {
        if (feedback[i] === "correct") continue;
        const index = targetChars.indexOf(guess[i]);
        if (index !== -1) {
            feedback[i] = "present";
            targetChars[index] = null;
        }
    }
    return feedback;
}

function renderFeedback(guess, feedback, row) {
    const startIdx = row * 5;
    for (let i = 0; i < 5; i++) {
        const tile = document.getElementById(`tile-${startIdx + i}`);
        tile.textContent = guess[i];
        tile.className = `tile ${feedback[i]}`;
    }
}

async function endGame(won) {
    gameOver = true;
    guessInput.disabled = true;
    const elapsed = (performance.now() - startTime) / 1000;

    if (won) {
        messageEl.textContent = `Correct! Time: ${elapsed.toFixed(2)}s`;
        messageEl.style.color = "green";
        await saveScore(playerName, elapsed);
        setTimeout(() => {
            alert(`Correct! \nYour Time: ${elapsed.toFixed(2)}s`);
            showScreen("screen-menu");
        }, 1000);
    } else {
        messageEl.textContent = `Out of tries! Word: ${targetWord.toUpperCase()}`;
        messageEl.style.color = "red";
        setTimeout(() => {
            alert(`Out of tries!\nThe word was: ${targetWord.toUpperCase()}`);
            showScreen("screen-menu");
        }, 2000);
    }
}

async function saveScore(name, timeVal) {
    try {
        await addDoc(collection(db, "placemate"), {
            name: name,
            time: parseFloat(timeVal),
            date: new Date().toISOString()
        });
    } catch (e) {
        console.error("Error saving score: ", e);
    }
}

async function loadLeaderboard() {
    const tbody = document.getElementById("leaderboard-body");
    tbody.innerHTML = "<tr><td colspan='3'>Loading from Firebase...</td></tr>";

    // Grouping by date
    const q = query(collection(db, "placemate"), orderBy("date", "desc"));
    try {
        const querySnapshot = await getDocs(q);
        tbody.innerHTML = "";
        if (querySnapshot.empty) {
            tbody.innerHTML = "<tr><td colspan='3'>No records yet.</td></tr>";
            return;
        }
        
        // Group entries by date
        const groupedByDate = {};
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            let dateStr = "-";
            if (data.date) dateStr = data.date.split('T')[0];
            if (!groupedByDate[dateStr]) {
                groupedByDate[dateStr] = [];
            }
            groupedByDate[dateStr].push(data);
        });
        
        // Sort entries within each date by time
        for (const date in groupedByDate) {
            groupedByDate[date].sort((a, b) => a.time - b.time);
        }
        
        // Render grouped leaderboard
        for (const date in groupedByDate) {
            // Date header row
            tbody.innerHTML += `<tr class="date-header"><td colspan='3'><strong>${date}</strong></td></tr>`;
            
            // Entries for this date
            let rank = 1;
            groupedByDate[date].forEach((data) => {
                const row = `<tr>
                    <td>${rank++}</td>
                    <td>${data.name}</td>
                    <td>${data.time.toFixed(2)}</td>
                </tr>`;
                tbody.innerHTML += row;
            });
        }
    } catch (e) {
        console.error("Error loading leaderboard:", e);
        tbody.innerHTML = "<tr><td colspan='3'>Error loading data.</td></tr>";
    }
}

fetchWordLists();