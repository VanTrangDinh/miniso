import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { Product } from '../types';

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
} | null>(null);

const calculateTotals = (items: CartItem[]) => {
  return items.reduce(
    (acc, item) => ({
      totalAmount: acc.totalAmount + item.price * item.quantity,
      totalItems: acc.totalItems + item.quantity,
    }),
    { totalAmount: 0, totalItems: 0 }
  );
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;
  
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        const { totalAmount, totalItems } = calculateTotals(updatedItems);
        newState = { ...state, items: updatedItems, totalAmount, totalItems };
      } else {
        const newItems = [...state.items, action.payload];
        const { totalAmount, totalItems } = calculateTotals(newItems);
        newState = { ...state, items: newItems, totalAmount, totalItems };
      }
      break;
    }
    case 'REMOVE_FROM_CART':
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
      break;
    case 'UPDATE_QUANTITY':
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
      break;
    case 'CLEAR_CART':
      newState = {
        ...state,
        items: [],
      };
      break;
    default:
      return state;
  }

  // Calculate total amount
  newState.totalAmount = newState.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return newState;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalAmount: 0,
    totalItems: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        if (cart && Array.isArray(cart.items)) {
          cart.items.forEach((item: CartItem) => {
            dispatch({ type: 'ADD_TO_CART', payload: item });
          });
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Debounce saving to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('cart', JSON.stringify(state));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [state]);

  // Memoize cart calculations
  const cartInfo = useMemo(() => ({
    totalAmount: state.items.reduce((total, item) => total + item.price * item.quantity, 0),
    totalItems: state.items.reduce((total, item) => total + item.quantity, 0),
  }), [state.items]);

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    } else {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, quantity }
    });
  };

  const value = useMemo(() => ({
    state: {
      ...state,
      totalAmount: cartInfo.totalAmount,
      totalItems: cartInfo.totalItems,
    },
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    updateCartItemQuantity,
  }), [state, cartInfo]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 