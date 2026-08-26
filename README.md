# 🚀 DailyOS

<div align="center">

### A Personal Productivity Dashboard for Daily Life

**Plan your day. Manage your tasks. Stay organized.**

DailyOS is a modern, lightweight productivity dashboard designed to bring everyday task management and planning into one focused workspace.

<p>
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-getting-started">Getting Started</a>
</p>

<p>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/LocalStorage-API-success?style=for-the-badge" alt="Local Storage">
  <img src="https://img.shields.io/badge/Responsive-Design-blueviolet?style=for-the-badge" alt="Responsive Design">
</p>

</div>

---

## 📖 Overview

**DailyOS** is a personal productivity dashboard built to help users manage their everyday activities from a single, organized interface.

Instead of switching between multiple tools, DailyOS provides a centralized workspace for managing tasks and planning the day.

The project focuses on a clean user interface, simple interactions, persistent local data, and a lightweight architecture that runs entirely in the browser.

---

## ✨ Features

### ✅ Task Management

* Create and manage daily tasks
* Mark tasks as completed
* Track total and completed tasks
* Search tasks
* Filter tasks by completion status
* Dynamic task statistics
* Empty-state handling

### 📅 Daily Planner

* Create daily plans
* Set a specific time for each plan
* Add a title and description
* Display planned activities in an organized list
* Sort planner items by time
* Edit and manage planner data
* Persistent planner data using Local Storage

### 💾 Local Data Persistence

DailyOS uses the browser's **Local Storage API** to preserve user data.

This means tasks and planner items remain available after refreshing or reopening the browser without requiring a backend or database.

### 🎨 Modern UI

* Clean productivity-focused interface
* Responsive layout
* Reusable UI components
* Modal-based planner interaction
* Dashboard-style statistics
* Custom CSS architecture

---

## 🛠️ Tech Stack

| Technology            | Purpose                                   |
| --------------------- | ----------------------------------------- |
| **HTML5**             | Page structure and semantic markup        |
| **CSS3**              | Layout, styling, responsive design and UI |
| **JavaScript ES6**    | Application logic and interactions        |
| **Local Storage API** | Client-side data persistence              |
| **Font Awesome**      | Icons and visual elements                 |

### Development Philosophy

DailyOS is intentionally built without a frontend framework or backend.

The project uses:

* Vanilla JavaScript
* Modular CSS files
* Browser APIs
* Client-side data storage

This keeps the application lightweight, understandable, and easy to deploy as a static website.

---

## 📁 Project Structure

```text
DailyOS/
│
├── index.html
│
├── css/
│   ├── reset.css
│   ├── variables.css
│   └── style.css
│
├── js/
│   ├── app.js
│   └── storage.js
│
├── assets/
│   ├── icons
│   └── images
│
└── README.md
```

### File Responsibilities

**`index.html`**
Contains the main application structure and UI elements.

**`css/reset.css`**
Provides basic CSS normalization and reset styles.

**`css/variables.css`**
Contains reusable CSS variables such as colors, spacing, dimensions, and layout values.

**`css/style.css`**
Contains the main application styling and responsive UI rules.

**`js/app.js`**
Handles application initialization, task management, planner interactions, filtering, searching, rendering, and dashboard updates.

**`js/storage.js`**
Handles Local Storage operations for persistent application data.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Pronob155/DailyOS.git
```

### 2. Navigate to the Project

```bash
cd DailyOS
```

### 3. Run the Project

Because DailyOS is a static web application, no backend server or database is required.

You can simply open:

```text
index.html
```

in your browser.

For development, you can also use **VS Code Live Server**.

---

## 🌐 Deployment

DailyOS is designed to work as a static website and can be deployed using **GitHub Pages**.

No backend server or database is required.

### GitHub Pages

1. Push the project to GitHub.
2. Open the repository settings.
3. Go to **Pages**.
4. Select the appropriate branch.
5. Save the configuration.
6. GitHub will generate the live website URL.

---

## 🗺️ Development Roadmap

DailyOS is being developed feature by feature.

### ✅ Completed

* [x] Project foundation
* [x] Dashboard layout
* [x] Task management
* [x] Task search
* [x] Task filtering
* [x] Task completion tracking
* [x] Dashboard task statistics
* [x] Daily planner
* [x] Planner modal
* [x] Planner item creation
* [x] Planner item sorting
* [x] Local Storage integration

### 🚧 Upcoming

* [ ] Notes system
* [ ] Productivity analytics
* [ ] Goals and progress tracking
* [ ] Habit tracking
* [ ] Calendar integration
* [ ] Reminder system
* [ ] Advanced dashboard insights
* [ ] UI/UX refinement
* [ ] Improved accessibility
* [ ] Additional productivity tools

### 💡 Future Ideas

* [ ] Cloud synchronization
* [ ] User accounts
* [ ] Cross-device data synchronization
* [ ] AI-powered productivity features

---

## 🎯 Project Goals

The main goals of DailyOS are to:

* Build a practical productivity application from scratch
* Strengthen HTML, CSS, and JavaScript skills
* Practice DOM manipulation and event-driven programming
* Understand client-side data persistence
* Design a scalable frontend structure
* Create a professional portfolio project
* Build something useful for everyday personal productivity

---

## 🔒 Privacy

DailyOS currently stores application data locally in the user's browser.

There is no backend server or external database handling personal task or planner data.

---

## 👨‍💻 Author

### Pronob Das

**GitHub:**
https://github.com/Pronob155

---

## ⭐ Support

If you find DailyOS useful or interesting, consider giving the repository a **⭐ Star** on GitHub.

Feedback and suggestions are always welcome.

---

<div align="center">

### 🚀 Plan Better. Work Smarter. Live Better.

**DailyOS — Your Personal Productivity Workspace**

</div>
