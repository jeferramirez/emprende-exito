import { environment } from './../../../../environments/environment';
import { ActivityService } from './../../../services/activity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from './../../../services/general.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-actividad',
  templateUrl: './update-actividad.component.html',
  styleUrls: ['./update-actividad.component.css'],
})
export class UpdateActividadComponent implements OnInit {
  activityForm: FormGroup;
  file: any;
  previewimage: any;
  activity;
  urlImage;
  idActivity;

  constructor(
    private fb: FormBuilder,
    private generalSrv: GeneralService,
    private route: ActivatedRoute,
    private activitySrv: ActivityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idActivity = this.route.snapshot.params['id'];
    this.getActivity(this.idActivity);
    this.initForm();
  }

  initForm(): void {
    this.activityForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
    });
  }

  getFile(url: any): string {
    return `${environment.URLAPI}${url}`;
  }

  getActivity(id: any): void {
    this.activitySrv.getActividad(id).subscribe((resp) => {
      this.activity = resp;
      this.urlImage = `${environment.URLAPI}` + resp.imagen.url;
      this.activityForm.patchValue(this.activity);
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
      this.activity.id,
      'imagen',
      this.file,
      'actividad',
      ''
    );
    return this.generalSrv.uploadFile(formData).subscribe(
      (resp) => {
        Toast.fire({
          icon: 'success',
          title: 'Se actualizó la imagen',
        });

        this.activity.imagen.url = resp[0].url;
      },
      (error) => {
        Toast.fire({
          icon: 'error',
          title: 'No se actualizó la imagen',
        });
      }
    );
  }

  updateActivity(): void {
    this.activitySrv
      .updateActivity(this.activityForm.value, this.activity.id)
      .subscribe(
        (resp) => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Actividad actualizada.',
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'No se logró actualizar la actividad.',
            icon: 'error',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        }
      );
  }
}
