// Uncomment the code below and write your tests
import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

import lodash from 'lodash';

describe('BankAccount', () => {
  const initialAmount = 2000;
  const moreThanInitialAmount = 3000;
  let account: BankAccount;
  let accountToTransfer: BankAccount;

  beforeEach(() => {
    account = getBankAccount(initialAmount);
    accountToTransfer = getBankAccount(0);
  });

  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(initialAmount);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => {
      account.withdraw(moreThanInitialAmount);
    }).toThrowError(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => {
      account.transfer(moreThanInitialAmount, accountToTransfer);
    }).toThrowError(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => {
      account.transfer(initialAmount, account);
    }).toThrowError(TransferFailedError);
  });

  test('should deposit money', () => {
    expect(account.deposit(1000).getBalance()).toBe(3000);
  });

  test('should withdraw money', () => {
    expect(account.withdraw(1000).getBalance()).toBe(1000);
  });

  test('should transfer money', () => {
    account.transfer(500, accountToTransfer);
    expect(account.getBalance()).toBe(1500);
    expect(accountToTransfer.getBalance()).toBe(500);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(lodash, 'random').mockReturnValueOnce(70).mockReturnValueOnce(1);
    expect(account.fetchBalance()).resolves.toEqual(expect.any(Number));
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(lodash, 'random').mockReturnValueOnce(70).mockReturnValueOnce(1);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(70);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(lodash, 'random').mockReturnValueOnce(70).mockReturnValueOnce(0);
    return expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
