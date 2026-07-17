import { getUsers } from "../../common-js/storage.js";
import { UserRole } from "../../common-js/models/userRole.js";

const AUTH_KEY = 'auth';

const pages = {
    home: "/pages/homepage/homepage.html",
    dashboard: "/pages/dashboard/dashboard.html",
};

let signInBtn=document.getElementById("sign-in-btn")
let usernameInput=document.getElementById("username-input")
let passwordInput=document.getElementById("password-input")

signInBtn.addEventListener("click", (e) => {
    //  PREVENT the <form> from refreshing the page
    e.preventDefault();

    const currentUsername = usernameInput.value;
    const currentPassword = passwordInput.value;

    login(currentUsername, currentPassword);
});

export function login(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const sessionData = {
            isSignedIn: true,
            userId: user.nationalId,
            userRole: user.role
        };
        
        sessionStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));

                if(user.role === UserRole.TEACHER){
            console.log("Welcome Teacher");
        } else {
            console.log("Welcome Student");
        }
        
             window.location.href = pages.dashboard; 

        return true;
    }
    
  else {
        console.log("Invalid username or password");
    }
}

// export function logout() {
//     sessionStorage.removeItem(AUTH_KEY);
//      window.location.href = pages.home; 
// }



