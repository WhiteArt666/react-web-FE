import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Cart, CartItem, Course } from '../types';
import { useToast } from '../hooks/useToast';

interface CartState {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
}

interface CartActions {
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  updateQuantity: (courseId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
  isInCart: (courseId: string) => boolean;
}

type CartContextType = CartState & CartActions;

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart reducer
type CartAction =
  | { type: 'ADD_TO_CART'; payload: Course }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { courseId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_CART'; payload: Cart };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const course = action.payload;
      const existingItem = state.cart.items.find(item => item.course.id === course.id);
      
      if (existingItem) {
        // Nếu đã có trong giỏ, tăng số lượng
        const updatedItems = state.cart.items.map(item =>
          item.course.id === course.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        return {
          ...state,
          cart: {
            ...state.cart,
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            totalAmount: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            updatedAt: new Date().toISOString()
          }
        };
      } else {
        // Thêm mới vào giỏ
        const newItem: CartItem = {
          id: `${course.id}-${Date.now()}`,
          course,
          quantity: 1,
          addedAt: new Date().toISOString(),
          price: course.price
        };
        
        const updatedItems = [...state.cart.items, newItem];
        
        return {
          ...state,
          cart: {
            ...state.cart,
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            totalAmount: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            updatedAt: new Date().toISOString()
          }
        };
      }
    }
    
    case 'REMOVE_FROM_CART': {
      const updatedItems = state.cart.items.filter(item => item.course.id !== action.payload);
      
      return {
        ...state,
        cart: {
          ...state.cart,
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalAmount: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          updatedAt: new Date().toISOString()
        }
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { courseId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: courseId });
      }
      
      const updatedItems = state.cart.items.map(item =>
        item.course.id === courseId
          ? { ...item, quantity }
          : item
      );
      
      return {
        ...state,
        cart: {
          ...state.cart,
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalAmount: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          updatedAt: new Date().toISOString()
        }
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [],
          totalItems: 0,
          totalAmount: 0,
          updatedAt: new Date().toISOString()
        }
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    
    case 'LOAD_CART':
      return {
        ...state,
        cart: action.payload
      };
    
    default:
      return state;
  }
};

const initialCart: Cart = {
  id: 'local-cart',
  items: [],
  totalAmount: 0,
  totalItems: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const initialState: CartState = {
  cart: initialCart,
  isLoading: false,
  error: null
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { showToast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('edumarket_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('edumarket_cart', JSON.stringify(state.cart));
  }, [state.cart]);

  const addToCart = (course: Course) => {
    dispatch({ type: 'ADD_TO_CART', payload: course });
    showToast('Đã thêm khóa học vào giỏ hàng', 'success');
  };

  const removeFromCart = (courseId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: courseId });
    showToast('Đã xóa khóa học khỏi giỏ hàng', 'success');
  };

  const updateQuantity = (courseId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { courseId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    showToast('Đã xóa toàn bộ giỏ hàng', 'success');
  };

  const getTotalAmount = () => state.cart.totalAmount;
  const getTotalItems = () => state.cart.totalItems;
  const isInCart = (courseId: string) => state.cart.items.some(item => item.course.id === courseId);

  const value: CartContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalAmount,
    getTotalItems,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
