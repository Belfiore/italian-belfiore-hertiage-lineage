/* Checks the engine Family Map on the Belfiore & Circelli site against data/places.json and data/people.json.
 *
 *   python3 ../family-site-engine/build/build_site.py --site Italian-Family-History --out Italian-Family-History/_site
 *   node tests/verify-map.js            (needs Playwright with Chromium)
 *   DIST=path/to/build node tests/verify-map.js
 *   SHOTS=1 node tests/verify-map.js    also writes screenshots at 1440, 820 and 390 px to tests/screenshots/
 *
 * The map is the shared engine map (site.config.json "map" block), not a one-off.
 * Checks: every place has coordinates and a coordinate source; every map event cites sources that exist; no em
 * or en dashes; every placeId resolves; no living person has a place except the two already mapped, and Seb has
 * none; every place with events is drawn; the filters, family choices, person search, Timeline mode (events on the track and in the list), list view and
 * "Not yet on the map" tray work; a place panel shows sources and links to profiles; no page errors at three widths.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..', 'Italian-Family-History');   // the site as written: its data
const DIST = path.resolve(process.env.DIST || path.join(ROOT, '_site'));
if (!fs.existsSync(path.join(DIST, 'engine-build.json'))) { console.error('No built site at ' + DIST + '. Build it first, or set DIST.'); process.exit(2); }
const SHOTS = process.env.SHOTS ? path.join(__dirname, 'screenshots') : null;
const GL_ARGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.pbf': 'application/x-protobuf' };
const people = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/people.json'))).people;
const places = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/places.json'))).places;
const sources = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources.json'))).sources;
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json')));
const PL = Object.fromEntries(places.map(p => [p.id, p]));
const SRC = new Set(sources.map(s => s.id));
const LIVING = new Set(people.filter(p => p.isLiving).map(p => p.id));
// Living people already on the map before it was turned on (26 Nov 2026): Robert (grew up in the New Rochelle
// area, family tradition) and David (golf privileges at the Country Club of Detroit, 1963). No one else living
// gets a place, and Seb's own home is never on the map.
const LIVING_ALLOWED = new Set(['robert-belfiore', 'david-belfore']);

const failures = [];
const check = (c, m, d) => { if (c) console.log('  ok   ' + m); else { failures.push(m); console.log('  FAIL ' + m + (d ? '  [' + d + ']' : '')); } };

function serve() {
    return new Promise(res => {
        const srv = http.createServer((req, rsp) => {
            let p = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
            if (p.endsWith('/')) p += 'index.html';
            const f = path.join(DIST, p);
            if (!f.startsWith(DIST) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rsp.writeHead(404); return rsp.end('not found'); }
            rsp.writeHead(200, { 'content-type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' });
            fs.createReadStream(f).pipe(rsp);
        });
        srv.listen(0, '127.0.0.1', () => res(srv));
    });
}

(async () => {
    console.log('Data');
    check(cfg.pages.map && cfg.pages.map.file === 'map.html' && cfg.map && cfg.map.families && cfg.map.branches, 'site.config.json turns on the engine map');
    check(cfg.nav.some(n => n.href === 'map.html'), 'the navigation bar links to the map');
    const noCoord = places.filter(p => p.lat == null || p.lng == null || !(p.coordinateSourceIds || []).length || !p.drawAs);
    check(!noCoord.length, `every place has coordinates, a coordinate source and a way to draw it (${places.length})`, noCoord.map(p => p.id).join(', '));
    const badCoordSrc = places.filter(p => (p.coordinateSourceIds || []).some(s => !SRC.has(s)));
    check(!badCoordSrc.length, 'every coordinate source exists in sources.json', badCoordSrc.map(p => p.id).join(', '));
    const badSrc = [];
    places.forEach(p => (p.events || []).forEach(e => { if (!(e.sourceIds || []).length) badSrc.push(e.id + ' none'); (e.sourceIds || []).forEach(s => { if (!SRC.has(s)) badSrc.push(e.id + ' ' + s); }); }));
    check(!badSrc.length, 'every map event cites sources that exist in sources.json', badSrc.slice(0, 5).join('; '));
    const livingEv = [];
    places.forEach(p => (p.events || []).forEach(e => (e.personIds || []).forEach(id => { if (LIVING.has(id) && !LIVING_ALLOWED.has(id)) livingEv.push(p.id + ':' + id); })));
    people.forEach(p => { if (!LIVING.has(p.id)) return; const m = JSON.stringify(p).match(/"placeId":"[^"]+"/g); if (m) livingEv.push(p.id + ' ' + m.join(',')); });
    check(!livingEv.length, 'no living person has a place beyond the two already mapped (Robert, David)', livingEv.join('; '));
    check(!JSON.stringify(places).includes('seb-belfiore'), "Seb has no place on the map");
    const blob = JSON.stringify(places);
    check(!/[\u2013\u2014]/.test(blob), 'no em or en dashes in places.json');
    const refs = []; const walk = (o, w) => { if (Array.isArray(o)) o.forEach(x => walk(x, w)); else if (o && typeof o === 'object') for (const k of Object.keys(o)) { if (k === 'placeId' && o[k]) refs.push([o[k], w]); walk(o[k], w); } };
    people.forEach(p => walk(p, p.id));
    const dangling = refs.filter(r => !PL[r[0]]);
    check(!dangling.length, `every placeId in people.json exists in places.json (${refs.length})`, dangling.map(r => r.join(' at ')).join('; '));
    const badCrop = [];
    places.forEach(p => (p.events || []).forEach(e => (e.recordCrops || []).forEach(c => { if (!fs.existsSync(path.join(ROOT, 'images', 'records', c))) badCrop.push(e.id + ' ' + c); })));
    check(!badCrop.length, 'every record crop on the map resolves (the engine reads images/records/<crop>)', badCrop.slice(0, 5).join('; '));
    const ids = new Set(); const dup = [];
    places.forEach(p => (p.events || []).forEach(e => { if (ids.has(e.id)) dup.push(e.id); ids.add(e.id); }));
    check(!dup.length, 'every place event id is used once', dup.join(', '));
    const voyageIds = new Set();
    people.forEach(p => (p.voyages || []).forEach(v => voyageIds.add(v.id)));
    const danglingVoyages = [];
    places.forEach(pl => (pl.events || []).forEach(e => { if (e.voyageId && !voyageIds.has(e.voyageId)) danglingVoyages.push(e.id + ' ' + e.voyageId); }));
    check(!danglingVoyages.length, 'every voyageId on a map event exists on a person\'s voyages', danglingVoyages.join('; '));

    const srv = await serve();
    const base = 'http://127.0.0.1:' + srv.address().port + '/';
    const browser = await chromium.launch({ args: GL_ARGS });
    if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR|AJAXError|Failed to fetch|NetworkError/i.test(m.text())) errors.push(m.text()); });
    await page.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.abort());
    await page.goto(base + 'map.html');
    await page.waitForFunction(() => window.FM && FM.ready, null, { timeout: 30000 });
    await page.waitForTimeout(1200);

    console.log('Map page');
    const st = await page.evaluate(() => {
        const D = FM.DATA;
        return {
            events: D.events.length, placed: [...new Set(D.events.map(e => e.placeId))],
            people: [...new Set([].concat(...D.events.map(e => e.personIds)))],
            groups: [].map.call(document.querySelectorAll('#types [data-group]'), b => b.dataset.group),
            fam: [].map.call(document.querySelectorAll('#famSel option'), o => o.value),
            timeline: !!document.getElementById('timeline') && !!document.getElementById('tlPlay'),
            markers: document.querySelectorAll('.mk-wrap').length,
            beyond: (document.body.innerText.match(/Beyond [^:]+: \d+ places?/) || [''])[0],
            navMap: !!document.querySelector('nav.main-nav a[href="map.html"]')
        };
    });
    const drawable = places.filter(p => (p.events || []).length).map(p => p.id);
    const notDrawn = drawable.filter(id => !st.placed.includes(id));
    check(!notDrawn.length, `every place with events is on the map (${st.placed.length} places, ${st.events} events)`, notDrawn.join(', '));
    const livingOnMap = st.people.filter(id => LIVING.has(id) && !LIVING_ALLOWED.has(id));
    check(!livingOnMap.length, 'no other living person is on the map', livingOnMap.join(', '));
    check(!st.people.includes('seb-belfiore'), 'Seb is not on the map');
    check(st.markers > 0, `markers are drawn (${st.markers} on screen)`);
    check(st.navMap, 'the map page carries the Family Map link in its navigation bar');
    check(/Beyond/.test(st.beyond), `places outside New York are on the Beyond chip (${st.beyond})`);
    check(['born', 'married', 'lived', 'worked', 'died', 'buried', 'sailed'].every(g => st.groups.includes(g)), 'event-type filters are there', st.groups.join(','));
    check(['seb', 'leonardantonio', 'hennessy', 'paternostro', 'donofrio'].every(f => st.fam.includes(f)), 'the family filter offers Seb\'s, Leonardantonio and Maria Donata\'s, the Hennessy, Paternostro and D\'Onofrio families', st.fam.join(','));
    check(st.timeline, 'the timeline and its Play button are there');
    const tlErrsBefore = errors.length;
    await page.click('#tab-timeline');
    await page.waitForTimeout(1500);
    const tl = await page.evaluate(() => {
        const list = document.getElementById('tlList');
        const rail = document.getElementById('rail');
        const beats = (FM.timeline && FM.timeline.beats) || [];
        return {
            mode: document.getElementById('fm') && document.getElementById('fm').dataset.mode,
            beats: beats.length,
            listN: list ? list.querySelectorAll('li.el').length : 0,
            listText: list ? list.innerText : '',
            ticks: rail ? rail.querySelectorAll('.tk, .tk-dec').length : 0,
            missingVoyages: (FM.DATA.events || []).filter(e => e.voyageId && !e.voyage).map(e => e.id + ' ' + e.voyageId)
        };
    });
    const tlErrs = errors.slice(tlErrsBefore);
    check(tl.mode === 'timeline' && !tlErrs.length, 'Timeline mode opens without a page error', tlErrs.slice(0, 3).join(' | '));
    check(!tl.missingVoyages.length, 'every sailed event with a voyageId has its voyage attached', tl.missingVoyages.join('; '));
    check(tl.beats > 0 && tl.listN > 0, `the Every event list shows timeline events (${tl.beats} beats, ${tl.listN} rows)`);
    check(tl.ticks > 0, `the timeline track has year ticks or events (${tl.ticks})`);
    check(/Leonardantonio|Hindoustan|Belfiore/.test(tl.listText), 'the timeline list names a known person or voyage', tl.listText.slice(0, 200));
    await page.click('#tab-explore');
    await page.waitForTimeout(400);
    const sbg = await page.evaluate(() => (FM.DATA.placeEvents['vico-passaro-san-bartolomeo'] || []).map(e => e.personIds.join('+') + ':' + e.type + ':' + e.dateStart));
    check(sbg.some(s => /michael-belfiore:born:1884-12-15/.test(s)), "Michael's birth is drawn at Vico Passaro, 15 Dec 1884", sbg.join(' '));
    const mb = await page.evaluate(() => FM.DATA.events.filter(e => e.type === 'born' && e.personIds.includes('michael-belfiore')).length);
    check(mb === 1, `Michael's birth is drawn once (${mb})`);

    await page.click('#types [data-group="died"]'); await page.waitForTimeout(400);
    const hid = await page.evaluate(() => !!FM.state.hidden.died);
    await page.click('#types [data-group="died"]'); await page.waitForTimeout(300);
    check(hid, 'clicking an event type hides it');
    await page.selectOption('#famSel', 'hennessy'); await page.waitForTimeout(500);
    const henN = await page.evaluate(() => document.querySelectorAll('.mk-wrap').length);
    await page.selectOption('#famSel', 'seb'); await page.waitForTimeout(500);
    const sebN = await page.evaluate(() => document.querySelectorAll('.mk-wrap').length);
    check(sebN > 0 && henN > 0, `the family filter changes the markers (Seb's family ${sebN}, Hennessy ${henN})`);
    await page.selectOption('#famSel', ''); await page.waitForTimeout(400);
    await page.fill('#personInput', 'Leonard'); await page.waitForTimeout(300);
    const opts = await page.$$eval('#personList [role="option"]', els => els.map(e => e.textContent));
    check(opts.some(t => /Leonardantonio/.test(t)), 'the person search finds Leonardantonio', opts.join(' | ').slice(0, 200));
    await page.fill('#personInput', ''); await page.keyboard.press('Escape');

    await page.goto(base + 'map.html?place=41-brook-street'); await page.waitForFunction(() => window.FM && FM.ready); await page.waitForTimeout(1500);
    const panel = await page.evaluate(() => { const p = document.getElementById('panel'); return { shown: !p.hidden, text: p.innerText, links: [].map.call(p.querySelectorAll('a'), a => a.getAttribute('href')) }; });
    check(panel.shown && /Brook Street/.test(panel.text), 'a place opens its panel from the URL (41 Brook Street)', panel.text.slice(0, 120));
    check(panel.links.some(h => /tree-canvas\.html|person=|#/.test(h || '')), 'the panel links to profiles', panel.links.slice(0, 8).join(' '));
    check(/census|Census|source|Source/.test(panel.text), 'the panel shows sources');
    const imgs = await page.evaluate(() => [].map.call(document.querySelectorAll('#panel img'), i => ({ src: i.getAttribute('src'), ok: i.complete && i.naturalWidth > 0 })));
    check(imgs.length > 0 && imgs.every(i => i.ok), `the record images in the place panel load (${imgs.length})`, imgs.filter(i => !i.ok).map(i => i.src).join(' '));
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'map-place-1440.png') });
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    await page.click('#trayBtn'); await page.waitForTimeout(400);
    const tray = await page.evaluate(() => ({ shown: !document.getElementById('tray').hidden, n: document.querySelectorAll('#trayList li').length }));
    check(tray.shown && tray.n > 0, `"Not yet on the map" lists events with no place (${tray.n})`);
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    await page.click('#listOpen'); await page.waitForTimeout(400);
    const list = await page.evaluate(() => document.getElementById('listView').innerText);
    const listMissing = drawable.filter(id => !list.includes(PL[id].name));
    check(!listMissing.length, 'the list view names every place', listMissing.join(', '));
    await page.keyboard.press('Escape');

    for (const [w, h] of [[1440, 900], [820, 1180], [390, 844]]) {
        const p2 = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
        const errs = [];
        p2.on('pageerror', e => errs.push(e.message));
        await p2.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.abort());
        await p2.goto(base + 'map.html'); await p2.waitForFunction(() => window.FM && FM.ready, null, { timeout: 30000 }); await p2.waitForTimeout(1500);
        const n = await p2.evaluate(() => document.querySelectorAll('.mk-wrap').length);
        const over = await p2.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        check(n > 0 && !errs.length && !over, `${w}px: markers drawn (${n}), no page errors, no sideways scroll`, errs.slice(0, 2).join(' | '));
        if (SHOTS) await p2.screenshot({ path: path.join(SHOTS, 'map-' + w + '.png') });
        await p2.context().close();
    }
    check(!errors.length, 'no page errors', errors.slice(0, 3).join(' | '));
    await browser.close(); srv.close();
    console.log(failures.length ? '\n' + failures.length + ' problem(s) found.' : '\nAll checks passed.');
    process.exit(failures.length ? 1 : 0);
})().catch(err => { console.error(err); process.exit(1); });
