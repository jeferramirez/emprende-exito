import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

import { catchError, switchMap } from 'rxjs/operators'
import { throwError } from 'rxjs';

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
    private router: Router
  ) { }

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
      this.userSrv.createUser(this.userForm.value).pipe(
        switchMap(data => {

          const formData = new FormData();
          formData.append('files', this.file);
          formData.append('refId', data.id);
          formData.append('ref', 'user');
          formData.append('source', 'users-permissions');
          formData.append('field', 'profile');

          return this.userSrv.uploadUserFile(formData).pipe(
            switchMap( () => this.userSrv.createPerfilUser({ ...user, users_permissions_user: data.id }))
          );


        }),

      ).subscribe(
        (resp) => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Usuario creado.',
            icon: 'success',
            confirmButtonText: 'ok',
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



  get Formdata(): any {
    const formData = new FormData();
    console.log(this.file)
    formData.append('files.' + this.file.name, this.file, this.file.name);

    return formData;
  }

  onFileSelect(event): void {
    console.log(event)
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewimage = e.target.result;
      };
      reader.readAsDataURL(this.file);


      console.log(this.file)
      /*formData.append('files', this.file);
      formData.append('ref', 'User');
      formData.append('refId', '10');

      this.userSrv.uploadUserFile(formData).subscribe(res => {

        console.log('resp ', res)
      }, err => console.log(err)) */

    /*  this.userSrv.uploadUserFile(this.userFormData).subscribe(res => {

        console.log('resp ', res)
      }, err => console.log(err)) */


    }
  }

  get userFormData(): FormData {

    const formData: any = new FormData();

    formData.append('files.profile', JSON.stringify (this.file, this.file.name));
    formData.append('data', this.userForm.value);




   /* for (const key in this.userForm.value) {
      if (Object.prototype.hasOwnProperty.call(this.userForm.value, key)) {
        const element = this.userForm.value[key];
        formData.append(key, element);
      }
    } */
    // console.log(formData.get('data'));
    return formData;
  }
}
