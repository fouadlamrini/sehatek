import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

import { cn } from "../utils/cn";

const FAQ_ITEMS = [
  {
    q: "Wach momkin nakhed ghi l ayam li bghit wla darori simana kamla?",
    a: "Momkin tkhetar l ayam li bghiti bnisba l simana kikon fiha discount.",
  },
  {
    q: "Wach la Livraison gratuit?",
    a: "Oui.",
  },
  {
    q: "Wach kib9aw nefs les plats wla kitbdlo?",
    a: "Kola semaine kikono fiha des plats 3la hasab l ikhtiyar dyalkom.",
  },
  {
    q: "Fo9ach kadiro la Livraison?",
    a: "Bin 13:30 o 15:00.",
  },
  {
    q: "Wach darori n commandé nhar 9bel?",
    a: "Oui darori 7it kanchriw les ingredients dyal nhar 3la hasab les personnes li 3ndna bach katakloh frais.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <HelpCircle className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-forest">
          Questions fréquentes
        </h2>
      </div>

      <div className="mt-3 divide-y divide-gray-100">
        {FAQ_ITEMS.map((item, index) => {
          const open = openIndex === index;

          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-3 py-3.5 text-left"
              >
                <span className="font-semibold text-gray-800">{item.q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
                    open && "rotate-180"
                  )}
                />
              </button>

              {open ? (
                <p className="pb-4 text-sm leading-relaxed text-gray-500">
                  {item.a}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Faq;