// Generate 100-question pool
function generateQuestionPool() {
    const topics = [
        {
            name: "Phishing",
            baseQuestion: "What is phishing?",
            correct: "A social engineering attack to steal sensitive information",
            incorrect: [
                "A type of encryption",
                "A network scanning tool",
                "A firewall configuration"
            ],
            explanation: "Phishing uses fake emails or websites to trick users into revealing credentials."
        },
        {
            name: "Malware",
            baseQuestion: "What defines malware?",
            correct: "Malicious software designed to harm systems",
            incorrect: [
                "A tool for network analysis",
                "A type of antivirus",
                "A secure protocol"
            ],
            explanation: "Malware, like viruses or ransomware, harms or exploits systems."
        },
        {
            name: "Network Security",
            baseQuestion: "What does a firewall do?",
            correct: "Controls network traffic based on rules",
            incorrect: [
                "Encrypts data",
                "Monitors CPU usage",
                "Assigns IP addresses"
            ],
            explanation: "A firewall filters traffic to protect networks."
        },
        {
            name: "Social Engineering",
            baseQuestion: "What is social engineering?",
            correct: "Manipulating people to disclose confidential data",
            incorrect: [
                "Writing secure code",
                "Encrypting networks",
                "Scanning ports"
            ],
            explanation: "Social engineering exploits human behavior to gain information."
        },
        {
            name: "Data Privacy",
            baseQuestion: "What is the goal of the Data Privacy Act of 2012 (RA 10173)?",
            correct: "To protect personal information",
            incorrect: [
                "To regulate internet speed",
                "To enforce software patents",
                "To monitor social media"
            ],
            explanation: "RA 10173 ensures personal data protection in the Philippines."
        },
        {
            name: "Cybersecurity Laws",
            baseQuestion: "What does RA 10175 in the Philippines address?",
            correct: "Cybercrime prevention",
            incorrect: [
                "Traffic regulations",
                "Software licensing",
                "Internet speed regulation"
            ],
            explanation: "RA 10175 combats cybercrimes like hacking."
        },
        {
            name: "Linux Commands",
            baseQuestion: "Which Linux command shows active network connections?",
            correct: "netstat",
            incorrect: [
                "ls",
                "chmod",
                "grep"
            ],
            explanation: "'netstat' displays network connections in Linux."
        },
        {
            name: "Tools - Nmap",
            baseQuestion: "What is Nmap used for?",
            correct: "Scanning networks for open ports",
            incorrect: [
                "Encrypting files",
                "Monitoring CPU",
                "Creating backups"
            ],
            explanation: "Nmap identifies open ports and services on networks."
        },
        {
            name: "Tools - Wireshark",
            baseQuestion: "What is the main function of Wireshark?",
            correct: "Analyzing network packets",
            incorrect: [
                "Blocking unauthorized access",
                "Encrypting data",
                "Managing passwords"
            ],
            explanation: "Wireshark captures and analyzes network traffic."
        },
        {
            name: "Ethical Hacking",
            baseQuestion: "What defines ethical hacking?",
            correct: "Testing systems with permission to find vulnerabilities",
            incorrect: [
                "Hacking without permission",
                "Creating malware",
                "Bypassing firewalls illegally"
            ],
            explanation: "Ethical hacking improves security with authorized testing."
        }
    ];

    const pool = [];
    let questionId = 0;

    // Generate 100 questions (10 variations per topic)
    topics.forEach(topic => {
        for (let i = 0; i < 10; i++) {
            const variations = [
                topic.baseQuestion,
                `In cybersecurity, what does ${topic.name.toLowerCase()} involve?`,
                `What best describes ${topic.name.toLowerCase()}?`,
                `Which statement is true about ${topic.name.toLowerCase()}?`
            ];
            const questionText = variations[Math.floor(Math.random() * variations.length)];
            const options = shuffleArray([
                `A. ${topic.correct}`,
                `B. ${topic.incorrect[0]}`,
                `C. ${topic.incorrect[1]}`,
                `D. ${topic.incorrect[2]}`
            ]);
            const correctIndex = options.findIndex(opt => opt.startsWith(`A. ${topic.correct}`));
            pool.push({
                id: questionId++,
                question: questionText,
                options,
                correct: correctIndex,
                explanation: topic.explanation
            });
        }
    });

    return pool;
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Generate 10 random questions
function generateQuizData() {
    const pool = generateQuestionPool();
    return shuffleArray([...pool]).slice(0, 10);
}

// Quiz state
const quizData = generateQuizData();
let currentQuestionIndex = 0;
let userAnswers = [];
let timer;

// DOM elements
const quizContainer = document.getElementById('quiz-container');
const questionBox = document.getElementById('question-box');
const submitButton = document.getElementById('submit-answer');
const resultElement = document.getElementById('quiz-result');
const timerElement = document.getElementById('timer');
const timerText = document.getElementById('timer-text');
const progressBar = document.getElementById('progress-bar');

// Render current question
function renderQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        clearInterval(timer);
        showAnswerKey();
        return;
    }

    const item = quizData[currentQuestionIndex];
    questionBox.innerHTML = `
        <h2 class="quiz-question-title">${currentQuestionIndex + 1}. ${sanitizeInput(item.question)}</h2>
        ${item.options.map((option, i) => `
            <label class="quiz-option">
                <input type="radio" name="answer" value="${i}" aria-label="Option ${String.fromCharCode(65 + i)}">
                <span>${sanitizeInput(option)}</span>
            </label>
        `).join('')}
    `;
    submitButton.disabled = true;
    updateProgress();

    // Enable submit button on selection
    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.addEventListener('change', () => {
            submitButton.disabled = false;
        });
    });

    // Start 10-second timer
    let timeLeft = 10;
    timerText.textContent = `${timeLeft}s`;
    timerElement.classList.remove('timer-warning');
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerText.textContent = `${timeLeft}s`;
        if (timeLeft <= 3) timerElement.classList.add('timer-warning');
        if (timeLeft <= 0) {
            saveAnswer();
            currentQuestionIndex++;
            renderQuestion();
        }
    }, 1000);
}

// Update progress bar
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
    progressBar.querySelector('.progress-fill').style.width = `${progress}%`;
}

// Save user answer
function saveAnswer() {
    const selected = document.querySelector('input[name="answer"]:checked');
    userAnswers[currentQuestionIndex] = selected ? parseInt(selected.value) : null;
}

// Sanitize input to prevent XSS
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML.replace(/[<>&;]/g, '');
}

// Show answer key and score
function showAnswerKey() {
    const score = userAnswers.reduce((sum, answer, i) => sum + (answer === quizData[i].correct ? 1 : 0), 0);
    resultElement.innerHTML = `You got ${score} out of 10 correct!`;
    quizContainer.innerHTML = `
        <h2 class="quiz-question-title">Answer Key</h2>
        <button id="restart-quiz" class="quiz-btn">Restart Quiz</button>
    `;
    quizData.forEach((item, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'quiz-question';
        answerDiv.innerHTML = `
            <h3 class="quiz-question-title">${index + 1}. ${sanitizeInput(item.question)}</h3>
            <p class="quiz-option">Correct Answer: ${sanitizeInput(item.options[item.correct])}</p>
            <p class="quiz-option" style="color: ${userAnswers[index] === item.correct ? 'var(--success)' : 'var(--error)'};">
                Your Answer: ${userAnswers[index] !== null ? sanitizeInput(item.options[userAnswers[index]]) : 'Not answered'}
            </p>
            <p class="quiz-explanation">${sanitizeInput(item.explanation)}</p>
        `;
        quizContainer.appendChild(answerDiv);
    });
    submitButton.style.display = 'none';
    timerElement.style.display = 'none';
    progressBar.style.display = 'none';

    // Add restart functionality
    document.getElementById('restart-quiz').addEventListener('click', () => {
        window.location.reload();
    });
}

// Event listeners
submitButton.addEventListener('click', () => {
    saveAnswer();
    clearInterval(timer);
    currentQuestionIndex++;
    renderQuestion();
});

document.addEventListener('DOMContentLoaded', renderQuestion);

// Keyboard navigation
document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !submitButton.disabled) {
        saveAnswer();
        clearInterval(timer);
        currentQuestionIndex++;
        renderQuestion();
    }
});