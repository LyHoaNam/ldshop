# Feature Overview

This app is a static internal lunch-order helper for Tiem Com Nam Vinh. It uses browser storage for daily state and reads shared JSON files for stores/runners.

## User Features

### Daily Header
- Shows today's order link.
- Shows the selected pickup person with name and avatar.
- Empty states are shown when admin has not updated the order link or selected a pickup person.

### Quan An Section
User sees a `Quan an` section with three tabs:

- `Danh sach quan an`: displays stores loaded from `quan-an.json`.
- `Request quan an moi`: lets user submit a new store request with name, icon, tags, and note.
- `Danh sach da request`: shows requests submitted in the current browser session using `sessionStorage`.

### Daily Store Survey
- Sidebar section `Khao sat quan muon an hom nay`.
- Uses a multi-select dropdown populated from `quan-an.json`.
- A browser can select multiple stores.
- The selected options are saved in `sessionStorage` for the current day.
- Selection is cleared automatically when the local date changes at 00:00.

### Ranking
- Sidebar section `Bang xep hang`.
- Displays store name and vote count.
- Shows top 5 by default.
- If no stores have votes, it shows the first 5 stores from `quan-an.json`.
- `Xem them` expands the list; `Thu gon` collapses it.

## Admin Access

Admin login is hidden by default.

- Click the owner image in the header to reveal the admin login section.
- Password is hardcoded in `js/config.js` for this internal static app.
- After login, admin-only management sections become visible.

## Admin Features

### Daily Controls
- Update today's order link.
- Reset today's state.
- Open settings.
- Logout.

Daily reset clears:
- Order link.
- Pickup person.
- Daily survey data.

### Quan Ly Quan An
Admin sees a `Quan ly quan an` section with four tabs:

- `Chon quan an hom nay`
  - Shows recommended stores based on survey/ranking.
  - Lets admin select stores for a store race.
  - Includes a dedicated store race UI.
  - `Dua chon quan hom nay` races selected stores and picks a winning store.

- `User request quan an`
  - Shows pending store requests.
  - Admin can approve or reject requests.
  - Approved requests are added to the store list.

- `Add quan moi`
  - Admin can add a new store with name, icon, and tags.

- `Danh sach hien tai`
  - Shows current stores.
  - Admin can edit or delete stores.

### Quan Ly Nguoi Dua
Admin sees a `Quan ly nguoi dua` section with two tabs:

- `Select runner daily`
  - Shows runners loaded from `runner.json`.
  - Admin selects daily order participants.
  - Includes a dedicated runner race UI.
  - Race winner is saved as today's pickup person and appears in the header.

- `Add runner`
  - Admin can add a runner with name and avatar path.

## Race Behavior

There are two separate race tracks:

- Runner race track in `Quan ly nguoi dua`.
- Store race track in `Quan ly quan an`.

This prevents selected stores from appearing in the runner race UI, and selected runners from appearing in the store race UI.

## Data Files

### `quan-an.json`
Main store list.

Used for:
- User store list.
- Daily survey options.
- Ranking fallback.
- Admin store management.

### `quan-an-requests.json`
Shared request queue for store recommendations.

Used for:
- User store request submission.
- Admin approve/reject flow.

### `runner.json`
Main runner list.

Used for:
- Admin daily runner selection.
- Runner race.
- Adding new runners.

## Storage

### `localStorage`
Used for:
- Daily state.
- Daily survey vote data.
- Fallback data when JSON file access is not available.
- Admin session-independent app settings.

### `sessionStorage`
Used for:
- Admin login session.
- User's submitted request list for the current browser session.
- User's selected survey options for the current day.

## Important Notes

- Store data for user-facing lists is fetched from `quan-an.json` first.
- `localStorage` is only a fallback for store data.
- Direct file write requires browser support for the File System Access API, generally Chrome or Edge desktop.
- If the app is opened with `file://`, browser security may block `fetch('quan-an.json')`; use a local/static server.
