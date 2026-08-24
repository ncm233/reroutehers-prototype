// ReRouteHer — Simplified MVP Figma UI & Design System Generator
// Strictly matches the MVP User Flow (Mandatory CV Upload, 2-Question Break NLP Text Input, Snapshot, and Target Roles)

(async function main() {
  async function loadSafeFont(family, style) {
    try {
      await figma.loadFontAsync({ family, style });
      return { family, style };
    } catch (e) {
      try {
        await figma.loadFontAsync({ family: "Inter", style: style === "Bold" ? "Bold" : (style === "SemiBold" ? "Medium" : "Regular") });
        return { family: "Inter", style: style === "Bold" ? "Bold" : (style === "SemiBold" ? "Medium" : "Regular") };
      } catch (err) {
        await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
        return { family: "Roboto", style: "Regular" };
      }
    }
  }

  const fontSans = await loadSafeFont("Plus Jakarta Sans", "Regular");
  const fontSansSemi = await loadSafeFont("Plus Jakarta Sans", "SemiBold");
  const fontSansBold = await loadSafeFont("Plus Jakarta Sans", "Bold");
  const fontDispBold = await loadSafeFont("Bricolage Grotesque", "Bold");
  const fontDispExtra = await loadSafeFont("Bricolage Grotesque", "ExtraBold");

  const hex = (h) => {
    const c = h.replace("#", "");
    return {
      r: parseInt(c.substring(0, 2), 16) / 255,
      g: parseInt(c.substring(2, 4), 16) / 255,
      b: parseInt(c.substring(4, 6), 16) / 255
    };
  };

  const C = {
    ink: hex("#1E2243"),
    inkSoft: hex("#5A6086"),
    inkFaint: hex("#8A90B2"),
    pink: hex("#EE86AC"),
    pinkDark: hex("#E85D8A"),
    pinkLight: hex("#FDF0F4"),
    lavender: hex("#B98FC9"),
    blue: hex("#6E7BC0"),
    blueDark: hex("#46539E"),
    blueLight: hex("#E6EBFC"),
    mintBg: hex("#DEF3E7"),
    mintText: hex("#1B6445"),
    mintDot: hex("#226D4D"),
    amberBg: hex("#FEF0DA"),
    amberText: hex("#96540D"),
    amberDot: hex("#C07018"),
    bgSoft: hex("#F8F5FA"),
    borderSoft: hex("#E2DFEE"),
    white: { r: 1, g: 1, b: 1 }
  };

  const brandGradient = {
    type: "GRADIENT_LINEAR",
    gradientTransform: [[1, 0, 0], [0, 1, 0]],
    gradientStops: [
      { position: 0, color: { ...C.pink, a: 1 } },
      { position: 0.5, color: { ...C.lavender, a: 1 } },
      { position: 1, color: { ...C.blue, a: 1 } }
    ]
  };

  function createText(chars, font, size, color, align = "LEFT") {
    const t = figma.createText();
    t.fontName = font;
    t.fontSize = size;
    t.characters = chars;
    t.fills = [{ type: "SOLID", color }];
    t.textAlignHorizontal = align;
    return t;
  }

  function createGlassCard(w = "AUTO", p = 24, r = 20) {
    const f = figma.createFrame();
    f.layoutMode = "VERTICAL";
    f.primaryAxisSizingMode = "AUTO";
    f.counterAxisSizingMode = w === "AUTO" ? "AUTO" : "FIXED";
    if (w !== "AUTO") f.resize(w, 100);
    f.paddingLeft = p; f.paddingRight = p; f.paddingTop = p; f.paddingBottom = p;
    f.cornerRadius = r;
    f.fills = [{ type: "SOLID", color: C.white, opacity: 0.88 }];
    f.strokes = [{ type: "SOLID", color: C.borderSoft, opacity: 0.75 }];
    f.strokeWeight = 1.2;
    f.effects = [{
      type: "DROP_SHADOW",
      color: { r: 0.15, g: 0.16, b: 0.35, a: 0.07 },
      offset: { x: 0, y: 12 },
      radius: 28,
      spread: -8,
      visible: true,
      blendMode: "NORMAL"
    }];
    return f;
  }

  function createChip(text, type = "default") {
    const f = figma.createFrame();
    f.layoutMode = "HORIZONTAL";
    f.primaryAxisSizingMode = "AUTO";
    f.counterAxisSizingMode = "AUTO";
    f.paddingLeft = 14; f.paddingRight = 14; f.paddingTop = 8; f.paddingBottom = 8;
    f.cornerRadius = 999;
    f.counterAxisAlignItems = "CENTER";

    let textColor = C.ink;
    let bgColor = C.white;
    let strokeColor = C.borderSoft;

    if (type === "mint") {
      textColor = C.mintText; bgColor = C.mintBg; strokeColor = { r: 0.2, g: 0.6, b: 0.4 };
    } else if (type === "active" || type === "pink") {
      textColor = C.ink; bgColor = C.pinkLight; strokeColor = C.pinkDark;
    } else if (type === "blue") {
      textColor = C.blueDark; bgColor = C.blueLight; strokeColor = C.blue;
    } else if (type === "amber") {
      textColor = C.amberText; bgColor = C.amberBg; strokeColor = C.amberDot;
    }

    f.fills = [{ type: "SOLID", color: bgColor, opacity: type === "default" ? 0.85 : 1 }];
    f.strokes = [{ type: "SOLID", color: strokeColor, opacity: 0.4 }];
    f.strokeWeight = 1;
    f.appendChild(createText(text, fontSansSemi, 12.5, textColor));
    return f;
  }

  function createPrimaryButton(text, hasIcon = true) {
    const btn = figma.createFrame();
    btn.layoutMode = "HORIZONTAL";
    btn.primaryAxisSizingMode = "AUTO";
    btn.counterAxisSizingMode = "AUTO";
    btn.paddingLeft = 28; btn.paddingRight = 28; btn.paddingTop = 14; btn.paddingBottom = 14;
    btn.cornerRadius = 999;
    btn.itemSpacing = 8;
    btn.counterAxisAlignItems = "CENTER";
    btn.fills = [brandGradient];
    btn.appendChild(createText(text, fontSansBold, 14.5, C.white));
    if (hasIcon) btn.appendChild(createText("→", fontSansBold, 16, C.white));
    return btn;
  }

  function createHeader(activeStep = 1) {
    const bar = figma.createFrame();
    bar.layoutMode = "HORIZONTAL";
    bar.primaryAxisSizingMode = "FIXED";
    bar.counterAxisSizingMode = "AUTO";
    bar.resize(1120, 64);
    bar.layoutAlign = "STRETCH";
    bar.primaryAxisAlignItems = "SPACE_BETWEEN";
    bar.counterAxisAlignItems = "CENTER";
    bar.fills = [];

    const logoGroup = figma.createFrame();
    logoGroup.layoutMode = "HORIZONTAL";
    logoGroup.itemSpacing = 10;
    logoGroup.counterAxisAlignItems = "CENTER";
    logoGroup.fills = [];
    
    const iconBadge = figma.createFrame();
    iconBadge.resize(30, 30);
    iconBadge.cornerRadius = 999;
    iconBadge.fills = [brandGradient];
    logoGroup.appendChild(iconBadge);
    logoGroup.appendChild(createText("ReRouteHer", fontDispExtra, 18, C.ink));
    bar.appendChild(logoGroup);

    const stepper = figma.createFrame();
    stepper.layoutMode = "HORIZONTAL";
    stepper.itemSpacing = 12;
    stepper.counterAxisAlignItems = "CENTER";
    stepper.fills = [];

    const steps = ["1. Upload CV", "2. Career Break", "3. Snapshot", "4. Gap"];
    steps.forEach((name, i) => {
      const stepIdx = i + 1;
      const isDone = stepIdx < activeStep;
      const isActive = stepIdx === activeStep;

      const node = figma.createFrame();
      node.layoutMode = "HORIZONTAL";
      node.itemSpacing = 6;
      node.counterAxisAlignItems = "CENTER";
      node.paddingLeft = 10; node.paddingRight = 12; node.paddingTop = 6; node.paddingBottom = 6;
      node.cornerRadius = 999;
      
      if (isActive) {
        node.fills = [brandGradient];
        node.appendChild(createText(String(stepIdx), fontSansBold, 12, C.white));
        node.appendChild(createText(name.split(". ")[1], fontSansBold, 12, C.white));
      } else if (isDone) {
        node.fills = [{ type: "SOLID", color: C.mintBg }];
        node.appendChild(createText("✓", fontSansBold, 12, C.mintText));
        node.appendChild(createText(name.split(". ")[1], fontSansSemi, 12, C.mintText));
      } else {
        node.fills = [{ type: "SOLID", color: C.white, opacity: 0.6 }];
        node.appendChild(createText(String(stepIdx), fontSansSemi, 12, C.inkFaint));
        node.appendChild(createText(name.split(". ")[1], fontSansSemi, 12, C.inkFaint));
      }
      stepper.appendChild(node);
      if (i < 3) {
        const line = figma.createLine();
        line.resize(20, 0);
        line.strokes = [{ type: "SOLID", color: isDone ? C.pinkDark : C.borderSoft }];
        line.strokeWeight = 2;
        stepper.appendChild(line);
      }
    });

    bar.appendChild(stepper);
    return bar;
  }

  // 1. E1 LANDING
  function buildE1Landing() {
    const page = figma.createFrame();
    page.name = "01 · E1 Landing Page";
    page.resize(1280, 880);
    page.fills = [{ type: "SOLID", color: C.bgSoft }];
    page.layoutMode = "VERTICAL";
    page.paddingLeft = 80; page.paddingRight = 80; page.paddingTop = 36; page.paddingBottom = 40;
    page.itemSpacing = 36;

    page.appendChild(createHeader(1));

    const hero = figma.createFrame();
    hero.layoutMode = "HORIZONTAL";
    hero.layoutAlign = "STRETCH";
    hero.itemSpacing = 44;
    hero.counterAxisAlignItems = "CENTER";
    hero.fills = [];

    const left = figma.createFrame();
    left.layoutMode = "VERTICAL";
    left.itemSpacing = 20;
    left.resize(580, 320);
    left.fills = [];

    left.appendChild(createText("See what you still\nhave to offer", fontDispExtra, 46, C.ink));
    const sub = createText("Coming back to work after a career break can feel like starting from zero. It isn't. We turn your resume and life experience into an actionable skill readiness plan.", fontSans, 15.5, C.inkSoft);
    sub.resize(520, 66);
    left.appendChild(sub);
    left.appendChild(createPrimaryButton("Get started", true));
    hero.appendChild(left);

    const heroCard = createGlassCard(480, 32, 24);
    heroCard.itemSpacing = 16;
    heroCard.appendChild(createChip("✦ 2 Simple Inputs · AI-Powered Fit", "pink"));
    heroCard.appendChild(createText("A career break counts as experience", fontDispBold, 22, C.ink));
    heroCard.appendChild(createText("Caring for family built real skills: budgeting, scheduling, multi-stakeholder coordination. We map them straight to real O*NET workforce competencies.", fontSans, 14, C.inkSoft));
    hero.appendChild(heroCard);
    page.appendChild(hero);

    const featureRow = figma.createFrame();
    featureRow.layoutMode = "HORIZONTAL";
    featureRow.layoutAlign = "STRETCH";
    featureRow.itemSpacing = 20;
    featureRow.fills = [];

    [
      { t: "1. Upload your CV", d: "Extract your core career competencies directly from your resume." },
      { t: "2. Describe your break", d: "Tell us in your own words what filled your time — AI reframes it to O*NET." },
      { t: "3. See fit & top gaps", d: "Get your transparent readiness score and top 3 focus areas." }
    ].forEach(f => {
      const c = createGlassCard("AUTO", 22, 18);
      c.layoutGrow = 1;
      c.itemSpacing = 8;
      c.appendChild(createText(f.t, fontDispBold, 16, C.ink));
      c.appendChild(createText(f.d, fontSans, 13, C.inkSoft));
      featureRow.appendChild(c);
    });
    page.appendChild(featureRow);
    return page;
  }

  // 2. E2A UPLOAD CV (MANDATORY, NO SKIP, NO MANUAL DROPDOWN)
  function buildE2aUploadCV() {
    const page = figma.createFrame();
    page.name = "02 · E2a Upload CV (Mandatory)";
    page.resize(1280, 880);
    page.fills = [{ type: "SOLID", color: C.bgSoft }];
    page.layoutMode = "VERTICAL";
    page.paddingLeft = 80; page.paddingRight = 80; page.paddingTop = 36; page.paddingBottom = 40;
    page.itemSpacing = 24;

    page.appendChild(createHeader(1));

    const card = createGlassCard(720, 36, 24);
    card.layoutAlign = "CENTER";
    card.itemSpacing = 22;

    card.appendChild(createChip("Step 1 of 2 · Resume Ingestion", "blue"));
    card.appendChild(createText("Upload your CV", fontDispExtra, 26, C.ink));
    card.appendChild(createText("We analyze your previous experience to extract your core professional skills automatically.", fontSans, 14, C.inkSoft));

    // Dropzone
    const drop = figma.createFrame();
    drop.layoutMode = "VERTICAL";
    drop.layoutAlign = "STRETCH";
    drop.counterAxisAlignItems = "CENTER";
    drop.paddingTop = 32; drop.paddingBottom = 32;
    drop.cornerRadius = 16;
    drop.fills = [{ type: "SOLID", color: C.white, opacity: 0.65 }];
    drop.strokes = [{ type: "SOLID", color: C.pinkDark, opacity: 0.6 }];
    drop.strokeWeight = 1.5;
    drop.itemSpacing = 8;
    drop.appendChild(createText("📄 Upload your CV (PDF or DOCX) *", fontSansBold, 15, C.ink));
    drop.appendChild(createText("Drag and drop here, or click to browse · Supports up to 10MB", fontSans, 12.5, C.inkFaint));
    card.appendChild(drop);

    // Selected state representation
    const selState = figma.createFrame();
    selState.layoutMode = "HORIZONTAL";
    selState.primaryAxisAlignItems = "SPACE_BETWEEN";
    selState.counterAxisAlignItems = "CENTER";
    selState.layoutAlign = "STRETCH";
    selState.paddingLeft = 16; selState.paddingRight = 16; selState.paddingTop = 12; selState.paddingBottom = 12;
    selState.cornerRadius = 12;
    selState.fills = [{ type: "SOLID", color: C.white }];
    selState.strokes = [{ type: "SOLID", color: { r: 0.2, g: 0.6, b: 0.4 } }];
    selState.appendChild(createText("✓ Sarah_Chen_Resume_2026.pdf (1.8 MB · Verified)", fontSansBold, 13, C.mintText));
    selState.appendChild(createChip("Replace File", "default"));
    card.appendChild(selState);

    const bRow = figma.createFrame();
    bRow.layoutMode = "HORIZONTAL";
    bRow.primaryAxisAlignItems = "CENTER";
    bRow.layoutAlign = "STRETCH";
    bRow.fills = [];
    bRow.appendChild(createPrimaryButton("Continue to Career Break", true));
    card.appendChild(bRow);

    page.appendChild(card);
    return page;
  }

  // 3. E2B CAREER BREAK (ONLY 2 QUESTIONS: DURATION + FREE TEXT)
  function buildE2bCareerBreak() {
    const page = figma.createFrame();
    page.name = "03 · E2b Career Break (2 Questions · NLP Text)";
    page.resize(1280, 880);
    page.fills = [{ type: "SOLID", color: C.bgSoft }];
    page.layoutMode = "VERTICAL";
    page.paddingLeft = 80; page.paddingRight = 80; page.paddingTop = 36; page.paddingBottom = 40;
    page.itemSpacing = 24;

    page.appendChild(createHeader(2));

    const card = createGlassCard(740, 36, 24);
    card.layoutAlign = "CENTER";
    card.itemSpacing = 24;

    card.appendChild(createChip("Step 2 of 2 · Break Questionnaire", "mint"));
    card.appendChild(createText("Tell us about your career break", fontDispExtra, 26, C.ink));
    card.appendChild(createText("Your time out counts as real experience — just two simple questions for our AI model.", fontSans, 14, C.inkSoft));

    // Question 1: Duration Slider
    const q1Box = figma.createFrame();
    q1Box.layoutMode = "VERTICAL";
    q1Box.layoutAlign = "STRETCH";
    q1Box.itemSpacing = 8;
    q1Box.fills = [];
    q1Box.appendChild(createText("1. Roughly how long was your career break?", fontSansBold, 14, C.ink));
    
    const sliderBar = figma.createFrame();
    sliderBar.layoutMode = "HORIZONTAL";
    sliderBar.primaryAxisAlignItems = "SPACE_BETWEEN";
    sliderBar.counterAxisAlignItems = "CENTER";
    sliderBar.layoutAlign = "STRETCH";
    sliderBar.paddingLeft = 16; sliderBar.paddingRight = 16; sliderBar.paddingTop = 12; sliderBar.paddingBottom = 12;
    sliderBar.cornerRadius = 12;
    sliderBar.fills = [{ type: "SOLID", color: C.white, opacity: 0.8 }];
    sliderBar.strokes = [{ type: "SOLID", color: C.borderSoft }];
    sliderBar.appendChild(createText("Duration: 3.0 Years Out", fontSansBold, 13.5, C.ink));
    sliderBar.appendChild(createChip("3 Years", "mint"));
    q1Box.appendChild(sliderBar);
    card.appendChild(q1Box);

    // Question 2: Free Text Input
    const q2Box = figma.createFrame();
    q2Box.layoutMode = "VERTICAL";
    q2Box.layoutAlign = "STRETCH";
    q2Box.itemSpacing = 8;
    q2Box.fills = [];
    q2Box.appendChild(createText("2. What did you do during this time? *", fontSansBold, 14, C.ink));
    
    const textBox = figma.createFrame();
    textBox.layoutMode = "VERTICAL";
    textBox.layoutAlign = "STRETCH";
    textBox.paddingLeft = 16; textBox.paddingRight = 16; textBox.paddingTop = 14; textBox.paddingBottom = 14;
    textBox.cornerRadius = 14;
    textBox.fills = [{ type: "SOLID", color: C.white }];
    textBox.strokes = [{ type: "SOLID", color: C.borderSoft }];
    textBox.appendChild(createText("Cared for 2 children full-time, managed family household budget and logistics schedules, organized community school fundraisers, and completed self-paced digital design courses.", fontSans, 13.5, C.ink));
    q2Box.appendChild(textBox);

    // Suggestions Row
    const sugRow = figma.createFrame();
    sugRow.layoutMode = "HORIZONTAL";
    sugRow.itemSpacing = 8;
    sugRow.counterAxisAlignItems = "CENTER";
    sugRow.fills = [];
    sugRow.appendChild(createText("Quick tags:", fontSansBold, 11, C.inkFaint));
    sugRow.appendChild(createChip("+ Childcare", "default"));
    sugRow.appendChild(createChip("+ Budgeting", "default"));
    sugRow.appendChild(createChip("+ Volunteering", "default"));
    sugRow.appendChild(createChip("+ Self-study", "default"));
    q2Box.appendChild(sugRow);
    card.appendChild(q2Box);

    const bRow = figma.createFrame();
    bRow.layoutMode = "HORIZONTAL";
    bRow.primaryAxisAlignItems = "SPACE_BETWEEN";
    bRow.counterAxisAlignItems = "CENTER";
    bRow.layoutAlign = "STRETCH";
    bRow.fills = [];
    bRow.appendChild(createText("← Back to CV", fontSansSemi, 13, C.inkFaint));
    bRow.appendChild(createPrimaryButton("See my skill snapshot", true));
    card.appendChild(bRow);

    page.appendChild(card);
    return page;
  }

  // 4. E3 SKILL SNAPSHOT (READ-ONLY BASELINE)
  function buildE3Snapshot() {
    const page = figma.createFrame();
    page.name = "04 · E3 Skill Snapshot (Read-Only Baseline)";
    page.resize(1280, 900);
    page.fills = [{ type: "SOLID", color: C.bgSoft }];
    page.layoutMode = "VERTICAL";
    page.paddingLeft = 80; page.paddingRight = 80; page.paddingTop = 36; page.paddingBottom = 40;
    page.itemSpacing = 22;

    page.appendChild(createHeader(3));

    const content = figma.createFrame();
    content.layoutMode = "VERTICAL";
    content.layoutAlign = "STRETCH";
    content.itemSpacing = 20;
    content.fills = [];

    const titleBox = figma.createFrame();
    titleBox.layoutMode = "VERTICAL";
    titleBox.itemSpacing = 4;
    titleBox.fills = [];
    titleBox.appendChild(createText("Your skill snapshot", fontDispExtra, 28, C.ink));
    titleBox.appendChild(createText("Here is the summary of where you are coming from — extracted from your CV & reframed from your break.", fontSans, 14.5, C.inkSoft));
    content.appendChild(titleBox);

    // Baseline Card
    const bCard = createGlassCard("AUTO", 26, 20);
    bCard.layoutAlign = "STRETCH";
    bCard.itemSpacing = 12;

    const bTop = figma.createFrame();
    bTop.layoutMode = "HORIZONTAL";
    bTop.primaryAxisAlignItems = "SPACE_BETWEEN";
    bTop.layoutAlign = "STRETCH";
    bTop.counterAxisAlignItems = "CENTER";
    bTop.fills = [];
    bTop.appendChild(createText("🕒 YOUR BACKGROUND LOOKS LIKE", fontSansBold, 11.5, C.inkFaint));
    bTop.appendChild(createChip("✓ High confidence match · Read-only baseline", "mint"));
    bCard.appendChild(bTop);

    bCard.appendChild(createText("Based on your story, you're closest to Senior UX/UI Designer.", fontDispBold, 22, C.ink));
    bCard.appendChild(createText("This snapshot captures your starting baseline. On this page, we reflect your foundation. Next, you will choose where you want to aim.", fontSans, 13.5, C.inkSoft));
    content.appendChild(bCard);

    // Two Columns
    const twoCol = figma.createFrame();
    twoCol.layoutMode = "HORIZONTAL";
    twoCol.layoutAlign = "STRETCH";
    twoCol.itemSpacing = 20;
    twoCol.fills = [];

    const col1 = createGlassCard("AUTO", 22, 18);
    col1.layoutGrow = 1;
    col1.itemSpacing = 12;
    col1.appendChild(createText("💼 Skills from your CV", fontSansBold, 14, C.ink));
    const cb1 = figma.createFrame(); cb1.layoutMode = "HORIZONTAL"; cb1.layoutWrap = "WRAP"; cb1.itemSpacing = 8; cb1.fills = [];
    ["User Research & Synthesis", "Interactive Prototyping", "Design Systems Tokens", "Usability Testing", "Stakeholder Alignment"].forEach(s => {
      cb1.appendChild(createChip(s, "default"));
    });
    col1.appendChild(cb1);
    twoCol.appendChild(col1);

    const col2 = createGlassCard("AUTO", 22, 18);
    col2.layoutGrow = 1;
    col2.itemSpacing = 12;
    col2.appendChild(createText("🌱 From your break (Reframed to O*NET)", fontSansBold, 14, C.ink));
    const cb2 = figma.createFrame(); cb2.layoutMode = "HORIZONTAL"; cb2.layoutWrap = "WRAP"; cb2.itemSpacing = 8; cb2.fills = [];
    ["Active Listening", "Time Management", "Multi-schedule Coordination", "Budget Allocation", "Crisis Management"].forEach(s => {
      cb2.appendChild(createChip(s, "mint"));
    });
    col2.appendChild(cb2);
    twoCol.appendChild(col2);
    content.appendChild(twoCol);

    const banner = createGlassCard("AUTO", 16, 16);
    banner.layoutAlign = "STRETCH";
    banner.fills = [{ type: "SOLID", color: C.pinkLight, opacity: 0.95 }];
    banner.itemSpacing = 6;
    banner.appendChild(createText("⚡ NLP Parsing → Active Listening · Time Management · Budgeting · Coordination", fontSansBold, 13, C.ink));
    banner.appendChild(createText("Your free-form career break text was analyzed and mapped to standard O*NET workforce competency taxonomies.", fontSans, 12, C.inkSoft));
    content.appendChild(banner);

    const botCTA = figma.createFrame();
    botCTA.layoutMode = "HORIZONTAL";
    botCTA.primaryAxisAlignItems = "SPACE_BETWEEN";
    botCTA.counterAxisAlignItems = "CENTER";
    botCTA.layoutAlign = "STRETCH";
    botCTA.fills = [];
    botCTA.appendChild(createText("Next: Choose your target role to calculate your custom readiness score and focus areas.", fontSansSemi, 13, C.inkSoft));
    botCTA.appendChild(createPrimaryButton("Choose target role & see readiness", true));
    content.appendChild(botCTA);

    page.appendChild(content);
    return page;
  }

  // 5. E4 ROLE GAP: UX/UI (78% -> 94%)
  function buildE4UxUi() {
    const page = figma.createFrame();
    page.name = "05 · E4 Target Role: Senior UX/UI (78% → 94%)";
    page.resize(1280, 940);
    page.fills = [{ type: "SOLID", color: C.bgSoft }];
    page.layoutMode = "VERTICAL";
    page.paddingLeft = 80; page.paddingRight = 80; page.paddingTop = 36; page.paddingBottom = 40;
    page.itemSpacing = 20;

    page.appendChild(createHeader(4));

    const content = figma.createFrame();
    content.layoutMode = "VERTICAL";
    content.layoutAlign = "STRETCH";
    content.itemSpacing = 16;
    content.fills = [];

    const titleBox = figma.createFrame();
    titleBox.layoutMode = "VERTICAL";
    titleBox.itemSpacing = 4;
    titleBox.fills = [];
    titleBox.appendChild(createText("Where do you want to go next?", fontDispExtra, 28, C.ink));
    titleBox.appendChild(createText("Pick the role you're aiming for. We started with your closest match — switch to any role you want to aim for.", fontSans, 14.5, C.inkSoft));
    content.appendChild(titleBox);

    const pillsRow = figma.createFrame();
    pillsRow.layoutMode = "HORIZONTAL";
    pillsRow.itemSpacing = 10;
    pillsRow.fills = [];
    pillsRow.appendChild(createChip("🎨 Senior UX/UI Design (Closest match)", "active"));
    pillsRow.appendChild(createChip("📈 Digital Marketing", "default"));
    pillsRow.appendChild(createChip("💬 Customer Support", "default"));
    pillsRow.appendChild(createChip("📊 Bookkeeping & Finance", "default"));
    content.appendChild(pillsRow);

    // Readiness Card
    const readCard = createGlassCard("AUTO", 24, 20);
    readCard.layoutAlign = "STRETCH";
    readCard.itemSpacing = 16;

    const cardHead = figma.createFrame();
    cardHead.layoutMode = "HORIZONTAL";
    cardHead.primaryAxisAlignItems = "SPACE_BETWEEN";
    cardHead.layoutAlign = "STRETCH";
    cardHead.counterAxisAlignItems = "CENTER";
    cardHead.fills = [];
    cardHead.appendChild(createText("TARGET READINESS ANALYSIS", fontSansBold, 11.5, C.inkFaint));
    cardHead.appendChild(createChip("Senior UX/UI Designer (Remote)", "blue"));
    readCard.appendChild(cardHead);

    const scoreRow = figma.createFrame();
    scoreRow.layoutMode = "HORIZONTAL";
    scoreRow.layoutAlign = "STRETCH";
    scoreRow.itemSpacing = 28;
    scoreRow.counterAxisAlignItems = "CENTER";
    scoreRow.fills = [];

    const gaugeFrame = figma.createFrame();
    gaugeFrame.resize(220, 140);
    gaugeFrame.cornerRadius = 16;
    gaugeFrame.fills = [{ type: "SOLID", color: C.white, opacity: 0.75 }];
    gaugeFrame.strokes = [{ type: "SOLID", color: C.borderSoft }];
    gaugeFrame.layoutMode = "VERTICAL";
    gaugeFrame.primaryAxisAlignItems = "CENTER";
    gaugeFrame.counterAxisAlignItems = "CENTER";
    gaugeFrame.itemSpacing = 4;
    gaugeFrame.appendChild(createText("78%", fontDispExtra, 44, C.ink));
    gaugeFrame.appendChild(createText("READY TODAY", fontSansBold, 10, C.inkFaint));
    gaugeFrame.appendChild(createChip("78% today → 94% target", "active"));
    scoreRow.appendChild(gaugeFrame);

    const rightMetrics = figma.createFrame();
    rightMetrics.layoutMode = "VERTICAL";
    rightMetrics.layoutGrow = 1;
    rightMetrics.itemSpacing = 10;
    rightMetrics.fills = [];

    // M1: 10-dot meter
    const m1 = figma.createFrame();
    m1.layoutMode = "HORIZONTAL";
    m1.primaryAxisAlignItems = "SPACE_BETWEEN";
    m1.counterAxisAlignItems = "CENTER";
    m1.layoutAlign = "STRETCH";
    m1.paddingLeft = 16; m1.paddingRight = 16; m1.paddingTop = 10; m1.paddingBottom = 10;
    m1.cornerRadius = 12;
    m1.fills = [{ type: "SOLID", color: C.white, opacity: 0.65 }];
    m1.appendChild(createText("You already have 7 of 10 key skills for this role.", fontSansBold, 13, C.ink));
    
    const dotMeter = figma.createFrame();
    dotMeter.layoutMode = "HORIZONTAL";
    dotMeter.itemSpacing = 5;
    dotMeter.fills = [];
    for (let i = 0; i < 10; i++) {
      const dot = figma.createFrame();
      dot.resize(10, 10);
      dot.cornerRadius = 999;
      dot.fills = [{ type: "SOLID", color: i < 7 ? C.mintDot : C.pinkDark }];
      dotMeter.appendChild(dot);
    }
    m1.appendChild(dotMeter);
    rightMetrics.appendChild(m1);

    // M2: Formula explanation
    const m2 = figma.createFrame();
    m2.layoutMode = "VERTICAL";
    m2.layoutAlign = "STRETCH";
    m2.paddingLeft = 16; m2.paddingRight = 16; m2.paddingTop = 10; m2.paddingBottom = 10;
    m2.cornerRadius = 12;
    m2.itemSpacing = 4;
    m2.fills = [{ type: "SOLID", color: C.pinkLight, opacity: 0.75 }];
    m2.appendChild(createText("WHY 78%? IMPORTANCE-WEIGHTED FORMULA", fontSansBold, 10.5, C.pinkDark));
    m2.appendChild(createText("Score is weighted by market importance: having foundational essentials (User Research, Prototyping) gives you 78% baseline fit.", fontSans, 12, C.inkSoft));
    rightMetrics.appendChild(m2);

    // M3: Projected target
    const m3 = figma.createFrame();
    m3.layoutMode = "HORIZONTAL";
    m3.primaryAxisAlignItems = "SPACE_BETWEEN";
    m3.counterAxisAlignItems = "CENTER";
    m3.layoutAlign = "STRETCH";
    m3.paddingLeft = 16; m3.paddingRight = 16; m3.paddingTop = 10; m3.paddingBottom = 10;
    m3.cornerRadius = 12;
    m3.fills = [{ type: "SOLID", color: C.white, opacity: 0.65 }];
    m3.appendChild(createText("78% today → 94% after closing your top 3 focus areas", fontSansBold, 13, C.ink));
    m3.appendChild(createChip("+16% Total Uplift", "blue"));
    rightMetrics.appendChild(m3);

    scoreRow.appendChild(rightMetrics);
    readCard.appendChild(scoreRow);
    content.appendChild(readCard);

    // Breakdown
    const breakdown = figma.createFrame();
    breakdown.layoutMode = "HORIZONTAL";
    breakdown.layoutAlign = "STRETCH";
    breakdown.itemSpacing = 20;
    breakdown.fills = [];

    const haveBox = createGlassCard("AUTO", 20, 18);
    haveBox.layoutGrow = 1;
    haveBox.itemSpacing = 10;
    haveBox.appendChild(createText("✓ Skills you already bring (7 matched)", fontSansBold, 13.5, C.ink));
    ["User Research & Synthesis", "Interactive Prototyping", "Design Systems Tokens", "Information Architecture", "Usability Testing", "Active Listening (Break)", "Time Prioritization (Break)"].forEach(s => {
      const row = figma.createFrame();
      row.layoutMode = "HORIZONTAL";
      row.primaryAxisAlignItems = "SPACE_BETWEEN";
      row.layoutAlign = "STRETCH";
      row.paddingTop = 3; row.paddingBottom = 3;
      row.fills = [];
      row.appendChild(createText("✓ " + s, fontSansSemi, 12, C.ink));
      haveBox.appendChild(row);
    });
    breakdown.appendChild(haveBox);

    const buildBox = createGlassCard("AUTO", 20, 18);
    buildBox.layoutGrow = 1.15;
    buildBox.itemSpacing = 10;
    buildBox.appendChild(createText("★ Your top 3 to start with (Capped to avoid overwhelm)", fontSansBold, 13.5, C.ink));

    const top3 = [
      { name: "1. AI Design Tools (Figma AI, Midjourney)", tag: "+9% if learned", note: "Generative asset ideation & rapid exploration workflows", type: "amber" },
      { name: "2. Scalable Design Systems (Tokens)", tag: "+7% if learned", note: "Advanced enterprise variables & multi-brand scaling", type: "amber" },
      { name: "3. Prompt Engineering for UX Workflows", tag: "+5% if learned", note: "Automated micro-copy testing & synthetic user simulation", type: "blue" }
    ];

    top3.forEach(b => {
      const r = figma.createFrame();
      r.layoutMode = "VERTICAL";
      r.layoutAlign = "STRETCH";
      r.paddingLeft = 12; r.paddingRight = 12; r.paddingTop = 8; r.paddingBottom = 8;
      r.cornerRadius = 10;
      r.itemSpacing = 4;
      r.fills = [{ type: "SOLID", color: C.white, opacity: 0.85 }];
      r.strokes = [{ type: "SOLID", color: C.borderSoft }];
      r.strokeWeight = 1;

      const rTop = figma.createFrame();
      rTop.layoutMode = "HORIZONTAL";
      rTop.primaryAxisAlignItems = "SPACE_BETWEEN";
      rTop.counterAxisAlignItems = "CENTER";
      rTop.layoutAlign = "STRETCH";
      rTop.fills = [];
      rTop.appendChild(createText(b.name, fontSansBold, 12.5, C.ink));
      rTop.appendChild(createChip(b.tag, b.type === "amber" ? "active" : "blue"));
      r.appendChild(rTop);
      r.appendChild(createText(b.note, fontSans, 11, C.inkSoft));
      buildBox.appendChild(r);
    });
    breakdown.appendChild(buildBox);
    content.appendChild(breakdown);

    page.appendChild(content);
    return page;
  }

  // BUILD FRAMES
  const f1 = buildE1Landing();
  const f2 = buildE2aUploadCV();
  const f3 = buildE2bCareerBreak();
  const f4 = buildE3Snapshot();
  const f5 = buildE4UxUi();

  const frames = [f1, f2, f3, f4, f5];
  frames.forEach((f, i) => {
    f.x = (i % 3) * 1380;
    f.y = Math.floor(i / 3) * 1020;
  });

  figma.viewport.scrollAndZoomIntoView(frames);
  figma.notify("✨ ReRouteHer Simplified MVP Flow (CV + 2-Question Break + Snapshot + Gap) generated in Figma!");
  figma.closePlugin();
})();
