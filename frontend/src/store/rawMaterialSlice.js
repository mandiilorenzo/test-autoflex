import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchRawMaterials = createAsyncThunk(
    'rawMaterials/fetchAll',
    async () => {
        const response = await api.get('/raw-materials');
        return response.data;
    }
);

const rawMaterialSlice = createSlice({
    name: 'rawMaterials',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRawMaterials.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRawMaterials.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchRawMaterials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const deleteRawMaterial = createAsyncThunk(
    'rawMaterials/delete',
    async (id, { dispatch }) => {
        await api.delete(`/raw-materials/${id}`);
        dispatch(fetchRawMaterials());
    }
);

export const updateRawMaterial = createAsyncThunk(
    'rawMaterials/update',
    async ({ id, data }, { dispatch }) => {
        await api.put(`/raw-materials/${id}`, data);
        dispatch(fetchRawMaterials()); 
    }
);

export default rawMaterialSlice.reducer;