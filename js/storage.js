/**
 * DailyOS - Local Storage Manager
 *
 * Handles saving and loading application data
 * from the browser's Local Storage API.
 */


/* ==========================
   Storage Configuration
========================== */

const STORAGE_KEYS = {
    tasks: "dailyos_tasks",
    studySessions: "dailyos_study_sessions"
};
/* ==========================
   Study Session Storage
========================== */

/**
 * Save study sessions to Local Storage.
 *
 * @param {Array} sessions
 */
function saveStudySessions(sessions) {

    localStorage.setItem(
        STORAGE_KEYS.studySessions,
        JSON.stringify(sessions)
    );
}


/**
 * Load study sessions from Local Storage.
 *
 * @returns {Array}
 */
function loadStudySessions() {

    const storedSessions =
        localStorage.getItem(
            STORAGE_KEYS.studySessions
        );

    if (!storedSessions) {
        return [];
    }

    try {

        return JSON.parse(storedSessions);

    } catch (error) {

        console.error(
            "Failed to load study sessions:",
            error
        );

        return [];
    }
}

/* ==========================
   Task Storage
========================== */

/**
 * Save tasks to Local Storage.
 *
 * @param {Array} tasks - Array of task objects
 */
function saveTasks(tasks) {

    localStorage.setItem(
        STORAGE_KEYS.tasks,
        JSON.stringify(tasks)
    );
}


/**
 * Load tasks from Local Storage.
 *
 * @returns {Array} Stored tasks or an empty array
 */
function loadTasks() {

    const storedTasks = localStorage.getItem(
        STORAGE_KEYS.tasks
    );

    if (!storedTasks) {
        return [];
    }

    try {

        return JSON.parse(storedTasks);

    } catch (error) {

        console.error(
            "Failed to load tasks from Local Storage:",
            error
        );

        return [];
    }
}
export {
    saveTasks,
    loadTasks,
    saveStudySessions,
    loadStudySessions
};
