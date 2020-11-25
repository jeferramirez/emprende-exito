import { ReportesService } from './../../../services/reportes.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-report',
  templateUrl: './modal-report.component.html',
  styleUrls: ['./modal-report.component.css'],
})
export class ModalReportComponent implements OnInit {
  constructor(private reporteSrv: ReportesService) {}

  ngOnInit(): void {}

  reporteUsuario(): void {
    this.reporteSrv.reporteUsuario().subscribe((resp) => {
      let csvContent = 'ID;NOMBRES;APELLIDOS;EMAIL;ESTADO;INTERESES;HABILIDADES;TIPO_PROYECTO;PROFESION;OCUPACION;FECHA_ULTIMO_SEGUIMIENTO'+'\r\n';
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
      let csvContent = 'ID;NOMBRES;APELLIDOS;EMAIL;PROGRAMA;ESTADO;FECHA_DE_MATRICULA'+'\r\n';
      resp.forEach((rowArray) => {

        let row = `${rowArray.id};${rowArray.nombres};${rowArray.apellidos};${rowArray.email};${rowArray.estado};${rowArray.programa};${moment(rowArray.fecha_matricula).format('DD/MM/YYYY HH:MM')}`;
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


}
