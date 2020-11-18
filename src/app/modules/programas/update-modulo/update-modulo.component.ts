import { switchMap } from 'rxjs/operators';
import { LessonService } from './../../../services/lesson.service';
import { environment } from './../../../../environments/environment';
import { ModulesService } from './../../../services/modules.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from './../../../services/general.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-update-modulo',
  templateUrl: './update-modulo.component.html',
  styleUrls: ['./update-modulo.component.css'],
})
export class UpdateModuloComponent implements OnInit {
  moduleForm: FormGroup;
  file: any;
  previewimage: any;
  module;
  urlImage;
  lessons = [];
  idModule;
  tutores = [];

  constructor(
    private fb: FormBuilder,
    private generalSrv: GeneralService,
    private route: ActivatedRoute,
    private moduleSrv: ModulesService,
    private router: Router,
    private lessonSrv: LessonService,
    private userSrv: UsersService
  ) {}

  ngOnInit(): void {
    this.idModule = this.route.snapshot.params['id'];
    this.generalSrv.setNavigationValue(this.idModule);
    this.getModule(this.idModule);
    this.initForm();
    this.getTutores();
  }



  getTutores(): void {
    this.userSrv.getUsers().subscribe( res => {
      this.tutores = res.filter(usuario => usuario.rol === 'Tutor');
      console.log(this.tutores)
    });
  }

  initForm(): void {
    this.moduleForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      users_permissions_user: ['', [Validators.required]],
    });
  }
  getModule(id: any): void {
    this.moduleSrv.getModule(id).subscribe((resp) => {
      this.module = resp;
      this.urlImage = `${environment.URLAPI}` + resp.imagen.url;
      this.moduleForm.patchValue(this.module);
      this.getLessons(this.idModule);
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
      this.module.id,
      'imagen',
      this.file,
      'modulo',
      ''
    );
    return this.generalSrv.uploadFile(formData).subscribe(
      (resp) => {
        Toast.fire({
          icon: 'success',
          title: 'Se actualizó la imagen',
        });

        this.module.imagen.url = resp[0].url;
      },
      (error) => {
        Toast.fire({
          icon: 'error',
          title: 'No se actualizó la imagen',
        });
      }
    );
  }

  updateModule(): void {

    this.moduleSrv.updateModule(this.moduleForm.value, this.module.id)
      .subscribe(
        (resp) => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Módulo actualizado.',
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'No se logró actualizar el módulo.',
            icon: 'error',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        }
      );
  }

  getLessons(id: any): void {
    this.lessonSrv.getLessons(id).subscribe((resp) => {
      this.lessons = resp;
    });
  }

  getFile(url: any): string {
    return `${environment.URLAPI}${url}`;
  }

  navigateLesson(item): void {
    this.router.navigate(['home/update-leccion/', item.id]);
  }

  deleteLesson(id: any): void {
    Swal.fire({
      title: '¿Está seguro de eliminar la lección?',
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
        this.lessonSrv
          .deleteLesson(id)
          .subscribe(
            (resp) => {
              Swal.fire(
                '¡Éxito!',
                'La lección se eliminó éxitosamente.',
                'success'
              );

              setTimeout(() => {
                this.getLessons(this.idModule);
              }, 1400);

            },
            (error) => {
              Swal.fire('¡Error!', 'La lección no se logró eliminar.', 'error');
            }
          );
      }
    });
  }
}
