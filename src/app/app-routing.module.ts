import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RisksListComponent } from './risks-list/risks-list.component';
import { RisksComponent } from './risks/risks.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'assignedRisks', component: RisksComponent },
  { path: 'users', component: UsersComponent },
  { path: 'risks', component: RisksListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
