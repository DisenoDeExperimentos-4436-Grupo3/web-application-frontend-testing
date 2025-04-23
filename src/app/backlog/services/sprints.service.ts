import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { Sprint } from '../model/sprint.entity';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SprintService {
  basePath: string = `${environment.serverBasePath}`;
  resourceEndpoint: string = '/sprints';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {}

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`An error occurred: ${error.error.message}`);
    } else {
      console.log(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError(() => new Error('Something happened with the request; please try again later.'));
  }

  // Crear recurso
  create(item: Sprint): Observable<Sprint> {
    return this.http.post<Sprint>(this.resourcePath(), item, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Eliminar recurso
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Actualizar recurso
  update(id: number, item: Sprint): Observable<Sprint> {
    return this.http.put<Sprint>(`${this.resourcePath()}/${id}`, item, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Obtener todos los recursos
  getAll(): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(this.resourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Obtener Sprint Activo
  getActiveSprint(): Observable<Sprint | null> {
    return this.http.get<Sprint[]>(this.resourcePath(), this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError),
      map((sprints: Sprint[]) => sprints.find(sprint => sprint.status === 'STARTED') || null)
    );
  }

  // Verificar si hay un Sprint activo
  hasActiveSprint(): Observable<boolean> {
    return this.http.get<Sprint[]>(this.resourcePath(), this.httpOptions).pipe(
      map((sprints: Sprint[]) => sprints.some(sprint => sprint.status === 'STARTED')),
      catchError(this.handleError)
    );
  }

  private resourcePath(): string {
    return `${this.basePath}${this.resourceEndpoint}`;
  }


}
