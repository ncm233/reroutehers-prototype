// ReRouteHer — Master Figma UI & Design System Generator
// Generates the ENTIRE repository: All 11 Screens, Design System, Tokens, and Role Variants.

(async function main() {
  // 1. Font loader with graceful fallbacks
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
  const fontSansMed = await loadSafeFont("Plus Jakarta Sans", "Medium");
  const fontSansSemi = await loadSafeFont("Plus Jakarta Sans", "SemiBold");
  const fontSansBold = await loadSafeFont("Plus Jakarta Sans", "Bold");
  const fontDispBold = await loadSafeFont("Bricolage Grotesque", "Bold");
  const fontDispExtra = await loadSafeFont("Bricolage Grotesque", "ExtraBold");

  // 2. Color Palette & Gradients
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
    cardBg: hex("#FFFFFF"),
    borderSoft: hex("#E2DFEE"),
    borderFaint: hex("#EEEBF6"),
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

  const heroBgGradient = {
    type: "GRADIENT_LINEAR",
    gradientTransform: [[0.7, 0.7, 0], [-0.7, 0.7, 0]],
    gradientStops: [
      { position: 0, color: hex("#FBDCE6") },
      { position: 0.25, color: hex("#F0C7DA") },
      { position: 0.5, color: hex("#CEC3E2") },
      { position: 0.75, color: hex("#9FAAD6") },
      { position: 1, color: hex("#5661A6") }
    ]
  };

  // 3. UI Helper Builders
  function createText(chars, font, size, color, align = "LEFT", autoResize = "WIDTH_AND_HEIGHT") {
    const t = figma.createText();
    t.fontName = font;
    t.fontSize = size;
    t.characters = chars;
    t.fills = [{ type: "SOLID", color }];
    t.textAlignHorizontal = align;
    t.textAutoResize = autoResize;
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
    f.itemSpacing = 6;
    f.counterAxisAlignItems = "CENTER";

    let textColor = C.ink;
    let bgColor = C.white;
    let strokeColor = C.borderSoft;

    if (type === "mint") {
      textColor = C.mintText;
      bgColor = C.mintBg;
      strokeColor = { r: 0.2, g: 0.6, b: 0.4 };
    } else if (type === "active" || type === "pink") {
      textColor = C.ink;
      bgColor = C.pinkLight;
      strokeColor = C.pinkDark;
    } else if (type === "blue") {
      textColor = C.blueDark;
      bgColor = C.blueLight;
      strokeColor = C.blue;
    } else if (type === "amber") {
      textColor = C.amberText;
      bgColor = C.amberBg;
      strokeColor = C.amberDot;
    }

    f.fills = [{ type: "SOLID", color: bgColor, opacity: type === "default" ? 0.85 : 1 }];
    f.strokes = [{ type: "SOLID", color: strokeColor, opacity: 0.4 }];
    f.strokeWeight = 1;

    const t = createText(text, fontSansSemi, 12.5, textColor);
    f.appendChild(t);
    return f;
  }

  function createPrimaryButton(text, hasIcon = true, size = "md") {
    const btn = figma.createFrame();
    btn.layoutMode = "HORIZONTAL";
    btn.primaryAxisSizingMode = "AUTO";
    btn.counterAxisSizingMode = "AUTO";
    const py = size === "lg" ? 18 : 14;
    const px = size === "lg" ? 36 : 28;
    btn.paddingLeft = px; btn.paddingRight = px; btn.paddingTop = py; btn.paddingBottom = py;
    btn.cornerRadius = 999;
    btn.itemSpacing = 8;
    btn.counterAxisAlignItems = "CENTER";
    btn.fills = [brandGradient];
    btn.effects = [{
      type: "DROP_SHADOW",
      color: { r: 0.75, g: 0.35, b: 0.6, a: 0.4 },
      offset: { x: 0, y: 10 },
      radius: 20,
      spread: -4,
      visible: true,
      blendMode: "NORMAL"
    }];

    btn.appendChild(createText(text, fontSansBold, size === "lg" ? 16 : 14.5, C.white));
    if (hasIcon) {
      btn.appendChild(createText("→", fontSansBold, 16, C.white));
    }
    return btn;
  }

  function createHeader(activeStep = 1, activeSub = null) {
    const bar = figma.createFrame();
    bar.layoutMode = "HORIZONTAL";
    bar.primaryAxisSizingMode = "FIXED";
    bar.counterAxisSizingMode = "AUTO";
    bar.resize(1120, 64);
    bar.layoutAlign = "STRETCH";
    bar.primaryAxisAlignItems = "SPACE_BETWEEN";
    bar.counterAxisAlignItems = "CENTER";
    bar.fills = [];

    // Logo
    const logoGroup = figma.createFrame();
    logoGroup.layoutMode = "HORIZONTAL";
    logoGroup.itemSpacing = 10;
    logoGroup.counterAxisAlignItems = "CENTER";
    logoGroup.fills = [];
    
    const iconBadge = figma.createFrame();
    iconBadge.resize(32, 32);
    iconBadge.cornerRadius = 999;
    iconBadge.fills = [brandGradient];
    logoGroup.appendChild(iconBadge);

    const logoText = createText("ReRouteHer", fontDispExtra, 19, C.ink);
    logoGroup.appendChild(logoText);
    bar.appendChild(logoGroup);

    // Stepper
    const stepper = figma.createFrame();
    stepper.layoutMode = "HORIZONTAL";
    stepper.itemSpacing = 14;
    stepper.counterAxisAlignItems = "CENTER";
    stepper.fills = [];

    const steps = ["1. Story", "2. Snapshot", "3. Gap"];
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
      if (i < 2) {
        const line = figma.createLine();
        line.resize(22, 0);
        line.strokes = [{ type: "SOLID", color: isDone ? C.pinkDark : C.borderSoft }];
        line.strokeWeight = 2;
        stepper.appendChild(line);
      }
    });

    bar.appendChild(stepper);
    return bar;
  }

  // ================= 4. ALL 11 INDIVIDUAL SCREEN BUILDERS =================

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
    const sub = createText("Coming back to work after a career break can feel like starting from zero. It isn't. We help turn what you've been doing into an actionable plan.", fontSans, 15.5, C.inkSoft);
    sub.resize(520, 66);
    sub.textAutoResize = "NONE";
    left.appendChild(sub);
    left.appendChild(createPrimaryButton("Get started", true, "lg"));
    hero.appendChild(left);

    const heroCard = createGlassCard(480, 32, 24);
    heroCard.itemSpacing = 16;
    heroCard.appendChild(createChip("✦ 3 Steps · Zero Signup Friction", "pink"));
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
      { t: "1. Tell your story", d: "Share your professional background and caregiving activities." },
      { t: "2. See your snapshot", d: "We reframe your experience into standardized O*NET skills." },
      { t: "3. Know your next move", d: "See transparent weighted fit and your top 3 prioritized gaps." }
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

  // 2. E2A STORY: BACKGROUND
  function buildE2aStory() {
    const page = figma.createFrame();
    page.name = "02 · E2a Story Intake (Background)";
    page.resize(1280, 880);
    page.fills = [{ type: "SOLID", color: C.bgSoft }];
    page.layoutMode = "VERTICAL";
    page.paddingLeft = 80; page.paddingRight = 80; page.paddingTop = 36; page.paddingBottom = 40;
    page.itemSpacing = 24;

    page.appendChild(createHeader(1));

    const card = createGlassCard(720, 36, 24);
    card.layoutAlign = "CENTER";
    card.itemSpacing = 20;

    card.appendChild(createChip("Step 1 of 3 · Professional History", "blue"));
    card.appendChild(createText("What did you do before?", fontDispExtra, 26, C.ink));
    card.appendChild(createText("One thing at a time — this step alone is enough to build your starting skill snapshot.", fontSans, 14, C.inkSoft));

    // Upload Dropzone
    const drop = figma.createFrame();
    drop.layoutMode = "VERTICAL";
    drop.layoutAlign = "STRETCH";
    drop.counterAxisAlignItems = "CENTER";
    drop.paddingTop = 28; drop.paddingBottom = 28;
    drop.cornerRadius = 16;
    drop.fills = [{ type: "SOLID", color: C.white, opacity: 0.6 }];
    drop.strokes = [{ type: "SOLID", color: C.pinkDark, opacity: 0.5 }];
    drop.strokeWeight = 1.5;
    drop.itemSpacing = 6;
    drop.appendChild(createText("📄 Upload your CV (PDF or DOCX)", fontSansBold, 14.5, C.ink));
    drop.appendChild(createText("Drag and drop here, or click to browse · Up to 10MB", fontSans, 12, C.inkFaint));
    card.appendChild(drop);

    // Manual input fields
    const formGrid = figma.createFrame();
    formGrid.layoutMode = "HORIZONTAL";
    formGrid.layoutAlign = "STRETCH";
    formGrid.itemSpacing = 14;
    formGrid.fills = [];

    const input1 = figma.createFrame();
    input1.layoutMode = "VERTICAL";
    input1.layoutGrow = 1;
    input1.paddingLeft = 16; input1.paddingRight = 16; input1.paddingTop = 14; input1.paddingBottom = 14;
    input1.cornerRadius = 12;
    input1.fills = [{ type: "SOLID", color: C.white }];
    input1.strokes = [{ type: "SOLID", color: C.borderSoft }];
    input1.appendChild(createText("Senior UX Designer", fontSansSemi, 13.5, C.ink));
    formGrid.appendChild(input1);

    const input2 = figma.createFrame();
    input2.layoutMode = "VERTICAL";
    input2.layoutGrow = 1;
    input2.paddingLeft = 16; input2.paddingRight = 16; input2.paddingTop = 14; input2.paddingBottom = 14;
    input2.cornerRadius = 12;
    input2.fills = [{ type: "SOLID", color: C.white }];
    input2.strokes = [{ type: "SOLID", color: C.borderSoft }];
    input2.appendChild(createText("Design & Creative ▼", fontSansSemi, 13.5, C.ink));
    formGrid.appendChild(input2);
    card.appendChild(formGrid);

    const bRow = figma.createFrame();
    bRow.layoutMode = "HORIZONTAL";
    bRow.primaryAxisAlignItems = "SPACE_BETWEEN";
    bRow.counterAxisAlignItems = "CENTER";
    bRow.layoutAlign = "STRETCH";
    bRow.fills = [];
    bRow.appendChild(createText("Skip — I'll add this later", fontSansSemi, 13, C.inkFaint));
    bRow.appendChild(createPrimaryButton("Continue to Career Break", true));
    card.appendChild(bRow);

    page.appendChild(card);
    return page;
  }

  // 3. E2B STORY: CAREER BREAK & TIMELINE
  function buildE2bBreak() {
    const page = figma.createFrame();
    page.name = "03 · E2b Story Intake (Career Break)";
    page.resize(1280, 880);
    page.fills = [{ type: "SOLID", color: C.bgSoft }];
    page.layoutMode = "VERTICAL";
    page.paddingLeft = 80; page.paddingRight = 80; page.paddingTop = 36; page.paddingBottom = 40;
    page.itemSpacing = 24;

    page.appendChild(createHeader(1));

    const card = createGlassCard(740, 36, 24);
    card.layoutAlign = "CENTER";
    card.itemSpacing = 22;

    card.appendChild(createChip("Step 2 of 3 · Your Break Activities", "mint"));
    card.appendChild(createText("Tell us about your career break", fontDispExtra, 26, C.ink));
    card.appendChild(createText("Your time out counts as real experience — here is where we capture and reframe it.", fontSans, 14, C.inkSoft));

    // Slider Representation
    const sliderBox = figma.createFrame();
    sliderBox.layoutMode = "HORIZONTAL";
    sliderBox.layoutAlign = "STRETCH";
    sliderBox.primaryAxisAlignItems = "SPACE_BETWEEN";
    sliderBox.counterAxisAlignItems = "CENTER";
    sliderBox.paddingLeft = 18; sliderBox.paddingRight = 18; sliderBox.paddingTop = 12; sliderBox.paddingBottom = 12;
    sliderBox.cornerRadius = 14;
    sliderBox.fills = [{ type: "SOLID", color: C.white, opacity: 0.7 }];
    sliderBox.strokes = [{ type: "SOLID", color: C.borderSoft }];
    sliderBox.appendChild(createText("Career Break Duration: ~3 Years", fontSansBold, 13.5, C.ink));
    sliderBox.appendChild(createChip("3.0 Years Out", "active"));
    card.appendChild(sliderBox);

    // Life Timeline Age Bands
    const ageBandsRow = figma.createFrame();
    ageBandsRow.layoutMode = "HORIZONTAL";
    ageBandsRow.layoutAlign = "STRETCH";
    ageBandsRow.itemSpacing = 8;
    ageBandsRow.fills = [];

    ["Under 25", "25–30 (Selected · 3 items)", "31–35", "36–40", "41+"].forEach((b, i) => {
      const isSel = i === 1;
      const ab = figma.createFrame();
      ab.layoutMode = "VERTICAL";
      ab.layoutGrow = 1;
      ab.paddingTop = 10; ab.paddingBottom = 10;
      ab.counterAxisAlignItems = "CENTER";
      ab.cornerRadius = 12;
      ab.fills = [{ type: "SOLID", color: isSel ? C.pinkLight : C.white }];
      ab.strokes = [{ type: "SOLID", color: isSel ? C.pinkDark : C.borderSoft }];
      ab.appendChild(createText(b, fontSansBold, 11.5, isSel ? C.pinkDark : C.inkSoft));
      ageBandsRow.appendChild(ab);
    });
    card.appendChild(ageBandsRow);

    // Activity Chips
    const actGrid = figma.createFrame();
    actGrid.layoutMode = "HORIZONTAL";
    actGrid.layoutWrap = "WRAP";
    actGrid.itemSpacing = 10;
    actGrid.layoutAlign = "STRETCH";
    actGrid.fills = [];

    [
      { n: "Cared for children", on: true },
      { n: "Ran the household", on: true },
      { n: "Managed family budget", on: true },
      { n: "Volunteered in community", on: false },
      { n: "Side project / freelancing", on: false },
      { n: "Self-study & online courses", on: true }
    ].forEach(t => {
      actGrid.appendChild(createChip(t.n, t.on ? "active" : "default"));
    });
    card.appendChild(actGrid);

    const bRow = figma.createFrame();
    bRow.layoutMode = "HORIZONTAL";
    bRow.primaryAxisAlignItems = "SPACE_BETWEEN";
    bRow.counterAxisAlignItems = "CENTER";
    bRow.layoutAlign = "STRETCH";
    bRow.fills = [];
    bRow.appendChild(createText("← Back to Background", fontSansSemi, 13, C.inkFaint));
    bRow.appendChild(createPrimaryButton("Continue to Work Needs", true));
    card.appendChild(bRow);

    page.appendChild(card);
    return page;
  }

  // 4. E2C STORY: WHAT YOU NEED NOW (ACCORDION)
  function buildE2cNeeds() {
    const page = figma.createFrame();
    page.name = "04 · E2c Story Intake (Work Needs)";
    page.resize(1280, 880);
    page.fills = [{ type: "SOLID", color: C.bgSoft }];
    page.layoutMode = "VERTICAL";
    page.paddingLeft = 80; page.paddingRight = 80; page.paddingTop = 36; page.paddingBottom = 40;
    page.itemSpacing = 24;

    page.appendChild(createHeader(1));

    const card = createGlassCard(740, 36, 24);
    card.layoutAlign = "CENTER";
    card.itemSpacing = 18;

    card.appendChild(createChip("Step 3 of 3 · Flexibility & Arrangement", "blue"));
    card.appendChild(createText("What are you looking for now?", fontDispExtra, 26, C.ink));
    card.appendChild(createText("Pick anything that fits — this shapes which target roles we highlight for you.", fontSans, 14, C.inkSoft));

    // Accordion categories
    const categories = [
      { name: "Work arrangement (2 selected)", tags: ["Remote / work from home ✓", "Flexible hours ✓", "Part-time to start", "Hybrid"] },
      { name: "Time & schedule (1 selected)", tags: ["School-hours only ✓", "Term-time only", "Flexible / self-paced"] },
      { name: "Family & daily needs (1 selected)", tags: ["School pickup flexibility ✓", "Sick-day flexibility", "Quiet home workspace"] }
    ];

    categories.forEach(cat => {
      const acc = figma.createFrame();
      acc.layoutMode = "VERTICAL";
      acc.layoutAlign = "STRETCH";
      acc.paddingLeft = 16; acc.paddingRight = 16; acc.paddingTop = 12; acc.paddingBottom = 12;
      acc.cornerRadius = 14;
      acc.itemSpacing = 10;
      acc.fills = [{ type: "SOLID", color: C.white, opacity: 0.75 }];
      acc.strokes = [{ type: "SOLID", color: C.borderSoft }];

      const accHead = figma.createFrame();
      accHead.layoutMode = "HORIZONTAL";
      accHead.primaryAxisAlignItems = "SPACE_BETWEEN";
      accHead.layoutAlign = "STRETCH";
      accHead.fills = [];
      accHead.appendChild(createText("▾ " + cat.name, fontSansBold, 13.5, C.ink));
      acc.appendChild(accHead);

      const tagRow = figma.createFrame();
      tagRow.layoutMode = "HORIZONTAL";
      tagRow.layoutWrap = "WRAP";
      tagRow.itemSpacing = 8;
      tagRow.fills = [];
      cat.tags.forEach(tg => {
        tagRow.appendChild(createChip(tg, tg.includes("✓") ? "active" : "default"));
      });
      acc.appendChild(tagRow);
      card.appendChild(acc);
    });

    const bRow = figma.createFrame();
    bRow.layoutMode = "HORIZONTAL";
    bRow.primaryAxisAlignItems = "SPACE_BETWEEN";
    bRow.counterAxisAlignItems = "CENTER";
    bRow.layoutAlign = "STRETCH";
    bRow.fills = [];
    bRow.appendChild(createText("← Back to Break", fontSansSemi, 13, C.inkFaint));
    bRow.appendChild(createPrimaryButton("See my skill snapshot", true));
    card.appendChild(bRow);

    page.appendChild(card);
    return page;
  }

  // 5. E3 SKILL SNAPSHOT (READ-ONLY BASELINE)
  function buildE3Snapshot() {
    const page = figma.createFrame();
    page.name = "05 · E3 Skill Snapshot (History Baseline)";
    page.resize(1280, 900);
    page.fills = [{ type: "SOLID", color: C.bgSoft }];
    page.layoutMode = "VERTICAL";
    page.paddingLeft = 80; page.paddingRight = 80; page.paddingTop = 36; page.paddingBottom = 40;
    page.itemSpacing = 22;

    page.appendChild(createHeader(2));

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
    titleBox.appendChild(createText("Here is the summary of where you are coming from — your career history & reframed break skills.", fontSans, 14.5, C.inkSoft));
    content.appendChild(titleBox);

    // READ-ONLY BASELINE CARD
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

    // TWO-COLUMN INVENTORY
    const twoCol = figma.createFrame();
    twoCol.layoutMode = "HORIZONTAL";
    twoCol.layoutAlign = "STRETCH";
    twoCol.itemSpacing = 20;
    twoCol.fills = [];

    const col1 = createGlassCard("AUTO", 22, 18);
    col1.layoutGrow = 1;
    col1.itemSpacing = 12;
    col1.appendChild(createText("💼 Skills you already have (Career History)", fontSansBold, 14, C.ink));
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

    // Crosswalk banner
    const banner = createGlassCard("AUTO", 16, 16);
    banner.layoutAlign = "STRETCH";
    banner.fills = [{ type: "SOLID", color: C.pinkLight, opacity: 0.95 }];
    banner.itemSpacing = 6;
    banner.appendChild(createText("⚡ Caregiving & Running a Home → Time Management · Budgeting · Coordination", fontSansBold, 13, C.ink));
    banner.appendChild(createText("Everyday life activities systematically translated into standard O*NET workforce competency taxonomies.", fontSans, 12, C.inkSoft));
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

  // 6. E4 TARGET ROLE GAP: SENIOR UX/UI DESIGNER (DEFAULT CLOSEST MATCH)
  function buildE4UxUi() {
    return buildRoleGapFrame(
      "06 · E4 Target Role: UX/UI Design (Closest Match)",
      "Senior UX/UI Designer (Remote)",
      0,
      78, 94, 16, 7, 10,
      "Because you have foundational core competencies (User Research, Prototyping, Design Systems), you start at 78% ready. Foundational essentials carry heavier weighting in hiring than emerging tool gaps.",
      ["User Research & Synthesis", "Interactive Prototyping", "Design Systems Tokens", "Information Architecture", "Usability Testing", "Active Listening (Break)", "Time Prioritization (Break)"],
      [
        { name: "1. AI Design Tools (Figma AI, Midjourney)", tag: "+9% if learned", note: "Generative asset ideation & rapid exploration workflows", type: "amber" },
        { name: "2. Scalable Design Systems (Tokens)", tag: "+7% if learned", note: "Advanced enterprise variables & multi-brand scaling", type: "amber" },
        { name: "3. Prompt Engineering for UX Workflows", tag: "+5% if learned", note: "Automated micro-copy testing & synthetic user simulation", type: "blue" }
      ]
    );
  }

  // 7. E4 TARGET ROLE GAP: DIGITAL MARKETING
  function buildE4Marketing() {
    return buildRoleGapFrame(
      "07 · E4 Target Role: Digital Marketing",
      "Digital Marketing Specialist (Flexible)",
      1,
      72, 91, 19, 7, 10,
      "Your transferable storytelling, content creation, and project management provide a 72% baseline fit. Closing tactical analytics and modern search gaps unlocks 91% readiness.",
      ["Content Strategy & Copywriting", "Social Media Channel Management", "Campaign Planning & Storytelling", "Brand Voice & Positioning", "Stakeholder Communication", "Budget Allocation (Break)", "Community Coordination (Break)"],
      [
        { name: "1. Modern AI-Driven SEO & Visibility", tag: "+8% if learned", note: "LLM citation readiness & intent-based semantic ranking", type: "amber" },
        { name: "2. Multi-Touch Funnel Analytics (GA4)", tag: "+6% if learned", note: "Full-funnel attribution models & conversion tracking", type: "amber" },
        { name: "3. AI Ad Creative & Copy Automation", tag: "+5% if learned", note: "Multivariate ad experimentation & asset scaling", type: "blue" }
      ]
    );
  }

  // 8. E4 TARGET ROLE GAP: CUSTOMER SUPPORT
  function buildE4Support() {
    return buildRoleGapFrame(
      "08 · E4 Target Role: Customer Support",
      "Customer Support Lead (Remote)",
      2,
      85, 97, 12, 8, 10,
      "Strong empathy, clear documentation, and conflict de-escalation give you an 85% starting readiness. Adopting modern helpdesk AI tools pushes you to near-complete 97% readiness.",
      ["Empathetic Client Communication", "Conflict Resolution & De-escalation", "Multi-channel Ticket Prioritization", "Knowledge Base Authoring & FAQs", "Customer Onboarding", "Patience & Listening (Break)", "Crisis Calm Leadership (Break)", "Schedule Organization (Break)"],
      [
        { name: "1. Omnichannel Helpdesk (Zendesk/Intercom)", tag: "+7% if learned", note: "Automated ticket routing, macros & SLA monitoring", type: "amber" },
        { name: "2. AI Copilot Reply & Smart Triage", tag: "+6% if learned", note: "Leveraging assistive AI drafts to double response velocity", type: "amber" },
        { name: "3. CRM Health Scores & Churn Risk", tag: "+4% if learned", note: "HubSpot customer telemetry & lifecycle retention", type: "blue" }
      ]
    );
  }

  // 9. E4 TARGET ROLE GAP: BOOKKEEPING & FINANCE
  function buildE4Bookkeeping() {
    return buildRoleGapFrame(
      "09 · E4 Target Role: Bookkeeping & Finance",
      "Bookkeeper & Financial Assistant (Flexible)",
      3,
      64, 91, 27, 6, 10,
      "Your budget tracking and spreadsheet diligence provide a 64% core foundation. Mastering standard cloud accounting platforms yields a fast +27% readiness jump to 91%.",
      ["Spreadsheet Modeling (Excel/Sheets)", "Expense Categorization & Audit Trails", "Invoice Verification & Scheduling", "Attention to Detail & Auditing", "Household Budget Management (Break)", "Vendor Negotiation (Break)"],
      [
        { name: "1. Cloud Accounting (Xero / QuickBooks)", tag: "+12% if learned", note: "Bank feeds reconciliation, chart of accounts & ledger audits", type: "amber" },
        { name: "2. AI Copilot for Financial Sheets", tag: "+9% if learned", note: "Automated formula generation, OCR receipts & anomaly detection", type: "amber" },
        { name: "3. Digital Tax Compliance & E-Filing", tag: "+6% if learned", note: "Year-end compliance reporting & digital filing routines", type: "blue" }
      ]
    );
  }

  // Generic Role Gap Frame Builder
  function buildRoleGapFrame(frameName, roleTitle, activeRoleIdx, currentPct, targetPct, upliftTotal, matchedCount, totalSkills, formulaExpl, haveSkills, top3Gaps) {
    const page = figma.createFrame();
    page.name = frameName;
    page.resize(1280, 940);
    page.fills = [{ type: "SOLID", color: C.bgSoft }];
    page.layoutMode = "VERTICAL";
    page.paddingLeft = 80; page.paddingRight = 80; page.paddingTop = 36; page.paddingBottom = 40;
    page.itemSpacing = 20;

    page.appendChild(createHeader(3));

    const content = figma.createFrame();
    content.layoutMode = "VERTICAL";
    content.layoutAlign = "STRETCH";
    content.itemSpacing = 16;
    content.fills = [];

    // Aiming Reframe Header
    const titleBox = figma.createFrame();
    titleBox.layoutMode = "VERTICAL";
    titleBox.itemSpacing = 4;
    titleBox.fills = [];
    titleBox.appendChild(createText("Where do you want to go next?", fontDispExtra, 28, C.ink));
    titleBox.appendChild(createText("Pick the role you're aiming for. We started with your closest match — switch to any role you want to aim for.", fontSans, 14.5, C.inkSoft));
    content.appendChild(titleBox);

    // Role selector pills
    const pillsRow = figma.createFrame();
    pillsRow.layoutMode = "HORIZONTAL";
    pillsRow.itemSpacing = 10;
    pillsRow.fills = [];
    const rolesList = [
      "🎨 Senior UX/UI Design (Closest match)",
      "📈 Digital Marketing",
      "💬 Customer Support",
      "📊 Bookkeeping & Finance"
    ];
    rolesList.forEach((r, idx) => {
      pillsRow.appendChild(createChip(r, idx === activeRoleIdx ? "active" : "default"));
    });
    content.appendChild(pillsRow);

    // READINESS ANALYSIS CARD
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
    cardHead.appendChild(createChip(roleTitle, "blue"));
    readCard.appendChild(cardHead);

    const scoreRow = figma.createFrame();
    scoreRow.layoutMode = "HORIZONTAL";
    scoreRow.layoutAlign = "STRETCH";
    scoreRow.itemSpacing = 28;
    scoreRow.counterAxisAlignItems = "CENTER";
    scoreRow.fills = [];

    // Left: Arc Gauge Representation
    const gaugeFrame = figma.createFrame();
    gaugeFrame.resize(220, 140);
    gaugeFrame.cornerRadius = 16;
    gaugeFrame.fills = [{ type: "SOLID", color: C.white, opacity: 0.75 }];
    gaugeFrame.strokes = [{ type: "SOLID", color: C.borderSoft }];
    gaugeFrame.layoutMode = "VERTICAL";
    gaugeFrame.primaryAxisAlignItems = "CENTER";
    gaugeFrame.counterAxisAlignItems = "CENTER";
    gaugeFrame.itemSpacing = 4;

    gaugeFrame.appendChild(createText(currentPct + "%", fontDispExtra, 44, C.ink));
    gaugeFrame.appendChild(createText("READY TODAY", fontSansBold, 10, C.inkFaint));
    gaugeFrame.appendChild(createChip(currentPct + "% today → " + targetPct + "% target", "active"));
    scoreRow.appendChild(gaugeFrame);

    // Right: 3 Metric Breakdown Boxes
    const rightMetrics = figma.createFrame();
    rightMetrics.layoutMode = "VERTICAL";
    rightMetrics.layoutGrow = 1;
    rightMetrics.itemSpacing = 10;
    rightMetrics.fills = [];

    // Metric 1: Count & 10-Dot Meter
    const m1 = figma.createFrame();
    m1.layoutMode = "HORIZONTAL";
    m1.primaryAxisAlignItems = "SPACE_BETWEEN";
    m1.counterAxisAlignItems = "CENTER";
    m1.layoutAlign = "STRETCH";
    m1.paddingLeft = 16; m1.paddingRight = 16; m1.paddingTop = 10; m1.paddingBottom = 10;
    m1.cornerRadius = 12;
    m1.fills = [{ type: "SOLID", color: C.white, opacity: 0.65 }];
    m1.appendChild(createText("You already have " + matchedCount + " of " + totalSkills + " key skills for this role.", fontSansBold, 13, C.ink));
    
    const dotMeter = figma.createFrame();
    dotMeter.layoutMode = "HORIZONTAL";
    dotMeter.itemSpacing = 5;
    dotMeter.fills = [];
    for (let i = 0; i < totalSkills; i++) {
      const dot = figma.createFrame();
      dot.resize(10, 10);
      dot.cornerRadius = 999;
      dot.fills = [{ type: "SOLID", color: i < matchedCount ? C.mintDot : C.pinkDark }];
      dotMeter.appendChild(dot);
    }
    m1.appendChild(dotMeter);
    rightMetrics.appendChild(m1);

    // Metric 2: Transparent Formula Callout
    const m2 = figma.createFrame();
    m2.layoutMode = "VERTICAL";
    m2.layoutAlign = "STRETCH";
    m2.paddingLeft = 16; m2.paddingRight = 16; m2.paddingTop = 10; m2.paddingBottom = 10;
    m2.cornerRadius = 12;
    m2.itemSpacing = 4;
    m2.fills = [{ type: "SOLID", color: C.pinkLight, opacity: 0.75 }];
    m2.appendChild(createText("WHY " + currentPct + "%? IMPORTANCE-WEIGHTED FORMULA", fontSansBold, 10.5, C.pinkDark));
    m2.appendChild(createText(formulaExpl, fontSans, 12, C.inkSoft));
    rightMetrics.appendChild(m2);

    // Metric 3: Projected Target
    const m3 = figma.createFrame();
    m3.layoutMode = "HORIZONTAL";
    m3.primaryAxisAlignItems = "SPACE_BETWEEN";
    m3.counterAxisAlignItems = "CENTER";
    m3.layoutAlign = "STRETCH";
    m3.paddingLeft = 16; m3.paddingRight = 16; m3.paddingTop = 10; m3.paddingBottom = 10;
    m3.cornerRadius = 12;
    m3.fills = [{ type: "SOLID", color: C.white, opacity: 0.65 }];
    m3.appendChild(createText(currentPct + "% today → " + targetPct + "% after closing your top 3 focus areas", fontSansBold, 13, C.ink));
    m3.appendChild(createChip("+" + upliftTotal + "% Total Uplift", "blue"));
    rightMetrics.appendChild(m3);

    scoreRow.appendChild(rightMetrics);
    readCard.appendChild(scoreRow);
    content.appendChild(readCard);

    // TWO-COLUMN GAP BREAKDOWN
    const breakdown = figma.createFrame();
    breakdown.layoutMode = "HORIZONTAL";
    breakdown.layoutAlign = "STRETCH";
    breakdown.itemSpacing = 20;
    breakdown.fills = [];

    const haveBox = createGlassCard("AUTO", 20, 18);
    haveBox.layoutGrow = 1;
    haveBox.itemSpacing = 10;
    haveBox.appendChild(createText("✓ Skills you already bring (" + matchedCount + " matched)", fontSansBold, 13.5, C.ink));
    haveSkills.forEach(s => {
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

    top3Gaps.forEach(b => {
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

  // 10. E5 ITERATION 2 ROADMAP PREVIEW
  function buildE5RoadmapPreview() {
    const page = figma.createFrame();
    page.name = "10 · E5 Roadmap & Learning Plan (Iteration 2 Preview)";
    page.resize(1280, 880);
    page.fills = [{ type: "SOLID", color: C.bgSoft }];
    page.layoutMode = "VERTICAL";
    page.paddingLeft = 80; page.paddingRight = 80; page.paddingTop = 36; page.paddingBottom = 40;
    page.itemSpacing = 24;

    page.appendChild(createHeader(3));

    const card = createGlassCard(820, 36, 24);
    card.layoutAlign = "CENTER";
    card.itemSpacing = 20;

    card.appendChild(createChip("Iteration 2 · Personalized Learning Roadmap", "blue"));
    card.appendChild(createText("Your 6-Week Re-entry Action Plan", fontDispExtra, 26, C.ink));
    card.appendChild(createText("Bite-sized weekly micro-sprints tailored to fit around your family schedule.", fontSans, 14, C.inkSoft));

    const milestones = [
      { wk: "Week 1–2", title: "AI Design Tools Mastery (Figma AI & Midjourney)", stat: "+9% Readiness Uplift", status: "Sprint 1 Ready" },
      { wk: "Week 3–4", title: "Advanced Enterprise Design System Tokens", stat: "+7% Readiness Uplift", status: "Sprint 2" },
      { wk: "Week 5–6", title: "UX Workflow Prompt Engineering & Real Case Study", stat: "+5% Readiness Uplift", status: "Sprint 3" }
    ];

    milestones.forEach((m, idx) => {
      const mBox = figma.createFrame();
      mBox.layoutMode = "HORIZONTAL";
      mBox.primaryAxisAlignItems = "SPACE_BETWEEN";
      mBox.counterAxisAlignItems = "CENTER";
      mBox.layoutAlign = "STRETCH";
      mBox.paddingLeft = 20; mBox.paddingRight = 20; mBox.paddingTop = 16; mBox.paddingBottom = 16;
      mBox.cornerRadius = 14;
      mBox.fills = [{ type: "SOLID", color: C.white, opacity: 0.8 }];
      mBox.strokes = [{ type: "SOLID", color: C.borderSoft }];

      const leftSide = figma.createFrame();
      leftSide.layoutMode = "VERTICAL";
      leftSide.itemSpacing = 4;
      leftSide.fills = [];
      leftSide.appendChild(createText(m.wk + " · " + m.status, fontSansBold, 11, C.pinkDark));
      leftSide.appendChild(createText(m.title, fontSansBold, 14, C.ink));
      mBox.appendChild(leftSide);

      mBox.appendChild(createChip(m.stat, "mint"));
      card.appendChild(mBox);
    });

    const bRow = figma.createFrame();
    bRow.layoutMode = "HORIZONTAL";
    bRow.primaryAxisAlignItems = "SPACE_BETWEEN";
    bRow.counterAxisAlignItems = "CENTER";
    bRow.layoutAlign = "STRETCH";
    bRow.fills = [];
    bRow.appendChild(createText("Projected Completion: 94% Market Fit", fontSansBold, 13.5, C.mintText));
    bRow.appendChild(createPrimaryButton("Export My Learning Plan", true));
    card.appendChild(bRow);

    page.appendChild(card);
    return page;
  }

  // 11. DESIGN SYSTEM & TOKEN PALETTE BOARD
  function buildDesignTokensBoard() {
    const page = figma.createFrame();
    page.name = "00 · ReRouteHer Design Tokens & Components";
    page.resize(1280, 880);
    page.fills = [{ type: "SOLID", color: C.white }];
    page.layoutMode = "VERTICAL";
    page.paddingLeft = 60; page.paddingRight = 60; page.paddingTop = 40; page.paddingBottom = 40;
    page.itemSpacing = 28;

    page.appendChild(createText("ReRouteHer — Design System & UI Kit", fontDispExtra, 32, C.ink));
    page.appendChild(createText("Core Design Tokens, Semantic Colors, Typography Scale, and Atomic Components.", fontSans, 14, C.inkSoft));

    // Colors Row
    const colorSec = figma.createFrame();
    colorSec.layoutMode = "VERTICAL";
    colorSec.itemSpacing = 12;
    colorSec.fills = [];
    colorSec.appendChild(createText("COLOR PALETTE & TOKENS", fontSansBold, 12, C.inkFaint));

    const swatches = figma.createFrame();
    swatches.layoutMode = "HORIZONTAL";
    swatches.itemSpacing = 14;
    swatches.fills = [];

    const colorsList = [
      { name: "Brand Pink", hex: "#EE86AC", c: C.pink },
      { name: "Brand Lavender", hex: "#B98FC9", c: C.lavender },
      { name: "Brand Blue", hex: "#6E7BC0", c: C.blue },
      { name: "Ink Primary", hex: "#1E2243", c: C.ink },
      { name: "Mint Reframed", hex: "#DEF3E7", c: C.mintBg },
      { name: "Amber Essential", hex: "#FEF0DA", c: C.amberBg }
    ];

    colorsList.forEach(cl => {
      const sw = figma.createFrame();
      sw.resize(160, 90);
      sw.cornerRadius = 12;
      sw.fills = [{ type: "SOLID", color: cl.c }];
      sw.strokes = [{ type: "SOLID", color: C.borderSoft }];
      sw.paddingLeft = 12; sw.paddingBottom = 12;
      sw.layoutMode = "VERTICAL";
      sw.primaryAxisAlignItems = "MAX";
      sw.appendChild(createText(cl.name, fontSansBold, 11, cl.hex === "#1E2243" ? C.white : C.ink));
      sw.appendChild(createText(cl.hex, fontSans, 10, cl.hex === "#1E2243" ? C.borderSoft : C.inkSoft));
      swatches.appendChild(sw);
    });
    colorSec.appendChild(swatches);
    page.appendChild(colorSec);

    // Component Samples Row
    const compSec = figma.createFrame();
    compSec.layoutMode = "VERTICAL";
    compSec.itemSpacing = 14;
    compSec.fills = [];
    compSec.appendChild(createText("ATOMIC UI COMPONENTS", fontSansBold, 12, C.inkFaint));

    const compRow = figma.createFrame();
    compRow.layoutMode = "HORIZONTAL";
    compRow.itemSpacing = 20;
    compRow.counterAxisAlignItems = "CENTER";
    compRow.fills = [];

    compRow.appendChild(createPrimaryButton("Primary Action", true));
    compRow.appendChild(createChip("Default Chip", "default"));
    compRow.appendChild(createChip("Mint O*NET Chip", "mint"));
    compRow.appendChild(createChip("Active Pink Chip", "active"));
    compRow.appendChild(createChip("+9% Uplift Tag", "amber"));
    compRow.appendChild(createChip("Blue Info Tag", "blue"));
    compSec.appendChild(compRow);
    page.appendChild(compSec);

    return page;
  }

  // ================= 5. MASTER EXECUTION & CANVAS LAYOUT =================
  const s00 = buildDesignTokensBoard();
  const s01 = buildE1Landing();
  const s02 = buildE2aStory();
  const s03 = buildE2bBreak();
  const s04 = buildE2cNeeds();
  const s05 = buildE3Snapshot();
  const s06 = buildE4UxUi();
  const s07 = buildE4Marketing();
  const s08 = buildE4Support();
  const s09 = buildE4Bookkeeping();
  const s10 = buildE5RoadmapPreview();

  const allFrames = [s00, s01, s02, s03, s04, s05, s06, s07, s08, s09, s10];

  // Grid layout on canvas: 3 columns x 4 rows with 100px gaps
  const cols = 3;
  const colWidth = 1380;
  const rowHeight = 980;

  allFrames.forEach((frame, idx) => {
    const c = idx % cols;
    const r = Math.floor(idx / cols);
    frame.x = c * colWidth;
    frame.y = r * rowHeight;
  });

  figma.viewport.scrollAndZoomIntoView(allFrames);
  figma.notify("🚀 ReRouteHer Master Project (11 Full Screens + Design Tokens) generated in Figma!");
  figma.closePlugin();
})();
