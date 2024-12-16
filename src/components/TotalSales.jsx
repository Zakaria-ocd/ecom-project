'use client';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet  } from '@fortawesome/free-solid-svg-icons';

const TotalSales = () => {
  const totalSales = useSelector((state) => state.dashboard.totalSales);

  return (
    <div className="bg-orange-50 p-4 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex flex-col items-start">
        <p className="text-3xl font-bold">{totalSales}</p>
        <p className="text-sm text-gray-500">Total Sales</p>
      </div>
      <FontAwesomeIcon icon={faWallet } className="text-orange-500 text-3xl" />
    </div>
  );
};

export default TotalSales;
