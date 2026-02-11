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

export default rawMaterialSlice.reducer;