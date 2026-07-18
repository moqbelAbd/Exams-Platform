
const params = new URLSearchParams(window.location.search);

const title = params.get('title');

const exams = JSON.parse(localStorage.getItem("exams"));

const exam = exams.find(exam=>exam.title === title);

const h1 = document.querySelector("h1");

h1.textContent = exam.title;


const tbody = document.querySelector("tbody");

let totalGrade = 0;
exam.questions.forEach(question =>totalGrade += question.mark);

tbody.innerHTML += `<tr>
                        <td class="title-data">ahmed</td>
                        <td>2</td>
                        <td>${totalGrade}</td>
                        <td><span class = "result-status fail">Fail</span></td>
                        <td>Jul 10, 2025 · 10:30 AM</td>
                    </tr>`