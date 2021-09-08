import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Login } from '../models/login';
import { User } from '../models/User';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router, private spinner: NgxSpinnerService) {
    this.initializeForm();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.loginService.adminSubject.next(false);
    });
    sessionStorage.clear();
  }

  initializeForm() {
    this.loginForm = this.fb.group({
      userName: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  onLoginClick() {
    this.spinner.show();
    const loginDetails: Login = new Login(this.loginForm.get('userName').value, this.loginForm.get('password').value);
    this.loginService.authenticateUser(loginDetails).subscribe(
      (user: User) => this.onLoginSuccess(user),
      error => this.handleErrors(error)
    );
  }

  onLoginSuccess(user: User) {
    sessionStorage.setItem("user", JSON.stringify(user));
    this.loginService.adminSubject.next(user.admin);
    this.router.navigate(['assignedRisks']);
  }

  handleErrors(error: any) {
    console.log("error=>", error);
    this.spinner.hide();
  }

}
