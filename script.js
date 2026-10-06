// QuickNotes - Adapted from Day 4 Logic with Project 1 Features

const STORAGE_KEY = "quicknotes";

// Global notes array
let notes = [];

// DOM Elements
const noteForm = document.getElementById("note-form");
const noteInput = document.getElementById("note-input");
const noteCategory = document.getElementById("note-category");
const errorMessage = document.getElementById("error-message");
const notesList = document.getElementById("notes-list");
const noteCount = document.getElementById("note-count");
const searchInput = document.getElementById("search-input");
const clearAllBtn = document.getElementById("clear-all-btn");
const themeToggle = document.getElementById("theme-toggle");

/**
 * Formats a date into a readable string (e.g. "Oct 6, 2026, 6:30 PM").
 */
function formatReadableDate(date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Escapes HTML characters to prevent XSS.
 */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Saves notes to localStorage using JSON.stringify.
 */
function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

/**
 * Loads notes from localStorage using JSON.parse.
 */
function loadNotes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      notes = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      notes = [];
    }
  } else {
    notes = [];
  }
}

/**
 * Updates #note-count correctly:
 * "You have no notes yet.", "You have 1 note." or "You have N notes."
 */
function updateNoteCount() {
  const count = notes.length;
  if (count === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (count === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${count} notes.`;
  }
}

/**
 * Renders note cards, category classes, badges, dates, and delete buttons.
 * Supports case-insensitive search filtering.
 */
function renderNotes() {
  notesList.innerHTML = "";

  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

  // Filter notes (case-insensitive)
  const filteredNotes = query === ""
    ? notes
    : notes.filter((n) => n.text.toLowerCase().includes(query));

  // If search finds nothing, show message in the list
  if (query !== "" && filteredNotes.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.className = "empty-state-message";
    emptyLi.textContent = "No notes match your search.";
    notesList.appendChild(emptyLi);
    updateNoteCount();
    return;
  }

  // Render cards
  filteredNotes.forEach((note) => {
    const li = document.createElement("li");
    const categoryClass = `category-${note.category.toLowerCase()}`;
    li.className = `note-card ${categoryClass}`;
    li.setAttribute("data-id", note.id);

    li.innerHTML = `
      <div class="note-card-header">
        <span class="category-badge ${categoryClass}">${escapeHtml(note.category)}</span>
        <span class="note-date">${escapeHtml(note.createdAt)}</span>
      </div>
      <div class="note-card-body">
        <p class="note-text">${escapeHtml(note.text)}</p>
      </div>
      <div class="note-card-footer">
        <button type="button" class="delete-btn" data-id="${escapeHtml(String(note.id))}">Delete</button>
      </div>
    `;

    notesList.appendChild(li);
  });

  updateNoteCount();
}

/**
 * Deletes a single note by id.
 */
function deleteNote(id) {
  notes = notes.filter((n) => String(n.id) !== String(id));
  saveNotes();
  renderNotes();
}

/**
 * Handles note submission and input validation.
 */
function handleAddNote(event) {
  event.preventDefault();

  const rawText = noteInput.value;
  const trimmedText = rawText.trim();

  // Task 4: Empty validation
  if (trimmedText === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  // Task 4: >200 chars validation
  if (rawText.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  // Clear error on valid note
  errorMessage.textContent = "";

  const newNote = {
    id: Date.now().toString(),
    text: trimmedText,
    category: noteCategory.value,
    createdAt: formatReadableDate(new Date()),
  };

  notes.push(newNote);
  saveNotes();
  renderNotes();

  // Clear input after adding
  noteInput.value = "";
}

/**
 * Bonus: Clear all notes with confirm prompt.
 */
function handleClearAll() {
  if (notes.length === 0) return;
  if (confirm("Delete all notes?")) {
    notes = [];
    saveNotes();
    renderNotes();
  }
}

// ---------------------------------------------------------------------------
// Event Listeners
// ---------------------------------------------------------------------------

noteForm.addEventListener("submit", handleAddNote);

notesList.addEventListener("click", (event) => {
  const target = event.target;
  if (target && target.classList.contains("delete-btn")) {
    const id = target.getAttribute("data-id");
    if (id) deleteNote(id);
  }
});

if (searchInput) {
  searchInput.addEventListener("input", renderNotes);
}

if (clearAllBtn) {
  clearAllBtn.addEventListener("click", handleClearAll);
}

noteInput.addEventListener("input", () => {
  if (errorMessage.textContent !== "") {
    const raw = noteInput.value;
    if (raw.trim().length > 0 && raw.length <= 200) {
      errorMessage.textContent = "";
    }
  }
});

// Day 4: Theme toggle support
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------
function init() {
  // Day 4: Restore theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    if (themeToggle) themeToggle.textContent = "Light mode";
  } else {
    document.body.classList.remove("dark");
    if (themeToggle) themeToggle.textContent = "Dark mode";
  }

  loadNotes();
  renderNotes();
}

init();
