import {createContext, useContext, useReducer, useMemo, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Formik} from 'formik';
import * as yup from 'yup';
// import PropTypes from "prop-types";
// Create MyContext
export const MyContext = createContext();
// Setting custom name for the context
MyContext.displayName = 'MyContextContext';
// React reducer

function reducer(state, action) {
  switch (action.type) {
    case 'USER_LOGIN': {
      return {...state, user: action.value};
    }
    case 'USER_LOGOUT': {
      return {...state, user: null};
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
// React context provider
function MyContextControllerProvider({children}) {
  const initialState = {
    userLogin: {
      name: 'admin',
      phone: '0969215279',
      address: 'Binh Duong',
      email: 'ntthao6722@gmail.com',
      password: '123456',
      role: 'admin',
    },
  };

  const [controller, dispatch] = useReducer(reducer, initialState);

  const logout = async () => {
    try {
      await auth().signOut();
      dispatch({type: 'USER_LOGOUT'});
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const value = useMemo(
    () => [controller, dispatch, logout],
    [controller, dispatch],
  );
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}
//React custom hook for using context
function useMyContextController() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error(
      'useMyContextController should be used inside the MyContextControllerProvider.',
    );
  }
  return context;
}

const USERS = firestore().collection('users');
const login = async (dispatch, email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredential.user;
    const userDoc = await USERS.doc(email).get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log('Đăng Nhập Thành Công với user:', userData);
      dispatch({type: 'USER_LOGIN', value: userData});
    } else {
    }
  } catch (error) {
    throw error;
  }
};

export {MyContextControllerProvider, useMyContextController, login};
