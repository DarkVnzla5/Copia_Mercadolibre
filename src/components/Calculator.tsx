import React, { useState, useCallback, useRef } from "react";
// Eliminamos la importación de useDraggable y los hooks con mayúsculas

interface CalculatorProps {
  initialValueX: number;
  initialValueY: number;
}

const Calculator: React.FC<CalculatorProps> = ({
  initialValueX,
  initialValueY,
}) => {
  // --- LÓGICA DE LA CALCULADORA ---
  const [display, setDisplay] = useState("0");

  const handleButtonClick = (value: string) => {
    // CORRECCIÓN 4: Usamos 'C' mayúscula para coincidir con el botón
    if (value === "C") {
      setDisplay("0");
    } else if (value === "=") {
      try {
        setDisplay(eval(display).toString());
      } catch {
        setDisplay("Error");
      }
    } else {
      // Ajuste para manejar paréntesis, si es necesario, aunque eval() funciona con ellos.
      setDisplay((prev) =>
        prev === "0" && !isNaN(Number(value)) ? value : prev + value
      );
    }
  };

  const calculatorButtons = [
    "C",
    "(",
    ")",
    "/",
    "7",
    "8",
    "9",
    "*",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "0",
    ".",
    "=",
  ];

  // --- LÓGICA DE ARRASTRE (DRAGGING) ---
  const [position, setPosition] = useState({
    x: initialValueX,
    y: initialValueY,
  });
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // CORRECCIÓN 3: Añadir/Eliminar listeners al document para un arrastre robusto
  const handleMouseUp = useCallback(
    () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    },
    [
      /* No se necesita dependencia, ya que handleMouseMove se define abajo */
    ]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging.current) {
        setPosition({
          x: e.clientX - offset.current.x,
          y: e.clientY - offset.current.y,
        });
      }
    },
    [handleMouseUp]
  ); // Dependencia a handleMouseUp para asegurar la limpieza correcta

  // CORRECCIÓN 2: Tipado y Sintaxis corregida
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      isDragging.current = true;
      offset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      // CORRECCIÓN 3: Añadir listeners globales
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [position, handleMouseMove, handleMouseUp]
  );

  return (
    // CORRECCIÓN 5: Usamos backticks (`) para la interpolación de variables en el style.
    // También corregido el 'text-primary' a 'text-base-content' para seguir el tema daisyUI
    <section
      className="card shadow-xl w-80 bg-base-100 text-base-content absolute select-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging.current ? "grabbing" : "grab",
        zIndex: 1000,
      }}
    >
      {/* DRAG HANDLE */}
      <div
        className="card-header bg-base-200 text-base-content p-2 text-center font-bold cursor-grab"
        onMouseDown={handleMouseDown}
      >
        Calculadora
      </div>

      <div className="card-body p-4">
        {/* Display */}
        <div className="text-right p-4 mb-3 text-4xl bg-base-200 rounded-lg overflow-hidden">
          {display}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {calculatorButtons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className={`btn btn-lg ${
                ["+", "-", "*", "/"].includes(btn)
                  ? "btn-secondary"
                  : btn === "="
                  ? "btn-primary col-span-2"
                  : btn === "C"
                  ? "btn-accent" // Se mantiene el estilo accent para 'C'
                  : ["(", ")", "."].includes(btn)
                  ? "btn-neutral" // Números/Puntos/Paréntesis son neutral
                  : "btn-neutral" // Default
              }`}
              style={{
                gridColumn: btn === "=" ? "span 2" : "span 1",
              }}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Calculator;
