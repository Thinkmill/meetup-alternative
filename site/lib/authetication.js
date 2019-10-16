import React, { createContext, useContext, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

/**
 * AuthContext
 * -----------
 * This is the base react context instance. It should not be used
 * directly but is exported here to simplify testing.
 */
export const AuthContext = createContext();

/**
 * useAuth
 * -------
 * A hook which provides access to the AuthContext
 */
export const useAuth = () => useContext(AuthContext);

const userFragment = `
  id
`;

/**
 * AuthProvider
 * ------------
 * AuthProvider is a component which keeps track of the user's
 * authenticated state and provides methods for managing the auth state.
 */
export const AuthProvider = ({ children, initialUserValue }) => {
  const isInitialising = useRef(true);

  const [signIn] = useMutation(
    gql`
    mutation signin($email: String, $password: String) {
      authenticateUserWithPassword(email: $email, password: $password) {
        item {
          ${userFragment}
        }
      }
    }
  `,
    { fetchPolicy: 'no-cache' }
  );

  const [signOut] = useMutation(
    gql`
      mutation {
        unauthenticateUser {
          success
        }
      }
    `,
    { fetchPolicy: 'no-cache' }
  );

  const { loading, error, data } = useQuery(
    gql`
    query {
      authenticatedUser {
        ${userFragment}
      }
    }
  `,
    {
      fetchPolicy: 'no-cache',
    }
  );

  const { authenticatedUser } = data || {};

  if (!loading) isInitialising.current = false;

  let user = isInitialising.current ? initialUserValue : authenticatedUser;

  const signin = async ({ email, password }) => {
    const {
      data: { authenticateUserWithPassword },
      error,
    } = await signIn({
      variables: {
        email,
        password,
      },
    });

    if (error) {
      throw error;
    }

    if (authenticateUserWithPassword && authenticateUserWithPassword.item) {
      user = authenticateUserWithPassword.item;
    }
  };

  const signout = async () => {
    const {
      data: { unauthenticateUser },
      error,
    } = await signOut();

    if (error) {
      throw error;
    }

    if (unauthenticateUser && unauthenticateUser.success) {
      user = null;
    }
  };

  const value = {
    isInitialising: isInitialising.current,
    user,
    isAuthenticated: !!user,
    isLoading: loading,
    signin,
    signout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
