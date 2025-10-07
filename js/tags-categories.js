(function() {
  // ================================
  // 核心功能
  // ================================

  /**
   * 处理分类：去重 + 统计数量 + 排序
   * 重复多的分类会排在前面
   * HTML 完全不需要额外属性
   */
  function processCategories() {
    const container = document.querySelector('.category-collage-categories');
    if (!container) return;

    const cards = Array.from(container.children);
    const map = new Map();

    // 去重并统计每个分类出现次数
    cards.forEach(card => {
      const name = card.querySelector('.category-name')?.textContent.trim();
      if (!name) return;

      if (map.has(name)) {
        map.get(name).count += 1;
      } else {
        map.set(name, { card, count: 1, name });
      }
    });

    // 将分类按数量排序，多的在前，'其他' 始终放最后
    const sorted = Array.from(map.values())
      .sort((a, b) => {
        if (a.name === '其他') return 1;        // a 放到后面
        if (b.name === '其他') return -1;       // b 放到后面
        return b.count - a.count;               // 按数量排序
      })
      .map(v => v.card);

    // 清空容器并重新插入
    container.innerHTML = '';
    sorted.forEach(card => container.appendChild(card));

    // 调整 justify-content 根据是否出现水平滚动条
    adjustJustifyContent(container);
  }

  /**
   * 根据容器内容判断是否出现水平滚动条，并调整 justify-content
   * @param {HTMLElement} container 
   */
  function adjustJustifyContent(container) {
    if (!container) return;
    // scrollWidth > clientWidth 表示有水平滚动条
    if (container.scrollWidth > container.clientWidth) {
      container.style.justifyContent = 'flex-start';
    } else {
      container.style.justifyContent = 'center';
    }
  }

  /**
   * 初始化 3D 标签云
   * 使用 TagCanvas 库
   */
  function initTagCloud() {
    const canvas = document.getElementById('tagcanvas');
    const tags = document.getElementById('tag-cloud-tags-3D');
    if (!canvas || !tags) return;

    const container = canvas.parentElement;
    const width = container.offsetWidth;

    // 设置画布大小
    canvas.width = width;
    canvas.height = width * 0.7;

    try {
      // 删除旧的 TagCanvas 实例
      TagCanvas.Delete('tagcanvas');

      // 启动新实例
      TagCanvas.Start('tagcanvas', 'tag-cloud-tags-3D', {
        reverse: true,
        depth: 0.9,
        maxSpeed: 0.07,
        textColour: '#ff6f00',
        shadow: '#ff6f00',
        shadowBlur: 10,
        shadowOffset: [0, 0],
        fadeIn: 1000,
        trail: true,
        trailDuration: 0.8,
        trailFade: true,
        outlineColour: 'transparent',
        wheelZoom: false
      });
    } catch(e) {
      console.log('TagCanvas error:', e);
    }
  }

  // ================================
  // 页面加载与 PJAX 事件
  // ================================
  function onPageReady() {
    // 处理分类排序和对齐
    processCategories();

    // 初始化标签云
    setTimeout(initTagCloud, 50);
  }

  window.addEventListener('load', onPageReady);
  document.addEventListener('pjax:complete', onPageReady);

  // ================================
  // 窗口 resize 事件
  // ================================
  window.addEventListener('resize', () => {
    onPageReady();
    setTimeout(initTagCloud, 100);
  });

})();
