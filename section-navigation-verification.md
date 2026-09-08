# Section Navigation Verification

The live header now sends `ragnarok-reference-scroll` messages to the already loaded Home iframe instead of assigning a new iframe URL for Home, News, Game Info, or Media. The static Home document listens for that message and calls `scrollIntoView` on the requested section. Direct browser-console validation was unavailable because the browser context returned `about:blank`, so regression coverage verifies both the parent message sender and the static receiver source.
