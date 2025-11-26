// auth.js - Updated with Products Management Support
import { 
  auth,
  db,
  storage,
  googleProvider,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  ref,
  uploadBytes,
  getDownloadURL
} from './firebase-config.js';

// Authentication Manager Class
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.userData = null;
    this.initAuthListener();
  }

  initAuthListener() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.updateUI(user);
      
      // Store user info in localStorage for persistence
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify({
          email: user.email,
          displayName: user.displayName,
          uid: user.uid
        }));
      } else {
        localStorage.removeItem('currentUser');
      }
    });
  }

  async signUp(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      await this.createUserDocument(userCredential.user, displayName);
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await this.createUserDocument(result.user, result.user.displayName);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async createUserDocument(user, displayName) {
    try {
      const userDoc = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      };

      await addDoc(collection(db, "users"), userDoc);
      console.log("User document created");
    } catch (error) {
      console.error("Error creating user document:", error);
    }
  }

  // ✅ IMPROVED: Better UI update method
  updateUI(user) {
    const loginBtn = document.getElementById('loginButton');
    const userProfile = document.getElementById('userProfile');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');

    if (user) {
      // User is signed in - show profile, hide login
      if (userProfile) {
        userProfile.style.display = 'block';
      }
      if (loginBtn) {
        loginBtn.style.display = 'none';
      }
      
      // Update user information
      const displayName = user.displayName || 'User';
      const email = user.email || '';
      
      if (profileAvatar) {
        profileAvatar.textContent = displayName.charAt(0).toUpperCase();
      }
      if (profileName) {
        profileName.textContent = displayName;
      }
      if (dropdownUserName) {
        dropdownUserName.textContent = displayName;
      }
      if (dropdownUserEmail) {
        dropdownUserEmail.textContent = email;
      }
    } else {
      // User is signed out - show login, hide profile
      if (userProfile) {
        userProfile.style.display = 'none';
      }
      if (loginBtn) {
        loginBtn.style.display = 'flex';
      }
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  getErrorMessage(error) {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }
}

// Products Manager Class
class ProductsManager {
  constructor() {
    this.products = [];
  }

  // Load all products
  async loadProducts(category = null, type = null) {
    try {
      let q;
      const productsCollection = collection(db, 'products');
      
      if (category && type) {
        q = query(
          productsCollection,
          where('category', '==', category),
          where('types', 'array-contains', type)
        );
      } else if (category) {
        q = query(productsCollection, where('category', '==', category));
      } else {
        q = query(productsCollection, orderBy('createdAt', 'desc'));
      }

      const querySnapshot = await getDocs(q);
      this.products = [];
      querySnapshot.forEach((doc) => {
        this.products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return this.products;
    } catch (error) {
      console.error("Error loading products:", error);
      return [];
    }
  }

  // Real-time products listener
  listenToProducts(callback, category = null) {
    let q;
    const productsCollection = collection(db, 'products');
    
    if (category) {
      q = query(productsCollection, where('category', '==', category));
    } else {
      q = query(productsCollection, orderBy('createdAt', 'desc'));
    }

    return onSnapshot(q, (snapshot) => {
      const products = [];
      snapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(products);
    });
  }

  // Add new product
  async addProduct(productData, imageFile) {
    try {
      let imageUrl = '';
      
      // Upload image if provided
      if (imageFile) {
        imageUrl = await this.uploadImage(imageFile);
      }

      const productWithImage = {
        ...productData,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'products'), productWithImage);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error adding product:", error);
      return { success: false, error: error.message };
    }
  }

  // Update product
  async updateProduct(productId, productData, imageFile = null) {
    try {
      let updateData = {
        ...productData,
        updatedAt: serverTimestamp()
      };

      // Upload new image if provided
      if (imageFile) {
        updateData.imageUrl = await this.uploadImage(imageFile);
      }

      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, updateData);
      return { success: true };
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false, error: error.message };
    }
  }

  // Delete product
  async deleteProduct(productId) {
    try {
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);
      return { success: true };
    } catch (error) {
      console.error("Error deleting product:", error);
      return { success: false, error: error.message };
    }
  }

  // Upload image to Firebase Storage
  async uploadImage(file) {
    try {
      const timestamp = Date.now();
      const fileName = `products/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error('Failed to upload image');
    }
  }

  // Get products by category
  async getProductsByCategory(category) {
    return this.loadProducts(category);
  }

  // Get products by type
  async getProductsByType(category, type) {
    return this.loadProducts(category, type);
  }

  // Search products
  async searchProducts(searchTerm) {
    const allProducts = await this.loadProducts();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}

// Initialize Auth Manager
const authManager = new AuthManager();

// Initialize Products Manager
const productsManager = new ProductsManager();

// Export for use in other files
export { authManager, productsManager };
