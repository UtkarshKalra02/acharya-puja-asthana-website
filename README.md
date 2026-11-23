# Spirit Stars website: handover notes (internal, Beacon Web Studio)

Static site (HTML/CSS/JS, no build step, no frameworks). Upload the whole folder to any host (Hostinger, Netlify, Cloudflare Pages).

## Before going live
1. **Domain**: every canonical, OG and sitemap URL uses the placeholder `https://www.spiritstars.in`. Replace it:
   `grep -rl "https://www.spiritstars.in" . | xargs sed -i 's#https://www.spiritstars.in#https://YOUR-DOMAIN#g'`
2. **Analytics/remarketing**: paste the GA4 + Google Ads tag and the Meta Pixel into the marked comment in each page's `<head>`. main.js already fires `whatsapp_click`, `call_click` and `generate_lead`.
3. **Search Console**: verify the domain, submit `/sitemap.xml`, then check Pages → Indexed after 1–2 weeks.
4. **Google Business Profile**: create it (category: Astrologer; add Vastu consultant as a secondary). Add the exact address to the Contact section (marked comment) and to `address` in the JSON-LD.
5. **Testimonials**: add real, permissioned reviews at the marked comment on index.html. Never use invented reviews.
6. **Founder story**: add 3–4 true lines about Acharya ji's own journey at the marked comment (About section).
7. **Email**: no address was supplied. Add a dedicated one to the footer and contact cards when available.

## Keyword map (unvalidated: run a ₹2,000/week Google Ads test, then keep the ones with 4+ conversions in 90 days)
| Page | Primary keyword |
|---|---|
| index.html | astrologer in south delhi / vastu consultant south delhi |
| vedic-astrology-consultation-delhi.html | vedic astrologer delhi, kp astrology consultation |
| vastu-consultant-south-delhi.html | vastu consultant in south delhi, factory vastu, online vastu consultation |
| numerology-consultation-delhi.html | numerologist in delhi, name correction numerology |
| astrology-vastu-course-delhi.html | vedic astrology course delhi, vastu course delhi |

## Built in
- Title, meta description, URL and H1 aligned to one keyword per page. Keyword-phrase menu.
- TL;DR block and FAQ on every page, with FAQPage, ProfessionalService/LocalBusiness, Service+Offer (prices), Course and BreadcrumbList schema.
- Lead capture: floating WhatsApp and call buttons (sticky bar on mobile), a CTA after each pain point, a booking form that sends details to WhatsApp, an exit pop-up (free gemstone recommendation, once per visit), and analytics hooks.
- WebP images, lazy loading, deferred JS, and `prefers-reduced-motion` support.
