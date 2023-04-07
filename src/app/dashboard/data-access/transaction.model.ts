export interface Transaction {
  id: string;
  merchant: {
    name: string;
    accountNumber: string;
  };
  dates: {
    valueDate: string;
  };
  categoryCode: string;
  transaction: {
    type: string;
    creditDebitIndicator: CreditDebtIndicator;
    amountCurrency: {
      currencyCode: string;
      amount: number;
    };
  };
}

export enum CreditDebtIndicator {
  Credit = 'CRDT',
  Debit = 'DBIT'
}
