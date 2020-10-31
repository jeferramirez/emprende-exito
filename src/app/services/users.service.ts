import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  headerDict = {
    'Content-Type': 'multipart/form-data',
  };

  requestOptions = {
    headers: new Headers(this.headerDict),
  };

  constructor(private http: HttpClient) {}

  createUser(user: any): Observable<any> {
    return this.http.post(`${environment.URLAPI}/users`, user);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${environment.URLAPI}/users`);
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete(`${environment.URLAPI}/users/${id}`);
  }

  updateUser(user: any): Observable<any> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': undefined,
    });

    const request = new XMLHttpRequest();
    request.open('POST', `${environment.URLAPI}/users`);

    request.send(user);
    return this.http.put(`${environment.URLAPI}/users`, user, {
      headers: httpHeaders,
    });
  }

  createPerfilUser(user: any): Observable<any> {
    return this.http.post(`${environment.URLAPI}/perfil-usuarios`, user);
  }

}
