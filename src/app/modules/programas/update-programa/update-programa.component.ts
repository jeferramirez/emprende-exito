import { switchMap } from 'rxjs/operators';
import { ModulesService } from './../../../services/modules.service';
import { environment } from './../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ProgramsService } from './../../../services/programs.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { GeneralService } from './../../../services/general.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-programa',
  templateUrl: './update-programa.component.html',
  styleUrls: ['./update-programa.component.css'],
})
export class UpdateProgramaComponent implements OnInit {
  programForm: FormGroup;
  file: any;
  previewimage: any;
  idProgram;
  program;
  urlImage;
  modules = [];
  rol;
  porcentaje = 10;
  constructor(
    private fb: FormBuilder,
    private generalSrv: GeneralService,
    private programSrv: ProgramsService,
    private route: ActivatedRoute,
    private moduleSrv: ModulesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idProgram = this.route.snapshot.params['id'];
    this.generalSrv.setNavigationValue(this.idProgram);
    this.getProgram(this.idProgram);
    this.initForm();
    this.rol = this.generalSrv.getRolUser();
    this.haspermissions();
  }

  initForm(): void {
    this.programForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
    });
  }
  getProgram(id: any): void {
    this.programSrv.getProgram(id).subscribe((resp) => {
      this.program = resp;
      this.urlImage = `${environment.URLAPI}` + resp.imagen.url;
      this.programForm.patchValue(this.program);
      this.getModules(this.idProgram);
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
      this.program.id,
      'imagen',
      this.file,
      'programa',
      ''
    );
    return this.generalSrv.uploadFile(formData).subscribe(
      (resp) => {
        Toast.fire({
          icon: 'success',
          title: 'Se actualizó la imagen',
        });

        this.program.imagen.url = resp[0].url;
      },
      (error) => {
        Toast.fire({
          icon: 'error',
          title: 'No se actualizó la imagen',
        });
      }
    );
  }

  updateProgram(): void {
    this.programSrv
      .updateProgram(this.programForm.value, this.program.id)
      .subscribe(
        (resp) => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Programa actualizado!.',
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'Programa no actualizado!.',
            icon: 'error',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        }
      );
  }

  getModules(id: any): void {
    this.moduleSrv.getModules(id).subscribe((resp) => {
      this.modules = resp;
    });
  }

  getFile(url: any): string {
    return `${environment.URLAPI}${url}`;
  }

  navigateModule(item): void {
    this.router.navigate(['home/update-modulo/', item.id]);
  }

  deleteModule(id: any): void {
    Swal.fire({
      title: '¿Está seguro de eliminar el módulo?',
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
        this.moduleSrv
          .deleteModule(id)
          .subscribe(
            (resp) => {
              Swal.fire(
                '¡Éxito!',
                'El módulo se eliminó éxitosamente.',
                'success'
              );

              setTimeout(() => {
                this.getModules(this.idProgram);
              }, 1400);

            },
            (error) => {
              Swal.fire('¡Error!', 'El mpodulo no se logró eliminar.', 'error');
            }
          );
      }
    });
  }

  haspermissions(): void {
    if (this.rol === 'Emprendedor' || this.rol === 'Tutor') {
      this.programForm.get('nombre').disable();
      this.programForm.get('descripcion').disable();
    }
  }
}
