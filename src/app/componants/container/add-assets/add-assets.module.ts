import { NgModule } from '@angular/core';
import { AddAssetsComponent } from './add-assets.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from '../../../services/authGuards/authGuard.service';
import { NavbarModule } from '../navbar/navbar.module';
import { GrowlModule, TooltipModule, CalendarModule} from 'primeng/primeng';
import { ErrorHandlingModule } from '../../error-handling/error-handling.module'

const routes: Routes = [
  { path: '', component: AddAssetsComponent, canActivate: [AuthGuardService] }
]


@NgModule({
  declarations: [
    AddAssetsComponent
    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NavbarModule,
    GrowlModule,
    ErrorHandlingModule,
    TooltipModule,
    CalendarModule
  ],
  providers: [
  ],
})
export class AddAssetsModule { }
