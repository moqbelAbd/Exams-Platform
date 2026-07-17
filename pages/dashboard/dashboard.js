 const auth = JSON.parse(sessionStorage.getItem("auth"));

 const role = auth?.userRole || "";

    const pages = {
        teacherDashboard: "/pages/dashboard/teacher-dashboard/teacher-dashboard.html",
        studentDashboard: "/pages/dashboard/student-dashboard/student-dashboard.html"
    };

    const dashboardPage = role === "Teacher" ? pages.teacherDashboard : pages.studentDashboard;