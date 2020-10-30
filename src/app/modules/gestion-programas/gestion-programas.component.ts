import { environment } from './../../../environments/environment';
import { GeneralService } from './../../services/general.service';
import { ProgramsService } from './../../services/programs.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestion-programas',
  templateUrl: './gestion-programas.component.html',
  styleUrls: ['./gestion-programas.component.css'],
})
export class GestionProgramasComponent implements OnInit {
  programs = [];
  constructor(
    private programServ: ProgramsService,
    private generalSrv: GeneralService
  ) {}

  ngOnInit(): void {
    this.getPrograms();
  }

  getPrograms(): void {
    this.programServ.getPrograms().subscribe((resp) => {
      this.programs = resp;
    });
  }

  getFile(url: any): string {
    return `${environment.URLAPI}${url}`;
  }
}
