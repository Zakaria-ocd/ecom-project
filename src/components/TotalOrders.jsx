'use client';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const TotalOrders = () => {
  const totalOrders = useSelector((state) => state.dashboard.totalOrders);

  return (
    <div className="bg-blue-50 p-4 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex flex-col items-start">
        <p className="text-3xl font-bold">{totalOrders}</p>
        <p className="text-sm text-gray-500">Total Orders</p>
      </div>
      <FontAwesomeIcon icon={faShoppingCart} className="text-blue-500 text-3xl" />
    </div>
  );
};

export default TotalOrders;
