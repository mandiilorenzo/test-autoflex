import { configureStore } from '@reduxjs/toolkit';
import rawMaterialReducer from './rawMaterialSlice';
import productReducer from './productSlice';

export const store = configureStore({
    reducer: {
        rawMaterials: rawMaterialReducer, 
        products: productReducer,
    },
});