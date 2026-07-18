import { UserRole } from "./models/userRole.js";
// import { isTeacher } from "./auth.js";

export function loadHeader() {

    const auth = JSON.parse(sessionStorage.getItem("auth"));
    const isSignedIn = auth?.isSignedIn || false;
    const role = auth?.userRole || "";

    const path = window.location.pathname;

    // Prevent unauthenticated users from accessing any dashboard
    if (path.includes("/pages/dashboard/") && !isSignedIn) {
        window.location.href = pages.login;
        return; // Stop execution
    }

    // Prevent students from accessing the teacher dashboard
    if (path.includes("teacher-dashboard") && role !== UserRole.TEACHER) {
        window.location.href = pages.studentDashboard;
        return;
    }

    // Prevent teachers from accessing the student dashboard (optional, but recommended)
    if (path.includes("student-dashboard") && role === UserRole.TEACHER) {
        window.location.href = pages.teacherDashboard;
        return;
    }
    
        const header = document.getElementById("page-header");
        if (!header) return;

    let basePath = "";
    
    if (path.includes("/pages/dashboard/teacher-dashboard/add-exam/")) {
        basePath = "../../../../";
    } else if (path.includes("/pages/dashboard/teacher-dashboard/")) {
        basePath = "../../../";
    } else if (path.includes("/pages/dashboard/student-dashboard/")) {
        basePath = "../../../";
    }  else if (path.includes("/pages/dashboard/")) {
        basePath = "../../";
    } else if (path.includes("/pages/")) {
        basePath = "../";
    } else {
        basePath = "./";
    }


    const pages = {
        home: "/pages/homepage/homepage.html",
        login: "/pages/signIn/signIn.html",
        teacherDashboard: "/pages/dashboard/teacher-dashboard/teacher-dashboard.html",
        studentDashboard: "/pages/dashboard/student-dashboard/student-dashboard.html"
    };


    let dashboardLink = "";
    let profileLink = "";
    let authButton = "";

    if (isSignedIn) {
        
        if(role == UserRole.TEACHER) dashboardLink = `<a href="${pages.teacherDashboard}">Dashboard</a>`;
        else dashboardLink = `<a href="${pages.teacherDashboard}">Dashboard</a>`;

        profileLink = `<a href="#" id="profile-btn">Profile</a>`;
        authButton = `
            <button class="logout-btn" id="logout-btn">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
            </button>
        `;
    } else {
        authButton = `<a href="${pages.login}" class="btn-signup">Sign In</a>`;
    }

    header.innerHTML = `
        <div class="header-content">
            <a href="${pages.home}" class="logo">
                <img src="/assets/codeExam Logo.png" height="36" width="36" alt="Logo">
                <span>ExamTrack</span>
            </a>
            <nav>
                <a href="${pages.home}">Home</a>
                <a href="${pages.home}#about-section">About</a>
                <a href="${pages.home}#contact-section">Contact</a>
                ${dashboardLink}
                ${profileLink}
            </nav>
            <div class="auth-buttons">
                ${authButton}
            </div>
        </div>
    `;

    const profileBtn = document.getElementById("profile-btn");
    if (profileBtn) {
        profileBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const profilePanel = document.getElementById("user-profile");
            if (profilePanel) {
                profilePanel.style.display = profilePanel.style.display === "block" ? "none" : "block";
            }
        });
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("auth");
            location.href = pages.home;
        });
    }
}
