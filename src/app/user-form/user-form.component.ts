import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../models/User';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input('userId') userId: number;
  @Output('closeEvent') closeEvent = new EventEmitter<boolean>(false);
  loggedInUser: User;
  user: User;
  userDetailsForm: FormGroup;
  isActionBtnVisible: boolean = false;

  constructor(private userService: UserService, private spinner: NgxSpinnerService, private router: Router, private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId']) {
      this.onCancelClick();
      if (this.userId) {
        this.loggedInUser = JSON.parse(sessionStorage.getItem("user"));
        if (this.loggedInUser) {
          this.getUserDetails();
        } else {
          this.navigateToLoginPage();
        }
      }
    }
  }

  initializeForm() {
    this.userDetailsForm = this.fb.group({
      firstName: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      lastName: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      email: [{ value: '', disabled: true }, Validators.compose([Validators.required, Validators.email])],
      userName: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      admin: [{ value: null, disabled: true }, Validators.compose([Validators.required])]
    });
  }

  getUserDetails() {
    this.spinner.show();
    this.userService.getUserById(this.loggedInUser.id, this.userId).subscribe(
      response => this.getUserDetailsSuccess(response),
      error => this.handleErrors(error)
    );
  }

  getUserDetailsSuccess(response: User) {
    this.user = response;
    if (response) {
      this.userDetailsForm.patchValue({
        firstName: response.firstName,
        lastName: response.lastName,
        userName: response.login,
        email: response.email,
        admin: response.admin ? 'true' : 'false'
      });
    }
    console.log(this.user);
    this.spinner.hide();
  }

  onCloseClick() {
    const element = document.querySelector('.user-details-container');
    element.classList.add('animate__animated', 'animate__fadeOutRight');

    element.addEventListener('animationend', () => {
      this.closeEvent.emit(true);
      this.user = undefined;
    });
  }

  onEditClick() {
    this.userDetailsForm.enable();
    this.isActionBtnVisible = true;
  }

  onCancelClick() {
    this.isActionBtnVisible = false;
    this.userDetailsForm.disable();
  }

  handleErrors(error: any) {
    console.log("err: ", error);
    this.user = undefined;
    this.spinner.hide();
  }

  navigateToLoginPage() {
    this.router.navigate(['login']);
  }

}
