import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogComponent } from '../dialog/dialog.component';
import { User } from '../models/User';
import { UserAssignedRisks } from '../models/UserAssignedRisks';
import { RisksService } from '../services/risks.service';

@Component({
  selector: 'app-risks',
  templateUrl: './risks.component.html',
  styleUrls: ['./risks.component.css']
})
export class RisksComponent implements OnInit {
  assigendRiskList: UserAssignedRisks[] = [];
  user: User;

  constructor(private risksService: RisksService, private spinner: NgxSpinnerService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem("user"));
    if (this.user) {
      this.getRisksAssignedToUser();
    } else {
      this.navigateToLoginPage();
    }
  }

  getRisksAssignedToUser() {
    this.spinner.show();
    this.risksService.getRisksAssignedToUser(this.user.id).subscribe(
      response => this.getRisksAssignedToUserSuccess(response),
      error => this.handleErrors(error)
    );
  }

  getRisksAssignedToUserSuccess(response: UserAssignedRisks[]) {
    this.assigendRiskList = response ? response : [];
    // for(let i=0;i<10;i++) {
    //   this.assigendRiskList.push(new UserAssignedRisks(i+1, 'Test Risk', 'kfhsjkdhfkjshfkjhskjfhs', [], true));
    // }   
    console.log(this.assigendRiskList);
    this.spinner.hide();
  }

  navigateToLoginPage() {
    this.router.navigate(['../']);
  }

  onActionBtnClick(risk: UserAssignedRisks, action: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { ...risk, action: action }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.getRisksAssignedToUser();
      }
    });
  }

  handleErrors(error: any) {
    console.log("error=>", error);
    this.spinner.hide();
  }

}
