import "./reference-home.css";

const REFERENCE_HOME_URL = "/manus-storage/ragnarok-universe-fullpage-responsive-260831_FINAL_95e295ba.html";

/**
 * The user supplied this final design as the source of truth. It is displayed
 * directly rather than being restyled or reinterpreted by the React shell.
 */
export default function Home() {
  return (
    <main className="reference-home-embed" aria-label="Ragnarok Universe homepage">
      <iframe
        title="Ragnarok Universe homepage"
        src={REFERENCE_HOME_URL}
        className="reference-home-embed__frame"
      />
    </main>
  );
}
