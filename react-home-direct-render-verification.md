# Direct React Home Verification

- The Home component directly mounts Hero, Discord, News, Game Info, Media, closing CTA, and footer sections. It no longer contains the former reference-document URL or the `ragnarok-reference-frame` site iframe.
- The desktop Hero check at 1280 × 720 shows the fixed service header and direct Hero content starting immediately below it, with the requested two-line title treatment.
- The mobile Hero check at 497 × 910 shows the same direct content path with no embedded-site transition or placeholder banner. Game Start and Discord CTA artwork remains visible below the Hero.
- The only remaining iframe is the official WidgetBot chat integration inside the Discord section; it is intentionally third-party content and uses native lazy loading.
