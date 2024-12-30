import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image,} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconMT from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFirestore, collection, query, onSnapshot, where, doc, deleteDoc, getDocs, updateDoc,} from '@react-native-firebase/firestore';
import {ScrollView} from 'react-native-virtualized-view';
import auth from '@react-native-firebase/auth';

const LikeFoods = ({navigation}) => {
  const currentUser = auth().currentUser;
  const [initializing, setInitializing] = useState(true);
  const [foods, setFoods] = useState([]);
  const [foodsList, setFoodsList] = useState([]);
  const [showLike, setShowLike] = useState(false);
  const [deletedFoods, setDeletedFoods] = useState([]);

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser.email);
    }
  }, [currentUser]);
  
  const onAuthStateChanged = user => {
    setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const db = getFirestore();

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const foodsRef = collection(db, 'favorites');
    const userEmailCondition = where('userEmail', '==', currentUser.email);
    const filteredQuery = query(foodsRef, userEmailCondition);

    const unsubscribe = onSnapshot(filteredQuery, querySnapshot => {
      const uniqueFoodsSet = new Set(); // Use a Set to keep track of unique food names
      const foodsList = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        if (
          data &&
          data.name &&
          !uniqueFoodsSet.has(data.name) &&
          !deletedFoods.includes(doc.id)
        ) {
          uniqueFoodsSet.add(data.name);
          const foodsData = {...data, id: doc.id};
          foodsList.push(foodsData);
        }
      });

      setFoods(foodsList);
      setFoodsList(foodsList);
    });

    return () => unsubscribe();
  }, [db, currentUser, deletedFoods]);

  const handleDetails = foods => {
    navigation.navigate('FoodsDetail', {
      name: foods.name,
      ingredient: foods.ingredient,
      instruct: foods.instruct,
      imageUrl: foods.imageUrl,
    });
  };

  const handleDeleteFavorite = async itemId => {
    try {
      // // Xoá món ăn khỏi cơ sở dữ liệu Firebase
      // const docRef = doc(db, 'favorites', currentUser.email, 'foods', itemId);
      // await deleteDoc(docRef);

      await db.collection('favorites').doc(itemId).delete();

      // Cập nhật danh sách món ăn đã xoá
      setDeletedFoods([...deletedFoods, itemId]);

      // Lọc lại danh sách món ăn và loại bỏ món ăn đã xoá
      const updatedFoodsList = foodsList.filter(item => item.id !== itemId);
      setFoodsList(updatedFoodsList);

      Alert.alert('', 'Đã bỏ thích!');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <View style={{backgroundColor: '#fff', height: '100%'}}>
      <ScrollView>
        <FlatList
          style={{marginBottom: 150}}
          data={foodsList}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={{flexDirection: 'row', margin: 5}}>
              <View style={styles.item}>
                <TouchableOpacity onPress={() => handleDetails(item)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {item.imageUrl !== '' ? (
                        <Image
                          source={{uri: item.imageUrl}}
                          style={{
                            width: 120,
                            height: 135,
                            objectFit: 'cover',
                            borderRadius: 20,
                          }}
                        />
                      ) : null}
                      <View style={{flexDirection: 'column', marginLeft: 10}}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#FF6666',
                            flexWrap: 'wrap',
                            width: 180,
                          }}>
                          {item.name}
                        </Text>
                      </View>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                      <TouchableOpacity
                        style={{
                          padding: 5,
                          backgroundColor: '#fff',
                          borderRadius: 100,
                          margin: 5,
                        }}
                        onPress={() => handleDeleteFavorite(item.id)}>
                        <IconMT
                          name={showLike ? 'heart' : 'heart-outline'}
                          size={25}
                          color="red"
                        />
                      </TouchableOpacity>
                    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
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

export default LikeFoods;
