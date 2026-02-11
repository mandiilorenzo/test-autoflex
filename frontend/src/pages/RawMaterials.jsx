import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, Typography, Button, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  Paper, CircularProgress, Box, TextField, Dialog, 
  DialogActions, DialogContent, DialogTitle 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { fetchRawMaterials } from '../store/rawMaterialSlice';
import api from '../services/api';

const RawMaterials = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.rawMaterials);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', stockQuantity: '' });

  useEffect(() => {
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const handleSave = async () => {
    try {
      await api.post('/raw-materials', formData);
      setOpen(false);
      setFormData({ name: '', stockQuantity: '' });
      dispatch(fetchRawMaterials());
    } catch (error) {
      console.error("Erro ao salvar matéria-prima", error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" color="primary">Matérias-Primas</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setOpen(true)}
        >
          Nova Matéria-Prima
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center"><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Nome</strong></TableCell>
                <TableCell align="right"><strong>Estoque Atual</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">{item.stockQuantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog de Cadastro */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Cadastrar Insumo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Matéria-Prima"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Quantidade em Estoque"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.stockQuantity}
            onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RawMaterials;