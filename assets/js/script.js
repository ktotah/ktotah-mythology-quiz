// HTML Elements and UI Components (INITIAL VARIABLES)
const startBtn = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-container');
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const feedbackEl = document.getElementById('feedback');
const timerEl = document.getElementById('time');
const progressEl = document.getElementById('progress');
const currentQuestionNumberEl = document.getElementById('current-question-number');
const totalQuestionsEl = document.getElementById('total-questions');
const highScoresEl = document.getElementById('high-scores');

// Quiz State Management
let currentQuestionIndex = 0;   
let currentScore = 0;
let timerCount = 60; // Total time for  quiz - 60 seconds
let timer; // for setInterval and clearInterval

// High Scores
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

// Array of Questions and Answers (imported from questions.js or defined here)

// Start Game Function 
function startGame() {
    startBtn.classList.add('hide'); // Hide start button
    quizContainer.classList.remove('hide'); // Show quiz container
    currentScore = 0; // Reset score
    currentQuestionIndex = 0 // Start from first question
    startTimer(); // Start the quiz timer
    renderQuestion(currentQuestionIndex); // Render the first question 
}

// Start Timer Function 
function startTimer() {
    timerCount = 60; // Reset timer count
    timerEl.textContent = timerCount; 
    // Set the timer to count down every second
    timer = setInterval(() => {
        timerCount--;
        timerEl.textContent = timerCount;

        // Check if the time has run out
        if (timerCount <= 0) {
            clearInterval(timer); // Stop the timer
            timerEl.textContent = '0';
            endQuiz(); // Call the function to end the quiz
        }
    }, 1000); // 1000 milliseconds = 1 second
}

// Render Question Function 
function renderQuestion(index){
    const question = questions[index];
    questionEl.textContent = question.question;
    choicesEl.innerHTML = ''; // Clear previous choices

    question.choices.forEach((choice, idx) => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.addEventListener('click', () => selectAnswer(idx, index));
        choicesEl.appendChild(button);
    });

    //Update progress display
    currentQuestionNumberEl.textContent = index + 1;
    totalQuestionsEl.textContent = questions.length;
}

// Select Answer Function 
function selectAnswer(choiceIndex, questionIndex) {
    if (questions[questionIndex].choices[choiceIndex] === questions[questionIndex].correct) {
        currentScore++; // Increase score for correct answer
        feedbackEl.textContent = "Correct!";
        feedbackEl.style = "green";
    } else {
        feedbackEl.textContent = "Wrong!";
        feedbackEl.style = "red";
    }

    // Move to the next question or end quiz after a delay

    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            renderQuestion(currentQuestionIndex);
        } else {
            endQuiz();
        }
    }, 1000); 
}

// End Quiz Function 
function endQuiz() {
    clearInterval(timer); // Stop the timer
    quizContainer.classList.add('hide'); // Hide quiz container
    // Show results and prompt for user intials and submitting score
}

// Save High Score Function 
function saveHighScore(initials) {
    highScores.push({ initials, score: currentScore});
    highScores.sort((a,b) => b.score - a.score);
    highScores = highScores.slice(0, 5); // Keep only top 5 scores
    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayHighScores();
}

// Display High Scores Function 
function displayHighScores() {
    highScoresEl.innerHTML = highScores
    .map(score => `<p>${score.initials}: ${score}</p>`)
    .join('')
}

// Add Event Listeners
startBtn.addEventListener('click', startGame); // Click the Start Button to start the quiz
// MORE EVENT LISTENERS for answer buttons, high score submission, etc. 

// Initailize Quiz on Page Load
document.addEventListener('DOMContentLoaded', () => {
    displayHighScores(); // Display any saved high scores
}); 