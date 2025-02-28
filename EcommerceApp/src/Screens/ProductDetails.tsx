import {
  View,
  Image,
  Text,
  Platform,
  ScrollView,
  Dimensions,
  Pressable,
  Alert,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  RootStackParams,
  RootStackScreenProps,
} from "../Navigation/RootNavigator";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { HeadersComponent } from "../Components/HeaderComponent/HeaderComponent";
import { useDispatch, useSelector } from "react-redux";
import { CartState } from "../TypesCheck/productCartTypes";
import { ProductListParams } from "../TypesCheck/HomeProps";
import { addToCart } from "../redux/CartReducer";
import DisplayMessage from "../Components/HeaderComponent/DisplayMessage";

const { width, height } = Dimensions.get("window");

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
    color,
    size,
    description,
    quantity,
  } = route.params;
  const productItemObj: ProductListParams = route.params;

  const gotoCartScreen = () => {
    if (!cart || cart.length === 0) {
      setMessage("Cart is empty. Please add products to cart.");
      setDisplayMessage(true);
      setTimeout(() => {
        setDisplayMessage(false);
      }, 3000);
    } else {
      navigation.navigate("TabsStack", { screen: "Cart" });
    }
  };

  const gotoPreviousScreen = () => {
    if (navigation.canGoBack()) {
      console.log("Chuyển về trang trước.");
      navigation.goBack();
    } else {
      console.log("Không thể quay lại, chuyển về trang Onboarding.");
      navigation.navigate("OnboardingScreen");
    }
  };

  const truncateDescription = (
    text: string | undefined,
    maxLength: number = 100
  ) => {
    if (!text) return "No description available";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const cart = useSelector((state: CartState) => state.cart?.cart || []);
  const dispatch = useDispatch();
  const [addedToCart, setAddedToCart] = useState(false);
  const [message, setMessage] = useState("");
  const [displayMessage, setDisplayMessage] = useState<boolean>(false);

  // Update addedToCart based on whether the item is in the cart
  useEffect(() => {
    const isInCart = cart.some((product) => product._id === _id);
    setAddedToCart(isInCart);
  }, [cart, _id]);

  const addItemToCart = (ProductItemObj: ProductListParams) => {
    if (!ProductItemObj.quantity || ProductItemObj.quantity < 1) {
      setMessage("Product is out of stock.");
      setDisplayMessage(true);
      setTimeout(() => {
        setDisplayMessage(false);
      }, 3000);
      return;
    }

    const findItem = cart.find((product) => product._id === _id);
    if (findItem) {
      setMessage("Product is already in cart.");
      setDisplayMessage(true);
      setTimeout(() => {
        setDisplayMessage(false);
      }, 3000);
    } else {
      setAddedToCart(true);
      dispatch(addToCart(ProductItemObj));
      setMessage("Product added to cart successfully.");
      setDisplayMessage(true);
      setTimeout(() => {
        setDisplayMessage(false);
      }, 3000);
    }
  };

  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? 20 : 0,
        flex: 1,
        backgroundColor: "white",
      }}
    >
      {displayMessage && (
        <DisplayMessage
          message={message}
          visible={() => setDisplayMessage(!displayMessage)}
        />
      )}
      <HeadersComponent
        gotoCartScreen={gotoCartScreen}
        cartLength={cart.length}
        gotoPrevious={gotoPreviousScreen}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#F5E8F5" }}
      >
        <ImageBackground style={{ width, height: 300, marginTop: 10 }}>
          <View
            style={{
              padding: 3,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              position: "absolute",
              top: 10,
              left: 10,
              right: 10,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#60C3C3",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "yellow",
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: 12,
                }}
              >
                {oldPrice
                  ? `${(
                      ((Number(oldPrice) - Number(price)) / Number(oldPrice)) *
                      100
                    ).toFixed(1)}% off`
                  : "0% off"}
              </Text>
            </View>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#E0E0E0",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="share-variant"
                size={25}
                color="green"
              />
            </View>
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              style={{ width: 300, height: 250, resizeMode: "contain" }}
              source={{ uri: images[0] || 'https://via.placeholder.com/300' }} // Fallback image
            />
          </View>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#E0E0E0",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              bottom: 10,
              right: 10,
            }}
          >
            <AntDesign
              style={{ paddingLeft: 0, paddingTop: 2 }}
              name="heart"
              size={25}
              color="grey"
            />
          </View>
        </ImageBackground>
        <View
          style={{
            backgroundColor: "white",
            borderColor: "purple",
            borderWidth: 2,
            margin: 10,
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "purple" }}>
            {name}
          </Text>
          <Text style={{ fontSize: 16, color: "black" }}>Price: {price} $</Text>
          <Text
            style={{
              fontSize: 16,
              color: "grey",
              textDecorationLine: "line-through",
            }}
          >
            Old Price: {oldPrice ?? "N/A"} $
          </Text>
          <Text style={{ fontSize: 16, color: "blue" }}>
            {quantity > 0 ? `In Stock - Quantity: ${quantity}` : "Out of Stock"}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#D9E6F5",
            borderColor: "red",
            borderWidth: 2,
            margin: 10,
            padding: 10,
            borderRadius: 10,
            width: width - 20,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "blue" }}>
            Delivery
          </Text>
          <Text style={{ fontSize: 14, color: "red" }}>
            Delivery is Available
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
              flexWrap: "wrap",
            }}
          >
            <Ionicons name="location-sharp" size={25} color="green" />
            <Text
              style={{ fontSize: 14, color: "brown", marginLeft: 5 }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              Delivery to: CAMPUS THANH THAI 7/1 Thanh Thai, Ward 12, Ho Chi
              Minh City
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#F5E8F5",
            borderColor: "purple",
            borderWidth: 2,
            margin: 10,
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "purple" }}>
            Description
          </Text>
          <Text
            style={{ fontSize: 14, color: "black" }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {truncateDescription(description)}
          </Text>
        </View>
        <View style={{ backgroundColor: "white", paddingBottom: 10 }}>
          <Pressable
            style={{
              backgroundColor: "green",
              padding: 15,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              margin: 10,
            }}
            onPress={() => addItemToCart(productItemObj)}
          >
            {addedToCart ? (
              <Text style={{ color: "yellow", fontSize: 20, fontWeight: "bold" }}>
                Add to Cart
              </Text>
            ) : (
              <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
                Add to Cart
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetails;