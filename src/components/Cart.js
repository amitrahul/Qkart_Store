import { ProductionQuantityLimits } from "@mui/icons-material";
import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Link } from "@mui/material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


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
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  
  if (!cartData) return;
  // console.log(cartData);
  const cartItems = cartData.map((item) => ({
    ...productsData.filter((product) => product._id === item.productId),
  }));

  for (let i = 0; i < cartData.length; i++) {
    for (let j = 0; j < cartItems.length; j++) {
      if (cartData[i].productId === cartItems[i][0]._id) {
        cartItems[i][0].qty = cartData[i].qty;
      }
    }
  }

  // 2nd way : (appropriate way)
  // const cartItems = cartData.map((item) => ({
  //   ...item, ...productsData.find((product) => product._id === item.productId),
  //  }));

  // Here find method return single element so whole data we can get in a single object and also in 1d array.

  // console.log(cartItems);

  return cartItems;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  if (!items.length) return 0;
  // console.log("cart data with whole info", items);
  // console.log(items[0][0].cost,items[0][0].qty)
  const totalCost = items
    .map((item) => item[0].cost * item[0].qty)
    .reduce((total, i) => total + i, 0);
  // console.log(totalCost);
  return totalCost;
};


// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
export const getTotalItems = (items = []) => {
  // console.log("total items",items)

  const totalItems = items.reduce((acc,value)=> acc + value[0].qty , 0) 
  // console.log(totalItems)
  return totalItems;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  isReadOnly
}) => {
  if(isReadOnly){
    return <Box>qty : {value}</Box>
  }
  
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 *
 *
 */
const Cart = ({
  isReadOnly = false,
  isCheckoutButton = false, 
  products, 
  items = [], 
  handleQuantity }) => {
  const token = localStorage.getItem("token");
  const history = useHistory();
 const checkoutRoute = () => {
    history.push("/checkout")
 }
 if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
          {items.map(item => (
            <Box key = {item[0]._id}>
              {item[0].qty > 0 ?(

        <Box display="flex" alignItems="flex-start" padding="1rem">
          <Box className="image-container">
            <img
              // Add product image
              src= {item[0].image}
              // Add product name as alt eext
              alt={item[0].name}
              width="100%"
              height="100%"
            />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="6rem"
            paddingX="1rem"
          >
            <div>${item[0].name}</div>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <ItemQuantity
              // Add required props by checking implementation
              isReadOnly={isReadOnly}
              value = {item[0].qty}
              handleAdd = {async () => {
                console.log(item)
                await handleQuantity(
                  token,
                  items,
                  products,
                  item[0]._id,
                  item[0].qty+1
                );
              }}

              handleDelete = {async () =>{
                  await handleQuantity(
                    token,
                    items,
                    products,
                    item[0]._id,
                    item[0].qty-1
                  )
                }
              }

              />
              <Box padding="0.5rem" fontWeight="700">
                ${item[0].cost}
              </Box>
            </Box>
          </Box>
        </Box>
              ):(null)}
              </Box>
          )
          )}
      
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>
        
        {/* If isCheckoutButton is true, the code inside the curly braces will be rendered. Otherwise, nothing will be rendered. */}
          
          {isCheckoutButton && (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={ checkoutRoute}
            >
              Checkout
            </Button>
          </Box>
          )}
    </Box>
    
       {/* If isReadOnly is true, the code inside the curly braces will be rendered. Otherwise, nothing will be rendered. */}

       {isReadOnly && (
        <Box padding="2rem" className="cart">
          <h2>Order Details</h2>
          <Box className="cart-row">
            <p>products</p>
            <p>{getTotalItems(items)}</p>
          </Box>
          <Box className="cart-row">
            <p>Subtotal</p>
            <p>${getTotalCartValue(items)}</p>
          </Box>
           <Box className="cart-row">
            <p>Shipping Charges</p>
            <p>$0</p>
          </Box>
          <Box className="cart-row">
            <p>Total</p>
            <p>${getTotalCartValue(items)}</p>
          </Box>

        </Box>
       )}
      
    </>
  );
};

export default Cart;
