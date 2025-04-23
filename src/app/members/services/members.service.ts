import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../model/member.entity';
import { environment } from '../../../environments/environment';  // Asegúrate de usar la ruta correcta

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private apiUrl = `${environment.serverBasePath}/members`;  // Usa la URL base desde environment.ts

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',  // Si no hay token, no se incluye
    });
  }

  // Obtener todos los miembros
  getAllMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Crear un miembro
  create(member: Member): Observable<Member> {
    return this.http.post<Member>(this.apiUrl, member, { headers: this.getAuthHeaders() });
  }

  // Actualizar un miembro
  update(id: number, member: Member): Observable<Member> {
    return this.http.put<Member>(`${this.apiUrl}/${id}`, member, { headers: this.getAuthHeaders() });
  }

  // Eliminar un miembro
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
