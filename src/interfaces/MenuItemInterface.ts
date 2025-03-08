// Definierar typen för varje objekt i varukorgen
export interface MenuState {
    items: IMenuItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed'; // visa en status för se om menyn laddas
    currentItemId: string | null;
}

export interface IMenuItemTest {
    id: string;
    name: string;
    price: number;
}

// Definierade strukturen för en menyartikel (justerat efter API-svar)
export interface IMenuItem {
    id: string;
    name: string;
    price: number;
    type?: 'wonton' | 'dip' | 'drink';
    description?: string;
    category?: string;
    ingredients?: string;
}

export const menuTypes = [
    { type: 'wonton', title: 'Wonton' },
    { type: 'dip', title: 'Dipsås ' },
    { type: 'drink', title: 'Läsk' },
];