import {
  addItem,
  burgerSlice,
  changeIngredientsOrder,
  clearIngredients,
  initialState,
  removeItem
} from './burgerConstructorSlice';

const ingredient = {
  _id: '123',
  name: 'Bun',
  type: 'bun',
  proteins: 5,
  fat: 10,
  carbohydrates: 15,
  calories: 20,
  price: 25,
  image: 'bun.jpg',
  image_large: 'large_bun.jpg',
  image_mobile: 'mobile_bun.jpg',
  id: 'qwer'
};
const ingredient2 = {
  _id: '456',
  name: 'Cheese',
  type: 'cheese',
  proteins: 1,
  fat: 11,
  carbohydrates: 111,
  calories: 1111,
  price: 11111,
  image: 'cheese.jpg',
  image_large: 'large_cheese.jpg',
  image_mobile: 'mobile_cheese.jpg',
  id: 'tyui'
};
const ingredient3 = {
  _id: '789',
  name: 'Sauce',
  type: 'sauce',
  proteins: 2,
  fat: 22,
  carbohydrates: 222,
  calories: 2222,
  price: 22222,
  image: 'sauce.jpg',
  image_large: 'large_sauce.jpg',
  image_mobile: 'mobile_sauce.jpg',
  id: 'def'
};
const ingredient4 = {
  _id: '741',
  name: 'Main',
  type: 'main',
  proteins: 3,
  fat: 33,
  carbohydrates: 333,
  calories: 3333,
  price: 33333,
  image: 'main.jpg',
  image_large: 'large_main.jpg',
  image_mobile: 'mobile_main.jpg',
  id: 'ghjk'
};

describe('addItem reducer', () => {
  it('adds a bun when type is "bun"', () => {
    const action = addItem(ingredient);
    const newState = burgerSlice.reducer(initialState, action);

    expect(newState.bun).toEqual({
      ...ingredient,
      id: expect.any(String) // nanoid генерирует уникальный id
    });
    expect(newState.ingredients).toHaveLength(0);
  });

  it('adds an ingredient when type is not "bun"', () => {
    const action = addItem(ingredient2);
    const newState = burgerSlice.reducer(initialState, action);

    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toEqual({
      ...ingredient2,
      id: expect.any(String) // nanoid генерирует уникальный id
    });
  });
});

describe('removeItem reducer', () => {
  it('removes an existing ingredient', () => {
    const initialState = {
      bun: null,
      ingredients: [ingredient2, ingredient3, ingredient4]
    };

    const action = removeItem(ingredient3);
    const newState = burgerSlice.reducer(initialState, action);

    expect(newState.ingredients).toHaveLength(2);
    expect(newState.ingredients.map((i) => i.id)).not.toContain('def');
  });
});

describe('clearIngredients reducer', () => {
  it('resets the state to initial values', () => {
    const initialState = {
      bun: ingredient,
      ingredients: [ingredient2, ingredient3]
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
      ingredients: [ingredient2, ingredient3]
    };

    const action = changeIngredientsOrder({ from: 0, to: 1 });
    const result = burgerSlice.reducer(initialState, action);
    expect(result).toEqual({
      bun: null,
      ingredients: [ingredient3, ingredient2]
    });
  });
});
