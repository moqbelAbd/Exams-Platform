
// STILL UNDER WORK

const tabs = document.querySelector(".tabs");

const examsTable = document.querySelector(".exams-table");
const studentsTable = document.querySelector(".students-table");

const addBtn = document.querySelector(".add-btn");

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
            addBtn.querySelector("span").textContent = "Add Exam";
        }
        else{
            nextTab = target.previousElementSibling;
            addBtn.querySelector("span").textContent = "Add Student";
        }

        nextTab.classList.toggle('inactive-tab');
        nextTab.classList.toggle('active-tab');
        examsTable.classList.toggle('inactive-table');
        studentsTable.classList.toggle('inactive-table');
    } 
});


