import { View, Text, Pressable, ImageBackground, Image, StyleSheet } from 'react-native';
import React from 'react';
import { IProductProps } from '../../TypesCheck/productTypes';

export const ProductCard = ({ item, productProps, pStyleProps }: IProductProps) => {
  const formatPrice = (price: number) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Pressable
      onPress={productProps?.onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
    >
      <View
        style={[
          styles.card,
          {
            width: pStyleProps?.width,
            marginHorizontal: pStyleProps?.marginHorizontal || 5,
            marginBottom: pStyleProps?.marginBottom || 12,
          },
        ]}
      >
        {/* Image Container */}
        <View style={styles.imageContainer}>
          <ImageBackground
            source={{ uri: productProps?.imageBg }}
            style={[
              styles.imageBg,
              { height: pStyleProps?.height },
            ]}
            imageStyle={styles.imageBgStyle}
          >
            <Image
              source={{ uri: item?.images[0]?.replace("localhost", "192.168.1.17") }}
              style={[
                styles.productImage,
                { resizeMode: pStyleProps?.resizeMode },
              ]}
            />
            {/* Nhãn "Hot Deal" cho Trending Deals */}
            {pStyleProps?.height === 120 && (
              <View style={styles.hotDeal}>
                <Text style={styles.hotDealText}>Hot Deal</Text>
              </View>
            )}
          </ImageBackground>
        </View>

        {/* Product Info Container */}
        <View style={styles.infoContainer}>
          <Text numberOfLines={pStyleProps?.height === 120 ? 1 : 2} style={styles.productName}>
            {item?.name}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>
              {"$" + formatPrice(item?.price)}
            </Text>
          </View>
          {productProps?.percentageWidth !== undefined && (
            <View style={styles.stockContainer}>
              <Text style={styles.stockText}>{item?.quantity} items left</Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${productProps.percentageWidth}%` },
                  ]}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  card: {
    borderWidth: 0,
    borderRadius: 12,
    backgroundColor: '#e8ecef',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  imageContainer: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  imageBg: {
    width: 100, // Sửa từ "100" thành 100
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBgStyle: {
    borderRadius: 10,
    overflow: 'hidden', // Chỉ dùng thuộc tính hợp lệ với ImageStyle
  },
  productImage: {
    height: '100%',
    width: '80%',
  },
  infoContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'italic',
    marginBottom: 4,
    color: '#2c3e50',
    height: 40,
    lineHeight: 20,
    textAlign: 'center',
  },
  priceContainer: {
    marginTop: -5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e74c3c',
    textAlign: 'center',
  },
  stockContainer: {
    marginTop: 10,
  },
  stockText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e6e6e6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ff5733',
    borderRadius: 4,
  },
  hotDeal: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#ff4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hotDealText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
});