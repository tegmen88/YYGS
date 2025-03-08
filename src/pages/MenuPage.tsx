import React, { useEffect, useState } from 'react';
import { fetchMenu } from '../api/api.ts';
import { IMenuItem } from '../interfaces/MenuItemInterface';
import '../styles/_menu.scss';
// import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import Navbar from "../comps/Navbar.tsx";

const MenuPage: React.FC = () => {
    const dispatch = useDispatch();

    const [menu, setMenu] = useState<IMenuItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Funktion för att ladda menyn från API
    useEffect(() => {
        const loadMenu = async () => {
            try {
                setLoading(true);
                const menuItems = await fetchMenu();
                if (menuItems && menuItems.items) {
                    setMenu(menuItems.items); // Saving menydata från API
                } else {
                    throw new Error('Felaktigt API-svar: "items" saknas.');
                }
            } catch (err: any) {
                setError(err.message || 'Ett fel inträffade.');
            } finally {
                setLoading(false);
            }
        };

        loadMenu();
    }, []);

    // Function to att articles to the cart
    const handleAddToCart = (item: IMenuItem) => {


        console.log(item);

    };

    // Show loading message
    if (loading) return <p>Laddar menyn...</p>;

    // Show error message
    if (error) return <p>Fel vid laddning av menyn: {error}</p>;

    // Separating data based on its types
    const foodItems = menu.filter((item) => item.type === 'wonton');
    const dipItems = menu.filter((item) => item.type === 'dip');
    const drinkItems = menu.filter((item) => item.type === 'drink');

    return (
        <div className="menu-container">

            <Navbar />


            <div className="menu-content">
                <h1>Menyn</h1>

                {/* Första sektionen: Mat */}
                <div className="menu-category food-category">
                    {/* Döljerr rubriken här */}
                    <ul>
                        {foodItems.map((item) => (
                            <li
                                key={item.id}
                                className="menu-item"
                                onClick={() => handleAddToCart(item)}
                            >
                                {/* Matdelen vänsterjusterad */}
                                <div className="food">
                                    <h3>{item.name}</h3>
                                    <p>{item.ingredients || "Ingen ingrediens tillgänglig"}</p>
                                </div>

                                {/* Prisdelen högerjusterad */}
                                <div className="price">
                                    {item.price || 0} kr
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Andra sektionen: Dippsåser */}
                <div className="menu-category dip-category">
                    <h2>Dippsåser 19 kr</h2>

                    <ul className="dipso-lists">
                        {dipItems.map((item) => (
                            <li
                                key={item.id}
                                className="dip-list-item"
                                onClick={() => handleAddToCart(item)}
                            >
                                <p>{item.name}</p>

                                <button
                                    className='btn btn-menu'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(item);
                                    }}
                                ></button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tredje sektionen: Läsk */}
                <div className="menu-category drink-category">
                    <h2>Läsk 19 kr</h2>
                    <ul className="dipso-lists">
                        {drinkItems.map((item) => (
                            <li
                                key={item.id}
                                className="dip-list-item"
                                onClick={() => handleAddToCart(item)}
                            >
                                <p>{item.name}</p>

                                <button
                                    className='btn btn-menu'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(item);
                                    }}
                                ></button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

    );
};

export default MenuPage;