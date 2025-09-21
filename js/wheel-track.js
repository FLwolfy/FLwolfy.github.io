(function() {
  // ================================
  // 配置参数
  // ================================
  const CONFIG = {
    activeZIndex: 10,      // 激活条目的 z-index
    spacing: 12,           // 每条条目角度间隔（度数）
    radius: 300,           // 圆弧半径
    scrollSpeed: 0.1,      // 鼠标滚轮灵敏度
    touchMoveFactor: 0.05, // 触屏/拖拽灵敏度
    opacityFactor: 0.2,    // 不透明度衰减因子
    scaleFactor: 1.5,      // 激活条目的缩放比例
    offsetX: 0,            // X 轴偏移
    snapDelay: 150,        // 自动吸附延迟（ms）
    detailFadeDelay: 200   // detail 区淡出延迟（ms）
  };

  // ================================
  // 内部状态变量
  // ================================
  let startY = 0;
  let startOffset = 0;
  let resizeObserver = null;
  let lastActiveIndex = -1;
  let animationFrameId = null;
  let snapTimer = null;
  let detailTimer = null;

  let isTouchDragging = false;
  let wheelTicking = false;
  let touchTicking = false;

  let container = null;
  let tracks = [];
  let offset = 0;
  let targetOffset = 0;

  // ================================
  // DOM 查询 / IO 操作
  // ================================
  function getContainer() {
    return document.querySelector('.osu-wheel');
  }

  function getDetailElements() {
    const detail = document.querySelector('.track-detail');
    return detail ? {
      detail,
      cover: detail.querySelector('.track-cover img'),
      title: detail.querySelector('.track-info-title'),
      description: detail.querySelector('.track-info-description'),
      meta: detail.querySelector('.track-info-meta'),
      link: detail.querySelector('.track-info-readmore')
    } : null;
  }

  // ================================
  // 容器尺寸
  // ================================
  function getDimensions() {
    return { width: container.clientWidth, height: container.clientHeight };
  }

  // ================================
  // 初始化 track 样式
  // ================================
  function initTrackStyles() {
    tracks.forEach(track => {
      track.style.position = 'absolute';
      track.style.left = '0';
      track.style.top = '0';
      track.style.transformOrigin = 'left center';
      track.dataset.height = track.offsetHeight;
    });
  }

  // ================================
  // 监听 track 高度变化
  // ================================
  function observeTrackHeights() {
    resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        entry.target.dataset.height = entry.target.offsetHeight;
      }
    });
    tracks.forEach(track => resizeObserver.observe(track));
  }

  // ================================
  // 自动吸附函数
  // ================================
  function startSnapTimer() {
    if (snapTimer) clearTimeout(snapTimer);
    snapTimer = setTimeout(() => {
      targetOffset = Math.round(targetOffset);
    }, CONFIG.snapDelay);
  }

  // ================================
  // 更新右侧 detail 区内容
  // ================================
  function updateDetail(activeTrack) {
    const elems = getDetailElements();
    if (!elems || !activeTrack) return;

    const { detail, cover, title, description, meta, link } = elems;

    detail.classList.remove('fade-in');
    detail.classList.add('fade-out');

    if (detailTimer) clearTimeout(detailTimer);
    detailTimer = setTimeout(() => {
      if (title.textContent !== activeTrack.dataset.title) title.textContent = activeTrack.dataset.title || '';
      if (description.innerHTML !== activeTrack.dataset.description) description.innerHTML = activeTrack.dataset.description || '';
      if (cover.src !== activeTrack.dataset.cover) cover.src = activeTrack.dataset.cover || '';
      if (meta.innerHTML !== activeTrack.querySelector('.track-meta-html')?.innerHTML) {
        meta.innerHTML = activeTrack.querySelector('.track-meta-html')?.innerHTML || '';
      }
      if (link.href !== activeTrack.dataset.link) link.href = activeTrack.dataset.link || '#';

      detail.classList.remove('fade-out');
      detail.classList.add('fade-in');
    }, CONFIG.detailFadeDelay);
  }

  // ================================
  // 渲染函数：位置、缩放、透明度
  // ================================
  function render() {
    const { height } = getDimensions();
    const centerY = height / 2;
    const activeIndex = Math.round(offset);

    tracks.forEach((track, i) => {
      const diff = offset - i;
      const angle = diff * CONFIG.spacing;
      const rad = angle * Math.PI / 180;

      const x = CONFIG.offsetX + Math.cos(rad) * CONFIG.radius - CONFIG.radius;
      const y = centerY - track.dataset.height / 2 + Math.sin(rad) * CONFIG.radius;

      const scale = i === activeIndex ? CONFIG.scaleFactor : Math.max(0, 1 - Math.abs(diff) * 0.1);
      const opacity = i === activeIndex ? 1 : Math.max(0, 1 - Math.abs(diff) * CONFIG.opacityFactor);

      track.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      track.style.opacity = opacity;
      track.classList.toggle('active', i === activeIndex);
    });

    if (activeIndex !== lastActiveIndex) {
      lastActiveIndex = activeIndex;
      tracks.forEach((track, i) => {
        const distance = Math.abs(activeIndex - i);
        track.style.zIndex = CONFIG.activeZIndex - distance;
      });

      updateDetail(tracks[activeIndex]);
    }
  }

  // ================================
  // 鼠标滚轮事件
  // ================================
  function handleWheel(e) {
    e.preventDefault();
    if (!wheelTicking) {
      wheelTicking = true;
      requestAnimationFrame(() => {
        targetOffset -= Math.sign(e.deltaY) * CONFIG.scrollSpeed;
        targetOffset = Math.max(0, Math.min(tracks.length - 1, targetOffset));
        wheelTicking = false;
        startSnapTimer();
      });
    }
  }

  // ================================
  // 触屏拖动事件
  // ================================
  function handleTouchStart(e) {
    if (e.touches.length !== 1) return;
    const trackEl = e.target.closest('.track');
    if (!trackEl) return;

    isTouchDragging = true;
    startY = e.touches[0].clientY;
    startOffset = targetOffset;
    if (snapTimer) clearTimeout(snapTimer);
  }

  function handleTouchMove(e) {
    if (!isTouchDragging || e.touches.length !== 1) return;
    e.preventDefault();
    if (!touchTicking) {
      touchTicking = true;
      requestAnimationFrame(() => {
        const deltaY = e.touches[0].clientY - startY;
        targetOffset = startOffset + deltaY * CONFIG.touchMoveFactor;
        targetOffset = Math.max(0, Math.min(tracks.length - 1, targetOffset));
        touchTicking = false;
      });
    }
  }

  function handleTouchEnd() {
    if (!isTouchDragging) return;
    isTouchDragging = false;
    startSnapTimer();
  }

  // ================================
  // track 点击 / 触摸激活
  // ================================
  function initTrackInteraction() {
    tracks.forEach((track, i) => {
      let touchMoved = false;
      track.addEventListener('click', () => targetOffset = i);
      track.addEventListener('touchstart', () => touchMoved = false, { passive: true });
      track.addEventListener('touchmove', () => touchMoved = true, { passive: true });
      track.addEventListener('touchend', e => {
        if (!touchMoved) {
          e.preventDefault();
          targetOffset = i;
        }
      });
    });
  }

  // ================================
  // 动画循环
  // ================================
  function animate() {
    offset += (targetOffset - offset) * 0.15;
    render();
    animationFrameId = requestAnimationFrame(animate);
  }

  // ================================
  // 主初始化函数
  // ================================
  function initOsuWheel() {
    // 清理旧状态
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (snapTimer) clearTimeout(snapTimer);
    if (detailTimer) clearTimeout(detailTimer);
    if (resizeObserver) resizeObserver.disconnect();
    lastActiveIndex = -1;

    container = getContainer();
    if (!container) return;

    tracks = Array.from(container.querySelectorAll('.track'))
      .sort((a, b) => new Date(b.dataset.created).getTime() - new Date(a.dataset.created).getTime());
    if (!tracks.length) return;

    offset = 0;
    targetOffset = 0;

    initTrackStyles();
    observeTrackHeights();

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    initTrackInteraction();

    animate();
    render();
  }

  // ================================
  // 页面加载 / PJAX 切换
  // ================================
  window.addEventListener('load', initOsuWheel);
  document.addEventListener('pjax:complete', initOsuWheel);

})();
