import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { IMenuItem } from '../interfaces/MenuItemInterface';

const MenuItem: React.FC = () => {
    const { itemId } = useParams<{ itemId: string }>();

    // Hämta menyobjekt från Redux
    const items = useSelector((state: RootState) => state.menu.items);

    // Leta efter menyposten baserat på id
    const item: IMenuItem | undefined = items.find(
        (menuItem) => menuItem.id === itemId // Typ definieras här
    );

    if (!item) {
        return <div>Produkten kunde inte hittas.</div>;
    }

    return (
        <div>
            <h2>{item.name}</h2>
            <p>{item.price} kr</p>
            <p>{item.description}</p>
            <p>{item.category}</p>
            <p>{item.ingredients}</p>
        </div>
    );
};

export default MenuItem;