

const STROAGE_KEY = {
    todos: 'todos',
    users: 'users',
    products: 'products',
    orders: 'orders',
    notifications:'notifications',
}

// Read an array from localStorage.
// If no data exists, return the provided initial data.
export function getItems(key,initialData = []) {
  try{
    const storageData = localStorage.getItem( STROAGE_KEY[key])

    if(storageData ===null){
      localStorage.setItem(STROAGE_KEY[key],JSON.stringify(initialData))

      return initialData;
    }
    
    const parsedData = JSON.parse(storageData)
    return parsedData;

  }catch(error){
  console.error("Could not read saved data:", error);
    return initialData;
  }
}


// Save an array to localStorage.
export function saveItems(key, items) {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(items));
    return true;
  } catch (error) {
    console.error("Could not save data:", error);
    return false;
  }
}


// Generate a unique ID for a new record.
export function createId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}


// Create a record.
export function addItem(key, item) {
  const items = getItems(key);
  const newItem = { id: createId(), ...item };

  saveItems(key, [...items, newItem]);

  return newItem;
}


// Update a record by ID.
export function updateItem(key, id, changes) {
  const items = getItems(key);

  const updatedItems = items.map((item) =>
    item.id === id ? { ...item, ...changes } : item
  );

  saveItems(key, updatedItems);

  return updatedItems;
}


// Delete a record by ID.
export function deleteItem(key, id) {
  const items = getItems(key);
  const remainingItems = items.filter((item) => item.id !== id);

  saveItems(key, remainingItems);

  return remainingItems;
}

// Initialize example data the first time the app runs.
export function initializeData() {
  getItems("todos", [
    {
      id: "todo-1",
      title: "Learn React components",
      description: "Understand props, state, and JSX.",
      completed: false,
      priority: "High",
      createdAt: new Date().toISOString(),
    },
    {
      id: "todo-2",
      title: "Practice React Router",
      description: "Build protected routes.",
      completed: true,
      priority: "Medium",
      createdAt: new Date().toISOString(),
    },
  ]);

  getItems("users", [
    {
      id: "user-1",
      name: "Demo Admin",
      email: "admin@example.com",
      role: "admin",
    },
  ]);

  getItems("products", [
    {
      id: "product-1",
      name: "Notebook",
      price: 120,
      stock: 25,
    },
  ]);

  getItems("orders", []);

  getItems("notifications", [
    {
      id: "notification-1",
      message: "Welcome to your Todo workspace!",
      read: false,
      createdAt: new Date().toISOString(),
    },
  ]);
}