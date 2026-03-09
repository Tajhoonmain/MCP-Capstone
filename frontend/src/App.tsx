import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
