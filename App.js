import {React, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {MyContextControllerProvider} from './context';
import Router from './screens/Router';
import '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AddFoods from './screens/Add';
import EditFoods from './screens/Edit';
import LoginScreen from './screens/LoginScreen';

const Stack = createStackNavigator();
const App = () => {
 

  //   await USERS.doc(admin.email).onSnapshot((u) => {
  //     if (u && u.exists) {
  //       console.log("User already exists!");
  //     } else {
  //       auth()
  //         .createUserWithEmailAndPassword(admin.email, admin.password)
  //         .then(() =>
  //           USERS.doc(admin.email)
  //             .set(admin)
  //             .then(() => console.log("Add new user admin!"))
  //         );
  //     }
  //   })

  // }
  // useEffect(() => {
  //   initial()
  // }, [])
  return (
    <MyContextControllerProvider>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </MyContextControllerProvider>
    // <MyContextControllerProvider>
    //   <NavigationContainer>
    //     <LoginScreen />
    //   </NavigationContainer>
    // </MyContextControllerProvider>
  );
};
export default App;
