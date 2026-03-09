const targetData = {
    "1": [{ text: "A" }, { text: "I" }, { text: "U" }, { text: "E" }, { text: "O" }],
    "2": [{ text: "BA" }, { text: "BI" }, { text: "BU" }],
    "3": [
        { text: "Bola", img: "images/bola.png" }, // Pastikan folder 'images' ada
        { text: "Buku", img: "images/buku.png" },
        { text: "Makan", img: "images/makan.png" }
    ],
    "4": [{ text: "Saya mau makan" }, { text: "Ibu pergi ke pasar" }],
    "5": [{ text: "Apa hobi kamu?" }]
};

let currentLevel = "1";
let currentIndex = 0;
let isProcessing = false;

const targetTextEl = document.getElementById('target-text');
const targetImgEl = document.getElementById('target-img');
const userSpeechEl = document.getElementById('user-speech');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const progressBar = document.getElementById('progress-bar');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'id-ID';

function changeLevel() {
    currentLevel = document.getElementById('level-select').value;
    currentIndex = 0;
    startBtn.disabled = false;
    startBtn.style.opacity = "1";
    startBtn.innerText = "🎤 Mulai Bicara";
    updateDisplay();
}

function updateDisplay() {
    const data = targetData[currentLevel][currentIndex];
    targetTextEl.innerText = data.text;
    
    // Logika Flashcard (Gambar)
    if (data.img) {
        targetImgEl.src = data.img;
        targetImgEl.style.display = "block";
    } else {
        targetImgEl.style.display = "none";
    }

    // Update progress bar sederhana
    let progress = (currentIndex / targetData[currentLevel].length) * 100;
    progressBar.style.width = progress + "%";
}

startBtn.onclick = () => {
    if (isProcessing) return;
    try {
        recognition.start();
        startBtn.innerText = "Listening...";
        startBtn.style.background = "#e74c3c";
    } catch (e) { console.log(e); }
};

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase().trim().replace(/\.$/, "");
    const target = targetData[currentLevel][currentIndex].text.toLowerCase();
    
    userSpeechEl.innerText = transcript;
    isProcessing = true;

    if (transcript === target || transcript.includes(target)) {
        scoreEl.innerText = "100";
        scoreEl.style.color = "#27ae60";
        setTimeout(() => {
            isProcessing = false;
            nextQuestion();
        }, 1200);
    } else {
        scoreEl.innerText = "0";
        scoreEl.style.color = "#e74c3c";
        isProcessing = false;
        startBtn.innerText = "🎤 Coba Lagi";
        startBtn.style.background = "#f39c12";
        recognition.stop();
    }
};

function nextQuestion() {
    currentIndex++;
    if (currentIndex < targetData[currentLevel].length) {
        updateDisplay();
        startBtn.innerText = "🎤 Mulai Bicara";
        startBtn.style.background = "#27ae60";
    } else {
        targetTextEl.innerText = "🎉 SELESAI!";
        targetImgEl.style.display = "none";
        progressBar.style.width = "100%";
        startBtn.disabled = true;
        startBtn.innerText = "Level Selesai";
        startBtn.style.background = "#bdc3c7";
    }
}
