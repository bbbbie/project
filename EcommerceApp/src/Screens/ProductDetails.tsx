import {
  View,
  Text,
  Platform,
  ScrollView,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { RootStackScreenProps } from "../Navigation/RootNavigator";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { HeadersComponent } from "../Components/HeaderComponent/HeaderComponent";
import { useDispatch, useSelector } from "react-redux";
import { CartState } from "../TypesCheck/productCartTypes";
import { ProductListParams } from "../TypesCheck/HomeProps";
import { addToCart } from "../redux/CartReducer";
import DisplayMessage from "../Components/HeaderComponent/DisplayMessage";
import { LinearGradient } from "expo-linear-gradient";
import ImageSlider from "../Components/HomeScreenComponents/ImageSlider";

const ProductDetails = ({
  navigation,
  route,
}: RootStackScreenProps<"ProductDetails">) => {
  const {
    _id,
    images,
    name,
    price,
    oldPrice,
    inStock,
    description,
    quantity,
    storage,
    color,
    selectedStorage: initialSelectedStorage,
    selectedColor: initialSelectedColor,
  } = route.params as ProductListParams;

  console.log("route.params:", route.params);

  const productItemObj: ProductListParams = {
    _id,
    images,
    name,
    price,
    oldPrice,
    inStock,
    description,
    quantity,
    storage: storage || [],
    color: Array.isArray(color) ? color : color ? [color] : [],
    selectedStorage: initialSelectedStorage,
    selectedColor: initialSelectedColor,
  };

  const cart = useSelector((state: CartState) => state.cart.cart || []);
  const dispatch = useDispatch();
  const [addedToCart, setAddedToCart] = useState(false);
  const [message, setMessage] = useState("");
  const [displayMessage, setDisplayMessage] = useState<boolean>(false);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(
    initialSelectedStorage || null
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    initialSelectedColor || null
  );

  useEffect(() => {
    const isInCart = cart.some(
      (product) =>
        product._id === _id &&
        product.selectedStorage === selectedStorage &&
        product.selectedColor === selectedColor
    );
    setAddedToCart(isInCart);
  }, [cart, _id, selectedStorage, selectedColor]);

  const gotoCartScreen = () => {
    if (!cart || cart.length === 0) {
      setMessage("Cart is empty. Please add products to cart.");
      setDisplayMessage(true);
      setTimeout(() => setDisplayMessage(false), 3000);
    } else {
      navigation.navigate("TabsStack", { screen: "Cart" });
    }
  };

  const gotoPreviousScreen = () => {
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.navigate("OnboardingScreen");
  };

  const truncateDescription = (
    text: string | undefined,
    maxLength: number = 200
  ): string => {
    return text && text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text || "No description available";
  };

  const addItemToCart = () => {
    if (!quantity || quantity < 1) {
      setMessage("Product is out of stock.");
      setDisplayMessage(true);
      setTimeout(() => setDisplayMessage(false), 3000);
      return;
    }

    const productToAdd: ProductListParams = {
      ...productItemObj,
      selectedStorage,
      selectedColor,
      quantity: 1, // Số lượng ban đầu khi thêm vào giỏ
    };

    const findItem = cart.find(
      (product) =>
        product._id === _id &&
        product.selectedStorage === selectedStorage &&
        product.selectedColor === selectedColor
    );
    if (findItem) {
      setMessage("Product with this configuration is already in cart.");
      setDisplayMessage(true);
      setTimeout(() => setDisplayMessage(false), 3000);
    } else {
      setAddedToCart(true);
      dispatch(addToCart(productToAdd));
      setMessage("Product added to cart successfully.");
      setDisplayMessage(true);
      setTimeout(() => setDisplayMessage(false), 3000);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {displayMessage && (
        <DisplayMessage
          message={message}
          visible={() => setDisplayMessage(!displayMessage)}
        />
      )}
      <LinearGradient
        colors={["#ff6f61", "#ff9a8b"]}
        style={styles.headerGradient}
      >
        <HeadersComponent
          gotoCartScreen={gotoCartScreen}
          cartLength={cart.length}
          gotoPrevious={gotoPreviousScreen}
        />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <ImageSlider
            images={images.length > 0 ? images : ["https://via.placeholder.com/300"]}
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.5)"]}
            style={styles.imageOverlay}
          >
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {oldPrice
                  ? `${(
                      ((Number(oldPrice) - Number(price)) / Number(oldPrice)) *
                      100
                    ).toFixed(1)}% off`
                  : "New"}
              </Text>
            </View>
            <View style={styles.actionButtons}>
              <Pressable style={styles.iconButton}>
                <MaterialCommunityIcons name="share-variant" size={22} color="#000" />
              </Pressable>
              <Pressable style={styles.iconButton}>
                <AntDesign name="hearto" size={22} color="#000" />
              </Pressable>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>${price}</Text>
            {oldPrice && <Text style={styles.oldPriceText}>${oldPrice}</Text>}
          </View>
          <Text
            style={[
              styles.stockText,
              { color: quantity > 0 ? "#2ecc71" : "#e74c3c" },
            ]}
          >
            {quantity > 0 ? `In Stock (${quantity})` : "Out of Stock"}
          </Text>

          {storage && storage.length > 0 && (
            <View style={styles.optionContainer}>
              <Text style={styles.optionTitle}>Storage:</Text>
              <View style={styles.optionButtons}>
                {storage.map((option) => (
                  <Pressable
                    key={option}
                    style={[
                      styles.optionButton,
                      selectedStorage === option && styles.selectedOptionButton,
                    ]}
                    onPress={() => setSelectedStorage(option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedStorage === option && styles.selectedOptionText,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {color && color.length > 0 && (
            <View style={styles.optionContainer}>
              <Text style={styles.optionTitle}>Color:</Text>
              <View style={styles.optionButtons}>
                {color.map((option) => (
                  <Pressable
                    key={option}
                    style={[
                      styles.optionButton,
                      selectedColor === option && styles.selectedOptionButton,
                    ]}
                    onPress={() => setSelectedColor(option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedColor === option && styles.selectedOptionText,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Product Details</Text>
          <Text style={styles.descriptionText}>
            {truncateDescription(description)}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.addToCartButton,
              { backgroundColor: addedToCart ? "#ff5733" : "#2ecc71" },
            ]}
            onPress={addItemToCart}
          >
            <Text style={styles.buttonText}>
              {addedToCart ? "Added to Cart" : "Add to Cart"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerGradient: {
    paddingTop: Platform.OS === "android" ? 40 : 0,
    paddingBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: 350,
    position: "relative",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  discountBadge: {
    backgroundColor: "#ff5733",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#fff",
  },
  discountText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  infoContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  productName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginVertical: 10,
  },
  priceText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#e74c3c",
  },
  oldPriceText: {
    fontSize: 16,
    color: "#999",
    textDecorationLine: "line-through",
  },
  stockText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 5,
  },
  optionContainer: {
    marginTop: 15,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  optionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  selectedOptionButton: {
    borderColor: "#2ecc71",
    backgroundColor: "#2ecc71",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  selectedOptionText: {
    color: "#fff",
    fontWeight: "600",
  },
  descriptionContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: "#f5f5f5",
  },
  addToCartButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
});

export default ProductDetails;