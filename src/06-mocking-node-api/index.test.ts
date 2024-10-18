// Uncomment the code below and write your tests
import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
import { doStuffByTimeout, doStuffByInterval, readFileAsynchronously } from '.';

describe('doStuffByTimeout', () => {
  const timeout = 1000;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callback, timeout);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callback, timeout);
    expect(callback).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(callback).toBeCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  const timeout = 1000;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(callback, timeout);
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(callback, timeout);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(callback, timeout);
    expect(callback).not.toHaveBeenCalled();
    jest.runOnlyPendingTimers();
    expect(callback).toBeCalledTimes(1);
    jest.runOnlyPendingTimers();
    expect(callback).toBeCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  const pathToFile = 'C://RSSchool';
  jest.mock('fs');
  jest.mock('path');
  jest.mock('fs/promises');

  afterAll(() => {
    jest.unmock('fs');
    jest.unmock('path');
    jest.unmock('fs/promises');
  });

  test('should call join with pathToFile', async () => {
    const pathJoin = jest.spyOn(path, 'join');
    await readFileAsynchronously(pathToFile);
    expect(pathJoin).toHaveBeenCalled();
    expect(pathJoin).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);
    expect(await readFileAsynchronously(pathToFile)).toBeNull();
  });

  test('should return file content if file exists', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
    jest
      .spyOn(fsp, 'readFile')
      .mockImplementation(async (filePath) => `File content from ${filePath}`);
    expect(await readFileAsynchronously(pathToFile)).toEqual(
      expect.any(String),
    );
  });
});
