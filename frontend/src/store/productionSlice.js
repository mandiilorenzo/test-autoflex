import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const toNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeSuggestionItem = (item) => {
    const productName =
        item?.productName ??
        item?.product?.name ??
        item?.name ??
        item?.product ??
        'Produto';

    const quantity = toNumber(
        item?.quantity ??
        item?.possibleQuantity ??
        item?.maxQuantity ??
        item?.amount
    );

    const subtotal = toNumber(
        item?.subtotal ??
        item?.total ??
        item?.totalValue
    );

    return {
        productName,
        quantity,
        subtotal,
    };
};

const normalizeProductionPayload = (payload) => {
    const rawSuggestions = payload?.suggestions || [];

    const suggestions = Array.isArray(rawSuggestions)
        ? rawSuggestions.map(normalizeSuggestionItem)
        : [];

    const totalPotentialValue = toNumber(
        payload?.totalPotentialValue ??
        suggestions.reduce((acc, item) => acc + item.subtotal, 0)
    );

    return { suggestions, totalPotentialValue };
};

export const fetchSuggestions = createAsyncThunk(
    'production/fetchSuggestions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/production-suggestion');
            return normalizeProductionPayload(response.data);
        } catch (error) {
            const message = error?.response?.data?.message || error?.response?.data || 'Erro ao buscar sugestões';
            return rejectWithValue(message);
        }
    }
);

const productionSlice = createSlice({
    name: 'production',
    initialState: {
        suggestions: { suggestions: [], totalPotentialValue: 0 },
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuggestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSuggestions.fulfilled, (state, action) => {
                state.loading = false;
                state.suggestions = action.payload;
            })
            .addCase(fetchSuggestions.rejected, (state, action) => {
                state.loading = false;
                state.suggestions = { suggestions: [], totalPotentialValue: 0 };
                state.error = action.payload || action.error?.message || "Erro desconhecido";
            });
    },
});

export default productionSlice.reducer;