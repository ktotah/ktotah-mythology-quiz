// Global Variables
let currentQuestionIndex = 0;
let currentScore = 0;
let timerCount = 60; // Total time for the quiz - 60 seconds
let timer; // For setInterval and clearInterval
let correctAnswers = 0; // Number of correct answers at the beginning of the quiz

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
    // Initializes the quiz by resetting scores, setting the first question, and starting the timer
    function startQuiz() {
        currentScore = 0; // Reset score
        currentQuestionIndex = 0 // Start from first question
        lastFeedback = ''; // Reset feedback
        startTimer(); // Start the quiz timer
        renderQuestion(currentQuestionIndex); // Render the first question 
    }

    // Start Timer Function
    // Begins the countdown for the quiz and handles the end of quiz if/when time runs out
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
    // Displays the current question and its choices on the quiz page
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

    // Select Answer Function 
    // Handles the logic for when a user selects an answer, including score calculation and feedback
    function selectAnswer(choiceIndex, questionIndex) {
        // Check if answer is correct and set feedback / update score
        if (questions[questionIndex].choices[choiceIndex] === questions[questionIndex].correct) {
            correctAnswers++; // Increment for correct answers
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
    // Concludes the quiz, stops the timer, and calculates the final score
    function endQuiz() {
        feedbackEl.textContent = lastFeedback; // Display last feedback
        clearInterval(timer); // Stop the timer

        // Calculate final score
        let baseScore = 70; // Set the base score as 70 in this case because I have 7 questions on this quiz
        currentScore = baseScore + (timerCount * 0.5) - ((questions.length - correctAnswers) * 10); // formula for score is you take the base score (70 in this case) and add half of the number of seconds remaining on the timer as a bonus and subtract 10 points for every incorrect answer.
        currentScore = Math.ceil(currentScore); // Round up the final score to the nearest whole number
        currentScore = Math.max(currentScore, 0); // Ensure score doesn't go below 0 (which would never be the case the way I currently have the quiz set up with, but I wanted to implement this here in case of future additional questions, etc.)
        

        setTimeout(() => {
            feedbackEl.textContent = ''; // Clear feedback after a delay
            document.getElementById('quiz-container').classList.add('hide'); // Hide quiz container after completing quiz
            showFinalScore(); // Show final score
            document.getElementById('score-submission').classList.remove('hide'); // Show score submission
        }, 700); // Delay feedback clear for 0.7 seconds

    }

    // Show Final Score Function
    // Displays the final score to the user with a breakdown of their performance
    function showFinalScore() {
        // Display final score and details
        const finalScoreDiv = document.getElementById('final-score');
        finalScoreDiv.textContent = `You got ${correctAnswers} out of ${questions.length} questions correct.<br>` + `You completed the quiz with ${timerCount} seconds remaining.<br><br>` + `From a baseline of 70 points, you gain half the number of seconds remaining on your timer as bonus points.<br>` + `10 points are subtracted for every wrong answer.<br><br>` + `Your final score is ${currentScore}.`;
    }

    // Event listener for Submit Score Button
    submitScoreBtn.addEventListener('click', () => {
        // Trim whitespace from user initials and convert to uppercase
        let userInitials = userInitialsInput.value.trim().toUpperCase();

        // Regular expression to match only letter characters (A-Z)
        const lettersOnly = /^[A-Z]+$/;

        // Check if the initials contain only letters and are of valid length
        if (userInitials.length >= 2 && userInitials.length <= 3 &&userInitials.match(lettersOnly)) {
            saveHighScore(userInitials);
            window.location.href = 'high-scores.html';
        } else {
            alert("Please enter initials using 2 to 3 letters only to submit your score")
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

    // Populate the high scores list in the HTML with ranking
    scoreListDiv.innerHTML = highScores
    .map((score, index) => `<p>${index +1}. ${score.initials} - ${score.score}</p>`)
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
