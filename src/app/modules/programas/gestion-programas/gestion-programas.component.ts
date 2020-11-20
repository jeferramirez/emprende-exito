import { switchMap } from 'rxjs/operators';
import { MatriculaService } from 'src/app/services/matricula.service';
import { GeneralService } from './../../../services/general.service';
import { Router } from '@angular/router';
import { environment } from './../../../../environments/environment';
import { ProgramsService } from './../../../services/programs.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { of } from 'rxjs';

@Component({
  selector: 'app-gestion-programas',
  templateUrl: './gestion-programas.component.html',
  styleUrls: ['./gestion-programas.component.css'],
})
export class GestionProgramasComponent implements OnInit {
  programs = [];
  rol;
  user;
  matriculas;

  constructor(
    private programServ: ProgramsService,
    private router: Router,
    private generalSrv: GeneralService,
    private matricualSrv: MatriculaService
  ) {}

  ngOnInit(): void {
    this.getPrograms();
    this.rol = this.generalSrv.getRolUser();
    this.user = this.generalSrv.getUser();
    this.loadProgram();
  }

  getMatricula(id: number): void {
    this.matricualSrv
      .getUserMatricula(id)
      .pipe(
        switchMap((matricula) => {
          return this.programServ.getPrograms().pipe(
            switchMap((programas) => {
              const filteProgram = programas.filter((programa: any) => {
                const existe = matricula.find(
                  (element: any) => element.programa.id === programa.id
                );
                if (existe) {
                  return programa;
                }
              });
              return of(filteProgram);
            })
          );
        })
      )
      .subscribe((resp) => {
        this.programs = resp;
      });
  }

  getPrograms(): void {
    this.programServ.getPrograms().subscribe((resp) => {
      this.programs = resp;
    });
  }

  loadProgram(): void {
    if (this.rol === 'Emprendedor') {
      this.getMatricula(this.user.user.id);
    } else {
      this.getPrograms();
    }
  }

  getFile(url: any): string {
    return `${environment.URLAPI}${url}`;
  }

  deleteProgram(id: any): void {
    Swal.fire({
      title: '¿Está seguro de eliminar el programa?',
      text:
        'Esta acción no se puede revertir y borrará todo lo relacionado al mismo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.programServ.deleteProgram(id).subscribe(
          (resp: any) => {
            Swal.fire(
              '¡Éxito!',
              'El programa se eliminó éxitosamente.',
              'success'
            );

            setTimeout(() => {
              this.getPrograms();
            }, 1400);
          },
          (error) => {
            Swal.fire('¡Error!', 'El programa no se logró eliminar.', 'error');
          }
        );
      }
    });
  }

  navigateProgram(item): void {
    this.router.navigate(['home/update-programa/', item.id]);
  }
}
