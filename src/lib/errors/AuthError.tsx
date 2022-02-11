import { BaseWalletError } from './BaseWalletError';

export class AuthError extends BaseWalletError {
  readonly name = 'AuthError';
}
