
/* HTML-structuren herkennen — interactieve oefeningen (5cm)
   Vijf oefeningen:
   1. Annoteer de nep-site
   2. Koppel beschrijving aan element
   3. Meerkeuze
   4. Waar/niet waar
   5. Div-soep verbouwen

   Wijzigingen:
   - Badge-bug bij geneste kaders opgelost (oef 1)
   - "Toon oplossing" geeft geen groene volle score meer (oef 1 en 5)
   - Oef 5: eerst controleren op lege regels, daarna pas markeren
   - Oef 5: neutrale klassenamen, section/div erbij, volgorde geschud
   - Oef 4: 3x waar / 3x niet waar, volgorde geschud
   - Oef 3: antwoordvolgorde geschud, h1-vraag gepreciseerd
   - Theorie over header, section en div verbeterd
   - Kleine toegankelijkheidsverbeteringen
*/

(function () {
  "use strict";

  /* ---------- hulpmiddelen ---------- */

  function $(id) {
    return document.getElementById(id);
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* Tekst met `code`-backticks omzetten naar veilige HTML met <code> */
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
      var t = a[i];

      a[i] = a[j];
      a[j] = t;
    }

    return a;
  }

  /* Zorg dat het hidden-attribuut altijd wint van een display uit styles.css */
  (function ensureHidden() {
    var st = document.createElement("style");
    st.textContent = "[hidden]{display:none !important}";
    document.head.appendChild(st);
  })();


  /* ---------- vaste kleurcode ---------- */

  var ELEMS = [
    { el: "header",  label: "<header>",  c: "#E8590C" },
    { el: "nav",     label: "<nav>",     c: "#1971C2" },
    { el: "section", label: "<section>", c: "#2F9E44" },
    { el: "article", label: "<article>",c: "#6741D9" },
    { el: "aside",   label: "<aside>",   c: "#E64980" },
    { el: "div",     label: "<div>",     c: "#868E96" },
    { el: "h1",      label: "<h1>…<h6>", c: "#E67700" },
    { el: "p",       label: "<p>",       c: "#5C940D" },
    { el: "img",     label: "<img>",     c: "#1098AD" },
    { el: "ul",      label: "<ul>",      c: "#364FC7" },
    { el: "table",   label: "<table>",   c: "#9C36B5" },
    { el: "footer",  label: "<footer>",  c: "#F03E3E" }
  ];

  var byEl = {};

  ELEMS.forEach(function (e) {
    byEl[e.el] = e;
  });


  /* ---------- stap 0: theorie-kaartjes ---------- */

  var THEORY = {
    header: {
      wat: "Een inleidend gedeelte van een pagina of onderdeel. Bevat bijvoorbeeld een logo, titel of navigatie.",
      vb: "PIXELPUNT-logo + zoekbalk + menuknop"
    },

    nav: {
      wat: "Een groep links die bedoeld is om naar andere pagina's of onderdelen te navigeren. Bevat vaak een `<ul>`.",
      vb: "Home · Nieuws · Agenda · Contact"
    },

    section: {
      wat: "Een inhoudelijk afgebakend gedeelte rond één thema, meestal met een eigen kop (h1, h2, …).",
      vb: "De hero met “Welkom op Pixelpunt”"
    },

    article: {
      wat: "Inhoud die op zichzelf kan staan: een nieuwsbericht, blogpost, product of review.",
      vb: "Een nieuwskaart in de kaartenrij"
    },

    aside: {
      wat: "Aanvullende inhoud die verband houdt met de hoofdinhoud, zoals gerelateerde links, advertenties of een nieuwsbrief.",
      vb: "De kolom “Laatste nieuws”"
    },

    div: {
      wat: "Een algemene container zonder eigen semantische betekenis. Gebruik deze wanneer geen specifieker HTML-element geschikt is.",
      vb: "Een wrapper om meerdere elementen samen te groeperen"
    },

    h1: {
      wat: "Titels in een hiërarchie. Gebruik een duidelijke hoofdtitel en bouw daaronder logisch verder met h2 tot h6.",
      vb: "“Welkom op Pixelpunt” = h1"
    },

    p: {
      wat: "Een gewone alinea lopende tekst.",
      vb: "De inleiding onder de hoofdtitel"
    },

    img: {
      wat: "Een afbeelding, zoals een foto, logo of icoon. Voorzie altijd een passend `alt`-attribuut.",
      vb: "De hoofdafbeelding (speelplaats)"
    },

    ul: {
      wat: "Een opsomming zonder vaste volgorde. Is de volgorde belangrijk? Gebruik dan `<ol>`.",
      vb: "Het lijstje onder “Laatste nieuws”"
    },

    table: {
      wat: "Een tabel met gegevens die inhoudelijk bij elkaar horen, zoals een rooster of uitslagen. Gebruik geen tabel voor lay-out.",
      vb: "Het lesrooster rechtsonder"
    },

    footer: {
      wat: "Een afsluitend gedeelte van een pagina of onderdeel, bijvoorbeeld met contactgegevens, auteursinformatie of privacylinks.",
      vb: "© Pixelpunt · Contact · Privacy"
    }
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
      code.textContent = meta.label;

      head.appendChild(dot);
      head.appendChild(code);

      card.appendChild(head);
      card.appendChild(make("p", "ec-wat", fmt(t.wat)));
      card.appendChild(
        make("p", "ec-vb", "<strong>VB:</strong> " + fmt(t.vb))
      );

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

  var zones = Array.prototype.slice.call(
    document.querySelectorAll("#oef1 .zone")
  );

  var palette = $("palette");
  var feedback = $("feedback");
  var progress = $("progress");

  var selected = null;
  var labels = new Map();
  var checkedOnce = false;
  var usedSolution1 = false;

  function say(node, msg) {
    node.innerHTML = msg;
  }

  /* Enkel de badge van deze zone, niet die van een kindzone */
  function ownBadge(zone) {
    for (var i = 0; i < zone.children.length; i++) {
      if (zone.children[i].classList.contains("badge")) {
        return zone.children[i];
      }
    }

    return null;
  }

  function paint(zone) {
    var meta = byEl[labels.get(zone)];

    zone.style.setProperty("--zc", meta.c);
    zone.classList.add("labeled");

    var badge = ownBadge(zone);

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

    var badge = ownBadge(zone);

    if (badge) badge.remove();
  }

  function correctCount() {
    var n = 0;

    zones.forEach(function (z) {
      if (labels.get(z) === z.dataset.el) n++;
    });

    return n;
  }

  function updateProgress() {
    progress.textContent =
      "Gelabeld " + labels.size + "/" + zones.length +
      (checkedOnce ? " · Juist " + correctCount() + "/" + zones.length : "") +
      (usedSolution1 ? " · oplossing getoond" : "");
  }

  function select(zone) {
    zones.forEach(function (z) {
      z.classList.remove("selected");
    });

    selected = zone;
    zone.classList.add("selected");

    say(
      feedback,
      "Kader gekozen. Klik nu op een element in het palet."
    );
  }

  zones.forEach(function (zone) {
    zone.addEventListener("click", function (e) {
      e.stopPropagation();
      select(zone);
    });

    zone.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        select(zone);
      }
    });
  });


  /* Elementenpalet opbouwen */

  ELEMS.forEach(function (meta) {
    var b = document.createElement("button");

    b.type = "button";
    b.className = "chip";
    b.dataset.el = meta.el;
    b.style.setProperty("--c", meta.c);

    var dot = make("span", "cdot");
    var txt = document.createElement("span");

    txt.textContent = meta.label;

    b.appendChild(dot);
    b.appendChild(txt);

    b.addEventListener("click", function () {
      if (!selected) {
        say(
          feedback,
          "Klik eerst op een kader (gestippelde rand) in de website."
        );
        return;
      }

      labels.set(selected, meta.el);

      selected.classList.remove("ok", "bad");

      paint(selected);
      updateProgress();

      say(
        feedback,
        "<strong>" + esc(meta.label) + "</strong> toegekend aan het gekozen kader. " +
        "Klik het kader opnieuw aan en kies een ander element om het te wijzigen."
      );
    });

    palette.appendChild(b);
  });


  /* Antwoorden controleren */

  $("btn-check").addEventListener("click", function () {
    checkedOnce = true;

    var ok = 0;
    var unlabeled = 0;

    zones.forEach(function (z) {
      var good = labels.get(z) === z.dataset.el;

      z.classList.remove("ok", "bad");

      if (labels.has(z)) {
        z.classList.add(good ? "ok" : "bad");
      } else {
        unlabeled++;
      }

      if (good) ok++;
    });

    updateProgress();

    var total = zones.length;

    if (ok === total && usedSolution1) {
      say(
        feedback,
        ok + "/" + total +
        " — maar je hebt de oplossing bekeken. Druk op <strong>Opnieuw</strong> en probeer het zelf voor een eerlijke score."
      );

    } else if (ok === total) {
      say(
        feedback,
        "Perfect! " + ok + "/" + total +
        " kaders juist — je kent de bouwblokken van het web. Door naar oefening 2!"
      );

    } else {
      say(
        feedback,
        ok + "/" + total + " juist" +
        (unlabeled ? " · nog " + unlabeled + " kader(s) zonder label" : "") +
        ". Foute kaders krijgen een rode rand met ✗. Je kunt elk kader afzonderlijk opnieuw labelen en daarna opnieuw controleren. Tip: het spiekbriefje bovenaan (stap 0)!"
      );
    }

    setSum(
      1,
      ok + "/" + total + (usedSolution1 ? " · met oplossing" : ""),
      ok === total && !usedSolution1
    );
  });


  /* Oplossing tonen */

  $("btn-solution").addEventListener("click", function () {
    zones.forEach(function (z) {
      labels.set(z, z.dataset.el);
      paint(z);

      z.classList.add("ok");
      z.classList.remove("bad");
    });

    usedSolution1 = true;
    checkedOnce = false;

    updateProgress();

    say(
      feedback,
      "Oplossing getoond. Vergelijk met je eigen labels — druk op <strong>Opnieuw</strong> om het zelf te proberen."
    );

    setSum(1, "oplossing bekeken", false);
  });


  /* Opnieuw beginnen */

  $("btn-reset").addEventListener("click", function () {
    labels.clear();

    checkedOnce = false;
    usedSolution1 = false;
    selected = null;

    zones.forEach(function (z) {
      z.classList.remove("selected");
      clearPaint(z);
    });

    updateProgress();

    say(
      feedback,
      "Opnieuw begonnen! Klik op een kader (gestippelde rand) in de website en kies daarna het element uit het palet."
    );

    setSum(1, "—", false);
  });

  updateProgress();


  /* =========================================================
     OEFENING 2 — koppel beschrijving aan element
     ========================================================= */

  var MATCH = [
    {
      el: "table",
      t: "Rijen × kolommen mét verband: een lesrooster, uitslagen of een infobox."
    },
    {
      el: "header",
      t: "Het inleidende blok bovenaan de pagina met bijvoorbeeld een logo, titel en navigatie."
    },
    {
      el: "article",
      t: "Een zelfstandig stuk inhoud dat ook los zou kunnen bestaan: een nieuwsbericht of een review."
    },
    {
      el: "h1",
      t: "De belangrijkste hoofdtitel van de pagina."
    },
    {
      el: "ul",
      t: "Een lijstje met opsommingstekens waarbij de volgorde niets uitmaakt."
    },
    {
      el: "aside",
      t: "Aanvullende inhoud naast de kern: gerelateerde links, een advertentie of een nieuwsbrief."
    },
    {
      el: "p",
      t: "Een gewone alinea lopende tekst."
    },
    {
      el: "nav",
      t: "Een groep links die bedoeld is om naar andere pagina's of onderdelen te navigeren."
    },
    {
      el: "img",
      t: "Een foto, logo of icoon — vergeet de alt-tekst niet!"
    },
    {
      el: "footer",
      t: "Een afsluitend blok met bijvoorbeeld contactgegevens, privacy en auteursinformatie."
    }
  ];

  var mDescBox = $("mdesc");
  var mElemBox = $("melems");
  var fb2 = $("fb2");
  var pill2 = $("pill2");

  var mSel = null;
  var mLocked = 0;
  var mFaults = 0;


  function flash(node) {
    node.classList.remove("badflash");

    void node.offsetWidth;

    node.classList.add("badflash");
  }


  function updatePill2() {
    pill2.textContent =
      mLocked + "/" + MATCH.length + " gekoppeld" +
      (mFaults ? " · " + mFaults + " fout" : "");
  }


  function buildMatch() {
    mDescBox.innerHTML = "";
    mElemBox.innerHTML = "";

    mSel = null;
    mLocked = 0;
    mFaults = 0;

    updatePill2();

    shuffle(MATCH).forEach(function (item) {
      var d = document.createElement("button");

      d.type = "button";
      d.className = "mdesc";
      d.dataset.el = item.el;
      d.setAttribute("aria-pressed", "false");
      d.textContent = item.t;

      d.addEventListener("click", function () {
        if (d.classList.contains("locked")) return;

        Array.prototype.forEach.call(
          mDescBox.children,
          function (c) {
            c.classList.remove("selected");
            c.setAttribute("aria-pressed", "false");
          }
        );

        d.classList.add("selected");
        d.setAttribute("aria-pressed", "true");

        mSel = d;

        say(
          fb2,
          "Beschrijving gekozen. Klik nu rechts op het element dat erbij hoort."
        );
      });

      mDescBox.appendChild(d);
    });


    ELEMS.filter(function (e) {
      return MATCH.some(function (m) {
        return m.el === e.el;
      });
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

        if (!mSel) {
          say(fb2, "Klik eerst links op een beschrijving.");
          return;
        }

        if (mSel.dataset.el === meta.el) {
          mSel.classList.remove("selected");
          mSel.setAttribute("aria-pressed", "false");
          mSel.classList.add("locked");

          b.classList.add("locked");

          mSel = null;
          mLocked++;

          updatePill2();

          if (mLocked === MATCH.length) {
            say(
              fb2,
              mFaults === 0
                ? "Alle " + MATCH.length + " koppels juist, en dat in één poging per koppel — goed gedaan!"
                : "Alle " + MATCH.length + " koppels juist, met " +
                  mFaults + " foute poging" +
                  (mFaults === 1 ? "" : "en") +
                  " tussendoor. Bekijk zeker ook oefening 3!"
            );

            setSum(
              2,
              MATCH.length + "/" + MATCH.length +
              (mFaults ? " · " + mFaults + " fout" : ""),
              mFaults === 0
            );

          } else {
            say(
              fb2,
              "Juist! <strong>" + esc(meta.label) +
              "</strong> vastgeklikt. Nog " +
              (MATCH.length - mLocked) + " te gaan."
            );
          }

        } else {
          mFaults++;

          flash(mSel);
          flash(b);

          updatePill2();

          say(
            fb2,
            "Deze twee horen niet samen. Tip: vraag je af wat het blok <em>is</em>, niet hoe het eruitziet."
          );
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
     De antwoordvolgorde wordt bij elke poging geschud.
     ========================================================= */

  var QUIZ = [
    {
      q: "Je tekent een kader rond de balk met “Home · Nieuws · Agenda · Contact”. Welk element past het best?",
      opts: ["`<nav>`", "`<ul>`", "`<aside>`", "`<div>`"],
      a: 0,
      expl: "De lijst met links zit er vaak in als `<ul>`, maar de structuur die zegt “dit is navigatie” is `<nav>`."
    },
    {
      q: "Een nieuwsbericht op de schoolsite dat integraal op een andere site zou kunnen staan, is …",
      opts: ["`<section>`", "`<article>`", "`<div>`", "`<p>`"],
      a: 1,
      expl: "`<article>` is inhoud die op zichzelf kan staan (bericht, blogpost, review). `<section>` groepeert blokken rond één thema."
    },
    {
      q: "Hoeveel `<h1>`'s hoort er best op één pagina te staan?",
      opts: [
        "Best precies één",
        "Zoveel als je wil",
        "Twee: één voor de site en één voor het artikel",
        "Zes, één per heading-niveau"
      ],
      a: 0,
      expl: "Gebruik bij voorkeur één duidelijke hoofdtitel (`<h1>`) per pagina. Daaronder bouw je met `<h2>` tot `<h6>` een logische inhoudshiërarchie."
    },
    {
      q: "Het blok “Gerelateerde artikels” naast een nieuwsbericht is …",
      opts: ["`<nav>`", "`<section>`", "`<aside>`", "`<footer>`"],
      a: 2,
      expl: "Aanvullende inhoud die verband houdt met de hoofdinhoud kan in `<aside>`. Een groep links om te navigeren kan wel `<nav>` zijn."
    },
    {
      q: "Voor een lesrooster of wedstrijduitslagen (rijen × kolommen mét verband) gebruik je …",
      opts: ["`<div>` met CSS-grid", "`<ul>`", "`<table>`", "`<ol>`"],
      a: 2,
      expl: "Tabelgegevens horen in een `<table>`. Kolommen voor pure lay-out? Gebruik dan CSS-grid of flexbox, geen tabel."
    },
    {
      q: "Waarvoor dient het `alt`-attribuut van `<img>`?",
      opts: [
        "Een beschrijving voor schermlezers, ook zichtbaar als de afbeelding niet laadt",
        "Een bijschrift dat zichtbaar onder de foto verschijnt",
        "Een titel die enkel zoekmachines te zien krijgen",
        "De bestandsnaam van de afbeelding op de server"
      ],
      a: 0,
      expl: "Een schermlezer kan de alt-tekst voorlezen. De tekst verschijnt ook als de afbeelding niet laadt. Een bijschrift onder een foto is aparte tekst."
    }
  ];

  var quizBox = $("quiz");
  var fb3 = $("fb3");
  var pill3 = $("pill3");

  var qState = [];


  function answeredCount() {
    return qState.filter(function (s) {
      return s.pick >= 0;
    }).length;
  }


  function buildQuiz() {
    quizBox.innerHTML = "";
    qState = [];

    pill3.textContent = "0/" + QUIZ.length + " beantwoord";

    say(
      fb3,
      "Kies eerst je antwoorden en druk dan op Controleer."
    );

    QUIZ.forEach(function (item, i) {
      var order = shuffle(
        item.opts.map(function (t, k) {
          return {
            t: t,
            ok: k === item.a
          };
        })
      );

      var correct = 0;

      order.forEach(function (o, k) {
        if (o.ok) correct = k;
      });

      var st = {
        pick: -1,
        done: false,
        correct: correct
      };

      qState.push(st);

      var q = make("div", "q well");

      q.appendChild(
        make(
          "p",
          "q-title",
          "<strong>Vraag " + (i + 1) + ".</strong> " + fmt(item.q)
        )
      );

      var opts = make("div", "opts");

      opts.setAttribute("role", "radiogroup");
      opts.setAttribute(
        "aria-label",
        "Antwoorden bij vraag " + (i + 1)
      );

      var buttons = [];


      function choose(oi) {
        if (st.done) return;

        st.pick = oi;

        buttons.forEach(function (c, ci) {
          var on = ci === oi;

          c.classList.toggle("picked", on);
          c.setAttribute("aria-checked", on ? "true" : "false");
          c.tabIndex = on ? 0 : -1;
        });

        pill3.textContent =
          answeredCount() + "/" + QUIZ.length + " beantwoord";
      }


      order.forEach(function (opt, oi) {
        var o = document.createElement("button");

        o.type = "button";
        o.className = "opt";

        o.setAttribute("role", "radio");
        o.setAttribute("aria-checked", "false");

        o.tabIndex = oi === 0 ? 0 : -1;

        o.appendChild(make("span", "odot"));
        o.appendChild(make("span", null, fmt(opt.t)));

        o.addEventListener("click", function () {
          choose(oi);
        });

        /* Pijltjestoetsen, zoals een echte radiogroep */
        o.addEventListener("keydown", function (e) {
          var next = -1;

          if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            next = (oi + 1) % buttons.length;
          } else if (
            e.key === "ArrowUp" ||
            e.key === "ArrowLeft"
          ) {
            next = (oi - 1 + buttons.length) % buttons.length;
          }

          if (next >= 0) {
            e.preventDefault();
            buttons[next].focus();
            choose(next);
          }
        });

        buttons.push(o);
        opts.appendChild(o);
      });

      q.appendChild(opts);

      q.appendChild(
        make(
          "p",
          "expl",
          "<strong>Uitleg:</strong> " + fmt(item.expl)
        )
      );

      q.querySelector(".expl").hidden = true;

      quizBox.appendChild(q);
    });
  }


  $("btn3-check").addEventListener("click", function () {
    var missing = [];

    qState.forEach(function (s, i) {
      if (!s.done && s.pick < 0) {
        missing.push(i + 1);
      }
    });

    if (missing.length) {
      say(
        fb3,
        "Vraag " + missing.join(", ") +
        " heeft nog geen antwoord. Kies eerst een optie per vraag."
      );
      return;
    }

    var ok = 0;

    qState.forEach(function (s, i) {
      if (s.done) {
        if (s.pick === s.correct) ok++;
        return;
      }

      s.done = true;

      var q = quizBox.children[i];

      q.classList.add("done");

      var good = s.pick === s.correct;

      if (good) ok++;

      Array.prototype.forEach.call(
        q.querySelector(".opts").children,
        function (c, ci) {
          c.classList.remove("picked");

          if (ci === s.pick) {
            c.classList.add(good ? "ok" : "bad");
          }

          if (!good && ci === s.correct) {
            c.classList.add("reveal");
          }
        }
      );

      q.querySelector(".expl").hidden = false;
    });

    pill3.textContent = ok + "/" + QUIZ.length + " juist";

    if (ok === QUIZ.length) {
      say(
        fb3,
        ok + "/" + QUIZ.length + " juist — de theorie zit erin!"
      );
    } else {
      say(
        fb3,
        ok + "/" + QUIZ.length +
        " juist. Lees de uitleg onder de foute vragen en probeer het daarna opnieuw met <strong>Opnieuw</strong>."
      );
    }

    setSum(3, ok + "/" + QUIZ.length, ok === QUIZ.length);
  });


  $("btn3-reset").addEventListener("click", function () {
    buildQuiz();
    setSum(3, "—", false);
  });

  buildQuiz();


  /* =========================================================
     OEFENING 4 — waar of niet waar
     3 × waar, 3 × niet waar.
     De volgorde wordt geschud.
     ========================================================= */

  var TF = [
    {
      s: "Een `<nav>` mag alleen bovenaan de pagina staan.",
      a: false,
      expl: "Ook een zijbalk- of footermenu kan `<nav>` zijn: de functie (navigatielinks aanbieden) telt, niet de plek."
    },
    {
      s: "Een `<div>` heeft geen eigen semantische betekenis en kan gebruikt worden om elementen te groeperen.",
      a: true,
      expl: "Correct. Een `<div>` is een generieke container. Gebruik bij voorkeur een specifieker semantisch element wanneer dat geschikt is."
    },
    {
      s: "Na een `<h2>` volg je best met een `<h3>` en sla je geen heading-niveau over.",
      a: true,
      expl: "Correct: gebruik headings in een logische hiërarchie. Van `<h2>` meteen naar `<h4>` springen kan de structuur van de inhoud onduidelijk maken."
    },
    {
      s: "Een `<article>` moet altijd binnen een `<section>` staan.",
      a: false,
      expl: "Dat hoeft niet. Een `<article>` kan zelfstandig voorkomen. Een artikel met verschillende onderdelen kan zelf ook sections bevatten."
    },
    {
      s: "In een `<ul>` is de volgorde van de items belangrijk.",
      a: false,
      expl: "Dat is `<ol>` (ordered list). `<ul>` is voor lijstjes waarbij de volgorde niet belangrijk is."
    },
    {
      s: "Een `<footer>` mag ook binnen een `<article>` staan, bijvoorbeeld met de auteur en de datum van dat bericht.",
      a: true,
      expl: "Correct: een `<footer>` kan een pagina of een specifiek onderdeel afsluiten. Ook een artikel kan dus een eigen footer hebben."
    }
  ];

  var tfBox = $("tflist");
  var fb4 = $("fb4");
  var pill4 = $("pill4");

  var tfAnswered = 0;
  var tfOk = 0;


  function buildTf() {
    tfBox.innerHTML = "";

    tfAnswered = 0;
    tfOk = 0;

    pill4.textContent = "0/" + TF.length + " beantwoord";

    say(
      fb4,
      "Beoordeel de zes beweringen hierboven."
    );

    shuffle(TF).forEach(function (item) {
      var done = false;

      var box = make("div", "tf-item well");

      box.appendChild(
        make("p", "tf-s", fmt(item.s))
      );

      var btns = make("div", "tfbtns");

      btns.setAttribute("role", "group");
      btns.setAttribute("aria-label", "Waar of niet waar");

      var expl = make(
        "p",
        "expl",
        "<strong>Juist antwoord: " +
        (item.a ? "waar" : "niet waar") +
        ".</strong> " + fmt(item.expl)
      );

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

          var good = val === item.a;

          if (good) {
            tfOk++;
            b.classList.add("ok");
          } else {
            b.classList.add("bad");

            Array.prototype.forEach.call(
              btns.children,
              function (c) {
                if (c !== b) c.classList.add("reveal");
              }
            );
          }

          expl.hidden = false;

          pill4.textContent =
            tfAnswered + "/" + TF.length +
            " beantwoord · " + tfOk + "/" + TF.length + " juist";

          if (tfAnswered === TF.length) {
            say(
              fb4,
              tfOk === TF.length
                ? tfOk + "/" + TF.length +
                  " juist — alle beweringen correct beoordeeld!"
                : tfOk + "/" + TF.length +
                  " juist. Lees de uitleg bij de foute beweringen en herbekijk het spiekbriefje bovenaan (stap 0)."
            );

            setSum(
              4,
              tfOk + "/" + TF.length,
              tfOk === TF.length
            );

          } else {
            say(
              fb4,
              (good ? "Juist! " : "Fout. ") +
              tfAnswered + "/" + TF.length +
              " beantwoord, daarvan " + tfOk + " juist."
            );
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
     Neutrale klassenamen zodat ze het antwoord niet verklappen.
     ========================================================= */

  var SOEP = [
    {
      code: '<div class="blok-1">',
      hint: "logo + zoekbalk + menuknop bovenaan de pagina",
      a: "header"
    },
    {
      code: '<div class="blok-2">',
      hint: "balk of groep met links naar andere pagina's",
      a: "nav"
    },
    {
      code: '<div class="blok-3">',
      hint: "groot afgebakend blok met eigen kop “Agenda” en inhoud eronder",
      a: "section"
    },
    {
      code: '<div class="blok-4">',
      hint: "zelfstandig nieuwsbericht dat ook los kan bestaan",
      a: "article"
    },
    {
      code: '<div class="blok-5">',
      hint: "opsomming met bullets, volgorde maakt niet uit",
      a: "ul"
    },
    {
      code: '<div class="blok-6">',
      hint: "algemene wrapper zonder eigen betekenis, om kaarten naast elkaar te zetten",
      a: "div"
    },
    {
      code: '<div class="blok-7">',
      hint: "© + contact + privacy helemaal onderaan",
      a: "footer"
    }
  ];

  var SOEP_OPTS = [
    "header",
    "nav",
    "section",
    "article",
    "aside",
    "div",
    "ul",
    "table",
    "footer"
  ];

  var soepBox = $("soep");
  var fb5 = $("fb5");
  var pill5 = $("pill5");

  var usedSolution5 = false;


  function buildSoep() {
    soepBox.innerHTML = "";

    usedSolution5 = false;

    pill5.textContent = "0/" + SOEP.length + " juist";

    say(
      fb5,
      "Kies per regel een element uit de lijst en druk dan op Controleer."
    );

    shuffle(SOEP).forEach(function (row, idx) {
      var r = make("div", "soep-row");

      r.dataset.a = row.a;

      var code = document.createElement("code");

      code.className = "soep-code";
      code.textContent = row.code;

      r.appendChild(code);

      r.appendChild(
        make("span", "soep-hint", esc(row.hint))
      );

      var sel = document.createElement("select");

      sel.className = "neu-select";

      sel.setAttribute(
        "aria-label",
        "Element voor regel " + (idx + 1) + ": " + row.hint
      );

      sel.appendChild(
        new Option("kies …", "")
      );

      SOEP_OPTS.forEach(function (o) {
        sel.appendChild(
          new Option("<" + o + ">", o)
        );
      });

      sel.addEventListener("change", function () {
        r.classList.remove("ok", "bad");
        r.querySelector(".soep-mark").textContent = "";
      });

      r.appendChild(sel);
      r.appendChild(make("span", "soep-mark", ""));

      soepBox.appendChild(r);
    });
  }


  function checkSoep(showSolution) {
    var rows = Array.prototype.slice.call(soepBox.children);

    if (showSolution) {
      usedSolution5 = true;

      rows.forEach(function (r) {
        r.querySelector("select").value = r.dataset.a;
      });

    } else {
      /* Eerst controleren of alles ingevuld is, pas daarna markeren */
      var open = rows.filter(function (r) {
        return !r.querySelector("select").value;
      }).length;

      if (open) {
        say(
          fb5,
          "Kies eerst voor elke regel een element (" +
          open + " regel(s) nog leeg)."
        );

        return;
      }
    }

    var ok = 0;

    rows.forEach(function (r) {
      var sel = r.querySelector("select");
      var mark = r.querySelector(".soep-mark");

      var good = sel.value === r.dataset.a;

      r.classList.remove("ok", "bad");
      r.classList.add(good ? "ok" : "bad");

      mark.textContent = good ? "✓" : "✗";

      if (good) ok++;
    });

    var total = SOEP.length;

    if (showSolution) {
      pill5.textContent = ok + "/" + total + " (oplossing)";

      say(
        fb5,
        "Oplossing getoond. Let op het patroon: kop → <strong>header</strong>, " +
        "links → <strong>nav</strong>, thema met eigen kop → <strong>section</strong>, " +
        "zelfstandig bericht → <strong>article</strong>, bullets → <strong>ul</strong>, " +
        "algemene container → <strong>div</strong>, onderkant → <strong>footer</strong>."
      );

      setSum(5, "oplossing bekeken", false);

    } else if (ok === total && usedSolution5) {
      pill5.textContent = ok + "/" + total + " juist · met oplossing";

      say(
        fb5,
        ok + "/" + total +
        " — maar je hebt de oplossing bekeken. Druk op <strong>Opnieuw</strong> voor een eerlijke poging."
      );

      setSum(
        5,
        ok + "/" + total + " · met oplossing",
        false
      );

    } else if (ok === total) {
      pill5.textContent = ok + "/" + total + " juist";

      say(
        fb5,
        ok + "/" + total +
        " juist — deze div-soep is volledig semantisch verbouwd!"
      );

      setSum(
        5,
        ok + "/" + total,
        true
      );

    } else {
      pill5.textContent = ok + "/" + total + " juist";

      say(
        fb5,
        ok + "/" + total +
        " juist. De regels met ✗ bekijk je best nog eens: wat <em>is</em> dat blok eigenlijk?"
      );

      setSum(
        5,
        ok + "/" + total,
        false
      );
    }
  }


  $("btn5-check").addEventListener("click", function () {
    checkSoep(false);
  });

  $("btn5-solution").addEventListener("click", function () {
    checkSoep(true);
  });

  $("btn5-reset").addEventListener("click", function () {
    buildSoep();
    setSum(5, "—", false);
  });

  buildSoep();

})();
