import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Observable } from 'rxjs';
import { CreditDebtIndicator, Transaction } from '../../data-access/transaction.model';
import { TransactionService } from '../../data-access/transaction.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionComponent {

  get transactions$(): Observable<Transaction[]> {
    return this.transactionService.getTransactions$();
  }

  searchForm!: FormGroup;

  constructor(private transactionService: TransactionService) {
    this.initSearchForm();
    this.initFilterSubscription();
  }

  private initSearchForm(): void {
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }

  private initFilterSubscription(): void {
    this.searchForm.get('search')?.valueChanges.pipe(
      debounceTime(500),
    ).subscribe((value: string) => {
      this.transactionService.searchTerm$.next(value);
    });
  }

  setTransactionStyle(creditOrDebit: CreditDebtIndicator): { [key: string]: string}  {
    if (creditOrDebit === CreditDebtIndicator.Credit) {
      return {
        'color': 'green'
      };
    } else {
      return {
        'color': 'red'
      };
    }
  }


  trackTransaction(index: number, transaction: Transaction) {
    return transaction ? transaction.id : null;
  }
}
