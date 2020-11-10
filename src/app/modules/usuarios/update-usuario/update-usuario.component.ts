import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import Swal from 'sweetalert2';
import { SeguimientoService } from 'src/app/services/seguimiento.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-update-usuario',
  templateUrl: './update-usuario.component.html',
  styleUrls: ['./update-usuario.component.css'],
})
export class UpdateUsuarioComponent implements OnInit {
  userForm: FormGroup;
  idUser;
  seguimientos = [];
  profilePicture;
  constructor(
    private route: ActivatedRoute,
    private userSrv: UsersService,
    private fb: FormBuilder,
    private seguimientoSrv: SeguimientoService) {
  }


  ngOnInit(): void {
    this.initForm();
    this.idUser = this.route.snapshot.params['id'];
    this.getUser(this.idUser);
    this.getSeguimientos();

  }

  getUser(id: string): void {
    this.userSrv.getUser(id).subscribe( resp => {

     this.profilePicture = `${environment.URLAPI}${resp.profile.url}`;
     console.log(resp)
     const user =   new User( resp );
     console.log(user)
     this.userForm.patchValue(user);
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      fechaProximoSeguimiento: [''],
      fechaUltimoSeguimiento: [''],
      descripcion: [''],
      id: [''],
      email: [''],
      nombre: [''],
      telefono: [''],
      celular: [''],
      apellido: [''],
    });
  }

  setUser(): void {
    const user = new User(this.userForm.value);

    const seguimiento = {
      descripcion: this.userForm.get('descripcion').value,
      fecha_proximoseguimiento: this.userForm.get('fechaProximoSeguimiento').value,
      fecha_ultimoseguimiento: this.userForm.get('fechaUltimoSeguimiento').value,
      users_permissions_user:  this.idUser
    };

    this.seguimientoSrv.createSeguimiento(seguimiento).subscribe( resp => {


      console.log(resp)
    })


    this.userSrv.updateUser(  user, user.id ).subscribe( resp => {
      Swal.fire({
        title: '¡Éxito!',
        text: 'Usuario actualizado!.',
        icon: 'success',
        confirmButtonText: 'Ok',
        timer: 3000,
      });
    });
  }


  getSeguimientos(): void {
    this.seguimientoSrv.getSeguimiento(this.idUser).subscribe(resp => {
      this.seguimientos = resp;
      console.log(resp);
    })
  }



}
