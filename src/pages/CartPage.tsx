import '../styles/_cart.scss';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, addToCart } from '../store/cartSlice';
import { RootState } from "../store/store.ts";
import {useNavigate} from "react-router-dom";
import { useState } from 'react';
import {getApiKey, placeOrder} from '../api/api.ts';
import Navbar from '../comps/Navbar.tsx';

const CartPage = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state: RootState) => state.cart.items);


    const handleTakeMyMoney = async () => {

    };

    // Beräkna totalpriset
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className='cart-container'>
            <Navbar/>
            <h1 className='test'>Din varukorg</h1>

            {cart.length > 0 ? (
                <div className='cart-container'>
                    {cart.map((item) => (
                        <div key={item.id} className='cart-item'>
                            {/* Vänster: Produktnamn */}
                            <span className='cart-item-name'>{item.name}</span>

                            {/* Mitten: Knappar */}
                            <div className='cart-item-buttons'>
                                <button
                                    onClick={() => dispatch(addToCart({ id: item.id, name: '', price: 0, quantity: 1 }))}>
                                    +
                                </button>
                                <button
                                    onClick={() => dispatch(removeFromCart({ id: item.id, quantity: 1 }))}>
                                    -
                                </button>
                                <button
                                    onClick={() => dispatch(removeFromCart({ id: item.id }))}>
                                    Rensa
                                </button>
                            </div>

                            {/* Höger: Pris och kvantitet */}
                            <div className='cart-item-details'>
                                <span>Pris: {item.price} kr</span>
                                <span>Kvantitet: {item.quantity}</span>
                            </div>
                        </div>
                    ))}

                    {/* Visa totala priset */}
                    <h2 className='totalprice-item'>
                        <span>Totalt pris:</span>
                        <span>{totalPrice} kr</span>
                    </h2>
                </div>
            ) : (
                <p>Varukorgen är tom.</p>
            )}

            {/* Take my money btn - place order */}
            <button className='btn-cart' onClick={handleTakeMyMoney} disabled={loading}>
                {loading ? "Bearbetar..." : "Take my money"}
            </button>
            {error && <p style={{ color: 'red' }}>Fel: {error}</p>}
        </div>
    );
};

export default CartPage;