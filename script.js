fetch('settings.json')
  .then(response => response.json())
  .then(products => {

    const newArrivalsList = document.getElementById('new-arrivals-list');
    if (newArrivalsList) {
      const newArrivals = products.filter(product => product.tags.includes('new'));
      newArrivals.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="product.html?id=${product.id}">
                <img src="${product.images[0]}" alt="${product.name}">
                <p class="name">${product.name}</p>
                <div class="rating">
                    <span class="stars">★★★★</span>
                    <span class="rating-number">${product.rating}/5</span>
                </div>
                <p class="price">$${product.price}</p>
            </a>
        `;
        newArrivalsList.appendChild(li);
      });
    }

    const topSellingList = document.getElementById('top-selling-list');
    if (topSellingList) {
      const topSelling = products.filter(product => product.tags.includes('bestseller'));
      topSelling.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `
          <a href="product.html?id=${product.id}">
            <img src="${product.images[0]}" alt="${product.name}">
            <p class="name">${product.name}</p>
            <div class="rating">
              <span class="stars">★★★★</span>
              <span class="rating-number">${product.rating}/5</span>
            </div>
            <p class="price">$${product.price}</p>
          </a>
        `;
        topSellingList.appendChild(li);
      });
    }

    //-----------------------------------------CATEGORY PAGE---------------------------------------
    const categoryGrid = document.getElementById('category-product-grid');
    if (categoryGrid) {
      products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `
          <a href="product.html?id=${product.id}">
            <img src="${product.images[0]}" alt="${product.name}">
            <p class="name">${product.name}</p>
            <div class="rating">
              <span class="stars">★★★★</span>
              <span class="rating-number">${product.rating}/5</span>
            </div>
            <p class="price">$${product.price}</p>
          </a>
        `;
        categoryGrid.appendChild(li);
      });
    }

    //-----------------------------------------PRODUCT PAGE---------------------------------------
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const currentProduct = products.find(product => product.id === productId);

    if (currentProduct) {
      document.querySelector('.product-info h1').textContent = currentProduct.name;
      document.querySelector('.current-price').textContent = '$' + currentProduct.price;

      if (currentProduct.discount > 0) {
        document.querySelector('.discount-badge').textContent = '-' + currentProduct.discount + '%';
        document.querySelector('.old-price').textContent = '$' + currentProduct.originalPrice;
      } else {
        document.querySelector('.discount-badge').style.display = 'none';
        document.querySelector('.old-price').style.display = 'none';
      }

      document.querySelector('.rating-number').textContent = currentProduct.rating + '/5';
      document.querySelector('.description').textContent = currentProduct.description;
      document.querySelector('.main-image img').src = currentProduct.images[0];

      const colorsHTML = currentProduct.colors.map(color =>
        `<li class="swatch" style="background-color: ${color.hex};"></li>`
      ).join('');

      document.querySelector('.color-swatches').innerHTML = colorsHTML;

      const swatches = document.querySelectorAll('.swatch');
      swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
          swatches.forEach(s => s.classList.remove('selected'));
          swatch.classList.add('selected');
        });
      });

      const addToCartBtn = document.querySelector('.add-to-cart-btn');
      addToCartBtn.addEventListener('click', () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        const existingItem = cart.find(item => item.id === currentProduct.id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          const newItem = { ...currentProduct, quantity: 1 };
          cart.push(newItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
      });
    }

    //-----------------------------------------CART PAGE---------------------------------------
    const cartItemsList = document.querySelector('.cart-items');

    function renderCart() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.forEach(item => {
        if (!item.quantity) {
            item.quantity = 1;
        }
    });

      cartItemsList.innerHTML = '';

      cart.forEach((product, index) => {
        const li = document.createElement('li');
        li.classList.add('cart-item');
        li.dataset.index = index;
        li.innerHTML = `
          <img src="${product.images[0]}" alt="${product.name}">
          <div class="item-details">
            <div class="item-top">
              <div>
                <p class="name">${product.name}</p>
              </div>
              <span class="remove-btn"><svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.25 3H13.5V2.25C13.5 1.65326 13.2629 1.08097 12.841 0.65901C12.419 0.237053 11.8467 0 11.25 0H6.75C6.15326 0 5.58097 0.237053 5.15901 0.65901C4.73705 1.08097 4.5 1.65326 4.5 2.25V3H0.75C0.551088 3 0.360322 3.07902 0.21967 3.21967C0.0790178 3.36032 0 3.55109 0 3.75C0 3.94891 0.0790178 4.13968 0.21967 4.28033C0.360322 4.42098 0.551088 4.5 0.75 4.5H1.5V18C1.5 18.3978 1.65804 18.7794 1.93934 19.0607C2.22064 19.342 2.60218 19.5 3 19.5H15C15.3978 19.5 15.7794 19.342 16.0607 19.0607C16.342 18.7794 16.5 18.3978 16.5 18V4.5H17.25C17.4489 4.5 17.6397 4.42098 17.7803 4.28033C17.921 4.13968 18 3.94891 18 3.75C18 3.55109 17.921 3.36032 17.7803 3.21967C17.6397 3.07902 17.4489 3 17.25 3ZM7.5 14.25C7.5 14.4489 7.42098 14.6397 7.28033 14.7803C7.13968 14.921 6.94891 15 6.75 15C6.55109 15 6.36032 14.921 6.21967 14.7803C6.07902 14.6397 6 14.4489 6 14.25V8.25C6 8.05109 6.07902 7.86032 6.21967 7.71967C6.36032 7.57902 6.55109 7.5 6.75 7.5C6.94891 7.5 7.13968 7.57902 7.28033 7.71967C7.42098 7.86032 7.5 8.05109 7.5 8.25V14.25ZM12 14.25C12 14.4489 11.921 14.6397 11.7803 14.7803C11.6397 14.921 11.4489 15 11.25 15C11.0511 15 10.8603 14.921 10.7197 14.7803C10.579 14.6397 10.5 14.4489 10.5 14.25V8.25C10.5 8.05109 10.579 7.86032 10.7197 7.71967C10.8603 7.57902 11.0511 7.5 11.25 7.5C11.4489 7.5 11.6397 7.57902 11.7803 7.71967C11.921 7.86032 12 8.05109 12 8.25V14.25ZM12 3H6V2.25C6 2.05109 6.07902 1.86032 6.21967 1.71967C6.36032 1.57902 6.55109 1.5 6.75 1.5H11.25C11.4489 1.5 11.6397 1.57902 11.7803 1.71967C11.921 1.86032 12 2.05109 12 2.25V3Z" fill="#FF3333"/>
</svg>
</span>
            </div>
            <div class="item-bottom">
              <p class="price">$${product.price}</p>
              <div class="quantity">
                <button class="qty-btn qty-minus">−</button>
                <span class="qty-number">${product.quantity}</span>
                <button class="qty-btn qty-plus">+</button>
              </div>
            </div>
          </div>
        `;
        cartItemsList.appendChild(li);
      });

      const subtotal = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
      const discount = subtotal * 0.2;
      const deliveryFee = cart.length > 0 ? 15 : 0;
      const total = subtotal - discount + deliveryFee;

      document.querySelector('.subtotal-value').textContent = '$' + subtotal;
      document.querySelector('.discount-value').textContent = '-$' + discount.toFixed(0);
      document.querySelector('.delivery-value').textContent = '$' + deliveryFee;
      document.querySelector('.total-value').textContent = '$' + total.toFixed(0);

      document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const li = e.target.closest('.cart-item');
          const index = li.dataset.index;
          let cart = JSON.parse(localStorage.getItem('cart')) || [];
          cart.splice(index, 1);
          localStorage.setItem('cart', JSON.stringify(cart));
          renderCart();
          updateCartCount();
        });
      });

      document.querySelectorAll('.qty-plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const li = e.target.closest('.cart-item');
          const index = li.dataset.index;
          let cart = JSON.parse(localStorage.getItem('cart')) || [];
          cart[index].quantity += 1;
          localStorage.setItem('cart', JSON.stringify(cart));
          renderCart();
          updateCartCount();
        });
      });

      document.querySelectorAll('.qty-minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const li = e.target.closest('.cart-item');
          const index = li.dataset.index;
          let cart = JSON.parse(localStorage.getItem('cart')) || [];
          if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
          } else {
            cart.splice(index, 1);
          }
          localStorage.setItem('cart', JSON.stringify(cart));
          renderCart();
          updateCartCount();
        });
      });
    }

    if (cartItemsList) {
      renderCart();
    }

    //-----------------------------------------CART ICON COUNT---------------------------------------
    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const cartCountEl = document.querySelector('.cart-count');
      if (cartCountEl) {
        cartCountEl.textContent = totalItems;
      }
    }

    updateCartCount();

  });