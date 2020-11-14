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

  getActividads(id: string): Observable<any> {
    return this.http.get(`${environment.URLAPI}/listaActividads/${id}`);
  }

  getActividad(id: string): Observable<any> {
    return this.http.get(`${environment.URLAPI}/actividads/${id}`);
  }

  deleteActividads(id: any): Observable<any> {
    return this.http.delete(`${environment.URLAPI}/actividads/${id}`);
  }

  createResourceVideo(activityVideo: any): Observable<any>{
    return this.http.post(`${environment.URLAPI}/videos`, activityVideo);
  }

  updateActivity(activity: any, id: number): Observable<any> {
    return this.http.put(
      `${environment.URLAPI}/actividads/${id}`,
      activity
    );
  }

}
