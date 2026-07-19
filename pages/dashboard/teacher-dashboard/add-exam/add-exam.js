import { QuestionType } from "../../../../common-js/models/questionType.js";
import { ExamStatus } from "../../../../common-js/models/examStatus.js";
import { fetchTriviaQuestions } from "./questions-api.js";

document.addEventListener('DOMContentLoaded', () => {
    const queContainer = document.querySelector('.que-container');
    const addQuestionBtn = document.getElementById('add-question-btn');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const backBtn = document.getElementById('back-btn');
    const examTitleInput = document.getElementById('exam-title');
    const generateTriviaBtn = document.getElementById('generate-trivia-btn');

    let questionIdCounter = 0;

    addQuestionBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add Question`;

    const QUESTION_TYPES = {
        [QuestionType.MCQ]: 'Multiple Choice (MCQ)',
        [QuestionType.TRUE_FALSE]: 'True / False',
        [QuestionType.MULTIPLE]: 'Multiple Select',
        [QuestionType.SHORT]: 'Short Answer (Number)'
    };


    function optionRows() {
        return [1, 2, 3, 4].map(n => `
            <div class="option-row">
                <span class="option-label">Option ${n}</span>
                <input type="text" class="form-input option-input" data-option="${n}" placeholder="Option ${n}">
            </div>
        `).join('');
    }

    function dynamicAreaMarkup(type) {
        if (type === QuestionType.MCQ) {
            return `
                <div class="options-group" data-role="options">

                    <label>Options</label>
                    ${optionRows()}
                </div>
                <div class="answer-group" data-role="answer">
                    <label>Correct Answer</label>
                    <select class="form-input correct-answer-select">
                        <option value="" disabled selected>Select correct answer</option>
                        ${[1, 2, 3, 4].map(n => `<option value="${n}">Option ${n}</option>`).join('')}
                    </select>
                </div>
            `;
        }

        if (type === QuestionType.TRUE_FALSE) {
            return `
                <div class="answer-group" data-role="answer">
                    <label>Correct Answer</label>
                    <select class="form-input correct-answer-select">
                        <option value="" disabled selected>Select correct answer</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                </div>
            `;
        }

        if (type === QuestionType.MULTIPLE) {
            return `
                <div class="options-group" data-role="options">
                    <label>Options</label>
                    ${optionRows()}
                </div>
                <div class="answer-group" data-role="answer">
                    <label>Correct Answer(s)</label>
                    <div class="checkbox-group">
                        ${[1, 2, 3, 4].map(n => `
                            <label class="checkbox-option">
                                <input type="checkbox" class="correct-answer-checkbox" value="${n}">
                                <span>Option ${n}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        if (type === QuestionType.SHORT) {
            return `
                <div class="answer-group" data-role="answer">
                    <label>Correct Answer</label>
                    <input type="number" class="form-input correct-answer-number" placeholder="Enter numeric answer">
                </div>
            `;
        }

        return '';
    }

    function questionTypeOptions() {
        return Object.entries(QUESTION_TYPES)
            .map(([value, label]) => `<option value="${value}">${label}</option>`)
            .join('');
    }


    function createQuestionCard(prefillData = null) {
        questionIdCounter++;
        const qId = questionIdCounter;

        const card = document.createElement('div');
        card.className = 'question-card';
        card.dataset.qid = qId;

        card.innerHTML = `
            <div class="question-card-header">
                <h3 class="question-title">Question</h3>
                <button type="button" class="remove-btn">
                    <i class="fa-solid fa-trash"></i> Remove
                </button>
            </div>

            <div class="form-group">
                <label>Question Text</label>
                <textarea class="form-input question-text" rows="2" placeholder="Enter question text..."></textarea>
            </div>

            <div class="form-row">
                <div class="form-col">
                    <label>Type</label>
                    <select class="form-input question-type">
                        ${questionTypeOptions()}
                    </select>
                </div>
                <div class="form-col">
                    <label>Mark</label>
                    <input type="number" class="form-input question-mark" value="10" min="0">
                </div>
            </div>

            <div class="question-dynamic-area">
                ${dynamicAreaMarkup(QuestionType.MCQ)}
            </div>
        `;

        queContainer.appendChild(card);

if (prefillData && prefillData.questionText) {
            const typeSelect = card.querySelector('.question-type');
            const dynamicArea = card.querySelector('.question-dynamic-area');

            if (prefillData.rawType === 'boolean') {
                // 1. Handle True/False Questions
                typeSelect.value = QuestionType.TRUE_FALSE;
                dynamicArea.innerHTML = dynamicAreaMarkup(QuestionType.TRUE_FALSE);
                
                card.querySelector('.question-text').value = prefillData.questionText;
                
                // The API returns "True" or "False". We need it lowercase to match your <option value="true">
                const correctValue = prefillData.correctAnswer.toLowerCase();
                card.querySelector('.correct-answer-select').value = correctValue;

            } else {
                // 2. Handle Multiple Choice Questions
                typeSelect.value = QuestionType.MCQ;
                dynamicArea.innerHTML = dynamicAreaMarkup(QuestionType.MCQ);

                card.querySelector('.question-text').value = prefillData.questionText;
                
                // Fill in the 4 shuffled options
                const optionInputs = card.querySelectorAll('.option-input');
                prefillData.options.forEach((optText, idx) => {
                    if (optionInputs[idx]) {
                        optionInputs[idx].value = optText;
                    }
                });
                
                // Set the dropdown to the correct answer index
                card.querySelector('.correct-answer-select').value = prefillData.correctIndex;
            }
        }

        renumberQuestions();
    }

    function renumberQuestions() {
        const cards = queContainer.querySelectorAll('.question-card');
        cards.forEach((card, idx) => {
            card.querySelector('.question-title').textContent = `Question ${idx + 1}`;
        });
    }


    queContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('question-type')) {
            const card = e.target.closest('.question-card');
            const dynamicArea = card.querySelector('.question-dynamic-area');
            dynamicArea.innerHTML = dynamicAreaMarkup(e.target.value);
        }
    });

    queContainer.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-btn');
        if (!removeBtn) return;

        const card = removeBtn.closest('.question-card');
        card.remove();
        renumberQuestions();
    });

     addQuestionBtn.addEventListener('click', () => createQuestionCard());

    backBtn?.addEventListener('click', () => {
        window.history.back();
    });

    cancelBtn.addEventListener('click', () => {
        if (confirm('Discard this exam? Unsaved changes will be lost.')) {
            window.history.back();
        }
    });


    function collectExamData() {
        const title = examTitleInput.value.trim();
        const cards = Array.from(queContainer.querySelectorAll('.question-card'));

        if (!title) {
            alert('Please enter an exam title.');
            return null;
        }

        if (cards.length === 0) {
            alert('Please add at least one question.');
            return null;
        }

        const questions = [];

        for (const card of cards) {
        const type = card.querySelector('.question-type').value;
        const text = card.querySelector('.question-text').value.trim();
        const mark = Number(card.querySelector('.question-mark').value);

        if (!text) {
            alert('Please fill in the question text for every question.');
            return null;
        }

        // 1. ADD THIS: Generate a unique ID for the question
        const question = { 
            id: 'Q-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
            type, text, mark 
        };

        if (type === QuestionType.MCQ) {
            const options = Array.from(card.querySelectorAll('.option-input')).map(i => i.value.trim());
            const correct = card.querySelector('.correct-answer-select').value; // returns '1', '2', '3', '4'

            if (options.some(o => !o)) {
                alert('Please fill in all 4 options.');
                return null;
            }
            if (!correct) {
                alert('Please select the correct answer for each MCQ question.');
                return null;
            }

            question.options = options;
            // 2.   Save the actual text of the option, not the index number
            question.correctAnswer = options[Number(correct) - 1];
        }

        if (type === QuestionType.TRUE_FALSE) {
            const correct = card.querySelector('.correct-answer-select').value;
            if (!correct) {
                alert('Please select True or False for each True/False question.');
                return null;
            }
            // 3.   Save the exact string "True" or "False"
            question.correctAnswer = correct === 'true' ? 'True' : 'False';
        }

        if (type === QuestionType.MULTIPLE) {
            const options = Array.from(card.querySelectorAll('.option-input')).map(i => i.value.trim());
            const correct = Array.from(card.querySelectorAll('.correct-answer-checkbox:checked'))
                .map(c => Number(c.value));

            if (options.some(o => !o)) {
                alert('Please fill in all 4 options.');
                return null;
            }
            if (correct.length === 0) {
                alert('Please select at least one correct answer for each multiple select question.');
                return null;
            }

            question.options = options;
            // 4.   Map indexes to actual text arrays, and name the key "correctAnswer" (Singular) to match grading
            question.correctAnswer = correct.map(index => options[index - 1]);
        }

        if (type === QuestionType.SHORT) {
            const raw = card.querySelector('.correct-answer-number').value;
            if (raw === '') {
                alert('Please enter a numeric answer for each short answer question.');
                return null;
            }
            // Keep as string to ensure exact text matching later
            question.correctAnswer = raw.trim(); 
        }

        questions.push(question);
    }

        return { title, questions };
    }


    generateTriviaBtn.addEventListener('click', async () => {
        const originalText = generateTriviaBtn.innerHTML;
        generateTriviaBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
        generateTriviaBtn.disabled = true;

        const triviaQuestions = await fetchTriviaQuestions();
        
        if (triviaQuestions && triviaQuestions.length > 0) {
            // Remove the default blank question if it hasn't been typed in yet
            const existingCards = queContainer.querySelectorAll('.question-card');
            if (existingCards.length === 1) {
                const firstText = existingCards[0].querySelector('.question-text').value;
                if (!firstText) {
                    existingCards[0].remove();
                }
            }

            // Create a card for every fetched question
            triviaQuestions.forEach(qData => {
                createQuestionCard(qData);
            });
        } else {
            alert('Failed to load trivia questions. Check console for details.');
        }

        // Restore button state
        generateTriviaBtn.innerHTML = originalText;
        generateTriviaBtn.disabled = false;
        
    });


    saveBtn.addEventListener('click', () => {
        const examData = collectExamData();
        if (!examData) return;

        const exam = {
            examId: "EXAM-" + Date.now(), // Creates a unique ID based on the current timestamp
            status: ExamStatus.ACTIVE,
            ...examData // Spreads the title and questions we collected
        };

        let exams = JSON.parse(localStorage.getItem("exams")) || [];
        exams.push(exam);
        localStorage.setItem("exams", JSON.stringify(exams));

        window.location.href = "/pages/dashboard/teacher-dashboard/teacher-dashboard.html";
        // alert("Exam saved successfully!");
    });

    // start with one question by default
    createQuestionCard();
});