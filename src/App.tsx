import TimerPage from "./features/timer/TimerPage";
import Sidebar from "./shared/components/layout/Sidebar";

function App() {
  return (
    <>
      <div className="flex h-full w-full">
        <Sidebar />
        <div className="m-auto">
          <TimerPage />
        </div>
      </div>
    </>
  );
}

export default App;
