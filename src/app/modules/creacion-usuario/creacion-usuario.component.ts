import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-creacion-usuario',
  templateUrl: './creacion-usuario.component.html',
  styleUrls: ['./creacion-usuario.component.css'],
})
export class CreacionUsuarioComponent implements OnInit {
  userForm: FormGroup;
  users = [];
  perfilUsers = [];

  constructor(
    private fb: FormBuilder,
    private userSrv: UsersService,
    private router: Router
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
      this.userSrv.createUser(user).subscribe(
        (resp) => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Usuario creado.',
            icon: 'success',
            confirmButtonText: 'ok',
            timer: 3000,
          });
          this.userForm.reset();

          const perfilUsers = { ...user, users_permissions_user: resp.id };
          this.userSrv.createPerfilUser(perfilUsers).subscribe(
            (respPerfilUser) => {
              console.log(respPerfilUser);
            },
            (errorPerfilUser) => {
              console.log(errorPerfilUser);
            }
          );

          setTimeout(() => {
            this.router.navigate(['home/gestion-usuarios']);
          }, 500);
        },
        (error) => {
          Swal.fire({
            title: '¡Error!',
            text: 'Usuario no creado.',
            icon: 'warning',
            confirmButtonText: 'ok',
            timer: 3000,
          });
        }
      );
    } else {
      Swal.fire({
        title: '¡Error!',
        text: 'Las contraseñas no son iguales, por favor validar.',
        icon: 'error',
        confirmButtonText: 'ok',
        timer: 4000,
      });
    }
  }
}
