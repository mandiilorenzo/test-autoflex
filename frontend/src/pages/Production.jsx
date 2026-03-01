import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Grid, Card, CardContent, Divider, Box, CircularProgress, Paper, Alert } from '@mui/material';
import { fetchSuggestions } from '../store/productionSlice';

const Production = () => {
    const dispatch = useDispatch();
    const { suggestionsData, loading, error } = useSelector((state) => ({
        suggestionsData: state.production?.suggestions || { suggestions: [], totalPotentialValue: 0 },
        loading: state.production?.loading,
        error: state.production?.error,
    }));

    const { suggestions, totalPotentialValue } = suggestionsData;

    useEffect(() => {
        dispatch(fetchSuggestions());
    }, [dispatch]);

    return (
        <Container sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" color="primary">Sugestão de Produção</Typography>

                {!loading && totalPotentialValue > 0 && (
                    <Paper elevation={0} sx={{ p: 1, bgcolor: '#f0f4f8', border: '1px solid #d1d9e0' }}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Valor Total Potencial: <strong>R$ {totalPotentialValue.toFixed(2)}</strong>
                        </Typography>
                    </Paper>
                )}
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>
            ) : (
                <Grid container spacing={3}>
                    {error && (
                        <Grid item xs={12}>
                            <Alert severity="warning">
                                Falha ao buscar sugestões: {String(error)}
                            </Alert>
                        </Grid>
                    )}

                    {suggestions && suggestions.length > 0 ? (
                        suggestions.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card elevation={3} sx={{ borderTop: '4px solid #e67e22' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>{item.productName}</Typography>
                                        <Divider />
                                        <Box mt={2} textAlign="center">
                                            <Typography variant="body2" color="textSecondary">Quantidade possível:</Typography>
                                            <Typography variant="h3" color="secondary" sx={{ fontWeight: 'bold', my: 1 }}>
                                                {item.quantity}
                                            </Typography>
                                            <Typography variant="caption">unidades baseadas no estoque</Typography>
                                            <Box mt={1}>
                                                <Typography variant="caption" color="textSecondary">
                                                    Subtotal: R$ {item.subtotal?.toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 4 }}>
                                Nenhuma sugestão disponível. Verifique estoque, composições dos produtos e endpoint de sugestão no backend.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            )}
        </Container>
    );
};

export default Production;