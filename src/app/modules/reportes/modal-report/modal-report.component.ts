import { ProgressService } from './../../../services/progress.service';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { ReportesService } from './../../../services/reportes.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-report',
  templateUrl: './modal-report.component.html',
  styleUrls: ['./modal-report.component.css'],
})
export class ModalReportComponent implements OnInit {
  actividades;

  constructor(
    private reporteSrv: ReportesService,
    private progressSrv: ProgressService
  ) {}

  ngOnInit(): void {

  }

  reporteUsuario(): void {
    this.reporteSrv.reporteUsuario().subscribe((resp) => {
      let csvContent =
        'ID;NOMBRES;APELLIDOS;EMAIL;ESTADO;INTERESES;HABILIDADES;TIPO_PROYECTO;PROFESION;OCUPACION;FECHA_ULTIMO_SEGUIMIENTO' +
        '\r\n';
      resp.forEach((rowArray) => {
        let row = `${rowArray.id};${rowArray.nombres};${rowArray.apellidos};${rowArray.email};${rowArray.estado};${rowArray.intereses};${rowArray.habilidades};${rowArray.tipoProyecto};${rowArray.profesion};${rowArray.ocupacion};${rowArray.fechaSeguimiento}`;
        csvContent += row + '\r\n';
      });

      const csvFile = new Blob([csvContent], { type: 'text/csv' });

      const url = window.URL.createObjectURL(csvFile);
      const save = document.createElement('a');
      save.href = url;
      save.target = '_blank';
      // aquí le damos nombre al archivo
      save.download = 'REPORTE_ESTADO' + '.csv';
      save.click();
    });
  }

  reporteMatricula(): void {
    this.reporteSrv.reporteMatricula().subscribe((resp) => {
      let csvContent =
        'ID;NOMBRES;APELLIDOS;EMAIL;PROGRAMA;ESTADO;FECHA_DE_MATRICULA' +
        '\r\n';
      resp.forEach((rowArray) => {
        let row = `${rowArray.id};${rowArray.nombres};${rowArray.apellidos};${
          rowArray.email
        };${rowArray.estado};${rowArray.programa};${moment(
          rowArray.fecha_matricula
        ).format('DD/MM/YYYY HH:MM')}`;
        csvContent += row + '\r\n';
      });

      const csvFile = new Blob([csvContent], { type: 'text/csv' });

      const url = window.URL.createObjectURL(csvFile);
      const save = document.createElement('a');
      save.href = url;
      save.target = '_blank';
      // aquí le damos nombre al archivo
      save.download = 'REPORTE_MATRICULA' + '.csv';
      save.click();
    });
  }

  reporteActividad(): void {
    this.reporteSrv
      .reporteActividad()
      .pipe(
        switchMap((actividades) => {
          const reporte = this.getProgressProgram(actividades);
          return combineLatest([...reporte]);
        })
      )
      .subscribe((resp) => {
        this.actividades = resp.map((actividad: any) => {
          return {
            id: actividad.users_permissions_user.id,
            nombres: actividad.users_permissions_user.nombre,
            apellidos: actividad.users_permissions_user.apellido,
            email: actividad.users_permissions_user.email,
            programa: actividad.programa.nombre,
            idprograma: actividad.programa.id,
            estado: actividad.users_permissions_user.id ? 'Activo' : 'Inactivo',
            progreso: actividad.progreso.porcentaje == null ? '0' : actividad.progreso.porcentaje,
          };
        });

        let csvContent =
          'ID;NOMBRES;APELLIDOS;EMAIL;ESTADO;PROGRAMA;AVANCE_GENERAL_DEL_PROGRAMA' +
          '\r\n';
        this.actividades.forEach((rowArray) => {
          let row = `${rowArray.id};${rowArray.nombres};${rowArray.apellidos};${rowArray.email};${rowArray.estado};${rowArray.programa};${rowArray.progreso}%`;
          csvContent += row + '\r\n';
        });

        const csvFile = new Blob([csvContent], { type: 'text/csv' });

        const url = window.URL.createObjectURL(csvFile);
        const save = document.createElement('a');
        save.href = url;
        save.target = '_blank';
        // aquí le damos nombre al archivo
        save.download = 'REPORTE_ACTIVIDAD' + '.csv';
        save.click();
      });
  }

  getProgressProgram(actividades): any {
    return actividades.map((actividad) => {
      return this.progressSrv
        .progressProgram(
          actividad.users_permissions_user.id,
          actividad.programa.id
        )
        .pipe(map((progreso) => Object.assign(actividad, { progreso })));
    });
  }
}
