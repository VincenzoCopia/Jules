if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

// Updated product data
const products = [
  { id: 1, name: 'Classic Chocolate Bar', description: 'Rich and creamy milk chocolate bar.', price: 1.99, imageUrl: 'https://images.pexels.com/photos/4112559/pexels-photo-4112559.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 2, name: 'Gourmet Gummy Bears', description: 'Fruity gummy bears made with real fruit juice.', price: 2.50, imageUrl: 'https://images.pexels.com/photos/3760854/pexels-photo-3760854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 3, name: 'Swirl Lollipop', description: 'A classic colorful swirl lollipop.', price: 0.99, imageUrl: 'https://images.pexels.com/photos/1055050/pexels-photo-1055050.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 4, name: 'Sour Worms', description: 'Tangy and chewy sour worms.', price: 3.20, imageUrl: 'https://images.pexels.com/photos/2349963/pexels-photo-2349963.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 5, name: 'Peanut Butter Cups', description: 'The perfect combination of chocolate and peanut butter.', price: 2.75, imageUrl: 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 6, name: 'Jelly Beans Assortment', description: 'A variety of flavorful jelly beans.', price: 4.50, imageUrl: 'https://images.pexels.com/photos/372851/pexels-photo-372851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 7, name: 'Hard Candy Mix', description: 'Assorted fruit-flavored hard candies.', price: 2.25, imageUrl: 'https://images.pexels.com/photos/750073/pexels-photo-750073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 8, name: 'Caramel Chews', description: 'Soft and chewy caramel candies.', price: 3.00, imageUrl: 'https://images.pexels.com/photos/1328620/pexels-photo-1328620.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }
];

// Function to display products
function displayProducts() {
  const productList = document.getElementById('productList');
  if (productList) {
    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.className = 'product';
      productDiv.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" style="width:100%;max-width:150px;height:100px;object-fit:cover;">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>\$${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productList.appendChild(productDiv);
    });
  }
}

let cartItems = [];

// Function to load cart from localStorage
function loadCart() {
  const storedCart = localStorage.getItem('cartItems');
  if (storedCart) {
    cartItems = JSON.parse(storedCart);
    updateCartDisplay();
  }
}

// Function to save cart to localStorage
function saveCart() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Function to add item to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const cartItem = cartItems.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity++;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }
  saveCart();
  updateCartDisplay();
  // Optionally, show the cart when an item is added
  // document.getElementById('cart').classList.remove('hidden');
}

// Function to remove item from cart
function removeFromCart(productId) {
  cartItems = cartItems.filter(item => item.id !== productId);
  saveCart();
  updateCartDisplay();
}

// Function to update cart display
function updateCartDisplay() {
  const cartDiv = document.getElementById('cartItems');
  const cartTotalSpan = document.getElementById('cartTotal');
  const checkoutButton = document.getElementById('checkoutButton');
  if (!cartDiv || !cartTotalSpan || !checkoutButton) return;

  cartDiv.innerHTML = ''; // Clear previous items
  let total = 0;

  if (cartItems.length === 0) {
    cartDiv.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalSpan.textContent = '0.00';
    checkoutButton.style.display = 'none'; // Hide checkout button if cart is empty
    return;
  }

  checkoutButton.style.display = 'block'; // Show checkout button if cart has items

  cartItems.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    const cartItemDiv = document.createElement('div');
    cartItemDiv.className = 'cart-item';
    cartItemDiv.innerHTML = `
      <span>${item.name} (x${item.quantity})</span>
      <span>\$${itemTotal.toFixed(2)}</span>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartDiv.appendChild(cartItemDiv);
  });

  cartTotalSpan.textContent = total.toFixed(2);
}

// Event Listeners
window.addEventListener('load', () => {
  displayProducts();
  loadCart(); // Load cart from localStorage

  const viewCartButton = document.getElementById('viewCartButton');
  const cartElement = document.getElementById('cart');
  const checkoutFormElement = document.getElementById('checkout-form');
  const productListElement = document.getElementById('productList');
  const orderForm = document.getElementById('orderForm');
  const checkoutButtonInCart = document.getElementById('checkoutButton');


  if (viewCartButton && cartElement) {
    viewCartButton.addEventListener('click', () => {
      cartElement.classList.toggle('hidden');
      // Ensure checkout form is hidden when cart is toggled
      if (!checkoutFormElement.classList.contains('hidden')) {
        checkoutFormElement.classList.add('hidden');
        productListElement.style.display = 'grid'; // Or 'block' or 'flex' depending on your layout
      }
    });
  }

  if (checkoutButtonInCart) {
    checkoutButtonInCart.addEventListener('click', showCheckoutForm);
  }

  if (orderForm) {
    orderForm.addEventListener('submit', handleOrderSubmit);
  }
});

function showCheckoutForm() {
  const cartElement = document.getElementById('cart');
  const productListElement = document.getElementById('productList');
  const checkoutFormElement = document.getElementById('checkout-form');

  cartElement.classList.add('hidden');
  productListElement.style.display = 'none';
  checkoutFormElement.style.display = 'block';
}

function handleOrderSubmit(event) {
  event.preventDefault(); // Prevent default form submission

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;

  // Log order details
  const itemNames = cartItems.map(item => `${item.name} (x${item.quantity})`).join(', ');
  console.log(`Order submitted for ${name} (${email}) at ${address} with items: [${itemNames}]. Total: $${document.getElementById('cartTotal').textContent}`);

  // Clear the shopping cart
  cartItems = [];
  saveCart(); // Update localStorage
  updateCartDisplay(); // Refresh cart display (will show empty)

  // Display success message (simple alert for now)
  alert('Thank you for your order!');

  // Hide checkout form and show product list
  document.getElementById('checkout-form').style.display = 'none';
  document.getElementById('productList').style.display = 'grid'; // Or 'block' or 'flex'

  // Reset form fields
  document.getElementById('orderForm').reset();
}
