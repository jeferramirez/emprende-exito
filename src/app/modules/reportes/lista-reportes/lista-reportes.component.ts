import { map, switchMap } from 'rxjs/operators';
import { ProgressService } from './../../../services/progress.service';
import { ReportesService } from './../../../services/reportes.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-lista-reportes',
  templateUrl: './lista-reportes.component.html',
  styleUrls: ['./lista-reportes.component.css'],
})
export class ListaReportesComponent implements OnInit {
  fieldsStatus: string[] = [
    'nombres',
    'apellidos',
    'email',
    'estado',
    'intereses',
    'habilidades',
    'tipoProyecto',
    'profesion',
    'ocupacion',
    'fechaSeguimiento',
  ];
  fieldsEnrollment: string[] = [
    'nombres',
    'apellidos',
    'email',
    'programa',
    'estado',
    'fecha_matricula',
  ];
  fieldsPrograms: string[] = [
    'nombres',
    'apellidos',
    'email',
    'estado',
    'programa',
    'progreso',
  ];
  actividades;
  filterValues = {};
  filterSelectObj = [];

  dataSourceStatus: MatTableDataSource<any>;
  dataSourceEnrollment: MatTableDataSource<any>;
  dataSourcePrograms: MatTableDataSource<any>;

  @ViewChild('pagstatus') pagstatus: MatPaginator;
  @ViewChild('sortstatus') sortstatus: MatSort;

  @ViewChild('pagenrollment') pagenrollment: MatPaginator;
  @ViewChild('sorterollment') sorterollment: MatSort;

  @ViewChild('pagprogram') pagprogram: MatPaginator;
  @ViewChild('sortprogram') sortprogram: MatSort;

  constructor(
    private reporteSrv: ReportesService,
    private progressSrv: ProgressService
  ) {}

  ngOnInit(): void {
    this.dataSourceStatus.filterPredicate = this.createFilter();

    this.reportStatus();
    this.reportEnrollment();
    this.reportPrograms();
  }

  applyFilterStatus(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceStatus.filter = filterValue.trim().toLowerCase();
  }

  applyFilterEnrollment(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEnrollment.filter = filterValue.trim().toLowerCase();
  }

  applyFilterPrograms(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePrograms.filter = filterValue.trim().toLowerCase();
  }

  reportStatus(): void {
    this.reporteSrv.reporteUsuario().subscribe((users) => {
      this.dataSourceStatus = new MatTableDataSource(users);
      this.dataSourceStatus.sort = this.sortstatus
    });
  }

  reportEnrollment(): void {
    this.reporteSrv.reporteMatricula().subscribe((resp) => {
      this.dataSourceEnrollment = new MatTableDataSource(resp);
      this.dataSourceEnrollment.sort = this.sorterollment;
    });
  }

  reportPrograms(): void {
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
            progreso:
              actividad.progreso.porcentaje == null
                ? '0'
                : actividad.progreso.porcentaje,
          };
        });
        this.dataSourcePrograms = new MatTableDataSource(this.actividades);
        this.dataSourcePrograms.sort = this.sortprogram;
      });
  }

  downloadReportStatus(): void {
      const resp = [...this.dataSourceStatus.filteredData];
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
  }

  downloadEnrollment(): void {
      const resp = [...this.dataSourceEnrollment.filteredData];
      let csvContent =
        'ID;NOMBRES;APELLIDOS;EMAIL;ESTADO;PROGRAMA;FECHA_DE_MATRICULA' +
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
  }

  downloadPrograms(): void {
    const resp = [...this.dataSourcePrograms.filteredData];
    let csvContent ='ID;NOMBRES;APELLIDOS;EMAIL;ESTADO;PROGRAMA;AVANCE_GENERAL_DEL_PROGRAMA' + '\r\n';
    resp.forEach((rowArray) => {
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

  //

  createFilter() {
    let filterFunction = function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      }

      console.log(searchTerms);

      let nameSearch = () => {
        let found = false;
        if (isFilterSet) {
          for (const col in searchTerms) {
            searchTerms[col].trim().toLowerCase().split(' ').forEach(word => {
              if (data[col].toString().toLowerCase().indexOf(word) != -1 && isFilterSet) {
                found = true
              }
            });
          }
          return found
        } else {
          return true;
        }
      }
      return nameSearch()
    }
    return filterFunction
  }

  getFilterObject(fullObj, key) {
    const uniqChk = [];
    fullObj.filter((obj) => {
      if (!uniqChk.includes(obj[key])) {
        uniqChk.push(obj[key]);
      }
      return obj;
    });
    return uniqChk;
  }

  // Called on Filter change
  filterChange(filter, event) {
    //let filterValues = {}
    this.filterValues[filter.columnProp] = event.target.value.trim().toLowerCase()
    this.dataSourceStatus.filter = JSON.stringify(this.filterValues)
  }

    // Reset table filters
    resetFilters() {
      this.filterValues = {}
      this.filterSelectObj.forEach((value, key) => {
        value.modelValue = undefined;
      })
      this.dataSourceStatus.filter = "";
    }

}
