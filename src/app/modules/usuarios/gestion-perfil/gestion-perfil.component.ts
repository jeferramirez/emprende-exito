import { switchMap } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';
import { GeneralService } from './../../../services/general.service';
import { UsersService } from './../../../services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

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
  }

  initForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      nombre: [''],
      apellido: [''],
      fechaNacimiento: [''],
      sexo: [''],
      email: [''],
      telefono: [''],
      celular: [''],
      ciudad: [''],
      pais: [''],
      rol: [''],
    });

    this.userProfileForm = this.fb.group({
      profesion: [''],
      ocupacion: [''],
      tipoProyecto: [''],
      habilidades: [''],
      intereses: [''],
      acercaDe: [''],
    });

    this.userPassForm = this.fb.group({
      currentPass: ['', Validators.required],
      passNew: ['', Validators.required],
      passNewConfirm: ['', Validators.required],
    });
  }

  get disabledButton(): boolean {
    return this.userForm.invalid && this.userProfileForm ? true : false;
  }

  setUser(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.userForm.patchValue(this.user.user);
    this.urlImage = `${environment.URLAPI}` + this.user.user.profile?.url;
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

        this.user.user.profile.url = resp[0].url;
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
    this.userSrv
      .updateUser(this.userForm.value, this.user.user.id)
      .pipe(
        switchMap((data) => {
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

  setPass(): void {
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
            text: 'No se actualizó la constraseña.',
            icon: 'error',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        }
      );
  }

  validatePass(status): Observable<any> {
    const objPass = this.userPassForm.value;
    if (status) {
      if (objPass.passNew === objPass.passNewConfirm) {
        return this.userSrv.updateUser({...this.userForm.value, password: objPass.passNew}, this.user.user.id);
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Las constraseñas no coinciden',
          icon: 'warning',
          confirmButtonText: 'Ok',
          timer: 3000,
        });
      }
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Contraseña actual incorrecta',
        icon: 'warning',
        confirmButtonText: 'Ok',
        timer: 3000,
      });
    }
  }
}
