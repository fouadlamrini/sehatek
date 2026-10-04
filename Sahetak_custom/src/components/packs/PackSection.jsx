import PackCard from "./PackCard";

const PackSection = ({ packs, onAdd, onImageClick }) => {
  if (!packs || packs.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-leaf/25" />
        <h2 dir="rtl" className="font-serif text-2xl font-semibold text-forest sm:text-3xl">
          باقاتنا
        </h2>
        <span className="h-px flex-1 bg-leaf/25" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {packs.map((pack) => (
          <PackCard
            key={pack._id}
            pack={pack}
            onAdd={onAdd}
            onImageClick={onImageClick}
          />
        ))}
      </div>
    </section>
  );
};

export default PackSection;
