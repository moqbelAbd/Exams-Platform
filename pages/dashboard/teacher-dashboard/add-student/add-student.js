import { getUsers, saveStudent } from "../../../../common-js/storage.js";
import { isTeacher } from "../../../../common-js/auth.js";
import { UserRole } from "../../../../common-js/models/userRole.js";

// DOM Elements
const form = document.getElementById("add-student-form");
const fullNameInput = document.getElementById("add-fullname");
const nationalIdInput = document.getElementById("add-national-id");
const phoneInput = document.getElementById("add-phone");
const usernameInput = document.getElementById("add-username");
const passwordInput = document.getElementById("add-password");
const cancelBtn = document.getElementById("add-student-cancel");
const container = document.getElementById("add-student-container");

// --- 1. Dynamic Credential Generation ---
fullNameInput.addEventListener("input", (e) => {
    const fullName = e.target.value.trim();
    
    if (fullName.length > 0) {
        const firstName = fullName.split(" ")[0].toLowerCase();
        const randomNum = Math.floor(Math.random() * 900) + 100; 
        
        usernameInput.value = `${firstName}${randomNum}`;
        passwordInput.value = Math.random().toString(36).slice(-8); 
    } else {
        usernameInput.value = "";
        passwordInput.value = "";
    }
});

// --- 2. Copy Button Logic ---
document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const targetId = e.currentTarget.getAttribute("data-target");
        const inputElement = document.getElementById(targetId);
        
        if (inputElement.value) {
            navigator.clipboard.writeText(inputElement.value);
            
            // Visual feedback using CSS variables
            const icon = e.currentTarget.querySelector("i");
            icon.className = "fa-solid fa-check";
            icon.style.color = "var(--success)";
            
            setTimeout(() => {
                icon.className = "fa-regular fa-copy";
                icon.style.color = ""; // reset color
            }, 1500);
        }
    });
});

// --- 3. Form Submission ---
form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!isTeacher()) {
        alert("Unauthorized Action: Only teachers can add new students.");
        return;
    }

    const users = getUsers();
    const exists = users.find(u => u.nationalId === nationalIdInput.value);
    if (exists) {
        alert("Error: A student with this National ID already exists.");
        return;
    }

    const newStudent = {
        fullName: fullNameInput.value.trim(),
        PhoneNumber: phoneInput.value.trim(),
        nationalId: nationalIdInput.value.trim(),
        username: usernameInput.value,
        password: passwordInput.value,
        role: UserRole.STUDENT
    };

    users.push(newStudent);
    saveStudent(users);

    // alert("Student successfully added!");
    form.reset(); 

    const searchInput = document.querySelector(".searchbox > input");
    searchInput.value = "";
    const event = new Event('input');
    searchInput.dispatchEvent(event);
});

cancelBtn.addEventListener("click", () => {
    form.reset();
    container.style.display = "none";
});