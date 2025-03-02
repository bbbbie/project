import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Image, Modal, ScrollView, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { RootStackScreenProps } from '../Navigation/RootNavigator';
import { LinearGradient } from 'expo-linear-gradient';

const BASE_URL = "http://192.168.1.17:9000";

interface Category {
  _id: string;
  name: string;
  images: string[];
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

const AdminPanel = ({ navigation }: RootStackScreenProps<'AdminPanel'>) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'category' | 'product' | 'manageCategories' | 'manageProducts' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState<string | null>(null);
  const [existingCategoryImage, setExistingCategoryImage] = useState<string | null>(null); // Lưu trữ ảnh cũ

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productImages, setProductImages] = useState<string[]>([]);
  const [storageOptions, setStorageOptions] = useState<string[]>(['']);
  const [colorOptions, setColorOptions] = useState<string[]>(['']);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
      }
      fetchCategories();
      fetchProducts();
    })();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/category/getAllCategories`);
      if (Array.isArray(response.data)) {
        setCategories(response.data);
        if (response.data.length > 0 && !selectedCategory) {
          setSelectedCategory(response.data[0]._id);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch categories');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/product/getAllProducts`);
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch products');
    }
  };

  const pickImage = async (setImage: (uri: string | null) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled && result.assets) {
      setImage(result.assets[0].uri);
    }
  };

  const pickProductImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
    });
    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setProductImages([...productImages, ...newImages].slice(0, 5));
    }
  };

  const handleCreateCategory = async () => {
    if (!categoryName) {
      Alert.alert('Error', 'Please provide a category name');
      return;
    }
    if (!editingId && !categoryImage) {
      Alert.alert('Error', 'Please provide an image for a new category');
      return;
    }

    const formData = new FormData();
    formData.append('name', categoryName);

    // Chỉ thêm image vào FormData nếu có ảnh mới được chọn
    if (categoryImage && categoryImage !== existingCategoryImage) {
      formData.append('image', { uri: categoryImage, type: 'image/jpeg', name: 'category_image.jpg' } as any);
    }

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/category/updateCategory/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Alert.alert('Success', 'Category updated successfully');
      } else {
        await axios.post(`${BASE_URL}/category/createCategory`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Alert.alert('Success', 'Category created successfully');
      }
      resetCategoryForm();
      fetchCategories();
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', editingId ? 'Failed to update category' : 'Failed to create category');
    }
  };

  const handleCreateProduct = async () => {
    if (!productName || !price || !description || !quantity || !selectedCategory || productImages.length === 0 || storageOptions.some(s => !s) || colorOptions.some(c => !c)) {
      Alert.alert('Error', 'Please fill all required fields and add at least one image, storage, and color');
      return;
    }
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('quantity', quantity);
    formData.append('category', selectedCategory);
    storageOptions.forEach((storage) => formData.append('storage[]', storage));
    colorOptions.forEach((color) => formData.append('color[]', color));
    productImages.forEach((image, index) => {
      formData.append('images', { uri: image, type: 'image/jpeg', name: `product_image_${index}.jpg` } as any);
    });

    try {
      await axios.post(`${BASE_URL}/product/createProduct`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Success', 'Product created successfully');
      resetProductForm();
      fetchProducts();
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create product');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/category/deleteCategory/${id}`);
      Alert.alert('Success', 'Category deleted successfully');
      fetchCategories();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete category');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/product/deleteProduct/${id}`);
      Alert.alert('Success', 'Product deleted successfully');
      fetchProducts();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete product');
    }
  };

  const resetCategoryForm = () => {
    setCategoryName('');
    setCategoryImage(null);
    setExistingCategoryImage(null); // Reset ảnh cũ
    setEditingId(null);
  };

  const resetProductForm = () => {
    setProductName('');
    setPrice('');
    setDescription('');
    setQuantity('');
    setProductImages([]);
    setStorageOptions(['']);
    setColorOptions(['']);
  };

  const openModal = (type: 'category' | 'product' | 'manageCategories' | 'manageProducts', id?: string) => {
    setModalType(type);
    setModalVisible(true);
    if (id && type === 'manageCategories') {
      const category = categories.find(cat => cat._id === id);
      if (category) {
        setCategoryName(category.name);
        setCategoryImage(category.images[0]); // Hiển thị ảnh hiện tại
        setExistingCategoryImage(category.images[0]); // Lưu ảnh cũ
        setEditingId(id);
      }
    }
  };

  const addStorageOption = () => setStorageOptions([...storageOptions, '']);
  const removeStorageOption = (index: number) => setStorageOptions(storageOptions.filter((_, i) => i !== index));
  const updateStorageOption = (index: number, value: string) => {
    const newStorage = [...storageOptions];
    newStorage[index] = value;
    setStorageOptions(newStorage);
  };

  const addColorOption = () => setColorOptions([...colorOptions, '']);
  const removeColorOption = (index: number) => setColorOptions(colorOptions.filter((_, i) => i !== index));
  const updateColorOption = (index: number, value: string) => {
    const newColors = [...colorOptions];
    newColors[index] = value;
    setColorOptions(newColors);
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <View style={styles.listItem}>
      <Image source={{ uri: item.images[0] }} style={styles.listImage} />
      <Text style={styles.listText}>{item.name}</Text>
      <View style={styles.buttonGroup}>
        <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.actionButton}>
          <Pressable onPress={() => openModal('manageCategories', item._id)}>
            <Text style={styles.buttonText}>Edit</Text>
          </Pressable>
        </LinearGradient>
        <LinearGradient colors={['#ff6f61', '#ff9a8b']} style={styles.actionButton}>
          <Pressable onPress={() => handleDeleteCategory(item._id)}>
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.listItem}>
      <Image source={{ uri: item.images[0] }} style={styles.listImage} />
      <Text style={styles.listText}>{item.name} - ${item.price}</Text>
      <View style={styles.buttonGroup}>
        <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.actionButton}>
          <Pressable>
            <Text style={styles.buttonText}>Edit</Text>
          </Pressable>
        </LinearGradient>
        <LinearGradient colors={['#ff6f61', '#ff9a8b']} style={styles.actionButton}>
          <Pressable onPress={() => handleDeleteProduct(item._id)}>
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#ff6f61', '#ff9a8b']} style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Admin Panel</Text>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.buttonContainer}>
          <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.optionButton}>
            <Pressable onPress={() => openModal('category')}>
              <Text style={styles.optionButtonText}>Create Category</Text>
            </Pressable>
          </LinearGradient>
          <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.optionButton}>
            <Pressable onPress={() => openModal('product')}>
              <Text style={styles.optionButtonText}>Create Product</Text>
            </Pressable>
          </LinearGradient>
          <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.optionButton}>
            <Pressable onPress={() => openModal('manageCategories')}>
              <Text style={styles.optionButtonText}>Manage Categories</Text>
            </Pressable>
          </LinearGradient>
          <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.optionButton}>
            <Pressable onPress={() => openModal('manageProducts')}>
              <Text style={styles.optionButtonText}>Manage Products</Text>
            </Pressable>
          </LinearGradient>
        </View>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {modalType === 'category' || (modalType === 'manageCategories' && editingId) ? (
                <ScrollView>
                  <Text style={styles.modalTitle}>{editingId ? 'Edit Category' : 'Create Category'}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Category Name"
                    value={categoryName}
                    onChangeText={setCategoryName}
                    placeholderTextColor="#9CA3AF"
                  />
                  <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.actionButton}>
                    <Pressable onPress={() => pickImage(setCategoryImage)}>
                      <Text style={styles.buttonText}>Pick Image</Text>
                    </Pressable>
                  </LinearGradient>
                  {categoryImage && (
                    <Image source={{ uri: categoryImage }} style={styles.previewImage} />
                  )}
                  <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.actionButton}>
                    <Pressable onPress={handleCreateCategory}>
                      <Text style={styles.buttonText}>{editingId ? 'Update Category' : 'Create Category'}</Text>
                    </Pressable>
                  </LinearGradient>
                  <LinearGradient colors={['#ff6f61', '#ff9a8b']} style={styles.actionButton}>
                    <Pressable onPress={() => { setModalVisible(false); resetCategoryForm(); }}>
                      <Text style={styles.buttonText}>Close</Text>
                    </Pressable>
                  </LinearGradient>
                </ScrollView>
              ) : modalType === 'product' ? (
                <ScrollView>
                  <Text style={styles.modalTitle}>Create Product</Text>
                  <TextInput style={styles.input} placeholder="Product Name" value={productName} onChangeText={setProductName} placeholderTextColor="#9CA3AF" />
                  <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" placeholderTextColor="#9CA3AF" />
                  <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} multiline placeholderTextColor="#9CA3AF" />
                  <TextInput style={styles.input} placeholder="Quantity" value={quantity} onChangeText={setQuantity} keyboardType="numeric" placeholderTextColor="#9CA3AF" />

                  <Text style={styles.label}>Storage Options</Text>
                  {storageOptions.map((storage, index) => (
                    <View key={index} style={styles.optionRow}>
                      <TextInput
                        style={styles.input}
                        placeholder={`Storage ${index + 1} (e.g., 8GB)`}
                        value={storage}
                        onChangeText={(text) => updateStorageOption(index, text)}
                        placeholderTextColor="#9CA3AF"
                      />
                      {storageOptions.length > 1 && (
                        <Pressable onPress={() => removeStorageOption(index)} style={styles.removeButton}>
                          <Text style={styles.removeButtonText}>X</Text>
                        </Pressable>
                      )}
                    </View>
                  ))}
                  <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.actionButton}>
                    <Pressable onPress={addStorageOption}>
                      <Text style={styles.buttonText}>Add Storage</Text>
                    </Pressable>
                  </LinearGradient>

                  <Text style={styles.label}>Color Options</Text>
                  {colorOptions.map((color, index) => (
                    <View key={index} style={styles.optionRow}>
                      <TextInput
                        style={styles.input}
                        placeholder={`Color ${index + 1} (e.g., Black)`}
                        value={color}
                        onChangeText={(text) => updateColorOption(index, text)}
                        placeholderTextColor="#9CA3AF"
                      />
                      {colorOptions.length > 1 && (
                        <Pressable onPress={() => removeColorOption(index)} style={styles.removeButton}>
                          <Text style={styles.removeButtonText}>X</Text>
                        </Pressable>
                      )}
                    </View>
                  ))}
                  <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.actionButton}>
                    <Pressable onPress={addColorOption}>
                      <Text style={styles.buttonText}>Add Color</Text>
                    </Pressable>
                  </LinearGradient>

                  <Text style={styles.label}>Select Category:</Text>
                  <Picker selectedValue={selectedCategory} onValueChange={setSelectedCategory} style={styles.picker}>
                    {categories.map(cat => <Picker.Item key={cat._id} label={cat.name} value={cat._id} />)}
                  </Picker>
                  <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.actionButton}>
                    <Pressable onPress={pickProductImages}>
                      <Text style={styles.buttonText}>Pick Images</Text>
                    </Pressable>
                  </LinearGradient>
                  <View style={styles.imagePreviewContainer}>
                    {productImages.map((image, index) => <Image key={index} source={{ uri: image }} style={styles.previewImage} />)}
                  </View>
                  <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.actionButton}>
                    <Pressable onPress={handleCreateProduct}>
                      <Text style={styles.buttonText}>Create Product</Text>
                    </Pressable>
                  </LinearGradient>
                  <LinearGradient colors={['#ff6f61', '#ff9a8b']} style={styles.actionButton}>
                    <Pressable onPress={() => { setModalVisible(false); resetProductForm(); }}>
                      <Text style={styles.buttonText}>Close</Text>
                    </Pressable>
                  </LinearGradient>
                </ScrollView>
              ) : modalType === 'manageCategories' && !editingId ? (
                <>
                  <Text style={styles.modalTitle}>Manage Categories</Text>
                  <FlatList
                    data={categories}
                    renderItem={renderCategoryItem}
                    keyExtractor={item => item._id}
                    style={styles.list}
                  />
                  <LinearGradient colors={['#ff6f61', '#ff9a8b']} style={styles.actionButton}>
                    <Pressable onPress={() => setModalVisible(false)}>
                      <Text style={styles.buttonText}>Close</Text>
                    </Pressable>
                  </LinearGradient>
                </>
              ) : modalType === 'manageProducts' ? (
                <>
                  <Text style={styles.modalTitle}>Manage Products</Text>
                  <FlatList
                    data={products}
                    renderItem={renderProductItem}
                    keyExtractor={item => item._id}
                    style={styles.list}
                  />
                  <LinearGradient colors={['#ff6f61', '#ff9a8b']} style={styles.actionButton}>
                    <Pressable onPress={() => setModalVisible(false)}>
                      <Text style={styles.buttonText}>Close</Text>
                    </Pressable>
                  </LinearGradient>
                </>
              ) : null}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginLeft: 40,
    marginRight: 20,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  buttonContainer: {
    gap: 15,
  },
  optionButton: {
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    marginBottom: 15,
  },
  previewImage: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 8,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 15,
  },
  list: {
    maxHeight: 400,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  listImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 2,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: '#ff6f61',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminPanel;