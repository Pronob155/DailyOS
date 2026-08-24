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
    const searchInput =
        document.getElementById("task-search");

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                applyTaskFilters();

            }
        );

    }
    const taskFilter =
        document.getElementById("task-filter");

    if (taskFilter) {

        taskFilter.addEventListener(
            "change",
            () => {

                applyTaskFilters();

            }
        );

    }
}
/* ==========================
   Planner Local Storage
========================== */

const PLANNER_STORAGE_KEY = "dailyos_plans";


function loadPlannerItems() {

    const storedPlans =
        localStorage.getItem(
            PLANNER_STORAGE_KEY
        );

    if (!storedPlans) {
        return [];
    }

    try {

        return JSON.parse(storedPlans);

    } catch (error) {

        console.error(
            "Failed to load planner data:",
            error
        );

        return [];

    }
}


function savePlannerItems(plans) {

    localStorage.setItem(
        PLANNER_STORAGE_KEY,
        JSON.stringify(plans)
    );

}
/* ==========================
   Daily Planner
========================== */

function initializePlanner() {

    const addPlanButton =
        document.getElementById("add-plan-button");

    const plannerModal =
        document.getElementById("planner-modal");

    const closeButton =
        document.getElementById("planner-modal-close");

    const cancelButton =
        document.getElementById("planner-cancel-button");

    const overlay =
        plannerModal?.querySelector(
            ".planner-modal-overlay"
        );

    const plannerForm =
        document.getElementById("planner-form");

    const plannerList =
        document.getElementById("planner-list");


    /* Open Modal */

    if (addPlanButton && plannerModal) {

        addPlanButton.addEventListener(
            "click",
            () => {

                plannerModal.hidden = false;

                document
                    .getElementById("plan-time")
                    ?.focus();

            }
        );

    }


    /* Close Modal */

    function closePlannerModal() {

        if (plannerModal) {

            plannerModal.hidden = true;

        }

    }


    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closePlannerModal
        );
    }


    if (cancelButton) {
        cancelButton.addEventListener(
            "click",
            closePlannerModal
        );
    }


    if (overlay) {
        overlay.addEventListener(
            "click",
            closePlannerModal
        );
    }


    /* Add Plan */

    if (plannerForm) {

        plannerForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const time =
                    document.getElementById(
                        "plan-time"
                    ).value;

                const title =
                    document.getElementById(
                        "plan-title"
                    ).value.trim();

                const description =
                    document.getElementById(
                        "plan-description"
                    ).value.trim();


                if (!time || !title) {
                    return;
                }
                const plans =
                    loadPlannerItems();

                const newPlan = {

                    id: Date.now(),

                    time: time,

                    title: title,

                    description: description,

                    completed: false

                };

                plans.push(newPlan);

                savePlannerItems(plans);

                const planElement =
                    document.createElement("article");

                planElement.className =
                    "planner-item";


                planElement.innerHTML = `

                    <div class="planner-time">

                        <span>
                            ${formatPlannerTime(time)}
                        </span>

                    </div>


                    <div class="planner-indicator">

                        <span></span>

                    </div>


                    <div class="planner-content">

                        <h3>
                            ${escapeHTML(title)}
                        </h3>

                        <p>
                            ${escapeHTML(
                    description ||
                    "No description"
                )}
                        </p>

                    </div>

                `;


                plannerList.appendChild(
                    planElement
                );


                plannerForm.reset();

                closePlannerModal();

            }
        );

    }
    renderPlannerItems();

}
/* ==========================
   Planner Helpers
========================== */

function formatPlannerTime(time) {

    const [hours, minutes] =
        time.split(":");

    const date =
        new Date();

    date.setHours(
        Number(hours),
        Number(minutes)
    );

    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

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
   Search & Filter
========================== */

/**
 * Applies both search and status filters
 * to the task list.
 */
function applyTaskFilters() {

    const emptyState =
        document.getElementById("task-empty-state");

    let visibleTaskCount = 0;

    const searchInput =
        document.getElementById("task-search");

    const taskFilter =
        document.getElementById("task-filter");

    const searchQuery = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const filterValue = taskFilter
        ? taskFilter.value
        : "all";

    const tasks = loadTasks();

    const taskItems = document.querySelectorAll(
        ".task-item"
    );

    taskItems.forEach(taskItem => {

        const taskId = Number(
            taskItem.dataset.taskId
        );

        const task = tasks.find(
            task => task.id === taskId
        );

        if (!task) {
            return;
        }

        const taskTitleElement =
            taskItem.querySelector(".task-title");

        const taskTitle = taskTitleElement
            ? taskTitleElement.textContent
                .trim()
                .toLowerCase()
            : "";

        const matchesSearch =
            taskTitle.includes(searchQuery);

        let matchesFilter = true;

        if (filterValue === "active") {

            matchesFilter = !task.completed;

        } else if (filterValue === "completed") {

            matchesFilter = task.completed;

        }

        const shouldShow =
            matchesSearch && matchesFilter;

        taskItem.style.display =
            shouldShow ? "" : "none";

        if (shouldShow) {
            visibleTaskCount++;
        }

    });
    if (emptyState) {

        emptyState.hidden =
            visibleTaskCount !== 0;

    }

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
/* ==========================
   Render Planner Items
========================== */

function renderPlannerItems() {

    const plannerList =
        document.getElementById("planner-list");

    if (!plannerList) {
        return;
    }

    const plans = loadPlannerItems();

    plannerList.innerHTML = "";

    plans.sort((a, b) =>
        a.time.localeCompare(b.time)
    );

    plans.forEach(plan => {

        const planElement =
            document.createElement("article");

        planElement.className =
            "planner-item";

        planElement.dataset.planId =
            plan.id;

        planElement.innerHTML = `

            <div class="planner-time">

                <span>
                    ${formatPlannerTime(plan.time)}
                </span>

            </div>

            <div class="planner-indicator">

                <span></span>

            </div>

            <div class="planner-content">

    <h3>
        ${escapeHTML(plan.title)}
    </h3>

    <p>
        ${escapeHTML(
            plan.description ||
            "No description"
        )}
    </p>

    <div class="planner-actions">

        <button
            type="button"
            class="planner-edit-button"
            data-action="edit"
            data-plan-id="${plan.id}"
            aria-label="Edit plan">

            <i class="fa-solid fa-pen"></i>

        </button>

        <button
            type="button"
            class="planner-delete-button"
            data-action="delete"
            data-plan-id="${plan.id}"
            aria-label="Delete plan">

            <i class="fa-solid fa-trash"></i>

        </button>

    </div>

</div>

        `;

        plannerList.appendChild(
            planElement
        );

    });

}
document.addEventListener("DOMContentLoaded", () => {

    console.log("DailyOS Initialized.");

    initializeApp();

    initializeTaskEvents();

    syncTaskUI();

    updateDashboardStats();

    initializePlanner();

});
