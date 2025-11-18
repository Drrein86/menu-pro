import axios from 'axios';

const API_BASE_URL = '/api';

// יצירת instance של axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== Menus API =====
export const getMenus = async () => {
  const response = await api.get('/menus');
  return response.data;
};

export const getMenu = async (id) => {
  const response = await api.get(`/menus/${id}`);
  return response.data;
};

export const createMenu = async (menu) => {
  const response = await api.post('/menus', menu);
  return response.data;
};

export const updateMenu = async (id, menu) => {
  const response = await api.put(`/menus/${id}`, menu);
  return response.data;
};

export const deleteMenu = async (id) => {
  const response = await api.delete(`/menus/${id}`);
  return response.data;
};

// ===== Products API =====
export const getProducts = async (menuId = 1) => {
  const response = await api.get(`/products?menu_id=${menuId}`);
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (product) => {
  const response = await api.post('/products', product);
  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await api.put(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const reorderProducts = async (orders) => {
  const response = await api.put('/products/reorder', { orders });
  return response.data;
};

// ===== Upload API =====
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

export default api;

