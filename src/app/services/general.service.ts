import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  file: any;
  previewimage: any;
  varValue: any;

  constructor(private http: HttpClient) {}

  getFormdata(id, nombre, file, modelo, source): FormData {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('refId', id);
    formData.append('ref', modelo);
    formData.append('source', source);
    formData.append('field', nombre);

    return formData;
  }

  filReader(file): Promise<any> {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = resolve; // CHANGE to whatever function you want which would eventually call resolve
      fr.readAsDataURL(file);
    });
  }

  async onFileSelect(event): Promise<any> {
    console.log(event);
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      const reader = await this.filReader(this.file);
      return { file: this.file, previewimage: reader.target.result };
    }
  }

  uploadFile(file: any): Observable<any> {
    return this.http.post(`${environment.URLAPI}/upload`, file);
  }

  async getFile(file): Promise<any> {
    const reader = await this.filReader(file);
    return { previewimage: reader.target.result };
  }

  getNavigationValue(): any {
    return this.varValue;
  }

  setNavigationValue(valor: any): any {
    this.varValue = valor;
  }
}
