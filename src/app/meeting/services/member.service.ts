import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../model/member.entity'; // Asegúrate de que la ruta sea correcta
import { BaseService } from '../../meeting/services/base.service'; // Si necesitas extender de un base service

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = 'http://localhost:8090/api/v1/members';

  constructor(private http: HttpClient) { }

  // Obtener todos los miembros
  getAll(): Observable<Member[]> {
    return this.http.get<Member[]>('http://localhost:8090/api/v1/members');
  }

  // Actualizar miembros en bloque (recuerda que My JSON Server no soporta esta funcionalidad)
  updateMembers(members: Member[]): Observable<Member[]> {
    return this.http.put<Member[]>(`${this.apiUrl}/bulk-update`, members);
  }
}
