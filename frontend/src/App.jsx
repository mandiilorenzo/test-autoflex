import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RawMaterials from './pages/RawMaterials';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/raw-materials" element={<RawMaterials />} />
      </Routes>
    </Router>
  );
}

export default App;
