
const products = [
    {
        id: 1,
        name: "Vela Flor de Cerejeira",
        category: "aromaticas",
        collection: "primavera",
        collectionLabel: " Coleção Primavera",
        scent: "Flor de Cerejeira & Pêssego",
        price: 54.90,
        image: "https://images.unsplash.com/photo-1596433809252-260c2745dfdd?auto=format&fit=crop&q=80&w=600",
        description: "Notas florais delicadas que trazem o frescor da primavera."
    },
    {
        id: 2,
        name: "Vela Brisa de Setembro",
        category: "aromaticas",
        collection: "setembro",
        collectionLabel: " Coleção de Setembro",
        scent: "Lavanda, Âmbar & Cedro",
        price: 58.90,
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600",
        description: "Aroma suave de transição de estação com toque amadeirado."
    },
    {
        id: 3,
        name: "Vela Magia de Natal",
        category: "aromaticas",
        collection: "natal",
        collectionLabel: " Coleção de Natal",
        scent: "Canela, Maçã & Especiarias",
        price: 62.90,
        description: "O cheiro acolhedor das festas de fim de ano com cravo e canela."
    },
    {
        id: 4,
        name: "Vela Calmaria & Chá Branco",
        category: "aromaticas",
        collection: "classica",
        collectionLabel: " Linha Clássica",
        scent: "Chá Branco & Lírio",
        price: 52.00,
        image: "https://images.unsplash.com/photo-1543198181-e61c70a14f7f?auto=format&fit=crop&q=80&w=600",
        description: "Perfeita para momentos de meditação, banho relaxante e leitura."
    },
    {
        id: 5,
        name: "Vela Mini Bubble",
        category: "decorativas",
        collection: "classica",
        collectionLabel: " Decorativa",
        scent: "Aroma chá branco",
        price: 12.99,
        image: "assets/bubby.jpg",
        description: "Leve, sofisticado e envolvente. O aroma do chá branco traz calma equilibrio e bem-estar para o seu ambiente."
    },
    {
        id: 6,
        name: "Vela Café & Baunilha Warm",
        category: "aromaticas",
        collection: "setembro",
        collectionLabel: " Coleção de Setembro",
        scent: "Grãos de Café & Baunilha Real",
        price: 56.90,
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600",
        description: "Estimulante e doce, remete a uma tarde aconchegante em uma cafeteria."
    }
];

// CARRINHO E FILTROS

let cart = [];
let currentCategory = "all";
let currentCollection = "all";

// WHATSAPP OFICIAL DA FLORLUME

const STORE_WHATSAPP_NUMBER = "5571983151466";

// ELEMENTOS DO HTML

const productsGrid = document.getElementById("productsGrid");
const cartDrawer = document.getElementById("cartDrawer");
const cartCount = document.getElementById("cartCount");
const cartItemsList = document.getElementById("cartItemsList");
const cartTotal = document.getElementById("cartTotal");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const cartBtn = document.getElementById("cartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const customCandleForm = document.getElementById("customCandleForm");
const whatsappBtn = document.getElementById("whatsappBtn");

// INICIAR O SITE

document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCartUI();
    setupEvents();
});

// CONFIGURAR OS EVENTOS

function setupEvents() {

    mobileMenuBtn.addEventListener("click", toggleMobileMenu);

    cartBtn.addEventListener("click", () => toggleCart(true));

    closeCartBtn.addEventListener("click", () => toggleCart(false));

    document.querySelector("[data-close-cart]").addEventListener("click", () => {
        toggleCart(false);
    });

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            toggleCart(false);
            mobileMenu.classList.remove("open");
        }

    });

    document.querySelectorAll(".cat-btn").forEach((button) => {

        button.addEventListener("click", () => {
            switchCategory(button.dataset.category);
        });

    });

    document.querySelectorAll(".col-btn").forEach((button) => {

        button.addEventListener("click", () => {
            filterCollection(button.dataset.collection);
        });

    });

    document.querySelectorAll(".mobile-menu a").forEach((link) => {

        link.addEventListener("click", () => {
            mobileMenu.classList.remove("open");
        });

    });

    customCandleForm.addEventListener("submit", addCustomCandleToCart);

    whatsappBtn.addEventListener("click", sendOrderToWhatsApp);
}

// MENU MOBILE

function toggleMobileMenu() {
    mobileMenu.classList.toggle("open");
}

// EXIBIR OS PRODUTOS

function renderProducts() {

    productsGrid.innerHTML = "";

    const filteredProducts = products.filter((product) => {

        const matchCategory =
            currentCategory === "all" ||
            product.category === currentCategory;

        const matchCollection =
            currentCollection === "all" ||
            product.collection === currentCollection;

        return matchCategory && matchCollection;

    });

    if (filteredProducts.length === 0) {

        productsGrid.innerHTML = `
            <div class="empty-products">
                <i class="fa-solid fa-wind"></i>
                <p>Nenhuma vela encontrada nesta coleção no momento.</p>
            </div>
        `;

        return;
    }

    filteredProducts.forEach((product) => {

        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    onerror="this.src='https://placehold.co/600x600/EFE7D5/C86D51?text=Vela+Aromatica'"
                >

                <span class="product-badge">
                    ${product.collectionLabel}
                </span>

            </div>

            <div class="product-info">

                <div>

                    <span class="product-scent">
                        <i class="fa-solid fa-wind"></i> ${product.scent}
                    </span>

                    <h3>${product.name}</h3>

                    <p class="product-description">
                        ${product.description}
                    </p>

                </div>

                <div class="product-bottom">

                    <span class="product-price">
                        ${formatCurrency(product.price)}
                    </span>

                    <button class="add-product" data-product-id="${product.id}">
                        <i class="fa-solid fa-plus"></i> Adicionar
                    </button>

                </div>

            </div>
        `;

        const addButton = card.querySelector(".add-product");

        addButton.addEventListener("click", () => {
            addToCart(product.id);
        });

        productsGrid.appendChild(card);

    });

}

// FILTRAR POR CATEGORIA

function switchCategory(category) {

    currentCategory = category;
    currentCollection = "all";

    document.querySelectorAll(".cat-btn").forEach((button) => {

        button.classList.toggle(
            "active",
            button.dataset.category === category
        );

    });

    const subFilters = document.getElementById("subCollectionFilters");

    if (category === "decorativas") {

        subFilters.classList.add("hidden");

    } else {

        subFilters.classList.remove("hidden");

    }

    document.querySelectorAll(".col-btn").forEach((button) => {

        button.classList.toggle(
            "active",
            button.dataset.collection === "all"
        );

    });

    renderProducts();

}

// FILTRAR POR COLEÇÃO

function filterCollection(collection) {

    currentCollection = collection;

    document.querySelectorAll(".col-btn").forEach((button) => {

        button.classList.toggle(
            "active",
            button.dataset.collection === collection
        );

    });

    renderProducts();

}

// ADICIONAR AO CARRINHO

function addToCart(productId) {

    const product = products.find((item) => item.id === productId);

    if (!product) {
        return;
    }

    const existingItem = cart.find(
        (item) => item.id === productId && !item.isCustom
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            scent: product.scent,
            quantity: 1,
            isCustom: false
        });

    }

    updateCartUI();

    toggleCart(true);

}

// ADICIONAR VELA PERSONALIZADA

function addCustomCandleToCart(event) {

    event.preventDefault();

    const form = event.target;

    const scent = form.customScent.value;

    const jar = form.customJar.value;

    const labelText = document.getElementById("customLabel").value.trim();

    if (!labelText) {

        alert("Digite uma mensagem para o rótulo da vela.");

        return;

    }

    const customItem = {

        id: "custom-" + Date.now(),

        name: "Vela Personalizada Sob Medida",

        price: 68.90,

        scent,

        jar,

        labelText,

        quantity: 1,

        isCustom: true

    };

    cart.push(customItem);

    updateCartUI();

    toggleCart(true);

    document.getElementById("customLabel").value = "";

}

// REMOVER ITEM DO CARRINHO

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCartUI();

}

// AUMENTAR OU DIMINUIR QUANTIDADE

function updateQuantity(index, delta) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity += delta;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCartUI();

}

// ATUALIZAR INTERFACE DO CARRINHO

function updateCartUI() {

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalItems;

    cartItemsList.innerHTML = "";

    if (cart.length === 0) {

        cartItemsList.innerHTML = `
            <div class="empty-cart">

                <i class="fa-solid fa-basket-shopping"></i>

                <p>Seu carrinho está vazio.</p>

            </div>
        `;

        cartTotal.textContent = "R$ 0,00";

        return;

    }

    let grandTotal = 0;

    cart.forEach((item, index) => {

        const itemTotal = item.price * item.quantity;

        grandTotal += itemTotal;

        const itemElement = document.createElement("div");

        itemElement.className = "cart-item";

        itemElement.innerHTML = `
            <div class="cart-item-top">

                <div>

                    <h4>${item.name}</h4>

                    <p class="cart-item-scent">
                        <i class="fa-solid fa-wind"></i> ${item.scent}
                    </p>

                    ${
                        item.isCustom
                            ? `
                                <p class="cart-custom-detail">
                                    <i class="fa-solid fa-jar"></i>
                                    Frasco: ${item.jar}
                                </p>

                                <p class="cart-custom-detail cart-label">
                                    "Rótulo: ${item.labelText}"
                                </p>
                            `
                            : ""
                    }

                </div>

                <button
                    class="remove-item"
                    data-index="${index}"
                    aria-label="Remover item"
                >
                    <i class="fa-solid fa-trash-can"></i>
                </button>

            </div>

            <div class="cart-item-bottom">

                <div class="quantity-control">

                    <button
                        class="quantity-btn"
                        data-index="${index}"
                        data-delta="-1"
                    >−</button>

                    <span>${item.quantity}</span>

                    <button
                        class="quantity-btn"
                        data-index="${index}"
                        data-delta="1"
                    >+</button>

                </div>

                <span class="item-total">
                    ${formatCurrency(itemTotal)}
                </span>

            </div>
        `;

        itemElement
            .querySelector(".remove-item")
            .addEventListener("click", () => removeFromCart(index));

        itemElement
            .querySelectorAll(".quantity-btn")
            .forEach((button) => {

                button.addEventListener("click", () => {

                    updateQuantity(
                        Number(button.dataset.index),
                        Number(button.dataset.delta)
                    );

                });

            });

        cartItemsList.appendChild(itemElement);

    });

    cartTotal.textContent = formatCurrency(grandTotal);

}

// ABRIR E FECHAR CARRINHO

function toggleCart(show) {

    cartDrawer.classList.toggle("open", show);

    cartDrawer.setAttribute("aria-hidden", String(!show));

    document.body.classList.toggle("cart-open", show);

}

// FINALIZAR PEDIDO NO WHATSAPP DA FLORLUME

function sendOrderToWhatsApp() {

    if (cart.length === 0) {

        alert("Seu carrinho está vazio! Adicione pelo menos uma vela antes de finalizar.");

        return;

    }

    const clientName = document.getElementById("clientName").value.trim();

    const clientAddress = document.getElementById("clientAddress").value.trim();

    const clientNotes = document.getElementById("clientNotes").value.trim();

    if (!clientName || !clientAddress) {

        alert("Por favor, preencha seu nome e o endereço/bairro para entregas.");

        return;

    }

    let message = " *NOVO PEDIDO - FLORLUME*\n";

    message += "-----------------------------------\n";

    message += ` *Cliente:* ${clientName}\n`;

    message += ` *Endereço/Bairro:* ${clientAddress}\n`;

    if (clientNotes) {

        message += `*Obs:* ${clientNotes}\n`;

    }

    message += "-----------------------------------\n\n";

    message += " *ITENS DO PEDIDO:*\n\n";

    let grandTotal = 0;

    cart.forEach((item, index) => {

        const subtotal = item.price * item.quantity;

        grandTotal += subtotal;

        message += `*${index + 1}. ${item.name}* (x${item.quantity})\n`;

        message += `   • Aroma: ${item.scent}\n`;

        if (item.isCustom) {

            message += `   • Recipiente: ${item.jar}\n`;

            message += `   • Rótulo Personalizado: "${item.labelText}"\n`;

        }

        message += `   • Valor: ${formatCurrency(subtotal)}\n\n`;

    });

    message += "-----------------------------------\n";

    message += ` *TOTAL ESTIMADO: ${formatCurrency(grandTotal)}*\n\n`;

    message += "Gostaria de confirmar a disponibilidade e a chave PIX/forma de pagamento para envio. Obrigado!";

    const encodedMessage = encodeURIComponent(message);

    const whatsappURL =
        `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");

}

// FORMATAR PREÇO EM REAL

function formatCurrency(value) {

    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}
