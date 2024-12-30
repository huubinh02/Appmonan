import 'react-native-gesture-handler';
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconMT from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFirestore, collection, query, onSnapshot, doc, updateDoc } from '@react-native-firebase/firestore';
import { createStackNavigator } from '@react-navigation/stack';
import AddFoods from './Add';
import { Searchbar } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-virtualized-view';
import { MyContextControllerProvider, useMyContextController, MyContext } from '../context';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native'; // Import hook useNavigation

const ApprovedFoodsScreen = () => {
    const navigation = useNavigation(); // Sử dụng hook useNavigation để lấy đối tượng navigation
    const currentUser = auth().currentUser;
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);
    const [foods, setFoods] = useState([]); // Chỉ sử dụng một biến foods để lưu trữ danh sách món ăn đã duyệt

    const { login } = useMyContextController();
    const [showLike, setShowLike] = useState(false);

    const toggleShowLike = () => {
        setShowLike(!showLike);
    };

    useEffect(() => {
        if (currentUser) {
            console.log(currentUser.email);
        }
    }, [currentUser]);

    const onAuthStateChanged = (user) => {
        setUser(user);
        if (initializing) setInitializing(false);
    };

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    const db = getFirestore();
    useEffect(() => {
        Icon.loadFont();

        const foodsRef = collection(db, 'foods');
        const unsubscribe = onSnapshot(query(foodsRef), (querySnapshot) => {
            const foodsList = [];
            if (querySnapshot) {
                querySnapshot.forEach((doc) => {
                    // Lọc chỉ những món ăn đã duyệt
                    if (doc && doc.data() && doc.data().approve === true) {
                        const foodsData = { ...doc.data(), id: doc.id };
                        foodsList.push(foodsData);
                    }
                });
            }

            // Lưu danh sách món ăn đã duyệt vào state foods
            setFoods(foodsList);
        });
        return () => unsubscribe();
    }, [db]);

    const handleDetails = (foods) => {
        navigation.navigate('FoodsDetail', {
            name: foods.name,
            ingredient: foods.ingredient,
            instruct: foods.instruct,
            imageUrl: foods.imageUrl,
        });
    };

    const handleDelete = (itemId) => {
        Alert.alert(
            'Xác nhận xoá',
            'Bạn có chắc chắn muốn xoá không?',
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'Xoá',
                    onPress: async () => {
                        try {
                            await db.collection('foods').doc(itemId).delete();
                            Alert.alert('Thông báo !', 'Món đã được xóa thành công!');
                        } catch (error) {
                            console.error('Lỗi khi xóa món:', error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={{ backgroundColor: '#fff', height: '100%' }}>
            <View style={{ width: '95%', alignItems: 'center', alignSelf: 'center', margin: 10 }}></View>
            <ScrollView>
                <FlatList
                    style={{ marginBottom: 150 }}
                    data={foods} // Sử dụng foods để hiển thị danh sách món ăn đã duyệt
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', margin: 5 }}>
                            <View style={styles.item}>
                                <TouchableOpacity onPress={() => handleDetails(item)}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            {item.imageUrl !== '' ? (
                                                <Image
                                                    source={{ uri: item.imageUrl }}
                                                    style={{
                                                        width: 120,
                                                        height: 135,
                                                        objectFit: 'cover',
                                                        borderRadius: 20,
                                                    }}
                                                />
                                            ) : null}
                                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                                <Text
                                                    style={{
                                                        fontSize: 18,
                                                        fontWeight: 'bold',
                                                        color: '#FF6666',
                                                        flexWrap: 'wrap',
                                                        width: 150,
                                                    }}
                                                >
                                                    {item.name}
                                                </Text>
                                            </View>
                                        </View>

                                        {user && user.email === 'ntthao6722@gmail.com' ? (
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginRight: 10,
                                                }}
                                            >
                                                <TouchableOpacity
                                                    style={{
                                                        padding: 5,
                                                        backgroundColor: 'red',
                                                        borderRadius: 100,
                                                        margin: 5,
                                                    }}
                                                    onPress={() => handleDelete(item.id)}
                                                >
                                                    <Icon name="cancel" size={24} color="#fff" />
                                                </TouchableOpacity>
                                            </View>
                                        ) : null}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    item: {
        width: '100%',
        borderWidth: 1,
        padding: 5,
        height: 155,
        borderColor: '#FFB90F',
        borderRadius: 20,
        justifyContent: 'center',
    },
});

export default ApprovedFoodsScreen;
