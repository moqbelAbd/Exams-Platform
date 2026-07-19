
const params = new URLSearchParams(window.location.search);

const title = params.get('title');

const users = JSON.parse(localStorage.getItem("users")) ?? [];

const examAttempts = JSON.parse(localStorage.getItem("examAttempts")) ?? [];


const attempts = examAttempts.filter(attempt =>attempt.examTitle === title);

const h1 = document.querySelector("h1");

h1.textContent = title;


const tbody = document.querySelector("tbody");

let totalGrade = 0;
attempts[0].questions.forEach(question =>totalGrade += question.mark);

document.querySelector(".total_attempts").textContent = attempts.length;
document.querySelector(".passed").textContent = attempts.filter(attempt=>attempt.success === true).length;
document.querySelector(".total_grade").textContent = totalGrade;

attempts.forEach(attempt =>{
    const user = users.find(user=>user.nationalId === attempt.userId);

    tbody.innerHTML += `<tr>
                            <td class="title-data">${user.fullName}</td>
                            <td>${attempt.grade}</td>
                            <td>${totalGrade}</td>
                            <td><span class = "result-status ${attempt.success? "pass":"fail"}">${attempt.success? "Success":"Fail"}</span></td>
                            <td>${attempt.attemptTimestamp}</td>
                        </tr>`;
});