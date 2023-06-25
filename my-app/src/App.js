import Navbar from "./Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import NewQuestion from "./NewQuestion";
import NotFound from "./NotFound";
import ParticleBackground from "./components/background.js"

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="particlesjs">
          <ParticleBackground/>
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/newquestion" element={<NewQuestion />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
