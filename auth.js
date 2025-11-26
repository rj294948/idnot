// products-management.js - Complete Solution
import { productsManager } from './auth.js';

class ProductViewer {
    constructor() {
        this.currentProductIndex = 0;
        this.products = [];
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
        this.displayCurrentProduct();
    }

    async loadProducts() {
        try {
            // Load all products or filter as needed
            this.products = await productsManager.loadProducts();
            console.log("Products loaded:", this.products.length);
        } catch (error) {
            console.error("Error loading products:", error);
            this.showError("Failed to load products");
        }
    }

    setupEventListeners() {
        // Next button event
        const nextBtn = document.getElementById('nextProductBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.loadNextProduct());
        }

        // Mark as posted button event
        const markPostedBtn = document.getElementById('markPostedBtn');
        if (markPostedBtn) {
            markPostedBtn.addEventListener('click', () => this.markAsPosted());
        }

        // Previous button event (if exists)
        const prevBtn = document.getElementById('prevProductBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.loadPreviousProduct());
        }
    }

    // ✅ FIXED: loadNextProduct function
    loadNextProduct() {
        if (this.products.length === 0) {
            this.showError("No products available");
            return;
        }

        this.currentProductIndex++;
        if (this.currentProductIndex >= this.products.length) {
            this.currentProductIndex = 0; // Loop back to start
        }
        
        this.displayCurrentProduct();
        this.updateNavigationButtons();
    }

    // ✅ FIXED: loadPreviousProduct function
    loadPreviousProduct() {
        if (this.products.length === 0) {
            this.showError("No products available");
            return;
        }

        this.currentProductIndex--;
        if (this.currentProductIndex < 0) {
            this.currentProductIndex = this.products.length - 1; // Loop to end
        }
        
        this.displayCurrentProduct();
        this.updateNavigationButtons();
    }

    // ✅ FIXED: markAsPosted function
    async markAsPosted() {
        if (this.products.length === 0) {
            this.showError("No product to mark as posted");
            return;
        }

        const currentProduct = this.products[this.currentProductIndex];
        
        try {
            // Update product status to posted
            const result = await productsManager.updateProduct(currentProduct.id, {
                ...currentProduct,
                status: 'posted',
                postedAt: new Date()
            });

            if (result.success) {
                this.showSuccess("Product marked as posted successfully!");
                
                // Move to next product automatically
                setTimeout(() => {
                    this.loadNextProduct();
                }, 1500);
            } else {
                this.showError("Failed to mark product as posted");
            }
        } catch (error) {
            console.error("Error marking product as posted:", error);
            this.showError("Error updating product status");
        }
    }

    displayCurrentProduct() {
        if (this.products.length === 0) {
            this.showNoProducts();
            return;
        }

        const product = this.products[this.currentProductIndex];
        this.renderProduct(product);
    }

    renderProduct(product) {
        // Update your HTML elements with product data
        const elements = {
            'productName': product.name,
            'productPrice': `£${parseFloat(product.price).toFixed(2)}`,
            'productDescription': product.description,
            'productCategory': this.formatCategory(product.category),
            'productImage': product.imageUrl || 'default-image.jpg'
        };

        // Update each element
        Object.keys(elements).forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                if (elementId === 'productImage' && element.tagName === 'IMG') {
                    element.src = elements[elementId];
                    element.alt = product.name;
                } else {
                    element.textContent = elements[elementId];
                }
            }
        });

        // Update current position indicator
        this.updatePositionIndicator();
    }

    updatePositionIndicator() {
        const indicator = document.getElementById('positionIndicator');
        if (indicator) {
            indicator.textContent = `${this.currentProductIndex + 1} of ${this.products.length}`;
        }
    }

    updateNavigationButtons() {
        const nextBtn = document.getElementById('nextProductBtn');
        const prevBtn = document.getElementById('prevProductBtn');

        if (nextBtn) {
            nextBtn.disabled = this.products.length <= 1;
        }
        if (prevBtn) {
            prevBtn.disabled = this.products.length <= 1;
        }
    }

    showNoProducts() {
        // Show no products message
        const container = document.getElementById('productContainer');
        if (container) {
            container.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-box-open"></i>
                    <h3>No Products Available</h3>
                    <p>There are no products to display at the moment.</p>
                </div>
            `;
        }
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        // Create or update message element
        let messageEl = document.getElementById('messageAlert');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'messageAlert';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 6px;
                color: white;
                z-index: 1000;
                font-weight: 600;
            `;
            document.body.appendChild(messageEl);
        }

        messageEl.textContent = message;
        messageEl.style.background = type === 'error' ? '#dc3545' : '#28a745';
        messageEl.style.display = 'block';

        // Auto hide after 3 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }

    formatCategory(category) {
        const categories = {
            'flooring': 'Flooring',
            'wall': 'Wall Decoration',
            'bathroom': 'Bathroom',
            'outdoor': 'Outdoor',
            'kitchen': 'Kitchen',
            'commercial': 'Commercial'
        };
        return categories[category] || category;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productViewer = new ProductViewer();
});

// Global functions for HTML onclick attributes
window.loadNextProduct = function() {
    if (window.productViewer) {
        window.productViewer.loadNextProduct();
    }
};

window.markAsPosted = function() {
    if (window.productViewer) {
        window.productViewer.markAsPosted();
    }
};

window.loadPreviousProduct = function() {
    if (window.productViewer) {
        window.productViewer.loadPreviousProduct();
    }
};
