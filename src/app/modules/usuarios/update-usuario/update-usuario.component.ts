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

@Component({
  selector: 'app-update-usuario',
  templateUrl: './update-usuario.component.html',
  styleUrls: ['./update-usuario.component.css'],
})
export class UpdateUsuarioComponent implements OnInit {
  userForm: FormGroup;
  idUser;
  seguimientos = [];
  programas = [];
  profilePicture;
  profileInfo;

  constructor(
    private route: ActivatedRoute,
    private userSrv: UsersService,
    private fb: FormBuilder,
    private seguimientoSrv: SeguimientoService,
    private generalSrv: GeneralService,
    private programaSrv: ProgramsService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.idUser = this.route.snapshot.params['id'];
    this.getUser(this.idUser);
    this.getSeguimientos();
    this.getPrograms();
  }

  getPrograms(): void {
    this.programaSrv.getPrograms().subscribe((resp) => {
      this.programas = resp;
    });
  }

  getUser(id: string): void {
    this.userSrv.getUser(id).
    pipe(
      switchMap( resp => {
        if (resp.profile) {
          this.profilePicture = `${environment.URLAPI}${resp.profile.url}`;
        }
        const user = new User(resp);
        this.userForm.patchValue(user);
        return this.userSrv.getProfileUser(id);
      })).
    subscribe((resp) => {
      this.profileInfo = resp;
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      fechaProximoSeguimiento: ['', [Validators.required]],
      fechaUltimoSeguimiento: ['', [Validators.required]],
      descripcion: [''],
      id: [''],
      email: [''],
      nombre: [''],
      telefono: [''],
      celular: [''],
      apellido: [''],
      estado: []
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
                fecha_proximoseguimiento: this.userForm.get(
                  'fechaProximoSeguimiento'
                ).value,
                fecha_ultimoseguimiento: this.userForm.get(
                  'fechaUltimoSeguimiento'
                ).value,
                users_permissions_user: this.idUser,
              })
            )
          )
          .subscribe((resp) => {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Usuario actualizado!.',
              icon: 'success',
              confirmButtonText: 'Ok',
              timer: 3000,
            });

            this.getSeguimientos();
          });
      }
    });
  }

  getSeguimientos(): void {
    this.seguimientoSrv.getSeguimiento(this.idUser).subscribe((resp) => {
      this.seguimientos = resp;

      if (this.seguimientos.length > 0 ) {
         // setear fechas
         const ultimoSeg = this.seguimientos[this.seguimientos.length - 1]
         this.userForm.get('fechaUltimoSeguimiento').setValue(ultimoSeg.fecha_ultimoseguimiento);
         this.userForm.get('fechaProximoSeguimiento').setValue(ultimoSeg.fecha_proximoseguimiento);
      }
    });
  }


  openDialog(descripcion, id): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        id,
        showFollow: true,
        descripcion
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      setTimeout(() => {
       this.getSeguimientos();
      }, 1500);
    });
  }
}
