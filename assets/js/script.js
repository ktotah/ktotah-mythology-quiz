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

// Feedback 
let lastFeedback = '';

// High Scores
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

// Array of question objects
const questions = [
    // QUESTION 1
    {
        question: "Question 1",
        choices: ["Answer 1a", "Answer 1b", "Answer 1c", "Answer 1d"],
        correct: "Answer 1a"
    },

    // QUESTION 2
    {
        question: "Question 2",
        choices: ["Answer 2a", "Answer 2b", "Answer 2c", "Answer 2d"],
        correct: "Answer 2c"
    },

    //...  MAKE MORE QUESTIONS LATER
];

// Start Quiz Function 
function startQuiz() {
    startBtn.classList.add('hide'); // Hide start button
    quizContainer.classList.remove('hide'); // Show quiz container
    progressEl.classList.remove('hide'); // Show footer with quiz progress
    currentScore = 0; // Reset score
    currentQuestionIndex = 0 // Start from first question
    lastFeedback = ''; // Reset feedback
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
        const button = document.createElement('button'); // for each choice in the choices array of the current question, a button element is created
        button.textContent = choice;
        button.addEventListener('click', () => selectAnswer(idx, index));
        choicesEl.appendChild(button);
    });

    //Update progress display
    currentQuestionNumberEl.textContent = index + 1;
    totalQuestionsEl.textContent = questions.length;

    // Display last question's feedback if it exists
    if (lastFeedback){
        feedbackEl.textContent = lastFeedback;
        //reset lastFeedback
        lastFeedback = '';
    }; 
}

// Function to handle answer selection and store feedback
function selectAnswer(choiceIndex, questionIndex) {
    // Check if answer is correct and set feedback / update score
    if (questions[questionIndex].choices[choiceIndex] === questions[questionIndex].correct) {
        currentScore++; // Increase score for correct answer
        lastFeedback = "Correct!";
        feedbackEl.style.color = "green";
    } else {
        lastFeedback = "Wrong!";
        feedbackEl.style.color = "red";
    }

    // Update score immediately
    document.getElementById('score').textContent = currentScore;

    // Move to the next question or end quiz after selecting a choice
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        // Render next question (with the last question's feedback if it exists)
        renderQuestion(currentQuestionIndex);
    } else {
        // If no more questions, end the quiz
        endQuiz();
    }
}

// End Quiz Function 
function endQuiz() {
    clearInterval(timer); // Stop the timer
    quizContainer.classList.add('hide'); // Hide quiz container
    progressEl.classList.add('hide'); // Hide footer with quiz progress
    // Show final score and time taken
    showFinalScore();
    // Show score submission
    document.getElementById('score-submission').classList.remove('hide'); // Show score submission
}

// Function to show final score and time taken
function showFinalScore(){
    //Calculate time taken
    const timeTaken = 60 - timerCount;
    // Display final score and time
    document.getElementById('final-score').textContent = `Final Score: ${currentScore} out of ${questions.length}`;
    document.getElementById('time-taken').textContent = `Time: ${timeTaken} seconds`
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

// Event listener for Start Button
startBtn.addEventListener('click', startQuiz); // Click the Start Button to start the quiz

// Event listener for high score submission 
document.getElementById('submit-score-btn').addEventListener('click', () => {
    const userInitials = document.getElementById('user-initials').value; // Get initials from input field

    if(userInitials){
        saveHighScore(userInitials);
        document.getElementById('score-submission').classList.add('hide'); // Hide score submission section 
    }
})

// Event listener for retaking the quiz
document.getElementById('clear-scores').addEventListener('click', () => {
    highScores = [];
    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayHighScores();
})

// Event listener for retaking the quiz
document.getElementById('retake-quiz').addEventListener('click', () => {
    startQuiz();
})


// Initailize Quiz on Page Load
document.addEventListener('DOMContentLoaded', () => {
    displayHighScores(); // Display any saved high scores
}); 