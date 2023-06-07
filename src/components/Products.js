import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom} from "./Cart";
import { Warning } from "@mui/icons-material";


// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [productsList, setProductsList] = useState([]); // this is backup of total products which will use later.
  const [filteredProductList, setFilteredProductList] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(100);
  const [items, setItems] = useState([]);

  const token = localStorage.getItem("token");

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    const url = `${config.endpoint}/products`;
    setLoading(true);
    try {
      const res = await axios.get(url);
      console.log(res);
      console.log(res.data);
      setProductsList(res.data);
      setFilteredProductList(res.data);
      setLoading(false);

      return res.data;
    } catch (e) {
      console.log(e);
      setLoading(false);
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    const searhURl = `${config.endpoint}/products/search?value=${text}`;
    try {
      const searchResponse = await axios.get(searhURl);
      setFilteredProductList(searchResponse.data);
      return searchResponse.data;
    } catch (e) {
      if (e.response.status === 404) {
        setFilteredProductList([]);
      }

      if (e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        setFilteredProductList(productsList);
      } else {
        enqueueSnackbar(
          "Couldn't fetch the product. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    console.log(event.target.value);
    const dataSet = event.target.value;

    if (debounceTimeout) {
      clearTimeout(debounceTimeout); // Cleared existing timeout
    }

    const newTimeout = setTimeout(() => {
      performSearch(dataSet);
      // console.log(performSearch(dataSet));
    }, 800);

    setDebounceTimeout(newTimeout);
  };

  useEffect(() => {
    const dataHandler = async () => {
      const availableProducts = await performAPICall();
      const usersCardData = await fetchCart(token);
      const cartsInfo = await generateCartItemsFrom(usersCardData,availableProducts);
      console.log(cartsInfo)
      setItems(cartsInfo);
    };
    dataHandler();
  }, []);

  const updatedCartItems = (cartData, productsData) => {
    console.log("updatedCartItems",cartData,productsData)
    const allCardItems = generateCartItemsFrom(cartData, productsData);
    console.log(allCardItems);
    setItems(allCardItems);
    
  }

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return null;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("cart data", response.data);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    // 1st way :
    // const iterator = items.values();
    //   for(const value of iterator){
    //     if(value.productId === productId){
    //       return true;
    //     } 
    //       return false;
    //   }

      // 2nd way 
        // Here if matching item is not equal to -1 then return true otherwise return false
        
      return items.findIndex(item => item[0]._id === productId) !== -1;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    console.log("card addition")
    console.log(items,products,productId,qty)
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "Warning",
      });
      return;
    }
    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "warning",
        }
      );
      return;
    }

    try {
     const cartResponse =  await axios.post(`${config.endpoint}/cart`,{
          productId, qty
        },
        {
          headers : {
            Authorization : `Bearer ${token}`
          }
        })
            console.log(cartResponse.data)
        updatedCartItems(cartResponse.data,products);

    } catch (error) {
      if(error.response){
        enqueueSnackbar(error.response.message, { variant : "error"})
      }
      else{
        enqueueSnackbar(
          "couldn't fetch the product. check that is backend is running and return valid JSON",
          { variant : "error"}
        ) 
      }
    }
  };

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}

        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, debounceTimeout)}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e, debounceTimeout)}
      />
      <Grid container>
        <Grid item className="product-grid" xs={12} md={token ? 9 : 12}>
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>

          {loading ? (
            <Box className="loading">
              <CircularProgress />
              <h3> Loading Products ... </h3>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredProductList.length ? (
                filteredProductList.map((product) => (
                  <Grid item xs={6} md={3} key={product._id}>
                    <ProductCard
                      product={product}
                      handleAddToCart={async () => {
                        console.log("added to cart")
                        await addToCart(
                          token,
                          items,
                          productsList,
                          product._id,
                          1,
                          { preventDuplicate: true }
                        );
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Box className="loading">
                  <SentimentDissatisfied color="error" />
                  <h4 style={{ color: "#ef5350" }}>No products found</h4>
                </Box>
              )}
            </Grid>
          )}
        </Grid>

        {/* Display the Cart Component */}
        {token && (
          <Grid item md={3} xs={12} bgcolor="#E9F5E1">
            <Cart
              products = {productsList}
              items = {items}
              handleQuantity = {addToCart}
              isCheckoutButton
            />
          </Grid>
        )}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
