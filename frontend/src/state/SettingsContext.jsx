import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/client.js";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const res = await api.get("/settings");
            setSettings(res.data);
        } catch (err) {
            console.error("Failed to fetch settings", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const updateLandingPageSettings = async (data) => {
        try {
            const res = await api.post("/settings/landing-page", data);
            setSettings(res.data);
            return res.data;
        } catch (err) {
            console.error("Failed to update settings", err);
            throw err;
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, updateLandingPageSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);
