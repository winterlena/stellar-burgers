import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export interface constructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: constructorState = {
  bun: null,
  ingredients: []
};

export const burgerSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addItem: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    removeItem: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload.id
      );
    },
    clearIngredients: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    changeIngredientsOrder: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const ingredientToMove = state.ingredients[from];
      state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, ingredientToMove);
    }
  },
  selectors: {
    getStateBurger: (state) => state
  }
});

export const { getStateBurger } = burgerSlice.selectors;

export default burgerSlice.reducer;

export const { addItem, removeItem, clearIngredients, changeIngredientsOrder } =
  burgerSlice.actions;

export const burgerConstructorReducer = burgerSlice.reducer;
