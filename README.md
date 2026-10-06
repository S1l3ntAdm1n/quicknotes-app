# QuickNotes

QuickNotes is a lightweight, intuitive note-taking web application designed to help users quickly capture, organize, and manage thoughts with categorized visual tags and instant client-side search. Built purely with semantic HTML5, modern vanilla CSS, and vanilla JavaScript, QuickNotes persists your notes directly in your browser's local storage so that your data is seamlessly preserved across browser reloads without requiring an external backend or database.

## Features

- **Categorized Note Creation**: Assign notes to distinct categories (**Personal**, **Work**, **Study**) featuring dedicated color-coded accent borders and badges (`category-personal`, `category-work`, `category-study`).
- **Live Input Validation**: Prevents blank notes with the error message *"Please type a note first."* and enforces a 200-character limit with *"Notes must be 200 characters or fewer."* displayed directly in `#error-message`.
- **Accurate Note Counter**: Live counter tracking in `#note-count` providing grammatical feedback for zero (*"You have no notes yet."*), one (*"You have 1 note."*), and multiple (*"You have N notes."*) items.
- **Instant Search Filtering**: Real-time, case-insensitive keyword filtering as you type into `#search-input`, showing a dedicated *"No notes match your search."* message when no results match.
- **Client-Side Persistence**: Automatic data synchronization to `localStorage` using `JSON.stringify` and `JSON.parse` ensures notes survive page refreshes and re-renders.
- **Individual and Bulk Deletion**: Easily remove single notes via per-card Delete buttons or delete all notes at once with a safe confirmation dialogue (`confirm("Delete all notes?")`).
- **Responsive Flexbox Design**: A clean, accessible layout that centers cards on desktop (max 700px width) and automatically collapses form controls vertically on screens 600px or narrower.

## How to Run the Project Locally

No build tools, compilation, or external package installations are needed to run QuickNotes.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/S1l3ntAdm1n/quicknotes-app.git
   cd quicknotes-app
   ```

2. **Open in your browser**:
   - Double-click `index.html` in your file explorer, or
   - Right-click `index.html` in VS Code and select **Open with Live Server**, or
   - Start a simple local server using Python or Node.js:
     ```bash
     # Using Python 3
     python -m http.server 3000

     # Or using npx
     npx serve .
     ```
   - Open [http://localhost:3000](http://localhost:3000) in your web browser.

## What I Learned

1. **Robust Client-Side Validation and Accessible Error Handling**: Learned how to implement two-tiered input validation (checking for empty/whitespace-only input as well as upper character limits) while surfacing accessible error messages with ARIA live regions and dynamically clearing errors on user correction.
2. **State Management and LocalStorage Synchronization**: Practiced serializing structured JavaScript objects into JSON strings and deserializing them back on page load with defensive fallback parsing, ensuring application state is resilient across page refreshes.
3. **Event Delegation and Dynamic DOM Manipulation**: Gained deeper understanding of managing dynamically added elements using event delegation on parent containers (`#notes-list`) for single-item deletion, keeping event listeners efficient and scalable.
4. **Responsive Mobile-First CSS with Semantic Flexbox**: Mastered creating accessible form structures using semantic `<label>` and `<input>` pairings alongside CSS media queries (`max-width: 600px`) and color-coded category border styling.
