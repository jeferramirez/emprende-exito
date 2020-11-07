import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private http: HttpClient) {}

  createActivity(lesson: any): Observable<any> {
    return this.http.post(`${environment.URLAPI}/actividads`, lesson);
  }
}
