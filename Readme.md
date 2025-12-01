# 🎁 ListGist: Servicio Web para Gestión de Listas de Regalos [![GitHub Actions CI/CD Status](https://github.com/SirBeho/ListGift/actions/workflows/main.yml/badge.svg)](https://github.com/sirbeho/listgift/actions/workflows/main.yml)

<img src="https://simpleskill.icons.workers.dev/svg?i=react,vite,tailwindcss,php,mysql,framer,docker" height="40">





## Índice
- [Descripción del Proyecto](#descripción-del-proyecto)
- [Funcionalidades Principales](#funcionalidades-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Comandos por Entorno](#comandos-por-entorno)
- [Pruebas](#pruebas)
- [Documentación de la API](#documentación-de-la-api)
- [Contribución](#contribución)
- [Contacto](#contacto)

## ✨ Descripción y Arquitectura

El proyecto `ListGift` es una aplicación web full-stack diseñada para la **creación, gestión y compartición de listas de regalos**. Combina tecnologías modernas para el frontend y el backend, ofreciendo una experiencia de usuario intuitiva y una base robusta para la manipulación de datos.

El diseño se centra en una arquitectura cliente-servidor, con una clara separación entre la interfaz de usuario y la lógica de negocio, lo que garantiza escalabilidad, fiabilidad y facilidad de mantenimiento.

> **Frontend (React)**
Proporciona una interfaz de usuario intuitiva para crear, consultar, actualizar y eliminar listas de regalos y los ítems dentro de ellas.

> **Backend (PHP)**
Gestiona la lógica de negocio, la persistencia de datos de las listas e ítems en la base de datos, y el sistema de autenticación.

> **Base de Datos PostgreSQL/MySQL**
Almacena todos los datos relacionados con los usuarios, listas, ítems y roles, asegurando una gestión eficiente y segura de la información.

---

## 🎯 Funcionalidades Clave

### 1. Gestión de Recursos (CRUD)
* **Listas (`Lists`) e Ítems (`Items`):** Permite la creación, consulta, actualización y eliminación (CRUD) de listas de regalos y de los artículos asociados dentro de cada lista.
* **Gestión de Usuarios y Perfiles:** Manejo de la información de usuario y roles.

### 2. Seguridad y Acceso (Middlewares)
* **Autenticación JWT:** Utiliza **JSON Web Tokens (JWT)**, enviados por *cookies*, para autenticar a los usuarios. Los tokens son validados con la clave secreta `JWT_SECRET`.
* **Control de Acceso (RBAC):** Implementa middlewares para permisos basados en roles, para asegurar la gestión de recursos limitando el acceso a usuarios 'Admin', o al propietario directo del recurso (Control de Propiedad).

* **Validación:** Uso de la librería **Respect/Validation** (y la clase `Validator.php`) para asegurar la integridad de los datos de las peticiones.
* **CORS Configurado:** Permite peticiones seguras solo desde el dominio de producción (`https://listgift.free.nf`) y maneja credenciales (*cookies*).

### 3. Utilidades y Almacenamiento
* **API RESTful:** Estructura clara de endpoints usando el router **Bramus/Router**.
* **Gestión de Archivos:** La lógica de subida (`FileUpload.php`) está configurada para integrarse con **Google Drive**, validando archivos con un límite de 5MB.

---

## ⚙️ Tecnologías Utilizadas


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
<img src="https://spline.design/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fspline_logo.54f4e584.png&w=128&q=75" height="20"> Spline</span>**
  - Integra objetos 3D interactivos y dinámicos para mejorar la visualización de los artículos.


- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=axios" height="20"> Axios</span>**
  - Cliente HTTP para la comunicación con la API del backend.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=tailwindcss" height="20"> Tailwind CSS</span>**
  - Framework CSS utility-first para un estilizado rápido y consistente.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://www.creative-tim.com/blog/content/images/wordpress/2021/04/material-tailwind-logo-204x300.png" height="20" style="margin-inline: 3px;"> Material Tailwind</span>**
  - Biblioteca de componentes de UI.

---

### <span style="display: inline-flex; align-items: center;gap:10px"><img src="https://simpleskill.icons.workers.dev/svg?i=php" height="40"> Backend</span>

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=php" height="20"> PHP</span>**
  - Lenguaje de *scripting* del lado del servidor.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://cdn-icons-png.flaticon.com/512/5925/5925232.png"  height="20"> Illuminate/Database</span>**
  - ORM para operaciones de base de datos.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://cdn.worldvectorlogo.com/logos/jwt-3.svg" height="20"> PHP-JWT</span>**
  - Implementación de JWT para la autenticación.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="./frontend/public/pictures/image.png" height="20"> Bramus/Router</span>**
  - Librería de enrutamiento para PHP.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://icongr.am/clarity/check-circle.svg?size=20&color=10b981" height="20"> Respect/Validation</span>**
  - Librería para la validación de datos.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="./frontend/public/pictures/faker.png" height="20"> FakerPHP</span>**
  - Genera datos de prueba para desarrollo.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=dotenv" height="20"> vlucas/phpdotenv</span>**
  - Carga variables de entorno desde archivos `.env`.

---
### <span style="display: inline-flex; align-items: center;gap:10px"><img src="https://simpleskill.icons.workers.dev/svg?i=mysql" height="40"> Base de Datos</span>

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=mysql" height="20">  MySQL</span>**
  - Base de datos relacional para almacenar usuarios, listas, ítems y roles.

---

### <span style="display: inline-flex; align-items: center;gap:10px"><img src="https://ekiip.com/wp-content/uploads/2020/01/cropped-devops.png"  width="50"> Desarrollo y Operaciones - DevOps</span>


- **<span style="display: inline-flex; align-items: center;gap:10px">
<img src="https://simpleskill.icons.workers.dev/svg?i=github" height="20">  Git / GitHub</span>**
  - Control de versiones y plataforma de colaboración principal.

- **<span style="display: inline-flex; align-items: center;gap:10px">
<img src="https://simpleskill.icons.workers.dev/svg?i=githubactions" height="20">  GitHub Actions</span>**
  - Motor de Integración/Despliegue Continuo (CI/CD) que automatiza el *build* y la subida a InfinityFree.


- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://infinityfree-forum-uploads.s3.dualstack.eu-central-1.amazonaws.com/original/3X/a/a/aa031572455185b8e9ad7c1bc79f3816a1eb2a1b.png" height="20">  InfinityFree</span>**
  - Proveedor de alojamiento web gratuito (servidor FTP) para el despliegue.

- **<span style="display: inline-flex; align-items: center;gap:10px">
<img src="https://simpleskill.icons.workers.dev/svg?i=postman" height="20">Postman</span>**
  - Herramientas para testear, construir y documentar los endpoints de la API de PHP, incluyendo la gestión de tokens JWT y cookies.

- **<span style="display: inline-flex; align-items: center;gap:10px">
<img src="https://d1ngjctyujvjjy.cloudfront.net/badges/2022/10/24/devtools-circle.png" height="20">Browser DevTools</span>**
  - Herramientas de Desarrollador del navegador (Consola, Red, Componentes de React) fundamentales para la depuración del frontend..

- **<span style="display: inline-flex; align-items: center;gap:10px">
<img src="https://simpleskill.icons.workers.dev/svg?i=DBeaver" height="20">DBeaver</span>**
  -  Cliente de escritorio para desarrolladores para gestionar y visualizar la base de datos MySQL.

- **<span style="display: inline-flex; align-items: center;gap:10px">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/2048px-Visual_Studio_Code_1.35_icon.svg.png" height="20">  VS Code</span>**
  - Entorno de desarrollo principal.
<!-- 
- **<span style="display: inline-flex; align-items: center;gap:10px">
<img src="https://simpleskill.icons.workers.dev/svg?i=composer" height="20">  Composer</span>**
  -  Administrador de dependencias de PHP utilizado en el *backend*.
- **<span style="display: inline-flex; align-items: center;gap:10px">
<img src="https://simpleskill.icons.workers.dev/svg?i=npm" height="20">  npm</span>**
  - Administrador de paquetes de Node.js utilizado en el *frontend*.
- **<span style="display: inline-flex; align-items: center;gap:10px">
<img src="https://simpleskill.icons.workers.dev/svg?i=vite" height="20">  Vite</span>**
  - Herramienta de construcción rápida (*Build Tool*) para el *frontend*.
 -->
---



## 🚀 Despliegue y CI/CD Automatizado

El proyecto utiliza un pipeline de **Integración Continua / Despliegue Continuo (CI/CD)** con **GitHub Actions** para automatizar la subida a **InfinityFree (FTP)**. 
### 1. Despliegue Condicional
El *workflow* (`main.yml`) está configurado con **dos *jobs* separados** (`frontend_deploy` y `backend_deploy`), que se ejecutan **solo si hay cambios** en su respectiva carpeta (`frontend/` o `back/`).

### 2. Fases del CI/CD
| Componente | Comando de Build | Carpeta de Salida | Servidor (FTP Path) |
| :--- | :--- | :--- | :--- |
| **Frontend (Vite)** | `cd frontend && npm run build` | `frontend/dist/` | `/htdocs/` |
| **Backend (PHP)** | `cd back && composer install --no-dev` | `back/` | `/htdocs/back/` |

### 3. Configuración de Credenciales
Para que GitHub Actions pueda desplegar, debes configurar las siguientes variables como **Repository Secrets** en GitHub (Configuración > Secrets > Actions):

| Secret Name | Valor (Ej. Producción) | Propósito |
| :--- | :--- | :--- |
| `FTP_HOST` | `ftpupload.net` | Host del servidor FTP de InfinityFree. |
| `FTP_USERNAME` | `epiz_12345678` | Usuario FTP. |
| `FTP_PASSWORD` | `[...contraseña FTP...]` | Contraseña FTP. |

---

## 📝 Comandos por Entorno

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

## 🔬 Pruebas

Actualmente, este proyecto no cuenta con una sección de pruebas detallada en la información proporcionada. Si se implementan pruebas (unitarias, de integración, E2E), esta sección se actualizará para incluir instrucciones de ejecución y tipos de pruebas.

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, sigue los siguientes pasos:

1.  Haz un fork del proyecto.
2.  Crea una rama para tu nueva característica (`git checkout -b feature/nueva-caracteristica`).
3.  Realiza los cambios y haz commit (`git commit -m 'Agregada nueva característica'`).
4.  Envía un pull request.

<h2 style="font-size: 1.5rem; font-weight: 600; border-bottom: 2px solid #3182ce">🧑‍💻 Autor</h2>
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

