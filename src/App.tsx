import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [stopwatchMsg, setStopwatchMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  async function stopwatch() {
    setStopwatchMsg(await invoke("stopwatch"));
  }

  return (
    <main>
      <form
        className=""
        onSubmit={(e) => {
          e.preventDefault();
          greet();
          stopwatch();
        }}
      >
        <input
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button className="hover:cursor-pointer" type="submit">
          Greet
        </button>
      </form>
      <p>{greetMsg}</p>
      <p>{stopwatchMsg}</p>
    </main>
  );
}

export default App;
