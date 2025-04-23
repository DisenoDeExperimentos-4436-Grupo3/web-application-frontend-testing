import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';

import { Task } from '../model/task.entity';
import { UserStory } from '../model/user-story.entity';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserStoriesService {
  basePath: string = `${environment.serverBasePath}`;
  resourceEndpoint: string = '/user-stories';

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
  create(item: any): Observable<UserStory> {
    item.sprintId= 0;
    return this.http.post<UserStory>(this.resourcePath(), item, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Eliminar recurso
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Actualizar recurso
  update(id: number, item: any): Observable<UserStory> {
    return this.http.put<UserStory>(`${this.resourcePath()}/${id}`, item, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Obtener todos los recursos
  getAll(): Observable<UserStory[]> {
    return this.http.get<UserStory[]>(this.resourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Agregar tarea a User Story
  addTask(userStoryId: number, task: Task): Observable<UserStory> {
    return this.http.post<UserStory>(
      `${this.resourcePath()}/${userStoryId}/tasks`,
      task,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  // Actualizar tarea en User Story
  updateTask(userStoryId: number, taskId: number, updatedData: any): Observable<any> {
    return this.http.put(
      `${this.resourcePath()}/${userStoryId}/tasks/${taskId}`,
      updatedData,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  //eliminar task
  deleteTask(userStoryId: number, taskId: number): Observable<any> {
    return this.http.delete(
      `${this.resourcePath()}/${userStoryId}/tasks/${taskId}`,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  private resourcePath(): string {
    return `${this.basePath}${this.resourceEndpoint}`;
  }
}
