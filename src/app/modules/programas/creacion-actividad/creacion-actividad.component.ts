import { Router } from '@angular/router';
import { ActivityService } from './../../../services/activity.service';
import { GeneralService } from './../../../services/general.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-creacion-actividad',
  templateUrl: './creacion-actividad.component.html',
  styleUrls: ['./creacion-actividad.component.css']
})
export class CreacionActividadComponent implements OnInit {

  idLesson;
  activityForm: FormGroup;
  file: any;
  previewimage: any;

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
      nombre: ['', [Validators.required]],
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
          this.generalSrv.setNavigationValue(data.id);
          const formData = this.generalSrv.getFormdata(
            data.id,
            'imagen',
            this.file,
            'actividad',
            ''
          );
          return this.generalSrv.uploadFile(formData);
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

          setTimeout(() => {
            this.router.navigate(['home/gestion-programas']);
          }, 500);

        },
        (error) => {
          console.log(error);
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
    this.activityForm.get('imagen').setValue(file);
    this.file = file;
    this.previewimage = previewimage;
  }

}


