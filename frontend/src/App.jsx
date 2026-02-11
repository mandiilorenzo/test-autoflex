import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RawMaterials from './pages/RawMaterials';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/raw-materials" element={<RawMaterials />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
