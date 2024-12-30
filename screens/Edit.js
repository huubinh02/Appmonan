import React, {useState, useEffect} from 'react';
import {View, Text, Image, Pressable, Alert, ScrollView} from 'react-native';
import {TextInput} from 'react-native-paper';
import { getFirestore, collection, getDocs, updateDoc, doc,} from '@react-native-firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import storage from '@react-native-firebase/storage';

const EditFood = ({navigation, route}) => {
  const {foodId} = route.params;
  const [foods, setFoods] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [instruct, setInstruct] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const db = getFirestore();
        const categoriesSnapshot = await getDocs(collection(db, 'category'));
        const categoriesList = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching categories: ', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const db = getFirestore();
        const foodDoc = await doc(db, 'foods', foodId).get();
        const foodData = foodDoc.data();
        setFoods(foodData.name);
        setIngredient(foodData.ingredient);
        setInstruct(foodData.instruct);
        setCategory(foodData.category);
        setImageUri(foodData.imageUrl);
      } catch (error) {
        console.error('Error fetching food details: ', error);
      }
    };

    fetchFoodDetails();
  }, [foodId]);

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleEditFood = async () => {
    if (!foods || !ingredient || !instruct || !category || !imageUri) {
      Alert.alert('Thông báo!', 'Vui lòng nhập đầy đủ!');
      return;
    }

    try {
      const imageUrl = await uploadImage(imageUri);
      const db = getFirestore();
      const foodRef = doc(db, 'foods', foodId);
      const selectedCategory = categories.find(cat => cat.id === category);
      const CategoryName = selectedCategory
        ? selectedCategory.CategoryName
        : '';
      await updateDoc(foodRef, {
        name: foods,
        ingredient: ingredient,
        instruct: instruct,
        imageUrl: imageUrl,
        category: CategoryName,
        approve: false,
      });

      navigation.navigate('Home');
    } catch (error) {
      console.error('Error editing food: ', error);
    }
  };

  const uploadImage = async uri => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = storage().ref(`Images/${foods}-${Date.now()}`);
    await storageRef.put(blob);
    return await storageRef.getDownloadURL();
  };

  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <ScrollView>
        <TextInput
          style={{margin: 10, borderRadius: 10}}
          placeholder="Nhập tên món ăn"
          value={foods}
          onChangeText={setFoods}
        />
        <TextInput
          style={{margin: 10, borderRadius: 10}}
          placeholder="Nhập nguyên liệu"
          value={ingredient}
          onChangeText={setIngredient}
          multiline={true}
          numberOfLines={8}
        />
        <TextInput
          style={{margin: 10, borderRadius: 10}}
          placeholder="Nhập hướng dẫn thực hiện"
          value={instruct}
          onChangeText={setInstruct}
          multiline={true}
          numberOfLines={10}
        />

        <View
          style={{
            margin: 10,
            borderRadius: 10,
            borderColor: 'gray',
            borderWidth: 1,
          }}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}>
            <Picker.Item label="Chọn loại món ăn" value="" />
            {categories.map(cat => (
              <Picker.Item
                key={cat.id}
                label={cat.CategoryName}
                value={cat.id}
              />
            ))}
          </Picker>
        </View>

        <Pressable
          onPress={pickImage}
          style={{
            padding: 15,
            alignItems: 'center',
            backgroundColor: 'transparent',
            margin: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'gray',
          }}>
          <Text style={{color: '#333', fontSize: 15}}>Chọn ảnh món ăn</Text>
        </Pressable>

        {imageUri && (
          <Image
            source={{uri: imageUri}}
            style={{width: '95%', height: 100, borderRadius: 10, margin: 10}}
          />
        )}

        <View style={{justifyContent: 'center', padding: 10}}>
          <Pressable
            onPress={handleEditFood}
            style={{
              backgroundColor: '#FFB90F',
              alignItems: 'center',
              padding: 15,
              borderRadius: 10,
            }}>
            <Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}>
              Lưu
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditFood;
