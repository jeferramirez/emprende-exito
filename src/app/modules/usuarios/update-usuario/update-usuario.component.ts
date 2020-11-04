import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';



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
    console.log( this.route.snapshot)
    this.getUser(this.route.snapshot.params['id']);

  }



  getUser(id: string): void {
    this.userSrv.getUser(id).subscribe( resp => {

     const user =   new User( resp );
     console.log(user)
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
      apellido: [''],





    });

  }


  setUser( user ): void {

    console.log(this.userForm)



  }



}
