# Photo Gallery Application

A responsive Photo Gallery web application built using **React**, **Vite**, and **Tailwind CSS**, consuming photographs from the **Picsum Photos API**.

---

## Features

- **Data Fetching via Custom Hook**: Uses `useFetchPhotos` to load 30 photos on mount from `https://picsum.photos/v2/list?limit=30`, providing `photos`, `loading`, and `error` states.
- **Responsive Layout**:
  - **Desktop (>= 1024px)**: 4 columns
  - **Tablet (>= 768px)**: 2 columns
  - **Mobile (< 768px)**: 1 column
- **Photo Cards**:
  - Displays photo image via `photo.download_url`.
  - Displays author name.
  - Interactive heart button to toggle favourite status.
- **Real-Time Author Search**:
  - Filters pre-fetched photos in memory without making extra API calls.
  - Optimized with `useCallback` for the search handler and `useMemo` for the filtered list.
  - Includes an empty search results state if no author matches.
- **Favourite Management via `useReducer`**:
  - Uses `useReducer` to handle toggling favourite status.
  - Persists favourites to `localStorage` and restores them automatically upon page reload.
- **Loading & Error Handling**:
  - Clean animated spinner during data fetch.
  - Informative error banner if the API call fails.

---

## Tech Stack

- **React 19**
- **Vite**
- **Tailwind CSS v4**
- **Oxlint**

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`.

### 3. Build for Production
```bash
npm run build
```

### 4. Run Linter
```bash
npm run lint
```
