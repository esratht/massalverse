/* MASSALVERSE - SHADOW PROTOCOL v2.1 (Viral Share) */

const API_URL = "http://localhost:3000/api/shadow"; 

const questions = [
    "En son ne zaman 'hayır' demen gerekirken sustun?",
    "Kendine söylediğin en büyük yalan ne?",
    "Kimi kurban ediyorsun: Kendini mi, hayallerini mi?"
];

let answers = [];
let currentStep = 0;
let generatedBio = ""; // Biyografiyi burada tutacağız

const screens = {
    start: document.getElementById('start-screen'),
    question: document.getElementById('question-screen'),
    loading: document.getElementById('loading-screen'),
    result: document.getElementById('result-screen')
};

function startProtocol() {
    const randomID = "SUB_" + Math.floor(Math.random() * 8999 + 1000);
    document.getElementById('user-id').innerText = randomID;
    switchScreen('question');
    showQuestion();
}

function switchScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function showQuestion() {
    const qText = document.getElementById('question-text');
    qText.style.opacity = 0;
    
    setTimeout(() => {
        qText.innerText = questions[currentStep];
        qText.style.opacity = 1;
    }, 200);

    const input = document.getElementById('user-input');
    input.value = "";
    input.focus();
    
    let progress = ((currentStep) / questions.length) * 100;
    document.getElementById('progress').style.width = progress + "%";
}

function nextQuestion() {
    const input = document.getElementById('user-input');
    const val = input.value.trim();
    
    if (val === "") {
        input.placeholder = "KORKAKLIK ETME, YAZ!";
        input.classList.add('blink'); 
        setTimeout(() => input.classList.remove('blink'), 1000);
        return;
    }

    answers.push(val);
    currentStep++;

    if (currentStep < questions.length) {
        showQuestion();
    } else {
        finishProtocol();
    }
}

document.getElementById('user-input').addEventListener("keypress", function(event) {
    if (event.key === "Enter") nextQuestion();
});

function finishProtocol() {
    switchScreen('loading');
    setTimeout(() => {
        generateShadowBio();
    }, 1500);
}

// --- GÜNCELLENEN KISIM: AI BAĞLANTISI ---
async function generateShadowBio() {
    try {
        console.log("Sistem: Sunucuya bağlanılıyor...");

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers: answers })
        });

        if (!response.ok) throw new Error("Sunucu Hatası");

        const data = await response.json();
        
        // Biyografiyi değişkene kaydet (Paylaşım için)
        generatedBio = data.bio; 

        switchScreen('result');
        typeWriterEffect(generatedBio, 'shadow-bio-text');
        randomizeStats();

    } catch (error) {
        console.error("Hata:", error);
        switchScreen('result');
        document.getElementById('shadow-bio-text').innerHTML = 
            "<span style='color:red'>BAĞLANTI HATASI. GERÇEK ÇOK AĞIR GELDİ.</span>";
    }
}

// --- YENİ EKLENEN FONKSİYON: TWITTER PAYLAŞIMI ---
function shareOnTwitter() {
    if (!generatedBio) return;

    // Tweet Metni
    const tweetText = `Massalverse beni ifşa etti: \n\n"${generatedBio}"\n\nSenin gölgen ne? Yüzleşmeye cesaretin var mı? 👁️\n\n#Massalverse #ShadowProtocol #Yüzleşme`;
    
    // URL Oluşturma (Türkçe karakterleri düzeltmek için encode)
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    
    // Yeni pencerede aç
    window.open(twitterUrl, '_blank');
}

function typeWriterEffect(text, elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = "";
    let i = 0;
    const speed = 25; 

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

function randomizeStats() {
    const bars = document.querySelectorAll('.stat-bar div');
    bars.forEach(bar => {
        const randomWidth = Math.floor(Math.random() * 80) + 10;
        bar.style.width = "0%";
        setTimeout(() => {
            bar.style.transition = "width 1s ease";
            bar.style.width = randomWidth + "%";
        }, 500);
    });
}