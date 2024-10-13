// import { getUserApi, loginUserApi, TLoginData, TRegisterData } from '@api';
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { TUser } from '@utils-types';
// import { getCookie, setCookie } from '../../utils/cookie';

import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

// export interface UserState {
//   isAuthChecked: boolean; // флаг для статуса проверки токена пользователя
//   isAuthenticated: boolean;
//   user: TUser | null;
//   isLoading: boolean;
//   error: string | null | undefined;
// }

// const initialState: UserState = {
//   isAuthChecked: false,
//   isAuthenticated: false,
//   user: null,
//   isLoading: false,
//   error: null
// };

// export const getUserFromApiThunk = createAsyncThunk(
//   'user/getUser',
//   async () => {
//     const response = await getUserApi();
//     return response;
//   }
// );

// // export const loginUserThunk = createAsyncThunk(
// //   'user/loginUser',
// //   async (loginData: TLoginData, { rejectWithValue }) => {
// //     const data = await loginUserApi(loginData);
// //     if (!data?.success) {
// //       return rejectWithValue(data);
// //     }
// //     setCookie('accessToken', data.accessToken);
// //     localStorage.setItem('refreshToken', data.refreshToken);
// //     return data.user;
// //   }
// // );
// export const loginUserThunk = createAsyncThunk('user/loginUser', loginUserApi);

// export const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {},
//   selectors: {
//     getUserData: (state) => state.user,
//     selectAuthChecked: (state) => state.isAuthChecked
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getUserFromApiThunk.pending, (state) => {})
//       .addCase(getUserFromApiThunk.rejected, (state, action) => {})
//       .addCase(getUserFromApiThunk.fulfilled, (state, action) => {
//         state.user = action.payload.user;
//       })
//       .addCase(loginUserThunk.pending, (state) => {
//         state.error = null;
//         state.isLoading = true;
//       })
//       .addCase(loginUserThunk.fulfilled, (state, action) => {
//         state.user = action.payload.user;
//         state.isAuthChecked = true;
//         state.isLoading = false;
//       })
//       .addCase(loginUserThunk.rejected, (state, action) => {
//         state.error = action.error.message;
//         state.isAuthChecked = false;
//       });
//   }
// });

// export const { getUserData, selectAuthChecked } = userSlice.selectors;

// export default userSlice.reducer;

// export const userReducer = userSlice.reducer;

export const fetchGetUser = createAsyncThunk('authUser/fetchGetUser', (async) =>
  getUserApi()
);

export const checkUserAuth = createAsyncThunk(
  'authUser/checkUser',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(fetchGetUser()).finally(() => {
        dispatch(authChecked());
      });
    } else {
      dispatch(authChecked());
    }
  }
);

export const fetchLoginUser = createAsyncThunk(
  'authUser/fetchLoginUser',
  async (loginData: TLoginData, { rejectWithValue }) => {
    const data = await loginUserApi(loginData);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const fetchRegisterUser = createAsyncThunk(
  'authUser/fetchRegisterUser',
  async (registerData: TRegisterData, { rejectWithValue }) => {
    const data = await registerUserApi(registerData);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const fetchUpdateUser = createAsyncThunk(
  'authUser/fetchUpdateUser',
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

export const fetchLogoutUser = createAsyncThunk(
  'authUser/fetchLogoutUser',
  async () => logoutApi()
);

export const fetchForgotPassword = createAsyncThunk(
  'authUser/fetchForgotPassword',
  async (data: { email: string }) => forgotPasswordApi(data)
);

export const fetchResetPassword = createAsyncThunk(
  'authUser/fetchResetPassword',
  async (data: { password: string; token: string }) => resetPasswordApi(data)
);

export interface authUser {
  userData: TUser | null;
  isAuthChecked: boolean;
  loginUserRequest: boolean;
  error: string | null;
}

const initialState: authUser = {
  userData: null,
  isAuthChecked: false,
  loginUserRequest: false,
  error: null
};

export const authUserSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  selectors: {
    getUserData: (state) => state.userData,
    getAuthChecked: (state) => state.isAuthChecked,
    getLoginUserRequest: (state) => state.loginUserRequest,
    getError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthChecked = true;
        state.loginUserRequest = false;
        state.error = null;
      })
      .addCase(fetchLoginUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.error = 'Ошибка в получении доступа к личному кабинету';
        state.loginUserRequest = false;
      })
      .addCase(fetchRegisterUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loginUserRequest = false;
      })
      .addCase(fetchRegisterUser.rejected, (state) => {
        state.error = 'Ошибка в регистристрации пользователя';
        state.loginUserRequest = false;
      })
      .addCase(fetchLogoutUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(fetchLogoutUser.fulfilled, (state) => {
        state.loginUserRequest = false;
        state.userData = null;
        localStorage.clear();
        deleteCookie('accessToken');
      })
      .addCase(fetchLogoutUser.rejected, (state) => {
        state.loginUserRequest = false;
        state.error = 'Ошибка выхода из аккаунта пользователя';
      })
      .addCase(fetchUpdateUser.pending, (state) => {
        state.loginUserRequest = true;
        state.userData = null;
        state.error = null;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.userData = action.payload.user;
      })
      .addCase(fetchUpdateUser.rejected, (state) => {
        state.loginUserRequest = false;
        state.error = 'Ошибка в обновлении данных пользователя';
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchGetUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
      });
  }
});

export const userReducer = authUserSlice.reducer;
export default authUserSlice.reducer;

export const { getUserData, getAuthChecked, getLoginUserRequest, getError } =
  authUserSlice.selectors;

export const { authChecked } = authUserSlice.actions;

export const authUserSliceName = authUserSlice.name;
