const apiKey = '..'; // Replace with your API key
const apiUrl = `https://quizapi.io/api/v1/questions?apiKey=${apiKey}&limit=10`;

const fetchQuestions = async () => {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
};

const questionContainer = document.querySelector('.question-container');
let questions = [];

async function renderQuestions() {
  questions = await fetchQuestions();
  console.log(questions);
  questionContainer.innerHTML = ''; // Clear the loading message
  questions.forEach((question, index) => {
    const questionElement = document.createElement('div');
    questionElement.classList.add('question');
    const answers = Object.entries(question.answers).filter(([key, value]) => value !== null);
    questionElement.innerHTML = `
      <h3>${index + 1}. ${question.question}</h3>
      <ul>
        ${answers.map(([key, answer]) => `
          <li>
            <label>
              <input type="radio" name="question-${index}" value="${key}">
              ${answer}
            </label>
          </li>
        `).join('')}
      </ul>
    `;
    questionContainer.appendChild(questionElement);
  });
}

questionContainer.innerHTML = 'Loading questions...';
renderQuestions();

const submitButton = document.querySelector('.submit');
submitButton.addEventListener('click', () => {
  let score = 0;
  let correctAnswers = 0;

  questions.forEach((question, index) => {
    const selectedAnswer = document.querySelector(`input[name="question-${index}"]:checked`);
    const correctAnswerKey = Object.keys(question.correct_answers).find(key => question.correct_answers[key] === 'true');
    if (selectedAnswer && selectedAnswer.value === correctAnswerKey) {
      score += 10; // Assuming each correct answer is worth 10 points
      correctAnswers++;
    }
  });

  alert(`You got ${correctAnswers} out of ${questions.length} questions correct. Your score is ${score}.`);
});