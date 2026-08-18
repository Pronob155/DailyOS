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
/* ==========================
   Task Completion
========================== */

/**
 * Toggles the completion status of a task.
 *
 * @param {number} taskId - The ID of the selected task
 */
function toggleTaskCompletion(taskId) {

    const tasks = loadTasks();

    const task = tasks.find(
        task => task.id === taskId
    );

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    saveTasks(tasks);

    updateTaskUI(task);

    updateDashboardStats();
}
/**
 * Updates the visual state of a task.
 *
 * @param {Object} task - Task object
 */
function updateTaskUI(task) {

    const taskElement = document.querySelector(
        `[data-task-id="${task.id}"]`
    );

    if (!taskElement) {
        return;
    }

    const checkbox = taskElement.querySelector(
        ".task-checkbox"
    );

    if (task.completed) {

        taskElement.classList.add("completed");

        checkbox.classList.add("checked");

    } else {

        taskElement.classList.remove("completed");

        checkbox.classList.remove("checked");
    }
}
/* ==========================
   Task Event Listeners
========================== */

function initializeTaskEvents() {

    const taskCheckboxes = document.querySelectorAll(
        ".task-checkbox"
    );

    taskCheckboxes.forEach(checkbox => {

        checkbox.addEventListener("click", () => {

            const taskElement =
                checkbox.closest(".task-item");

            if (!taskElement) {
                return;
            }

            const taskId = Number(
                taskElement.dataset.taskId
            );

            toggleTaskCompletion(taskId);

        });

    });
}
/* ==========================
   Sync Task UI
========================== */

function syncTaskUI() {

    const tasks = loadTasks();

    tasks.forEach(task => {

        updateTaskUI(task);

    });
}
/* ==========================
   Dashboard Statistics
========================== */

/**
 * Updates dashboard task statistics.
 */
function updateDashboardStats() {

    const tasks = loadTasks();

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        task => task.completed
    ).length;

    const totalTasksElement =
        document.getElementById("total-tasks");

    const completedTasksElement =
        document.getElementById("completed-tasks");

    if (totalTasksElement) {

        totalTasksElement.textContent = totalTasks;

    }

    if (completedTasksElement) {

        completedTasksElement.textContent =
            completedTasks;

    }
}
document.addEventListener("DOMContentLoaded", () => {

    console.log("DailyOS Initialized.");

    initializeApp();

    initializeTaskEvents();

    syncTaskUI();

    updateDashboardStats();

});
