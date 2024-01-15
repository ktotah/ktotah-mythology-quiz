// Set up variables for the quiz state, like current score, high scores, timer.
// Set up an array of question objects containing the question, choices, and correct answer

// Define a function to start the quiz:
    // Hide the start button
    // Show the questions section
    // Start the timer and update it on the page every second.
    // Present the first question

// Define a function to present each question:
    // Clear the previous question's options
    // Display the current question and options 
    // Wait for the user to select an option

// Define a function to handle option selection:
    // Check if the selected option is correct.
    // If correct, increase the score.
    // If incorrect, decrease the timer.
    // Move to the next question or end the quiz if it's the last question or if the timer is 0.

// Define a function to end the quiz:
    // Stop the timer.
    // Hide the questions section.
    // Show the section to enter initials and submit the score.

// Define a function to handle high score submission:
    // Get the initials from the input field.
    // Save the score and initials to local storage or a server.
    // Show the high scores list.

// Define a function to retrieve and display high scores:
    // Retrieve scores from storage.
    // Sort the scores in descending order.
    // Display the scores on the page.

// Add event listeners:
    // Start button click to start the quiz.
    // Option click to handle option selection.
    // Submit score button click to handle high score submission.

// Initialize the quiz on page load to set up any necessary state or UI.

const startBtn = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-container');
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const feedbackEl = document.getElementById('feedback');
const timerEl = document.getElementById('time');
const progressEl = document.getElementById('progress');
const currentQuestionNumberEl = document.getElementById('current-question-number');
const totalQuestionsEl = document.getElementById('total-questions');

let currentQuestionIndex = 0;

// Function to handle answer selection
function selectionAnswer(choiceIndex, questionIndex) {
    const question = questions[questionIndex];

    // Check if the answer is correct
    if (question.choices[choiceIndex] === question.correct) {
        feedbackEl.textContent = "Correct!";
        feedbackEl.style.color = "green";
    } else {
        feedbackEl.textContent = "Wrong!";
        feedbackEl.style.color = "red";
    }

    //Show feedback message for a brief period and then move to the next question or end the quiz
    setTimeout(() => {
        feedbackEl.textContent = "";
        if (currentQuestionIndex < questions.length - 1){
            // Move to the next question
            currentQuestionIndex++;
            renderQuestion(currentQuestionIndex);
        } else {
            // End the Quiz
            endQuiz();
        }
    }, 1000); // Feedback message shown for 1 second
}


// Function to start the timer
function startTimer() {
    // Defining timer logic
    timerEl.textContent = 'Starting Timer...';
    //Start the countdown
    timerCount = 60; // Setting the starting time of 60 seconds
    timerEl.textContent = timerCount;

    // Update the timer every 1000ms (1 second)
    const timer = setInterval(function(){
        timerCount--;
        timerEl.textContent = timerCount;
        
        // Check if the timer has reached 0
        if (timerCount <= 0){
            clearInterval(timer); // Stop the timer
            endQuiz(); // Call endQuiz function to handle the end of the quiz
        }
    }, 1000);
}
// Function to start the game
function startGame() {
    // Hide the start button
    startBtn.classList.add('hide');

    // Reset any old quiz data if necessary
    currentQuestionIndex = 0;

    // Show the quiz container
    quizContainer.classList.remove('hide');

    // Start the timer for the quiz
    startTimer();

    // Render the first question
    renderQuestion(currentQuestionIndex);
}

// Attach event listener to start button to call startGame function on click 
startBtn.add('click', startGame);


// endQuiz function
function endQuiz(){
    quizContainer.classList.add('hide'); // Hide the quiz container
    startBtn.classList.remove('hide'); // Show the start button again for replay
}