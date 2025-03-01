import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, SafeAreaView, Dimensions, Platform, Pressable, Text } from "react-native";
import { RootStackScreenProps } from "../Navigation/RootNavigator";
import { ProductListParams } from "../TypesCheck/HomeProps";
import { ProductCard } from "../Components/HomeScreenComponents/ProductCard";
import { LinearGradient } from "expo-linear-gradient";
import { HeadersComponent } from "../Components/HeaderComponent/HeaderComponent";

const AllProductsScreen = ({ navigation, route }: RootStackScreenProps<"AllProducts">) => {
  const { products } = route.params;
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<ProductListParams[]>(products);

  // Lọc sản phẩm theo tìm kiếm
  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name?.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchInput, products]);

  // Sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    if (sortOrder === "desc") return b.price - a.price;
    return 0;
  });

  const screenWidth = Dimensions.get("screen").width;
  const containerPadding = 15;
  const horizontalSpacing = 10;
  const cardsPerRow = 2;
  const totalHorizontalSpacing = horizontalSpacing * (cardsPerRow - 1);
  const productWidth = (screenWidth - containerPadding * 2 - totalHorizontalSpacing) / cardsPerRow;

  const renderItem = ({ item }: { item: ProductListParams }) => (
    <View style={styles.productCardWrapper}>
      <ProductCard
        item={{ name: item.name, images: item.images, _id: item._id, price: item.price }}
        pStyleProps={{
          resizeMode: "cover",
          width: productWidth,
          height: 150,
          borderRadius: 10,
        }}
        productProps={{
          onPress: () =>
            navigation.navigate("ProductDetails", {
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
          imageBg: "",
        }}
      />
    </View>
  );

  const handleSearch = () => {
    console.log("Search triggered with query:", searchInput);
  };

  const gotoPrevious = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#ff6f61", "#ff9a8b"]} style={styles.headerGradient}>
        <HeadersComponent
        
          gotoPrevious={gotoPrevious}
          search={handleSearch}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
      </LinearGradient>
      <View style={styles.filterContainer}>
        <Pressable
          style={[styles.filterButton, sortOrder === "asc" && styles.activeFilter]}
          onPress={() => setSortOrder("asc")}
        >
          <Text style={styles.filterText}>Price: Low to High</Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, sortOrder === "desc" && styles.activeFilter]}
          onPress={() => setSortOrder("desc")}
        >
          <Text style={styles.filterText}>Price: High to Low</Text>
        </Pressable>
      </View>
      <FlatList
        data={sortedProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerGradient: {
    paddingTop: Platform.OS === "android" ? 40 : 0,
    paddingBottom: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  activeFilter: {
    backgroundColor: "#2ecc71",
    borderColor: "#2ecc71",
  },
  filterText: {
    fontSize: 14,
    color: "#333",
  },
  productList: {
    padding: 15,
  },
  productCardWrapper: {
    width: "48%",
    marginBottom: 15,
    marginHorizontal: "1%",
  },
});

export default AllProductsScreen;