import { Component } from '@angular/core';
import { User } from './models/User';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'risk-assessment-fe';
  isAdmin: boolean = false;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    const user: User = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      this.isAdmin = user.admin;  
    }
    this.loginService.adminSubject.subscribe((isAdmin: boolean) => {
      this.isAdmin = isAdmin;
    });
    console.log("Admin: ", this.isAdmin);
  }
}
