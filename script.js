// Element References
const welcomeScreen = document.getElementById('welcome-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const resultText = document.getElementById('result-text');

// State Variables
let currentQuestionIndex = 0;
let scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
let questions = [
  // EI Questions
  {
    text: "당신은 주로:",
    options: [
      { text: "다양한 사람들과 교류하며 에너지를 얻는다 (E)", type: "E" },
      { text: "혼자만의 시간을 통해 에너지를 충전한다 (I)", type: "I" },
    ],
  },
  {
    text: "새로운 사람들을 만나는 것에 대해:",
    options: [
      { text: "쉽게 다가가고 대화를 시작하는 편이다 (E)", type: "E" },
      { text: "시간이 필요하며, 먼저 다가오기를 기다리는 편이다 (I)", type: "I" },
    ],
  },
  {
    text: "주말을 보낼 때 선호하는 방식은:",
    options: [
      { text: "친구들과의 약속이나 활동적인 모임 (E)", type: "E" },
      { text: "집에서 조용히 쉬거나 개인적인 취미 활동 (I)", type: "I" },
    ],
  },
  // SN Questions
  {
    text: "정보를 받아들일 때 당신은:",
    options: [
      { text: "현재 실제로 일어나고 있는 일에 더 집중한다 (S)", type: "S" },
      { text: "미래의 가능성이나 숨겨진 의미를 더 탐구한다 (N)", type: "N" },
    ],
  },
  {
    text: "일을 처리할 때:",
    options: [
      { text: "구체적이고 현실적인 방법을 선호한다 (S)", type: "S" },
      { text: "새롭고 독창적인 아이디어를 떠올리는 것을 즐긴다 (N)", type: "N" },
    ],
  },
  {
    text: "설명을 들을 때:",
    options: [
      { text: "사실적이고 명확한 설명을 더 이해하기 쉽다 (S)", type: "S" },
      { text: "비유적이거나 개념적인 설명을 더 흥미롭게 느낀다 (N)", type: "N" },
    ],
  },
  // TF Questions
  {
    text: "결정을 내릴 때 주로 고려하는 것은:",
    options: [
      { text: "논리적이고 객관적인 분석 (T)", type: "T" },
      { text: "사람들과의 관계나 감정적인 영향 (F)", type: "F" },
    ],
  },
  {
    text: "다른 사람에게 피드백을 줄 때:",
    options: [
      { text: "진실하고 솔직하게 전달하는 것이 중요하다고 생각한다 (T)", type: "T" },
      { text: "상대방의 감정을 고려하여 부드럽게 전달하려고 노력한다 (F)", type: "F" },
    ],
  },
  {
    text: "문제 해결 시 당신의 접근 방식은:",
    options: [
      { text: "원칙과 기준에 따라 공정하게 해결하려 한다 (T)", type: "T" },
      { text: "상황과 관련된 사람들의 감정을 중요하게 생각한다 (F)", type: "F" },
    ],
  },
  // JP Questions
  {
    text: "계획을 세울 때:",
    options: [
      { text: "미리 계획을 세우고 일정을 따르는 것을 선호한다 (J)", type: "J" },
      { text: "상황에 따라 유연하게 대처하고 즉흥적인 것을 즐긴다 (P)", type: "P" },
    ],
  },
  {
    text: "일상 생활에서 당신은:",
    options: [
      { text: "정리정돈되고 체계적인 환경을 중요하게 생각한다 (J)", type: "J" },
      { text: "자유롭고 편안한 환경에서 더 능률이 오른다고 느낀다 (P)", type: "P" },
    ],
  },
  {
    text: "마감 기한이 있는 일을 할 때:",
    options: [
      { text: "미리 시작하여 여유롭게 끝내는 편이다 (J)", type: "J" },
      { text: "마감 직전에 집중해서 끝내는 경향이 있다 (P)", type: "P" },
    ],
  },
];

// Event Listener
startBtn.addEventListener('click', startTest);

// Functions
function startTest() {
    currentQuestionIndex = 0;
    scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    // Animate out welcome screen
    welcomeScreen.style.opacity = '0';
    welcomeScreen.style.transform = 'translateY(20px)';

    setTimeout(() => {
        welcomeScreen.style.display = 'none';

        // Prepare question screen for animation
        questionScreen.style.display = 'flex'; // Changed from 'block' to 'flex'
        // Force reflow to ensure transition is applied
        void questionScreen.offsetHeight; // Using void for clarity on non-assignment

        // Animate in question screen
        questionScreen.style.opacity = '1';
        questionScreen.style.transform = 'translateY(0)';
        displayQuestion();
    }, 500); // Corresponds to CSS transition duration
}

function displayQuestion() {
    optionsContainer.innerHTML = ''; // Clear previous options

    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionText.textContent = currentQuestion.text;

        currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.addEventListener('click', () => selectAnswer(option.type));
            optionsContainer.appendChild(button);
        });
    } else {
        // All questions answered, proceed to calculate and show result
        calculateAndShowResult();
    }
}

function selectAnswer(type) {
    scores[type]++;
    currentQuestionIndex++;
    displayQuestion();
}

// This function will handle the transition from question screen to result screen
function calculateAndShowResult() {
    // Calculate MBTI result string
    let mbtiResult = '';
    mbtiResult += scores.E >= scores.I ? 'E' : 'I';
    mbtiResult += scores.S >= scores.N ? 'S' : 'N';
    mbtiResult += scores.T >= scores.F ? 'T' : 'F';
    mbtiResult += scores.J >= scores.P ? 'P' : 'J';

    // Animate out question screen
    questionScreen.style.opacity = '0';
    questionScreen.style.transform = 'translateY(20px)';

    setTimeout(() => {
        questionScreen.style.display = 'none';

        // Prepare result screen for animation
        resultScreen.style.display = 'flex';
        // Force reflow to ensure transition is applied correctly
        void resultScreen.offsetHeight;

        // Animate in result screen
        resultScreen.style.opacity = '1';
        resultScreen.style.transform = 'translateY(0)';
        resultText.textContent = `당신의 MBTI 유형은 ${result} 입니다.`;
    }, 500); // Corresponds to CSS transition duration
}
// Note: The previous 'displayResult(result)' and 'calculateResult()' functions
// have been consolidated into 'calculateAndShowResult()' for a cleaner flow
// as per the simplified approach.
// The multiple definitions and re-definitions like calculateResult_revised,
// showResultScreen, updateResultText have been removed.
