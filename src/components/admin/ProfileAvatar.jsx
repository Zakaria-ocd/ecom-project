import Image from "next/image";

export default function ProfileAvatar({
  profileVisibility,
  setProfileVisibility,
}) {
  return (
    <button
      className={`${
        profileVisibility && "bg-slate-200"
      } size-fit flex justify-center items-center hover:bg-blue-100 p-1 rounded-full transition-colors`}
      onClick={() => setProfileVisibility(!profileVisibility)}
    >
      <Image
        src={"/assets/avatar.jpg"}
        width={40}
        height={40}
        alt="Avatar"
        className="rounded-full p-px ring-2"
      />
      <span
        className="bottom-px left-px absolute w-3.5 h-3.5 bg-green-400 border-2 border-green-100 rounded-full"
        title="Online"
      />
    </button>
  );
}
