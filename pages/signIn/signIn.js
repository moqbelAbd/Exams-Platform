function login(username, password) {

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if(user){
        if(user.role === "admin"){
            console.log("Welcome Admin");
        } else {
            console.log("Welcome User");
        }
    } else {
        console.log("Invalid username or password");
    }
}