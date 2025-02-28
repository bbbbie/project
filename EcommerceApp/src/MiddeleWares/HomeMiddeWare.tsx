import React from "react";
import { ProductListParams, FetchProductsParams } from "../TypesCheck/HomeProps";
import axios from "axios";

interface ICatProps {
  setGetCategory: React.Dispatch<React.SetStateAction<ProductListParams[]>>;
}

interface ITrendingProductProps {
  setTrendingProducts: React.Dispatch<React.SetStateAction<ProductListParams[]>>;
}

interface IProdByCatProps {
  catID: string;
  setGetProductsByCatID: React.Dispatch<React.SetStateAction<ProductListParams[]>>;
}

interface IAllProductsProps {
  setAllProducts: React.Dispatch<React.SetStateAction<ProductListParams[]>>; // Định nghĩa kiểu cho setAllProducts
}

export const fetchCategories = async ({ setGetCategory }: ICatProps) => {
  try {
    const response = await axios.get("http://192.168.1.17:9000/category/getAllCategories");
    if (Array.isArray(response.data)) {
      const fixedData = response.data.map((item) => ({
        ...item,
        images: item.images.map((img: string) => img.replace("http://192.168.1.17", "192.168.1.17")),
      }));
      setGetCategory(fixedData);
    } else {
      console.warn("fetchCategories: Du lieu API khong phai la mang", response.data);
      setGetCategory([]);
    }
  } catch (error) {
    console.log("axios get error", error);
    setGetCategory([]);
  }
};

export const fetchProductsByCatID = async ({ setGetProductsByCatID, catID }: IProdByCatProps) => {
  try {
    const response: FetchProductsParams = await axios.get(
      `http://192.168.1.17:9000/product/getProductByCatID/${catID}`
    );
    if (Array.isArray(response.data)) {
      const fixedData = response.data.map((item) => ({
        ...item,
        images: item.images.map((img: string) => img.replace("http://192.168.1.17", "http://192.168.1.17")),
      }));
      setGetProductsByCatID(fixedData);
    } else {
      console.warn("fetchProductsByCatID: Dữ liệu API không phải là mảng", response.data);
      setGetProductsByCatID([]);
    }
  } catch (error) {
    console.log("axios get error", error);
    setGetProductsByCatID([]);
  }
};

export const fetchTrendingProducts = async ({ setTrendingProducts }: ITrendingProductProps) => {
  try {
    const response: any = await axios.get("http://192.168.1.17:9000/product/getTrendingProducts");
    if (Array.isArray(response.data)) {
      const fixedData = response.data.map((item: any) => ({
        ...item,
        images: item.images.map((img: string) => img.replace("http://localhost", "http://192.168.1.17")),
      }));
      setTrendingProducts(fixedData);
    } else {
      console.warn("fetchTrendingProducts: Dữ liệu API không phải là mảng", response.data);
      setTrendingProducts([]);
    }
  } catch (error) {
    console.log("axios get error", error);
    setTrendingProducts([]);
  }
};

export const fetchAllProducts = async ({ setAllProducts }: IAllProductsProps) => {
  try {
    const response = await axios.get("http://192.168.1.17:9000/product/getAllProducts");
    if (Array.isArray(response.data)) {
      const fixedData = response.data.map((item) => ({
        ...item,
        images: item.images.map((img:string) => img.replace("http://localhost", "http://192.168.1.17")),
      }));
      setAllProducts(fixedData);
    } else {
      console.warn("fetchAllProducts: Dữ liệu API không phải là mảng", response.data);
      setAllProducts([]);
    }
  } catch (error) {
    console.log("axios get error", error);
    setAllProducts([]);
  }
};