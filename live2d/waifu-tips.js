(() => {
    function g(e) {
        return Array.isArray(e) ? e[Math.floor(Math.random() * e.length)] : e
    }

    function L(e) {
        let o = document.createElement("a"),
            t = window.URL.createObjectURL(e);
        o.href = t, o.download = "live2d.png", o.click(), URL.revokeObjectURL(t)
    }
    var p;

    function D(e, o, t) {
        if (!e || sessionStorage.getItem("waifu-text") && sessionStorage.getItem("waifu-text") > t) return;
        p && (clearTimeout(p), p = null), e = g(e), sessionStorage.setItem("waifu-text", t);
        let c = document.getElementById("waifu-tips");
        c.innerHTML = e, c.classList.add("waifu-tips-active"), p = setTimeout(() => {
            sessionStorage.removeItem("waifu-text"), c.classList.remove("waifu-tips-active")
        }, o)
    }
    var a = D;
    var v = class {
            constructor(o) {
                let {
                    cdnPath: t,
                    switchType: c
                } = o;
                this.cdnPath = t, this.isOrderSwitch = c === "order"
            }
            async loadModelList() {
                let o = await fetch(`${this.cdnPath}model_list.json`);
                this.modelList = await o.json(), console.log()
            }
            async loadModel(o, t, c) {
                localStorage.setItem("modelId", o), localStorage.setItem("modelTexturesId", t), this.modelList || await this.loadModelList(), a(c, 4e3, 10);
                let s = this.modelList.models[o][t];
                if (s === void 0) {
                    if (parseInt(o) === 0 && parseInt(t) === 0) return;
                    await this.loadModel(0, 0, this.modelList.messages[0][0]);
                    return
                }
                window.live2d.loadModel(`${this.cdnPath}model/` + s + "/")
            }
            async switchTextures() {
                let o = localStorage.getItem("modelId"),
                    t = parseInt(localStorage.getItem("modelTexturesId"));
                this.modelList || await this.loadModelList();
                let c = this.modelList.models[o].length;
                if (this.isOrderSwitch) t = (t + 1) % c;
                else {
                    let s;
                    do s = Math.floor(Math.random() * c); while (s === t);
                    t = s
                }
                this.loadModel(o, t, this.modelList.messages[o][t])
            }
            async switchModel() {
                let o = localStorage.getItem("modelId");
                this.modelList || await this.loadModelList();
                let t = ++o >= this.modelList.models.length ? 0 : o;
                this.loadModel(t, 0, this.modelList.messages[t][0])
            }
        },
        I = v;
    var y = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/></svg>';
    var M = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L277.3 424.9l-40.1 74.5c-5.2 9.7-16.3 14.6-27 11.9S192 499 192 488V392c0-5.3 1.8-10.5 5.1-14.7L362.4 164.7c2.5-7.1-6.5-14.3-13-8.4L170.4 318.2l-32 28.9 0 0c-9.2 8.3-22.3 10.6-33.8 5.8l-85-35.4C8.4 312.8 .8 302.2 .1 290s5.5-23.7 16.1-29.8l448-256c10.7-6.1 23.9-5.5 34 1.4z"/></svg>';
    var S = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 272c39.8 0 72-32.2 72-72s-32.2-72-72-72s-72 32.2-72 72s32.2 72 72 72z"/></svg>';
    var x = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M320 64c0-35.3-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64s64-28.7 64-64zm-96 96c-35.3 0-64 28.7-64 64v48c0 17.7 14.3 32 32 32h1.8l11.1 99.5c1.8 16.2 15.5 28.5 31.8 28.5h38.7c16.3 0 30-12.3 31.8-28.5L318.2 304H320c17.7 0 32-14.3 32-32V224c0-35.3-28.7-64-64-64H224zM132.3 394.2c13-2.4 21.7-14.9 19.3-27.9s-14.9-21.7-27.9-19.3c-32.4 5.9-60.9 14.2-82 24.8c-10.5 5.3-20.3 11.7-27.8 19.6C6.4 399.5 0 410.5 0 424c0 21.4 15.5 36.1 29.1 45c14.7 9.6 34.3 17.3 56.4 23.4C130.2 504.7 190.4 512 256 512s125.8-7.3 170.4-19.6c22.1-6.1 41.8-13.8 56.4-23.4c13.7-8.9 29.1-23.6 29.1-45c0-13.5-6.4-24.5-14-32.6c-7.5-7.9-17.3-14.3-27.8-19.6c-21-10.6-49.5-18.9-82-24.8c-13-2.4-25.5 6.3-27.9 19.3s6.3 25.5 19.3 27.9c30.2 5.5 53.7 12.8 69 20.5c3.2 1.6 5.8 3.1 7.9 4.5c3.6 2.4 3.6 7.2 0 9.6c-8.8 5.7-23.1 11.8-43 17.3C374.3 457 318.5 464 256 464s-118.3-7-157.7-17.9c-19.9-5.5-34.2-11.6-43-17.3c-3.6-2.4-3.6-7.2 0-9.6c2.1-1.4 4.8-2.9 7.9-4.5c15.3-7.7 38.8-14.9 69-20.5z"/></svg>';
    var C = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM164.1 325.5C182 346.2 212.6 368 256 368s74-21.8 91.9-42.5c5.8-6.7 15.9-7.4 22.6-1.6s7.4 15.9 1.6 22.6C349.8 372.1 311.1 400 256 400s-93.8-27.9-116.1-53.5c-5.8-6.7-5.1-16.8 1.6-22.6s16.8-5.1 22.6 1.6zM208.4 208c0 17.7-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32zm92.4 25.6c-5.3 7.1-15.3 8.5-22.4 3.2s-8.5-15.3-3.2-22.4c30.4-40.5 91.2-40.5 121.6 0c5.3 7.1 3.9 17.1-3.2 22.4s-17.1 3.9-22.4-3.2c-17.6-23.5-52.8-23.5-70.4 0z"/></svg>';
    var b = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z"/></svg>';
    var F = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>';
    var T = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M220.6 121.2L271.1 96 448 96v96H333.2c-21.9-15.1-48.5-24-77.2-24s-55.2 8.9-77.2 24H64V128H192c9.9 0 19.7-2.3 28.6-6.8zM0 128V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H271.1c-9.9 0-19.7 2.3-28.6 6.8L192 64H160V48c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16l0 16C28.7 64 0 92.7 0 128zM344 304c0 48.6-39.4 88-88 88s-88-39.4-88-88s39.4-88 88-88s88 39.4 88 88z"/></svg>';

    function V() {
        const quotes = A?.message?.quotes;
        if (Array.isArray(quotes) && quotes.length > 0) {
            const quote = g(quotes);
            a(quote, 6000, 9);
        } else {
            fetch("https://v1.hitokoto.cn").then(e => e.json()).then(e => {
                let o = `这句一言来自 <span>「${e.from}」</span>，是 <span>${e.creator}</span> 在 hitokoto.cn 投稿的。`;
                a(e.hitokoto, 6000, 9);
                setTimeout(() => {
                    a(o, 4000, 9);
                }, 6000);
            });
        }
    }

    var U = {
            hitokoto: {
                icon: y,
                callback: V
            },
            asteroids: {
                icon: M,
                callback: () => {
                    if (window.Asteroids) window.ASTEROIDSPLAYERS || (window.ASTEROIDSPLAYERS = []), window.ASTEROIDSPLAYERS.push(new Asteroids);
                    else {
                        let e = document.createElement("script");
                        e.src = "https://fastly.jsdelivr.net/gh/stevenjoezhang/asteroids/asteroids.js", document.head.appendChild(e)
                    }
                }
            },
            express: {
                icon: C,
                callback: () => {
                    window.live2d.randomExpression()
                }
            },
            "switch-model": {
                icon: S,
                callback: () => {}
            },
            "switch-texture": {
                icon: x,
                callback: () => {}
            },
            info: {
                icon: b,
                callback: () => {
                    a("申明：本页面看板娘模型版权归《魔法纪录》手游原作者所有，如果者侵害了你的版权，请通过邮件联系我，我会立刻处理。", 6000, 10);
                }
            },
            photo: {
                icon: T,
                callback: async () => {
                    a("\u7167\u597D\u4E86\u561B\uFF0C\u662F\u4E0D\u662F\u5F88\u53EF\u7231\u5462\uFF1F", 6e3, 9), L(await window.live2d.getCanvasBlob())
                }
            },
            quit: {
                icon: F,
                callback: () => {
                    localStorage.setItem("waifu-display", Date.now()), a("\u613F\u4F60\u6709\u4E00\u5929\u80FD\u4E0E\u91CD\u8981\u7684\u4EBA\u91CD\u9022\u3002", 2e3, 11), document.getElementById("waifu").style.bottom = "-500px", setTimeout(() => {
                        document.getElementById("waifu").style.display = "none", document.getElementById("waifu-toggle").classList.add("waifu-toggle-active")
                    }, 3e3)
                }
            }
        },
        u = U;

    function E(e) {
        let o = new I(e);
        localStorage.removeItem("waifu-display"), sessionStorage.removeItem("waifu-text"), document.body.insertAdjacentHTML("beforeend", `<div id="waifu">
            <div id="waifu-tips"></div>
            <canvas id="live2d" width="800" height="800"></canvas>
            <div id="waifu-tool"></div>
        </div>`), setTimeout(() => {
                document.getElementById("waifu").style.bottom = 0
            }, 0),
            function() {
                u["switch-model"].callback = () => o.switchModel(), u["switch-texture"].callback = () => o.switchTextures(), Array.isArray(e.tools) || (e.tools = Object.keys(u));
                for (let i of e.tools)
                    if (u[i]) {
                        let {
                            icon: l,
                            callback: m
                        } = u[i];
                        document.getElementById("waifu-tool").insertAdjacentHTML("beforeend", `<span id="waifu-tool-${i}">${l}</span>`), document.getElementById(`waifu-tool-${i}`).addEventListener("click", m)
                    }
            }();

        function t(s) {
            A = s;
            let i = !1,
                l, m = s.message.default;
            window.addEventListener("mousemove", () => i = !0), window.addEventListener("keydown", () => i = !0), setInterval(() => {
                i ? (i = !1, clearInterval(l), l = null) : l || (l = setInterval(() => {
                    a(m, 6e3, 9)
                }, 2e4))
            }, 1e3), a(H(), 7e3, 11), window.addEventListener("mouseover", w => {
                for (let {
                        selector: d,
                        text: n
                    }
                    of s.mouseover) {
                    const el = w.target.closest(d);
                    if (el) {
                        n = g(n);

                        // 替换 {text} 为元素文本
                        n = n.replace("{text}", el.innerText);

                        // 替换 {alt} 为元素中第一个img的alt属性，如果没有img就替换成空字符串
                        if (n.includes("{alt}")) {
                            const img = el.querySelector("img");
                            const altText = img ? img.alt : "";
                            n = n.replace("{alt}", altText);
                        }

                        a(n, 4000, 8);
                        return;
                    }
                }
            }), window.addEventListener("click", w => {
                for (let {
                        selector: d,
                        text: n
                    }
                    of s.click)
                    if (w.target.closest(d)) {
                        n = g(n), n = n.replace("{text}", w.target.innerText), a(n, 4e3, 8);
                        return
                    }
            }), s.seasons.forEach(({
                date: w,
                text: d
            }) => {
                let n = new Date,
                    f = w.split("-")[0],
                    r = w.split("-")[1] || f;
                f.split("/")[0] <= n.getMonth() + 1 && n.getMonth() + 1 <= r.split("/")[0] && f.split("/")[1] <= n.getDate() && n.getDate() <= r.split("/")[1] && (d = g(d), d = d.replace("{year}", n.getFullYear()), m.push(d))
            });
            let h = () => {};
            console.log("%c", h), h.toString = () => {
                a(s.message.console, 6e3, 9)
            }, window.addEventListener("copy", () => {
                a(s.message.copy, 6e3, 9)
            }), window.addEventListener("visibilitychange", () => {
                document.hidden || a(s.message.visibilitychange, 6e3, 9)
            })
        }

        function c() {
            if (e.dragEnable === !1) return;
            let s = document.getElementById("waifu"),
                i = document.getElementById("live2d"),
                l = !1,
                m, h, w, d;
            s.onmousedown = function(f) {
                l = !0, m = s.offsetLeft, h = f.clientX, w = s.offsetTop, d = f.clientY
            };
            let n = !e.dragDirection || e.dragDirection.length === 0;
            window.onmousemove = function(f) {
                if (l) {
                    if (n || e.dragDirection.includes("x")) {
                        let r = m + (f.clientX - h);
                        r < 0 ? r = 0 : r > window.innerWidth - i.clientWidth && (r = window.innerWidth - i.clientWidth), s.style.left = r + "px"
                    }
                    if (n || e.dragDirection.includes("y")) {
                        let r = w + (f.clientY - d);
                        r < 30 ? r = 30 : r > window.innerHeight - i.clientHeight + 10 && (r = window.innerHeight - i.clientHeight + 10), s.style.top = r + "px"
                    }
                }
            }, window.onmouseup = function(f) {
                l = !1
            }
        }(function() {
            let i = localStorage.getItem("modelId"),
                l = localStorage.getItem("modelTexturesId");
            i === null && (i = 0, l = 0), new Promise((m, h) => {
                window.live2d.init(e.cdnPath + "model/"), m()
            }).then(() => {
                o.loadModel(i, l)
            }), fetch(e.waifuPath).then(m => m.json()).then(t).then(c)
        })()
    }

    function B(e, o) {
        typeof e == "string" && (e = {
            waifuPath: e,
            apiPath: o
        }), k = e.homePath, document.body.insertAdjacentHTML("beforeend", `<div id="waifu-toggle">
            <span>\u770B\u677F\u5A18</span>
        </div>`);
        let t = document.getElementById("waifu-toggle");
        t.addEventListener("click", () => {
            t.classList.remove("waifu-toggle-active"), t.getAttribute("first-time") ? (E(e), t.removeAttribute("first-time")) : (localStorage.removeItem("waifu-display"), document.getElementById("waifu").style.display = "", setTimeout(() => {
                document.getElementById("waifu").style.bottom = 0
            }, 0))
        }), localStorage.getItem("waifu-display") && Date.now() - localStorage.getItem("waifu-display") <= 864e5 ? (t.setAttribute("first-time", !0), setTimeout(() => {
            t.classList.add("waifu-toggle-active")
        }, 0)) : E(e)
    }
    var A = null,
        k = "/";

    function H() {
        if (location.pathname === k)
            for (let {
                    hour: t,
                    text: c
                }
                of A.time) {
                let s = new Date,
                    i = t.split("-")[0],
                    l = t.split("-")[1] || i;
                if (i <= s.getHours() && s.getHours() <= l) return c
            }
        let e = `\u6B22\u8FCE\u9605\u8BFB<span>\u300C${document.title.split(" - ")[0]}\u300D</span>`,
            o;
        if (document.referrer !== "") {
            let t = new URL(document.referrer),
                c = t.hostname.split(".")[1],
                s = {
                    baidu: "\u767E\u5EA6",
                    so: "360\u641C\u7D22",
                    google: "\u8C37\u6B4C\u641C\u7D22"
                };
            return location.hostname === t.hostname ? e : (c in s ? o = s[c] : o = t.hostname, `Hello\uFF01\u6765\u81EA <span>${o}</span> \u7684\u670B\u53CB<br>${e}`)
        }
        return e
    }

    function z() {
        a(H(), 7e3, 11)
    }

function R(r) {
    const waifu = document.getElementById("waifu");
    if (!waifu) {
        setTimeout(() => R(r), 100);
        return;
    }

    const maxScale = 1.0;
    const minScale = Math.min(Math.max(r.minScale || 0.1, 0.1), maxScale);
    const step = Math.min(Math.max(r.step || 0.05, 0.01), maxScale);
    let scale = Math.min(Math.max(r.defaultScale ?? 1.0, minScale), maxScale);

    // 设置原点与动画效果
    waifu.style.transformOrigin = r.origin || "center center";
    waifu.style.transition = 'transform 0.1s ease-out';
    waifu.style.transform = `scale(${scale})`;

    // 滚轮缩放（兼容 Mac 触控板 & Windows 鼠标）
    waifu.addEventListener("wheel", e => {
        e.preventDefault();

        // 对 deltaY 归一化，限制最大步进，防止轻轻一动就极限
        const delta = Math.max(-100, Math.min(100, e.deltaY)); // 限制范围 [-100, 100]
        const deltaScale = -delta * step * 0.01; // 缩放比例根据 deltaY 的比例变化

        scale = Math.min(maxScale, Math.max(minScale, scale + deltaScale));
        waifu.style.transform = `scale(${scale})`;
    }, { passive: false });

    // 触摸缩放
    let lastDistance = null;
    const getDistance = (t1, t2) =>
        Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

    waifu.addEventListener("touchstart", e => {
        if (e.touches.length === 2) {
            lastDistance = getDistance(e.touches[0], e.touches[1]);
        }
    }, { passive: false });

    waifu.addEventListener("touchmove", e => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const newDistance = getDistance(e.touches[0], e.touches[1]);
            if (lastDistance !== null) {
                const diff = newDistance - lastDistance;
                const sensitivity = step * 5; // 稍微降低敏感度
                scale = Math.min(maxScale, Math.max(minScale, scale + Math.sign(diff) * sensitivity));
                waifu.style.transform = `scale(${scale})`;
            }
            lastDistance = newDistance;
        }
    }, { passive: false });

    waifu.addEventListener("touchend", e => {
        if (e.touches.length < 2) {
            lastDistance = null;
        }
    }, { passive: false });
}


    window.initWidget = B;
    window.initResize = R; 
    window.showWelcomeMessage = z;
})();