
// STILL UNDER WORK


// --- DOM Elements ---
const tabs = document.querySelector(".tabs");
const examsTable = document.querySelector(".exams-table");
const studentsTable = document.querySelector(".students-table");
const btnAddExam = document.getElementById("add-exam-btn");
const btnAddStudent = document.getElementById("add-student-btn");
const searchInput = document.querySelector(".searchbox > input");
const addStudentContainer = document.getElementById("add-student-container");


let users = JSON.parse(localStorage.getItem("users"));
let activeTab = 0; // 0: exams-tab, 1: students-tab


tabs.addEventListener("click",function(event) {
    const target = event.target;

    if (target.classList.contains('inactive-tab')) {
        target.classList.replace('inactive-tab', 'active-tab');

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

        searchInput.value = "";
        const event = new Event('input');
        searchInput.dispatchEvent(event);
    } 
});

// --- Add Exam Redirect ---
btnAddExam.addEventListener("click", () => {
    // Navigates to the add exam page
    window.location.href = "add-exam/add-exam.html"; 
});

// --- Add Student Form Visibility ---




btnAddStudent.addEventListener("click", () => {
    // Shows the add student form block
    addStudentContainer.style.display = "block"; 
});

// (Optional) Make the cancel button hide the form again
document.getElementById("add-student-cancel").addEventListener("click", () => {
    addStudentContainer.style.display = "none";
});


// search input

searchInput.addEventListener("input",function() {

     if (activeTab === 0) {
        let exams = JSON.parse(localStorage.getItem("exams"));
        const tbody = examsTable.querySelector("tbody");
        tbody.textContent = "";

        const value = searchInput.value.toLowerCase();
        exams.forEach(exam => {
            if (exam.title.toLowerCase().startsWith(value)) {
                    addDataToTable(tbody,[exam.title,exam.questions.length,0,0,0]);
            }
        });
    }
    
    if (activeTab === 1) {
        users = JSON.parse(localStorage.getItem("users"));
        const tbody = studentsTable.querySelector("tbody");
        tbody.textContent = "";

        const value = searchInput.value.toLowerCase();
        users.forEach(user => {
            if (user.fullName.toLowerCase().startsWith(value) || 
                user.username.toLowerCase().startsWith(value)) {
                    addDataToTable(tbody,[user.fullName,user.username,user.nationalId]);
            }
        });
    }
})

triggerSearchInput();


function addDataToTable(element,dataArr) {

    if (activeTab == 0) {
        element.innerHTML +=
                `<tr>
                    <td class="title-data">${dataArr[0]}</td>
                    <td>${dataArr[1]}</td>
                    <td>${dataArr[2]}</td>
                    <td><span class = "exam-status active">${dataArr[2]}</span></td>

                    <td>
                        <button class="exam-set_active btn">Set Inactive</button>
                    </td>
                    <td>
                        <button class="attempts_btn btn">
                            <svg viewBox="0 0 24 24" fill="none">
                                <g clip-path="url(#clip0_15_200)">
                                <circle cx="12" cy="13" r="2" stroke="currentColor" stroke-linejoin="round"/>
                                <path d="M12 7.5C7.69517 7.5 4.47617 11.0833 3.39473 12.4653C3.14595 12.7832 3.14595 13.2168 3.39473 13.5347C4.47617 14.9167 7.69517 18.5 12 18.5C16.3048 18.5 19.5238 14.9167 20.6053 13.5347C20.8541 13.2168 20.8541 12.7832 20.6053 12.4653C19.5238 11.0833 16.3048 7.5 12 7.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_15_200">
                                <rect width="24" height="24" fill="white"/>
                                </clipPath>
                                </defs>
                            </svg>
                            <span>Attempts (1)</span>
                        </button>
                    </td>
                </tr>`
    }


    else if (activeTab == 1) {
        element.innerHTML += 
                `<tr>
                    <td class="title-data">${dataArr[0]}</td>
                    <td>${dataArr[1]}</td>
                    <td>${dataArr[2]}</td>
                    <td>
                        <button class="delete_btn btn" onclick="deleteStudent('${dataArr[1]}')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2 w-3 h-3" data-fg-d3bl369="0.8:66.2977:node_modules/lucide-react:913:25:42998:30:e:Trash2::::::c98" data-fgid-d3bl369=":rq9:"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                            <span>Delete</span>
                        </button>
                    </td>
                </tr>`
    }
    
}

function deleteStudent(userName) {
    users = users.filter(user=> {
        return user.username !== userName;
    });
    
    localStorage.setItem("users",JSON.stringify(users));
    triggerSearchInput();
}

function triggerSearchInput() {
    searchInput.value = "";
    const event = new Event('input');
    searchInput.dispatchEvent(event);
}

