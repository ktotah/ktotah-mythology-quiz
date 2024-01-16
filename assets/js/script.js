// HTML Elements and UI Components (INITIAL VARIABLES)
const startBtn = document.getElementById('start-btn');
const goBackBtn = document.getElementById('go-back');
const clearScoresBtn = document.getElementById('clear-scores');
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
let lastFeedback = ''; // for choice feedback 

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
    timerEl.classList.remove('hide'); // Show timer with quiz starts
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

    // Display last question's feedback
    feedbackEl.textContent = lastFeedback; // Display last feedback
    lastFeedback = ''; //Clear last feedback 
}

// Function to handle answer selection and store feedback
function selectAnswer(choiceIndex, questionIndex) {
    // Check if answer is correct and set feedback / update score
    if (questions[questionIndex].choices[choiceIndex] === questions[questionIndex].correct) {
        currentScore++; // Increase score for correct answer
        feedbackEl.textContent = "Correct!";
        feedbackEl.style.color = "green";
    } else {
        feedbackEl.textContent = "Wrong!";
        feedbackEl.style.color = "red";
    }

    // Store last feedback
    lastFeedback = feedbackEl.textContent;

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
    feedbackEl.textContent = lastFeedback; // Display last feedback
    clearInterval(timer); // Stop the timer
    quizContainer.classList.add('hide'); // Hide quiz container
    progressEl.classList.add('hide'); // Hide footer with quiz progress
    setTimeout(() => {
        feedbackEl.textContent = ''; // Clear feedback after a delay
        showFinalScore(); // Show final score
        document.getElementById('score-submission').classList.remove('hide'); // Show score submission
    }, 700); // Delay feedback clear for 0.7 seconds

}

// Function to show final score 
function showFinalScore(){
    // Display final score and time
    document.getElementById('final-score').textContent = `Final Score: ${currentScore} out of ${questions.length}`;
}


// Save High Score Function 
function saveHighScore(initials) {
    highScores.push({ initials: initials, score: currentScore});
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5); // Keep only top 5 scores
    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayHighScores(); // Call this function to update the display
    document.getElementById('score-submission').classList.add('hide'); // Hide score submission section
    document.getElementById('high-scores').classList.remove('hide'); // Show high scores section
}

// Display High Scores Function 
function displayHighScores() {
    // Target the element where the scores should be displayed
    const scoreListDiv = document.getElementById('score-list');
    scoreListDiv.innerHTML = highScores
    .map(score => `<p>${score.initials} - ${score.score}</p>`)
    .join('');
    document.getElementById('high-scores').classList.remove('hide');
}

// Event listener for Start Button
startBtn.addEventListener('click', startQuiz); // Click the Start Button to start the quiz

// Event listener for Submit Score Button
document.getElementById('submit-score-btn').addEventListener('click', () => {
    const userInitials = document.getElementById('user-initials').value.trim(); // Get initials from input field

    if(userInitials){
        saveHighScore(userInitials);
    } else {
        alert("Please enter your initials to submit your score.")
    }
})

// Event listener for clearing the high scores by clicking the clear high scores button
document.getElementById('clear-scores').addEventListener('click', clearHighScores);

// Event listener for "go back" button (return to initial page state)
document.getElementById('go-back').addEventListener('click', function() {
    //hide the high scores and show the main page
    document.getElementById('high-scores').classList.add('hide');
    document.getElementById('start-btn').classList.remove('hide'); // Show start button
    // RESET ANY OTHER NECESSARY STATES OR UI ELEMENTS TO RETURN TO THE MAIN PAGE STATE
})

// Function for clearing high scores
function clearHighScores() {
    highScores = [];
    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayHighScores(); // Update the display which should now be empty
}

// Initailize Quiz on Page Load
document.addEventListener('DOMContentLoaded', () => {
    displayHighScores(); // Display any saved high scores
}); 