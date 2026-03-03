// ================= VALUES =================

const values = [
  "Fair Pay",
  "Three Meals a Day",
  "Respect & Appreciation",
  "Communication",
  "Teamwork",
  "Growth & Opportunity",
  "Leadership Support",
  "Work-Life Balance",
  "Safety",
  "Recognition",
  "Kindness & Compassion",
  "Belonging",
];

// ================= STATE =================

let stickersRemaining = 3;

const counts = {};
values.forEach(v => counts[v] = 0);

// ================= QUADRANT MAP =================

const valueToQuadrant = {
  // Q1
  "Fair Pay": "Foundational Security",
  "Three Meals a Day": "Foundational Security",
  "Safety": "Foundational Security",
  "Work-Life Balance": "Foundational Security",

  // Q2
  "Teamwork": "Belonging & Team Connection",
  "Communication": "Belonging & Team Connection",
  "Kindness & Compassion": "Belonging & Team Connection",
  "Belonging": "Belonging & Team Connection",

  // Q3
  "Growth & Opportunity": "Personal Growth & Future Orientation",
  "Leadership Support": "Personal Growth & Future Orientation",

  // Q4
  "Respect & Appreciation": "Respect, Voice & Emotional Intelligence",
  "Recognition": "Respect, Voice & Emotional Intelligence",
};

// ================= COPY =================

const quadrantCopy = {
  "Foundational Security": {
    title: "Quadrant I — Foundational Security",
    tips:
      "Workforce is focused on baseline stability. Prioritize pay clarity, fatigue management, and safety consistency before higher engagement strategies."
  },

  "Belonging & Team Connection": {
    title: "Quadrant II — Belonging & Team Connection",
    tips:
      "Team climate is the signal. Strengthen communication rhythms, reduce silos, and reinforce peer connection behaviors."
  },

  "Personal Growth & Future Orientation": {
    title: "Quadrant III — Personal Growth & Future Orientation",
    tips:
      "Workforce is thinking forward. Clarify advancement pathways, expand cross-training, and increase development visibility."
  },

  "Respect, Voice & Emotional Intelligence": {
    title: "Quadrant IV — Respect, Voice & Emotional Intelligence",
    tips:
      "Dignity signals are dominant. Leadership tone, recognition, and empathy behaviors will have the highest cultural impact."
  },

  "Mixed": {
    title: "Mixed Alignment",
    tips:
      "Selections span multiple workforce layers. Use targeted 1:1 conversations to identify the most urgent pressure point."
  }
};

// ================= BUILD UI =================

const grid = document.getElementById("stickerGrid");

values.forEach(v => {
  const el = document.createElement("div");
  el.className = "stickerItem";

  el.innerHTML = `
    <div class="stickerItem__name">${v}</div>
    <div class="stepper">
      <button class="minus">−</button>
      <div class="count">0</div>
      <button class="plus">+</button>
    </div>
  `;

  const minus = el.querySelector(".minus");
  const plus = el.querySelector(".plus");
  const countEl = el.querySelector(".count");

  plus.onclick = () => {
    if (stickersRemaining <= 0) return;
    counts[v]++;
    stickersRemaining--;
    render();
  };

  minus.onclick = () => {
    if (counts[v] <= 0) return;
    counts[v]--;
    stickersRemaining++;
    render();
  };

  grid.appendChild(el);
});

// ================= QUADRANT ENGINE =================

function computeQuadrant() {
  const tallies = {
    "Foundational Security": 0,
    "Belonging & Team Connection": 0,
    "Personal Growth & Future Orientation": 0,
    "Respect, Voice & Emotional Intelligence": 0,
  };

  Object.entries(counts).forEach(([value, n]) => {
    const q = valueToQuadrant[value];
    if (q) tallies[q] += n;
  });

  const sorted = Object.entries(tallies).sort((a,b)=>b[1]-a[1]);
  const topScore = sorted[0][1];
  const winners = sorted.filter(x=>x[1]===topScore && x[1]>0);

  if (winners.length !== 1) return "Mixed";
  return winners[0][0];
}

// ================= RENDER =================

function render() {
  document.getElementById("stickerRemaining").textContent = stickersRemaining;

  document.querySelectorAll(".stickerItem").forEach((el, i) => {
    const v = values[i];
    el.querySelector(".count").textContent = counts[v];
  });

  // top values
  const topRow = document.getElementById("topValuesRow");
  topRow.innerHTML = "";

  Object.entries(counts)
    .filter(x => x[1] > 0)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3)
    .forEach(([k,v]) => {
      const pill = document.createElement("div");
      pill.className = "topPill";
      pill.textContent = `${k} — ${v}`;
      topRow.appendChild(pill);
    });

  // quadrant
  if (stickersRemaining === 0) {
    const q = computeQuadrant();
    const copy = quadrantCopy[q];

    document.getElementById("quadrantResult").textContent = copy.title;
    document.getElementById("quadrantTips").textContent = copy.tips;
  }
}

// ================= SCROLL REVEAL =================

function initScrollReveal(){
  const targets = document.querySelectorAll(".reveal");

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  }, { threshold: 0.12 });

  targets.forEach(el => obs.observe(el));
}

initScrollReveal();
render();
