import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ThreeScene from "./components/ThreeScene";
import CannonJs from "./components/CannonJs";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="p-5">
        <h1 className="">three js</h1>
        <ThreeScene />
        <CannonJs />
      </div>
    </>
  );
}

export default App;
