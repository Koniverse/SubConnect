import { Wallet } from '../types';

export interface WalletError extends Error {
  readonly wallet: Wallet;
}

export class BaseWalletError extends Error implements WalletError {
  name = 'WalletError';
  readonly wallet: Wallet;

  constructor(message: string, wallet: Wallet) {
    super(message);

    // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseWalletError);
    }

    this.wallet = wallet;
  }
}
