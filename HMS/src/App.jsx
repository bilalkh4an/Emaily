import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PatientRegistration from './Components/PatientRegistration'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <PatientRegistration />
    </>
  )
}

export default App
