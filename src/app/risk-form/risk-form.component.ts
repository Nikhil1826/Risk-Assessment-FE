import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModeEnum } from '../models/ModeEnum';
import { Response } from '../models/Response';
import { Risk } from '../models/Risk';
import { User } from '../models/User';
import { RisksService } from '../services/risks.service';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';

@Component({
  selector: 'app-risk-form',
  templateUrl: './risk-form.component.html',
  styleUrls: ['./risk-form.component.css']
})
export class RiskFormComponent implements OnInit, OnChanges {
  @Input('risk') risk: Risk;
  @Input('mode') mode: ModeEnum;
  @Output('closeEvent') closeEvent = new EventEmitter<boolean>(false);
  @Output('riskUpdateEvent') riskUpdateEvent = new EventEmitter<boolean>(false);
  loggedInUser: User;
  riskDetailsForm: FormGroup;
  isActionBtnVisible: boolean = false;

  constructor(private fb: FormBuilder, private spinner: NgxSpinnerService, private riskService: RisksService, private snackBar: MatSnackBar, private warningDialog: MatDialog) {
    this.loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    this.intializeForm();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    switch (this.mode) {
      case ModeEnum.ADD:
        this.onEditClick();
        this.riskDetailsForm.reset();
        break;
      case ModeEnum.EDIT:
        this.onCancelClick();
        if (this.risk) {
          this.patchFormValues();
        }
        break;
    }
  }

  intializeForm() {
    this.riskDetailsForm = this.fb.group({
      name: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      description: [{ value: '', disabled: true }, Validators.compose([Validators.required])]
    });
  }

  patchFormValues() {
    this.riskDetailsForm.patchValue({
      name: this.risk.name,
      description: this.risk.description
    });
  }

  onEditClick() {
    this.riskDetailsForm.enable();
    this.isActionBtnVisible = true;
  }

  onCancelClick() {
    this.isActionBtnVisible = false;
    this.riskDetailsForm.disable();
  }

  onCloseClick(isRiskUpdateEvent?: boolean) {
    const element = document.querySelector('.risk-details-container');
    element.classList.add('animate__animated', 'animate__fadeOutRight');

    element.addEventListener('animationend', () => {
      this.closeEvent.emit(true);
      if (isRiskUpdateEvent) {
        this.riskUpdateEvent.emit(true);
      }
      this.risk = undefined;
      this.mode = undefined;
    });
  }

  onSaveClick() {
    if (this.loggedInUser) {
      this.spinner.show();
      switch (this.mode) {
        case ModeEnum.ADD:
          this.riskService.addRisk(this.riskDetailsForm.value, this.loggedInUser.id).subscribe(
            response => this.handleAddUpdateRiskSuccess(response),
            error => this.handleError(error)
          );
          break;
        case ModeEnum.EDIT:
          let updatedRisk: Risk = {
            id: this.risk.id,
            name: this.riskDetailsForm.get('name').value,
            description: this.riskDetailsForm.get('description').value
          }
          this.riskService.updateRisk(updatedRisk, this.loggedInUser.id).subscribe(
            response => this.handleAddUpdateRiskSuccess(response),
            error => this.handleError(error)
          );
          break;
      }
    }
  }

  handleAddUpdateRiskSuccess(response: Response) {
    this.spinner.hide();
    this.snackBar.open(response.message, 'OK', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
    this.onCloseClick(true);
  }

  onDeleteClick() {
    const dialogRef = this.warningDialog.open(WarningDialogComponent, {
      data: 'Are you sure you want delete \'' + this.risk.name + '\'? Deleting the risk would also remove the association of the risk from users.',
      width: '400px',
      height: '200px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok' && this.loggedInUser) {
        this.deleteRisk();
      }
    });
  }

  deleteRisk() {
    this.spinner.show();
    this.riskService.deleteRisk(this.risk.id, this.loggedInUser.id).subscribe(
      response => this.handleAddUpdateRiskSuccess(response),
      error => this.handleError(error)
    );
  }

  handleError(error: any) {
    console.log("error::", error);
    this.spinner.hide();
    if (error && error.error && error.error.errormessage) {
      this.snackBar.open(error.error.errormessage + error.error.useraction, 'OK', {
        panelClass: ['error-snackbar'],
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    }
  }

}
