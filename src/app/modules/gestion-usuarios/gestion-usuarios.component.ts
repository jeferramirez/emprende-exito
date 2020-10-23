import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from 'src/app/services/users.service';



@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})

export class GestionUsuariosComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nick', 'nombre', 'apellido', 'telefono'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userSrv: UsersService) {

    // this.dataSource = new MatTableDataSource();

  }

  ngOnInit(): void {


  }

  ngAfterViewInit(): void {
    this.userSrv.getUsers().subscribe(users => {

      this.dataSource = new MatTableDataSource(users);


    });
  }

  applyFilter(event: Event): void {
     const filterValue = (event.target as HTMLInputElement).value;
     this.dataSource.filter = filterValue.trim().toLowerCase();
   }
}

