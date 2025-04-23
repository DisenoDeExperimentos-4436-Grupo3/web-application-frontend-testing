import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService<T> {
  // Cambia la URL base al endpoint del servidor JSON
   basePath: string = 'http://localhost:8090/api/v1';
    resourceEndpoint: string = '/meetings'; // Ajusta este endpoint si es necesario

  private http: HttpClient = inject(HttpClient);

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
    })
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`An error occurred: ${error.error.message}`);
    } else {
      console.log(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError(() => new Error('Something went wrong with the request; please try again later.'));
  }

  // Método para crear un recurso
  create(item: any): Observable<T> {
    return this.http.post<T>('http://localhost:8090/api/v1/meetings', JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Método para eliminar un recurso
  // Método para eliminar un recurso
  delete(id: any): Observable<void> {
    return this.http.delete<void>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Método para actualizar un recurso
  update(id: any, item: any): Observable<T> {
    return this.http.put<T>(`${this.resourcePath()}/${id}`, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Método para obtener todos los recursos
  getAll(): Observable<T[]> { // Cambiado a T[] para reflejar una lista de recursos
    return this.http.get<T[]>(this.resourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  private resourcePath(): string {
    return `${this.basePath}${this.resourceEndpoint}`;
  }
}
