import Profile from "./Profile";
import Search from "./Search";

export default function Navbar() {
  return (
    <div className="w-full h-[63px] bg-white flex justify-between items-center border-b px-4 py-2 shadow-sm">
      <Search />
      <Profile />
    </div>
  );
}
