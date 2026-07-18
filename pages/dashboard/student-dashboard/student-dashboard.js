
// STILL UNDER WORK



// Read from storage

const users = JSON.parse(localStorage.getItem("users"));

const currentCred = JSON.parse(sessionStorage.getItem("auth"));

const currentUser = users.find(user => user.nationalId === currentCred.userId);


// welcome user by his name 

document.querySelector(".student_name").textContent = currentUser.fullName ?? "user";


// Tabs & Tables switch

const tabs = document.querySelector(".tabs");

const firstTable = document.querySelector(".available-table");
const secondTable = document.querySelector(".history-table");

let activeTab = 0; //  0 firstTable  1 secondTable

tabs.addEventListener("click",function(event) {
    const target = event.target;

    if (target.classList.contains('inactive-tab')) {
        target.classList.replace('inactive-tab', 'active-tab');

        activeTab = (activeTab + 1) % 2;
        let nextTab;

        if (activeTab === 0 ) nextTab = target.nextElementSibling;
        
        else nextTab = target.previousElementSibling;

        nextTab.classList.replace('inactive-tab', 'active-tab');

        firstTable.classList.toggle('inactive-table');
        secondTable.classList.toggle('inactive-table');
    } 
});


// search

const searchInput = document.querySelector(".searchbox > input");




searchInput.addEventListener("input",function() {

     if (activeTab === 0) {
        let exams = JSON.parse(localStorage.getItem("exams"));
        const tbody = firstTable.querySelector("tbody");
        tbody.textContent = "";

        const value = searchInput.value.toLowerCase();
        exams.forEach(exam => {
            if (exam.title.toLowerCase().startsWith(value)) {
                    addDataToTable(tbody,[exam.title,exam.questions.length,0]);
            }
        });
    }
    
    if (activeTab === 1) {
        users = JSON.parse(localStorage.getItem("users"));
        const tbody = secondTable.querySelector("tbody");
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
                        <td>
                            <button class="attempt_btn btn">
                                <i class="fa-solid fa-chevron-right"></i> Attempt
                            </button>
                        </td>
                    </tr>`
    }

    else if (activeTab == 1) { // NOT CORRECT
        element.innerHTML += 
                `<tr>
                        <td class="title-data">Ahmad Ali</td>
                        <td>@ahmed123</td>
                        <td>S-200001</td>
                        <td>
                            <button class="delete_btn btn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2 w-3 h-3" data-fg-d3bl369="0.8:66.2977:node_modules/lucide-react:913:25:42998:30:e:Trash2::::::c98" data-fgid-d3bl369=":rq9:"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                                <span>Delete</span>
                            </button>
                        </td>
                    </tr>`
    }
    
}


function triggerSearchInput() {
    searchInput.value = "";
    const event = new Event('input');
    searchInput.dispatchEvent(event);
}