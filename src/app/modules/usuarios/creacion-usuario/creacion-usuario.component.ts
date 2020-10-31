import { GeneralService } from './../../../services/general.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs/operators';

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

  constructor(
    private fb: FormBuilder,
    private userSrv: UsersService,
    private router: Router,
    private generalSrv: GeneralService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  handleSimulateClick(): void {
    document.getElementById('continuar').click();
  }

  createForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      email: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      profesion: ['', [Validators.required]],
      ocupacion: ['', [Validators.required]],
      tipo_proyecto: ['', [Validators.required]],
      habilidad: ['', [Validators.required]],
      interes: ['', [Validators.required]],
      acerca_de: ['', [Validators.required]],
    });
  }

  createUser(): void {
    const user = this.userForm.value;

    if (user.confirmPassword === user.password) {
      user.estado = true;
      this.userSrv
        .createUser(this.userForm.value)
        .pipe(
          switchMap((data) => {
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
    this.file = file;
    this.previewimage = previewimage;
  }
}
