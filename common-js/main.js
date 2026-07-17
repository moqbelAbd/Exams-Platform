import { loadHeader } from "./header.js";
import { initializeStorage } from './storage.js';
import { isTeacher } from './auth.js'; 
import { loadProfile } from "./user-profile.js";

// Global Event Listener: Runs immediately when any HTML page loads
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadProfile();
    initializeStorage();
    console.log("Global main.js loaded successfully.");
});



