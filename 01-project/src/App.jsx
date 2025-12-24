import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Notes from './assets/Components/Notes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Notes />
    </>
  )
}

export default App
