import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModeEnum } from '../models/ModeEnum';
import { Risk } from '../models/Risk';
import { User } from '../models/User';
import { RisksService } from '../services/risks.service';
import { Constants } from '../util/Constants';

@Component({
  selector: 'app-risks-list',
  templateUrl: './risks-list.component.html',
  styleUrls: ['./risks-list.component.css']
})
export class RisksListComponent implements OnInit {
  loggedInUser: User;
  riskList: Risk[] = [];
  selectedRisk: Risk;
  mode: ModeEnum;
  isNoRiskAvailable: boolean;

  constructor(private spinner: NgxSpinnerService, private risksService: RisksService, private router: Router) { }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    if (this.loggedInUser) {
      this.getAllRisks();
    } else {
      this.navigateToLoginPage();
    }
  }

  getAllRisks() {
    this.isNoRiskAvailable = false;
    this.spinner.show();
    this.risksService.getAllRisks(this.loggedInUser.id).subscribe(
      response => this.getAllRisksSuccess(response),
      error => this.handleError(error)
    );
  }

  getAllRisksSuccess(response: Risk[]) {
    this.riskList = [];
    if (response) {
      response.forEach(obj => {
        this.riskList.push({ ...obj, isActive: false })
      });
    }
    this.spinner.hide();
  }

  navigateToLoginPage() {
    this.router.navigate(['/login']);
  }

  onRiskClick(risk: Risk) {
    const previousSelectedRisk: Risk = this.riskList.find(riskObj => {
      return riskObj.isActive;
    });

    if (previousSelectedRisk && previousSelectedRisk.id !== risk.id) {
      previousSelectedRisk.isActive = false;
    }

    risk.isActive = true;
    this.selectedRisk = risk;
    this.mode = ModeEnum.EDIT;
  }

  onFormClose(event: any) {
    if (event === true) {
      const selectedRiskObj: Risk = this.riskList.find(riskObj => {
        return riskObj.isActive;
      });

      if (selectedRiskObj) {
        selectedRiskObj.isActive = false;
      }
      this.selectedRisk = undefined;
      this.mode = undefined;
    }
  }

  onRiskUpdate(event: any) {
    if (event === true) {
      this.getAllRisks();
    }
  }

  onAddClick() {
    this.mode = ModeEnum.ADD;
  }

  handleError(error: any) {
    console.log("error::", error);
    this.spinner.hide();
    if (error && error.error && error.error.errorcode) {
      switch (error.error.errorcode) {
        case Constants.GRC_RISK_ERR:
          if (error.error.errormessage === Constants.NO_RISK_FOUND_ERR_MSG) {
            this.isNoRiskAvailable = true;
          }
      }
    }
  }

}
