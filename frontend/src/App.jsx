import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Layout from './components/Layout';

const RawMaterials = lazy(() => import('./pages/RawMaterials'));
const Products = lazy(() => import('./pages/Products'));
const Production = lazy(() => import('./pages/Production'));
const Home = lazy(() => import('./pages/Home'));

function App() {
  return (
    <Router>
      <Suspense
        fallback={(
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        )}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/raw-materials" element={<Layout><RawMaterials /></Layout>} />
          <Route path="/products" element={<Layout><Products /></Layout>} />
          <Route path="/production" element={<Layout><Production /></Layout>} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
