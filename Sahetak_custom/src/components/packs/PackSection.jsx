import PackCard from "./PackCard";

const PackSection = ({ packs, onAdd, onImageClick }) => {
  if (!packs || packs.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-gray-200" />
        <h2 className="text-lg font-extrabold text-forest">Nos Packs</h2>
        <span className="h-px flex-1 bg-gray-200" />
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
