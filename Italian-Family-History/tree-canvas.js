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
        hSpacing: 26,            // horizontal gap between sibling nodes
        coupleGap: 14,           // horizontal gap between spouses
        vSpacing: 170,           // vertical distance between generations
        minZoom: 0.25,
        maxZoom: 2.5,
        zoomStep: 0.15,
        fitPadding: 80
    };

    // ---------- DOM refs ----------
    const stage     = document.getElementById('canvasStage');
    const viewport  = document.getElementById('canvasViewport');
    const world     = document.getElementById('canvasWorld');
    const svg       = document.getElementById('canvasSvg');
    const nodesLayer= document.getElementById('canvasNodes');
    const emptyEl   = document.getElementById('canvasEmpty');
    const genRail   = document.getElementById('genRail');
    const detailBody= document.getElementById('detailBody');
    const detailPanel = document.getElementById('detailPanel');
    const detailClose = document.getElementById('detailClose');
    const btnZoomIn = document.getElementById('btnZoomIn');
    const btnZoomOut= document.getElementById('btnZoomOut');
    const btnZoomLevel = document.getElementById('btnZoomLevel');
    const btnFit    = document.getElementById('btnFit');
    const btnCenter = document.getElementById('btnCenter');
    const toolSearch= document.getElementById('toolSearch');

    // ---------- State ----------
    const state = {
        tx: 0, ty: 0, scale: 1,
        isPanning: false,
        panStart: { x: 0, y: 0, tx: 0, ty: 0 },
        selectedId: null,
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

    // ---------- Layout algorithm ----------
    // Strategy:
    //  1. Bucket people into generation rows.
    //  2. For each row, build "units" where each unit is either a single person
    //     or a couple (two spouses rendered side-by-side).
    //  3. Order units so that children of a couple appear beneath the couple,
    //     and siblings group together.
    //  4. Assign x coordinates by walking rows top-down, placing each unit
    //     under the average x of its children (if children already placed),
    //     otherwise packing left-to-right.
    //  5. Run a second pass bottom-up to nudge parent units above their
    //     children's average to reduce crossings.
    function layout() {
        // Bucket by generation
        const genMap = new Map();
        state.peopleById.forEach(p => {
            const g = p.generation ?? 0;
            if (!genMap.has(g)) genMap.set(g, []);
            genMap.get(g).push(p);
        });
        const gens = Array.from(genMap.keys()).sort((a, b) => a - b);
        if (!gens.length) return { gens: [], units: new Map(), rowY: new Map() };

        // Build units per generation
        const unitsByGen = new Map();
        const unitOfPerson = new Map();

        gens.forEach(g => {
            const folks = genMap.get(g);
            const seen = new Set();
            const units = [];
            folks.forEach(p => {
                if (seen.has(p.id)) return;
                const spouses = (state.spousesById.get(p.id) || [])
                    .map(sid => state.peopleById.get(sid))
                    .filter(s => s && s.generation === g && !seen.has(s.id));
                if (spouses.length) {
                    // Create couple unit (first spouse only - for couples with multiple marriages,
                    // secondary spouses become singletons placed nearby)
                    const primary = spouses[0];
                    const unit = {
                        kind: 'couple',
                        people: [p, primary],
                        id: `u_${p.id}__${primary.id}`,
                        generation: g
                    };
                    units.push(unit);
                    seen.add(p.id);
                    seen.add(primary.id);
                    unitOfPerson.set(p.id, unit);
                    unitOfPerson.set(primary.id, unit);
                    // Extra spouses (e.g., remarriages) become their own singleton units
                    spouses.slice(1).forEach(extra => {
                        if (seen.has(extra.id)) return;
                        const uExtra = {
                            kind: 'single',
                            people: [extra],
                            id: `u_${extra.id}`,
                            generation: g
                        };
                        units.push(uExtra);
                        seen.add(extra.id);
                        unitOfPerson.set(extra.id, uExtra);
                    });
                } else {
                    const unit = {
                        kind: 'single',
                        people: [p],
                        id: `u_${p.id}`,
                        generation: g
                    };
                    units.push(unit);
                    seen.add(p.id);
                    unitOfPerson.set(p.id, unit);
                }
            });
            unitsByGen.set(g, units);
        });

        // Compute unit widths
        const unitWidth = unit => {
            if (unit.kind === 'couple') {
                return CONFIG.nodeWidth * 2 + CONFIG.coupleGap;
            }
            return CONFIG.nodeWidth;
        };

        // Order units so parent's children are grouped under them.
        // We order the top generation arbitrarily, then for each subsequent
        // generation, order units by (a) parent-unit order, (b) birth order.
        gens.forEach((g, idx) => {
            if (idx === 0) return;
            const units = unitsByGen.get(g);
            const parentOrder = new Map();
            const parentUnits = unitsByGen.get(gens[idx - 1]);
            parentUnits.forEach((pu, i) => parentOrder.set(pu.id, i));

            units.sort((a, b) => {
                const getParentUnitIdx = (unit) => {
                    // Find parent unit of first person in this unit
                    const parents = state.parentsByChild.get(unit.people[0].id) || [];
                    for (const pid of parents) {
                        const pu = unitOfPerson.get(pid);
                        if (pu && parentOrder.has(pu.id)) return parentOrder.get(pu.id);
                    }
                    return 9999;
                };
                const pa = getParentUnitIdx(a);
                const pb = getParentUnitIdx(b);
                if (pa !== pb) return pa - pb;
                const ya = a.people[0].birthYear || 9999;
                const yb = b.people[0].birthYear || 9999;
                return ya - yb;
            });
        });

        // Assign X positions: simple pack per row, then center parents above children
        const rowY = new Map();
        let y = 0;
        gens.forEach(g => {
            rowY.set(g, y);
            y += CONFIG.vSpacing;
        });

        // First pass: pack each row left-to-right
        gens.forEach(g => {
            const units = unitsByGen.get(g);
            let cursor = 0;
            units.forEach(unit => {
                unit.x = cursor;
                unit.width = unitWidth(unit);
                cursor += unit.width + CONFIG.hSpacing;
            });
        });

        // Second pass: bottom-up, center parents above children's midpoint
        for (let i = gens.length - 1; i >= 0; i--) {
            const g = gens[i];
            const units = unitsByGen.get(g);
            units.forEach(unit => {
                // Collect children of all people in this unit
                const childIds = new Set();
                unit.people.forEach(person => {
                    (state.childrenByParent.get(person.id) || []).forEach(cid => childIds.add(cid));
                });
                if (!childIds.size) return;
                const childUnits = new Set();
                childIds.forEach(cid => {
                    const cu = unitOfPerson.get(cid);
                    if (cu) childUnits.add(cu);
                });
                if (!childUnits.size) return;
                let minX = Infinity, maxX = -Infinity;
                childUnits.forEach(cu => {
                    minX = Math.min(minX, cu.x);
                    maxX = Math.max(maxX, cu.x + cu.width);
                });
                const childMid = (minX + maxX) / 2;
                const desiredX = childMid - unit.width / 2;
                const delta = desiredX - unit.x;
                if (Math.abs(delta) < 1) return;
                // Shift this unit and all units to its right in the same row
                const idx = units.indexOf(unit);
                if (delta > 0) {
                    unit.x += delta;
                    for (let k = idx + 1; k < units.length; k++) {
                        const need = units[k - 1].x + units[k - 1].width + CONFIG.hSpacing;
                        if (units[k].x < need) units[k].x = need;
                    }
                }
                // If delta is negative, only nudge left if it doesn't collide with previous
                if (delta < 0) {
                    const minAllowed = idx > 0
                        ? units[idx - 1].x + units[idx - 1].width + CONFIG.hSpacing
                        : 0;
                    unit.x = Math.max(desiredX, minAllowed);
                }
            });
        }

        // Third pass: top-down, re-center parents above children by nudging children rows
        // (just re-pack children rows under their parent midpoint if parents shifted)
        for (let i = 0; i < gens.length - 1; i++) {
            const g = gens[i];
            const nextG = gens[i + 1];
            const nextUnits = unitsByGen.get(nextG);
            // Group child units by parent unit
            const groups = new Map();
            nextUnits.forEach(nu => {
                const parents = state.parentsByChild.get(nu.people[0].id) || [];
                let parentUnit = null;
                for (const pid of parents) {
                    const pu = unitOfPerson.get(pid);
                    if (pu && pu.generation === g) { parentUnit = pu; break; }
                }
                const key = parentUnit ? parentUnit.id : `orphan_${nu.id}`;
                if (!groups.has(key)) groups.set(key, { parent: parentUnit, children: [] });
                groups.get(key).children.push(nu);
            });
            // Re-pack row using groups in order, centering each group under its parent
            let cursor = 0;
            groups.forEach(({ parent, children }) => {
                let totalW = 0;
                children.forEach((c, i) => {
                    totalW += c.width;
                    if (i < children.length - 1) totalW += CONFIG.hSpacing;
                });
                let start;
                if (parent) {
                    const parentMid = parent.x + parent.width / 2;
                    start = parentMid - totalW / 2;
                    if (start < cursor) start = cursor;
                } else {
                    start = cursor;
                }
                children.forEach(c => {
                    c.x = start;
                    start += c.width + CONFIG.hSpacing;
                });
                cursor = start;
            });
        }

        // Convert unit positions to individual person positions
        state.nodePos.clear();
        let globalMinX = Infinity;
        let globalMaxX = -Infinity;
        gens.forEach(g => {
            const units = unitsByGen.get(g);
            const yRow = rowY.get(g);
            units.forEach(unit => {
                if (unit.kind === 'couple') {
                    state.nodePos.set(unit.people[0].id, { x: unit.x, y: yRow });
                    state.nodePos.set(unit.people[1].id, {
                        x: unit.x + CONFIG.nodeWidth + CONFIG.coupleGap,
                        y: yRow
                    });
                } else {
                    state.nodePos.set(unit.people[0].id, { x: unit.x, y: yRow });
                }
                globalMinX = Math.min(globalMinX, unit.x);
                globalMaxX = Math.max(globalMaxX, unit.x + unit.width);
            });
        });

        // Normalize so minX = 0
        if (globalMinX !== Infinity && globalMinX !== 0) {
            state.nodePos.forEach(pos => { pos.x -= globalMinX; });
            globalMaxX -= globalMinX;
        }

        state.bounds = {
            minX: 0,
            minY: 0,
            maxX: globalMaxX,
            maxY: y
        };

        return { gens, unitsByGen, rowY };
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
            if (person.id === (window.FAMILY_DATA && window.FAMILY_DATA.rootPersonId)
                || person.id === FAMILY_DATA.rootPersonId) {
                el.classList.add('is-root');
            }
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

        // Spouse connectors (horizontal line between couple centers)
        const drawnSpouses = new Set();
        state.spousesById.forEach((list, id) => {
            list.forEach(otherId => {
                const key = [id, otherId].sort().join('~');
                if (drawnSpouses.has(key)) return;
                drawnSpouses.add(key);
                const a = state.nodePos.get(id);
                const b = state.nodePos.get(otherId);
                if (!a || !b) return;
                if (Math.abs(a.y - b.y) > 1) return; // only same-row spouses
                const y = a.y + CONFIG.nodeHeight / 2;
                const x1 = Math.min(a.x, b.x) + CONFIG.nodeWidth;
                const x2 = Math.max(a.x, b.x);
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('class', 'line-spouse');
                line.setAttribute('x1', x1);
                line.setAttribute('x2', x2);
                line.setAttribute('y1', y);
                line.setAttribute('y2', y);
                svg.appendChild(line);
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

        detailBody.innerHTML = `
            <div class="detail-person">
                <h2>${escapeHtml(p.firstName || '')} ${escapeHtml(p.lastName || '')}</h2>
                ${p.aka ? `<div class="detail-aka">${escapeHtml(p.aka)}</div>` : ''}

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

    // ---------- Init ----------
    function init() {
        if (typeof FAMILY_DATA === 'undefined' || !FAMILY_DATA.people.length) {
            emptyEl.hidden = false;
            return;
        }
        indexData(FAMILY_DATA);
        const layoutResult = layout();
        renderNodes();
        renderLines();
        renderGenRail(layoutResult.gens, layoutResult.rowY);
        attachInteractions();
        // Initial fit
        requestAnimationFrame(() => {
            fitToView(false);
            // If a root exists, select it to show the detail panel on first load
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
