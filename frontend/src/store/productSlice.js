import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
    const response = await api.get('/products');
    return response.data;
});

export const createProduct = createAsyncThunk(
    'products/create',
    async (productData, { dispatch }) => {
        const response = await api.post('/products', productData);
        dispatch(fetchProducts()); 
        return response.data;
    }
);

export const updateProduct = createAsyncThunk(
    'products/update',
    async ({ id, data }, { dispatch }) => {
        const response = await api.put(`/products/${id}`, data);
        dispatch(fetchProducts()); // Recarrega a lista após editar
        return response.data;
    }
);

export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id, { dispatch }) => {
        await api.delete(`/products/${id}`);
        dispatch(fetchProducts()); 
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(createProduct.fulfilled, (state) => {
                state.loading = false;
            })
    },
});

export default productSlice.reducer;