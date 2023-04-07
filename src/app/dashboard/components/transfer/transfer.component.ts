import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, MinValidator, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { ModalService } from 'src/app/bb-ui/components/modal/modal.service';
import { CreditDebtIndicator, MerchantDetails, Transaction } from '../../data-access/transaction.model';
import { TransactionService } from '../../data-access/transaction.service';

interface TransferForm {
  toAccount: FormControl<string | null>;
  amount: FormControl<string | null>;
}

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  get accountTotal$(): Observable<string> {
    return this.transactionService.getUserAccountTotal$().pipe(
      map((total: number) => `€${total}`)
    );
  }

  get toAccountValue(): string {
    return this.formGroup.get('toAccount')?.value || '';
  }

  get amountValue(): string {
    return this.formGroup.get('amount')?.value || '';
  }

  formGroup!: FormGroup;
  accountTotal!: number;
  openModal: boolean = false;

  constructor(private transactionService: TransactionService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.initFormGroup();
  }

  private initFormGroup(): void {
    this.formGroup = new FormGroup<TransferForm>({
      toAccount: new FormControl('', Validators.required),
      amount: new FormControl('', [Validators.required ,this.amountValidator, Validators.min(-500)])
    });
  }

  // custom validation function to check if amount is negative
  private amountValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const amount = Number(control.value);
    if (!amount || amount <= 0 || isNaN(amount)) {
      return { invalidAmount: true };
    }
    return null;
  }

  private isAmountCreditOrDebit(amount: string): CreditDebtIndicator {
    return Number(amount) > 0 ? CreditDebtIndicator.Credit : CreditDebtIndicator.Debit;
  }

  getMerchantDetails(toAccount: string): MerchantDetails {
    return this.transactionService.getMerchantDetails(toAccount)
  }

  openTransferModal(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.modalService.setIsModalOpen(true);
  }

  submitTransaction(): void {
    this.modalService.setIsModalOpen(true);

    const { amount, toAccount } = this.formGroup.value;
    const transaction: Transaction = {
      id: '123',
      merchant: this.getMerchantDetails(toAccount),
      dates: {
        valueDate: new Date().toISOString()
      },
      categoryCode: '#12a580',
      transaction: {
        type: 'Online Transfer',
        creditDebitIndicator: this.isAmountCreditOrDebit(amount),
        amountCurrency: {
          currencyCode: 'EUR',
          amount: Number(amount)
      }
    },
    }
    this.transactionService.addNewTransaction(transaction);
    this.formGroup.reset();
  }
}


// export interface Transaction {
//   id: string;
//   merchant: {
//     name: string;
//     accountNumber: string;
//   };
//   dates: {
//     valueDate: string;
//   };
//   categoryCode: string;
//   transaction: {
//     type: string;
//     creditDebitIndicator: CreditDebtIndicator;
//     amountCurrency: {
//       currencyCode: string;
//       amount: number;
//     };
//   };
// }
