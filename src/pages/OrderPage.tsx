import { useEffect, useState } from 'react';
import { getApiKey, placeOrder } from "../api/api.ts";
import '../styles/_order.scss';
import { useLocation, useNavigate } from "react-router-dom";

const OrderPage = () => {
    const [eta, setEta] = useState<number>(5 * 60); // Nedräkningstid
    const [error, setError] = useState<string | null>(null); // För felhantering
    const [loading, setLoading] = useState(false); // För laddningsstatus
    const location = useLocation(); // Hämta data från föregående sida
    const [formattedEta, setFormattedEta] = useState<string>(""); // Formaterad tid för ETA
    const [orderId, setOrderId] = useState<string>("Okänt"); // För beställnings-ID
    const navigate = useNavigate(); // För sidnavigering

    // Hämta orderId från konsolen eller sidan
    useEffect(() => {
        const consoleOrderId = (window as any).orderId || null;

        if (consoleOrderId) {
            setOrderId(consoleOrderId); // Om orderId finns i konsolen
        } else if (location.state?.orderNr) {
            setOrderId(location.state?.orderNr); // Annars hämta från sidan
        }
    }, [location.state]);

    // Omvandla sekunder till "minuter:sekunder"
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
    };

    // Sätt ETA baserat på servervärde
    useEffect(() => {
        if (location.state?.eta) {
            const estimatedTime = new Date(location.state.eta).getTime(); // ETA i millisekunder
            const remainingTime = Math.max(Math.floor((estimatedTime - Date.now()) / 1000), 0); // Resttid i sekunder
            setEta(remainingTime); // Uppdatera state
        }
    }, [location.state?.eta]);

    // Starta och hantera nedräkning för ETA
    useEffect(() => {
        if (eta === null) return;

        const timer = setInterval(() => {
            setEta((prevEta) => {
                if (prevEta === null || prevEta <= 0) {
                    clearInterval(timer); // Stopp när tiden är ute
                    return 0;
                }
                return prevEta - 1; // Räkna ner
            });
        }, 1000);

        return () => clearInterval(timer); // Rensa intervall om komponent tas bort
    }, [eta]);

    // Uppdatera formaterad tid när ETA ändras
    useEffect(() => {
        if (eta !== null) setFormattedEta(formatTime(eta));
    }, [eta]);

    // Placera en order
    const handlePlaceOrder = async () => {
        setError(null);
        setLoading(true);

        try {
            const tenant = "my-foodtruck"; // Exempel på kundnamn
            const apiKey = await getApiKey(); // Hämta API-nyckel
            const items: number[] = []; // Lägg till produkt-ID senare
            const data = await placeOrder(tenant, apiKey, items);

            setEta(data.eta); // Uppdatera ETA från servern
        } catch (err: any) {
            setError(err.message); // Hantering om något går fel
        } finally {
            setLoading(false); // Avsluta laddning
        }
    };

    // Navigera till meny-sidan
    const naviagetToMenu = () => {
        navigate('/menu');
    };

    // Navigera till kvitto-sidan med orderinfo
    const navigateToReceipt = async () => {
        setLoading(true);
        try {
            const apiKey = await getApiKey(); // Hämta API-nyckel
            navigate('/receipt', { state: { orderId, apiKey } }); // Skicka data till receipt-sidan
        } catch (error) {
            console.error("Kunde inte hämta API-nyckel:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='order-container'>
                {/* Vänsterlogga */}
                <img
                    className="logo-left"
                    src="./public/logo-trans.svg"
                    alt="Logo Left"
                    onClick={() => navigate("/menu")}
                    style={{ cursor: "pointer" }}
                />
                <figure>
                    <img src="../public/boxtop.png" alt="Placeholder" />
                </figure>

                <h1>DINA WONTONS TILLAGAS</h1>
                <h3>ETA: {formatTime(eta)}</h3>
                <h3>#{orderId}</h3>

                {/*<button onClick={handlePlaceOrder} disabled={loading}>*/}
                <button onClick={naviagetToMenu} disabled={loading}>

                    {loading ? 'Laddar...' : 'Lägg till en ny beställning'}
                </button>
                {/*{eta && <p>Beräknad ankomsttid: {eta} minuter</p>}*/}
                {error && <p style={{ color: 'white' }}>Fel: {error}</p>}

                <button onClick={navigateToReceipt} disabled={loading}>
                    {loading ? 'Laddar...' : 'Se kvitto'}
                </button>

            </div>
        </>
    );
};

export default OrderPage;