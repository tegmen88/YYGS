import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import { IMenuItem,MenuState } from '../interfaces/MenuItemInterface';
import {fetchMenu} from "../api/api.ts";

const initialState: MenuState = {
    items: [], // Lista med menyobjekt
    status: 'idle', // Status för API-förfrågan
    currentItemId: null, // ID för den aktuella menyposten
};

export const fetchMenuItems = createAsyncThunk('/menu', async () => {
    return await fetchMenu();
});
const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        // Reducer för att sätta det aktiva objektets ID
        setCurrentItem: (state, action: PayloadAction<string | null>) => {
            state.currentItemId = action.payload; // Ex. payload: 'id123'
        },
        setItems(state, action: PayloadAction<IMenuItem[]>) {
            state.items = action.payload; // Payload ska vara en IMenuItem[]
        },
        setCurrentItemId(state, action: PayloadAction<string | null>) {
            state.currentItemId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenuItems.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(
                fetchMenuItems.fulfilled,
                (state, action: PayloadAction<{ items: IMenuItem[] }>) => { // Ändrat typ för action
                    if (!action.payload || action.payload.items.length === 0) {
                        console.warn('Tom menydata returnerades från API');
                        state.status = 'failed';
                        return;
                    }

                    console.log('API Response:', action.payload.items);

                    state.status = 'succeeded';
                    state.items = action.payload.items;
                }
            )
            .addCase(fetchMenuItems.rejected, (state, action) => {
                console.error('API Error:', action.error);
                state.status = 'failed';
            });
    },
});

export default menuSlice.reducer;