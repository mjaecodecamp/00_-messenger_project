import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./styles/style.scss";
import Login from "./pages/Login";
import Messenger from "./pages/Messenger";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route index element={<Login />} />
              <Route path="/messenger" element={<Messenger />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
