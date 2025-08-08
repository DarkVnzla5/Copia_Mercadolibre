import React from "react";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: "Gestión de Inventario Intuitiva",
      description:
        "Controla tus existencias en tiempo real, recibe alertas de stock bajo y optimiza tu almacén.",
    },
    {
      title: "Tienda Online Personalizable",
      description:
        "Crea tu propia tienda en línea con facilidad, acepta pagos y gestiona envíos.",
    },
    {
      title: "Optimizado para PC y Móvil",
      description:
        "Accede a tu plataforma y vende desde cualquier dispositivo, en cualquier lugar.",
    },
    {
      title: "Análisis y Reportes",
      description:
        "Obtén información valiosa sobre tus ventas e inventario para tomar decisiones inteligentes.",
    },
    {
      title: "Soporte Dedicado",
      description:
        "Nuestro equipo está listo para ayudarte en cada paso del camino.",
    },
    {
      title: "Escalabilidad Garantizada",
      description:
        "Nuestra plataforma crece contigo, adaptándose a las necesidades de tu negocio.",
    },
  ];

  return (
    <div className="py-10 bg-base-100">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-3xl font-semibold mb-6">
          Características que Impulsarán tu Éxito
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card shadow-md p-6 bg-base-100">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
