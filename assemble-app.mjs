import fs from 'node:fs';

const css = fs.readFileSync('_merged.css', 'utf8');
const BRAND = 'ReRouteHer';

const bfly = (id) => `<svg width="30" height="30" viewBox="0 0 48 48" fill="none" style="flex:none;overflow:visible;">
  <defs>
    <linearGradient id="${id}_fore" x1="6" y1="4" x2="42" y2="40" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#9EB0E4"/>
      <stop offset="50%" stop-color="#6E82C8"/>
      <stop offset="100%" stop-color="#4B5BA4"/>
    </linearGradient>
    <linearGradient id="${id}_hind" x1="10" y1="18" x2="38" y2="44" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F8D8E5"/>
      <stop offset="50%" stop-color="#D0C4E6"/>
      <stop offset="100%" stop-color="#889AD0"/>
    </linearGradient>
  </defs>
  <path d="M24 14 C17 3, 5 6, 4 17 C3 25, 14 27, 24 21 C34 27, 45 25, 44 17 C43 6, 31 3, 24 14 Z" fill="url(#${id}_fore)"/>
  <path d="M24 21 C17 26, 7 30, 8 38 C9 43, 17 44, 21 37 C23 33, 24 29, 24 21 C24 29, 25 33, 27 37 C31 44, 39 43, 40 38 C41 30, 31 26, 24 21 Z" fill="url(#${id}_hind)" opacity="0.9"/>
  <path d="M22 13 C20 8 16 5 13 4 M26 13 C28 8 32 5 35 4" stroke="#3A4678" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="24" y1="12" x2="24" y2="34" stroke="#252D56" stroke-width="1.4" stroke-linecap="round"/>
</svg>`;

const logo = (id) => `<div style="display:flex;align-items:center;gap:10px;cursor:pointer;" onclick="showView('landing')">${bfly(id)}<div class="disp js-nologo" style="font-weight:800;font-size:18px;letter-spacing:-.01em;color:var(--ink);">${BRAND}</div></div>`;

function stepper(current, labels, dests) {
  let out = '<div class="js-stepper" style="display:flex;align-items:center;gap:0;margin-bottom:8px;">';
  for (let i = 1; i <= labels.length; i++) {
    const isComplete = i < current;
    const isActive = i === current;
    const cls = isComplete ? 'step-c complete' : (isActive ? 'step-c active' : 'step-c future');
    const inner = isComplete ? '&#10003;' : String(i);
    const btn = isComplete
      ? `<button type="button" class="${cls}" onclick="showView('${dests[i - 1]}')" title="Jump back to ${labels[i - 1]}">${inner}</button>`
      : `<div class="${cls}">${inner}</div>`;
    out += `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;">${btn}<div style="font-size:11px;font-weight:${isActive || isComplete ? 700 : 600};color:${isActive || isComplete ? 'var(--ink)' : 'var(--ink-faint)'};">${labels[i - 1]}</div></div>`;
    if (i < labels.length) {
      const lineCls = i < current ? 'step-line complete' : 'step-line future';
      out += `<div class="${lineCls}"></div>`;
    }
  }
  out += '</div>';
  if (current > 1) out += `<div style="font-size:11px;color:var(--ink-faint);margin-bottom:22px;display:flex;align-items:center;gap:5px;"><span>&#8618;</span> Click a completed step to jump back &mdash; your inputs are automatically saved.</div>`;
  else out += `<div style="margin-bottom:22px;"></div>`;
  return out;
}

const mask = (html, cls = 'js-title') => `<div class="reveal-mask"><div class="reveal-inner ${cls}">${html}</div></div>`;

const STEP_LABELS = ['Upload CV', 'Career Break', 'Skill Snapshot', 'Target Role & Gap'];
const STEP_DESTS = ['story-a', 'story-b', 'snapshot', 'gap'];

// ============ LANDING (E1) ============
const landing = `
<div style="min-height:1150px;background:#FBF8FA;">
  <div class="hero" style="position:relative;padding-bottom:70px;overflow:hidden;">
    <div class="grain"></div>
    <div class="blur-orb js-parallax" data-speed="0.15" style="width:420px;height:420px;left:-120px;bottom:-140px;background:#F6DCE6;opacity:.45;"></div>
    <div class="blur-orb js-parallax" data-speed="0.25" style="width:380px;height:380px;right:-100px;top:-120px;background:#BAC7EB;opacity:.4;"></div>
    <div class="star" style="top:60px;left:38%;"></div><div class="star" style="top:140px;left:62%;"></div>
    <div class="star" style="top:220px;left:80%;width:2px;height:2px;"></div><div class="star" style="top:90px;left:52%;width:2px;height:2px;"></div>

    <!-- Full-height hero butterfly oil painting artwork attached to the right edge with edge gradient fade & 80% opacity -->
    <div class="hero-artwork-container" style="position:absolute;top:0;right:0;bottom:0;height:100%;display:flex;align-items:center;justify-content:flex-end;pointer-events:none;z-index:1;overflow:hidden;">
      <img src="hero-butterfly-oil.png" alt="ReRouteHer Ethereal Butterfly Oil Painting" class="hero-butterfly-img" style="height:100%;max-height:100%;width:auto;object-fit:contain;object-position:right center;opacity:0.8;-webkit-mask-image:radial-gradient(ellipse 75% 85% at 52% 48%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0) 100%);mask-image:radial-gradient(ellipse 75% 85% at 52% 48%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0) 100%);filter:drop-shadow(0 20px 35px rgba(50,45,90,.16));" />
    </div>

    <div style="position:relative;display:flex;align-items:center;justify-content:space-between;padding:26px 60px;z-index:2;">
      ${logo('bflyL')}
    </div>
    <div style="position:relative;display:grid;grid-template-columns:1.1fr 0.9fr;gap:30px;padding:44px 60px 0;align-items:center;z-index:2;min-height:420px;">
      <div style="max-width:540px;">
        ${mask('See what you still<br/>have to offer', 'js-title js-hero-title')}
        <div class="js-sub" style="font-size:16.5px;line-height:1.6;color:rgba(38,43,74,.78);margin-top:18px;max-width:480px;">Coming back to work after a career break can feel like starting from zero. It isn&rsquo;t. We turn your resume and life experience into an actionable skill readiness plan.</div>
        <div class="js-sub" style="display:flex;gap:14px;margin-top:28px;">
          <button type="button" class="pill-btn primary btn-reset" id="get-started-btn" onclick="beginIntake()">
            <span>Get started</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
      <div class="js-img" style="position:relative;min-height:360px;">
      </div>
    </div>
  </div>

  <div class="scroll-section" style="max-width:1000px;margin:0 auto;padding:70px 60px 10px;">
    ${mask('Two simple inputs. Zero guesswork.', 'js-scroll-title')}
    <div class="js-scroll-sub" style="font-size:14.5px;color:var(--ink-soft);margin-top:8px;max-width:520px;">Upload your CV, describe your career break, and our AI maps your real-world skills to market demand.</div>
    <div class="journey-stepper" style="display:flex;gap:0;margin-top:44px;">
      <div class="journey-step js-scroll-card">
        <div class="journey-num">1</div>
        <div class="journey-track"></div>
        <div class="disp" style="font-weight:700;font-size:16px;margin-top:14px;">Upload your CV</div>
        <div style="font-size:13px;color:var(--ink-soft);margin-top:6px;">Extract your core career competencies directly.</div>
      </div>
      <div class="journey-step js-scroll-card">
        <div class="journey-num">2</div>
        <div class="journey-track"></div>
        <div class="disp" style="font-weight:700;font-size:16px;margin-top:14px;">Describe your break</div>
        <div style="font-size:13px;color:var(--ink-soft);margin-top:6px;">Tell us what you did &mdash; AI reframes it to O*NET.</div>
      </div>
      <div class="journey-step js-scroll-card">
        <div class="journey-num">3</div>
        <div class="disp" style="font-weight:700;font-size:16px;margin-top:14px;">See fit &amp; top gaps</div>
        <div style="font-size:13px;color:var(--ink-soft);margin-top:6px;">Get your transparent readiness score &amp; focus areas.</div>
      </div>
    </div>
  </div>

  <div class="scroll-section" style="display:grid;grid-template-columns:repeat(3,1fr);gap:22px;padding:70px 60px 0;">
    <div class="glass js-scroll-card" style="padding:30px 26px;">
      <div style="width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#FBDCE6,#D8C6DF);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B4E7A" stroke-width="1.8"><path d="M12 3v9m0 0l-3.5-3.5M12 12l3.5-3.5M5 15v3a2 2 0 002 2h10a2 2 0 002-2v-3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div class="disp" style="font-weight:700;font-size:16.5px;">Your break counts as experience</div>
      <div style="font-size:13.5px;color:var(--ink-soft);margin-top:8px;line-height:1.55;">Caring for family built real skills: budgeting, scheduling, coordination. We name them and map them straight to standard taxonomies.</div>
    </div>
    <div class="glass js-scroll-card" style="padding:30px 26px;">
      <div style="width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#D8C6DF,#B7C0E4);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4E4E80" stroke-width="1.8"><circle cx="12" cy="12" r="9" stroke-linecap="round"/><path d="M12 7v5l3 3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div class="disp" style="font-weight:700;font-size:16.5px;">Transparent, weighted readiness</div>
      <div style="font-size:13.5px;color:var(--ink-soft);margin-top:8px;line-height:1.55;">A transparent score for any target role &mdash; explaining exactly why you're ready and how closing 3 focus areas gets you to ~94%.</div>
    </div>
    <div class="glass js-scroll-card" style="padding:30px 26px;">
      <div style="width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#B7C0E4,#8C97D0);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#33366B" stroke-width="1.8"><path d="M4 19h16M7 15l3-5 3 3 4-7" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div class="disp" style="font-weight:700;font-size:16.5px;">Three focus areas, never a wall</div>
      <div style="font-size:13.5px;color:var(--ink-soft);margin-top:8px;line-height:1.55;">Capped, ranked by impact, and tailored to your target &mdash; never a demoralising wall of 20+ overwhelming requirements.</div>
    </div>
  </div>
  <div style="height:70px;"></div>
</div>`;

// ============ STEP 1: UPLOAD CV (E2a) — MANDATORY, NO SKIP, NO MANUAL OPTION ============
const storyA = `
<div style="min-height:900px;background:var(--grad-soft);">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:24px 56px;">${logo('bfly2a')}</div>
  <div style="max-width:680px;margin:0 auto;padding:0 24px;">
    ${stepper(1, STEP_LABELS, STEP_DESTS)}
    ${mask('Upload your CV')}
    <div class="js-sub" style="font-size:14.5px;color:var(--ink-soft);margin-top:6px;">We analyze your previous experience to extract your core professional skills automatically.</div>

    <div class="glass js-card" style="padding:32px 28px;margin-top:24px;">
      <div class="field-label" style="font-size:14px;">Select your CV file <span style="color:var(--pink-500);">*</span></div>
      <div id="cv-dropzone" class="dropzone" tabindex="0" role="button" aria-label="Upload your CV, PDF or DOCX, up to 10 megabytes"
           onclick="document.getElementById('cv-input').click()"
           onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();document.getElementById('cv-input').click();}"
           ondragover="event.preventDefault();this.classList.add('drag');"
           ondragleave="this.classList.remove('drag');"
           ondrop="event.preventDefault();this.classList.remove('drag');handleCvFile(event.dataTransfer.files[0]);">
        <input type="file" id="cv-input" accept=".pdf,.doc,.docx" style="display:none;" onchange="handleCvFile(this.files[0]); this.value='';"/>
        
        <div id="cv-empty-state">
          <div style="width:52px;height:52px;border-radius:16px;background:rgba(232,93,138,.12);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;color:var(--pink-500);">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15l3-3 3 3"/></svg>
          </div>
          <div style="font-size:14px;font-weight:700;color:var(--ink);">Drag and drop your CV here, or click to browse</div>
          <div style="font-size:12px;color:var(--ink-faint);margin-top:4px;">Supports PDF or DOCX (up to 10MB) &middot; Parsed securely</div>
        </div>

        <div id="cv-file-state" style="display:none;align-items:center;justify-content:space-between;gap:12px;background:rgba(255,255,255,.9);padding:14px 18px;border-radius:14px;border:1.5px solid rgba(46,115,85,.3);">
          <div style="display:flex;align-items:center;gap:12px;min-width:0;">
            <div style="width:40px;height:40px;border-radius:10px;background:var(--mint-100);display:flex;align-items:center;justify-content:center;color:var(--mint-700);flex:none;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
            </div>
            <div style="min-width:0;text-align:left;">
              <div id="cv-filename" style="font-size:14px;font-weight:700;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:320px;"></div>
              <div id="cv-filesize" style="font-size:11.5px;color:var(--mint-700);font-weight:600;"></div>
            </div>
          </div>
          <button type="button" class="btn-reset" onclick="event.stopPropagation();removeCvFile();" style="font-size:12px;font-weight:700;color:var(--pink-500);cursor:pointer;padding:6px 14px;border-radius:999px;background:rgba(232,93,138,.1);">Remove</button>
        </div>
      </div>
      <div id="cv-error" class="field-error" style="display:none;"></div>

      <!-- Quick Demo Sample Loader -->
      <div style="margin-top:18px;display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,.5);padding:12px 16px;border-radius:12px;border:1px dashed rgba(90,90,140,.2);">
        <div style="font-size:12.5px;color:var(--ink-soft);">Want to try without a file right now?</div>
        <button type="button" class="btn-reset" onclick="loadSampleCv()" style="font-size:12.5px;font-weight:700;color:var(--blue-600);cursor:pointer;padding:4px 10px;border-radius:8px;background:rgba(70,83,158,.1);">
          ⚡ Load Sample CV (Sarah &middot; UX Lead)
        </button>
      </div>
    </div>

    <div class="js-card" style="text-align:center;margin-top:26px;padding-bottom:60px;">
      <button type="button" id="cv-continue-btn" class="pill-btn primary btn-reset" style="display:flex;width:100%;max-width:320px;margin:0 auto;" onclick="validateAndContinueStoryA()">
        <span>Continue to Career Break</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
  </div>
</div>`;

// ============ STEP 2: CAREER BREAK QUESTIONNAIRE (E2b) — ONLY 2 QUESTIONS (DURATION + FREE TEXT INPUT) ============
const storyB = `
<div style="min-height:980px;background:var(--grad-soft);">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:24px 56px;">${logo('bfly2b')}</div>
  <div style="max-width:700px;margin:0 auto;padding:0 24px;">
    ${stepper(2, STEP_LABELS, STEP_DESTS)}
    ${mask('Tell us about your career break')}
    <div class="js-sub" style="font-size:14.5px;color:var(--ink-soft);margin-top:6px;">Your time out counts as real experience &mdash; just two simple questions for our AI model.</div>

    <div class="glass js-card" style="padding:30px;margin-top:22px;display:flex;flex-direction:column;gap:26px;">
      <!-- Question 1: Duration -->
      <div>
        <div class="field-label" style="font-size:14.5px;margin-bottom:6px;">1. Roughly how long was your career break?</div>
        <div style="font-size:12.5px;color:var(--ink-soft);margin-bottom:14px;">Select the total duration of your time away from formal employment.</div>
        <div style="display:flex;align-items:center;gap:18px;background:rgba(255,255,255,.6);padding:14px 20px;border-radius:14px;border:1px solid rgba(90,90,140,.12);">
          <input id="break-years" type="range" min="0.5" max="15" step="0.5" value="3"
            oninput="document.getElementById('break-years-label').textContent = this.value + ' years';"
            onchange="saveIntake()" class="slider" style="flex:1;"/>
          <div id="break-years-label" style="font-size:15px;font-weight:800;color:var(--ink);min-width:74px;text-align:right;background:var(--mint-100);color:var(--mint-700);padding:5px 12px;border-radius:999px;">3 years</div>
        </div>
      </div>

      <!-- Question 2: Free Text Input (What did you do?) -->
      <div>
        <div class="field-label" style="font-size:14.5px;margin-bottom:6px;">2. What did you do during this time? <span style="color:var(--pink-500);">*</span></div>
        <div style="font-size:12.5px;color:var(--ink-soft);margin-bottom:12px;">Describe in your own words (e.g. caregiving, household management, budget oversight, volunteering, self-study, side projects).</div>
        
        <textarea id="break-text-input" rows="5" oninput="saveIntake()" placeholder="e.g. Cared for 2 children full-time, managed household budget and family schedules, organized school fundraisers, and self-studied digital design tools..." style="width:100%;border-radius:14px;border:1.5px solid rgba(90,90,140,.22);background:rgba(255,255,255,.85);padding:14px 16px;font-family:inherit;font-size:14px;line-height:1.55;color:var(--ink);box-sizing:border-box;resize:vertical;outline:none;"></textarea>

        <!-- Quick suggestion tags to assist text entry -->
        <div style="margin-top:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <div style="font-size:11.5px;font-weight:700;color:var(--ink-faint);">Click to add examples:</div>
          <button type="button" class="btn-reset chip" onclick="appendBreakText('Cared for children & managed family logistics')" style="font-size:11.5px;padding:6px 12px;cursor:pointer;">+ Childcare</button>
          <button type="button" class="btn-reset chip" onclick="appendBreakText('Managed household budgeting & expenses')" style="font-size:11.5px;padding:6px 12px;cursor:pointer;">+ Budgeting</button>
          <button type="button" class="btn-reset chip" onclick="appendBreakText('Organized community volunteer projects')" style="font-size:11.5px;padding:6px 12px;cursor:pointer;">+ Volunteering</button>
          <button type="button" class="btn-reset chip" onclick="appendBreakText('Self-study & online design courses')" style="font-size:11.5px;padding:6px 12px;cursor:pointer;">+ Self-study</button>
        </div>
        <div id="break-text-error" class="field-error" style="display:none;margin-top:10px;"></div>
      </div>
    </div>

    <div class="js-card" style="display:flex;align-items:center;justify-content:space-between;margin-top:28px;padding-bottom:60px;gap:16px;">
      <button type="button" class="btn-reset" onclick="showView('story-a')" style="font-size:13.5px;font-weight:700;color:var(--ink-soft);display:flex;align-items:center;gap:6px;cursor:pointer;">
        <span>&larr;</span> Back to CV
      </button>
      <button type="button" class="pill-btn primary btn-reset" onclick="validateAndContinueStoryB()">
        <span>See my skill snapshot</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
  </div>
</div>`;

// ============ STEP 3: SKILL SNAPSHOT (E3 · READ-ONLY HISTORY BASELINE) ============
const snapshot = `
<div style="min-height:960px;background:var(--grad-soft);">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:24px 56px;">${logo('bfly3')}</div>
  <div style="max-width:860px;margin:0 auto;padding:0 24px;">
    ${stepper(3, STEP_LABELS, STEP_DESTS)}
    ${mask('Your skill snapshot')}
    <div class="js-sub" style="font-size:15px;color:var(--ink-soft);margin-top:6px;">Here&rsquo;s the summary of where you&rsquo;re coming from &mdash; extracted from your CV and reframed from your career break.</div>

    <!-- Read-Only Descriptive History Baseline Card -->
    <div class="glass js-card" id="occupation-card" style="padding:28px 32px;margin-top:26px;position:relative;overflow:hidden;">
      <div style="position:absolute;top:0;left:0;width:4px;height:100%;background:var(--grad-btn);"></div>
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:20px;flex-wrap:wrap;">
        <div style="flex:1;min-width:280px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--pink-500)" stroke-width="2.3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <div style="font-size:11.5px;font-weight:800;color:var(--ink-faint);letter-spacing:.06em;text-transform:uppercase;">YOUR BACKGROUND LOOKS LIKE</div>
          </div>
          <div class="disp" id="snapshot-headline" style="font-weight:800;font-size:22px;margin-top:6px;line-height:1.25;color:var(--ink);">
            Based on your story, you&rsquo;re closest to <span style="background:var(--grad-btn);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Senior UX/UI Designer</span>.
          </div>
          <div style="font-size:13.5px;color:var(--ink-soft);margin-top:8px;line-height:1.55;">
            This is your starting baseline. On this page, we reflect your foundation. Next, you&rsquo;ll choose where you want to aim.
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
          <div id="confidence-badge" style="font-size:12.5px;font-weight:800;color:var(--mint-700);background:var(--mint-100);padding:7px 16px;border-radius:999px;border:1px solid rgba(46,115,85,.25);display:inline-flex;align-items:center;gap:6px;">
            <span style="width:7px;height:7px;border-radius:50%;background:var(--mint-600);box-shadow:0 0 0 2px rgba(46,115,85,.2);"></span>
            High confidence match
          </div>
          <div style="font-size:11px;font-weight:600;color:var(--ink-faint);">Read-only summary &middot; No role lock</div>
        </div>
      </div>
    </div>

    <!-- Two-Column Skill Inventory -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:22px;">
      <div class="glass js-card" style="padding:26px 28px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <div class="field-label" style="margin-bottom:0;display:flex;align-items:center;gap:7px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue-600)" stroke-width="2.2"><path d="M20 7h-4V4a1 1 0 00-1-1H9a1 1 0 00-1 1v3H4a1 1 0 00-1 1v11a2 2 0 002 2h14a2 2 0 002-2V8a1 1 0 00-1-1zM10 5h4v2h-4V5z"/></svg>
            Skills from your CV
          </div>
          <div style="font-size:11px;font-weight:700;color:var(--ink-faint);">Extracted automatically</div>
        </div>
        <div id="skills-have-col" style="display:flex;flex-wrap:wrap;gap:9px;"></div>
      </div>
      
      <div class="glass js-card" style="padding:26px 28px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <div class="field-label" style="margin-bottom:0;display:flex;align-items:center;gap:7px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mint-600)" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            From your break (Reframed)
          </div>
          <div style="font-size:11px;font-weight:700;color:var(--mint-700);">O*NET Validated</div>
        </div>
        <div id="skills-reframed-col" style="display:flex;flex-wrap:wrap;gap:9px;"></div>
      </div>
    </div>

    <!-- O*NET Crosswalk Bridge Banner -->
    <div id="crosswalk-banner" class="glass js-card" style="background:rgba(253,240,244,.85);border:1px solid rgba(232,93,138,.25);border-radius:18px;padding:18px 24px;margin-top:22px;display:flex;align-items:center;gap:14px;">
      <div style="width:38px;height:38px;border-radius:11px;background:linear-gradient(135deg,#EE86AC,#B98FC9);display:flex;align-items:center;justify-content:center;color:#fff;flex:none;box-shadow:0 6px 14px -4px rgba(232,93,138,.4);">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      </div>
      <div id="crosswalk-text" style="font-size:13.5px;line-height:1.5;color:var(--ink);"></div>
    </div>

    <!-- Navigation Prompt -->
    <div class="js-card" style="display:flex;align-items:center;justify-content:space-between;margin-top:32px;padding-bottom:70px;flex-wrap:wrap;gap:16px;">
      <button type="button" class="btn-reset" onclick="showView('story-b')" style="font-size:13.5px;font-weight:700;color:var(--ink-soft);display:flex;align-items:center;gap:6px;cursor:pointer;">
        <span>&larr;</span> Back to Break
      </button>
      <button type="button" class="pill-btn primary btn-reset" onclick="showView('gap')">
        <span>Choose target role &amp; see readiness</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
  </div>
</div>`;

// ============ STEP 4: TARGET ROLE READINESS & GAP (E4 · FUTURE / AIMING) ============
const gap = `
<div style="min-height:980px;background:var(--grad-soft);">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:24px 56px;">${logo('bfly4')}</div>
  <div style="max-width:880px;margin:0 auto;padding:0 24px;">
    ${stepper(4, STEP_LABELS, STEP_DESTS)}
    
    <!-- Aiming Reframe Header -->
    ${mask('Where do you want to go next?')}
    <div class="js-sub" style="font-size:15px;color:var(--ink-soft);margin-top:6px;">
      Pick the role you&rsquo;re aiming for. We started with your closest match &mdash; switch to any role you want to aim for.
    </div>

    <!-- Interactive Role Selector -->
    <div class="js-card" style="margin-top:18px;">
      <div class="field-label" style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;">
        <span style="display:flex;align-items:center;gap:6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--pink-500)" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
          Select your target role:
        </span>
        <span style="font-size:11.5px;color:var(--ink-faint);font-weight:600;">Recalculates readiness live</span>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button type="button" class="btn-reset role-pill on" data-role="ux-ui" onclick="pickRole('ux-ui')">
          <span>🎨 Senior UX/UI Design</span>
          <span class="pill-match-tag">Closest match</span>
        </button>
        <button type="button" class="btn-reset role-pill" data-role="digital-marketing" onclick="pickRole('digital-marketing')">
          <span>📈 Digital Marketing</span>
        </button>
        <button type="button" class="btn-reset role-pill" data-role="customer-support" onclick="pickRole('customer-support')">
          <span>💬 Customer Support</span>
        </button>
        <button type="button" class="btn-reset role-pill" data-role="bookkeeping" onclick="pickRole('bookkeeping')">
          <span>📊 Bookkeeping &amp; Finance</span>
        </button>
      </div>
    </div>

    <!-- Enhanced Readiness Card: Transparent Formula + Lieflat Charts -->
    <div class="glass js-card" style="padding:28px;margin-top:22px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;border-bottom:1px solid rgba(90,90,140,.12);padding-bottom:12px;">
        <div style="font-size:12px;font-weight:800;color:var(--ink-faint);letter-spacing:.06em;text-transform:uppercase;">READINESS ANALYSIS FOR TARGET ROLE</div>
        <div id="target-role-badge" style="font-size:12px;font-weight:700;color:var(--blue-600);">Senior UX/UI Designer (Remote)</div>
      </div>

      <div style="display:grid;grid-template-columns:300px 1fr;gap:26px;align-items:center;" class="readiness-grid">
        <!-- Left: Lieflat SVG Gauge -->
        <div style="text-align:center;position:relative;">
          <svg id="gauge" viewBox="0 0 320 240" style="width:100%;max-width:280px;display:block;margin:0 auto;overflow:visible;"></svg>
          <div id="projected-tag-pill" style="display:inline-flex;align-items:center;gap:6px;margin-top:-6px;background:var(--grad-btn);color:#fff;padding:6px 14px;border-radius:999px;font-size:11.5px;font-weight:800;box-shadow:0 6px 16px -4px rgba(180,90,150,.45);">
            78% today &rarr; 94% target
          </div>
        </div>

        <!-- Right: Transparent Score Breakdown & Formula -->
        <div style="display:flex;flex-direction:column;gap:14px;">
          <!-- Skill Count Summary -->
          <div style="background:rgba(255,255,255,.6);border:1px solid rgba(90,90,140,.12);border-radius:14px;padding:14px 18px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
              <div id="skill-count-headline" style="font-size:14px;font-weight:800;color:var(--ink);">You already have 7 of 10 key skills for this role.</div>
              <div id="skill-count-badge" style="font-size:11px;font-weight:800;color:var(--mint-700);background:var(--mint-100);padding:3px 9px;border-radius:999px;">70% Base Count</div>
            </div>
            <div class="dot-meter" id="skill-dot-meter"></div>
          </div>

          <!-- Formula Explanation Box -->
          <div class="formula-card" style="background:linear-gradient(135deg,rgba(253,240,244,.7),rgba(237,241,250,.7));">
            <div style="font-size:11px;font-weight:800;color:var(--pink-600);letter-spacing:.05em;text-transform:uppercase;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Why 78% ready when you have 7 of 10 skills?
            </div>
            <div id="formula-expl-text" style="font-size:12.5px;line-height:1.55;color:var(--ink-soft);">
              Score is <b>importance-weighted</b>: because you&rsquo;ve got the foundational core skills, you&rsquo;re 78% ready. The skill count (7 of 10) and percentage differ on purpose &mdash; weighting rewards having the critical essentials first.
            </div>
          </div>

          <!-- Projected Readiness Roadmap -->
          <div style="background:rgba(255,255,255,.6);border:1px solid rgba(90,90,140,.12);border-radius:14px;padding:12px 18px;display:flex;align-items:center;justify-content:space-between;">
            <div>
              <div style="font-size:11px;font-weight:800;color:var(--ink-faint);text-transform:uppercase;letter-spacing:.04em;">PROJECTED READINESS</div>
              <div id="projected-summary-text" style="font-size:13.5px;font-weight:700;color:var(--ink);margin-top:2px;">
                78% today &rarr; 94% after your 3 focus areas
              </div>
            </div>
            <div id="uplift-sum-badge" style="font-size:12px;font-weight:800;color:var(--blue-600);background:#E6EBFC;padding:5px 12px;border-radius:999px;">
              +16% Total Uplift
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Clarified Gap Panel: Have vs Top 3 Focus Areas -->
    <div style="margin-top:24px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <div class="field-label" style="margin-bottom:0;">Role Competency Inventory (10 Key Skills Evaluated)</div>
        <div style="font-size:11.5px;color:var(--ink-faint);font-weight:600;">Measured across all role skills &middot; Capped to top 3 focus areas to avoid overwhelm</div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1.15fr;gap:22px;">
        <!-- Left: Skills Have -->
        <div class="glass js-card" style="padding:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
            <div style="font-size:13.5px;font-weight:700;color:var(--ink);display:flex;align-items:center;gap:7px;">
              <span style="color:var(--mint-600);">&#10003;</span> Skills you already bring
            </div>
            <div id="gap-have-count" style="font-size:11px;font-weight:800;color:var(--mint-700);background:var(--mint-100);padding:2px 8px;border-radius:999px;">7 matched</div>
          </div>
          <div id="gap-have"></div>
        </div>

        <!-- Right: Top 3 Focus Areas -->
        <div class="glass js-card" style="padding:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
            <div style="font-size:13.5px;font-weight:700;color:var(--ink);display:flex;align-items:center;gap:7px;">
              <span style="color:var(--pink-500);">&#9733;</span> Your top 3 to start with
            </div>
            <div style="font-size:11px;font-weight:800;color:var(--amber-700);background:var(--amber-100);padding:2px 8px;border-radius:999px;">Prioritized Focus</div>
          </div>
          <div id="gap-build"></div>
        </div>
      </div>
    </div>

    <!-- Navigation & Iteration 2 Footer -->
    <div class="js-card" style="display:flex;align-items:center;justify-content:space-between;margin-top:30px;padding-bottom:70px;flex-wrap:wrap;gap:16px;">
      <button type="button" class="btn-reset" onclick="showView('snapshot')" style="font-size:13.5px;font-weight:700;color:var(--ink-soft);display:flex;align-items:center;gap:6px;cursor:pointer;">
        <span>&larr;</span> Back to Snapshot
      </button>
      <div style="font-size:12.5px;color:var(--ink-faint);display:flex;align-items:center;gap:8px;">
        <span style="width:8px;height:8px;border-radius:50%;background:var(--violet-400);"></span>
        <span>Iteration 2 preview: Automated personalized learning sprints</span>
      </div>
    </div>
  </div>
</div>`;

// Only active views in MVP flow: Landing -> Story A (CV) -> Story B (Break) -> Snapshot -> Gap
const navItems = ['landing', 'story-a', 'story-b', 'snapshot', 'gap'];
const views = { landing, 'story-a': storyA, 'story-b': storyB, snapshot, gap };

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${BRAND} &mdash; Skill Readiness Journey</title>
<meta name="description" content="Interactive click-through prototype for the ${BRAND} skill-readiness journey.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath d='M24 12C18 2 4 4 4 16c0 8 10 10 20 4 10 6 20 4 20-4C44 4 30 2 24 12Z' fill='%23E85D8A'/%3E%3C/svg%3E">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap">
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<style>
${css}
html,body{margin:0;}
:root{ --ease-out: cubic-bezier(0.16, 1, 0.3, 1); }
.view{display:none;}
.view.active{display:block;}
.field-label{font-size:13px;font-weight:700;color:var(--ink);margin-bottom:9px;}

.pill-btn,.chip{transition:transform 160ms var(--ease-out),box-shadow 160ms var(--ease-out),background 160ms var(--ease-out);}
.pill-btn:active,.chip:active{transform:scale(0.97);}
.btn-reset{font-family:inherit;border:none;background:none;padding:0;cursor:pointer;}
.pill-btn:focus-visible,.chip:focus-visible,.step-c:focus-visible,#cv-dropzone:focus-visible,.role-pill:focus-visible{outline:3px solid rgba(74,87,160,.45);outline-offset:2px;}
.step-c{font-family:inherit;border:none;}
button.step-c{cursor:pointer;padding:0;-webkit-appearance:none;appearance:none;}

/* ---- authoritative button size ---- */
.pill-btn{
  display:inline-flex;align-items:center;justify-content:center;gap:9px;
  width:auto;max-width:none;flex:none;
  padding:16px 36px!important;min-height:56px;box-sizing:border-box;
  border-radius:999px;font-weight:700;font-size:16px;letter-spacing:.01em;
  border:none;cursor:pointer;font-family:inherit;
  position:relative;overflow:hidden;isolation:isolate;
}
.pill-btn.primary::before{
  content:'';position:absolute;inset:0;width:55%;
  background:linear-gradient(115deg,transparent,rgba(255,255,255,.55),transparent);
  transform:translateX(-260%) skewX(-18deg);
  transition:transform .75s var(--ease-out);
  pointer-events:none;z-index:1;
}
.pill-btn.primary:hover::before{transform:translateX(260%) skewX(-18deg);}
.pill-btn.primary span,.pill-btn.primary{position:relative;}

/* ---- reveal mask ---- */
.reveal-mask{overflow:hidden;display:block;}
.reveal-inner{display:block;will-change:transform;}
.js-hero-title{font-family:'Bricolage Grotesque';font-weight:800;font-size:48px;line-height:1.08;color:#26264A;max-width:560px;}
.js-scroll-title{font-family:'Bricolage Grotesque';font-weight:800;font-size:32px;color:var(--ink);}

/* ---- dropzone / file upload ---- */
.dropzone{border:2px dashed rgba(90,90,140,.3);border-radius:16px;padding:32px 16px;text-align:center;background:rgba(255,255,255,.5);cursor:pointer;transition:border-color 200ms,background 200ms;}
.dropzone.drag{border-color:var(--pink-500);background:rgba(232,93,138,.08);}
.dropzone:focus-visible{outline:3px solid rgba(74,87,160,.45);outline-offset:2px;}
.field-error{margin-top:10px;font-size:12.5px;color:#B23A4E;background:rgba(232,93,138,.08);border:1px solid rgba(232,93,138,.25);border-radius:10px;padding:9px 12px;}

/* ---- range slider ---- */
input[type=range].slider{-webkit-appearance:none;appearance:none;height:6px;border-radius:4px;background:linear-gradient(90deg,#EE86AC,#6E7BC0);outline:none;}
input[type=range].slider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#fff;border:3px solid var(--pink-500);box-shadow:0 2px 6px rgba(40,40,90,.25);cursor:pointer;}
input[type=range].slider::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#fff;border:3px solid var(--pink-500);box-shadow:0 2px 6px rgba(40,40,90,.25);cursor:pointer;}

/* ---- Role pills ---- */
.role-pill{
  display:inline-flex;align-items:center;gap:8px;
  padding:12px 18px;border-radius:999px;font-size:13.5px;font-weight:700;
  background:rgba(255,255,255,.65);border:1.5px solid rgba(90,90,140,.18);
  color:var(--ink-soft);cursor:pointer;
  transition:all .22s var(--ease-spring);
}
.role-pill:hover{
  background:rgba(255,255,255,.95);transform:translateY(-1px);color:var(--ink);
  border-color:rgba(90,90,140,.32);
}
.role-pill.on{
  background:linear-gradient(135deg,rgba(253,240,244,.95),rgba(237,241,250,.95));
  color:var(--ink);border-color:var(--pink-500);
  box-shadow:0 8px 22px -6px rgba(232,93,138,.35), 0 0 0 1px var(--pink-500) inset;
  transform:translateY(-2px) scale(1.02);
}
.role-pill .pill-match-tag{
  font-size:10px;font-weight:800;background:var(--mint-100);color:var(--mint-700);
  padding:2px 8px;border-radius:999px;letter-spacing:.03em;
}

/* ---- Lieflat Dot Meter ---- */
.dot-meter{display:flex;gap:6px;align-items:center;}
.dot-pip{width:11px;height:11px;border-radius:50%;background:rgba(35,42,82,.14);transition:all .3s var(--ease-spring);}
.dot-pip.have{background:var(--mint-600);box-shadow:0 0 0 2px var(--mint-100);}
.dot-pip.target{background:var(--pink-500);box-shadow:0 0 0 2px var(--pink-100);}

/* ---- Journey stepper ---- */
.journey-stepper{position:relative;}
.journey-step{flex:1;position:relative;padding-right:24px;}
.journey-num{width:38px;height:38px;border-radius:50%;background:var(--grad-btn);color:#fff;font-family:'Bricolage Grotesque';font-weight:700;font-size:16px;display:flex;align-items:center;justify-content:center;position:relative;z-index:1;}
.journey-track{position:absolute;top:19px;left:38px;right:-24px;height:2px;background:linear-gradient(90deg,rgba(232,93,138,.4),rgba(74,87,160,.4));}

@media (max-width: 760px){
  .journey-stepper{flex-direction:column;gap:28px;}
  .journey-step{padding-right:0;}
  .journey-track{display:none;}
  .readiness-grid{grid-template-columns:1fr!important;}
}

@media (prefers-reduced-motion: reduce){
  .reveal-inner{transform:none !important;}
}
</style>
</head>
<body>

${navItems.map((id) => `<div class="view" id="view-${id}">${views[id]}</div>`).join('\n')}

<script>
gsap.registerPlugin(ScrollTrigger);
var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =========================================================
   NAVIGATION + SMOOTH STAGGERED PAGE TRANSITIONS
   ========================================================= */
var isTransitioning = false;
function showView(id) {
  var current = document.querySelector('.view.active');
  var next = document.getElementById('view-' + id);
  if (!next || current === next || isTransitioning) return;

  function activateNext() {
    next.classList.add('active');
    window.scrollTo(0, 0);
    playEntrance(id);
    if (id === 'landing') setTimeout(function () { ScrollTrigger.refresh(); }, 60);
    if (id === 'snapshot') renderSnapshot();
    if (id === 'gap') renderRole(currentSelectedRole || 'ux-ui');
  }

  if (REDUCED || !current) {
    if (current) current.classList.remove('active');
    activateNext();
    return;
  }

  isTransitioning = true;
  gsap.killTweensOf(current);
  gsap.to(current, {
    opacity: 0, y: -24, scale: 0.985, filter: 'blur(3px)',
    duration: 0.38, ease: 'power2.inOut',
    onComplete: function () {
      current.classList.remove('active');
      gsap.set(current, { clearProps: 'opacity,transform,filter' });
      activateNext();
      isTransitioning = false;
    }
  });
}

function playEntrance(id) {
  var root = document.getElementById('view-' + id);
  if (!root) return;
  var stepperEl = root.querySelectorAll('.js-stepper');
  var titleEl = root.querySelectorAll('.js-title, .js-hero-title');
  var subEls = root.querySelectorAll('.js-sub');
  var cardEls = root.querySelectorAll('.js-card');

  if (REDUCED) {
    [stepperEl, titleEl, subEls, cardEls].forEach(function (list) {
      if (list.length) gsap.set(list, { clearProps: 'all' });
    });
    return;
  }

  gsap.killTweensOf([stepperEl, titleEl, subEls, cardEls]);
  var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  if (stepperEl.length) {
    tl.fromTo(stepperEl, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.5 }, 0);
  }
  if (titleEl.length) {
    tl.fromTo(titleEl, { yPercent: 110, scale: 1.04 }, { yPercent: 0, scale: 1, duration: 0.95, ease: 'power4.out' }, 0.1);
  }
  if (subEls.length) {
    tl.fromTo(subEls, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 }, 0.45);
  }
  if (cardEls.length) {
    tl.fromTo(cardEls, { opacity: 0, y: 28, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.09 }, 0.5);
  }
}

/* =========================================================
   SCROLL-DRIVEN REVEALS (Landing Page)
   ========================================================= */
function initScrollReveals() {
  if (REDUCED) return;
  document.querySelectorAll('#view-landing .js-scroll-title').forEach(function(el){
    gsap.fromTo(el, { yPercent: 100, scale: 1.05 }, {
      yPercent: 0, scale: 1, duration: 1.0, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none reverse' },
    });
  });
  document.querySelectorAll('#view-landing .js-scroll-sub').forEach(function(el){
    gsap.fromTo(el, { opacity: 0, y: 18 }, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
    });
  });
  gsap.utils.toArray('#view-landing .journey-stepper').forEach(function(group){
    var cards = group.querySelectorAll('.js-scroll-card');
    gsap.fromTo(cards, { opacity: 0, y: 36 }, {
      opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.14,
      scrollTrigger: { trigger: group, start: 'top 80%', toggleActions: 'play none none reverse' },
    });
  });
  document.querySelectorAll('#view-landing div[style*="grid-template-columns:repeat(3,1fr)"]').forEach(function(group){
    var cards = group.querySelectorAll('.js-scroll-card');
    if (!cards.length) return;
    gsap.fromTo(cards, { opacity: 0, y: 40, scale: 0.98 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: group, start: 'top 82%', toggleActions: 'play none none reverse' },
    });
  });
  gsap.utils.toArray('#view-landing .js-parallax').forEach(function(el){
    var speed = parseFloat(el.getAttribute('data-speed')) || 0.2;
    gsap.to(el, {
      yPercent: speed * -60, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    });
  });
}

/* =========================================================
   GUEST SESSION & INTAKE STATE
   ========================================================= */
var GUEST_KEY = 'rerouteher_guest_session_v5';
var INTAKE_KEY = 'rerouteher_intake_mvp_v1';
var intake = { cv: null, breakYears: 3, breakText: '' };

function beginIntake() {
  showView('story-a');
}

function saveIntake() {
  var by = document.getElementById('break-years');
  if (by) intake.breakYears = by.value;
  var bt = document.getElementById('break-text-input');
  if (bt) intake.breakText = bt.value;
  try { localStorage.setItem(INTAKE_KEY, JSON.stringify(intake)); } catch (e) {}
}

function restoreIntake() {
  try {
    var raw = localStorage.getItem(INTAKE_KEY);
    if (raw) intake = Object.assign(intake, JSON.parse(raw));
  } catch (e) {}
  var by = document.getElementById('break-years');
  if (by) { by.value = intake.breakYears; var lbl = document.getElementById('break-years-label'); if (lbl) lbl.textContent = intake.breakYears + ' years'; }
  var bt = document.getElementById('break-text-input');
  if (bt && intake.breakText) bt.value = intake.breakText;
  if (intake.cv) showCvFileState(intake.cv);
}

/* ---- CV upload handlers ---- */
function handleCvFile(file) {
  var err = document.getElementById('cv-error');
  err.style.display = 'none';
  if (!file) return;
  var okType = /\\.(pdf|doc|docx)$/i.test(file.name);
  var okSize = file.size <= 10 * 1024 * 1024;
  if (!okType) { err.textContent = 'Please upload a PDF or DOCX file.'; err.style.display = 'block'; return; }
  if (!okSize) { err.textContent = 'That file is over 10MB \u2014 please upload something smaller.'; err.style.display = 'block'; return; }
  intake.cv = { name: file.name, size: file.size, role: 'Senior UX/UI Designer' };
  showCvFileState(intake.cv);
  saveIntake();
}

function showCvFileState(cv) {
  document.getElementById('cv-empty-state').style.display = 'none';
  var fs = document.getElementById('cv-file-state');
  fs.style.display = 'flex';
  document.getElementById('cv-filename').textContent = cv.name;
  document.getElementById('cv-filesize').textContent = (cv.size / 1024 / 1024).toFixed(1) + ' MB · Verified';
}

function removeCvFile() {
  intake.cv = null;
  document.getElementById('cv-empty-state').style.display = 'block';
  document.getElementById('cv-file-state').style.display = 'none';
  saveIntake();
}

function loadSampleCv() {
  intake.cv = { name: 'Sarah_Chen_Resume_2026.pdf', size: 1.8 * 1024 * 1024, role: 'Senior UX/UI Designer' };
  showCvFileState(intake.cv);
  saveIntake();
}

function validateAndContinueStoryA() {
  var err = document.getElementById('cv-error');
  if (!intake.cv) {
    err.textContent = 'Please upload your CV (or click "Load Sample CV") to proceed with matching.';
    err.style.display = 'block';
    return;
  }
  err.style.display = 'none';
  showView('story-b');
}

/* ---- Career Break text handlers ---- */
function appendBreakText(snippet) {
  var bt = document.getElementById('break-text-input');
  if (!bt) return;
  if (bt.value.trim().length > 0) {
    bt.value = bt.value.trim() + ', ' + snippet;
  } else {
    bt.value = snippet;
  }
  intake.breakText = bt.value;
  saveIntake();
}

function validateAndContinueStoryB() {
  var bt = document.getElementById('break-text-input');
  var err = document.getElementById('break-text-error');
  var text = (bt ? bt.value : '').trim();
  if (text.length === 0) {
    // If empty, supply default descriptive input
    intake.breakText = 'Cared for 2 children full-time, managed family household budget, scheduled logistics, and self-studied digital design tools';
    if (bt) bt.value = intake.breakText;
  } else {
    intake.breakText = text;
  }
  saveIntake();
  showView('snapshot');
}

/* =========================================================
   STEP 3: SKILL SNAPSHOT (READ-ONLY HISTORY BASELINE)
   ========================================================= */
var PROFESSIONAL_SKILLS_CV = [
  'User Research & Synthesis',
  'Wireframing & Interactive Prototyping',
  'Design Systems & Component Tokens',
  'Usability Testing & Feedback Loops',
  'Stakeholder Presentation & Alignment'
];

function extractReframedSkillsFromText(text) {
  var lower = (text || '').toLowerCase();
  var skills = [];
  
  if (/child|kid|care|parent|family|baby/.test(lower)) {
    skills.push('Active Listening', 'Social Perceptiveness', 'Crisis De-escalation');
  }
  if (/budget|financ|money|cost|expense|saving|bill/.test(lower)) {
    skills.push('Financial Resource Management', 'Cost Optimization');
  }
  if (/house|home|schedul|organiz|manage|coordinat|plan|logistics/.test(lower)) {
    skills.push('Time Management', 'Coordination & Scheduling');
  }
  if (/volunt|commun|event|school|fundrais|outreach/.test(lower)) {
    skills.push('Community Coordination', 'Stakeholder Outreach');
  }
  if (/stud|learn|course|class|read|tool|figma|certif/.test(lower)) {
    skills.push('Continuous Learning', 'Digital Literacy');
  }
  if (/project|side|freelanc|consult|client/.test(lower)) {
    skills.push('Initiative & Ownership', 'Project Execution');
  }

  // Fallback defaults
  if (skills.length === 0) {
    skills = ['Active Listening', 'Time Management', 'Multi-tasking Coordination', 'Financial Budgeting'];
  }
  
  // Deduplicate
  return skills.filter(function(item, pos) { return skills.indexOf(item) === pos; });
}

function renderSnapshot() {
  // Professional skills from CV
  var haveCol = document.getElementById('skills-have-col');
  if (haveCol) {
    haveCol.innerHTML = PROFESSIONAL_SKILLS_CV.map(function(s){
      return '<div class="chip" style="background:rgba(255,255,255,.8);"><span style="color:var(--blue-600);">&#9679;</span> ' + s + '</div>';
    }).join('');
  }

  // Reframed break skills from user's free text input
  var reframedSkills = extractReframedSkillsFromText(intake.breakText);
  var reframedCol = document.getElementById('skills-reframed-col');
  if (reframedCol) {
    reframedCol.innerHTML = reframedSkills.map(function(s){
      return '<div class="chip mint"><span style="color:var(--mint-600);">&#10003;</span> ' + s + '</div>';
    }).join('');
  }

  // Crosswalk banner
  var crosswalkText = document.getElementById('crosswalk-text');
  if (crosswalkText) {
    var primaryBreak = reframedSkills.slice(0, 3).join(' &middot; ');
    crosswalkText.innerHTML = '<b>Natural Language Processing &rarr; ' + primaryBreak + '.</b> Real-world break activities systematically translated into standard O*NET competency taxonomies.';
  }
}

/* =========================================================
   STEP 4: TARGET ROLE READINESS & GAP ANALYSIS
   ========================================================= */
var PRESETS = {
  'ux-ui': {
    title: 'Senior UX/UI Designer (Remote)',
    isClosestMatch: true,
    totalSkills: 10,
    matchedCount: 7,
    pct: 78,
    projectedPct: 94,
    upliftTotal: 16,
    formulaExpl: 'Because you have foundational core competencies (User Research, Prototyping, Design Systems), you start at <b>78% ready</b>. The count (7 of 10) and % differ because foundational essentials carry heavier weighting in hiring than emerging tool gaps.',
    have: [
      { name: 'User Research & Persona Synthesis', origin: 'CV' },
      { name: 'Wireframing & Interactive Prototyping', origin: 'CV' },
      { name: 'Design Systems & Component Tokens', origin: 'CV' },
      { name: 'Information Architecture & User Flows', origin: 'CV' },
      { name: 'Usability Testing & Feedback Loops', origin: 'CV' },
      { name: 'Active Listening & Stakeholder Empathy', origin: 'Break' },
      { name: 'Time & Multi-project Prioritization', origin: 'Break' }
    ],
    build: [
      { name: 'AI Design Tools (Figma AI, Midjourney)', type: 'essential', uplift: 9, note: 'Generative asset ideation & rapid exploration workflows' },
      { name: 'Scalable Design Systems (Tokens & Multi-brand)', type: 'essential', uplift: 7, note: 'Advanced enterprise variables & multi-platform scaling' },
      { name: 'Prompt Engineering for UX Workflows', type: 'uplift', uplift: 5, note: 'Automated micro-copy testing & synthetic user journeys' }
    ]
  },
  'digital-marketing': {
    title: 'Digital Marketing Specialist (Flexible)',
    isClosestMatch: false,
    totalSkills: 10,
    matchedCount: 7,
    pct: 72,
    projectedPct: 91,
    upliftTotal: 19,
    formulaExpl: 'Your transferable storytelling, content creation, and project management provide a <b>72% baseline fit</b>. Closing tactical analytics and modern search gaps unlocks <b>91% readiness</b>.',
    have: [
      { name: 'Content Strategy & Copywriting', origin: 'CV' },
      { name: 'Social Media Channel Management', origin: 'CV' },
      { name: 'Campaign Planning & Storytelling', origin: 'CV' },
      { name: 'Brand Voice & Audience Positioning', origin: 'CV' },
      { name: 'Stakeholder & Client Communication', origin: 'CV' },
      { name: 'Budget & Resource Allocation', origin: 'Break' },
      { name: 'Community & Event Coordination', origin: 'Break' }
    ],
    build: [
      { name: 'Modern AI-Driven SEO & Search Visibility', type: 'essential', uplift: 8, note: 'LLM citation readiness & intent-based semantic ranking' },
      { name: 'Multi-Touch Funnel Analytics (GA4)', type: 'essential', uplift: 6, note: 'Full-funnel attribution models & conversion tracking' },
      { name: 'AI Ad Creative & Copy Automation Tools', type: 'uplift', uplift: 5, note: 'Multivariate ad experimentation & asset scaling' }
    ]
  },
  'customer-support': {
    title: 'Customer Support Lead (Remote)',
    isClosestMatch: false,
    totalSkills: 10,
    matchedCount: 8,
    pct: 85,
    projectedPct: 97,
    upliftTotal: 12,
    formulaExpl: 'Strong empathy, clear documentation, and conflict de-escalation give you a remarkable <b>85% starting readiness</b>. Adopting modern helpdesk AI tools pushes you to near-complete <b>97% readiness</b>.',
    have: [
      { name: 'Empathetic Client Communication', origin: 'CV' },
      { name: 'Conflict Resolution & De-escalation', origin: 'CV' },
      { name: 'Multi-channel Ticket Prioritization', origin: 'CV' },
      { name: 'Knowledge Base Authoring & FAQs', origin: 'CV' },
      { name: 'Customer Onboarding & Walkthroughs', origin: 'CV' },
      { name: 'Patience & Active Listening', origin: 'Break' },
      { name: 'Crisis Coordination & Calm Leadership', origin: 'Break' },
      { name: 'Time & Schedule Organization', origin: 'Break' }
    ],
    build: [
      { name: 'Omnichannel Helpdesk Suites (Zendesk / Intercom)', type: 'essential', uplift: 7, note: 'Automated ticket routing, macros & SLA monitoring' },
      { name: 'AI Copilot Reply & Smart Triage Workflows', type: 'essential', uplift: 6, note: 'Leveraging assistive AI drafts to double response velocity' },
      { name: 'CRM Health Scores & Churn Risk Reporting', type: 'uplift', uplift: 4, note: 'HubSpot customer telemetry & lifecycle retention tracking' }
    ]
  },
  'bookkeeping': {
    title: 'Bookkeeper & Financial Assistant (Flexible)',
    isClosestMatch: false,
    totalSkills: 10,
    matchedCount: 6,
    pct: 64,
    projectedPct: 91,
    upliftTotal: 27,
    formulaExpl: 'Your budget tracking and spreadsheet diligence provide a <b>64% core foundation</b>. Mastering standard cloud accounting platforms yields a fast +27% readiness jump to <b>91%</b>.',
    have: [
      { name: 'Spreadsheet Modeling (Excel / Google Sheets)', origin: 'CV' },
      { name: 'Expense Categorization & Audit Trails', origin: 'CV' },
      { name: 'Invoice Verification & Payment Scheduling', origin: 'CV' },
      { name: 'Attention to Detail & Accuracy Verification', origin: 'CV' },
      { name: 'Household Budget & Cash Flow Management', origin: 'Break' },
      { name: 'Vendor & Service Provider Negotiation', origin: 'Break' }
    ],
    build: [
      { name: 'Cloud Accounting Platforms (Xero / QuickBooks)', type: 'essential', uplift: 12, note: 'Bank feeds reconciliation, chart of accounts & ledger audits' },
      { name: 'AI Copilot for Financial Sheets & Formulas', type: 'essential', uplift: 9, note: 'Automated formula generation, OCR receipts & anomaly detection' },
      { name: 'Digital Tax Compliance & E-Filing Prep', type: 'uplift', uplift: 6, note: 'Year-end compliance reporting & digital filing routines' }
    ]
  }
};

var currentSelectedRole = 'ux-ui';
var currentGaugeTween = null;

var NS = 'http://www.w3.org/2000/svg';
function svgEl(p, t, a) { var n = document.createElementNS(NS, t); for (var k in a) n.setAttribute(k, a[k]); p.appendChild(n); return n; }
function svgTxt(p, a, s) { var n = svgEl(p, 'text', a); n.textContent = s; return n; }
function pol(cx, cy, r, deg) { var rad = deg * Math.PI / 180; return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]; }

function renderGauge(pct, targetPct) {
  var svg = document.getElementById('gauge');
  if (!svg) return;
  svg.innerHTML = '';
  
  var defs = svgEl(svg, 'defs', {});
  var grad = svgEl(defs, 'linearGradient', { id: 'gaugeGrad', x1: '0%', y1: '0%', x2: '100%', y2: '0%' });
  svgEl(grad, 'stop', { offset: '0%', 'stop-color': '#EE86AC' });
  svgEl(grad, 'stop', { offset: '55%', 'stop-color': '#B98FC9' });
  svgEl(grad, 'stop', { offset: '100%', 'stop-color': '#6E7BC0' });

  var cx = 160, cy = 135, R0 = 85, A0 = -195, SW = 210;

  for (var k = 0; k < 75; k++) {
    var a = A0 + (k / 74) * SW;
    var fraction = (k / 74) * 100;
    var isCurrent = fraction <= pct;
    var isTarget = fraction > pct && fraction <= targetPct;
    var len = isCurrent ? 14 : (isTarget ? 11 : 6);
    var p1 = pol(cx, cy, R0, a), p2 = pol(cx, cy, R0 + len, a);

    var strokeColor = isCurrent ? 'url(#gaugeGrad)' : (isTarget ? 'rgba(185,143,201,.38)' : 'rgba(35,42,82,.12)');
    var strokeWidth = isCurrent ? 2.6 : (isTarget ? 1.8 : 1.2);

    svgEl(svg, 'line', {
      x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1],
      stroke: strokeColor, 'stroke-width': strokeWidth,
      'stroke-linecap': 'round'
    });
  }

  [0, 25, 50, 75, 100].forEach(function(m) {
    var a = A0 + (m / 100) * SW;
    var d = pol(cx, cy, R0 - 6, a);
    var t = pol(cx, cy, R0 - 18, a);
    svgEl(svg, 'circle', { cx: d[0], cy: d[1], r: 1.5, fill: 'rgba(35,42,82,.3)' });
    svgTxt(svg, { x: t[0], y: t[1] + 3, 'font-size': 9, 'font-weight': 700, fill: 'rgba(35,42,82,.4)', 'text-anchor': 'middle', 'font-family': 'inherit' }, m + '%');
  });

  var aCurrent = A0 + (pct / 100) * SW;
  var beadPos = pol(cx, cy, R0 + 20, aCurrent);
  var dot = svgEl(svg, 'circle', { cx: beadPos[0], cy: beadPos[1], r: 4.5, fill: '#1E2243', stroke: '#fff', 'stroke-width': 1.5 });

  var numText = svgTxt(svg, { x: cx, y: cy - 4, 'font-size': 38, 'font-weight': 800, fill: '#1E2243', 'text-anchor': 'middle', 'font-family': 'Bricolage Grotesque' }, '0%');
  svgTxt(svg, { x: cx, y: cy + 18, 'font-size': 10, 'font-weight': 800, fill: '#7C84AD', 'text-anchor': 'middle', 'letter-spacing': '.08em' }, 'READY TODAY');

  if (REDUCED) {
    numText.textContent = pct + '%';
  } else {
    gsap.fromTo(dot, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, delay: 0.25, ease: 'back.out(2.2)' });
    var counter = { val: 0 };
    if (currentGaugeTween) currentGaugeTween.kill();
    currentGaugeTween = gsap.to(counter, {
      val: pct, duration: 1.1, ease: 'power2.out',
      onUpdate: function () { numText.textContent = Math.round(counter.val) + '%'; }
    });
  }
}

var gapInitialized = false;
function renderRole(key) {
  currentSelectedRole = key;
  var p = PRESETS[key];
  if (!p) return;

  renderGauge(p.pct, p.projectedPct);

  var trb = document.getElementById('target-role-badge');
  if (trb) trb.textContent = p.title;

  var projPill = document.getElementById('projected-tag-pill');
  if (projPill) {
    projPill.innerHTML = p.pct + '% today &rarr; ' + p.projectedPct + '% target';
  }

  var countHead = document.getElementById('skill-count-headline');
  if (countHead) countHead.textContent = 'You already have ' + p.matchedCount + ' of ' + p.totalSkills + ' key skills for this role.';
  var countBadge = document.getElementById('skill-count-badge');
  if (countBadge) countBadge.textContent = Math.round(p.matchedCount / p.totalSkills * 100) + '% Base Count';

  var dotMeter = document.getElementById('skill-dot-meter');
  if (dotMeter) {
    var pips = '';
    for (var i = 0; i < p.totalSkills; i++) {
      if (i < p.matchedCount) {
        pips += '<div class="dot-pip have" title="Skill ' + (i+1) + ': Matched from your CV / break"></div>';
      } else {
        pips += '<div class="dot-pip target" title="Skill ' + (i+1) + ': Target gap"></div>';
      }
    }
    dotMeter.innerHTML = pips;
  }

  var formulaText = document.getElementById('formula-expl-text');
  if (formulaText) formulaText.innerHTML = p.formulaExpl;

  var projSummary = document.getElementById('projected-summary-text');
  if (projSummary) projSummary.textContent = p.pct + '% today \u2192 ' + p.projectedPct + '% after your 3 focus areas';
  var upliftBadge = document.getElementById('uplift-sum-badge');
  if (upliftBadge) upliftBadge.textContent = '+' + p.upliftTotal + '% Total Uplift';

  var haveEl = document.getElementById('gap-have');
  var haveCount = document.getElementById('gap-have-count');
  if (haveCount) haveCount.textContent = p.matchedCount + ' matched';
  
  var haveHtml = p.have.map(function(s){
    var originBadge = s.origin === 'Break' ? '<span class="tag" style="background:var(--mint-100);color:var(--mint-700);font-size:10px;">Reframed from break</span>' : '<span class="tag" style="background:rgba(70,83,158,.1);color:var(--blue-600);font-size:10px;">CV</span>';
    return '<div class="row-item have-skill"><div style="display:flex;align-items:center;gap:10px;"><span style="color:var(--mint-600);font-weight:800;font-size:13px;">&#10003;</span><div style="font-size:13px;font-weight:600;color:var(--ink);">' + s.name + '</div></div>' + originBadge + '</div>';
  }).join('');

  var buildEl = document.getElementById('gap-build');
  var sorted = p.build.slice().sort(function(a,b){ return b.uplift - a.uplift; });
  var buildHtml = sorted.map(function(b, i){
    var tagClass = b.type === 'essential' ? 'essential' : 'uplift';
    return '<div class="row-item" style="flex-direction:column;align-items:flex-start;gap:6px;padding:14px 16px;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;width:100%;">' +
        '<div style="display:flex;align-items:center;gap:8px;"><span style="width:20px;height:20px;border-radius:50%;background:var(--grad-btn);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;">' + (i+1) + '</span><span style="font-size:13.5px;font-weight:700;color:var(--ink);">' + b.name + '</span></div>' +
        '<span class="tag ' + tagClass + '">+' + b.uplift + '% if learned</span>' +
      '</div>' +
      '<div style="font-size:12px;color:var(--ink-soft);padding-left:28px;line-height:1.4;">' + b.note + '</div>' +
    '</div>';
  }).join('');

  if (!REDUCED && gapInitialized) {
    var tl = gsap.timeline();
    tl.to([haveEl, buildEl], { opacity: 0, y: 8, duration: 0.2, ease: 'power1.in' })
      .call(function () { haveEl.innerHTML = haveHtml; buildEl.innerHTML = buildHtml; })
      .fromTo([haveEl, buildEl], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.05 });
  } else {
    haveEl.innerHTML = haveHtml;
    buildEl.innerHTML = buildHtml;
  }
  gapInitialized = true;
}

function pickRole(key) {
  document.querySelectorAll('#view-gap .role-pill').forEach(function(el){ el.classList.remove('on'); });
  var activeBtn = document.querySelector('#view-gap .role-pill[data-role="' + key + '"]');
  if (activeBtn) activeBtn.classList.add('on');
  renderRole(key);
}

/* =========================================================
   INITIALIZATION
   ========================================================= */
restoreIntake();
renderRole('ux-ui');
renderSnapshot();
showView('landing');
initScrollReveals();
</script>
</body>
</html>`;

fs.mkdirSync('site', { recursive: true });
fs.writeFileSync('site/index.html', html, 'utf8');
console.log('wrote site/index.html', html.length, 'bytes');
