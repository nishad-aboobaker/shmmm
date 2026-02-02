const questions = [
    {
        question: "If you were a vegetable, would you be a confused potato or an anxious carrot?",
        answers: [
            "Definitely a confused potato 🥔",
            "100% an anxious carrot 🥕",
            "Neither, I'd be a dramatic broccoli 🥦",
            "I refuse to be a vegetable"
        ]
    },
    {
        question: "On a scale of 1-10, how much do you believe pigeons are government drones?",
        answers: [
            "10 - They're DEFINITELY spying on us 🕊️",
            "5 - I'm suspicious but not convinced",
            "1 - That's ridiculous... right?",
            "11 - I have evidence!"
        ]
    },
    {
        question: "Would you rather fight 100 duck-sized horses or 1 horse-sized duck?",
        answers: [
            "100 duck-sized horses (bring it on!)",
            "1 horse-sized duck (one big battle)",
            "Can I befriend them instead?",
            "I choose to run away"
        ]
    },
    {
        question: "Is cereal a soup? (Your answer will be judged)",
        answers: [
            "Yes, and I will die on this hill 🥣",
            "Absolutely not, you monster",
            "Only if milk is a broth",
            "I've never thought about this and now I'm scared"
        ]
    },
    {
        question: "If you could only eat one food for the rest of your life, would you choose pizza or tacos?",
        answers: [
            "Pizza forever! 🍕",
            "Tacos all the way! 🌮",
            "Can I have both?",
            "Neither, I choose chaos"
        ]
    }
];

const reconsiderMessages = [
    "Come on, reconsider! It'll be fun! 🥺",
    "Are you sure? I promise it'll be awesome! 🌟",
    "Please? Pretty please? 🙏",
    "Think about all the fun we'll have! 🎊",
    "I'll buy you food... 🍕",
    "Just say yes already! 😄",
    "Don't make me ask again... 😅",
    "You know you want to! 😊",
    "Sunday won't be the same without you! 💫"
];

let currentQuestion = 0;
let noClickCount = 0;

function startQuiz() {
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
    
    const randomMessage = reconsiderMessages[Math.floor(Math.random() * reconsiderMessages.length)];
    reconsiderMsg.textContent = randomMessage;
    
    noBtn.classList.add('shrink');
    setTimeout(() => {
        noBtn.classList.remove('shrink');
    }, 500);
    
    yesBtn.classList.add('grow');
    setTimeout(() => {
        yesBtn.classList.remove('grow');
    }, 500);
    
    if (noClickCount >= 3) {
        moveNoButton();
    }
}

function moveNoButton() {
    const noBtn = document.getElementById('no-btn');
    const container = document.querySelector('.final-buttons');
    const containerRect = container.getBoundingClientRect();
    
    const maxX = 100;
    const maxY = 50;
    
    const randomX = (Math.random() - 0.5) * maxX;
    const randomY = (Math.random() - 0.5) * maxY;
    
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.85)`;
    
    setTimeout(() => {
        noBtn.style.transform = '';
    }, 1000);
}

function handleYes() {
    hideScreen('final-screen');
    showScreen('success-screen');
    launchConfetti();
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
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#ffd89b'];
    
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
