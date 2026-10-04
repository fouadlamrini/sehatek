import { Link } from "react-router-dom";

import SiteFooter from "../components/layout/SiteFooter";

const NotFound = () => (
  <div className="flex min-h-screen flex-col bg-gray-50">
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="font-serif text-6xl font-semibold text-primary">404</span>

      <p dir="rtl" className="text-gray-500">
        هاد الصفحة ما كايناش.
      </p>

      <Link
        to="/"
        className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
      >
        العودة للقائمة
      </Link>
    </main>

    <SiteFooter />
  </div>
);

export default NotFound;