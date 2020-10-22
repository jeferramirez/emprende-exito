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
      label: 'Gestionar usuario'
    },
    {
      ruta: '/home/creacion-usuario',
      icon: 'person_add',
      label: 'Crear usuario'
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
