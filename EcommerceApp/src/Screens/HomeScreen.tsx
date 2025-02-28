import { View, Text, Platform, Dimensions, ScrollView } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { TabsStackScreenProps } from "../Navigation/TabsNavigator";
import { SafeAreaView } from "react-native";
import { HeadersComponent } from "../Components/HeaderComponent/HeaderComponent";
import ImageSlider from "./../Components/HomeScreenComponents/ImageSlider";
import { CategoryCard } from "../Components/HomeScreenComponents/CategoryCard";
import { ProductCard } from "../Components/HomeScreenComponents/ProductCard";
import { ProductListParams } from "../TypesCheck/HomeProps";
import { fetchCategories, fetchProductsByCatID, fetchTrendingProducts, fetchAllProducts } from "../MiddeleWares/HomeMiddeWare";
import { useFocusEffect } from "@react-navigation/native";
import { Pressable } from "react-native";
import { Alert } from "react-native";
import { useSelector } from "react-redux";
import { CartState } from "../TypesCheck/productCartTypes";
import DisplayMessage from "../Components/HeaderComponent/DisplayMessage";

const HomeScreen = ({ navigation }: TabsStackScreenProps<"Home">) => {
  const cart = useSelector((state: CartState) => state.cart.cart);
  const gotoCartScreen = () => {
    if (cart.length === 0) {
      setMessage("Cart is empty. Please add products to cart.");
      setDisplayMessage(true);
      setTimeout(() => setDisplayMessage(false), 3000);
    } else {
      navigation.navigate("Cart");
    }
  };

  const bgImg = "";
  const sliderImages = [
    "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/02/tim-hinh-anh-dep.jpg",
    "https://bizflyportal.mediacdn.vn/thumb_wm/1000,100/bizflyportal/images/kic16201998282410.jpg",
  ];
  const [message, setMessage] = useState("");
  const [displayMessage, setDisplayMessage] = useState<boolean>(false);
  const [getCategory, setGetCategory] = useState<ProductListParams[]>([]);
  const [getProductsByCatID, setGetProductsByCatID] = useState<ProductListParams[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<ProductListParams[]>([]);
  const [allProducts, setAllProducts] = useState<ProductListParams[]>([]);
  const [activeCat, setActiveCat] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>(""); // State for search query
  const [filteredProducts, setFilteredProducts] = useState<ProductListParams[]>([]); // State for filtered products

  const screenWidth = Dimensions.get("screen").width;
  const spacing = 12;
  const containerPadding = 20;
  const productWidth = (screenWidth - containerPadding - (spacing * 2)) / 3;

  useEffect(() => {
    fetchCategories({ setGetCategory });
    fetchAllProducts({ setAllProducts });
    fetchTrendingProducts({ setTrendingProducts });
  }, []);

  useEffect(() => {
    if (activeCat) {
      fetchProductsByCatID({ setGetProductsByCatID, catID: activeCat });
    } else {
      setGetProductsByCatID(allProducts);
    }
  }, [activeCat, allProducts]);

  // Filter products based on search query
  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredProducts(getProductsByCatID); // If search query is empty, show all products
    } else {
      const filtered = getProductsByCatID.filter((product) =>
        product.name?.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredProducts(filtered); // Update filtered products based on search
    }
  }, [searchInput, getProductsByCatID]);

  useFocusEffect(
    useCallback(() => {
      fetchCategories({ setGetCategory });
      fetchAllProducts({ setAllProducts });
      if (activeCat) {
        fetchProductsByCatID({ setGetProductsByCatID, catID: activeCat });
      }
    }, [activeCat])
  );

  const toggleCategory = (catID: string) => {
    if (activeCat === catID) {
      setActiveCat("");
    } else {
      setActiveCat(catID);
    }
  };

  // Optional: Function to trigger search explicitly (if needed)
  const handleSearch = () => {
    // The filtering already happens in the useEffect, but you can add additional logic here if needed
    console.log("Search triggered with query:", searchInput);
  };

  return (
    <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? 40 : 0, flex: 1, backgroundColor: "white" }}>
      {displayMessage && <DisplayMessage message={message} visible={() => setDisplayMessage(!displayMessage)} />}
      <HeadersComponent
        gotoCartScreen={gotoCartScreen}
        cartLength={cart.length} // Pass the cart length to display the badge
        search={handleSearch} // Pass the search handler
        searchInput={searchInput} // Pass the search query
        setSearchInput={setSearchInput} // Pass the function to update the search query
      />

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* Image Slider */}
        <View style={{ backgroundColor: "#efefef", paddingVertical: 10 }}>
          <ImageSlider images={sliderImages} />
        </View>

        <View style={{ backgroundColor: "#eee", borderWidth: 3, borderColor: "#fff", height: 5 }} />

        {/* Categories Section */}
        <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5, color: '#1a1a1a' }}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getCategory.map((item, index) => (
              <CategoryCard
                key={index}
                item={{ name: item.name, images: item.images, _id: item._id }}
                catStyleProps={{ height: 35, width: 40, radius: 20, resizeMode: "contain" }}
                catProps={{ activeCat: activeCat, onPress: () => toggleCategory(item._id) }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Products Section */}
        <View style={{ marginTop: 15, paddingHorizontal: 10 }}>
          <View
            style={{
              backgroundColor: '#ff5733',
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
              {activeCat ? "Products from Selected Category" : "All Products"}
            </Text>
            <Pressable onPress={() => Alert.alert("See All pressed - Implement navigation here!")}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: "white" }}>See All</Text>
            </Pressable>
          </View>
          <View
            style={{
              backgroundColor: "#fff",
              borderWidth: 0,
              padding: spacing,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: spacing,
                justifyContent: "flex-start",
              }}
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item, index) => (
                  <ProductCard
                    key={index}
                    item={{ name: item.name, images: item.images, _id: item._id, price: item.price }}
                    pStyleProps={{
                      resizeMode: "contain",
                      width: productWidth,
                      height: productWidth,
                      marginBottom: 0,
                      marginHorizontal: 0,
                    }}
                    productProps={{
                      onPress: () => navigation.navigate("ProductDetails", {
                        _id: item._id,
                        name: item.name,
                        images: item.images,
                        price: item.price,
                        oldPrice: item.oldPrice,
                        inStock: item.inStock,
                        color: item.color,
                        size: item.size,
                        description: item.description || "No description available",
                        quantity: item.quantity,
                      }),
                      imageBg: bgImg,
                    }}
                  />
                ))
              ) : (
                <Text style={{ padding: 10, color: '#666' }}>Không có sản phẩm nào</Text>
              )}
            </View>
          </View>
        </View>

        {/* Trending Deals Section */}
        <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
          <View
            style={{
              backgroundColor: '#ff5733',
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              Trending Deals of the Week
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#fff",
              borderWidth: 0,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {trendingProducts.map((item, index) => (
                <ProductCard
                  key={index}
                  item={{
                    _id: item._id || index.toString(),
                    name: item.name || "No Name",
                    images: item.images || ["No Image"],
                    price: item.price || 0,
                  }}
                  pStyleProps={{
                    resizeMode: "contain",
                    width: productWidth,
                    height: 100,
                    marginRight: 15,
                  }}
                  productProps={{
                    imageBg: bgImg,
                    onPress: () => navigation.navigate("ProductDetails", {
                      _id: item._id,
                      name: item.name,
                      images: item.images,
                      price: item.price,
                      oldPrice: item.oldPrice,
                      inStock: item.inStock,
                      color: item.color,
                      size: item.size,
                      description: item.description || "No description available",
                      quantity: item.quantity,
                    }),
                  }}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;