import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { getCurrentUser, login } from 'src/services/authService';

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const getStoredUser = () => {
    try {
      const rawUser = window.localStorage.getItem('user');
      return rawUser ? JSON.parse(rawUser) : null;
    } catch (err) {
      return null;
    }
  };

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;
    let user = null;

    try {
      const token = window.localStorage.getItem('token');
      if (!token) {
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('authenticated');
        window.sessionStorage.removeItem('authenticated');
        isAuthenticated = false;
      } else {
        const meResponse = await getCurrentUser();
        user = meResponse?.user || null;
        isAuthenticated = !!user;

        if (user) {
          window.localStorage.setItem('user', JSON.stringify(user));
          window.localStorage.setItem('authenticated', 'true');
          window.sessionStorage.setItem('authenticated', 'true');
        }
      }
    } catch (err) {
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('authenticated');
      window.sessionStorage.removeItem('authenticated');
      window.localStorage.removeItem('token');
      user = null;
      isAuthenticated = false;
    }

    if (isAuthenticated && user) {

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const skip = () => {
    try {
      window.localStorage.setItem('authenticated', 'true');
      window.sessionStorage.setItem('authenticated', 'true');
    } catch (err) {
      console.error(err);
    }

    const user = {
      id: '5e86809283e28b96d2d38537',
      avatar: '/assets/avatars/avatar-anika-visser.png',
      name: 'Anika Visser',
      email: 'anika.visser@devias.io'
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    });
  };

  const signIn = async (email, password) => {
    const response = await loginService(email, password);

    if (!response.status) {
      throw new Error('Please check your email and password');
    }

    try {
      window.localStorage.setItem('authenticated', 'true');
      window.sessionStorage.setItem('authenticated', 'true');
    } catch (err) {
      console.error(err);
    }

    const user = response.response?.user || getStoredUser() || {
      id: '',
      avatar: '/assets/avatars/avatar-anika-visser.png',
      name: 'Usuario',
      email
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    });
  };

  const signUp = async (email, name, password) => {
    throw new Error('Sign up is not implemented');
  };

  const signOut = () => {
    try {
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('authenticated');
      window.sessionStorage.removeItem('authenticated');
      window.localStorage.removeItem('token');
    } catch (err) {
      console.error('Error limpiando almacenamiento:', err);
    }

    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  const loginService = async (email, passoword) => {
    try {
      const response = await login(email, passoword);
      return { status: true, response };
    } catch (err) {
      return { status: false, error: err.response.data.error };
    }

  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
