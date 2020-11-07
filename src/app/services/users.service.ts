import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {


  constructor(private http: HttpClient) {}

  createUser(user: any): Observable<any> {
    return this.http.post(`${environment.URLAPI}/users`, user);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${environment.URLAPI}/users`);
  }

  getUser(id: string): Observable<any> {
    return this.http.get(`${environment.URLAPI}/users/${id}`);
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete(`${environment.URLAPI}/users/${id}`);
  }

  updateUser(user: any, id: string): Observable<any> {
    return this.http.put(`${environment.URLAPI}/users/${id}`, user);
  }

  createPerfilUser(user: any): Observable<any> {
    return this.http.post(`${environment.URLAPI}/perfil-usuarios`, user);
  }

}
