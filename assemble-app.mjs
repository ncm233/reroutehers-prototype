import fs from 'node:fs';

const css = fs.readFileSync('_merged.css', 'utf8');
const BRAND = 'ReRouteHer';

const bfly = (id) => `<svg width="24" height="24" viewBox="0 0 48 48" fill="none"><defs><linearGradient id="${id}" x1="4" y1="8" x2="44" y2="40" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#EE86AC"/><stop offset="1" stop-color="#6E7BC0"/></linearGradient></defs><path d="M24 12 C18 2, 4 4, 4 16 C4 24, 14 26, 24 20 C34 26, 44 24, 44 16 C44 4, 30 2, 24 12 Z" fill="url(#${id})"/><path d="M24 20 C18 26, 6 30, 8 38 C10 44, 20 40, 24 30 C28 40, 38 44, 40 38 C42 30, 30 26, 24 20 Z" fill="url(#${id})" opacity="0.8"/><line x1="24" y1="10" x2="24" y2="34" stroke="#232A52" stroke-width="1.3" stroke-linecap="round"/></svg>`;
const logo = (id) => `<div style="display:flex;align-items:center;gap:10px;">${bfly(id)}<div class="disp js-nologo" style="font-weight:800;font-size:17.5px;">${BRAND}</div></div>`;

function stepper(current, labels, dests) {
  let out = '<div class="js-stepper" style="display:flex;align-items:center;gap:0;margin-bottom:8px;">';
  for (let i = 1; i <= labels.length; i++) {
    const isComplete = i < current;
    const isActive = i === current;
    const cls = isComplete ? 'step-c complete' : (isActive ? 'step-c active' : 'step-c future');
    const inner = isComplete ? '&#10003;' : String(i);
    const btn = isComplete
      ? `<button type="button" class="${cls}" onclick="showView('${dests[i - 1]}')">${inner}</button>`
      : `<div class="${cls}">${inner}</div>`;
    out += `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;">${btn}<div style="font-size:10.5px;font-weight:${isActive || isComplete ? 700 : 600};color:${isActive || isComplete ? 'var(--ink)' : 'var(--ink-faint)'};">${labels[i - 1]}</div></div>`;
    if (i < labels.length) {
      const lineCls = i < current ? 'step-line complete' : 'step-line future';
      out += `<div class="${lineCls}"></div>`;
    }
  }
  out += '</div>';
  if (current > 1) out += `<div style="font-size:11px;color:var(--ink-faint);margin-bottom:22px;">&#8618; click a completed step to jump back &mdash; your answers stay filled in</div>`;
  else out += `<div style="margin-bottom:22px;"></div>`;
  return out;
}

function subStepper(current, total, label) {
  let dots = '';
  for (let i = 1; i <= total; i++) {
    const cls = i < current ? 'substep-dot done' : (i === current ? 'substep-dot active' : 'substep-dot');
    dots += `<div class="${cls}"></div>`;
  }
  return `<div class="js-stepper" style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">${dots}<div style="font-size:11.5px;font-weight:700;color:var(--ink-faint);margin-left:8px;">${current} of ${total} &middot; ${label}</div></div>`;
}

const mask = (html, cls = 'js-title') => `<div class="reveal-mask"><div class="reveal-inner ${cls}">${html}</div></div>`;

const STEP_LABELS = ['Story', 'Snapshot', 'Gap'];
const STEP_DESTS = ['story-a', 'snapshot', 'gap'];

// ============ LANDING (E1) ============
const landing = `
<div style="min-height:1150px;background:#FBF8FA;">
  <div class="hero" style="padding-bottom:70px;">
    <div class="grain"></div>
    <div class="blur-orb js-parallax" data-speed="0.15" style="width:420px;height:420px;left:-120px;bottom:-140px;background:#F0A8C2;opacity:.55;"></div>
    <div class="blur-orb js-parallax" data-speed="0.25" style="width:380px;height:380px;right:-100px;top:-120px;background:#5A67AE;opacity:.5;"></div>
    <div class="star" style="top:60px;left:38%;"></div><div class="star" style="top:140px;left:62%;"></div>
    <div class="star" style="top:220px;left:80%;width:2px;height:2px;"></div><div class="star" style="top:90px;left:52%;width:2px;height:2px;"></div>
    <div style="position:relative;display:flex;align-items:center;justify-content:space-between;padding:26px 60px;">
      ${logo('bflyL')}
    </div>
    <div style="position:relative;display:grid;grid-template-columns:1.05fr 0.95fr;gap:40px;padding:44px 60px 0;align-items:center;">
      <div>
        ${mask('See what you still<br/>have to offer', 'js-title js-hero-title')}
        <div class="js-sub" style="font-size:16.5px;line-height:1.6;color:rgba(38,38,74,.72);margin-top:18px;max-width:460px;">Coming back to work after a break can feel like starting from zero. It isn&rsquo;t. We help you turn what you&rsquo;ve been doing &mdash; and what you did before &mdash; into a plan you can actually follow.</div>
        <div class="js-sub" style="display:flex;gap:14px;margin-top:26px;">
          <button type="button" class="pill-btn primary btn-reset" id="get-started-btn" onclick="beginIntake()">Get started</button>
        </div>
      </div>
      <div class="js-img" style="position:relative;height:340px;display:flex;align-items:center;justify-content:center;">
        <div class="blur-orb js-parallax" data-speed="0.35" style="width:260px;height:260px;left:14%;top:20%;background:#F2A9C6;opacity:.65;"></div>
        <div class="blur-orb js-parallax" data-speed="0.2" style="width:230px;height:230px;right:8%;bottom:10%;background:#4E5AA0;opacity:.6;"></div>
        <svg width="210" height="210" viewBox="0 0 48 48" fill="none" style="position:relative;filter:drop-shadow(0 20px 40px rgba(40,30,80,.28));">
          <defs><linearGradient id="bflyHero" x1="4" y1="6" x2="44" y2="42" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FBDCE6"/><stop offset="0.5" stop-color="#D8C6DF"/><stop offset="1" stop-color="#4E5AA0"/></linearGradient></defs>
          <path d="M24 12 C18 2, 4 4, 4 16 C4 24, 14 26, 24 20 C34 26, 44 24, 44 16 C44 4, 30 2, 24 12 Z" fill="url(#bflyHero)"/>
          <path d="M24 20 C18 26, 6 30, 8 38 C10 44, 20 40, 24 30 C28 40, 38 44, 40 38 C42 30, 30 26, 24 20 Z" fill="url(#bflyHero)" opacity="0.88"/>
          <line x1="24" y1="10" x2="24" y2="34" stroke="#2C3568" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
  </div>

  <div class="scroll-section" style="max-width:1000px;margin:0 auto;padding:70px 60px 10px;">
    ${mask('Three steps. No signup.', 'js-scroll-title')}
    <div class="js-scroll-sub" style="font-size:14.5px;color:var(--ink-soft);margin-top:8px;max-width:520px;">A career break is treated as skill-building here, not an empty gap to explain away.</div>
    <div class="journey-stepper" style="display:flex;gap:0;margin-top:44px;">
      <div class="journey-step js-scroll-card">
        <div class="journey-num">1</div>
        <div class="journey-track"></div>
        <div class="disp" style="font-weight:700;font-size:16px;margin-top:14px;">Tell your story</div>
        <div style="font-size:13px;color:var(--ink-soft);margin-top:6px;">Share your background and your break.</div>
      </div>
      <div class="journey-step js-scroll-card">
        <div class="journey-num">2</div>
        <div class="journey-track"></div>
        <div class="disp" style="font-weight:700;font-size:16px;margin-top:14px;">See your skills</div>
        <div style="font-size:13px;color:var(--ink-soft);margin-top:6px;">We reframe your experience into current skills.</div>
      </div>
      <div class="journey-step js-scroll-card">
        <div class="journey-num">3</div>
        <div class="disp" style="font-weight:700;font-size:16px;margin-top:14px;">Know your next move</div>
        <div style="font-size:13px;color:var(--ink-soft);margin-top:6px;">See role fit and your top priorities.</div>
      </div>
    </div>
  </div>

  <div class="scroll-section" style="display:grid;grid-template-columns:repeat(3,1fr);gap:22px;padding:70px 60px 0;">
    <div class="glass js-scroll-card" style="padding:30px 26px;">
      <div style="width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#FBDCE6,#D8C6DF);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B4E7A" stroke-width="1.8"><path d="M12 3v9m0 0l-3.5-3.5M12 12l3.5-3.5M5 15v3a2 2 0 002 2h10a2 2 0 002-2v-3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div class="disp" style="font-weight:700;font-size:16.5px;">Your break counts as experience</div>
      <div style="font-size:13.5px;color:var(--ink-soft);margin-top:8px;line-height:1.55;">Caring for a family taught you budgeting, scheduling, coordination. We name it, mapped to real O*NET skills.</div>
    </div>
    <div class="glass js-scroll-card" style="padding:30px 26px;">
      <div style="width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#D8C6DF,#B7C0E4);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4E4E80" stroke-width="1.8"><circle cx="12" cy="12" r="9" stroke-linecap="round"/><path d="M12 7v5l3 3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div class="disp" style="font-weight:700;font-size:16.5px;">Honest readiness, not guesswork</div>
      <div style="font-size:13.5px;color:var(--ink-soft);margin-top:8px;line-height:1.55;">A live readiness score for the role you actually want &mdash; recalculated the moment you switch roles.</div>
    </div>
    <div class="glass js-scroll-card" style="padding:30px 26px;">
      <div style="width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#B7C0E4,#8C97D0);display:flex;align-items:center;justify-content:center;margin-bottom:16px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#33366B" stroke-width="1.8"><path d="M4 19h16M7 15l3-5 3 3 4-7" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div class="disp" style="font-weight:700;font-size:16.5px;">Three focus areas, never a wall</div>
      <div style="font-size:13.5px;color:var(--ink-soft);margin-top:8px;line-height:1.55;">Capped, ranked by impact, and specific to your role &mdash; never a demoralising wall of gaps.</div>
    </div>
  </div>
  <div style="height:70px;"></div>
</div>`;

// ============ E2 sub-step 2a — Background ============
const storyA = `
<div style="min-height:900px;background:var(--grad-soft);">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:24px 56px;">${logo('bfly2a')}</div>
  <div style="max-width:660px;margin:0 auto;padding:0 24px;">
    ${stepper(1, STEP_LABELS, STEP_DESTS)}
    ${subStepper(1, 3, 'Background')}
    ${mask('What did you do before?')}
    <div class="js-sub" style="font-size:14px;color:var(--ink-soft);margin-top:6px;">One thing at a time &mdash; this step alone is enough to get a snapshot.</div>

    <div class="glass js-card" style="padding:28px;margin-top:26px;">
      <div class="field-label">Upload your CV</div>
      <div id="cv-dropzone" class="dropzone" tabindex="0" role="button" aria-label="Upload your CV, PDF or DOCX, up to 10 megabytes"
           onclick="document.getElementById('cv-input').click()"
           onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();document.getElementById('cv-input').click();}"
           ondragover="event.preventDefault();this.classList.add('drag');"
           ondragleave="this.classList.remove('drag');"
           ondrop="event.preventDefault();this.classList.remove('drag');handleCvFile(event.dataTransfer.files[0]);">
        <input type="file" id="cv-input" accept=".pdf,.doc,.docx" style="display:none;" onchange="handleCvFile(this.files[0]); this.value='';"/>
        <div id="cv-empty-state">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7C84AD" stroke-width="1.7" style="margin:0 auto 8px;display:block;"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 17v2a2 2 0 002 2h10a2 2 0 002-2v-2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <div style="font-size:12.5px;color:var(--ink-soft);">Drag a file, or click to browse</div>
          <div style="font-size:11px;color:var(--ink-faint);margin-top:4px;">PDF or DOCX, up to 10MB</div>
        </div>
        <div id="cv-file-state" style="display:none;align-items:center;justify-content:space-between;gap:10px;">
          <div style="display:flex;align-items:center;gap:10px;min-width:0;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2E7355" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
            <div style="min-width:0;"><div id="cv-filename" style="font-size:13px;font-weight:700;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:280px;"></div><div id="cv-filesize" style="font-size:11px;color:var(--ink-faint);"></div></div>
          </div>
          <button type="button" class="btn-reset" onclick="event.stopPropagation();removeCvFile();" style="font-size:12px;font-weight:700;color:var(--pink-500);cursor:pointer;">Remove</button>
        </div>
      </div>
      <div id="cv-error" class="field-error" style="display:none;"></div>

      <div style="height:20px;"></div>
      <div class="field-label">Or add it manually</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <input id="job-title-input" placeholder="Previous job title" onchange="saveIntake()" style="border-radius:12px;border:1.5px solid rgba(90,90,140,.22);background:rgba(255,255,255,.7);padding:12px 14px;font-family:inherit;font-size:13.5px;color:var(--ink);"/>
        <select id="industry-input" onchange="saveIntake()" style="border-radius:12px;border:1.5px solid rgba(90,90,140,.22);background:rgba(255,255,255,.7);padding:12px 14px;font-family:inherit;font-size:13.5px;color:var(--ink);">
          <option value="">Industry (optional)</option>
          <option>Retail</option><option>Admin / Office</option><option>Healthcare</option><option>Education</option>
          <option>Hospitality</option><option>Marketing</option><option>Design / Creative</option><option>Finance</option><option>Other</option>
        </select>
      </div>
    </div>

    <div class="js-card" style="text-align:center;margin-top:26px;padding-bottom:60px;">
      <button type="button" class="pill-btn primary btn-reset" style="display:flex;width:100%;max-width:320px;margin:0 auto;" onclick="showView('story-b')">Continue</button>
      <a href="javascript:void(0)" onclick="showView('story-b')" style="display:inline-block;margin-top:16px;font-size:13px;font-weight:600;color:var(--ink-faint);">Skip &mdash; I&rsquo;ll add this later</a>
    </div>
  </div>
</div>`;

// ============ E2 sub-step 2b — Your break ============
const AGE_BANDS = ['Under 25', '25\u201330', '31\u201335', '36\u201340', '41+'];
const ACTIVITY_TAGS = ['Cared for children', 'Ran the household', 'Managed budget', 'Volunteered', 'Side project', 'Study'];

function timelineHTML() {
  let segs = '';
  AGE_BANDS.forEach((band, i) => {
    segs += `
    <div class="tl-seg" id="tl-seg-${i}" onclick="toggleTimelineSeg(${i})">
      <div class="tl-dot"></div>
      <div class="tl-label">${band}</div>
      <div class="tl-badge" id="tl-badge-${i}" style="display:none;">0</div>
    </div>`;
  });
  return `
  <div class="field-label">Life timeline &mdash; select the age ranges that fit, then pick what filled them</div>
  <div class="tl-track">${segs}</div>
  <div id="tl-picker" class="tl-picker" style="display:none;">
    <div id="tl-picker-title" style="font-size:12.5px;font-weight:700;color:var(--ink);margin-bottom:10px;"></div>
    <div id="tl-picker-tags" style="display:flex;flex-wrap:wrap;gap:9px;"></div>
  </div>`;
}

const storyB = `
<div style="min-height:1000px;background:var(--grad-soft);">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:24px 56px;">${logo('bfly2b')}</div>
  <div style="max-width:660px;margin:0 auto;padding:0 24px;">
    ${stepper(1, STEP_LABELS, STEP_DESTS)}
    ${subStepper(2, 3, 'Your break')}
    ${mask('Tell us about your career break')}
    <div class="js-sub" style="font-size:14px;color:var(--ink-soft);margin-top:6px;">Your time out counts as real experience &mdash; here&rsquo;s where we capture it.</div>
    <div class="js-sub" style="font-size:11.5px;color:var(--ink-faint);margin-top:4px;">&#128190; Auto-saved on this device as you go</div>

    <div class="glass js-card" style="padding:28px;margin-top:14px;">
      <div class="field-label">Roughly how long were you out?</div>
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:26px;">
        <input id="break-years" type="range" min="0" max="15" step="0.5" value="3"
          oninput="document.getElementById('break-years-label').textContent = this.value + ' years';"
          onchange="saveIntake()" class="slider" style="flex:1;"/>
        <div id="break-years-label" style="font-size:14px;font-weight:700;color:var(--ink);min-width:64px;text-align:right;">3 years</div>
      </div>
      ${timelineHTML()}
    </div>

    <div class="js-card" style="text-align:center;margin-top:26px;padding-bottom:60px;">
      <button type="button" class="pill-btn primary btn-reset" style="display:flex;width:100%;max-width:320px;margin:0 auto;" onclick="showView('story-c')">Continue</button>
      <div style="display:flex;justify-content:center;gap:20px;margin-top:16px;">
        <a href="javascript:void(0)" onclick="showView('story-a')" style="font-size:13px;font-weight:600;color:var(--ink-faint);">Back</a>
        <a href="javascript:void(0)" onclick="showView('story-c')" style="font-size:13px;font-weight:600;color:var(--ink-faint);">Skip</a>
      </div>
    </div>
  </div>
</div>`;

// ============ E2 sub-step 2c — What you need now ============
const NEED_CATEGORIES = {
  'Work arrangement': ['Remote / work from home', 'Hybrid', 'On-site', 'Freelance / contract', 'Part-time to start', 'Full-time', 'Flexible hours'],
  'Time & schedule': ['School-hours only', 'Early mornings', 'Evenings after bedtime', 'Weekends only', 'Term-time only', 'Flexible / self-paced', 'Full weekday availability'],
  'Location & commute': ['Close to home', 'Willing to commute <30 min', 'Public transport accessible', 'Own transport available', 'No commute (remote only)', 'Open to relocation'],
  'Family & daily needs': ['Childcare during work hours', 'School pickup / drop-off flexibility', 'Sick-day flexibility', 'Quiet home workspace', 'Shared caregiving support', 'Predictable schedule', 'No overnight travel'],
};

function needsAccordionHTML() {
  let out = '';
  let ci = 0;
  for (const cat in NEED_CATEGORIES) {
    const tags = NEED_CATEGORIES[cat];
    let chips = tags.map((t, ti) => `<div class="chip need-chip" id="need-${ci}-${ti}" onclick="toggleNeed(${ci},${ti},'${cat.replace(/'/g, "\\'")}','${t.replace(/'/g, "\\'")}')">${t}</div>`).join('');
    out += `
    <div class="accordion-cat">
      <div class="accordion-head" onclick="toggleAccordion(${ci})">
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="disp" style="font-weight:700;font-size:14.5px;">${cat}</div>
          <div class="accordion-count" id="accordion-count-${ci}" style="display:none;">0</div>
        </div>
        <svg id="accordion-chevron-${ci}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C84AD" stroke-width="2.2" style="transition:transform 260ms var(--ease-out);"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="accordion-body" id="accordion-body-${ci}">
        <div style="display:flex;flex-wrap:wrap;gap:9px;padding:4px 0 16px;">${chips}</div>
      </div>
    </div>`;
    ci++;
  }
  return out;
}

const storyC = `
<div style="min-height:1080px;background:var(--grad-soft);">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:24px 56px;">${logo('bfly2c')}</div>
  <div style="max-width:660px;margin:0 auto;padding:0 24px;">
    ${stepper(1, STEP_LABELS, STEP_DESTS)}
    ${subStepper(3, 3, 'What you need now')}
    ${mask('What are you looking for now?')}
    <div class="js-sub" style="font-size:14px;color:var(--ink-soft);margin-top:6px;">Pick anything that fits &mdash; this shapes which roles we show you.</div>

    <div class="glass js-card" style="padding:10px 24px 6px;margin-top:14px;">
      ${needsAccordionHTML()}
    </div>

    <div class="js-card" style="text-align:center;margin-top:26px;padding-bottom:60px;">
      <button type="button" class="pill-btn primary btn-reset" style="display:flex;width:100%;max-width:320px;margin:0 auto;" onclick="showView('snapshot')">See my skill snapshot</button>
      <div style="display:flex;justify-content:center;gap:20px;margin-top:16px;">
        <a href="javascript:void(0)" onclick="showView('story-b')" style="font-size:13px;font-weight:600;color:var(--ink-faint);">Back</a>
        <a href="javascript:void(0)" onclick="showView('snapshot')" style="font-size:13px;font-weight:600;color:var(--ink-faint);">Skip</a>
      </div>
    </div>
  </div>
</div>`;

// ============ E3 · Skill Snapshot & Reframing ============
const snapshot = `
<div style="min-height:940px;background:var(--grad-soft);">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:24px 56px;">${logo('bfly3')}</div>
  <div style="max-width:820px;margin:0 auto;padding:0 24px;">
    ${stepper(2, STEP_LABELS, STEP_DESTS)}
    ${mask('Your skill snapshot')}
    <div class="js-sub" style="font-size:14.5px;color:var(--ink-soft);margin-top:6px;">Here&rsquo;s what you already bring.</div>

    <div class="glass js-card" id="occupation-card" style="padding:26px 28px;margin-top:28px;display:flex;align-items:center;justify-content:space-between;">
      <div><div style="font-size:12px;font-weight:700;color:var(--ink-faint);letter-spacing:.03em;">CLOSEST OCCUPATION MATCH</div><div class="disp" style="font-weight:700;font-size:20px;margin-top:4px;">Senior UX/UI Designer</div></div>
      <div id="confidence-badge" style="font-size:12.5px;font-weight:800;color:var(--mint-600);background:var(--mint-100);padding:8px 16px;border-radius:999px;">High confidence</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:22px;">
      <div class="glass js-card" style="padding:24px;">
        <div class="field-label">Skills you already have</div>
        <div id="skills-have-col" style="display:flex;flex-wrap:wrap;gap:9px;"></div>
      </div>
      <div class="glass js-card" style="padding:24px;">
        <div class="field-label">From your break (reframed)</div>
        <div id="skills-reframed-col" style="display:flex;flex-wrap:wrap;gap:9px;"></div>
      </div>
    </div>

    <div id="crosswalk-banner" class="js-card" style="background:rgba(232,93,138,.1);border:1px solid rgba(232,93,138,.22);border-radius:16px;padding:16px 20px;margin-top:20px;font-size:13.5px;color:var(--ink);"></div>

    <div style="display:flex;justify-content:flex-end;margin-top:30px;padding-bottom:70px;">
      <button type="button" class="pill-btn primary btn-reset" onclick="showView('gap')">See my gap</button>
    </div>
  </div>
</div>`;

// ============ E4 · Role Readiness & Skill Gap ============
const gap = `
<div style="min-height:960px;background:var(--grad-soft);">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:24px 56px;">${logo('bfly4')}</div>
  <div style="max-width:820px;margin:0 auto;padding:0 24px;">
    ${stepper(3, STEP_LABELS, STEP_DESTS)}
    ${mask('Your readiness for a target role')}
    <div class="js-sub" style="font-size:14.5px;color:var(--ink-soft);margin-top:4px;">You&rsquo;re closer than you think.</div>
    <div class="js-card" style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;">
      <div class="chip role-pill on" data-role="ux-ui" onclick="pickRole('ux-ui')">UX/UI Design (remote)</div>
      <div class="chip role-pill" data-role="digital-marketing" onclick="pickRole('digital-marketing')">Digital Marketing (flexible)</div>
      <div class="chip role-pill" data-role="customer-support" onclick="pickRole('customer-support')">Customer Support (remote)</div>
      <div class="chip role-pill" data-role="bookkeeping" onclick="pickRole('bookkeeping')">Bookkeeping (flexible)</div>
    </div>
    <div class="js-sub" style="font-size:11px;color:var(--ink-faint);margin-top:8px;">click a role to preview readiness live &middot; focus areas are merged from role skills and AI/digital skills &mdash; never AI-only unless the real gap is</div>
    <div class="glass js-card" style="padding:20px 10px 8px;margin-top:18px;">
      <div style="font-size:12px;font-weight:700;color:var(--ink-faint);letter-spacing:.03em;text-align:center;">READINESS</div>
      <svg id="gauge" viewBox="0 0 400 320" style="width:100%;max-width:380px;display:block;margin:0 auto;"></svg>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1.15fr;gap:22px;margin-top:10px;">
      <div class="glass js-card" style="padding:24px;"><div style="font-size:13px;font-weight:700;margin-bottom:13px;">Skills you have</div><div id="gap-have"></div></div>
      <div class="glass js-card" style="padding:24px;"><div style="font-size:13px;font-weight:700;margin-bottom:13px;">Your top 3 focus areas</div><div id="gap-build"></div></div>
    </div>
    <div class="js-card" style="display:flex;align-items:center;justify-content:flex-end;gap:14px;margin-top:30px;padding-bottom:70px;">
      <div style="font-size:12px;color:var(--ink-faint);">Learn plan &amp; roadmap &mdash; iteration 2</div>
      <button type="button" class="pill-btn primary btn-reset" style="opacity:.55;cursor:default;" disabled>Build my plan</button>
    </div>
  </div>
</div>`;

const navItems = ['landing', 'story-a', 'story-b', 'story-c', 'snapshot', 'gap'];
const views = { landing, 'story-a': storyA, 'story-b': storyB, 'story-c': storyC, snapshot, gap };

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${BRAND} &mdash; Skill Readiness Journey</title>
<meta name="description" content="Interactive click-through prototype for the ${BRAND} skill-readiness journey, iteration 1 (E1\u2013E4).">
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
.pill-btn:focus-visible,.chip:focus-visible,.step-c:focus-visible,#cv-dropzone:focus-visible,.tl-seg:focus-visible{outline:3px solid rgba(74,87,160,.45);outline-offset:2px;}
.step-c{font-family:inherit;border:none;}
button.step-c{cursor:pointer;padding:0;-webkit-appearance:none;appearance:none;}

/* ---- authoritative button size (must come after .btn-reset / earlier .pill-btn rules to win the cascade) ---- */
.pill-btn{
  display:inline-flex;align-items:center;justify-content:center;gap:9px;
  width:auto;max-width:none;flex:none;
  padding:20px 44px!important;min-height:62px;box-sizing:border-box;
  border-radius:999px;font-weight:700;font-size:17px;letter-spacing:.01em;
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
/* explicit full-width buttons opt back in via inline style="width:100%" already carried on those elements */

/* ---- reveal mask (headline entrance) ---- */
.reveal-mask{overflow:hidden;display:block;}
.reveal-inner{display:block;will-change:transform;}
.js-hero-title{font-family:'Bricolage Grotesque';font-weight:800;font-size:47px;line-height:1.08;color:#26264A;max-width:560px;}
.js-scroll-title{font-family:'Bricolage Grotesque';font-weight:800;font-size:32px;color:var(--ink);}

/* ---- dropzone / file upload ---- */
.dropzone{border:2px dashed rgba(90,90,140,.3);border-radius:16px;padding:34px 16px;text-align:center;background:rgba(255,255,255,.4);cursor:pointer;transition:border-color 200ms,background 200ms;}
.dropzone.drag{border-color:var(--pink-500);background:rgba(232,93,138,.08);}
.dropzone:focus-visible{outline:3px solid rgba(74,87,160,.45);outline-offset:2px;}
.field-error{margin-top:10px;font-size:12.5px;color:#B23A4E;background:rgba(232,93,138,.08);border:1px solid rgba(232,93,138,.25);border-radius:10px;padding:9px 12px;}

/* ---- range slider ---- */
input[type=range].slider{-webkit-appearance:none;appearance:none;height:6px;border-radius:4px;background:linear-gradient(90deg,#EE86AC,#6E7BC0);outline:none;}
input[type=range].slider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#fff;border:3px solid var(--pink-500);box-shadow:0 2px 6px rgba(40,40,90,.25);cursor:pointer;}
input[type=range].slider::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#fff;border:3px solid var(--pink-500);box-shadow:0 2px 6px rgba(40,40,90,.25);cursor:pointer;}

/* ---- life timeline ---- */
.tl-track{display:flex;align-items:flex-start;gap:0;position:relative;padding-top:6px;}
.tl-seg{flex:1;display:flex;flex-direction:column;align-items:center;cursor:pointer;padding:0 4px;position:relative;}
.tl-seg::before{content:'';position:absolute;top:11px;left:-50%;width:100%;height:2px;background:rgba(90,90,140,.18);z-index:0;}
.tl-seg:first-child::before{display:none;}
.tl-dot{width:22px;height:22px;border-radius:50%;background:#fff;border:2px solid rgba(90,90,140,.28);z-index:1;transition:all 220ms var(--ease-out);}
.tl-seg.on .tl-dot{background:var(--grad-btn);border-color:transparent;}
.tl-label{font-size:11.5px;font-weight:700;color:var(--ink-soft);margin-top:8px;text-align:center;}
.tl-seg.on .tl-label{color:var(--ink);}
.tl-badge{position:absolute;top:-6px;right:14px;background:var(--pink-500);color:#fff;font-size:9.5px;font-weight:800;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:2;}
.tl-picker{margin-top:18px;padding:16px;border-radius:14px;background:rgba(255,255,255,.55);border:1px dashed rgba(90,90,140,.25);}

/* ---- accordion ---- */
.accordion-cat{border-bottom:1px solid rgba(90,90,140,.14);}
.accordion-cat:last-child{border-bottom:none;}
.accordion-head{display:flex;align-items:center;justify-content:space-between;padding:16px 0;cursor:pointer;}
.accordion-count{font-size:10.5px;font-weight:800;color:#fff;background:var(--pink-500);border-radius:999px;padding:2px 8px;}
.accordion-body{max-height:0;overflow:hidden;transition:max-height 320ms var(--ease-out);}
.accordion-body.open{max-height:400px;}

/* ---- empty state ---- */
.empty-state{font-size:12.5px;color:var(--ink-faint);font-style:italic;padding:8px 2px;}

/* ---- Gap screen micro-interactions ---- */
.row-item{transition:transform 220ms var(--ease-out),box-shadow 220ms var(--ease-out);}
.row-item:hover{transform:translateX(4px);box-shadow:-3px 0 0 var(--pink-500);}
.role-pill{transition:transform 200ms var(--ease-out),background 200ms var(--ease-out),box-shadow 200ms var(--ease-out);}
.role-pill.on{transform:scale(1.04);box-shadow:0 6px 16px -6px rgba(46,115,85,.35);}
#gauge{transition:filter 300ms var(--ease-out);}

/* ---- sub-stepper dots (progressive disclosure within E2) ---- */
.substep-dot{width:8px;height:8px;border-radius:50%;background:rgba(35,42,82,.16);transition:all 220ms var(--ease-out);flex:none;}
.substep-dot.done{background:linear-gradient(120deg,#EE86AC,#6E7BC0);}
.substep-dot.active{background:var(--pink-500);width:20px;border-radius:5px;}

/* ---- landing journey stepper (US1.2) ---- */
.journey-stepper{position:relative;}
.journey-step{flex:1;position:relative;padding-right:24px;}
.journey-num{width:38px;height:38px;border-radius:50%;background:var(--grad-btn);color:#fff;font-family:'Bricolage Grotesque';font-weight:700;font-size:16px;display:flex;align-items:center;justify-content:center;position:relative;z-index:1;}
.journey-track{position:absolute;top:19px;left:38px;right:-24px;height:2px;background:linear-gradient(90deg,rgba(232,93,138,.4),rgba(74,87,160,.4));}
@media (max-width: 760px){
  .journey-stepper{flex-direction:column;gap:28px;}
  .journey-step{padding-right:0;}
  .journey-track{display:none;}
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
   NAVIGATION + OPENING ANIMATIONS
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
  }

  if (REDUCED || !current) {
    if (current) current.classList.remove('active');
    activateNext();
    return;
  }

  isTransitioning = true;
  gsap.killTweensOf(current);
  gsap.to(current, {
    opacity: 0, y: -28, scale: 0.982, filter: 'blur(2px)',
    duration: 0.42, ease: 'power2.inOut',
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
  var imgEls = root.querySelectorAll('.js-img');

  if (REDUCED) {
    [stepperEl, titleEl, subEls, cardEls, imgEls].forEach(function (list) {
      if (list.length) gsap.set(list, { clearProps: 'all' });
    });
    return;
  }

  gsap.killTweensOf([stepperEl, titleEl, subEls, cardEls, imgEls]);
  var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  if (stepperEl.length) {
    tl.fromTo(stepperEl, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.55 }, 0);
  }
  if (titleEl.length) {
    tl.fromTo(titleEl, { yPercent: 115, scale: 1.06 }, { yPercent: 0, scale: 1, duration: 1.05, ease: 'power4.out' }, 0.14);
  }
  if (subEls.length) {
    tl.fromTo(subEls, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.65, stagger: 0.08 }, 0.55);
  }
  if (imgEls.length) {
    tl.fromTo(imgEls, { clipPath: 'inset(0 0 100% 0)', opacity: 0.4 }, { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 1.1, ease: 'power4.out' }, 0.3);
  }
  if (cardEls.length) {
    tl.fromTo(cardEls, { opacity: 0, y: 34, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.11 }, 0.62);
  }
}

/* =========================================================
   SCROLL-DRIVEN REVEALS (Landing only \u2014 the marketing page)
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
    gsap.fromTo(cards, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15,
      scrollTrigger: { trigger: group, start: 'top 80%', toggleActions: 'play none none reverse' },
    });
  });
  document.querySelectorAll('#view-landing div[style*="grid-template-columns:repeat(3,1fr)"]').forEach(function(group){
    var cards = group.querySelectorAll('.js-scroll-card');
    if (!cards.length) return;
    gsap.fromTo(cards, { opacity: 0, y: 44, scale: 0.97 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', stagger: 0.13,
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
   GUEST SESSION (local-only, no data sent to a server)
   ========================================================= */
var GUEST_KEY = 'rerouteher_guest_session';
function ensureGuestSession() {
  try {
    if (!localStorage.getItem(GUEST_KEY)) {
      var id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : ('guest-' + Date.now() + '-' + Math.random().toString(36).slice(2));
      localStorage.setItem(GUEST_KEY, JSON.stringify({ guestId: id, createdAt: Date.now() }));
    }
  } catch (e) {}
}
function beginIntake() {
  ensureGuestSession();
  showView('story-a');
}

/* =========================================================
   INTAKE STATE (auto-saved on-device)
   ========================================================= */
var INTAKE_KEY = 'rerouteher_intake_v3';
var intake = { cv: null, jobTitle: '', industry: '', breakYears: 3, timeline: {}, needs: {} };

function saveIntake() {
  var jt = document.getElementById('job-title-input');
  var ind = document.getElementById('industry-input');
  if (jt) intake.jobTitle = jt.value;
  if (ind) intake.industry = ind.value;
  var by = document.getElementById('break-years');
  if (by) intake.breakYears = by.value;
  try { localStorage.setItem(INTAKE_KEY, JSON.stringify(intake)); } catch (e) {}
}
function restoreIntake() {
  try {
    var raw = localStorage.getItem(INTAKE_KEY);
    if (raw) intake = Object.assign(intake, JSON.parse(raw));
  } catch (e) {}
  var jt = document.getElementById('job-title-input'); if (jt && intake.jobTitle) jt.value = intake.jobTitle;
  var ind = document.getElementById('industry-input'); if (ind && intake.industry) ind.value = intake.industry;
  var by = document.getElementById('break-years');
  if (by) { by.value = intake.breakYears; var lbl = document.getElementById('break-years-label'); if (lbl) lbl.textContent = intake.breakYears + ' years'; }
  if (intake.cv) showCvFileState(intake.cv);
  AGE_BANDS_JS.forEach(function(_, i){ renderTimelineBadge(i); });
  Object.keys(NEED_CATEGORIES_JS).forEach(function(cat, ci){
    NEED_CATEGORIES_JS[cat].forEach(function(tag, ti){
      var el = document.getElementById('need-' + ci + '-' + ti);
      if (el && intake.needs[cat] && intake.needs[cat].indexOf(tag) !== -1) el.classList.add('on');
    });
    updateAccordionCount(ci, cat);
  });
}

/* ---- CV upload ---- */
function handleCvFile(file) {
  var err = document.getElementById('cv-error');
  err.style.display = 'none';
  if (!file) return;
  var okType = /\\.(pdf|doc|docx)$/i.test(file.name);
  var okSize = file.size <= 10 * 1024 * 1024;
  if (!okType) { err.textContent = 'Please upload a PDF or DOCX file.'; err.style.display = 'block'; return; }
  if (!okSize) { err.textContent = 'That file is over 10MB \u2014 please upload something smaller.'; err.style.display = 'block'; return; }
  intake.cv = { name: file.name, size: file.size };
  showCvFileState(intake.cv);
  saveIntake();
}
function showCvFileState(cv) {
  document.getElementById('cv-empty-state').style.display = 'none';
  var fs = document.getElementById('cv-file-state');
  fs.style.display = 'flex';
  document.getElementById('cv-filename').textContent = cv.name;
  document.getElementById('cv-filesize').textContent = (cv.size / 1024 / 1024).toFixed(1) + ' MB';
}
function removeCvFile() {
  intake.cv = null;
  document.getElementById('cv-empty-state').style.display = 'block';
  document.getElementById('cv-file-state').style.display = 'none';
  saveIntake();
}

/* ---- life timeline ---- */
var AGE_BANDS_JS = ${JSON.stringify(AGE_BANDS)};
var ACTIVITY_TAGS_JS = ${JSON.stringify(ACTIVITY_TAGS)};
var openTimelineSeg = null;
function renderTimelinePicker(i) {
  var band = AGE_BANDS_JS[i];
  var picker = document.getElementById('tl-picker');
  picker.style.display = 'block';
  document.getElementById('tl-picker-title').textContent = 'What filled this time? (' + band + ')';
  var selected = intake.timeline[band] || [];
  var container = document.getElementById('tl-picker-tags');
  container.innerHTML = '';
  ACTIVITY_TAGS_JS.forEach(function(tag){
    var chip = document.createElement('div');
    chip.className = 'chip' + (selected.indexOf(tag) !== -1 ? ' on' : '');
    chip.textContent = tag;
    chip.onclick = function(){ toggleTimelineActivity(band, tag, i); };
    container.appendChild(chip);
  });
}
function toggleTimelineSeg(i) {
  if (openTimelineSeg === i) {
    document.getElementById('tl-picker').style.display = 'none';
    openTimelineSeg = null;
    return;
  }
  openTimelineSeg = i;
  renderTimelinePicker(i);
  var picker = document.getElementById('tl-picker');
  if (!REDUCED) gsap.fromTo(picker, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
}
function toggleTimelineActivity(band, tag, segIndex) {
  if (!intake.timeline[band]) intake.timeline[band] = [];
  var idx = intake.timeline[band].indexOf(tag);
  if (idx === -1) intake.timeline[band].push(tag); else intake.timeline[band].splice(idx, 1);
  renderTimelinePicker(segIndex);
  renderTimelineBadge(segIndex);
  saveIntake();
}
function renderTimelineBadge(i) {
  var band = AGE_BANDS_JS[i];
  var count = (intake.timeline[band] || []).length;
  var seg = document.getElementById('tl-seg-' + i);
  var badge = document.getElementById('tl-badge-' + i);
  if (count > 0) { seg.classList.add('on'); badge.style.display = 'flex'; badge.textContent = count; }
  else { seg.classList.remove('on'); badge.style.display = 'none'; }
}

/* ---- needs accordion ---- */
var NEED_CATEGORIES_JS = ${JSON.stringify(NEED_CATEGORIES)};
function toggleAccordion(ci) {
  var body = document.getElementById('accordion-body-' + ci);
  var chev = document.getElementById('accordion-chevron-' + ci);
  var willOpen = !body.classList.contains('open');
  document.querySelectorAll('.accordion-body').forEach(function(b){ b.classList.remove('open'); });
  document.querySelectorAll('[id^="accordion-chevron-"]').forEach(function(c){ c.style.transform = 'rotate(0deg)'; });
  if (willOpen) { body.classList.add('open'); chev.style.transform = 'rotate(180deg)'; }
}
function toggleNeed(ci, ti, cat, tag) {
  var el = document.getElementById('need-' + ci + '-' + ti);
  el.classList.toggle('on');
  if (!intake.needs[cat]) intake.needs[cat] = [];
  var idx = intake.needs[cat].indexOf(tag);
  if (idx === -1) intake.needs[cat].push(tag); else intake.needs[cat].splice(idx, 1);
  updateAccordionCount(ci, cat);
  saveIntake();
}
function updateAccordionCount(ci, cat) {
  var n = (intake.needs[cat] || []).length;
  var badge = document.getElementById('accordion-count-' + ci);
  if (n > 0) { badge.style.display = 'inline-block'; badge.textContent = n; } else { badge.style.display = 'none'; }
}

/* =========================================================
   E3 \u2014 SNAPSHOT (empty-state aware, deterministic crosswalk)
   ========================================================= */
var CAREGIVING_MAP = {
  'Cared for children': ['Active Listening', 'Social Perceptiveness'],
  'Ran the household': ['Time Management', 'Coordination'],
  'Managed budget': ['Management of Financial Resources'],
  'Volunteered': ['Community Coordination'],
  'Side project': ['Initiative', 'Project Management'],
  'Study': ['Continuous Learning']
};
var PROFESSIONAL_SKILLS = ['User research', 'Prototyping', 'Stakeholder management'];

function renderSnapshot() {
  var hasBackground = !!(intake.cv || intake.jobTitle);
  var allActivities = [];
  Object.keys(intake.timeline).forEach(function(band){ (intake.timeline[band] || []).forEach(function(a){ if (allActivities.indexOf(a) === -1) allActivities.push(a); }); });
  var hasBreak = allActivities.length > 0;

  var haveCol = document.getElementById('skills-have-col');
  if (hasBackground) {
    haveCol.innerHTML = PROFESSIONAL_SKILLS.map(function(s){ return '<div class="chip">' + s + '</div>'; }).join('');
  } else {
    haveCol.innerHTML = '<div class="empty-state">No background added yet \u2014 go back to Step 1 and upload a CV or add your last role to see this filled in.</div>';
  }

  var reframedCol = document.getElementById('skills-reframed-col');
  var reframedSkills = [];
  allActivities.forEach(function(a){ (CAREGIVING_MAP[a] || []).forEach(function(s){ if (reframedSkills.indexOf(s) === -1) reframedSkills.push(s); }); });
  if (hasBreak) {
    reframedCol.innerHTML = reframedSkills.map(function(s){ return '<div class="chip mint">' + s + '</div>'; }).join('');
  } else {
    reframedCol.innerHTML = '<div class="empty-state">No break activities added yet \u2014 go back to Step 2 and fill in your life timeline to see this filled in.</div>';
  }

  var banner = document.getElementById('crosswalk-banner');
  if (hasBreak) {
    var example = allActivities[0];
    var exampleSkills = (CAREGIVING_MAP[example] || []).join(' + ');
    banner.innerHTML = '<b>' + example + ' \u2192 ' + exampleSkills + '.</b> Caregiving mapped straight to real O*NET skills.';
  } else {
    banner.innerHTML = '<b>Ran a home \u2192 budgeting \u00b7 scheduling \u00b7 coordination.</b> Once you add break activities, we map them straight to real O*NET skills.';
  }

  var badge = document.getElementById('confidence-badge');
  if (hasBackground && hasBreak) {
    badge.textContent = 'High confidence';
    badge.style.background = 'var(--mint-100)'; badge.style.color = 'var(--mint-600)';
  } else {
    badge.textContent = 'Exploratory match';
    badge.style.background = '#FBEBD3'; badge.style.color = '#9C6A28';
  }
}

/* =========================================================
   E4 \u2014 GAP (merged, capped-to-3, not AI-only unless real)
   ========================================================= */
var PRESETS = {
  'ux-ui': { pct: 78, have: ['User research','Prototyping','Stakeholder management'], build: [
    ['AI design tools (Figma AI, Midjourney)','essential',9],
    ['Advanced design systems at scale','essential',7],
    ['Prompt engineering for UX workflows','uplift',5]
  ] },
  'digital-marketing': { pct: 72, have: ['Marketing','Social media','Content writing'], build: [
    ['SEO','essential',8], ['Analytics','essential',6], ['AI ad-copy &amp; campaign tools','uplift',5]
  ] },
  'customer-support': { pct: 85, have: ['Communication','Patience','Multitasking'], build: [
    ['Helpdesk tools','essential',7], ['AI-assisted reply &amp; triage tools','essential',6], ['CRM basics','uplift',4]
  ] },
  'bookkeeping': { pct: 64, have: ['Budgeting','Spreadsheets','Attention to detail'], build: [
    ['Xero / QuickBooks','essential',12], ['AI in spreadsheets (Excel/Sheets Copilot)','essential',9], ['Tax filing','uplift',6]
  ] }
};

var NS = 'http://www.w3.org/2000/svg';
function svgEl(p, t, a) { var n = document.createElementNS(NS, t); for (var k in a) n.setAttribute(k, a[k]); p.appendChild(n); return n; }
function svgTxt(p, a, s) { var n = svgEl(p, 'text', a); n.textContent = s; return n; }
function pol(cx, cy, r, deg) { var rad = deg * Math.PI / 180; return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]; }
function rnd(i, k) { return Math.abs(((i * 73856093) ^ (k * 19349663)) % 1000) / 1000; }

function renderGauge(pct) {
  var svg = document.getElementById('gauge');
  if (!svg) return;
  svg.innerHTML = '';
  var defs = svgEl(svg, 'defs', {});
  var grad = svgEl(defs, 'linearGradient', { id: 'gaugeGrad', x1: '0%', y1: '0%', x2: '100%', y2: '0%' });
  svgEl(grad, 'stop', { offset: '0%', 'stop-color': '#EE86AC' });
  svgEl(grad, 'stop', { offset: '50%', 'stop-color': '#B98FC9' });
  svgEl(grad, 'stop', { offset: '100%', 'stop-color': '#6E7BC0' });
  var cx = 200, cy = 178, R0 = 104, A0 = -195, SW = 210;
  for (var k = 0; k < 100; k++) {
    var a = A0 + k / 100 * SW;
    var inked = k < pct;
    var len = inked ? 13 + rnd(k + 1, 3) * 6 : 5 + rnd(k + 1, 7) * 2.5;
    var p1 = pol(cx, cy, R0, a), p2 = pol(cx, cy, R0 + len, a);
    svgEl(svg, 'line', { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1],
      stroke: inked ? 'url(#gaugeGrad)' : 'rgba(35,42,82,.16)', 'stroke-width': inked ? 2.2 : 1.2,
      'stroke-linecap': 'round', class: 'fade', style: 'animation-delay:' + (k * 8) + 'ms' });
  }
  [25, 50, 75, 100].forEach(function(m) {
    var a = A0 + m / 100 * SW;
    var d = pol(cx, cy, R0 - 8, a), t = pol(cx, cy, R0 - 20, a);
    svgEl(svg, 'circle', { cx: d[0], cy: d[1], r: 1.6, fill: 'rgba(35,42,82,.32)' });
    svgTxt(svg, { x: t[0], y: t[1] + 3, 'font-size': 9.5, 'font-weight': 700, fill: 'rgba(35,42,82,.35)', 'text-anchor': 'middle' }, m);
  });
  var aT = A0 + pct / 100 * SW, e = pol(cx, cy, R0 + 22, aT);
  var dot = svgEl(svg, 'circle', { cx: e[0], cy: e[1], r: 4.5, fill: '#232A52' });
  var numText = svgTxt(svg, { x: cx, y: cy - 2, 'font-size': 42, 'font-weight': 800, fill: '#232A52', 'text-anchor': 'middle' }, '0%');
  svgTxt(svg, { x: cx, y: cy + 24, 'font-size': 10.5, 'font-weight': 700, fill: '#7C84AD', 'text-anchor': 'middle', 'letter-spacing': '.08em' }, 'READY TODAY');

  if (REDUCED) {
    numText.textContent = pct + '%';
  } else {
    gsap.set(dot, { scale: 0, transformOrigin: '50% 50%' });
    gsap.to(dot, { scale: 1, duration: 0.5, delay: 0.85, ease: 'back.out(2.2)' });
    var counter = { val: 0 };
    gsap.to(counter, {
      val: pct, duration: 1.3, delay: 0.15, ease: 'power2.out',
      onUpdate: function () { numText.textContent = Math.round(counter.val) + '%'; }
    });
  }
}

var gapInitialized = false;
function renderRole(key) {
  var p = PRESETS[key];
  renderGauge(p.pct);
  var haveEl = document.getElementById('gap-have');
  var buildEl = document.getElementById('gap-build');
  var haveHtml = p.have.map(function(s){ return '<div class="row-item"><div style="font-size:13.5px;font-weight:600;">' + s + '</div></div>'; }).join('');
  var sorted = p.build.slice().sort(function(a,b){ return b[2]-a[2]; });
  var buildHtml = sorted.map(function(b, i){
    var tagClass = b[1] === 'essential' ? 'essential' : 'uplift';
    var tagLabel = '+' + b[2] + '% if learned';
    return '<div class="row-item"><div style="display:flex;align-items:center;gap:10px;"><div style="font-size:13.5px;font-weight:700;color:var(--ink-faint);width:16px;">' + (i+1) + '.</div><div style="font-size:13.5px;font-weight:600;">' + b[0] + '</div></div><div class="tag ' + tagClass + '">' + tagLabel + '</div></div>';
  }).join('');

  if (!REDUCED && gapInitialized) {
    var tl = gsap.timeline();
    tl.to([haveEl, buildEl], { opacity: 0, y: 10, duration: 0.22, ease: 'power1.in' })
      .call(function () { haveEl.innerHTML = haveHtml; buildEl.innerHTML = buildHtml; })
      .fromTo([haveEl, buildEl], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.06 });
  } else {
    haveEl.innerHTML = haveHtml;
    buildEl.innerHTML = buildHtml;
  }
  gapInitialized = true;
}
function pickRole(key) {
  document.querySelectorAll('#view-gap .role-pill').forEach(function(el){ el.classList.remove('on'); });
  document.querySelector('#view-gap .role-pill[data-role="' + key + '"]').classList.add('on');
  renderRole(key);
}

/* =========================================================
   INIT
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
