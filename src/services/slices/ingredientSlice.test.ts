import { getIngredientsApi } from '@api';
import {
  getIngredientsThunk,
  ingredientsReducer,
  ingredientState,
  initialState
} from './ingredientSlice';

jest.mock('@api'); // подмена API для тестов;

describe('ingredientsSlice', () => {
  it('should return the initial state', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('getIngredientsThunk', () => {
    it('should handle pending state', () => {
      const action = { type: getIngredientsThunk.pending.type };
      const state = ingredientsReducer(initialState, action);
      expect(state).toEqual({ ingredients: [], isLoading: true, error: null });
    });

    it('should handle fulfilled state', async () => {
      const mockIngredients = [
        {
          _id: '1',
          name: 'Ingredient1',
          type: 'bun',
          proteins: 10,
          fat: 5,
          carbohydrates: 20,
          calories: 100,
          price: 50,
          image: '',
          image_large: '',
          image_mobile: ''
        }
      ];
      (getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients);

      const action = await getIngredientsThunk.fulfilled(
        mockIngredients,
        '',
        undefined
      );
      const state = ingredientsReducer(initialState, action);
      expect(state).toEqual({
        ingredients: mockIngredients,
        isLoading: false,
        error: null
      });
    });

    it('should handle rejected state', async () => {
      const errorMessage = 'Failed to fetch ingredients';
      (getIngredientsApi as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      const action = await getIngredientsThunk.rejected(
        new Error(errorMessage),
        '',
        undefined
      );
      const state = ingredientsReducer(initialState, action);
      expect(state).toEqual({
        ingredients: [],
        isLoading: false,
        error: errorMessage
      });
    });
  });
});
