import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RawMaterials from './pages/RawMaterials';
import Layout from './components/Layout';
import Products from './pages/Products';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/raw-materials" element={<RawMaterials />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
