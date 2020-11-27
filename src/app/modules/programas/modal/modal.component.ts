import { switchMap } from 'rxjs/operators';
import { GeneralService } from './../../../services/general.service';
import { forkJoin } from 'rxjs';
import { ActivityService } from './../../../services/activity.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { SeguimientoService } from '../../../services/seguimiento.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  videos = [{ URL: '', titulo: '' }];
  nameIMG;
  filesIMG = [];
  filesDOC = [];
  nameDOC;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private activitySrv: ActivityService,
    private generalSrv: GeneralService,
    private segtSrv: SeguimientoService
  ) {}

  ngOnInit(): void {}

  addRow(): void {
    this.videos.push({ URL: '', titulo: '' });
  }

  insertURL(id: any): any {
    const observables = [];
    this.videos.map((video) => {
      if (video.titulo && video.URL) {
        observables.push(
          this.activitySrv.createResourceVideo({
            ...video,
            actividad: id,
          })
        );
      }
    });

    forkJoin(observables).subscribe(
      (resp) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Se agregaron correctamente los videos.',
          icon: 'success',
          confirmButtonText: 'Ok',
          timer: 3000,
        });
      },
      (error) => {
        Swal.fire({
          title: '¡Error!',
          text: 'No se lograron agregar los videos.',
          icon: 'error',
          confirmButtonText: 'Ok',
          timer: 3000,
        });
      }
    );
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
    this.nameIMG = files.join(' , ');
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
          (resp) => {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Se agregaron correctamente las imagenes.',
              icon: 'success',
              confirmButtonText: 'Ok',
              timer: 3000,
            });
          },
          (error) => {
            Swal.fire({
              title: '¡Error!',
              text: 'No se lograron agregar las imagenes.',
              icon: 'error',
              confirmButtonText: 'Ok',
              timer: 3000,
            });
          }
        );
    });
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

  addFileDOC(): void {
    document.getElementById('multiSelectDOC').click();
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
          (resp) => {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Se agregaron correctamente los archivos.',
              icon: 'success',
              confirmButtonText: 'Ok',
              timer: 3000,
            });
          },
          (error) => {
            Swal.fire({
              title: '¡Error!',
              text: 'No se lograron agregar los archivos.',
              icon: 'error',
              confirmButtonText: 'Ok',
              timer: 3000,
            });
          }
        );
    });
  }


  updateFollow(id: string): void {

    this.segtSrv.updateSeguimiento( id, { descripcion : this.data.descripcion})
    .subscribe( resp => {

      Swal.fire({
        title: '¡Éxito!',
        text: 'Se actualizó correctamente el seguimiento.',
        icon: 'success',
        confirmButtonText: 'Ok',
        timer: 3000,
      });

    });
  }

  updateVideo(): void {
    this.activitySrv
      .updateResourceVideo(this.data.idVideo, {
        id: this.data.idVideo,
        titulo: this.data.titulo,
        URL: this.data.URL,
        actividad: this.data.id,
      })
      .subscribe(
        (resp) => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Video actualizado.',
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        },
        (error) => {
          Swal.fire({
            title: '¡Error!',
            text: 'No se logró actualizar el video.',
            icon: 'error',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        }
      );
  }
}
