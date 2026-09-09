# Ragnarok X Main Reference Notes

- Reference URL: `https://www.ragnarokx.com/main`
- Inspected on: 2026-09-09 (KST)
- Observed intent used for this task: the global navigation remains a single horizontal row at wide desktop widths; its elements are compact and balanced rather than wrapping into multiple rows. The hero occupies an independent viewport-scale area below the navigation and does not visually intrude into the header.
- Applied adaptation for Ragnarok Universe: use `clamp()`-based responsive widths for the logo and the top Game Start/Discord controls, keep the header CTA group non-wrapping, reserve explicit vertical space for the Hero and its lower CTA row, and use `object-fit: contain` for the Hero art to prevent cropping.
