import { getFeedsApi } from '../../utils/burger-api';
import {
  feedReducer,
  feedState,
  getFeedsThunk,
  initialState
} from './feedSlice';

jest.mock('../../utils/burger-api'); // подмена API для тестов

describe('feedSlice', () => {
  it('should return the initial state', () => {
    expect(feedReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('getFeedsThunk', () => {
    it('should handle pending state', () => {
      const action = { type: getFeedsThunk.pending.type };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: true,
        error: null
      });
    });

    it('should handle fulfilled state', () => {
      const mockResponse = {
        success: true,
        orders: [
          {
            _id: '1',
            status: 'done',
            name: 'Order1',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T01:00:00Z',
            number: 1,
            ingredients: ['ingredient1', 'ingredient2']
          }
        ],
        total: 1,
        totalToday: 1
      };

      const action = getFeedsThunk.fulfilled(mockResponse, '', undefined);
      const state = feedReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orders: mockResponse.orders,
        total: mockResponse.total,
        totalToday: mockResponse.totalToday,
        isLoading: false,
        error: null
      });
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Failed to fetch feeds';
      const action = {
        type: getFeedsThunk.rejected.type,
        error: { message: errorMessage }
      };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage
      });
    });
  });
});
