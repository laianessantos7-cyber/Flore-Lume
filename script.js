// Floré Lume — catálogo, filtros, carrinho e finalização pelo WhatsApp

const produtos = [
    {
        id: "candle-belle",
        nome: "Candle Belle",
        descricao: "Uma vela especial para deixar seus momentos ainda mais aconchegantes.",
        preco: 35.00,
        precoAntigo: null,
        categoria: "aromaticas",
        colecao: "classica",
        imagem: "assets/candle-belle-1.jpg",
        selo: "Oferta especial"
    },
    {
        id: "mini-bubble",
        nome: "Mini Bubble",
        descricao: "Uma vela decorativa delicada para deixar seu ambiente ainda mais especial.",
        preco: 12.99,
        precoAntigo: null,
        categoria: "decorativas",
        colecao: "classica",
        imagem: "assets/bubby.jpg",
        selo: ""
    }
];

const WHATSAPP = "5571983151466";
const PRECO_PERSONALIZADA = 68.90;

let carrinho = [];
let categoriaAtual = "all";
let colecaoAtual = "all";

const productsGrid = document.getElementById("productsGrid");
const cartDrawer = document.getElementById("cartDrawer");
const cartItemsList = document.getElementById("cartItemsList");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const formatarPreco = valor =>
    valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

function renderizarProdutos() {
    if (!productsGrid) return;

    const filtrados = produtos.filter(produto => {
        const categoriaOk =
            categoriaAtual === "all" ||
            produto.categoria === categoriaAtual;

        const colecaoOk =
            colecaoAtual === "all" ||
            produto.colecao === colecaoAtual;

        return categoriaOk && colecaoOk;
    });

    if (!filtrados.length) {
        productsGrid.innerHTML =
            '<p class="empty-products">Nenhuma vela encontrada nesta categoria ou coleção.</p>';
        return;
    }

    productsGrid.innerHTML = filtrados.map(produto => `
        <article class="product-card">
            <div class="product-image">
                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='assets/vela-cafe.jpg';"
                >
                ${produto.selo ? `<span class="product-tag">${produto.selo}</span>` : ""}
            </div>

            <div class="product-info">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>

                <div class="product-buy-row">
                    <div class="product-price">
                        ${formatarPreco(produto.preco)}
                        ${
                            produto.precoAntigo
                                ? `<span class="product-old-price">${formatarPreco(produto.precoAntigo)}</span>`
                                : ""
                        }
                    </div>

                    <button class="add-cart-btn" data-add-product="${produto.id}">
                        <i class="fa-solid fa-plus"></i> Adicionar
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

function adicionarAoCarrinho(item) {
    const existente = carrinho.find(produto => produto.id === item.id);

    if (existente) {
        existente.quantidade += 1;
    } else {
        carrinho.push({ ...item, quantidade: 1 });
    }

    atualizarCarrinho();
}

function alterarQuantidade(id, alteracao) {
    const item = carrinho.find(produto => produto.id === id);

    if (!item) return;

    item.quantidade += alteracao;

    if (item.quantidade <= 0) {
        carrinho = carrinho.filter(produto => produto.id !== id);
    }

    atualizarCarrinho();
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter(produto => produto.id !== id);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const quantidadeTotal = carrinho.reduce(
        (total, item) => total + item.quantidade, 0
    );

    const valorTotal = carrinho.reduce(
        (total, item) => total + item.preco * item.quantidade, 0
    );

    cartCount.textContent = quantidadeTotal;
    cartTotal.textContent = formatarPreco(valorTotal);

    if (!carrinho.length) {
        cartItemsList.innerHTML =
            '<p class="cart-empty">Seu carrinho está vazio. Escolha suas velas favoritas!</p>';
        return;
    }

    cartItemsList.innerHTML = carrinho.map(item => `
        <div class="cart-item">
            <div>
                <h4>${item.nome}</h4>

                ${item.detalhes ? `<p>${item.detalhes}</p>` : ""}

                <div class="quantity-controls">
                    <button type="button" data-quantity="${item.id}" data-change="-1">−</button>

                    <span>${item.quantidade}</span>

                    <button type="button" data-quantity="${item.id}" data-change="1">+</button>

                    <button type="button" class="remove-item" data-remove="${item.id}">
                        Remover
                    </button>
                </div>
            </div>

            <div class="cart-item-price">
                ${formatarPreco(item.preco * item.quantidade)}
            </div>
        </div>
    `).join("");
}

function abrirCarrinho() {
    cartDrawer.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
}

function fecharCarrinho() {
    cartDrawer.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
}

// Filtros de categoria
document.querySelectorAll(".cat-btn").forEach(botao => {
    botao.addEventListener("click", () => {
        categoriaAtual = botao.dataset.category;

        document.querySelectorAll(".cat-btn").forEach(item => {
            item.classList.toggle("active", item === botao);
        });

        renderizarProdutos();
    });
});

// Filtros de coleção
document.querySelectorAll(".col-btn").forEach(botao => {
    botao.addEventListener("click", () => {
        colecaoAtual = botao.dataset.collection;

        document.querySelectorAll(".col-btn").forEach(item => {
            item.classList.toggle("active", item === botao);
        });

        renderizarProdutos();
    });
});

// Adicionar produto ao carrinho
productsGrid.addEventListener("click", event => {
    const botao = event.target.closest("[data-add-product]");

    if (!botao) return;

    const produto = produtos.find(
        item => item.id === botao.dataset.addProduct
    );

    if (produto) {
        adicionarAoCarrinho({ ...produto });
    }
});

// Abrir e fechar carrinho
document.getElementById("cartBtn").addEventListener("click", abrirCarrinho);

document.getElementById("closeCartBtn").addEventListener("click", fecharCarrinho);

document.querySelector("[data-close-cart]").addEventListener("click", fecharCarrinho);

// Alterar quantidade e remover produtos
cartItemsList.addEventListener("click", event => {
    const quantidade = event.target.closest("[data-quantity]");
    const remover = event.target.closest("[data-remove]");

    if (quantidade) {
        alterarQuantidade(
            quantidade.dataset.quantity,
            Number(quantidade.dataset.change)
        );
    }

    if (remover) {
        removerDoCarrinho(remover.dataset.remove);
    }
});

// Vela personalizada
document.getElementById("customCandleForm").addEventListener("submit", event => {
    event.preventDefault();

    const aroma = document.querySelector(
        'input[name="customScent"]:checked'
    ).value;

    const pote = document.querySelector(
        'input[name="customJar"]:checked'
    ).value;

    const rotulo = document.getElementById("customLabel").value.trim();

    adicionarAoCarrinho({
        id: `personalizada-${Date.now()}`,
        nome: "Vela Personalizada",
        preco: PRECO_PERSONALIZADA,
        quantidade: 1,
        detalhes: `Aroma: ${aroma} | Recipiente: ${pote} | Rótulo: ${rotulo}`
    });

    event.target.reset();
    abrirCarrinho();
});

// Finalizar pedido pelo WhatsApp
document.getElementById("whatsappBtn").addEventListener("click", () => {
    if (!carrinho.length) {
        alert("Adicione pelo menos uma vela ao carrinho antes de finalizar.");
        return;
    }

    const nome = document.getElementById("clientName").value.trim();
    const endereco = document.getElementById("clientAddress").value.trim();
    const observacoes = document.getElementById("clientNotes").value.trim();

    if (!nome || !endereco) {
        alert("Preencha seu nome e o bairro/cidade para entrega.");
        return;
    }

    const total = carrinho.reduce(
        (soma, item) => soma + item.preco * item.quantidade, 0
    );

    const linhas = carrinho.map(item =>
        `• ${item.nome} — ${item.quantidade}x — ${formatarPreco(item.preco * item.quantidade)}${item.detalhes ? `\n  ${item.detalhes}` : ""}`
    );

    let mensagem = `Olá! Gostaria de fazer um pedido na Floré Lume. 🌿

*Meu pedido:*
${linhas.join("\n")}

*Total estimado: ${formatarPreco(total)}*

*Dados para entrega:*
Nome: ${nome}
Bairro/Cidade: ${endereco}`;

    if (observacoes) {
        mensagem += `\nObservações: ${observacoes}`;
    }

    mensagem += "\n\nGostaria de combinar o pagamento e a entrega. Obrigada!";

    window.open(
        `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`,
        "_blank",
        "noopener,noreferrer"
    );
});

// Menu para celular
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

mobileMenuBtn.addEventListener("click", () => {
    const aberto = mobileMenu.classList.toggle("open");

    mobileMenuBtn.setAttribute("aria-expanded", String(aberto));

    mobileMenuBtn.innerHTML = aberto
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");

        mobileMenuBtn.setAttribute("aria-expanded", "false");

        mobileMenuBtn.innerHTML =
            '<i class="fa-solid fa-bars"></i>';
    });
});

// Fechar carrinho com ESC
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        fecharCarrinho();
    }
});

// Inicialização
renderizarProdutos();
atualizarCarrinho();