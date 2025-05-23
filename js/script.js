// Element References
const welcomeScreen = document.getElementById('welcome-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const resultText = document.getElementById('result-text');
const communityLinkContainer = document.getElementById('community-link-container');
const communityLink = document.getElementById('community-link');
const progressBar = document.getElementById('progress-bar');
const questionNumber = document.getElementById('question-number');
// const nextBtn = document.getElementById('next-btn'); // For later use if manual navigation is enabled

// New Answer Options (Fixed)
const answerOptions = [
  { id: 1, text: '매우 그렇다', value: 2 },
  { id: 2, text: '그렇다', value: 1 },
  { id: 3, text: '보통이다', value: 0 },
  { id: 4, text: '아니다', value: -1 },
  { id: 5, text: '매우 아니다', value: -2 }
];

// MBTI Community Links Data (Updated to point to local HTML files in pages/ directory)
const mbtiCommunityLinks = {
  ISTJ: "pages/istj.html",
  ISFJ: "pages/isfj.html",
  INFJ: "pages/infj.html",
  INTJ: "pages/intj.html",
  ISTP: "pages/istp.html",
  ISFP: "pages/isfp.html",
  INFP: "pages/infp.html",
  INTP: "pages/intp.html",
  ESTP: "pages/estp.html",
  ESFP: "pages/esfp.html",
  ENFP: "pages/enfp.html",
  ENTP: "pages/entp.html",
  ESTJ: "pages/estj.html",
  ESFJ: "pages/esfj.html",
  ENFJ: "pages/enfj.html",
  ENTJ: "pages/entj.html",
};

// State Variables
let currentQuestionIndex = 0;
let scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }; // Keep this structure

// New Question Data Structure
let questions = [
    { id: 1, dimension: 'EI', text: '다른 사람들과 어울리면서 에너지를 얻는 편이다.', weight: 1 }, // E-aligned
    { id: 2, dimension: 'EI', text: '혼자만의 시간을 보내며 재충전하는 것을 선호한다.', weight: -1 }, // I-aligned
    { id: 3, dimension: 'SN', text: '새로운 아이디어나 이론보다는 실제 경험과 사실에 더 집중한다.', weight: 1 }, // S-aligned
    { id: 4, dimension: 'SN', text: '미래의 가능성을 상상하고 비유적인 것에 관심이 많다.', weight: -1 }, // N-aligned
    { id: 5, dimension: 'TF', text: '결정을 내릴 때 논리적 분석과 객관적 사실을 중요하게 생각한다.', weight: 1 }, // T-aligned
    { id: 6, dimension: 'TF', text: '결정을 내릴 때 사람들과의 관계나 감정을 우선적으로 고려한다.', weight: -1 }, // F-aligned
    { id: 7, dimension: 'JP', text: '계획을 세우고 체계적으로 일을 진행하는 것을 좋아한다.', weight: 1 }, // J-aligned
    { id: 8, dimension: 'JP', text: '상황에 따라 유연하게 대처하고 즉흥적인 것을 즐긴다.', weight: -1 }, // P-aligned
    { id: 9, dimension: 'EI', text: '파티나 모임에서 중심에 서는 것을 즐긴다.', weight: 1 }, // E-aligned
    { id: 10, dimension: 'SN', text: '구체적인 세부사항을 기억하고 잘 다루는 편이다.', weight: 1 }, // S-aligned
    { id: 11, dimension: 'TF', text: '다른 사람의 감정에 깊이 공감하고 위로를 잘 건넨다.', weight: -1 }, // F-aligned
    { id: 12, dimension: 'JP', text: '마감 기한이 다가올 때까지 일을 미루는 경향이 있다.', weight: -1 } // P-aligned
];


// Event Listener
startBtn.addEventListener('click', startTest);

// Functions
function startTest() {
    currentQuestionIndex = 0;
    scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }; // Reset scores

    // Animate out hero screen (formerly welcomeScreen)
    const heroScreen = document.getElementById('hero'); // Get hero screen
    heroScreen.style.opacity = '0';
    heroScreen.style.transform = 'translateY(20px)';

    setTimeout(() => {
        heroScreen.style.display = 'none';

        // Prepare question screen for animation
        questionScreen.style.display = 'flex'; 
        void questionScreen.offsetHeight; 

        questionScreen.style.opacity = '1';
        questionScreen.style.transform = 'translateY(0)';
        displayQuestion();
    }, 500); 
}

function displayQuestion() {
    optionsContainer.innerHTML = ''; // Clear previous options

    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionText.textContent = currentQuestion.text;

        // Update progress bar and question number
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = progress + '%';
        questionNumber.textContent = `질문 ${currentQuestionIndex + 1}/${questions.length}`;

        answerOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.text;
            // Add base .btn class and a specific class for answer options if needed
            button.className = 'btn'; // Apply base button styling
            // Add any other specific classes for answer options here if needed
            button.addEventListener('click', () => selectAnswer(option.value, currentQuestion.dimension, currentQuestion.weight));
            optionsContainer.appendChild(button);
        });
    } else {
        calculateAndShowResult();
    }
}

// Modified selectAnswer function
function selectAnswer(selectedValue, dimension, questionWeight) {
    const firstType = dimension[0];  // E.g., 'E' from 'EI'
    const secondType = dimension[1]; // E.g., 'I' from 'EI'

    if (questionWeight === 1) { // Question is aligned with the firstType (e.g., E, S, T, J)
        scores[firstType] += selectedValue;
    } else { // questionWeight === -1, question is aligned with the secondType (e.g., I, N, F, P)
        scores[secondType] += selectedValue; 
        // Alternative for weight -1: scores[firstType] -= selectedValue; 
        // If using this alternative, the calculateResult logic might need adjustment
        // to sum scores if they can be negative.
        // For now, sticking to adding positive values to the aligned type.
    }

    currentQuestionIndex++;
    displayQuestion();
}

// This function will handle the transition from question screen to result screen
function calculateAndShowResult() {
    // Calculate MBTI result string
    let mbtiResult = '';
    // For each dimension, if score for firstType > score for secondType, add firstType, else secondType
    // This assumes scores are accumulated such that a higher score means preference for that type.
    // With the current selectAnswer, a positive value for an E-leaning question adds to E.
    // A positive value for an I-leaning question adds to I.
    // So, we directly compare scores.E with scores.I.
    mbtiResult += scores.E > scores.I ? 'E' : 'I'; // If E == I, defaults to I. Adjust if specific tie-breaking needed.
    mbtiResult += scores.S > scores.N ? 'S' : 'N';
    mbtiResult += scores.T > scores.F ? 'T' : 'F';
    mbtiResult += scores.J > scores.P ? 'J' : 'P';

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
        resultText.textContent = `당신의 MBTI 유형은 ${mbtiResult} 입니다.`;

        // Update and display community link
        const linkUrl = mbtiCommunityLinks[mbtiResult];
        if (linkUrl) {
            communityLink.href = linkUrl;
            communityLink.textContent = `${mbtiResult} 유형 특징 자세히 보기`; // Updated text
            // communityLink.target = "_blank"; // Ensure this line is removed or commented out if it exists
            communityLink.style.display = 'inline-block';
            communityLinkContainer.style.display = 'block';
        } else {
            communityLink.style.display = 'none';
            communityLinkContainer.style.display = 'none';
        }

    }, 500); // Corresponds to CSS transition duration
}
// Note: The previous 'displayResult(result)' and 'calculateResult()' functions
// have been consolidated into 'calculateAndShowResult()' for a cleaner flow
// as per the simplified approach.
// The multiple definitions and re-definitions like calculateResult_revised,
// showResultScreen, updateResultText have been removed.
