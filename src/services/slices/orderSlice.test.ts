import { TOrder } from '@utils-types';
import {
  clearOrderState,
  fetchCreateOrder,
  getOrdersByNumberThunk,
  orderDetailsState,
  orderReducer
} from './orderSlice';
import { configureStore } from '@reduxjs/toolkit';

const initialState: orderDetailsState = {
  orders: null,
  isLoading: false,
  error: null
};

describe('orderSlice', () => {
  it('should handle initial state', () => {
    expect(orderReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle pending state for getOrdersByNumberThunk', () => {
    const action = { type: getOrdersByNumberThunk.pending.type };
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('should handle fulfilled state for getOrdersByNumberThunk', () => {
    const mockOrder = {
      _id: '1',
      status: 'done',
      name: 'Order1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T01:00:00Z',
      number: 1,
      ingredients: ['ingredient1', 'ingredient2']
    };

    const store = configureStore({
      reducer: {
        order: orderReducer
      }
    });
    store.dispatch(getOrdersByNumberThunk.fulfilled([mockOrder], '', 1));
    const state = store.getState().order;
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.orders).toStrictEqual(mockOrder);
  });

  it('should handle rejected state for getOrdersByNumberThunk', () => {
    const action = {
      type: getOrdersByNumberThunk.rejected.type,
      error: { message: 'Error fetching order' }
    };
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Error fetching order'
    });
  });

  it('should handle pending state for fetchCreateOrder', () => {
    const action = { type: fetchCreateOrder.pending.type };
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  it('should handle fulfilled state for fetchCreateOrder', () => {
    const mockOrder = {
      success: true,
      order: {
        _id: '1',
        status: 'pending',
        name: 'New Order',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T01:00:00Z',
        number: 1,
        ingredients: ['ingredient3', 'ingredient4']
      },
      name: 'name'
    };

    const action = fetchCreateOrder.fulfilled(mockOrder, '', []);
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      orders: mockOrder.order,
      isLoading: false
    });
  });

  it('should handle rejected state for fetchCreateOrder', () => {
    const action = { type: fetchCreateOrder.rejected.type };
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      error: 'Ошибка в создании заказа',
      isLoading: false
    });
  });

  it('should clear order state', () => {
    const stateWithOrder = {
      orders: {
        _id: '1',
        status: 'done',
        name: 'Order1',
        createdAt: '',
        updatedAt: '',
        number: 1,
        ingredients: []
      },
      isLoading: false,
      error: null
    };

    const action = clearOrderState();
    const state = orderReducer(stateWithOrder, action);

    expect(state).toEqual(initialState);
  });
});
