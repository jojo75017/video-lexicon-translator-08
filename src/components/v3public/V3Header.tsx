/** Welcome band; navigation is kept in the category and quick-access bars below. */
export default function V3Header(_props: { isAuthed?: boolean; isAdmin?: boolean }) {
  return (
    <header data-v3-nav="" className="v3-welcome-header sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-4 text-center">
        <p className="v3-welcome-title">
          <span className="v3-welcome-intro">Bienvenue sur </span>
          <strong>EbookStudio <span className="v3-welcome-premium">Premium</span> <span className="v3-welcome-version">V3</span></strong>
        </p>
      </div>
    </header>
  );
}
