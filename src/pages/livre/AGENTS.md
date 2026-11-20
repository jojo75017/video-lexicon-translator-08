# Book sites
- Publish only explicit excerpts copied from the author's saved manuscript, never expose full private chapters through public queries.
- Collect reader consent through the dedicated rate-limited edge function and private reader table, keeping campaigns and subscriber accounts untouched.
- Reader exports are limited to the site owner by database RLS; public book pages exclude acquisition overlays to keep attention on the book.
- Subscriber book sites live in public.book_sites (owner RLS, public only when published) and render at /livre/:slug through BookSiteView with scoped .book-site themes, so the editor preview and the public page never diverge.
