import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container, Typography, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    Paper, CircularProgress, Box, TextField, Dialog,
    DialogActions, DialogContent, DialogTitle, IconButton, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchRawMaterials, createRawMaterial, deleteRawMaterial, updateRawMaterial } from '../store/rawMaterialSlice';
import ConfirmDialog from '../components/ConfirmDialog';

const RawMaterials = () => {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((state) => state.rawMaterials);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', stockQuantity: '' });
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchRawMaterials());
    }, [dispatch]);

    const handleEdit = (item) => {
        setFormData({ name: item.name, stockQuantity: item.stockQuantity });
        setEditingId(item.id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingId(null);
        setFormData({ name: '', stockQuantity: '' });
    };

    const handleSave = async () => {
        const payload = {
            name: formData.name,
            stockQuantity: Number(formData.stockQuantity),
        };

        try {
            if (editingId) {
                await dispatch(updateRawMaterial({ id: editingId, data: payload })).unwrap();
            } else {
                await dispatch(createRawMaterial(payload)).unwrap();
            }
            handleClose();
        } catch (error) {
            console.error("Erro ao processar operação", error);
        }
    };

    const handleDeleteClick = (id) => {
        setIdToDelete(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteRawMaterial(idToDelete)).unwrap();
            setConfirmOpen(false);
            setIdToDelete(null);
        } catch (deleteError) {
            console.error('Erro ao excluir matéria-prima:', deleteError);
            setConfirmOpen(false);
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

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Não foi possível concluir a operação: {String(error)}
                </Alert>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center"><CircularProgress /></Box>
            ) : (
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Nome</strong></TableCell>
                                <TableCell align="right"><strong>Estoque Atual</strong></TableCell>
                                <TableCell align="center"><strong>Ações</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell align="right">{item.stockQuantity}</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={() => handleEdit(item)} title="Editar">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDeleteClick(item.id)} title="Excluir">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingId ? 'Editar Insumo' : 'Cadastrar Insumo'}</DialogTitle>
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
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained">
                        {editingId ? 'Atualizar' : 'Salvar'}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={confirmOpen}
                title="Confirmar Exclusão"
                message="Você tem certeza que deseja excluir esta matéria-prima? Esta ação não pode ser desfeita."
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </Container>
    );
};

export default RawMaterials;