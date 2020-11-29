import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPassForm: FormGroup;

  constructor(

    private fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  CreateResetPassForm(): void {
    this.resetPassForm = this.fb.group({
      password: ['', [Validators.required]],
      passwordConfirmation: ['', [Validators.required]],
    });
  }

}
