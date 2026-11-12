/* HTML-structuren herkennen — interactieve oefeningen (5cm)
   Vijf oefeningen: 1 annoteer de nep-site, 2 koppel beschrijving aan element,
   3 meerkeuze, 4 waar/niet waar, 5 div-soep verbouwen. */
(function () {
  "use strict";

  /* ---------- hulpmiddelen ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  /* tekst met `code`-backticks omzetten naar veilige HTML met <code> */
  function fmt(s) {
    return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
  }
  function make(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- vaste kleurcode (zelfde als in het cursusdossier) ---------- */
  var ELEMS = [
    { el: "header",  label: "<header>",      c: "#E8590C" },
    { el: "nav",     label: "<nav>",         c: "#1971C2" },
    { el: "section", label: "<section>",     c: "#2F9E44" },
    { el: "article", label: "<article>",     c: "#6741D9" },
    { el: "aside",   label: "<aside>",       c: "#E64980" },
    { el: "div",     label: "<div>",         c: "#868E96" },
    { el: "h1",      label: "<h1>…<h6>",     c: "#E67700" },
    { el: "p",       label: "<p>",           c: "#5C940D" },
    { el: "img",     label: "<img>",         c: "#1098AD" },
    { el: "ul",      label: "<ul>",          c: "#364FC7" },
    { el: "table",   label: "<table>",       c: "#9C36B5" },
    { el: "footer",  label: "<footer>",      c: "#F03E3E" }
  ];
  var byEl = {};
  ELEMS.forEach(function (e) { byEl[e.el] = e; });

  /* ---------- stap 0: theorie-kaartjes in het spiekbriefje (zelfde kleurcode) ---------- */
  var THEORY = {
    header:  { wat: "De balk bovenaan (of onderaan) met logo, zoekbalk en menu. Staat los van de eigenlijke inhoud.", vb: "PIXELPUNT-logo + 🔍 Zoeken + ☰ Menu" },
    nav:     { wat: "Een groep links om ergens heen te gaan — vaak zit er een `<ul>` in.", vb: "Home · Nieuws · Agenda · Contact" },
    section: { wat: "Een groot, afgebakend blok rond één thema, met een eigen tussentitel (h2).", vb: "de hero met “Welkom op Pixelpunt”" },
    article: { wat: "Inhoud die op zichzelf kan staan: nieuwsbericht, blogpost, product, review.", vb: "een nieuwskaart in de kaartenrij" },
    aside:   { wat: "Inhoud naast de kern: advertentie, gerelateerde links, nieuwsbrief.", vb: "de kolom “Laatste nieuws”" },
    div:     { wat: "Geen eigen betekenis — enkel voor lay-out of styling. Altijd je laatste keuze.", vb: "de wrapper rond de kaartenrij" },
    h1:      { wat: "Titels in hiërarchie: precies één `<h1>` per pagina, daarna h2 → h6 zonder een niveau over te slaan.", vb: "“Welkom op Pixelpunt” = h1" },
    p:       { wat: "Een gewone alinea lopende tekst.", vb: "de inleiding onder de hoofdtitel" },
    img:     { wat: "Een foto, logo of icoon. Vergeet nooit het `alt`-attribuut.", vb: "de hoofdafbeelding (speelplaats)" },
    ul:      { wat: "Opsomming zonder volgorde (bullets). Is de volgorde wél belangrijk? → `<ol>`.", vb: "het lijstje onder “Laatste nieuws”" },
    table:   { wat: "Rijen × kolommen met verband: rooster, uitslagen, infobox. Nooit een tabel voor lay-out!", vb: "het lesrooster rechtsonder" },
    footer:  { wat: "Het blok helemaal onderaan: ©, contact, privacy, sitemap.", vb: "© Pixelpunt · Contact · Privacy" }
  };
  (function buildTheory() {
    var box = $("elem-cards");
    if (!box) return;
    ELEMS.forEach(function (meta) {
      var t = THEORY[meta.el] || { wat: "", vb: "" };
      var card = make("div", "elem-card raised-s");
      var head = make("div", "ec-head");
      var dot = make("span", "cdot");
      dot.style.background = meta.c;
      var code = document.createElement("code");
      code.textContent = meta.label;          // letterlijke tekst, bv. "<header>"
      head.appendChild(dot);
      head.appendChild(code);
      card.appendChild(head);
      card.appendChild(make("p", "ec-wat", fmt(t.wat)));
      card.appendChild(make("p", "ec-vb", "<strong>VB:</strong> " + fmt(t.vb)));
      box.appendChild(card);
    });
  })();

  /* ---------- scorebord bovenaan ---------- */
  function setSum(n, text, done) {
    var c = $("sum-oef" + n);
    if (!c) return;
    c.textContent = "Oef " + n + " · " + text;
    c.classList.toggle("done", !!done);
  }

  /* =========================================================
     OEFENING 1 — annoteer pixelpunt.school
     ========================================================= */
  var zones = Array.prototype.slice.call(document.querySelectorAll("#oef1 .zone"));
  var palette = $("palette");
  var feedback = $("feedback");
  var progress = $("progress");
  var selected = null;
  var labels = new Map();
  var checkedOnce = false;

  function say(node, msg) { node.innerHTML = msg; }

  function paint(zone) {
    var meta = byEl[labels.get(zone)];
    zone.style.setProperty("--zc", meta.c);
    zone.classList.add("labeled");
    var badge = zone.querySelector(".badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "badge";
      zone.appendChild(badge);
    }
    badge.textContent = meta.label;
  }
  function clearPaint(zone) {
    zone.classList.remove("labeled", "ok", "bad");
    zone.style.removeProperty("--zc");
    var badge = zone.querySelector(".badge");
    if (badge) badge.remove();
  }
  function correctCount() {
    var n = 0;
    zones.forEach(function (z) { if (labels.get(z) === z.dataset.el) n++; });
    return n;
  }
  function updateProgress() {
    progress.textContent = "Gelabeld " + labels.size + "/" + zones.length +
      (checkedOnce ? " · Juist " + correctCount() + "/" + zones.length : "");
  }
  function select(zone) {
    zones.forEach(function (z) { z.classList.remove("selected"); });
    selected = zone;
    zone.classList.add("selected");
    say(feedback, "Kader gekozen 👉 klik nu op een element in het palet.");
  }

  zones.forEach(function (zone) {
    zone.addEventListener("click", function (e) {
      e.stopPropagation(); // geneste kaders: het binnenste kader wint
      select(zone);
    });
    zone.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); select(zone); }
    });
  });

  ELEMS.forEach(function (meta) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.dataset.el = meta.el;
    b.style.setProperty("--c", meta.c);
    var dot = make("span", "cdot");
    var txt = document.createElement("span");
    txt.textContent = meta.label;           // textContent: "<header>" blijft letterlijke tekst
    b.appendChild(dot); b.appendChild(txt);
    b.addEventListener("click", function () {
      if (!selected) {
        say(feedback, "⚠️ Klik eerst op een kader (gestippelde rand) in de website.");
        return;
      }
      labels.set(selected, meta.el);
      selected.classList.remove("ok", "bad");
      paint(selected);
      updateProgress();
      say(feedback, "<strong>" + esc(meta.label) + "</strong> toegekend aan het gekozen kader. " +
        "Klik het kader opnieuw aan en kies een ander element om het te wijzigen.");
    });
    palette.appendChild(b);
  });

  $("btn-check").addEventListener("click", function () {
    checkedOnce = true;
    var ok = 0, unlabeled = 0;
    zones.forEach(function (z) {
      var good = labels.get(z) === z.dataset.el;
      z.classList.remove("ok", "bad");
      if (labels.has(z)) z.classList.add(good ? "ok" : "bad");
      else unlabeled++;
      if (good) ok++;
    });
    updateProgress();
    var total = zones.length;
    if (ok === total) {
      say(feedback, "🎉 Perfect! " + ok + "/" + total + " kaders juist — je kent de bouwblokken van het web. Door naar oefening 2!");
    } else {
      say(feedback, "📊 " + ok + "/" + total + " juist" +
        (unlabeled ? " · nog " + unlabeled + " kader(s) zonder label" : "") +
        ". Foute kaders krijgen een rode rand met ✗. Je kunt elk kader afzonderlijk opnieuw labelen en daarna opnieuw controleren. Tip: het spiekbriefje bovenaan (stap 0)!");
    }
    setSum(1, ok + "/" + total, ok === total);
  });

  $("btn-solution").addEventListener("click", function () {
    zones.forEach(function (z) {
      labels.set(z, z.dataset.el);
      paint(z);
      z.classList.add("ok");
      z.classList.remove("bad");
    });
    checkedOnce = true;
    updateProgress();
    say(feedback, "👀 Oplossing getoond: " + zones.length + "/" + zones.length + ". Vergelijk met je eigen labels — druk op <strong>Opnieuw</strong> om het zelf te proberen.");
    setSum(1, "oplossing bekeken", false);
  });

  $("btn-reset").addEventListener("click", function () {
    labels.clear();
    checkedOnce = false;
    selected = null;
    zones.forEach(function (z) { z.classList.remove("selected"); clearPaint(z); });
    updateProgress();
    say(feedback, "Opnieuw begonnen! Klik op een kader (gestippelde rand) in de website en kies daarna het element uit het palet.");
    setSum(1, "—", false);
  });

  updateProgress();

  /* =========================================================
     OEFENING 2 — koppel beschrijving aan element
     ========================================================= */
  var MATCH = [
    { el: "table",  t: "Rijen × kolommen mét verband: een lesrooster, uitslagen of een infobox." },
    { el: "header", t: "Het hele blok bovenaan de pagina met logo, zoekbalk en menuknoppen." },
    { el: "article",t: "Een zelfstandig stuk inhoud dat ook los zou kunnen bestaan: een nieuwsbericht of een review." },
    { el: "h1",     t: "De allergrootste titel van de pagina — staat er precies één keer." },
    { el: "ul",     t: "Een lijstje met opsommingstekens waarbij de volgorde niets uitmaakt." },
    { el: "aside",  t: "Zijdelingse inhoud naast de kern: een advertentie, gerelateerde links of een nieuwsbrief." },
    { el: "p",      t: "Een gewone alinea lopende tekst." },
    { el: "nav",    t: "Een balk of kolom met enkel links om naar andere pagina's te gaan." },
    { el: "img",    t: "Een foto, logo of icoon — vergeet de alt-tekst niet!" },
    { el: "footer", t: "Het onderste blok met ©, contact, privacy en kleine links." }
  ];
  var mDescBox = $("mdesc"), mElemBox = $("melems"), fb2 = $("fb2"), pill2 = $("pill2");
  var mSel = null, mLocked = 0, mFaults = 0;

  function flash(node) {
    node.classList.remove("badflash");
    void node.offsetWidth; // animatie opnieuw triggeren
    node.classList.add("badflash");
  }
  function updatePill2() {
    pill2.textContent = mLocked + "/" + MATCH.length + " gekoppeld" + (mFaults ? " · " + mFaults + " fout" : "");
  }
  function buildMatch() {
    mDescBox.innerHTML = ""; mElemBox.innerHTML = "";
    mSel = null; mLocked = 0; mFaults = 0;
    updatePill2();
    shuffle(MATCH).forEach(function (item) {
      var d = document.createElement("button");
      d.type = "button";
      d.className = "mdesc";
      d.dataset.el = item.el;
      d.textContent = item.t;
      d.addEventListener("click", function () {
        if (d.classList.contains("locked")) return;
        Array.prototype.forEach.call(mDescBox.children, function (c) { c.classList.remove("selected"); });
        d.classList.add("selected");
        mSel = d;
        say(fb2, "Beschrijving gekozen 👉 klik nu rechts op het element dat erbij hoort.");
      });
      mDescBox.appendChild(d);
    });
    ELEMS.filter(function (e) {
      return MATCH.some(function (m) { return m.el === e.el; });
    }).forEach(function (meta) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.dataset.el = meta.el;
      b.style.setProperty("--c", meta.c);
      b.appendChild(make("span", "cdot"));
      var txt = document.createElement("span");
      txt.textContent = meta.label;
      b.appendChild(txt);
      b.addEventListener("click", function () {
        if (b.classList.contains("locked")) return;
        if (!mSel) { say(fb2, "⚠️ Klik eerst links op een beschrijving."); return; }
        if (mSel.dataset.el === meta.el) {
          mSel.classList.remove("selected");
          mSel.classList.add("locked");
          b.classList.add("locked");
          mSel = null; mLocked++;
          updatePill2();
          if (mLocked === MATCH.length) {
            say(fb2, mFaults === 0
              ? "🎉 Alle 10 koppels juist, en dat in één poging per koppel — strak werk!"
              : "🎉 Alle 10 koppels juist, met " + mFaults + " foute poging" + (mFaults === 1 ? "" : "en") + " tussendoor. Bekijk zeker ook oefening 3!");
            setSum(2, mFaults === 0 ? "10/10" : "10/10 · " + mFaults + " fout", mFaults === 0);
          } else {
            say(fb2, "✅ Juist! <strong>" + esc(meta.label) + "</strong> vastgeklikt. Nog " + (MATCH.length - mLocked) + " te gaan.");
          }
        } else {
          mFaults++;
          flash(mSel); flash(b);
          updatePill2();
          say(fb2, "❌ Deze twee horen niet samen. Tip: vraag je af wat het blok <em>is</em>, niet hoe het eruitziet.");
        }
      });
      mElemBox.appendChild(b);
    });
    say(fb2, "Kies een beschrijving om te beginnen.");
  }
  $("btn2-reset").addEventListener("click", function () {
    buildMatch();
    setSum(2, "—", false);
  });
  buildMatch();

  /* =========================================================
     OEFENING 3 — meerkeuze
     ========================================================= */
  var QUIZ = [
    { q: "Je tekent een kader rond de balk met “Home · Nieuws · Agenda · Contact”. Welk element past het best?",
      opts: ["`<nav>`", "`<ul>`", "`<aside>`", "`<div>`"], a: 0,
      expl: "De lijst links zit er vaak in als `<ul>`, maar de structuur die zegt “dit is navigatie” is `<nav>`." },
    { q: "Een nieuwsbericht op de schoolsite dat integraal op een andere site zou kunnen staan, is …",
      opts: ["`<section>`", "`<article>`", "`<div>`", "`<p>`"], a: 1,
      expl: "`<article>` is inhoud die op zichzelf kan staan (bericht, blogpost, review). `<section>` groepeert blokken rond één thema." },
    { q: "Hoeveel `<h1>`'s mogen er op één pagina staan?",
      opts: ["Precies één", "Evenveel als je wil", "Twee: één voor de site en één voor het artikel", "Zes, één per heading-niveau"], a: 0,
      expl: "De `<h1>` is de paginatitel en komt één keer voor. Daaronder bouw je met `<h2>` tot `<h6>`, zonder niveaus over te slaan." },
    { q: "Het blok “Gerelateerde artikels” naast een nieuwsbericht is …",
      opts: ["`<nav>`", "`<section>`", "`<aside>`", "`<footer>`"], a: 2,
      expl: "Inhoud die náást de kern staat en niet essentieel is: `<aside>`. Een echte linkbalk naar andere pagina's zou wel `<nav>` zijn." },
    { q: "Voor een lesrooster of wedstrijduitslagen (rijen × kolommen mét verband) gebruik je …",
      opts: ["`<div>` met CSS-grid", "`<ul>`", "`<table>`", "`<ol>`"], a: 2,
      expl: "Tabeldata hoort in een `<table>`. Kolommen voor pure lay-out? Dan CSS-grid of flexbox, géén tabel." },
    { q: "Waarvoor dient het `alt`-attribuut van `<img>`?",
      opts: ["Als beschrijving voor schermlezers en wanneer de afbeelding niet laadt", "Enkel om gevonden te worden in Google", "Als bijschrift onder de foto", "Om de bestandsnaam te tonen"], a: 0,
      expl: "Een schermlezer leest de alt-tekst voor en de tekst verschijnt ook als de afbeelding niet laadt. Een bijschrift onder de foto is aparte tekst." }
  ];
  var quizBox = $("quiz"), fb3 = $("fb3"), pill3 = $("pill3");
  var qState = [];

  function answeredCount() {
    return qState.filter(function (s) { return s.pick >= 0; }).length;
  }
  function buildQuiz() {
    quizBox.innerHTML = "";
    qState = [];
    pill3.textContent = "0/" + QUIZ.length + " beantwoord";
    say(fb3, "Kies eerst je antwoorden en druk dan op Controleer.");
    QUIZ.forEach(function (item, i) {
      var st = { pick: -1, done: false };
      qState.push(st);
      var q = make("div", "q well");
      q.appendChild(make("p", "q-title", "<strong>Vraag " + (i + 1) + ".</strong> " + fmt(item.q)));
      var opts = make("div", "opts");
      opts.setAttribute("role", "radiogroup");
      item.opts.forEach(function (optText, oi) {
        var o = document.createElement("button");
        o.type = "button";
        o.className = "opt";
        o.setAttribute("role", "radio");
        o.setAttribute("aria-checked", "false");
        o.appendChild(make("span", "odot"));
        o.appendChild(make("span", null, fmt(optText)));
        o.addEventListener("click", function () {
          if (st.done) return;
          st.pick = oi;
          Array.prototype.forEach.call(opts.children, function (c) {
            c.classList.remove("picked");
            c.setAttribute("aria-checked", "false");
          });
          o.classList.add("picked");
          o.setAttribute("aria-checked", "true");
          pill3.textContent = answeredCount() + "/" + QUIZ.length + " beantwoord";
        });
        opts.appendChild(o);
      });
      q.appendChild(opts);
      q.appendChild(make("p", "expl", "<strong>Uitleg:</strong> " + fmt(item.expl)));
      q.querySelector(".expl").hidden = true;
      quizBox.appendChild(q);
    });
  }
  $("btn3-check").addEventListener("click", function () {
    var missing = [];
    qState.forEach(function (s, i) { if (!s.done && s.pick < 0) missing.push(i + 1); });
    if (missing.length) {
      say(fb3, "⚠️ Vraag " + missing.join(", ") + " heeft nog geen antwoord. Kies eerst een optie per vraag.");
      return;
    }
    var ok = 0;
    qState.forEach(function (s, i) {
      if (s.done) { if (s.pick === QUIZ[i].a) ok++; return; }
      s.done = true;
      var q = quizBox.children[i];
      q.classList.add("done");
      var good = s.pick === QUIZ[i].a;
      if (good) ok++;
      Array.prototype.forEach.call(q.querySelector(".opts").children, function (c, ci) {
        c.classList.remove("picked");
        if (ci === s.pick) c.classList.add(good ? "ok" : "bad");
        if (!good && ci === QUIZ[i].a) c.classList.add("reveal");
      });
      q.querySelector(".expl").hidden = false;
    });
    pill3.textContent = ok + "/" + QUIZ.length + " juist";
    if (ok === QUIZ.length) say(fb3, "🎉 " + ok + "/" + QUIZ.length + " juist — de theorie zit erin!");
    else say(fb3, "💪 " + ok + "/" + QUIZ.length + " juist. Lees de uitleg onder de foute vragen en probeer het daarna opnieuw met <strong>Opnieuw</strong>.");
    setSum(3, ok + "/" + QUIZ.length, ok === QUIZ.length);
  });
  $("btn3-reset").addEventListener("click", function () {
    buildQuiz();
    setSum(3, "—", false);
  });
  buildQuiz();

  /* =========================================================
     OEFENING 4 — waar of niet waar
     ========================================================= */
  var TF = [
    { s: "Een `<nav>` mag alleen bovenaan de pagina staan.", a: false,
      expl: "Ook een zijbalk- of footermenu is `<nav>`: de rol (links om ergens heen te gaan) telt, niet de plek." },
    { s: "Een `<div>` heeft geen eigen betekenis: je gebruikt het enkel voor lay-out of styling.", a: true,
      expl: "Correct. Daarom is `<div>` je laatste keuze: kijk eerst of een semantisch element beter past." },
    { s: "Je mag heading-niveaus overslaan: na `<h2>` gewoon `<h4>` gebruiken.", a: false,
      expl: "Sla geen niveaus over: schermlezers en zoekmachines gebruiken de heading-hiërarchie als inhoudsopgave van de pagina." },
    { s: "Een `<article>` moet altijd binnen een `<section>` staan.", a: false,
      expl: "Ze staan los van elkaar: de nesting volgt de inhoud. Een artikel met onderdelen kan zelfs zelf sections bevatten." },
    { s: "In een `<ul>` is de volgorde van de items belangrijk.", a: false,
      expl: "Dat is `<ol>` (ordered list). `<ul>` is voor lijstjes zonder volgorde: menu's, kenmerken, koppen." },
    { s: "Een cookiebanner die over de pagina zweeft, hoort niet bij de hoofdstructuur: `<div>` of `<aside>` is prima.", a: true,
      expl: "Correct: het is een losse functionele laag naast of over de inhoud. Een advertentie of “laatste nieuws”-kolom is dan weer een typische `<aside>`." }
  ];
  var tfBox = $("tflist"), fb4 = $("fb4"), pill4 = $("pill4");
  var tfAnswered = 0, tfOk = 0;

  function buildTf() {
    tfBox.innerHTML = "";
    tfAnswered = 0; tfOk = 0;
    pill4.textContent = "0/" + TF.length + " beantwoord";
    say(fb4, "Beoordeel de zes beweringen hierboven.");
    TF.forEach(function (item) {
      var done = false;
      var box = make("div", "tf-item well");
      box.appendChild(make("p", "tf-s", fmt(item.s)));
      var btns = make("div", "tfbtns");
      var expl = make("p", "expl", "<strong>Juist antwoord: " + (item.a ? "waar" : "niet waar") + ".</strong> " + fmt(item.expl));
      expl.hidden = true;
      [true, false].forEach(function (val) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "tfbtn";
        b.textContent = val ? "Waar" : "Niet waar";
        b.addEventListener("click", function () {
          if (done) return;
          done = true;
          tfAnswered++;
          box.classList.add("done");
          var good = (val === item.a);
          if (good) { tfOk++; b.classList.add("ok"); }
          else {
            b.classList.add("bad");
            Array.prototype.forEach.call(btns.children, function (c) { if (c !== b) c.classList.add("reveal"); });
          }
          expl.hidden = false;
          pill4.textContent = tfAnswered + "/" + TF.length + " beantwoord · " + tfOk + "/" + TF.length + " juist";
          if (tfAnswered === TF.length) {
            say(fb4, tfOk === TF.length
              ? "🎉 " + tfOk + "/" + TF.length + " juist — je laat je niet vangen door de valstrikken!"
              : "💪 " + tfOk + "/" + TF.length + " juist. Lees de uitleg bij de foute beweringen en herbekijk het spiekbriefje bovenaan (stap 0).");
            setSum(4, tfOk + "/" + TF.length, tfOk === TF.length);
          } else {
            say(fb4, (good ? "✅ Juist! " : "❌ Fout. ") + tfAnswered + "/" + TF.length + " beantwoord, daarvan " + tfOk + " juist.");
          }
        });
        btns.appendChild(b);
      });
      box.appendChild(btns);
      box.appendChild(expl);
      tfBox.appendChild(box);
    });
  }
  $("btn4-reset").addEventListener("click", function () {
    buildTf();
    setSum(4, "—", false);
  });
  buildTf();

  /* =========================================================
     OEFENING 5 — div-soep verbouwen
     ========================================================= */
  var SOEP = [
    { code: '<div class="site-kop">', hint: "logo + zoekbalk + menuknoppen bovenaan", a: "header" },
    { code: '<div class="menu">',     hint: "lijst met links naar andere pagina's",   a: "nav" },
    { code: '<div class="bericht">',  hint: "zelfstandig nieuwsbericht",               a: "article" },
    { code: '<div class="opsomming">',hint: "lijstje met bullets, volgorde maakt niet uit", a: "ul" },
    { code: '<div class="voet">',     hint: "© + contact + privacy helemaal onderaan", a: "footer" }
  ];
  var SOEP_OPTS = ["header", "nav", "section", "article", "aside", "div", "ul", "table", "footer"];
  var soepBox = $("soep"), fb5 = $("fb5"), pill5 = $("pill5");

  function buildSoep() {
    soepBox.innerHTML = "";
    pill5.textContent = "0/" + SOEP.length + " juist";
    say(fb5, "Kies per regel een element uit de lijst en druk dan op Controleer.");
    SOEP.forEach(function (row) {
      var r = make("div", "soep-row");
      r.dataset.a = row.a;
      var code = document.createElement("code");
      code.className = "soep-code";
      code.textContent = row.code;
      r.appendChild(code);
      r.appendChild(make("span", "soep-hint", esc(row.hint)));
      var sel = document.createElement("select");
      sel.className = "neu-select";
      sel.appendChild(new Option("kies …", ""));
      SOEP_OPTS.forEach(function (o) {
        sel.appendChild(new Option("<" + o + ">", o));
      });
      sel.addEventListener("change", function () { r.classList.remove("ok", "bad"); r.querySelector(".soep-mark").textContent = ""; });
      r.appendChild(sel);
      r.appendChild(make("span", "soep-mark", ""));
      soepBox.appendChild(r);
    });
  }
  function checkSoep(showSolution) {
    var ok = 0, open = 0;
    Array.prototype.forEach.call(soepBox.children, function (r, i) {
      var sel = r.querySelector("select");
      var mark = r.querySelector(".soep-mark");
      if (showSolution) sel.value = SOEP[i].a;
      if (!sel.value) { open++; return; }
      var good = sel.value === r.dataset.a;
      r.classList.remove("ok", "bad");
      r.classList.add(good ? "ok" : "bad");
      mark.textContent = good ? "✓" : "✗";
      if (good) ok++;
    });
    if (!showSolution && open) {
      say(fb5, "⚠️ Kies eerst voor elke regel een element (" + open + " regel(s) nog leeg).");
      return;
    }
    pill5.textContent = ok + "/" + SOEP.length + " juist" + (showSolution ? " (oplossing)" : "");
    if (showSolution) {
      say(fb5, "👀 Oplossing getoond. Let op het patroon: kop → <strong>header</strong>, links → <strong>nav</strong>, zelfstandig bericht → <strong>article</strong>, bullets → <strong>ul</strong>, onderkant → <strong>footer</strong>.");
      setSum(5, "oplossing bekeken", false);
    } else if (ok === SOEP.length) {
      say(fb5, "🎉 " + ok + "/" + SOEP.length + " juist — deze div-soep is volledig semantisch verbouwd!");
      setSum(5, ok + "/" + SOEP.length, true);
    } else {
      say(fb5, "📊 " + ok + "/" + SOEP.length + " juist. De regels met ✗ bekijk je best nog eens: wat <em>is</em> dat blok eigenlijk?");
      setSum(5, ok + "/" + SOEP.length, false);
    }
  }
  $("btn5-check").addEventListener("click", function () { checkSoep(false); });
  $("btn5-solution").addEventListener("click", function () { checkSoep(true); });
  $("btn5-reset").addEventListener("click", function () {
    buildSoep();
    setSum(5, "—", false);
  });
  buildSoep();
})();
