
// STILL UNDER WORK

const tabs = document.querySelector(".tabs");

const examsTable = document.querySelector(".exams-table");
const studentsTable = document.querySelector(".students-table");

const btnAddExam = document.getElementById("add-exam-btn");
const btnAddStudent = document.getElementById("add-student-btn");

// const addBtn = document.querySelector(".add-btn");

let activeTab = 0; //  0 exams-tab  1 students-tab

tabs.addEventListener("click",function(event) {
    const target = event.target;

    if (target.classList.contains('inactive-tab')) {
        target.classList.toggle('inactive-tab');
        target.classList.toggle('active-tab');

        activeTab = (activeTab + 1) % 2;
        let nextTab;

        if (activeTab === 0 ) {
            nextTab = target.nextElementSibling;
            // addBtn.querySelector("span").textContent = "Add Exam";
            btnAddExam.style.display="flex"
            btnAddStudent.style.display="none"
        }
        else{
            nextTab = target.previousElementSibling;
            // addBtn.querySelector("span").textContent = "Add Student";
            btnAddExam.style.display="none"
            btnAddStudent.style.display="flex"
        }

        nextTab.classList.toggle('inactive-tab');
        nextTab.classList.toggle('active-tab');
        examsTable.classList.toggle('inactive-table');
        studentsTable.classList.toggle('inactive-table');
    } 
});

// --- Add Exam Redirect ---
btnAddExam.addEventListener("click", () => {
    // Navigates to the add exam page
    window.location.href = "add-exam/add-exam.html"; 
});

// --- Add Student Form Visibility ---
const addStudentContainer = document.getElementById("add-student-container");



btnAddStudent.addEventListener("click", () => {
    // Shows the add student form block
    addStudentContainer.style.display = "block"; 
});

// (Optional) Make the cancel button hide the form again
document.getElementById("add-student-cancel").addEventListener("click", () => {
    addStudentContainer.style.display = "none";
});


