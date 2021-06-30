import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FBLogin, GooleLogin } from '../../services/auth.service';
import { show } from '../../utils/toast';
import {
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { FBLogout, GoogleLogout } from '../../services/auth.service'
import messaging from '@react-native-firebase/messaging';
import { createOrdUpdateAccount } from '../../services/api.service'

const initialState = {
  name: null,
  push_id: null,
  avatar: null,
  id: null,
  method: null,
  state: '',
};

const FB = 'FB';
const GOOGLE = 'GOOGLE'

export const loginThunk = createAsyncThunk('users/login', async (params, _) => {
  const push_id = await messaging().getToken()

  if (params.method === FB) {
    const profile = await FBLogin();
    if (profile) {
      const auth = {
        name: profile.name,
        push_id,
        avatar: profile.imageURL,
        oauth_id: profile.userID,
        method: FB
      };

      const user = await createOrdUpdateAccount(auth)
      auth._id = user.data._id
      return auth
    } else {
      return {
        ...initialState,
        method: FB,
      };
    }
  } else if (params.method === GOOGLE) {
    const userInfo = await GooleLogin();
    const auth = {
      name: userInfo.user.name,
      push_id,
      avatar: userInfo.user.photo,
      oauth_id: userInfo.user.id,
      method: GOOGLE,
    };

    const user = await createOrdUpdateAccount(auth)
    auth._id = user.data._id
    return auth

  } else {
    const auth = {
      name: params.username,
      push_id,
      avatar: null,
      oauth_id: null,
      method: params.method
    }

    const user = await createOrdUpdateAccount(auth)
    auth._id = user.data._id
    return auth
  }
});

export const logoutThunk = createAsyncThunk('users/logout', async (params, _) => {

  if (params.method == FB) {
    await FBLogout()
  } else if (params.method == GOOGLE) {
    await GoogleLogout()
  }
  return initialState

});


const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: {
    [loginThunk.pending]: (state, _) => {
      return {
        ...state,
        state: 'loading',
      };
    },
    [loginThunk.fulfilled]: (_, action) => {
      if (!action.payload.name && action.payload.method === FB)
        show('error', 'Login error', 'FB authentication  cancelled');

      return {
        ...action.payload,
        state: '',
      };
    },
    [loginThunk.rejected]: (state, action) => {
      if (!action.error.message === statusCodes.SIGN_IN_CANCELLED) {
        show('error', 'Login error', action.error.message);
      }

      return {
        ...state,
        state: '',
      };;
    },

    [logoutThunk.fulfilled]: (_, action) => {

      return {
        ...action.payload
      };
    },
    [logoutThunk.rejected]: (state, action) => {
      show('error', 'Login error', action.error.message);
      return state
    },
  },
});

export default authSlice.reducer;
