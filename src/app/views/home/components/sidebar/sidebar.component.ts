import { Component, OnInit } from '@angular/core';

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
      label: 'Gestión usuario',
    },
    {
      ruta: '/home/gestion-programas',
      icon: 'style',
      label: 'Programas',
    },
    {
      ruta: '/home/gestion-matriculas',
      icon: 'library_books',
      label: 'Matriculas',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
