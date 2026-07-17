import { getUsers } from './storage.js';

export function loadProfile() {
    const profileContainer = document.getElementById("user-profile");
    
    if (!profileContainer) return;

    const authString = sessionStorage.getItem("auth");
    if (!authString) return; 

    const auth = JSON.parse(authString);
    const users = getUsers();
    
    // Find the currently logged-in user's complete data
    const currentUser = users.find(u => u.nationalId === auth.userId);
    if (!currentUser) return;

    // Inject the Modal HTML matching the design system
    profileContainer.innerHTML = `
        <div class="profile-modal-content shadow-lg">
            
            <!-- Header -->
            <div class="profile-header d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
                <h5 class="m-0 fw-bold" style="color: var(--secondary);">Profile</h5>
                <button id="close-profile-btn" class="btn-close" aria-label="Close"></button>
            </div>
            
            <!-- Body -->
            <div class="profile-body p-4 text-center">
                
                <!-- Avatar -->
                <div class="avatar-circle mx-auto d-flex align-items-center justify-content-center rounded-circle mb-3">
                    <i class="fa-regular fa-user fs-2"></i>
                </div>
                
                <!-- User Info -->
                <h5 class="fw-bold mb-1" style="color: var(--secondary);">${currentUser.fullName}</h5>
                <p class="mb-2" style="color: var(--text-secondary); font-size: 0.9rem;">@${currentUser.username}</p>
                
                <!-- Role Badge -->
                <span class="badge rounded-pill px-3 py-2 mb-4 role-badge">
                    <i class="fa-solid fa-shield-halved me-1"></i> ${currentUser.role}
                </span>
                
                <!-- Details List -->
                <ul class="list-group list-group-flush text-start mt-2">
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                        <span style="color: var(--text-secondary); font-size: 0.9rem;">Full Name</span>
                        <span class="fw-medium" style="color: var(--secondary); font-size: 0.9rem;">${currentUser.fullName}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                        <span style="color: var(--text-secondary); font-size: 0.9rem;">Username</span>
                        <span class="fw-medium" style="color: var(--secondary); font-size: 0.9rem;">${currentUser.username}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                        <span style="color: var(--text-secondary); font-size: 0.9rem;">National ID</span>
                        <span class="fw-medium" style="color: var(--secondary); font-size: 0.9rem;">${currentUser.nationalId}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                        <span style="color: var(--text-secondary); font-size: 0.9rem;">Phone Number</span>
                        <span class="fw-medium" style="color: var(--secondary); font-size: 0.9rem;">${currentUser.PhoneNumber || 'N/A'}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-0">
                        <span style="color: var(--text-secondary); font-size: 0.9rem;">Role</span>
                        <span class="fw-medium" style="color: var(--secondary); font-size: 0.9rem;">${currentUser.role}</span>
                    </li>
                </ul>
            </div>
        </div>
    `;

    // Event Listener for the X Button
    const closeBtn = document.getElementById("close-profile-btn");
    closeBtn.addEventListener("click", () => {
        profileContainer.style.display = "none";
    });

    //  Close modal when clicking on the blurred background overlay outside the modal box
    profileContainer.addEventListener("click", (e) => {
        if (e.target === profileContainer) {
            profileContainer.style.display = "none";
        }
    });
}