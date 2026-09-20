import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";

import Button from "../components/ui/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft">
        <Compass className="h-8 w-8 text-primary" />
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-forest">404</h1>
        <p className="mt-1 text-sm text-gray-500">
          The page you are looking for does not exist.
        </p>
      </div>

      <Button onClick={() => navigate("/dashboard", { replace: true })}>
        Back to Dashboard
      </Button>
    </div>
  );
};

export default NotFound;
