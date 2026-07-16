# GitHub Profile Finder

A vanilla JavaScript app that looks up any GitHub username and displays their profile info and top repositories — no frameworks, no build tools, just fetch + the DOM.

**[Live Demo](#)** · **[Report a bug](#)**

---

## Features

- 🔍 Search any GitHub username and view their public profile
- ⏱️ Debounced search — fetches automatically as you type, without spamming the API on every keystroke
- 📦 Displays avatar, name, bio, location, followers, and following count
- ⭐ Shows top 6 repositories sorted by stars, with description and a direct link
- ⚡ Profile and repo data fetched in parallel (`Promise.all`) instead of sequentially
- 🚨 Inline error handling for invalid usernames and network failures — no blocking `alert()` popups
- 💬 Loading state on the search button while a request is in flight

---

## Tech Stack

- **HTML5** — semantic structure
- **CSS3** — custom styling, no frameworks
- **Vanilla JavaScript (ES6+)** — async/await, closures, debounce, destructuring, template literals
- **[GitHub REST API](https://docs.github.com/en/rest)** — `/users/{username}` and `/users/{username}/repos`

No frameworks, no libraries, no build step — open `index.html` and it runs.

---

## How It Works

1. User types a username into the search field
2. Input is **debounced by 300ms** — the search only fires once typing pauses, avoiding unnecessary API calls
3. Two API requests (user profile + top repos) run **in parallel** via `Promise.all`
4. Results are rendered into the DOM; a 404 shows an inline "user not found" message instead of a popup
5. Clicking any repo card opens it on GitHub in a new tab

---

## Getting Started

No installation needed — this is a static site.

```bash
git clone https://github.com/<your-username>/github-profile-finder.git
cd github-profile-finder
```

Then just open `index.html` in your browser, or serve it locally:

```bash
npx serve .
```

---

## Project Structure

```
├── index.html      # Page structure
├── style.css       # Styling
├── script.js       # App logic — fetch calls, DOM rendering, debounce, event handling
└── README.md
```

---

## What I Practiced Building This

This project was built while learning core JavaScript concepts from scratch, and intentionally used as practice for:

- **Closures** — the debounce function relies on a closure to remember the timer between calls
- **Async/await & Promises** — `Promise.all` for parallel API requests instead of sequential `await` calls
- **DOM manipulation** — dynamically creating and updating elements without a framework
- **Event handling** — click, input, and keydown listeners, plus debounced input handling
- **Error handling** — distinguishing a "user not found" (404) response from a network/server failure

---

## Known Limitations / Possible Improvements

- No handling yet for out-of-order responses if a slow request resolves after a newer one (race condition on rapid typing)
- No pagination for repositories beyond the top 6
- No caching — searching the same username twice re-fetches from the API each time

---

## License

MIT — free to use, modify, and learn from.
