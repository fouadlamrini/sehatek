import { Inbox } from "lucide-react";

const EmptyState = ({ icon: Icon = Inbox, title, description, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
      <Icon className="h-6 w-6 text-gray-400" />
    </div>

    <div>
      <h3 className="text-base font-bold text-gray-800">{title}</h3>

      {description ? (
        <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
          {description}
        </p>
      ) : null}
    </div>

    {action ? <div className="mt-1">{action}</div> : null}
  </div>
);

export default EmptyState;
