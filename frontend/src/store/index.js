import { configureStore } from '@reduxjs/toolkit';
import rawMaterialReducer from './rawMaterialSlice';

export const store = configureStore({
    reducer: {
        rawMaterials: rawMaterialReducer, 
    },
});