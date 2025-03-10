// Redux slice för beställningar
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {OrderState} from "../interfaces/OrderInterface.ts";

const initialState: OrderState = {
    orders: [],
};

// Skapa en slice
const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrder(state, action: PayloadAction<{ id: string; items: string[]; total: number }>) {
            state.orders.push(action.payload);
        },
        removeOrder(state, action: PayloadAction<string>) {
            state.orders = state.orders.filter(order => order.id !== action.payload);
        },
        clearOrders(state) {
            state.orders = [];
        },
    },
});

export default orderSlice.reducer;