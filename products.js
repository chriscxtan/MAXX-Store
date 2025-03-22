// Product data with categories
const products = [
    {
        id: 1,
        name: "Italian Leather Wallet",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Handcrafted genuine Italian leather wallet",
        category: "accessories"
    },
    {
        id: 2,
        name: "Designer Sunglasses",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Luxury designer sunglasses with UV protection",
        category: "accessories"
    },
    {
        id: 3,
        name: "Silk Scarf",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Elegant silk scarf with Italian design",
        category: "accessories"
    },
    {
        id: 4,
        name: "Leather Backpack",
        price: 249.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Stylish leather backpack with multiple compartments",
        category: "bags"
    },
    {
        id: 5,
        name: "Classic Tote Bag",
        price: 179.99,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Elegant tote bag perfect for everyday use",
        category: "bags"
    },
    {
        id: 6,
        name: "Italian Leather Jacket",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Premium leather jacket with Italian craftsmanship",
        category: "clothing"
    },
    {
        id: 7,
        name: "Designer Sneakers",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Comfortable and stylish designer sneakers",
        category: "shoes"
    },
    {
        id: 8,
        name: "Leather Boots",
        price: 399.99,
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Classic leather boots made in Italy",
        category: "shoes"
    }
];

// Shopping cart
let cart = [];

// DOM Elements
const productsGrid = document.querySelector('.products-grid');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotalAmount = document.getElementById('cart-total-amount');
const cartCount = document.querySelector('.cart-count');
const closeBtn = document.querySelector('.close');
const checkoutBtn = document.getElementById('checkout-btn');
const cartIcon = document.querySelector('.cart-icon');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const pickupDate = document.getElementById('pickup-date');
const pickupTime = document.getElementById('pickup-time');

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

let currentCategory = 'all';
let searchQuery = '';

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
pickupDate.min = today;

// Display products with category filtering and search
function displayProducts(category = 'all', search = '') {
    currentCategory = category;
    searchQuery = search.toLowerCase();

    const filteredProducts = products.filter(product => {
        const matchesCategory = category === 'all' || product.category === category;
        const matchesSearch = searchQuery === '' || 
            product.name.toLowerCase().includes(searchQuery) ||
            product.description.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">€${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');

    // Show "no results" message if no products match
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-results">
                <p>No products found matching your search criteria.</p>
            </div>
        `;
    }
}

// Search functionality
searchInput.addEventListener('input', (e) => {
    displayProducts(currentCategory, e.target.value);
});

// Category filter functionality
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        // Filter and display products
        displayProducts(button.dataset.category, searchQuery);
    });
});

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCartCount();
    showNotification('Product added to cart!');
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Display cart items
function displayCartItems() {
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <p>€${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalAmount.textContent = total.toFixed(2);
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        cart = cart.filter(item => item.id !== productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
        }
    }
    updateCartCount();
    displayCartItems();
}

// Validate pickup time
function validatePickupTime() {
    const selectedDate = pickupDate.value;
    const selectedTime = pickupTime.value;
    
    if (!selectedDate || !selectedTime) {
        showNotification('Please select both date and time for pickup');
        return false;
    }

    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const now = new Date();

    if (selectedDateTime < now) {
        showNotification('Please select a future date and time');
        return false;
    }

    return true;
}

// Event Listeners
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
    displayCartItems();
});

closeBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    if (!validatePickupTime()) {
        return;
    }

    const selectedDate = pickupDate.value;
    const selectedTime = pickupTime.value;
    const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    alert(`Thank you for your order! Please visit our store in Milan to pick up your items on ${formattedDate} at ${selectedTime}.`);
    cart = [];
    updateCartCount();
    cartModal.style.display = 'none';
    pickupDate.value = '';
    pickupTime.value = '';
    showNotification('Order placed successfully!');
});

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Initialize
displayProducts();
updateCartCount(); 