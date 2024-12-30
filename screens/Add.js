import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, Alert, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

const AddFoods = ({ navigation }) => { 
  const [foods, setFoods] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [instruct, setInstruct] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const currentUser = auth().currentUser;

  useEffect(() => {
    if (currentUser) {
      console.log("Current user email:", currentUser.email);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await firestore().collection('category').get();
        const categoriesList = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching categories: ', error);
      }
    };
    fetchCategories();
  }, []);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets[0].uri) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleAddFoods = async () => {
    if (!foods || !ingredient || !instruct || !category || !imageUri) {
      Alert.alert("Thông báo!", "Vui lòng nhập đầy đủ!");
      return;
    }

    try {
      const imageUrl = await uploadImage(imageUri);
      const selectedCategory = categories.find(cat => cat.id === category);
      const categoryName = selectedCategory ? selectedCategory.CategoryName : '';

      await firestore().collection('foods').add({
        name: foods,
        ingredient,
        instruct,
        imageUrl,
        status: 'unlike', 
        category: categoryName,
        approve: false,
        email: currentUser?.email || 'Unknown'
      }); 

      Alert.alert("Success", "Food item added successfully!");
      navigation.navigate('Home');
      setFoods('');
      setImageUri(null);
      setIngredient('');
      setInstruct('');
    } catch (error) {
      console.error('Error adding food: ', error);
      Alert.alert("Error", "There was a problem adding the food item.");
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = storage().ref(`Images/${foods}-${Date.now()}`);
      await storageRef.put(blob);
      return await storageRef.getDownloadURL();
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  };

  return (
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
      <ScrollView>
        <TextInput
          style={{ margin: 10, borderRadius: 10 }}
          placeholder="Nhập tên món ăn"
          value={foods}
          onChangeText={text => setFoods(text)}
        />
        <TextInput
          style={{ margin: 10, borderRadius: 10 }}
          placeholder="Nhập nguyên liệu"
          value={ingredient}
          onChangeText={text => setIngredient(text)}
          multiline={true}
          numberOfLines={8}
        />
        <TextInput
          style={{ margin: 10, borderRadius: 10 }}
          placeholder="Nhập hướng dẫn thực hiện"
          value={instruct}
          onChangeText={text => setInstruct(text)}
          multiline={true}
          numberOfLines={10}
        />
      </ScrollView>
      <View style={{ margin: 10, borderRadius: 10, borderColor: 'gray', borderWidth: 1 }}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="Chọn loại món ăn" value={null} key="blank" />
          {categories.map(cat => (
            <Picker.Item key={cat.id} label={cat.CategoryName} value={cat.id} />
          ))}
        </Picker>
      </View>

      <Pressable onPress={pickImage} style={{ padding: 15, alignItems: 'center', backgroundColor: 'transparent', margin: 10, borderRadius: 10, borderWidth: 1, borderColor: 'gray' }}>
        <Text style={{ color: '#333', fontSize: 15 }}>Chọn ảnh món ăn</Text>
      </Pressable>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 400, height: 200, borderRadius: 10, margin: 10 }}
        />
      )}

      <View style={{ justifyContent: 'center', padding: 10 }}>
        <Pressable
          onPress={handleAddFoods}
          style={{
            backgroundColor: "#FFB90F",
            alignItems: 'center',
            padding: 15,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>Thêm</Text>
        </Pressable>
      </View>
    </View>
  );
};

  export default AddFoods;