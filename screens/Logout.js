import React, {useEffect, useState} from 'react';
import { View, StyleSheet, Text, Pressable, ActivityIndicator, Image, Alert, TextInput, ScrollView,} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const Logout = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUri, setAvatarUri] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState(''); // Ngày sinh

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const userEmail = currentUser.email;
        setUser(currentUser);
        setAvatarUri(
          currentUser.photoURL || 'https://i.imgur.com/FeNdg6J.jpeg',
        );

        const userDoc = await firestore()
          .collection('users')
          .doc(userEmail)
          .get();
        if (userDoc.exists) {
          const data = userDoc.data();
          setDisplayName(
            currentUser.displayName || data.username || 'Người dùng',
          );
          setPhoneNumber(data.phoneNumber || '');
          setAddress(data.address || '');
          setDob(data.dob || '');
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const updateUserData = async (field, value) => {
    try {
      await firestore()
        .collection('users')
        .doc(user.email)
        .update({[field]: value});
    } catch (error) {
      console.error(`Lỗi khi cập nhật ${field}:`, error);
      Alert.alert('Lỗi!', `Không thể cập nhật ${field}.`);
    }
  };

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.didCancel) {
        return;
      }
      if (response.error) {
        console.log('ImagePicker Error:', response.error);
        return;
      }
      const selectedImageUri = response.assets[0].uri;
      setAvatarUri(selectedImageUri);
      await uploadAvatar(selectedImageUri);
    });
  };

  const uploadAvatar = async uri => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = storage().ref(`avatars/${user.uid}`);
      await storageRef.put(blob);
      const downloadURL = await storageRef.getDownloadURL();

      await auth().currentUser.updateProfile({photoURL: downloadURL});
      await firestore()
        .collection('users')
        .doc(user.email)
        .update({avatarUrl: downloadURL});

      Alert.alert('Thành công!', 'Ảnh đại diện đã được cập nhật.');
    } catch (error) {
      console.error('Lỗi khi tải ảnh đại diện:', error);
      Alert.alert('Lỗi!', 'Không thể cập nhật ảnh đại diện.');
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFB90F" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{uri: 'https://example.com/banner.jpg'}}
        style={styles.banner}
      />
      {user && (
        <View style={styles.infoContainer}>
          <Pressable onPress={pickImage}>
            <Image source={{uri: avatarUri}} style={styles.avatar} />
          </Pressable>

          <Text style={styles.label}>Họ và tên</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            onBlur={() => updateUserData('username', displayName)}
            placeholder="Tên hiển thị"
          />

          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            onBlur={() => updateUserData('phoneNumber', phoneNumber)}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Địa chỉ</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            onBlur={() => updateUserData('address', address)}
            placeholder="Địa chỉ"
          />

          <Text style={styles.label}>Ngày sinh</Text>
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={setDob}
            onBlur={() => updateUserData('dob', dob)}
            placeholder="Ngày sinh (DD/MM/YYYY)"
          />

          <Text style={styles.infoText}>Email: {user.email}</Text>
        </View>
      )}

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Đăng xuất</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: -50,
    borderWidth: 2,
    borderColor: 'white',
  },
  label: {
    fontSize: 16,
    color: '#333',
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    width: '100%',
  },
  infoText: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
  },
  logoutButton: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#FF6347',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Logout;
