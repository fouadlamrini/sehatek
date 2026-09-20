import Sahetak from "../../assets/sahetak.png";

const SiteHeader = ({ itemsCount = 0 }) => (
  <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
    <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <img
          src={Sahetak}
          alt="Sehatek"
          className="h-9 w-9 rounded-full object-cover"
        />
        <span className="text-lg font-extrabold tracking-tight text-forest">
          Sehatek
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-bold text-primary">
        🛒 <span>{itemsCount}</span>
      </div>
    </div>
  </header>
);

export default SiteHeader;
