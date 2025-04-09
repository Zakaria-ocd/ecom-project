export default function DarkModeButton() {
  function enableDarkMode() {
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
  }

  return (
    <button
      onClick={enableDarkMode}
      className="w-full h-full bg-slate-800 text-white p-2 rounded-md"
    >
      Dark Mode
    </button>
  );
}
