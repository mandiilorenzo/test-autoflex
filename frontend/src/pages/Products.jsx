import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, CircularProgress,
    Box, TextField, Dialog, DialogActions, DialogContent,
    DialogTitle, MenuItem, IconButton, List, ListItem, ListItemText, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchProducts } from '../store/productSlice';
import { fetchRawMaterials } from '../store/rawMaterialSlice';
import { createProduct, updateProduct } from '../store/productSlice';
import api from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';

const Products = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products?.list || []);
    const loading = useSelector((state) => state.products?.loading);
    const materials = useSelector((state) => state.rawMaterials?.list || []);

    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [productData, setProductData] = useState({ name: '', price: '' });

    const [composition, setComposition] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [quantity, setQuantity] = useState('');

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchRawMaterials());
    }, [dispatch]);

    const handleOpen = (product = null) => {
        if (product) {
            setEditingId(product.id);
            setProductData({ name: product.name, price: product.price });
            setComposition(product.compositions || []);
        } else {
            setEditingId(null);
            setProductData({ name: '', price: '' });
            setComposition([]);
        }
        setOpen(true);
    };

    const addMaterialToRecipe = () => {
        const material = materials.find(m => m.id === selectedMaterial);
        if (material && quantity > 0) {
            if (!composition.find(c => c.rawMaterialId === material.id)) {
                setComposition([...composition, {
                    rawMaterialId: material.id,
                    name: material.name,
                    quantity: parseFloat(quantity)
                }]);
            }
            setSelectedMaterial('');
            setQuantity('');
        }
    };

    const handleSave = async () => {
        const payload = {
            name: productData.name,
            price: parseFloat(productData.price),
            compositions: composition
        };

        try {
            if (editingId) {
                await dispatch(updateProduct({ id: editingId, data: payload })).unwrap();
            } else {
                await dispatch(createProduct(payload)).unwrap();
            }
            setOpen(false);
            setEditingId(null);
            setComposition([]);
            setProductData({ name: '', price: '' });
        } catch (error) {
            console.error("Erro na operação de produto:", error);
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" color="primary">Produtos e Composições</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
                    Novo Produto
                </Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center"><CircularProgress /></Box>
            ) : (
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Produto</strong></TableCell>
                                <TableCell align="right"><strong>Preço</strong></TableCell>
                                <TableCell align="center"><strong>Ações</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>{p.name}</TableCell>
                                    <TableCell align="right">R$ {p.price}</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={() => handleOpen(p)}><EditIcon /></IconButton>
                                        <IconButton color="error" onClick={() => { setIdToDelete(p.id); setConfirmOpen(true); }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editingId ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" gap={2} mb={3}>
                        <TextField label="Nome do Produto" fullWidth value={productData.name}
                            onChange={(e) => setProductData({ ...productData, name: e.target.value })} />
                        <TextField label="Preço" type="number" value={productData.price}
                            onChange={(e) => setProductData({ ...productData, price: e.target.value })} />
                    </Box>

                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="subtitle1" gutterBottom><strong>Composição (Receita)</strong></Typography>

                    <Box display="flex" gap={1} mb={2}>
                        <TextField select label="Insumo" fullWidth value={selectedMaterial}
                            onChange={(e) => setSelectedMaterial(e.target.value)}>
                            {materials.map((m) => (
                                <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Qtd" type="number" sx={{ width: 120 }}
                            value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                        <Button variant="contained" onClick={addMaterialToRecipe} sx={{ height: 56 }}>Add</Button>
                    </Box>

                    <List sx={{ bgcolor: '#fafafa', borderRadius: 1 }}>
                        {composition.map((item, index) => (
                            <ListItem key={index} divider secondaryAction={
                                <IconButton edge="end" onClick={() => setComposition(composition.filter((_, i) => i !== index))}>
                                    <DeleteIcon />
                                </IconButton>
                            }>
                                <ListItemText primary={item.name} secondary={`Qtd necessária: ${item.quantity}`} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSave} disabled={!productData.name || composition.length === 0}>
                        {editingId ? 'Atualizar Produto' : 'Salvar Produto'}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={confirmOpen}
                title="Excluir Produto"
                message="Deseja realmente excluir este produto? A composição também será removida."
                onConfirm={async () => {
                    await api.delete(`/products/${idToDelete}`);
                    dispatch(fetchProducts());
                    setConfirmOpen(false);
                }}
                onCancel={() => setConfirmOpen(false)}
            />
        </Container>
    );
};

export default Products;