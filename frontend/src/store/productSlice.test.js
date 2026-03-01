import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../services/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

import api from '../services/api';
import productReducer, { fetchProducts, createProduct } from './productSlice';

const createTestStore = () =>
    configureStore({
        reducer: {
            products: productReducer,
        },
    });

describe('productSlice', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve carregar lista de produtos no fetchProducts', async () => {
        const store = createTestStore();
        const products = [{ id: 1, name: 'Garrafa', price: 30 }];

        api.get.mockResolvedValueOnce({ data: products });

        await store.dispatch(fetchProducts());

        const state = store.getState().products;
        expect(state.list).toEqual(products);
        expect(state.loading).toBe(false);
        expect(api.get).toHaveBeenCalledWith('/products');
    });

    it('deve criar produto e sincronizar composição em /product-compositions', async () => {
        const store = createTestStore();

        api.post
            .mockResolvedValueOnce({ data: { id: 10, name: 'Garrafa', price: 50 } })
            .mockResolvedValueOnce({ data: { id: 99 } });

        api.get
            .mockResolvedValueOnce({ data: [] })
            .mockResolvedValueOnce({ data: [{ id: 10, name: 'Garrafa', price: 50 }] });

        const payload = {
            name: 'Garrafa',
            price: 50,
            compositions: [{ rawMaterialId: 5, quantity: 2 }],
        };

        await store.dispatch(createProduct(payload));

        expect(api.post).toHaveBeenNthCalledWith(1, '/products', { name: 'Garrafa', price: 50 });
        expect(api.get).toHaveBeenNthCalledWith(1, '/product-compositions/product/10');
        expect(api.post).toHaveBeenNthCalledWith(2, '/product-compositions', {
            productId: 10,
            materialId: 5,
            quantity: 2,
        });
        expect(api.get).toHaveBeenNthCalledWith(2, '/products');
    });
});
