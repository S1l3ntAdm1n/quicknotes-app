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
 * Updates the note count paragraph:
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

  updateNoteCount();
}

/**
 * Deletes a note by its ID.
 */
function deleteNote(id) {
  notes = notes.filter((note) => String(note.id) !== String(id));
  renderNotes();
}

/**
 * Handles note form submission with validation.
 */
function handleAddNote(event) {
  event.preventDefault();

  const rawText = noteInput.value;
  const trimmedText = rawText.trim();

  // Validation 1: empty or only spaces
  if (trimmedText === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  // Validation 2: over 200 characters
  if (rawText.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  // Clear error message when valid note is added
  errorMessage.textContent = "";

  const category = noteCategory.value;

  const newNote = {
    id: Date.now().toString(),
    text: trimmedText,
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

// Event delegation for delete buttons
notesList.addEventListener("click", (event) => {
  const target = event.target;
  if (target && target.classList.contains("delete-btn")) {
    const id = target.getAttribute("data-id");
    if (id) {
      deleteNote(id);
    }
  }
});

// Clear error message as user types
noteInput.addEventListener("input", () => {
  if (errorMessage.textContent !== "") {
    const raw = noteInput.value;
    if (raw.trim().length > 0 && raw.length <= 200) {
      errorMessage.textContent = "";
    }
  }
});

// Initial count update
updateNoteCount();
