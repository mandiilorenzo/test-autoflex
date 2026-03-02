import { configureStore } from '@reduxjs/toolkit';
import rawMaterialReducer from './rawMaterialSlice';
import productReducer from './productSlice';
import productionReducer from './productionSlice';

export const store = configureStore({
    reducer: {
        rawMaterials: rawMaterialReducer, 
        products: productReducer,
        production: productionReducer,
    },
});