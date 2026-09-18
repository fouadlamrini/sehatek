import React, { useEffect, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import dataProduct from '../data/data';

const Card = () => {
  // =========================
  // STATES
  // =========================

  // Produits sélectionnés
  const [selectedIds, setSelectedIds] = useState([]);

  // Quantité de chaque produit
  const [quantities, setQuantities] = useState(
    dataProduct.reduce(
      (acc, p) => ({
        ...acc,
        [p.id]: 1,
      }),
      {}
    )
  );

  // Accordion Modifier
  const [openAccordions, setOpenAccordions] = useState({});

  // Notes
  const [notes, setNotes] = useState({});

  // Image sélectionnée pour le modal
  const [selectedImage, setSelectedImage] = useState(null);

  // Message d'erreur
  const [errorMessage, setErrorMessage] = useState('');

  // =========================
  // 1. SELECT / DESELECT PRODUCT
  // =========================

  const handleSelectProduct = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(
        selectedIds.filter((item) => item !== id)
      );

      setOpenAccordions((prev) => ({
        ...prev,
        [id]: false,
      }));
    } else {
      setSelectedIds([
        ...selectedIds,
        id,
      ]);

      // Cacher le message d'erreur
      setErrorMessage('');

      setOpenAccordions((prev) => ({
        ...prev,
        [id]: false,
      }));
    }
  };

  // =========================
  // 2. SELECT ALL / DESELECT ALL
  // =========================

  const handleSelectAll = () => {
    if (
      selectedIds.length === dataProduct.length
    ) {
      setSelectedIds([]);
      setOpenAccordions({});
    } else {
      const allIds = dataProduct.map(
        (p) => p.id
      );

      setSelectedIds(allIds);

      // Cacher le message d'erreur
      setErrorMessage('');

      setOpenAccordions({});
    }
  };

  // =========================
  // 3. QUANTITÉ
  // =========================

  const handleQuantityChange = (id, delta) => {
    setQuantities((prev) => {
      const currentQty =
        prev[id] || 1;

      const newQty = Math.max(
        1,
        currentQty + delta
      );

      return {
        ...prev,
        [id]: newQty,
      };
    });
  };

  // =========================
  // 4. TOGGLE MODIFIER / MASQUER
  // =========================

  const toggleAccordion = (id) => {
    if (!selectedIds.includes(id)) {
      return;
    }

    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // =========================
  // 5. NOTES
  // =========================

  const handleNoteChange = (id, value) => {
    setNotes((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // =========================
  // 6. TOTAL
  // =========================

  const subtotal = dataProduct.reduce(
    (sum, product) => {
      if (
        selectedIds.includes(product.id)
      ) {
        const qty =
          quantities[product.id] || 1;

        return (
          sum +
          product.price * qty
        );
      }

      return sum;
    },
    0
  );

  // Remise si tous les produits sont sélectionnés
  const isAllSelected =
    selectedIds.length ===
      dataProduct.length &&
    dataProduct.length > 0;

  const discount =
    isAllSelected ? 10 : 0;

  const total = Math.max(
    0,
    subtotal - discount
  );

  // =========================
  // 7. WHATSAPP
  // =========================

  const handleWhatsAppOrder = () => {
    // Aucun produit sélectionné
    if (selectedIds.length === 0) {
      setErrorMessage(
        '⚠️ Veuillez sélectionner au moins un plat avant de continuer.'
      );

      return;
    }

    // Supprimer le message d'erreur
    setErrorMessage('');

    let message =
      `*Salam, bghit n-commander had les plats:*\n\n`;

    dataProduct.forEach((p) => {
      if (
        selectedIds.includes(p.id)
      ) {
        const qty =
          quantities[p.id] || 1;

        const noteText = notes[p.id]
          ? `\n   📝 *Note:* ${notes[p.id]}`
          : '';

        message +=
          `🍽️ *${p.name}* (${p.jour})\n` +
          `   - Quantité: ${qty}\n` +
          `   - Prix: ${p.price * qty} DH` +
          `${noteText}\n\n`;
      }
    });

    if (discount > 0) {
      message +=
        `🎁 *Remise Semaine (Tous les jours):* -10 DH\n`;
    }

    message +=
      `💰 *Total Final: ${total} DH*`;

    // Numéro WhatsApp
    const rawPhoneNumber =
      '+212 656-536985';

    const phoneNumber =
      rawPhoneNumber.replace(
        /[^0-9]/g,
        ''
      );

    const url =
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      url,
      '_blank'
    );
  };

  // =========================
  // 8. ESCAPE POUR FERMER IMAGE
  // =========================

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, []);

  // =========================
  // RETURN
  // =========================

  return (
    <>
      <div
        className="
          max-w-4xl
          mx-auto
          p-4
          sm:p-6
          space-y-6
          bg-white
        "
      >

        {/* ========================= */}
        {/* TITRE MENU */}
        {/* ========================= */}

        <div className="flex justify-center">
          <h2
            className="
              rounded-xl
              border-2
              border-[#649714]
              bg-white
              px-6
              py-3
              text-center
              text-2xl
              font-bold
              text-[#204115]
              shadow-md
              sm:px-8
              sm:py-4
              sm:text-3xl
            "
          >
            Menu de la Semaine
          </h2>
        </div>

        {/* ========================= */}
        {/* SELECT ALL */}
        {/* ========================= */}

        <div
          className="
            flex
            items-center
            justify-end
            rounded-xl
            border
            border-gray-100
            bg-white
            p-4
            shadow-sm
          "
        >
          <label
            className="
              flex
              cursor-pointer
              items-center
              space-x-2
              font-semibold
              text-gray-700
            "
          >
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAll}
              style={{
                accentColor: '#E58730',
              }}
              className="
                h-5
                w-5
                cursor-pointer
                rounded
              "
            />

            <span>
              Sélectionner tout
            </span>
          </label>
        </div>

        {/* ========================= */}
        {/* PRODUCTS */}
        {/* ========================= */}

        <div
          className="
            grid
            grid-cols-1
            items-start
            gap-4
            md:grid-cols-2
          "
        >
          {dataProduct.map(
            (product) => {

              const isSelected =
                selectedIds.includes(
                  product.id
                );

              const isOpen =
                !!openAccordions[
                  product.id
                ];

              const qty =
                quantities[
                  product.id
                ] || 1;

              return (
                <div
                  key={product.id}
                  style={{
                    borderColor:
                      isSelected
                        ? '#E58730'
                        : '#e5e7eb',
                  }}
                  className={`
                    overflow-hidden
                    rounded-xl
                    border
                    bg-white
                    shadow-sm
                    transition-all
                    duration-200
                    ${
                      isSelected
                        ? 'ring-2 ring-[#E58730]/20'
                        : ''
                    }
                  `}
                >

                  {/* ========================= */}
                  {/* CARD BODY */}
                  {/* ========================= */}

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                      p-4
                    "
                  >

                    {/* CHECKBOX */}

                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() =>
                        handleSelectProduct(
                          product.id
                        )
                      }
                      style={{
                        accentColor:
                          '#E58730',
                      }}
                      className="
                        h-5
                        w-5
                        flex-shrink-0
                        cursor-pointer
                        rounded
                      "
                    />

                    {/* ========================= */}
                    {/* IMAGE */}
                    {/* ========================= */}

                    <div
                      onClick={() =>
                        setSelectedImage(
                          product.image
                        )
                      }
                      className="
                        group
                        relative
                        h-20
                        w-20
                        flex-shrink-0
                        cursor-pointer
                        overflow-hidden
                        rounded-lg
                      "
                    >

                      {/* Image */}

                      <img
                        src={product.image}
                        alt={product.name}
                        className="
                          h-full
                          w-full
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
                          bg-black/10
                          opacity-0
                          transition-opacity
                          duration-200
                          group-hover:opacity-100
                        "
                      />

                      {/* ========================= */}
                      {/* EXPAND ICON */}
                      {/* ========================= */}

                      <div
                        className="
                          absolute
                          bottom-1
                          right-1
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-full
                          bg-black/60
                          text-white
                          opacity-0
                          shadow-md
                          backdrop-blur-sm
                          transition-all
                          duration-200
                          group-hover:opacity-100
                        "
                      >
                        <Maximize2 className="h-4 w-4" />
                      </div>

                    </div>

                    {/* ========================= */}
                    {/* DETAILS */}
                    {/* ========================= */}

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >

                      <span
                        style={{
                          backgroundColor:
                            '#E58730',
                          color: '#ffffff',
                        }}
                        className="
                          rounded-full
                          px-2
                          py-0.5
                          text-xs
                          font-semibold
                        "
                      >
                        {product.jour}
                      </span>

                      <h3
                        className="
                          mt-1
                          truncate
                          text-base
                          font-bold
                          text-gray-800
                        "
                      >
                        {product.name}
                      </h3>

                      <p
                        style={{
                          color: '#204115',
                        }}
                        className="
                          mt-0.5
                          text-sm
                          font-extrabold
                        "
                      >
                        {product.price} DH
                      </p>

                    </div>

                  </div>

                  {/* ========================= */}
                  {/* MODIFIER / MASQUER */}
                  {/* ========================= */}

                  {isSelected && (
                    <div
                      className="
                        border-t
                        border-gray-100
                        bg-gray-50/50
                      "
                    >

                      {/* Toggle */}

                      <button
                        onClick={() =>
                          toggleAccordion(
                            product.id
                          )
                        }
                        style={{
                          color: '#E58730',
                        }}
                        className="
                          flex
                          w-full
                          cursor-pointer
                          items-center
                          justify-between
                          px-4
                          py-2.5
                          text-left
                          text-xs
                          font-bold
                          transition-colors
                          hover:bg-gray-100
                        "
                      >
                        <span>
                          {isOpen
                            ? 'Masquer'
                            : 'Modifier'}
                        </span>

                        <span
                          className="
                            text-sm
                          "
                        >
                          {isOpen
                            ? '▲'
                            : '▼'}
                        </span>
                      </button>

                      {/* ========================= */}
                      {/* ACCORDION CONTENT */}
                      {/* ========================= */}

                      {isOpen && (
                        <div
                          className="
                            space-y-3
                            border-t
                            border-gray-100
                            bg-white
                            p-4
                            pt-2
                          "
                        >

                          {/* QUANTITÉ */}

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                            "
                          >
                            <span
                              className="
                                text-xs
                                font-semibold
                                text-gray-600
                              "
                            >
                              Quantité:
                            </span>

                            <div
                              className="
                                flex
                                items-center
                                space-x-2
                                rounded-lg
                                border
                                border-gray-200
                                bg-gray-50
                                p-1
                              "
                            >

                              {/* MINUS */}

                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    -1
                                  )
                                }
                                className="
                                  flex
                                  h-7
                                  w-7
                                  cursor-pointer
                                  items-center
                                  justify-center
                                  rounded
                                  bg-white
                                  font-bold
                                  text-gray-700
                                  shadow-sm
                                  transition
                                  hover:bg-gray-200
                                "
                              >
                                -
                              </button>

                              {/* QUANTITY */}

                              <span
                                className="
                                  w-8
                                  text-center
                                  text-sm
                                  font-bold
                                  text-gray-800
                                "
                              >
                                {qty}
                              </span>

                              {/* PLUS */}

                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    1
                                  )
                                }
                                className="
                                  flex
                                  h-7
                                  w-7
                                  cursor-pointer
                                  items-center
                                  justify-center
                                  rounded
                                  bg-white
                                  font-bold
                                  text-gray-700
                                  shadow-sm
                                  transition
                                  hover:bg-gray-200
                                "
                              >
                                +
                              </button>

                            </div>
                          </div>

                          {/* ========================= */}
                          {/* NOTE */}
                          {/* ========================= */}

                          <div>
                            <label
                              className="
                                mb-1
                                block
                                text-xs
                                font-semibold
                                text-gray-600
                              "
                            >
                              Ajouter une note:
                            </label>

                            <input
                              type="text"
                              placeholder="Ex: Sans oignon, bien cuit..."
                              value={
                                notes[
                                  product.id
                                ] || ''
                              }
                              onChange={(e) =>
                                handleNoteChange(
                                  product.id,
                                  e.target.value
                                )
                              }
                              className="
                                w-full
                                rounded-lg
                                border
                                border-gray-200
                                p-2
                                text-xs
                                outline-none
                                focus:border-[#E58730]
                              "
                            />
                          </div>

                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            }
          )}
        </div>

        {/* ========================= */}
        {/* RESUME */}
        {/* ========================= */}

        <div
          className="
            space-y-4
            rounded-xl
            border
            border-gray-100
            bg-white
            p-5
            shadow-md
          "
        >

          <div
            className="
              space-y-2
              text-sm
            "
          >

            {/* SUBTOTAL */}

            <div
              className="
                flex
                justify-between
                text-gray-600
              "
            >
              <span>
                Sous-total:
              </span>

              <span
                className="
                  font-semibold
                "
              >
                {subtotal} DH
              </span>
            </div>

            {/* DISCOUNT */}

            {discount > 0 && (
              <div
                style={{
                  color: '#649714',
                }}
                className="
                  flex
                  justify-between
                  font-bold
                "
              >
                <span>
                  Remise (Semaine Complète):
                </span>

                <span>
                  -10 DH
                </span>
              </div>
            )}

            {/* TOTAL */}

            <div
              style={{
                color: '#204115',
              }}
              className="
                flex
                justify-between
                border-t
                pt-2
                text-lg
                font-black
              "
            >
              <span>
                Total:
              </span>

              <span>
                {total} DH
              </span>
            </div>

          </div>

          {/* ========================= */}
          {/* ERROR MESSAGE */}
          {/* ========================= */}

          {errorMessage && (
            <div
              className="
                rounded-lg
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                font-semibold
                text-red-600
              "
            >
              {errorMessage}
            </div>
          )}

          {/* ========================= */}
          {/* WHATSAPP */}
          {/* ========================= */}

          <button
            onClick={handleWhatsAppOrder}
            style={{
              backgroundColor: '#649714',
            }}
            className="
              flex
              w-full
              cursor-pointer
              items-center
              justify-center
              space-x-2
              rounded-xl
              py-3.5
              text-base
              font-bold
              text-white
              shadow-lg
              transition
              duration-200
              hover:bg-[#204115]
            "
          >
            <span>
              Demander sur WhatsApp
            </span>
          </button>

        </div>
      </div>

      {/* ========================= */}
      {/* IMAGE MODAL */}
      {/* ========================= */}

      {selectedImage && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/80
            p-4
          "
          onClick={() =>
            setSelectedImage(null)
          }
        >

          <div
            className="
              relative
              max-h-[90vh]
              max-w-5xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* GRANDE IMAGE */}

            <img
              src={selectedImage}
              alt="Produit"
              className="
                max-h-[85vh]
                max-w-full
                rounded-xl
                object-contain
                shadow-2xl
              "
            />

            {/* CLOSE */}

            <button
              onClick={() =>
                setSelectedImage(null)
              }
              className="
                absolute
                right-2
                top-2
                flex
                h-10
                w-10
                cursor-pointer
                items-center
                justify-center
                rounded-full
                bg-[#204115]
                text-2xl
                font-bold
                text-white
                transition
                hover:bg-[#E58730]
              "
              aria-label="Fermer"
            >
              ×
            </button>

          </div>
        </div>
      )}
    </>
  );
};

export default Card;