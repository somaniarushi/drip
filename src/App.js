import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Results from "./pages/Results";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="settings" element={<Settings />} />
        <Route path="results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}