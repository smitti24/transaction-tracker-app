import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CreditDebtIndicator, MerchantDetails, Transaction } from './transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService implements OnDestroy {
  private allTransactions$ = new BehaviorSubject<Transaction[]>([]);
  private filteredTransactions$ = new BehaviorSubject<Transaction[]>([]);
  private userAccountTotal$ = new BehaviorSubject<number>(0);
  private unsubscribe = new Subject<void>();

  searchTerm$ = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    this.fetchTransactions();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getTransactions$(): Observable<Transaction[]> {
    return this.filteredTransactions$.asObservable();
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

  addNewTransaction(transaction: Transaction): void {
    // Add the new transaction to the list of transactions
    const transactions = this.allTransactions$.value;
    const newTransaction = {
      ...transaction,
      amount: transaction.transaction.creditDebitIndicator === CreditDebtIndicator.Credit ? transaction.transaction.amountCurrency.amount : -transaction.transaction.amountCurrency.amount,
      id: Math.random().toString(36).substring(7)
    };

    // Determine whether the new transaction matches the current search term
    const searchTerm = this.searchTerm$.value.toLowerCase();
    const matchesSearchTerm = searchTerm && newTransaction.merchant.name.toLowerCase().includes(searchTerm);

    // Add the new transaction to the appropriate list
    if (matchesSearchTerm) {
      // Add the new transaction to both allTransactions$ and filteredTransactions$
      transactions.push(newTransaction);
      transactions.sort((a, b) => {
        return new Date(b.dates.valueDate).getTime() - new Date(a.dates.valueDate).getTime();
      });
      this.allTransactions$.next(transactions);
      this.filteredTransactions$.next(transactions.filter(transaction =>
        transaction.merchant.name.toLowerCase().includes(searchTerm)
      ));
    } else {
      transactions.sort((a, b) => {
        return new Date(b.dates.valueDate).getTime() - new Date(a.dates.valueDate).getTime();
      });
      // Add the new transaction only to allTransactions$
      transactions.push(newTransaction);
      this.allTransactions$.next(transactions);
    }

    // Sort the transactions by date


    // Update the userAccountTotal$ observable
    this.setUserAccountTotal(transactions);
  }


  getMerchantDetails(accountName: string): MerchantDetails {
    // Get the transaction with the matching account name
    const merchant = this.allTransactions$.value.find(transaction => transaction.merchant.name === accountName)?.merchant;
    if (!merchant) {
      return {
        name: 'Merchant Not Found',
        accountNumber: 'Unknown'
      }
    }

    return merchant;
  }

  private fetchTransactions() {
    this.http.get<Transaction[]>('assets/transactions.json').pipe(takeUntil(this.unsubscribe)).subscribe(transactions => {
      this.allTransactions$.next(transactions.sort((a, b) => {
        return new Date(b.dates.valueDate).getTime() - new Date(a.dates.valueDate).getTime();
      }));
      this.setUserAccountTotal(transactions);
      this.initSearchTermSubscription();
    });
  }

  private setUserAccountTotal(transactions: Transaction[]): void {
    const total = transactions.reduce((total, transaction) => {
      const amount = transaction.transaction.amountCurrency.amount;
      const indicator = transaction.transaction.creditDebitIndicator;

      if (indicator === CreditDebtIndicator.Credit) {
        return total + amount;
      } else if (indicator === CreditDebtIndicator.Debit) {
        return total - amount;
      } else {
        return total;
      }
    }, 0);

    this.userAccountTotal$.next(+total.toFixed(2));
  }


  private initSearchTermSubscription(): void {
    this.searchTerm$.pipe(
      takeUntil(this.unsubscribe),
      switchMap(searchTerm => {
        const lowercaseSearchTerm = searchTerm.toLowerCase();
        const transactions = this.allTransactions$.value;
        const filteredTransactions = lowercaseSearchTerm ?
          transactions.filter(transaction =>
            transaction.merchant.name.toLowerCase().includes(lowercaseSearchTerm)
          ) :
          transactions;
        return of(filteredTransactions);
      })
    ).subscribe(this.filteredTransactions$);
  }
}
