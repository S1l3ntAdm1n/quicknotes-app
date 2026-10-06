// QuickNotes - Note Taking Application Logic

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

/**
 * Formats a date into a human-readable string.
 * e.g., "Oct 6, 2026, 6:30 PM"
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
 * Escapes HTML to prevent XSS vulnerabilities.
 */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Renders notes in the notes list.
 */
function renderNotes() {
  notesList.innerHTML = "";

  notes.forEach((note) => {
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
}

/**
 * Handles note form submission.
 */
function handleAddNote(event) {
  event.preventDefault();

  const text = noteInput.value;
  const category = noteCategory.value;

  const newNote = {
    id: Date.now().toString(),
    text: text,
    category: category,
    createdAt: formatReadableDate(new Date()),
  };

  notes.push(newNote);
  renderNotes();

  // Clear input
  noteInput.value = "";
}

// Event Listeners
noteForm.addEventListener("submit", handleAddNote);
