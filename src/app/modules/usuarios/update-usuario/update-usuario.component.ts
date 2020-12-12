import { ProgressService } from './../../../services/progress.service';
import { MatriculaService } from './../../../services/matricula.service';
import { GeneralService } from './../../../services/general.service';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';
import Swal from 'sweetalert2';
import { SeguimientoService } from 'src/app/services/seguimiento.service';
import { environment } from '../../../../environments/environment';
import { switchMap } from 'rxjs/operators';
import { ProgramsService } from '../../../services/programs.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../programas/modal/modal.component';
import * as moment from 'moment';

@Component({
  selector: 'app-update-usuario',
  templateUrl: './update-usuario.component.html',
  styleUrls: ['./update-usuario.component.css'],
})
export class UpdateUsuarioComponent implements OnInit {
  userForm: FormGroup;
  idUser;
  idProgram;
  seguimientos = [];
  programas = [];
  rol;
  profilePicture;
  profileInfo;
  datenow: string = moment().format('YYYY-MM-DD');
  user;
  porcentaje = 0;

  constructor(
    private route: ActivatedRoute,
    private userSrv: UsersService,
    private fb: FormBuilder,
    private seguimientoSrv: SeguimientoService,
    private generalSrv: GeneralService,
    private programaSrv: ProgramsService,
    public dialog: MatDialog,
    private matriculaSrv: MatriculaService,
    private progressSrv: ProgressService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.idUser = this.route.snapshot.params['id'];
    this.getUser(this.idUser);
    this.getPrograms();
    this.rol = this.generalSrv.getRolUser();
    this.haspermissions();
    this.user = this.generalSrv.getUser();
  }

  getPrograms(): void {
    this.matriculaSrv.getUserMatricula(this.idUser).subscribe((resp) => {
      this.programas = resp;
    });
  }

  getUser(id: string): void {
    this.userSrv
      .getUser(id)
      .pipe(
        switchMap((resp) => {
          if (resp.profile) {
            this.profilePicture = `${environment.URLAPI}${resp.profile.url}`;
          }
          const user = new User(resp);
          this.userForm.patchValue(user);
          return this.userSrv.getProfileUser(id);
        })
      )
      .subscribe((resp) => {
        this.profileInfo = resp;
      });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
      ],
      fechaProximoSeguimiento: ['', [Validators.required]],
      fechaUltimoSeguimiento: [this.datenow],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      id: [''],
      email: ['', [Validators.email]],
      nombre: ['', [Validators.pattern('^[a-zA-Z áéíóú ÁÉÍÓÚ Ññ ]*$')]],
      telefono: ['', [Validators.pattern(/^[1-9]\d{6}$/)]],
      celular: ['', [Validators.pattern(/^[1-9]\d{9}$/)]],
      apellido: ['', [Validators.pattern('^[a-zA-Z áéíóú ÁÉÍÓÚ Ññ ]*$')]],
      programa: ['', [Validators.required]],
      estado: [],
    });
  }

  setUser(): void {
    const user = new User(this.userForm.value);

    Swal.fire({
      title: '¿Está seguro de actualizar el usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userSrv
          .updateUser(user, user.id)
          .pipe(
            switchMap(() =>
              this.seguimientoSrv.createSeguimiento({
                descripcion: this.userForm.get('descripcion').value,
                fecha_proximoseguimiento: moment(this.userForm.get(
                  'fechaProximoSeguimiento').value).add(1, 'days').toDate(),
                fecha_ultimoseguimiento: moment(this.userForm.get(
                  'fechaUltimoSeguimiento').value).add(1, 'days').toDate(),
                users_permissions_user: this.idUser,
                create_user: this.user.user.id,
                programa: this.userForm.get('programa').value,
              })
            )
          )
          .subscribe(
            (resp) => {
              Swal.fire({
                title: '¡Éxito!',
                text: 'Usuario actualizado!.',
                icon: 'success',
                confirmButtonText: 'Ok',
                timer: 3000,
              });
              this.getSeguimientos(this.idProgram);
            },
            (error) => {
              Swal.fire({
                title: '¡Error!',
                text: 'Usuario no actualizado.',
                icon: 'error',
                confirmButtonText: 'Ok',
                timer: 3000,
              });
            }
          );
      }
    });
  }

  getSeguimientos( idProgram: string ): void {
    this.idProgram = idProgram;
    this.seguimientoSrv.getSeguimientoByProgram(idProgram, this.idUser).subscribe((resp) => {
      this.seguimientos = resp;

      if (this.seguimientos.length > 0) {
        // setear fechas
        const ultimoSeg = this.seguimientos[this.seguimientos.length - 1];
        this.userForm
          .get('fechaUltimoSeguimiento')
          .setValue(ultimoSeg.fecha_ultimoseguimiento);
        this.userForm
          .get('fechaProximoSeguimiento')
          .setValue(ultimoSeg.fecha_proximoseguimiento);
      }
    });
    this.setPorcentaje();
  }

  openDialog(descripcion, id): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        id,
        showFollow: true,
        descripcion,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      setTimeout(() => {
        this.getSeguimientos(this.idProgram);
      }, 1500);
    });
  }

  haspermissions(): void {
    if (this.rol === 'Tutor') {
      this.userForm.get('username').disable();
      this.userForm.get('email').disable();
      this.userForm.get('nombre').disable();
      this.userForm.get('telefono').disable();
      this.userForm.get('celular').disable();
      this.userForm.get('apellido').disable();
      this.userForm.get('estado').disable();
    }
  }

  setPorcentaje(): void {
    this.progressSrv
      .progressProgram(this.idUser, this.idProgram)
      .subscribe(({ porcentaje }) => {
        this.porcentaje = porcentaje? porcentaje : 0;
      });
  }

}
