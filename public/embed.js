/**
 * Wall-of-love embed. Customer pastes:
 *   <div data-proofloft="their-form-slug"></div>
 *   <script src="https://yourdomain.com/embed.js" async></script>
 *
 * Appearance follows the form's dashboard setting (theme: light/dark,
 * layout: cards/list). Per-site overrides, when a client page needs to differ:
 *   <div data-proofloft="slug" data-theme="dark" data-layout="list"></div>
 *
 * Free tier keeps the "powered by" badge — that badge is the growth loop.
 */
(function () {
  var HOST = (document.currentScript && document.currentScript.src.replace(/\/embed\.js.*$/, "")) || "";

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function stars(n) {
    var s = "";
    for (var i = 0; i < 5; i++) s += i < n ? "★" : "☆";
    return s;
  }

  var SOURCES = { email: "Email", x: "X", linkedin: "LinkedIn", instagram: "Instagram", google: "Google", g2: "G2", other: "the web" };

  // Two palettes, one shape — everything the cards color is driven from here.
  var PALETTES = {
    light: { card: "#fff", border: "#e5e5e5", quote: "#222", author: "#111", meta: "#666", faint: "#999", stars: "#f5a623", shadow: "none" },
    dark:  { card: "#221f19", border: "#3a362c", quote: "#e9e5db", author: "#f2efe8", meta: "#a39d90", faint: "#8a8478", stars: "#e8b34a", shadow: "0 2px 10px rgba(0,0,0,.35)" }
  };

  function sourceHtml(t, p) {
    if (!t.source) return "";
    var label = "via " + esc(SOURCES[t.source] || SOURCES.other);
    if (t.source_url && /^https?:\/\//.test(t.source_url)) {
      return ' · <a href="' + esc(t.source_url) + '" target="_blank" rel="noopener nofollow" style="color:' + p.faint + ';font-size:12px">' + label + " ↗</a>";
    }
    return ' · <span style="color:' + p.faint + ';font-size:12px">' + label + "</span>";
  }

  function render(el, data) {
    // Form setting from the feed, overridable per embed via data attributes.
    var theme = el.getAttribute("data-theme") || data.theme || "light";
    var layout = el.getAttribute("data-layout") || data.layout || "cards";
    var p = PALETTES[theme] || PALETTES.light;

    var cards = data.items
      .map(function (t) {
        return (
          '<figure style="break-inside:avoid;background:' + p.card + ";border:1px solid " + p.border + ";border-radius:12px;padding:18px;margin:0 0 14px;box-shadow:" + p.shadow + ';font-family:inherit">' +
          (t.rating ? '<div style="color:' + p.stars + ';font-size:14px;letter-spacing:2px">' + stars(t.rating) + "</div>" : "") +
          '<blockquote style="margin:10px 0;font-size:15px;line-height:1.55;color:' + p.quote + '">' + esc(t.body) + "</blockquote>" +
          '<figcaption style="font-size:13px;color:' + p.meta + '"><b style="color:' + p.author + '">' + esc(t.author_name) + "</b>" +
          (t.author_title ? " · " + esc(t.author_title) : "") +
          sourceHtml(t, p) +
          "</figcaption></figure>"
        );
      })
      .join("");
    var wrap = layout === "list"
      ? '<div style="max-width:620px;margin:0 auto">' + cards + "</div>"
      : '<div style="columns:2 280px;column-gap:14px">' + cards + "</div>";
    el.innerHTML =
      wrap +
      '<p style="text-align:center;font-size:12px;color:' + p.faint + ';font-family:inherit">' +
      '<a href="' + HOST + '?ref=badge" style="color:' + p.faint + '" target="_blank" rel="noopener">Collect testimonials with Proofloft</a></p>';
  }

  document.querySelectorAll("[data-proofloft]").forEach(function (el) {
    var slug = el.getAttribute("data-proofloft");
    fetch(HOST + "/api/wall/" + encodeURIComponent(slug))
      .then(function (r) { return r.json(); })
      .then(function (data) { if (data && data.items) render(el, data); })
      .catch(function () {});
  });
})();
