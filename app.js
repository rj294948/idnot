// app.js - Main application logic
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
            // Load categories from Firestore
            await loadCategories();
            
            // Load products from Firestore  
            await loadProducts();
            
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
        
        if (categories.length === 0) {
            throw new Error("No categories found in Firestore");
        }
        
    } catch (error) {
        console.warn("Using mock categories due to error:", error.message);
        categories = getMockCategories();
    }
}

async function loadProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        products = [];
        querySnapshot.forEach((doc) => {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        if (products.length === 0) {
            throw new Error("No products found in Firestore");
        }
        
    } catch (error) {
        console.warn("Using mock products due to error:", error.message);
        products = getMockProducts();
    }
}

// Mock Data (Fallback)
function getMockCategories() {
    return [
        {
            id: '1',
            name: 'Flooring',
            type: 'flooring',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            description: 'Stone flooring solutions'
        },
        {
            id: '2', 
            name: 'Wall Decoration',
            type: 'wall',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            description: 'Wall cladding and decoration'
        },
        {
            id: '3',
            name: 'Bathroom',
            type: 'bathroom', 
            image: 'https://images.unsplash.com/photo-1600607687920-26eb2c5fab6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            description: 'Bathroom stone solutions'
        },
        {
            id: '4',
            name: 'Outdoor',
            type: 'outdoor',
            image: 'https://images.unsplash.com/photo-1600585154340-2e5db6e509e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            description: 'Outdoor stone applications'
        }
    ];
}

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
        },
        {
            id: '2',
            name: 'Sandstone Pavers',
            category: 'outdoor',
            price: '£35.00',
            image: 'https://images.unsplash.com/photo-1600585154340-2e5db6e509e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
            description: 'Natural sandstone for outdoor paving',
            stone_name: 'Raj Green Sandstone',
            type: 'Calibrated'
        },
        {
            id: '3',
            name: 'Marble Tiles',
            category: 'bathroom',
            price: '£75.00',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
            description: 'Luxury marble tiles for bathrooms',
            stone_name: 'White Marble',
            type: 'Polished'
        }
    ];
}

async function loadMockData() {
    categories = getMockCategories();
    products = getMockProducts();
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

function displaySearchResults(query) {
    const searchResults = document.getElementById('searchResults');
    const searchTerm = query.toLowerCase();
    
    const productResults = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        (product.stone_name && product.stone_name.toLowerCase().includes(searchTerm)) ||
        (product.type && product.type.toLowerCase().includes(searchTerm))
    );
    
    const categoryResults = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm) ||
        category.type.toLowerCase().includes(searchTerm)
    );
    
    let resultsHTML = '';
    
    if (productResults.length === 0 && categoryResults.length === 0) {
        resultsHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 24px; margin-bottom: 10px;"></i>
                <p>No results found for "${query}"</p>
            </div>
        `;
    } else {
        categoryResults.forEach(category => {
            resultsHTML += `
                <div class="search-result-item" onclick="window.location.href='category-products.html?category=${category.type}'">
                    <div class="search-result-image" style="background-image: url('${category.image}')"></div>
                    <div class="search-result-content">
                        <div class="search-result-name">${category.name}</div>
                        <div class="search-result-category">Category</div>
                    </div>
                </div>
            `;
        });
        
        productResults.forEach(product => {
            resultsHTML += `
                <div class="search-result-item" onclick="window.location.href='product-details.html?id=${product.id}'">
                    <div class="search-result-image" style="background-image: url('${product.image}')"></div>
                    <div class="search-result-content">
                        <div class="search-result-name">${product.name}</div>
                        <div class="search-result-category">${formatCategory(product.category)}</div>
                        ${product.type ? `<div style="font-size: 12px; color: #666; margin: 2px 0;">${product.type}</div>` : ''}
                        <div class="search-result-price">${product.price}</div>
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
        'flooring': 'Flooring',
        'wall': 'Wall Decoration',
        'bathroom': 'Bathroom',
        'outdoor': 'Outdoor',
        'kitchen': 'Kitchen',
        'commercial': 'Commercial'
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
