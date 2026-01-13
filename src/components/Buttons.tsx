import React, { useState, useEffect } from "react";

interface Address {
  code1: string;
  code2: string;
}

const DEFAULT_ADDRESS: Address = { code1: "", code2: "" };

const DeliveryModal: React.FC = () => {
  const [deliveryAddress, setDeliveryAddress] = useState<Address>(DEFAULT_ADDRESS);
  const [tempAddress, setTempAddress] = useState<Address>(DEFAULT_ADDRESS);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("userAddress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDeliveryAddress(parsed);
      } catch (e) {
        console.error("Error parsing saved address", e);
      }
    }
  }, []);

  const openModal = () => {
    setTempAddress(deliveryAddress);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const handleInputChange = (field: keyof Address, value: string) => {
    const sanitizedValue = value.slice(0, 3).toUpperCase();
    setTempAddress((prev) => ({
      ...prev,
      [field]: sanitizedValue,
    }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setDeliveryAddress(tempAddress);
    localStorage.setItem("userAddress", JSON.stringify(tempAddress));
    closeModal();
  };

  const formatAddress = (addr: Address) =>
    addr.code1 && addr.code2 ? `${addr.code1}-${addr.code2}` : null;

  const displayMain = formatAddress(deliveryAddress) || "Ingresar dirección";

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-start gap-1">
        <button
          className="btn btn-primary btn-sm lg:btn-md gap-2"
          onClick={openModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="hidden sm:inline">Delivery to</span>
        </button>
        <span className="text-xs font-semibold px-2 text-secondary opacity-80">
          {displayMain}
        </span>
      </div>

      <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className="modal-box max-w-sm">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={closeModal}
          >
            ✕
          </button>

          <h3 className="font-bold text-xl text-primary mb-2">
            Dirección de Envío
          </h3>
          <p className="text-sm text-base-content/70 mb-6">
            Ingresa tu código postal para calcular costos y envíos gratis.
          </p>

          <form onSubmit={handleApply} className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
                Código Postal (3 dígitos)
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ABC"
                  value={tempAddress.code1}
                  onChange={(e) => handleInputChange("code1", e.target.value)}
                  className="input input-bordered w-full uppercase"
                  maxLength={3}
                  required
                />
                <input
                  type="text"
                  placeholder="123"
                  value={tempAddress.code2}
                  onChange={(e) => handleInputChange("code2", e.target.value)}
                  className="input input-bordered w-full uppercase"
                  maxLength={3}
                  required
                />
              </div>
            </div>

            <div className="bg-base-200 p-4 rounded-xl space-y-2 text-center">
              <p className="text-xs font-bold text-base-content/50 uppercase">
                Dirección Guardada
              </p>
              <p className="font-mono font-bold text-lg">
                {formatAddress(deliveryAddress) || "---"}
              </p>
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary w-full">
                Guardar y Aplicar
              </button>
            </div>
          </form>
        </div>
        <div className="modal-backdrop" onClick={closeModal}></div>
      </dialog>
    </div>
  );
};

export default DeliveryModal;


