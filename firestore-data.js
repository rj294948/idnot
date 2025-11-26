// firestore-data.js - Firestore data management
import { 
    db, storage,
    collection, addDoc, getDocs, serverTimestamp,
    ref, uploadBytes, getDownloadURL
} from './firebase-config.js';

// Initialize Firestore with sample data
export async function initializeFirestoreData() {
    try {
        console.log("🔄 Initializing Firestore with sample data...");
        
        // Check if categories already exist
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        if (categoriesSnapshot.empty) {
            await createSampleCategories();
        }
        
        // Check if products already exist
        const productsSnapshot = await getDocs(collection(db, 'products'));
        if (productsSnapshot.empty) {
            await createSampleProducts();
        }
        
        console.log("✅ Firestore data initialized successfully");
        return true;
        
    } catch (error) {
        console.error("❌ Error initializing Firestore data:", error);
        return false;
    }
}

// Create sample categories
async function createSampleCategories() {
    const categories = [
        {
            name: 'Flooring',
            type: 'flooring',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            description: 'Premium stone flooring solutions for homes and commercial spaces',
            created_at: serverTimestamp()
        },
        {
            name: 'Wall Decoration',
            type: 'wall',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            description: 'Wall cladding and decorative stone solutions',
            created_at: serverTimestamp()
        },
        {
            name: 'Bathroom',
            type: 'bathroom',
            image: 'https://images.unsplash.com/photo-1600607687920-26eb2c5fab6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            description: 'Bathroom stone tiles and solutions',
            created_at: serverTimestamp()
        },
        {
            name: 'Outdoor',
            type: 'outdoor',
            image: 'https://images.unsplash.com/photo-1600585154340-2e5db6e509e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            description: 'Outdoor stone paving and landscaping',
            created_at: serverTimestamp()
        },
        {
            name: 'Kitchen',
            type: 'kitchen',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            description: 'Kitchen countertops and stone surfaces',
            created_at: serverTimestamp()
        },
        {
            name: 'Commercial',
            type: 'commercial',
            image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
            description: 'Commercial stone projects and installations',
            created_at: serverTimestamp()
        }
    ];

    for (const category of categories) {
        await addDoc(collection(db, 'categories'), category);
    }
    console.log("✅ Sample categories created");
}

// Create sample products
async function createSampleProducts() {
    const products = [
        {
            name: 'Kota Blue Stone',
            stone_name: 'Kota Blue',
            category: 'flooring',
            type: 'Natural Stone',
            price: '£45.00',
            price_unit: 'sqft',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
            description: 'Premium quality kota stone for flooring with natural blue tones. Perfect for indoor and outdoor flooring applications.',
            color: 'Blue',
            thickness: '20-30 mm',
            size: 'Custom Sizes',
            finish: 'Natural',
            usage: 'Flooring, Pavement',
            water_absorption: '2-3%',
            density: '2.4-2.6 g/cm³',
            compressive_strength: '1800-2200 kg/cm²',
            created_at: serverTimestamp(),
            status: 'active'
        },
        {
            name: 'Raj Green Sandstone',
            stone_name: 'Raj Green',
            category: 'flooring',
            type: 'Calibrated',
            price: '£38.00',
            price_unit: 'sqft',
            image: 'https://images.unsplash.com/photo-1600585154340-2e5db6e509e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
            description: 'Beautiful green sandstone with natural patterns. Ideal for flooring and wall cladding.',
            color: 'Green',
            thickness: '15-25 mm',
            size: 'Standard Tiles',
            finish: 'Honed',
            usage: 'Flooring, Wall Cladding',
            water_absorption: '3-4%',
            density: '2.3-2.5 g/cm³',
            compressive_strength: '1600-2000 kg/cm²',
            created_at: serverTimestamp(),
            status: 'active'
        },
        {
            name: 'White Marble Tiles',
            stone_name: 'White Marble',
            category: 'bathroom',
            type: 'Polished',
            price: '£75.00',
            price_unit: 'sqft',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
            description: 'Luxury white marble tiles perfect for bathroom walls and floors. Elegant and durable.',
            color: 'White',
            thickness: '10-15 mm',
            size: '12x12, 24x24 inches',
            finish: 'Polished',
            usage: 'Bathroom Walls, Flooring',
            water_absorption: '0.5-1%',
            density: '2.7-2.9 g/cm³',
            compressive_strength: '2500-3000 kg/cm²',
            created_at: serverTimestamp(),
            status: 'active'
        },
        {
            name: 'Black Galaxy Granite',
            stone_name: 'Black Galaxy',
            category: 'kitchen',
            type: 'Polished',
            price: '£120.00',
            price_unit: 'sqft',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
            description: 'Premium black granite with golden speckles. Perfect for kitchen countertops.',
            color: 'Black with Gold',
            thickness: '20-30 mm',
            size: 'Slabs, Custom Cut',
            finish: 'Polished',
            usage: 'Kitchen Countertops',
            water_absorption: '0.2-0.5%',
            density: '2.9-3.1 g/cm³',
            compressive_strength: '2800-3200 kg/cm²',
            created_at: serverTimestamp(),
            status: 'active'
        },
        {
            name: 'Kota Brown Limestone',
            stone_name: 'Kota Brown',
            category: 'wall',
            type: 'Natural',
            price: '£55.00',
            price_unit: 'sqft',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
            description: 'Natural brown limestone for wall cladding and feature walls.',
            color: 'Brown',
            thickness: '15-20 mm',
            size: 'Random Patterns',
            finish: 'Natural',
            usage: 'Wall Cladding, Feature Walls',
            water_absorption: '2-3%',
            density: '2.5-2.7 g/cm³',
            compressive_strength: '2000-2400 kg/cm²',
            created_at: serverTimestamp(),
            status: 'active'
        },
        {
            name: 'Dholpur Stone',
            stone_name: 'Dholpur Red',
            category: 'commercial',
            type: 'Calibrated',
            price: '£40.00',
            price_unit: 'sqft',
            image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
            description: 'Durable Dholpur stone for commercial flooring and outdoor applications.',
            color: 'Red',
            thickness: '25-35 mm',
            size: 'Commercial Slabs',
            finish: 'Calibrated',
            usage: 'Commercial Flooring, Outdoor',
            water_absorption: '3-4%',
            density: '2.4-2.6 g/cm³',
            compressive_strength: '1700-2100 kg/cm²',
            created_at: serverTimestamp(),
            status: 'active'
        }
    ];

    for (const product of products) {
        await addDoc(collection(db, 'products'), product);
    }
    console.log("✅ Sample products created");
}

// Add new product to Firestore
export async function addProduct(productData) {
    try {
        const docRef = await addDoc(collection(db, 'products'), {
            ...productData,
            created_at: serverTimestamp(),
            status: 'active'
        });
        console.log("✅ Product added with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("❌ Error adding product: ", error);
        return { success: false, error: error.message };
    }
}

// Upload image to Firebase Storage
export async function uploadImage(file) {
    try {
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return { success: true, url: downloadURL };
    } catch (error) {
        console.error("❌ Error uploading image: ", error);
        return { success: false, error: error.message };
    }
}

// Get all products
export async function getAllProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return products;
    } catch (error) {
        console.error("❌ Error getting products: ", error);
        return [];
    }
}

// Get all categories
export async function getAllCategories() {
    try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categories = [];
        querySnapshot.forEach((doc) => {
            categories.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return categories;
    } catch (error) {
        console.error("❌ Error getting categories: ", error);
        return [];
    }
}

// Get products by category
export async function getProductsByCategory(category) {
    try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = [];
        querySnapshot.forEach((doc) => {
            const product = { id: doc.id, ...doc.data() };
            if (product.category === category) {
                products.push(product);
            }
        });
        return products;
    } catch (error) {
        console.error("❌ Error getting products by category: ", error);
        return [];
    }
}
