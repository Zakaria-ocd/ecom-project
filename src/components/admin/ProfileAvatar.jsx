import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { useSelector } from "react-redux";

export default function ProfileAvatar({
  profileVisibility,
  setProfileVisibility,
}) {
  const image=useSelector((state) => state.userReducer.image);
  return (
    <button
      className={`${
        profileVisibility && "bg-slate-200"
      } size-fit flex justify-center items-center hover:bg-blue-100 p-1 rounded-full transition-colors`}
      onClick={() => setProfileVisibility(!profileVisibility)}
    >
      {!image ? (
        <Skeleton className="rounded-full size-10 ring-2" />
      ) : (
        <Image
          src={image}
          width={36}
          height={36}
          alt="Avatar"
          className="rounded-full object-cover size-9 ring-2"
        />
      )}

      <span
        className="bottom-px left-px absolute w-3.5 h-3.5 bg-green-400 border-2 border-green-100 rounded-full"
        title="Online"
      />
    </button>
  );
}
