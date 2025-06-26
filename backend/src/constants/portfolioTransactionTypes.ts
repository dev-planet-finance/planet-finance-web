// src/constants/portfolioTransactionTypes.ts

export type PortfolioAction =
  | 'Buy'
  | 'Sell'
  | 'Dividend'
  | 'DRIP'
  | 'Split'
  | 'Fee'
  | 'Deposit'
  | 'Withdrawal';

export interface ActionFieldMap {
  [key: string]: {
    requiredFields: string[];
    description: string;
  };
}

export const actionFieldMap: ActionFieldMap = {
  Buy: {
    requiredFields: ['assetId', 'quantity', 'pricePerUnit', 'fee', 'date'],
    description: 'Adds quantity to a holding and adjusts average cost',
  },
  Sell: {
    requiredFields: ['assetId', 'quantity', 'pricePerUnit', 'fee', 'date'],
    description: 'Reduces quantity and calculates realized gain/loss',
  },
  Dividend: {
    requiredFields: ['assetId', 'cashAmount', 'date'],
    description: 'Adds cash to portfolio from a dividend payout',
  },
  DRIP: {
    requiredFields: ['assetId', 'quantity', 'pricePerUnit', 'date'],
    description: 'Reinvests dividends into more shares of the same asset',
  },
  Split: {
    requiredFields: ['assetId', 'splitRatio', 'date'],
    description: 'Adjusts quantity and cost per unit for a stock split',
  },
  Fee: {
    requiredFields: ['assetId', 'cashAmount', 'date'],
    description: 'Deducts a fee as a cash outflow',
  },
  Deposit: {
    requiredFields: ['accountId', 'cashAmount', 'date'],
    description: 'Adds funds into a portfolio account',
  },
  Withdrawal: {
    requiredFields: ['accountId', 'cashAmount', 'date'],
    description: 'Removes funds from a portfolio account',
  },
};
