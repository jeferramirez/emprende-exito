import { environment } from './../../../../environments/environment';
import { User } from './../../../models/user.model';
import { GeneralService } from './../../../services/general.service';
import { UsersService } from './../../../services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestion-perfil',
  templateUrl: './gestion-perfil.component.html',
  styleUrls: ['./gestion-perfil.component.css'],
})
export class GestionPerfilComponent implements OnInit {
  userForm: FormGroup;
  userProfileForm: FormGroup;
  file: any;
  previewimage: any;
  user;
  profileUser;
  urlImage;

  constructor(
    private fb: FormBuilder,
    private userSrv: UsersService,
    private generalSrv: GeneralService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setUser();
    this.getProfileUser();
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
  }

  get disabledButton(): boolean {
    return this.userForm.invalid && this.userProfileForm ? true : false;
  }

  setUser(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.userForm.patchValue(this.user.user);
    this.urlImage = `${environment.URLAPI}` + this.user.user.profile.url;
  }

  handleSimulateClick(): void {
    document.getElementById('continuar').click();
  }

  async onFileSelect(event): Promise<any> {
    const { file, previewimage } = await this.generalSrv.onFileSelect(event);
    this.file = file;
    this.previewimage = previewimage;
  }

  getProfileUser(): void {
    if (this.user.user.rol === 'Emprendedor') {
      this.userSrv.getProfileUser(this.user.user.id).subscribe((profile) => {
        this.userProfileForm.patchValue(profile);
      });
    }
  }
}
