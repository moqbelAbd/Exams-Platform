import { UserRole } from './models/userRole.js'; 

export function isTeacher() {

    const authString = sessionStorage.getItem("auth");

    if (!authString) {
        return false;
    }

    try {
        // 3. Parse the string back into a JavaScript object
        const auth = JSON.parse(authString);
        
        console.log(auth.userRole);
        
        // 4. Use strict equality and return the evaluated boolean directly
        return auth.userRole === UserRole.TEACHER;
        
    } catch (error) {
        // Fallback just in case the stored data isn't valid JSON
        console.error("Failed to parse auth data from sessionStorage", error);
        return false;
    }
}