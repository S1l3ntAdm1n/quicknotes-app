// QuickNotes - Application Logic

// LocalStorage key constants
const STORAGE_KEY = "quicknotes_notes";

// Notes stored as an array of objects: { id, text, category, createdAt }
let notes = [];

// DOM elements selected strictly using querySelector as required
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const errorMessage = document.querySelector("#error-message");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const searchInput = document.querySelector("#search-input");
const clearAllBtn = document.querySelector("#clear-all-btn");

/**
 * Formats a date into a clean, human-readable string.
 * Example: "Oct 9, 2026, 11:00 AM"
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
 * Saves notes to localStorage using JSON.stringify.
 */
function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

/**
 * Loads notes from localStorage using JSON.parse.
 * Supports fallback to previous key if present.
 */
function loadNotes() {
  const savedData = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("quicknotes");
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
 * Updates the note count paragraph with correct grammatical messages:
 * - "You have no notes yet."
 * - "You have 1 note."
 * - "You have N notes."
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
 * Deletes an individual note by ID and updates storage and list.
 */
function deleteNote(id) {
  notes = notes.filter((note) => String(note.id) !== String(id));
  saveNotes();
  render();
}

/**
 * Rebuilds the notes list from the array using createElement and textContent.
 * NEVER uses innerHTML for user text.
 * Handles search filtering and empty search results.
 */
function render() {
  // Clear the existing list contents
  notesList.textContent = "";

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

  // Build each note card purely using DOM methods and textContent
  filteredNotes.forEach((note) => {
    const li = document.createElement("li");
    const categoryClass = `category-${note.category.toLowerCase()}`;
    li.className = `note-card ${categoryClass}`;

    // Note card header: category badge and timestamp
    const headerDiv = document.createElement("div");
    headerDiv.className = "note-card-header";

    const categoryBadge = document.createElement("span");
    categoryBadge.className = `category-badge ${categoryClass}`;
    categoryBadge.textContent = note.category;

    const dateSpan = document.createElement("span");
    dateSpan.className = "note-date";
    dateSpan.textContent = note.createdAt;

    headerDiv.appendChild(categoryBadge);
    headerDiv.appendChild(dateSpan);

    // Note card body: safe user text with textContent
    const bodyDiv = document.createElement("div");
    bodyDiv.className = "note-card-body";

    const textP = document.createElement("p");
    textP.className = "note-text";
    textP.textContent = note.text;

    bodyDiv.appendChild(textP);

    // Note card footer: delete button
    const footerDiv = document.createElement("div");
    footerDiv.className = "note-card-footer";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      deleteNote(note.id);
    });

    footerDiv.appendChild(deleteBtn);

    // Assemble note card
    li.appendChild(headerDiv);
    li.appendChild(bodyDiv);
    li.appendChild(footerDiv);

    notesList.appendChild(li);
  });

  updateNoteCount();
}

/**
 * Handles adding a new note with validation.
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

  // Clear validation error when a valid note is added
  errorMessage.textContent = "";

  const category = noteCategory.value;

  // Create note object with id, text, category and createdAt
  const newNote = {
    id: Date.now().toString(),
    text: trimmedText,
    category: category,
    createdAt: formatReadableDate(new Date()),
  };

  notes.push(newNote);
  saveNotes();
  render();

  // Clear input after adding
  noteInput.value = "";
}

/**
 * Bonus: Handles clearing all notes with confirmation prompt.
 */
function handleClearAll() {
  if (notes.length === 0) {
    return;
  }

  const confirmed = confirm("Delete all notes?");
  if (confirmed) {
    notes = [];
    saveNotes();
    render();
  }
}

// ---------------------------------------------------------------------------
// Event Listeners
// ---------------------------------------------------------------------------

// Form submit event
if (noteForm) {
  noteForm.addEventListener("submit", handleAddNote);
}

// Search input live filtering
if (searchInput) {
  searchInput.addEventListener("input", () => {
    render();
  });
}

// Bonus clear all button
if (clearAllBtn) {
  clearAllBtn.addEventListener("click", handleClearAll);
}

// Clear error message dynamically when typing valid text
if (noteInput) {
  noteInput.addEventListener("input", () => {
    if (errorMessage && errorMessage.textContent !== "") {
      const raw = noteInput.value;
      if (raw.trim().length > 0 && raw.length <= 200) {
        errorMessage.textContent = "";
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------
function init() {
  loadNotes();
  render();
}

// Initialize on page load
init();
