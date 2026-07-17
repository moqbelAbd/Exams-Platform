import { loadHeader } from "./header.js";
import { initializeStorage } from './storage.js';
import { isTeacher } from './auth.js'; 


// Global Event Listener: Runs immediately when any HTML page loads
document.addEventListener('DOMContentLoaded', () => {
    
    initializeStorage();
    console.log("Global main.js loaded successfully.");
});



loadHeader();