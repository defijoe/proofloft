/**
 * Wall-of-love embed. Customer pastes:
 *   <div data-proofloft="their-form-slug"></div>
 *   <script src="https://yourdomain.com/embed.js" async></script>
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

  function sourceHtml(t) {
    if (!t.source) return "";
    var label = "via " + esc(SOURCES[t.source] || SOURCES.other);
    if (t.source_url && /^https?:\/\//.test(t.source_url)) {
      return ' · <a href="' + esc(t.source_url) + '" target="_blank" rel="noopener nofollow" style="color:#999;font-size:12px">' + label + " ↗</a>";
    }
    return ' · <span style="color:#999;font-size:12px">' + label + "</span>";
  }

  function render(el, data) {
    var cards = data.items
      .map(function (t) {
        return (
          '<figure style="break-inside:avoid;background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:18px;margin:0 0 14px;font-family:inherit">' +
          (t.rating ? '<div style="color:#f5a623;font-size:14px;letter-spacing:2px">' + stars(t.rating) + "</div>" : "") +
          '<blockquote style="margin:10px 0;font-size:15px;line-height:1.55;color:#222">' + esc(t.body) + "</blockquote>" +
          '<figcaption style="font-size:13px;color:#666"><b style="color:#111">' + esc(t.author_name) + "</b>" +
          (t.author_title ? " · " + esc(t.author_title) : "") +
          sourceHtml(t) +
          "</figcaption></figure>"
        );
      })
      .join("");
    el.innerHTML =
      '<div style="columns:2 280px;column-gap:14px">' + cards + "</div>" +
      '<p style="text-align:center;font-size:12px;color:#999;font-family:inherit">' +
      '<a href="' + HOST + '?ref=badge" style="color:#999" target="_blank" rel="noopener">Collect testimonials with Proofloft</a></p>';
  }

  document.querySelectorAll("[data-proofloft]").forEach(function (el) {
    var slug = el.getAttribute("data-proofloft");
    fetch(HOST + "/api/wall/" + encodeURIComponent(slug))
      .then(function (r) { return r.json(); })
      .then(function (data) { if (data && data.items) render(el, data); })
      .catch(function () {});
  });
})();
