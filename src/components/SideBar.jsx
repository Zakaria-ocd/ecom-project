'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import logo from '../../public/assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faShoppingCart, faList, faUser, faMoneyBillAlt, faUserSlash, faUserPlus, faComment, faSignOutAlt, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          className={`p-2 text-white rounded-full bg-blue-950 ${isOpen ? 'hidden' : 'block'}`}
          onClick={handleToggle}
          aria-label="Open Sidebar"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        <button
          className={`p-2 text-white rounded-full bg-blue-950 mt-2 ${isOpen ? 'block' : 'hidden'}`}
          onClick={handleToggle}
          aria-label="Close Sidebar"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 absolute lg:relative top-0 left-0 bottom-0 w-64 bg-blue-950 text-white p-4 z-10 transition-transform duration-300`}
      >
        <div className="logo mb-6 flex items-center justify-between">
          <Image
            src={logo}
            alt="Logo"
            className="w-60 h-auto pointer-events-none"
          />
        </div>

        <ul className="space-y-4">
          <li>
            <Link
              href="/admin/dashboard"
              className="flex items-center py-2 px-4 hover:bg-blue-700 rounded transition duration-200 text-white font-bold"
            >
              <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/orders"
              className="flex items-center py-2 px-4 hover:bg-blue-700 rounded transition duration-200 text-white font-bold"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
              <span>Orders</span>
            </Link>
          </li>
          <li>
            <Link
              href="/category"
              className="flex items-center py-2 px-4 hover:bg-blue-700 rounded transition duration-200 text-white font-bold"
            >
              <FontAwesomeIcon icon={faList} className="mr-2" />
              <span>Category</span>
            </Link>
          </li>
          <li>
            <Link
              href="/sellers"
              className="flex items-center py-2 px-4 hover:bg-blue-700 rounded transition duration-200 text-white font-bold"
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              <span>Sellers</span>
            </Link>
          </li>
          <li>
            <Link
              href="/payment-request"
              className="flex items-center py-2 px-4 hover:bg-blue-700 rounded transition duration-200 text-white font-bold"
            >
              <FontAwesomeIcon icon={faMoneyBillAlt} className="mr-2" />
              <span>Payment Request</span>
            </Link>
          </li>
          <li>
            <Link
              href="/deactive-sellers"
              className="flex items-center py-2 px-4 hover:bg-blue-700 rounded transition duration-200 text-white font-bold"
            >
              <FontAwesomeIcon icon={faUserSlash} className="mr-2" />
              <span>Deactive Sellers</span>
            </Link>
          </li>
          <li>
            <Link
              href="/seller-request"
              className="flex items-center py-2 px-4 hover:bg-blue-700 rounded transition duration-200 text-white font-bold"
            >
              <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
              <span>Seller Request</span>
            </Link>
          </li>
          <li>
            <Link
              href="/live-chat"
              className="flex items-center py-2 px-4 hover:bg-blue-700 rounded transition duration-200 text-white font-bold"
            >
              <FontAwesomeIcon icon={faComment} className="mr-2" />
              <span>Live Chat</span>
            </Link>
          </li>
          <li>
            <Link
              href="/logout"
              className="flex items-center py-2 px-4 hover:bg-blue-700 rounded transition duration-200 text-white font-bold"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay for small screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-5 lg:hidden"
          onClick={handleToggle}
        />
      )}
    </>
  );
};

export default Sidebar;
