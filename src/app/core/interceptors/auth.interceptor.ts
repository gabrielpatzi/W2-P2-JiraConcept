import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtenemos el token guardado por el AuthService
  const token = localStorage.getItem('token');

  // Si hay token, clonamos la petición y le añadimos el header
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Mandamos la petición modificada
    return next(authReq);
  }

  // Si no hay token (ej. al hacer login/registro), la mandamos tal cual
  return next(req);
};
