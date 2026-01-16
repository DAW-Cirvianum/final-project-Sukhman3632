# Backend - Workshop Management System

API REST desenvolupada amb Laravel 11 per a la gestió de tallers mecànics.

## Estructura de Fitxers

```
backend/
├── app/
│   ├── Http/Controllers/Api/  # Controllers de l'API
│   └── Models/                # Models
│
├── database/
│   ├── migrations/            # Migracions de BD
│   └── seeders/               # Dades de prova
│
├── routes/
│   └── api.php               # Rutes de l'API
│
└── config/                   # Configuració
```

## API Endpoints

### Autenticació
```
POST   /api/register         - Registre d'usuari
POST   /api/login            - Login (retorna token)
POST   /api/logout           - Logout
GET    /api/user             - Obtenir usuari actual
```

### Clients (Admin only)
```
GET    /api/clients          - Llistar clients
POST   /api/clients          - Crear client
GET    /api/clients/{id}     - Veure client
PUT    /api/clients/{id}     - Actualitzar client
DELETE /api/clients/{id}     - Eliminar client
```

### Vehicles
```
GET    /api/vehicles         - Llistar vehicles
POST   /api/vehicles         - Crear vehicle
GET    /api/vehicles/{id}    - Veure vehicle
PUT    /api/vehicles/{id}    - Actualitzar vehicle
DELETE /api/vehicles/{id}    - Eliminar vehicle
```

### Services
```
GET    /api/services         - Llistar serveis
POST   /api/services         - Crear servei (admin)
GET    /api/services/{id}    - Veure servei
PUT    /api/services/{id}    - Actualitzar servei (admin)
DELETE /api/services/{id}    - Eliminar servei (admin)
```

### Appointments
```
GET    /api/appointments         - Llistar cites
POST   /api/appointments         - Crear cita
GET    /api/appointments/{id}    - Veure cita
PUT    /api/appointments/{id}    - Actualitzar cita
DELETE /api/appointments/{id}    - Eliminar cita
```

### Repair Orders (Admin only)
```
GET    /api/repair-orders        - Llistar ordres
POST   /api/repair-orders        - Crear ordre
GET    /api/repair-orders/{id}   - Veure ordre
PUT    /api/repair-orders/{id}   - Actualitzar ordre
DELETE /api/repair-orders/{id}   - Eliminar ordre
```


## Middleware i Permisos

### Rols
- **admin**: Accés complet
- **user**: Accés limitat (només les seves dades)


### Autorització
- Usuaris només veuen les seves cites i vehicles
- Admins veuen i gestionen totes les dades
- Comprovacions amb `isAdmin()` als controladors






