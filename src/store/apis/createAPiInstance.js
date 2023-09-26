// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { setUserInfo } from 'src/store/user';
import { deleteAllCookies, getCookie, setCookie } from 'src/utils/commonFunctions';
import config from 'src/config';


const refreshQuery = fetchBaseQuery({
  baseUrl: config.baseUrl,
  prepareHeaders: (headers) => {
    const token = getCookie('refresh')
      ? JSON.parse(getCookie('refresh'))
      : false;
    if (token) {
      headers.set('x-refresh-token', token);
    }
    return headers;
  },
});
const baseQuery = fetchBaseQuery({
  baseUrl: config.baseUrl,
  prepareHeaders: (headers) => {
    // const token = getState();
    const token = getCookie('token') ? JSON.parse(getCookie('token')) : false;
    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      headers.set('x-access-token', token);
    }
    return headers;
  },
});
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const token = getCookie('refresh') ? JSON.parse(getCookie('refresh')) : false;
  if (result.error && result.error.status === 401 && token) {
    // try to get a new token
    const { data: refreshResult } = await refreshQuery(
      '/auth/refresh-token',
      api,
      extraOptions
    );
    if (
      refreshResult?.status === 200 &&
      refreshResult?.data &&
      refreshResult?.data?.token &&
      refreshResult?.data?.refToken
    ) {
      // const user = refreshResult.data.user;
      setCookie('token', JSON.stringify(refreshResult.data.token));
      setCookie('refresh', JSON.stringify(refreshResult.data.refToken));

      // store the new token
      api.dispatch(setUserInfo(refreshResult.data.user));
      // retry original query with new token
      return await baseQuery(args, api, extraOptions);
    }
    deleteAllCookies();
    api.dispatch({ type: 'logout' });
    window.history.pushState('', '', '/sign-in');
  }
  if (result.error && result.error.status === 403) {
    window.history.pushState('', '', '/dashboard');
  }
  return result;
};
// initialize an empty api service that we'll inject endpoints into later as needed
export const createApiInstance = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
export default createApiInstance;