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
import { useSelector } from "react-redux";
import { CartState } from "../TypesCheck/productCartTypes";
import DisplayMessage from "../Components/HeaderComponent/DisplayMessage";
import { StyleSheet } from "react-native";

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
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<ProductListParams[]>([]);

  const screenWidth = Dimensions.get("screen").width;
  const containerPadding = 15;
  const horizontalSpacing = 10;
  const cardsPerRow = 2;
  const totalHorizontalSpacing = horizontalSpacing * (cardsPerRow - 1);
  const productWidth = (screenWidth - containerPadding * 2 - totalHorizontalSpacing) / cardsPerRow;

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

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredProducts(getProductsByCatID);
    } else {
      const filtered = getProductsByCatID.filter((product) =>
        product.name?.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredProducts(filtered);
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

  const handleSearch = () => {
    console.log("Search triggered with query:", searchInput);
  };

  const handleSeeAll = () => {
    const productsToShow = activeCat ? getProductsByCatID : allProducts;
    navigation.navigate("AllProducts", { products: productsToShow });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {displayMessage && <DisplayMessage message={message} visible={() => setDisplayMessage(!displayMessage)} />}
      <View style={[styles.headerGradient, { backgroundColor: '#ff6f61' }]}>
        <HeadersComponent
          gotoCartScreen={gotoCartScreen}
          cartLength={cart.length}
          search={handleSearch}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Image Slider */}
        <View style={styles.sliderContainer}>
          <ImageSlider images={sliderImages} />
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Explore Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {getCategory.map((item, index) => (
              <CategoryCard
                key={index}
                item={{ name: item.name, images: item.images, _id: item._id }}
                catStyleProps={{ height: 50, width: 50, radius: 25, resizeMode: "cover" }}
                catProps={{ activeCat: activeCat, onPress: () => toggleCategory(item._id) }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Products Section */}
        <View style={styles.productsSection}>
          <View style={[styles.sectionHeader, { backgroundColor: '#4facfe' }]}>
            <Text style={styles.headerText}>
              {activeCat ? "Category Highlights" : "Featured Products"}
            </Text>
            <Pressable onPress={handleSeeAll}>
              <Text style={styles.seeAll}>View All</Text>
            </Pressable>
          </View>
          <View style={styles.productsContainer}>
            <View style={styles.grid}>
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, 4).map((item, index) => (
                  <View key={index} style={styles.productCardWrapper}>
                    <ProductCard
                      item={{ name: item.name, images: item.images, _id: item._id, price: item.price }}
                      pStyleProps={{
                        resizeMode: "contain", // Thay từ "cover" sang "contain" để hiển thị toàn bộ ảnh
                        width: productWidth,
                        height: 200, // Tăng chiều cao để phù hợp với máy móc
                        borderRadius: 10,
                      }}
                      productProps={{
                        onPress: () => navigation.navigate("ProductDetails", {
                          _id: item._id,
                          name: item.name,
                          images: item.images,
                          price: item.price,
                          oldPrice: item.oldPrice,
                          inStock: item.inStock,
                          description: item.description || "No description available",
                          quantity: item.quantity,
                          storage: item.storage,
                          color: item.color,
                        }),
                        imageBg: bgImg,
                      }}
                    />
                  </View>
                ))
              ) : (
                <Text style={styles.noProducts}>No products available</Text>
              )}
            </View>
          </View>
        </View>

        {/* Trending Deals Section */}
        <View style={styles.trendingSection}>
          <View style={[styles.sectionHeader, { backgroundColor: '#ffafbd' }]}>
            <Text style={styles.headerText}>Trending Deals</Text>
          </View>
          <View style={styles.trendingContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={productWidth + horizontalSpacing}
              decelerationRate="fast"
            >
              {trendingProducts.map((item, index) => (
                <View key={index} style={styles.trendingCardWrapper}>
                  <ProductCard
                    item={{
                      _id: item._id || index.toString(),
                      name: item.name || "No Name",
                      images: item.images || ["No Image"],
                      price: item.price || 0,
                    }}
                    pStyleProps={{
                      resizeMode: "contain", // Thay từ "cover" sang "contain"
                      width: productWidth,
                      height: 200, // Tăng chiều cao
                      borderRadius: 10,
                    }}
                    productProps={{
                      onPress: () => navigation.navigate("ProductDetails", {
                        _id: item._id,
                        name: item.name,
                        images: item.images,
                        price: item.price,
                        oldPrice: item.oldPrice,
                        inStock: item.inStock,
                        description: item.description || "No description available",
                        quantity: item.quantity,
                        storage: item.storage,
                        color: item.color,
                      }),
                      imageBg: bgImg,
                    }}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
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
  sliderContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  categorySection: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  categoryScroll: {
    paddingBottom: 5,
  },
  productsSection: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  productsContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCardWrapper: {
    width: "48%",
    marginBottom: 15,
  },
  trendingSection: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  trendingContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  trendingCardWrapper: {
    marginRight: 10,
  },
  noProducts: {
    padding: 20,
    color: "#666",
    textAlign: "center",
  },
});

export default HomeScreen;