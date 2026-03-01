import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const syncProductCompositions = async (productId, compositions = []) => {
    if (!Array.isArray(compositions) || compositions.length === 0) {
        return;
    }

    const normalizedCompositions = compositions
        .map((item) => {
            const materialId = Number(
                item?.rawMaterialId ??
                item?.materialId ??
                item?.rawMaterial?.id
            );

            const quantity = Number(item?.quantity);

            return {
                materialId,
                quantity,
            };
        })
        .filter((item) => Number.isFinite(item.materialId) && Number.isFinite(item.quantity) && item.quantity > 0);

    if (normalizedCompositions.length === 0) {
        return;
    }

    const existingResponse = await api.get(`/product-compositions/product/${productId}`);
    const existingMaterialIds = new Set(
        (existingResponse.data || [])
            .map((item) => Number(item?.rawMaterial?.id ?? item?.rawMaterialId ?? item?.materialId))
            .filter((id) => Number.isFinite(id))
    );

    const missingCompositions = normalizedCompositions.filter(
        (item) => !existingMaterialIds.has(item.materialId)
    );

    await Promise.all(
        missingCompositions.map((item) =>
            api.post('/product-compositions', {
                productId,
                materialId: item.materialId,
                quantity: item.quantity,
            })
        )
    );
};

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
    const response = await api.get('/products');
    return response.data;
});

export const createProduct = createAsyncThunk(
    'products/create',
    async (productData, { dispatch }) => {
        const productPayload = {
            name: productData.name,
            price: productData.price,
        };

        const response = await api.post('/products', productPayload);
        await syncProductCompositions(response.data?.id, productData.compositions);
        dispatch(fetchProducts());
        return response.data;
    }
);

export const updateProduct = createAsyncThunk(
    'products/update',
    async ({ id, data }, { dispatch }) => {
        const productPayload = {
            name: data.name,
            price: data.price,
        };

        const response = await api.put(`/products/${id}`, productPayload);
        await syncProductCompositions(id, data.compositions);
        dispatch(fetchProducts()); 
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
                state.error = null;
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
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export default productSlice.reducer;