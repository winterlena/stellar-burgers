import { TOrder } from '@utils-types';
import { fetchUserOrders, ordersReducer } from './profileOrderSlice';

describe('userOrdersSlice', () => {
  const initialState = {
    orders: [] as TOrder[],
    error: null
  };

  const mockOrders: TOrder[] = [
    {
      _id: '1',
      status: 'завершенный',
      name: 'Order 1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T01:00:00Z',
      number: 1,
      ingredients: []
    },
    {
      _id: '2',
      status: 'ожидаемый',
      name: 'Order 2',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T01:00:00Z',
      number: 2,
      ingredients: []
    }
  ];

  it('should return the initial state', () => {
    expect(ordersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchUserOrders', () => {
    it('should handle pending state', () => {
      const action = { type: fetchUserOrders.pending.type };
      const expectedState = {
        orders: [],
        error: null
      };
      const state = ordersReducer(initialState, action);
      expect(state).toEqual(expectedState);
    });

    it('should handle fulfilled state', () => {
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockOrders
      };
      const expectedState = {
        orders: mockOrders,
        error: null
      };
      const state = ordersReducer(initialState, action);
      expect(state).toEqual(expectedState);
    });

    it('должен обрабатывать состояние rejected', () => {
      const action = {
        type: fetchUserOrders.rejected.type,
        error: { message: 'Ошибка в получении истории заказов' }
      };
      const expectedState = {
        orders: [],
        error: 'Ошибка в получении истории заказов'
      };
      const state = ordersReducer(initialState, action);
      expect(state).toEqual(expectedState);
    });
  });
});
