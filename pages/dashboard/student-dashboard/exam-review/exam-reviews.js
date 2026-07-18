console.log('exam-review.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('exam-review.js: DOM ready, initializing page');
    const backBtn = document.getElementById('back-btn');
    const titleEl = document.getElementById('exam-title');
    const subtitleEl = document.getElementById('exam-subtitle');
    const gradeSummaryEl = document.getElementById('grade-summary');
    const reviewListEl = document.getElementById('review-list');

    backBtn?.addEventListener('click', () => {
        window.history.back();
    });

    const ATTEMPTS_STORAGE_KEY = 'examAttempts'; 
    const PASS_THRESHOLD = 50; // percent required to pass

    function getAttemptId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('attemptId') || params.get('id');
    }

    function getAllAttempts() {
        try {
            const raw = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (err) {
            console.error('Failed to read exam attempts from localStorage:', err);
            return [];
        }
    }

    function getAttemptFromStorage(attemptId) {
        const attempts = getAllAttempts();
        return attempts.find(a => String(a.id) === String(attemptId)) || null;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str ?? '';
        return div.innerHTML;
    }


    function showError(message) {
        titleEl.textContent = 'Exam Review';
        subtitleEl.textContent = 'Answer Review';
        gradeSummaryEl.className = 'grade-summary';
        gradeSummaryEl.innerHTML = '';
        reviewListEl.innerHTML = `<p class="review-state-msg error">${escapeHtml(message)}</p>`;
    }


    function loadExamReview() {
        const attemptId = getAttemptId();

        if (!attemptId) {
            showError('No exam attempt specified. Open this page with a valid attempt ID, e.g. exam-review.html?attemptId=123.');
            return;
        }

        const attempt = getAttemptFromStorage(attemptId);

        if (!attempt) {
            showError('This exam attempt could not be found. It may have been cleared from local storage.');
            return;
        }

        render(attempt);
    }


    function render(data) {
        const totalMarks = data.questions.reduce((sum, q) => sum + q.mark, 0);
        const totalScored = data.questions.reduce((sum, q) => sum + q.scored, 0);
        const percent = totalMarks > 0 ? Math.round((totalScored / totalMarks) * 100) : 0;
        const passed = percent >= PASS_THRESHOLD;

        titleEl.textContent = data.examTitle || data.title || 'Exam Review';
        subtitleEl.textContent = 'Answer Review';

        renderGradeSummary(totalScored, totalMarks, percent, passed);
        renderQuestions(data.questions);
    }

    function renderGradeSummary(scored, total, percent, passed) {
        gradeSummaryEl.className = `grade-summary ${passed ? 'pass' : 'fail'}`;
        gradeSummaryEl.innerHTML = `
            <div>
                <div class="grade-summary-label">Final Grade</div>
                <div class="grade-summary-score">
                    <span class="score-main">${scored}</span>
                    <span class="score-total">/ ${total}</span>
                </div>
            </div>
            <div class="grade-summary-right">
                <div class="grade-badge ${passed ? 'pass' : 'fail'}">${passed ? 'PASS' : 'FAIL'}</div>
                <div class="grade-summary-percent">${percent}%</div>
            </div>
        `;
    }

    function renderQuestions(questions) {
        reviewListEl.innerHTML = questions.map(q => questionCardMarkup(q)).join('');
    }

    function questionCardMarkup(q) {
        const statusClass = q.isCorrect ? 'correct' : 'incorrect';
        const icon = q.isCorrect ? 'fa-circle-check' : 'fa-circle-xmark';
        const statusLabel = q.isCorrect ? 'Correct' : 'Incorrect';

        return `
            <div class="review-card ${statusClass}">
                <div class="review-card-top">
                    <div class="review-status-line">
                        <span class="status-badge ${statusClass}">
                            <i class="fa-solid ${icon}"></i> ${statusLabel}
                        </span>
                        <span class="question-text">Q${q.number}. ${escapeHtml(q.text)}</span>
                    </div>
                    <span class="score-pill">${q.scored} / ${q.mark}</span>
                </div>
                <div class="your-answer-row">
                    <span class="your-answer-label">Your Answer</span>
                    <span class="your-answer-value">${escapeHtml(q.yourAnswer)}</span>
                </div>
                ${!q.isCorrect && q.correctAnswer ? `
                <div class="correct-answer-value">
                    Correct Answer: <strong>${escapeHtml(q.correctAnswer)}</strong>
                </div>` : ''}
            </div>
        `;
    }

    loadExamReview();

    window.renderExamReview = render;
});