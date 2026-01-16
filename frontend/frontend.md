# Frontend - Workshop Management System

Aplicació React per a la gestió de taller mecànic.

## Estructura de Fitxers

```
frontend/src/
├── components/          # Components reutilitzables (Navbar, Modals, Notifications)
├── context/            # Context API (Auth, Notifications)
├── crud/               # APIs per a operacions CRUD
├── hooks/              # Custom hooks (useAuth, useNotification)
├── layout/             # Layouts de l'aplicació
├── pages/              # Pàgines
│   ├── auth/              # Login, Register
│   └── dashboard/         # Appointments, Clients, Vehicles, Services, Repair Orders
├── routes/             # Definició de rutes
├── services/           # Configuració d'API
└── styles/             # Estils globals
```



## Components Principals

### Context API
- **AuthContext**: Gestió d'autenticació i usuari actual
- **NotificationContext**: Sistema de notificacions
### Hooks Personalitzats
- `useAuth()`: Accés a l'estat d'autenticació
- `useNotification()`: Mostrar notificacions (success/error)

### Estructura de Pàgines Dashboard
Cada secció CRUD segueix el mateix patró:
- **Main Component**: Lògica principal i estat
- **Filters**: Formulari de filtres de cerca
- **Form**: Formulari de creació/edició
- **List**: Llistat de resultats

## Configuració

### Autenticació
- Token guardat a `localStorage`
- Interceptor d'Axios per afegir token a requests
- Redirecció automàtica si no autenticat

## Funcionalitats per Rol

### Admin
- Accés complet a tot el dashboard
- Creació/edició/eliminació de tots els recursos
- Vista d'estadístiques

### User
- Accés limitat a: Appointments, Vehicles, Services
- No pot veure Clients ni Repair Orders
