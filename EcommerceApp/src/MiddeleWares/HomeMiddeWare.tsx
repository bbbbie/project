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
  setAllProducts: React.Dispatch<React.SetStateAction<ProductListParams[]>>;
}

const BASE_URL = "http://192.168.1.17:9000"; // Định nghĩa hằng số cho URL cơ sở

export const fetchCategories = async ({ setGetCategory }: ICatProps) => {
  try {
    const response = await axios.get(`${BASE_URL}/category/getAllCategories`);
    if (Array.isArray(response.data)) {
      const fixedData = response.data.map((item) => ({
        ...item,
        images: item.images.map((img: string) => img.replace("http://localhost:9000", BASE_URL)),
      }));
      setGetCategory(fixedData);
    } else {
      console.warn("fetchCategories: Data is not an array", response.data);
      setGetCategory([]);
    }
  } catch (error) {
    console.log("axios get error", error);
    setGetCategory([]);
  }
};

export const fetchProductsByCatID = async ({ setGetProductsByCatID, catID }: IProdByCatProps) => {
  try {
    const response: FetchProductsParams = await axios.get(`${BASE_URL}/product/getProductByCatID/${catID}`);
    if (Array.isArray(response.data)) {
      const fixedData = response.data.map((item) => ({
        ...item,
        images: item.images.map((img: string) => img.replace("http://localhost:9000", BASE_URL)),
      }));
      setGetProductsByCatID(fixedData);
    } else {
      console.warn("fetchProductsByCatID: Data is not an array", response.data);
      setGetProductsByCatID([]);
    }
  } catch (error) {
    console.log("axios get error", error);
    setGetProductsByCatID([]);
  }
};

export const fetchTrendingProducts = async ({ setTrendingProducts }: ITrendingProductProps) => {
  try {
    const response: any = await axios.get(`${BASE_URL}/product/getTrendingProducts`);
    if (Array.isArray(response.data)) {
      const fixedData = response.data.map((item: any) => ({
        ...item,
        images: item.images.map((img: string) => img.replace("http://localhost:9000", BASE_URL)),
      }));
      setTrendingProducts(fixedData);
    } else {
      console.warn("fetchTrendingProducts: Data is not an array", response.data);
      setTrendingProducts([]);
    }
  } catch (error) {
    console.log("axios get error", error);
    setTrendingProducts([]);
  }
};

export const fetchAllProducts = async ({ setAllProducts }: IAllProductsProps) => {
  try {
    const response = await axios.get(`${BASE_URL}/product/getAllProducts`);
    if (Array.isArray(response.data)) {
      const fixedData = response.data.map((item) => ({
        ...item,
        images: item.images.map((img: string) => img.replace("http://localhost:9000", BASE_URL)),
      }));
      setAllProducts(fixedData);
    } else {
      console.warn("fetchAllProducts: Data is not an array", response.data);
      setAllProducts([]);
    }
  } catch (error) {
    console.log("axios get error", error);
    setAllProducts([]);
  }
};