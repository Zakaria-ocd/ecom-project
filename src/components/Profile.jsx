'use client';
import { useSelector } from "react-redux";

const Profile = () => {
  const adminName = useSelector((state) => state.dashboard.adminName);
  const adminFunction = useSelector((state) => state.dashboard.adminFunction);

  return (
    <div className="bg-white p-2 rounded-lg shadow-md mr-4 mt-4 mb-4">
      <h4 className="text-lg font-semibold mb-2 ">{adminName}</h4>
      <p className="text-gray-500  ">{adminFunction}</p>
    </div>
  );
};

export default Profile;
