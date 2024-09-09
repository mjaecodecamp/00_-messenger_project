import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./styles/style.scss";
import Login from "./pages/Login";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route index element={<Login />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
