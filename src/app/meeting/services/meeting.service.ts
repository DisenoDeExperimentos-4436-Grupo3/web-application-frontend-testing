import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import {environment} from "../../../environments/environment";

import { Meeting } from "../model/meeting.entity";


@Injectable({
  providedIn: 'root'
})
export class MeetingService{
  basePath: string = `${environment.serverBasePath}`;
  resourceEndpoint: string = '/meetings';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`An error occurred: ${error.error.message}`);
    } else {
      console.log(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError(() => new Error('Something happened with the request; please try again later.'));
  }

  //crear un meeting
  create(userId: number, item: Meeting): Observable<Meeting> {
    const url= `${this.resourcePath()}/${userId}`;
    return this.http.post<Meeting>(url, item, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  //eliminar un meeting
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  //actualizar un meeting
  update(id: number, item: Meeting): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.resourcePath()}/${id}`, item, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  //obtener todos los meetings
  getAll(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(this.resourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Obtener un meeting por id
  getById(id: number): Observable<Meeting> {
    return this.http.get<Meeting>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Obtener meetings por id de usuario
  getByUserId(userId: number): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.resourcePath()}/user/${userId}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  private resourcePath(): string {
    return `${this.basePath}${this.resourceEndpoint}`;
  }


}
