import { RiskAssessment } from "./RiskAssessment";

export class UserAssignedRisks {
    constructor(public mappingId: number, public riskName: string, public riskDescription: string, public assessments: RiskAssessment[], public isAssessmentAvailable: boolean, public action?: string) { }
}