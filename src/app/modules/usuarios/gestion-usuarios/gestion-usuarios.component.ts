import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
    'estado',
    'fecCreacion',
    'acciones',
  ];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userSrv: UsersService, private router: Router) {
    // this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {

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

  getUser(): void{
    this.userSrv.getUsers().subscribe((users) => {
      this.dataSource = new MatTableDataSource(users);
    });
  }

  navigateUser(item): void {
    console.log(item)
    this.router.navigate(['home/actualizar-usuario/', item.id])
  }
}
