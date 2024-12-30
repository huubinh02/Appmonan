import React, { useEffect, useState } from 'react';
import { View, Text, Image, Alert, TextInput, Pressable, FlatList } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconMT from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const FoodsDetail = ({ route }) => {
    // Extract route params safely with fallback defaults
    const { name = '', ingredient = '', instruct = '', imageUrl = '', foods = {} } = route.params || {};
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [user, setUser] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(currentUser => {
            setUser(currentUser);
        });
        return subscriber;
    }, []);

    // Fetch comments from Firestore
    const fetchComments = async () => {
        try {
            const commentsRef = firestore().collection('comments').doc(name).collection('comments');
            const querySnapshot = await commentsRef.orderBy('timestamp', 'desc').get();
            const fetchedComments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setComments(fetchedComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // Add a new comment
    const handleAddComment = async () => {
        try {
            if (user) {
                const commentsRef = firestore().collection('comments').doc(name).collection('comments');
                await commentsRef.add({
                    userEmail: user.email,
                    comment: comment,
                    timestamp: firestore.FieldValue.serverTimestamp(),
                });
                setComment('');
                fetchComments();
            } else {
                Alert.alert('Thông báo', 'Bạn cần đăng nhập để bình luận!');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Delete a comment
    const handleDeleteComment = async (commentId) => {
        try {
            await firestore().collection('comments').doc(name).collection('comments').doc(commentId).delete();
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    // Edit a comment
    const handleEditComment = (commentId, currentComment) => {
        setEditingCommentId(commentId);
        setEditedComment(currentComment);
    };

    const handleUpdateComment = async (commentId) => {
        try {
            await firestore().collection('comments').doc(name).collection('comments').doc(commentId).update({
                comment: editedComment,
            });
            setEditingCommentId(null);
            setEditedComment('');
            fetchComments();
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    // Add to favorites
    const handleLike = async () => {
        try {
            if (user) {
                const favoritesRef = firestore().collection('favorites');
                await favoritesRef.add({
                    userEmail: user.email,
                    name: name,
                    imageUrl: imageUrl,
                    ingredient: ingredient,
                    instruct: instruct,
                });
                Alert.alert('Thông báo!', 'Đã thêm vào yêu thích!');
            } else {
                Alert.alert('Thông báo', 'Bạn cần đăng nhập để thêm vào yêu thích!');
            }
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    if (!name || !ingredient || !instruct || !imageUrl) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'red', fontSize: 16 }}>Lỗi: Dữ liệu không hợp lệ!</Text>
            </View>
        );
    }

    return (
        <View style={{ backgroundColor: '#fff', height: '100%' }}>
            <ScrollView style={{ height: '89%' }}>
                <Image
                    source={{ uri: imageUrl }}
                    style={{ width: '100%', height: 200, borderRadius: 10, margin: 10 }}
                />
                <View style={{ padding: 10 }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black' }}>{name}</Text>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>Nguyên liệu:</Text>
                    <Text style={{ fontSize: 16, color: 'black' }}>{ingredient}</Text>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>Hướng dẫn thực hiện:</Text>
                    <Text style={{ fontSize: 16, color: 'black' }}>{instruct}</Text>
                </View>

                {/* Display comments */}
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{item.userEmail}</Text>
                            {editingCommentId === item.id ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextInput
                                        style={{
                                            flex: 1,
                                            borderWidth: 1,
                                            borderColor: '#ccc',
                                            borderRadius: 5,
                                            padding: 5,
                                            marginRight: 10,
                                        }}
                                        value={editedComment}
                                        onChangeText={setEditedComment}
                                    />
                                    <Pressable onPress={() => handleUpdateComment(item.id)}>
                                        <Text style={{ color: 'blue' }}>Cập nhật</Text>
                                    </Pressable>
                                </View>
                            ) : (
                                <>
                                    <Text>{item.comment}</Text>
                                    {user && user.email === item.userEmail && (
                                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                            <Pressable
                                                onPress={() => handleDeleteComment(item.id)}
                                                style={{ marginRight: 10 }}
                                            >
                                                <Text style={{ color: 'red' }}>Xoá</Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => handleEditComment(item.id, item.comment)}
                                            >
                                                <Text style={{ color: 'blue' }}>Chỉnh sửa</Text>
                                            </Pressable>
                                        </View>
                                    )}
                                </>
                            )}
                        </View>
                    )}
                />
            </ScrollView>
            <View>
                {user && (
                    <>
                        <TouchableOpacity
                            style={{
                                padding: 15,
                                backgroundColor: '#FFB90F',
                                borderRadius: 15,
                                margin: 10,
                            }}
                            onPress={handleLike}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <IconMT name="heart" size={25} color="#fff" />
                                <Text
                                    style={{
                                        marginLeft: 5,
                                        fontWeight: 'bold',
                                        fontSize: 15,
                                        color: '#fff',
                                    }}
                                >
                                    Thêm vào yêu thích
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                            <TextInput
                                style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 5,
                                    padding: 10,
                                    marginRight: 10,
                                }}
                                placeholder="Nhập bình luận..."
                                value={comment}
                                onChangeText={setComment}
                            />
                            <Pressable
                                style={{ padding: 10, backgroundColor: '#FFB90F', borderRadius: 5 }}
                                onPress={handleAddComment}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Gửi</Text>
                            </Pressable>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
};

export default FoodsDetail;
