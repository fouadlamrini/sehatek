import React, { useState } from 'react';
import Sahetak from '../assets/sahetak.png';
import Plats from '../assets/plats.jpeg';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <header className="w-full bg-white shadow-md rounded-b-lg overflow-hidden">

        {/* ========================= */}
        {/* PHOTO BANNER */}
        {/* ========================= */}

        <div
          onClick={() => setIsOpen(true)}
          className="
            relative
            h-48
            sm:h-56
            md:h-64
            w-full
            bg-gray-200
            cursor-pointer
            group
            overflow-hidden
          "
        >
          <img
            src={Plats}
            alt="Banner"
            className="
              w-full
              h-full
              object-cover
              transition-transform
              duration-300
              group-hover:scale-105
            "
          />

          {/* Hover Overlay */}

          <div
            className="
              absolute
              inset-0
              bg-black/20
              opacity-0
              group-hover:opacity-100
              transition-opacity
              duration-300
              flex
              items-center
              justify-center
            "
          >
            <span
              className="
                text-white
                text-sm
                font-medium
                bg-black/50
                px-3
                py-1
                rounded-full
                backdrop-blur-sm
              "
            >
              Afficher la photo
            </span>
          </div>
        </div>

        {/* ========================= */}
        {/* PROFILE */}
        {/* ========================= */}

        <div className="relative px-4 sm:px-8 pb-4">

          <div
            className="
              flex
              flex-col
              items-center
              -mt-16
              sm:-mt-20
            "
          >

            {/* ========================= */}
            {/* PROFILE IMAGE */}
            {/* ========================= */}

            <div
              className="
                relative
                w-32
                h-32
                sm:w-36
                sm:h-36
                rounded-full
                border-4
                border-white
                shadow-lg
                overflow-hidden
                bg-gray-100
                flex-shrink-0
              "
            >
              <img
                src={Sahetak}
                alt="Profile"
                className="
                  w-full
                  h-full
                  object-cover
                "
              />
            </div>

            {/* ========================= */}
            {/* NAME */}
            {/* ========================= */}

            <div className="mt-3">
              <h1
                className="
                  text-xl
                  sm:text-2xl
                  font-bold
                  text-gray-900
                  text-center
                "
              >
                Sahetak
              </h1>
            </div>

          </div>
        </div>

      </header>

      {/* ========================= */}
      {/* IMAGE MODAL */}
      {/* ========================= */}

      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/80
            backdrop-blur-sm
            p-4
          "
          onClick={() => setIsOpen(false)}
        >

          {/* Image Container */}

          <div
            className="
              relative
              max-w-5xl
              w-full
              max-h-[90vh]
              flex
              items-center
              justify-center
            "
            onClick={(e) => e.stopPropagation()}
          >

            {/* ========================= */}
            {/* CLOSE BUTTON */}
            {/* ========================= */}

            <button
              onClick={() => setIsOpen(false)}
              className="
                absolute
                -top-12
                right-0
                sm:-top-14
                sm:-right-4
                bg-white/20
                hover:bg-white/40
                text-white
                hover:text-red-400
                p-2
                sm:p-3
                rounded-full
                transition-all
                duration-300
                transform
                hover:rotate-90
                hover:scale-110
                backdrop-blur-md
                shadow-lg
                focus:outline-none
                cursor-pointer
              "
              title="Fermer"
              aria-label="Fermer"
            >
              <svg
                className="
                  w-6
                  h-6
                  sm:w-7
                  sm:h-7
                "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* ========================= */}
            {/* FULL IMAGE */}
            {/* ========================= */}

            <img
              src={Plats}
              alt="Banner Full"
              className="
                w-full
                max-h-[85vh]
                object-contain
                rounded-lg
                shadow-2xl
              "
            />

          </div>
        </div>
      )}
    </>
  );
};

export default Header;