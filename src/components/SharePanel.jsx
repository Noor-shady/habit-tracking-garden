import { Copy, Sun } from "lucide-react";

export default function SharePanel({ shareUrl, onCopy, onSunlightBoost, readOnly = false }) {
  return (
    <section className="share-panel">
      <div>
        <p className="eyebrow">Public garden</p>
        <h2>Let friends visit your cozy progress garden.</h2>
        <p>
          Share this page so people can view your blooming habits and send a
          tiny sunlight boost.
        </p>
      </div>

      <div className="share-actions">
        <input value={shareUrl} readOnly />
        <button onClick={onCopy}>
          <Copy size={17} />
          Copy link
        </button>

        {readOnly && (
          <button className="sun-button" onClick={onSunlightBoost}>
            <Sun size={17} />
            Send sunlight
          </button>
        )}
      </div>
    </section>
  );
}
