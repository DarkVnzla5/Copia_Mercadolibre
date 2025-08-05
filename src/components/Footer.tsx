import React from "react";
import { Link } from "react-router";

const Footer = () => (
  <footer className="footer footer-horizontal p-2 bg-primary-content text-primary">
    <section className="footer footer-horizontal p-2 bg-primary-content text-primary">
      <div>
        <span className="footer-title">Compañía</span>
        <Link className="link link-hover" to="/About">
          Acerca de
        </Link>
        <Link className="link link-hover" to="/Contact">
          Contacto
        </Link>
      </div>
      <div>
        <span className="footer-title">Sígueme</span>
        <div className="grid grid-flow-col gap-4">
          <Link
            to="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              className="fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M24 4.56v14.91A4.54 4.54 0 0 1 19.44 24H4.56A4.54 4.54 0 0 1 0 19.47V4.56A4.54 4.54 0 0 1 4.56 0h14.91A4.54 4.54 0 0 1 24 4.56ZM7.09 19.47h3.13v-6.18H7.09Zm1.56-7.06a1.81 1.81 0 1 0 0-3.62 1.81 1.81 0 0 0 0 3.62Zm8.35 7.06v-3.44c0-2.06-1.1-3.02-2.57-3.02a2.22 2.22 0 0 0-2 1.09v-1h-3.13c.04.66 0 6.18 0 6.18h3.13v-3.45c0-.18.01-.36.07-.49a1.09 1.09 0 0 1 2.07.49v3.45Z" />
            </svg>
          </Link>
        </div>
      </div>
    </section>

    <section className="footer p-2 bg-primary-content text-primary">
      <div>
        <span className="footer-title">Suscríbete</span>
        <div className="form-control w-80">
          <label className="label">
            <span className="label-text">Ingresa tu correo electrónico</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="tu correo electrónico"
              className="input input-bordered w-full"
            />
            <button className="btn btn-primary absolute top-0 right-0 rounded-l-none">
              Suscribirse
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center w-full">
        <p>
          © {new Date().getFullYear()} Comercial Vuelvan Caras, C.A. Todos los
          derechos reservados.
        </p>
      </div>
    </section>
  </footer>
);

export default Footer;
/*
  Para navegación completa, reemplaza los <a> por <Link> de react-router-dom donde corresponda a rutas internas.
  Ejemplo: <Link to="/acerca-de">Acerca de</Link>
  Aquí tienes el Footer modificado:
*/

// const Footer = () => (
//   <footer className="footer footer-horizontal p-2 bg-primary-content text-primary">
//     <section className="footer footer-horizontal p-2 bg-primary-content text-primary">
//       <div>
//         <span className="footer-title">Servicios</span>
//         <Link className="link link-hover" to="/envios">Envíos</Link>
//         <Link className="link link-hover" to="/devoluciones">Devoluciones</Link>
//         <Link className="link link-hover" to="/soporte">Soporte</Link>
//       </div>
//       <div>
//         <span className="footer-title">Compañía</span>
//         <Link className="link link-hover" to="/acerca-de">Acerca de</Link>
//         <Link className="link link-hover" to="/contacto">Contacto</Link>
//         <Link className="link link-hover" to="/trabaja-con-nosotros">Trabaja con nosotros</Link>
//       </div>
//       <div>
//         <span className="footer-title">Legal</span>
//         <Link className="link link-hover" to="/terminos">Términos de uso</Link>
//         <Link className="link link-hover" to="/privacidad">Política de privacidad</Link>
//         <Link className="link link-hover" to="/cookies">Cookies</Link>
//       </div>
//       <div>
//         <span className="footer-title">Síguenos</span>
//         <div className="grid grid-flow-col gap-4">
//           <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               className="fill-current"
//               viewBox="0 0 24 24"
//             >
//               <path d="M24 4.56v14.91A4.54 4.54 0 0 1 19.44 24H4.56A4.54 4.54 0 0 1 0 19.47V4.56A4.54 4.54 0 0 1 4.56 0h14.91A4.54 4.54 0 0 1 24 4.56ZM7.09 19.47h3.13v-6.18H7.09Zm1.56-7.06a1.81 1.81 0 1 0 0-3.62 1.81 1.81 0 0 0 0 3.62Zm8.35 7.06v-3.44c0-2.06-1.1-3.02-2.57-3.02a2.22 2.22 0 0 0-2 1.09v-1h-3.13c.04.66 0 6.18 0 6.18h3.13v-3.45c0-.18.01-.36.07-.49a1.09 1.09 0 0 1 2.07.49v3.45Z" />
//             </svg>
//           </a>
//           <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               className="fill-current"
//               viewBox="0 0 24 24"
//             >
//               <path d="M24 4.56v14.91A4.54 4.54 0 0 1 19.44 24H4.56A4.54 4.54 0 0 1 0 19.47V4.56A4.54 4.54 0 0 1 4.56 0h14.91A4.54 4.54 0 0 1 24 4.56ZM7.09 19.47h3.13v-6.18H7.09Zm1.56-7.06a1.81 1.81 0 1 0 0-3.62 1.81 1.81 0 0 0 0 3.62Zm8.35 7.06v-3.44c0-2.06-1.1-3.02-2.57-3.02a2.22 2.22 0 0 0-2 1.09v-1h-3.13c.04.66 0 6.18 0 6.18h3.13v-3.45c0-.18.01-.36.07-.49a1.09 1.09 0 0 1 2.07.49v3.45Z" />
//             </svg>
//           </a>
//         </div>
//       </div>
//     </section>

//     <section className="footer p-2 bg-primary-content text-primary">
//       <div>
//         <span className="footer-title">Suscríbete</span>
//         <div className="form-control w-80">
//           <label className="label">
//             <span className="label-text">Ingresa tu correo electrónico</span>
//           </label>
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="tu correo electrónico"
//               className="input input-bordered w-full"
//             />
//             <button className="btn btn-primary absolute top-0 right-0 rounded-l-none">
//               Suscribirse
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="mt-10 text-center w-full">
//         <p>
//           © {new Date().getFullYear()} Comercial Vuelvan Caras, C.A. Todos los
//           derechos reservados.
//         </p>
//       </div>
//     </section>
//   </footer>
// );

// export default Footer;
