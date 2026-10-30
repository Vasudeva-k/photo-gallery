import { useState, useReducer, useEffect, useCallback, useMemo } from 'react'
import useFetchPhotos from '../hooks/useFetchPhotos'
import PhotoCard from './PhotoCard'

// Key used for saving and loading favourites in localStorage
const FAVOURITES_STORAGE_KEY = 'photo_gallery_favourites'

// Action types for useReducer
const TOGGLE_FAVOURITE = 'TOGGLE_FAVOURITE'

// Reducer function to handle favourite state transitions
function favouritesReducer(state, action) {
  switch (action.type) {
    case TOGGLE_FAVOURITE: {
      const photoId = action.payload
      // If photo is already in favourites, remove it; otherwise, add it
      if (state.includes(photoId)) {
        return state.filter((id) => id !== photoId)
      } else {
        return [...state, photoId]
      }
    }
    default:
      return state
  }
}

// Helper to restore favourites from localStorage when the app loads
function getInitialFavourites() {
  try {
    const saved = localStorage.getItem(FAVOURITES_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Failed to restore favourites from localStorage:', error)
    return []
  }
}

function Gallery() {
  // 1. Fetch photos, loading, and error states using custom hook
  const { photos, loading, error } = useFetchPhotos()

  // 2. Search state for real-time author filtering
  const [searchTerm, setSearchTerm] = useState('')

  // 3. Favourite management using useReducer (restoring from localStorage on initial load)
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    [],
    getInitialFavourites
  )

  // 4. Save favourites to localStorage whenever favourites state updates
  useEffect(() => {
    try {
      localStorage.setItem(
        FAVOURITES_STORAGE_KEY,
        JSON.stringify(favourites)
      )
    } catch (error) {
      console.error('Failed to save favourites to localStorage:', error)
    }
  }, [favourites])

  // 5. useCallback for the search input change handler
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value)
  }, [])

  // 6. Callback for toggling favourites via useReducer dispatch
  const handleToggleFavourite = useCallback((photoId) => {
    dispatch({ type: TOGGLE_FAVOURITE, payload: photoId })
  }, [])

  // 7. useMemo to compute filtered photos in real-time without extra API calls
  const filteredPhotos = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) {
      return photos
    }
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(term)
    )
  }, [photos, searchTerm])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Photo Gallery
          </h1>
          <p className="mt-2 text-base text-gray-600 max-w-xl mx-auto">
            Browse photographs from Picsum, search in real-time by author, and save your favourite photos.
          </p>

          {/* Real-time Author Search Input */}
          <div className="mt-6 max-w-md mx-auto relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by author name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
          </div>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-base font-medium text-gray-600">
              Loading photos...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-lg mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center text-red-700 my-8">
            <p className="font-semibold text-lg">Error loading photos</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Empty State when search yields no matches */}
        {!loading && !error && filteredPhotos.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg font-medium text-gray-700">No photos found</p>
            <p className="text-sm mt-1 text-gray-500">
              No authors matched &ldquo;{searchTerm}&rdquo;. Try another search term.
            </p>
          </div>
        )}

        {/* Responsive Gallery Grid: 4 columns on desktop, 2 on tablet, 1 on mobile */}
        {!loading && !error && filteredPhotos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFavourite={favourites.includes(photo.id)}
                onToggleFavourite={handleToggleFavourite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Gallery
