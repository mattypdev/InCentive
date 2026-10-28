// Ported from design_handoff_streak_flame/streak-flame.js — ES module, no globals.
const INK = '#1d1f20', PEACH = '#ffe3d3', EMBER = '#d9512a';
const OUT   = 'M50 116 C24 116 8 100 8 78 C8 58 20 46 34 36 C42 30 46 22 42 12 C41 9 43 7 46 8 C62 12 72 26 72 42 C72 46 71 50 70 52 C74 48 76 46 79 44 C81 43 83 44 84 46 C90 56 92 66 92 78 C92 100 76 116 50 116 Z';
const SHADE = 'M79 54 C86 63 88 73 86 85 C84 98 73 107 61 111 C73 103 80 92 80 80 C80 70 79 61 79 54 Z';
const MID   = 'M50 108 C36 108 28 100 28 88 C28 76 36 68 42 60 C46 55 48 50 48 44 C56 50 60 56 62 64 C64 62 66 60 68 60 C72 66 74 74 74 84 C74 98 64 108 50 108 Z';
const CORE  = 'M50 104 C42 104 38 98 38 92 C38 84 44 78 48 72 C50 70 50 68 50 66 C56 72 58 78 58 82 C60 80 61 80 62 80 C63 84 64 88 64 92 C64 99 58 104 50 104 Z';

const tierFor = n =>
  n >= 7 ? { w: 156, tall: 1.16, amp: .065, dur: 1050, ember: 380  }
: n >= 3 ? { w: 124, tall: 1.05, amp: .045, dur: 1350, ember: 1400 }
:          { w: 92,  tall: 1,    amp: .03,  dur: 1700, ember: 0    };

const NS = 'http://www.w3.org/2000/svg';

export class StreakFlame {
  constructor(root, opts = {}) {
    this.root    = root;
    this.count   = opts.count  ?? 1;
    this.speed   = opts.speed  ?? 1;
    this.sparksOn = opts.sparks !== false;
    this.idleOn   = opts.idle  !== false;
    this.label    = opts.label ?? 'Streak';
    this.timers   = []; this.idleA = []; this.riskA = []; this.emberT = null; this.atRisk = false;
    this.reduced  = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._build(); this._startIdle();
  }
  t(ms) { return ms / this.speed; }

  _build() {
    const tier = this.tier = tierFor(this.count), w = tier.w;
    this.root.innerHTML = '';

    const stage = el('div', 'display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:22px');
    const wrap  = el('div', `position:relative;width:${w}px;display:flex;justify-content:center`);

    this.ember    = el('div', 'position:absolute;pointer-events:none;left:50%;bottom:4px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:#ffd36b;box-shadow:0 0 18px 6px rgba(255,170,60,.6);opacity:0');
    this.ring     = el('div', `position:absolute;pointer-events:none;left:50%;top:58%;width:${w}px;height:${w}px;margin:${-w/2}px 0 0 ${-w/2}px;border-radius:50%;border:3px solid #ff9a5a;box-sizing:border-box;opacity:0`);
    this.sparkBox = el('div', 'position:absolute;pointer-events:none;left:50%;top:38%;width:0;height:0');

    const svg = this.svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 120');
    svg.setAttribute('width',  w);
    svg.setAttribute('height', Math.round(w * 1.2 * tier.tall));
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'overflow:visible;display:block;position:relative';

    const g = () => { const n = document.createElementNS(NS, 'g'); n.style.transformBox = 'fill-box'; n.style.transformOrigin = '50% 100%'; return n; };
    const p = (d, fill, stroke) => { const n = document.createElementNS(NS, 'path'); n.setAttribute('d', d); n.setAttribute('fill', fill); if (stroke) { n.setAttribute('stroke', INK); n.setAttribute('stroke-width', 5); n.setAttribute('stroke-linejoin', 'round'); } return n; };

    this.all  = g(); this.outer = g(); this.mid = g(); this.core = g();
    this.outer.append(p(OUT, '#ff7a45', true), p(SHADE, '#ea5b3a'));
    this.mid.append(p(MID, '#ffb653'));
    this.core.append(p(CORE, '#fff2ad'));
    this.all.append(this.outer, this.mid, this.core);
    svg.append(this.all);

    wrap.append(this.ember, this.ring, svg, this.sparkBox);

    // pill — built but immediately hidden so the JS animations still run internally
    this.pill = el('div', `display:none;align-items:baseline;gap:6px;padding:8px 24px;border-radius:999px;background:${PEACH};color:${EMBER};font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:28px;line-height:1.05`);
    this.pill.setAttribute('role', 'status'); this.pill.setAttribute('aria-live', 'polite');
    this.num = el('span', 'display:inline-block;position:relative;overflow:hidden;height:1.05em;min-width:.62em;text-align:center');
    this.pill.append(document.createTextNode(this.label), this.num);

    stage.append(wrap, this.pill);
    this.root.append(stage);
    this._setNum(this.count, false);
  }

  _setNum(n, anim) {
    const s = el('span', 'display:block'); s.textContent = n; const old = this.num.lastChild;
    if (!anim || !old || this.reduced) { this.num.replaceChildren(s); return; }
    Object.assign(old.style, { position: 'absolute', left: 0, right: 0, top: 0 }); this.num.append(s);
    const d = this.t(340);
    old.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-100%)', opacity: 0 }], { duration: d, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' }).onfinish = () => old.remove();
    s.animate([{ transform: 'translateY(100%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: d, easing: 'cubic-bezier(.2,.8,.3,1.25)' });
  }

  _later(ms, fn) { this.timers.push(setTimeout(fn, this.t(ms))); }
  _clear() { this.timers.forEach(clearTimeout); this.timers = []; }
  _stopIdle() { this.idleA.forEach(a => a.cancel()); this.idleA = []; clearInterval(this.emberT); this.emberT = null; }
  _startIdle(rate = 1) {
    this._stopIdle(); if (!this.idleOn || this.reduced) return;
    const { amp, dur, ember } = this.tier;
    const loop = (node, a, d, sk) => {
      const an = node.animate([
        { transform: 'scale(1,1) skewX(0deg)' },
        { transform: `scale(${1 - a/2},${1 + a}) skewX(${-sk}deg)` },
        { transform: `scale(${1 + a/3},${1 - a/2}) skewX(${sk*.7}deg)` },
        { transform: 'scale(1,1) skewX(0deg)' }],
        { duration: this.t(d), iterations: Infinity, easing: 'ease-in-out' });
      an.playbackRate = rate; this.idleA.push(an);
    };
    loop(this.outer, amp,        dur,       1.5);
    loop(this.mid,   amp * 1.5,  dur * .72, 2.5);
    loop(this.core,  amp * 2.2,  dur * .5,  3);
    if (ember && rate === 1) this.emberT = setInterval(() => this._sparks(1, 14, 1.3), this.t(ember));
  }

  _sparks(n, spread, lift) {
    if (!this.sparksOn || this.reduced) return;
    for (let i = 0; i < n; i++) {
      const sz = 3 + Math.random() * 4;
      const s = el('i', `position:absolute;left:${-sz/2}px;top:${-sz/2}px;width:${sz}px;height:${sz}px;border-radius:50%;background:${Math.random() < .5 ? '#ffb653' : '#ff7a45'}`);
      this.sparkBox.append(s);
      const dx = (Math.random() - .5) * spread * 2, dy = -(40 + Math.random() * 60) * lift * (this.tier.w / 120);
      s.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${dx}px,${dy}px) scale(.2)`, opacity: 0 }],
        { duration: this.t(700 + Math.random() * 500), easing: 'cubic-bezier(.2,.6,.4,1)' }).onfinish = () => s.remove();
    }
  }

  _clearRisk() { this.riskA.forEach(a => a.cancel()); this.riskA = []; this.atRisk = false; }

  ignite(count = this.count) {
    this._clear(); this._clearRisk(); this._stopIdle();
    if (count !== this.count) { this.count = count; this._build(); }
    if (this.reduced) { this._setNum(count, false); return; }
    const pop = (node, delay) => node.animate([
      { transform: 'scale(.1,0)', opacity: 0 }, { transform: 'scale(.82,1.32)', opacity: 1, offset: .5 },
      { transform: 'scale(1.1,.9)', offset: .75 }, { transform: 'scale(1,1)', opacity: 1 }],
      { duration: this.t(650), delay: this.t(delay), easing: 'cubic-bezier(.3,0,.3,1)', fill: 'backwards' });
    this.ember.animate([{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1.5)', opacity: 1, offset: .6 }, { transform: 'scale(.4)', opacity: 0 }], { duration: this.t(600), easing: 'ease-out' });
    pop(this.outer, 250); pop(this.mid, 380); pop(this.core, 480);
    this._setNum(0, false);
    this.pill.animate([{ transform: 'translateY(8px) scale(.6)', opacity: 0 }, { transform: 'translateY(0) scale(1.08)', opacity: 1, offset: .6 }, { transform: 'scale(1)', opacity: 1 }],
      { duration: this.t(450), delay: this.t(650), easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
    this._later(560, () => this._sparks(10 + Math.min(count, 7) * 2, 40, 1));
    const steps = Math.min(count, 7);
    for (let k = 1; k <= steps; k++) this._later(800 + (k - 1) * 110, () => this._setNum(Math.round(count * k / steps), true));
    this._later(1250, () => this._startIdle());
  }

  refresh(count = this.count + 1) {
    const wasRisk = this.atRisk; this._clear(); this._clearRisk();
    if (tierFor(count).w !== this.tier.w) { this.count = count - 1; this._build(); }
    if (!this.idleA.length || wasRisk) this._startIdle();
    this.count = count;
    if (this.reduced) { this._setNum(count, false); return; }
    this.all.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(1.14,.82)', offset: .22 }, { transform: 'scale(.88,1.22)', offset: .45 }, { transform: 'scale(1.05,.96)', offset: .7 }, { transform: 'scale(1,1)' }], { duration: this.t(820), easing: 'ease-in-out' });
    this.core.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.35)', offset: .45 }, { filter: 'brightness(1)' }], { duration: this.t(820) });
    this._later(330, () => {
      this.ring.animate([{ transform: 'scale(.35)', opacity: .9 }, { transform: 'scale(1.7)', opacity: 0 }], { duration: this.t(650), easing: 'cubic-bezier(.2,.7,.3,1)' });
      this._sparks(14 + Math.min(count, 7) * 2, 50, 1.2);
      this._setNum(count, true);
      this.pill.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.14)', offset: .4 }, { transform: 'scale(1)' }], { duration: this.t(420), easing: 'cubic-bezier(.3,1.6,.5,1)' });
    });
  }

  setAtRisk(on) {
    if (!on) { if (this.atRisk) { this._clearRisk(); this._startIdle(); } return; }
    if (this.atRisk) return;
    this._clear(); this.atRisk = true;
    const o = { duration: this.t(700), easing: 'ease-in-out', fill: 'forwards' };
    this.riskA = [
      this.all.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(.76,.7)' }], o),
      this.svg.animate([{ filter: 'saturate(1)' }, { filter: 'saturate(.2) brightness(1.05)' }], o),
      this.pill.animate([{ background: PEACH, color: EMBER }, { background: '#e4e5e7', color: '#55595e' }], o),
    ];
    if (!this.reduced) this.riskA.push(this.all.animate([{ opacity: 1 }, { opacity: .75, offset: .3 }, { opacity: 1, offset: .45 }, { opacity: .6, offset: .8 }, { opacity: 1 }], { duration: this.t(1400), iterations: Infinity, delay: this.t(700) }));
    this._startIdle(.45);
  }

  destroy() { this._clear(); this._stopIdle(); this._clearRisk(); this.root.innerHTML = ''; }
}

function el(tag, css) { const n = document.createElement(tag); n.style.cssText = css; return n; }
