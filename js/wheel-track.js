(function() {
  let startY = 0;       // 触屏开始的 Y 坐标
  let startOffset = 0;  // 触屏开始时的 offset
  let resizeObserver = null;
  let lastActiveIndex = -1; // 记录上一次 active track

  function initOsuWheel() {
    const container = document.querySelector('.osu-wheel');
    if (!container) return;

    const tracks = Array.from(container.querySelectorAll('.track'));
    if (!tracks.length) return;

    // ========== 可调参数 ==========
    const spacing = 12;         // 每条条目角度间隔（度数）
    const radius = 300;         // 圆弧半径
    const scrollSpeed = 0.1;    // 滚动速度
    const opacityyFactor = 0.2; // 不透明度衰减因子 (0~1 越大衰减越快)
    const scaleFactor = 1.5;    // 缩放因子
    const offsetX = 0;          // X 轴偏移（正值向右，负值向左）
    // =============================

    let offset = 0;
    let targetOffset = offset;
    let snapTimer = null;

    // 初始化 track 样式
    tracks.forEach(track => {
      track.style.position = 'absolute';
      track.style.left = '0';
      track.style.top = '0';
      track.style.transformOrigin = 'left center';
    });

    // 获取容器尺寸
    function getDimensions() {
      return { width: container.clientWidth, height: container.clientHeight };
    }

    // 渲染函数
    function render() {
      const { width, height } = getDimensions();
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
        const angle = diff * spacing;
        const rad = angle * Math.PI / 180;

        const x = offsetX + Math.cos(rad) * radius - radius;
        const y = centerY - track.offsetHeight / 2 + Math.sin(rad) * radius;

        const scale = i === activeIndex ? scaleFactor : Math.max(0, 1 - Math.abs(diff) * 0.1);
        const opacity = i === activeIndex ? 1 : Math.max(0, 1 - Math.abs(diff) * opacityyFactor);

        track.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        track.style.opacity = opacity;
        track.classList.toggle('active', i === activeIndex);
      });

      // 只在 active track 变化时更新右侧内容
      if (activeIndex !== lastActiveIndex) {
        lastActiveIndex = activeIndex;

        if (detail && detailTitle && detailDesc) {
          const activeTrack = tracks[activeIndex];
          if (!activeTrack) return;

          // 先淡出
          detail.classList.add('fade-out');

          // 0.2s 后更新内容再淡入
          setTimeout(() => {
            // 更新内容
            if (detailTitle) detailTitle.textContent = activeTrack.dataset.title || '';
            if (detailDesc) detailDesc.innerHTML = activeTrack.dataset.description || '';
            if (detailCover) detailCover.src = activeTrack.dataset.cover || '';
            if (detailMeta) detailMeta.innerHTML = activeTrack.querySelector('.track-meta-html')?.innerHTML || '';
            if (detailLink) detailLink.href = activeTrack.dataset.link || '#';

            // 淡入
            detail.classList.remove('fade-out');
          }, 200);
        }
      }
    }

    // 滚轮控制
    container.addEventListener('wheel', e => {
      e.preventDefault();
      targetOffset += Math.sign(e.deltaY) * scrollSpeed;
      targetOffset = Math.max(0, Math.min(tracks.length - 1, targetOffset));

      if (snapTimer) clearTimeout(snapTimer);
      snapTimer = setTimeout(() => {
        targetOffset = Math.round(targetOffset);
      }, 150);
    }, { passive: false });

    // 触屏开始
    container.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) return;
      startY = e.touches[0].clientY;
      startOffset = targetOffset;

      if (snapTimer) clearTimeout(snapTimer);
    }, { passive: true });

    // 触屏移动
    container.addEventListener('touchmove', e => {
      if (e.touches.length !== 1) return;
      e.preventDefault(); // 阻止页面滚动

      const deltaY = e.touches[0].clientY - startY;
      const moveFactor = 0.05; // 可调，越大滑动越快
      targetOffset = startOffset - deltaY * moveFactor;

      targetOffset = Math.max(0, Math.min(tracks.length - 1, targetOffset));
    }, { passive: false });

    // 触屏结束，自动吸附到最近 track
    container.addEventListener('touchend', e => {
      snapTimer = setTimeout(() => {
        targetOffset = Math.round(targetOffset);
      }, 150);
    });

    // 动画循环
    function animate() {
      offset += (targetOffset - offset) * 0.15;
      render();
      requestAnimationFrame(animate);
    }

    animate();

    // ResizeObserver
    if (resizeObserver) resizeObserver.disconnect(); // 防止重复绑定
    resizeObserver = new ResizeObserver(() => render());
    resizeObserver.observe(container);

    // 首次渲染
    render();
  }

  // 第一次初始化
  window.addEventListener('load', initOsuWheel);

  // PJAX 页面切换完成时再次初始化
  document.addEventListener('pjax:complete', initOsuWheel);

})();
