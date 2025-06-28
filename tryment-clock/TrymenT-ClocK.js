const symbols = ['Ⅻ', 'Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ'];
const specialSymbols = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω', '☯'].reverse();

const baseSize = 400; // 基准尺寸，设计稿的大小
let previousScale = 1; // 上一次的缩放比例

function initialize() {
    let clockContainer = document.querySelector('.clock-container');

    if (!clockContainer) {
        clockContainer = document.createElement('div');
        clockContainer.className = 'clock-container';
        clockContainer.style.position = 'fixed';
        clockContainer.style.zIndex = '-6';
        clockContainer.transform = 'translate(-50%, -50%)';

        document.body.appendChild(clockContainer);

        const clockElement = document.createElement('div');
        clockElement.className = 'clock';
        clockContainer.appendChild(clockElement);

        const timeOverlay = document.createElement('div');
        timeOverlay.className = 'clock-time-overlay';
        timeOverlay.id = 'clock-time-overlay';
        timeOverlay.textContent = ''; // 初始为空
        clockContainer.appendChild(timeOverlay);
    }

    window.clock = document.querySelector('.clock-container .clock');

    createClockElements();
    onResize();

    const updateInterval = 5000;
    updateClock(updateInterval, true);
    setInterval(() => updateClock(updateInterval, true), updateInterval / 2);

    console.log('Welcome to Tryment Clock');
}

// 创建时钟元素（清空后重新添加）
function createClockElements() {
    const clock = window.clock;
    if (!clock) return;

    clock.innerHTML = '';

    // 外侧大圆圈
    const borderCircle = document.createElement('div');
    borderCircle.className = 'clock-circle-dial';
    borderCircle.style.position = 'absolute';
    clock.appendChild(borderCircle);

    // 外圈刻度线 60个
    for (let i = 0; i < 60; i++) {
        const tick = document.createElement('div');
        tick.className = 'clock-tick-mark';
        tick.style.position = 'absolute';
        clock.appendChild(tick);
    }

    // 两个实线圆圈
    const innerCircle = document.createElement('div');
    innerCircle.className = 'clock-circle-dial';
    innerCircle.style.position = 'absolute';
    clock.appendChild(innerCircle);

    const outerCircle = document.createElement('div');
    outerCircle.className = 'clock-circle-dial';
    outerCircle.style.position = 'absolute';
    clock.appendChild(outerCircle);

    // 中间刻度线（菱形 + 小刻度）
    for (let i = 0; i < 60; i++) {
        if (i % 5 === 0) {
            const diamond = document.createElement('div');
            diamond.className = (i === 45) ? 'clock-diamond-highlight' : 'clock-diamond';
            diamond.style.position = 'absolute';
            clock.appendChild(diamond);
        } else if (i % 5 === 2) {
            const smallTick = document.createElement('div');
            smallTick.className = 'clock-small-mark';
            smallTick.style.position = 'absolute';
            clock.appendChild(smallTick);
        }
    }

    return createRotatingContainers();
}

function createRotatingContainers() {
    const clock = window.clock;

    const romanContainer = document.createElement('div');
    romanContainer.className = 'rotating-container roman-container';
    romanContainer.style.position = 'absolute';
    romanContainer.style.left = '50%';
    romanContainer.style.top = '50%';
    romanContainer.style.transform = 'translate(-50%, -50%)';
    clock.appendChild(romanContainer);

    const greekContainer = document.createElement('div');
    greekContainer.className = 'rotating-container greek-container';
    greekContainer.style.position = 'absolute';
    greekContainer.style.left = '50%';
    greekContainer.style.top = '50%';
    greekContainer.style.transform = 'translate(-50%, -50%)';
    clock.appendChild(greekContainer);

    createSymbolMarkers(romanContainer, symbols, 130, 30);
    createSpecialSymbolMarkers(greekContainer, specialSymbols, 180, 14.4);

    return { romanContainer, greekContainer };
}

function createSymbolMarkers(container, symbols, radius, angleStep) {
    symbols.forEach((symbol, i) => {
        const marker = document.createElement('div');
        marker.className = 'clock-marker';
        marker.style.position = 'absolute';
        marker.textContent = symbol;
        container.appendChild(marker);
    });
}

function createSpecialSymbolMarkers(container, symbols, radius, angleStep) {
    symbols.forEach(symbol => {
        const marker = document.createElement('div');
        marker.className = 'clock-marker';
        marker.style.position = 'absolute';
        marker.textContent = symbol;

        if (symbol === '☯') {
            marker.className += ' highlight';
        }
        container.appendChild(marker);
    });
}

// ✅ 修改：加入 withAnimation 参数
function updateClock(duration = 0, withAnimation = true) {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const romanContainer = document.querySelector('.roman-container');
    const greekContainer = document.querySelector('.greek-container');
    if (!romanContainer || !greekContainer) return;

    const romanAngle = -90 - (hours * 30 + minutes * 0.5);
    const greekAngle = 270 + (minutes * 6 + seconds * 0.1);

    const durationSeconds = duration / 1000;

    if (withAnimation) {
        [romanContainer, greekContainer].forEach(container => {
            container.style.transition = `transform ${durationSeconds}s linear`;
        });
    } else {
        [romanContainer, greekContainer].forEach(container => {
            container.style.transition = 'none';
        });
    }

    romanContainer.style.transform = `translate(-50%, -50%) rotate(${romanAngle}deg)`;
    greekContainer.style.transform = `translate(-50%, -50%) rotate(${greekAngle}deg)`;
}

// 传入scale后，调整时钟内部所有元素大小和位置，保持居中不改container top/right
function adjustClockSize(scale) {
    const clockContainer = document.querySelector('.clock-container');
    const clock = window.clock;
    if (!clockContainer || !clock) return;

    // clock占满container
    clock.style.width = '100%';
    clock.style.height = '100%';
    clock.style.position = 'relative';

    // 以.clock容器中心为圆心，计算所有元素位置
    const clockWidth = clock.clientWidth;
    const clockHeight = clock.clientHeight;
    const centerX = clockWidth / 2;
    const centerY = clockHeight / 2;

    // 大圆圈
    const borderCircle = clock.querySelector('.clock-circle-dial:nth-child(1)');
    if (borderCircle) {
        const size = 380 * scale;
        borderCircle.style.width = size + 'px';
        borderCircle.style.height = size + 'px';
        borderCircle.style.position = 'absolute';
        borderCircle.style.left = (centerX - size / 2) + 'px';
        borderCircle.style.top = (centerY - size / 2) + 'px';
    }

    // 外圈刻度线
    const ticks = clock.querySelectorAll('.clock-tick-mark');
    for (let i = 0; i < 60; i++) {
        const tick = ticks[i];
        if (!tick) continue;

        const angle = i * 6 * Math.PI / 180;
        const radius = 187 * scale;
        const x = centerX + radius * Math.sin(angle);
        const y = centerY - radius * Math.cos(angle);

        tick.style.width = (0.5 * scale) + 'px';
        tick.style.height = (6 * scale) + 'px';
        tick.style.position = 'absolute';
        tick.style.left = x + 'px';
        tick.style.top = y + 'px';
        tick.style.transformOrigin = 'center center';
        tick.style.transform = `translate(-50%, -50%) rotate(${i * 6}deg)`;
    }

    // 两个实线圆圈
    const circles = clock.querySelectorAll('.clock-circle-dial:not(:first-child)');
    if (circles.length >= 2) {
        const sizes = [281, 301];
        circles.forEach((circle, idx) => {
            const size = sizes[idx] * scale;
            circle.style.width = size + 'px';
            circle.style.height = size + 'px';
            circle.style.position = 'absolute';
            circle.style.left = (centerX - size / 2) + 'px';
            circle.style.top = (centerY - size / 2) + 'px';
        });
    }

    // 内圈刻度线（共12个，起始角度 45°，间隔 30°）
    const smallTicks = clock.querySelectorAll('.clock-small-mark');
    for (let i = 0; i < 12; i++) {
        const tick = smallTicks[i];
        if (!tick) continue;

        const angleDeg = 45 + i * 30; // 从1点和2点之间开始，绕一圈
        const angle = angleDeg * Math.PI / 180;
        const radius = 145.5 * scale;

        const x = centerX + radius * Math.sin(angle);
        const y = centerY - radius * Math.cos(angle);

        tick.style.width = (0.5 * scale) + 'px';
        tick.style.height = (10 * scale) + 'px';
        tick.style.position = 'absolute';
        tick.style.left = x + 'px';
        tick.style.top = y + 'px';
        tick.style.transformOrigin = 'center center';
        tick.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
    }


    // 菱形刻度
    const diamonds = clock.querySelectorAll('.clock-diamond, .clock-diamond-highlight');
    for (let i = 0; i < diamonds.length; i++) {
        const diamond = diamonds[i];
        if (!diamond) continue;

        const angle = i * 30 * Math.PI / 180;
        const radius = 140 * scale;
        const x = centerX + radius * Math.sin(angle);
        const y = centerY - radius * Math.cos(angle);

        diamond.style.width = (8 * scale) + 'px';
        diamond.style.height = (20 * scale) + 'px';
        diamond.style.position = 'absolute';
        diamond.style.left = x + 'px';
        diamond.style.top = y + 'px';
        diamond.style.transformOrigin = 'center center';
        diamond.style.transform = `translate(-50%, -50%) rotate(${i * 30 + 180}deg)`;
    }

    // 旋转容器尺寸和位置
    const romanContainer = clock.querySelector('.roman-container');
    if (romanContainer) {
        const size = 260 * scale;
        romanContainer.style.width = size + 'px';
        romanContainer.style.height = size + 'px';
        romanContainer.style.position = 'absolute';
        romanContainer.style.left = centerX + 'px';
        romanContainer.style.top = centerY + 'px';
        romanContainer.style.transformOrigin = 'center center';
        romanContainer.style.transform = 'translate(-50%, -50%)';
    }

    const greekContainer = clock.querySelector('.greek-container');
    if (greekContainer) {
        const size = 360 * scale;
        greekContainer.style.width = size + 'px';
        greekContainer.style.height = size + 'px';
        greekContainer.style.position = 'absolute';
        greekContainer.style.left = centerX + 'px';
        greekContainer.style.top = centerY + 'px';
        greekContainer.style.transformOrigin = 'center center';
        greekContainer.style.transform = 'translate(-50%, -50%)';
    }

    // 罗马数字字体和位置
    if (romanContainer) {
        const romanMarkers = romanContainer.querySelectorAll('.clock-marker');
        romanMarkers.forEach((marker, i) => {
            const angleStep = 30;
            const radius = 130 * scale;
            const angle = i * angleStep * Math.PI / 180;

            const x = radius * Math.sin(angle) + radius;
            const y = radius - radius * Math.cos(angle);

            marker.style.fontSize = (24 * scale) + 'px';
            marker.style.width = (40 * scale) + 'px';
            marker.style.position = 'absolute';
            marker.style.textAlign = 'center';
            marker.style.left = (x - 20 * scale) + 'px';
            marker.style.top = (y - 12 * scale) + 'px';
            marker.style.transform = `rotate(${i * angleStep}deg)`;
            marker.style.transformOrigin = `${20 * scale}px ${12 * scale}px`;
        });
    }

    // 希腊字母字体和位置
    if (greekContainer) {
        const greekMarkers = greekContainer.querySelectorAll('.clock-marker');
        greekMarkers.forEach((marker, i) => {
            const angleStep = 14.4;
            const radius = 180 * scale;
            const angle = i * angleStep * Math.PI / 180;

            const x = radius * Math.sin(angle) + radius;
            const y = radius - radius * Math.cos(angle);

            marker.style.fontSize = (24 * scale) + 'px';
            marker.style.width = (40 * scale) + 'px';
            marker.style.position = 'absolute';
            marker.style.textAlign = 'center';
            marker.style.left = (x - 20 * scale) + 'px';
            marker.style.top = (y - 12 * scale) + 'px';
            marker.style.transform = `rotate(${i * angleStep}deg)`;
            marker.style.transformOrigin = `${20 * scale}px ${12 * scale}px`;

            if (marker.textContent === '') {
                marker.querySelectorAll('span').forEach(span => {
                    span.style.fontSize = (24 * scale) + 'px';
                });
            }
        });
    }

    // 更新时间覆盖层
    const timeOverlay = document.getElementById('clock-time-overlay');
    if (timeOverlay) {
        timeOverlay.style.fontSize = (55 * scale) + 'px';
        timeOverlay.style.position = 'absolute';
    }
}

function onResize() {
    const container = document.querySelector('.clock-container');
    if (!container) return;

    const windowScale = Math.min(window.innerHeight / 210, window.innerHeight / 180);

    if (windowScale === previousScale) return; // 如果缩放比例没有变化，则不更新
    adjustClockSize(windowScale);
    previousScale = windowScale;

    // ✅ resize 之后更新角度，但不要动画
    updateClock(0, false);
}

document.addEventListener('DOMContentLoaded', initialize);
window.addEventListener('resize', onResize);
