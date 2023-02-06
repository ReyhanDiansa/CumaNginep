import React from "react";
import {  BrowserRouter, Routes, Route } from "react-router-dom"
import AddFormUser from "./user/AddForm";
function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={AddFormUser} />
   </Routes>
   </BrowserRouter>
  );
}

export default App;
