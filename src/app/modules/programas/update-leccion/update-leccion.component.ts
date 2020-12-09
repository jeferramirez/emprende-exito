import { ActivityService } from './../../../services/activity.service';
import { switchMap } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';
import { LessonService } from './../../../services/lesson.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from './../../../services/general.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-leccion',
  templateUrl: './update-leccion.component.html',
  styleUrls: ['./update-leccion.component.css'],
})
export class UpdateLeccionComponent implements OnInit {
  lessonForm: FormGroup;
  file: any;
  previewimage: any;
  lesson;
  urlImage;
  activitys = [];
  idLesson;
  rol;

  constructor(
    private fb: FormBuilder,
    private generalSrv: GeneralService,
    private route: ActivatedRoute,
    private lessonSrv: LessonService,
    private activitySrv: ActivityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idLesson = this.route.snapshot.params['id'];
    this.generalSrv.setNavigationValue(this.idLesson);
    this.getLesson(this.idLesson);
    this.initForm();
    this.rol = this.generalSrv.getRolUser();
    this.haspermissions();
  }

  initForm(): void {
    this.lessonForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z 0-9 áéíóú ÁÉÍÓÚ ñÑ]*$')]],
      descripcion: ['', [Validators.required]],
    });
  }
  getLesson(id: any): void {
    this.lessonSrv.getLesson(id).subscribe((resp) => {
      this.lesson = resp;
      this.urlImage = `${environment.URLAPI}` + resp.imagen.url;
      this.lessonForm.patchValue(this.lesson);
      this.getActivitys(this.idLesson);
    });
  }

  async onFileSelect(event): Promise<any> {
    const { file, previewimage } = await this.generalSrv.onFileSelect(event);
    this.file = file;
    this.previewimage = previewimage;

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    const formData = this.generalSrv.getFormdata(
      this.lesson.id,
      'imagen',
      this.file,
      'leccion',
      ''
    );
    return this.generalSrv.uploadFile(formData).subscribe(
      (resp) => {
        Toast.fire({
          icon: 'success',
          title: 'Se actualizó la imagen',
        });

        this.lesson.imagen.url = resp[0].url;
      },
      (error) => {
        Toast.fire({
          icon: 'error',
          title: 'No se actualizó la imagen',
        });
      }
    );
  }

  updateLesson(): void {
    Swal.fire({
      title: '¿Está seguro de actualizar la lección?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.lessonSrv
          .updateLesson(this.lessonForm.value, this.lesson.id)
          .subscribe(
            (resp) => {
              Swal.fire({
                title: '¡Éxito!',
                text: 'Lección actualizada.',
                icon: 'success',
                confirmButtonText: 'Ok',
                timer: 3000,
              });
            },
            (error) => {
              Swal.fire({
                title: 'Error!',
                text: 'No se logró actualizar la lección.',
                icon: 'error',
                confirmButtonText: 'Ok',
                timer: 3000,
              });
            }
          );
      }
    });
  }

  getActivitys(id: any): void {
    this.activitySrv.getActividads(id).subscribe((resp) => {
      this.activitys = resp;
    });
  }

  getFile(url: any): string {
    return `${environment.URLAPI}${url}`;
  }

  navigateActivity(item): void {
    this.router.navigate(['home/update-actividad/', item.id]);
  }

  deleteActivity(id: any): void {
    Swal.fire({
      title: '¿Está seguro de eliminar la actividad?',
      text:
        'Esta acción no se puede revertir y borrará todo lo relacionado a la misma.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.activitySrv.deleteActividads(id).subscribe(
          (resp) => {
            Swal.fire(
              '¡Éxito!',
              'La actividad se eliminó éxitosamente.',
              'success'
            );

            setTimeout(() => {
              this.getActivitys(this.idLesson);
            }, 1400);
          },
          (error) => {
            Swal.fire('¡Error!', 'La actividad no se logró eliminar.', 'error');
          }
        );
      }
    });
  }

  haspermissions(): void {
    if (this.rol === 'Emprendedor') {
      this.lessonForm.get('nombre').disable();
      this.lessonForm.get('descripcion').disable();
    }
  }
}
