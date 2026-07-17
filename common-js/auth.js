import { UserRole } from './models/userRole.js'; 

export function isTeacher (){
    
    let role=sessionStorage.getItem(user.role)
     
    if (role == UserRole.TEACHER)
        return true

    else return false

}


