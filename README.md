# Acme Noticias

**Acme Noticias** es un proyecto de aplicación web para la asignatura de Mantenimiento y gestión del cambio en sistemas software de cuarto año usando [Create React App](https://github.com/facebook/create-react-app) como proyecto base.

El sistema está desarrollado con **React** para el frontend y **Express.js** + **MongoDB** para el backend.

## Alumnos

- Fernando García-Palomo Albarrán
- Antonio España González
- Andriy Yaskiv Yaskiv

## Tecnologías y Herramientas Utilizadas

### Backend

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JSON Web Token (JWT)** – para autenticación
- **Body-parser**
- **Nodemon** (desarrollo)

### Frontend

- **React**
- **React Router DOM**
- **React Scripts**
- **Testing Library**

## Requisitos Previos

- **Node.js** (v20.15.0)
- **MongoDB** (v8.0.9)

**El ejecutable de MongoDB (mongod.exe) debe de encontrarse en el PATH del sistema.**

## Cómo iniciar el proyecto

Sigue estos pasos paso a paso para ejecutar el proyecto correctamente:

### 1. Clona el repositorio

```bash
git clone https://github.com/SnowSzn/mgcss-acme-project.git
cd mgcss-acme-project
```

### 2. Instala dependencias del backend

Abre una terminal y dentro del proyecto del backend usa:

```bash
npm install
```

### 3. Instala dependencias del frontend

Abre una terminal y dentro del proyecto del frontend usa:

```bash
npm install
```

### 4.1 Inicia el proyecto desde VSCode

Si se usa Visual Studio Code, se puede usar Run and Debug (Ctrl+Shift+D) para ejecutar la tarea: `Backend & Frontend`, esta tarea ejecuta el backend y el frontend a la vez.

### 4.2 Inicia el proyecto manualmente

#### Inicia el backend

Ejecuta primero el backend con (dentro de la carpeta del backend):

```bash
node server.js
```

o usa nodemon, para que reinicie automáticamente el servidor si ocurren cambios:

```bash
nodemon server.js
```

#### Inicia el frontend

Luego en la carpeta del frontend, ejecuta:

```bash
npm start
```

Se abrirá una sesión de chrome en localhost con la aplicación web lista para usar.

### 5. Popula la base de datos (Opcional)

Popula la base de datos con el script `populate.js` que se encuentra dentro del proyecto del backend:

```js
node populate.js
```
