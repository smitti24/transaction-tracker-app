import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { BbUIModule } from '../bb-ui/bb-ui.module';
import { HttpClientModule } from '@angular/common/http';
import { TransferComponent } from './components/transfer/transfer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionComponent } from './components/transaction/transaction.component';
import { TransactionService } from './data-access/transaction.service';

@NgModule({
  declarations: [DashboardComponent, TransferComponent, TransactionComponent],
  imports: [ CommonModule, DashboardRoutingModule, BbUIModule, HttpClientModule, ReactiveFormsModule],
  exports: [],
  providers: [TransactionService],
})
export class DashboardModule {}
