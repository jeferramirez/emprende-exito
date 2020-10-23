import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }



  createUser( user: any): Observable<any> {
    return this.http.post( `${environment.URLAPI}/users`, user);
  }


  getUsers(): Observable<any>  {
    return this.http.get(`${environment.URLAPI}/users`);
  }
}
