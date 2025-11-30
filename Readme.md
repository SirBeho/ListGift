# Servicio Web para Gestión de Listas de Regalos

<img src="https://simpleskill.icons.workers.dev/svg?i=react,vite,tailwindcss,php,mysql,docker" height="40">

## Índice
- [Descripción del Proyecto](#descripción-del-proyecto)
- [Funcionalidades Principales](#funcionalidades-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Comandos por Entorno](#comandos-por-entorno)
- [Pruebas](#pruebas)
- [Documentación de la API](#documentación-de-la-api)
- [Contribución](#contribución)
- [Contacto](#contacto)

## Descripción del Proyecto

El proyecto `ListGift` es una aplicación web full-stack diseñada para la **creación, gestión y compartición de listas de regalos**. Combina tecnologías modernas para el frontend y el backend, ofreciendo una experiencia de usuario intuitiva y una base robusta para la manipulación de datos.

El diseño se centra en una arquitectura cliente-servidor, con una clara separación entre la interfaz de usuario y la lógica de negocio, lo que garantiza escalabilidad, fiabilidad y facilidad de mantenimiento.

> **Frontend (React)**
Proporciona una interfaz de usuario intuitiva para crear, consultar, actualizar y eliminar listas de regalos y los ítems dentro de ellas.

> **Backend (PHP)**
Gestiona la lógica de negocio, la persistencia de datos de las listas e ítems en la base de datos, y el sistema de autenticación.

> **Base de Datos PostgreSQL/MySQL**
Almacena todos los datos relacionados con los usuarios, listas, ítems y roles, asegurando una gestión eficiente y segura de la información.

### Funcionalidades Principales
---
- **Gestión de Recursos CRUD sobre `Lists` e `Items`**:
  - Crear, consultar, actualizar y eliminar listas de regalos.
  - Crear, consultar, actualizar y eliminar ítems dentro de cada lista.
  - Gestión de usuarios y perfiles.

---
- **Sistema de Autenticación JWT**:
  - Autenticación segura mediante JSON Web Tokens (JWT).
  - Gestión del estado de autenticación en el frontend y verificación de credenciales en el backend.

---
- **Separación Cliente-Servidor**:
  - Arquitectura clara con frontend en React y backend en PHP para una mayor modularidad y escalabilidad.

---

## Tecnologías Utilizadas

### <span style="display: inline-flex; align-items: center;gap:10px"><img src="https://simpleskill.icons.workers.dev/svg?i=react" height="40"> Frontend</span>

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=react" height="20"> React</span>**
  - Biblioteca JavaScript principal para construir la interfaz de usuario.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=reactrouter" height="20"> React Router</span>**
  - Maneja la navegación y el enrutamiento en la aplicación.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=framer" height="20"> Framer Motion</span>**
  - Proporciona transiciones y animaciones fluidas entre páginas.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=axios" height="20"> Axios</span>**
  - Cliente HTTP para la comunicación con la API del backend.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=tailwindcss" height="20"> Tailwind CSS</span>**
  - Framework CSS utility-first para un estilizado rápido y consistente.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=materialui" height="20"> Material Tailwind</span>**
  - Biblioteca de componentes de UI.

---

### <span style="display: inline-flex; align-items: center;gap:10px"><img src="https://simpleskill.icons.workers.dev/svg?i=php" height="40"> Backend</span>

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=php" height="20"> PHP</span>**
  - Lenguaje de *scripting* del lado del servidor.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=illuminate" height="20"> Illuminate/Database</span>**
  - ORM para operaciones de base de datos.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=jwt" height="20"> Firebase/PHP-JWT</span>**
  - Implementación de JWT para la autenticación.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=router" height="20"> Bramus/Router</span>**
  - Librería de enrutamiento para PHP.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=validation" height="20"> Respect/Validation</span>**
  - Librería para la validación de datos.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=faker" height="20"> FakerPHP</span>**
  - Genera datos de prueba para desarrollo.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=dotenv" height="20"> vlucas/phpdotenv</span>**
  - Carga variables de entorno desde archivos `.env`.

---
### <span style="display: inline-flex; align-items: center;gap:10px"><img src="https://simpleskill.icons.workers.dev/svg?i=postgresql" height="40"> Base de Datos</span>

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=postgresql" height="20"> PostgreSQL / MySQL</span>**
  - Base de datos relacional para almacenar usuarios, listas, ítems y roles.

---

## Comandos por Entorno

### **Frontend (Vite + React)**

| **Comando** | **Descripción** |
|-----------------|----------------------------------------------------|
| `npm run dev`   | Inicia el servidor de desarrollo del frontend. |
| `npm run build` | Compila el proyecto frontend para producción. |
| `npm run lint`  | Ejecuta el linter (ESLint) en los archivos JS/JSX. |
| `npm run preview` | Previsualiza la construcción de producción. |

---

### **Backend (PHP)**

| **Comando** | **Descripción** |
|-----------------------|-------------------------------------------------|
| `composer start`      | Inicia el servidor de desarrollo PHP (en `localhost:8000`). |
| `composer migrate`    | Ejecuta las migraciones de la base de datos (hacia arriba). |
| `composer migrate:db` | Comando específico para migración de la base de datos (según script). |
| `composer migrate:down` | Revierte la última migración de la base de datos. |
| `composer migrate:refresh` | Revierte todas las migraciones y las vuelve a ejecutar. |
| `composer seed`       | Ejecuta los *seeders* para poblar la base de datos con datos de prueba. |
| `composer seed:refresh` | Revierte los *seeders* y los vuelve a ejecutar. |
| `composer migrate:full` | Ejecuta `migrate:refresh` seguido de `seed`. |

---

## Pruebas

Actualmente, este proyecto no cuenta con una sección de pruebas detallada en la información proporcionada. Si se implementan pruebas (unitarias, de integración, E2E), esta sección se actualizará para incluir instrucciones de ejecución y tipos de pruebas.

---

## Documentación de la API

La API del backend está construida con PHP. Los puntos finales (endpoints) y la forma de interactuar con ellos se describirán aquí una vez que se defina la interfaz API (ej. REST, GraphQL). Por ahora, el proyecto se enfoca en la gestión de `User`, `List`, `Item` y `Role`.

---

## Contribución

Las contribuciones son bienvenidas. Por favor, sigue los siguientes pasos:

1.  Haz un fork del proyecto.
2.  Crea una rama para tu nueva característica (`git checkout -b feature/nueva-caracteristica`).
3.  Realiza los cambios y haz commit (`git commit -m 'Agregada nueva característica'`).
4.  Envía un pull request.

<h2 style="font-size: 1.5rem; font-weight: 600; border-bottom: 2px solid #3182ce">Autor</h2>
 <table >
                <tbody id="simbolo">
                <tr><td style="display: flex;"><div style="width: 10rem; height: 13rem; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" ><img src="https://raw.githubusercontent.com/SirBeho/compilador/refs/heads/master/img/ouner.jpg" alt="Descripción de la imagen"  style="width: 26rem; height: 13rem; object-fit: cover;border-radius: 0.5rem;"/></div></td><td> 
                
<p style="display: block; font-size: 2rem; font-weight: 700;">Ing. Benjamin Tavarez</p>         

<p style="margin-top: 0.5rem; font-size: 1rem;">Este proyecto fue desarrollado por <a href="https://github.com/SirBeho" style="color: #3182ce; text-decoration: underline;">Benjamin Tavarez</a> en una iniciativa propia a la falta de un espacio para lista personalizadas de obsequios. Todos los derechos reservados</p>


<p style="margin-top: 0.25rem; font-size: 0.875rem;">Si tienes alguna pregunta o comentario sobre este proyecto, no dudes en ponerte en contacto conmigo a través de <a href="mailto:benjamin.tavarez.98@gmail.com" style="color: #3182ce; text-decoration: underline;">benjamin.tavarez.98@gmail.com</a> o en <a href="https://www.linkedin.com/in/benjamin-tavarez-cruceta-052aa623b/" style="color: #3182ce; text-decoration: underline;">LinkedIn</a>.</p>
</td>         
  </tr>
  </tbody>
</table>
