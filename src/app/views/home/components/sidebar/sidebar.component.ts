import { GeneralService } from './../../../../services/general.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalReportComponent } from '../../../../modules/reportes/modal-report/modal-report.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  menuItems = [
    {
      ruta: '/home/gestion-usuarios',
      icon: 'people_alt',
      label: 'Gestión de usuarios',
    },
    {
      ruta: '/home/gestion-programas',
      icon: 'style',
      label: 'Programas',
    },
    {
      ruta: '/home/gestion-matriculas',
      icon: 'library_books',
      label: 'Matrículas',
    },

  ];
  rol;

  constructor(private generalSrv: GeneralService, public dialog: MatDialog,) {}

  ngOnInit(): void {
    this.rol = this.generalSrv.getRolUser();
    this.loadSidebar();
  }

  loadSidebar(): void {
    if (this.rol === 'Emprendedor') {
      this.menuItems = [
        {
          ruta: '/home/gestion-programas',
          icon: 'style',
          label: 'Programas',
        },
      ];
    }

    if (this.rol === 'Tutor') {
      this.menuItems = [
        {
          ruta: '/home/gestion-usuarios',
          icon: 'people_alt',
          label: 'Gestión usuario',
        },
        {
          ruta: '/home/gestion-programas',
          icon: 'style',
          label: 'Programas',
        },
      ];
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(ModalReportComponent, {
      data: {

      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      setTimeout(() => {

      }, 1500);
    });
  }
}
