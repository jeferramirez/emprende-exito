import { Router } from '@angular/router';
import { ActivityService } from './../../../services/activity.service';
import { GeneralService } from './../../../services/general.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs/operators';
import { of, combineLatest, identity } from 'rxjs';

@Component({
  selector: 'app-creacion-actividad',
  templateUrl: './creacion-actividad.component.html',
  styleUrls: ['./creacion-actividad.component.css'],
})
export class CreacionActividadComponent implements OnInit {
  idLesson;
  activityForm: FormGroup;
  file: any;
  previewimage: any;
  recursos = [{ URL: '', titulo: '' }];
  recursoVideo;
  nameVideo;
  recursoDOC;
  nameDOC;
  filesIMG = [];
  filesDOC = [];
  idActivity;
  indButton = true;

  constructor(
    private activitySrv: ActivityService,
    private fb: FormBuilder,
    private generalSrv: GeneralService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idLesson = this.generalSrv.getNavigationValue();
    this.createActivityForm();
  }

  createActivityForm(): void {
    this.activityForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z 0-9 áéíóú ÁÉÍÓÚ ñÑ]*$')]],
      descripcion: ['', [Validators.required]],
      imagen: ['', [Validators.required]],
    });
  }

  createActivity(): void {
    const lesson = this.activityForm.value;
    lesson.estado = true;
    lesson.leccion = this.idLesson;
    this.activitySrv
      .createActivity(lesson)
      .pipe(
        switchMap((data) => {
          this.idActivity = data.id;
          const formData = this.generalSrv.getFormdata(
            data.id,
            'imagen',
            this.file,
            'actividad',
            ''
          );
          return this.generalSrv.uploadFile(formData);
        }),
        switchMap((data) => {
          return combineLatest(this.insertURL(this.idActivity));
        })
      )
      .subscribe(
        (resp) => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Actividad creada.',
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });

          this.uploadFilesIMG(this.idActivity);
          this.uploadFilesDOC(this.idActivity);
          this.indButton = false;

          setTimeout(() => {
            this.router.navigate(['home/gestion-programas']);
          }, 500);
        },
        (error) => {
          Swal.fire({
            title: '¡Error!',
            text: 'Actividad no creada.',
            icon: 'warning',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        }
      );
  }

  async onFileSelect(event): Promise<any> {
    const { file, previewimage } = await this.generalSrv.onFileSelect(event);
    this.activityForm.get('imagen').setValue('2');
    this.file = file;
    this.previewimage = previewimage;
  }

  addRow(): void {
    this.recursos.push({ URL: '', titulo: '' });
  }

  addFileDOC(): void {
    document.getElementById('multiSelectDOC').click();
  }

  addFileIMG(): void {
    document.getElementById('multiSelectIMG').click();
  }

  onChangeIMG(e: any): void {
    const files = [];
    const arrayFile = e.target.files;
    for (const iterator of arrayFile) {
      files.push(iterator.name);
      this.filesIMG.push(iterator);
    }
    this.nameVideo = files.join(' , ');
  }

  onChangeDOC(e: any): void {
    const files = [];
    const arrayFile = e.target.files;
    for (const iterator of arrayFile) {
      files.push(iterator.name);
      this.filesDOC.push(iterator);
    }
    this.nameDOC = files.join(' , ');
  }

  insertURL(id: any): any {
    return this.recursos.map((recurso) => {
      if (recurso.titulo && recurso.URL) {
        return this.activitySrv.createResourceVideo({
          ...recurso,
          actividad: id,
        });
      }
      return of({});
    });
  }

  uploadFilesIMG(id: any): any {
    return this.filesIMG.map((file) => {
      this.generalSrv
        .createFileIMG({ actividad: id })
        .pipe(
          switchMap((data) => {
            const formData = this.generalSrv.getFormdata(
              data.id,
              'imagen',
              file,
              'imagenes',
              ''
            );
            return this.generalSrv.uploadFile(formData);
          })
        )
        .subscribe(
          (resp) => {},
          (error) => {
            console.log(error);
          }
        );
    });
  }

  uploadFilesDOC(id: any): any {
    return this.filesDOC.map((file) => {
      this.generalSrv
        .createFileDOC({ actividad: id })
        .pipe(
          switchMap((data) => {
            const formData = this.generalSrv.getFormdata(
              data.id,
              'imagen',
              file,
              'documento',
              ''
            );
            return this.generalSrv.uploadFile(formData);
          })
        )
        .subscribe(
          (resp) => {},
          (error) => {
            console.log(error);
          }
        );
    });
  }
}
