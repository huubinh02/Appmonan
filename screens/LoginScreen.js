import {useState, useCallback, useEffect} from 'react';
import {Pressable, StyleSheet, View, Image, Alert} from 'react-native';
import {useMyContextController, login} from '../context/index';
import {Button, IconButton, Text, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [controller, dispatch] = useMyContextController();
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async () => {
    try {
      await login(dispatch, email, password);
      setEmail('');
      setPassword('');
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
      Alert.alert('Thông báo', 'Sai thông tin đăng nhập!');
    }
  };

  const img =
    'https://png.pngtree.com/template/20190522/ourmid/pngtree-cooking-logo-design-inspiration-image_202856.jpg';
  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'white',
        paddingBottom: 80,
      }}>
      <Image
        style={styles.Logo}
        source={{
          uri: img,
        }}
      />
      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          alignSelf: 'center',
          color: '#FFB90F',
        }}>
        LOGIN
      </Text>
      <TextInput
        style={styles.textInput}
        placeholder="Email*"
        value={email}
        onChangeText={text => setEmail(text)}
        underlineColor="transparent"
      />
      <TextInput
        style={styles.textInput}
        placeholder="Mật khẩu*"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry={!showPassword}
        underlineColor="transparent"
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye' : 'eye-off'}
            onPress={toggleShowPassword}
          />
        }
      />
      <Pressable mode="contained" onPress={onSubmit} style={styles.textButton}>
        <Text
          style={{
            color: '#fff',
            fontWeight: 'bold',
            alignSelf: 'center',
            fontSize: 18,
          }}>
          Đăng Nhập
        </Text>
      </Pressable>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 10,
        }}>
        <Pressable
          onPress={() => navigation.navigate('SignUp')}
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: 10,
            flexDirection: 'row',
            flex: 1,
          }}>
          <Text style={{fontSize: 18, fontWeight: 'bold', color: '#FFB90F'}}>
            Đăng ký tài khoản
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Reset')}
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: 10,
          }}>
          <Text style={{fontSize: 17, fontWeight: 'bold', color: '#FFB90F'}}>
            Quên mật khẩu ?
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    margin: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  textButton: {
    margin: 10,
    padding: 15,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#FFB90F',
  },
  Logo: {
    width: 100,
    height: 300,
    marginBottom: 1,
    alignSelf: 'center',
    marginBottom: -20,
  },
});
export default LoginScreen;
