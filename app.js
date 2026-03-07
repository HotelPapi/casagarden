/* CasaGarden — interactive vanilla JS (no build step)
   - Scroll reveal animations
   - Values Sticker Wall (3 sticky notes)
   - Multilingual support: English, Spanish, Haitian Creole, Georgian
*/

(function(){
  "use strict";

  // ===== Language (I18N) =====
  let activeLang = "en";

  const I18N = {
    en: {
      wallTitle: "Values Sticker Wall",
      wallDesc:
        "Tap three values that matter most to you at work. You’ll get a quadrant alignment and leadership insight.",
      tapHint:
        "Tip: on mobile, just tap the value you want. (No dragging needed.)",
      notesRemaining: (n) => `Notes remaining: ${n}`,
      reset: "Reset",
      placeNote: "Tap to place a sticky note",
      progress: (n) => `Progress: ${n}/3 notes placed`,
      needAllThree:
        "Place all 3 sticky notes to get your quadrant alignment and leadership insight.",
      chosenTitle: "Your notes",
      judgementDefaultTitle:
        "Place 3 sticky notes to see your quadrant insight.",
      judgementDefaultDesc:
        "Tap three values that matter most to you at work. We’ll map them into a quadrant to guide leadership approach.",
      primary: (name) => `Primary Alignment: ${name}`,
      blended: (names) => `Blended Alignment: ${names.join(" + ")}`,
      blendedNarrative: (names) =>
        `Your notes are split across ${names.join(
          " + "
        )}. This usually means your team needs a dual approach: stabilize the basics while strengthening culture/leadership signals.`,
      languages: {
        en: "English",
        es: "Español",
        ht: "Kreyòl",
        ka: "ქართული"
      },
      values: {
        fairPay: "Fair Pay",
        threeMeals: "Three Meals a Day",
        respect: "Respect & Appreciation",
        communication: "Communication",
        teamwork: "Teamwork",
        growth: "Growth & Opportunity",
        leadership: "Leadership Support",
        workLife: "Work-Life Balance",
        safety: "Safety",
        recognition: "Recognition",
        kindness: "Kindness & Compassion",
        belonging: "Belonging"
      },
      quadrants: {
        Q1: "Foundational Security",
        Q2: "Belonging & Team Connection",
        Q3: "Personal Growth & Future Orientation",
        Q4: "Respect, Voice & Emotional Intelligence"
      }
    },

    es: {
      wallTitle: "Muro de Valores",
      wallDesc:
        "Toca tres valores que más te importan en el trabajo. Recibirás tu cuadrante y una guía de liderazgo.",
      tapHint:
        "Consejo: en el móvil, solo toca el valor que quieras. (No hace falta arrastrar.)",
      notesRemaining: (n) => `Notas restantes: ${n}`,
      reset: "Reiniciar",
      placeNote: "Toca para colocar una nota",
      progress: (n) => `Progreso: ${n}/3 notas colocadas`,
      needAllThree:
        "Coloca las 3 notas para ver tu cuadrante y la guía de liderazgo.",
      chosenTitle: "Tus notas",
      judgementDefaultTitle: "Coloca 3 notas para ver tu cuadrante.",
      judgementDefaultDesc:
        "Toca tres valores que más te importan en el trabajo. Los mapearemos a un cuadrante para guiar el enfoque de liderazgo.",
      primary: (name) => `Alineación principal: ${name}`,
      blended: (names) => `Alineación combinada: ${names.join(" + ")}`,
      blendedNarrative: (names) =>
        `Tus notas se reparten entre ${names.join(
          " + "
        )}. Esto normalmente indica un enfoque dual: estabilizar lo básico mientras se fortalece la cultura/señales de liderazgo.`,
      languages: {
        en: "English",
        es: "Español",
        ht: "Kreyòl",
        ka: "ქართული"
      },
      values: {
        fairPay: "Pago justo",
        threeMeals: "Tres comidas al día",
        respect: "Respeto y aprecio",
        communication: "Comunicación",
        teamwork: "Trabajo en equipo",
        growth: "Crecimiento y oportunidades",
        leadership: "Apoyo del liderazgo",
        workLife: "Equilibrio vida-trabajo",
        safety: "Seguridad",
        recognition: "Reconocimiento",
        kindness: "Amabilidad y compasión",
        belonging: "Pertenencia"
      },
      quadrants: {
        Q1: "Seguridad fundamental",
        Q2: "Pertenencia y conexión del equipo",
        Q3: "Crecimiento personal y orientación al futuro",
        Q4: "Respeto, voz e inteligencia emocional"
      }
    },

    ht: {
      wallTitle: "Miray Valè yo",
      wallDesc:
        "Manyen 3 valè ki pi enpòtan pou ou nan travay. W ap jwenn kad (quadrant) ou ak yon bon direksyon pou lidèchip.",
      tapHint:
        "Konsèy: sou telefòn, jis manyen valè ou vle a. (Pa bezwen trennen.)",
      notesRemaining: (n) => `Nòt ki rete: ${n}`,
      reset: "Reyinisyalize",
      placeNote: "Manyen pou mete yon nòt",
      progress: (n) => `Pwogrè: ${n}/3 nòt mete`,
      needAllThree:
        "Mete tout 3 nòt yo pou w jwenn kad ou ak direksyon lidèchip la.",
      chosenTitle: "Nòt ou yo",
      judgementDefaultTitle: "Mete 3 nòt pou w wè kad ou.",
      judgementDefaultDesc:
        "Manyen 3 valè ki pi enpòtan pou ou nan travay. N ap mete yo nan yon kad pou gide fason pou dirije ekip la.",
      primary: (name) => `Kad prensipal: ${name}`,
      blended: (names) => `Kad melanje: ${names.join(" + ")}`,
      blendedNarrative: (names) =>
        `Nòt ou yo gaye nan ${names.join(
          " + "
        )}. Sa souvan vle di ou bezwen de apwòch: mete baz yo solid pandan w ap ranfòse kilti / siy lidèchip yo.`,
      languages: {
        en: "English",
        es: "Español",
        ht: "Kreyòl",
        ka: "ქართული"
      },
      values: {
        fairPay: "Salè jis",
        threeMeals: "Twa manje pa jou",
        respect: "Respè ak apresyasyon",
        communication: "Kominikasyon",
        teamwork: "Travay ann ekip",
        growth: "Kwazans ak opòtinite",
        leadership: "Sipò lidèchip",
        workLife: "Balans travay ak lavi",
        safety: "Sekirite",
        recognition: "Rekonesans",
        kindness: "Jantiyès ak konpasyon",
        belonging: "Sans apatenans"
      },
      quadrants: {
        Q1: "Sekirite fondamantal",
        Q2: "Apatenans ak koneksyon ekip",
        Q3: "Kwazans pèsonèl ak vizyon lavni",
        Q4: "Respè, vwa, ak entèlijans emosyonèl"
      }
    },

    ka: {
      wallTitle: "ღირებულებების სტიკერის კედელი",
      wallDesc:
        "აირჩიეთ სამი ღირებულება, რომელიც სამსახურში თქვენთვის ყველაზე მნიშვნელოვანია. მიიღებთ თქვენს კვადრანტს და ლიდერობის ხედვას.",
      tapHint:
        "რჩევა: მობილურზე უბრალოდ შეეხეთ სასურველ ღირებულებას. (გადათრევა არ არის საჭირო.)",
      notesRemaining: (n) => `დარჩენილი სტიკერები: ${n}`,
      reset: "განულება",
      placeNote: "შეეხეთ სტიკერის დასადებად",
      progress: (n) => `პროგრესი: ${n}/3 სტიკერი დადებულია`,
      needAllThree:
        "დაადეთ სამივე სტიკერი, რათა ნახოთ თქვენი კვადრანტი და ლიდერობის ხედვა.",
      chosenTitle: "თქვენი სტიკერები",
      judgementDefaultTitle:
        "დაადეთ 3 სტიკერი, რომ ნახოთ თქვენი კვადრანტი.",
      judgementDefaultDesc:
        "აირჩიეთ სამი ყველაზე მნიშვნელოვანი ღირებულება სამსახურში. ჩვენ მათ კვადრანტში მოვათავსებთ ლიდერობის მიდგომის განსაზღვრისთვის.",
      primary: (name) => `ძირითადი შესაბამისობა: ${name}`,
      blended: (names) => `შერეული შესაბამისობა: ${names.join(" + ")}`,
      blendedNarrative: (names) =>
        `თქვენი სტიკერები გადანაწილებულია ${names.join(
          " + "
        )}-ზე. ეს ჩვეულებრივ ნიშნავს ორმაგ მიდგომას: საფუძვლების გამყარება და პარალელურად კულტურის/ლიდერობის სიგნალების გაძლიერება.`,
      languages: {
        en: "English",
        es: "Español",
        ht: "Kreyòl",
        ka: "ქართული"
      },
      values: {
        fairPay: "სამართლიანი ანაზღაურება",
        threeMeals: "სამი კვება დღეში",
        respect: "პატივისცემა და დაფასება",
        communication: "კომუნიკაცია",
        teamwork: "გუნდური მუშაობა",
        growth: "ზრდა და შესაძლებლობები",
        leadership: "ლიდერობის მხარდაჭერა",
        workLife: "სამუშაო-ცხოვრების ბალანსი",
        safety: "უსაფრთხოება",
        recognition: "აღიარება",
        kindness: "კეთილგანწყობა და თანაგრძნობა",
        belonging: "კუთვნილების შეგრძნება"
      },
      quadrants: {
        Q1: "საფუძვლური უსაფრთხოება",
        Q2: "კუთვნილება და გუნდური კავშირი",
        Q3: "პირადი ზრდა და მომავლის ორიენტაცია",
        Q4: "პატივისცემა, ხმა და ემოციური ინტელექტი"
      }
    }
  };

  function t(){
    return I18N[activeLang] || I18N.en;
  }

  // ===== Scroll reveal =====
  function initReveal(){
    const items = Array.from(document.querySelectorAll('.reveal'));
    if (!items.length) return;

    if (!('IntersectionObserver' in window)){
      items.forEach(el => el.classList.add('visible'));
      return;
    }

    const obs = new IntersectionObserver((entries)=>{
      for (const e of entries){
        if (e.isIntersecting){
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      }
    }, { threshold: 0.14 });

    items.forEach(el => obs.observe(el));
  }

  // ===== Values Sticker Wall =====
  const VALUE_KEYS = [
    "fairPay",
    "threeMeals",
    "respect",
    "communication",
    "teamwork",
    "growth",
    "leadership",
    "workLife",
    "safety",
    "recognition",
    "kindness",
    "belonging"
  ];

  // Quadrant mapping from your framework
  const QUADRANTS = {
    Q1: {
      key: "Q1",
      values: new Set(["fairPay", "threeMeals", "safety", "workLife"]),
      insight:
        "Your team is signaling stability needs first. Lead with clarity, consistency, and practical support: predictable schedules, safety follow-through, and transparent pay/benefits communication.",
      moves: [
        "Reduce scheduling surprises; publish early and stick to it",
        "Make safety & equipment checks visible and routine",
        "Clarify pay rules, OT rules, and meal policies in writing"
      ]
    },
    Q2: {
      key: "Q2",
      values: new Set(["teamwork", "communication", "kindness", "belonging"]),
      insight:
        "Your team is prioritizing connection. Lead with presence and rhythm: tight pre-shifts, clean handoffs, and culture rituals that build trust across departments.",
      moves: [
        "Run short daily pre-shifts with one clear message",
        "Improve handoff notes (rooms, guest requests, maintenance)",
        "Celebrate small wins publicly (shout-outs, photos, gratitude wall)"
      ]
    },
    Q3: {
      key: "Q3",
      values: new Set(["growth", "leadership", "workLife"]),
      insight:
        "Your team is looking ahead. Lead with pathways: training, cross-training, and visible advancement criteria. People want to know there’s a future here.",
      moves: [
        "Offer micro-trainings (10 min) weekly and track completion",
        "Create simple role ladders (GRA I → II, Lead, Supervisor)",
        "Schedule 1:1s focused on goals and strengths"
      ]
    },
    Q4: {
      key: "Q4",
      values: new Set(["respect", "recognition", "leadership"]),
      insight:
        "Your team is asking for dignity signals: being seen, heard, and valued by leadership. The highest ROI is often supervisor behavior + communication tone.",
      moves: [
        "Do quick “recognize in the moment” coaching for supervisors",
        "Invite feedback in low-stakes ways (sticky notes, mini-huddles)",
        "Follow up visibly (“You said / We did”)"
      ]
    }
  };

  function scoreQuadrants(selectedKeys){
    const score = { Q1:0, Q2:0, Q3:0, Q4:0 };

    selectedKeys.forEach(k => {
      if (k === "workLife"){
        score.Q1 += 0.5;
        score.Q3 += 0.5;
        return;
      }
      if (k === "leadership"){
        score.Q3 += 0.5;
        score.Q4 += 0.5;
        return;
      }
      for (const q of Object.values(QUADRANTS)){
        if (q.values.has(k)) score[q.key] += 1;
      }
    });

    return score;
  }

  function topQuadrants(score){
    const entries = Object.entries(score);
    const max = Math.max(...entries.map(([,v])=>v));
    const top = entries.filter(([,v])=>v===max).map(([k])=>k);
    return { max, top };
  }

  function buildJudgement(selectedKeys){
    const score = scoreQuadrants(selectedKeys);
    const { top } = topQuadrants(score);

    if (!selectedKeys.length){
      return {
        label: t().judgementDefaultTitle,
        top,
        score,
        narrative: "",
        moves: []
      };
    }

    if (top.length === 1){
      const q = QUADRANTS[top[0]];
      return {
        label: t().primary(t().quadrants[q.key]),
        top,
        score,
        narrative: q.insight,
        moves: q.moves
      };
    }

    const names = top.map(k => t().quadrants[k]);
    const blendedMoves = top.flatMap(k => QUADRANTS[k].moves).slice(0,5);

    return {
      label: t().blended(names),
      top,
      score,
      narrative: t().blendedNarrative(names),
      moves: blendedMoves
    };
  }
     function initStickerWall(){
    const root = document.querySelector('[data-sticker-wall]');
    if (!root) return;

    const remainingEl = root.querySelector('[data-remaining]');
    const resetBtn = root.querySelector('[data-reset]');
    const listEl = root.querySelector('[data-values]');

    const langRow = root.querySelector('[data-lang-row]');
    const wallTitleEl = root.querySelector('[data-wall-title]');
    const wallDescEl = root.querySelector('[data-wall-desc]');
    const tapHintEl = root.querySelector('[data-tap-hint]');
    const chosenTitleEl = root.querySelector('[data-chosen-title]');

    const chosenEl = root.querySelector('[data-chosen]');
    const judgementTitleEl = root.querySelector('[data-judgement-title]');
    const judgementTextEl = root.querySelector('[data-judgement-text]');
    const movesEl = root.querySelector('[data-judgement-moves]');

    let remaining = 3;
    let picks = []; // array of value keys, length <= 3

    function renderLangButtons(){
      if (!langRow) return;
      langRow.innerHTML = '';

      ["en","es","ht","ka"].forEach(code => {
        const btn = document.createElement('button');
        btn.className = 'btn btn--tiny langBtn' + (activeLang === code ? ' active' : '');
        btn.type = 'button';
        btn.textContent = t().languages[code];

        btn.addEventListener('click', () => {
          activeLang = code;
          renderText();
          renderLangButtons();
          updateResults();
          render();
        });

        langRow.appendChild(btn);
      });
    }

    function renderText(){
      if (wallTitleEl) wallTitleEl.textContent = t().wallTitle;
      if (wallDescEl) wallDescEl.textContent = t().wallDesc;
      if (tapHintEl) tapHintEl.textContent = t().tapHint;
      if (chosenTitleEl) chosenTitleEl.textContent = t().chosenTitle;
      if (resetBtn) resetBtn.textContent = t().reset;
    }

    function render(){
      if (remainingEl) remainingEl.textContent = String(remaining);

      listEl.innerHTML = '';
      VALUE_KEYS.forEach(key => {
        const name = t().values[key];
        const count = picks.filter(p => p === key).length;

        const item = document.createElement('div');
        item.className = 'stickerItem';
        item.setAttribute('role','button');
        item.setAttribute('tabindex','0');
        item.setAttribute('aria-label', `${t().placeNote}: ${name}`);

        const left = document.createElement('div');
        left.innerHTML = `<div class="stickerItem__name">${name}</div><div class="noteSmall">${t().placeNote}</div>`;

        const right = document.createElement('div');
        right.className = 'stickerItem__meta';

        const dots = document.createElement('div');
        dots.className = 'stickerDots';
        for (let i = 0; i < count; i++){
          const dot = document.createElement('div');
          dot.className = 'dot ' + (i === 0 ? 'yellow' : (i === 1 ? 'mint' : 'sky'));
          dots.appendChild(dot);
        }

        const badge = document.createElement('div');
        badge.className = 'quadPill';
        badge.style.background = 'rgba(0,0,0,.04)';
        badge.textContent = count ? `${count}/3` : '0/3';

        right.appendChild(dots);
        right.appendChild(badge);

        function handle(){
          if (remaining <= 0) return;
          picks.push(key);
          remaining -= 1;
          updateResults();
          render();
        }

        item.addEventListener('click', handle);
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handle();
          }
        });

        item.appendChild(left);
        item.appendChild(right);
        listEl.appendChild(item);
      });

      chosenEl.innerHTML = '';
      picks.forEach((key, idx) => {
        const pill = document.createElement('div');
        pill.className = 'quadPill';
        pill.style.background =
          idx === 0 ? 'var(--note-yellow)' :
          idx === 1 ? 'var(--note-mint)' :
          'var(--note-sky)';
        pill.textContent = t().values[key];
        chosenEl.appendChild(pill);
      });

      resetBtn.disabled = picks.length === 0;
    }

    function updateResults(){
      const j = buildJudgement(picks);
      judgementTitleEl.textContent = j.label;
      judgementTextEl.textContent = j.narrative;

      movesEl.innerHTML = '';
      if (j.moves && j.moves.length){
        j.moves.forEach(m => {
          const li = document.createElement('li');
          li.textContent = m;
          movesEl.appendChild(li);
        });
      }

      if (picks.length < 3){
        judgementTitleEl.textContent = t().progress(picks.length);
        judgementTextEl.textContent = t().needAllThree;
        movesEl.innerHTML = '';
      }

      if (picks.length >= 3){
        remaining = 0;
      }

      if (remainingEl) remainingEl.textContent = String(remaining);
    }

    resetBtn.addEventListener('click', () => {
      remaining = 3;
      picks = [];
      judgementTitleEl.textContent = t().judgementDefaultTitle;
      judgementTextEl.textContent = t().judgementDefaultDesc;
      movesEl.innerHTML = '';
      render();
    });

    renderText();
    renderLangButtons();
    updateResults();
    render();
  }

  document.addEventListener('DOMContentLoaded', function(){
    initReveal();
    initStickerWall();
  });

})();
