import { getUsers } from './storage.js';

const AUTH_KEY = 'auth';

const pages = {

    home: "/pages/homepage/homepage.html",

    dashboard: "/pages/dashboard/dashboard.html",

};


export function login(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const sessionData = {
            isSignedIn: true,
            userId: user.id,
            userRole: user.role
        };
        
        sessionStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));

                if(user.role === "admin"){
            console.log("Welcome Admin");
        } else {
            console.log("Welcome User");
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



