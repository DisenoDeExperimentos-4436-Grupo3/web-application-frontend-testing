import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Statistics } from '../model/statistic-entity/statistic.entity';
import { Member } from '../model/member-entity/member.entity';
import { Sprint } from '../model/statistic-entity/sprint.entity';
import { environment } from '../../../environments/environment';  // Importa el entorno

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiUrl = `${environment.serverBasePath}`;  // Corregido para usar template literal

  constructor(private http: HttpClient) {}

  getUserStories(userId: number): Observable<Statistics[]> {
    return this.http.get<Statistics[]>(`${this.apiUrl}/user-stories/user/${userId}`).pipe(
      map((stories) => {
        // Si las historias pueden tener status null, quita el filtro
        return stories;  // Eliminamos el filtro
      })
    );
  }

  loadUserStories(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user-stories/user/${userId}`).pipe(
      map((stories) =>
        stories.map((story) => ({
          id: story.id,
          status: story.status,
          title: story.title,
          sprintId: story.sprintId,
        }))
      )
    );
  }


  // Método para obtener los Sprints desde la API
  getSprints(): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(`${this.apiUrl}/sprints`);
  }

  //Metodo para obtener sprints por id de usuario
  getSprintsByUserId(userId: number): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(`${this.apiUrl}/sprints/user/${userId}`);
  }

  // Método para obtener los miembros por userId con token
  getMembers(userId: number): Observable<Member[]> {
    const token = localStorage.getItem('token');  // Obtén el token de localStorage

    // Asegúrate de que el token existe antes de agregarlo a las cabeceras
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.get<Member[]>(`${this.apiUrl}/members/user/${userId}`, { headers });
  }

  // Método para obtener los roles de los miembros por userId con token
  getMemberRoles(userId: number): Observable<string[]> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.get<Member[]>(`${this.apiUrl}/members/user/${userId}`, { headers }).pipe(
      map(members => members.map(member => member.role))
    );
  }
}
