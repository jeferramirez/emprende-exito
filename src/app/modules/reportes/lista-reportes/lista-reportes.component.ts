import { map, switchMap } from 'rxjs/operators';
import { ProgressService } from './../../../services/progress.service';
import { ReportesService } from './../../../services/reportes.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
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
    'fechaMatricula',
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
  filterValuesPrgms = {};
  filterValuesEnrollment = {};

  //
  filterSelectObj = [];
  filterSelectPrgrms = [];
  filterSelectEnrollment = [];


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
  ) {
    this.filterSelectObj = [
      {
        name: 'FECHA SEGUIMIENTO',
        columnProp: 'fechaSeguimiento',
        options: []
      },
      {
        name: 'ESTADO',
        columnProp: 'estado',
        options: []
      },
    ];

    this.filterSelectPrgrms = [
      {
        name: 'PROGRAMA',
        columnProp: 'programa',
        options: []
      },
      {
        name: 'PROGRESO',
        columnProp: 'progreso',
        options: []
      },
    ];

    this.filterSelectEnrollment = [
      {
        name: 'PROGRAMA',
        columnProp: 'programa',
        options: []
      },
      {
        name: 'FECHA MATRICULA',
        columnProp: 'fechaMatricula',
        options: []
      },
    ];
  }



  ngOnInit(): void {

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
      this.dataSourceStatus.filterPredicate = this.createFilter();
      this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(users, o.columnProp);
      });
    });
  }

  reportEnrollment(): void {
    this.reporteSrv.reporteMatricula().subscribe((resp: any[]) => {
      const map = resp.map(({ ...element }) => {
        return {
          ...element,
          fechaMatricula: moment(element.fecha_matricula).format('YYYY-MM-DD')
        };
      });

      this.dataSourceEnrollment = new MatTableDataSource(map);
      this.dataSourceEnrollment.sort = this.sorterollment;
      this.dataSourceEnrollment.filterPredicate = this.createFilter();

      this.filterSelectEnrollment.filter((o) => {
        o.options = this.getFilterObject(map, o.columnProp);
      });
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
                : String(actividad.progreso.porcentaje),
          };
        });
        this.dataSourcePrograms = new MatTableDataSource(this.actividades);
        this.dataSourcePrograms.sort = this.sortprogram;
        this.dataSourcePrograms.filterPredicate = this.createFilter();
        this.filterSelectPrgrms.filter((o) => {
          o.options = this.getFilterObject(this.actividades, o.columnProp);
        });
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
      let row = `${rowArray.id};${rowArray.nombres};${rowArray.apellidos};${rowArray.email
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
    let csvContent = 'ID;NOMBRES;APELLIDOS;EMAIL;ESTADO;PROGRAMA;AVANCE_GENERAL_DEL_PROGRAMA' + '\r\n';
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
    let filterFunction = function (row: any [], filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      }
      let nameSearch = () => {
        let found = false;
        if (isFilterSet) {
         const result: any [] =  _.filter([row], searchTerms );
         if (result.length > 0) {
          found = true;
         } else {
          found = false;
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
  filterChange(filter, event, name) {
    //let filterValues = {}
    let value: string = event.target.value;
    if (name === 'filterstatus') {
      this.filterValues[filter.columnProp]= value;
      this.dataSourceStatus.filter = JSON.stringify(this.filterValues);
    }

    if (name === 'filterprogram') {
      this.filterValuesPrgms[filter.columnProp] = value;
      this.dataSourcePrograms.filter = JSON.stringify(this.filterValuesPrgms);
    }

    if (name === 'filterenrollment') {
      this.filterValuesEnrollment[filter.columnProp] = value;
      this.dataSourceEnrollment.filter = JSON.stringify(this.filterValuesEnrollment);
    }
  }

  // Reset table filters
  resetFilters(name) {

    if (name === 'filterstatus') {
      this.filterValues = {}
      this.filterSelectObj.forEach((value, key) => {
        value.modelValue = undefined;
      })
      this.dataSourceStatus.filter = "";

    }
    if (name === 'filterprogram') {
      this.filterValuesPrgms = {}
      this.filterSelectPrgrms.forEach((value, key) => {
        value.modelValue = undefined;
      })
      this.dataSourcePrograms.filter = "";
    }

    if (name === 'filterenrollment') {
      this.filterValuesEnrollment = {}
      this.filterSelectEnrollment.forEach((value, key) => {
        value.modelValue = undefined;
      })
      this.dataSourceEnrollment.filter = "";
    }
  }

}
