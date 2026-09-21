(function () {
  'use strict';

  const productData = window.TEABOOM_PRODUCT || {};
  const weightOptions = Array.isArray(productData.weights) ? productData.weights : [];
  const weightsList = document.getElementById('product-weights');
  let weightButtons = [];
  const weightEl = document.getElementById('product-weight');
  const articleEl = document.getElementById('product-article');
  const priceEl = document.getElementById('product-price');
  const oldPriceEl = document.getElementById('product-old-price');
  const addToCartBtn = document.getElementById('add-to-cart');
  const openLightboxBtn = document.getElementById('open-lightbox');
  const imageWrap = document.getElementById('product-image-wrap');
  const lightbox = document.getElementById('image-lightbox');
  const mainImage = document.getElementById('product-main-image');
  const lightboxImage = document.querySelector('.image-lightbox__image');
  const thumbButtons = document.querySelectorAll('.product-card__thumb');
  const tipsList = document.getElementById('product-tips');
  const descriptionPanel = document.getElementById('panel-description');
  const propertiesList = document.getElementById('product-properties');
  const productDescription = productData.description || {};

  function formatPrice(value) {
    const num = parseFloat(value);
    const hasDecimals = num % 1 !== 0;

    const formatted = hasDecimals
      ? num.toFixed(2).replace('.', ',')
      : num.toLocaleString('ru-RU');

    return formatted + ' ₽';
  }

  function getWeightLabel(option) {
    return option.label || option.weight + ' г';
  }

  function getCartIconMarkup() {
    return (
      '<svg width="22" height="22" viewBox="0 0 22 22">' +
      '<path d="M2 3h2l1.6 10h12.4L20 7H7" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<circle cx="9" cy="18" r="1.4" fill="currentColor"/>' +
      '<circle cx="17" cy="18" r="1.4" fill="currentColor"/>' +
      '</svg>'
    );
  }

  function createWeightItem(option, index) {
    const item = document.createElement('li');
    const button = document.createElement('button');
    const isActive = index === 0;

    button.className = 'product-card__weight' + (isActive ? ' product-card__weight--active' : '');
    button.type = 'button';
    button.setAttribute('role', 'radio');
    button.setAttribute('aria-checked', isActive ? 'true' : 'false');
    button.dataset.weight = option.weight;
    button.dataset.article = option.article;
    button.dataset.price = option.price;
    button.dataset.oldPrice = option.oldPrice;

    button.innerHTML =
      '<span class="product-card__weight-info">' +
      '<span class="product-card__weight-value">' + getWeightLabel(option) + '</span>' +
      '<span class="product-card__weight-article">арт: <span class="product-card__weight-article-value">' + option.article + '</span></span>' +
      '</span>' +
      '<span class="product-card__weight-prices">' +
      '<span class="product-card__price">' + formatPrice(option.price) + '</span>' +
      '<span class="product-card__old-price">' + formatPrice(option.oldPrice) + '</span>' +
      '</span>' +
      '<span class="product-card__weight-cart" aria-hidden="true">' + getCartIconMarkup() + '</span>' +
      '<span class="product-card__weight-stock">' +
      '<span class="product-card__stock-label">наличие:</span>' +
      '<span class="product-card__stock-value">' + option.stock + '</span>' +
      '</span>';

    item.appendChild(button);
    return item;
  }

  function renderWeightOptions() {
    if (!weightsList || !weightOptions.length) {
      weightButtons = Array.from(document.querySelectorAll('.product-card__weight'));
      return;
    }

    const fragment = document.createDocumentFragment();

    weightOptions.forEach(function (option, index) {
      fragment.appendChild(createWeightItem(option, index));
    });

    weightsList.replaceChildren(fragment);
    weightButtons = Array.from(weightsList.querySelectorAll('.product-card__weight'));
  }

  function appendTextItem(list, text) {
    const item = document.createElement('li');
    item.textContent = text;
    list.appendChild(item);
  }

  function appendSubtitle(parent, text) {
    const title = document.createElement('h3');
    title.className = 'product-tabs__subtitle';
    title.textContent = text;
    parent.appendChild(title);
  }

  function renderTips() {
    if (!tipsList || !Array.isArray(productData.tips)) return;

    tipsList.replaceChildren();

    productData.tips.forEach(function (tip) {
      appendTextItem(tipsList, tip);
    });
  }

  function renderDescription() {
    if (!descriptionPanel || !productDescription.text) return;

    descriptionPanel.replaceChildren();

    appendSubtitle(descriptionPanel, 'Состав');

    const composition = document.createElement('p');
    composition.setAttribute('itemprop', 'description');
    composition.textContent = productDescription.composition + ' ' + productDescription.text;
    descriptionPanel.appendChild(composition);

    if (productDescription.taste) {
      appendSubtitle(descriptionPanel, 'Вкус');

      const taste = document.createElement('p');
      taste.textContent = productDescription.taste;
      descriptionPanel.appendChild(taste);
    }

    if (Array.isArray(productDescription.benefits) && productDescription.benefits.length) {
      appendSubtitle(descriptionPanel, 'Полезные свойства');

      const benefits = document.createElement('ul');
      benefits.className = 'product-tabs__list';

      productDescription.benefits.forEach(function (benefit) {
        appendTextItem(benefits, benefit);
      });

      descriptionPanel.appendChild(benefits);
    }
  }

  function renderProperties() {
    if (!propertiesList || !Array.isArray(productData.properties)) return;

    propertiesList.replaceChildren();

    productData.properties.forEach(function (property) {
      const item = document.createElement('li');
      const name = document.createElement('span');

      name.className = 'product-tabs__prop-name';
      name.textContent = property.name + ':';

      item.appendChild(name);
      item.appendChild(document.createTextNode(' ' + property.value));
      propertiesList.appendChild(item);
    });
  }

  function renderProductContent() {
    renderTips();
    renderDescription();
    renderProperties();
  }

  function selectWeight(button) {
    weightButtons.forEach(function (btn) {
      btn.classList.remove('product-card__weight--active');
      btn.setAttribute('aria-checked', 'false');
    });

    button.classList.add('product-card__weight--active');
    button.setAttribute('aria-checked', 'true');

    const weight = button.dataset.weight;
    const article = button.dataset.article;
    const price = button.dataset.price;
    const oldPrice = button.dataset.oldPrice;

    if (weightEl) {
      weightEl.textContent = weight + ' г';
    }

    articleEl.textContent = article;
    priceEl.textContent = formatPrice(price);
    oldPriceEl.textContent = formatPrice(oldPrice);
    priceEl.setAttribute('content', price);
  }

  renderWeightOptions();
  renderProductContent();

  if (weightButtons.length && articleEl && priceEl && oldPriceEl) {
    selectWeight(weightButtons[0]);

    weightButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        selectWeight(button);
      });
    });
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function () {
      const active = document.querySelector('.product-card__weight--active');
      if (!active) return;

      const weight = active.dataset.weight;
      const article = active.dataset.article;
      const price = active.dataset.price;

      addToCartBtn.textContent = 'Добавлено!';
      addToCartBtn.disabled = true;

      setTimeout(function () {
        addToCartBtn.innerHTML =
          '<svg class="product-card__cart-icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">' +
          '<path d="M2 2h2l1.5 9h11L18 6H6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
          '<circle cx="8" cy="16" r="1.5" fill="currentColor"/>' +
          '<circle cx="15" cy="16" r="1.5" fill="currentColor"/>' +
          '</svg>В корзину';
        addToCartBtn.disabled = false;
      }, 1500);

      addToCartBtn.dataset.selectedWeight = weight;
      addToCartBtn.dataset.selectedArticle = article;
      addToCartBtn.dataset.selectedPrice = price;
    });
  }

  const LIGHTBOX_ANIMATION_MS = 350;
  let isLightboxClosing = false;

  function openLightbox() {
    if (!lightbox || lightbox.open || isLightboxClosing) return;

    if (lightboxImage && mainImage) {
      lightboxImage.src = mainImage.currentSrc || mainImage.src;
      lightboxImage.alt = mainImage.alt + ' — увеличенное изображение';
    }

    lightbox.classList.remove('image-lightbox--visible');
    lightbox.showModal();
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        lightbox.classList.add('image-lightbox--visible');
      });
    });
  }

  function closeLightbox() {
    if (!lightbox || !lightbox.open || isLightboxClosing) return;

    isLightboxClosing = true;
    lightbox.classList.remove('image-lightbox--visible');

    window.setTimeout(function () {
      if (lightbox.open) {
        lightbox.close();
      }
      document.body.style.overflow = '';
      isLightboxClosing = false;
    }, LIGHTBOX_ANIMATION_MS);
  }

  const tabButtons = document.querySelectorAll('.product-tabs__tab');
  const tabPanels = document.querySelectorAll('.product-tabs__panel');

  function syncTabPanelHeight() {
    if (!tabPanels.length) return;

    const panels = Array.from(tabPanels);
    const activePanel = panels.find(function (panel) {
      return !panel.hidden;
    });
    const panelWidth = activePanel
      ? activePanel.getBoundingClientRect().width
      : panels[0].parentElement.getBoundingClientRect().width;
    let maxHeight = 0;

    panels.forEach(function (panel) {
      panel.style.minHeight = '';
    });

    panels.forEach(function (panel) {
      const wasHidden = panel.hidden;
      const previousPosition = panel.style.position;
      const previousVisibility = panel.style.visibility;
      const previousPointerEvents = panel.style.pointerEvents;
      const previousWidth = panel.style.width;

      if (wasHidden) {
        panel.hidden = false;
        panel.style.position = 'absolute';
        panel.style.visibility = 'hidden';
        panel.style.pointerEvents = 'none';
        panel.style.width = panelWidth + 'px';
      }

      maxHeight = Math.max(maxHeight, panel.getBoundingClientRect().height);

      if (wasHidden) {
        panel.hidden = true;
        panel.style.position = previousPosition;
        panel.style.visibility = previousVisibility;
        panel.style.pointerEvents = previousPointerEvents;
        panel.style.width = previousWidth;
      }
    });

    panels.forEach(function (panel) {
      panel.style.minHeight = Math.ceil(maxHeight) + 'px';
    });
  }

  function selectTab(button) {
    const panelId = button.getAttribute('aria-controls');

    tabButtons.forEach(function (tab) {
      tab.classList.remove('product-tabs__tab--active');
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
    });

    tabPanels.forEach(function (panel) {
      panel.classList.remove('product-tabs__panel--active');
      panel.hidden = true;
    });

    button.classList.add('product-tabs__tab--active');
    button.setAttribute('aria-selected', 'true');
    button.setAttribute('tabindex', '0');

    const activePanel = document.getElementById(panelId);
    if (activePanel) {
      activePanel.classList.add('product-tabs__panel--active');
      activePanel.hidden = false;
    }
  }

  tabButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      selectTab(button);
    });

    button.addEventListener('keydown', function (event) {
      const tabs = Array.from(tabButtons);
      const index = tabs.indexOf(button);
      let nextIndex = index;

      if (event.key === 'ArrowRight') {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === 'ArrowLeft') {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else {
        return;
      }

      event.preventDefault();
      selectTab(tabs[nextIndex]);
      tabs[nextIndex].focus();
    });
  });

  syncTabPanelHeight();
  window.addEventListener('resize', syncTabPanelHeight);


  const relatedSection = document.querySelector('.product-related');
  const relatedTrack = document.getElementById('related-track');
  const relatedPrev = document.getElementById('related-prev');
  const relatedNext = document.getElementById('related-next');

  if (relatedTrack && relatedPrev && relatedNext) {
    const SCROLL_STORAGE_KEY = 'teaboom-related-offset';
    const originalItems = Array.from(relatedTrack.children);

    originalItems.forEach(function (item) {
      relatedTrack.appendChild(item.cloneNode(true));
    });

    let cachedSetWidth = 0;
    let trackOffset = 0;
    let autoScrollFrameId = null;
    let manualAnimationFrameId = null;
    let autoSaveFrameCount = 0;
    let lastAutoScrollTime = 0;
    let isHoveringRelated = false;
    let isRelatedVisible = true;
    let interactionPaused = false;
    let interactionResumeTimer;
    const AUTO_SCROLL_SPEED = 1.1;
    const AUTO_SCROLL_PAUSE_MS = 4000;
    const ARROW_ANIMATION_MS = 480;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function updateSetWidthCache() {
      cachedSetWidth = relatedTrack.scrollWidth / 2;
    }

    function getSetWidth() {
      if (!cachedSetWidth) {
        updateSetWidthCache();
      }

      return cachedSetWidth;
    }

    function getStep() {
      const item = relatedTrack.querySelector('.product-related__item');
      if (!item) return 0;

      const gap = parseFloat(getComputedStyle(relatedTrack).gap) || 12;
      return item.offsetWidth + gap;
    }

    function normalizeOffset() {
      const setWidth = getSetWidth();
      if (!setWidth) return;

      while (trackOffset >= setWidth) {
        trackOffset -= setWidth;
      }

      while (trackOffset < 0) {
        trackOffset += setWidth;
      }
    }

    function applyTransform() {
      relatedTrack.style.transform = 'translate3d(' + (-trackOffset) + 'px, 0, 0)';
    }

    function saveScrollPosition() {
      try {
        sessionStorage.setItem(SCROLL_STORAGE_KEY, String(trackOffset));
      } catch (error) {
        // sessionStorage may be unavailable in some contexts
      }
    }

    function restoreScrollPosition() {
      try {
        const saved = sessionStorage.getItem(SCROLL_STORAGE_KEY);
        if (saved === null) return;

        trackOffset = parseFloat(saved) || 0;
        normalizeOffset();
        applyTransform();
      } catch (error) {
        // sessionStorage may be unavailable in some contexts
      }
    }

    function pauseAfterInteraction(duration) {
      interactionPaused = true;
      clearTimeout(interactionResumeTimer);
      interactionResumeTimer = window.setTimeout(function () {
        interactionPaused = false;
        syncAutoScrollLoop();
      }, duration || AUTO_SCROLL_PAUSE_MS);
    }

    function isAutoScrollActive() {
      return (
        !prefersReducedMotion &&
        !document.hidden &&
        isRelatedVisible &&
        !isHoveringRelated &&
        !interactionPaused &&
        manualAnimationFrameId === null
      );
    }

    function stopAutoScrollLoop() {
      if (autoScrollFrameId !== null) {
        cancelAnimationFrame(autoScrollFrameId);
        autoScrollFrameId = null;
      }

      lastAutoScrollTime = 0;
    }

    function stopManualAnimation() {
      if (manualAnimationFrameId !== null) {
        cancelAnimationFrame(manualAnimationFrameId);
        manualAnimationFrameId = null;
      }
    }

    function startAutoScrollLoop() {
      if (prefersReducedMotion || autoScrollFrameId !== null || !isAutoScrollActive()) {
        return;
      }

      autoScrollFrameId = requestAnimationFrame(tickAutoScroll);
    }

    function syncAutoScrollLoop() {
      if (isAutoScrollActive()) {
        startAutoScrollLoop();
      } else {
        stopAutoScrollLoop();
      }
    }

    function tickAutoScroll(timestamp) {
      autoScrollFrameId = null;

      if (!isAutoScrollActive()) {
        lastAutoScrollTime = 0;
        return;
      }

      if (!lastAutoScrollTime) {
        lastAutoScrollTime = timestamp;
      }

      const delta = Math.min(timestamp - lastAutoScrollTime, 32);
      lastAutoScrollTime = timestamp;

      trackOffset += AUTO_SCROLL_SPEED * (delta / 16.67);
      normalizeOffset();
      applyTransform();

      autoSaveFrameCount += 1;
      if (autoSaveFrameCount >= 90) {
        autoSaveFrameCount = 0;
        saveScrollPosition();
      }

      autoScrollFrameId = requestAnimationFrame(tickAutoScroll);
    }

    function easeOutCubic(value) {
      return 1 - Math.pow(1 - value, 3);
    }

    function animateOffsetTo(targetOffset, duration) {
      stopManualAnimation();
      stopAutoScrollLoop();
      pauseAfterInteraction();

      const startOffset = trackOffset;
      const startTime = performance.now();

      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        trackOffset = startOffset + (targetOffset - startOffset) * easeOutCubic(progress);
        applyTransform();

        if (progress < 1) {
          manualAnimationFrameId = requestAnimationFrame(step);
          return;
        }

        trackOffset = targetOffset;
        normalizeOffset();
        applyTransform();
        saveScrollPosition();
        manualAnimationFrameId = null;
        syncAutoScrollLoop();
      }

      if (prefersReducedMotion) {
        trackOffset = targetOffset;
        normalizeOffset();
        applyTransform();
        saveScrollPosition();
        syncAutoScrollLoop();
        return;
      }

      manualAnimationFrameId = requestAnimationFrame(step);
    }

    function scrollByStep(direction) {
      const step = getStep();

      if (direction < 0 && trackOffset < step) {
        trackOffset += getSetWidth();
        applyTransform();
      }

      animateOffsetTo(trackOffset + direction * step, ARROW_ANIMATION_MS);
    }

    updateSetWidthCache();
    applyTransform();

    requestAnimationFrame(function () {
      restoreScrollPosition();
      syncAutoScrollLoop();
    });

    window.addEventListener('resize', function () {
      updateSetWidthCache();
      normalizeOffset();
      applyTransform();
    });

    if (relatedSection) {
      relatedSection.addEventListener('mouseenter', function () {
        isHoveringRelated = true;
        syncAutoScrollLoop();
      });

      relatedSection.addEventListener('mouseleave', function () {
        isHoveringRelated = false;
        syncAutoScrollLoop();
      });

      if ('IntersectionObserver' in window) {
        const relatedObserver = new IntersectionObserver(
          function (entries) {
            isRelatedVisible = entries[0].isIntersecting;
            syncAutoScrollLoop();
          },
          { root: null, threshold: 0.05 }
        );

        relatedObserver.observe(relatedSection);
      }
    }

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && !isHoveringRelated) {
        interactionPaused = false;
      }

      syncAutoScrollLoop();
    });

    window.addEventListener('beforeunload', saveScrollPosition);

    relatedNext.addEventListener('click', function () {
      scrollByStep(1);
    });

    relatedPrev.addEventListener('click', function () {
      scrollByStep(-1);
    });
  }

  function selectThumb(button) {
    if (!mainImage) return;

    const thumbImg = button.querySelector('img');
    if (!thumbImg) return;

    const alt = button.dataset.alt || mainImage.alt;
    const src = thumbImg.currentSrc || thumbImg.src;

    if (button.classList.contains('product-card__thumb--active')) {
      return;
    }

    thumbButtons.forEach(function (thumb) {
      thumb.classList.remove('product-card__thumb--active');
      thumb.removeAttribute('aria-current');
    });

    button.classList.add('product-card__thumb--active');
    button.setAttribute('aria-current', 'true');

    mainImage.classList.add('product-card__image--fade');

    window.setTimeout(function () {
      mainImage.src = src;
      mainImage.alt = alt;

      if (lightboxImage) {
        lightboxImage.src = src;
        lightboxImage.alt = alt + ' — увеличенное изображение';
      }

      mainImage.classList.remove('product-card__image--fade');
    }, 120);
  }

  thumbButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      selectThumb(button);
    });
  });

  if (lightbox) {
    if (openLightboxBtn) {
      openLightboxBtn.addEventListener('click', function (event) {
        event.stopPropagation();
        openLightbox();
      });
    }

    if (imageWrap) {
      imageWrap.addEventListener('click', openLightbox);
    }

    lightbox.querySelectorAll('[data-close-lightbox]').forEach(function (el) {
      el.addEventListener('click', closeLightbox);
    });

    lightbox.addEventListener('cancel', function (event) {
      event.preventDefault();
      closeLightbox();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && lightbox.open) {
        closeLightbox();
      }
    });
  }
})();
