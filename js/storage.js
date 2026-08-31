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
    studySessions: "dailyos_study_sessions",
    notes: "dailyos_notes",
    goals: "dailyos_goals",
    pomodoroStats: "dailyos_pomodoro_stats"
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
   Notes Storage
========================== */

/**
 * Save notes to Local Storage.
 *
 * @param {Array} notes
 */
function saveNotes(notes) {

    localStorage.setItem(
        STORAGE_KEYS.notes,
        JSON.stringify(notes)
    );
}


/**
 * Load notes from Local Storage.
 *
 * @returns {Array}
 */
function loadNotes() {

    const storedNotes =
        localStorage.getItem(
            STORAGE_KEYS.notes
        );

    if (!storedNotes) {
        return [];
    }

    try {

        return JSON.parse(storedNotes);

    } catch (error) {

        console.error(
            "Failed to load notes:",
            error
        );

        return [];
    }
}
/* ==========================
   Goals Storage
========================== */

/**
 * Save goals to Local Storage.
 *
 * @param {Array} goals
 */
function saveGoals(goals) {

    localStorage.setItem(
        STORAGE_KEYS.goals,
        JSON.stringify(goals)
    );
}


/**
 * Load goals from Local Storage.
 *
 * @returns {Array}
 */
function loadGoals() {

    const storedGoals =
        localStorage.getItem(
            STORAGE_KEYS.goals
        );

    if (!storedGoals) {
        return [];
    }

    try {

        return JSON.parse(
            storedGoals
        );

    } catch (error) {

        console.error(
            "Failed to load goals:",
            error
        );

        return [];
    }
}
/* ==========================
   Pomodoro Statistics Storage
========================== */

/**
 * Save Pomodoro statistics.
 *
 * @param {Object} stats
 */
function savePomodoroStats(stats) {

    localStorage.setItem(
        STORAGE_KEYS.pomodoroStats,
        JSON.stringify(stats)
    );
}


/**
 * Load Pomodoro statistics.
 *
 * @returns {Object}
 */
function loadPomodoroStats() {

    const storedStats =
        localStorage.getItem(
            STORAGE_KEYS.pomodoroStats
        );

    if (!storedStats) {

        return {
            focusSessions: 0,
            breakSessions: 0
        };
    }

    try {

        return JSON.parse(
            storedStats
        );

    } catch (error) {

        console.error(
            "Failed to load Pomodoro stats:",
            error
        );

        return {
            focusSessions: 0,
            breakSessions: 0
        };
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
    loadStudySessions,
    saveNotes,
    loadNotes,
    saveGoals,
    loadGoals,
    savePomodoroStats,
    loadPomodoroStats
};
