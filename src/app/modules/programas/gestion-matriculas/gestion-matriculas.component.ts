import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestion-matriculas',
  templateUrl: './gestion-matriculas.component.html',
  styleUrls: ['./gestion-matriculas.component.css'],
})
export class GestionMatriculasComponent implements OnInit {
  constructor() {}

  programs: any[] = [
    { value: 'transparencia', viewValue: 'Transparencia' },
    { value: 'renacer', viewValue: 'Renacer' },
    { value: 'creer', viewValue: 'Creer' },
  ];

  ngOnInit(): void {}
}
