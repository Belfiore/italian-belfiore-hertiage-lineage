# Product Docket: AI-Powered Family Heritage Site Builder

## What We Built

An interactive, multi-page family heritage website for the Belfiore-Circelli family — tracing six generations from a small mountain town in southern Italy to modern-day Tampa, Florida. The site is hosted on GitHub Pages and includes genealogical research, historical narrative, primary source documents, and an interactive family tree.

---

## The Process: What We Actually Did (Step by Step)

### Phase 1: Seed Information Intake

The user provided a small set of raw materials — the kind of thing anyone might have in a shoebox or a filing cabinet:

- **A death certificate** (Michael Belfiore, 1952)
- **An obituary clipping** (Sammy Belfore, The Standard-Star)
- **A handful of family photos** (draft cards, census records, golf photos)
- **A few PDF documents** (magazine articles, biographical materials)
- **Verbal family knowledge** (names, relationships, approximate dates, family lore)

This is the "minimum viable input" — two documents and some family memory.

### Phase 2: AI-Assisted Genealogical Research

Using the seed documents, we performed deep research across public databases and historical records:

**Data sources consulted:**
- Ellis Island / Statue of Liberty Foundation passenger records
- Italian civil records (Antenati portal, ItalyHeritage.com, FamilySearch)
- U.S. Census records (1900–1950)
- WWI and WWII draft registration cards
- New York State Death Index
- Find A Grave / BillionGraves cemetery databases
- PGA of America player profiles
- Historical newspaper archives
- Ship manifests and customs passenger lists
- Italian marriage records (Atti di Matrimonio)
- Municipal and parish records from San Bartolomeo in Galdo

**Research techniques applied:**
- Cross-referencing names across immigration manifests to identify chain migration patterns
- Analyzing surname origins through Italian civil record conventions (foundling names, toponymic surnames)
- Resolving place-name discrepancies on ship manifests ("S. Bartolomeo in Calor" = San Bartolomeo in Galdo)
- Dating family events through overlapping document evidence
- Identifying cultural context (Italian-Irish intermarriage rarity, foundling home naming conventions, "birds of passage" return migration)
- Generating and testing hypotheses (Did Leonardantonio come to America? What happened to Dorothy?)

**Key output of research phase:**
- A 200-line comprehensive research document (`belfiore-circelli-family-history.md`) covering every branch, every lead, every dead end, and every hypothesis — with confidence levels noted throughout
- 10 prioritized next-step research actions with specific record sources, contact information, and expected yields
- Multiple "discoveries" that surprised the family (foundling origin, SS Oregon crossing, golfing brothers' PGA career, Irish-Italian marriage context)

### Phase 3: Narrative Construction

The raw research was transformed into a readable family story with distinct narrative arcs:

1. **The Immigration Story** — chain migration from San Bartolomeo in Galdo to New Rochelle, tracking 18+ Circelli arrivals across 23 years
2. **The Foundling Discovery** — Leonardantonio's origins and what "Belfiore" really means
3. **The Golfing Brothers** — three sons of immigrants who broke into professional golf when the sport was dominated by Scotsmen
4. **The Irish Connection** — Frances Towey and a counter-cultural Catholic marriage
5. **The Mystery of Dorothy** — a child who vanishes from the record at the exact moment the 1918 flu arrives
6. **The Direct Line** — six generations from a mountain town to Davis Island, Tampa

### Phase 4: Website Design and Development

Built a static HTML/CSS/JS site with five pages:

| Page | Purpose |
|------|---------|
| `index.html` | Hero intro, key discoveries, direct lineage timeline |
| `family-tree.html` | Interactive family tree — 6 generations, click-to-read bios, filter views (All / Direct Line / Brothers / Sisters) |
| `immigration.html` | The chain migration story, Circelli passenger table, place evidence, surname origin |
| `golfing-brothers.html` | The remarkable golfing story with embedded PDFs, photos, Clinton Russell narrative |
| `research.html` | Full research archive, source documentation, actionable next steps, contact info |

**Design decisions:**
- Serif typography (Cinzel, Cormorant Garamond, EB Garamond) — archival/heritage tone
- Dark color scheme with gold accents — feels like an old document
- Scroll-triggered animations for progressive disclosure
- Mobile-responsive with hamburger nav
- Inline document images with captions throughout
- Embedded PDF viewers for primary source documents
- No external dependencies beyond Google Fonts

### Phase 5: Deployment

- GitHub Pages via GitHub Actions workflow
- Custom branch deployment configuration
- Automated build and publish pipeline

### Phase 6: Iterative Refinement

Multiple rounds of corrections and additions based on:
- User providing new family information (additional children, corrected relationships)
- Discovery of new documents during research
- Factual corrections from Italian civil records
- Adding newly found family members (Beth, Karen, Violet, Patricia Fleming's children)
- Integrating PDF documents with inline viewers

---

## The Product Output

### What the user received:

1. **A live website** hosted on GitHub Pages — shareable with family members
2. **A comprehensive research document** (4,500+ words) documenting every finding, source, hypothesis, and dead end
3. **An interactive family tree** spanning 6 generations with click-to-read biographies for every known family member
4. **Five distinct narrative pages** each telling a different aspect of the family story
5. **Primary source integration** — ship manifests, draft cards, census records, marriage certificates, magazine articles, and obituaries displayed inline with captions
6. **A prioritized research roadmap** — 10 specific next steps with sources, costs, and expected yields
7. **Cultural and historical context** — the immigration story placed within the broader Italian diaspora, the founding-home naming system, Irish-Italian relations, chain migration patterns

---

## How This Becomes a Product

### The Core Insight

Everyone has a version of this project in their head. They have a death certificate in a drawer, a name their grandmother mentioned, a vague sense that "we came from somewhere in Italy" or "my great-grandfather came through Ellis Island." The barrier isn't desire — it's the overwhelming complexity of genealogical research, narrative construction, and web development required to turn fragments into a coherent, shareable family story.

### The User Journey (Productized)

```
Step 1: UPLOAD
   User uploads what they have:
   - Photos of documents (death certificates, immigration papers, draft cards)
   - Family photos
   - PDFs (articles, obituaries, clippings)
   - Text notes ("My grandmother said her father came from Naples")

Step 2: INTAKE INTERVIEW
   AI asks targeted follow-up questions:
   - "The death certificate names Anthony Belfiore — do you know if this
     was his original name or an Americanized version?"
   - "You mentioned your family was from Italy — do you know the specific
     town or region?"
   - "Are there any family stories or legends you've heard, even if
     you're not sure they're true?"

Step 3: RESEARCH
   AI cross-references the seed information against public databases:
   - Ellis Island / immigration records
   - Census databases
   - Italian/Irish/German/etc. civil records
   - Cemetery databases
   - Draft registration records
   - Newspaper archives
   - Surname origin databases

   Produces a research brief with findings, hypotheses, confidence
   levels, and unresolved questions.

Step 4: REVIEW & CORRECT
   User reviews the research brief:
   - Confirms or corrects AI findings
   - Adds additional family knowledge triggered by the research
   - Resolves ambiguities ("That Joseph is my grandfather, not the
     golfer — they're different people")

Step 5: NARRATIVE GENERATION
   AI transforms the verified research into a readable family story:
   - Identifies the most compelling narrative arcs
   - Places the family within historical context
   - Writes in a tone appropriate to heritage storytelling
   - Integrates primary source documents as evidence

Step 6: SITE GENERATION
   AI builds a static heritage website:
   - Interactive family tree
   - Narrative pages organized by theme
   - Inline document images with captions
   - Mobile-responsive design
   - Customizable color scheme / typography

Step 7: PUBLISH & SHARE
   One-click deployment:
   - Custom domain support
   - Shareable link for family members
   - Export to PDF for printing
   - Ongoing research suggestions ("Here are 5 records you could
     order to fill gaps in the story")
```

### What Makes This Different from Ancestry.com / MyHeritage

| Existing Tools | This Product |
|---------------|-------------|
| Give you a database to search | Tells you a story |
| Show you records | Show you records *in context*, with narrative explaining why they matter |
| Build a tree (names + dates) | Build a tree with biographies, photos, and primary sources |
| Stop at the data | Go beyond the data to historical context, cultural significance, and narrative arcs |
| Require genealogical expertise | Work from a shoebox of documents and family memory |
| Output is a database | Output is a beautiful, shareable website |
| Individual activity | Designed to be shared with family |

### Key Differentiators

1. **Narrative-first** — The output is a story, not a spreadsheet. The research is there, but it's woven into readable prose.

2. **Context engine** — AI doesn't just find records; it explains what they mean. "She traveled under her maiden name after 12 years of marriage — this strongly suggests she was a widow." That's interpretation, not just data retrieval.

3. **Hypothesis generation** — The system generates and tests theories: "Dorothy vanishes from the record in September 1918, the exact month the Spanish Flu arrived in Bridgeport. Pandemic death is the leading hypothesis." This is what a professional genealogist does — and it's the part that's hardest for amateurs.

4. **Beautiful output** — The final product is a website you'd be proud to share with your family, not a printout from a database.

5. **Research roadmap** — The system tells you what it *couldn't* find and exactly where to look next, with specific record names, archive addresses, costs, and expected yields.

### Pricing Model Considerations

| Tier | What You Get |
|------|-------------|
| **Free** | Upload documents, get an AI research brief with findings and hypotheses |
| **Standard ($49–99)** | Research brief + generated heritage website (hosted, shareable) |
| **Premium ($149–249)** | Everything above + deep research across premium databases + research roadmap + iterative refinement rounds |
| **Professional ($499+)** | Full white-glove treatment — multiple research cycles, extended family coverage, custom design, PDF book export |

### Technical Architecture (Simplified)

- **Document intake**: OCR + vision model for handwritten documents, typed records, and photos
- **Research engine**: API integrations with FamilySearch, Ancestry (if available), Ellis Island Foundation, Find A Grave, newspaper archives, Italian civil records portals
- **Narrative engine**: LLM with genealogical domain prompting — generates prose from structured research data
- **Site builder**: Template-based static site generator with customizable themes
- **Hosting**: Static deployment (GitHub Pages, Netlify, Vercel) — near-zero hosting cost

### Risks and Challenges

1. **Accuracy** — Genealogical research requires high precision. Wrong connections between people with similar names are a real risk. The product must clearly label confidence levels and distinguish confirmed facts from hypotheses.

2. **Database access** — The most valuable records (Ancestry.com, premium newspaper archives) are behind paywalls and may not have APIs. Partnerships or licensing deals would be needed.

3. **Emotional sensitivity** — Family history can surface difficult truths (foundling origins, illegitimacy, early deaths, broken connections). The narrative engine needs to handle these with appropriate tone.

4. **Non-English records** — Italian, German, Irish, Polish, etc. civil records require language-specific parsing. The Belfiore project required translating Italian marriage records and understanding Italian naming conventions (foundling names, patronymics).

5. **Scope creep** — Every family tree branches exponentially. The product needs to help users define scope (direct line vs. extended family) and manage the research accordingly.

---

## Summary

**What we did**: Took a death certificate, an obituary, a handful of photos, and some family memory — and turned it into a 5-page interactive heritage website with a 6-generation family tree, narrative history, embedded primary sources, and a research roadmap.

**What the product would do**: Let anyone do the same thing, starting from whatever they have in their shoebox.

**The core value proposition**: "You have fragments. We turn them into a story."
