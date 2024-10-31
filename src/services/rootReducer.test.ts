import store, { rootReducer } from './store';

describe('Проверяем правильную инициализацию rootReducer', () => {
  test('правильная настройка и работа rootReducer', () => {
    const initialState = store.getState();
    const newState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState).toEqual(newState);
  });
});
