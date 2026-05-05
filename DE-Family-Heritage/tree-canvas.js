/* ============================================================
   INTERACTIVE FAMILY TREE CANVAS
   ------------------------------------------------------------
   - Pan & zoom infinite canvas (vanilla JS)
   - Layout algorithm: generation rows + couple grouping
   - SVG orthogonal lines for parent-child, curves for spouse
   - Click to select, detail panel, search, fit-to-view
   ============================================================ */

(function () {
    'use strict';

    // ---------- Config ----------
    const CONFIG = {
        nodeWidth: 180,
        nodeHeight: 92,
        hSpacing: 32,            // horizontal gap between sibling nodes
        coupleGap: 16,           // horizontal gap between spouses
        vSpacing: 220,           // vertical distance between generations
        minZoom: 0.25,
        maxZoom: 2.5,
        zoomStep: 0.15,
        fitPadding: 80
    };

    // ---------- DOM refs (populated in init) ----------
    let stage, viewport, world, svg, nodesLayer, emptyEl, genRail,
        detailBody, detailPanel, detailClose,
        btnZoomIn, btnZoomOut, btnZoomLevel, btnFit, btnCenter,
        toolSearch, viewpointSelect;

    function captureDOM() {
        stage       = document.getElementById('canvasStage');
        viewport    = document.getElementById('canvasViewport');
        world       = document.getElementById('canvasWorld');
        svg         = document.getElementById('canvasSvg');
        nodesLayer  = document.getElementById('canvasNodes');
        emptyEl     = document.getElementById('canvasEmpty');
        genRail     = document.getElementById('genRail');
        detailBody  = document.getElementById('detailBody');
        detailPanel = document.getElementById('detailPanel');
        detailClose = document.getElementById('detailClose');
        btnZoomIn   = document.getElementById('btnZoomIn');
        btnZoomOut  = document.getElementById('btnZoomOut');
        btnZoomLevel= document.getElementById('btnZoomLevel');
        btnFit      = document.getElementById('btnFit');
        btnCenter   = document.getElementById('btnCenter');
        toolSearch  = document.getElementById('toolSearch');
        viewpointSelect = document.getElementById('viewpointSelect');
    }

    // ---------- State ----------
    const state = {
        tx: 0, ty: 0, scale: 1,
        isPanning: false,
        panStart: { x: 0, y: 0, tx: 0, ty: 0 },
        selectedId: null,
        viewpointId: null,        // "who am I" selection
        nodeEls: new Map(),       // id -> element
        nodePos: new Map(),       // id -> {x, y}
        bounds: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
        peopleById: new Map(),
        childrenByParent: new Map(),
        parentsByChild: new Map(),
        spousesById: new Map()
    };

    // ---------- Index data ----------
    function indexData(data) {
        data.people.forEach(p => state.peopleById.set(p.id, p));

        data.relationships.forEach(rel => {
            if (rel.type === 'parent_child') {
                if (!state.childrenByParent.has(rel.fromPersonId)) {
                    state.childrenByParent.set(rel.fromPersonId, []);
                }
                state.childrenByParent.get(rel.fromPersonId).push(rel.toPersonId);

                if (!state.parentsByChild.has(rel.toPersonId)) {
                    state.parentsByChild.set(rel.toPersonId, []);
                }
                state.parentsByChild.get(rel.toPersonId).push(rel.fromPersonId);
            } else if (rel.type === 'spouse') {
                if (!state.spousesById.has(rel.fromPersonId)) state.spousesById.set(rel.fromPersonId, []);
                if (!state.spousesById.has(rel.toPersonId)) state.spousesById.set(rel.toPersonId, []);
                state.spousesById.get(rel.fromPersonId).push(rel.toPersonId);
                state.spousesById.get(rel.toPersonId).push(rel.fromPersonId);
            }
        });
    }

    // ---------- Layout algorithm (recursive subtree) ----------
    function unitWidth(unit) {
        return unit.kind === 'couple'
            ? CONFIG.nodeWidth * 2 + CONFIG.coupleGap
            : CONFIG.nodeWidth;
    }

    function buildUnits() {
        const byPerson = new Map();
        const all = [];
        const gens = new Set();
        state.peopleById.forEach(p => gens.add(p.generation ?? 0));
        const genList = Array.from(gens).sort((a, b) => a - b);

        genList.forEach(g => {
            const folks = Array.from(state.peopleById.values())
                .filter(p => (p.generation ?? 0) === g)
                .sort((a, b) => (a.birthYear || 9999) - (b.birthYear || 9999));

            folks.forEach(p => {
                if (byPerson.has(p.id)) return;
                const spouses = (state.spousesById.get(p.id) || [])
                    .map(sid => state.peopleById.get(sid))
                    .filter(s => s && (s.generation ?? 0) === g && !byPerson.has(s.id));

                let primary = null;
                if (spouses.length) {
                    const kids = state.childrenByParent.get(p.id) || [];
                    let best = spouses[0], bestN = -1;
                    spouses.forEach(sp => {
                        const n = kids.filter(cid =>
                            (state.parentsByChild.get(cid) || []).includes(sp.id)
                        ).length;
                        if (n > bestN) { bestN = n; best = sp; }
                    });
                    primary = best;
                }

                if (primary) {
                    const u = { kind:'couple', people:[p, primary], generation:g,
                        children:[], parentUnit:null, subtreeWidth:0, x:0, y:0 };
                    all.push(u); byPerson.set(p.id, u); byPerson.set(primary.id, u);
                } else {
                    const u = { kind:'single', people:[p], generation:g,
                        children:[], parentUnit:null, subtreeWidth:0, x:0, y:0 };
                    all.push(u); byPerson.set(p.id, u);
                }
            });
        });
        return { all, byPerson, genList };
    }

    function linkUnits(all, byPerson) {
        all.forEach(unit => {
            // Check ALL people in this unit for parents (not just people[0])
            let parents = [];
            for (const person of unit.people) {
                const p = state.parentsByChild.get(person.id) || [];
                if (p.length) { parents = p; break; }
            }
            if (!parents.length) return;

            let parentUnit = null;
            // Prefer a couple unit that contains BOTH parents
            for (const pu of all) {
                if (pu.kind !== 'couple') continue;
                if (parents.every(pp => pu.people.some(x => x.id === pp)))
                    { parentUnit = pu; break; }
            }
            // Fallback: prefer a unit whose "other" member is also a parent
            if (!parentUnit) {
                for (const pp of parents) {
                    const pu = byPerson.get(pp);
                    if (!pu) continue;
                    if (pu.kind === 'couple') {
                        const other = pu.people.find(x => x.id !== pp);
                        if (other && !parents.includes(other.id)) continue;
                    }
                    parentUnit = pu; break;
                }
            }
            // Last resort: any parent's unit
            if (!parentUnit) {
                for (const pp of parents) {
                    const pu = byPerson.get(pp);
                    if (pu) { parentUnit = pu; break; }
                }
            }
            if (parentUnit && parentUnit !== unit) {
                unit.parentUnit = parentUnit;
                if (!parentUnit.children.includes(unit))
                    parentUnit.children.push(unit);
            }
        });
    }

    function computeSubtreeWidth(unit) {
        const ow = unitWidth(unit);
        if (!unit.children.length) { unit.subtreeWidth = ow; return ow; }
        unit.children.sort((a, b) =>
            (a.people[0].birthYear || 9999) - (b.people[0].birthYear || 9999));
        let cw = 0;
        unit.children.forEach((c, i) => {
            cw += computeSubtreeWidth(c);
            if (i < unit.children.length - 1) cw += CONFIG.hSpacing;
        });
        unit.subtreeWidth = Math.max(ow, cw);
        return unit.subtreeWidth;
    }

    function placeUnit(unit, leftX, yByGen) {
        const ow = unitWidth(unit);
        unit.x = leftX + (unit.subtreeWidth - ow) / 2;
        unit.y = yByGen.get(unit.generation) || 0;

        if (!unit.children.length) return;
        let totalCW = 0;
        unit.children.forEach((c, i) => {
            totalCW += c.subtreeWidth;
            if (i < unit.children.length - 1) totalCW += CONFIG.hSpacing;
        });
        const parentMid = unit.x + ow / 2;
        let cx = Math.max(leftX, parentMid - totalCW / 2);
        if (cx + totalCW > leftX + unit.subtreeWidth)
            cx = leftX + unit.subtreeWidth - totalCW;

        unit.children.forEach(c => {
            placeUnit(c, cx, yByGen);
            cx += c.subtreeWidth + CONFIG.hSpacing;
        });
    }

    function layout() {
        const { all, byPerson, genList } = buildUnits();
        linkUnits(all, byPerson);

        const yByGen = new Map();
        let y = 0;
        genList.forEach(g => { yByGen.set(g, y); y += CONFIG.vSpacing; });

        const roots = all.filter(u => !u.parentUnit)
            .sort((a, b) => a.generation - b.generation
                || (a.people[0].birthYear||9999) - (b.people[0].birthYear||9999));
        roots.forEach(r => computeSubtreeWidth(r));

        let cursor = 0;
        roots.forEach(r => {
            placeUnit(r, cursor, yByGen);
            cursor += r.subtreeWidth + CONFIG.hSpacing * 2;
        });

        state.nodePos.clear();
        let minX = Infinity, maxX = -Infinity;
        all.forEach(unit => {
            if (unit.kind === 'couple') {
                state.nodePos.set(unit.people[0].id, { x: unit.x, y: unit.y });
                state.nodePos.set(unit.people[1].id, {
                    x: unit.x + CONFIG.nodeWidth + CONFIG.coupleGap, y: unit.y });
            } else {
                state.nodePos.set(unit.people[0].id, { x: unit.x, y: unit.y });
            }
            minX = Math.min(minX, unit.x);
            maxX = Math.max(maxX, unit.x + unitWidth(unit));
        });
        if (minX !== Infinity && minX !== 0) {
            state.nodePos.forEach(pos => { pos.x -= minX; });
            maxX -= minX;
        }
        state.bounds = { minX: 0, minY: 0, maxX: maxX, maxY: y };
        return { gens: genList, yByGen };
    }

    // ---------- Render nodes ----------
    function renderNodes() {
        nodesLayer.innerHTML = '';
        state.nodeEls.clear();
        state.peopleById.forEach(person => {
            const pos = state.nodePos.get(person.id);
            if (!pos) return;
            const el = document.createElement('div');
            el.className = 'node';
            if (person.id === FAMILY_DATA.rootPersonId) el.classList.add('is-root');
            if (person.id === state.viewpointId) el.classList.add('is-viewpoint');
            el.dataset.personId = person.id;
            el.style.left = pos.x + 'px';
            el.style.top = pos.y + 'px';

            const initials = (person.firstName || '?').charAt(0);
            const dates = formatDates(person);
            const conf = person.confidence || 'high';

            el.innerHTML = `
                <span class="node-confidence node-confidence--${conf}" title="Confidence: ${conf}"></span>
                <div class="node-header">
                    <div class="node-avatar">${escapeHtml(initials)}</div>
                    <div class="node-name">
                        ${escapeHtml(person.firstName || '')}
                        <span class="node-surname">${escapeHtml(person.lastName || '')}</span>
                    </div>
                </div>
                <div class="node-meta">
                    <span class="node-dates">${dates}</span>
                    ${person.primaryLocation
                        ? `<span class="node-location">${escapeHtml(person.primaryLocation)}</span>`
                        : ''}
                </div>
            `;
            el.addEventListener('click', ev => {
                ev.stopPropagation();
                selectPerson(person.id);
            });
            nodesLayer.appendChild(el);
            state.nodeEls.set(person.id, el);
        });
    }

    function formatDates(person) {
        const b = person.birthYear ? (person.birthYearApprox ? '~' : '') + person.birthYear : '';
        const d = person.deathYear ? (person.deathYearApprox ? '~' : '') + person.deathYear : '';
        if (b && d) return `${b} – ${d}`;
        if (b && person.isLiving) return `b. ${b}`;
        if (b) return `b. ${b}`;
        if (d) return `d. ${d}`;
        if (person.isLiving) return 'Living';
        return '&mdash;';
    }

    // ---------- Render SVG lines ----------
    function renderLines() {
        svg.innerHTML = '';
        const bounds = state.bounds;
        svg.setAttribute('width', bounds.maxX + 200);
        svg.setAttribute('height', bounds.maxY + 200);

        // Spouse connectors — double line with ring symbol and "married" label
        const drawnSpouses = new Set();
        state.spousesById.forEach((list, id) => {
            list.forEach(otherId => {
                const key = [id, otherId].sort().join('~');
                if (drawnSpouses.has(key)) return;
                drawnSpouses.add(key);
                const a = state.nodePos.get(id);
                const b = state.nodePos.get(otherId);
                if (!a || !b) return;
                if (Math.abs(a.y - b.y) > 1) return;
                const y = a.y + CONFIG.nodeHeight / 2;
                const x1 = Math.min(a.x, b.x) + CONFIG.nodeWidth;
                const x2 = Math.max(a.x, b.x);
                const mid = (x1 + x2) / 2;
                // Double line (top)
                const l1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                l1.setAttribute('class', 'line-spouse');
                l1.setAttribute('x1', x1); l1.setAttribute('x2', x2);
                l1.setAttribute('y1', y - 2); l1.setAttribute('y2', y - 2);
                svg.appendChild(l1);
                // Double line (bottom)
                const l2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                l2.setAttribute('class', 'line-spouse');
                l2.setAttribute('x1', x1); l2.setAttribute('x2', x2);
                l2.setAttribute('y1', y + 2); l2.setAttribute('y2', y + 2);
                svg.appendChild(l2);
                // Ring circle at midpoint
                const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                ring.setAttribute('cx', mid); ring.setAttribute('cy', y);
                ring.setAttribute('r', 5);
                ring.setAttribute('fill', '#fdfaf2');
                ring.setAttribute('stroke', '#8b2020');
                ring.setAttribute('stroke-width', '1.8');
                svg.appendChild(ring);
                // Inner dot
                const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                dot.setAttribute('cx', mid); dot.setAttribute('cy', y);
                dot.setAttribute('r', 1.5);
                dot.setAttribute('fill', '#8b2020');
                svg.appendChild(dot);
            });
        });

        // Parent-child orthogonal lines
        // For each couple with shared children, we draw:
        //   - a short vertical drop from the spouse midpoint,
        //   - a horizontal bus across all children,
        //   - a short vertical rise up to each child's top.
        // For single parents, we drop from the parent's bottom-center.
        const childGroups = new Map(); // parentKey -> {parents: [...ids], children: Set}
        state.peopleById.forEach(child => {
            const parents = state.parentsByChild.get(child.id) || [];
            if (!parents.length) return;
            const key = parents.slice().sort().join('|');
            if (!childGroups.has(key)) {
                childGroups.set(key, { parents, children: new Set() });
            }
            childGroups.get(key).children.add(child.id);
        });

        childGroups.forEach(({ parents, children }) => {
            const parentPositions = parents
                .map(pid => state.nodePos.get(pid))
                .filter(Boolean);
            if (!parentPositions.length || !children.size) return;

            // Compute parent anchor (bottom-center of couple or single)
            let parentAnchorX, parentAnchorY;
            if (parentPositions.length === 2
                && Math.abs(parentPositions[0].y - parentPositions[1].y) < 1) {
                const leftX = Math.min(parentPositions[0].x, parentPositions[1].x);
                const rightX = Math.max(parentPositions[0].x, parentPositions[1].x) + CONFIG.nodeWidth;
                parentAnchorX = (leftX + rightX) / 2;
                parentAnchorY = parentPositions[0].y + CONFIG.nodeHeight;
            } else {
                parentAnchorX = parentPositions[0].x + CONFIG.nodeWidth / 2;
                parentAnchorY = parentPositions[0].y + CONFIG.nodeHeight;
            }

            // Compute bus Y (midway between parent row and child row)
            const childArr = Array.from(children)
                .map(cid => ({ id: cid, pos: state.nodePos.get(cid) }))
                .filter(x => x.pos);
            if (!childArr.length) return;
            const childTopY = Math.min(...childArr.map(c => c.pos.y));
            const busY = (parentAnchorY + childTopY) / 2;

            // Vertical drop from parent to bus
            appendPath(`M ${parentAnchorX} ${parentAnchorY} L ${parentAnchorX} ${busY}`);

            // Horizontal bus across children
            const childXs = childArr.map(c => c.pos.x + CONFIG.nodeWidth / 2);
            const busMinX = Math.min(parentAnchorX, ...childXs);
            const busMaxX = Math.max(parentAnchorX, ...childXs);
            appendPath(`M ${busMinX} ${busY} L ${busMaxX} ${busY}`);

            // Vertical rise to each child's top
            childArr.forEach(c => {
                const cx = c.pos.x + CONFIG.nodeWidth / 2;
                appendPath(`M ${cx} ${busY} L ${cx} ${c.pos.y}`);
            });
        });

        function appendPath(d) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', d);
            path.setAttribute('class', 'line-parent');
            svg.appendChild(path);
        }
    }

    // ---------- Generation rail ----------
    function renderGenRail(gens, rowY) {
        genRail.innerHTML = '';
        gens.forEach(g => {
            const label = document.createElement('div');
            label.className = 'gen-label';
            label.dataset.gen = g;
            label.textContent = `Gen ${g}`;
            label.style.top = (rowY.get(g) + CONFIG.nodeHeight / 2) + 'px';
            label.dataset.worldY = rowY.get(g) + CONFIG.nodeHeight / 2;
            genRail.appendChild(label);
        });
        syncGenRail();
    }
    function syncGenRail() {
        Array.from(genRail.children).forEach(el => {
            const worldY = parseFloat(el.dataset.worldY || '0');
            const screenY = worldY * state.scale + state.ty;
            el.style.top = screenY + 'px';
        });
    }

    // ---------- Transform / pan & zoom ----------
    function applyTransform() {
        world.style.transform = `translate(${state.tx}px, ${state.ty}px) scale(${state.scale})`;
        btnZoomLevel.textContent = Math.round(state.scale * 100) + '%';
        syncGenRail();
    }

    function zoomAt(clientX, clientY, newScale) {
        newScale = Math.max(CONFIG.minZoom, Math.min(CONFIG.maxZoom, newScale));
        const rect = viewport.getBoundingClientRect();
        const vx = clientX - rect.left;
        const vy = clientY - rect.top;
        // World point under cursor before zoom
        const wx = (vx - state.tx) / state.scale;
        const wy = (vy - state.ty) / state.scale;
        state.scale = newScale;
        state.tx = vx - wx * state.scale;
        state.ty = vy - wy * state.scale;
        applyTransform();
    }

    function fitToView(animate) {
        if (!state.nodePos.size) return;
        const rect = viewport.getBoundingClientRect();
        const w = state.bounds.maxX + CONFIG.nodeWidth;
        const h = state.bounds.maxY + CONFIG.nodeHeight;
        const pad = CONFIG.fitPadding;
        const sx = (rect.width - pad * 2) / w;
        const sy = (rect.height - pad * 2) / h;
        const newScale = Math.max(CONFIG.minZoom, Math.min(CONFIG.maxZoom, Math.min(sx, sy)));
        state.scale = newScale;
        state.tx = (rect.width - w * newScale) / 2;
        state.ty = (rect.height - h * newScale) / 2 + pad * 0.2;
        applyTransform();
    }

    function centerOn(personId) {
        const pos = state.nodePos.get(personId);
        if (!pos) return;
        const rect = viewport.getBoundingClientRect();
        const cx = pos.x + CONFIG.nodeWidth / 2;
        const cy = pos.y + CONFIG.nodeHeight / 2;
        state.tx = rect.width / 2 - cx * state.scale;
        state.ty = rect.height / 2 - cy * state.scale;
        applyTransform();
    }

    // ---------- Interactions ----------
    function attachInteractions() {
        // Mouse/touch pan
        let pointerId = null;
        viewport.addEventListener('pointerdown', e => {
            if (e.target.closest('.node')) return; // let node handle click
            pointerId = e.pointerId;
            state.isPanning = true;
            state.panStart = { x: e.clientX, y: e.clientY, tx: state.tx, ty: state.ty };
            viewport.classList.add('is-panning');
            viewport.setPointerCapture(pointerId);
        });
        viewport.addEventListener('pointermove', e => {
            if (!state.isPanning) return;
            const dx = e.clientX - state.panStart.x;
            const dy = e.clientY - state.panStart.y;
            state.tx = state.panStart.tx + dx;
            state.ty = state.panStart.ty + dy;
            applyTransform();
        });
        const endPan = e => {
            if (!state.isPanning) return;
            state.isPanning = false;
            viewport.classList.remove('is-panning');
            if (pointerId !== null) {
                try { viewport.releasePointerCapture(pointerId); } catch (_) {}
            }
            pointerId = null;
        };
        viewport.addEventListener('pointerup', endPan);
        viewport.addEventListener('pointercancel', endPan);
        viewport.addEventListener('pointerleave', endPan);

        // Wheel zoom
        viewport.addEventListener('wheel', e => {
            e.preventDefault();
            const delta = -e.deltaY;
            const factor = Math.exp(delta * 0.0015);
            zoomAt(e.clientX, e.clientY, state.scale * factor);
        }, { passive: false });

        // Click empty canvas to deselect
        viewport.addEventListener('click', e => {
            if (e.target.closest('.node')) return;
            clearSelection();
        });

        // Toolbar
        btnZoomIn.addEventListener('click', () => {
            const rect = viewport.getBoundingClientRect();
            zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, state.scale + CONFIG.zoomStep);
        });
        btnZoomOut.addEventListener('click', () => {
            const rect = viewport.getBoundingClientRect();
            zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, state.scale - CONFIG.zoomStep);
        });
        btnZoomLevel.addEventListener('click', () => {
            const rect = viewport.getBoundingClientRect();
            zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 1);
        });
        btnFit.addEventListener('click', () => fitToView(true));
        btnCenter.addEventListener('click', () => {
            const root = FAMILY_DATA.rootPersonId;
            if (root) {
                centerOn(root);
                selectPerson(root);
            }
        });

        // Search
        toolSearch.addEventListener('input', () => {
            const q = toolSearch.value.trim().toLowerCase();
            if (!q) {
                state.nodeEls.forEach(el => el.style.opacity = '1');
                return;
            }
            state.peopleById.forEach(person => {
                const hay = `${person.firstName || ''} ${person.lastName || ''} ${person.aka || ''}`.toLowerCase();
                const el = state.nodeEls.get(person.id);
                if (!el) return;
                el.style.opacity = hay.includes(q) ? '1' : '0.25';
            });
        });
        toolSearch.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                const q = toolSearch.value.trim().toLowerCase();
                if (!q) return;
                for (const person of state.peopleById.values()) {
                    const hay = `${person.firstName || ''} ${person.lastName || ''} ${person.aka || ''}`.toLowerCase();
                    if (hay.includes(q)) {
                        centerOn(person.id);
                        selectPerson(person.id);
                        break;
                    }
                }
            }
        });

        // Detail panel close (mobile)
        if (detailClose) {
            detailClose.addEventListener('click', () => {
                detailPanel.classList.remove('is-open');
                clearSelection();
            });
        }

        // Window resize
        window.addEventListener('resize', () => {
            // Re-sync gen rail positions on resize
            syncGenRail();
        });

        // Keyboard shortcuts
        window.addEventListener('keydown', e => {
            if (e.target === toolSearch) return;
            if (e.key === '=' || e.key === '+') {
                const rect = viewport.getBoundingClientRect();
                zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, state.scale + CONFIG.zoomStep);
            } else if (e.key === '-') {
                const rect = viewport.getBoundingClientRect();
                zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, state.scale - CONFIG.zoomStep);
            } else if (e.key === '0') {
                fitToView(false);
            } else if (e.key === 'Escape') {
                clearSelection();
            }
        });
    }

    // ---------- Selection + detail panel ----------
    function selectPerson(id) {
        state.selectedId = id;
        state.nodeEls.forEach((el, pid) => {
            el.classList.toggle('is-selected', pid === id);
        });
        renderDetail(id);
        if (window.innerWidth <= 900) {
            detailPanel.classList.add('is-open');
        }
    }
    function clearSelection() {
        state.selectedId = null;
        state.nodeEls.forEach(el => el.classList.remove('is-selected'));
        detailBody.innerHTML = `
            <div class="detail-placeholder">
                <h3>Select a person</h3>
                <p>Click any card on the canvas to read their biography, see their relationships, and explore the records that document their life.</p>
            </div>`;
    }

    function renderDetail(id) {
        const p = state.peopleById.get(id);
        if (!p) return;
        const parents = (state.parentsByChild.get(id) || [])
            .map(pid => state.peopleById.get(pid)).filter(Boolean);
        const children = (state.childrenByParent.get(id) || [])
            .map(cid => state.peopleById.get(cid)).filter(Boolean);
        const spouses = (state.spousesById.get(id) || [])
            .map(sid => state.peopleById.get(sid)).filter(Boolean);

        const meta = [];
        if (p.birthYear) meta.push({ label: 'Born', value: (p.birthYearApprox ? '~' : '') + p.birthYear });
        if (p.deathYear) meta.push({ label: 'Died', value: (p.deathYearApprox ? '~' : '') + p.deathYear });
        if (p.isLiving && !p.deathYear) meta.push({ label: 'Status', value: 'Living' });
        if (p.primaryLocation) meta.push({ label: 'Location', value: p.primaryLocation });
        if (p.generation != null) meta.push({ label: 'Generation', value: p.generation });
        if (p.confidence) meta.push({ label: 'Confidence', value: p.confidence });

        const personLinks = list => list.map(x =>
            `<li><button data-person-link="${x.id}">${escapeHtml(x.firstName || '')} ${escapeHtml(x.lastName || '')}</button></li>`
        ).join('');

        // Relationship to viewpoint
        let relHtml = '';
        if (state.viewpointId && state.viewpointId !== id) {
            const rel = getRelationship(state.viewpointId, id);
            const vp = state.peopleById.get(state.viewpointId);
            const vpName = vp ? vp.firstName : 'you';
            relHtml = `
                <div class="detail-relationship">
                    <div class="detail-relationship-label">Relationship to ${escapeHtml(vpName)}</div>
                    <div class="detail-relationship-value">${escapeHtml(rel)}</div>
                </div>`;
        } else if (state.viewpointId === id) {
            relHtml = `
                <div class="detail-relationship">
                    <div class="detail-relationship-label">Viewpoint</div>
                    <div class="detail-relationship-value">This is you</div>
                </div>`;
        }

        detailBody.innerHTML = `
            <div class="detail-person">
                <h2>${escapeHtml(p.firstName || '')} ${escapeHtml(p.lastName || '')}</h2>
                ${p.aka ? `<div class="detail-aka">${escapeHtml(p.aka)}</div>` : ''}
                ${relHtml}

                <div class="detail-section">
                    <dl>
                        ${meta.map(m => `<div class="detail-meta-row"><dt>${m.label}</dt><dd>${escapeHtml(String(m.value))}</dd></div>`).join('')}
                    </dl>
                </div>

                ${p.notes ? `
                    <div class="detail-section">
                        <h4>Biography</h4>
                        <p>${escapeHtml(p.notes)}</p>
                    </div>
                ` : ''}

                ${spouses.length ? `
                    <div class="detail-section">
                        <h4>${spouses.length > 1 ? 'Spouses' : 'Spouse'}</h4>
                        <ul>${personLinks(spouses)}</ul>
                    </div>
                ` : ''}

                ${parents.length ? `
                    <div class="detail-section">
                        <h4>Parents</h4>
                        <ul>${personLinks(parents)}</ul>
                    </div>
                ` : ''}

                ${children.length ? `
                    <div class="detail-section">
                        <h4>Children</h4>
                        <ul>${personLinks(children)}</ul>
                    </div>
                ` : ''}

                ${p.source ? `
                    <div class="detail-section">
                        <h4>Source</h4>
                        <p class="detail-source">${escapeHtml(p.source)}</p>
                    </div>
                ` : ''}
            </div>
        `;

        // Wire person-link buttons
        detailBody.querySelectorAll('[data-person-link]').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.personLink;
                centerOn(target);
                selectPerson(target);
            });
        });
    }

    // ---------- Relationship calculator ----------
    function getAncestorMap(id) {
        const map = new Map();
        map.set(id, 0);
        const queue = [[id, 0]];
        while (queue.length) {
            const [curr, dist] = queue.shift();
            (state.parentsByChild.get(curr) || []).forEach(pid => {
                if (!map.has(pid)) { map.set(pid, dist + 1); queue.push([pid, dist + 1]); }
            });
        }
        return map;
    }

    function findBloodLink(fromId, toId) {
        const fa = getAncestorMap(fromId);
        const ta = getAncestorMap(toId);
        let bestM = Infinity, bestN = Infinity, bestSum = Infinity;
        fa.forEach((m, aid) => {
            if (ta.has(aid)) {
                const n = ta.get(aid);
                if (m + n < bestSum) { bestSum = m + n; bestM = m; bestN = n; }
            }
        });
        return bestSum < Infinity ? { m: bestM, n: bestN } : null;
    }

    function labelRelation(m, n) {
        if (m === 0 && n === 0) return 'yourself';
        if (m === 0) return descendantLabel(n);
        if (n === 0) return ancestorLabel(m);
        if (m === 1 && n === 1) return 'sibling';
        if (n === 1) return auntUncleLabel(m - 1);
        if (m === 1) return nieceNephewLabel(n - 1);
        const deg = Math.min(m, n) - 1;
        const rem = Math.abs(m - n);
        return cousinLabel(deg, rem);
    }

    function ancestorLabel(n) {
        if (n === 1) return 'parent';
        if (n === 2) return 'grandparent';
        if (n === 3) return 'great-grandparent';
        return (n - 2) + 'x great-grandparent';
    }
    function descendantLabel(n) {
        if (n === 1) return 'child';
        if (n === 2) return 'grandchild';
        if (n === 3) return 'great-grandchild';
        return (n - 2) + 'x great-grandchild';
    }
    function auntUncleLabel(g) {
        if (g === 1) return 'aunt / uncle';
        if (g === 2) return 'great-aunt / uncle';
        return (g - 1) + 'x great-aunt / uncle';
    }
    function nieceNephewLabel(g) {
        if (g === 1) return 'niece / nephew';
        if (g === 2) return 'grand-niece / nephew';
        return (g - 1) + 'x great-niece / nephew';
    }
    function cousinLabel(deg, rem) {
        const ord = n => {
            const s = ['th','st','nd','rd'];
            const v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
        };
        let lbl = ord(deg) + ' cousin';
        if (rem === 1) lbl += ' once removed';
        else if (rem === 2) lbl += ' twice removed';
        else if (rem > 2) lbl += ' ' + rem + 'x removed';
        return lbl;
    }

    function getRelationship(fromId, toId) {
        if (fromId === toId) return 'yourself';
        if ((state.spousesById.get(fromId) || []).includes(toId)) return 'spouse';
        const blood = findBloodLink(fromId, toId);
        if (blood) return labelRelation(blood.m, blood.n);
        // In-law: check via fromId's spouse
        for (const sp of (state.spousesById.get(fromId) || [])) {
            const r = findBloodLink(sp, toId);
            if (r) return labelRelation(r.m, r.n) + ' (in-law)';
        }
        // In-law: check via toId's spouse
        for (const sp of (state.spousesById.get(toId) || [])) {
            const r = findBloodLink(fromId, sp);
            if (r) return labelRelation(r.m, r.n) + "'s spouse";
        }
        return 'distant relative';
    }

    // ---------- Utils ----------
    function escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ---------- Viewpoint setup ----------
    function setupViewpoint() {
        if (!viewpointSelect) return;
        const sorted = Array.from(state.peopleById.values())
            .sort((a, b) => (a.generation ?? 0) - (b.generation ?? 0)
                || (a.firstName || '').localeCompare(b.firstName || ''));
        sorted.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = (p.firstName || '') + ' ' + (p.lastName || '');
            viewpointSelect.appendChild(opt);
        });
        // Restore from localStorage or default to root
        const saved = localStorage.getItem('ft_viewpoint');
        if (saved && state.peopleById.has(saved)) {
            state.viewpointId = saved;
            viewpointSelect.value = saved;
        } else if (FAMILY_DATA.rootPersonId) {
            state.viewpointId = FAMILY_DATA.rootPersonId;
            viewpointSelect.value = FAMILY_DATA.rootPersonId;
        }
        applyViewpoint();

        viewpointSelect.addEventListener('change', () => {
            state.viewpointId = viewpointSelect.value || null;
            if (state.viewpointId) localStorage.setItem('ft_viewpoint', state.viewpointId);
            applyViewpoint();
            if (state.selectedId) renderDetail(state.selectedId);
        });
    }

    function applyViewpoint() {
        state.nodeEls.forEach((el, pid) => {
            el.classList.toggle('is-viewpoint', pid === state.viewpointId);
        });
    }

    // ---------- Init ----------
    function init() {
        captureDOM();
        if (typeof FAMILY_DATA === 'undefined' || !FAMILY_DATA.people.length) {
            if (emptyEl) emptyEl.classList.add('is-visible');
            return;
        }
        if (emptyEl) emptyEl.style.display = 'none';
        indexData(FAMILY_DATA);
        const layoutResult = layout();
        renderNodes();
        renderLines();
        renderGenRail(layoutResult.gens, layoutResult.yByGen);
        attachInteractions();
        setupViewpoint();
        requestAnimationFrame(() => {
            fitToView(false);
            if (FAMILY_DATA.rootPersonId && window.innerWidth > 900) {
                selectPerson(FAMILY_DATA.rootPersonId);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
