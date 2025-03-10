import { IMenuItem } from '../interfaces/MenuItemInterface.ts';

let API_KEY = '';
const API_URL = 'https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com';

// Hämta API-nyckeln
export const getApiKey = async (): Promise<string> => {
    try {
        if (API_KEY) {
            console.log('Återanvänder API-nyckeln:', API_KEY);
            return API_KEY;
        }

        const response = await fetch(`${API_URL}/keys`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(
                response.status === 401
                    ? 'Ogiltig eller saknad nyckel.'
                    : response.status === 404
                        ? 'Endpointen saknas.'
                        : `Fel vid hämtning av nyckel.`
            );
        }

        const data = await response.json();
        console.log('Svar från servern:', data);

        if (!data?.key) {
            throw new Error('Nyckel saknas i svaret.');
        }

        const apiKey = data.key;
        console.log('Nyckel hämtad:', apiKey);
        return apiKey;
    } catch (error) {
        console.error('Fel vid hämtning av nyckel:', error);
        throw error;
    }
};

// Hämta meny
export const fetchMenu = async (): Promise<{ items: IMenuItem[] }> => {
    try {
        const menuEndpoint = `${API_URL}/menu`;
        const apiKey = 'yum-3PqATVLPR8zw2xRn';
        console.log('Använder API-nyckel:', apiKey);
        console.log('Hämtar meny från:', menuEndpoint);

        const response = await fetch(menuEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-zocom': apiKey,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Serverfel:', errorText);
            throw new Error(`HTTP-fel! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Hämtad menydata:', data);

        return data;
    } catch (error) {
        console.error('Fel vid hämtning av meny:', error);
        throw error;
    }
};

// Skapa tenant
export const createTenant = async (apiKey: string, tenantName: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/tenant`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-zocom": apiKey,
            },
            body: JSON.stringify({ name: tenantName }),
        });

        if (!response.ok) {
            throw new Error(`Kunde inte skapa tenant. Status: ${response.status}`);
        }

        console.log("Tenant skapad:", response, tenantName, response.status);
    } catch (error) {
        console.error("Fel vid skapande av tenant:", error);
        throw error;
    }
};

// Lägg order
export const placeOrder = async (tenant: string, apiKey: string, items: number[]) => {
    if (!tenant) throw new Error("Tenant saknas.");
    if (!apiKey) throw new Error("API-nyckel saknas.");
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Items måste vara en icke-tom array.");
    }

    try {
        const endpoint = `${API_URL}/${tenant}/orders`;
        console.log("Anropar endpoint:", endpoint);

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-zocom": apiKey,
            },
            body: JSON.stringify({ items }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Fel vid orderläggning. Status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("Order lagd:", data);

        return data;
    } catch (error) {
        console.error("Fel vid orderläggning:", error);
        throw error;
    }
};

// Hämta kvitto
export const fetchReceipt = async (orderId: string, apiKey: string): Promise<any> => {
    try {
        if (!orderId) throw new Error("Order ID saknas.");

        const receiptEndpoint = `${API_URL}/receipts/${orderId}`;
        console.log("Hämtar kvitto från:", receiptEndpoint);

        const response = await fetch(receiptEndpoint, {
            method: "GET",
            headers: {
                "x-zocom": apiKey,
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                response.status === 404
                    ? "Kvitto hittades inte."
                    : `Fel vid hämtning av kvitto. Status: ${response.status}`
            );
        }

        const data = await response.json();
        console.log("Kvitto hämtat:", data);
        return data;
    } catch (error) {
        console.error("Fel vid hämtning av kvitto:", error);
        throw error;
    }
};