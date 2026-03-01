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
import rawMaterialReducer, {
    fetchRawMaterials,
    createRawMaterial,
    deleteRawMaterial,
} from './rawMaterialSlice';

const createTestStore = () =>
    configureStore({
        reducer: {
            rawMaterials: rawMaterialReducer,
        },
    });

describe('rawMaterialSlice', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve carregar matérias-primas no fetchRawMaterials', async () => {
        const store = createTestStore();
        const materials = [{ id: 5, name: 'Vidro', stockQuantity: 10 }];

        api.get.mockResolvedValueOnce({ data: materials });

        await store.dispatch(fetchRawMaterials());

        const state = store.getState().rawMaterials;
        expect(state.list).toEqual(materials);
        expect(api.get).toHaveBeenCalledWith('/raw-materials');
    });

    it('deve criar matéria-prima e recarregar lista', async () => {
        const store = createTestStore();

        api.post.mockResolvedValueOnce({ data: { id: 5, name: 'Vidro', stockQuantity: 10 } });
        api.get.mockResolvedValueOnce({ data: [{ id: 5, name: 'Vidro', stockQuantity: 10 }] });

        await store.dispatch(createRawMaterial({ name: 'Vidro', stockQuantity: 10 }));

        expect(api.post).toHaveBeenCalledWith('/raw-materials', { name: 'Vidro', stockQuantity: 10 });
        expect(api.get).toHaveBeenCalledWith('/raw-materials');
    });

    it('deve excluir matéria-prima e recarregar lista', async () => {
        const store = createTestStore();

        api.delete.mockResolvedValueOnce({});
        api.get.mockResolvedValueOnce({ data: [] });

        await store.dispatch(deleteRawMaterial(5));

        expect(api.delete).toHaveBeenCalledWith('/raw-materials/5');
        expect(api.get).toHaveBeenCalledWith('/raw-materials');
    });
});
