import {
  addItem,
  burgerSlice,
  changeIngredientsOrder,
  clearIngredients,
  removeItem
} from './burgerConstructorSlice';

describe('addItem reducer', () => {
  it('adds a bun when type is "bun"', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };
    const ingredient = {
      _id: '123',
      name: 'Bun',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 100,
      price: 50,
      image: 'image.jpg',
      image_large: 'large.jpg',
      image_mobile: 'mobile.jpg'
    };

    const action = addItem(ingredient);
    const newState = burgerSlice.reducer(initialState, action);

    expect(newState.bun).toEqual({
      ...ingredient,
      id: expect.any(String) // nanoid генерирует уникальный id
    });
    expect(newState.ingredients).toHaveLength(0);
  });

  it('adds an ingredient when type is not "bun"', () => {
    const initialState = {
      bun: null,
      ingredients: []
    };
    const ingredient = {
      _id: '456',
      name: 'Cheese',
      type: 'cheese',
      proteins: 15,
      fat: 7,
      carbohydrates: 25,
      calories: 150,
      price: 70,
      image: 'image.jpg',
      image_large: 'large.jpg',
      image_mobile: 'mobile.jpg'
    };

    const action = addItem(ingredient);
    const newState = burgerSlice.reducer(initialState, action);

    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toEqual({
      ...ingredient,
      id: expect.any(String) // nanoid генерирует уникальный id
    });
  });
});

describe('removeItem reducer', () => {
  it('removes an existing ingredient', () => {
    const initialState = {
      bun: null,
      ingredients: [
        {
          _id: '1',
          name: 'Ingredient 1',
          type: 'some-type',
          proteins: 0,
          fat: 0,
          carbohydrates: 0,
          calories: 0,
          price: 0,
          image: '',
          image_large: '',
          image_mobile: '',
          id: 'abc'
        },
        {
          _id: '2',
          name: 'Ingredient 2',
          type: 'some-type',
          proteins: 0,
          fat: 0,
          carbohydrates: 0,
          calories: 0,
          price: 0,
          image: '',
          image_large: '',
          image_mobile: '',
          id: 'def'
        },
        {
          _id: '3',
          name: 'Ingredient 3',
          type: 'some-type',
          proteins: 0,
          fat: 0,
          carbohydrates: 0,
          calories: 0,
          price: 0,
          image: '',
          image_large: '',
          image_mobile: '',
          id: 'ghi'
        }
      ]
    };

    const action = removeItem({
      _id: 'def',
      name: 'Ingredient 2',
      type: 'some-type',
      proteins: 0,
      fat: 0,
      carbohydrates: 0,
      calories: 0,
      price: 0,
      image: '',
      image_large: '',
      image_mobile: '',
      id: 'def'
    });
    const newState = burgerSlice.reducer(initialState, action);

    expect(newState.ingredients).toHaveLength(2);
    expect(newState.ingredients.map((i) => i.id)).not.toContain('def');
  });
});

describe('clearIngredients reducer', () => {
  it('resets the state to initial values', () => {
    const initialState = {
      bun: {
        _id: '123',
        name: 'Bun',
        type: 'bun',
        proteins: 20,
        fat: 10,
        carbohydrates: 30,
        calories: 200,
        price: 100,
        image: '',
        image_large: '',
        image_mobile: '',
        id: 'generated-bun-id'
      },
      ingredients: [
        {
          _id: '456',
          name: 'Sauce',
          type: 'sauce',
          proteins: 2,
          fat: 3,
          carbohydrates: 4,
          calories: 40,
          price: 25,
          image: '',
          image_large: '',
          image_mobile: '',
          id: 'generated-ingredient-id'
        }
      ]
    };

    const action = clearIngredients();
    const newState = burgerSlice.reducer(initialState, action);

    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(0);
  });
});

describe('changeIngredientsOrder reducer', () => {
  test('changes the order of ingredients', () => {
    const initialState = {
      bun: null,
      ingredients: [
        {
          _id: '456',
          name: 'Sauce',
          type: 'sauce',
          proteins: 2,
          fat: 3,
          carbohydrates: 4,
          calories: 40,
          price: 25,
          image: '',
          image_large: '',
          image_mobile: '',
          id: 'generated-sauce-id'
        },
        {
          _id: '456',
          name: 'main',
          type: 'main',
          proteins: 2,
          fat: 3,
          carbohydrates: 4,
          calories: 5,
          price: 10,
          image: '',
          image_large: '',
          image_mobile: '',
          id: 'generated-main-id'
        }
      ]
    };

    const action = changeIngredientsOrder({ from: 0, to: 1 });
    const result = burgerSlice.reducer(initialState, action);
    expect(result).toEqual({
      bun: null,
      ingredients: [
        {
          _id: '456',
          name: 'main',
          type: 'main',
          proteins: 2,
          fat: 3,
          carbohydrates: 4,
          calories: 5,
          price: 10,
          image: '',
          image_large: '',
          image_mobile: '',
          id: 'generated-main-id'
        },
        {
          _id: '456',
          name: 'Sauce',
          type: 'sauce',
          proteins: 2,
          fat: 3,
          carbohydrates: 4,
          calories: 40,
          price: 25,
          image: '',
          image_large: '',
          image_mobile: '',
          id: 'generated-sauce-id'
        }
      ]
    });
  });
});
