// Uncomment the code below and write your tests
import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';

const queryString = '/users';
const mockData = 'some data';
const mockResponse = { data: mockData };
const baseURL = 'https://jsonplaceholder.typicode.com';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((data) => data),
}));
afterAll(() => {
  jest.unmock('axios');
  jest.unmock('lodash');
});

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    const axiosCreate = jest.spyOn(axios, 'create').mockReturnValue({
      get: jest.fn().mockReturnValue(mockResponse),
    } as unknown as AxiosInstance);
    await throttledGetDataFromApi(queryString);
    expect(axiosCreate).toHaveBeenCalledWith({
      baseURL: baseURL,
    });
  });

  test('should perform request to correct provided url', async () => {
    const getMethod = jest.fn().mockReturnValue(mockResponse);
    jest.spyOn(axios, 'create').mockReturnValue({
      get: getMethod,
    } as unknown as AxiosInstance);
    await throttledGetDataFromApi(queryString);
    expect(getMethod).toHaveBeenCalledWith(queryString);
  });

  test('should return response data', async () => {
    jest.spyOn(axios, 'create').mockReturnValue({
      get: jest.fn().mockReturnValue(mockResponse),
    } as unknown as AxiosInstance);
    expect(await throttledGetDataFromApi(queryString)).toEqual(mockData);
  });
});
