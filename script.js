/* ===== BGM ===== */
const bgmMenu = new Audio("audio/bgm.mp3");
bgmMenu.loop = true;
bgmMenu.volume = 0.5;

const bgmMansion = new Audio("audio/bgm mansion.mp3"); // ✅ mansion-only
bgmMansion.loop = true;
bgmMansion.volume = 0.5;

let currentBGM = bgmMenu;
let bgmStarted = false;

async function playBGM(which){
  if(currentBGM && !currentBGM.paused){
    currentBGM.pause();
    currentBGM.currentTime = 0;
  }
  currentBGM = which;

  try{
    await currentBGM.play();
    bgmStarted = true;
    return true;
  }catch(e){
    return false;
  }
}

async function tryPlayBGM(){
  if(bgmStarted) return true;
  return playBGM(bgmMenu);
}

window.addEventListener("load", () => { tryPlayBGM(); });
window.addEventListener("pointerdown", () => { tryPlayBGM(); }, { once:true });

/* ===== Screens ===== */
const menuScreen      = document.getElementById("menuScreen");
const aboutScreen     = document.getElementById("aboutScreen");
const casesScreen     = document.getElementById("casesScreen");
const mansionScreen   = document.getElementById("mansionScreen");
const mission2Screen  = document.getElementById("mission2Screen");
const mission3Screen  = document.getElementById("mission3Screen");
const mission4Screen  = document.getElementById("mission4Screen");
const mission5Screen  = document.getElementById("mission5Screen");

const wifeAlibiScreen    = document.getElementById("wifeAlibiScreen");
const chefAlibiScreen    = document.getElementById("chefAlibiScreen");
const butlerAlibiScreen  = document.getElementById("butlerAlibiScreen");
const husbandAlibiScreen = document.getElementById("husbandAlibiScreen");

const wifeResultScreen = document.getElementById("wifeResultScreen");
const wifeResultText = document.getElementById("wifeResultText");
const resultPill = document.getElementById("resultPill");

/* ✅ Case 2 screens */
const case2IntroScreen   = document.getElementById("case2IntroScreen");
const case2InspectScreen = document.getElementById("case2InspectScreen");
const case2ChooseScreen  = document.getElementById("case2ChooseScreen");
const case2WrongScreen   = document.getElementById("case2WrongScreen");
const case2CorrectScreen = document.getElementById("case2CorrectScreen");

/* ✅ Case 2 text refs */
const case2IntroTextEl   = document.getElementById("case2IntroText");
const case2WrongTextEl   = document.getElementById("case2WrongText");
const case2CorrectTextEl = document.getElementById("case2CorrectText");

const transition = document.getElementById("transition");

/* ===== Mission2 UI refs (used for wrong message screen) ===== */
const nextBtn2 = document.getElementById("nextBtn2");
const mission2Return = document.getElementById("mission2Return");

/* ===== Wife Alibi UI ===== */
const wifeBubbleText = document.getElementById("wifeBubbleText");
const notInnocentPill = document.getElementById("notInnocentPill");
const wifeXOverlay = document.getElementById("wifeXOverlay");
const innocentBtn = document.getElementById("innocentBtn");
const suspectBtn = document.getElementById("suspectBtn");

/* ===== Other alibi texts ===== */
const chefBubbleText = document.getElementById("chefBubbleText");
const butlerBubbleText = document.getElementById("butlerBubbleText");
const husbandBubbleText = document.getElementById("husbandBubbleText");

/* ===== Text elements ===== */
const mansionTextEl  = document.getElementById("mansionText");
const mission2TextEl = document.getElementById("mission2Text");
const mission3TextEl = document.getElementById("mission3Text");

/* ===== Buttons ===== */
const nextBtn  = document.getElementById("nextBtn");
const nextBtn3 = document.getElementById("nextBtn3");
const nextBtn4 = document.getElementById("nextBtn4");
const nextBtn5 = document.getElementById("nextBtn5");

/* ===== Transition helper ===== */
function runTransition(nextFn){
  transition.classList.remove("on");
  void transition.offsetWidth;
  transition.classList.add("on");
  setTimeout(() => nextFn(), 240);
}

function hideAll(){
  menuScreen.classList.remove("active");
  aboutScreen.classList.remove("active");
  casesScreen.classList.remove("active");
  mansionScreen.classList.remove("active");
  mission2Screen.classList.remove("active");
  mission3Screen.classList.remove("active");
  mission4Screen.classList.remove("active");
  mission5Screen.classList.remove("active");

  wifeAlibiScreen.classList.remove("active");
  chefAlibiScreen.classList.remove("active");
  butlerAlibiScreen.classList.remove("active");
  husbandAlibiScreen.classList.remove("active");

  wifeResultScreen.classList.remove("active");

  /* ✅ Case 2 hides */
  case2IntroScreen.classList.remove("active");
  case2InspectScreen.classList.remove("active");
  case2ChooseScreen.classList.remove("active");
  case2WrongScreen.classList.remove("active");
  case2CorrectScreen.classList.remove("active");
}

/* ===== Hearts System (GLOBAL) ===== */
let heartsLeft = 3;

function renderHearts(){
  document.querySelectorAll(".hearts").forEach(h => {
    const spans = Array.from(h.querySelectorAll(".heart"));
    spans.forEach((s, i) => {
      if(i < heartsLeft) s.classList.remove("dead");
      else s.classList.add("dead");
    });
  });
}

function resetHearts(){
  heartsLeft = 3;
  renderHearts();
}

function loseHeart(){
  heartsLeft = Math.max(0, heartsLeft - 1);
  renderHearts();
}

/* ===== Case progress (unlock + done) ===== */
const LS_UNLOCKED = "SEE_unlockedCase";
const LS_CASE1_DONE = "SEE_case1_done";
/* ✅ NEW */
const LS_CASE2_DONE = "SEE_case2_done";

let unlockedCase = Number(localStorage.getItem(LS_UNLOCKED) || "1");

function markCaseDone(caseNum){
  if(caseNum === 1){
    localStorage.setItem(LS_CASE1_DONE, "1");
    unlockedCase = Math.max(unlockedCase, 2);
    localStorage.setItem(LS_UNLOCKED, String(unlockedCase));
  }
  /* ✅ NEW: Case 2 done unlocks Case 3 */
  if(caseNum === 2){
    localStorage.setItem(LS_CASE2_DONE, "1");
    unlockedCase = Math.max(unlockedCase, 3);
    localStorage.setItem(LS_UNLOCKED, String(unlockedCase));
  }
  renderCaseCards();
}

function renderCaseCards(){
  const cards = document.querySelectorAll(".case-card[data-case]");
  cards.forEach(card => {
    const n = Number(card.getAttribute("data-case"));
    const locked = n > unlockedCase;
    card.classList.toggle("locked", locked);
  });

  // DONE badge on case 1
  const case1Done = localStorage.getItem(LS_CASE1_DONE) === "1";
  const case1Card = document.querySelector('.case-card[data-case="1"]');
  if(case1Card){
    case1Card.classList.toggle("done", case1Done);
  }

  // ✅ DONE badge on case 2
  const case2Done = localStorage.getItem(LS_CASE2_DONE) === "1";
  const case2Card = document.querySelector('.case-card[data-case="2"]');
  if(case2Card){
    case2Card.classList.toggle("done", case2Done);
  }
}

/* ===== Chef +24px right (responsive) ===== */
function nudgeChefUI(){
  const chefLabel = document.querySelector("#mission5Screen .chef-label");
  const chefBtn   = document.querySelector("#mission5Screen .chef-btn");
  if(!chefLabel || !chefBtn) return;

  const labelLeft = parseFloat(getComputedStyle(chefLabel).left || "0");
  const btnLeft   = parseFloat(getComputedStyle(chefBtn).left || "0");

  chefLabel.style.left = (labelLeft + 24) + "px";
  chefBtn.style.left   = (btnLeft + 24) + "px";
}

/* ===== Menu ===== */
function startGame(){
  playBGM(bgmMenu);
  runTransition(() => {
    hideAll();
    casesScreen.classList.add("active");
    renderCaseCards();
  });
}
function openAbout(){
  playBGM(bgmMenu);
  runTransition(() => {
    hideAll();
    aboutScreen.classList.add("active");
  });
}
function openCredits(){
  playBGM(bgmMenu);
  alert("Credits page coming next");
}
function goMenuFromAbout(){
  runTransition(() => {
    hideAll();
    menuScreen.classList.add("active");
  });
}
function goMenuFromCases(){
  runTransition(() => {
    hideAll();
    menuScreen.classList.add("active");
  });
}
function backToCases(){
  stopTypingAll();
  playBGM(bgmMenu);
  runTransition(() => {
    hideAll();
    casesScreen.classList.add("active");
    renderCaseCards();
  });
}

/* ===== Cases ===== */
function openCase(n){
  if(n > unlockedCase){
    alert("Locked! Finish the previous case first.");
    return;
  }

  if(n === 1){
    playBGM(bgmMansion);
    runTransition(() => {
      hideAll();
      mansionScreen.classList.add("active");
      resetHearts();
      resetScene1();
    });
    return;
  }

  /* ✅ NEW: Case 2 (Home Alone) */
  if(n === 2){
    playBGM(bgmMenu); // no new audio file needed
    runTransition(() => {
      hideAll();
      case2IntroScreen.classList.add("active");
      // Hearts exist globally, but Case 2 won't change them.
      renderHearts();
      resetCase2Intro();
    });
    return;
  }

  if(n === 3){
    alert("Case 3 screen coming next.");
    return;
  }

  alert("Case " + n + " screen coming next.");
}

/* ===== Typewriter utils ===== */
function typewriter(el, fullText, speedMs, state){
  stopTypewriter(state, true);
  state.isTyping = true;
  state.i = 0;
  state.el = el;
  state.fullText = fullText;

  el.innerHTML = `<span class="typed"></span><span class="cursor">|</span>`;
  const span = el.querySelector(".typed");

  state.timer = setInterval(() => {
    state.i++;
    span.textContent = fullText.slice(0, state.i);
    if(state.i >= fullText.length){
      stopTypewriter(state, false);
      el.textContent = fullText;
    }
  }, speedMs);
}
function stopTypewriter(state, clear){
  if(state.timer){
    clearInterval(state.timer);
    state.timer = null;
  }
  state.isTyping = false;
  if(clear && state.el) state.el.textContent = "";
}
function finishTypewriter(state){
  if(!state.isTyping) return;
  stopTypewriter(state, false);
  state.el.textContent = state.fullText;
}

/* ===== Scene 1 ===== */
const s1 = { timer:null, isTyping:false, i:0, el:mansionTextEl, fullText:"" };
const scene1Text =
  "The mansion fell into silence when the power suddenly went out. Darkness swallowed the halls, and everyone inside froze where they stood.";

function resetScene1(){
  s1.fullText = scene1Text;
  nextBtn.onclick = mansionNext;
  setTimeout(() => typewriter(mansionTextEl, scene1Text, 22, s1), 320);
}
function mansionNext(){
  if(s1.isTyping){ finishTypewriter(s1); return; }
  runTransition(() => {
    hideAll();
    mission2Screen.classList.add("active");
    resetScene2();
  });
}

/* ===== Scene 2 (normal story) ===== */
const s2 = { timer:null, isTyping:false, i:0, el:mission2TextEl, fullText:"" };
const scene2Text =
  "The blackout lasted only a few minutes, but when the lights finally flickered back on, panic filled the air. At the foot of the grand staircase, the maid was found dead, her body cold and unmoving.";

function resetScene2(){
  mission2Return.onclick = backToCases;
  nextBtn2.style.display = "";
  nextBtn2.onclick = mission2Next;

  s2.fullText = scene2Text;
  setTimeout(() => typewriter(mission2TextEl, scene2Text, 22, s2), 320);
}

function mission2Next(){
  if(s2.isTyping){ finishTypewriter(s2); return; }
  runTransition(() => {
    hideAll();
    mission3Screen.classList.add("active");
    resetScene3();
  });
}

/* ===== Scene 3 ===== */
const s3 = { timer:null, isTyping:false, i:0, el:mission3TextEl, fullText:"" };
const scene3Text = "solve the mystery behind the death of the maid...";

function resetScene3(){
  nextBtn2.style.display = "";
  mission2Return.onclick = backToCases;

  s3.fullText = scene3Text;
  nextBtn3.onclick = mission3Next;
  setTimeout(() => typewriter(mission3TextEl, scene3Text, 22, s3), 220);
}
function mission3Next(){
  if(s3.isTyping){ finishTypewriter(s3); return; }
  runTransition(() => {
    hideAll();
    mission4Screen.classList.add("active");
  });
}

/* ===== Scene 4 ===== */
function mission4Next(){
  runTransition(() => {
    hideAll();
    mission5Screen.classList.add("active");
    renderHearts();
    nudgeChefUI();
  });
}

/* ===== Scene 5 ===== */
function mission5Next(){
  alert("Next after suspects not set yet.");
}

/* ===== WRONG GUESS SCREEN ===== */
function showWrongMessage(text){
  runTransition(() => {
    hideAll();
    mission2Screen.classList.add("active");

    nextBtn2.style.display = "none";
    mission2Return.onclick = backToSuspects;

    stopTypewriter(s2, true);
    s2.fullText = text;
    typewriter(mission2TextEl, text, 18, s2);

    renderHearts();
  });
}

/* ===== RESULT SCREEN ===== */
const RESULT_WIN_WIFE =
  "She was the killer, she cannot read in the dark because the lights were out.";
const RESULT_LOSE_3 =
  "You lost. You guessed wrong 3 times.";

let lastResultWasWin = false;

function goToResultScreen(text, pillText = "SUSPECT!", isWin=false){
  lastResultWasWin = !!isWin;
  runTransition(() => {
    hideAll();
    wifeResultScreen.classList.add("active");
    wifeResultText.textContent = text;
    if(resultPill) resultPill.textContent = pillText;
    renderHearts();
  });
}

function wifeResultNext(){
  if(lastResultWasWin){
    markCaseDone(1);
    playBGM(bgmMenu);
    runTransition(() => {
      hideAll();
      casesScreen.classList.add("active");
      renderCaseCards();
    });
    return;
  }

  backToSuspects();
}

/* ===== Alibi Typewriter States ===== */
const wState = { timer:null, isTyping:false, i:0, el:wifeBubbleText, fullText:"" };
const cState = { timer:null, isTyping:false, i:0, el:chefBubbleText, fullText:"" };
const bState = { timer:null, isTyping:false, i:0, el:butlerBubbleText, fullText:"" };
const hState = { timer:null, isTyping:false, i:0, el:husbandBubbleText, fullText:"" };

/* ===== Dialogues ===== */
const WIFE_DIALOGUE =
  "I was reading the whole time. I didn’t stop until the lights were restored.";
const CHEF_DIALOGUE =
  "I stayed in the kitchen, still cooking even in the dark.";
const BUTLER_DIALOGUE =
  "I was in the storage room, checking the generator when the power went out.";
const HUSBAND_DIALOGUE =
  "I was in the study, trying to fix the fuse box.";

/* ===== Prevent double judging per suspect ===== */
const solved = { wife:false, chef:false, butler:false, husband:false };

function resetWifeAlibiUI(){
  notInnocentPill.classList.remove("show");
  wifeXOverlay.classList.remove("show");
  if(innocentBtn){ innocentBtn.disabled = false; innocentBtn.style.filter = ""; }
  if(suspectBtn){ suspectBtn.disabled = false; suspectBtn.style.filter = ""; }
}

/* ===== Open Alibi Screens ===== */
function openAlibi(who){
  if(who === "wife"){
    runTransition(() => {
      hideAll();
      wifeAlibiScreen.classList.add("active");
      resetWifeAlibiUI();
      solved.wife = false;
      typewriter(wifeBubbleText, WIFE_DIALOGUE, 18, wState);
      renderHearts();
    });
    return;
  }

  if(who === "chef"){
    runTransition(() => {
      hideAll();
      chefAlibiScreen.classList.add("active");
      solved.chef = false;
      typewriter(chefBubbleText, CHEF_DIALOGUE, 18, cState);
      renderHearts();
    });
    return;
  }

  if(who === "butler"){
    runTransition(() => {
      hideAll();
      butlerAlibiScreen.classList.add("active");
      solved.butler = false;
      typewriter(butlerBubbleText, BUTLER_DIALOGUE, 18, bState);
      renderHearts();
    });
    return;
  }

  if(who === "husband"){
    runTransition(() => {
      hideAll();
      husbandAlibiScreen.classList.add("active");
      solved.husband = false;
      typewriter(husbandBubbleText, HUSBAND_DIALOGUE, 18, hState);
      renderHearts();
    });
    return;
  }
}

/* ===== Judge logic ===== */
function judgeSuspect(who, verdict){
  if(heartsLeft <= 0){
    goToResultScreen(RESULT_LOSE_3, "SUSPECT!", false);
    return;
  }

  if(solved[who]) return;
  solved[who] = true;

  const isWife = (who === "wife");
  const correctVerdict = isWife ? "suspect" : "innocent";
  const isCorrect = (verdict === correctVerdict);

  if(!isCorrect){
    loseHeart();

    if(heartsLeft <= 0){
      goToResultScreen(RESULT_LOSE_3, "SUSPECT!", false);
      return;
    }

    const msg = isWife
      ? "You were wrong. Try again."
      : "You were wrong. That suspect is innocent.";

    showWrongMessage(msg);
    return;
  }

  if(isWife){
    notInnocentPill.classList.add("show");
    wifeXOverlay.classList.add("show");
    if(innocentBtn){ innocentBtn.disabled = true; innocentBtn.style.filter = "grayscale(0.4)"; }
    if(suspectBtn){ suspectBtn.disabled = true; suspectBtn.style.filter = "grayscale(0.4)"; }

    goToResultScreen(RESULT_WIN_WIFE, "SUSPECT!", true);
    return;
  }

  backToSuspects();
}

/* ===== Back to suspects ===== */
function backToSuspects(){
  nextBtn2.style.display = "";
  mission2Return.onclick = backToCases;

  runTransition(() => {
    hideAll();
    mission5Screen.classList.add("active");
    renderHearts();
    nudgeChefUI();
  });
}

/* ===== stop all typewriters ===== */
function stopTypingAll(){
  stopTypewriter(s1, true);
  stopTypewriter(s2, true);
  stopTypewriter(s3, true);
  stopTypewriter(wState, true);
  stopTypewriter(cState, true);
  stopTypewriter(bState, true);
  stopTypewriter(hState, true);

  // ✅ case 2
  stopTypewriter(c2IntroState, true);
  stopTypewriter(c2WrongState, true);
  stopTypewriter(c2CorrectState, true);
}

/* =========================
   ✅ CASE 2: HOME ALONE LOGIC
   - Hearts do NOTHING here (no loseHeart(), no hearts=0 lose)
========================= */

const c2IntroState   = { timer:null, isTyping:false, i:0, el:case2IntroTextEl, fullText:"" };
const c2WrongState   = { timer:null, isTyping:false, i:0, el:case2WrongTextEl, fullText:"" };
const c2CorrectState = { timer:null, isTyping:false, i:0, el:case2CorrectTextEl, fullText:"" };

const CASE2_INTRO_TEXT =
  "David stopped responding to his sister’s messages. One day passed, then another, until two weeks had gone by with nothing.\n\nWorried, she went to his apartment. The door was locked, the place silent. Inside, she found her brother dead, he hanged himself or did he?";

const CASE2_CLUE_TEXT =
  "David lived alone, yet on the table were two glasses of water, one unfinished and one empty. Proving there had been someone else in the room with him. This wasn't a suicide.";

let case2Chosen = null; // "suicide" | "murder" | null

function resetCase2Intro(){
  case2Chosen = null;
  c2IntroState.fullText = CASE2_INTRO_TEXT;
  setTimeout(() => typewriter(case2IntroTextEl, CASE2_INTRO_TEXT, 22, c2IntroState), 280);
}

function case2IntroNext(){
  if(c2IntroState.isTyping){ finishTypewriter(c2IntroState); return; }
  runTransition(() => {
    hideAll();
    case2InspectScreen.classList.add("active");
    renderHearts(); // display only
  });
}

function case2InspectNext(){
  runTransition(() => {
    hideAll();
    case2ChooseScreen.classList.add("active");
    case2Chosen = null;
    renderHearts();
  });
}

function case2Pick(which){
  case2Chosen = which;

  // Go straight to the feedback screen (like slides)
  if(which === "suicide"){
    runTransition(() => {
      hideAll();
      case2WrongScreen.classList.add("active");
      c2WrongState.fullText = CASE2_CLUE_TEXT;
      typewriter(case2WrongTextEl, CASE2_CLUE_TEXT, 18, c2WrongState);
      renderHearts();
    });
    return;
  }

  if(which === "murder"){
    runTransition(() => {
      hideAll();
      case2CorrectScreen.classList.add("active");
      c2CorrectState.fullText = CASE2_CLUE_TEXT;
      typewriter(case2CorrectTextEl, CASE2_CLUE_TEXT, 18, c2CorrectState);
      renderHearts();
    });
    return;
  }
}

function case2ChooseNext(){
  // keep Next like the slide, but require a choice first
  if(!case2Chosen){
    alert("Choose first.");
    return;
  }
  // If chosen, we already transitioned to wrong/correct immediately.
}

function case2WrongNext(){
  // go back to choose so player can pick again
  runTransition(() => {
    hideAll();
    case2ChooseScreen.classList.add("active");
    case2Chosen = null;
    renderHearts();
  });
}

function case2CorrectNext(){
  // Case 2 finished: mark done + unlock case 3 then return to cases menu
  markCaseDone(2);
  playBGM(bgmMenu);
  runTransition(() => {
    hideAll();
    casesScreen.classList.add("active");
    renderCaseCards();
  });
}

/* expose */
window.startGame = startGame;
window.openAbout = openAbout;
window.openCredits = openCredits;
window.goMenuFromAbout = goMenuFromAbout;
window.goMenuFromCases = goMenuFromCases;

window.openCase = openCase;
window.backToCases = backToCases;

window.mansionNext = mansionNext;
window.mission2Next = mission2Next;
window.mission3Next = mission3Next;
window.mission4Next = mission4Next;
window.mission5Next = mission5Next;

window.openAlibi = openAlibi;
window.judgeSuspect = judgeSuspect;
window.backToSuspects = backToSuspects;
window.wifeResultNext = wifeResultNext;

/* ✅ Case 2 expose */
window.case2IntroNext = case2IntroNext;
window.case2InspectNext = case2InspectNext;
window.case2Pick = case2Pick;
window.case2ChooseNext = case2ChooseNext;
window.case2WrongNext = case2WrongNext;
window.case2CorrectNext = case2CorrectNext;

/* init */
window.addEventListener("load", () => {
  renderHearts();
  renderCaseCards();
});
