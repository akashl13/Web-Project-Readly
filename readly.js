const books = [
    {id: 1, title: "The Guide", author: "R.K. Narayan", price: 299, img: "https://covers.openlibrary.org/b/id/8739161-L.jpg", desc: "A classic novel about Raju, a tour guide who becomes a spiritual guide. Winner of the Sahitya Akademi Award.", readLink: "https://www.gutenberg.org/files/64317/64317-h/64317-h.htm"},
    {id: 2, title: "Malgudi Days", author: "R.K. Narayan", price: 249, img: "https://covers.openlibrary.org/b/id/7884823-L.jpg", desc: "Collection of short stories set in the fictional town of Malgudi, depicting Indian life.", readLink: "https://archive.org/details/ToKillAMockingbird_201608"},
    {id: 3, title: "The God of Small Things", author: "Arundhati Roy", price: 399, img: "https://covers.openlibrary.org/b/id/10504346-L.jpg", desc: "Booker Prize-winning novel about fraternal twins in Kerala. A story of forbidden love.", readLink: "https://www.planetebook.com/free-ebooks/1984.pdf"},
    {id: 4, title: "Midnight's Children", author: "Salman Rushdie", price: 499, img: "https://covers.openlibrary.org/b/id/8250026-L.jpg", desc: "Epic novel about children born at midnight on India's independence, possessing magical powers.", readLink: "https://www.gutenberg.org/files/1342/1342-h/1342-h.htm"},
    {id: 5, title: "Train to Pakistan", author: "Khushwant Singh", price: 279, img: "https://covers.openlibrary.org/b/id/10677087-L.jpg", desc: "Historical novel set during the Partition of India in 1947, depicting communal violence.", readLink: "https://archive.org/details/CatcherInTheRye_201805"},
    {id: 6, title: "The White Tiger", author: "Aravind Adiga", price: 350, img: "https://covers.openlibrary.org/b/id/6979868-L.jpg", desc: "Man Booker Prize winner about a driver's rise from poverty to success in modern India.", readLink: "https://archive.org/details/ABriefHistoryOfTime_201310"},
    {id: 7, title: "A Suitable Boy", author: "Vikram Seth", price: 599, img: "https://covers.openlibrary.org/b/id/8235886-L.jpg", desc: "Epic novel set in post-independence India, following four families and a young woman's search for a husband.", readLink: "https://archive.org/details/SteveJobsBiography"},
    {id: 8, title: "The Namesake", author: "Jhumpa Lahiri", price: 325, img: "https://covers.openlibrary.org/b/id/8235921-L.jpg", desc: "Story of Indian immigrants in America and their son's struggle with his identity.", readLink: "https://archive.org/details/SapiensYuvalNoahHarari"},
    {id: 9, title: "Gitanjali", author: "Rabindranath Tagore", price: 199, img: "https://covers.openlibrary.org/b/id/8339098-L.jpg", desc: "Collection of poems by Nobel laureate Tagore, expressing spiritual and mystical themes.", readLink: "https://archive.org/details/TheLeanStartup"},
    {id: 10, title: "The Palace of Illusions", author: "Chitra Banerjee", price: 375, img: "https://covers.openlibrary.org/b/id/6623964-L.jpg", desc: "Retelling of the Mahabharata from Draupadi's perspective, exploring her life and choices.", readLink: "https://archive.org/details/ThinkingFastAndSlow"},
    {id: 11, title: "Two States", author: "Chetan Bhagat", price: 250, img: "https://covers.openlibrary.org/b/id/7594526-L.jpg", desc: "Love story of a couple from different Indian states, navigating cultural differences.", readLink: "https://archive.org/details/CleanCodeRobertMartin"},
    {id: 12, title: "The Immortals of Meluha", author: "Amish Tripathi", price: 299, img: "https://covers.openlibrary.org/b/id/7299789-L.jpg", desc: "First book of Shiva Trilogy, reimagining Lord Shiva as a mortal hero in ancient India.", readLink: "https://archive.org/details/TheAlchemistPauloCoelho"}
];
let currentUser = null;
let cart = [];
function init() {
    try {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            currentUser = JSON.parse(userData);
            updateUserDisplay();
            loadCart();
        }
    } catch (e) {
        console.log('No saved user');
    }
    renderBooks();
}
function renderBooks() {
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = books.map(book => `
        <div class="book-card">
            <img src="${book.img}" alt="${book.title}">
            <div class="book-title">${book.title}</div>
            <div class="book-author">by ${book.author}</div>
            <div class="book-price">₹${book.price}</div>
            <button class="btn" onclick="window.open('${book.readLink}', '_blank')">📖 Read Free</button>
            <button class="btn add-cart" onclick="addToCart(${book.id})">Add to Cart</button>
        </div>
    `).join('');
}
function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
}
function closeLogin() {
    document.getElementById('loginModal').style.display = 'none';
}
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }
    currentUser={ username, password };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUserDisplay();
    closeLogin();
    alert('Login successful!');
}
function updateUserDisplay() {
    document.getElementById('userDisplay').textContent = `Hello, ${currentUser.username}!`;
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-block';
}
function logout() {
    localStorage.removeItem('currentUser');
    if (currentUser) {
        localStorage.removeItem(`cart_${currentUser.username}`);
    }
    currentUser = null;
    cart = [];
    document.getElementById('userDisplay').textContent = '';
    document.getElementById('loginBtn').style.display = 'inline-block';
    document.getElementById('logoutBtn').style.display = 'none';
    updateCartCount();
    alert('Logged out successfully!');
}
function addToCart(bookId) {
    if (!currentUser) {
        alert('Please login to add items to cart');
        showLogin();
        return;
    }
    const book = books.find(b => b.id === bookId);
    const existing = cart.find(item => item.id === bookId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({...book, quantity: 1});
    }
    saveCart();
    updateCartCount();
    alert('Added to cart!');
}
function saveCart() {
    if (currentUser) {
        localStorage.setItem(`cart_${currentUser.username}`, JSON.stringify(cart));
    }
}
function loadCart() {
    if (currentUser) {
        try {
            const cartData = localStorage.getItem(`cart_${currentUser.username}`);
            cart = cartData ? JSON.parse(cartData) : [];
            updateCartCount();
        } catch (e) {
            cart = [];
        }
    }
}
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}
function showHome() {
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('booksPage').style.display = 'none';
    document.getElementById('cartPage').style.display = 'none';
    document.getElementById('bookPage').style.display = 'none';
}
function showBooks() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('booksPage').style.display = 'block';
    document.getElementById('cartPage').style.display = 'none';
    document.getElementById('bookPage').style.display = 'none';
}
function showCart() {
    if (!currentUser) {
        alert('Please login to view cart');
        showLogin();
        return;
    }
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('booksPage').style.display = 'none';
    document.getElementById('bookPage').style.display = 'none';
    document.getElementById('cartPage').style.display = 'block';
    renderCart();
}
function renderCart() {
    const container = document.getElementById('cartItems');
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 40px;">Your cart is empty</p>';
        document.getElementById('totalPrice').textContent = '0';
        return;
    }
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.title}</strong><br>
                <span style="color: #666;">₹${item.price} × ${item.quantity}</span>
            </div>
            <div>
                <button class="btn" onclick="changeQuantity(${item.id}, -1)" style="width: 40px; margin: 0 5px;">-</button>
                <span style="margin: 0 10px;">${item.quantity}</span>
                <button class="btn" onclick="changeQuantity(${item.id}, 1)" style="width: 40px; margin: 0 5px;">+</button>
                <button class="btn" onclick="removeFromCart(${item.id})" style="background: #e74c3c; margin-left: 10px;">Remove</button>
            </div>
        </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('totalPrice').textContent = total;
}
function changeQuantity(bookId, change) {
    const item = cart.find(i => i.id === bookId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== bookId);
        }
        saveCart();
        updateCartCount();
        renderCart();
    }
}
function removeFromCart(bookId) {
    cart = cart.filter(item => item.id !== bookId);
    saveCart();
    updateCartCount();
    renderCart();
}
function viewBook(bookId) {
    const book = books.find(b => b.id === bookId);
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('cartPage').style.display = 'none';
    document.getElementById('bookPage').style.display = 'block';   
    document.getElementById('bookDetail').innerHTML = `
        <img src="${book.img}" alt="${book.title}">
        <div>
            <h1>${book.title}</h1>
            <h3 style="color: #666; margin: 10px 0;">by ${book.author}</h3>
            <div class="book-price" style="font-size: 28px; margin: 20px 0;">₹${book.price}</div>
            <p style="line-height: 1.6; margin: 20px 0;">${book.desc}</p>
        </div>
    `;
}
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Checkout Successful! Total: ₹${total}\n\nThank you for your order!`);   
    // Clear cart after checkout
    cart = [];
    saveCart();
    updateCartCount();
    showBooks();
}
window.onclick = function(event) {
    if (event.target == document.getElementById('loginModal')) {
        closeLogin();
    }
}
init();