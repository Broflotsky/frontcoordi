# Coordinadora Frontend

Frontend para la prueba técnica de Coordinadora, desarrollado con React, TypeScript, Vite y TailwindCSS.

## Tecnologías Utilizadas

- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router DOM
- Axios

## Características

- Sistema de autenticación con JWT
- Rutas protegidas basadas en roles
- Diseño responsivo con TailwindCSS
- Estructura modular para escalabilidad
- Cliente HTTP con interceptores para manejar tokens

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
├── context/          # Contextos de React (Auth)
├── hooks/            # Hooks personalizados
├── pages/            # Páginas de la aplicación
├── routes/           # Configuración de rutas
├── services/         # Servicios para interactuar con APIs
├── App.tsx           # Componente principal
└── main.tsx          # Punto de entrada
```

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## Variables de Entorno

Crea un archivo `.env` o `.env.local` en la raíz del proyecto con las siguientes variables:

```env
VITE_API_URL=http://localhost:3000/api
```


