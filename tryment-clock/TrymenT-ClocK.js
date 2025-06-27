///////////////////////////////////////////////////////////////////////////////////////////////
/////////// 源代码来自：https://github.com/Tokisaki-Galaxy/TrymenT-ClocK/tree/master ///////////
/////////////////////////// 原作者：Tokisaki-Galaxy || 修改：FLwolfy ///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

const symbols = ['Ⅻ', 'Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ'];
const specialSymbols = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω', 'OVERLAY_CHAR'].reverse();

// 初始化函数
function initialize() {
    // 创建或获取时钟容器
    let clockContainer = document.querySelector('.clock-container');
    if (!clockContainer) {
        clockContainer = document.createElement('div');
        clockContainer.className = 'clock-container';
        document.body.appendChild(clockContainer);

        // 创建时钟元素
        const clockElement = document.createElement('div');
        clockElement.className = 'clock';
        clockContainer.appendChild(clockElement);

        // 添加数字时间显示
        const timeOverlay = document.createElement('div');
        timeOverlay.className = 'clock-time-overlay';
        timeOverlay.id = 'clock-time-overlay';
        timeOverlay.textContent = ''; // 初始为空
        clockContainer.appendChild(timeOverlay);
    }

    // 强制重新获取clock元素
    window.clock = document.querySelector('.clock-container .clock');

    createClockElements();
    adjustClockSize();

    const updateInterval = 5000; // 每5秒更新一次
    updateClock(updateInterval); // 初始更新
    setInterval(() => updateClock(updateInterval), updateInterval / 2);

    // 确保时钟容器在背景层
    clockContainer.style.position = 'fixed';
    clockContainer.style.zIndex = '-10';
    clockContainer.style.width = '400px';
    clockContainer.style.height = '400px';
    clockContainer.style.transformOrigin = '50% 50%';

    console.log('Welcome to Tryment Clock');
}

// 创建时钟元素的函数
function createClockElements() {
    // 外侧大圆圈
    const borderCircle = document.createElement('div');
    borderCircle.className = 'clock-circle-dial';
    borderCircle.style.position = 'absolute';
    borderCircle.style.width = '380px';
    borderCircle.style.height = '380px';
    clock.appendChild(borderCircle);

    // 添加外圈刻度线
    for (let i = 0; i < 60; i++) {
        const angle = i * 6 * (Math.PI / 180);
        const x = 184 * Math.sin(angle) + 200;
        const y = -184 * Math.cos(angle) + 200;

        const tick = document.createElement('div');
        tick.className = 'clock-tick-mark';
        tick.style.position = 'absolute';
        tick.style.width = '0.5px';
        tick.style.height = '6px';
        tick.style.left = `${x}px`;
        tick.style.top = `${y}px`;
        tick.style.transform = `translate(-50%, -100%) rotate(${i * 6}deg)`;
        clock.appendChild(tick);
    }

    // 添加两个实线圆圈（夹住中间刻度线）
    // 圆圈1 - 位于罗马数字和内圈刻度线之间
    const innerCircle = document.createElement('div');
    innerCircle.className = 'clock-circle-dial';
    innerCircle.style.position = 'absolute';
    innerCircle.style.width = '281px';
    innerCircle.style.height = '281px';
    clock.appendChild(innerCircle);

    // 圆圈2 - 位于希腊字母和内圈刻度线之间
    const outerCircle = document.createElement('div');
    outerCircle.className = 'clock-circle-dial';
    outerCircle.style.position = 'absolute';
    outerCircle.style.width = '301px';
    outerCircle.style.height = '301px';
    clock.appendChild(outerCircle);

    // 添加中间刻度线，绿色棱形
    // 垂直于中心刻度线 (内圈，介于罗马数字和希腊字母之间)
    for (let i = 0; i < 60; i++) {
        const angle = i * 6 * (Math.PI / 180);
        const x = 140 * Math.sin(angle) + 200;
        const y = -140 * Math.cos(angle) + 200;

        if (i % 5 === 0) {
            // 对于每5分钟的刻度，使用棱形
            const diamond = document.createElement('div');
            diamond.className = (i === 45) ? 'clock-diamond-highlight' : 'clock-diamond';
            diamond.style.position = 'absolute';
            diamond.style.width = '8px';
            diamond.style.height = '20px';
            diamond.style.left = `${x}px`;
            diamond.style.top = `${y}px`;
            diamond.style.transform = `translate(-50%, -50%) rotate(${i * 6 + 180}deg)`;
            diamond.style.transformOrigin = '50% 50%';
            diamond.style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'; // 棱形形状
            clock.appendChild(diamond);
        } else {
            // 对于其他刻度，保持原有的线条样式
            const tick = document.createElement('div');
            tick.className = 'clock-tick-mark';
            tick.style.position = 'absolute';
            tick.style.width = '0.5px';
            tick.style.height = '9.5px'; // 所有非5分钟刻度统一使用小刻度
            tick.style.left = `${x}px`;
            tick.style.top = `${y}px`;
            tick.style.transform = `translate(-50%, -100%) rotate(${i * 6}deg)`;
            clock.appendChild(tick);
        }
    }

    return createRotatingContainers();
}

// 创建旋转容器
function createRotatingContainers() {
    // 创建两个可旋转的容器
    const romanContainer = document.createElement('div');
    romanContainer.className = 'rotating-container roman-container';
    romanContainer.style.position = 'absolute';
    romanContainer.style.width = '260px';
    romanContainer.style.height = '260px';
    romanContainer.style.left = '50%';
    romanContainer.style.top = '50%';
    romanContainer.style.transform = 'translate(-50%, -50%)';
    clock.appendChild(romanContainer);

    const greekContainer = document.createElement('div');
    greekContainer.className = 'rotating-container greek-container';
    greekContainer.style.position = 'absolute';
    greekContainer.style.width = '360px';
    greekContainer.style.height = '360px';
    greekContainer.style.left = '50%';
    greekContainer.style.top = '50%';
    greekContainer.style.transform = 'translate(-50%, -50%)';
    clock.appendChild(greekContainer);

    // 创建罗马数字标记
    createSymbolMarkers(romanContainer, symbols, 130, 30);

    // 创建希腊字母标记
    createSpecialSymbolMarkers(greekContainer, specialSymbols, 180, 14.4);

    return { romanContainer, greekContainer };
}

// 创建符号标记
function createSymbolMarkers(container, symbols, radius, angleStep) {
    symbols.forEach((symbol, i) => {
        const angle = i * angleStep * (Math.PI / 180);
        const x = radius * Math.sin(angle) + radius;
        const y = -radius * Math.cos(angle) + radius;

        const marker = document.createElement('div');
        marker.className = 'clock-marker';
        marker.textContent = symbol;
        marker.style.width = '40px';
        marker.style.fontSize = '24px';
        marker.style.position = 'absolute';
        marker.style.left = `${x - 20}px`;
        marker.style.top = `${y - 12}px`;
        marker.style.transform = `rotate(${i * angleStep}deg)`;
        marker.style.transformOrigin = '20px 12px';
        container.appendChild(marker);
    });
}

// 创建特殊符号标记（希腊字母）
function createSpecialSymbolMarkers(container, symbols, radius, angleStep) {
    symbols.forEach((symbol, i) => {
        const angle = i * angleStep * (Math.PI / 180);
        const x = radius * Math.sin(angle) + radius;
        const y = -radius * Math.cos(angle) + radius;

        const marker = document.createElement('div');
        marker.className = 'clock-marker';
        marker.style.position = 'absolute';
        marker.style.width = '40px';
        marker.style.fontSize = '24px';
        marker.style.left = `${x - 20}px`;
        marker.style.top = `${y - 12}px`;
        marker.style.transform = `rotate(${i * angleStep}deg)`;
        marker.style.transformOrigin = '20px 12px';

        // 特殊处理最后一个叠加字符
        if (symbol === 'OVERLAY_CHAR') {
            marker.style.width = '40px';
            marker.style.height = '24px';
            marker.style.display = 'flex';
            marker.style.justifyContent = 'center';
            marker.style.alignItems = 'center';

            // 创建十字符号
            const cross = document.createElement('span');
            cross.textContent = '☩';
            cross.style.position = 'absolute';
            cross.style.fontSize = '24px';
            cross.style.zIndex = '2';
            cross.style.top = '-2px';

            // 创建数字0
            const zero = document.createElement('span');
            zero.textContent = '◯';
            zero.style.position = 'absolute';
            zero.style.fontSize = '24px';
            zero.style.zIndex = '1';
            zero.style.top = '-2px';

            // 添加到叠加容器
            marker.appendChild(cross);
            marker.appendChild(zero);
        } else {
            marker.textContent = symbol;
        }

        container.appendChild(marker);
    });
}

function updateClock(duration = 0) {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // 获取旋转容器
    const romanContainer = document.querySelector('.roman-container');
    const greekContainer = document.querySelector('.greek-container');

    // 计算旋转角度
    // 最左边是指示器，所以加270。旋转方向需要是顺时针的，所以加负号
    // 外圈分钟，内圈小时
    const romanAngle = 270 - (hours * 30 + minutes * 0.5);
    const greekAngle = 270 + (minutes * 6 + seconds * 0.1);

    // 设置动态过渡时长（单位：秒）
    const durationSeconds = duration / 1000;

    [romanContainer, greekContainer].forEach(container => {
        container.style.transition = `transform ${durationSeconds}s linear`;
    });

    // 应用旋转角度
    romanContainer.style.transform = `translate(-50%, -50%) rotate(${romanAngle}deg)`;
    greekContainer.style.transform = `translate(-50%, -50%) rotate(${greekAngle}deg)`;
}

// 获取当前屏幕尺寸
function adjustClockSize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 根据窗口大小计算缩放比例
    const scale = Math.min(windowWidth / 250, windowHeight / 200);
    globalScale = scale; // 如果你需要别处使用

    const clockContainer = document.querySelector('.clock-container');
    clockContainer.style.transform = `scale(${scale})`;

    // 设置子元素的宽高并移动元素
    setupClockContainer(clockContainer);
}


// 设置时钟容器
function setupClockContainer(clockContainer) {
    // 如果时钟容器内已有clock元素则不添加
    if (!document.getElementById('clock')) {
        const clock = document.createElement('div');
        clock.id = 'clock';
        clock.style.width = '100%';
        clock.style.height = '100%';
        clock.style.position = 'relative';

        clockContainer.appendChild(clock);

        // 移动所有时钟元素到新的clock元素中
        const elements = document.querySelectorAll('.clock-container > div:not(#clock)');
        elements.forEach(el => {
            clock.appendChild(el);
        });
    }
}

// 在页面加载完成后
document.addEventListener('DOMContentLoaded', initialize);

// 窗口大小改变时重新调整
window.addEventListener('resize', adjustClockSize);