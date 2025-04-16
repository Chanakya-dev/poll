import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./components/Form";
import SceneryPage from "./components/ScenaryPage";
import PollRoom from "./components/PollRoom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/scenery/:roomId" element={<SceneryPage />} />
        <Route path="/pollroom/:roomId/:sceneId" element={<PollRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
