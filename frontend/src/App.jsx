import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Layout from './components/Layout';

const RawMaterials = lazy(() => import('./pages/RawMaterials'));
const Products = lazy(() => import('./pages/Products'));
const Production = lazy(() => import('./pages/Production'));

function App() {
  return (
    <Router>
      <Layout>
        <Suspense
          fallback={(
            <Box display="flex" justifyContent="center" mt={5}>
              <CircularProgress />
            </Box>
          )}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/raw-materials" replace />} />
            <Route path="/raw-materials" element={<RawMaterials />} />
            <Route path="/products" element={<Products />} />
            <Route path="/production" element={<Production />} />
            <Route path="*" element={<Navigate to="/raw-materials" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
