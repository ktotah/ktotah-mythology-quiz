// Array of question objects
const questions = [
    // QUESTION 1
    {
        question: "Question A",
        choices: ["Answer A1", "Answer A2", "Answer A3", "Answer A4"]
        correct: "Answer A1"
    },

    // QUESTION 2
    {
        question: "Question A",
        choices: ["Answer A1", "Answer A2", "Answer A3", "Answer A4"]
        correct: "Answer A1"
    },

    // QUESTION 3
    {
        question: "Question A",
        choices: ["Answer A1", "Answer A2", "Answer A3", "Answer A4"]
        correct: "Answer A1"
    },

    // QUESTIN 4
    {
        question: "Question A",
        choices: ["Answer A1", "Answer A2", "Answer A3", "Answer A4"]
        correct: "Answer A1"
    },

    // QUESTION 5
    {
        question: "Question A",
        choices: ["Answer A1", "Answer A2", "Answer A3", "Answer A4"]
        correct: "Answer A1"
    },

    // QUESTION 6
    {
        question: "Question A",
        choices: ["Answer A1", "Answer A2", "Answer A3", "Answer A4"]
        correct: "Answer A1"
    },

    // QUESTION 7
    {
        question: "Question A",
        choices: ["Answer A1", "Answer A2", "Answer A3", "Answer A4"]
        correct: "Answer A1"
    },

    // QUESTION 8
    {
        question: "Question A",
        choices: ["Answer A1", "Answer A2", "Answer A3", "Answer A4"]
        correct: "Answer A1"
    },

    // QUESTION 9
    {
        question: "Question A",
        choices: ["Answer A1", "Answer A2", "Answer A3", "Answer A4"]
        correct: "Answer A1"
    },

    // QUESTION 10
    {
        question: "Question A",
        choices: ["Answer A1", "Answer A2", "Answer A3", "Answer A4"]
        correct: "Answer A1"
    }
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