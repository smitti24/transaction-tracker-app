import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from './data-access/transaction.model';
import { TransactionService } from './data-access/transaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [TransactionService]
})
export class DashboardComponent implements OnInit {

  get transactions$(): Observable<Transaction[]> {
    return this.transactionService.getTransactions$();
  }

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void { }
}
