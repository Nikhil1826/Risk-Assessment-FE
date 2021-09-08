import { Risk } from "./Risk";

export class User {
    constructor(public id: number, public email: string, public firstName: string, public lastName: string, public login: string, public password: string, public admin: boolean, public isActive?: boolean, public assignedRisks?: Risk[]){}
}