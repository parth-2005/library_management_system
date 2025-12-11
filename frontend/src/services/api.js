const API_BASE_URL ='http://localhost:5001/api';
const getAuthHeaders = (isJson = true, url = '') => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  // Only add Authorization if token exists and not calling login/signup endpoints
  const isAuthRoute =
    url.includes('/login') || url.includes('/signup');
  if (token && !isAuthRoute) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export const authAPI = {
  adminSignup: async (payload) => {
    const response = await fetch(`${API_BASE_URL}/admin/signup`, {
      method: 'POST',
      headers: getAuthHeaders(true, `${API_BASE_URL}/admin/signup`),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Admin signup failed');
    }
    return data;
  },
  adminLogin: async (payload) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: getAuthHeaders(true, `${API_BASE_URL}/admin/login`),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Admin login failed');
    }
    return data;
  },
  userLogin: async (payload) => {
    // Remove any old token before login to avoid sending invalid Authorization header
    localStorage.removeItem('token');
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: getAuthHeaders(true, `${API_BASE_URL}/user/login`),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'User login failed');
    }
    return data;
  },
};

// Book APIs
export const bookAPI = {
  getAllBooks: async () => {
    const response = await fetch(`${API_BASE_URL}/book/getbooks`, {
      headers: getAuthHeaders(false, `${API_BASE_URL}/book/getbooks`),
    });
    const data = await response.json();
    return data.Book || [];
  },

  getBookById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/book/getbook/${id}`, {
      headers: getAuthHeaders(false, `${API_BASE_URL}/book/getbook/${id}`),
    });
    const data = await response.json();
    return data.Book;
  },

  addBook: async (bookData) => {
    const response = await fetch(`${API_BASE_URL}/book/addbook`, {
      method: 'POST',
      headers: getAuthHeaders(true, `${API_BASE_URL}/book/addbook`),
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add book');
    }
    
    const data = await response.json();
    return data;
  },

  updateBook: async (id, bookData) => {
    const response = await fetch(`${API_BASE_URL}/book/updatebook/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true, `${API_BASE_URL}/book/updatebook/${id}`),
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update book');
    }
    
    const data = await response.json();
    return data;
  },

  deleteBook: async (id) => {
    const response = await fetch(`${API_BASE_URL}/book/deletebook/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false, `${API_BASE_URL}/book/deletebook/${id}`),
    });
    const data = await response.json();
    return data;
  },
};

// User APIs (admin only)
export const userAPI = {
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders(false, `${API_BASE_URL}/admin/users`),
    });
    const data = await response.json();
    return data || [];
  },

  createUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(true, `${API_BASE_URL}/admin/users`),
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create user');
    }
    return data;
  },
};

// Book Assignment APIs
export const assignmentAPI = {
  assignBook: async (assignmentData) => {
    const response = await fetch(`${API_BASE_URL}/assignment/assign`, {
      method: 'POST',
      headers: getAuthHeaders(true, `${API_BASE_URL}/assignment/assign`),
      body: JSON.stringify(assignmentData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to assign book');
    }
    return data;
  },

  getUserAssignments: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/assignment/user/${userId}`, {
      headers: getAuthHeaders(false, `${API_BASE_URL}/assignment/user/${userId}`),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch assignments');
    }
    return data.assignments || [];
  },

  getAllAssignments: async () => {
    const response = await fetch(`${API_BASE_URL}/assignment/all`, {
      headers: getAuthHeaders(false, `${API_BASE_URL}/assignment/all`),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch assignments');
    }
    return data.assignments || [];
  },

  returnBook: async (assignmentId) => {
    const response = await fetch(`${API_BASE_URL}/assignment/return/${assignmentId}`, {
      method: 'POST',
      headers: getAuthHeaders(false, `${API_BASE_URL}/assignment/return/${assignmentId}`),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to return book');
    }
    return data;
  },
};

