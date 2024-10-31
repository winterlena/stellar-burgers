import { TUser } from '@utils-types';
import {
  authChecked,
  checkUserAuth,
  fetchGetUser,
  fetchLoginUser,
  fetchLogoutUser,
  fetchRegisterUser,
  fetchUpdateUser,
  userReducer
} from './userSlice';

jest.mock('@api', () => ({
  deleteCookie: jest.fn(),
  setCookie: jest.fn(),
  getCookie: jest.fn()
})); // подмена API для тестов

const initialState = {
  userData: null,
  isAuthChecked: false,
  loginUserRequest: false,
  error: null
};

// Мокируем localStorage
const localStorageMock = (function () {
  let store: { [key: string]: string } = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('authUserSlice reducers', () => {
  const mockUser: TUser = {
    email: 'test@test.com',
    name: 'test user'
  };

  it('should return the initial state', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('fetchLoginUser', () => {
    it('should handle pending state', () => {
      const action = { type: fetchLoginUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state.loginUserRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      const action = { type: fetchLoginUser.fulfilled.type, payload: mockUser };
      const state = userReducer(initialState, action);
      expect(state.userData).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle rejected state', () => {
      const action = { type: fetchLoginUser.rejected.type };
      const state = userReducer(initialState, action);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBe('Ошибка в получении доступа к личному кабинету');
      expect(state.loginUserRequest).toBe(false);
    });
  });

  describe('fetchRegisterUser', () => {
    it('should handle pending state', () => {
      const action = { type: fetchRegisterUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state.loginUserRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      const action = {
        type: fetchRegisterUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);
      expect(state.loginUserRequest).toBe(false);
      expect(state.userData).toEqual(mockUser);
      expect(state.error).toBeNull();
    });

    it('should handle rejected state', () => {
      const action = { type: fetchRegisterUser.rejected.type };
      const state = userReducer(initialState, action);
      expect(state.error).toBe('Ошибка в регистристрации пользователя');
      expect(state.loginUserRequest).toBe(false);
    });
  });

  describe('fetchLogoutUser', () => {
    it('should handle pending state', () => {
      const action = { type: fetchLogoutUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state.loginUserRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      const action = { type: fetchLogoutUser.fulfilled.type };
      const state = userReducer(initialState, action);
      expect(state.loginUserRequest).toBe(false);
      expect(state.userData).toBeNull();
    });

    it('should handle rejected state', () => {
      const action = { type: fetchLogoutUser.rejected.type };
      const state = userReducer(initialState, action);
      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBe('Ошибка выхода из аккаунта пользователя');
    });
  });

  describe('fetchUpdateUser', () => {
    it('should handle pending state', () => {
      const action = { type: fetchUpdateUser.pending.type };
      const state = userReducer(initialState, action);
      expect(state.loginUserRequest).toBe(true);
      expect(state.userData).toBeNull();
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      const updatedUser = { mockUser, name: 'new user' };
      const action = {
        type: fetchUpdateUser.fulfilled.type,
        payload: { user: updatedUser }
      };
      const state = userReducer(initialState, action);
      expect(state.loginUserRequest).toBe(false);
      expect(state.userData).toEqual(updatedUser);
    });

    it('should handle rejected state', () => {
      const action = { type: fetchUpdateUser.rejected.type };
      const state = userReducer(initialState, action);
      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBe('Ошибка в обновлении данных пользователя');
    });
  });

  describe('checkUserAuth', () => {
    it('should handle pending state', () => {
      const action = { type: checkUserAuth.pending.type };
      const state = userReducer(initialState, action);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchGetUser', () => {
    it('should handle fulfilled state', () => {
      const action = {
        type: fetchGetUser.fulfilled.type,
        payload: { user: mockUser }
      };
      const state = userReducer(initialState, action);
      expect(state.userData).toEqual(mockUser);
    });
  });
});
