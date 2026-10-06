// QuickNotes - Note Taking Application Logic
// LocalStorage key constant
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
 * Saves the current notes array to localStorage.
 */
function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

/**
 * Loads notes from localStorage upon application startup.
 */
function loadNotes() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      if (Array.isArray(parsed)) {
        notes = parsed;
      } else {
        notes = [];
      }
    } catch (e) {
      console.error("Failed to parse notes from localStorage:", e);
      notes = [];
    }
  } else {
    notes = [];
  }
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
 * Supports filtering by search keyword and empty state messages.
 */
function renderNotes() {
  notesList.innerHTML = "";

  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

  // Filter notes based on search query (case-insensitive)
  const filteredNotes = query === ""
    ? notes
    : notes.filter((note) => note.text.toLowerCase().includes(query));

  // If a search finds nothing, show a message in the list
  if (query !== "" && filteredNotes.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.className = "empty-state-message";
    emptyLi.textContent = "No notes match your search.";
    notesList.appendChild(emptyLi);
    updateNoteCount();
    return;
  }

  // Render note cards
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
 * Deletes a note by its ID and updates storage.
 */
function deleteNote(id) {
  notes = notes.filter((note) => String(note.id) !== String(id));
  saveNotes();
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
  saveNotes();
  renderNotes();

  // Clear input
  noteInput.value = "";
}

/**
 * Handles clearing all notes with confirmation prompt.
 */
function handleClearAll() {
  if (notes.length === 0) {
    return;
  }

  const confirmed = confirm("Delete all notes?");
  if (confirmed) {
    notes = [];
    saveNotes();
    renderNotes();
  }
}

// ---------------------------------------------------------------------------
// Event Listeners
// ---------------------------------------------------------------------------

// Form submit event
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

// Search input live filtering
if (searchInput) {
  searchInput.addEventListener("input", () => {
    renderNotes();
  });
}

// Clear all button
if (clearAllBtn) {
  clearAllBtn.addEventListener("click", handleClearAll);
}

// Clear error message dynamically as user types valid text
noteInput.addEventListener("input", () => {
  if (errorMessage.textContent !== "") {
    const raw = noteInput.value;
    if (raw.trim().length > 0 && raw.length <= 200) {
      errorMessage.textContent = "";
    }
  }
});

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------
function init() {
  loadNotes();
  renderNotes();
}

// Initialize on script load
init();
