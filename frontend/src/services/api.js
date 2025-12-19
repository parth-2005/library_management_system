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
    const formData = new FormData();
    
    // Append all book fields
    formData.append('book_title', bookData.book_title);
    formData.append('book_author', bookData.book_author);
    formData.append('book_language', bookData.book_language);
    formData.append('book_price', bookData.book_price);
    formData.append('book_quantity', bookData.book_quantity);
    
    // Append file if it exists
    if (bookData.book_cover) {
      formData.append('book_cover', bookData.book_cover);
    }
    
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData - browser will set it with boundary
    
    const response = await fetch(`${API_BASE_URL}/book/addbook`, {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add book');
    }
    
    const data = await response.json();
    return data;
  },

  updateBook: async (id, bookData) => {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    let body;
    // If there's a file, use FormData, otherwise use JSON
    if (bookData.book_cover && bookData.book_cover instanceof File) {
      const formData = new FormData();
      formData.append('book_title', bookData.book_title);
      formData.append('book_author', bookData.book_author);
      formData.append('book_language', bookData.book_language);
      formData.append('book_price', bookData.book_price);
      formData.append('book_quantity', bookData.book_quantity);
      formData.append('book_cover', bookData.book_cover);
      body = formData;
      // Don't set Content-Type for FormData
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(bookData);
    }
    
    const response = await fetch(`${API_BASE_URL}/book/updatebook/${id}`, {
      method: 'PUT',
      headers: headers,
      body: body,
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
  
  sendReminderEmail: async (assignmentId) => {
    const response = await fetch(`${API_BASE_URL}/assignment/send-reminder/${assignmentId}`, {
      method: 'POST',
      headers: getAuthHeaders(false, `${API_BASE_URL}/assignment/send-reminder/${assignmentId}`),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to send reminder email');
    }
    return data;
  },
}
  
  
  
  