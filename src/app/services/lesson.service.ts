import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  constructor(private http: HttpClient) {}

  createLesson(lesson: any): Observable<any> {
    return this.http.post(`${environment.URLAPI}/leccions`, lesson);
  }

  getLessons(id: string): Observable<any> {
    return this.http.get(`${environment.URLAPI}/listaLeccions/${id}`);
  }

  getLesson(id: any): Observable<any> {
    return this.http.get(`${environment.URLAPI}/leccions/${id}`);
  }

  deleteLesson(id: any): Observable<any> {
    return this.http.delete(`${environment.URLAPI}/deleteLesson/${id}`);
  }

  updateLesson(lesson: any, id: number): Observable<any> {
    return this.http.put(
      `${environment.URLAPI}/leccions/${id}`,
      lesson
    );
  }
}
