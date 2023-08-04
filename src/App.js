import React from "react";
import Header from "./Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Activities from "./Activities";
import ActivityDetails from "./ActivityDetails";

const App = () => {
  return (
    <Router>
      <div className="container">
        <Header />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <div className="container-view">
                <Activities />
              </div>
            }
          />
          <Route
            path="/call-details"
            element={
              <div className="container-view">
                <ActivityDetails />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
