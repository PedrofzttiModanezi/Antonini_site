// Dados de produtos
const basePath = window.location.pathname.includes('/site_antonini/') ? '' : 'site_antonini/';

const productNames = [
    'KIT FEMININO COPA AMARELO',
    'KIT MASCULINO COPA AMARELO',
    'KIT MASCULINO SOLAR',
    'KIT MASCULINO PINKY',
    'KIT FEMININO SOLAR',
    'CAMISA UNISSEX SOLAR',
    'CAMISA UNISSEX PINKY',
    'OVERSIZED TEAM ANTONINI AMARELO',
    'OVERSIZED OLD SKOOL',
    'OVERSIZED GREEN',
    'MALA ANTONINI'
];

const categories = [
    '+ Uniformes',
    '+ Kits',
    '+ Casual',
    '+ Acessórios'
];

const sizes = [
    ['P', 'M', 'G', 'GG'],
    ['P', 'M', 'G', 'GG', 'XXGG'],
    ['12 anos'],
    ['Único']
];

const productImages = [
    `${basePath}imgs/gabi1.jpg`,
    `${basePath}imgs/gabi2.png`,
    `${basePath}imgs/lucca1.jpg`,
    `${basePath}imgs/lucca2.jpg`,
    `${basePath}imgs/lucca3.png`,
    `${basePath}imgs/lucca4.png`,
    `${basePath}imgs/pedrinho1.jpg`,
    `${basePath}imgs/pedrinho2.png`
];

// Estado do carrinho
let cartItems = [];

// Usuários (persistência simples via localStorage)
const USERS_KEY = 'antonini_users';
const CURRENT_USER_KEY = 'antonini_currentUser';

function loadUsers(){
    const s = localStorage.getItem(USERS_KEY);
    return s ? JSON.parse(s) : [];
}
function saveUsers(users){
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function findUserByEmail(email){
    if (!email) return null;
    return loadUsers().find(u => u.email === email.toLowerCase());
}
function addUser(user){
    const users = loadUsers();
    users.push({ ...user, email: user.email.toLowerCase() });
    saveUsers(users);
    setCurrentUser(user);
}
function setCurrentUser(user){
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    updateAccountButton();
}
function getCurrentUser(){
    const s = localStorage.getItem(CURRENT_USER_KEY);
    return s ? JSON.parse(s) : null;
}
function clearCurrentUser(){
    localStorage.removeItem(CURRENT_USER_KEY);
    updateAccountButton();
}

function updateAccountButton(){
    const user = getCurrentUser();
    // Only target account buttons (exclude cart)
    document.querySelectorAll('.icon-btn:not(.cart)').forEach(btn => {
        if (user) {
            btn.textContent = `Olá, ${user.name}`;
            btn.classList.add('greeting');
        } else {
            btn.innerHTML = '👤 Conta';
            btn.classList.remove('greeting');
        }
    });
}

// Função para gerar um número aleatório entre min e max
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para gerar um produto aleatório
function generateProduct() {
    const name = productNames[Math.floor(Math.random() * productNames.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const originalPrice = randomBetween(150, 350);
    const discount = randomBetween(3, 32);
    const currentPrice = Math.round(originalPrice * (1 - discount / 100));
    const installments = Math.floor(currentPrice / 3);
    const productSizes = sizes[Math.floor(Math.random() * sizes.length)];
    const image = productImages[Math.floor(Math.random() * productImages.length)];
    
    // cores possíveis
    const possibleColors = ['Amarelo','Verde','Azul','Preto','Branco'];
    // escolher 2-3 cores aleatórias
    const colors = possibleColors.sort(() => 0.5 - Math.random()).slice(0, 3);

    return {
        name,
        category,
        originalPrice: `R$${originalPrice},00`,
        currentPrice: `R$${currentPrice},90`,
        discount: `-${discount}%`,
        installments: `3x de R$${installments},97 sem juros`,
        sizes: productSizes,
        image: image,
        colors,
        description: `Descrição detalhada de ${name}: tecido leve, costura reforçada, ideal para treinos e uso diário. Produto testado em quadras e resistente à lavagens.`
    };
}

// Função para criar um card de produto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const sizesHTML = product.sizes.map(size => 
        `<span class="size-tag">${size}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="product-image" style="background-image: url('${product.image}');">
            <div class="product-discount">${product.discount}</div>
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">
                <span class="original-price">de${product.originalPrice}</span>
                <span class="current-price">por${product.currentPrice}</span>
            </div>
            <div class="product-installments">${product.installments}</div>
            <div class="product-sizes">${sizesHTML}</div>
            <button class="add-to-cart">Adicionar ao Carrinho</button>
        </div>
    `;
    
    // Adicionar evento ao botão de adicionar ao carrinho
    card.querySelector('.add-to-cart').addEventListener('click', function() {
        addToCart(product);
    });

    // abrir modal de produto ao clicar no card (exceto no botão adicionar)
    card.addEventListener('click', function(e){
        if (e.target.closest('.add-to-cart')) return;
        openProductModal(product);
    });
    
    return card;
}

// Função para preencher grids de produtos (verifica existência)
function fillProductGrids() {
    const kitsGrid = document.getElementById('kitsGrid');
    const launchesGrid = document.getElementById('launchesGrid');
    const bestsellersGrid = document.getElementById('bestsellersGrid');

    if (kitsGrid) for (let i = 0; i < 4; i++) kitsGrid.appendChild(createProductCard(generateProduct()));
    if (launchesGrid) for (let i = 0; i < 4; i++) launchesGrid.appendChild(createProductCard(generateProduct()));
    if (bestsellersGrid) for (let i = 0; i < 4; i++) bestsellersGrid.appendChild(createProductCard(generateProduct()));
}

// Cria modais dinamicamente (conta e carrinho)
function createModals() {
    // Account modal (login / signup)
    const accountModal = document.createElement('div');
    accountModal.id = 'accountModal';
    accountModal.className = 'modal';
    accountModal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">✕</button>
            <div style="display:flex;gap:8px;margin-bottom:12px;">
                <button id="showLogin" class="btn-more">Já tenho conta</button>
                <button id="showSignup" class="btn-more">Criar nova conta</button>
            </div>
            <div id="loginBox">
                <h3>Entrar</h3>
                <form id="loginForm">
                    <input type="email" id="loginEmail" placeholder="Email" required style="padding:8px;width:100%;margin:8px 0;">
                    <input type="password" id="loginPassword" placeholder="Senha" required style="padding:8px;width:100%;margin:8px 0;">
                    <button type="submit" class="btn-more" style="margin-top:8px;">Entrar</button>
                </form>
            </div>
            <div id="signupBox" style="display:none">
                <h3>Criar Conta</h3>
                <form id="signupForm">
                    <input type="text" id="signupName" placeholder="Nome" required style="padding:8px;width:100%;margin:6px 0;">
                    <input type="text" id="signupSurname" placeholder="Sobrenome" style="padding:8px;width:100%;margin:6px 0;">
                    <input type="tel" id="signupPhone" placeholder="Telefone" style="padding:8px;width:100%;margin:6px 0;">
                    <input type="email" id="signupEmail" placeholder="Email" required style="padding:8px;width:100%;margin:6px 0;">
                    <input type="password" id="signupPassword" placeholder="Senha" required style="padding:8px;width:100%;margin:6px 0;">
                    <button type="submit" class="btn-more" style="margin-top:8px;">Criar Conta</button>
                </form>
            </div>
            <div id="accountActions" style="margin-top:24px;display:flex;justify-content:flex-end;">
                <button id="logoutBtn" class="btn-ghost" type="button" style="display:none;">Sair da conta</button>
            </div>
        </div>
    `;
    document.body.appendChild(accountModal);

    // Cart modal
    const cartModal = document.createElement('div');
    cartModal.id = 'cartModal';
    cartModal.className = 'modal';
    cartModal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">✕</button>
            <h3>Carrinho</h3>
            <div id="cartItemsList" style="min-height:80px;margin-bottom:12px;"></div>
            <div style="display:flex;gap:8px;justify-content:flex-end;">
                <button id="clearCart" class="btn-more">Esvaziar</button>
            </div>
        </div>
    `;
    document.body.appendChild(cartModal);

    // Close handlers
    function closeModal(modal) { modal.style.display = 'none'; }
    document.querySelectorAll('.modal .modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        });
    });

    // Switch views (login / signup)
    const loginBox = accountModal.querySelector('#loginBox');
    const signupBox = accountModal.querySelector('#signupBox');
    const showLogin = accountModal.querySelector('#showLogin');
    const showSignup = accountModal.querySelector('#showSignup');
    const logoutBtn = accountModal.querySelector('#logoutBtn');

    showLogin.addEventListener('click', () => { loginBox.style.display = ''; signupBox.style.display = 'none'; });
    showSignup.addEventListener('click', () => { loginBox.style.display = 'none'; signupBox.style.display = ''; });

    // Login handler
    accountModal.querySelector('#loginForm').addEventListener('submit', function(e){
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.toLowerCase();
        const password = document.getElementById('loginPassword').value;
        const user = findUserByEmail(email);
        if (!user) { alert('Usuário não encontrado.'); return; }
        if (user.password !== password) { alert('Senha incorreta.'); return; }
        setCurrentUser(user);
        alert('Bem-vindo, ' + user.name + '!');
        closeModal(document.getElementById('accountModal'));
    });

    // Signup handler
    accountModal.querySelector('#signupForm').addEventListener('submit', function(e){
        e.preventDefault();
        const name = document.getElementById('signupName').value.trim();
        const surname = document.getElementById('signupSurname').value.trim();
        const phone = document.getElementById('signupPhone').value.trim();
        const email = document.getElementById('signupEmail').value.trim().toLowerCase();
        const password = document.getElementById('signupPassword').value;
        if (findUserByEmail(email)) { alert('Já existe uma conta com esse email. Faça login.'); return; }
        const user = { name, surname, phone, email, password };
        addUser(user);
        alert('Conta criada. Bem-vindo, ' + name + '!');
        closeModal(document.getElementById('accountModal'));
    });

    // Clear cart
    document.getElementById('clearCart').addEventListener('click', function(){
        cartItems = [];
        updateCartUI();
        closeModal(document.getElementById('cartModal'));
    });

    // Logout
    logoutBtn.addEventListener('click', function(){
        clearCurrentUser();
        closeModal(document.getElementById('accountModal'));
        alert('Você saiu.');
    });

    // Show logout if user logged
    const current = getCurrentUser();
    if (current) { loginBox.style.display = 'none'; signupBox.style.display = 'none'; logoutBtn.style.display = ''; }
}

// Atualiza o conteúdo do carrinho na UI
function updateCartUI() {
    const countEl = document.querySelector('.cart-count');
    if (countEl) countEl.textContent = cartItems.length;

    const list = document.getElementById('cartItemsList');
    if (!list) return;
    list.innerHTML = '';
    if (cartItems.length === 0) {
        list.innerHTML = '<p>Seu carrinho está vazio.</p>';
        return;
    }
    cartItems.forEach((it, idx) => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.marginBottom = '8px';
        item.innerHTML = `<div style="display:flex;gap:8px;align-items:center;"><div style="width:50px;height:50px;background-image:url('${it.image}');background-size:cover;background-position:center;border-radius:4px"></div><div><strong>${it.name}</strong><div style="font-size:12px;color:#666">${it.currentPrice}</div></div></div><button data-idx="${idx}" class="remove-item" style="background:#ff4444;border:none;color:#fff;padding:6px 8px;border-radius:4px">Remover</button>`;
        list.appendChild(item);
    });

    // remove handlers
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function(){
            const idx = parseInt(this.getAttribute('data-idx'));
            cartItems.splice(idx,1);
            updateCartUI();
        });
    });
}

// Adiciona produto ao carrinho
function addToCart(product) {
    cartItems.push(product);
    updateCartUI();
    // feedback visual
    const cart = document.querySelector('.cart');
    if (cart) {
        cart.style.transform = 'scale(1.2)';
        setTimeout(() => cart.style.transform = 'scale(1)', 300);
    }
}

// Busca e filtro de produtos nas grades
function filterProducts(query) {
    query = query.trim().toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const name = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
        if (!query || name.includes(query)) card.style.display = '';
        else card.style.display = 'none';
    });
}

// PRODUCT DETAIL MODAL
function createProductModal(){
    if (document.getElementById('productModal')) return;
    const modal = document.createElement('div');
    modal.id = 'productModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content product-modal">
            <button class="modal-close">✕</button>
            <div class="product-detail-grid">
                <div class="product-media">
                    <img id="productModalImage" src="" alt="Produto" />
                </div>
                <div class="product-info-panel">
                    <h3 id="productModalName"></h3>
                    <div class="product-price-row"><span id="productModalPrice" class="current-price"></span> <span id="productModalOriginal" class="original-price"></span></div>
                    <p id="productModalDescription" class="product-description"></p>
                    <div class="product-options">
                        <div>
                            <label>Tamanho</label>
                            <div id="productSizes" class="option-list"></div>
                        </div>
                        <div>
                            <label>Cor</label>
                            <div id="productColors" class="option-list"></div>
                        </div>
                    </div>
                    <div style="margin-top:12px;display:flex;gap:8px;align-items:center;">
                        <button id="modalAddToCart" class="btn-more">Adicionar ao Carrinho</button>
                        <input id="modalQty" type="number" value="1" min="1" style="width:72px;padding:8px;border-radius:8px;border:1px solid #ddd"> 
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // close
    modal.querySelector('.modal-close').addEventListener('click', ()=> modal.style.display='none');
}

function openProductModal(product){
    createProductModal();
    const modal = document.getElementById('productModal');
    document.getElementById('productModalImage').src = product.image;
    document.getElementById('productModalName').textContent = product.name;
    document.getElementById('productModalPrice').textContent = product.currentPrice;
    document.getElementById('productModalOriginal').textContent = product.originalPrice;
    document.getElementById('productModalDescription').textContent = product.description || '';

    const sizesContainer = document.getElementById('productSizes');
    sizesContainer.innerHTML = '';
    (product.sizes || []).forEach(sz => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.textContent = sz;
        btn.addEventListener('click', ()=>{
            sizesContainer.querySelectorAll('.option-btn').forEach(x=>x.classList.remove('active'));
            btn.classList.add('active');
        });
        sizesContainer.appendChild(btn);
    });

    const colorsContainer = document.getElementById('productColors');
    colorsContainer.innerHTML = '';
    (product.colors || []).forEach(col => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn color';
        btn.textContent = col;
        btn.addEventListener('click', ()=>{
            colorsContainer.querySelectorAll('.option-btn').forEach(x=>x.classList.remove('active'));
            btn.classList.add('active');
        });
        colorsContainer.appendChild(btn);
    });

    // add to cart from modal
    const addBtn = document.getElementById('modalAddToCart');
    addBtn.onclick = function(){
        const qty = parseInt(document.getElementById('modalQty').value) || 1;
        const size = document.querySelector('#productSizes .option-btn.active')?.textContent || (product.sizes && product.sizes[0]);
        const color = document.querySelector('#productColors .option-btn.active')?.textContent || (product.colors && product.colors[0]);
        const item = { ...product, chosenSize: size, chosenColor: color, qty };
        for(let i=0;i<qty;i++) addToCart(item);
        modal.style.display='none';
    };

    modal.style.display = 'flex';
}

// Inicialização após DOM carregado
document.addEventListener('DOMContentLoaded', function() {
    createModals();

    // configurar botões de conta e carrinho
    document.querySelectorAll('.icon-btn').forEach(btn => {
        const text = (btn.textContent || '').trim().toLowerCase();
        if (text.includes('conta')) {
            btn.addEventListener('click', function(e){
                e.preventDefault();
                document.getElementById('accountModal').style.display = 'flex';
            });
        }
        if (btn.classList.contains('cart') || text.includes('🛒')) {
            btn.addEventListener('click', function(e){
                e.preventDefault();
                updateCartUI();
                document.getElementById('cartModal').style.display = 'flex';
            });
        }
    });

    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function(){
            navMenu.classList.toggle('mobile-open');
        });
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(){
                if (navMenu.classList.contains('mobile-open')) {
                    navMenu.classList.remove('mobile-open');
                }
            });
        });
    }

    // Search
    const searchBtn = document.querySelector('.search-bar button');
    const searchInput = document.querySelector('.search-bar input');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function(){
            filterProducts(searchInput.value);
        });
        searchInput.addEventListener('keydown', function(e){ if (e.key === 'Enter') { e.preventDefault(); filterProducts(searchInput.value); } });
    }

    // Inicializar grids imediatamente
    fillProductGrids();
    updateCartUI();

    // Carrossel - configurar após DOM
    const slides = document.querySelectorAll('.slide');
    const carousel = document.querySelector('.carousel');
    let currentSlide = 0;
    function moveCarousel() {
        if (!slides.length) return;
        currentSlide = (currentSlide + 1) % slides.length;
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    function previousSlide() {
        if (!slides.length) return;
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    function nextSlide() { moveCarousel(); }
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    if (prevBtn) prevBtn.addEventListener('click', previousSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    setInterval(moveCarousel, 5000);

    const header = document.querySelector('.header');
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.pageYOffset;
    const hideAfter = 220;
    const scrollDelta = 12;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastScrollY + scrollDelta && currentScroll > hideAfter) {
            header?.classList.add('hide');
            navbar?.classList.add('hide');
        } else if (currentScroll < lastScrollY - scrollDelta || currentScroll < hideAfter) {
            header?.classList.remove('hide');
            navbar?.classList.remove('hide');
        }
        lastScrollY = currentScroll;
    });
});
