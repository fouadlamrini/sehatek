import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center">
    <span className="text-5xl font-extrabold text-primary">404</span>
    <p className="text-gray-500">Cette page n'existe pas.</p>
    <Link
      to="/"
      className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
    >
      Retour au menu
    </Link>
  </div>
);

export default NotFound;
