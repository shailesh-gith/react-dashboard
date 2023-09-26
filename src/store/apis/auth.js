import createApiInstance from "./createAPiInstance";

const extendedApi = createApiInstance.injectEndpoints({
  endpoints: (build) => ({
    signIn: build.mutation({
      query(body) {
        return {
          url: '/auth/signin',
          method: 'POST',
          body,
        };
      },
    }),
    signUp: build.mutation({
      query(body) {
        return {
          url: '/auth/register',
          method: 'POST',
          body,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useSignInMutation,
  useSignUpMutation,
} = extendedApi;