import React from "react";
import "styles/_themes.scss";
import "styles/_globals.scss";
import "styles/_variables.scss";
import "styles/_ui.scss";
import TitleBar from "./ui/title-bar/TitleBar";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";

const App: React.FC = () => {
  return (
    <>
      <TitleBar />
      <main>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </main>
    </>
  );
};

export default App;
