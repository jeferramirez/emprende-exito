import { GeneralService } from './../../../services/general.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-creacion-usuario',
  templateUrl: './creacion-usuario.component.html',
  styleUrls: ['./creacion-usuario.component.css'],
})
export class CreacionUsuarioComponent implements OnInit {
  userForm: FormGroup;
  users = [];
  perfilUsers = [];
  file: any;
  previewimage: any;
  rol;
  datenow: string = moment().format('YYYY-MM-DD');

  constructor(
    private fb: FormBuilder,
    private userSrv: UsersService,
    private router: Router,
    private generalSrv: GeneralService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.rol = this.generalSrv.getRolUser();
  }

  handleSimulateClick(): void {
    document.getElementById('continuar').click();
  }

  createForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')]],
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z áéíóú ÁÉÍÓÚ Ññ ]*$')]],
      estado: [false],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z áéíóú ÁÉÍÓÚ Ññ ]*$')]],
      fechaNacimiento: [this.datenow],
      sexo: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^[1-9]\d{6}$/)]],
      celular: ['', [Validators.required, Validators.pattern(/^[1-9]\d{9}$/)]],
      ciudad: ['', [Validators.required, Validators.pattern('^[a-zA-Z áéíóú ÁÉÍÓÚ Ññ ]*$')]],
      rol: ['', [Validators.required]],
      pais: ['', [Validators.required, Validators.pattern('^[a-zA-Z áéíóú ÁÉÍÓÚ Ññ ]*$')]],
      password: ['', [Validators.required, Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{5,16}$/)]],
      confirmPassword: ['', [Validators.required]],
      profesion: ['', [Validators.pattern('^[a-zA-Z ]*$')]],
      ocupacion: ['', [Validators.pattern('^[a-zA-Z ]*$')]],
      tipoProyecto: ['', [Validators.pattern('^[a-zA-Z ]*$')]],
      habilidades: ['', [Validators.pattern('^[a-zA-Z ]*$')]],
      intereses: ['', [Validators.pattern('^[a-zA-Z ]*$')]],
      acercaDe: ['', [Validators.pattern('^[a-zA-Z ]*$')]],
      imagen: [''],
    });
  }

  createUser(): void {
    const user = this.userForm.value;
    if (this.userForm.invalid) {
      Object.values(this.userForm.controls).forEach((field: any) => {
        field.markAllAsTouched();
        field.setValue(field.value);
      });
    }

    if (user.confirmPassword === user.password) {
      user.estado = true;
      this.userSrv
        .createUser(this.userForm.value)
        .pipe(
          switchMap((data) => {
            if (this.file) {
              const formData = this.generalSrv.getFormdata(
                data.id,
                'profile',
                this.file,
                'user',
                'users-permissions'
              );
              return this.generalSrv.uploadFile(formData).pipe(
                switchMap(() =>
                  this.userSrv.createPerfilUser({
                    ...user,
                    users_permissions_user: data.id,
                  })
                )
              );
            } else {
              return this.userSrv.createPerfilUser({
                ...user,
                users_permissions_user: data.id,
              });
            }
          })
        )
        .subscribe(
          (resp) => {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Usuario creado.',
              icon: 'success',
              confirmButtonText: 'Ok',
              timer: 3000,
            });

            setTimeout(() => {
              this.router.navigate(['home/gestion-usuarios']);
            }, 500);
          },
          (error) => {
            Swal.fire({
              title: '¡Error!',
              text: 'Usuario no creado.',
              icon: 'warning',
              confirmButtonText: 'Ok',
              timer: 3000,
            });
          }
        );
    } else {
      Swal.fire({
        title: '¡Error!',
        text: 'Las contraseñas no son iguales, por favor validar.',
        icon: 'error',
        confirmButtonText: 'Ok',
        timer: 4000,
      });
    }
  }

  async onFileSelect(event): Promise<any> {
    const { file, previewimage } = await this.generalSrv.onFileSelect(event);
    this.userForm.get('imagen').setValue(file);
    this.file = file;
    this.previewimage = previewimage;
  }


  showError() {

  }
}
