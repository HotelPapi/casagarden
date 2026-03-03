// Casa Corazon Bloom — vanilla JS interactions
(() => {
  // Year
  document.getElementById("year").textContent = new Date().getFullYear();

  // ---------------------------
  // Values Sticker Wall
  // ---------------------------
  const categories = [
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
    "Belonging"
  ];
  const budget = 5;
  const counts = Object.fromEntries(categories.map(c => [c, 0]));
  const grid = document.getElementById("stickerGrid");
  const remainingEl = document.getElementById("stickerRemaining");
  const topRow = document.getElementById("topValuesRow");

  function totalPlaced(){
    return Object.values(counts).reduce((a,b)=>a+b,0);
  }
  function remaining(){
    return Math.max(0, budget - totalPlaced());
  }
  function renderTop(){
    const entries = Object.entries(counts)
      .filter(([,v]) => v > 0)
      .sort((a,b) => b[1]-a[1])
      .slice(0,3);

    topRow.innerHTML = "";
    if(!entries.length){
      topRow.innerHTML = '<span class="muted small">Place stickers to see your top values.</span>';
      return;
    }
    entries.forEach(([k,v]) => {
      const span = document.createElement("span");
      span.className = "topPill";
      span.textContent = `${k} — ${v}`;
      topRow.appendChild(span);
    });
  }
  function updateRemaining(){
    remainingEl.textContent = remaining();
  }
  function renderStickerGrid(){
    grid.innerHTML = "";
    categories.forEach(cat => {
      const item = document.createElement("div");
      item.className = "stickerItem";
      item.innerHTML = `
        <div class="stickerItem__name">${cat}</div>
        <div class="stepper">
          <button class="minus" aria-label="Remove sticker">−</button>
          <div class="count">${counts[cat]}</div>
          <button class="plus" aria-label="Add sticker">+</button>
        </div>
      `;
      const minus = item.querySelector(".minus");
      const plus = item.querySelector(".plus");
      const countEl = item.querySelector(".count");

      minus.addEventListener("click", () => {
        if(counts[cat] <= 0) return;
        counts[cat] -= 1;
        countEl.textContent = counts[cat];
        updateRemaining();
        renderTop();
      });

      plus.addEventListener("click", () => {
        if(remaining() <= 0) return;
        counts[cat] += 1;
        countEl.textContent = counts[cat];
        updateRemaining();
        renderTop();
      });

      grid.appendChild(item);
    });
    updateRemaining();
    renderTop();
  }

  document.getElementById("stickerReset").addEventListener("click", () => {
    categories.forEach(c => counts[c] = 0);
    renderStickerGrid();
  });
  renderStickerGrid();

  // ---------------------------
  // Playlist (optional audio)
  // ---------------------------
  const tracks = [
    { title: "Morning Kindness Meditation", src: "audio/kindness-01.mp3" },
    { title: "Table of Kindness — Flow", src: "audio/kindness-02.mp3" },
    { title: "Table of Kindness — Closing", src: "audio/kindness-03.mp3" }
  ];
  const audio = document.getElementById("audio");
  const playBtn = document.getElementById("playBtn");
  const playIcon = document.getElementById("playIcon");
  const titleEl = document.getElementById("trackTitle");
  const barFill = document.getElementById("barFill");
  const trackList = document.getElementById("trackList");

  let idx = 0;
  let playing = false;

  function loadTrack(i){
    idx = i;
    audio.src = tracks[idx].src;
    titleEl.textContent = tracks[idx].title;
    barFill.style.width = "0%";
  }
  function setPlaying(p){
    playing = p;
    playIcon.textContent = playing ? "❚❚" : "►";
  }

  playBtn.addEventListener("click", async () => {
    try{
      if(!audio.src) loadTrack(0);
      if(!playing){
        await audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
    } catch(e){
      // Probably missing audio file — keep the UI calm.
      setPlaying(false);
      alert("Audio file not found. Add your own mp3s into /audio and refresh.");
    }
  });

  audio.addEventListener("timeupdate", () => {
    if(!audio.duration) return;
    const pct = Math.min(100, Math.max(0, (audio.currentTime / audio.duration) * 100));
    barFill.style.width = pct.toFixed(1) + "%";
  });
  audio.addEventListener("ended", () => {
    setPlaying(false);
    loadTrack((idx + 1) % tracks.length);
  });

  trackList.innerHTML = "";
  tracks.forEach((t,i) => {
    const b = document.createElement("button");
    b.className = "trackBtn";
    b.textContent = t.title;
    b.addEventListener("click", async () => {
      loadTrack(i);
      try{
        await audio.play();
        setPlaying(true);
      } catch(e){
        setPlaying(false);
        alert("Audio file not found. Add your own mp3s into /audio and refresh.");
      }
    });
    trackList.appendChild(b);
  });
  loadTrack(0);

  // ---------------------------
  // KPI Benchmark
  // ---------------------------
  const minutesEl = document.getElementById("kpiMinutes");
  const roomsEl = document.getElementById("kpiRooms");
  const attendantsEl = document.getElementById("kpiAttendants");
  const rphEl = document.getElementById("kpiRph");
  const labelEl = document.getElementById("kpiLabel");
  const noteEl = document.getElementById("kpiNote");

  function interpretRPH(rph){
    if(!Number.isFinite(rph) || rph <= 0) return null;
    if(rph < 1.8) return { label: "Under baseline", note: "Likely friction in flow, training gaps, or supply issues." };
    if(rph < 2.4) return { label: "Baseline", note: "Stable—look for small system wins (routing, supplies, inspection rhythm)." };
    if(rph < 2.9) return { label: "Strong", note: "Good pace—protect quality with clear standards + audits." };
    return { label: "Elite", note: "High performance—document your system and scale it." };
  }
  function recalcKPI(){
    const m = parseFloat(minutesEl.value);
    const r = parseFloat(roomsEl.value);
    const a = parseFloat(attendantsEl.value);
    if(!(m>0 && r>0 && a>0)){
      rphEl.textContent = "—";
      labelEl.textContent = "Enter valid numbers";
      noteEl.textContent = "Add room types + audit score for real accuracy.";
      return;
    }
    const hours = m / 60;
    const totalRoomHours = hours * a;
    const rph = r / totalRoomHours;
    rphEl.textContent = rph.toFixed(2);
    const interp = interpretRPH(rph);
    labelEl.textContent = interp.label;
    noteEl.textContent = interp.note;
  }
  [minutesEl, roomsEl, attendantsEl].forEach(el => el.addEventListener("input", recalcKPI));
  recalcKPI();

  // ---------------------------
  // PMS Simulator (lite)
  // ---------------------------
  const rooms = [
    { room:"101", type:"King", status:"Clean", guest:"—", balance:0 },
    { room:"102", type:"Double Queen", status:"Dirty", guest:"Garcia, M.", balance:245.00 },
    { room:"103", type:"Suite", status:"Inspected", guest:"—", balance:0 },
    { room:"104", type:"King", status:"Clean", guest:"Johnson, T.", balance:189.50 },
    { room:"105", type:"Double Queen", status:"Out of Order", guest:"—", balance:0 },
    { room:"106", type:"King", status:"Dirty", guest:"Williams, R.", balance:312.00 }
  ];
  let selectedIndex = 0;

  const tbody = document.getElementById("pmsTbody");
  const logEl = document.getElementById("pmsLog");
  const guestInput = document.getElementById("pmsGuest");
  const chargeInput = document.getElementById("pmsCharge");

  function badgeClass(status){
    if(status === "Clean") return "clean";
    if(status === "Dirty") return "dirty";
    if(status === "Inspected") return "inspected";
    return "ooo";
  }
  function fmtMoney(x){ return (x||0).toFixed(2); }
  function addLog(text){
    const div = document.createElement("div");
    div.className = "logItem";
    div.textContent = text;
    logEl.prepend(div);
    // limit
    while(logEl.children.length > 10) logEl.removeChild(logEl.lastChild);
  }

  function renderRooms(){
    tbody.innerHTML = "";
    rooms.forEach((r,i) => {
      const tr = document.createElement("tr");
      if(i === selectedIndex) tr.classList.add("selected");
      tr.innerHTML = `
        <td><strong>${r.room}</strong></td>
        <td>${r.type}</td>
        <td><span class="badge ${badgeClass(r.status)}">${r.status}</span></td>
        <td>${r.guest || "—"}</td>
        <td class="right">${r.balance ? "$"+fmtMoney(r.balance) : "—"}</td>
      `;
      tr.addEventListener("click", () => {
        selectedIndex = i;
        renderRooms();
      });
      tbody.appendChild(tr);
    });
  }
  renderRooms();

  // Status chips
  document.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      const status = btn.getAttribute("data-status");
      rooms[selectedIndex].status = status;
      addLog(`Room ${rooms[selectedIndex].room} status → ${status}.`);
      document.querySelectorAll(".chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderRooms();
    });
  });

  // Check-in
  document.getElementById("pmsCheckIn").addEventListener("click", () => {
    const r = rooms[selectedIndex];
    const guest = (guestInput.value || "").trim();
    if(!guest){ addLog("Add a guest name first."); return; }
    if(!(r.status === "Clean" || r.status === "Inspected")){
      addLog(`Cannot check in: Room ${r.room} is ${r.status}.`);
      return;
    }
    r.guest = guest;
    r.status = "Dirty";
    addLog(`Checked in ${guest} to Room ${r.room}. Status → Dirty (auto).`);
    renderRooms();
  });

  // Check-out
  document.getElementById("pmsCheckOut").addEventListener("click", () => {
    const r = rooms[selectedIndex];
    if(!r.guest || r.guest === "—"){ addLog("No guest to check out."); return; }
    const name = r.guest;
    r.guest = "—";
    r.balance = 0;
    r.status = "Dirty";
    addLog(`Checked out ${name}. Room ${r.room} → Dirty. (HK follows.)`);
    renderRooms();
  });

  // Post charge
  document.getElementById("pmsPostCharge").addEventListener("click", () => {
    const r = rooms[selectedIndex];
    if(!r.guest || r.guest === "—"){ addLog("No guest assigned. Check-in first."); return; }
    const amt = parseFloat(chargeInput.value);
    if(!(amt > 0)){ addLog("Enter a valid charge amount."); return; }
    r.balance = (r.balance || 0) + amt;
    addLog(`Posted $${amt.toFixed(2)} to Room ${r.room}. Balance updated.`);
    renderRooms();
  });

  // ---------------------------
  // Resume builder: live preview + copy + mailto
  // ---------------------------
  const form = document.getElementById("resumeForm");
  const preview = document.getElementById("resumePreview");
  const copyBtn = document.getElementById("copyResume");
  const emailBtn = document.getElementById("emailResume");

  function buildResume(data){
    const lines = [];
    const title = [data.fullName, data.targetRole].filter(Boolean).join(" — ");
    lines.push(title || "Resume");
    const contact = [data.location, data.phone, data.email].filter(Boolean).join(" | ");
    if(contact) lines.push(contact);
    lines.push("");

    if(data.skills){
      lines.push("SKILLS");
      lines.push(data.skills.split(",").map(s=>s.trim()).filter(Boolean).join(" • "));
      lines.push("");
    }
    if(data.languages){
      lines.push("LANGUAGES");
      lines.push(data.languages.trim());
      lines.push("");
    }
    if(data.experience){
      lines.push("EXPERIENCE");
      lines.push(data.experience.trim());
      lines.push("");
    }
    if(data.education){
      lines.push("EDUCATION");
      lines.push(data.education.trim());
      lines.push("");
    }
    if(data.certifications){
      lines.push("CERTIFICATIONS");
      lines.push(data.certifications.trim());
      lines.push("");
    }
    return lines.join("\n").trim();
  }

  function getFormData(){
    const fd = new FormData(form);
    return {
      fullName: (fd.get("fullName")||"").toString().trim(),
      targetRole: (fd.get("targetRole")||"").toString().trim(),
      email: (fd.get("email")||"").toString().trim(),
      phone: (fd.get("phone")||"").toString().trim(),
      location: (fd.get("location")||"").toString().trim(),
      skills: (fd.get("skills")||"").toString().trim(),
      languages: (fd.get("languages")||"").toString().trim(),
      experience: (fd.get("experience")||"").toString().trim(),
      education: (fd.get("education")||"").toString().trim(),
      certifications: (fd.get("certifications")||"").toString().trim(),
    };
    // ===== Scroll Reveal Observer =====

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => {
  observer.observe(el);
});
  }

  function updateResume(){
    const data = getFormData();
    const text = buildResume(data);
    preview.textContent = text || "Start typing to see your resume preview…";

    const subjectBase = data.fullName ? `Resume Request — ${data.fullName}` : "Resume Request";
    const subject = encodeURIComponent(subjectBase);
    const body = encodeURIComponent(
      `${text}\n\n---\nIntake Notes\nTarget role: ${data.targetRole||""}\nLocation: ${data.location||""}\nPhone: ${data.phone||""}\nEmail: ${data.email||""}\n\n(Submitted from Casa Corazon Resume Builder.)`
    );
    emailBtn.href = `mailto:hello@casacorazon.org?subject=${subject}&body=${body}`;
  }

  form.addEventListener("input", updateResume);
  updateResume();

  copyBtn.addEventListener("click", async () => {
    try{
      await navigator.clipboard.writeText(preview.textContent || "");
      copyBtn.textContent = "✓ Copied";
      setTimeout(() => copyBtn.textContent = "▣ Copy Resume", 1200);
    } catch(e){
      alert("Copy failed. You can manually select and copy from the preview box.");
    }
  });
})();
