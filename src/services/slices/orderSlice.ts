import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { clearIngredients } from './burgerConstructorSlice';

export interface orderDetailsState {
  orders: TOrder | null;
  isLoading: boolean;
  error: string | undefined | null;
}

export const initialState: orderDetailsState = {
  orders: null,
  isLoading: false,
  error: null
};

export const getOrdersByNumberThunk = createAsyncThunk(
  'order/getByNumber',
  async (numberOrder: number) => {
    const response = await getOrderByNumberApi(numberOrder);
    return response.orders;
  }
);

export const fetchCreateOrder = createAsyncThunk(
  'order/fetchCreateOrder',
  async (data: string[], { dispatch }) => {
    dispatch(clearIngredients());
    const dataOrder = await orderBurgerApi(data);
    return dataOrder;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.orders = null;
    }
  },
  selectors: {
    selectOrderSelector: (state) => state.orders,
    selectLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersByNumberThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrdersByNumberThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getOrdersByNumberThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.orders = action.payload[0];
      })
      .addCase(fetchCreateOrder.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(fetchCreateOrder.fulfilled, (state, action) => {
        state.orders = action.payload.order;
        state.isLoading = false;
      })
      .addCase(fetchCreateOrder.rejected, (state, action) => {
        state.error = 'Ошибка в создании заказа';
        state.isLoading = false;
      });
  }
});

export const { selectOrderSelector, selectLoading } = orderSlice.selectors;

export default orderSlice.reducer;

export const orderReducer = orderSlice.reducer;

export const { clearOrderState } = orderSlice.actions;
