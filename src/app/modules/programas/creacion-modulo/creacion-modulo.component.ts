import { UsersService } from './../../../services/users.service';
import { ModulesService } from './../../../services/modules.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from './../../../services/general.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-creacion-modulo',
  templateUrl: './creacion-modulo.component.html',
  styleUrls: ['./creacion-modulo.component.css'],
})
export class CreacionModuloComponent implements OnInit {
  idProgram;
  moduleForm: FormGroup;
  file: any;
  previewimage: any;
  idModule = null;
  indButton = true;
  tutores = [];

  constructor(
    private modulesSrv: ModulesService,
    private fb: FormBuilder,
    private generalSrv: GeneralService,
    private userSrv: UsersService
  ) {}

  ngOnInit(): void {
    this.idProgram = this.generalSrv.getNavigationValue();
    this.createModuleForm();
    this.getTutores();
  }

  createModuleForm(): void {
    this.moduleForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      imagen: ['', [Validators.required]],
      users_permissions_user: ['', [Validators.required]],
    });
  }

  get disabledButton(): boolean {
    return this.moduleForm.invalid ? true : false;
  }

  getTutores(): void {
    this.userSrv.getUsers().subscribe((res) => {
      this.tutores = res.filter((usuario) => usuario.rol === 'Tutor');
    });
  }

  createModule(): void {
    const module = this.moduleForm.value;
    module.estado = true;
    module.programa = this.idProgram;
    this.modulesSrv
      .createModule(module)
      .pipe(
        switchMap((data) => {
          this.generalSrv.setNavigationValue(data.id);
          this.idModule = data.id;
          const formData = this.generalSrv.getFormdata(
            data.id,
            'imagen',
            this.file,
            'modulo',
            ''
          );
          return this.generalSrv.uploadFile(formData);
        })
      )
      .subscribe(
        (resp) => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Módulo creado.',
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
          this.indButton = false;
        },
        (error) => {
          Swal.fire({
            title: '¡Error!',
            text: 'Módulo no creado.',
            icon: 'warning',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        }
      );
  }

  async onFileSelect(event): Promise<any> {
    const { file, previewimage } = await this.generalSrv.onFileSelect(event);
    this.moduleForm.get('imagen').setValue('2');
    this.file = file;
    this.previewimage = previewimage;
  }
}
