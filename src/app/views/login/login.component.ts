import { UsersService } from 'src/app/services/users.service';
import { ModalComponent } from './../../modules/programas/modal/modal.component';
import { ProgressService } from './../../services/progress.service';
import { switchMap } from 'rxjs/operators';
import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginSrv: LoginService,
    private router: Router,
    private progressSrv: ProgressService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm(): void {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  validateLogin(): void {
    this.loginSrv
      .login(this.loginForm.value)
      .pipe(
        switchMap((data) => {
          localStorage.setItem('user', JSON.stringify(data));
          if (data.user.rol === 'Emprendedor') {
            return this.progressSrv.createProgress(data.user.id);
          }
          return of('');
        })
      )
      .subscribe(
        (resp) => {
          this.router.navigate(['/home']);
        },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'Email o contraseña incorrectos',
            icon: 'error',
            confirmButtonText: 'ok',
            timer: 3000,
          });
        }
      );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        showResetPass: true
      }
    });
    // dialogRef.afterClosed().subscribe();
  }
}
