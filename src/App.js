import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./styles/style.scss";
import { FirebaseContextProvider } from "./hooks/useFirebase";
import Login from "./pages/Login";
import Messenger from "./pages/Messenger";

function App() {
  return (
      <FirebaseContextProvider>
          <BrowserRouter>
              <Routes>
                  <Route index element={<Login />} />
                  <Route path="/messenger" element={<Messenger />} />
              </Routes>
          </BrowserRouter>
      </FirebaseContextProvider>
  );
}

export default App;
