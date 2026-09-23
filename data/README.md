# data/

Phase 1 file-system database (JSON files). Created in Step 3.

- Lives OUTSIDE `public/`, so it is never served by Next.js.
- Only server code (repositories via `src/lib/filesystem`) may read or write here.
- All content is fictional development data.
