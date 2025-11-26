// app.js - COMPLETE FIXED VERSION
import { 
    db, auth, googleProvider,
    collection, getDocs, onAuthStateChanged, signOut, signInWithPopup
} from './firebase-config.js';
import { initializeFirestoreData } from './firestore-data.js';

// Application State
let currentUser = null;
let products = [];
let categories = [];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing StoneCraft Application...");
    initializeApp();
});

async function initializeApp() {
    try {
        // Initialize Auth
        await initializeAuth();
        
        // Initialize Data
        await initializeData();
        
        // Initialize UI Components
        initializeUI();
        
        console.log("✅ StoneCraft Application initialized successfully");
        
    } catch (error) {
        console.error("❌ Application initialization failed:", error);
        showError("Application failed to load. Please refresh the page.");
    }
}

// Authentication Management
async function initializeAuth() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            currentUser = user;
            updateAuthUI(user);
            resolve();
        });
    });
}

function updateAuthUI(user) {
    const loginBtn = document.getElementById('loginButton');
    const userProfile = document.getElementById('userProfile');
    const addProductBtn = document.getElementById('addProductButton');
    const heroAddProductBtn = document.getElementById('heroAddProductBtn');
    
    if (user) {
        // User is signed in
        if (userProfile) userProfile.style.display = 'block';
        if (loginBtn) loginBtn.style.display = 'none';
        if (addProductBtn) addProductBtn.style.display = 'flex';
        if (heroAddProductBtn) heroAddProductBtn.style.display = 'inline-block';
        
        const displayName = user.displayName || 'User';
        const email = user.email || '';
        
        updateProfileElements(displayName, email);
        
    } else {
        // User is signed out
        if (userProfile) userProfile.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'flex';
        if (addProductBtn) addProductBtn.style.display = 'none';
        if (heroAddProductBtn) heroAddProductBtn.style.display = 'none';
    }
}

function updateProfileElements(displayName, email) {
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');
    
    if (profileAvatar) profileAvatar.textContent = displayName.charAt(0).toUpperCase();
    if (profileName) profileName.textContent = displayName;
    if (dropdownUserName) dropdownUserName.textContent = displayName;
    if (dropdownUserEmail) dropdownUserEmail.textContent = email;
}

// Data Management
async function initializeData() {
    try {
        console.log("📊 Loading data from Firestore...");
        
        // Try to initialize Firestore with sample data
        const firestoreInitialized = await initializeFirestoreData();
        
        if (firestoreInitialized) {
            // Load products first (because categories need products data)
            await loadProducts();
            
            // Load categories from Firestore or generate from products
            await loadCategories();
            
            console.log("✅ Data loaded successfully from Firestore");
        } else {
            // Use mock data if Firestore initialization fails
            await loadMockData();
            console.log("✅ Using mock data");
        }
        
        console.log("📁 Categories:", categories.length);
        console.log("📦 Products:", products.length);
        
    } catch (error) {
        console.error("❌ Error loading data:", error);
        await loadMockData();
    }
}

async function loadProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        products = [];
        querySnapshot.forEach((doc) => {
            const productData = doc.data();
            
            // Transform data to match expected structure
            const transformedProduct = {
                id: doc.id,
                name: productData.stone_name || productData.name || 'Unnamed Product',
                category: productData.category || 'uncategorized',
                price: productData.price ? `£${productData.price}` : 'Price not set',
                image: productData.images && productData.images.length > 0 ? productData.images[0] : 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
                description: productData.description || 'No description available',
                stone_name: productData.stone_name,
                type: productData.type,
                // Include all original fields
                ...productData
            };
            
            products.push(transformedProduct);
        });
        
        console.log("✅ Products loaded from Firestore:", products);
        
        if (products.length === 0) {
            throw new Error("No products found in Firestore");
        }
        
    } catch (error) {
        console.warn("Using mock products due to error:", error.message);
        products = getMockProducts();
    }
}

async function loadCategories() {
    try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        categories = [];
        querySnapshot.forEach((doc) => {
            categories.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Agar categories empty hain, toh products se categories generate karein
        if (categories.length === 0) {
            categories = generateCategoriesFromProducts();
        }
        
        console.log("✅ Categories loaded:", categories);
        
    } catch (error) {
        console.warn("Using generated categories due to error:", error.message);
        categories = generateCategoriesFromProducts();
    }
}

// Products se categories generate karein
function generateCategoriesFromProducts() {
    const categoryMap = {};
    
    products.forEach(product => {
        const categoryType = product.category || 'uncategorized';
        if (!categoryMap[categoryType]) {
            categoryMap[categoryType] = {
                name: formatCategoryName(categoryType),
                type: categoryType,
                image: getCategoryImage(categoryType),
                description: `${formatCategoryName(categoryType)} stone solutions`,
                productCount: 0
            };
        }
        categoryMap[categoryType].productCount++;
    });
    
    return Object.values(categoryMap).map((cat, index) => ({
        id: `cat_${index}`,
        ...cat
    }));
}

function formatCategoryName(category) {
    const nameMap = {
        'sandstone': 'Sandstone',
        'flooring': 'Flooring',
        'wall': 'Wall Decoration',
        'bathroom': 'Bathroom',
        'outdoor': 'Outdoor',
        'kitchen': 'Kitchen',
        'commercial': 'Commercial',
        'uncategorized': 'Other Stones'
    };
    return nameMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

function getCategoryImage(category) {
    const imageMap = {
        'sandstone': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        'flooring': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        'wall': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        'bathroom': 'https://images.unsplash.com/photo-1600607687920-26eb2c5fab6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        'outdoor': 'https://images.unsplash.com/photo-1600585154340-2e5db6e509e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        'kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        'commercial': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
    };
    return imageMap[category] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80';
}

// Mock Data (Fallback)
function getMockProducts() {
    return [
        {
            id: '1',
            name: 'Kota Blue Stone',
            category: 'flooring',
            price: '£45.00',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
            description: 'Premium quality kota stone for flooring',
            stone_name: 'Kota Blue',
            type: 'Natural Stone'
        }
    ];
}

async function loadMockData() {
    products = getMockProducts();
    categories = generateCategoriesFromProducts();
    showDemoNotification();
}

function showDemoNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 200px;
        right: 20px;
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
        padding: 15px;
        border-radius: 8px;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    notification.innerHTML = `
        <strong><i class="fas fa-info-circle"></i> Demo Mode</strong>
        <p style="margin: 8px 0 0; font-size: 14px;">Using demo data. Real data will load when Firestore is configured.</p>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// UI Initialization
function initializeUI() {
    initializeSearch();
    renderCategories();
    setupEventListeners();
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchButton = document.getElementById('searchButton');
    
    if (searchInput && searchResults) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('focus', handleSearchFocus);
        searchButton.addEventListener('click', performSearch);
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchResults.classList.remove('active');
            }
        });
    }
}

function handleSearch(e) {
    const query = e.target.value.trim();
    const searchResults = document.getElementById('searchResults');
    
    if (query.length === 0) {
        searchResults.classList.remove('active');
        return;
    }
    
    searchResults.classList.add('active');
    displaySearchResults(query);
}

function handleSearchFocus() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput.value.length > 0) {
        searchResults.classList.add('active');
    }
}

// FIXED: Search function with proper error handling
function displaySearchResults(query) {
    const searchResults = document.getElementById('searchResults');
    const searchTerm = query.toLowerCase();
    
    const productResults = products.filter(product => {
        // Safe property access with fallbacks
        const name = product.name || '';
        const description = product.description || '';
        const category = product.category || '';
        const stoneName = product.stone_name || '';
        const type = product.type || '';
        
        return name.toLowerCase().includes(searchTerm) ||
               description.toLowerCase().includes(searchTerm) ||
               category.toLowerCase().includes(searchTerm) ||
               stoneName.toLowerCase().includes(searchTerm) ||
               type.toLowerCase().includes(searchTerm);
    });
    
    const categoryResults = categories.filter(category => {
        const name = category.name || '';
        const type = category.type || '';
        
        return name.toLowerCase().includes(searchTerm) ||
               type.toLowerCase().includes(searchTerm);
    });
    
    let resultsHTML = '';
    
    if (productResults.length === 0 && categoryResults.length === 0) {
        resultsHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 24px; margin-bottom: 10px;"></i>
                <p>No results found for "${query}"</p>
            </div>
        `;
    } else {
        // Show categories first
        categoryResults.forEach(category => {
            resultsHTML += `
                <div class="search-result-item" onclick="window.location.href='category-products.html?category=${category.type}'">
                    <div class="search-result-image" style="background-image: url('${category.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'}')"></div>
                    <div class="search-result-content">
                        <div class="search-result-name">${category.name}</div>
                        <div class="search-result-category">Category</div>
                    </div>
                </div>
            `;
        });
        
        // Then show products
        productResults.forEach(product => {
            const productType = product.type ? `<div style="font-size: 12px; color: #666; margin: 2px 0;">${product.type}</div>` : '';
            const productPrice = product.price || 'Price not set';
            
            resultsHTML += `
                <div class="search-result-item" onclick="window.location.href='product-details.html?id=${product.id}'">
                    <div class="search-result-image" style="background-image: url('${product.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'}')"></div>
                    <div class="search-result-content">
                        <div class="search-result-name">${product.name}</div>
                        <div class="search-result-category">${formatCategory(product.category)}</div>
                        ${productType}
                        <div class="search-result-price">${productPrice}</div>
                    </div>
                </div>
            `;
        });
        
        resultsHTML += `
            <div class="view-all-results">
                <a href="search-results.html?q=${encodeURIComponent(query)}">View all results for "${query}"</a>
            </div>
        `;
    }
    
    searchResults.innerHTML = resultsHTML;
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query.length > 0) {
        window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
    }
}

function formatCategory(category) {
    const categoryMap = {
        'sandstone': 'Sandstone',
        'flooring': 'Flooring',
        'wall': 'Wall Decoration',
        'bathroom': 'Bathroom',
        'outdoor': 'Outdoor',
        'kitchen': 'Kitchen',
        'commercial': 'Commercial',
        'uncategorized': 'Other Stones'
    };
    return categoryMap[category] || category;
}

// Categories Rendering
function renderCategories() {
    const categoriesGrid = document.getElementById('dynamicCategories');
    if (!categoriesGrid) return;
    
    if (categories.length === 0) {
        categoriesGrid.innerHTML = `
            <div class="loading-categories" style="grid-column: 1 / -1;">
                <i class="fas fa-exclamation-triangle"></i>
                <p>No categories available</p>
            </div>
        `;
        return;
    }
    
    let categoriesHTML = '';
    
    categories.forEach(category => {
        const categoryProducts = products.filter(product => 
            product.category === category.type
        );
        
        categoriesHTML += `
            <div class="use-category-item">
                <a href="category-products.html?category=${category.type}" class="use-category-link">
                    <div class="use-category-image" style="background-image: url('${category.image}')"></div>
                    <div class="use-category-name">${category.name}</div>
                    <div class="product-count">${categoryProducts.length} products</div>
                </a>
            </div>
        `;
    });
    
    categoriesGrid.innerHTML = categoriesHTML;
}

// Event Listeners
function setupEventListeners() {
    // Profile dropdown
    const profileToggle = document.getElementById('profileToggle');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (profileToggle && profileDropdown) {
        profileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!profileToggle.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('active');
            }
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await handleLogout();
        });
    }
    
    // Search enter key
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

async function handleLogout() {
    try {
        await signOut(auth);
        console.log('User logged out successfully');
        window.location.reload();
    } catch (error) {
        console.error('Error logging out:', error);
        showError('Logout failed. Please try again.');
    }
}

// Utility Functions
function showError(message) {
    console.error('Application Error:', message);
    // You can implement a toast notification here
}

function showSuccess(message) {
    console.log('Success:', message);
    // You can implement a toast notification here
}

// Make functions available globally for HTML onclick events
window.performSearch = performSearch;
