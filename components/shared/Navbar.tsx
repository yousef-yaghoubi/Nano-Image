const navDetail = [
  { id: 1, label: "صفحه اصلی", link: "/" },
  { id: 2, label: "درباره من", link: "/about" },
];

export default function Navbar() {
  return (
    <div className="w-full h-14 md:h-20 border-b border-gray-200 flex justify-around items-center">
      <span className="text-xl md:text-3xl font-extrabold text-gray-600">
        Nano Image
      </span>
      <nav>
        <ul className="flex gap-4">
          {navDetail.map((li) => (
            <li key={li.id}>{li.label}</li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
