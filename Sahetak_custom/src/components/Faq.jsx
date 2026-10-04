import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import FaqImage from "../assets/faq.png";
import { cn } from "../utils/cn";

const FAQ_ITEMS = [
  {
    q: "واش نقدر نختار غير بعض الأيام؟",
    a: "إيه، تقدر تختار غير الأيام اللي بغيتي. وإذا أخذت الأسبوع كامل فالاشتراك الدوري كيعطيك تخفيض.",
  },
  {
    q: "واش التوصيل مجاني؟",
    a: "نعم، التوصيل مجاني على جميع الطلبات.",
  },
  {
    q: "واش الطباش كيتبدلوا من أسبوع لآخر؟",
    a: "كل أسبوع كاينة قائمة جديدة، حسب الاختيار ديال الزبناء.",
  },
  {
    q: "إمتا كيتوصل الطلب؟",
    a: "بين 13:30 و15:00.",
  },
  {
    q: "واش خاصني نطلب من قبل؟",
    a: "نعم، خاصك تطلب قبل نهار، حيت كنشريو مكونات النهار على حسب عدد الزبناء باش يكون كلشي طازج.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section dir="rtl" className="w-full bg-cream py-14 sm:py-20">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 sm:px-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:pt-2">
          <p className="text-xs font-extrabold tracking-[0.2em] text-primary">
            نجيبو على أسئلتك
          </p>

          <h2 className="mt-4 text-4xl font-extrabold leading-tight text-forest sm:text-5xl">
            الأسئلة الشائعة
          </h2>

          <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-600">
            كل ما تحتاج معرفته قبل ما تسجل طلبك.
          </p>

          <img
            src={FaqImage}
            alt=""
            aria-hidden="true"
            className="mt-8 w-36 select-none sm:w-44"
          />
        </div>

        <ul className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const open = openIndex === index;

            return (
              <li key={item.q}>
                <div
                  className={cn(
                    "rounded-2xl border px-5 py-5 transition-colors duration-200 sm:px-6",
                    open
                      ? "border-primary bg-white shadow-[0_10px_30px_rgba(32,65,21,0.08)]"
                      : "border-forest/10 bg-white/70 hover:border-forest/25"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    aria-expanded={open}
                    className="flex w-full cursor-pointer items-center gap-4"
                  >
                    <span className="shrink-0 font-serif text-sm font-semibold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="flex-1 text-base font-bold leading-snug text-forest sm:text-lg">
                      {item.q}
                    </span>

                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                        open
                          ? "bg-primary text-white"
                          : "border border-forest/20 text-forest/70"
                      )}
                    >
                      {open ? (
                        <Minus className="h-5 w-5" strokeWidth={2} />
                      ) : (
                        <Plus className="h-5 w-5" strokeWidth={2} />
                      )}
                    </span>
                  </button>

                  {open ? (
                    <p className="mt-4 pr-8 text-sm leading-relaxed text-gray-600 sm:text-base">
                      {item.a}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Faq;