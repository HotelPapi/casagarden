/* CasaGarden — interactive vanilla JS (no build step)
   - Scroll reveal animations
   - Values Sticker Wall (3 sticky notes)
*/

(function(){
  "use strict";

  // ===== Scroll reveal =====
  function initReveal(){
    const items = Array.from(document.querySelectorAll('.reveal'));
    if (!items.length) return;

    // If IntersectionObserver isn't available, show everything.
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
  const VALUES = [
    'Fair Pay',
    'Three Meals a Day',
    'Respect & Appreciation',
    'Communication',
    'Teamwork',
    'Growth & Opportunity',
    'Leadership Support',
    'Work-Life Balance',
    'Safety',
    'Recognition',
    'Kindness & Compassion',
    'Belonging'
  ];

  // Quadrant mapping from your framework
  const QUADRANTS = {
    Q1: {
      key: 'Q1',
      name: 'Foundational Security',
      values: new Set(['Fair Pay','Three Meals a Day','Safety','Work-Life Balance']),
      insight:
        'Your team is signaling stability needs first. Lead with clarity, consistency, and practical support: predictable schedules, safety follow-through, and transparent pay/benefits communication.',
      moves: [
        'Reduce scheduling surprises; publish early and stick to it',
        'Make safety & equipment checks visible and routine',
        'Clarify pay rules, OT rules, and meal policies in writing'
      ]
    },
    Q2: {
      key: 'Q2',
      name: 'Belonging & Team Connection',
      values: new Set(['Teamwork','Communication','Kindness & Compassion','Belonging']),
      insight:
        'Your team is prioritizing connection. Lead with presence and rhythm: tight pre-shifts, clean handoffs, and culture rituals that build trust across departments.',
      moves: [
        'Run short daily pre-shifts with one clear message',
        'Improve handoff notes (rooms, guest requests, maintenance)',
        'Celebrate small wins publicly (shout-outs, photos, gratitude wall)'
      ]
    },
    Q3: {
      key: 'Q3',
      name: 'Personal Growth & Future Orientation',
      values: new Set(['Growth & Opportunity','Leadership Support','Work-Life Balance']),
      insight:
        'Your team is looking ahead. Lead with pathways: training, cross-training, and visible advancement criteria. People want to know there’s a future here.',
      moves: [
        'Offer micro-trainings (10 min) weekly and track completion',
        'Create simple role ladders (GRA I → II, Lead, Supervisor)',
        'Schedule 1:1s focused on goals and strengths'
      ]
    },
    Q4: {
      key: 'Q4',
      name: 'Respect, Voice & Emotional Intelligence',
      values: new Set(['Respect & Appreciation','Recognition','Leadership Support']),
      insight:
        'Your team is asking for dignity signals: being seen, heard, and valued by leadership. The highest ROI is often supervisor behavior + communication tone.',
      moves: [
        'Do quick “recognize in the moment” coaching for supervisors',
        'Invite feedback in low-stakes ways (sticky notes, mini-huddles)',
        'Follow up visibly (“You said / We did”)'
      ]
    }
  };

  // Work-Life Balance + Leadership Support appear in multiple quadrants.
  // For scoring, we count them in the quadrant that best fits the framework:
  // - Work-Life Balance: Q1 or Q3 depending on context; we’ll split its weight.
  // - Leadership Support: Q3 or Q4 depending on whether the user picks “growth” or “respect”; we’ll split weight.

  function scoreQuadrants(selectedValues){
    const score = { Q1:0, Q2:0, Q3:0, Q4:0 };

    selectedValues.forEach(v => {
      if (v === 'Work-Life Balance'){
        score.Q1 += 0.5;
        score.Q3 += 0.5;
        return;
      }
      if (v === 'Leadership Support'){
        score.Q3 += 0.5;
        score.Q4 += 0.5;
        return;
      }
      for (const q of Object.values(QUADRANTS)){
        if (q.values.has(v)) score[q.key] += 1;
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

  function buildJudgement(selectedValues){
    const score = scoreQuadrants(selectedValues);
    const { max, top } = topQuadrants(score);

    // If nothing selected
    if (!selectedValues.length){
      return {
        label: 'Place 3 sticky notes to see your quadrant insight.',
        top,
        score,
        narrative: '',
        moves: []
      };
    }

    // Usually 3 notes. If a tie, show blended.
    if (top.length === 1){
      const q = QUADRANTS[top[0]];
      return {
        label: `Primary Alignment: ${q.name}`,
        top,
        score,
        narrative: q.insight,
        moves: q.moves
      };
    }

    // Blended
    const names = top.map(k => QUADRANTS[k].name);
    const blendedMoves = top.flatMap(k => QUADRANTS[k].moves).slice(0,5);
    const blendedNarrative =
      `Your notes are split across ${names.join(' + ')}. This usually means your team needs a dual approach: stabilize the basics while strengthening culture/leadership signals.`;

    return {
      label: `Blended Alignment: ${names.join(' + ')}`,
      top,
      score,
      narrative: blendedNarrative,
      moves: blendedMoves
    };
  }

  function initStickerWall(){
    const root = document.querySelector('[data-sticker-wall]');
    if (!root) return;

    const remainingEl = root.querySelector('[data-remaining]');
    const resetBtn = root.querySelector('[data-reset]');
    const listEl = root.querySelector('[data-values]');

    const chosenEl = root.querySelector('[data-chosen]');
    const judgementTitleEl = root.querySelector('[data-judgement-title]');
    const judgementTextEl = root.querySelector('[data-judgement-text]');
    const movesEl = root.querySelector('[data-judgement-moves]');

    let remaining = 3;
    let picks = []; // array of value names, length <= 3

    function render(){
      remainingEl.textContent = String(remaining);

      // Render list
      listEl.innerHTML = '';
      VALUES.forEach(name => {
        const count = picks.filter(p => p === name).length;

        const item = document.createElement('div');
        item.className = 'stickerItem';
        item.setAttribute('role','button');
        item.setAttribute('tabindex','0');
        item.setAttribute('aria-label', `Place a sticky note on ${name}`);

        const left = document.createElement('div');
        left.innerHTML = `<div class="stickerItem__name">${name}</div><div class="noteSmall">Tap to place a sticky note</div>`;

        const right = document.createElement('div');
        right.className = 'stickerItem__meta';

        const dots = document.createElement('div');
        dots.className = 'stickerDots';
        for (let i=0;i<count;i++){
          const dot = document.createElement('div');
          dot.className = 'dot ' + (i===0 ? 'yellow' : (i===1 ? 'mint' : 'sky'));
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
          picks.push(name);
          remaining -= 1;
          updateResults();
          render();
        }

        item.addEventListener('click', handle);
        item.addEventListener('keydown', (e)=>{
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handle();
          }
        });

        item.appendChild(left);
        item.appendChild(right);
        listEl.appendChild(item);
      });

      // Render chosen pills
      chosenEl.innerHTML = '';
      picks.forEach((p, idx) => {
        const pill = document.createElement('div');
        pill.className = 'quadPill';
        pill.style.background = idx===0 ? 'var(--note-yellow)' : (idx===1 ? 'var(--note-mint)' : 'var(--note-sky)');
        pill.textContent = p;
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

      // If fewer than 3 notes, still show what we can.
      if (picks.length < 3){
        judgementTitleEl.textContent = `Progress: ${picks.length}/3 notes placed`;
        judgementTextEl.textContent = 'Place all 3 sticky notes to get your quadrant alignment and leadership insight.';
        movesEl.innerHTML = '';
      }

      // When complete, lock interaction subtly
      if (picks.length >= 3){
        remaining = 0;
      }

      remainingEl.textContent = String(remaining);
    }

    resetBtn.addEventListener('click', ()=>{
      remaining = 3;
      picks = [];
      judgementTitleEl.textContent = 'Place 3 sticky notes to see your quadrant insight.';
      judgementTextEl.textContent = 'Tap three values that matter most to you at work. We’ll map them into a quadrant to guide leadership approach.';
      movesEl.innerHTML = '';
      render();
    });

    // initial
    updateResults();
    render();
  }

  document.addEventListener('DOMContentLoaded', function(){
    initReveal();
    initStickerWall();
  });

})();
