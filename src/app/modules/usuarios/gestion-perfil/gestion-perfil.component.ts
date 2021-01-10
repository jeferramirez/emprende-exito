import { switchMap } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';
import { GeneralService } from './../../../services/general.service';
import { UsersService } from './../../../services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Observable, of, throwError } from 'rxjs';

@Component({
  selector: 'app-gestion-perfil',
  templateUrl: './gestion-perfil.component.html',
  styleUrls: ['./gestion-perfil.component.css'],
})
export class GestionPerfilComponent implements OnInit {
  userForm: FormGroup;
  userProfileForm: FormGroup;
  userPassForm: FormGroup;
  file: any;
  previewimage: any;
  user;
  profileUser;
  urlImage;
  idProfile;
  resultPass;
  rol;

  constructor(
    private fb: FormBuilder,
    private userSrv: UsersService,
    private generalSrv: GeneralService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setUser();
    this.getProfileUser();
    this.rol = this.generalSrv.getRolUser();
    this.haspermissions();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')]],
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z áéíóú ÁÉÍÓÚ Ññ ]*$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z áéíóú ÁÉÍÓÚ Ññ ]*$')]],
      fechaNacimiento: [''],
      sexo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^[1-9]\d{6}$/)]],
      celular: ['', [Validators.required, Validators.pattern(/^[1-9]\d{9}$/)]],
      ciudad: ['', [Validators.required, Validators.pattern('^[a-zA-Z áéíóú ÁÉÍÓÚ Ññ ]*$')]],
      pais: ['', [Validators.required, Validators.pattern('^[a-zA-Z áéíóú ÁÉÍÓÚ Ññ ]*$')]],
      rol: ['', [Validators.required]],
    });

    this.userProfileForm = this.fb.group({
      profesion: ['', [Validators.pattern('^[a-zA-Z áéíóú ÁÉÍÓÚ Ññ  ]*$')]],
      ocupacion: ['', [Validators.pattern('^[a-zA-Z áéíóú ÁÉÍÓÚ Ññ ]*$')]],
      tipoProyecto: ['', [Validators.pattern('^[a-zA-Z áéíóú ÁÉÍÓÚ Ññ ]*$')]],
      habilidades: [''],
      intereses: [''],
      acercaDe: [''],
    });

    this.userPassForm = this.fb.group({
      currentPass: ['', Validators.required],
      passNew: ['', [Validators.required, Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{5,16}$/)]],
      passNewConfirm: ['', Validators.required],
    });
  }

  get disabledButton(): boolean {
    return this.userForm.invalid || this.userProfileForm.invalid ? true : false;
  }

  setUser(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.userForm.patchValue(this.user.user);
    if (this.user.user.profile != null) {
      console.log(this.user);
      this.urlImage = `${environment.URLAPI}` + this.user.user.profile?.url;
    } else {
      this.urlImage = '../../../assets/imagenPerfil.jpg';
    }
  }

  handleSimulateClick(): void {
    document.getElementById('continuar').click();
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
      this.user.user.id,
      'profile',
      this.file,
      'user',
      'users-permissions'
    );
    return this.generalSrv.uploadFile(formData).subscribe(
      (resp) => {
        Toast.fire({
          icon: 'success',
          title: 'Se actualizó la foto de perfil',
        });
        this.user.user.profile = resp[0];
        //console.log(resp[0]);
        localStorage.setItem('user', JSON.stringify(this.user));
      },
      (error) => {
        Toast.fire({
          icon: 'error',
          title: 'No se actualizó la foto de perfil',
        });
      }
    );
  }

  getProfileUser(): void {
    this.userSrv.getProfileUser(this.user.user.id).subscribe((profile) => {
      this.userProfileForm.patchValue(profile);
      this.idProfile = profile.id;
    });
  }

  setProfileUser(): void {
    Swal.fire({
      title: '¿Está seguro de actualizar el usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userSrv
          .updateUser(this.userForm.value, this.user.user.id)
          .pipe(
            switchMap((data) => {
              console.log('*************************');
              console.log(data);
              this.user.user = data;
              localStorage.setItem('user', JSON.stringify(this.user));
              return this.userSrv.updateProfileUser(
                this.userProfileForm.value,
                this.idProfile
              );
            })
          )
          .subscribe(
            (resp) => {
              Swal.fire({
                title: '¡Éxito!',
                text: 'Usuario actualizado!.',
                icon: 'success',
                confirmButtonText: 'Ok',
                timer: 3000,
              });

              this.user.user.profile = resp;
              //localStorage.setItem('user', JSON.stringify(this.user));
            },
            (error) => {
              Swal.fire({
                title: 'Error!',
                text: 'Usuario no actualizado!.',
                icon: 'error',
                confirmButtonText: 'Ok',
                timer: 3000,
              });
            }
          );
      }
    });
  }

  setPass(): void {
    Swal.fire({
      title: '¿Está seguro de actualizar la constraseña?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const objPass = this.userPassForm.value;
        this.userSrv
          .validateHash({
            idUser: this.user.user.id,
            currentPass: objPass.currentPass,
          })
          .pipe(
            switchMap((resp) => {
              return this.validatePass(resp.status);
            })
          )
          .subscribe(
            (resp) => {
              Swal.fire({
                title: '¡Éxito!',
                text: 'Constraseña actualizada.',
                icon: 'success',
                confirmButtonText: 'Ok',
                timer: 3000,
              });
              this.userPassForm.reset();
            },
            (error) => {
              Swal.fire({
                title: '¡Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Ok',
                timer: 3000,
              });
            }
          );
      }
    });
  }

  validatePass(status): Observable<any> {
    const objPass = this.userPassForm.value;
    if (status) {
      if (objPass.passNew === objPass.passNewConfirm) {
        return this.userSrv.updateUser(
          { ...this.userForm.value, password: objPass.passNew },
          this.user.user.id
        );
      } else {
        return throwError(new Error(
          'Las constraseñas no coinciden'
        ));
      }
    } else {
      return throwError(new Error(
        'Contraseña actual incorrecta'
      ));
    }
  }

  haspermissions(): void {
    if (this.rol != 'Mentor') {
      this.userForm.get('username').disable();
    }
  }
}
