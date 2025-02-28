import React from "react";
import {
    ProductListParams,
    FetchProductsParams,
  } from "../TypesCheck/HomeProps";
import axios from "axios"
// wwiifi nha 192.168.1.17
//wifi truong 10 .106.20.172
interface ICatProps{
    setGetCategory: React.Dispatch<React.SetStateAction<ProductListParams[]>>
}

interface ItrendingProductProps {
  setTrendingProducts: React.Dispatch<React.SetStateAction<ProductListParams[]>>
}
interface IProdByCatProps {
    catID: string;
    setGetProductsByCatID: React.Dispatch<
      React.SetStateAction<ProductListParams[]>
    >;
  }
  
export const fetchCategories = async ({ setGetCategory }: ICatProps) => {
    try{
        const Response = await axios.get("http://192.168.1.17:9000/category/getAllCategories");
        // console.log("API Response:", Response.data);

        if( Array.isArray( Response.data)) {
            const fixedData = Response.data.map(item => ({
                ...item,
                images: item.images.map((img: string) =>
                    img.replace("http://192.168.1.17", "192.168.1.17")
            )
            }));

            setGetCategory(fixedData);
        }else {
            console.warn("fetchCategories: Du lieu API khong phai la mang", Response.data);
            setGetCategory([]);
        }

    }catch (error) {
        console.log("axios get error", error);
        setGetCategory([]);
    }
};

export const fetchProductsByCatID = async ({
    setGetProductsByCatID,
    catID,
  }: IProdByCatProps) => {
    try {
      const response: FetchProductsParams = await axios.get(
        `http://192.168.1.17:9000/product/getProductByCatID/${catID}`
      );
      // console.log("API Response:", response.data);
  
      if (Array.isArray(response.data)) {
        const fixedData = response.data.map((item) => ({
          ...item,
          images: item.images.map((img: string) =>
            img.replace("http://192.168.1.17", "http://192.168.1.17")
          ),
        }));
  
        setGetProductsByCatID(fixedData);
      } else {
        console.warn(
          "fetchProductsByCatID: Dữ liệu API không phải là mảng",
          response.data
        );
        setGetProductsByCatID([]);
      }
    } catch (error) {
      console.log("axios get error", error);
      setGetProductsByCatID([]);
    }


  };

  export const fetchTrendingProducts = async ({ setTrendingProducts }: ItrendingProductProps) => {
    try {
      const response: any = await axios.get("http://192.168.1.17:9000/product/getTrendingProducts");
      console.log("API Response:", response.data);
  
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