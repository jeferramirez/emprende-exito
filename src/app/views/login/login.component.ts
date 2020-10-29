import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
    private router: Router
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
    this.loginSrv.login(this.loginForm.value).subscribe(
      (resp) => {

        console.log(resp);
        localStorage.setItem('user', JSON.stringify(resp));
        this.router.navigate(['/home']);
      },
      (error) => {
        console.log(error)
        Swal.fire({
          title: 'Error!',
          text: 'Email o contraseña incorrectos',
          icon: 'error',
          confirmButtonText: 'ok',
          timer: 3000
        });
      }
    );
  }
}
