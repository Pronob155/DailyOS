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

    let editingPlanId = null;


    /* ==========================
       Close Modal
    ========================== */

    function closePlannerModal() {

        if (plannerModal) {

            plannerModal.hidden = true;

        }

    }


    /* ==========================
       Open Modal
    ========================== */

    if (addPlanButton && plannerModal) {

        addPlanButton.addEventListener(
            "click",
            () => {

                editingPlanId = null;

                plannerForm.reset();

                const submitButton =
                    document.getElementById(
                        "planner-submit-button"
                    );

                if (submitButton) {

                    submitButton.innerHTML = `
                        <i class="fa-solid fa-plus"></i>
                        <span>Add Plan</span>
                    `;

                }

                plannerModal.hidden = false;

                document
                    .getElementById("plan-time")
                    ?.focus();

            }
        );

    }


    /* ==========================
       Close Buttons
    ========================== */

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


    /* ==========================
       Add / Edit Plan
    ========================== */

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


                /* ==========================
                   Edit Existing Plan
                ========================== */

                if (editingPlanId !== null) {

                    const plan =
                        plans.find(
                            item =>
                                item.id ===
                                editingPlanId
                        );

                    if (!plan) {

                        return;

                    }

                    plan.time = time;

                    plan.title = title;

                    plan.description =
                        description;

                    savePlannerItems(
                        plans
                    );

                    editingPlanId = null;

                }


                /* ==========================
                   Add New Plan
                ========================== */

                else {

                    const newPlan = {

                        id: Date.now(),

                        time: time,

                        title: title,

                        description: description,

                        completed: false

                    };

                    plans.push(newPlan);

                    savePlannerItems(
                        plans
                    );

                }


                /* ==========================
                   Refresh Planner
                ========================== */

                renderPlannerItems();

                plannerForm.reset();


                const submitButton =
                    document.getElementById(
                        "planner-submit-button"
                    );

                if (submitButton) {

                    submitButton.innerHTML = `
                        <i class="fa-solid fa-plus"></i>
                        <span>Add Plan</span>
                    `;

                }

                closePlannerModal();

            }
        );

    }


    /* ==========================
       Edit / Delete
    ========================== */

    if (plannerList) {

        plannerList.addEventListener(
            "click",
            event => {

                const editButton =
                    event.target.closest(
                        '[data-action="edit"]'
                    );

                const deleteButton =
                    event.target.closest(
                        '[data-action="delete"]'
                    );


                /* ==========================
                   Edit Plan
                ========================== */

                if (editButton) {

                    const planId =
                        Number(
                            editButton.dataset.planId
                        );

                    editingPlanId = planId;


                    const plans =
                        loadPlannerItems();

                    const plan =
                        plans.find(
                            item =>
                                item.id === planId
                        );


                    if (!plan) {

                        return;

                    }


                    document.getElementById(
                        "plan-time"
                    ).value = plan.time;


                    document.getElementById(
                        "plan-title"
                    ).value = plan.title;


                    document.getElementById(
                        "plan-description"
                    ).value =
                        plan.description || "";


                    plannerModal.hidden = false;


                    const submitButton =
                        document.getElementById(
                            "planner-submit-button"
                        );

                    if (submitButton) {

                        submitButton.innerHTML = `
                            <i class="fa-solid fa-check"></i>
                            <span>Save Changes</span>
                        `;

                    }

                    return;

                }


                /* ==========================
                   Delete Plan
                ========================== */

                if (deleteButton) {

                    const planId =
                        Number(
                            deleteButton.dataset.planId
                        );


                    const confirmed =
                        confirm(
                            "Are you sure you want to delete this plan?"
                        );


                    if (!confirmed) {

                        return;

                    }


                    const plans =
                        loadPlannerItems();


                    const updatedPlans =
                        plans.filter(
                            plan =>
                                plan.id !== planId
                        );


                    savePlannerItems(
                        updatedPlans
                    );


                    renderPlannerItems();

                }

            }
        );

    }


    /* ==========================
       Initial Render
    ========================== */

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
/* ==========================
   Calendar
========================== */

let currentCalendarDate = new Date();

let selectedCalendarDate = new Date();


/**
 * Formats a date as YYYY-MM-DD.
 *
 * @param {Date} date
 * @returns {string}
 */
function getCalendarDateKey(date) {

    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/**
 * Checks whether two dates represent
 * the same calendar day.
 *
 * @param {Date} firstDate
 * @param {Date} secondDate
 * @returns {boolean}
 */
function isSameCalendarDate(firstDate, secondDate) {

    return (
        firstDate.getFullYear() === secondDate.getFullYear() &&
        firstDate.getMonth() === secondDate.getMonth() &&
        firstDate.getDate() === secondDate.getDate()
    );
}


/**
 * Renders the current calendar month.
 */
function renderCalendar() {

    const calendarGrid =
        document.getElementById("calendar-grid");

    const calendarMonth =
        document.getElementById("calendar-month");

    if (!calendarGrid || !calendarMonth) {
        return;
    }


    const year =
        currentCalendarDate.getFullYear();

    const month =
        currentCalendarDate.getMonth();


    const monthName =
        currentCalendarDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );

    calendarMonth.textContent = monthName;


    /*
     * First day of the month.
     */
    const firstDay =
        new Date(year, month, 1);

    /*
     * Last day of the month.
     */
    const lastDay =
        new Date(year, month + 1, 0);


    const firstWeekday =
        firstDay.getDay();

    const totalDays =
        lastDay.getDate();


    /*
     * Previous month's last day.
     */
    const previousMonthLastDay =
        new Date(year, month, 0).getDate();


    calendarGrid.innerHTML = "";


    /*
     * Previous month dates.
     */
    for (
        let index = firstWeekday - 1;
        index >= 0;
        index--
    ) {

        const dayNumber =
            previousMonthLastDay - index;

        const date =
            new Date(year, month - 1, dayNumber);

        createCalendarDay(
            date,
            true,
            calendarGrid
        );
    }


    /*
     * Current month dates.
     */
    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const date =
            new Date(year, month, day);

        createCalendarDay(
            date,
            false,
            calendarGrid
        );
    }


    /*
     * Next month dates.
     *
     * Fill the final row so that
     * the calendar always remains
     * visually consistent.
     */
    const totalCells =
        calendarGrid.children.length;

    const remainingCells =
        (7 - (totalCells % 7)) % 7;


    for (
        let day = 1;
        day <= remainingCells;
        day++
    ) {

        const date =
            new Date(year, month + 1, day);

        createCalendarDay(
            date,
            true,
            calendarGrid
        );
    }
}


/**
 * Creates a calendar day element.
 *
 * @param {Date} date
 * @param {boolean} isOtherMonth
 * @param {HTMLElement} container
 */
function createCalendarDay(
    date,
    isOtherMonth,
    container
) {

    const dayButton =
        document.createElement("button");

    dayButton.type = "button";

    dayButton.className =
        "calendar-day";

    dayButton.textContent =
        date.getDate();


    if (isOtherMonth) {

        dayButton.classList.add(
            "other-month"
        );
    }


    const today =
        new Date();

    if (isSameCalendarDate(date, today)) {

        dayButton.classList.add(
            "today"
        );
    }


    if (
        isSameCalendarDate(
            date,
            selectedCalendarDate
        )
    ) {

        dayButton.classList.add(
            "selected"
        );
    }


    dayButton.dataset.date =
        getCalendarDateKey(date);


    dayButton.addEventListener(
        "click",
        () => {

            selectedCalendarDate =
                new Date(date);

            /*
             * If an overflow date is selected,
             * move the calendar to that month.
             */
            if (isOtherMonth) {

                currentCalendarDate =
                    new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        1
                    );
            }

            renderCalendar();
        }
    );


    container.appendChild(
        dayButton
    );
}


/**
 * Initializes Calendar controls.
 */
function initializeCalendar() {

    const previousButton =
        document.getElementById(
            "calendar-prev"
        );

    const nextButton =
        document.getElementById(
            "calendar-next"
        );

    const todayButton =
        document.getElementById(
            "calendar-today-button"
        );


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            () => {

                currentCalendarDate =
                    new Date(
                        currentCalendarDate.getFullYear(),
                        currentCalendarDate.getMonth() - 1,
                        1
                    );

                renderCalendar();
            }
        );
    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                currentCalendarDate =
                    new Date(
                        currentCalendarDate.getFullYear(),
                        currentCalendarDate.getMonth() + 1,
                        1
                    );

                renderCalendar();
            }
        );
    }


    if (todayButton) {

        todayButton.addEventListener(
            "click",
            () => {

                const today =
                    new Date();

                currentCalendarDate =
                    new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        1
                    );

                selectedCalendarDate =
                    new Date(today);

                renderCalendar();
            }
        );
    }


    renderCalendar();
}
document.addEventListener("DOMContentLoaded", () => {

    console.log("DailyOS Initialized.");

    initializeApp();

    initializeTaskEvents();

    syncTaskUI();

    updateDashboardStats();

    initializePlanner();

     initializeCalendar();

});
