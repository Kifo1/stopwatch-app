import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import TimerPage from "./features/timer/TimerPage";
import Sidebar from "./shared/components/layout/Sidebar";

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-full w-full">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/timer" />} />
            <Route path="/timer" element={<TimerPage />} />
            <Route
              path="/projects"
              element={
                <div className="text-white">Projects is coming soon...</div>
              }
            />
            <Route
              path="/analytics"
              element={
                <div className="text-white">Analytics is coming soon...</div>
              }
            />
            <Route
              path="/settings"
              element={
                <div className="text-white">Settings is coming soon...</div>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
