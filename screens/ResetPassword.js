import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Alert} from 'react-native';
import {Text, TextInput} from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const Reset = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [errorState, setErrorState] = useState('');

  const handleSendPasswordResetEmail = () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email!');
      return;
    }

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert(
          'Thông báo',
          'Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.',
          [{text: 'OK', onPress: () => navigation.navigate('Login')}],
        );
      })
      .catch(error => {
        let errorMessage = '';

        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Email không hợp lệ!';
            break;
          case 'auth/user-not-found':
            errorMessage = 'Không tìm thấy tài khoản với email này!';
            break;
          default:
            errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại sau!';
            break;
        }

        setErrorState(errorMessage);
        Alert.alert('Lỗi', errorMessage);
      });
  };

  const img =
    'https://png.pngtree.com/template/20190522/ourmid/pngtree-cooking-logo-design-inspiration-image_202856.jpg';

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={{uri: img}} />

      <TextInput
        style={styles.textInput}
        label="Nhập vào Email*"
        value={email}
        underlineColor="transparent"
        onChangeText={email => setEmail(email)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        onPress={handleSendPasswordResetEmail}
        style={styles.textButton}>
        <Text style={styles.buttonText}>Yêu cầu đặt lại mật khẩu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.backButton}>
        <Text style={styles.backButtonText}>Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 80,
  },
  textInput: {
    width: '90%',
    margin: 10,
    borderRadius: 20,
  },
  textButton: {
    width: '90%',
    margin: 10,
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#FFB90F',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFB90F',
  },
  logo: {
    width: 100,
    height: 300,
    marginBottom: -20,
  },
});

export default Reset;
