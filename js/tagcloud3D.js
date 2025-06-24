function initTagCloud() {
  const canvas = document.getElementById('tagcanvas');
  const tags = document.getElementById('tag-cloud-tags-3D');
  if (!canvas || !tags) return;

  const container = canvas.parentElement;
  const width = container.offsetWidth;
  canvas.width = width;
  canvas.height = width * 0.7;

  try {
    TagCanvas.Delete('tagcanvas');
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

// 绑定事件，兼容 pjax 和 resize
window.addEventListener('load', () => setTimeout(initTagCloud, 50));
document.addEventListener('pjax:end', () => setTimeout(initTagCloud, 50));
window.addEventListener('resize', () => setTimeout(initTagCloud, 100));
