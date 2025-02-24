import { useState } from "react";
import { View, Image, Dimensions, StyleSheet, ScrollView } from "react-native";

interface ImageProps {
  images: string[];
}

const Max_Width = Dimensions.get("screen").width;

const ImageSlider = ({ images }: ImageProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  // Xử lý sự kiện scroll để cập nhật chỉ số ảnh hiện tại
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / Max_Width);
    setCurrentImage(newIndex);
  };

  return (
    <View style={styles.sliderContainer}>
      {/* Container cho slider */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.imageContainer}
      >
        {images.map((image, index) => (
          <Image
            key={`${image}_${index}`}
            source={{ uri: image }}
            style={styles.image}
          />
        ))}
      </ScrollView>

      {/* Indicators */}
      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={`indicator_${index}`}
            style={[
              styles.indicator,
              index === currentImage ? styles.activeIndicator : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageSlider;

const styles = StyleSheet.create({
  sliderContainer: {
    position: "relative", // Container chính để giữ vị trí
    width: Max_Width,
    height: 200, // Đảm bảo chiều cao cố định cho slider
  },
  imageContainer: {
    width: Max_Width,
    height: 200,
  },
  image: {
    resizeMode: "contain",
    height: 200,
    width: Max_Width,
    borderWidth: 7,
    borderColor: "white",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", // Đặt indicators ở dưới cùng của slider
    bottom: 10,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderColor: "silver",
    borderWidth: 1,
    marginHorizontal: 3,
    backgroundColor: "#eee",
  },
  activeIndicator: {
    backgroundColor: "green",
  },
});