import React, {useState} from 'react';
import {View, StyleSheet, Alert, Pressable, Text, Image} from 'react-native';
import {TextInput} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignUp = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passrp, setPassrp] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSignUp = async () => {
    if (password !== passrp) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }

    try {
      const {user} = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      await firestore().collection('users').doc(user.email).set({
        username: username,
        email: user.email,
        age: '0',
        address: 'abc',
        role: 'user',
      });

      Alert.alert('Thông báo', 'Đăng ký thành công!');
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi trong quá trình đăng ký');
    }
  };

  const img =
    'https://png.pngtree.com/template/20190522/ourmid/pngtree-cooking-logo-design-inspiration-image_202856.jpg';

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={{uri: img}} />
      <Text style={styles.title}>SIGNUP</Text>

      <TextInput
        style={styles.textInput}
        label="Tên đăng nhập*"
        value={username}
        onChangeText={text => setUsername(text)}
        underlineColor="transparent"
      />

      <TextInput
        style={styles.textInput}
        label="Email*"
        value={email}
        onChangeText={text => setEmail(text)}
        underlineColor="transparent"
      />

      <TextInput
        style={styles.textInput}
        label="Mật khẩu*"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye' : 'eye-off'}
            onPress={toggleShowPassword}
          />
        }
        underlineColor="transparent"
      />

      <TextInput
        style={styles.textInput}
        label="Nhập lại mật khẩu*"
        value={passrp}
        onChangeText={text => setPassrp(text)}
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye' : 'eye-off'}
            onPress={toggleShowPassword}
          />
        }
        underlineColor="transparent"
      />

      <View style={styles.buttonContainer}>
        <Pressable style={styles.textButton} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Đăng Ký</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => navigation.navigate('Login')}
        style={styles.backButton}>
        <Text style={styles.backButtonText}>Quay lại đăng nhập</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingBottom: 80,
  },
  logo: {
    width: 100,
    height: 300,
    alignSelf: 'center',
    marginBottom: -20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#FFB90F',
  },
  textInput: {
    margin: 10,
    borderRadius: 20,
  },
  buttonContainer: {
    justifyContent: 'center',
    padding: 10,
  },
  textButton: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#FFB90F',
  },
  buttonText: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    alignItems: 'flex-end',
    marginRight: 10,
    padding: 10,
  },
  backButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFB90F',
  },
});

export default SignUp;
