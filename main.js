(() => {
    let api = 'https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json';
    let products = [];
    let favorites = [];
    let currentIndex = 0;
        const init = () => {
        if (window.location.pathname !== '/') {
            console.log("Wrong page, widget not running.");
            return;
        }
        
        loadFavorites();
        buildCSS();
        buildHTML();
        productData();
    };

    const loadFavorites = () => {
        const data = localStorage.getItem('favorites');
        favorites = data ? JSON.parse(data).map(Number) : [];
    };

    const buildCSS = () => {
        const css = `
            .product-carousel-container {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                width: 95%;
                max-width: 1300px;
                margin: 40px auto;
                position: relative;
            }
            .carousel-title {
                font-size: 24px;
                margin-bottom: 20px;
                color: #2b2f33;
            }
            .carousel-wrapper {
                position: relative;
                overflow: hidden;
            }
            .product-list {
                display: flex;
                transition: transform 0.5s ease-in-out;
            }
            .product-card {
                height: 345px;
                flex: 0 0 calc(20% - 16px);
                box-sizing: border-box;
                padding: 10px 10px 0;
                margin: 8px;
                text-align: left;
                border: 1.2px solid #f6f6fa;
                border-radius: 8px;
                cursor: pointer;
                background-color: #fff;
                transition: border-color 0.2s;
            }
            .product-card:hover {
                border-color: #A2B1BC;
            }
            .product-card img {
                width: 100%;
                height: 203px;
                object-fit: contain;
                display: block;
                margin-bottom: 10px;
                border-radius: 4px;
            }
            .product-image-container {
                position: relative;
            }
            .product-name {
                font-size: 12px;
                font-family: 'Quicksand-medium';
                font-weight: 400;
                color: #2b2f33;
                line-height: 1.2;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
            }
            .product-brand {
                font-weight: 600;
            }
            .price-container {
                margin: 0;
                padding: 42px 0 0;
                display: flex;
                flex-direction: column;
            }
            .price-row {
                display: flex;
                align-items: center;
                margin-bottom: -20px;
            }
            .current-price,
            .price-main,
            .new-main {
                font-size: 20px;
                font-family: 'Quicksand-SemiBold';
                font-weight: 400;
                color: #2B2F33;
            }
            .new-main {
                font-weight: 600;
                color: #43B06A;
                margin-bottom: 8px;
            }
            .new-fraction,
            .new-tl {
                font-size: 14px;
                font-family: 'Quicksand-SemiBold';
                font-weight: 600;
            }
            .new-fraction,
            .new-tl {
                font-size: 12px;
                color: #43B06A;
                margin-left: 2px;
            }
            .current-price {
                margin-top: 4px;
                display: block;
            }
            .old-main {
                margin-bottom: 14px;
                font-size: 12px;
                font-family: 'Quicksand-SemiBold';
                font-weight: 400;
                color: #A2B1BC;
            }
            .discount-badge {
                margin-bottom: 14px;
                display: inline-block;
                background: #00A365;
                color: #fff;
                font-size: 12px;
                font-family: 'Quicksand-SemiBold';
                font-weight: 400;
                border-radius: 16px;
                padding: 0 4px;
                margin-left: 4px;
                vertical-align: middle;
            }
            .favorite-btn {
                position: absolute;
                top: 0px;
                right: 0px;
                background-color: #fff;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: color 0.2s, background-color 0.2s;
            }
            .favorite-btn img {
                width: 15px;
                height: 15px;
                margin: auto;
                display: block;
            }
            .nav-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background-color: #fff;
                border: 1px solid #fdfcfc;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                cursor: pointer;
                z-index: 10;
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0 2px 8px rgba(22,29,37,0.07);
            }
            .nav-arrow.prev { left: -60px; }
            .nav-arrow.next { right: -60px; }
            @media (max-width: 1500px) {
                .product-card { flex: 0 0 calc(25% - 16px); }
                .product-carousel-container { width: 90%; max-width: 1140px; }
            }
            @media (max-width: 1280px) {
                .product-card { flex: 0 0 calc(33.33% - 16px); }
                .product-carousel-container { width: 88%; max-width: 930px; }
            }
            @media (max-width: 991px) {
                .product-card { flex: 0 0 calc(50% - 16px); }
                .product-carousel-container { width: 92%; max-width: 710px; padding: 0 8px; }
            }
            @media (max-width: 768px) {
                .carousel-title { font-size: 20px; }
                .product-carousel-container { width: 96%; max-width: 540px; padding: 0 8px; }
            }
            @media (max-width: 480px) {
                .product-card { flex: 0 0 calc(100% - 16px); margin: 8px auto; }
                .product-carousel-container { width: 98%; max-width: 360px; padding: 0 6px; }
            }
        `;
        const styleElement = document.createElement('style');
        styleElement.innerHTML = css;
        document.head.appendChild(styleElement);
    };

    const buildHTML = () => {
        const container = document.createElement('div');
    container.className = 'product-carousel-container';
        container.innerHTML = `
            <h2 class="carousel-title">Beğenebileceğinizi düşündüklerimiz</h2>
            <div class="carousel-wrapper">
                <div class="product-list-container">
                     <div class="product-list"></div>
                </div>
            </div>
            <button class="nav-arrow prev">
                <img src="https://cdn06.e-bebek.com/assets/toys/svg/arrow-left.svg" alt="Sol" width="14" height="14" />
            </button>
            <button class="nav-arrow next">
                <img src="https://cdn06.e-bebek.com/assets/toys/svg/arrow-right.svg" alt="Sağ" width="14" height="14" />
            </button>
        `;
        const targetElement = document.querySelector('.hero.banner');
        if (targetElement) {
            targetElement.insertAdjacentElement('afterend', container);
        } else {
            console.error('Hedef element (.hero.banner) bulunamadı.');
            document.body.appendChild(container);
        }
    };

    const productData = async () => {
        const localData = localStorage.getItem('productlist');
        if (localData) {
            products = JSON.parse(localData);
            BuildCart();
        } else {
            try {
                let response = await fetch(api);
                products = await response.json();
                localStorage.setItem('productlist', JSON.stringify(products));
                BuildCart();
            } catch (error) {
                console.error('Ürünler yüklenemedi:', error);
            }
        }
    };

    const toggleFavorite = (button) => {
    const card = button.closest('.product-card');
        if (!card) return;
        const productId = Number(card.dataset.productId);
        if (!Number.isFinite(productId)) return;

        button.classList.toggle('favorited');
        const img = button.querySelector('img');
        img.src = button.classList.contains('favorited') 
            ? 'https://cdn06.e-bebek.com/assets/toys/svg/heart-orange-filled.svg'
            : 'https://cdn06.e-bebek.com/assets/toys/svg/heart-outline.svg';

        if (favorites.includes(productId)) {
            favorites = favorites.filter(id => id !== productId);
        } else {
            favorites.push(productId);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
    };

    const slide = (direction) => {
    const productList = document.querySelector('.product-list');
    const card = productList.querySelector('.product-card');
        if (!card) return;

        const cardWidth = card.offsetWidth + parseInt(window.getComputedStyle(card).marginLeft) * 2;
        const visibleItems = Math.floor(productList.parentElement.offsetWidth / cardWidth);
        const maxIndex = products.length - visibleItems;

        if (direction === 'next' && currentIndex < maxIndex) {
            currentIndex++;
        } else if (direction === 'prev' && currentIndex > 0) {
            currentIndex--;
        }

        productList.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    document.querySelector('.nav-arrow.prev').style.display = 'block';
    document.querySelector('.nav-arrow.next').style.display = 'block';
    };

    const attachEvents = () => {
    const container = document.querySelector('.product-carousel-container');
        if (!container) return;

        container.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-btn')) {
                toggleFavorite(e.target.closest('.favorite-btn'));
            } else if (e.target.closest('.product-card')) {
                window.open(e.target.closest('.product-card').dataset.url, '_blank');
            } else if (e.target.closest('.nav-arrow.prev')) {
                slide('prev');
            } else if (e.target.closest('.nav-arrow.next')) {
                slide('next');
            }
        });

        container.addEventListener('mouseover', (e) => {
            const btn = e.target.closest('.favorite-btn');
            if (btn) {
                btn.querySelector('img').src = 'https://cdn06.e-bebek.com/assets/toys/svg/heart-orange-outline.svg';
            }
        });

        container.addEventListener('mouseout', (e) => {
            const btn = e.target.closest('.favorite-btn');
            if (btn) {
                const img = btn.querySelector('img');
                img.src = btn.classList.contains('favorited') 
                    ? 'https://cdn06.e-bebek.com/assets/toys/svg/heart-orange-filled.svg'
                    : 'https://cdn06.e-bebek.com/assets/toys/svg/heart-outline.svg';
            }
        });
    };

    const BuildCart = () => {
    const productList = document.querySelector('.product-list');
        if (!productList) return;

        productList.innerHTML = '';
        products.forEach(product => {
            const isFavorited = favorites.includes(Number(product.id));
            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.url = product.url;
            card.dataset.productId = String(product.id);

            const priceParts = product.price.toString().split(".");
            const mainPrice = priceParts[0];
            const fractionPrice = priceParts[1] && priceParts[1] !== "00" ? priceParts[1] : "";
            
            let priceHTML = `<span class="current-price"><span class="price-main">${mainPrice}</span>,<span class='price-fraction'>${fractionPrice ? fractionPrice + " TL" : " TL"}</span></span>`;
            
            if (product.original_price && product.original_price > product.price) {
                const originalParts = product.original_price.toString().split(".");
                const originalMain = originalParts[0];
                const originalFraction = originalParts[1] && originalParts[1] !== "00" ? originalParts[1] : "";
                const discount = Math.round(100 - (product.price / product.original_price) * 100);
                
                priceHTML = `
                    <div class="price-row">
                        <span class="old-main">${originalMain}${originalFraction ? "," + originalFraction : ","} TL</span>
                        <span class="discount-badge">%${discount}</span>
                    </div>
                    <div>
                        <span class="new-main">${mainPrice}</span>${fractionPrice ? ",<span class='new-fraction'>" + fractionPrice + "</span>" : ","}<span class="new-tl"> TL</span>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.img}" alt="${product.name}">
                    <button class="favorite-btn ${isFavorited ? 'favorited' : ''}">
                        <img src="${isFavorited ? 'https://cdn06.e-bebek.com/assets/toys/svg/heart-orange-filled.svg' : 'https://cdn06.e-bebek.com/assets/toys/svg/heart-outline.svg'}" alt="Favori" />
                    </button>
                </div>
                <div class="product-name"><span class="product-brand">${product.brand}</span> - ${product.name}</div>
                <div class="price-container">${priceHTML}</div>
            `;
            productList.appendChild(card);
        });
        attachEvents();
    };



    init();
})();