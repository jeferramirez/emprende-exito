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
}
