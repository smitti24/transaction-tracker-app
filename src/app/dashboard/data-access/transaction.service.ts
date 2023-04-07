import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CreditDebtIndicator, Transaction } from './transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService implements OnDestroy {
  private transactions$ = new BehaviorSubject<Transaction[]>([]);
  private unsubscribe = new Subject<void>();
  private userAccountTotal$ = new BehaviorSubject<number>(0);;

  constructor(private http: HttpClient) {
    this.fetchTransactions();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getTransactions$(): Observable<Transaction[]> {
    return this.transactions$.asObservable();
  }

  getUserAccountTotal$(): Observable<number> {
    return this.userAccountTotal$.asObservable();
  }

  adjustUserAccountTotal(amount: number): void {
    // Convert amount to a number
    amount = Number(amount);

    // Add or subtract the amount from the total, depending on its sign
    const total = this.userAccountTotal$.value + amount;

    // Prevent the total from going below zero
    if (total < 0) {
      this.userAccountTotal$.next(0);
    } else {
      this.userAccountTotal$.next(total);
    }
  }


  private fetchTransactions() {
    this.http.get<Transaction[]>('assets/transactions.json').pipe(takeUntil(this.unsubscribe)).subscribe(transactions => {
      this.transactions$.next(transactions.sort((a, b) => {
        return new Date(b.dates.valueDate).getTime() - new Date(a.dates.valueDate).getTime();
      }));
      this.sumAllPositiveTransactions(transactions);
    });
  }

  private sumAllPositiveTransactions(transactions: Transaction[]): void {
    // if transaction.transaction.creditDebitIndicator === CreditDebtIndicator.Credit, add the amount to the total
    const total = transactions.reduce((total, transaction) => {
      if (transaction.transaction.creditDebitIndicator === CreditDebtIndicator.Credit) {
        total += transaction.transaction.amountCurrency.amount;
      }
      return total;
    }, 0);

    this.userAccountTotal$.next(total);
  }
}
