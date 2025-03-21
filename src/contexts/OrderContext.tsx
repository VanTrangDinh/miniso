import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
  paymentMethod: string;
  orderStatus: string;
  estimatedDelivery: string;
  shippingInfo: {
    name: string;
    address: string;
    phone: string;
  };
  shippingFee: number;
}

interface OrderState {
  orders: Order[];
}

type OrderAction =
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'CLEAR_ORDERS' };

const OrderContext = createContext<{
  state: OrderState;
  addOrder: (order: Order) => void;
  clearOrders: () => void;
} | null>(null);

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };
    case 'CLEAR_ORDERS':
      return {
        ...state,
        orders: [],
      };
    default:
      return state;
  }
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, {
    orders: [],
  });

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        if (Array.isArray(parsedOrders)) {
          parsedOrders.forEach((order: Order) => {
            dispatch({ type: 'ADD_ORDER', payload: order });
          });
        }
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
      }
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(state.orders));
  }, [state.orders]);

  const addOrder = (order: Order) => {
    dispatch({ type: 'ADD_ORDER', payload: order });
  };

  const clearOrders = () => {
    dispatch({ type: 'CLEAR_ORDERS' });
  };

  return (
    <OrderContext.Provider
      value={{
        state,
        addOrder,
        clearOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}; 