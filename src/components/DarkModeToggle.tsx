import { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    if (isDark) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [isDark])
  return (
    <button className="px-3 py-1 rounded-md border text-sm" onClick={() => setIsDark(v => !v)}>
      {isDark ? 'Light' : 'Dark'}
    </button>
  )
}


