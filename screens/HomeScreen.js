import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import LoginScreen from './LoginScreen';
import {HomeScreen} from '../screens/HomeScreen';
import Foods from './Foods';
import AddFoods from './Add';
import Logout from './Logout';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Drinks from './Drinks';
import LikeFoods from './LikeFoods';
import Approve from './Approve';
import List from './List';
import AdminScreen from './AdminScreen';
const Tab = createBottomTabNavigator();
const currentUser = auth().currentUser;
const getTabBarIcon =
  icon =>
  ({tintColor}) =>
    <Icon name={icon} size={26} style={{color: '#FF8C00'}} />;

const Tabs = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (currentUser) {
      // console.log(currentUser.email);
    }
  }, [currentUser]);
  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);
  return (
    <Tab.Navigator
      initialRouteName="Foods"
      barStyle={{backgroundColor: '#FF8C00'}}
      labeled={false}
      activeTintColor={{color: '#FF8C00'}}
      inactiveColor={{color: '#FF8C00'}}>
      <Tab.Screen
        name="Danh sách món"
        component={List}
        options={{
          tabBarIcon: getTabBarIcon('menu-book'),
        }}
      />
      <Tab.Screen
        name="QL Món ăn"
        component={Foods}
        options={{
          tabBarIcon: getTabBarIcon('restaurant-menu'),
        }}
      />

      <Tab.Screen
        name="QL Đồ uống"
        component={Drinks}
        options={{
          tabBarIcon: getTabBarIcon('local-cafe'),
        }}
      />

      {user && user.email !== 'ntthao6722@gmail.com' ? (
        <Tab.Screen
          name="Yêu thích"
          component={LikeFoods}
          options={{
            tabBarIcon: getTabBarIcon('favorite'),
          }}
        />
      ) : null}
      {user && user.email === 'ntthao6722@gmail.com' ? (
        <Tab.Screen
          name="Quản lý bài đăng"
          component={AdminScreen}
          options={{
            tabBarIcon: getTabBarIcon('wysiwyg'),
          }}
        />
      ) : null}

      <Tab.Screen
        name="Đăng xuất"
        component={Logout}
        options={{
          tabBarIcon: getTabBarIcon('logout'),
        }}
      />
    </Tab.Navigator>
  );
};
export default Tabs;
