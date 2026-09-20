import { cn } from "../../utils/cn";

export const TableWrapper = ({ className, children }) => (
  <div
    className={cn(
      "overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm",
      className
    )}
  >
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      {children}
    </table>
  </div>
);

export const THead = ({ children }) => (
  <thead className="bg-gray-50">
    <tr>{children}</tr>
  </thead>
);

export const TBody = ({ children }) => (
  <tbody className="divide-y divide-gray-100">{children}</tbody>
);

export const TR = ({ className, children }) => (
  <tr className={cn("transition hover:bg-gray-50/70", className)}>
    {children}
  </tr>
);

export const TH = ({ className, children }) => (
  <th
    scope="col"
    className={cn(
      "whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500",
      className
    )}
  >
    {children}
  </th>
);

export const TD = ({ className, children, colSpan }) => (
  <td
    colSpan={colSpan}
    className={cn("whitespace-nowrap px-4 py-3 text-gray-700", className)}
  >
    {children}
  </td>
);

export const TableState = ({ colSpan, children }) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-12 text-center text-sm text-gray-500">
      {children}
    </td>
  </tr>
);
