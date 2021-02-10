import { Component, OnInit } from '@angular/core';
import { ProgramsService } from '../../../services/programs.service';
import { UsersService } from '../../../services/users.service';
import { forkJoin, of, zip, Observable } from 'rxjs';
import { MatriculaService } from 'src/app/services/matricula.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-gestion-matriculas',
  templateUrl: './gestion-matriculas.component.html',
  styleUrls: ['./gestion-matriculas.component.css'],
})
export class GestionMatriculasComponent implements OnInit {
  constructor(private programaSrv: ProgramsService, private userSrv: UsersService, private matriculaSrv: MatriculaService) { }

  programas = [];
  currentmatricula = [];
  selectProgram;
  cacheUser = [];
  matriculas = [];
  selectedUsers = [];
  programs: any[] = [
    { value: 'transparencia', viewValue: 'Transparencia' },
    { value: 'renacer', viewValue: 'Renacer' },
    { value: 'creer', viewValue: 'Creer' },
  ];

  usuarios = [];

  ngOnInit(): void {
    this.getData();
    this.getMatriculas();
  }


  addMatricula(): void {
    if (this.selectProgram) {
      this.selectedUsers = this.usuarios.filter(usuario => usuario.checked);
      const registrados =  [];
      this.selectedUsers.forEach(user => {

        const find = this.currentmatricula.find(matricula => matricula.id == user.id);
        if (!find) {
          user.fechamatricula = moment().format('YYYY-MM-DD');
          this.currentmatricula.push(user);
        }
        if (find) {

          Swal.fire({
            title: 'Usuario matriculado!',
            text: 'El usuario ya se encuentra matriculado!',
            icon: 'warning',
            confirmButtonText: 'Ok',
            timer: 5000,
          });

         // registrados.push( find )

        }
      });

      this.currentmatricula = this.currentmatricula.map(matricula => ({ ...matricula, checked: false }));


      const observables =  [];

      this.currentmatricula.forEach(matricula => {
        const newmatricula = {
          users_permissions_user: matricula.id,
          fechamatricula:  moment (moment().toDate()).add(1, 'days').toDate(),
          programa: this.selectProgram
        };

        const registrado = registrados.find( registrado =>  registrado.id === matricula.id);

        if (!matricula.id_matricula &&  !registrado) {

          observables.push(this.matriculaSrv.createMatricula(newmatricula));
        }
      });

      forkJoin( observables ).subscribe( resp => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Matricula creada!.',
          icon: 'success',
          confirmButtonText: 'Ok',
          timer: 5000,
        });

        // this.currentmatricula = [];

      });


    } else {
      Swal.fire({
        title: 'Seleccionar un programa!',
        text: 'Debe seleccionar al menos un programa!',
        icon: 'warning',
        confirmButtonText: 'Ok',
        timer: 5000,
      });
    }
  }

  getData(): void {
    zip(
      this.programaSrv.getPrograms(),
      this.userSrv.getUsers()
    ).subscribe(([programas, usuarios]) => {
      this.programas = programas;
      this.usuarios = usuarios.filter(usuario => usuario.rol === 'Emprendedor' && usuario.estado );
      this.usuarios = this.usuarios.map(usuario => ({ ...usuario, checked: false }));
      this.cacheUser = this.usuarios;
    });
  }

  removeMatricula(): void {
    if (!this.selectProgram) {

      Swal.fire({
        title: 'Seleccionar un programa!',
        text: 'Debe seleccionar al menos un programa!',
        icon: 'warning',
        confirmButtonText: 'Ok',
        timer: 3000,
      });

      return;
    }

    const observables = [];
    this.currentmatricula.map( matricula =>  {
      if (matricula.checked) {
        observables.push(this.matriculaSrv.deleteMatricula(matricula.id_matricula));
      }
    });

    forkJoin( observables )
    .pipe(
      switchMap(() => this.matriculaSrv.getMatriculas())
    )
    .subscribe( resp => {
      this.matriculas = resp;
      Swal.fire({
        title: '¡Éxito!',
        text: 'Matricula eliminada!.',
        icon: 'success',
        confirmButtonText: 'Ok',
        timer: 5000,
      });

      this.currentmatricula = this.matriculas.filter(matricula => matricula.programa.id == this.selectProgram)
      .map(matricula => ({
        nombre: matricula.users_permissions_user.nombre,
        apellido: matricula.users_permissions_user.apellido,
        id: matricula.users_permissions_user.id,
        id_matricula: matricula.id,
        fechamatricula: matricula.fechamatricula
      }));


    });

  }

  changeProgram(e): void {
    this.selectProgram = e.value;
    this.currentmatricula = this.matriculas.filter(matricula => matricula.programa.id == this.selectProgram)
      .map(matricula => ({
        nombre: matricula.users_permissions_user.nombre,
        apellido: matricula.users_permissions_user.apellido,
        id: matricula.users_permissions_user.id,
        id_matricula: matricula.id,
        fechamatricula: moment(matricula.created_at).format('YYYY-MM-DD')
      }));
  }





  onFilter(filterValue: string): void {
    const value = filterValue.trim().toLowerCase();
    if (filterValue === '') {
      this.usuarios = [...this.cacheUser];
    } else {
      this.usuarios = [...this.cacheUser].filter(user => {
        if (user.nombre.trim().toLowerCase().indexOf(value) == 0
         || user.apellido.trim().toLowerCase().indexOf(value) == 0) {
          return user;
        }
      });

    }

  }

  getMatriculas(): void {
    this.matriculaSrv.getMatriculas().subscribe(resp => {
      this.matriculas = resp;
    });

  }


}
