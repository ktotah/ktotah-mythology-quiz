// Global Variables
let currentQuestionIndex = 0;
let currentScore = 0;
let timerCount = 60; // Total time for the quiz - 60 seconds
let timer; // For setInterval and clearInterval

// Check which page is loaded and initialize accordingly
document.addEventListener('DOMContentLoaded', () => {
    // Get the current page's name from the URL
    const page = window.location.pathname.split("/").pop();

    // Initialize page-specific scripts
    if (page === 'index.html') {
        initializeIndexPage();
    } else if (page === 'quiz.html') { 
        initializeQuizPage();
    } else if (page === 'high-scores.html') {
        displayHighScores();
    } // no need for an else statement - if none of the pages match then no initialization function will be called
})


// INDEX PAGE

function initializeIndexPage() {
    // Event listener for Start Button on Index Page
    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', () => {
        window.location.href = 'quiz.html';
    });
}


// QUIZ PAGE
function initializeQuizPage() {
    // Initialize quiz elements and event listeners on Quiz Page
    const quizContainer = document.getElementById('quiz-container');
    const questionEl = document.getElementById('question');
    const choicesEl = document.getElementById('choices');
    const timerEl = document.getElementById('time');
    const feedbackEl = document.getElementById('feedback');
    const submitScoreBtn = document.getElementById('submit-score-btn');
    const userInitialsInput = document.getElementById('user-initials');

    // Star Quiz immediately
    startQuiz();

    // Start Quiz Function 
    function startQuiz() {
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
        // Retrieve the current question object from the 'questions' array using the provided index
        const question = questions[index];
        // Set the text content of the 'questionEl' element to be the 'question' property of the current question
        questionEl.textContent = question.question;
        // Clear the inner HTML of the 'choicesEl' element to remove any previous choices taht were displayed. This is necessary to update the choices displayed to the user for each new question
        choicesEl.innerHTML = '';

        // Loop over the 'choices' array within the current question object. For each choice:
        question.choices.forEach((choice, idx) => {
            // Create a new 'button' element
            const button = document.createElement('button'); 
            // Set the text content of this button to the current choice from the choices array
            button.textContent = choice;
            // Add an event listener that will call the 'selectAnswer' function when the button is clicked. The 'selectAnswer' function will be responsible for determining if the chosen answer is correct and updating the quiz state accordingly
            button.addEventListener('click', () => selectAnswer(idx, index));
            // The new button is appended to `choicesEl` element, which is part of the DOM. This makes the button visible within the `choicesEl` container.
            choicesEl.appendChild(button);
        });

        // Display last question's feedback
        feedbackEl.textContent = lastFeedback; // Display last feedback
        lastFeedback = ''; //Clear last feedback 
    }

    // Select Answer Function (handles answer selection and stores feedback)
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
        setTimeout(() => {
            feedbackEl.textContent = ''; // Clear feedback after a delay
            showFinalScore(); // Show final score
            document.getElementById('score-submission').classList.remove('hide'); // Show score submission
        }, 700); // Delay feedback clear for 0.7 seconds

    }

    // Event listener for Submit Score Button
    submitScoreBtn.addEventListener('click', () => {
        // Trime whitespace from user initials and convert to uppercase
        const userInitials = userInitialsInput.value.trim().toUpperCase();
        
        // Check if initials are entered
        if (userInitials) {
            saveHighScore(userInitials);
            // Redirect to high-scores page after saving score
            window.location.href = "high-scores.html";
        } else {
            // Alert if no initials are entered
            alert("Please enter your initials to submit your score.");
        }
    });
}


// HIGH SCORES PAGE

// Save High Score Function
function saveHighScore(initials) {
    // Retrieve high scores from localStorage or initialize an empty array if none found
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    // Add new score to the array
    highScores.push({initials, score: currentScore});
    // Sort high scores in descending order
    highScores.sort((a, b) => b.score - a.score);
    // Keep only the top 5 scores
    highScores = highScores.slice(0, 5);
    // Save the updated scores back to locatlStorage
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

// Display High Score Function
function displayHighScores() {
    // Target the element where the scores should be displyed
    const scoreListDiv = document.getElementById('high-scores-list');
    //  Retrieve high scores from localStorage or initialize an empty array if none found
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    // Populate the high scores list in the HTML
    scoreListDiv.innerHTML = highScores
    .map(score => `<p>${score.initials} - ${score.score}</p>`)
    .join('');

    // Event listener for clearing the high scores
    const clearScoresBtn = document.getElementById('clear-scores');
    clearScoresBtn.addEventListener('click', clearHighScores);

    // Event listener for "go back" button
    const goBackBtn = document.getElementById('go-back');
    goBackBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// Clear High Scores Function 
function clearHighScores() {
    // Clear high scores from localStorage
    localStorage.setItem('highScores', JSON.stringify([]));
    // Update the display to show an empty high scores list
    displayHighScores();
}






// Array of question objects
const questions = [
    // QUESTION 1
    {
        question: "Who was the Greek goddess of wisdom, warfare, and crafts?",
        choices: ["A) Aphrodite", "B) Athena", "C) Artemis", "D) Hera"],
        correct: "B) Athena"
    },

    // QUESTION 2
    {
        question: "Question 2",
        choices: ["Answer 2a", "Answer 2b", "Answer 2c", "Answer 2d"],
        correct: "Answer 2c"
    },

    // QUESTION 3
    {
        question: "Question 2",
        choices: ["Answer 2a", "Answer 2b", "Answer 2c", "Answer 2d"],
        correct: "Answer 2c"
    },

     // QUESTION 4
     {
        question: "Who is known for completing the twelve labors in Greek mythology?",
        choices: ["A) Achilles", "B) Perseus", "C) Theseus", "D) Heracles"],
        correct: "D) Heracles"
    },

     // QUESTION 5
     {
        question: "Question 2",
        choices: ["Answer 2a", "Answer 2b", "Answer 2c", "Answer 2d"],
        correct: "Answer 2c"
    },

     // QUESTION 6
     {
        question: "Question 2",
        choices: ["Answer 2a", "Answer 2b", "Answer 2c", "Answer 2d"],
        correct: "Answer 2c"
    },

     // QUESTION 7
     {
        question: "Question 2",
        choices: ["Answer 2a", "Answer 2b", "Answer 2c", "Answer 2d"],
        correct: "Answer 2c"
    }
];
