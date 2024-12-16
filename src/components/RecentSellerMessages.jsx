'use client';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const RecentSellerMessages = () => {
  const recentSellerMessages = useSelector(
    (state) => state.dashboard.recentSellerMessages
  );

  const lastThreeMessages = recentSellerMessages.slice(-3);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Recent Seller Messages</h2>
      <ul>
        {lastThreeMessages.map((message, index) => (
          <li key={index} className="mb-4">
            <p className="text-gray-700 font-medium">Message:</p>
            <p className="text-gray-700">{message.message}</p>
            <p className="text-sm text-gray-500">From Seller {message.sellerId} at {message.timestamp}</p>
          </li>
        ))}
      </ul>
      <Link href="/live-chat" className="text-blue-500 hover:text-blue-700">
        View All
      </Link>
    </div>
  );
};

export default RecentSellerMessages;
