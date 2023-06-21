import { NgModule } from '@angular/core';
import { SidemenuComponent } from './sidemenu.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SidemenuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    SidemenuComponent
  ],
  providers: [
  ],
})
export class SideMenuModule { }
