import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchRawMaterials = createAsyncThunk(
    'rawMaterials/fetchAll',
    async () => {
        const response = await api.get('/raw-materials');
        return response.data;
    }
);

export const createRawMaterial = createAsyncThunk(
    'rawMaterials/create',
    async (data, { dispatch }) => {
        const response = await api.post('/raw-materials', data);
        dispatch(fetchRawMaterials());
        return response.data;
    }
);

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
                state.error = null;
            })
            .addCase(fetchRawMaterials.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchRawMaterials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createRawMaterial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRawMaterial.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createRawMaterial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateRawMaterial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRawMaterial.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateRawMaterial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteRawMaterial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRawMaterial.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteRawMaterial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default rawMaterialSlice.reducer;