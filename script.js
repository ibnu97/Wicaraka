const targetData = {
    "1": [{ text: "A" }, { text: "I" }, { text: "U" }, { text: "E" }, { text: "O" }],
    "2": [{ text: "BA" }, { text: "BI" }, { text: "BU" }],
    "3": [
        { text: "Bola", img: "images/bola.png" },
        { text: "Buku", img: "images/buku.png" },
        { text: "Makan", img: "images/makan.png" }
    ],
    "4": [{ text: "Saya mau makan" }, { text: "Ibu pergi ke pasar" }],
    "5": [{ text: "Apa hobi kamu?" }]
};

let currentLevel = "1";
let currentIndex = 0;
let isProcessing = false;

// Inisialisasi Elemen
const targetTextEl = document.getElementById('target-text');
const targetImgEl = document.getElementById('target-img');
const userSpeechEl = document.getElementById('user-speech');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const progressBar = document.getElementById('progress-bar');
const playBtn = document.getElementById('play-audio-btn');

// Inisialisasi Pengenalan Suara
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'id-ID';

// Fungsi Update Tampilan (Hanya Satu Versi)
function updateDisplay() {
    const data = targetData[currentLevel][currentIndex];
    
    // Update Teks dan Gambar
    targetTextEl.innerText = data.text;
    
    // Reset Label Hasil
    userSpeechEl.innerText = "-";
    scoreEl.innerText = "0";
    scoreEl.style.color = "#1c1c1e";

    if (data.img) {
        targetImgEl.src = data.img;
        targetImgEl.style.display = "block";
    } else {
        targetImgEl.style.display = "none";
    }

    // Update Progress Bar
    let progress = (currentIndex / targetData[currentLevel].length) * 100;
    progressBar.style.width = progress + "%";

    // OTOMATIS: Berikan contoh suara tiap kali ganti kata
    setTimeout(() => {
        if (playBtn) playBtn.click();
    }, 500);
}

// Logika Tombol Contoh Suara (Hanya Satu Versi)
if (playBtn) {
    playBtn.onclick = () => {
        window.speechSynthesis.cancel(); // Hentikan suara sebelumnya
        const textToSpeak = targetTextEl.innerText;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'id-ID';
        utterance.pitch = 1.2;
        utterance.rate = 0.7;
        window.speechSynthesis.speak(utterance);
    };
}

// Ganti Level
function changeLevel() {
    currentLevel = document.getElementById('level-select').value;
    currentIndex = 0;
    startBtn.disabled = false;
    startBtn.style.opacity = "1";
    startBtn.innerText = "🎤 Mulai Bicara";
    updateDisplay();
}

// Klik Tombol Mulai
startBtn.onclick = () => {
    if (isProcessing) return;
    try {
        recognition.start();
        startBtn.innerText = "Listening...";
        startBtn.style.background = "#e74c3c";
    } catch (e) { console.log("Recognition error:", e); }
};

// Hasil Suara
recognition.onresult = (event) => {
    // 1. Ambil hasil ucapan dan bersihkan dari titik/spasi di ujung
    const transcript = event.results[0][0].transcript.toLowerCase().trim().replace(/\.$/, "");
    
    // 2. Ambil target huruf (misal: "a")
    const target = targetData[currentLevel][currentIndex].text.toLowerCase();
    
    userSpeechEl.innerText = transcript;
    isProcessing = true;

    // 3. LOGIKA BARU: Cek apakah transkrip mengandung target
    // Jadi kalau user bilang "aaa" atau "a a a", selama ada huruf "a", tetap lolos.
    if (transcript.includes(target)) { 
        scoreEl.innerText = "100";
        scoreEl.style.color = "#27ae60";
        
        // Tambahkan efek suara sukses (opsional)
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

// Fungsi Modul (Navigation)
function openModul(type) {
    if(type === 'pemanasan') {
        alert("Membuka Modul Pemanasan: Lakukan gerakan mulut memutar selama 10 detik.");
    } else if(type === 'artikulasi') {
        alert("Membuka Modul Artikulasi Dasar: Fokus pada bunyi huruf vokal.");
    } else if(type === 'kosakata') {
        alert("Membuka Modul Kosakata: Belajar nama-nama benda di sekitar.");
    }
}

// Panggil pertama kali saat halaman load
updateDisplay();
