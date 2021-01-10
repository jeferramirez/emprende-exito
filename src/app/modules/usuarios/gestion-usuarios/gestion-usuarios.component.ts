import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './../../programas/modal/modal.component';
import { MatriculaService } from './../../../services/matricula.service';
import { map, switchMap } from 'rxjs/operators';
import { GeneralService } from './../../../services/general.service';
import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { combineLatest } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css'],
})
export class GestionUsuariosComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'usuario',
    'nombre',
    'apellido',
    'email',
    'celular',
    'rol',
    'programa',
    'estado',
    'fecCreacion',
    'acciones',
  ];
  dataSource: MatTableDataSource<any>;
  rol;
  programas;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userSrv: UsersService,
    private router: Router,
    private generalSrv: GeneralService,
    private matriculaSrv: MatriculaService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.rol = this.generalSrv.getRolUser();
  }

  ngAfterViewInit(): void {
    this.getUser();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteUser(id: any): void {
    Swal.fire({
      title: '¿Está seguro de eliminar el usuario?',
      text: 'Esta acción no se puede revertir.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userSrv.deleteUser(id).subscribe(
          (resp) => {
            Swal.fire(
              '¡Éxito!',
              'El usuario se eliminó exitosamente.',
              'success'
            );
            this.getUser();
          },
          (error) => {
            Swal.fire('¡Error!', 'El usuario no se eliminó.', 'warning');
          }
        );
      }
    });
  }

  deleteFile(id): void {
    this.generalSrv.deleteFile(id).subscribe();
  }

  getUser(): void {
    this.userSrv
      .getUsers()
      .pipe(
        switchMap((users) => {
          const reportUsers = this.getUserProgram(users);
          return combineLatest([...reportUsers]);
        })
      )
      .subscribe((users) => {
        let userMap = users.map((user: any) => {
          this.programas = [];
          this.programas =
            user.matricula &&
            user.matricula.map((matricula) => matricula.programa.nombre);
          return {
            ...user,
            programa: this.programas,
          };
        });

        if (this.rol === 'Tutor') {
          userMap = userMap.filter((user: any) => user.rol === 'Emprendedor');
        }

        const sort = _.orderBy( userMap , ['created_at'], ['desc'] );

        // console.log(sort)
        this.dataSource = new MatTableDataSource(sort);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;


      });
  }

  navigateUser(item): void {
    this.router.navigate(['home/actualizar-usuario/', item.id]);
  }

  getUserProgram(users): any {
    return users.map((user) => {
      return this.matriculaSrv
        .getUserMatricula(user.id)
        .pipe(map((matricula) => Object.assign(user, { matricula })));
    });
  }

  openDialog(programas): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        showProgram: true,
        programas
      },
    });
  }
}
