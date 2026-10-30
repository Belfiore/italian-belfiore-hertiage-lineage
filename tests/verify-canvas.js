/* Automated checks for the interactive family canvas.
 *
 *   node tests/verify-canvas.js            (needs Playwright with Chromium)
 *   SHOTS=1 node tests/verify-canvas.js    also writes screenshots to tests/screenshots/
 *
 * Checks: no card text overflows at 1440, 1024 and 390 px; every connector starts and
 * ends on the right card and never crosses another card; every image and file path in
 * the data resolves; every internal link on every page resolves; every #/person/ route
 * opens the right profile; every source id used in people.json exists; every image in
 * profiles and the viewer has alt text.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..', 'Italian-Family-History');
const SHOTS = process.env.SHOTS ? path.join(__dirname, 'screenshots') : null;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.pdf': 'application/pdf', '.svg': 'image/svg+xml', '.md': 'text/plain' };

function serve() {
    return new Promise(res => {
        const srv = http.createServer((req, rsp) => {
            let p = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
            if (p.endsWith('/')) p += 'index.html';
            const f = path.join(ROOT, p);
            if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rsp.writeHead(404); return rsp.end('not found'); }
            rsp.writeHead(200, { 'content-type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' });
            fs.createReadStream(f).pipe(rsp);
        });
        srv.listen(0, () => res(srv));
    });
}

const failures = [];
const fail = (m) => { failures.push(m); console.log('  FAIL ' + m); };
const ok = (m) => console.log('  ok   ' + m);

(async () => {
    const srv = await serve();
    const base = 'http://localhost:' + srv.address().port + '/';
    const browser = await chromium.launch();
    if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

    // ---------------------------------------------------------------- data integrity
    const people = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/people.json'))).people;
    const sources = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources.json'))).sources;
    const sid = new Set(sources.map(s => s.id));
    let refs = 0, bad = 0;
    const use = (ids, where) => (ids || []).forEach(i => { refs++; if (!sid.has(i)) { bad++; fail(`${where}: unknown source "${i}"`); } });
    const files = new Set();
    for (const p of people) {
        (p.story.match(/\[\^([a-z0-9-]+)\]/g) || []).forEach(m => use([m.slice(2, -1)], p.id + ' story'));
        ['birth', 'death'].forEach(k => { if (p[k]) { use(p[k].sourceIds, `${p.id}.${k}`); (p[k].alternates || []).forEach(a => use(a.sourceIds, `${p.id}.${k}.alt`)); if (!p[k].sourceIds.length && !['unverified', 'family tradition'].includes(p[k].confidence)) fail(`${p.id}.${k} has no source and is not labelled unverified`); } });
        (p.residences || []).forEach(r => use(r.sourceIds, p.id + '.residence'));
        (p.occupations || []).forEach(r => use(r.sourceIds, p.id + '.occupation'));
        (p.facts || []).forEach(r => { use(r.sourceIds, p.id + '.fact'); if (!r.sourceIds.length && !['unverified', 'family tradition'].includes(r.confidence)) fail(`${p.id} fact "${r.label}" has no source`); });
        (p.timeline || []).forEach(r => use(r.sourceIds, p.id + '.timeline'));
        (p.spouses || []).forEach(r => use(r.sourceIds, p.id + '.spouse'));
        (p.nameVariants || []).forEach(r => use(r.sourceIds, p.id + '.variant'));
        if (p.immigration) use(p.immigration.sourceIds, p.id + '.immigration');
        (p.media || []).forEach(m => { use([m.sourceId], p.id + '.media'); [m.file, m.thumb, m.pdf].filter(Boolean).forEach(f => files.add(f)); if (!m.alt) fail(`${p.id} media ${m.id} has no alt text`); });
        [p.photo, p.portrait].filter(Boolean).forEach(f => files.add(f));
        if (/—/.test(p.story + p.summary + (p.disambiguator || ''))) fail(`${p.id}: em dash in text`);
        if (p.isLiving && (p.birth || p.death || (p.residences || []).length)) fail(`${p.id}: living person shows dates or addresses`);
    }
    sources.forEach(s => s.file && files.add(s.file));
    if (!bad) ok(`all ${refs} source references resolve to ${sid.size} sources`);

    // ---------------------------------------------------------------- canvas at three widths
    for (const [w, h] of [[1440, 900], [1024, 768], [390, 844]]) {
        const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: w < 800, isMobile: w < 800 });
        const page = await ctx.newPage();
        const errs = [];
        page.on('pageerror', e => errs.push(e.message));
        page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
        await page.goto(base + 'tree-canvas.html', { waitUntil: 'networkidle' });
        await page.waitForFunction(() => window.__tree && document.querySelectorAll('.card').length > 0);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(400);
        if (errs.length) fail(`${w}px: page errors: ${errs.join(' | ')}`); else ok(`${w}px: no page errors`);

        const over = await page.evaluate(() => {
            const out = [];
            document.querySelectorAll('.card').forEach(c => {
                [c, ...c.querySelectorAll('.c-name,.c-dis,.c-dates,.c-place,.c-foot')].forEach(n => {
                    if (n.scrollWidth > n.clientWidth + 1 || n.scrollHeight > n.clientHeight + 1)
                        out.push(`${c.dataset.id} ${n.className} (${n.scrollWidth}x${n.scrollHeight} > ${n.clientWidth}x${n.clientHeight})`);
                });
            });
            return out;
        });
        if (over.length) over.forEach(o => fail(`${w}px overflow: ${o}`)); else ok(`${w}px: no card overflows (${people.length} cards)`);

        if (w === 1440) {
            const conn = await page.evaluate(() => {
                const t = window.__tree, CW = t.CW, CH = t.CH, out = [], rects = {};
                Object.entries(t.L.pos).forEach(([id, p]) => { rects[id] = { x: p.x, y: p.y, w: CW, h: CH }; });
                const near = (a, b) => Math.abs(a - b) < 0.6;
                const pts = d => { const r = []; let x = 0, y = 0; (d.match(/[MVH][^MVH]*/g) || []).forEach(seg => { const c = seg[0], v = seg.slice(1).trim().split(/[\s,]+/).map(Number); if (c === 'M') { x = v[0]; y = v[1]; } else if (c === 'V') y = v[0]; else x = v[0]; r.push([x, y]); }); return r; };
                let n = 0;
                document.querySelectorAll('#links path.ln').forEach(path => {
                    const p = pts(path.getAttribute('d')); n++;
                    const a = p[0], z = p[p.length - 1];
                    // which cards do the endpoints touch?
                    const touches = pt => Object.keys(rects).filter(id => { const r = rects[id]; return pt[0] >= r.x - 0.6 && pt[0] <= r.x + r.w + 0.6 && pt[1] >= r.y - 0.6 && pt[1] <= r.y + r.h + 0.6 && (near(pt[0], r.x) || near(pt[0], r.x + r.w) || near(pt[1], r.y) || near(pt[1], r.y + r.h)); });
                    const endIds = touches(z);
                    // segments must not cross card interiors
                    for (let i = 1; i < p.length; i++) {
                        const [x1, y1] = p[i - 1], [x2, y2] = p[i];
                        Object.entries(rects).forEach(([id, r]) => {
                            const ix = Math.max(Math.min(x1, x2), r.x + 1.5) < Math.min(Math.max(x1, x2), r.x + r.w - 1.5);
                            const iy = Math.max(Math.min(y1, y2), r.y + 1.5) < Math.min(Math.max(y1, y2), r.y + r.h - 1.5);
                            const vx = x1 === x2 && x1 > r.x + 1.5 && x1 < r.x + r.w - 1.5 && iy;
                            const hy = y1 === y2 && y1 > r.y + 1.5 && y1 < r.y + r.h - 1.5 && ix;
                            if (vx || hy) out.push(`segment ${x1},${y1} to ${x2},${y2} crosses card ${id}`);
                        });
                    }
                    if (path.classList.contains('ln--bar')) {
                        if (!touches(a).length || !endIds.length) out.push('marriage bar not attached to two cards: ' + path.getAttribute('d'));
                    } else if (!endIds.length) out.push('connector ends on no card: ' + path.getAttribute('d'));
                });
                // every child with parents has exactly one incoming connector ending on its own card
                t.D.people.forEach(p => {
                    if (!p.parents.length) return;
                    const r = rects[p.id];
                    const hits = Array.from(document.querySelectorAll('#links path.ln:not(.ln--bar)')).filter(path => { const q = pts(path.getAttribute('d')); const z = q[q.length - 1]; return z[0] >= r.x - 0.6 && z[0] <= r.x + r.w + 0.6 && z[1] >= r.y - 0.6 && z[1] <= r.y + r.h + 0.6; });
                    if (hits.length !== 1) out.push(`${p.id} has ${hits.length} incoming connectors`);
                    else {
                        const q = pts(hits[0].getAttribute('d'));
                        const parentsTop = q[0];
                        const ok = p.parents.some(pid => { const pr = rects[pid]; return parentsTop[1] >= pr.y && parentsTop[1] <= pr.y + pr.h + 0.6 && parentsTop[0] >= pr.x - 70 && parentsTop[0] <= pr.x + pr.w + 70; });
                        if (!ok) out.push(`${p.id}: connector does not start at a parent`);
                    }
                });
                return { out, n };
            });
            if (conn.out.length) conn.out.forEach(o => fail('connector: ' + o)); else ok(`all ${conn.n} connectors attach to the right cards and cross no card`);

            // every file referenced resolves
            const missing = await page.evaluate(async (list) => {
                const out = [];
                for (const f of list) { const r = await fetch(encodeURI(f), { method: 'HEAD' }); if (!r.ok) out.push(f + ' ' + r.status); }
                return out;
            }, [...files]);
            if (missing.length) missing.forEach(m => fail('missing file: ' + m)); else ok(`all ${files.size} image, PDF and data file paths resolve`);

            // every person route
            const routeErrs = [];
            for (const p of people) {
                await page.evaluate(id => { location.hash = '#/person/' + id; }, p.id);
                await page.waitForFunction(id => { const h = document.getElementById('pfName'); return h && !document.getElementById('profile').hidden && window.__tree.S.profileFor === id; }, p.id, { timeout: 4000 }).catch(() => routeErrs.push(p.id + ' did not open'));
                const r = await page.evaluate(name => {
                    const h = document.getElementById('pfName');
                    const imgs = Array.from(document.querySelectorAll('#pfArticle img')).filter(i => !i.closest('.c-av, .ch-av') && !i.getAttribute('alt'));
                    const dead = Array.from(document.querySelectorAll('#pfArticle [data-scroll]')).filter(a => !document.getElementById(a.dataset.scroll)).map(a => a.dataset.scroll);
                    return { name: h && h.textContent, noalt: imgs.length, dead };
                }, p.displayName);
                if (r.name !== p.displayName) routeErrs.push(`${p.id}: heading "${r.name}"`);
                if (r.noalt) routeErrs.push(`${p.id}: ${r.noalt} images without alt`);
                if (r.dead.length) routeErrs.push(`${p.id}: footnote targets missing ${r.dead.join(',')}`);
            }
            await page.evaluate(() => { history.pushState('', '', location.pathname); dispatchEvent(new HashChangeEvent('hashchange')); });
            if (routeErrs.length) routeErrs.forEach(e => fail('route: ' + e)); else ok(`all ${people.length} #/person/ routes open the right profile`);

            // lightbox opens with alt text and a transcription where one exists
            await page.evaluate(() => { location.hash = '#/person/leonardantonio-belfiore'; });
            await page.waitForTimeout(300);
            await page.click('#pf-docs .gallery button');
            await page.waitForTimeout(300);
            const lb = await page.evaluate(() => ({ open: !document.getElementById('lightbox').hidden, alt: document.getElementById('lbImg').alt, text: (document.querySelector('.lb-text') || {}).textContent || '' }));
            if (!lb.open || !lb.alt || !/Lionardantonio/.test(lb.text)) fail('lightbox did not show the marriage act with its transcription'); else ok('lightbox shows the scan with alt text and the transcription');
            await page.keyboard.press('Escape');
        }

        if (SHOTS) {
            await page.screenshot({ path: path.join(SHOTS, `canvas-${w}.png`) });
            await page.evaluate(() => window.__tree.select('michael-belfiore', { open: true, center: true }));
            await page.waitForTimeout(700);
            await page.screenshot({ path: path.join(SHOTS, `drawer-${w}.png`) });
            await page.evaluate(() => { location.hash = '#/person/michael-belfiore'; });
            await page.waitForTimeout(700);
            await page.screenshot({ path: path.join(SHOTS, `profile-${w}.png`) });
        }
        await ctx.close();
    }

    // ---------------------------------------------------------------- internal links on every page
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
    const linkErrs = [];
    for (const f of pages) {
        await page.goto(base + f, { waitUntil: 'domcontentloaded' });
        const links = await page.evaluate(() => Array.from(document.querySelectorAll('a[href], img[src], iframe[src], link[rel=stylesheet][href], script[src]'))
            .map(n => n.getAttribute('href') || n.getAttribute('src')).filter(h => h && !/^(https?:|mailto:|data:|#\/|tel:)/.test(h)));
        for (const l of new Set(links)) {
            const [file, hash] = l.split('#');
            if (file) {
                const r = await page.evaluate(async u => (await fetch(u, { method: 'HEAD' })).status, new URL(l, base + f).href.split('#')[0]);
                if (r !== 200) linkErrs.push(`${f}: ${l} -> ${r}`);
            }
            if (hash && !hash.startsWith('/')) {
                const target = file || f;
                await page.goto(base + target, { waitUntil: 'domcontentloaded' });
                const has = await page.evaluate(h => !!document.getElementById(h), hash);
                if (!has) linkErrs.push(`${f}: ${l} -> no element #${hash}`);
                await page.goto(base + f, { waitUntil: 'domcontentloaded' });
            }
        }
    }
    if (linkErrs.length) linkErrs.forEach(e => fail('link: ' + e)); else ok(`internal links resolve on ${pages.length} pages`);

    await browser.close();
    srv.close();
    console.log(failures.length ? `\n${failures.length} problem(s) found.` : '\nAll checks passed.');
    process.exit(failures.length ? 1 : 0);
})();
