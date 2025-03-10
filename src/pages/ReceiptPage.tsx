import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchReceipt } from "../api/api.ts";
import '../styles/_receipt.scss';

const ReceiptPage = () => {
    const [receipt, setReceipt] = useState<any>(null); // Kvitto-data
    const [error, setError] = useState<string | null>(null); // Fel-meddelande
    const location = useLocation();
    const { orderId, apiKey } = location.state || {}; // Order-ID och API-nyckel

    useEffect(() => {
        if (!orderId || !apiKey) {
            setError("Order ID eller API-nyckel saknas."); // Ingen data
            return;
        }

        const loadReceipt = async () => {
            try {
                console.log("Hämtar kvitto:", orderId);
                const data = await fetchReceipt(orderId, apiKey); // Hämta API-data
                console.log("API-svar:", data);

                if (data?.receipt) {
                    setReceipt(data.receipt); // Sätt kvittot
                } else {
                    setError("Ingen kvittodata i svaret."); // Fel
                }
            } catch (err: any) {
                setError(err.message); // API-fel
            }
        };

        loadReceipt(); // Kör hämtning
    }, [orderId, apiKey]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!receipt) {
        return <div>Loading...</div>;
    }

    return (
        <div className="body-background">
            <img className="logo-left" src="./public/logo-trans.svg" alt="Logo Left" />

            <div className="receipt-container">
                {/* Header */}
                <div className="receipt-header">
                    <img className="logo-top" src="./public/logo.png" alt="Logo Top" />
                </div>

                {/* Kvitto */}
                <div className="receipt-info">
                    <h1 className="receipt-title">Kvitto</h1>
                    <p className="order-number">Ordernummer: {receipt.id}</p>
                </div>

                {/* Artiklar */}
                <ul className="receipt-items">
                    {receipt.items.flat().map((item: any, index: number) => (
                        <li key={index}>
                            <div>
                                <div className="item-name">{item.name}</div>
                                <div className="item-details">Antal: {item.quantity}</div>
                            </div>
                            <div className="item-price">{item.price} SEK</div>
                        </li>
                    ))}
                </ul>

                {/* Summering */}
                <div className="receipt-summary">
                    <div className="total-row">
                        <div className="total-label">Totalpris:</div>
                        <div className="total-amount">{receipt.orderValue} SEK</div>
                    </div>
                    <div className="tax-row">
                        <div className="tax-label">Inkl. moms (20%):</div>
                        <div className="tax-amount">
                            {(receipt.orderValue * 0.20).toFixed(2)} SEK
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptPage;