import { AppPage } from './../../../e2e/src/app.po';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
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

  createResourceVideo(activityVideo: any): Observable<any> {
    return this.http.post(`${environment.URLAPI}/videos`, activityVideo);
  }

  updateActivity(activity: any, id: number): Observable<any> {
    return this.http.put(`${environment.URLAPI}/actividads/${id}`, activity);
  }

  getVideos(id: string): Observable<any> {
    return this.http.get(`${environment.URLAPI}/listaVideos/${id}`);
  }

  deleteVideo(id: any): Observable<any> {
    return this.http.delete(`${environment.URLAPI}/videos/${id}`);
  }

  getDocs(id: string): Observable<any> {
    return this.http.get(`${environment.URLAPI}/listaDocs/${id}`);
  }

  getImagenes(id: string): Observable<any> {
    return this.http.get(`${environment.URLAPI}/listaImagenes/${id}`);
  }

  deleteDoc(id: any): Observable<any> {
    return this.http.delete(`${environment.URLAPI}/documentos/${id}`);
  }

  deleteImagen(id: any): Observable<any> {
    return this.http.delete(`${environment.URLAPI}/imagenes/${id}`);
  }

  deleteFile(id: any): Observable<any> {
    return this.http.delete(`${environment.URLAPI}/upload/files/${id}`);
  }
}
