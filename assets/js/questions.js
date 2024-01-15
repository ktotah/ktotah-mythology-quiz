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

// Funciton to render a question
function renderQuestion(questionIndex) {
    const question = questions[questionIndex];
    const choices = question.choices.map((choice, index) => {
        return `<button onclick="selectAnswer(${index}, ${questionIndex})">${choice}</button>`;
    }).join("");

    questionEl.textContent = question.question; // Set the question text
    choicesEl.innerHTML = choices; // Set the choices buttons
}

// Function to intialize the quiz
function initQuiz() {
    renderQuestion(0); // Render the first question
    // can call other initial setup functions here if needed
}

// Call initQuiz function when the script loads
initQuiz();