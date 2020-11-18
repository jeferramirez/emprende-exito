import { Component, OnInit } from '@angular/core';
import { ProgramsService } from '../../../services/programs.service';
import { UsersService } from '../../../services/users.service';
import { forkJoin, of, zip, Observable } from 'rxjs';
import { MatriculaService } from 'src/app/services/matricula.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs/operators';

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
      this.selectedUsers.forEach(user => {

        const find = this.currentmatricula.findIndex(matricula => matricula.id == user.id);
        console.log(find)
        if (find == -1) {
          user.fechaMatricula = moment().format('YYYY-MM-DD'),
          this.currentmatricula.push(user);
        }
      });

      this.currentmatricula = this.currentmatricula.map(matricula => ({ ...matricula, checked: false }));

      const observables =  [];
      this.currentmatricula.map(matricula => {
        const newmatricula = {
          users_permissions_user: matricula.id,
          fechamatricula: moment().toDate(),
          programa: this.selectProgram
        };
        if (!matricula.id_matricula) {
          observables.push(this.matriculaSrv.createMatricula(newmatricula));
        }
      });

      forkJoin( observables ).subscribe( resp => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Matricula creada!.',
          icon: 'success',
          confirmButtonText: 'Ok',
          timer: 3000,
        });
      });

    }
  }

  getData(): void {
    zip(
      this.programaSrv.getPrograms(),
      this.userSrv.getUsers()
    ).subscribe(([programas, usuarios]) => {
      this.programas = programas;
      this.usuarios = usuarios.filter(usuario => usuario.rol === 'Emprendedor');
      this.usuarios = this.usuarios.map(usuario => ({ ...usuario, checked: false }));
      this.cacheUser = this.usuarios;

      console.log(this.usuarios)

    });
  }

  removeMatricula(): void {
    // this.currentmatricula = this.currentmatricula.filter(matricula => !matricula.checked);

    const observables = [];
    this.currentmatricula.map( matricula =>  {
      if (matricula.checked) {
        console.log(matricula)
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
        timer: 3000,
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
        fechamatricula: matricula.fechamatricula
      }));
  }





  onFilter(filterValue: string): void {
    const value = filterValue.trim().toLowerCase();
    if (filterValue === '') {
      this.usuarios = this.cacheUser;
    } else {
      this.usuarios = this.usuarios.filter(user => {
        if (user.nombre.trim().toLowerCase().includes(value) || user.apellido.trim().toLowerCase().includes(value)) {
          return user;
        }
      });

    }

  }

  getMatriculas(): void {
    this.matriculaSrv.getMatriculas().subscribe(resp => {
      console.log(resp)
      this.matriculas = resp;
    });

  }
}
