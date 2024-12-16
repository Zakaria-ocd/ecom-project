'use client';
import React, { useEffect } from 'react';
import { FaTimesCircle, FaCheckCircle } from 'react-icons/fa';

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed bottom-4 left-4 p-2 rounded-lg shadow-lg transition-transform transform ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white flex items-center w-60`}>
            {type === 'success' ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
            <span className="mr-4">{message}</span>
            <button onClick={onClose} className="ml-auto text-white font-bold text-2xl hover:text-gray-300">
                &times;
            </button>
        </div>
    );
};

export default Notification;