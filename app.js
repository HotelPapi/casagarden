  // ===== Front Desk / PMS Training Module =====
  function initPMSTraining() {
    const root = document.querySelector("[data-pms-module]");
    if (!root) return;

    const contentEl = root.querySelector("[data-pms-content]");
    const progressFillEl = root.querySelector("[data-pms-progress-fill]");
    const progressTextEl = root.querySelector("[data-pms-progress-text]");

    const GUEST = {
      lastName: "Ramirez",
      firstName: "Sofia",
      confirmationNumber: "CC-84729",
      roomType: "King Deluxe",
      nights: 3,
      checkIn: "Mar 8, 2026",
      checkOut: "Mar 11, 2026",
      roomNumber: "714",
      rate: 189
    };

    const ARRIVALS = [
      GUEST,
      {
        lastName: "Chen",
        firstName: "David",
        confirmationNumber: "CC-33102",
        roomType: "Double Queen",
        nights: 2,
        checkIn: "Mar 8, 2026",
        checkOut: "Mar 10, 2026",
        roomNumber: "502",
        rate: 159
      },
      {
        lastName: "Thompson",
        firstName: "Michelle",
        confirmationNumber: "CC-60215",
        roomType: "Suite",
        nights: 1,
        checkIn: "Mar 8, 2026",
        checkOut: "Mar 9, 2026",
        roomNumber: "901",
        rate: 329
      }
    ];

    const AMENITIES = [
      "Our rooftop pool is open daily from 7 AM to 10 PM — towels are provided.",
      "We have a complimentary fitness center on the 2nd floor, open 24 hours.",
      "Our restaurant, Sol & Sage, serves breakfast from 6:30 to 10:30 AM."
    ];

    const ANALYSIS_STEPS = [
      {
        title: "The Wave & Greeting",
        behaviour: "You initiated contact before the guest reached the desk.",
        psychology:
          "This creates a strong first impression and reduces guest uncertainty. Proactive acknowledgment communicates attentiveness and confidence."
      },
      {
        title: "Open-Ended Greeting",
        behaviour: "\"Hi there! How can I assist you today?\"",
        psychology:
          "This preserves guest agency. It keeps the interaction warm and respectful instead of overly scripted or transactional."
      },
      {
        title: "Asking for Last Name",
        behaviour: "You asked for the last name on the reservation — not the room number.",
        psychology:
          "This protects privacy and signals professionalism. It reinforces safe and competent front desk procedure."
      },
      {
        title: "Collecting Contact Information",
        behaviour: "You confirmed email and phone conversationally.",
        psychology:
          "This keeps the interaction human and efficient while still validating reservation details."
      },
      {
        title: "Authorization Disclosure",
        behaviour: "You explained the authorization hold before processing the card.",
        psychology:
          "Clear expectation setting prevents surprise and builds trust. Financial transparency is one of the strongest service recovery preventers."
      },
      {
        title: "Light Humor with Authority",
        behaviour: "You added a soft joke about not throwing a party.",
        psychology:
          "Humor lowers tension while preserving standards. It communicates policy without sounding cold or punitive."
      },
      {
        title: "Amenity Walkthrough While Encoding Keys",
        behaviour: "You used dead time productively by sharing amenities.",
        psychology:
          "This reduces awkward silence and increases perceived value. It also helps the guest feel oriented before they leave the desk."
      },
      {
        title: "Never Saying the Room Number Aloud",
        behaviour: "You kept the room number private and directed the guest to the key packet.",
        psychology:
          "This is both a security and trust behavior. It shows operational maturity and protective hospitality."
      },
      {
        title: "Walking Toward the Elevator",
        behaviour: "You took two steps in the direction of travel while giving directions.",
        psychology:
          "This physical cue reduces confusion and gently guides guest movement. It makes the service feel escorted, not dismissed."
      },
      {
        title: "Warm Closing",
        behaviour: "\"Have a wonderful stay.\"",
        psychology:
          "The ending of the interaction is highly memorable. A warm close creates a positive emotional anchor."
      }
    ];

    const STEP_ORDER = [
      "intro",
      "greet",
      "ask_purpose",
      "ask_last_name",
      "select_guest",
      "collect_email",
      "collect_phone",
      "process_cc",
      "auth_disclosure",
      "auth_processing",
      "make_keys",
      "amenities",
      "farewell",
      "directions",
      "complete",
      "analysis"
    ];

    let step = "intro";
    let lastNameInput = "";
    let emailInput = "";
    let phoneInput = "";
    let selectedGuest = null;
    let showArrivals = false;
    let authProgress = 0;
    let amenityIndex = 0;
    let searchError = "";
    let authInterval = null;
    let keyTimeout = null;
    let keysReady = false;

    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, function (m) {
        return ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        })[m];
      });
    }

    function setProgress() {
      const idx = STEP_ORDER.indexOf(step);
      const pct = Math.max(0, Math.min(100, Math.round((idx / (STEP_ORDER.length - 1)) * 100)));
      if (progressFillEl) progressFillEl.style.width = pct + "%";
      if (progressTextEl) progressTextEl.textContent = pct + "%";
    }

    function resetModule() {
      step = "intro";
      lastNameInput = "";
      emailInput = "";
      phoneInput = "";
      selectedGuest = null;
      showArrivals = false;
      authProgress = 0;
      amenityIndex = 0;
      searchError = "";
      keysReady = false;

      if (authInterval) clearInterval(authInterval);
      if (keyTimeout) clearTimeout(keyTimeout);

      render();
    }

    function beginAuthProcessing() {
      step = "auth_processing";
      authProgress = 0;
      render();

      if (authInterval) clearInterval(authInterval);
      authInterval = setInterval(() => {
        authProgress += 4;
        if (authProgress >= 100) {
          authProgress = 100;
          clearInterval(authInterval);
          render();
          setTimeout(() => {
            step = "make_keys";
            keysReady = false;
            render();

            if (keyTimeout) clearTimeout(keyTimeout);
            keyTimeout = setTimeout(() => {
              keysReady = true;
              render();
            }, 2000);
          }, 600);
        } else {
          render();
        }
      }, 80);
    }

    function handleSearch() {
      const match = ARRIVALS.find(
        (a) => a.lastName.toLowerCase() === lastNameInput.trim().toLowerCase()
      );

      if (match) {
        searchError = "";
        selectedGuest = match;
        showArrivals = true;
        step = "select_guest";
      } else {
        searchError = "No reservation found. Try again.";
      }
      render();
    }

    function guestBubble(text) {
      return `
        <div class="pmsTrain__guest">
          <div class="pill pill--rose">Guest</div>
          <div class="pmsTrain__guestBubble">${escapeHtml(text)}</div>
        </div>
      `;
    }

    function actionButtons(buttons) {
      return `
        <div class="pmsTrain__actions">
          ${buttons.map((b) => `
            <button class="btn ${b.variant === "secondary" ? "" : "btn--primary"}" type="button" data-action="${b.action}">
              ${b.label}
            </button>
          `).join("")}
        </div>
      `;
    }

    function analysisMarkup() {
      return `
        <div class="pmsTrain__panel">
          <div class="center">
            <h3 class="h3">🧠 Behavioral Analysis</h3>
            <p class="subhead">Here’s why each front desk behavior matters in practice.</p>
          </div>

          <div class="pmsTrain__analysisList">
            ${ANALYSIS_STEPS.map((item, i) => `
              <div class="pmsTrain__analysisItem">
                <div class="pmsTrain__analysisTitle">
                  <span class="pmsTrain__badgeNum">${i + 1}</span>${escapeHtml(item.title)}
                </div>
                <div class="pmsTrain__analysisBehavior">${escapeHtml(item.behaviour)}</div>
                <div class="muted">${escapeHtml(item.psychology)}</div>
              </div>
            `).join("")}
          </div>

          <div class="resultPanel" style="margin-top:16px;">
            <div class="resultTitle">Key takeaway</div>
            <p class="muted">
              Great front desk service is intentional, repeatable behavior rooted in empathy,
              security, timing, and communication.
            </p>
          </div>

          ${actionButtons([
            { action: "reset", label: "Run Module Again", variant: "secondary" }
          ])}
        </div>
      `;
    }

    function render() {
      setProgress();

      let html = "";

      if (step === "intro") {
        html = `
          <div class="pmsTrain__panel">
            <div class="pmsTrain__prompt">
              <div class="pmsTrain__promptTitle">Training Scenario</div>
              <div>
                A guest has just walked through the front entrance and is now about
                <strong>5 feet away</strong> from the front desk. Their name is
                <strong>${GUEST.firstName} ${GUEST.lastName}</strong>.
              </div>
              <div class="pmsTrain__mini">
                Your objective: guide them through a secure, warm, and professional check-in.
              </div>
            </div>
            ${actionButtons([{ action: "begin", label: "Begin Module" }])}
          </div>
        `;
      }

      if (step === "greet") {
        html = `
          <div class="pmsTrain__panel">
            <div class="pmsTrain__prompt">
              <div class="pmsTrain__promptTitle">👋 Guest arrival</div>
              <div>The guest is approaching. Make eye contact, smile, and wave. Then say:</div>
              <div class="pmsTrain__mini"><em>"Hi there! How can I assist you today?"</em></div>
            </div>
            ${actionButtons([{ action: "greeted", label: "I greeted the guest" }])}
          </div>
        `;
      }

      if (step === "ask_purpose") {
        html = `
          <div class="pmsTrain__panel">
            ${guestBubble("Hi! I'm checking in.")}
            <div class="pmsTrain__prompt">
              <div class="pmsTrain__promptTitle">Check-in confirmed</div>
              <div>
                Ask for the <strong>last name on the reservation</strong>. Do not ask for a room number,
                and keep all personal and financial details private.
              </div>
            </div>
            ${actionButtons([{ action: "ask_last_name", label: "Ask for last name" }])}
          </div>
        `;
      }

      if (step === "ask_last_name") {
        html = `
          <div class="pmsTrain__panel">
            <div class="pmsTrain__prompt">
              <div class="pmsTrain__promptTitle">Search the reservation</div>
              <div><em>"May I have the last name on the reservation?"</em></div>
            </div>
            ${guestBubble(`It's ${GUEST.lastName}.`)}
            <div class="pmsTrain__inputRow">
              <input class="pmsTrain__input" type="text" placeholder="Type last name..." value="${escapeHtml(lastNameInput)}" data-last-name-input />
              <button class="btn btn--primary" type="button" data-action="search_last_name">Search</button>
            </div>
            ${searchError ? `<div class="pmsTrain__error">${escapeHtml(searchError)}</div>` : ""}
          </div>
        `;
      }

      if (step === "select_guest") {
        html = `
          <div class="pmsTrain__panel">
            <div class="pmsTrain__prompt">
              <div class="pmsTrain__promptTitle">PMS arrivals list</div>
              <div>Select the matching reservation from today's arrivals.</div>
            </div>

            <div class="pmsTrain__arrivalList">
              ${ARRIVALS.map((a) => `
                <button
                  type="button"
                  class="pmsTrain__arrival ${a.lastName === GUEST.lastName ? "pmsTrain__arrival--match" : ""}"
                  data-select-conf="${a.confirmationNumber}"
                >
                  <div class="pmsTrain__arrivalName">${a.lastName}, ${a.firstName}</div>
                  <div class="pmsTrain__arrivalMeta">
                    Conf# ${a.confirmationNumber} · ${a.roomType} · ${a.nights} night${a.nights > 1 ? "s" : ""}
                  </div>
                </button>
              `).join("")}
            </div>
          </div>
        `;
      }

      if (step === "collect_email") {
        html = `
          <div class="pmsTrain__panel">
            <div class="pmsTrain__prompt">
              <div class="pmsTrain__promptTitle">Verify reservation details</div>
              <div>
                You found <strong>${selectedGuest.firstName} ${selectedGuest.lastName}</strong>.
                Now confirm the <strong>email address</strong>.
              </div>
            </div>
            ${guestBubble("Sure, it's sofia.ramirez@email.com")}
            <div class="pmsTrain__inputRow">
              <input class="pmsTrain__input" type="email" placeholder="Enter guest email..." value="${escapeHtml(emailInput)}" data-email-input />
              <button class="btn btn--primary" type="button" data-action="confirm_email">Confirm</button>
            </div>
          </div>
        `;
      }

      if (step === "collect_phone") {
        html = `
          <div class="pmsTrain__panel">
            <div class="pmsTrain__prompt">
              <div class="pmsTrain__promptTitle">Verify phone number</div>
              <div>Now confirm the guest's <strong>phone number</strong>.</div>
            </div>
            ${guestBubble("(555) 234-8891")}
            <div class="pmsTrain__inputRow">
              <input class="pmsTrain__input" type="tel" placeholder="Enter phone number..." value="${escapeHtml(phoneInput)}" data-phone-input />
              <button class="btn btn--primary" type="button" data-action="confirm_phone">Confirm</button>
            </div>
          </div>
        `;
      }

      if (step === "process_cc") {
        html = `
          <div class="pmsTrain__panel">
            <div class="pmsTrain__prompt">
              <div class="pmsTrain__promptTitle">Payment card handling</div>
              <div>
                Before running the card, disclose the authorization hold clearly and professionally.
              </div>
            </div>
            ${actionButtons([{ action: "auth_disclosure", label: "Inform guest about authorization" }])}
          </div>
        `;
      }

      if (step === "auth_disclosure") {
        html = `
          <div class="pmsTrain__panel">
            <div class="pmsTrain__prompt">
              <div class="pmsTrain__promptTitle">💳 Authorization disclosure</div>
              <div><em>"I'll be placing an authorization on your card for the room, tax, and incidentals. The hold will return to your account within 3 to 5 business days after checkout — as long as there's no crazy party in the room!"</em></div>
            </div>
            ${guestBubble("Ha! No parties, I promise. Go ahead!")}
            ${actionButtons([{ action: "process_auth", label: "Process authorization" }])}
          </div>
        `;
      }

      if (step === "auth_processing") {
        html = `
          <div class="pmsTrain__panel">
            <div class="pmsTrain__prompt">
              <div class="pmsTrain__promptTitle">Processing authorization...</div>
              <div class="pmsTrain__meter">
                <div class="pmsTrain__meterFill" style="width:${authProgress}%"></div>
              </div>
              <div class="pmsTrain__mini">
                ${authProgress < 100
                  ? "Verifying card..."
                  : `✓ Authorization approved — $${(GUEST.rate * GUEST.nights * 1.15).toFixed(2)}`}
              </div>
            </div>
          </div>
        `;
      }

      if (step === "make_keys") {
        html = `
          <div class="pmsTrain__panel">
            <div class="pmsTrain__prompt">
              <div class="pmsTrain__promptTitle">🔑 Encode two keys</div>
              <div>While the keys are encoding, use the time to share useful guest information.</div>
            </div>
            <div class="pmsTrain__mini">
              ${keysReady ? "✓ Two keys ready!" : "Encoding keys..."}
            </div>
            ${actionButtons([{ action: "share_amenities", label: "Share amenities" }])}
          </div>
        `;
      }

      if (step === "amenities") {
        html = `
          <div class="pmsTrain__panel">
            <div class="pmsTrain__prompt">
              <div class="pmsTrain__promptTitle">Share amenity ${amenityIndex + 1} of 3</div>
              <div><em>"${escapeHtml(AMENITIES[amenityIndex])}"</em></div>
            </div>
            ${guestBubble(
              amenityIndex === 0
                ? "Oh nice, a pool!"
                : amenityIndex === 1
                ? "Great, I was hoping there was a gym."
                : "Perfect, I'll check that out for breakfast."
            )}
            ${actionButtons([
              { action: "next_amenity", label: amenityIndex < 2 ? "Next amenity" : "Continue" }
            ])}
          </div>
        `;
      }

      if (step === "farewell") {
        html = `
          <div class="pmsTrain__panel">
            <div class="pmsTrain__prompt">
              <div class="pmsTrain__promptTitle">Guest close-out</div>
              <div><em>"If you need anything at all, just dial 0 from your room phone or come see us here at the front desk. Have a wonderful stay!"</em></div>
            </div>
            ${guestBubble("Thank you so much! Actually — which way is my room?")}
            ${actionButtons([{ action: "directions", label: "Give directions" }])}
          </div>
        `;
      }

      if (step === "directions") {
        html = `
          <div class="pmsTrain__panel">
            <div class="pmsTrain__prompt">
              <div class="pmsTrain__promptTitle">🚶 Secure room directions</div>
              <div><em>"Your room number is right on the key card — head to the corresponding floor, and you'll find your room on the left side of the hallway."</em></div>
              <div class="pmsTrain__mini">Take two steps toward the elevator while gesturing in that direction.</div>
            </div>
            ${guestBubble("Got it, thank you!")}
            ${actionButtons([{ action: "complete", label: "Complete check-in" }])}
          </div>
        `;
      }

      if (step === "complete") {
        html = `
          <div class="pmsTrain__panel center">
            <div class="resultTitle">Module complete</div>
            <p class="muted" style="margin-top:8px;">
              ${GUEST.firstName} ${GUEST.lastName} has been checked in successfully.
            </p>
            ${actionButtons([
              { action: "analysis", label: "View Behavioral Analysis" },
              { action: "reset", label: "Start Over", variant: "secondary" }
            ])}
          </div>
        `;
      }

      if (step === "analysis") {
        html = analysisMarkup();
      }

      contentEl.innerHTML = html;
      bindEvents();
    }

    function bindEvents() {
      const actionEls = contentEl.querySelectorAll("[data-action]");
      actionEls.forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.getAttribute("data-action");

          if (action === "begin") step = "greet";
          if (action === "greeted") step = "ask_purpose";
          if (action === "ask_last_name") step = "ask_last_name";
          if (action === "search_last_name") handleSearch();
          if (action === "confirm_email" && emailInput.trim()) step = "collect_phone";
          if (action === "confirm_phone" && phoneInput.trim()) step = "process_cc";
          if (action === "auth_disclosure") step = "auth_disclosure";
          if (action === "process_auth") return beginAuthProcessing();
          if (action === "share_amenities") step = "amenities";
          if (action === "next_amenity") {
            if (amenityIndex < 2) {
              amenityIndex += 1;
            } else {
              step = "farewell";
            }
          }
          if (action === "directions") step = "directions";
          if (action === "complete") step = "complete";
          if (action === "analysis") step = "analysis";
          if (action === "reset") return resetModule();

          render();
        });
      });

      const selectEls = contentEl.querySelectorAll("[data-select-conf]");
      selectEls.forEach((btn) => {
        btn.addEventListener("click", () => {
          const conf = btn.getAttribute("data-select-conf");
          const found = ARRIVALS.find((a) => a.confirmationNumber === conf);
          if (found && found.lastName === GUEST.lastName) {
            selectedGuest = found;
            step = "collect_email";
            render();
          }
        });
      });

      const lastNameInputEl = contentEl.querySelector("[data-last-name-input]");
      if (lastNameInputEl) {
        lastNameInputEl.addEventListener("input", (e) => {
          lastNameInput = e.target.value;
          searchError = "";
        });
        lastNameInputEl.addEventListener("keydown", (e) => {
          if (e.key === "Enter") handleSearch();
        });
      }

      const emailInputEl = contentEl.querySelector("[data-email-input]");
      if (emailInputEl) {
        emailInputEl.addEventListener("input", (e) => {
          emailInput = e.target.value;
        });
        emailInputEl.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && emailInput.trim()) {
            step = "collect_phone";
            render();
          }
        });
      }

      const phoneInputEl = contentEl.querySelector("[data-phone-input]");
      if (phoneInputEl) {
        phoneInputEl.addEventListener("input", (e) => {
          phoneInput = e.target.value;
        });
        phoneInputEl.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && phoneInput.trim()) {
            step = "process_cc";
            render();
          }
        });
      }
    }

    render();
  }

  document.addEventListener('DOMContentLoaded', function(){
    initReveal();
    initStickerWall();
    initPMSTraining();
  });

})();
