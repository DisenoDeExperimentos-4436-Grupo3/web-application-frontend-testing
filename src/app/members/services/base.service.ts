import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';  // Importa la configuración de environment

@Injectable({
  providedIn: 'root',
})
export class BaseService<T> {
  protected basePath: string = `${environment.serverBasePath}/members`;  // URL base desde environment.ts

  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`, // Incluye el token si existe
    }),
  };

  constructor(protected http: HttpClient) {}

  // Manejo de errores
  protected handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage =
      error.error instanceof ErrorEvent
        ? `Error en la solicitud: ${error.error.message}`
        : `Código de error: ${error.status}, Mensaje: ${error.message}`;
    console.error('Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Crear un nuevo elemento
  create(item: T): Observable<T> {
    return this.http
      .post<T>(this.basePath, item, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Eliminar un elemento por ID
  delete(id: number | string): Observable<void> {
    return this.http
      .delete<void>(`${this.basePath}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Actualizar un elemento por ID
  update(id: number | string, item: T): Observable<T> {
    return this.http
      .put<T>(`${this.basePath}/${id}`, item, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Obtener todos los elementos
  getAll(): Observable<T[]> {
    return this.http
      .get<T[]>(this.basePath, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Obtener un elemento por ID
  getById(id: number | string): Observable<T> {
    return this.http
      .get<T>(`${this.basePath}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
