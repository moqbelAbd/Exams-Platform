console.log('attempt-exam.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    //  DOM Element Selections
    const examTitleEl = document.getElementById("attempt-exam-title");
    const questionsQuantityEl = document.getElementById("exam-questions-quantity");
    const totalMarkEl = document.getElementById("attempt-exam-total-mark");
    const formEl = document.getElementById("attempt-exam-form");
    const questionsWrapper = document.getElementById("questions-wrapper");

    const EXAMS_STORAGE_KEY = 'exams';
    const ATTEMPTS_STORAGE_KEY = 'examAttempts';
    const PASS_THRESHOLD = 0.50; // 50% required to pass

    let currentExam = null;

    function getExamId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('examId');
    }

    function getCurrentUser() {

        const raw = sessionStorage.getItem('auth');
            let currentUser= JSON.parse(raw)
            let currentUserId= currentUser.userId

        return currentUserId
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str ?? '';
        return div.innerHTML;
    }

    // 3. Load and Render Exam
    function loadExam() {
        const examId = getExamId();
        if (!examId) {
            examTitleEl.textContent = "Error: No Exam ID provided.";
            return;
        }

        const exams = JSON.parse(localStorage.getItem(EXAMS_STORAGE_KEY) || '[]');
        currentExam = exams.find(e => String(e.examId) === String(examId));

        if (!currentExam) {
            examTitleEl.textContent = "Error: Exam not found.";
            return;
        }

        // Render Header Info
        examTitleEl.textContent = currentExam.title
        
        const totalQuestions = currentExam.questions ? currentExam.questions.length : 0;
        questionsQuantityEl.textContent = `${totalQuestions} Questions`;

        const totalMarks = currentExam.questions.reduce((sum, q) => sum + Number(q.mark), 0);
        totalMarkEl.textContent = `Total Marks: ${totalMarks}`;

        // Render Questions
        renderQuestions(currentExam.questions);
    }

    function renderQuestions(questions) {
        questionsWrapper.innerHTML = questions.map((q, index) => {
            return `
                <div class="attempt-question-container card mb-4 p-3">
                    <div class="attempt-question-header d-flex justify-content-between mb-3">
                        <p class="attempt-question-title fw-bold mb-0">Q${index + 1}. ${escapeHtml(q.text)}</p>
                        <p class="attempt-question-mark text-muted mb-0">[${q.mark} Marks]</p>
                    </div>
                    <div class="attempt-question-answers">
                        ${renderAnswerInput(q)}
                    </div>
                </div>
            `;
        }).join('');
    }

function renderAnswerInput(question) {
        // Render Radio Buttons for MCQ and True/False
        if (question.type === 'MCQ' || question.type === 'TRUE_FALSE') {
            const options = question.options || ['True', 'False']; 
            return options.map(opt => `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="question_${question.id}" value="${escapeHtml(opt)}" id="q_${question.id}_${escapeHtml(opt)}" required>
                    <label class="form-check-label" for="q_${question.id}_${escapeHtml(opt)}">
                        ${escapeHtml(opt)}
                    </label>
                </div>
            `).join('');
        }
        
        // Render Checkboxes for Multiple Select
        if (question.type === 'MULTIPLE') {
            const options = question.options || [];
            return options.map(opt => `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="question_${question.id}" value="${escapeHtml(opt)}" id="q_${question.id}_${escapeHtml(opt)}">
                    <label class="form-check-label" for="q_${question.id}_${escapeHtml(opt)}">
                        ${escapeHtml(opt)}
                    </label>
                </div>
            `).join('');
        }
        
        // Default to short answer text input
        return `<input type="text" class="form-control" name="question_${question.id}" placeholder="Type your answer here..." required>`;
    }

    // 4. Handle Submission and Grading
    formEl.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!currentExam || !currentExam.questions) return;

        const formData = new FormData(formEl);
        const currentUser = getCurrentUser();
        
        let totalScored = 0;
        let totalPossibleMarks = 0;
        
        // Grade the questions and build the studentAnswers array
        const studentAnswers = currentExam.questions.map((q, index) => {
            const markVal = Number(q.mark);
            totalPossibleMarks += markVal;

            // Get student's answer from form
            const answerRaw = formData.getAll(`question_${q.id}`);
            const studentAnswer = answerRaw.length > 1 ? answerRaw.join(', ') : (answerRaw[0] || "");

            // Simple comparison logic (case-insensitive)
            const correctAnsStr = Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : String(q.correctAnswer);
            const isCorrect = String(studentAnswer).trim().toLowerCase() === String(correctAnsStr).trim().toLowerCase();

            const scored = isCorrect ? markVal : 0;
            totalScored += scored;

            return {
                questionId: q.id,
                number: index + 1,      // Added for review page compatibility
                text: q.text,           // Added for review page compatibility
                mark: markVal,          // Added for review page compatibility
                scored: scored,         // Added for review page compatibility
                answer: studentAnswer,
                yourAnswer: studentAnswer, // Added for review page compatibility
                correctAnswer: q.correctAnswer, // Added for review page compatibility
                isCorrect: isCorrect
            };
        });

        const percent = totalPossibleMarks > 0 ? (totalScored / totalPossibleMarks) : 0;
        const success = percent >= PASS_THRESHOLD;

        // Build the Final Attempt Object
        const attemptObject = {
            attemptId: `ATT-${Date.now()}`, 
            userId: currentUser,
            examId: currentExam.examId,
            examTitle: currentExam.title,
            studentAnswers: studentAnswers,
            questions: studentAnswers, // Included for compatibility with your existing exam-review.js
            grade: totalScored,
            success: success,
            attemptTimestamp: new Date().toLocaleString()
        };

      // 5. Save to Local Storage
        const allAttempts = JSON.parse(localStorage.getItem(ATTEMPTS_STORAGE_KEY) || '[]');
        allAttempts.push(attemptObject);
        localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(allAttempts));

        // 6. Show Theme-Based Feedback Instead of Alert
        const overlay = document.getElementById('feedback-overlay');
        const icon = document.getElementById('feedback-icon');
        const title = document.getElementById('feedback-title');
        const message = document.getElementById('feedback-message');
        const continueBtn = document.getElementById('feedback-continue-btn');

        // Remove any previous theme classes and make the overlay visible
        overlay.classList.remove('d-none', 'theme-pass', 'theme-fail');
        
        const finalPercentage = Math.round(percent * 100);

        if (success) {
            overlay.classList.add('theme-pass');
            icon.innerHTML = '<i class="fa-solid fa-face-smile-beam"></i>'; // Happy FontAwesome Icon
            title.textContent = 'Congratulations!';
            message.textContent = `You passed the exam with a score of ${finalPercentage}%. Great job!`;
            continueBtn.textContent = 'Continue to Dashboard';
        } else {
            overlay.classList.add('theme-fail');
            icon.innerHTML = '<i class="fa-solid fa-face-frown-open"></i>'; // Sad FontAwesome Icon
            title.textContent = 'Exam Failed';
            message.textContent = `You scored ${finalPercentage}%`;
            continueBtn.textContent = 'Return to Dashboard';
        }

        continueBtn.addEventListener('click', () => {
            window.location.href = '/pages/dashboard/student-dashboard/student-dashboard.html?tab=history';
        });
    });

    loadExam();
});