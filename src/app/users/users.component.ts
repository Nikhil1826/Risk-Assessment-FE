import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../models/User';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  loggedInUser: User;
  userList: User[] = [];
  selectedUserId: number;

  constructor(private userService: UserService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    if (this.loggedInUser) {
      this.getAllUsers();
    } else {
      this.navigateToLoginPage();
    }
  }

  getAllUsers() {
    this.spinner.show();
    this.userService.getAllUsers(this.loggedInUser.id).subscribe(
      response => this.getAllUsersSuccess(response),
      error => this.handleErrors(error)
    );
  }

  getAllUsersSuccess(response: User[]) {
    this.userList = [];
    if (response) {
      response.forEach(user => {
        this.userList.push({ ...user, isActive: false });
      });
    }
    this.spinner.hide();
  }

  onUserClick(user: User) {
    const previousSelectedUser: User = this.userList.find(userObj => {
      return userObj.isActive;
    });

    if (previousSelectedUser) {
      if (previousSelectedUser.id !== user.id) {
        previousSelectedUser.isActive = false;
        this.selectedUserId = user.id;
      }
    } else {
      this.selectedUserId = user.id;
    }
    user.isActive = true;
  }

  onFormClose(event: any) {
    if (event === true) {
      const selectedUser: User = this.userList.find(userObj => {
        return userObj.isActive;
      });
      selectedUser.isActive = false;
      this.selectedUserId = undefined;
    }
  }

  handleErrors(error: any) {
    console.log("err: ", error);
    this.spinner.hide();
  }

  navigateToLoginPage() {
    this.router.navigate(['login']);
  }

}
