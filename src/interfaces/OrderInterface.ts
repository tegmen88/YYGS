// en definierad typ för state
export interface OrderState {
    orders: { id: string; items: string[]; total: number }[];
}