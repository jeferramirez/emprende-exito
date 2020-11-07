import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-update-usuario',
  templateUrl: './update-usuario.component.html',
  styleUrls: ['./update-usuario.component.css']
})
export class UpdateUsuarioComponent implements OnInit {

  userForm: FormGroup;
  constructor(private route: ActivatedRoute, private userSrv: UsersService, private fb: FormBuilder) {
  }


  ngOnInit(): void {

    this.initForm();
    this.getUser(this.route.snapshot.params['id']);

  }



  getUser(id: string): void {
    this.userSrv.getUser(id).subscribe( resp => {

     const user =   new User( resp );
     console.log(user)
     this.userForm.patchValue(user);
    });
  }


  initForm(): void {
    this.userForm = this.fb.group( {
      username: [ '', [Validators.required] ],
      fechaProximoSeguimiento: [''],
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
    const user = new User(this.userForm.value)
    this.userSrv.updateUser(  user, user.id ).subscribe( resp => {
      Swal.fire({
        title: '¡Éxito!',
        text: 'Usuario actualizado!.',
        icon: 'success',
        confirmButtonText: 'Ok',
        timer: 3000,
      });    });

  }



}
