import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export interface IOrdersState {
  orders: TOrder[];
  error: string | null;
}

const initialState: IOrdersState = {
  orders: [],
  error: null
};

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchOrders',
  async () => getOrdersApi()
);

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  selectors: {
    getUserOrders: (state) => state.orders,
    getUserOrdersError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.orders = [];
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.error = 'Ошибка в получении истории заказов';
      });
  }
});

export const ordersReducer = userOrdersSlice.reducer;
export default userOrdersSlice.reducer;

export const { getUserOrders, getUserOrdersError } = userOrdersSlice.selectors;
