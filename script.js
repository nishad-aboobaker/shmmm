// EmailJS Configuration
// IMPORTANT: Replace these with your actual EmailJS credentials
const EMAILJS_PUBLIC_KEY = 'SWC2-g6JKYPKan4z-'; // Get from https://dashboard.emailjs.com/admin/account
const EMAILJS_SERVICE_ID = 'service_u745apb'; // Get from https://dashboard.emailjs.com/admin
const EMAILJS_TEMPLATE_ID = 'template_8dtx1x9'; // Get from https://dashboard.emailjs.com/admin/templates

// Initialize EmailJS
(function () {
    emailjs.init(EMAILJS_PUBLIC_KEY);
})();

const questions = [
    {
        question: "entha paaad....😊",
        answers: [
            "Nalla Paad",
            "Not Good",
            "Enthum Paaadum",
            "Inganokke Pooovn"
        ]
    },
    {
        question: "hows Daddy Mummy Doooin",
        answers: [
            "Good",
            "Not Good",
            "So So",
            "Alhamdhulillha khair ❤️"
        ]
    },
    {
        question: "perelthe Paint Pani okke keynjaaa",
        answers: [
            "Illya",
            "Keynj",
            "korchoode nd"
        ]
    }
];

const reconsiderMessages = {
    stage: [
        "Ayy Angane Parayerdh",
        "Come on, reconsider! It'll be fun! 🥺",
        "Please? Pretty please? 🙏",
        "Onnooode Onn Aalooychookka",
        "Koreee Ayeeele Ingne Irikkn",
        "Cmmooon Yaaar😒",
        "Orappaano   😢",
        "Anakkavde Pani Onnullyallo   🚶",
        "Perelingane Verthe Irikkylle",
        "Sherikkm",
        "You're breaking my heart here! 😢",
        "You are Not Minding My Efforts 💔",
        "Andoru Deman Kaanumbo aaaaan",
        "Orappicho😏"
    ]

};

let currentQuestion = 0;
let noClickCount = 0;
let startTime;

function startQuiz() {
    startTime = Date.now();
    hideScreen('landing-screen');
    showScreen('question-screen');
    showQuestion();
}

function showQuestion() {
    const questionData = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('question-number').textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    document.getElementById('question-text').textContent = questionData.question;

    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';

    questionData.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.onclick = () => selectAnswer(index);
        answersContainer.appendChild(button);
    });
}

function selectAnswer(answerIndex) {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        setTimeout(() => {
            showQuestion();
        }, 300);
    } else {
        setTimeout(() => {
            hideScreen('question-screen');
            showScreen('final-screen');
        }, 300);
    }
}

function handleNo() {
    noClickCount++;

    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const reconsiderMsg = document.getElementById('reconsider-message');
    const content = document.querySelector('.content');

    let messages;

    if (noClickCount <= 3) {
        messages = reconsiderMessages.stage;
    } else if (noClickCount <= 6) {
        messages = reconsiderMessages.stage;
    } else if (noClickCount <= 10) {
        messages = reconsiderMessages.stage;
        content.style.borderColor = '#ffe4b5';
    } else {
        messages = reconsiderMessages.stage;
        content.style.borderColor = '#ffb3ba';
        content.style.animation = 'shake 0.5s';
        setTimeout(() => {
            content.style.animation = '';
        }, 500);
    }

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    reconsiderMsg.textContent = randomMessage;

    noBtn.classList.add('shrink');
    setTimeout(() => {
        noBtn.classList.remove('shrink');
    }, 500);

    const currentScale = 1 + (noClickCount * 0.02);
    yesBtn.style.transform = `scale(${currentScale})`;
    yesBtn.classList.add('grow');
    setTimeout(() => {
        yesBtn.classList.remove('grow');
    }, 500);

    if (noClickCount >= 3 && noClickCount < 7) {
        moveNoButton();
    }

    if (noClickCount >= 7) {
        makeNoButtonRun();
    }
}

function moveNoButton() {
    const noBtn = document.getElementById('no-btn');

    const maxX = 100;
    const maxY = 50;

    const randomX = (Math.random() - 0.5) * maxX;
    const randomY = (Math.random() - 0.5) * maxY;

    noBtn.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.85)`;

    setTimeout(() => {
        if (noClickCount < 7) {
            noBtn.style.transform = '';
        }
    }, 1000);
}

function makeNoButtonRun() {
    const noBtn = document.getElementById('no-btn');

    const runAway = (e) => {
        if (e) e.preventDefault();
        const maxX = window.innerWidth - 200;
        const maxY = window.innerHeight - 100;

        const randomX = Math.max(50, Math.random() * maxX);
        const randomY = Math.max(50, Math.random() * maxY);

        noBtn.style.position = 'fixed';
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';
        noBtn.style.transition = 'all 0.3s ease';
    };

    noBtn.addEventListener('mouseenter', runAway);
    noBtn.addEventListener('touchstart', runAway);
}

function handleYes() {
    const endTime = Date.now();
    const totalTime = Math.floor((endTime - startTime) / 1000);

    // Send email notification
    sendEmailNotification(totalTime);

    hideScreen('final-screen');
    showScreen('success-screen');
    showAchievements(totalTime);
    launchConfetti();
}

function sendEmailNotification(totalTime) {
    const templateParams = {
        to_email: 'nishuanshad@gmail.com', // ← Replace with YOUR email
        subject: '🎉 SHE SAID YES! Sunday Plans Confirmed!',
        total_time: totalTime,
        no_clicks: noClickCount,
        timestamp: new Date().toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function (response) {
            console.log('✅ Email sent successfully!', response.status, response.text);
        }, function (error) {
            console.log('❌ Email failed to send:', error);
        });
}

function showAchievements(totalTime) {
    const achievements = [];

    if (totalTime < 30) {
        achievements.push("Appo Sheri");
    }

    if (noClickCount === 0) {
        achievements.push("💖 Allenkilum Ink Ariyaayirn Ijj Verm nnn");
    } else if (noClickCount >= 10) {
        achievements.push("😤 Enthina Ithrekk Demand");
    } else if (noClickCount >= 5) {
        achievements.push("🤔 Nerthe Thanne Sammeychoode");
    }

    if (achievements.length > 0) {
        const achievementText = document.createElement('div');
        achievementText.className = 'achievements';
        achievementText.innerHTML =
            achievements.map(a => `<p>${a}</p>`).join('');
        document.querySelector('#success-screen .content').appendChild(achievementText);
    }
}

function hideScreen(screenId) {
    const screen = document.getElementById(screenId);
    screen.classList.remove('active');
}

function showScreen(screenId) {
    const screen = document.getElementById(screenId);
    screen.classList.add('active');
}

function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const confettiCount = 150;
    const colors = ['#a8d5e2', '#ffd4e5', '#b4a7d6', '#c8e6c9', '#ffe4b5', '#ffb3ba'];

    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 10 + 5;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > canvas.height) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    for (let i = 0; i < confettiCount; i++) {
        confettiPieces.push(new Confetti());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confettiPieces.forEach(confetti => {
            confetti.update();
            confetti.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 10000);
}

window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
