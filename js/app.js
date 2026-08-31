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
    loadTasks,
    saveStudySessions,
    loadStudySessions,
    saveNotes,
    loadNotes,
    saveGoals,
    loadGoals,
    savePomodoroStats,
    loadPomodoroStats
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
/* ==========================
   Study Tracker
========================== */

/**
 * Formats study duration.
 *
 * @param {number} minutes
 * @returns {string}
 */
function formatStudyDuration(minutes) {

    const hours =
        Math.floor(minutes / 60);

    const remainingMinutes =
        minutes % 60;

    if (hours === 0) {
        return `${remainingMinutes}m`;
    }

    return `${hours}h ${remainingMinutes}m`;
}


/**
 * Renders all study sessions.
 */
function renderStudySessions() {

    const studyList =
        document.getElementById("study-list");

    const totalTime =
        document.getElementById("study-total-time");

    if (!studyList || !totalTime) {
        return;
    }

    const sessions =
        loadStudySessions();


    studyList.innerHTML = "";


    if (sessions.length === 0) {

        studyList.innerHTML = `
            <div class="study-empty">
                No study sessions yet.
            </div>
        `;

        totalTime.textContent = "0h 0m";

        return;
    }


    let totalMinutes = 0;


    sessions.forEach(session => {

        totalMinutes +=
            Number(session.duration);


        const studyItem =
            document.createElement("article");

        studyItem.className =
            "study-item";

        studyItem.dataset.studyId =
            session.id;


        studyItem.innerHTML = `

            <div class="study-item-icon">

                <i class="fa-solid fa-book-open"></i>

            </div>


            <div class="study-item-content">

                <h3>
                    ${escapeHTML(session.subject)}
                </h3>

                <p>
                    ${escapeHTML(
                        session.notes ||
                        "Study session"
                    )}
                </p>

            </div>


            <span class="study-item-duration">

                ${formatStudyDuration(
                    Number(session.duration)
                )}

            </span>


            <button
                type="button"
                class="study-delete-button"
                data-action="delete-study"
                data-study-id="${session.id}"
                aria-label="Delete study session">

                <i class="fa-solid fa-trash"></i>

            </button>
        `;


        studyList.appendChild(
            studyItem
        );

    });


    totalTime.textContent =
        formatStudyDuration(totalMinutes);
}


/**
 * Initializes Study Tracker.
 */
function initializeStudyTracker() {

    const addButton =
        document.getElementById(
            "study-add-button"
        );

    const modal =
        document.getElementById(
            "study-modal"
        );

    const closeButton =
        document.getElementById(
            "study-modal-close"
        );

    const cancelButton =
        document.getElementById(
            "study-cancel-button"
        );

    const overlay =
        modal?.querySelector(
            ".study-modal-overlay"
        );

    const form =
        document.getElementById(
            "study-form"
        );

    const studyList =
        document.getElementById(
            "study-list"
        );


    function closeModal() {

        if (modal) {
            modal.hidden = true;
        }

        form?.reset();
    }


    function openModal() {

        if (modal) {
            modal.hidden = false;
        }
    }


    addButton?.addEventListener(
        "click",
        openModal
    );


    closeButton?.addEventListener(
        "click",
        closeModal
    );


    cancelButton?.addEventListener(
        "click",
        closeModal
    );


    overlay?.addEventListener(
        "click",
        closeModal
    );


    form?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const subject =
                document.getElementById(
                    "study-subject"
                ).value.trim();


            const duration =
                Number(
                    document.getElementById(
                        "study-duration"
                    ).value
                );


            const notes =
                document.getElementById(
                    "study-notes"
                ).value.trim();


            if (
                !subject ||
                !duration ||
                duration <= 0
            ) {
                return;
            }


            const sessions =
                loadStudySessions();


            const newSession = {

                id: Date.now(),

                subject,

                duration,

                notes,

                createdAt:
                    new Date().toISOString()

            };


            sessions.push(
                newSession
            );


            saveStudySessions(
                sessions
            );


            renderStudySessions();

            closeModal();

        }
    );


    studyList?.addEventListener(
        "click",
        event => {

            const deleteButton =
                event.target.closest(
                    '[data-action="delete-study"]'
                );


            if (!deleteButton) {
                return;
            }


            const studyId =
                Number(
                    deleteButton.dataset.studyId
                );


            const sessions =
                loadStudySessions();


            const updatedSessions =
                sessions.filter(
                    session =>
                        session.id !== studyId
                );


            saveStudySessions(
                updatedSessions
            );


            renderStudySessions();

        }
    );


    renderStudySessions();
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
/* ==========================
   Pomodoro Timer
========================== */

const POMODORO_DURATIONS = {
    focus: 25 * 60,
    "short-break": 5 * 60
};


let pomodoroMode = "focus";

let pomodoroTimeRemaining =
    POMODORO_DURATIONS.focus;

let pomodoroTimerId = null;

let pomodoroIsRunning = false;

const pomodoroStats =
    loadPomodoroStats();

let pomodoroFocusCount =
    pomodoroStats.focusSessions;

let pomodoroBreakCount =
    pomodoroStats.breakSessions;


/**
 * Formats seconds into MM:SS.
 *
 * @param {number} totalSeconds
 * @returns {string}
 */
function formatPomodoroTime(totalSeconds) {

    const minutes =
        Math.floor(totalSeconds / 60);

    const seconds =
        totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


/**
 * Updates timer display.
 */
function updatePomodoroDisplay() {

    const timer =
        document.getElementById(
            "pomodoro-timer"
        );

    const progressBar =
        document.getElementById(
            "pomodoro-progress-bar"
        );


    if (timer) {

        timer.textContent =
            formatPomodoroTime(
                pomodoroTimeRemaining
            );
    }


    if (progressBar) {

        const totalDuration =
            POMODORO_DURATIONS[
                pomodoroMode
            ];


        const progress =
            (
                pomodoroTimeRemaining /
                totalDuration
            ) * 100;


        progressBar.style.width =
            `${progress}%`;
    }
}


/**
 * Updates mode button states.
 */
function updatePomodoroModeUI() {

    const modeButtons =
        document.querySelectorAll(
            ".pomodoro-mode-button"
        );


    modeButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.mode ===
            pomodoroMode
        );

    });
}


/**
 * Updates start/pause button.
 */
function updatePomodoroControlUI() {

    const startButton =
        document.getElementById(
            "pomodoro-start-button"
        );


    if (!startButton) {
        return;
    }


    if (pomodoroIsRunning) {

        startButton.innerHTML = `
            <i class="fa-solid fa-pause"></i>
            <span>Pause</span>
        `;

    } else {

        startButton.innerHTML = `
            <i class="fa-solid fa-play"></i>
            <span>Start</span>
        `;
    }
}


/**
 * Updates completed session counters.
 */
function updatePomodoroStats() {

    const focusCount =
        document.getElementById(
            "pomodoro-focus-count"
        );

    const breakCount =
        document.getElementById(
            "pomodoro-break-count"
        );


    if (focusCount) {

        focusCount.textContent =
            pomodoroFocusCount;
    }


    if (breakCount) {

        breakCount.textContent =
            pomodoroBreakCount;
    }
}


/**
 * Switches timer mode.
 *
 * @param {string} mode
 */
function setPomodoroMode(mode) {

    if (
        !POMODORO_DURATIONS[mode]
    ) {
        return;
    }


    stopPomodoroTimer();


    pomodoroMode = mode;

    pomodoroTimeRemaining =
        POMODORO_DURATIONS[mode];


    updatePomodoroModeUI();

    updatePomodoroDisplay();

    updatePomodoroControlUI();
}


/**
 * Starts Pomodoro timer.
 */
function startPomodoroTimer() {

    if (pomodoroIsRunning) {
        return;
    }


    pomodoroIsRunning = true;

    updatePomodoroControlUI();


    pomodoroTimerId =
        setInterval(() => {

            pomodoroTimeRemaining--;


            updatePomodoroDisplay();


            if (
                pomodoroTimeRemaining <= 0
            ) {

                completePomodoroSession();

            }

        }, 1000);
}


/**
 * Stops Pomodoro timer.
 */
function stopPomodoroTimer() {

    if (pomodoroTimerId !== null) {

        clearInterval(
            pomodoroTimerId
        );

        pomodoroTimerId = null;
    }


    pomodoroIsRunning = false;

    updatePomodoroControlUI();
}


/**
 * Resets current timer.
 */
function resetPomodoroTimer() {

    stopPomodoroTimer();


    pomodoroTimeRemaining =
        POMODORO_DURATIONS[
            pomodoroMode
        ];


    updatePomodoroDisplay();
}


/**
 * Handles completed Pomodoro session.
 */
function completePomodoroSession() {

    stopPomodoroTimer();


    if (pomodoroMode === "focus") {

        pomodoroFocusCount++;

        // Save updated statistics
        savePomodoroStats({
            focusSessions:
                pomodoroFocusCount,

            breakSessions:
                pomodoroBreakCount
        });


        setPomodoroMode(
            "short-break"
        );

    } else {

        pomodoroBreakCount++;

        // Save updated statistics
        savePomodoroStats({
            focusSessions:
                pomodoroFocusCount,

            breakSessions:
                pomodoroBreakCount
        });


        setPomodoroMode(
            "focus"
        );
    }


    updatePomodoroStats();

    updatePomodoroDisplay();
}


/**
 * Initializes Pomodoro Timer.
 */
function initializePomodoro() {

    const startButton =
        document.getElementById(
            "pomodoro-start-button"
        );

    const resetButton =
        document.getElementById(
            "pomodoro-reset-button"
        );

    const modeButtons =
        document.querySelectorAll(
            ".pomodoro-mode-button"
        );


    startButton?.addEventListener(
        "click",
        () => {

            if (pomodoroIsRunning) {

                stopPomodoroTimer();

            } else {

                startPomodoroTimer();

            }
        }
    );


    resetButton?.addEventListener(
        "click",
        resetPomodoroTimer
    );


    modeButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                setPomodoroMode(
                    button.dataset.mode
                );

            }
        );

    });


    updatePomodoroDisplay();

    updatePomodoroModeUI();

    updatePomodoroControlUI();

    updatePomodoroStats();
}
/* ==========================
   Notes
========================== */


/**
 * Escapes note text before rendering.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeNoteHTML(value) {

    const element =
        document.createElement("div");

    element.textContent = value;

    return element.innerHTML;
}


/**
 * Formats note date.
 *
 * @param {string} dateString
 * @returns {string}
 */
function formatNoteDate(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleDateString(
        "en-US",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


/**
 * Renders notes.
 *
 * @param {string} searchQuery
 */
function renderNotes(searchQuery = "") {

    const notesGrid =
        document.getElementById(
            "notes-grid"
        );

    if (!notesGrid) {
        return;
    }


    const normalizedQuery =
        searchQuery
            .trim()
            .toLowerCase();


    let notes =
        loadNotes();


    /*
     * Search filter.
     */
    if (normalizedQuery) {

        notes =
            notes.filter(note => {

                return (
                    note.title
                        .toLowerCase()
                        .includes(
                            normalizedQuery
                        ) ||
                    note.content
                        .toLowerCase()
                        .includes(
                            normalizedQuery
                        )
                );

            });

    }


    /*
     * Pinned notes first.
     */
    notes.sort(
        (firstNote, secondNote) => {

            if (
                firstNote.pinned !==
                secondNote.pinned
            ) {

                return Number(
                    secondNote.pinned
                ) - Number(
                    firstNote.pinned
                );

            }


            return new Date(
                secondNote.updatedAt
            ) - new Date(
                firstNote.updatedAt
            );

        }
    );


    notesGrid.innerHTML = "";


    if (notes.length === 0) {

        notesGrid.innerHTML = `

            <div class="notes-empty">

                <i class="fa-solid fa-note-sticky"></i>

                <p>
                    ${normalizedQuery
                        ? "No notes found."
                        : "No notes yet. Create your first note."}
                </p>

            </div>

        `;

        return;
    }


    notes.forEach(note => {

        const noteCard =
            document.createElement(
                "article"
            );

        noteCard.className =
            "note-card";


        if (note.pinned) {

            noteCard.classList.add(
                "pinned"
            );
        }


        noteCard.innerHTML = `

            <div class="note-card-header">

                <h3>
                    ${escapeNoteHTML(
                        note.title
                    )}
                </h3>


                ${note.pinned
                    ? `
                        <i
                            class="fa-solid fa-thumbtack note-pin-icon"
                            aria-label="Pinned note">
                        </i>
                    `
                    : ""
                }

            </div>


            <div class="note-card-content">

                ${escapeNoteHTML(
                    note.content
                )}

            </div>


            <div class="note-card-footer">

                <span class="note-card-date">

                    ${formatNoteDate(
                        note.updatedAt
                    )}

                </span>


                <div class="note-card-actions">

                    <button
                        type="button"
                        class="note-action-button"
                        data-action="edit-note"
                        data-note-id="${note.id}"
                        aria-label="Edit note">

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        type="button"
                        class="note-action-button delete"
                        data-action="delete-note"
                        data-note-id="${note.id}"
                        aria-label="Delete note">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </div>

        `;


        notesGrid.appendChild(
            noteCard
        );

    });
}


/**
 * Initializes Notes feature.
 */
function initializeNotes() {

    const addButton =
        document.getElementById(
            "notes-add-button"
        );

    const modal =
        document.getElementById(
            "notes-modal"
        );

    const closeButton =
        document.getElementById(
            "notes-modal-close"
        );

    const cancelButton =
        document.getElementById(
            "notes-cancel-button"
        );

    const overlay =
        modal?.querySelector(
            ".notes-modal-overlay"
        );

    const form =
        document.getElementById(
            "notes-form"
        );

    const searchInput =
        document.getElementById(
            "notes-search-input"
        );

    const notesGrid =
        document.getElementById(
            "notes-grid"
        );

    const titleInput =
        document.getElementById(
            "notes-title"
        );

    const contentInput =
        document.getElementById(
            "notes-content"
        );

    const pinnedInput =
        document.getElementById(
            "notes-pinned"
        );

    const editIdInput =
        document.getElementById(
            "notes-edit-id"
        );

    const modalTitle =
        document.getElementById(
            "notes-modal-title"
        );


    /**
     * Opens modal for new note.
     */
    function openAddModal() {

        form?.reset();

        if (editIdInput) {
            editIdInput.value = "";
        }

        if (modalTitle) {
            modalTitle.textContent =
                "Add Note";
        }

        if (modal) {
            modal.hidden = false;
        }

        titleInput?.focus();
    }


    /**
     * Opens modal for editing.
     *
     * @param {Object} note
     */
    function openEditModal(note) {

        if (
            !titleInput ||
            !contentInput ||
            !pinnedInput ||
            !editIdInput
        ) {
            return;
        }


        titleInput.value =
            note.title;

        contentInput.value =
            note.content;

        pinnedInput.checked =
            Boolean(note.pinned);

        editIdInput.value =
            note.id;


        if (modalTitle) {
            modalTitle.textContent =
                "Edit Note";
        }


        if (modal) {
            modal.hidden = false;
        }


        titleInput.focus();
    }


    /**
     * Closes modal.
     */
    function closeModal() {

        if (modal) {
            modal.hidden = true;
        }

        form?.reset();
    }


    addButton?.addEventListener(
        "click",
        openAddModal
    );

    closeButton?.addEventListener(
        "click",
        closeModal
    );

    cancelButton?.addEventListener(
        "click",
        closeModal
    );

    overlay?.addEventListener(
        "click",
        closeModal
    );


    /*
     * Save / update note.
     */
    form?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const title =
                titleInput
                    ?.value
                    .trim();

            const content =
                contentInput
                    ?.value
                    .trim();

            const pinned =
                Boolean(
                    pinnedInput?.checked
                );

            const editId =
                editIdInput
                    ?.value;


            if (
                !title ||
                !content
            ) {
                return;
            }


            const notes =
                loadNotes();

            const now =
                new Date().toISOString();


            /*
             * Edit existing note.
             */
            if (editId) {

                const updatedNotes =
                    notes.map(note => {

                        if (
                            String(note.id) ===
                            String(editId)
                        ) {

                            return {
                                ...note,
                                title,
                                content,
                                pinned,
                                updatedAt: now
                            };
                        }


                        return note;

                    });


                saveNotes(
                    updatedNotes
                );

            } else {

                /*
                 * Create new note.
                 */
                const newNote = {

                    id: Date.now(),

                    title,

                    content,

                    pinned,

                    createdAt: now,

                    updatedAt: now

                };


                notes.push(
                    newNote
                );


                saveNotes(
                    notes
                );
            }


            renderNotes(
                searchInput?.value || ""
            );

            closeModal();

        }
    );


    /*
     * Search notes.
     */
    searchInput?.addEventListener(
        "input",
        event => {

            renderNotes(
                event.target.value
            );

        }
    );


    /*
     * Edit / delete events.
     */
    notesGrid?.addEventListener(
        "click",
        event => {

            const editButton =
                event.target.closest(
                    '[data-action="edit-note"]'
                );

            const deleteButton =
                event.target.closest(
                    '[data-action="delete-note"]'
                );


            /*
             * Edit.
             */
            if (editButton) {

                const noteId =
                    editButton.dataset.noteId;

                const notes =
                    loadNotes();

                const note =
                    notes.find(
                        item =>
                            String(item.id) ===
                            String(noteId)
                    );


                if (note) {
                    openEditModal(
                        note
                    );
                }


                return;
            }


            /*
             * Delete.
             */
            if (deleteButton) {

                const noteId =
                    deleteButton.dataset.noteId;

                const notes =
                    loadNotes();

                const updatedNotes =
                    notes.filter(
                        note =>
                            String(note.id) !==
                            String(noteId)
                    );


                saveNotes(
                    updatedNotes
                );


                renderNotes(
                    searchInput?.value || ""
                );
            }

        }
    );


    renderNotes();
}
/* ==========================
   Goals
========================== */


/**
 * Formats a goal target date.
 *
 * @param {string} dateString
 * @returns {string}
 */
function formatGoalDate(dateString) {

    if (!dateString) {
        return "No target date";
    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    return date.toLocaleDateString(
        "en-US",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


/**
 * Escapes goal text before rendering.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeGoalHTML(value) {

    const element =
        document.createElement("div");

    element.textContent = value;

    return element.innerHTML;
}


/**
 * Renders all goals.
 */
function renderGoals() {

    const goalsGrid =
        document.getElementById(
            "goals-grid"
        );

    if (!goalsGrid) {
        return;
    }


    const goals =
        loadGoals();


    goalsGrid.innerHTML = "";


    if (goals.length === 0) {

        goalsGrid.innerHTML = `

            <div class="goals-empty">

                <i class="fa-solid fa-bullseye"></i>

                <p>
                    No goals yet. Set your first goal.
                </p>

            </div>

        `;

        return;
    }


    goals.forEach(goal => {

        const progress =
            Math.min(
                100,
                Math.max(
                    0,
                    Number(goal.progress) || 0
                )
            );


        const goalCard =
            document.createElement(
                "article"
            );

        goalCard.className =
            "goal-card";


        goalCard.innerHTML = `

            <div class="goal-card-header">

                <div>

                    <h3 class="goal-card-title">

                        ${escapeGoalHTML(
                            goal.title
                        )}

                    </h3>


                    <span class="goal-category">

                        ${escapeGoalHTML(
                            goal.category
                        )}

                    </span>

                </div>

            </div>


            <!-- Progress -->

            <div class="goal-progress-header">

                <span>
                    Progress
                </span>

                <strong>
                    ${progress}%
                </strong>

            </div>


            <div class="goal-progress-track">

                <div
                    class="goal-progress-bar"
                    style="width: ${progress}%">
                </div>

            </div>


            <!-- Footer -->

            <div class="goal-card-footer">

                <span class="goal-target-date">

                    <i class="fa-solid fa-calendar"></i>

                    ${formatGoalDate(
                        goal.targetDate
                    )}

                </span>


                <div class="goal-actions">

                    <button
                        type="button"
                        class="goal-action-button"
                        data-action="edit-goal"
                        data-goal-id="${goal.id}"
                        aria-label="Edit goal">

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        type="button"
                        class="goal-action-button delete"
                        data-action="delete-goal"
                        data-goal-id="${goal.id}"
                        aria-label="Delete goal">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </div>

        `;


        goalsGrid.appendChild(
            goalCard
        );

    });
}


/**
 * Initializes Goals feature.
 */
function initializeGoals() {

    const addButton =
        document.getElementById(
            "goals-add-button"
        );

    const modal =
        document.getElementById(
            "goals-modal"
        );

    const closeButton =
        document.getElementById(
            "goals-modal-close"
        );

    const cancelButton =
        document.getElementById(
            "goals-cancel-button"
        );

    const overlay =
        modal?.querySelector(
            ".goals-modal-overlay"
        );

    const form =
        document.getElementById(
            "goals-form"
        );

    const goalsGrid =
        document.getElementById(
            "goals-grid"
        );

    const editIdInput =
        document.getElementById(
            "goals-edit-id"
        );

    const titleInput =
        document.getElementById(
            "goal-title"
        );

    const categoryInput =
        document.getElementById(
            "goal-category"
        );

    const progressInput =
        document.getElementById(
            "goal-progress"
        );

    const targetDateInput =
        document.getElementById(
            "goal-target-date"
        );

    const modalTitle =
        document.getElementById(
            "goals-modal-title"
        );


    /**
     * Opens modal for a new goal.
     */
    function openAddModal() {

        form?.reset();


        if (editIdInput) {
            editIdInput.value = "";
        }

        if (progressInput) {
            progressInput.value = 0;
        }

        if (modalTitle) {
            modalTitle.textContent =
                "Add Goal";
        }

        if (modal) {
            modal.hidden = false;
        }

        titleInput?.focus();
    }


    /**
     * Opens modal for editing.
     *
     * @param {Object} goal
     */
    function openEditModal(goal) {

        if (
            !editIdInput ||
            !titleInput ||
            !categoryInput ||
            !progressInput ||
            !targetDateInput
        ) {
            return;
        }


        editIdInput.value =
            goal.id;

        titleInput.value =
            goal.title;

        categoryInput.value =
            goal.category;

        progressInput.value =
            goal.progress;

        targetDateInput.value =
            goal.targetDate || "";


        if (modalTitle) {
            modalTitle.textContent =
                "Edit Goal";
        }

        if (modal) {
            modal.hidden = false;
        }

        titleInput.focus();
    }


    /**
     * Closes the goal modal.
     */
    function closeModal() {

        if (modal) {
            modal.hidden = true;
        }

        form?.reset();
    }


    addButton?.addEventListener(
        "click",
        openAddModal
    );


    closeButton?.addEventListener(
        "click",
        closeModal
    );


    cancelButton?.addEventListener(
        "click",
        closeModal
    );


    overlay?.addEventListener(
        "click",
        closeModal
    );


    /*
     * Create or update goal.
     */
    form?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const title =
                titleInput
                    ?.value
                    .trim();

            const category =
                categoryInput
                    ?.value;

            const progress =
                Math.min(
                    100,
                    Math.max(
                        0,
                        Number(
                            progressInput?.value
                        ) || 0
                    )
                );

            const targetDate =
                targetDateInput
                    ?.value || "";

            const editId =
                editIdInput
                    ?.value;


            if (!title) {
                return;
            }


            const goals =
                loadGoals();


            if (editId) {

                const updatedGoals =
                    goals.map(goal => {

                        if (
                            String(goal.id) ===
                            String(editId)
                        ) {

                            return {
                                ...goal,
                                title,
                                category,
                                progress,
                                targetDate,
                                updatedAt:
                                    new Date()
                                        .toISOString()
                            };
                        }


                        return goal;

                    });


                saveGoals(
                    updatedGoals
                );

            } else {

                const now =
                    new Date()
                        .toISOString();


                const newGoal = {

                    id: Date.now(),

                    title,

                    category,

                    progress,

                    targetDate,

                    createdAt: now,

                    updatedAt: now

                };


                goals.push(
                    newGoal
                );


                saveGoals(
                    goals
                );
            }


            renderGoals();

            closeModal();

        }
    );


    /*
     * Edit and delete goal.
     */
    goalsGrid?.addEventListener(
        "click",
        event => {

            const editButton =
                event.target.closest(
                    '[data-action="edit-goal"]'
                );

            const deleteButton =
                event.target.closest(
                    '[data-action="delete-goal"]'
                );


            if (editButton) {

                const goalId =
                    editButton.dataset.goalId;

                const goals =
                    loadGoals();

                const goal =
                    goals.find(
                        item =>
                            String(item.id) ===
                            String(goalId)
                    );


                if (goal) {
                    openEditModal(goal);
                }

                return;
            }


            if (deleteButton) {

                const goalId =
                    deleteButton.dataset.goalId;

                const goals =
                    loadGoals();

                const updatedGoals =
                    goals.filter(
                        goal =>
                            String(goal.id) !==
                            String(goalId)
                    );


                saveGoals(
                    updatedGoals
                );

                renderGoals();

            }

        }
    );


    renderGoals();
}
/* ==========================
   Productivity Statistics
========================== */


let taskStatisticsChart = null;

let goalStatisticsChart = null;


/**
 * Formats total minutes.
 *
 * @param {number} minutes
 * @returns {string}
 */
function formatStatisticsStudyTime(minutes) {

    if (minutes < 60) {
        return `${minutes}m`;
    }


    const hours =
        Math.floor(minutes / 60);

    const remainingMinutes =
        minutes % 60;


    if (remainingMinutes === 0) {
        return `${hours}h`;
    }


    return `${hours}h ${remainingMinutes}m`;
}


/**
 * Calculates productivity statistics.
 *
 * @returns {Object}
 */
function getProductivityStatistics() {

    const tasks =
        loadTasks();

    const studySessions =
        loadStudySessions();

    const goals =
        loadGoals();

    const pomodoroStats =
        loadPomodoroStats();


    /*
     * Tasks
     */
    const totalTasks =
        tasks.length;

    const completedTasks =
        tasks.filter(
            task => task.completed
        ).length;

    const pendingTasks =
        totalTasks -
        completedTasks;

    const taskCompletionRate =
        totalTasks === 0
            ? 0
            : Math.round(
                (
                    completedTasks /
                    totalTasks
                ) * 100
            );


    /*
     * Study
     */
    const totalStudySessions =
        studySessions.length;

    const totalStudyMinutes =
        studySessions.reduce(
            (total, session) =>
                total +
                (
                    Number(
                        session.duration
                    ) || 0
                ),
            0
        );


    /*
     * Goals
     */
    const totalGoals =
        goals.length;

    const completedGoals =
        goals.filter(
            goal =>
                Number(
                    goal.progress
                ) >= 100
        ).length;

    const averageGoalProgress =
        totalGoals === 0
            ? 0
            : Math.round(
                goals.reduce(
                    (total, goal) =>
                        total +
                        (
                            Number(
                                goal.progress
                            ) || 0
                        ),
                    0
                ) /
                totalGoals
            );


    return {

        tasks: {
            total: totalTasks,
            completed: completedTasks,
            pending: pendingTasks,
            completionRate:
                taskCompletionRate
        },

        study: {
            sessions:
                totalStudySessions,

            minutes:
                totalStudyMinutes
        },

        goals: {
            total:
                totalGoals,

            completed:
                completedGoals,

            averageProgress:
                averageGoalProgress
        },

        pomodoro: {
            focus:
                Number(
                    pomodoroStats.focusSessions
                ) || 0,

            breaks:
                Number(
                    pomodoroStats.breakSessions
                ) || 0
        }

    };
}


/**
 * Updates statistics text values.
 */
function updateStatisticsUI(statistics) {

    /*
     * Summary
     */
    document.getElementById(
        "statistics-task-rate"
    ).textContent =
        `${statistics.tasks.completionRate}%`;

    document.getElementById(
        "statistics-study-time"
    ).textContent =
        formatStatisticsStudyTime(
            statistics.study.minutes
        );

    document.getElementById(
        "statistics-goal-progress"
    ).textContent =
        `${statistics.goals.averageProgress}%`;

    document.getElementById(
        "statistics-focus-sessions"
    ).textContent =
        statistics.pomodoro.focus;


    /*
     * Tasks
     */
    document.getElementById(
        "statistics-total-tasks"
    ).textContent =
        statistics.tasks.total;

    document.getElementById(
        "statistics-completed-tasks"
    ).textContent =
        statistics.tasks.completed;

    document.getElementById(
        "statistics-pending-tasks"
    ).textContent =
        statistics.tasks.pending;


    /*
     * Goals
     */
    document.getElementById(
        "statistics-total-goals"
    ).textContent =
        statistics.goals.total;

    document.getElementById(
        "statistics-completed-goals"
    ).textContent =
        statistics.goals.completed;


    /*
     * Study
     */
    document.getElementById(
        "statistics-study-sessions"
    ).textContent =
        statistics.study.sessions;

    document.getElementById(
        "statistics-study-minutes"
    ).textContent =
        statistics.study.minutes;


    /*
     * Pomodoro
     */
    document.getElementById(
        "statistics-pomodoro-focus"
    ).textContent =
        statistics.pomodoro.focus;

    document.getElementById(
        "statistics-pomodoro-breaks"
    ).textContent =
        statistics.pomodoro.breaks;
}


/**
 * Renders task completion chart.
 */
function renderTaskStatisticsChart(statistics) {

    const canvas =
        document.getElementById(
            "task-statistics-chart"
        );

    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {
        return;
    }


    if (taskStatisticsChart) {

        taskStatisticsChart.destroy();
    }


    taskStatisticsChart =
        new Chart(
            canvas,
            {
                type: "doughnut",

                data: {

                    labels: [
                        "Completed",
                        "Pending"
                    ],

                    datasets: [
                        {

                            data: [
                                statistics
                                    .tasks
                                    .completed,

                                statistics
                                    .tasks
                                    .pending
                            ],

                            backgroundColor: [
                                "#6366f1",
                                "#27272a"
                            ],

                            borderWidth: 0

                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                color: "#a1a1aa",

                                padding: 16,

                                usePointStyle: true

                            }

                        }

                    },

                    cutout: "70%"

                }
            }
        );
}


/**
 * Renders goal progress chart.
 */
function renderGoalStatisticsChart() {

    const canvas =
        document.getElementById(
            "goal-statistics-chart"
        );

    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {
        return;
    }


    if (goalStatisticsChart) {

        goalStatisticsChart.destroy();
    }


    const goals =
        loadGoals();


    goalStatisticsChart =
        new Chart(
            canvas,
            {
                type: "bar",

                data: {

                    labels:
                        goals.map(
                            goal =>
                                goal.title
                        ),

                    datasets: [
                        {

                            label:
                                "Progress",

                            data:
                                goals.map(
                                    goal =>
                                        Number(
                                            goal.progress
                                        ) || 0
                                ),

                            backgroundColor:
                                "#6366f1",

                            borderRadius: 6

                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            max: 100,

                            ticks: {

                                color:
                                    "#a1a1aa",

                                callback:
                                    value =>
                                        `${value}%`

                            },

                            grid: {

                                color:
                                    "rgba(255,255,255,0.05)"

                            }

                        },

                        x: {

                            ticks: {

                                color:
                                    "#a1a1aa"

                            },

                            grid: {

                                display:
                                    false

                            }

                        }

                    },

                    plugins: {

                        legend: {

                            display:
                                false

                        }

                    }

                }

            }
        );
}


/**
 * Updates all productivity statistics.
 */
function updateProductivityStatistics() {

    const statistics =
        getProductivityStatistics();


    updateStatisticsUI(
        statistics
    );

    renderTaskStatisticsChart(
        statistics
    );

    renderGoalStatisticsChart();
}


/**
 * Initializes productivity statistics.
 */
function initializeProductivityStatistics() {

    updateProductivityStatistics();
}
document.addEventListener("DOMContentLoaded", () => {

    console.log("DailyOS Initialized.");

    initializeApp();
    initializeTaskEvents();
    syncTaskUI();
    updateDashboardStats();
    initializePlanner();
    initializeStudyTracker();
    initializePomodoro();
    initializeNotes();
    initializeGoals();
    initializeProductivityStatistics();
    initializeCalendar();

});
