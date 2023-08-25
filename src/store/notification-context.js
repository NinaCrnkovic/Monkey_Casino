
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext({
    showNotification: () => {}
});


export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => {
            setNotification(null);
        }, 5000); // Notifikacija će nestati nakon 5 sekundi
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>

            {children}
            {notification && <div className="notification">{notification}</div>}
        </NotificationContext.Provider>
    );
};
