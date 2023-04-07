export interface Transaction {
  id: string;
  merchant: MerchantDetails;
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

export interface MerchantDetails {
  name: string;
  accountNumber: string;
}

export enum CreditDebtIndicator {
  Credit = 'CRDT',
  Debit = 'DBIT'
}
