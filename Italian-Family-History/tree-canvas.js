/* =====================================================================
   BELFIORE & CIRCELLI: INTERACTIVE FAMILY CANVAS
   ---------------------------------------------------------------------
   One data source (data/people.json + data/sources.json) drives:
     - the canvas (cards, orthogonal connectors, generation rail, minimap)
     - the drawer (quick view)
     - the full-screen profile at #/person/<id>
     - the document viewer (lightbox)
   No dependencies.
   ===================================================================== */
(function () {
    'use strict';

    // ------------------------------------------------------------ constants
    var CW = 200, CH = 134;            // card size
    var SG = 64;                       // gap between spouses (holds the marriage pill)
    var SIB = 26;                      // gap between siblings
    var GG = 46;                       // gap between child groups of one block
    var ROOT_GAP = 90;                 // gap between unrelated root blocks
    var ROW_GAP = 132;                 // vertical gap between rows
    var ROW_H = CH + ROW_GAP;
    var PAD = 220;                     // world padding
    var BAR_Y = 52;                    // marriage bar height inside a card row
    var MIN_Z = 0.14, MAX_Z = 2.2;
    var STACK_GAP = 40, STACK_V = 16;  // compact columns for large families of leaves

    // ------------------------------------------------------------ state
    var D = { people: [], byId: {}, sources: {}, meta: {} };
    var L = { pos: {}, blocks: [], unions: [], rows: {}, width: 0, height: 0, kinBox: null, order: [] };
    var S = { tx: 0, ty: 0, s: 1, sel: null, hover: null, viewpoint: null, anim: null, drawerFor: null, profileFor: null, cameFromTree: false };
    var el = {};
    var cardEls = {};
    var pathEls = [];   // {el, union, child, bar}
    var pillEls = [];

    // ------------------------------------------------------------ helpers
    function $(id) { return document.getElementById(id); }
    function esc(s) {
        return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
    function initials(p) {
        if (p.placeholder) return '?';
        var g = (p.givenNames || p.displayName || '').replace(/["“”]/g, '').trim().split(/\s+/)[0] || '';
        var s = (p.surname || '').replace(/^D'/, '').trim();
        return ((g[0] || '') + (s[0] || '')).toUpperCase() || '?';
    }
    function confClass(c) { return 'conf-' + String(c || 'unverified').replace(/\s+/g, '-'); }
    function confLabel(c) { return String(c || 'unverified'); }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function reduced() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    function isMobile() { return window.innerWidth <= 768; }

    function yearOf(ev) { return ev && ev.date ? String(ev.date).slice(0, 4) : ''; }
    function cardYear(ev) {
        if (!ev) return '';
        var y = yearOf(ev);
        if (ev.alternates && ev.alternates.length) {
            var ys = [y].concat(ev.alternates.map(function (a) { return String(a.date).slice(0, 4); })).sort();
            y = ys[0] + '/' + ys.slice(1).map(function (x) { return x.slice(2); }).join('/');
        }
        var q = ev.dateQualifier;
        if (q === 'about') return '~' + y + (ev.confidence === 'unverified' ? '?' : '');
        if (q === 'before') return 'bef. ' + y;
        if (q === 'uncertain' || ev.confidence === 'unverified') return (String(ev.display || '').charAt(0) === '~' ? '~' : '') + y + '?';
        return y;
    }
    function lifeLine(p) {
        if (p.isLiving) return '';
        var b = cardYear(p.birth), d = cardYear(p.death);
        if (b && d) return b + ' – ' + d;
        if (b) return 'b. ' + b;
        if (d) return 'd. ' + d;
        return 'Dates unknown';
    }
    function photoOf(p) { return p.photo || null; }
    function hasDocs(p) { return (p.media || []).some(function (m) { return m.type === 'document' || m.type === 'clipping'; }); }
    function hasPhoto(p) { return !!p.photo || (p.media || []).some(function (m) { return m.type === 'photo'; }); }
    function hasStory(p) { return (p.story || '').length > 700; }
    function uncertainCard(p) { return !!(p.nameUncertain || p.placeholder || p.uncertainLink || p.confidence === 'unverified'); }

    // ------------------------------------------------------------ boot
    document.addEventListener('DOMContentLoaded', boot);

    function boot() {
        ['stage', 'viewport', 'world', 'bands', 'links', 'linksTop', 'cards', 'genrail', 'zoomOut', 'zoomIn', 'zoomPct', 'fit', 'centerSel',
         'keyToggle', 'legend', 'minimap', 'tip', 'live', 'search', 'searchResults', 'viewpoint', 'drawer', 'drawerBody', 'drawerClose',
         'profile', 'pfArticle', 'pfScroll', 'pfBack', 'pfPrev', 'pfNext', 'pfPrevName', 'pfNextName',
         'lightbox', 'lbImg', 'lbStage', 'lbSide', 'lbStrip', 'lbTitle', 'lbIn', 'lbOut', 'lbReset', 'lbOpen', 'lbClose'].forEach(function (k) { el[k] = $(k); });
        el.app = $('app');
        Promise.all([fetch('data/people.json').then(function (r) { return r.json(); }), fetch('data/sources.json').then(function (r) { return r.json(); })])
            .then(function (res) { init(res[0], res[1]); })
            .catch(function (e) {
                el.viewport.innerHTML = '<p class="tc-noscript">The family data could not be loaded (' + esc(e.message) + '). The <a href="family-tree.html">list view</a> still works.</p>';
            });
    }

    function syncHeader() {
        var nav = document.querySelector('.main-nav');
        if (nav) document.documentElement.style.setProperty('--pc-head-h', Math.round(nav.getBoundingClientRect().height) + 'px');
    }
    function init(pdata, sdata) {
        syncHeader();
        D.meta = pdata.meta;
        D.people = pdata.people;
        D.people.forEach(function (p) { D.byId[p.id] = p; });
        sdata.sources.forEach(function (s) { D.sources[s.id] = s; });
        layout();
        renderBands();
        renderCards();
        renderLinks();
        renderRail();
        setupViewpoint();
        bindCanvas();
        bindControls();
        bindSearch();
        bindKeys();
        bindDrawer();
        bindProfile();
        bindLightbox();
        syncNarrow();
        initialView();
        (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { fitAllText(); });
        window.addEventListener('resize', onResize);
        window.addEventListener('hashchange', route);
        route();
        document.documentElement.classList.add('tc-ready');
    }

    // =================================================================== LAYOUT
    function layout() {
        var byId = D.byId;
        var blockOf = {};
        var blocks = [];

        // 1. anchors and blocks
        function hasParents(p) { return p.parents && p.parents.length > 0; }
        D.people.forEach(function (p) {
            if (blockOf[p.id]) return;
            var spouses = (p.spouses || []).map(function (s) { return byId[s.id]; });
            var marriedIn = !hasParents(p) && spouses.some(function (s) { return hasParents(s); });
            if (marriedIn) return; // will join the spouse's block
            if (!hasParents(p) && spouses.length && spouses.every(function (s) { return !hasParents(s); })) {
                // a couple of roots: the man anchors
                var other = spouses[0];
                if (p.sex === 'F' && other && other.sex === 'M' && !blockOf[other.id]) return;
            }
            var sp = (p.spouses || []).slice().sort(function (a, b) { return a.order - b.order; }).map(function (s) { return byId[s.id]; })
                .filter(function (s) { return !blockOf[s.id] && !hasParents(s); });
            var members;
            if (sp.length >= 2) members = [sp[0], p].concat(sp.slice(1));
            else if (sp.length === 1) members = (p.sex === 'F' && sp[0].sex === 'M') ? [sp[0], p] : [p, sp[0]];
            else members = [p];
            var b = { anchor: p, members: members, unions: [], subW: 0, x: 0, gen: p.generation, children: [] };
            members.forEach(function (m) { blockOf[m.id] = b; });
            blocks.push(b);
        });

        // 2. unions and child groups
        blocks.forEach(function (b) {
            var a = b.anchor, ai = b.members.indexOf(a);
            b.members.forEach(function (m, i) {
                if (m === a) return;
                var left = Math.min(i, ai), right = Math.max(i, ai);
                b.unions.push({ id: a.id + '~' + m.id, block: b, partners: [a.id, m.id], leftIdx: left, rightIdx: right, solo: false, children: [] });
            });
            var solo = { id: a.id + '~solo', block: b, partners: [a.id], idx: ai, solo: true, children: [] };
            (a.children || []).forEach(function (cid) {
                var c = byId[cid];
                var others = c.parents.filter(function (x) { return x !== a.id; });
                var u = b.unions.filter(function (u) { return others.length && u.partners.indexOf(others[0]) >= 0; })[0];
                (u || solo).children.push(c);
            });
            // children of a married-in partner only (none expected)
            if (solo.children.length) b.unions.push(solo);
        });

        // 3. tree of blocks
        blocks.forEach(function (b) {
            b.unions.forEach(function (u) {
                u.childBlocks = u.children.map(function (c) { return blockOf[c.id]; });
                u.childBlocks.forEach(function (cb) { cb.parentUnion = u; });
            });
        });

        function blockW(b) { return b.members.length * CW + (b.members.length - 1) * SG; }
        function dropX(u) { // relative to block x
            if (u.solo) return u.idx * (CW + SG) + CW / 2;
            return u.leftIdx * (CW + SG) + CW + SG / 2;
        }
        function measure(b) {
            var groups = b.unions.filter(function (u) { return u.childBlocks.length; }).sort(function (x, y) { return dropX(x) - dropX(y); });
            b.groups = groups;
            var cw = 0;
            groups.forEach(function (u, gi) {
                u.groupW = 0;
                u.childBlocks.forEach(function (cb, i) { u.groupW += measure(cb) + (i ? SIB : 0); });
                var leaves = u.childBlocks.length >= 3 && u.childBlocks.every(function (cb) { return cb.members.length === 1 && !cb.groups.length; });
                if (leaves) {
                    u.stack = true; u.stackRows = Math.ceil(u.childBlocks.length / 2);
                    u.groupW = 2 * CW + STACK_GAP;
                    var cg = u.childBlocks[0].gen;
                    extra[cg] = Math.max(extra[cg] || 0, u.stackRows - 1);
                }
                cw += u.groupW + (gi ? GG : 0);
            });
            b.childrenW = cw;
            b.subW = Math.max(blockW(b), cw);
            return b.subW;
        }
        function place(b, left) {
            var bw = blockW(b);
            b.x = left + (b.subW - bw) / 2;
            if (!b.groups.length) return;
            var start = left + (b.subW - b.childrenW) / 2;
            if (b.groups.length === 1) {
                var u = b.groups[0];
                start = clamp(b.x + dropX(u) - u.groupW / 2, left, left + b.subW - u.groupW);
            }
            b.groups.forEach(function (u, gi) {
                var cx = start;
                if (u.stack) {
                    u.spineX = start + CW + STACK_GAP / 2;
                    u.childBlocks.forEach(function (cb, k) { cb.x = start + (k % 2) * (CW + STACK_GAP); cb.stackRow = Math.floor(k / 2); cb.stackCol = k % 2; });
                } else {
                    u.childBlocks.forEach(function (cb) { place(cb, cx); cx += cb.subW + SIB; });
                }
                start += u.groupW + GG;
            });
        }

        var extra = {};
        var roots = blocks.filter(function (b) { return !b.parentUnion && !b.anchor.kin; });
        var kin = blocks.filter(function (b) { return b.anchor.kin; });
        var cursor = 0;
        roots.forEach(function (r) { measure(r); place(r, cursor); cursor += r.subW + ROOT_GAP; });
        kin.forEach(measure);

        // positions
        var pos = {}, genTop = {}, maxGen = 0;
        D.people.forEach(function (p) { maxGen = Math.max(maxGen, p.generation); });
        genTop[0] = 0;
        for (var g = 0; g < maxGen; g++) genTop[g + 1] = genTop[g] + CH + (extra[g] || 0) * (CH + STACK_V) + ROW_GAP;
        function rowY(g) { return genTop[g]; }
        blocks.forEach(function (b) {
            if (b.anchor.kin) return;
            b.members.forEach(function (m, i) { pos[m.id] = { x: b.x + i * (CW + SG), y: rowY(b.gen) + (b.stackRow || 0) * (CH + STACK_V), gen: b.gen, stackCol: b.stackCol }; });
        });
        // kin cluster: to the left of Maria Donata's block in the same row
        if (kin.length) {
            var md = blockOf['maria-donata-circelli'];
            var kw = kin.length * CW + (kin.length - 1) * SIB;
            var kx = (md ? md.x : 0) - 150 - kw;
            kin.forEach(function (b, i) { var m = b.members[0]; pos[m.id] = { x: kx + i * (CW + SIB), y: rowY(b.gen), gen: b.gen }; });
            L.kinBox = { x: kx - 18, y: rowY(kin[0].gen) - 34, w: kw + 36, h: CH + 52 };
        }

        // normalize to padding
        var minX = Infinity, maxX = -Infinity, maxY = -Infinity;
        Object.keys(pos).forEach(function (k) { minX = Math.min(minX, pos[k].x); maxX = Math.max(maxX, pos[k].x + CW); maxY = Math.max(maxY, pos[k].y + CH); });
        if (L.kinBox) minX = Math.min(minX, L.kinBox.x);
        var dx = PAD - minX, dy = PAD;
        Object.keys(pos).forEach(function (k) { pos[k].x += dx; pos[k].y += dy; });
        blocks.forEach(function (b) { b.x += dx; b.unions.forEach(function (u) { if (u.spineX != null) u.spineX += dx; }); });
        if (L.kinBox) { L.kinBox.x += dx; L.kinBox.y += dy; }
        L.width = maxX + dx + PAD;
        L.height = maxY + dy + PAD * 0.8;
        L.pos = pos;
        L.blocks = blocks;
        L.blockOf = blockOf;
        L.dropX = dropX;
        L.rows = {};
        D.people.forEach(function (p) {
            var g = p.generation;
            (L.rows[g] = L.rows[g] || []).push(p.id);
        });
        Object.keys(L.rows).forEach(function (g) { L.rows[g].sort(function (a, b) { return (pos[a].x - pos[b].x) || (pos[a].y - pos[b].y); }); });
        L.genY = {}; L.genH = {};
        Object.keys(L.rows).forEach(function (g) { L.genY[g] = PAD + genTop[g]; L.genH[g] = CH + (extra[g] || 0) * (CH + STACK_V); });
        // reading order for prev/next
        L.order = D.people.map(function (p) { return p.id; }).sort(function (a, b) {
            return (pos[a].gen - pos[b].gen) || (pos[a].x - pos[b].x);
        });
    }

    // =================================================================== RENDER
    function renderBands() {
        var html = '';
        Object.keys(L.genY).forEach(function (g) {
            var y = L.genY[g] - ROW_GAP / 2 + 6;
            html += '<div class="tc-band" style="top:' + y + 'px;height:' + (L.genH[g] + ROW_GAP - 12) + 'px;width:' + L.width + 'px"></div>';
        });
        el.bands.innerHTML = html;
        el.bands.style.width = L.width + 'px';
    }

    function cardHTML(p) {
        var ph = photoOf(p);
        var av = ph ? '<img src="' + esc(ph) + '" alt="" loading="lazy">' : esc(initials(p));
        var life = lifeLine(p);
        var foot = '<span class="ic' + (hasPhoto(p) ? ' on' : '') + '" data-ic="photo"></span>' +
                   '<span class="ic' + (hasDocs(p) ? ' on' : '') + '" data-ic="doc"></span>' +
                   '<span class="ic' + (hasStory(p) ? ' on' : '') + '" data-ic="story"></span>' +
                   '<span class="c-you">VIEWPOINT</span>';
        return '<div class="c-top"><div class="c-av" aria-hidden="true">' + av + '</div>' +
               '<div class="c-names"><div class="c-name">' + esc(p.displayName) + '</div>' +
               '<div class="c-dis">' + esc(p.disambiguator || '') + '</div></div></div>' +
               '<div class="c-meta">' + (life ? '<div class="c-dates">' + esc(life) + '</div>' : p.isLiving ? '<div class="c-dates"><span class="c-living">Living</span></div>' : '') +
               (p.cardPlace ? '<div class="c-place">' + esc(p.cardPlace) + '</div>' : '') + '</div>' +
               '<div class="c-foot" aria-hidden="true">' + foot + '</div>';
    }
    function cardLabel(p) {
        var parts = [p.displayName];
        if (p.disambiguator) parts.push(p.disambiguator);
        var life = lifeLine(p); if (life) parts.push(life.replace('–', 'to').replace('~', 'about ').replace('?', ' (unverified)'));
        if (p.isLiving) parts.push('living');
        if (p.isDirectLine) parts.push("on Seb's direct line");
        return parts.join(', ');
    }
    function renderCards() {
        var frag = document.createDocumentFragment();
        D.people.forEach(function (p) {
            var pos = L.pos[p.id];
            var c = document.createElement('div');
            c.className = 'card' + (p.isDirectLine ? ' is-direct' : '') + (uncertainCard(p) ? ' is-uncertain' : '') +
                          (p.isLiving ? ' is-living' : '') + (p.placeholder ? ' is-placeholder' : '');
            c.setAttribute('role', 'button');
            c.setAttribute('tabindex', '-1');
            c.setAttribute('aria-label', cardLabel(p));
            c.dataset.id = p.id;
            c.style.left = pos.x + 'px';
            c.style.top = pos.y + 'px';
            c.innerHTML = cardHTML(p);
            frag.appendChild(c);
            cardEls[p.id] = c;
        });
        el.cards.appendChild(frag);
        var first = cardEls[(D.meta && D.meta.rootPersonId) || D.people[0].id];
        if (first) first.setAttribute('tabindex', '0');
    }

    var SVGNS = 'http://www.w3.org/2000/svg';
    function svg(tag, attrs, parent) {
        var n = document.createElementNS(SVGNS, tag);
        Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
        if (parent) parent.appendChild(n);
        return n;
    }

    function renderLinks() {
        var W = L.width, H = L.height;
        [el.links, el.linksTop].forEach(function (s) { s.setAttribute('width', W); s.setAttribute('height', H); s.setAttribute('viewBox', '0 0 ' + W + ' ' + H); s.innerHTML = ''; });
        pathEls = []; pillEls = [];
        var gBack = svg('g', {}, el.links), gDirect = svg('g', {}, el.links);
        var byId = D.byId;

        // kin cluster frame
        if (L.kinBox) {
            var k = L.kinBox;
            svg('rect', { x: k.x, y: k.y, width: k.w, height: k.h, rx: 12, class: 'ln ln--kin' }, gBack);
            var t = svg('text', { x: k.x + 14, y: k.y + 20, class: 'kin-label' }, gBack);
            t.textContent = 'Circelli kin · relationship unproven';
        }

        L.blocks.forEach(function (b) {
            if (b.anchor.kin) return;
            var bx = b.x, by = L.pos[b.anchor.id].y;
            b.unions.forEach(function (u, ui) {
                var partnersDirect = u.partners.every(function (id) { return byId[id].isDirectLine; });
                var x0, y0;
                if (u.solo) {
                    x0 = bx + L.dropX(u); y0 = by + CH;
                } else {
                    var xl = bx + u.leftIdx * (CW + SG) + CW, xr = xl + SG;
                    x0 = xl + SG / 2; y0 = by + BAR_Y;
                    var bar = svg('path', { d: 'M' + xl + ' ' + y0 + 'H' + xr, class: 'ln ln--bar' + (partnersDirect ? ' ln--direct' : '') }, partnersDirect ? gDirect : gBack);
                    pathEls.push({ el: bar, union: u, bar: true });
                    drawPill(u, x0, y0, partnersDirect);
                }
                if (!u.childBlocks || !u.childBlocks.length) return;
                var gi = b.groups.indexOf(u), ng = b.groups.length;
                var childTop = L.genY[u.children[0].generation];
                var busY = childTop - ROW_GAP / 2 + (ng > 1 ? (gi - (ng - 1) / 2) * 12 : 0);
                u.children.forEach(function (c) {
                    var cp = L.pos[c.id];
                    var cx = cp.x + CW / 2;
                    var direct = c.isDirectLine && u.partners.some(function (id) { return byId[id].isDirectLine; });
                    var dashed = c.parentLinkConfidence === 'unverified' || c.parentLinkConfidence === 'probable';
                    var d = 'M' + x0 + ' ' + y0 + 'V' + busY + 'H' + cx + 'V' + cp.y;
                    if (u.stack) {
                        var my = cp.y + BAR_Y, ex = cp.stackCol ? cp.x : cp.x + CW;
                        d = 'M' + x0 + ' ' + y0 + 'V' + busY + 'H' + u.spineX + 'V' + my + 'H' + ex;
                    }
                    var path = svg('path', { d: d, class: 'ln' + (direct ? ' ln--direct' : '') + (dashed ? ' ln--dashed' : '') }, direct ? gDirect : gBack);
                    pathEls.push({ el: path, union: u, child: c.id });
                });
            });
        });
    }

    function drawPill(u, x, y, direct) {
        var byId = D.byId;
        var a = byId[u.partners[0]];
        var rec = (a.spouses || []).filter(function (s) { return s.id === u.partners[1]; })[0] || {};
        var yr = rec.marriageDate ? String(rec.marriageDate).slice(0, 4) : '';
        var txt = yr ? 'm. ' + yr : 'm.';
        var w = yr ? 46 : 24;
        var g = svg('g', { class: 'pill' + (direct ? ' pill--direct' : '') }, el.linksTop);
        svg('rect', { x: x - w / 2, y: y - 9, width: w, height: 18, rx: 9 }, g);
        var t = svg('text', { x: x, y: y + 0.5 }, g); t.textContent = txt;
        var anchorOrder = (a.spouses || []).length > 1 ? rec.order : null;
        if (anchorOrder) {
            var o = svg('text', { x: x, y: y - 17, class: 'ord' }, g);
            o.textContent = anchorOrder === 1 ? '1ST' : anchorOrder === 2 ? '2ND' : anchorOrder + 'TH';
        }
        var b = byId[u.partners[1]];
        var tip = '<b>' + esc(a.displayName) + ' and ' + esc(b.displayName) + '</b><br>' +
                  (anchorOrder ? (anchorOrder === 1 ? 'First' : 'Second') + ' marriage. ' : '') +
                  (rec.marriageDisplay ? 'Married ' + esc(rec.marriageDisplay) + (rec.place ? ', ' + esc(rec.place) : '') + '.' : 'Marriage date not known.') +
                  (rec.note ? '<br>' + esc(rec.note) : '');
        g.addEventListener('pointerenter', function (e) { showTip(tip, e.clientX, e.clientY); });
        g.addEventListener('pointermove', function (e) { moveTip(e.clientX, e.clientY); });
        g.addEventListener('pointerleave', hideTip);
        pillEls.push({ el: g, union: u });
    }

    function showTip(html, x, y) { el.tip.innerHTML = html; el.tip.hidden = false; moveTip(x, y); }
    function moveTip(x, y) {
        var r = el.tip.getBoundingClientRect();
        el.tip.style.left = clamp(x + 14, 8, window.innerWidth - r.width - 8) + 'px';
        el.tip.style.top = clamp(y + 16, 8, window.innerHeight - r.height - 8) + 'px';
    }
    function hideTip() { el.tip.hidden = true; }

    function renderRail() {
        var html = '';
        (D.meta.generations || []).forEach(function (g) {
            if (L.genY[g.generation] == null) return;
            html += '<div class="gen" data-g="' + g.generation + '"><span class="gen-num">' + esc(g.label) + '</span><span class="gen-txt">' +
                    '<span class="gen-title">' + esc(g.title) + '</span>' + (g.range ? '<span class="gen-range">' + esc(g.range) + '</span>' : '') + '</span></div>';
        });
        el.genrail.innerHTML = html;
    }
    function syncRail() {
        var vr = el.viewport.getBoundingClientRect();
        Array.prototype.forEach.call(el.genrail.children, function (n) {
            var g = +n.dataset.g;
            var y = (L.genY[g] + CH / 2) * S.s + S.ty;
            n.style.top = y + 'px';
            n.style.opacity = (y < (isMobile() ? 120 : 100) || y > vr.height - 30) ? '0' : '1';
        });
    }

    // ------------------------------------------------------------ fit text (no overflow)
    function fitAllText() {
        Object.keys(cardEls).forEach(function (id) { fitCard(cardEls[id]); });
    }
    function shrink(n, min) {
        if (!n) return;
        var fs = parseFloat(getComputedStyle(n).fontSize);
        var guard = 0;
        while ((n.scrollWidth > n.clientWidth + 0.5 || n.scrollHeight > n.clientHeight + 0.5) && fs > min && guard++ < 40) {
            fs -= 0.5; n.style.fontSize = fs + 'px';
        }
    }
    function fitCard(c) {
        var name = c.querySelector('.c-name'), dis = c.querySelector('.c-dis');
        shrink(name, 12);
        shrink(dis, 10.5);
        shrink(c.querySelector('.c-dates'), 10);
        shrink(c.querySelector('.c-place'), 9.5);
        var guard = 0;
        while (c.scrollHeight > c.clientHeight + 0.5 && guard++ < 30) {
            var nf = parseFloat(getComputedStyle(name).fontSize), df = dis ? parseFloat(getComputedStyle(dis).fontSize) : 0;
            if (dis && df > 10.5 && (df >= nf * 0.7)) dis.style.fontSize = (df - 0.5) + 'px';
            else if (nf > 11) name.style.fontSize = (nf - 0.5) + 'px';
            else break;
        }
    }

    // =================================================================== VIEW (pan/zoom)
    function syncNarrow() {
        var w = el.stage.getBoundingClientRect().width;
        el.app.classList.toggle('is-narrow', w < 880);
    }
    function apply() {
        el.world.style.transform = 'translate(' + S.tx + 'px,' + S.ty + 'px) scale(' + S.s + ')';
        el.zoomPct.textContent = Math.round(S.s * 100) + '%';
        syncRail();
        drawMinimap();
    }
    function stopAnim() { if (S.anim) { cancelAnimationFrame(S.anim); S.anim = null; } }
    function animateTo(tx, ty, s, ms) {
        stopAnim();
        if (reduced() || ms === 0) { S.tx = tx; S.ty = ty; S.s = s; apply(); return; }
        var t0 = performance.now(), a = { tx: S.tx, ty: S.ty, s: S.s }, dur = ms || 420;
        function step(t) {
            var k = clamp((t - t0) / dur, 0, 1); k = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
            S.tx = a.tx + (tx - a.tx) * k; S.ty = a.ty + (ty - a.ty) * k; S.s = a.s + (s - a.s) * k; apply();
            if (k < 1) S.anim = requestAnimationFrame(step); else S.anim = null;
        }
        S.anim = requestAnimationFrame(step);
    }
    function zoomAt(cx, cy, ns, animate) {
        ns = clamp(ns, MIN_Z, MAX_Z);
        var r = el.viewport.getBoundingClientRect();
        var vx = cx - r.left, vy = cy - r.top;
        var wx = (vx - S.tx) / S.s, wy = (vy - S.ty) / S.s;
        var tx = vx - wx * ns, ty = vy - wy * ns;
        if (animate) animateTo(tx, ty, ns, 220); else { S.s = ns; S.tx = tx; S.ty = ty; apply(); }
    }
    function safeArea() {
        var r = el.viewport.getBoundingClientRect();
        var top = isMobile() ? 110 : 96, bottom = isMobile() ? 70 : 76;
        return { w: r.width, h: r.height, top: top, bottom: bottom, left: 16, right: 16 };
    }
    function fitView(animate) {
        var a = safeArea();
        var s = Math.min((a.w - a.left - a.right) / L.width, (a.h - a.top - a.bottom) / L.height);
        s = clamp(s, MIN_Z, 1);
        var tx = a.left + ((a.w - a.left - a.right) - L.width * s) / 2;
        var ty = a.top + ((a.h - a.top - a.bottom) - L.height * s) / 2;
        animateTo(tx, ty, s, animate ? 420 : 0);
    }
    function centerOn(id, scale, animate) {
        var p = L.pos[id]; if (!p) return;
        var a = safeArea();
        var s = scale || S.s;
        var cx = a.left + (a.w - a.left - a.right) / 2, cy = a.top + (a.h - a.top - a.bottom) / 2;
        animateTo(cx - (p.x + CW / 2) * s, cy - (p.y + CH / 2) * s, s, animate === false ? 0 : 450);
    }
    function ensureVisible(id) {
        var p = L.pos[id]; if (!p) return;
        var a = safeArea();
        var x = p.x * S.s + S.tx, y = p.y * S.s + S.ty, w = CW * S.s, h = CH * S.s;
        if (x < a.left || y < a.top || x + w > a.w - a.right || y + h > a.h - a.bottom) centerOn(id, Math.max(S.s, 0.55));
    }
    function initialView() {
        var a = safeArea();
        var L1 = L.pos['leonardantonio-belfiore'], M1 = L.pos['maria-donata-circelli'];
        var s = isMobile() ? 0.6 : clamp((a.h - a.top - a.bottom) / (L.genY[3] - L.genY[0] + CH + 40), 0.55, 0.8);
        var cx = a.left + (a.w - a.left - a.right) / 2;
        var mid = (L1.x + M1.x + CW) / 2;
        S.s = s; S.tx = cx - mid * s; S.ty = a.top + 14 - (L.genY[0] - 8) * s; apply();
    }
    function onResize() { syncHeader(); syncNarrow(); apply(); }

    // =================================================================== CANVAS INTERACTION
    function bindCanvas() {
        var vp = el.viewport;
        var pointers = {}, start = null, moved = false, pinch = null, downTarget = null;

        vp.addEventListener('pointerdown', function (e) {
            if (e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return;
            stopAnim();
            pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
            try { vp.setPointerCapture(e.pointerId); } catch (_) {}
            var ids = Object.keys(pointers);
            if (ids.length === 1) {
                start = { x: e.clientX, y: e.clientY, tx: S.tx, ty: S.ty };
                moved = false;
                downTarget = e.target.closest ? e.target.closest('.card') : null;
                S.downOnPill = !!(e.target.closest && e.target.closest('.pill'));
            } else if (ids.length === 2) {
                var a = pointers[ids[0]], b = pointers[ids[1]];
                pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: S.s, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, tx: S.tx, ty: S.ty };
                moved = true;
            }
        });
        vp.addEventListener('pointermove', function (e) {
            if (!pointers[e.pointerId]) {
                if (e.pointerType === 'mouse') hoverAt(e);
                return;
            }
            pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
            var ids = Object.keys(pointers);
            if (ids.length >= 2 && pinch) {
                var a = pointers[ids[0]], b = pointers[ids[1]];
                var d = Math.hypot(a.x - b.x, a.y - b.y);
                var ns = clamp(pinch.s * d / pinch.d, MIN_Z, MAX_Z);
                var r = vp.getBoundingClientRect();
                var mx = (a.x + b.x) / 2 - r.left, my = (a.y + b.y) / 2 - r.top;
                var wx = (pinch.mx - r.left - pinch.tx) / pinch.s, wy = (pinch.my - r.top - pinch.ty) / pinch.s;
                S.s = ns; S.tx = mx - wx * ns; S.ty = my - wy * ns; apply();
                return;
            }
            if (!start) return;
            var dx = e.clientX - start.x, dy = e.clientY - start.y;
            if (!moved && Math.hypot(dx, dy) > 5) { moved = true; vp.classList.add('is-panning'); hideTip(); }
            if (moved) { S.tx = start.tx + dx; S.ty = start.ty + dy; apply(); }
        });
        function end(e) {
            if (!pointers[e.pointerId]) return;
            delete pointers[e.pointerId];
            try { vp.releasePointerCapture(e.pointerId); } catch (_) {}
            var left = Object.keys(pointers).length;
            if (left === 0) {
                vp.classList.remove('is-panning');
                if (!moved && e.type === 'pointerup') {
                    if (downTarget) select(downTarget.dataset.id, { open: true, focus: true });
                    else if (!S.downOnPill) clearSelection();
                }
                start = null; pinch = null; downTarget = null;
            } else if (left === 1) {
                var id = Object.keys(pointers)[0];
                start = { x: pointers[id].x, y: pointers[id].y, tx: S.tx, ty: S.ty }; pinch = null;
            }
        }
        vp.addEventListener('pointerup', end);
        vp.addEventListener('pointercancel', end);
        vp.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !pointers[e.pointerId]) setHover(null); });

        vp.addEventListener('wheel', function (e) {
            e.preventDefault(); stopAnim(); hideTip();
            var dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY, dx = e.deltaMode === 1 ? e.deltaX * 16 : e.deltaX;
            var trackpadPan = !e.ctrlKey && !e.metaKey && e.deltaMode === 0 && (Math.abs(dx) > 0.5 || (Math.abs(dy) < 50 && dy % 1 !== 0));
            if (trackpadPan) { S.tx -= dx; S.ty -= dy; apply(); return; }
            var k = e.ctrlKey ? 0.012 : 0.0018;
            zoomAt(e.clientX, e.clientY, S.s * Math.exp(-dy * k));
        }, { passive: false });

        el.cards.addEventListener('click', function (e) {
            if (e.detail !== 0) return; // real pointer clicks are handled on pointerup
            var c = e.target.closest('.card'); if (c) select(c.dataset.id, { open: true, focus: true });
        });
        // keyboard focus on cards follows selection
        el.cards.addEventListener('focusin', function (e) {
            var c = e.target.closest('.card'); if (!c) return;
            setRoving(c.dataset.id);
            ensureVisible(c.dataset.id);
        });

        // minimap
        var mmDrag = false;
        function mmMove(e) {
            var r = el.minimap.getBoundingClientRect(), m = el.minimap._map; if (!m) return;
            var wx = (e.clientX - r.left - m.ox) / m.k, wy = (e.clientY - r.top - m.oy) / m.k;
            var a = el.viewport.getBoundingClientRect();
            stopAnim(); S.tx = a.width / 2 - wx * S.s; S.ty = a.height / 2 - wy * S.s; apply();
        }
        el.minimap.addEventListener('pointerdown', function (e) { mmDrag = true; el.minimap.setPointerCapture(e.pointerId); mmMove(e); });
        el.minimap.addEventListener('pointermove', function (e) { if (mmDrag) mmMove(e); });
        el.minimap.addEventListener('pointerup', function () { mmDrag = false; });
    }

    function hoverAt(e) {
        var c = e.target.closest ? e.target.closest('.card') : null;
        setHover(c ? c.dataset.id : null);
    }
    var hoverT = null;
    function setHover(id) {
        if (S.hover === id) return;
        clearTimeout(hoverT);
        if (id) hoverT = setTimeout(function () { S.hover = id; highlight(id); }, 90);
        else { S.hover = null; highlight(S.sel); }
    }

    function drawMinimap() {
        var c = el.minimap; if (!c) return;
        var a = el.viewport.getBoundingClientRect();
        var show = !isMobile() && !el.app.classList.contains('is-narrow') && (L.width * S.s > a.width * 1.02 || L.height * S.s > a.height * 1.02);
        c.hidden = !show;
        if (!show) return;
        var dpr = window.devicePixelRatio || 1, W = 200, H = 120;
        if (c.width !== W * dpr) { c.width = W * dpr; c.height = H * dpr; }
        var ctx = c.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        var k = Math.min((W - 12) / L.width, (H - 12) / L.height), ox = (W - L.width * k) / 2, oy = (H - L.height * k) / 2;
        c._map = { k: k, ox: ox, oy: oy };
        D.people.forEach(function (p) {
            var q = L.pos[p.id];
            ctx.fillStyle = p.id === S.sel ? '#b8860b' : p.isDirectLine ? '#1a5c2a' : '#c9b48e';
            ctx.fillRect(ox + q.x * k, oy + q.y * k, Math.max(2, CW * k), Math.max(1.5, CH * k));
        });
        var vx = (-S.tx / S.s) * k + ox, vy = (-S.ty / S.s) * k + oy, vw = a.width / S.s * k, vh = a.height / S.s * k;
        ctx.strokeStyle = '#0d3318'; ctx.lineWidth = 1.5; ctx.fillStyle = 'rgba(26,92,42,0.08)';
        ctx.fillRect(vx, vy, vw, vh); ctx.strokeRect(vx, vy, vw, vh);
    }

    function bindControls() {
        var mid = function () { var r = el.viewport.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
        el.zoomIn.addEventListener('click', function () { var m = mid(); zoomAt(m[0], m[1], S.s * 1.25, true); });
        el.zoomOut.addEventListener('click', function () { var m = mid(); zoomAt(m[0], m[1], S.s / 1.25, true); });
        el.zoomPct.addEventListener('click', function () { var m = mid(); zoomAt(m[0], m[1], 1, true); });
        el.fit.addEventListener('click', function () { fitView(true); });
        el.centerSel.addEventListener('click', function () { centerOn(S.sel || S.viewpoint || D.meta.rootPersonId, Math.max(S.s, 0.8)); });
        el.keyToggle.addEventListener('click', function () {
            var open = el.legend.hidden;
            el.legend.hidden = !open; el.keyToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    // =================================================================== SELECTION + HIGHLIGHT
    function setRoving(id) {
        Object.keys(cardEls).forEach(function (k) { cardEls[k].setAttribute('tabindex', k === id ? '0' : '-1'); });
    }
    function select(id, opts) {
        opts = opts || {};
        if (!D.byId[id]) return;
        if (S.sel && cardEls[S.sel]) cardEls[S.sel].classList.remove('is-selected');
        S.sel = id;
        cardEls[id].classList.add('is-selected');
        setRoving(id);
        highlight(S.hover || id);
        if (opts.focus) cardEls[id].focus({ preventScroll: true });
        if (opts.open !== false) openDrawer(id);
        if (opts.center) centerOn(id, Math.max(S.s, 0.75)); else if (opts.ensure !== false) setTimeout(function () { ensureVisible(id); }, 30);
        el.live.textContent = D.byId[id].displayName + ' selected.';
        drawMinimap();
    }
    function clearSelection() {
        if (S.sel && cardEls[S.sel]) cardEls[S.sel].classList.remove('is-selected');
        S.sel = null; highlight(S.hover); closeDrawer(); drawMinimap();
    }

    function lineageSet(id) {
        var set = {}, byId = D.byId;
        set[id] = true;
        (function up(x) { (byId[x].parents || []).forEach(function (p) { if (!set[p]) { set[p] = true; up(p); } }); })(id);
        (function down(x) { (byId[x].children || []).forEach(function (c) { if (!set[c]) { set[c] = true; down(c); } }); })(id);
        // co-parents of descendants
        Object.keys(set).forEach(function (x) {
            (byId[x].children || []).forEach(function (c) {
                if (set[c] && x !== id) (byId[c].parents || []).forEach(function (p) { set[p] = true; });
            });
        });
        (byId[id].children || []).forEach(function (c) { (byId[c].parents || []).forEach(function (p) { set[p] = true; }); });
        return set;
    }
    function highlight(id) {
        var on = !!id;
        el.app.classList.toggle('is-focus', on);
        var set = on ? lineageSet(id) : {};
        Object.keys(cardEls).forEach(function (k) { cardEls[k].classList.toggle('is-hl', !!set[k]); });
        var hlUnions = {};
        pathEls.forEach(function (pe) {
            if (pe.bar) return;
            var hit = on && set[pe.child] && pe.union.partners.some(function (p) { return set[p]; });
            pe.el.classList.toggle('ln--hl', !!hit);
            if (hit) { hlUnions[pe.union.id] = true; pe.el.parentNode.appendChild(pe.el); }
        });
        pathEls.forEach(function (pe) {
            if (!pe.bar) return;
            var hit = on && (hlUnions[pe.union.id] || pe.union.partners.every(function (p) { return set[p]; }) && pe.union.partners.indexOf(id) >= 0);
            pe.el.classList.toggle('ln--hl', !!hit);
        });
        pillEls.forEach(function (pe) { pe.el.classList.toggle('pill--hl', on && (!!hlUnions[pe.union.id] || pe.union.partners.indexOf(id) >= 0)); });
    }

    // =================================================================== SEARCH
    function bindSearch() {
        var input = el.search, list = el.searchResults, items = [], active = -1;
        D.people.forEach(function (p) {
            p._hay = norm([p.displayName, p.givenNames, p.surname, p.disambiguator].concat((p.nameVariants || []).map(function (v) { return v.name; })).join(' | '));
        });
        function render(q) {
            if (!q) { list.hidden = true; input.setAttribute('aria-expanded', 'false'); el.app.classList.remove('is-search'); return; }
            var nq = norm(q);
            items = D.people.filter(function (p) { return p._hay.indexOf(nq) >= 0; }).slice(0, 9);
            Object.keys(cardEls).forEach(function (k) { cardEls[k].classList.toggle('is-match', items.some(function (p) { return p.id === k; })); });
            el.app.classList.add('is-search');
            active = items.length ? 0 : -1;
            list.innerHTML = items.length ? items.map(function (p, i) {
                var v = (p.nameVariants || []).filter(function (x) { return norm(x.name).indexOf(nq) >= 0 && norm(p.displayName).indexOf(nq) < 0; })[0];
                return '<li role="option" id="sr-' + i + '" data-id="' + esc(p.id) + '" aria-selected="' + (i === active) + '"><span class="r-name">' + esc(p.displayName) + '</span>' +
                       '<span class="r-sub">' + esc(v ? 'Also recorded as ' + v.name : (p.disambiguator || '')) + '</span></li>';
            }).join('') : '<li class="r-empty" role="option" aria-disabled="true">No one by that name or spelling yet</li>';
            list.hidden = false; input.setAttribute('aria-expanded', 'true');
            input.setAttribute('aria-activedescendant', active >= 0 ? 'sr-' + active : '');
        }
        function choose(i) {
            var p = items[i]; if (!p) return;
            input.value = ''; render('');
            select(p.id, { open: true, center: true });
            setTimeout(function () { cardEls[p.id].focus({ preventScroll: true }); }, 50);
        }
        input.addEventListener('input', function () { render(input.value.trim()); });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault(); if (!items.length) return;
                active = (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
                Array.prototype.forEach.call(list.children, function (li, i) { li.setAttribute('aria-selected', i === active ? 'true' : 'false'); });
                input.setAttribute('aria-activedescendant', 'sr-' + active);
            } else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
            else if (e.key === 'Escape') { input.value = ''; render(''); }
        });
        list.addEventListener('pointerdown', function (e) { var li = e.target.closest('li[data-id]'); if (!li) return; e.preventDefault(); choose(+li.id.replace('sr-', '')); });
        input.addEventListener('blur', function () { setTimeout(function () { if (document.activeElement !== input) { list.hidden = true; input.setAttribute('aria-expanded', 'false'); if (!input.value) el.app.classList.remove('is-search'); } }, 150); });
    }

    // =================================================================== KEYBOARD
    function neighbor(id, dir) {
        var p = D.byId[id];
        if (dir === 'up') {
            var ps = (p.parents || []).slice();
            if (!ps.length) { // married-in: go to spouse's parents
                var sp = (p.spouses || []).map(function (s) { return D.byId[s.id]; }).filter(function (s) { return s.parents && s.parents.length; })[0];
                if (sp) ps = sp.parents.slice();
            }
            ps.sort(function (a, b) { return (D.byId[b].isDirectLine ? 1 : 0) - (D.byId[a].isDirectLine ? 1 : 0) || L.pos[a].x - L.pos[b].x; });
            return ps[0];
        }
        if (dir === 'down') {
            var cs = (p.children || []).slice().sort(function (a, b) { return (D.byId[b].isDirectLine ? 1 : 0) - (D.byId[a].isDirectLine ? 1 : 0) || L.pos[a].x - L.pos[b].x; });
            return cs[0];
        }
        var row = L.rows[p.generation], i = row.indexOf(id);
        return row[i + (dir === 'left' ? -1 : 1)];
    }
    function bindKeys() {
        document.addEventListener('keydown', function (e) {
            if (!el.lightbox.hidden) return lbKeys(e);
            if (!el.profile.hidden) {
                if (e.key === 'Escape') { e.preventDefault(); closeProfileNav(); }
                else if (e.key === 'Tab') trapFocus(e, el.profile);
                return;
            }
            var t = e.target, tag = (t.tagName || '').toLowerCase();
            if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
            var onCard = t.closest && t.closest('.card');
            var map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
            if (onCard && map[e.key]) {
                e.preventDefault();
                var n = neighbor(onCard.dataset.id, map[e.key]);
                if (n) { select(n, { open: !!S.drawerFor, focus: true, ensure: true }); }
                return;
            }
            if (onCard && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                var id = onCard.dataset.id;
                if (S.drawerFor === id && e.key === 'Enter') openProfile(id); else select(id, { open: true, focus: true });
                return;
            }
            if (e.key === 'Escape') {
                if (!el.legend.hidden) { el.legend.hidden = true; el.keyToggle.setAttribute('aria-expanded', 'false'); return; }
                if (S.drawerFor) { var was = S.sel; closeDrawer(); if (was && cardEls[was]) cardEls[was].focus({ preventScroll: true }); return; }
                if (S.sel) clearSelection();
                return;
            }
            if (t.closest && (t.closest('.tc-drawer'))) return;
            var r = el.viewport.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
            if (e.key === '+' || e.key === '=') zoomAt(cx, cy, S.s * 1.2, true);
            else if (e.key === '-' || e.key === '_') zoomAt(cx, cy, S.s / 1.2, true);
            else if (e.key === '0') fitView(true);
        });
    }
    function trapFocus(e, root) {
        var f = Array.prototype.filter.call(root.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"], input, select'), function (n) { return n.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    // =================================================================== RELATIONSHIPS (viewpoint)
    function ancestors(id) {
        var map = {}; map[id] = 0; var q = [[id, 0]];
        while (q.length) { var c = q.shift(); (D.byId[c[0]].parents || []).forEach(function (p) { if (!(p in map)) { map[p] = c[1] + 1; q.push([p, c[1] + 1]); } }); }
        return map;
    }
    function blood(a, b) {
        var A = ancestors(a), B = ancestors(b), best = null;
        Object.keys(A).forEach(function (k) { if (k in B) { var s = A[k] + B[k]; if (!best || s < best.s) best = { m: A[k], n: B[k], s: s }; } });
        return best;
    }
    function ordinal(n) { var s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
    function label(m, n, sex) {
        var g = function (mw, fw, nw) { return sex === 'M' ? mw : sex === 'F' ? fw : nw; };
        var greats = function (k) { return k <= 0 ? '' : k === 1 ? 'great-' : k === 2 ? 'great-great-' : k + '\u00d7 great-'; };
        if (m === 0 && n === 0) return 'the same person';
        if (m === 0) return n === 1 ? g('son', 'daughter', 'child') : greats(n - 2) + g('grandson', 'granddaughter', 'grandchild');
        if (n === 0) return m === 1 ? g('father', 'mother', 'parent') : greats(m - 2) + g('grandfather', 'grandmother', 'grandparent');
        if (m === 1 && n === 1) return g('brother', 'sister', 'sibling');
        if (n === 1) return greats(m - 2) + g('uncle', 'aunt', 'aunt or uncle');
        if (m === 1) return (n === 2 ? '' : n === 3 ? 'grand-' : greats(n - 3) + 'grand-') + g('nephew', 'niece', 'niece or nephew');
        var deg = Math.min(m, n) - 1, rem = Math.abs(m - n);
        return ordinal(deg) + ' cousin' + (rem === 1 ? ' once removed' : rem === 2 ? ' twice removed' : rem > 2 ? ' ' + rem + ' times removed' : '');
    }
    function relationship(from, to) {
        if (!from || from === to) return null;
        var p = D.byId[to];
        if ((D.byId[from].spouses || []).some(function (s) { return s.id === to; })) return p.sex === 'M' ? 'husband' : p.sex === 'F' ? 'wife' : 'spouse';
        var b = blood(from, to); if (b) return label(b.m, b.n, p.sex);
        var r = null;
        (p.spouses || []).some(function (s) { var x = blood(from, s.id); if (x) { r = label(x.m, x.n, D.byId[s.id].sex) + "'s " + (p.sex === 'M' ? 'husband' : p.sex === 'F' ? 'wife' : 'spouse'); return true; } return false; });
        if (r) return r;
        (D.byId[from].spouses || []).some(function (s) { var x = blood(s.id, to); if (x) { r = label(x.m, x.n, p.sex) + ' by marriage'; return true; } return false; });
        return r || 'related by marriage';
    }
    function setupViewpoint() {
        var sel = el.viewpoint;
        var people = D.people.slice().sort(function (a, b) { return a.generation - b.generation || L.pos[a.id].x - L.pos[b.id].x; });
        sel.innerHTML = people.map(function (p) { return '<option value="' + esc(p.id) + '">' + esc(p.displayName) + '</option>'; }).join('');
        var saved = null; try { saved = localStorage.getItem('tc_viewpoint'); } catch (_) {}
        S.viewpoint = saved && D.byId[saved] ? saved : D.meta.rootPersonId;
        sel.value = S.viewpoint;
        markViewpoint();
        sel.addEventListener('change', function () {
            S.viewpoint = sel.value; try { localStorage.setItem('tc_viewpoint', S.viewpoint); } catch (_) {}
            markViewpoint(); if (S.drawerFor) renderDrawer(S.drawerFor);
        });
    }
    function markViewpoint() { Object.keys(cardEls).forEach(function (k) { cardEls[k].classList.toggle('is-viewpoint', k === S.viewpoint); }); }

    // =================================================================== DRAWER
    function bindDrawer() {
        el.drawerClose.addEventListener('click', function () { var was = S.sel; closeDrawer(); if (was && cardEls[was]) cardEls[was].focus({ preventScroll: true }); });
        el.drawerBody.addEventListener('click', function (e) {
            var go = e.target.closest('[data-go]'); if (go) { select(go.dataset.go, { open: true, center: true, focus: false }); return; }
            var m = e.target.closest('[data-media]'); if (m) { openLightbox(S.drawerFor, +m.dataset.media, m); return; }
            var r = e.target.closest('[data-read]'); if (r) { openProfile(r.dataset.read); }
        });
    }
    function openDrawer(id) {
        S.drawerFor = id;
        renderDrawer(id);
        if (el.drawer.hidden) { el.drawer.hidden = false; }
        syncNarrow();
        el.drawerBody.scrollTop = 0;
        drawMinimap(); syncRail();
    }
    function closeDrawer() {
        if (el.drawer.hidden) return;
        el.drawer.hidden = true; S.drawerFor = null; syncNarrow();
        if (S.sel && cardEls[S.sel]) cardEls[S.sel].classList.remove('is-selected');
        S.sel = null; highlight(S.hover); drawMinimap();
    }
    function monoHTML(p, cls) { return '<div class="mono' + (p.isLiving ? ' is-living' : '') + (cls ? ' ' + cls : '') + '" aria-hidden="true">' + esc(initials(p)) + '</div>'; }
    function famList(p) {
        var byId = D.byId, out = [];
        (p.parents || []).forEach(function (id) { out.push({ id: id, rel: byId[id].sex === 'F' ? 'mother' : 'father' }); });
        (p.spouses || []).slice().sort(function (a, b) { return a.order - b.order; }).forEach(function (s) { out.push({ id: s.id, rel: (byId[s.id].sex === 'F' ? 'wife' : 'husband') + ((p.spouses || []).length > 1 ? ' (' + (s.order === 1 ? '1st' : '2nd') + ')' : '') }); });
        siblings(p).forEach(function (id) { out.push({ id: id, rel: byId[id].sex === 'F' ? 'sister' : byId[id].sex === 'M' ? 'brother' : 'sibling' }); });
        (p.children || []).forEach(function (id) { out.push({ id: id, rel: byId[id].sex === 'F' ? 'daughter' : byId[id].sex === 'M' ? 'son' : 'child' }); });
        return out;
    }
    function siblings(p) {
        var set = {};
        (p.parents || []).forEach(function (pid) { (D.byId[pid].children || []).forEach(function (c) { if (c !== p.id) set[c] = true; }); });
        return Object.keys(set).sort(function (a, b) { return (D.byId[a].order || 0) - (D.byId[b].order || 0); });
    }
    function chipAv(p) { return '<span class="ch-av" aria-hidden="true">' + (p.photo ? '<img src="' + esc(p.photo) + '" alt="">' : esc(initials(p))) + '</span>'; }
    function renderDrawer(id) {
        var p = D.byId[id];
        var hero = p.portrait ? '<div class="dr-hero"><img src="' + esc(p.portrait) + '" alt="Portrait of ' + esc(p.displayName) + '"></div>'
                 : p.photo ? '<div class="dr-hero is-mono"><div class="mono mono--photo"><img src="' + esc(p.photo) + '" alt="Portrait of ' + esc(p.displayName) + '"></div></div>'
                 : '<div class="dr-hero is-mono">' + monoHTML(p) + '</div>';
        var variants = (p.nameVariants || []).filter(function (v) { return v.name !== p.displayName; });
        var life = '';
        if (!p.isLiving) {
            if (p.birth) life += '<dt>Born</dt><dd>' + esc(p.birth.display) + (p.birth.place ? ', ' + esc(p.birth.place) : '') + (p.birth.alternates ? ' <span class="note">(or ' + esc(p.birth.alternates.map(function (a) { return a.display; }).join(', ')) + ')</span>' : '') + '</dd>';
            if (p.death) life += '<dt>Died</dt><dd>' + esc(p.death.display) + (p.death.place ? ', ' + esc(p.death.place) : '') + '</dd>';
            if (p.immigration && p.immigration.ship) life += '<dt>Arrived</dt><dd>' + esc(p.immigration.ship) + ', ' + esc(fmtDate(p.immigration.date)) + '</dd>';
            var places = uniq((p.residences || []).map(function (r) { return r.place; }));
            if (places.length) life += '<dt>Lived</dt><dd>' + esc(places.join('; ')) + '</dd>';
        } else {
            life = '<dt>Status</dt><dd>Living. Shown with name and relationship only.</dd>';
        }
        var rel = relationship(S.viewpoint, id);
        var vp = D.byId[S.viewpoint];
        var media = (p.media || []).map(function (m, i) {
            return '<button type="button" data-media="' + i + '" aria-label="Open ' + esc(m.caption) + '"><img src="' + esc(m.thumb) + '" alt="" loading="lazy"></button>';
        }).join('');
        var fam = famList(p).map(function (f) { var q = D.byId[f.id]; return '<button type="button" class="chip" data-go="' + esc(q.id) + '">' + chipAv(q) + esc(q.displayName) + ' <small>' + esc(f.rel) + '</small></button>'; }).join('');
        el.drawerBody.innerHTML =
            hero + '<div class="dr-in">' +
            '<p class="dr-kicker">' + (p.isDirectLine ? "Seb's direct line · " : '') + 'Generation ' + esc(genLabel(p.generation)) + '</p>' +
            '<h2 class="dr-name" id="drawerName">' + esc(p.displayName) + '</h2>' +
            (p.disambiguator ? '<p class="dr-dis">' + esc(p.disambiguator) + '</p>' : '') +
            (variants.length ? '<p class="dr-variants"><b>Also recorded as</b> ' + esc(variants.map(function (v) { return v.name; }).join(' · ')) + '</p>' : '') +
            '<dl class="dr-life">' + life + '</dl>' +
            (rel ? '<p class="dr-rel"><span>Relationship to ' + esc(vp.givenNames || vp.displayName) + '</span>' + esc(cap(rel)) + '</p>' : '') +
            '<p class="dr-summary">' + esc(p.summary) + '</p>' +
            (media ? '<div class="dr-sec"><h3>Records and photographs</h3><div class="strip">' + media + '</div></div>' : '') +
            (fam ? '<div class="dr-sec"><h3>Family</h3><div class="chips">' + fam + '</div></div>' : '') +
            '<button type="button" class="dr-cta" data-read="' + esc(p.id) + '">Read full story<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><path d="M8 4l6 6-6 6"/></svg></button>' +
            '</div>';
        el.drawer.setAttribute('aria-label', p.displayName);
    }
    function genLabel(g) { var x = (D.meta.generations || []).filter(function (r) { return r.generation === g; })[0]; return x ? x.label : String(g + 1); }
    function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
    function uniq(a) { var o = []; a.forEach(function (x) { if (x && o.indexOf(x) < 0) o.push(x); }); return o; }
    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    function fmtDate(d) {
        if (!d) return '';
        var m = String(d).match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/); if (!m) return d;
        if (m[3]) return MONTHS[+m[2] - 1] + ' ' + (+m[3]) + ', ' + m[1];
        if (m[2]) return MONTHS[+m[2] - 1] + ' ' + m[1];
        return m[1];
    }

    // =================================================================== ROUTER + PROFILE
    function route() {
        var m = location.hash.match(/^#\/person\/([a-z0-9\-]+)/);
        if (m && D.byId[m[1]]) {
            if (S.profileFor && S.profileFor !== m[1]) S.depth = (S.depth || 0) + 1;
            showProfile(m[1]);
            if (S.sel !== m[1]) select(m[1], { open: true, ensure: false });
            centerOn(m[1], Math.max(S.s, 0.7), false);
        } else if (S.profileFor) {
            hideProfile();
        }
    }
    function openProfile(id) {
        S.cameFromTree = true; S.depth = 0;
        location.hash = '#/person/' + id;
    }
    function closeProfileNav() {
        if (S.cameFromTree) { var n = (S.depth || 0) + 1; S.cameFromTree = false; S.depth = 0; history.go(-n); }
        else { history.pushState('', document.title, location.pathname + location.search); route(); }
    }
    function bindProfile() {
        el.pfBack.addEventListener('click', closeProfileNav);
        el.pfPrev.addEventListener('click', function () { if (el.pfPrev.dataset.id) location.hash = '#/person/' + el.pfPrev.dataset.id; });
        el.pfNext.addEventListener('click', function () { if (el.pfNext.dataset.id) location.hash = '#/person/' + el.pfNext.dataset.id; });
        el.pfArticle.addEventListener('click', function (e) {
            var sc = e.target.closest('[data-scroll]');
            if (sc) { e.preventDefault(); var t = $(sc.dataset.scroll); if (t) { t.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); } return; }
            var go = e.target.closest('[data-person]'); if (go) { e.preventDefault(); location.hash = '#/person/' + go.dataset.person; return; }
            var m = e.target.closest('[data-media]'); if (m) { openLightbox(S.profileFor, +m.dataset.media, m); }
        });
    }
    function hideProfile() {
        el.profile.hidden = true; document.body.classList.remove('pf-open');
        document.title = 'Interactive Family Tree: Belfiore & Circelli';
        var id = S.profileFor; S.profileFor = null;
        if (id && cardEls[id]) { select(id, { open: true, ensure: true }); cardEls[id].focus({ preventScroll: true }); }
    }
    function showProfile(id) {
        var p = D.byId[id];
        S.profileFor = id;
        el.pfArticle.innerHTML = profileHTML(p);
        var i = L.order.indexOf(id), prev = L.order[i - 1], next = L.order[i + 1];
        setStep(el.pfPrev, el.pfPrevName, prev, 'Previous');
        setStep(el.pfNext, el.pfNextName, next, 'Next');
        el.profile.hidden = false; document.body.classList.add('pf-open');
        el.pfScroll.scrollTop = 0;
        document.title = p.displayName + ' · Belfiore & Circelli';
        var h = $('pfName'); if (h) h.focus({ preventScroll: true });
    }
    function setStep(btn, span, id, word) {
        btn.disabled = !id; btn.dataset.id = id || '';
        span.textContent = id ? D.byId[id].displayName : word;
        btn.setAttribute('aria-label', id ? word + ' profile: ' + D.byId[id].displayName : 'No ' + word.toLowerCase() + ' profile');
    }

    // ---- markdown with footnotes
    function sourceNumbers(p) {
        var order = [], seen = {};
        function add(id) { if (id && !seen[id] && D.sources[id]) { seen[id] = true; order.push(id); } }
        (p.story || '').replace(/\[\^([a-z0-9\-]+)\]/g, function (_, id) { add(id); return ''; });
        function addAll(a) { (a || []).forEach(add); }
        ['birth', 'death'].forEach(function (k) { if (p[k]) { addAll(p[k].sourceIds); (p[k].alternates || []).forEach(function (x) { addAll(x.sourceIds); }); } });
        if (p.immigration) addAll(p.immigration.sourceIds);
        (p.residences || []).forEach(function (r) { addAll(r.sourceIds); });
        (p.occupations || []).forEach(function (r) { addAll(r.sourceIds); });
        (p.spouses || []).forEach(function (r) { addAll(r.sourceIds); });
        (p.facts || []).forEach(function (r) { addAll(r.sourceIds); });
        (p.nameVariants || []).forEach(function (r) { addAll(r.sourceIds); });
        (p.timeline || []).forEach(function (r) { addAll(r.sourceIds); });
        (p.media || []).forEach(function (m) { add(m.sourceId); });
        var num = {}; order.forEach(function (id, i) { num[id] = i + 1; });
        return { order: order, num: num };
    }
    function inline(s, num) {
        s = esc(s);
        s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
        s = s.replace(/\[([^\]]+)\]\((https?:[^)\s]+|[a-z0-9\-\.\/#]+)\)/g, '<a href="$2">$1</a>');
        s = s.replace(/(?:\[\^[a-z0-9\-]+\])+/g, function (run) {
            var ids = run.match(/[a-z0-9\-]+/g) || [];
            var links = ids.filter(function (id) { return num[id]; }).map(function (id) {
                var n = num[id];
                return '<a href="#src-' + n + '" data-scroll="src-' + n + '" aria-label="Source ' + n + '">' + n + '</a>';
            });
            return links.length ? '<sup class="fn">' + links.join(',') + '</sup>' : '';
        });
        return s;
    }
    function md(text, num) {
        var out = [], list = null;
        String(text || '').split(/\n\s*\n/).forEach(function (block) {
            block = block.trim(); if (!block) return;
            if (/^## /.test(block)) { out.push('<h3>' + inline(block.slice(3), num) + '</h3>'); return; }
            if (/^- /m.test(block) && block.split('\n').every(function (l) { return /^- /.test(l.trim()) || !l.trim(); })) {
                out.push('<ul>' + block.split('\n').filter(function (l) { return l.trim(); }).map(function (l) { return '<li>' + inline(l.trim().slice(2), num) + '</li>'; }).join('') + '</ul>');
                return;
            }
            out.push('<p>' + inline(block.replace(/\n/g, ' '), num) + '</p>');
        });
        return out.join('');
    }
    function srcRefs(ids, num) {
        var links = (ids || []).filter(function (id) { return num[id]; }).map(function (id) {
            return '<a href="#src-' + num[id] + '" data-scroll="src-' + num[id] + '" aria-label="Source ' + num[id] + '">' + num[id] + '</a>';
        });
        return links.length ? '<sup class="fn">' + links.join(',') + '</sup>' : '';
    }
    function confTag(c) { return '<span class="conf-tag ' + confClass(c) + '">' + esc(confLabel(c)) + '</span>'; }

    function profileHTML(p) {
        var sn = sourceNumbers(p), num = sn.num;
        var byId = D.byId;
        var hero;
        if (p.portrait) hero = '<div class="pf-portrait"><img src="' + esc(p.portrait) + '" alt="Portrait of ' + esc(p.displayName) + '"></div>';
        else if (p.photo) hero = '<div class="pf-portrait is-mono"><div class="mono mono--photo"><img src="' + esc(p.photo) + '" alt="Portrait of ' + esc(p.displayName) + '"></div><div class="pf-place">' + esc(p.cardPlace || '') + '</div></div>';
        else hero = '<div class="pf-portrait is-mono">' + monoHTML(p) + '<div class="pf-place">' + esc(p.cardPlace || (p.isLiving ? 'Living' : '')) + '</div></div>';
        var variants = (p.nameVariants || []).filter(function (v) { return v.name !== p.displayName; });
        var dates = '';
        if (!p.isLiving) {
            if (p.birth) dates += '<div><span>Born</span>' + esc(p.birth.display) + (p.birth.alternates ? ' or ' + esc(p.birth.alternates.map(function (a) { return a.display; }).join(', ')) : '') + (p.birth.place ? '<small>' + esc(p.birth.place) + '</small>' : '') + '</div>';
            if (p.death) dates += '<div><span>Died</span>' + esc(p.death.display) + (p.death.place ? '<small>' + esc(p.death.place) + '</small>' : '') + '</div>';
            if (p.immigration && p.immigration.ship) dates += '<div><span>Arrived</span>' + esc(p.immigration.ship) + ', ' + esc(fmtDate(p.immigration.date)) + '</div>';
        }
        var badges = (p.isDirectLine ? '<span class="badge badge--direct">Seb\'s direct line</span>' : '') +
                     (p.isLiving ? '<span class="badge badge--living">Living</span>' : '') +
                     '<span class="badge">Generation ' + esc(genLabel(p.generation)) + '</span>' +
                     (p.confidence ? '<span class="badge ' + confClass(p.confidence) + '">Overall: ' + esc(p.confidence) + '</span>' : '');
        var rel = relationship(S.viewpoint, p.id), vp = byId[S.viewpoint];

        // sections
        var secs = [];
        secs.push(['pf-story', 'The story', '<div class="pf-story">' + md(p.story, num) + '</div>']);

        if (!p.isLiving) {
            var rows = [];
            function row(label, value, ids, conf, note) { rows.push('<tr><th scope="row">' + esc(label) + '</th><td>' + value + (note ? '<span class="note">' + esc(note) + '</span>' : '') + '</td><td class="conf">' + confTag(conf) + '</td><td class="src">' + (srcRefs(ids, num) || '<span class="note">none</span>') + '</td></tr>'); }
            if (p.birth) {
                row('Born', esc(p.birth.display) + (p.birth.place ? ', ' + esc(p.birth.place) : ''), p.birth.sourceIds, p.birth.confidence, p.birth.note);
                (p.birth.alternates || []).forEach(function (a) { row('Born (other record)', esc(a.display), a.sourceIds, 'confirmed', a.note ? 'As recorded on the ' + a.note : null); });
            }
            if (p.death) row('Died', esc(p.death.display) + (p.death.place ? ', ' + esc(p.death.place) : ''), p.death.sourceIds, p.death.confidence, p.death.note);
            if (p.immigration) {
                var im = p.immigration;
                row('Immigration', esc([im.ship, im.date ? fmtDate(im.date) : null, im.port, im.age ? 'age ' + im.age : null].filter(Boolean).join(', ') || 'Not yet found'), im.sourceIds, im.confidence, im.note);
            }
            (p.spouses || []).slice().sort(function (a, b) { return a.order - b.order; }).forEach(function (s) {
                row((p.spouses.length > 1 ? (s.order === 1 ? 'First marriage' : 'Second marriage') : 'Marriage'),
                    '<a href="#/person/' + esc(s.id) + '" data-person="' + esc(s.id) + '">' + esc(byId[s.id].displayName) + '</a>' + (s.marriageDisplay ? ', ' + esc(s.marriageDisplay) : '') + (s.place ? ', ' + esc(s.place) : ''),
                    s.sourceIds, s.confidence, s.note);
            });
            (p.residences || []).forEach(function (r) { row('Residence' + (r.years ? ' (' + r.years + ')' : ''), esc([r.address, r.place].filter(Boolean).join(', ')), r.sourceIds, r.confidence); });
            (p.occupations || []).forEach(function (o) { row('Occupation' + (o.years ? ' (' + o.years + ')' : ''), esc([o.title, o.employer, o.place].filter(Boolean).join(', ')), o.sourceIds, o.confidence); });
            (p.facts || []).forEach(function (f) { row(f.label, esc(f.value), f.sourceIds, f.confidence); });
            (p.nameVariants || []).forEach(function (v) { if (v.name !== p.displayName) row('Also recorded as', esc(v.name), v.sourceIds, v.confidence || (v.sourceIds.length ? 'confirmed' : 'unverified'), v.note); });
            if (rows.length) secs.push(['pf-glance', 'At a glance', '<table class="facts"><thead class="visually-hidden"><tr><th>Fact</th><th>Detail</th><th>Confidence</th><th>Sources</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>']);

            var tl = (p.timeline || []).slice().sort(function (a, b) { return String(a.date).localeCompare(String(b.date)); });
            if (tl.length) secs.push(['pf-timeline', 'Timeline', '<ol class="tline">' + tl.map(function (t) {
                return '<li class="' + (t.kind === 'context' ? 'is-context' : '') + '"><span class="t-date">' + esc(t.label) + (t.kind === 'context' ? ' · context' : '') + '</span>' + esc(t.event) +
                       (t.kind !== 'context' && t.confidence !== 'confirmed' ? '<span class="t-note">' + esc(t.confidence) + '</span>' : '') + srcRefs(t.sourceIds, num) + '</li>';
            }).join('') + '</ol>']);
        }

        if ((p.media || []).length) secs.push(['pf-docs', 'Documents and photographs', '<div class="gallery">' + p.media.map(function (m, i) {
            return '<button type="button" data-media="' + i + '"><span class="g-img"><img src="' + esc(m.thumb) + '" alt="' + esc(m.alt) + '" loading="lazy"></span>' +
                   '<span class="g-type">' + esc(m.type === 'clipping' ? 'Clipping' : m.type === 'photo' ? 'Photograph' : 'Record') + (m.transcription ? ' · transcribed' : m.summary ? ' · summarized' : '') + '</span>' +
                   '<span class="g-cap">' + esc(m.caption) + '</span></button>';
        }).join('') + '</div>']);

        var fam = famList(p);
        if (fam.length) {
            var groups = [['Parents', ['father', 'mother']], ['Spouses', ['wife', 'husband']], ['Brothers and sisters', ['brother', 'sister', 'sibling']], ['Children', ['son', 'daughter', 'child']]];
            var fh = '';
            groups.forEach(function (g) {
                var items = fam.filter(function (f) { return g[1].indexOf(f.rel.split(' ')[0]) >= 0; });
                if (!items.length) return;
                fh += '<h3>' + g[0] + '</h3>' + items.map(function (f) {
                    var q = byId[f.id];
                    return '<button type="button" class="fam-card" data-person="' + esc(q.id) + '"><span class="c-av" aria-hidden="true">' + (q.photo ? '<img src="' + esc(q.photo) + '" alt="">' : esc(initials(q))) + '</span><span><b>' + esc(q.displayName) + '</b><small>' + esc(cap(f.rel)) + (lifeLine(q) ? ' · ' + esc(lifeLine(q)) : '') + '</small></span></button>';
                }).join('');
            });
            secs.push(['pf-family', 'Family', '<div class="fam">' + fh + '</div>']);
        }

        if ((p.openQuestions || []).length) secs.push(['pf-questions', 'Still to discover', '<div class="oq">' + p.openQuestions.map(function (q) {
            return '<div class="oq-item"><p>' + esc(q.question) + '</p><p class="oq-rec"><b>Where to look</b>' + esc(q.record) + '</p></div>';
        }).join('') + '</div>']);

        if (sn.order.length) secs.push(['pf-sources', 'Sources', '<ol class="srcs">' + sn.order.map(function (id, i) {
            var s = D.sources[id];
            var link = s.url ? ' <a href="' + esc(s.url) + '" target="_blank" rel="noopener">Open</a>' : s.file ? ' <a href="' + esc(encodeURI(s.file)) + '" target="_blank" rel="noopener">View file</a>' : '';
            return '<li id="src-' + (i + 1) + '"><span>' + esc(s.title) + '</span>' + link + '<span class="s-meta">' + esc([s.type, s.repository, s.date].filter(Boolean).join(' · ')) + (s.note ? '. ' + esc(s.note) : '') + '</span></li>';
        }).join('') + '</ol>']);

        if ((p.relatedPages || []).length) secs.push(['pf-more', 'Read more', '<div class="more">' + p.relatedPages.map(function (r) {
            return '<a href="' + esc(r.url) + '">' + esc(r.title) + '<svg class="i" viewBox="0 0 20 20" aria-hidden="true"><path d="M8 4l6 6-6 6"/></svg></a>';
        }).join('') + '</div>']);

        var toc = '<nav class="pf-toc" aria-label="Sections of this profile">' + secs.map(function (s) { return '<a href="#' + s[0] + '" data-scroll="' + s[0] + '">' + esc(s[1]) + '</a>'; }).join('') + '</nav>';
        var i = L.order.indexOf(p.id), prev = L.order[i - 1], next = L.order[i + 1];
        var foot = '<div class="pf-foot">' +
            (prev ? '<button type="button" data-person="' + esc(prev) + '"><small>Previous</small>' + esc(byId[prev].displayName) + '</button>' : '<span></span>') +
            (next ? '<button type="button" data-person="' + esc(next) + '"><small>Next</small>' + esc(byId[next].displayName) + '</button>' : '<span></span>') + '</div>';

        return '<header class="pf-hero">' + hero + '<div>' +
               '<p class="pf-kicker">' + (p.isDirectLine ? "Seb's direct line" : 'Belfiore & Circelli family') + '</p>' +
               '<h1 class="pf-name" id="pfName" tabindex="-1">' + esc(p.displayName) + '</h1>' +
               (p.disambiguator ? '<p class="pf-dis">' + esc(p.disambiguator) + '</p>' : '') +
               (dates ? '<div class="pf-dates">' + dates + '</div>' : '') +
               (variants.length ? '<p class="pf-variants"><b>Also recorded as</b> ' + esc(variants.map(function (v) { return v.name; }).join(' · ')) + '</p>' : '') +
               (rel ? '<p class="pf-variants"><b>Relationship to ' + esc(vp.givenNames || vp.displayName) + ':</b> ' + esc(rel) + '</p>' : '') +
               '<div class="pf-badges">' + badges + '</div>' +
               '</div></header>' + toc +
               secs.map(function (s) { return '<section class="pf-sec" id="' + s[0] + '" aria-labelledby="' + s[0] + '-h"><h2 id="' + s[0] + '-h">' + esc(s[1]) + '</h2>' + s[2] + '</section>'; }).join('') +
               foot;
    }

    // =================================================================== LIGHTBOX
    var LB = { list: [], i: 0, s: 1, tx: 0, ty: 0, fit: 1, opener: null, tab: 'transcription' };
    function bindLightbox() {
        el.lbClose.addEventListener('click', closeLightbox);
        el.lbIn.addEventListener('click', function () { lbZoom(1.3); });
        el.lbOut.addEventListener('click', function () { lbZoom(1 / 1.3); });
        el.lbReset.addEventListener('click', lbFit);
        el.lbImg.addEventListener('load', lbFit);
        var st = el.lbStage, ptrs = {}, start = null, pinch = null;
        st.addEventListener('pointerdown', function (e) {
            ptrs[e.pointerId] = { x: e.clientX, y: e.clientY }; st.setPointerCapture(e.pointerId);
            var ids = Object.keys(ptrs);
            if (ids.length === 1) { start = { x: e.clientX, y: e.clientY, tx: LB.tx, ty: LB.ty }; st.classList.add('is-panning'); }
            else if (ids.length === 2) { var a = ptrs[ids[0]], b = ptrs[ids[1]]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: LB.s }; }
        });
        st.addEventListener('pointermove', function (e) {
            if (!ptrs[e.pointerId]) return; ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
            var ids = Object.keys(ptrs);
            if (ids.length >= 2 && pinch) { var a = ptrs[ids[0]], b = ptrs[ids[1]]; var r = st.getBoundingClientRect(); lbZoomAt((a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, pinch.s * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d, true); return; }
            if (start) { LB.tx = start.tx + e.clientX - start.x; LB.ty = start.ty + e.clientY - start.y; lbApply(); }
        });
        function up(e) { delete ptrs[e.pointerId]; if (!Object.keys(ptrs).length) { start = null; pinch = null; st.classList.remove('is-panning'); } }
        st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
        st.addEventListener('wheel', function (e) { e.preventDefault(); var r = st.getBoundingClientRect(); lbZoomAt(e.clientX - r.left, e.clientY - r.top, LB.s * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018))); }, { passive: false });
        st.addEventListener('dblclick', function (e) { var r = st.getBoundingClientRect(); lbZoomAt(e.clientX - r.left, e.clientY - r.top, LB.s * 2); });
        el.lbStrip.addEventListener('click', function (e) { var b = e.target.closest('[data-i]'); if (b) lbShow(+b.dataset.i); });
        el.lbSide.addEventListener('click', function (e) {
            var t = e.target.closest('[data-tab]'); if (!t) return; LB.tab = t.dataset.tab; lbSide();
            var nt = el.lbSide.querySelector('[data-tab="' + LB.tab + '"]'); if (nt) nt.focus();
        });
        window.addEventListener('resize', function () { if (!el.lightbox.hidden) lbFit(); });
    }
    function openLightbox(personId, i, opener) {
        var p = D.byId[personId]; if (!p || !p.media || !p.media.length) return;
        LB.list = p.media; LB.opener = opener || document.activeElement; LB.tab = 'transcription';
        el.lbStrip.innerHTML = LB.list.length > 1 ? LB.list.map(function (m, k) { return '<button type="button" data-i="' + k + '" aria-label="' + esc(m.caption) + '"><img src="' + esc(m.thumb) + '" alt=""></button>'; }).join('') : '';
        el.lightbox.hidden = false; document.body.classList.add('lb-open');
        lbShow(i || 0);
        el.lbClose.focus();
    }
    function closeLightbox() {
        el.lightbox.hidden = true; document.body.classList.remove('lb-open');
        el.lbImg.removeAttribute('src');
        if (LB.opener && LB.opener.focus) LB.opener.focus();
    }
    function lbShow(i) {
        LB.i = (i + LB.list.length) % LB.list.length;
        var m = LB.list[LB.i];
        el.lbTitle.textContent = m.caption;
        el.lbImg.alt = m.alt || m.caption;
        el.lbImg.src = m.file;
        el.lbOpen.href = encodeURI(m.pdf || m.file);
        el.lbOpen.textContent = m.pdf ? 'Open PDF' : 'Open original';
        Array.prototype.forEach.call(el.lbStrip.children, function (b, k) { b.setAttribute('aria-current', k === LB.i ? 'true' : 'false'); });
        if (!m.transcription && LB.tab !== 'summary') LB.tab = m.summary ? 'summary' : 'about';
        if (m.transcription && LB.tab === 'summary') LB.tab = 'transcription';
        lbSide();
    }
    function lbSide() {
        var m = LB.list[LB.i], s = D.sources[m.sourceId] || {};
        var tabs = [];
        if (m.transcription) tabs.push(['transcription', m.translation ? 'Original text' : 'Transcription']);
        if (m.translation) tabs.push(['translation', 'English translation']);
        if (m.summary) tabs.push(['summary', 'Summary']);
        var body = LB.tab === 'translation' ? m.translation : LB.tab === 'summary' ? m.summary : LB.tab === 'transcription' ? m.transcription : '';
        el.lbSide.innerHTML =
            '<h3>About this item</h3><p>' + esc(m.caption) + '</p>' +
            '<h3>Record</h3><p class="rec">' + esc(s.title || '') + (s.repository ? '. ' + esc(s.repository) : '') + (s.date ? ' (' + esc(s.date) + ')' : '') + (s.note ? '. ' + esc(s.note) : '') + '</p>' +
            (tabs.length ? '<div class="lb-tabs" role="tablist">' + tabs.map(function (t) { return '<button type="button" role="tab" data-tab="' + t[0] + '" aria-selected="' + (LB.tab === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div>' +
                '<div class="lb-text" role="tabpanel" tabindex="0">' + esc(body || '') + '</div>' +
                (m.transcription ? '<p class="rec">The original scan is shown beside this text. Readings marked uncertain are flagged in brackets.</p>' : '')
                : '<p class="rec">No transcription yet.</p>');
    }
    function lbFit() {
        var r = el.lbStage.getBoundingClientRect(), iw = el.lbImg.naturalWidth || 1, ih = el.lbImg.naturalHeight || 1;
        LB.fit = Math.min((r.width - 32) / iw, (r.height - 32) / ih, 1.5);
        LB.s = LB.fit; LB.tx = (r.width - iw * LB.s) / 2; LB.ty = (r.height - ih * LB.s) / 2; lbApply();
    }
    function lbApply() { el.lbImg.style.transform = 'translate(' + LB.tx + 'px,' + LB.ty + 'px) scale(' + LB.s + ')'; }
    function lbZoomAt(x, y, ns, abs) {
        ns = clamp(ns, LB.fit * 0.5, 8);
        var wx = (x - LB.tx) / LB.s, wy = (y - LB.ty) / LB.s;
        LB.s = ns; LB.tx = x - wx * ns; LB.ty = y - wy * ns; lbApply();
    }
    function lbZoom(k) { var r = el.lbStage.getBoundingClientRect(); lbZoomAt(r.width / 2, r.height / 2, LB.s * k); }
    function lbKeys(e) {
        if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
        else if (e.key === 'ArrowRight' && !e.target.closest('.lb-text')) { lbShow(LB.i + 1); }
        else if (e.key === 'ArrowLeft' && !e.target.closest('.lb-text')) { lbShow(LB.i - 1); }
        else if (e.key === '+' || e.key === '=') lbZoom(1.3);
        else if (e.key === '-') lbZoom(1 / 1.3);
        else if (e.key === 'Tab') trapFocus(e, el.lightbox);
    }

    // expose for tests
    window.__tree = { L: L, D: D, S: S, select: select, centerOn: centerOn, fitView: fitView, CW: CW, CH: CH };
})();
