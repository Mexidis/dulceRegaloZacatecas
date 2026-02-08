// Sweet&Art Valentine's Landing Page - Tailwind CSS Version
// Interactive Package Builder with Enhanced Features

// Package state management
const packageBuilder = {
    base: { id: 'base', name: 'Cheesecake Corazón', price: 350, category: 'base' },
    crafts: [], // Multiple selections allowed
    extras: [],
};

// Product details database - UPDATED with new product structure
const productDetails = {
    // Base
    // Kits definitions
    'kit-base': {
        icon: '🎁',
        name: 'Kit Base',
        price: 450,
        description: 'La experiencia esencial para conectar. Elige tu manualidad favorita para acompañar el postre.',
        detailedTitle: 'Kit Base: Crea y Conecta',
        detailedDescription: 'La base perfecta para una cita inolvidable. Incluye nuestro famoso Cheesecake Corazón y una actividad creativa a tu elección para romper la rutina.',
        includes: [
            'Cheesecake Corazón Edición Especial (22cm)',
            'Manualidad a escoger (Pintura o Juego de Tarjetas)',
            'Carta personalizada con detalles románticos',
            'Empaque con detalles decorativos'
        ]
    },
    'kit-premium': {
        icon: '✨',
        name: 'Kit Premium',
        price: 880,
        description: 'La experiencia completa. Todo lo del Kit Base más elementos de lujo',
        detailedTitle: 'Kit Premium: La Experiencia Definitiva',
        detailedDescription: 'Para quienes buscan impresionar. Elevamos el Kit Base con un brindis premium y otros detalles especiales',
        includes: [
            'Todo lo del Kit Base con ambas manualidades',
            'Vino Tinto o Bebida Espumosa',
            'Chocolates Ferrero Rocher',
            'Kit maridaje Sensorial (potenciador del juego de tarjetas)'
        ]
    },
    // Base Component (Internal use)
    'base': {
        icon: '🍰',
        name: 'Cheesecake Corazón',
        price: 180,
        description: 'El corazón de la experiencia.',
        includes: [
            'Cheesecake Edición Especial',
            'Decoración romántica'
        ]
    },
    // Activities / Crafts
    'blind-painting': {
        icon: '🎨',
        name: 'Pintando en Pareja',
        price: 200,
        description: 'Lienzo + Playbook Creativo. Rían con misiones secretas o conecten pintando juntos.',
        detailedTitle: 'Experiencia "Art for Two"',
        detailedDescription: 'Diviértanse pintando con nuestro Playbook de dinámicas. Incluye sugerencias variadas para pintar sin ser expertos.',
        includes: [
            'Lienzo 15x20cm',
            'Set de pinturas acrílicas',
            'Pinceles',
            'Caballete',
            'Paleta de pinturas',
            'Guía de sugerencias para pintar'
        ]
    },
    'coleccion-vinculos': {
        icon: '🃏',
        name: 'Juego de Tarjetas',
        price: 180, // Adjusted relative value if needed, or keep standard
        description: 'Colección Vínculos. Un juego de cartas para redescubrirse y profundizar.',
        detailedTitle: 'Mazo Vínculos: Conexión Profunda',
        detailedDescription: '3 niveles de intensidad (Mente, Alma, Cuerpo) para acompañar su velada. Preguntas diseñadas para salir de la rutina y elevar el nivel de conexión con tu pareja.',
        includes: [
            'Mazo de 30 cartas premium',
            '3 Niveles de intensidad',
            'Instructivo de juego'
        ]
    },
    // Extras
    'perfume-decant': {
        icon: '🧴',
        name: 'Perfume Decant',
        price: 120,
        description: 'Un aroma exclusivo para recordar esta noche.',
        detailedTitle: 'Decant de Perfume Premium',
        detailedDescription: 'Agrega un toque sensorial a tu regalo con un decant de perfume de alta gama seleccionado para la ocasión.',
        includes: [
            'Decant de 5ml ',
            'Aroma seleccionado',
            'Presentación de regalo'
        ]
    },
};

// State for current product being viewed
let currentProduct = null;

// Age verification state
let ageVerified = false;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initializeBuilder();
    setupEventListeners();
    updateCart();
    showWelcomeModal();
    checkAgeVerification();
});

// Show welcome modal on first visit
function showWelcomeModal() {
    const hasVisited = localStorage.getItem('sweetart_visited');
    if (!hasVisited) {
        setTimeout(() => {
            showModal('welcomeModal');
        }, 500);
    }
}

// Global state for selected kit
let selectedKit = null; // No kit selected initially

// Load preset kit with pre-selected items
function loadPresetKit(kitType) {
    // Determine target section
    const targetSection = document.getElementById('constructor');
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    selectedKit = kitType;
    updateCart();

    if (kitType === 'kit-base' || kitType === 'base') {
        selectedKit = 'kit-base';

        // Clear any previously selected crafts for Base kit
        packageBuilder.crafts = [];

        // Reset all craft cards visual state
        document.querySelectorAll('[data-category="craft"]').forEach(card => {
            card.classList.remove('border-rose-500', 'bg-gradient-to-br', 'from-slate-800/50', 'to-rose-500/10', 'shadow-lg', 'shadow-rose-500/30');
            card.classList.add('border-white/5');
            const checkmark = card.querySelector('.card-selected-icon');
            if (checkmark) {
                checkmark.classList.add('hidden');
                checkmark.classList.remove('flex');
            }
            const addBtn = card.querySelector('.add-to-cart-btn');
            if (addBtn) {
                addBtn.textContent = 'Añadir al Kit';
            }
        });

        // Just scroll to activities and highlight them
        const activitiesSection = document.querySelector('[data-category="craft"]')?.closest('.mb-20');
        if (activitiesSection) {
            setTimeout(() => {
                activitiesSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);

            // Add a visual notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-24 left-1/2 transform -translate-x-1/2 bg-rose-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-bounce';
            notification.textContent = '¡Excelente! Ahora elige tu actividad (Pintura o Tarjetas)';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 4000);
        }
    } else if (kitType === 'kit-premium' || kitType === 'premium') {
        selectedKit = 'kit-premium';

        // For Premium: Auto-select BOTH crafts
        packageBuilder.crafts = [];

        // Select both craft items
        const craftIds = ['blind-painting', 'coleccion-vinculos'];
        craftIds.forEach(craftId => {
            const product = productDetails[craftId];
            if (product) {
                packageBuilder.crafts.push({
                    id: craftId,
                    name: product.name,
                    price: product.price,
                    category: 'craft'
                });

                // Update visual state of the card
                const card = document.querySelector(`[data-id="${craftId}"]`);
                if (card) {
                    card.classList.remove('border-white/5');
                    card.classList.add('border-rose-500', 'bg-gradient-to-br', 'from-slate-800/50', 'to-rose-500/10', 'shadow-lg', 'shadow-rose-500/30');

                    const checkmark = card.querySelector('.card-selected-icon');
                    if (checkmark) {
                        checkmark.classList.remove('hidden');
                        checkmark.classList.add('flex');
                    }

                    const addBtn = card.querySelector('.add-to-cart-btn');
                    if (addBtn) {
                        addBtn.textContent = 'Añadido ✓';
                    }
                }
            }
        });


        // Scroll to Extras section for Premium kit
        const extrasSection = document.querySelector('[data-category="extra"]')?.closest('.mb-20');
        if (extrasSection) {
            setTimeout(() => {
                extrasSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);

            // Add a visual notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-24 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-bounce';
            notification.textContent = '¡Perfecto! Ambas actividades incluidas. Ahora puedes añadir extras';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 4000);
        }
    }

    updateCart();
}

// Initialize builder with base selected
function initializeBuilder() {
    const baseCard = document.querySelector('[data-category="base"]');
    if (baseCard) {
        baseCard.classList.add('selected', 'fixed');
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Welcome modal
    const welcomeBtn = document.getElementById('welcomeStartBtn');
    if (welcomeBtn) {
        welcomeBtn.addEventListener('click', () => {
            closeModal('welcomeModal');
            localStorage.setItem('sweetart_visited', 'true');
            // Scroll to constructor section
            document.getElementById('constructor').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Product card buttons - NEW: separate add and view actions
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');

    // Add to cart buttons - direct add/remove
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.product-card');
            if (!card) return;

            const productId = card.dataset.id;
            const category = card.dataset.category;

            // Toggle product directly
            toggleProduct(card);
        });
    });

    // View details buttons - open modal
    viewDetailsButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.product-card');
            if (!card) return;

            const productId = card.dataset.id;
            const category = card.dataset.category;

            openProductDetail(productId, card);
        });
    });

    // Product detail modal buttons
    document.getElementById('closeProductDetail')?.addEventListener('click', () => closeModal('productDetailModal'));
    document.getElementById('closeProductDetailBtn')?.addEventListener('click', () => closeModal('productDetailModal'));
    document.getElementById('addProductBtn')?.addEventListener('click', addCurrentProduct);

    // Age verification
    document.getElementById('unlockSpicyBtn')?.addEventListener('click', () => showModal('ageVerificationModal'));
    const ageCheckbox = document.getElementById('ageConsentCheckbox');
    const ageConfirmBtn = document.getElementById('ageConfirmBtn');

    if (ageCheckbox && ageConfirmBtn) {
        ageCheckbox.addEventListener('change', () => {
            ageConfirmBtn.disabled = !ageCheckbox.checked;
        });
    }

    document.getElementById('ageConfirmBtn')?.addEventListener('click', confirmAge);
    document.getElementById('ageDeclineBtn')?.addEventListener('click', () => closeModal('ageVerificationModal'));

    // Order summary and finalization
    const finalizeBtn = document.getElementById('finalizeOrder');
    if (finalizeBtn) {
        finalizeBtn.addEventListener('click', showOrderSummary);
    }

    document.getElementById('continueAddingBtn')?.addEventListener('click', () => closeModal('orderSummaryModal'));
    document.getElementById('confirmOrderBtn')?.addEventListener('click', showClientForm);
    document.getElementById('backToSummaryBtn')?.addEventListener('click', () => {
        closeModal('clientFormModal');
        showModal('orderSummaryModal');
    });
    document.getElementById('sendToWhatsAppBtn')?.addEventListener('click', sendToWhatsApp);

    // Smooth scroll for CTAs
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

// Modal utilities with Tailwind classes
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100', 'pointer-events-auto');

        // Animate container
        const container = modal.querySelector('.transform');
        if (container) {
            container.classList.remove('scale-90');
            container.classList.add('scale-100');
        }

        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('opacity-0', 'pointer-events-none');
        modal.classList.remove('opacity-100', 'pointer-events-auto');

        // Animate container
        const container = modal.querySelector('.transform');
        if (container) {
            container.classList.add('scale-90');
            container.classList.remove('scale-100');
        }

        document.body.style.overflow = '';
    }
}

// Open product detail modal
function openProductDetail(productId, cardElement) {
    const product = productDetails[productId];
    if (!product) return;

    // Determine category - for kits, we don't have a card element
    const isKit = productId === 'kit-base' || productId === 'kit-premium';
    const category = cardElement ? cardElement.dataset.category : 'kit';

    currentProduct = {
        id: productId,
        ...product,
        category: category
    };

    // Populate modal
    const iconElement = document.getElementById('productDetailIcon');
    const imageContainer = document.getElementById('productDetailImageContainer');
    const imageElement = document.getElementById('productDetailImage');

    // Handle image display for Kit Base
    if (productId === 'kit-base') {
        // Show image, hide icon
        imageContainer.classList.remove('hidden');
        imageElement.src = 'tarjeta_kit_base.png';
        imageElement.alt = product.name;
        iconElement.style.display = 'none';
    } else if (productId === 'kit-premium') {
        // Show image, hide icon
        imageContainer.classList.remove('hidden');
        imageElement.src = 'kit_premium.png';
        imageElement.alt = product.name;
        iconElement.style.display = 'none';
    } else {
        // Show icon, hide image
        imageContainer.classList.add('hidden');
        iconElement.style.display = 'block';
        iconElement.textContent = product.icon;
    }

    document.getElementById('productDetailTitle').textContent = product.detailedTitle || product.name;

    // For kits, show the price differently
    if (isKit) {
        document.getElementById('productDetailPrice').textContent = `$${product.price} MXN`;
    } else {
        document.getElementById('productDetailPrice').textContent = `+$${product.price}`;
    }

    // Use detailed description if available
    document.getElementById('productDetailDescription').textContent = product.detailedDescription || product.description;

    const listEl = document.getElementById('productDetailList');
    listEl.innerHTML = '';
    product.includes.forEach(item => {
        const li = document.createElement('li');
        li.className = 'p-3 border-l-3 border-rose-500 mb-2 bg-rose-500/5 rounded-lg text-gray-300';
        li.textContent = item;
        listEl.appendChild(li);
    });

    // Update button - hide for kits since they use loadPresetKit
    const addBtn = document.getElementById('addProductBtn');
    if (isKit) {
        addBtn.style.display = 'none';
    } else {
        addBtn.style.display = 'flex';
        // Update button text based on if already selected
        const isSelected = isProductSelected(productId, category);
        if (isSelected) {
            addBtn.innerHTML = `
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Quitar del Kit`;
        } else {
            addBtn.innerHTML = `
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Agregar al Kit`;
        }
    }

    showModal('productDetailModal');
}

// Check if product is selected
function isProductSelected(productId, category) {
    if (category === 'craft') {
        return packageBuilder.crafts.some(item => item.id === productId);
    } else if (category === 'extra') {
        return packageBuilder.extras.some(item => item.id === productId);
    }
    return false;
}

// Toggle product directly from button (without modal)
function toggleProduct(card) {
    if (!card) return;

    const productId = card.dataset.id;
    const category = card.dataset.category;
    const productName = card.dataset.name;
    const productPrice = parseInt(card.dataset.price);

    const cardData = {
        id: productId,
        name: productName,
        price: productPrice,
        category: category
    };

    const isSelected = isProductSelected(productId, category);
    const addBtn = card.querySelector('.add-to-cart-btn');

    if (isSelected) {
        // Remove - Update Tailwind classes
        card.classList.remove('border-rose-500', 'bg-gradient-to-br', 'from-slate-800/50', 'to-rose-500/10', 'shadow-lg', 'shadow-rose-500/30');
        card.classList.add('border-white/5');

        // Hide checkmark
        const checkmark = card.querySelector('.card-selected-icon');
        if (checkmark) {
            checkmark.classList.add('hidden');
            checkmark.classList.remove('flex');
        }

        // Update button text
        if (addBtn) {
            addBtn.textContent = 'Añadir al Kit';
        }

        if (category === 'craft') {
            packageBuilder.crafts = packageBuilder.crafts.filter(item => item.id !== cardData.id);
        } else if (category === 'extra') {
            packageBuilder.extras = packageBuilder.extras.filter(item => item.id !== cardData.id);
        }
    } else {
        // Add - Update Tailwind classes
        card.classList.remove('border-white/5');
        card.classList.add('border-rose-500', 'bg-gradient-to-br', 'from-slate-800/50', 'to-rose-500/10', 'shadow-lg', 'shadow-rose-500/30');

        // Show checkmark
        const checkmark = card.querySelector('.card-selected-icon');
        if (checkmark) {
            checkmark.classList.remove('hidden');
            checkmark.classList.add('flex');
        }

        // Update button text
        if (addBtn) {
            addBtn.textContent = 'Quitar';
        }

        if (category === 'craft') {
            packageBuilder.crafts.push(cardData);
        } else if (category === 'extra') {
            packageBuilder.extras.push(cardData);
        }
    }

    updateCart();
}

// Add/remove current product from cart
function addCurrentProduct() {
    if (!currentProduct) return;

    const card = document.querySelector(`[data-id="${currentProduct.id}"]`);
    if (!card) return;

    const category = currentProduct.category;
    const cardData = {
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        category: category
    };

    const isSelected = isProductSelected(currentProduct.id, category);

    if (isSelected) {
        // Remove - Update Tailwind classes
        card.classList.remove('border-rose-500', 'bg-gradient-to-br', 'from-slate-800/50', 'to-rose-500/10', 'shadow-rose-500/30');
        card.classList.add('border-white/5');

        // Hide checkmark
        const checkmark = card.querySelector('.card-selected-icon');
        if (checkmark) {
            checkmark.classList.add('hidden');
            checkmark.classList.remove('flex');
        }

        if (category === 'craft') {
            packageBuilder.crafts = packageBuilder.crafts.filter(item => item.id !== cardData.id);
        } else if (category === 'extra') {
            packageBuilder.extras = packageBuilder.extras.filter(item => item.id !== cardData.id);
        }
    } else {
        // Add - Update Tailwind classes
        card.classList.remove('border-white/5');
        card.classList.add('border-rose-500', 'bg-gradient-to-br', 'from-slate-800/50', 'to-rose-500/10', 'shadow-lg', 'shadow-rose-500/30');

        // Show checkmark
        const checkmark = card.querySelector('.card-selected-icon');
        if (checkmark) {
            checkmark.classList.remove('hidden');
            checkmark.classList.add('flex');
        }

        if (category === 'craft') {
            packageBuilder.crafts.push(cardData);
        } else if (category === 'extra') {
            packageBuilder.extras.push(cardData);
        }
    }

    updateCart();
    closeModal('productDetailModal');
}

// Age verification
function checkAgeVerification() {
    ageVerified = sessionStorage.getItem('age_verified') === 'true';
    if (ageVerified) {
        unlockSpicyContent();
    }
}

function confirmAge() {
    const checkbox = document.getElementById('ageConsentCheckbox');
    if (checkbox && checkbox.checked) {
        ageVerified = true;
        sessionStorage.setItem('age_verified', 'true');
        unlockSpicyContent();
        closeModal('ageVerificationModal');
    }
}

function unlockSpicyContent() {
    const overlay = document.getElementById('spicyUnlockOverlay');
    const container = document.getElementById('spicyCardsContainer');

    if (overlay) overlay.style.display = 'none';
    if (container) {
        container.classList.remove('blur-lg', 'pointer-events-none', 'select-none');
    }
}

// Update cart display and button state
function updateCart() {
    const cartItemsEl = document.getElementById('cartItems');
    const totalPriceEl = document.getElementById('totalPrice');

    // Build cart summary text
    let cartText;

    if (!selectedKit) {
        // No kit selected yet
        cartText = 'Selecciona un Kit para comenzar';
    } else {
        const kitName = productDetails[selectedKit] ? productDetails[selectedKit].name : 'Kit Base';
        cartText = kitName;

        if (packageBuilder.crafts.length > 0) {
            if (packageBuilder.crafts.length === 1) {
                cartText += ` + ${packageBuilder.crafts[0].name}`;
            } else {
                cartText += ` + ${packageBuilder.crafts.length} actividades`;
            }
        }

        if (packageBuilder.extras.length > 0) {
            cartText += ` + ${packageBuilder.extras.length} extra${packageBuilder.extras.length > 1 ? 's' : ''}`;
        }

    }

    // Calculate total price
    const totalPrice = calculateTotalPrice();

    // Update UI
    if (cartItemsEl) {
        cartItemsEl.textContent = cartText;
    }

    if (totalPriceEl) {
        totalPriceEl.textContent = `$${totalPrice}`;
    }
}

// Calculate total price
function calculateTotalPrice() {
    // If no kit selected, return 0
    if (!selectedKit) {
        return 0;
    }

    // 1. Base Kit Price
    let total = productDetails[selectedKit] ? productDetails[selectedKit].price : 0;

    // 2. Crafts
    // Kit Base includes 1 craft for free
    // Kit Premium includes 2 crafts for free
    const includedCrafts = selectedKit === 'kit-premium' ? 2 : 1;
    packageBuilder.crafts.forEach((craft, index) => {
        if (index >= includedCrafts) {
            total += craft.price;
        }
    });

    // 3. Extras
    packageBuilder.extras.forEach(extra => {
        total += extra.price;
    });

    return total;
}

// Show order summary modal
function showOrderSummary() {
    // Check if a kit is selected
    if (!selectedKit) {
        alert('Por favor selecciona un Kit para continuar');
        return;
    }

    // VALIDATION: Kit Base requires at least one craft
    if (selectedKit === 'kit-base' && packageBuilder.crafts.length === 0) {
        alert('⚠️ Para el Kit Base debes elegir al menos una actividad (Pintura o Tarjetas) antes de continuar.');

        // Scroll to crafts section
        const activitiesSection = document.querySelector('[data-category="craft"]')?.closest('.mb-20');
        if (activitiesSection) {
            activitiesSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    const summaryContent = document.getElementById('orderSummaryContent');
    if (!summaryContent) return;

    let html = '';

    // Kit section
    const kitProduct = productDetails[selectedKit];
    if (kitProduct) {
        html += `
            <div class="bg-slate-800/50 border-2 border-rose-500/30 rounded-xl p-4">
                <h3 class="text-lg font-semibold text-rose-300 mb-3">Kit Seleccionado</h3>
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-semibold text-white">${kitProduct.icon} ${kitProduct.name}</p>
                    </div>
                    <p class="text-xl font-bold text-rose-400">$${kitProduct.price}</p>
                </div>
            </div>
        `;
    }

    // Crafts section
    if (packageBuilder.crafts.length > 0) {
        html += `
            <div class="bg-slate-800/50 border-2 border-purple-500/30 rounded-xl p-4">
                <h3 class="text-lg font-semibold text-purple-300 mb-3">Actividades</h3>
                <div class="space-y-2">
        `;

        const includedCrafts = selectedKit === 'kit-premium' ? 2 : 1;
        packageBuilder.crafts.forEach((craft, index) => {
            const isFree = index < includedCrafts;
            html += `
                <div class="flex justify-between items-center text-gray-300">
                    <p>${craft.name} ${isFree ? '<span class="text-xs text-green-400">(Incluida)</span>' : ''}</p>
                    <p class="font-semibold">${isFree ? 'Gratis' : '$' + craft.price}</p>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    }

    // Extras section
    if (packageBuilder.extras.length > 0) {
        html += `
            <div class="bg-slate-800/50 border-2 border-amber-500/30 rounded-xl p-4">
                <h3 class="text-lg font-semibold text-amber-300 mb-3">Extras</h3>
                <div class="space-y-2">
        `;

        packageBuilder.extras.forEach(extra => {
            html += `
                <div class="flex justify-between items-center text-gray-300">
                    <p>${extra.name}</p>
                    <p class="font-semibold">$${extra.price}</p>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    }

    // Total section
    const total = calculateTotalPrice();
    html += `
        <div class="bg-gradient-to-r from-rose-500/20 to-purple-600/20 border-2 border-rose-500 rounded-xl p-5 mt-4">
            <div class="flex justify-between items-center">
                <h3 class="text-2xl font-heading font-bold text-white">Total:</h3>
                <p class="text-3xl font-heading font-extrabold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                    $${total} MXN
                </p>
            </div>
        </div>
    `;

    summaryContent.innerHTML = html;
    showModal('orderSummaryModal');
}

// Show client form modal
function showClientForm() {
    closeModal('orderSummaryModal');
    // Clear previous form data
    document.getElementById('clientName').value = '';
    document.getElementById('clientPhone').value = '';
    document.getElementById('clientEmail').value = '';
    document.getElementById('clientMessage').value = '';
    showModal('clientFormModal');
}

// Send order to WhatsApp
function sendToWhatsApp() {
    // Validate form
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const email = document.getElementById('clientEmail').value.trim();
    const message = document.getElementById('clientMessage').value.trim();

    if (!name || !phone || !email) {
        alert('Por favor completa todos los campos obligatorios');
        return;
    }

    // Build WhatsApp message
    let whatsappMessage = `🎁 *Nuevo Pedido Sweet&Art*\n\n`;
    whatsappMessage += `👤 *Datos del Cliente:*\n`;
    whatsappMessage += `Nombre: ${name}\n`;
    whatsappMessage += `Teléfono: ${phone}\n`;
    whatsappMessage += `Email: ${email}\n`;

    // Add message/dedication if provided
    if (message) {
        whatsappMessage += `\n💌 *Mensaje/Dedicatoria:*\n"${message}"\n`;
    }

    whatsappMessage += `\n📦 *Pedido:*\n`;

    // Kit
    const kitProduct = productDetails[selectedKit];
    if (kitProduct) {
        whatsappMessage += `\n🎁 *${kitProduct.name}* - $${kitProduct.price}\n`;
    }

    // Crafts
    if (packageBuilder.crafts.length > 0) {
        whatsappMessage += `\n🎨 *Actividades:*\n`;
        const includedCrafts = selectedKit === 'kit-premium' ? 2 : 1;
        packageBuilder.crafts.forEach((craft, index) => {
            const isFree = index < includedCrafts;
            whatsappMessage += `  • ${craft.name}${isFree ? ' (Incluida)' : ' - $' + craft.price}\n`;
        });
    }

    // Extras
    if (packageBuilder.extras.length > 0) {
        whatsappMessage += `\n✨ *Extras:*\n`;
        packageBuilder.extras.forEach(extra => {
            whatsappMessage += `  • ${extra.name} - $${extra.price}\n`;
        });
    }

    const total = calculateTotalPrice();
    whatsappMessage += `\n💰 *Total: $${total} MXN*`;

    // Encode message and open WhatsApp
    const whatsappNumber = '523343591191';
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    // Close modal after sending
    setTimeout(() => {
        closeModal('clientFormModal');
        // Show success message
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50';
        notification.textContent = '✓ ¡Pedido enviado! Te contactaremos pronto';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }, 500);
}


// Add visual feedback on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const stickyCart = document.getElementById('stickyCart');

    if (stickyCart) {
        if (currentScroll > 200) {
            stickyCart.style.boxShadow = '0 -8px 30px rgba(0, 0, 0, 0.7)';
        } else {
            stickyCart.style.boxShadow = '0 -4px 20px rgba(0, 0, 0, 0.5)';
        }
    }

    lastScroll = currentScroll;
});

// Information Carousel Auto-Rotation
let currentInfoIndex = 0;
const infoItems = document.querySelectorAll('.info-carousel-item');
const infoIndicators = document.querySelectorAll('.info-indicator');
const totalInfoItems = infoItems.length;

function showInfoSlide(index) {
    // Hide all slides
    infoItems.forEach(item => {
        item.style.opacity = '0';
        item.style.pointerEvents = 'none';
    });

    // Reset all indicators
    infoIndicators.forEach(indicator => {
        indicator.classList.remove('bg-white/50');
        indicator.classList.add('bg-white/30');
    });

    // Show current slide
    if (infoItems[index]) {
        infoItems[index].style.opacity = '1';
        infoItems[index].style.pointerEvents = 'auto';
    }

    // Highlight current indicator
    if (infoIndicators[index]) {
        infoIndicators[index].classList.remove('bg-white/30');
        infoIndicators[index].classList.add('bg-white/50');
    }
}

function nextInfoSlide() {
    currentInfoIndex = (currentInfoIndex + 1) % totalInfoItems;
    showInfoSlide(currentInfoIndex);
}

// Auto-rotate every 3 seconds
if (totalInfoItems > 0) {
    setInterval(nextInfoSlide, 3000);

    // Add click handlers to indicators
    infoIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentInfoIndex = index;
            showInfoSlide(currentInfoIndex);
        });
    });
}
