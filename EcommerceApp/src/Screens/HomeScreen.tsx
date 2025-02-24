import { View, Text, Platform, Dimensions } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { TabsStackScreenProps } from "../Navigation/TabsNavigator";
import { SafeAreaView } from "react-native";
import { HeadersComponent } from "../Components/HeaderComponent/HeaderComponent";
import ImageSlider from "./../Components/HomeScreenComponents/ImageSlider";
import { ScrollView } from "react-native";
import { CategoryCard } from "../Components/HomeScreenComponents/CategoryCard";
import { ProductCard } from "../Components/HomeScreenComponents/ProductCard"; // Thêm import ProductCard
import { ProductListParams } from "../TypesCheck/HomeProps";
import { fetchCategories, fetchProductsByCatID, fetchTrendingProducts } from "../MiddeleWares/HomeMiddeWare";
import { useFocusEffect } from "@react-navigation/native";
import { Pressable } from "react-native";
import { Alert } from "react-native";

const HomeScreen = ({ navigation, route }: TabsStackScreenProps<"Home">) => {
  const gotoCartScreen = () => {
    navigation.navigate("Cart");
  };

  const bgImg = "";
  const sliderImages = [
    "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/02/tim-hinh-anh-dep.jpg",
    "https://bizflyportal.mediacdn.vn/thumb_wm/1000,100/bizflyportal/images/kic16201998282410.jpg",
  ];

  const [getCategory, setGetCategory] = useState<ProductListParams[]>([]);
  const [getProductsByCatID, setGetProductsByCatID] = useState<ProductListParams[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<ProductListParams[]>([]);
  const [activeCat, setActiveCat] = useState<string>("");
 const productWidth = Dimensions.get("screen").width / 3 - 10;
  useEffect(() => {
    fetchCategories({ setGetCategory });
    fetchTrendingProducts({ setTrendingProducts });
  }, []);

  useEffect(() => {
    console.log("fetchProductByCatID:", fetchProductsByCatID);
    if (activeCat) {
      fetchProductsByCatID({ setGetProductsByCatID, catID: activeCat });
    }
  }, [activeCat]);

  useFocusEffect(
    useCallback(() => {
      fetchCategories({ setGetCategory });
      if (activeCat) {
        fetchProductsByCatID({ setGetProductsByCatID, catID: activeCat });
      }
    }, [activeCat])
  );

  return (
    <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? 40 : 0, flex: 1, backgroundColor: "white" }}>
      {/* Đặt HeadersComponent lên đầu để hiển thị search bar trên cùng */}
      <HeadersComponent gotoCartScreen={gotoCartScreen} />

      {/* Nội dung chính nằm trong ScrollView để cuộn */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* Image Slider */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: "#efefef", paddingVertical: 5 }}>
          <ImageSlider images={sliderImages} />
        </ScrollView>

        {/* Divider */}
        <View style={{ backgroundColor: "#eee", borderWidth: 3, borderColor: "#fff", marginTop: 2, height: 5 }} />

        {/* Categories Section */}
        <View style={{ paddingHorizontal: 5 }}>
          <Text style={{ fontSize: 25, marginTop: 2, marginBottom: 2 }}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 0 }}
            style={{ marginBottom: 2 }} // Giảm khoảng cách xuống
          >
            {getCategory.map((item, index) => (
              <CategoryCard
                key={index}
                item={{ name: item.name, images: item.images, _id: item._id }}
                catStyleProps={{
                  height: 50,
                  width: 55,
                  radius: 20,
                  resizeMode: "contain",
                }}
                catProps={{
                  activeCat: activeCat,
                  onPress: () => setActiveCat(item._id),
                }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Products Section */}
        <View
          style={{
            backgroundColor: "green",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginTop: 2, // Giữ khoảng cách nhỏ giữa categories và products
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "bold", color: "white" }}>
            Products from Selected Category
          </Text>
          <Pressable onPress={() => Alert.alert("See All pressed - Implement navigation here!")}>
            <Text style={{ fontSize: 11, fontWeight: "bold" }}>See All</Text>
          </Pressable>
        </View>
        <View
          style={{
            backgroundColor: "#fff",
            borderWidth: 7,
            borderColor: "green",
            paddingHorizontal: 5,
            paddingVertical: 5,
          }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getProductsByCatID.length > 0 ? (
              getProductsByCatID.map((item, index) => {
                console.log("Product item:", item);
                console.log("Product image URL:", item?.images[0]);
                return (
                  <CategoryCard
                    key={index}
                    item={{ name: item.name, images: item.images, _id: item._id }}
                    catStyleProps={{
                      height: 100,
                      width: 100,
                      radius: 10,
                      resizeMode: "contain",
                    }}
                    catProps={{
                      onPress: () => Alert.alert(item.name),
                      imageBg: bgImg,
                    }}
                  />
                );
              })
            ) : (
              <Text style={{ padding: 10 }}>Không có sản phẩm nào</Text>
            )}
          </ScrollView>
        </View>

        {/* Trending Deals of the Week Section */}
        <View style={{ 
          backgroundColor: "purple", 
          flexDirection: "row", 
          justifyContent: "space-between", 
          marginTop: 10 
        }}>
          <Text style={{ 
            color: "yellow", 
            fontSize: 14, 
            fontWeight: "bold", 
            padding: 10 
          }}>
            Trending Deals of the Week
          </Text>
        </View>

        <View style={{ 
          backgroundColor: "#fff", 
          borderWidth: 7, 
          borderColor: "green", 
          flexDirection: "row", 
          justifyContent: "space-between", 
          alignItems: "center", 
          flexWrap: "wrap" 
        }}>
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
             height: 90,
             marginBottom: 5,
           }}
           productProps={{
             imageBg: bgImg,
             onPress: () => {
               navigation.navigate("ProductDetails", {
                 _id: item._id,
                 name: item.name,
                 images: item.images,
                 price: item.price,
                 // Thêm các optional params nếu có
                 oldPrice: item.oldPrice,
                 inStock: item.inStock,
                 color: item.color,
                 size: item.size,
                 description: item.description|| "No description available",
                 quantity: item.quantity
               });
             }
           }}
         />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;