function initTagCloud() {
  const canvas = document.getElementById('tagcanvas');
  const tags = document.getElementById('tagcloud-raw');
  if (!canvas || !tags) return;

  const container = canvas.parentElement;
  const width = container.offsetWidth;
  canvas.width = width;
  canvas.height = width * 0.7;

  // 设置标签字体颜色为荧光橘色，带发光阴影
  tags.querySelectorAll('a.tag-cloud').forEach(tag => {
    tag.style.fontWeight = 'bold';
    tag.style.color = '#ff6f00';  // 荧光橘色
    tag.style.textShadow = '0 0 8px #ff6f00, 0 0 12px #ff9900';
  });

  try {
    TagCanvas.Delete('tagcanvas');
    TagCanvas.Start('tagcanvas', 'tagcloud-raw', {
      reverse: true,
      depth: 0.9,
      maxSpeed: 0.07,
      weight: true,
      weightSizeMin: 20,
      weightSizeMax: 60,
      weightMode: 'size',
      weightFrom: 'data-weight',
      wheelZoom: false,
      textColour: '#ff6f00',    // 全局字体颜色（备用）
      shadow: '#ff6f00',
      shadowBlur: 10,
      shadowOffset: [0, 0],
      fadeIn: 1000,
      trail: true,
      trailDuration: 0.8,
      trailFade: true,
    });
  } catch(e) {
    console.log('TagCanvas error:', e);
  }
}

// 绑定事件，兼容 pjax 和 resize
window.addEventListener('load', () => setTimeout(initTagCloud, 50));
document.addEventListener('pjax:end', () => setTimeout(initTagCloud, 50));
window.addEventListener('resize', () => setTimeout(initTagCloud, 100));
