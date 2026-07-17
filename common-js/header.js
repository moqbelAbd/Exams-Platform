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


let dashboardLink = "";
let profileButton = "";
let authButton = "";

if (isSignedIn) {

    dashboardLink = `
        <li class="nav-item">
            <a class="nav-link" href="${dashboardPage}>
                Dashboard
            </a>
        </li>
    `;

    profileButton = `
        <li class="nav-item">
            <button
                id="profile-btn"
                class="nav-link btn border-0 bg-transparent">

                Profile

            </button>
        </li>
    `;

    authButton = `
        <button
            id="logout-btn"
            class="btn btn-outline-danger">

            Sign Out

        </button>
    `;

}
else{

    authButton = `
        <a
            href="${pages.login}"
            class="btn btn-primary">

            Sign In

        </a>
    `;

}

header.innerHTML = `

<nav class="navbar navbar-expand-lg bg-white shadow-sm fixed-top">

    <div class="container">

        <a>

            <img class="navbar-brand"
                src="/assets/codeExam Logo.png"
                height="38px"
                width="38px"
                alt="Logo">

        </a>

        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar">

            <span class="navbar-toggler-icon"></span>

        </button>

        <div
            class="collapse navbar-collapse justify-content-center"
            id="navbar">

            <ul class="navbar-nav">

                <li class="nav-item">

                    <a
                        class="nav-link"
                        href="${pages.home}">

                        Home

                    </a>

                </li>

                <li class="nav-item">

                    <a
                        class="nav-link"
                        href="homepage.html#about-section">

                        About

                    </a>

                </li>

                <li class="nav-item">

                    <a
                        class="nav-link"
                        href="homepage.html#contact-section">

                        Contact

                    </a>

                </li>

                ${dashboardLink}

                ${profileButton}

            </ul>

        </div>

        ${authButton}

    </div>

</nav>

`;


const profileBtn = document.getElementById("profile-btn");

if(profileBtn){

    profileBtn.addEventListener("click", ()=>{

        document
            .getElementById("user-profile")
            .style.display = "block";

    });


    
}
    const logoutBtn = document.getElementById("logout-btn");

if(logoutBtn){

    logoutBtn.onclick = () => {

        sessionStorage.removeItem("auth");

        location.href = "homepage.html";

    };

}

}