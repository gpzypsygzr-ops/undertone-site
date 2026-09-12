# Plan: Redesign Pass — Color, Typography, and Visual Weight

## Context

The user flagged two specific problems and one structural question:

1. **Color mismatch** — the coffee pour video is warm amber/golden-brown in tone, but the accent `#FF6B35` reads as a bright orange-red (energetic, startup-y). They clash because they're in different temperature registers. This is the clearest problem on the page.
2. **Typography feels off** — Bricolage Grotesque all-uppercase everywhere has become a very common pattern in 2023–2024 web design. Every heading uses the same recipe (tiny label → all-caps bold heading), which creates monotony rather than hierarchy.
3. **Multi-page question** — the content does not warrant separate routes. A single scrolling page is definitively right for a hospitality site at this scale. What may feel "off" is that each section looks similar in weight and treatment, not that there's too little content for one page.

---

## 1. Fix the accent color — orange → burnished amber

**Problem:** `#FF6B35` is a hot, saturated orange-red. The video has warm amber/copper/golden-brown tones (`~#B8732A`, `~#C89040`). They fight because they're in different temperature families.

**Fix:** Replace `#FF6B35` with `#C4822A` — a burnished amber that reads as candlelight/copper, sits in the same warmth register as the video, and still gives enough contrast against the dark background to function as an accent. The secondary rust `#7A2E22` stays — it works well as depth.

**Every occurrence of `#FF6B35` in `src/App.tsx` and `src/index.css` changes to `#C4822A`.** The hover glow and marquee strip follow automatically.

---

## 2. Break the typography monotony — introduce a serif display for section headings

**Problem:** Bricolage Grotesque 800 all-caps is used for the hero words *and* every section heading *and* every sub-label. There's no contrast in the hierarchy — everything shouts at the same volume.

**Approach:**
- **Hero words** — keep Bricolage Grotesque 800 uppercase. This is the one place where it's genuinely right: massive, structural.
- **Section H2s** (`The Menu`, `Both, All Day`, `Visit`, `Say Hello`) — switch to **Fraunces** (a Google Font: optical serif, has both italic and display weight, looks like a 1970s wine label in the best way). Use it at 400–500 weight, mixed case, not uppercase. This creates a serif/sans contrast that high-end hospitality sites always have.
- **Sub-labels** (`What We Pour`, `The Story`, `Find Us`) — keep Bricolage Grotesque but much smaller, and consider dropping the tracking a little.
- **Body text** — keep Work Sans. It's fine and readable.

**Add Fraunces to `src/index.css`:**
```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&display=swap');
```

Add `.font-serif { font-family: 'Fraunces', serif; }` utility class.

Apply `font-serif` to the H2 in each section: MenuSection, StorySection, VisitSection, ContactSection.

---

## 3. Give the menu section an atmospheric photo backing

**Problem:** The menu section is the longest part of the page and the most visually thin — three columns of text on a plain dark background. It needs one strong visual moment.

**Fix:** Add the espresso machine photo (`imgEspresso`) as a very low-opacity background image in the menu section container — `opacity: 0.06`, blurred with `filter: blur(40px) saturate(1.5)`, scaled slightly larger than the section, fixed to the right edge. It creates depth without distracting from the menu text. Uses an already-imported asset.

---

## 4. Grain / Noise Texture Overlay (already done — preserve)

Already implemented — the SVG `feTurbulence` noise overlay in `body::after` in `src/index.css`. Keep as-is.

---

## Already implemented — keep

- Scroll-reveal (`useReveal` hook + `.reveal`/`.visible` classes)
- Marquee strip (`MarqueeStrip` component + `@keyframes marquee`) — accent color updates to amber
- Time-aware subline (`useTimeGreeting`)
- Pull-quote in story section
- Sticky nav (`StickyNav`)

---

## Multi-page question — no

Single-page is definitively right here. The content doesn't warrant routes. What feels "off" is section monotony and the color clash — both fixable without adding pages.

---

## Files to modify

- `src/index.css` — add Fraunces import, `.font-serif` utility, replace `#FF6B35` with `#C4822A`
- `src/App.tsx` — replace `#FF6B35` with `#C4822A` throughout, swap section H2 font to `font-serif` + mixed case, add photo backing to menu section

---

## Verification

- Check amber accent reads warmly against the video (should feel like the same light source)
- Check Fraunces loads and renders at section headings — confirm mixed case looks intentional vs accidental
- Check menu section photo backing doesn't overwhelm the text
- Check marquee color updated to amber
- Check all hover states still have enough contrast
