const API_BASE_URL = 'http://localhost:5001/api';

// Book APIs Here we have created the bookAPI object,and inside it there is a function called getAllBooks that fetches all the books from the database and returns them in a JSON format.
export const bookAPI = {
  getAllBooks: async () => {
    const response = await fetch(`${API_BASE_URL}/book/getbooks`);
    const data = await response.json();
    return data.Book || [];
  },

  getBookById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/book/getbook/${id}`);
    const data = await response.json();
    return data.Book;
  },

  addBook: async (bookData) => {
    const response = await fetch(`${API_BASE_URL}/book/addbook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
      headers: {
        'Content-Type': 'application/json',
      },
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
    });
    const data = await response.json();
    return data;
  },
};

// User APIs
export const userAPI = {
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/user/getuser`);
    const data = await response.json();
    return data.user || [];
  },

  getUserById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/user/getuser/${id}`);
    const data = await response.json();
    return data.user;
  },

  addUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/user/adduser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  },
};

// Book Assignment APIs (These endpoints need to be created in backend)
export const assignmentAPI = {
  assignBook: async (assignmentData) => {
    // TODO: Backend endpoint needed - POST /api/assignment/assign
    // Expected: { bookId, userId, daysAllowed, rent }
    const response = await fetch(`${API_BASE_URL}/assignment/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assignmentData),
    });
    const data = await response.json();
    return data;
  },

  getUserAssignments: async (userId) => {
    // TODO: Backend endpoint needed - GET /api/assignment/user/:userId
    const response = await fetch(`${API_BASE_URL}/assignment/user/${userId}`);
    const data = await response.json();
    return data.assignments || [];
  },

  getAllAssignments: async () => {
    // TODO: Backend endpoint needed - GET /api/assignment/all
    const response = await fetch(`${API_BASE_URL}/assignment/all`);
    const data = await response.json();
    return data.assignments || [];
  },

  returnBook: async (assignmentId) => {
    // TODO: Backend endpoint needed - POST /api/assignment/return/:assignmentId
    const response = await fetch(`${API_BASE_URL}/assignment/return/${assignmentId}`, {
      method: 'POST',
    });
    const data = await response.json();
    return data;
  },
};

