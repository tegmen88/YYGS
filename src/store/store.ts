// Redux Store-konfiguration

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import menuReducer from './menuSlice';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Använder localStorage

// Persist-inställningar
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart'], // Bara cart sparas
};

// Slå ihop reducers
const rootReducer = combineReducers({
    menu: menuReducer,
    cart: cartReducer,
    order: orderReducer,
});

// PersistReducer med inställningarna
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Konfigurera store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Hanterar redux persist
        }),
});

// Skapa persistor
export const persistor = persistStore(store);

// Exportera typer
export type RootState = ReturnType<typeof store.getState>;
