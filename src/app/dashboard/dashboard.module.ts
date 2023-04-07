import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { BbUIModule } from '../bb-ui/bb-ui.module';
import { HttpClientModule } from '@angular/common/http';
import { TransferComponent } from './components/transfer/transfer.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DashboardComponent, TransferComponent],
  imports: [ CommonModule, DashboardRoutingModule, BbUIModule, HttpClientModule, ReactiveFormsModule],
  exports: [],
  providers: [],
})
export class DashboardModule {}
