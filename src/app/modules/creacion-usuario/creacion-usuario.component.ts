import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-creacion-usuario',
  templateUrl: './creacion-usuario.component.html',
  styleUrls: ['./creacion-usuario.component.css']
})
export class CreacionUsuarioComponent implements OnInit {


  userForm: FormGroup;
  users = [];

  constructor(private fb: FormBuilder, private userSrv: UsersService) { }

  ngOnInit(): void {

    this.createForm();

  }



  createForm(): void {
    this.userForm = this.fb.group({
     nick: [ '', [Validators.required]],
     nombre: [ '', [Validators.required]],
     apellido: [ '', [Validators.required]],
     fechaNacimiento: [ '', [Validators.required]],
     sexo: [ '', [Validators.required]],
     email: [ '', [Validators.required]],
     telefono: [ '', [Validators.required]],
     celular: [ '', [Validators.required]],
     ciudad: [ '', [Validators.required]],
     pais: [ '', [Validators.required]],
     password: [ '', [Validators.required]],
    });

  }


  createUser(): void {

    this.userSrv.createUser(this.userForm.value).subscribe( resp => {
      console.log(resp);
      // mostrar una alerta de exito y resetear el form
      this.userForm.reset();
    });


  }
}
