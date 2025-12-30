import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Registration from "./Components/Registration";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Nav from "./Components/Nav";
import Aside from "./Components/aside";
import Project from "./Components/Project";




function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Nav />
      <div className="flex h-screen ">        
          <Aside /> 
          <Project />
      </div>      
    </>
  );
}

export default App;
