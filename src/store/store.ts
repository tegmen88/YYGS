import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import menuReducer from './menuSlice';
import cartReducer from './cartSlice';

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['menu'], // Persist 'menu' - save the menu state
};

// Combine reducers
const rootReducer = combineReducers({
    menu: menuReducer,
    cart: cartReducer,

    // Du kanlägga till flera reducer som cart och receipt
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
    reducer: persistedReducer, // Persisted reducers
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Fix persist issue
        }),
});

// Persistor for storage
export const persistor = persistStore(store);

// Export state and dispatch types
export type RootState = ReturnType<typeof store.getState>; // State type
export type AppDispatch = typeof store.dispatch; // Dispatch type
