const PageHeader = ({ title, subtitle, actions }) => (
  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-xl font-bold text-forest sm:text-2xl">{title}</h1>

      {subtitle ? (
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      ) : null}
    </div>

    {actions ? (
      <div className="flex flex-wrap items-center gap-2">{actions}</div>
    ) : null}
  </div>
);

export default PageHeader;
