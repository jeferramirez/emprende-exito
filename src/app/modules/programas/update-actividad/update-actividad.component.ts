import { ProgressService } from './../../../services/progress.service';
import { ModalComponent } from './../modal/modal.component';
import { switchMap } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';
import { ActivityService } from './../../../services/activity.service';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from './../../../services/general.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-update-actividad',
  templateUrl: './update-actividad.component.html',
  styleUrls: ['./update-actividad.component.css'],
})
export class UpdateActividadComponent implements OnInit {
  @ViewChild(ModalComponent) modalComponent;

  activityForm: FormGroup;
  file: any;
  previewimage: any;
  activity;
  urlImage;
  idActivity;
  videos = [];
  documentos = [];
  imagenes = [];
  urlAPI = environment.URLAPI;
  rol;
  dialogRef;
  user;

  constructor(
    private fb: FormBuilder,
    private generalSrv: GeneralService,
    private route: ActivatedRoute,
    private activitySrv: ActivityService,
    public dialog: MatDialog,
    private progressSrv: ProgressService
  ) {}

  ngOnInit(): void {
    this.idActivity = this.route.snapshot.params['id'];
    this.getActivity(this.idActivity);
    this.initForm();
    this.getVideos(this.idActivity);
    this.getDocs(this.idActivity);
    this.getIMG(this.idActivity);
    this.rol = this.generalSrv.getRolUser();
    this.user = this.generalSrv.getUser();
    this.haspermissions();
  }

  openDialog(video, imagen, file): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        id: this.idActivity,
        showVideos: video,
        showImages: imagen,
        showFiles: file,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      setTimeout(() => {
        this.getVideos(this.idActivity);
        this.getIMG(this.idActivity);
        this.getDocs(this.idActivity);
      }, 1500);
    });
  }

  modalVideo(id, titulo, URL): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        id: this.idActivity,
        showVideos: false,
        showImages: false,
        showFiles: false,
        showUpdateVideo: true,
        titulo,
        URL,
        idVideo: id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      setTimeout(() => {
        this.getVideos(this.idActivity);
      }, 1500);
    });
  }

  initForm(): void {
    this.activityForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z áéíóú ÁÉÍÓÚ ñÑ]*$')]],
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
    Swal.fire({
      title: '¿Está seguro de actualizar la actividad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
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
                title: '¡Error!',
                text: 'No se logró actualizar la actividad.',
                icon: 'error',
                confirmButtonText: 'Ok',
                timer: 3000,
              });
            }
          );
      }
    });
  }

  getVideos(id: any): void {
    this.activitySrv.getVideos(id).subscribe((resp) => {
      this.videos = resp;
    });
  }

  getDocs(id: any): void {
    this.activitySrv.getDocs(id).subscribe((resp) => {
      this.documentos = resp;
    });
  }

  getIMG(id: any): void {
    this.activitySrv.getImagenes(id).subscribe((resp) => {
      this.imagenes = resp;
    });
  }

  deleteDoc(id: number, idFile: number): void {
    Swal.fire({
      title: '¿Está seguro de eliminar el archivo?',
      text:
        'Esta acción no se puede revertir y borrará todo lo relacionado al mismo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.progressSrv
          .deleteProgress({ idRecurso: id, campo: 'documento' })
          .subscribe();
        this.activitySrv
          .deleteDoc(id)
          .pipe(
            switchMap((data) => {
              return this.activitySrv.deleteFile(idFile);
            })
          )
          .subscribe(
            (resp) => {
              Swal.fire(
                '¡Éxito!',
                'El archivo se eliminó éxitosamente.',
                'success'
              );
              this.getDocs(this.idActivity);
            },
            (error) => {
              Swal.fire('¡Error!', 'El archivo no se logró eliminar.', 'error');
            }
          );
      }
    });
  }

  deleteImagen(id: number, idFile: number): void {
    Swal.fire({
      title: '¿Está seguro de eliminar la imagen?',
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
        this.progressSrv
          .deleteProgress({ idRecurso: id, campo: 'imagene' })
          .subscribe();
        this.activitySrv
          .deleteImagen(id)
          .pipe(
            switchMap((data) => {
              return this.activitySrv.deleteFile(idFile);
            })
          )
          .subscribe(
            (resp) => {
              Swal.fire(
                '¡Éxito!',
                'La imagen se eliminó éxitosamente.',
                'success'
              );
              this.getIMG(this.idActivity);
            },
            (error) => {
              Swal.fire('¡Error!', 'La imagen no se logró eliminar.', 'error');
            }
          );
      }
    });
  }

  deleteVideo(id: number): void {
    Swal.fire({
      title: '¿Está seguro de eliminar el vídeo?',
      text:
        'Esta acción no se puede revertir y borrará todo lo relacionado al mismo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.progressSrv
          .deleteProgress({ idRecurso: id, campo: 'video' })
          .subscribe();
        this.activitySrv.deleteVideo(id).subscribe(
          (resp) => {
            Swal.fire(
              '¡Éxito!',
              'El vídeo se eliminó éxitosamente.',
              'success'
            );
            this.getVideos(this.idActivity);
          },
          (error) => {
            Swal.fire('¡Error!', 'El vídeo no se logró eliminar.', 'error');
          }
        );
      }
    });
  }

  haspermissions(): void {
    if (this.rol === 'Emprendedor') {
      this.activityForm.get('nombre').disable();
      this.activityForm.get('descripcion').disable();
    }
  }

  setRecurso(idRecurso, campo): void {
    this.progressSrv
      .setRecurso({ idUser: this.user.user.id, idRecurso, campo })
      .subscribe();
  }
}
