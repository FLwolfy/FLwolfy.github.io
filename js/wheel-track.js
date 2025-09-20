(function() {
  // ================================
  // 配置参数
  // ================================
  const CONFIG = {
    activeZIndex: 10,     // 激活条目的 z-index
    spacing: 12,          // 每条条目角度间隔（度数）
    radius: 300,          // 圆弧半径
    scrollSpeed: 0.1,     // 鼠标滚轮灵敏度
    touchMoveFactor: 0.05,// 触屏/拖拽灵敏度
    opacityFactor: 0.2,   // 不透明度衰减因子
    scaleFactor: 1.5,     // 激活条目的缩放比例
    offsetX: 0,           // X 轴偏移
    snapDelay: 150,       // 自动吸附延迟（ms）
    detailFadeDelay: 200  // detail 区淡出延迟（ms）
  };

  // ================================
  // 内部状态
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

  // ================================
  // 主初始化函数
  // ================================
  function initOsuWheel() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (snapTimer) clearTimeout(snapTimer);
    if (detailTimer) clearTimeout(detailTimer);
    if (resizeObserver) resizeObserver.disconnect();
    lastActiveIndex = -1;

    const container = document.querySelector('.osu-wheel');
    if (!container) return;

    const tracks = Array.from(container.querySelectorAll('.track'));
    if (!tracks.length) return;

    let offset = 0;
    let targetOffset = 0;

    // 初始化 track 样式
    tracks.forEach(track => {
      track.style.position = 'absolute';
      track.style.left = '0';
      track.style.top = '0';
      track.style.transformOrigin = 'left center';
    });

    function getDimensions() {
      return { width: container.clientWidth, height: container.clientHeight };
    }

    // ===========================
    // 自动吸附函数
    // ===========================
    function startSnapTimer() {
      if (snapTimer) clearTimeout(snapTimer);
      snapTimer = setTimeout(() => {
        targetOffset = Math.round(targetOffset);
      }, CONFIG.snapDelay);
    }

    // ================================
    // 渲染函数
    // ================================
    function render() {
      const { height } = getDimensions();
      const centerY = height / 2;
      const activeIndex = Math.round(offset);

      const detail = document.querySelector('.track-detail');
      const detailCover = detail?.querySelector('.track-cover img');
      const detailTitle = detail?.querySelector('.track-title');
      const detailDesc  = detail?.querySelector('.track-description');
      const detailMeta  = detail?.querySelector('.track-meta');
      const detailLink  = detail?.querySelector('.track-readmore');

      tracks.forEach((track, i) => {
        const diff = offset - i;
        const angle = diff * CONFIG.spacing;
        const rad = angle * Math.PI / 180;

        const x = CONFIG.offsetX + Math.cos(rad) * CONFIG.radius - CONFIG.radius;
        const y = centerY - track.offsetHeight / 2 + Math.sin(rad) * CONFIG.radius;

        const scale = i === activeIndex ? CONFIG.scaleFactor : Math.max(0, 1 - Math.abs(diff) * 0.1);
        const opacity = i === activeIndex ? 1 : Math.max(0, 1 - Math.abs(diff) * CONFIG.opacityFactor);

        track.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        track.style.opacity = opacity;
        track.classList.toggle('active', i === activeIndex);

        // 距离越远 z-index 越低，保证有层次感
        if (i !== activeIndex) {
          const distance = Math.abs(diff);
          track.style.zIndex = Math.round(CONFIG.activeZIndex - distance);
        } else {
          track.style.zIndex = CONFIG.activeZIndex;
        }
      });

      // 更新右侧 detail 区
      if (activeIndex !== lastActiveIndex) {
        lastActiveIndex = activeIndex;
        if (detail && detailTitle && detailDesc && detailCover && detailMeta && detailLink) {
          const activeTrack = tracks[activeIndex];
          if (!activeTrack) return;

          // 淡出
          detail.classList.remove('fade-in');
          detail.classList.add('fade-out');

          if (detailTimer) clearTimeout(detailTimer);
          detailTimer = setTimeout(() => {
            detailTitle.textContent = activeTrack.dataset.title || '';
            detailDesc.innerHTML    = activeTrack.dataset.description || '';
            detailCover.src         = activeTrack.dataset.cover || '';
            detailMeta.innerHTML    = activeTrack.querySelector('.track-meta-html')?.innerHTML || '';
            detailLink.href         = activeTrack.dataset.link || '#';

            detail.classList.remove('fade-out');
            detail.classList.add('fade-in');
          }, CONFIG.detailFadeDelay);
        }
      }
    }

    // ===========================
    // 鼠标滚轮
    // ===========================
    container.addEventListener('wheel', e => {
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
    }, { passive: false });

    // ===========================
    // 触屏拖动
    // ===========================
    container.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) return;
      const trackEl = e.target.closest('.track');
      if (!trackEl) return;

      isTouchDragging = true;
      startY = e.touches[0].clientY;
      startOffset = targetOffset;
      if (snapTimer) clearTimeout(snapTimer);
    }, { passive: true });

    container.addEventListener('touchmove', e => {
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
    }, { passive: false });

    container.addEventListener('touchend', () => {
      if (!isTouchDragging) return;
      isTouchDragging = false;
      startSnapTimer();
    });

    // ================================
    // 点击 track 激活
    // ================================
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

    // ================================
    // 动画循环（只 rAF + 简单插值）
    // ================================
    function animate() {
      offset += (targetOffset - offset) * 0.15;
      render();
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    // 首次渲染 detail
    render();
  }

  // 页面加载 / PJAX 切换
  window.addEventListener('load', initOsuWheel);
  document.addEventListener('pjax:complete', initOsuWheel);

})();
