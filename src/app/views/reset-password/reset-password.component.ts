import { UsersService } from 'src/app/services/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetPassForm: FormGroup;
  codeRecovery;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userSrv: UsersService
  ) {}

  ngOnInit(): void {
    this.codeRecovery = this.route.snapshot.params['hash'];
    this.CreateResetPassForm();
  }

  CreateResetPassForm(): void {
    this.resetPassForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{5,16}$/),
        ],
      ],
      passwordConfirmation: ['', [Validators.required]],
    });
  }

  resetPass(): void {
    const resetForm = this.resetPassForm.value;

    if (resetForm.password === resetForm.passwordConfirmation) {
      this.userSrv
        .resetPass({
          codeRecovery: this.codeRecovery,
          password: resetForm.password,
        })
        .subscribe(
          (resp) => {
            Swal.fire({
              title: '¡Éxito',
              text: 'Se actualizó la constraseña',
              icon: 'success',
              confirmButtonText: 'Ok',
              timer: 3000,
            });

            this.router.navigate(['login']);
          },
          (error) => {
            Swal.fire({
              title: '¡Error!',
              text: 'No se actualizó la constraseña',
              icon: 'error',
              confirmButtonText: 'Ok',
              timer: 3000,
            });
          }
        );
    } else {
      Swal.fire({
        title: '¡Error!',
        text: 'Las contraseñas no son iguales.',
        icon: 'error',
        confirmButtonText: 'Ok',
        timer: 3000,
      });
    }
  }
}
