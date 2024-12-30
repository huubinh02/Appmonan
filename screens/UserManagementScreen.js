import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Button,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const UserManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .onSnapshot(snapshot => {
        const userData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userData);
      });
    return () => unsubscribe();
  }, []);

  const showUserDetails = async user => {
    const userDoc = await firestore().collection('users').doc(user.id).get();
    if (userDoc.exists) {
      setSelectedUser({id: user.id, ...userDoc.data()});
      setModalVisible(true);
    } else {
      Alert.alert('Lỗi!', 'Không tìm thấy thông tin người dùng.');
    }
  };

  const deleteUser = id => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa người dùng này?',
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Xóa',
          onPress: async () => {
            try {
              // Xóa người dùng từ Firestore
              await firestore().collection('users').doc(id).delete();

              // Xóa người dùng từ Firebase Auth
              const user = auth().currentUser;
              if (user && user.uid === id) {
                await user.delete();
              }

              // Cập nhật danh sách người dùng
              setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
            } catch (error) {
              console.error('Lỗi khi xóa người dùng:', error);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const renderUser = ({item}) => (
    <TouchableOpacity
      onPress={() => showUserDetails(item)}
      style={styles.userItem}>
      <Text style={styles.userInfo}>
        {item.username} ({item.email})
      </Text>
      <TouchableOpacity
        onPress={() => deleteUser(item.id)}
        style={styles.deleteButton}>
        <Text style={styles.deleteText}>Xóa</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý Tài khoản Người dùng</Text>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={item => item.id}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              {selectedUser && (
                <>
                  <Text style={styles.modalTitle}>Thông tin Người dùng</Text>
                  <Text>
                    Tên đăng nhập: {selectedUser.username || 'Chưa cập nhật'}
                  </Text>
                  <Text>Email: {selectedUser.email}</Text>
                  <Text>
                    Số điện thoại: {selectedUser.phoneNumber || 'Chưa cập nhật'}
                  </Text>
                  <Text>
                    Địa chỉ: {selectedUser.address || 'Chưa cập nhật'}
                  </Text>
                  <Text>Ngày sinh: {selectedUser.dob || 'Chưa cập nhật'}</Text>
                  <Text>Vai trò: {selectedUser.role || 'user'}</Text>
                </>
              )}
            </ScrollView>
            <Button title="Đóng" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  userInfo: {
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default UserManagementScreen;
