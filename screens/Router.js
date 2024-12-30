import React from "react";
//import 'react-native-gesture-handler';
import { View, Text, StyleSheet } from "react-native";
import { useMyContextController } from "../context";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "./HomeScreen";
import firestore from '@react-native-firebase/firestore';
import AddFoods from "./Add";
import EditFoods from "../screens/Edit";
import Tabs from "./HomeScreen";
import Logout from "../screens/Logout";
import SignUp from "./SignUp";
import Foods from "./Foods";
import FoodsDetail from "../screens/Detail";
import Reset from "./ResetPassword";
import LikeFoods from "./LikeFoods";
import Approve from "./Approve";
import List from "./List";
import AdminScreen from "./AdminScreen";
import ApprovedFoodsScreen from "./ApprovedFoodsScreen";
import UserManagementScreen from "./UserManagementScreen";
const Stack = createStackNavigator();
const Router = () => {
    // const [controller, dispatch] = useMyContextController();
    // const { userLogin } = controller;
    // console.log(userLogin)
    return (
        // <Stack.Navigator independent={true}>
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}  />
            <Stack.Screen name="Home" component={HomeScreen}options={{ headerShown: false }}  />
            <Stack.Screen name="Foods" component={Foods}options={{ headerShown: false }}  />
            <Stack.Screen name="AddFoods" component={AddFoods} options={{ title: 'Thêm món mới'  }}/>
            <Stack.Screen name="FoodsDetail" component={FoodsDetail} options={{ title: 'Chi tiết món'  }}  />
            <Stack.Screen name="EditFoods" component={EditFoods} options={{ title: 'Chỉnh sửa món'  }}/>
            <Stack.Screen name="Logout" component={Logout} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
            <Stack.Screen name="Reset" component={Reset} options={{ headerShown: false }} />
            <Stack.Screen name="LikeFoods" component={LikeFoods} options={{ headerShown: false }} />
            <Stack.Screen name="AdminScreen" component={AdminScreen} options={{ title: 'Quản Lý'  }} />
            <Stack.Screen name="Approve" component={Approve} options={{ title: 'Duyệt bài'  }} />
            <Stack.Screen name="ApprovedFoodsScreen" component={ApprovedFoodsScreen} options={{ title: 'Đã duyệt bài'  }} />
            <Stack.Screen name="List" component={List} options={{ title: 'Danh sách món'  }} />
            <Stack.Screen
            name="UserManagementScreen"
            component={UserManagementScreen}
            options={{ title: 'Quản lý người dùng' }}
          />

        </Stack.Navigator>

    );
};
export default Router;