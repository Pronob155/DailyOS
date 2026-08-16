"use strict";

/*
=========================================
DailyOS
Version 1

Main JavaScript Entry Point
=========================================
*/

import {
    saveTasks,
    loadTasks
} from "./storage.js";


/* ==========================
   Initial Task Data
========================== */

const defaultTasks = [
    {
        id: 1,
        title: "Complete portfolio project",
        time: "10:00 AM",
        priority: "high",
        completed: false
    },

    {
        id: 2,
        title: "Study Data Structures",
        time: "2:00 PM",
        priority: "medium",
        completed: true
    },

    {
        id: 3,
        title: "Work on DailyOS",
        time: "6:00 PM",
        priority: "low",
        completed: false
    }
];

/* ==========================
   Application Initialization
========================== */

function initializeApp() {

    const existingTasks = loadTasks();

    if (existingTasks.length === 0) {

        saveTasks(defaultTasks);

        console.log(
            "Default tasks saved to Local Storage."
        );

    } else {

        console.log(
            "Tasks loaded from Local Storage."
        );

    }
}

document.addEventListener("DOMContentLoaded", () => {

    console.log("DailyOS Initialized.");

});
