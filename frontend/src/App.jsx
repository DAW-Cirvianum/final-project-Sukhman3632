import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import Notification from './components/Notification'
import { routes } from './routes'
import './App.css'

/**
 *  Main application root
 *
 * - Global NotificationProvider
 * - Global AuthProvider
 * - ErrorBoundary applied per route
 * - Centralized route configuration with protected routes
 */
function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Notification />

        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              {routes.map((route) => {
                const Element = route.element

                if (route.children) {
                  const routeElement = route.protected ? (
                    <ProtectedRoute>
                      <Element />
                    </ProtectedRoute>
                  ) : (
                    <Element />
                  );

                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={routeElement}
                    >
                      {route.children.map((child) => {
                        const ChildElement = child.element

                        return child.index ? (
                          <Route
                            key={`${route.path}-index`}
                            index
                            element={<ChildElement />}
                          />
                        ) : (
                          <Route
                            key={`${route.path}-${child.path}`}
                            path={child.path}
                            element={<ChildElement />}
                          />
                        )
                      })}
                    </Route>
                  )
                }

                const routeElement = route.protected ? (
                  <ProtectedRoute>
                    <Element />
                  </ProtectedRoute>
                ) : (
                  <Element />
                );

                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={routeElement}
                  />
                )
              })}
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </NotificationProvider>
  )
}

export default App
