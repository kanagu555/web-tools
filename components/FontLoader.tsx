"use client"

import { useEffect } from 'react'

export default function FontLoader() {
  useEffect(() => {
    // Check if font is already loaded
    if (document.fonts) {
      document.fonts.ready.then(function() {
        document.body.classList.remove('material-icons-loading')
        document.body.classList.add('material-icons-loaded')
      })
    } else {
      // Fallback for browsers without Font Loading API
      setTimeout(function() {
        document.body.classList.remove('material-icons-loading')
        document.body.classList.add('material-icons-loaded')
      }, 100)
    }
  }, [])

  return null
}