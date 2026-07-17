export function loadHeader() {


const header = document.getElementById("page-header");

const auth = JSON.parse(sessionStorage.getItem("auth"));

const isSignedIn = auth?.isSignedIn || false;
const role = auth?.userRole || "";

const pages = {

    home: "/pages/homepage/homepage.html",

    login: "/pages/signIn/signIn.html",

    teacherDashboard: "/pages/dashboard/teacher-dashboard/teacher-dashboard.html",

    studentDashboard: "/pages/dashboard/student-dashboard/student-dashboard.html"

};

const dashboardPage =
    role === "Teacher"
        ? pages.teacherDashboard
        : pages.studentDashboard;

    
const extraNavLinks = isSignedIn ? `
        <a href="${dashboardPage}">Dashboard</a>
        <a href="#" id="profile-btn">Profile</a>
    ` : "";
 
    const authArea = isSignedIn ? `
        <div class="auth-buttons">
            <button id="logout-btn" class="logout-btn">
                Sign Out
            </button>
        </div>
    ` : `
        <div class="auth-buttons">
            <a href="${pages.login}" class="btn-signup">
                Sign In
            </a>
        </div>
    `;
 
    header.innerHTML = `
        <div class="header-content">
 
            <!-- Original logo image -->
            <a href="${pages.home}" class="logo">
                <img src="/assets/codeExam Logo.png" height="38" width="38" alt="Logo">
            </a>
 
            <!-- Main nav -->
            <nav>
                <a href="${pages.home}">Home</a>
                <a href="/pages/homepage/homepage.html#about-section">About</a>
                <a href="/pages/homepage/homepage.html#contact-section">Contact</a>
                ${extraNavLinks}
            </nav>
 
            <!-- Auth area -->
            ${authArea}
 
        </div>
    `;

const profileBtn = document.getElementById("profile-btn");

if(profileBtn){

    profileBtn.addEventListener("click", (e)=>{

        e.preventDefault();
            const profilePanel = document.getElementById("user-profile");
            if (profilePanel) profilePanel.style.display = "block";

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