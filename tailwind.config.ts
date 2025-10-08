// tailwind.config.ts

// 1. Importamos el tipo 'Config' de tailwindcss
import type { Config } from "tailwindcss";
// 2. Importamos la función del plugin 'daisyui'
import daisyui from "daisyui";

// 3. Definimos el objeto de configuración con el tipo 'Config'
const config: Config = {
  // === IMPORTANTE: Debes incluir la propiedad 'content' ===
  // Esto le dice a Tailwind qué archivos escanear para las clases que utilizas.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  // Si no tienes extensiones de tema, puedes dejar 'theme' vacío
  theme: {
    extend: {},
  },
  
  // 4. Se usa la función 'daisyui' como plugin
  plugins: [daisyui], 

  // Configuración de DaisyUI
  daisyui: {
    // ... (Tu configuración de temas personalizada comienza aquí)
    themes: [
      {
        "vuelvan-caras": {
          "primary": "oklch(0.81 0.1 200)",
          "primary-content": "oklch(0.2 0 0)",
          "secondary": "oklch(0.77 0.12 70)",
          "secondary-content": "oklch(0.2 0 0)",
          "base-100": "oklch(0.98 0 0)",
          "base-content": "oklch(0.2 0 0)",
          
          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          
          "--shadow-2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          "--shadow-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        },
      },
      "dark", 
    ],
    darkTheme: "dark",
    themeRoot: ":root",
  },
};

// 5. Exportamos la configuración por defecto
export default config;