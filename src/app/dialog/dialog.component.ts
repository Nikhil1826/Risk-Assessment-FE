import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssessmentRequest } from '../models/AssessmentRequest';
import { RiskAssessment } from '../models/RiskAssessment';
import { UserAssignedRisks } from '../models/UserAssignedRisks';
import { RisksService } from '../services/risks.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  assessmentForm: FormGroup;
  dataSource: RiskAssessment[] = [];
  columnsToDisplay: string[] = ['assessmentScore', 'comment', 'assessedDate'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: UserAssignedRisks, private dialogRef: MatDialogRef<DialogComponent>, private fb: FormBuilder, private risksService: RisksService, private spinner: NgxSpinnerService) {
    this.dialogRef.disableClose = true;
    this.initializeForm();
  }

  ngOnInit(): void {
    if (this.data.action === 'history') {
      this.dataSource = [];
      this.dataSource = this.data.assessments;
    }
  }

  initializeForm() {
    this.assessmentForm = this.fb.group({
      assessmentScore: [null, Validators.compose([Validators.required, this.assessmentScoreValidator])],
      comment: ['']
    });
  }

  assessmentScoreValidator(control: AbstractControl): { [key: string]: boolean } {
    if (!(control.value >= 1 && control.value <= 5)) {
      return { 'assessmentScoreInvalid': true };
    }
    return null;
  }

  onDialogClose(action: string) {
    switch (action) {
      case 'cancel':
        this.dialogRef.close(action);
        break;
      case 'save':
        this.saveAssessmentScore();
        break;
    }
  }

  saveAssessmentScore() {
    this.spinner.show();
    const assessmentRequest: AssessmentRequest = new AssessmentRequest(this.data.mappingId, this.assessmentForm.get('assessmentScore').value, this.assessmentForm.get('comment').value);
    this.risksService.assessRisk(assessmentRequest).subscribe(
      response => this.saveAssessmentScoreSuccess(response),
      error => this.handleError(error)
    );
  }

  saveAssessmentScoreSuccess(response: any) {
    this.spinner.hide();
    this.dialogRef.close('save');
  }

  handleError(error: any) {
    console.log("error: ", error);
    this.spinner.hide();
  }


}
