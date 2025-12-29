let bgImg;
let tomStand;
let tomWalk;
let tomJump;
let tomAttack;
let tomClimb;
let jerryWalk;
let jerryJump; // 新增 Jerry 跳躍圖片變數
let questionTable; // 儲存 CSV 資料
let currentQuestionRow; // 目前題目的資料列
let quizState = "asking"; // 狀態: asking(問答中), correct(答對), incorrect(答錯)
let bgX = 0;
// Jerry 相對於畫面中心的偏移量 (初始在左邊 100px)
let jerryOffset = -100;
// Enemies 相對於畫面中心的偏移量 (初始在更左邊，例如 -800px)
let enemyOffset = -800;
// Dog 相對於畫面中心的偏移量 (初始在更左邊，例如 -1600px)
let dogOffset = -1600;
// Woman 相對於畫面中心的偏移量 (初始在更左邊，例如 -2400px)
let womanOffset = -2400;
let dogSprite; // Dog 圖片變數
let enemiesRide; // Enemies 圖片變數
let womanWalk, womanShock, womanFall; // Woman 圖片變數
let currentTarget = ""; // 目前互動對象: 'jerry' 或 'enemy'
let btnA, btnB, btnC; // 改為選擇題按鈕
let retryButton, nextButton, restartButton; // 新增重試、下一題與重新開始按鈕
let feedbackText = ""; // 用來顯示回饋文字
let moveSpeed = 5;
let answeredCount = 0; // 記錄答對題數
let enemyAnsweredCount = 0; // 記錄 Enemies 答對題數
let dogAnsweredCount = 0; // 記錄 Dog 答對題數
let womanAnsweredCount = 0; // 記錄 Woman 答對題數
let timeLeft = 15; // 倒數計時 (秒)
let lastTimerUpdate = 0; // 上次更新計時器的時間
let score = 0; // 遊戲分數
let lives = 3; // 初始愛心數量
let isGameClear = false; // 是否通關
let isGameOver = false; // 是否遊戲結束
let fireworks = []; // 煙火陣列
let confetti = []; // 彩帶陣列
let rain = []; // 雨滴陣列
let gravity; // 重力
let tomHappyJumpEndTime = 0; // Tom 開心跳躍結束時間
let usedQuestionIndices = []; // 記錄已出過的題目索引，避免重複
let gameState = "intro"; // 遊戲狀態: intro (開頭動畫), playing (遊戲中)
let bubbleAnim = 0; // 對話框彈出動畫變數 (0~1)
let startButton; // 開始遊戲按鈕
let aboutButton; // 關於我們按鈕
let rulesButton; // 遊戲規則按鈕
let closeModalButton; // 關閉視窗按鈕
let activeModal = null; // 目前開啟的視窗: 'rules', 'about', null
let displayedText = "";
let currentBaseText = "";
let ghosts = []; // 殘影陣列
let cursorEl; // 自訂游標 DOM 元素
let storyLines = [
  "Tom 誤闖入了神秘的『知識森林』...",
  "想要離開這裡，必須通過守護者們的考驗。",
  "聽說 Jerry、狗狗、壞蛋三人組和神秘女子都擋在路上。",
  "運用你的智慧，幫助 Tom 回家吧！"
];
let endingStoryLines = [
  "Tom 終於通過了所有的考驗！",
  "知識森林的守護者們露出了欣慰的笑容。",
  "「你已經證明了自己的智慧與勇氣。」",
  "傳送門緩緩打開，回家的路就在眼前...",
  "Tom 帶著滿滿的收穫，踏上了歸途。"
];
let jerryStoryLines = [
  "Jerry 看著你，露出了佩服的表情。",
  "「沒想到你這麼聰明！這條路就讓給你吧。」",
  "Jerry 轉身讓開了道路，前方出現了新的挑戰..."
];
let enemyStoryLines = [
  "壞蛋三人組面面相覷，似乎被你的智慧嚇到了。",
  "「可惡...這次就先放過你！」",
  "他們騎著車一溜煙地跑掉了。"
];
let dogStoryLines = [
  "狗狗開心地汪汪叫，搖著尾巴繞著你轉。",
  "「汪！(你真厲害！)」",
  "狗狗心滿意足地趴在一旁，目送你繼續前進。"
];
let currentActiveStoryLines = []; // 目前顯示的故事內容
let currentStoryIndex = 0;
let storyParticles = []; // 故事模式粒子
let storyNextButton; // 故事模式按鈕
const titleColors = ['#ffeda0', '#ffe19c', '#ffd597', '#ffc993', '#ffbd8e', '#ffb18a', '#ffa585', '#f67e7d', '#f0a6ca'];
let hasShownJerryStory = false;
let hasShownEnemyStory = false;
let hasShownDogStory = false;
let storyDisplayedText = ""; // 目前顯示的故事文字
let touchLeft = false; // 觸控左鍵狀態
let touchJump = false; // 觸控跳躍狀態
let touchAttack = false; // 觸控攻擊狀態

function preload() {
  // 載入背景圖片，路徑相對於 index.html
  bgImg = loadImage('background/0.png');
  // 載入角色圖片精靈 (站立與走路)
  tomStand = loadImage('Tom/stand/s.png');
  tomWalk = loadImage('Tom/walk/w.png');
  tomJump = loadImage('Tom/jump/j.png');
  tomAttack = loadImage('Tom/attack/a.png');
  tomClimb = loadImage('Tom/climb/c.png');
  jerryWalk = loadImage('jerry/walk/w.png');
  // jerryJump = loadImage('jerry/jump/j.png'); // 暫時註解掉，若檔案不存在會導致 404 錯誤
  enemiesRide = loadImage('enemies/ride/r.png'); // 載入 Enemies 圖片
  dogSprite = loadImage('Dog/d.png'); // 載入 Dog 圖片
  womanWalk = loadImage('woman/walk/w.png'); // 載入 Woman 走路圖片
  womanShock = loadImage('woman/shock/0.png'); // 載入 Woman 驚訝圖片
  womanFall = loadImage('woman/fall/f.png'); // 載入 Woman 跌倒圖片
  // 載入 CSV 題庫
  questionTable = loadTable('questions.csv', 'csv', 'header');
}

function setup() {
  // 建立全螢幕畫布
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('touch-action', 'none'); // 禁止手機瀏覽器的預設觸控行為 (如捲動)
  
  // 設定動畫速度 (每秒 10 幀，可依需求調整)
  frameRate(10);
  gravity = createVector(0, 0.2); // 初始化重力
  // 設定全域字型為圓體 (若系統支援)
  textFont("'Comic Sans MS', 'Chalkboard SE', 'Arial Rounded MT Bold', sans-serif");
  noCursor(); // 隱藏系統游標，改用自訂圖案
  document.body.style.cursor = 'none'; // 確保網頁游標隱藏

  // --- 建立自訂游標 DOM 元素 (為了覆蓋在按鈕之上) ---
  // 改用 div + background-image 實作精靈圖動畫
  cursorEl = createDiv('');
  cursorEl.position(0, 0);
  cursorEl.style('position', 'fixed'); // 確保固定在視窗
  cursorEl.style('pointer-events', 'none'); // 讓點擊穿透
  cursorEl.style('z-index', '99999'); // 最上層
  cursorEl.style('width', '24.75px'); // 99 / 4
  cursorEl.style('height', '24px');
  cursorEl.style('background-image', 'url("sm/str/s.png")');
  cursorEl.style('background-size', '99px 24px'); // 設定背景圖大小
  cursorEl.style('background-repeat', 'no-repeat');
  cursorEl.style('transform-origin', 'center'); // 縮放中心

  // --- 建立介面元件 ---
  
  // 1. 建立選擇題按鈕 (A, B, C)
  btnA = createButton('A');
  btnA.mousePressed(() => checkAnswer('A'));
  styleButton(btnA, '#FFB7B2', '#4a4a4a'); // 馬卡龍粉
  btnA.hide();

  btnB = createButton('B');
  btnB.mousePressed(() => checkAnswer('B'));
  styleButton(btnB, '#B5EAD7', '#4a4a4a'); // 馬卡龍綠
  btnB.hide();

  btnC = createButton('C');
  btnC.mousePressed(() => checkAnswer('C'));
  styleButton(btnC, '#C7CEEA', '#4a4a4a'); // 馬卡龍藍
  btnC.hide();

  // 3. 再作答一次按鈕
  retryButton = createButton('↺'); // 改為重試符號
  retryButton.mousePressed(retryQuestion);
  styleButton(retryButton, '#FFDAC1', '#4a4a4a'); // 馬卡龍橘
  retryButton.size(50, 50); // 設定為圓形大小
  retryButton.style('border-radius', '50%'); // 圓角 50%
  retryButton.style('width', '50px'); // 覆蓋 styleButton 的寬度
  retryButton.style('text-align', 'center'); // 文字置中
  retryButton.style('font-size', '24px'); // 加大文字
  retryButton.style('padding', '0'); // 重置內距
  
  // 加入旋轉動畫
  retryButton.style('transition', 'transform 0.5s ease, filter 0.2s');
  retryButton.mouseOver(() => {
    retryButton.style('transform', 'rotate(-360deg)');
  });
  retryButton.mouseOut(() => {
    retryButton.style('transform', 'rotate(0deg)');
  });
  retryButton.hide();

  // 4. 下一題按鈕
  nextButton = createButton('>'); // 改為箭頭符號
  nextButton.mousePressed(nextQuestion);
  styleButton(nextButton, '#E2F0CB', '#4a4a4a'); // 馬卡龍黃綠
  nextButton.size(50, 50); // 設定為圓形大小
  nextButton.style('border-radius', '50%'); // 圓角 50%
  nextButton.style('width', '50px'); // 覆蓋 styleButton 的寬度
  nextButton.style('text-align', 'center'); // 文字置中
  nextButton.style('font-size', '24px'); // 加大文字
  nextButton.style('padding', '0'); // 重置內距
  
  // 加入向右移動動畫
  nextButton.style('transition', 'transform 0.2s ease, filter 0.2s');
  nextButton.mouseOver(() => {
    nextButton.style('transform', 'translateX(5px)');
  });
  nextButton.mouseOut(() => {
    nextButton.style('transform', 'translateX(0px)');
  });
  nextButton.hide();

  // 5. 重新開始按鈕
  restartButton = createButton('重新開始遊戲');
  restartButton.mousePressed(restartGame);
  styleButton(restartButton, '#FFB7B2', '#4a4a4a'); // 馬卡龍粉
  restartButton.style('font-size', '28px'); // 加大字體
  restartButton.style('width', '320px'); // 加大寬度
  restartButton.style('padding', '10px'); // 加大內距
  restartButton.style('border', '4px solid white'); // 加上白邊
  restartButton.style('text-align', 'center'); // 文字置中
  restartButton.style('border-radius', '15px'); // 圓角
  restartButton.hide();

  // 6. 開始遊戲按鈕 (用於開頭畫面)
  startButton = createButton('開始遊戲');
  startButton.mousePressed(startGame);
  styleButton(startButton, '#C7CEEA', '#4a4a4a'); // 馬卡龍藍
  startButton.style('font-size', '28px'); // 加大字體
  startButton.style('width', '320px'); // 加大寬度
  startButton.style('padding', '10px'); // 加大內距
  startButton.style('border', '4px solid white'); // 加上白邊
  startButton.style('text-align', 'center'); // 文字置中
  startButton.style('border-radius', '15px'); // 圓角
  // 位置在 resizeUI 中設定

  // 7. 遊戲規則按鈕
  rulesButton = createButton('遊戲規則');
  rulesButton.mousePressed(showRules);
  styleButton(rulesButton, '#B5EAD7', '#4a4a4a'); // 馬卡龍綠
  rulesButton.position(width / 2 - 105, height / 2 + 100); // 下移以避開變大的開始按鈕

  // 8. 關於我們按鈕
  aboutButton = createButton('關於我們');
  aboutButton.mousePressed(showAbout);
  styleButton(aboutButton, '#FFDAC1', '#4a4a4a'); // 馬卡龍橘
  aboutButton.position(width / 2 - 105, height / 2 + 170); // 下移

  // 9. 關閉視窗按鈕 (用於彈出視窗)
  closeModalButton = createButton('關閉');
  closeModalButton.mousePressed(closeModal);
  styleButton(closeModalButton, '#FFB7B2', '#4a4a4a'); // 馬卡龍粉
  closeModalButton.hide();

  // 10. 故事模式按鈕
  storyNextButton = createButton(''); // 改為無文字，用形狀表達
  storyNextButton.mousePressed(advanceStory);
  styleButton(storyNextButton, '#FFB7B2', '#4a4a4a');
  storyNextButton.size(60, 60); // 設定大小
  storyNextButton.style('width', '60px'); // 覆蓋 styleButton 的寬度
  storyNextButton.style('border-radius', '0'); // 移除圓角
  storyNextButton.style('padding', '0'); // 重置內距
  storyNextButton.style('clip-path', 'polygon(20% 10%, 100% 50%, 20% 90%)'); // 設定為三角形 (向右)
  
  // 加入互動動畫
  storyNextButton.style('transition', 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.27), background-color 0.2s, opacity 0.4s'); // 加入彈出與淡入效果
  storyNextButton.mouseOver(() => {
    storyNextButton.style('transform', 'scale(1.1)');
    storyNextButton.style('background-color', '#ff9e99');
  });
  storyNextButton.mouseOut(() => {
    storyNextButton.style('transform', 'scale(1.0)');
    storyNextButton.style('background-color', '#FFB7B2');
  });
  storyNextButton.hide();

  resizeUI(); // 初始化 UI 大小與位置
}

// 輔助函式：設定按鈕樣式
function styleButton(btn, bgColor, txtColor = 'white') {
  btn.style('background-color', bgColor);
  btn.style('color', txtColor);
  btn.style('border', 'none');
  btn.style('border-radius', '5px');
  btn.style('padding', '6px 12px');
  btn.style('font-size', '14px');
  btn.style('cursor', 'pointer');
  // btn.style('width', '210px'); // 移除固定寬度，改由 resizeUI 或個別設定
  btn.style('text-align', 'left'); // 文字靠左
  btn.style('font-family', "'Comic Sans MS', 'Chalkboard SE', 'Arial Rounded MT Bold', sans-serif"); // 設定可愛字體

  // 滑鼠懸停時變色 (變暗一點以增加互動感)
  btn.mouseOver(() => btn.style('filter', 'brightness(0.9)'));
  btn.mouseOut(() => btn.style('filter', 'brightness(1.0)'));
}

function keyPressed() {
  // 偵測 Enter 鍵
  if (keyCode === ENTER) {
    if (quizState === "correct") {
      nextQuestion();
    } else if (quizState === "incorrect") {
      retryQuestion();
    }
  } else if (keyCode === RIGHT_ARROW) {
    // 故事模式下，按右鍵可跳過打字機或進入下一句
    if (gameState === "story" || gameState === "story_intermediate" || gameState === "story_end") {
      let fullText = currentActiveStoryLines[currentStoryIndex];
      if (storyDisplayedText.length < fullText.length) {
        storyDisplayedText = fullText; // 跳過打字機
      } else {
        advanceStory(); // 下一句
      }
    }
  }
}

// 全域滑鼠點擊事件
function mousePressed() {
  // 處理故事模式點擊：跳過打字機效果或進入下一句
  if ((gameState === "story" || gameState === "story_intermediate" || gameState === "story_end") && mouseButton === LEFT) {
    // 檢查是否點擊到 "下一頁" 按鈕範圍 (避免重複觸發)
    // 按鈕位置: width - 120, height - 100, 大小 60x60 (參考 drawStory)
    let btnX = width - 120;
    let btnY = height - 100;
    let btnSize = 60;
    let isOverButton = (mouseX > btnX && mouseX < btnX + btnSize && mouseY > btnY && mouseY < btnY + btnSize);

    if (!isOverButton) {
      let fullText = currentActiveStoryLines[currentStoryIndex];
      if (storyDisplayedText.length < fullText.length) {
        storyDisplayedText = fullText; // 直接顯示完整文字
      } else {
        advanceStory(); // 進入下一句
      }
    }
  }
}

// 檢查答案
function checkAnswer(selectedOption) {
  if (!currentQuestionRow) return;
  
  let userAnswer = selectedOption;
  let correctAnswer = currentQuestionRow.getString('answer');
  
  if (userAnswer === correctAnswer) {
    quizState = "correct";
    score += 10; // 答對加 10 分
    feedbackText = currentQuestionRow.getString('correct_feedback');
    tomHappyJumpEndTime = millis() + 1500; // 答對時跳躍 1.5 秒
    // 只有在跟 Jerry 互動時才計算答對題數 (用於解鎖移動)
    if (currentTarget === 'jerry') {
      answeredCount++;
    } else if (currentTarget === 'enemy') {
      enemyAnsweredCount++;
    } else if (currentTarget === 'dog') {
      dogAnsweredCount++;
    } else if (currentTarget === 'woman') {
      womanAnsweredCount++;
    }
  } else {
    quizState = "incorrect";
    score -= 5; // 答錯扣 5 分
    lives--; // 扣愛心
    if (lives <= 0) isGameOver = true; // 愛心歸零，遊戲結束
    feedbackText = currentQuestionRow.getString('incorrect_feedback');
  }
}

// 重試題目
function retryQuestion() {
  quizState = "asking";
  timeLeft = 15; // 重置計時器

  lastTimerUpdate = millis();
}

// 重新開始遊戲
function restartGame() {
  score = 0;
  lives = 3;
  isGameOver = false;
  isGameClear = false;
  timeLeft = 15;
  bgX = 0;
  jerryOffset = -100;
  enemyOffset = -800;
  dogOffset = -1600;
  womanOffset = -2400;
  answeredCount = 0;
  enemyAnsweredCount = 0;
  dogAnsweredCount = 0;
  womanAnsweredCount = 0;
  currentTarget = "";
  hasShownJerryStory = false;
  hasShownEnemyStory = false;
  hasShownDogStory = false;
  quizState = "asking";
  usedQuestionIndices = [];
  fireworks = [];
  confetti = [];
  rain = [];
  ghosts = []; // 清空殘影
  restartButton.hide();
  gameState = "playing"; // 確保狀態為遊戲中
}

// 開始遊戲
function startGame() {
  gameState = "story"; // 進入故事模式
  currentActiveStoryLines = storyLines;
  currentStoryIndex = 0;
  storyDisplayedText = ""; // 重置文字
  storyParticles = []; // 重置粒子
  startButton.hide();
  rulesButton.hide();
  aboutButton.hide();
  closeModalButton.hide();
  showStoryButton(); // 使用帶動畫的顯示函式
}

// 顯示遊戲規則
function showRules() {
  activeModal = 'rules';
}

// 顯示關於我們
function showAbout() {
  activeModal = 'about';
}

// 關閉視窗
function closeModal() {
  activeModal = null;
}

// 下一題
function nextQuestion() {
  // 檢查是否觸發劇情
  if (currentTarget === 'jerry' && answeredCount >= 2) {
    startIntermediateStory(jerryStoryLines);
    return;
  }
  if (currentTarget === 'enemy' && enemyAnsweredCount >= 2) {
    startIntermediateStory(enemyStoryLines);
    return;
  }
  if (currentTarget === 'dog' && dogAnsweredCount >= 2) {
    startIntermediateStory(dogStoryLines);
    return;
  }

  if (questionTable.getRowCount() > 0) {
    // 隨機選一題，但要排除已出過的題目
    let availableIndices = [];
    for (let i = 0; i < questionTable.getRowCount(); i++) {
      if (!usedQuestionIndices.includes(i)) {
        availableIndices.push(i);
      }
    }

    // 如果所有題目都出完了，就重置 (或視需求結束遊戲)
    if (availableIndices.length === 0) {
      usedQuestionIndices = []; // 重置
      availableIndices = Array.from(Array(questionTable.getRowCount()).keys());
    }

    let r = random(availableIndices);
    usedQuestionIndices.push(r); // 記錄這題已出過

    currentQuestionRow = questionTable.getRow(r);
    quizState = "asking";
    timeLeft = 15; // 重置計時器
    lastTimerUpdate = millis();
  }
}

function draw() {
  // 如果是開頭動畫狀態
  if (gameState === "intro") {
    drawIntro();
    drawCustomCursor(); // 繪製自訂游標
    return;
  }

  // 如果是開頭故事模式 (全螢幕)
  if (gameState === "story") {
    drawStory();
    drawCustomCursor();
    return;
  }

  // 如果遊戲通關，顯示通關畫面並停止
  if (isGameClear) {
    frameRate(30); // 提高幀率讓煙火更流暢
    colorMode(RGB);
    background(25, 25, 50, 50); // 深藍色半透明背景，讓煙火與彩帶更明顯
    
    if (random(1) < 0.1) { // 隨機產生新煙火
      fireworks.push(new Firework());
    }
    
    // 產生馬卡龍色彩帶
    if (frameCount % 3 === 0) {
      confetti.push(new Confetti());
    }
    
    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].show();
      if (fireworks[i].done()) {
        fireworks.splice(i, 1);
      }
    }
    
    // 更新並繪製彩帶
    for (let i = confetti.length - 1; i >= 0; i--) {
      confetti[i].update();
      confetti[i].show();
      if (confetti[i].done()) {
        confetti.splice(i, 1);
      }
    }

    fill(255);
    stroke(0); // 加入黑色邊框
    strokeWeight(5); // 設定邊框粗細
    textSize(60 + sin(frameCount * 0.1) * 5); // 文字縮放動畫
    textAlign(CENTER, CENTER);
    text("恭喜通關！", width / 2, height / 2);
    strokeWeight(3); // 分數的邊框稍微細一點
    textSize(40);
    text("最終分數: " + score, width / 2, height / 2 + 80);
    restartButton.position(width / 2 - restartButton.width / 2, height / 2 + 130);
    restartButton.show();
    drawCustomCursor(); // 繪製自訂游標
    return;
  }

  // 如果遊戲結束 (愛心歸零)
  if (isGameOver) {
    background(80, 90, 110); // 改為灰藍色背景，帶點憂鬱但柔和
    
    // 產生雨滴
    if (frameCount % 2 === 0) {
      rain.push(new RainDrop());
    }
    
    // 更新並繪製雨滴
    for (let i = rain.length - 1; i >= 0; i--) {
      rain[i].update();
      rain[i].show();
      if (rain[i].done()) {
        rain.splice(i, 1);
      }
    }

    // 繪製破碎的愛心圖案
    push();
    translate(width / 2, height / 2 - 120);
    fill('#FF6B6B'); // 柔和紅
    noStroke();
    beginShape();
    vertex(0, 0);
    bezierVertex(-20, -20, -40, -10, -40, 10);
    bezierVertex(-40, 30, -10, 50, 0, 70);
    bezierVertex(10, 50, 40, 30, 40, 10);
    bezierVertex(40, -10, 20, -20, 0, 0);
    endShape();
    // 裂痕
    stroke(255);
    strokeWeight(3);
    line(-5, 10, 5, 25);
    line(5, 25, -5, 40);
    pop();

    fill(255, 120, 120); // 柔和的粉紅色文字
    stroke(0); // 加入黑色邊框
    strokeWeight(5); // 設定邊框粗細
    textSize(60 + sin(frameCount * 0.1) * 5); // 文字輕微跳動
    textAlign(CENTER, CENTER);
    text("遊戲結束", width / 2, height / 2 - 40);
    fill(255);
    strokeWeight(3); // 分數與鼓勵文字的邊框稍微細一點
    textSize(40);
    text("最終分數: " + score, width / 2, height / 2 + 80);
    restartButton.position(width / 2 - restartButton.width / 2, height / 2 + 130);
    restartButton.show();
    // 隱藏介面元件
    btnA.hide();
    btnB.hide();
    btnC.hide();
    retryButton.hide();
    nextButton.hide();
    
    // 加入鼓勵文字
    textSize(28);
    text("別氣餒，下次會更好！", width / 2, height / 2 + 20);
    drawCustomCursor(); // 繪製自訂游標
    return;
  }

  // --- 動態計算縮放比例與地面位置 (響應式設計) ---
  let scaleFactor = max(1.5, min(4, height / 250)); // 根據高度動態調整縮放 (最小1.5倍, 最大4倍)
  let groundY = height * 0.65; // 地面位置固定在螢幕高度的 65% 處

  // 繪製背景，填滿整個視窗
  if (bgImg) {
    // 處理背景移動 (無限捲動)
    bgX = bgX % width;
    // 在左、中、右各畫一張背景，確保無縫銜接
    image(bgImg, bgX - width, 0, width, height);
    image(bgImg, bgX, 0, width, height);
    image(bgImg, bgX + width, 0, width, height);
  }

  // 顯示分數
  push();
  fill(255); // 改為白色文字
  stroke(0); // 加入黑色邊框
  strokeWeight(4); // 設定邊框粗細
  textSize(32);
  textAlign(LEFT, TOP);
  text("分數: " + score, 30, 30);
  text("愛心: " + "❤️".repeat(max(0, lives)), 30, 70); // 顯示愛心
  pop();

  // 顯示右上角倒數計時器 (馬卡龍色系)
  if (quizState === "asking") {
    push();
    let timerColor = '#E0BBE4'; // 馬卡龍紫
    // 倒數 5 秒內變色閃爍
    if (timeLeft <= 5) {
      // frameRate 為 10，所以 % 6 大約是每 0.3 秒切換一次，產生急促閃爍感
      if (frameCount % 6 < 3) timerColor = '#FFB7B2'; // 馬卡龍粉紅 (警告色)
    }
    fill(timerColor);
    stroke('#ffffff');
    strokeWeight(2);
    rect(width - 100, 20, 80, 80, 20); // 圓角方框
    fill('#4a4a4a');
    textSize(32);
    textAlign(CENTER, CENTER);
    text(timeLeft, width - 60, 55);
    textSize(14);
    text("秒", width - 60, 80);
    pop();
  }

  // --- 自動離開邏輯 ---
  if (gameState === "playing") {
    // 如果 Jerry 答對兩題，自動往右移動離開
    if (answeredCount >= 2) {
      jerryOffset += 3;
    }
    // 如果 Enemies 答對兩題，自動往右移動離開
    if (enemyAnsweredCount >= 2) {
      enemyOffset += 3;
    }
    // 如果 Dog 答對兩題，自動往右移動離開
    if (dogAnsweredCount >= 2) {
      dogOffset += 3;
    }
    // 如果 Woman 答對兩題，自動往右移動離開
    if (womanAnsweredCount >= 2) {
      womanOffset += 3;
    }
  }

  // 計算 Jerry 在畫面上的實際位置
  let jerryScreenX = width / 2 + jerryOffset;

  // 計算 Enemies 在畫面上的實際位置
  let enemyScreenX = width / 2 + enemyOffset;

  // 計算 Dog 在畫面上的實際位置
  let dogScreenX = width / 2 + dogOffset;

  // 計算 Woman 在畫面上的實際位置
  let womanScreenX = width / 2 + womanOffset;

  // 繪製 Woman 動畫
  if (womanWalk) {
    let currentWomanImg = womanWalk;
    let wTotalFrames = 6;
    
    // 根據答題狀態切換圖片
    if (currentTarget === 'woman') {
      if (quizState === "incorrect" && womanShock) {
        currentWomanImg = womanShock;
        wTotalFrames = 1;
      } else if (quizState === "correct" && womanFall) {
        currentWomanImg = womanFall;
        wTotalFrames = 4;
      }
    }

    let wW = currentWomanImg.width / wTotalFrames;
    let wH = currentWomanImg.height;
    let wCurrentFrame = frameCount % wTotalFrames;
    let wSx = wCurrentFrame * wW;
    image(currentWomanImg, womanScreenX, groundY - wH * scaleFactor, wW * scaleFactor, wH * scaleFactor, wSx, 0, wW, wH);
  }

  // 繪製 Dog 動畫 (295*36, 4張圖)
  if (dogSprite) {
    let dTotalFrames = 4;
    let dW = dogSprite.width / dTotalFrames;
    let dH = dogSprite.height;
    let dCurrentFrame = frameCount % dTotalFrames;
    let dSx = dCurrentFrame * dW;
    push();
    translate(dogScreenX + (dW * scaleFactor) / 2, groundY - (dH * scaleFactor) / 2);
    scale(-1, 1);
    image(dogSprite, -(dW * scaleFactor) / 2, -(dH * scaleFactor) / 2, dW * scaleFactor, dH * scaleFactor, dSx, 0, dW, dH);
    pop();
  }

  // 繪製 Enemies 動畫 (180*29, 5張圖)
  if (enemiesRide) {
    let eTotalFrames = 5;
    let eW = enemiesRide.width / eTotalFrames; // 36
    let eH = enemiesRide.height; // 29
    let eCurrentFrame = frameCount % eTotalFrames;
    let eSx = eCurrentFrame * eW;
    image(enemiesRide, enemyScreenX, groundY - eH * scaleFactor, eW * scaleFactor, eH * scaleFactor, eSx, 0, eW, eH);
  }

  // 決定 Jerry 要顯示的圖片 (答對時顯示 Jump，其他時候顯示 Walk)
  let currentJerryImg = jerryWalk;
  let jTotalFrames = 8;
  
  if (quizState === "correct" && jerryJump) {
    currentJerryImg = jerryJump;
    // jerryJump 寬度為 187，有 8 張圖
    // jerryWalk 寬度為 155，有 8 張圖
    // 程式會自動計算單張寬度
  }

  // 繪製 Jerry 動畫
  if (currentJerryImg) {
    let jW = currentJerryImg.width / jTotalFrames; 
    let jH = currentJerryImg.height; 
    let jCurrentFrame = frameCount % jTotalFrames;
    let jSx = jCurrentFrame * jW;
    image(currentJerryImg, jerryScreenX, groundY - jH * scaleFactor, jW * scaleFactor, jH * scaleFactor, jSx, 0, jW, jH);
  }

  let currentImg;
  let totalFrames;
  let isFlipped = false;
  let isMoving = false;

  // 計算與各角色的距離
  let distToJerry = dist(width / 2, height / 2, jerryScreenX, height / 2);
  let distToEnemy = dist(width / 2, height / 2, enemyScreenX, height / 2);
  let distToDog = dist(width / 2, height / 2, dogScreenX, height / 2);
  let distToWoman = dist(width / 2, height / 2, womanScreenX, height / 2);

  // 定義 1 公分約為 40 像素
  let oneCm = 40;

  // 計算各角色的觸發距離 (Tom半寬 + 角色半寬 + 2公分)
  let tomHalfW = (tomStand.width / 2 * scaleFactor) / 2;
  
  let jerryThreshold = tomHalfW + (jerryWalk.width / 8 * scaleFactor) / 2 + 2 * oneCm;
  let enemyThreshold = tomHalfW + (enemiesRide.width / 5 * scaleFactor) / 2 + 2 * oneCm;
  let dogThreshold = tomHalfW + (dogSprite.width / 4 * scaleFactor) / 2 + 2 * oneCm;
  let womanThreshold = tomHalfW + (womanWalk.width / 6 * scaleFactor) / 2 + 2 * oneCm;

  // 判斷是否被鎖定 (距離夠近且尚未答對兩題，對所有角色生效)
  let isLocked = (distToJerry < jerryThreshold && answeredCount < 2) ||
                 (distToEnemy < enemyThreshold && enemyAnsweredCount < 2) ||
                 (distToDog < dogThreshold && dogAnsweredCount < 2) ||
                 (distToWoman < womanThreshold && womanAnsweredCount < 2);

  // 1. 優先處理移動邏輯 (如果未被鎖定)
  if (gameState === "playing" && !isLocked) {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(32) || touchLeft) { // 加入觸控左鍵
      let currentSpeed = moveSpeed;
      if (keyIsDown(32) || touchAttack) { // 空白鍵或觸控攻擊鍵加速
        currentSpeed = moveSpeed * 2; // 攻擊時衝刺 (2倍速)
      } else if (keyIsDown(UP_ARROW)) {
        currentSpeed = moveSpeed * 1.5; // 按下向左及向上鍵時，背景加快0.5倍移動速度
      }
      bgX += currentSpeed; // 背景向右移
      jerryOffset += currentSpeed; // Jerry 相對位置右移
      enemyOffset += currentSpeed; // Enemies 相對位置右移
      dogOffset += currentSpeed; // Dog 相對位置右移
      womanOffset += currentSpeed; // Woman 相對位置右移
      
      // 更新殘影位置 (隨背景移動，產生留在原地的效果)
      for (let g of ghosts) {
        g.x -= currentSpeed;
      }
      isMoving = true;
      isFlipped = true; // 預設向左翻轉
    }
  } else {
    // 如果被鎖定且嘗試移動，顯示禁止通行提示
    if (gameState === "playing" && (keyIsDown(LEFT_ARROW) || keyIsDown(32) || touchLeft)) {
      push();
      translate(width / 2, groundY - 200); // 顯示在 Tom 頭頂上方 (相對於地面)
      
      // 畫一個禁止標誌 (紅圓圈 + 白橫槓)
      fill(255, 0, 0);
      noStroke();
      ellipse(0, 0, 40, 40);
      fill(255);
      rectMode(CENTER);
      rect(0, 0, 30, 6);
      
      // 顯示文字
      fill(255, 0, 0);
      stroke(255);
      strokeWeight(3);
      textSize(20);
      textAlign(CENTER, TOP);
      text("禁止通行!\n請先回答問題", 0, 25);
      pop();
    }
  }

  // 2. 處理動畫狀態與特殊翻轉
  if (millis() < tomHappyJumpEndTime) { // 答對時的開心跳躍
    currentImg = tomJump;
    totalFrames = 7;
    isFlipped = !isFlipped; // 跳躍時圖片左右相反
  } else if (keyIsDown(32) || touchAttack) { // 按下空白鍵 (Space) 或觸控攻擊
    currentImg = tomAttack;
    totalFrames = 7;
    isFlipped = true; // 攻擊時圖片左右相反
  } else if (keyIsDown(UP_ARROW) || touchJump) { // 向上鍵或觸控跳躍
    currentImg = tomJump;
    totalFrames = 7;
    isFlipped = true; // 跳躍時圖片左右相反
  } else if (keyIsDown(DOWN_ARROW)) { // 向下鍵 - 攀爬
    currentImg = tomClimb;
    totalFrames = 3;
    // 攀爬時的特殊翻轉邏輯 (覆蓋上面的預設值)
    if (keyIsDown(LEFT_ARROW)) {
      isFlipped = false; // 向下+向左：圖片維持原狀
    }
  } else if (isMoving) { // 左右移動 - 走路
    currentImg = tomWalk;
    totalFrames = 8;
  } else {
    currentImg = tomStand;
    totalFrames = 2; // 站立圖檔有 2 張圖
  }

  // 根據目前的圖片，動態計算單一畫格的寬度 (總寬度 / 畫格數)
  // 這樣可以自動適應 47*40 或 227*39 的圖檔
  let spriteW = currentImg.width / totalFrames;
  let spriteH = currentImg.height;

  // 計算目前要顯示第幾張圖
  let currentFrame = frameCount % totalFrames;
  let sx = currentFrame * spriteW;
  
  // --- 殘影特效邏輯 ---
  // 當按下空白鍵衝刺且未被鎖定時，產生殘影
  if (gameState === "playing" && (keyIsDown(32) || touchAttack) && !isLocked && frameCount % 3 === 0) {
    ghosts.push({
      img: currentImg,
      sx: sx,
      spriteW: spriteW,
      spriteH: spriteH,
      x: width / 2,
      y: groundY,
      flipped: isFlipped,
      alpha: 150,
      scaleFactor: scaleFactor
    });
  }

  // 繪製並更新殘影
  for (let i = ghosts.length - 1; i >= 0; i--) {
    let g = ghosts[i];
    g.alpha -= 25; // 淡出速度
    if (g.alpha <= 0) {
      ghosts.splice(i, 1);
      continue;
    }
    push();
    translate(g.x, g.y);
    if (g.flipped) {
      scale(-1, 1);
    }
    tint(255, g.alpha); // 設定透明度
    image(g.img, -(g.spriteW * g.scaleFactor) / 2, -(g.spriteH * g.scaleFactor), g.spriteW * g.scaleFactor, g.spriteH * g.scaleFactor, g.sx, 0, g.spriteW, g.spriteH);
    pop();
  }

  // 在畫布正中間繪製角色
  push();
  translate(width / 2, groundY); // 將原點移到地面
  if (isFlipped) {
    scale(-1, 1); // 水平翻轉
  }
  // 繪製圖片，基準點為圖片底部中心 (確保腳踩在地面)
  image(currentImg, -(spriteW * scaleFactor) / 2, -(spriteH * scaleFactor), spriteW * scaleFactor, spriteH * scaleFactor, sx, 0, spriteW, spriteH);
  pop();

  // --- 繪製觸控按鈕 (僅在遊戲進行中且螢幕較小或偵測到觸控時顯示) ---
  // 為了確保任何裝置都能玩，我們在寬度小於 1024px 時顯示，或當 touches 陣列有東西時
  if (gameState === "playing" && (width < 1024 || touches.length > 0)) {
    touchLeft = false;
    touchJump = false;
    touchAttack = false;

    let btnSize = 80;
    let margin = 30;
    
    // 左下角：移動 (GO)
    let leftBtnX = margin + btnSize/2;
    let leftBtnY = height - margin - btnSize/2;
    
    // 右下角：跳躍 (UP)
    let jumpBtnX = width - margin - btnSize/2;
    let jumpBtnY = height - margin - btnSize/2;

    // 右下角偏左：攻擊/加速 (ATK)
    let atkBtnX = jumpBtnX - btnSize - 20;
    let atkBtnY = jumpBtnY + 20; // 稍微低一點
    let atkBtnSize = 60;

    // 偵測觸控
    for (let t of touches) {
      if (dist(t.x, t.y, leftBtnX, leftBtnY) < btnSize) touchLeft = true;
      if (dist(t.x, t.y, jumpBtnX, jumpBtnY) < btnSize) touchJump = true;
      if (dist(t.x, t.y, atkBtnX, atkBtnY) < atkBtnSize) touchAttack = true;
    }

    push();
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    
    // 繪製移動鈕
    fill(touchLeft ? '#ff9e99' : '#FFB7B2CC'); // 按下變色
    circle(leftBtnX, leftBtnY, btnSize);
    fill(255); text("GO", leftBtnX, leftBtnY);

    // 繪製跳躍鈕
    fill(touchJump ? '#B5EAD7' : '#B5EAD7CC');
    circle(jumpBtnX, jumpBtnY, btnSize);
    fill('#4a4a4a'); text("UP", jumpBtnX, jumpBtnY);

    // 繪製攻擊鈕
    fill(touchAttack ? '#FFDAC1' : '#FFDAC1CC');
    circle(atkBtnX, atkBtnY, atkBtnSize);
    fill('#4a4a4a'); textSize(16); text("ATK", atkBtnX, atkBtnY);
    pop();
  }

  // --- 對話框邏輯 ---
  if (gameState === "playing") {
  // 判斷 Tom (畫面中心) 與 Jerry (jerryScreenX) 的距離
  if (distToJerry < jerryThreshold && !hasShownJerryStory) {
    bubbleAnim = lerp(bubbleAnim, 1, 0.2); // 動畫：平滑放大至 1
    currentTarget = 'jerry';
    
    // 如果還沒有題目，先選一題
    if (!currentQuestionRow && questionTable.getRowCount() > 0) {
      nextQuestion();
    }

    if (currentQuestionRow) {
      let newBaseText = "";
      let questionText = currentQuestionRow.getString('question');
      let optA = currentQuestionRow.getString('optionA');
      let optB = currentQuestionRow.getString('optionB');
      let optC = currentQuestionRow.getString('optionC');

      // 根據狀態決定顯示內容與按鈕
      if (quizState === "asking") {
        // 更新計時器
        updateTimer();
        
        newBaseText = "你好! 我是Jerry\n" + questionText;
        
        // 計算對話框位置 (Jerry 頭頂)
        let bubbleX = jerryScreenX;
        let bubbleY = groundY - 22 * scaleFactor - 20;
        let bubbleW = 250; // 調整寬度
        let bubbleH = 200; // 調整高度

        // 更新按鈕文字與位置
        btnA.html("A: " + optA);
        btnB.html("B: " + optB);
        btnC.html("C: " + optC);
        btnA.position(bubbleX - btnA.width/2, bubbleY - 100);
        btnB.position(bubbleX - btnB.width/2, bubbleY - 65);
        btnC.position(bubbleX - btnC.width/2, bubbleY - 30);
        
        // 按鈕彈出動畫
        let btnScale = `scale(${bubbleAnim})`;
        btnA.style('transform', btnScale);
        btnB.style('transform', btnScale);
        btnC.style('transform', btnScale);

        btnA.show();
        btnB.show();
        btnC.show();
        retryButton.hide();
        nextButton.hide();

      } else if (quizState === "correct") {
        newBaseText = feedbackText;
        
        if (answeredCount < 2) {
          // 顯示下一題按鈕
          // 放在對話框內右下角 (對話框寬250, 高200)
          nextButton.position(jerryScreenX + 125 - 60, (groundY - 22 * scaleFactor - 20) - 60);
          nextButton.show();
        } else {
          startIntermediateStory(jerryStoryLines);
        }
        
        btnA.hide();
        btnB.hide();
        btnC.hide();
        retryButton.hide();

      } else if (quizState === "incorrect") {
        newBaseText = feedbackText;
        
        // 顯示再作答一次按鈕
        retryButton.position(jerryScreenX - 25, height / 2 - 60);
        retryButton.show();
        
        btnA.hide();
        btnB.hide();
        btnC.hide();
        nextButton.hide();
      }

      // 打字機效果邏輯
      if (newBaseText !== currentBaseText) {
        currentBaseText = newBaseText;
        displayedText = "";
      }
      if (displayedText.length < currentBaseText.length) {
        displayedText += currentBaseText.substring(displayedText.length, displayedText.length + 3);
      }
      
      let dialogueText = displayedText;

      // 繪製 Jerry 的對話框
      // 使用較大的尺寸，並確保文字換行
      drawSpeechBubble(jerryScreenX, groundY - 22 * scaleFactor - 20, 250, 200, dialogueText, '#FFDAC1', '#FF9AA2');
      
    }
  } else if (distToEnemy < enemyThreshold && !hasShownEnemyStory) {
    // --- Enemies 互動邏輯 ---
    bubbleAnim = lerp(bubbleAnim, 1, 0.2); // 動畫：平滑放大至 1
    if (currentTarget !== 'enemy') {
      currentTarget = 'enemy';
      nextQuestion(); // 切換到 Enemies 時，直接抽新題目
    }

    if (currentQuestionRow) {
      let newBaseText = "";
      let questionText = currentQuestionRow.getString('question');
      let optA = currentQuestionRow.getString('optionA');
      let optB = currentQuestionRow.getString('optionB');
      let optC = currentQuestionRow.getString('optionC');

      if (quizState === "asking") {
        // 更新計時器
        updateTimer();

        newBaseText = "嘿！回答這個問題：\n" + questionText;
        
        let bubbleX = enemyScreenX;
        let bubbleY = groundY - 29 * scaleFactor - 20;

        btnA.html("A: " + optA);
        btnB.html("B: " + optB);
        btnC.html("C: " + optC);
        btnA.position(bubbleX - btnA.width/2, bubbleY - 100);
        btnB.position(bubbleX - btnB.width/2, bubbleY - 65);
        btnC.position(bubbleX - btnC.width/2, bubbleY - 30);
        
        let btnScale = `scale(${bubbleAnim})`;
        btnA.style('transform', btnScale);
        btnB.style('transform', btnScale);
        btnC.style('transform', btnScale);

        btnA.show();
        btnB.show();
        btnC.show();
        retryButton.hide();
        nextButton.hide();

      } else if (quizState === "correct") {
        newBaseText = "答對了！";
        
        if (enemyAnsweredCount < 2) {
          // 顯示下一題按鈕 (在 Enemies 文字框上方)
          // 放在對話框內右下角
          nextButton.position(enemyScreenX + 125 - 60, (groundY - 29 * scaleFactor - 20) - 60);
          nextButton.show();
        } else {
          startIntermediateStory(enemyStoryLines);
        }
        
        btnA.hide();
        btnB.hide();
        btnC.hide();
        retryButton.hide();

      } else if (quizState === "incorrect") {
        newBaseText = "錯了！再試一次！";
        
        // 顯示再作答一次按鈕 (在 Enemies 文字框上方)
        retryButton.position(enemyScreenX - 25, height / 2 - 60);
        retryButton.show();
        
        btnA.hide();
        btnB.hide();
        btnC.hide();
        nextButton.hide();
      }

      if (newBaseText !== currentBaseText) {
        currentBaseText = newBaseText;
        displayedText = "";
      }
      if (displayedText.length < currentBaseText.length) {
        displayedText += currentBaseText.substring(displayedText.length, displayedText.length + 3);
      }
      
      let dialogueText = displayedText;

      // 繪製 Enemies 的對話框
      drawSpeechBubble(enemyScreenX, groundY - 29 * scaleFactor - 20, 250, 200, dialogueText, '#E0BBE4', '#B39EB5');
    }
  } else if (distToDog < dogThreshold && !hasShownDogStory) {
    // --- Dog 互動邏輯 ---
    bubbleAnim = lerp(bubbleAnim, 1, 0.2); // 動畫：平滑放大至 1
    if (currentTarget !== 'dog') {
      currentTarget = 'dog';
      nextQuestion(); // 切換到 Dog 時，直接抽新題目
    }

    if (currentQuestionRow) {
      let newBaseText = "";
      let questionText = currentQuestionRow.getString('question');
      let optA = currentQuestionRow.getString('optionA');
      let optB = currentQuestionRow.getString('optionB');
      let optC = currentQuestionRow.getString('optionC');

      if (quizState === "asking") {
        // 更新計時器
        updateTimer();

        newBaseText = "汪！回答這個問題：\n" + questionText;
        
        let bubbleX = dogScreenX;
        let bubbleY = groundY - 36 * scaleFactor - 20;

        btnA.html("A: " + optA);
        btnB.html("B: " + optB);
        btnC.html("C: " + optC);
        btnA.position(bubbleX - btnA.width/2, bubbleY - 100);
        btnB.position(bubbleX - btnB.width/2, bubbleY - 65);
        btnC.position(bubbleX - btnC.width/2, bubbleY - 30);
        
        let btnScale = `scale(${bubbleAnim})`;
        btnA.style('transform', btnScale);
        btnB.style('transform', btnScale);
        btnC.style('transform', btnScale);

        btnA.show();
        btnB.show();
        btnC.show();
        retryButton.hide();
        nextButton.hide();

      } else if (quizState === "correct") {
        newBaseText = "答對了！汪！";
        
        if (dogAnsweredCount < 2) {
          // 顯示下一題按鈕 (在 Dog 文字框上方)
          // 放在對話框內右下角
          nextButton.position(dogScreenX + 125 - 60, (groundY - 36 * scaleFactor - 20) - 60);
          nextButton.show();
        } else {
          startIntermediateStory(dogStoryLines);
        }
        
        btnA.hide();
        btnB.hide();
        btnC.hide();
        retryButton.hide();

      } else if (quizState === "incorrect") {
        newBaseText = "錯了！汪！";
        
        // 顯示再作答一次按鈕 (在 Dog 文字框上方)
        retryButton.position(dogScreenX - 25, height / 2 - 60);
        retryButton.show();
        
        btnA.hide();
        btnB.hide();
        btnC.hide();
        nextButton.hide();
      }

      if (newBaseText !== currentBaseText) {
        currentBaseText = newBaseText;
        displayedText = "";
      }
      if (displayedText.length < currentBaseText.length) {
        displayedText += currentBaseText.substring(displayedText.length, displayedText.length + 3);
      }
      
      let dialogueText = displayedText;

      // 繪製 Dog 的對話框
      drawSpeechBubble(dogScreenX, groundY - 36 * scaleFactor - 20, 250, 200, dialogueText, '#B5EAD7', '#88D8B0');
    }
  } else if (distToWoman < womanThreshold) {
    // --- Woman 互動邏輯 ---
    bubbleAnim = lerp(bubbleAnim, 1, 0.2); // 動畫：平滑放大至 1
    if (currentTarget !== 'woman') {
      currentTarget = 'woman';
      nextQuestion(); // 切換到 Woman 時，直接抽新題目
    }

    if (currentQuestionRow) {
      let newBaseText = "";
      let questionText = currentQuestionRow.getString('question');
      let optA = currentQuestionRow.getString('optionA');
      let optB = currentQuestionRow.getString('optionB');
      let optC = currentQuestionRow.getString('optionC');

      if (quizState === "asking") {
        // 更新計時器
        updateTimer();

        newBaseText = "回答這個問題：\n" + questionText;
        
        let bubbleX = womanScreenX;
        let bubbleY = groundY - 90 * scaleFactor - 20;

        btnA.html("A: " + optA);
        btnB.html("B: " + optB);
        btnC.html("C: " + optC);
        btnA.position(bubbleX - btnA.width/2, bubbleY - 100);
        btnB.position(bubbleX - btnB.width/2, bubbleY - 65);
        btnC.position(bubbleX - btnC.width/2, bubbleY - 30);
        
        let btnScale = `scale(${bubbleAnim})`;
        btnA.style('transform', btnScale);
        btnB.style('transform', btnScale);
        btnC.style('transform', btnScale);

        btnA.show();
        btnB.show();
        btnC.show();
        retryButton.hide();
        nextButton.hide();

      } else if (quizState === "correct") {
        newBaseText = "答對了！";
        
        if (womanAnsweredCount < 2) {
          // 顯示下一題按鈕 (在 Woman 文字框上方)
          // 放在對話框內右下角
          nextButton.position(womanScreenX + 125 - 60, (groundY - 90 * scaleFactor - 20) - 60);
          nextButton.show();
        } else {
          // 通關邏輯
          startEndingStory();
        }
        
        btnA.hide();
        btnB.hide();
        btnC.hide();
        retryButton.hide();

      } else if (quizState === "incorrect") {
        newBaseText = "錯了！";
        
        // 顯示再作答一次按鈕 (在 Woman 文字框上方)
        retryButton.position(womanScreenX - 25, height / 2 - 60);
        retryButton.show();
        
        btnA.hide();
        btnB.hide();
        btnC.hide();
        nextButton.hide();
      }

      if (newBaseText !== currentBaseText) {
        currentBaseText = newBaseText;
        displayedText = "";
      }
      if (displayedText.length < currentBaseText.length) {
        displayedText += currentBaseText.substring(displayedText.length, displayedText.length + 3);
      }
      
      let dialogueText = displayedText;

      // 繪製 Woman 的對話框
      drawSpeechBubble(womanScreenX, groundY - 90 * scaleFactor - 20, 250, 200, dialogueText, '#FFB7B2', '#FF6F61');
    }
  } else {
    // 距離太遠時隱藏介面
    bubbleAnim = 0; // 重置動畫
    currentTarget = "";
    currentBaseText = ""; // 重置打字機
    displayedText = "";
    btnA.hide();
    btnB.hide();
    btnC.hide();
    retryButton.hide();
    nextButton.hide();
  }
  } // End of gameState === "playing" check

  // 繪製故事疊加層 (中途或結尾)
  if (gameState === "story_intermediate" || gameState === "story_end") {
    drawStory();
  }

  drawCustomCursor(); // 繪製自訂游標
}

// 自訂函式：開始結尾故事
function startEndingStory() {
  gameState = "story_end";
  currentActiveStoryLines = endingStoryLines;
  currentStoryIndex = 0;
  storyDisplayedText = ""; // 重置文字
  storyParticles = [];
  showStoryButton(); // 使用帶動畫的顯示函式
  
  // 隱藏遊戲介面
  btnA.hide();
  btnB.hide();
  btnC.hide();
  retryButton.hide();
  nextButton.hide();
}

// 自訂函式：開始中途故事
function startIntermediateStory(lines) {
  gameState = "story_intermediate";
  currentActiveStoryLines = lines;
  currentStoryIndex = 0;
  storyDisplayedText = ""; // 重置文字
  storyParticles = [];
  showStoryButton(); // 使用帶動畫的顯示函式
  
  // 隱藏遊戲介面
  btnA.hide();
  btnB.hide();
  btnC.hide();
  retryButton.hide();
  nextButton.hide();
}

// 自訂函式：推進故事
function advanceStory() {
  currentStoryIndex++;
  storyDisplayedText = ""; // 重置文字
  let lines = currentActiveStoryLines;
  
  if (currentStoryIndex >= lines.length) {
    if (gameState === "story") {
      gameState = "playing";
    } else if (gameState === "story_intermediate") {
      gameState = "playing";
      if (currentTarget === 'jerry') hasShownJerryStory = true;
      if (currentTarget === 'enemy') hasShownEnemyStory = true;
      if (currentTarget === 'dog') hasShownDogStory = true;
    } else {
      isGameClear = true; // 觸發通關畫面
      gameState = "playing"; // 交還給 draw 的 isGameClear 判斷
    }
    storyNextButton.hide();
  }
}

// 自訂函式：顯示故事按鈕 (帶動畫)
function showStoryButton() {
  storyNextButton.show();
  storyNextButton.style('opacity', '0');
  storyNextButton.style('transform', 'scale(0)');
  setTimeout(() => {
    storyNextButton.style('opacity', '1');
    storyNextButton.style('transform', 'scale(1)');
  }, 50);
}

// 自訂函式：繪製故事畫面
function drawStory() {
  // 根據狀態決定背景
  if (gameState === "story") {
    background('#FFF0F5'); // Lavender Blush 背景 (開頭故事維持全螢幕背景)
    
    // 繪製 Tom (放大顯示) - 只在開頭故事顯示
    if (tomStand) {
      let scaleFactor = 4;
      let spriteW = tomStand.width / 2; // 站立圖有 2 格
      let spriteH = tomStand.height;
      // 畫第一格動作
      image(tomStand, width / 2 - (spriteW * scaleFactor) / 2, height / 2 - 200, spriteW * scaleFactor, spriteH * scaleFactor, 0, 0, spriteW, spriteH);
    }
  } else {
    // 中途或結尾故事，使用半透明遮罩，讓玩家能看到背後的遊戲畫面
    let overlayColor = color(0, 100); // 預設黑色半透明

    if (gameState === "story_intermediate") {
      if (currentTarget === 'jerry') {
        overlayColor = color(255, 218, 193, 180); // Jerry: 馬卡龍橘 (#FFDAC1)
      } else if (currentTarget === 'enemy') {
        overlayColor = color(224, 187, 228, 180); // Enemy: 馬卡龍紫 (#E0BBE4)
      } else if (currentTarget === 'dog') {
        overlayColor = color(181, 234, 215, 180); // Dog: 馬卡龍綠 (#B5EAD7)
      }
    } else if (gameState === "story_end") {
      overlayColor = color(255, 183, 178, 180); // End: 馬卡龍粉 (#FFB7B2)
    }
    
    fill(overlayColor);
    rect(0, 0, width, height);
  }

  // 繪製漂浮粒子特效
  if (storyParticles.length < 30) {
    storyParticles.push(new StoryParticle());
  }
  for (let i = storyParticles.length - 1; i >= 0; i--) {
    storyParticles[i].update();
    storyParticles[i].show();
  }

  // 繪製對話框 (改為下方顯示)
  let boxH = 200;
  let boxW = width - 100; // 寬度佔滿大部分螢幕
  let boxX = 50;
  let boxY = height - boxH - 20; // 距離底部 20px

  // 設定對話框顏色
  let boxBgColor = color(255, 255, 255, 230); // 預設白色半透明
  let boxStrokeColor = color('#FFB7B2');

  if (gameState === "story_intermediate") {
    if (currentTarget === 'jerry') {
      boxBgColor = color(255, 218, 193, 230); // Jerry: 馬卡龍橘 (#FFDAC1)
      boxStrokeColor = color('#FF9AA2');
    } else if (currentTarget === 'enemy') {
      boxBgColor = color(224, 187, 228, 230); // Enemy: 馬卡龍紫 (#E0BBE4)
      boxStrokeColor = color('#B39EB5');
    } else if (currentTarget === 'dog') {
      boxBgColor = color(181, 234, 215, 230); // Dog: 馬卡龍綠 (#B5EAD7)
      boxStrokeColor = color('#88D8B0');
    }
  } else if (gameState === "story_end") {
    boxBgColor = color(255, 183, 178, 230); // End: 馬卡龍粉 (#FFB7B2)
    boxStrokeColor = color('#FF6F61');
  }

  push();
  fill(boxBgColor);
  stroke(boxStrokeColor);
  strokeWeight(4);
  rect(boxX, boxY, boxW, boxH, 20);

  // --- 頭像邏輯 ---
  let avatarImg = null;
  let totalFrames = 1;
  
  if (gameState === "story" || gameState === "story_end") {
     avatarImg = tomStand;
     totalFrames = 2;
  } else if (gameState === "story_intermediate") {
     if (currentTarget === 'jerry') { avatarImg = jerryWalk; totalFrames = 8; }
     else if (currentTarget === 'enemy') { avatarImg = enemiesRide; totalFrames = 5; }
     else if (currentTarget === 'dog') { avatarImg = dogSprite; totalFrames = 4; }
  }

  let textOffsetX = 40;
  
  if (avatarImg) {
      let spriteW = avatarImg.width / totalFrames;
      let spriteH = avatarImg.height;
      
      // 頭像框設定
      let avatarSize = 140;
      let avatarX = boxX + 30;
      let avatarY = boxY + 30;
      
      // 繪製頭像背景
      noStroke();
      fill('#FFF0F5'); 
      circle(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize);
      
      // 計算縮放比例以適應圓框
      let scale = min(avatarSize / spriteW, avatarSize / spriteH) * 0.8;
      let drawW = spriteW * scale;
      let drawH = spriteH * scale;
      
      // 動畫影格
      let currentFrame = frameCount % totalFrames;
      let sx = currentFrame * spriteW;

      // 繪製頭像
      image(avatarImg, 
            avatarX + avatarSize/2 - drawW/2, 
            avatarY + avatarSize/2 - drawH/2, 
            drawW, drawH, 
            sx, 0, spriteW, spriteH);
            
      textOffsetX = 30 + avatarSize + 30; // 調整文字起始位置
  }
  
  // --- 打字機效果邏輯 ---
  let fullText = currentActiveStoryLines[currentStoryIndex];
  if (storyDisplayedText.length < fullText.length) {
      storyDisplayedText += fullText.charAt(storyDisplayedText.length);
  }

  fill('#4a4a4a');
  noStroke();
  textSize(28);
  textAlign(LEFT, TOP); // 改為靠左對齊
  text(storyDisplayedText, boxX + textOffsetX, boxY + 40, boxW - textOffsetX - 40, boxH - 80);
  pop();

  // 更新按鈕位置
  storyNextButton.position(width - 120, height - 100); // 調整位置至對話框右側
}

// 自訂函式：繪製開頭動畫
function drawIntro() {
  // 1. 繪製自動捲動的背景
  if (bgImg) {
    bgX -= 2; // 背景向左移動
    if (bgX <= -width) bgX = 0;
    image(bgImg, bgX, 0, width, height);
    image(bgImg, bgX + width, 0, width, height);
  }

  // 2. 繪製可愛背景特效與遮罩
  push();
  noStroke();
  for (let i = 0; i < 15; i++) {
    let x = (i * 120 + frameCount * 0.5) % width;
    let y = (i * 90 + frameCount * 0.7) % height;
    let size = (sin(frameCount * 0.05 + i) + 2) * 8; 
    fill(255, 182, 193, 150); // 馬卡龍粉
    circle(x, y, size);
    fill(176, 224, 230, 150); // 馬卡龍藍
    circle(x + 60, y + 40, size * 0.8);
    fill(255, 250, 205, 150); // 馬卡龍黃
    circle(x - 40, y + 80, size * 0.6);
  }
  pop();

  fill(255, 255, 255, 120); // 改為柔和的白色半透明遮罩
  rect(0, 0, width, height);

  // 繪製漂浮的雲朵
  push();
  fill(255, 200);
  noStroke();
  for(let i=0; i<5; i++) {
    let x = (frameCount * 0.5 + i * 250) % (width + 300) - 150;
    let y = 80 + i * 40 + sin(frameCount * 0.02 + i) * 20;
    ellipse(x, y, 120, 70);
    ellipse(x - 35, y + 10, 90, 60);
    ellipse(x + 35, y + 10, 90, 60);
  }
  pop();

  // 標題特效：彩虹變色 + 呼吸縮放
  push();
  textFont("Microsoft JhengHei"); // 設定標題字體
  fill('#FF6B6B'); // 設定標題顏色
  stroke(255); // 改為白色邊框
  strokeWeight(8); // 設定邊框粗細
  textSize(70 + sin(frameCount * 0.1) * 10); // 呼吸縮放效果
  textAlign(CENTER, CENTER);
  text("逃脫大挑戰", width / 2, height / 2 - 150);
  pop();
  
  push();
  textFont("KaiTi"); // 改為標楷體
  textAlign(CENTER, CENTER); // 置中
  fill(255);
  stroke(0); // 加入黑色邊框
  strokeWeight(3); // 設定邊框粗細
  textSize(26); // 改為 20pt
  text("準備好接受挑戰了嗎？", width / 2, height / 2 - 60);
  pop();

  // 3. 繪製 Tom 跑步動畫裝飾 (移至視窗下方，且在視窗之前繪製)
  if (tomWalk) {
    let scaleFactor = 3;
    let groundY = height - 50; // 將角色移至底部，避免遮擋文字
    let totalFrames = 8;
    let spriteW = tomWalk.width / totalFrames;
    let spriteH = tomWalk.height;
    let currentFrame = frameCount % totalFrames;
    let sx = currentFrame * spriteW;
    
    push();
    translate(width / 2, groundY);
    // 繪製 Tom
    image(tomWalk, -(spriteW * scaleFactor) / 2, -(spriteH * scaleFactor), spriteW * scaleFactor, spriteH * scaleFactor, sx, 0, spriteW, spriteH);
    pop();
  }

  // --- 處理彈出視窗介面 ---
  if (activeModal) {
    // 1. 繪製半透明遮罩
    fill(0, 150);
    rect(0, 0, width, height);

    // 2. 繪製視窗本體 (馬卡龍色系)
    let mw = 600;
    let mh = 400;
    let mx = width / 2 - mw / 2;
    let my = height / 2 - mh / 2;
    
    fill('#FFF0F5'); // Lavender Blush 背景
    stroke('#C7CEEA'); // Macaron Blue 邊框
    strokeWeight(4);
    rect(mx, my, mw, mh, 20); // 圓角矩形

    // 3. 繪製內容文字
    noStroke();
    fill('#4a4a4a');
    textAlign(CENTER, TOP);
    
    if (activeModal === 'rules') {
      textSize(32);
      text("遊戲規則", width / 2, my + 40);
      textSize(20);
      textAlign(LEFT, TOP);
      textLeading(35);
      let rules = "1. 幫助 Tom 在知識森林中冒險\n2. 方向鍵移動，空白鍵加速/攻擊\n3. 遇到守護者時需回答問題\n4. 答對兩題即可繼續前進\n5. 小心時間與生命值，努力通關！";
      text(rules, mx + 60, my + 100, mw - 120, mh - 100);
    } else if (activeModal === 'about') {
      textSize(32);
      textAlign(CENTER, TOP);
      text("關於我們", width / 2, my + 40);
      textSize(20);
      textAlign(CENTER, CENTER);
      textLeading(35);
      let about = "【Tom 的知識森林大冒險】\n\nTom 誤闖了神秘森林，必須通過\nJerry、狗狗、壞蛋與神秘女子的考驗。\n結合教育科技知識的趣味闖關遊戲。\n\n作者: 呂俞錚\n版本：2.0 (故事版)";
      text(about, width / 2, height / 2);
    }

    // 4. 顯示關閉按鈕，隱藏主選單按鈕
    closeModalButton.position(width / 2 - 105, my + mh - 60);
    closeModalButton.show();
    startButton.hide();
    rulesButton.hide();
    aboutButton.hide();

  } else {
    // 無視窗時，顯示主選單按鈕
    startButton.show();
    rulesButton.show();
    aboutButton.show();
    closeModalButton.hide();
  }
}

function windowResized() {
  // 當視窗大小改變時，重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
  resizeUI();
}

// 自訂函式：重新調整 UI 大小與位置
function resizeUI() {
  let mainBtnWidth = min(320, width - 60); // 按鈕寬度最大 320，但在小螢幕保留邊距
  let optionBtnWidth = min(210, width - 100); // 選項按鈕寬度

  if (startButton) {
    startButton.style('width', mainBtnWidth + 'px');
    startButton.position(width / 2 - mainBtnWidth / 2, height / 2 + 20);
  }
  if (restartButton) {
    restartButton.style('width', mainBtnWidth + 'px');
    restartButton.position(width / 2 - mainBtnWidth / 2, height / 2 + 130);
  }
  if (rulesButton) rulesButton.position(width / 2 - 105, height / 2 + 100);
  if (aboutButton) aboutButton.position(width / 2 - 105, height / 2 + 170);
  
  // 更新選項按鈕寬度
  if (btnA) btnA.style('width', optionBtnWidth + 'px');
  if (btnB) btnB.style('width', optionBtnWidth + 'px');
  if (btnC) btnC.style('width', optionBtnWidth + 'px');
}

// 自訂函式：繪製美觀的對話氣泡
function drawSpeechBubble(x, y, w, h, txt, bgColor = '#FFF0F5', borderColor = '#C7CEEA') {
  push();
  translate(x, y);
  scale(bubbleAnim); // 套用彈出動畫
  
  // 陰影效果
  fill(0, 30);
  noStroke();
  rect(-w / 2 + 4, -h + 4, w, h, 10);

  // 氣泡本體 (馬卡龍色系: 淡粉背景, 藍色邊框)
  fill(bgColor); // 使用傳入的背景色
  stroke(borderColor); // 使用傳入的邊框色
  strokeWeight(2);
  rect(-w / 2, -h, w, h, 10);

  // 氣泡尾巴 (三角形)
  fill(bgColor);
  triangle(-10, -10, 10, -10, 0, 0);
  
  // 覆蓋尾巴與本體連接處的線條
  noStroke();
  rect(-8, -12, 16, 4);
  
  // 文字內容 (深灰色)
  fill('#4a4a4a');
  textAlign(LEFT, TOP);
  textSize(14);
  textLeading(20); // 設定行距
  if (txt) text(txt, -w / 2 + 20, -h + 20, w - 40, h / 2 - 20); // 限制文字範圍在氣泡上半部
  
  pop();
}

// 自訂函式：更新計時器
function updateTimer() {
  if (millis() - lastTimerUpdate > 1000) {
    timeLeft--;
    lastTimerUpdate = millis();
  }
  if (timeLeft <= 0) {
    quizState = "incorrect";
    feedbackText = "時間到！";
    score -= 5; // 時間到扣 5 分
    lives--; // 扣愛心
    if (lives <= 0) isGameOver = true; // 愛心歸零，遊戲結束
  }
}

// 自訂函式：繪製自訂游標 (動畫精靈)
function drawCustomCursor() {
  // 更新 DOM 元素位置與狀態
  if (cursorEl) {
    if (mouseIsPressed) {
      // 點擊狀態：切換為 t.png (19x21, 1張圖)
      cursorEl.style('background-image', 'url("sm/touch/t.png")');
      cursorEl.style('width', '19px');
      cursorEl.style('height', '21px');
      cursorEl.style('background-size', '19px 21px');
      cursorEl.style('background-position', '0px 0px');
      cursorEl.position(mouseX - 9.5, mouseY - 10.5); // 修正中心點
      cursorEl.style('transform', 'scale(1.0)');
    } else {
      // 根據滑鼠移動方向切換圖片
      let deltaX = mouseX - pmouseX;
      let imgUrl, totalW;

      if (deltaX > 0) {
        // 向右移動: r.png (95x24)
        imgUrl = 'url("sm/right/r.png")';
        totalW = 95;
      } else if (deltaX < 0) {
        // 向左移動: l.png (99x24)
        imgUrl = 'url("sm/left/l.png")';
        totalW = 99;
      } else {
        // 靜止: s.png (99x24)
        imgUrl = 'url("sm/str/s.png")';
        totalW = 99;
      }

      let totalFrames = 4;
      let frameW = totalW / totalFrames;

      cursorEl.style('background-image', imgUrl);
      cursorEl.style('width', `${frameW}px`);
      cursorEl.style('height', '24px');
      cursorEl.style('background-size', `${totalW}px 24px`);
      
      // 計算動畫幀
      let currentFrame = floor(frameCount / 2) % totalFrames;
      let bgX = -currentFrame * frameW;
      
      cursorEl.style('background-position', `${bgX}px 0px`);
      cursorEl.position(mouseX - frameW / 2, mouseY - 12); // 修正中心點
      cursorEl.style('transform', 'scale(1.0)');
    }
  }
}

// --- 煙火特效類別 ---

class Firework {
  constructor() {
    this.hu = random(255);
    this.firework = new Particle(random(width), height, this.hu, true);
    this.exploded = false;
    this.particles = [];
  }

  done() {
    return this.exploded && this.particles.length === 0;
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(gravity);
      this.firework.update();
      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(gravity);
      this.particles[i].update();
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }

  explode() {
    for (let i = 0; i < 100; i++) {
      let p = new Particle(this.firework.pos.x, this.firework.pos.y, this.hu, false);
      this.particles.push(p);
    }
  }

  show() {
    if (!this.exploded) {
      this.firework.show();
    }
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  }
}

class Particle {
  constructor(x, y, hu, firework) {
    this.pos = createVector(x, y);
    this.firework = firework;
    this.lifespan = 255;
    this.hu = hu;
    this.acc = createVector(0, 0);
    if (this.firework) {
      this.vel = createVector(0, random(-18, -10)); // 煙火發射高度
    } else {
      this.vel = p5.Vector.random2D();
      this.vel.mult(random(2, 10)); // 爆炸擴散範圍
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.firework) {
      this.vel.mult(0.9);
      this.lifespan -= 4;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  done() {
    return this.lifespan < 0;
  }

  show() {
    colorMode(HSB);
    if (!this.firework) {
      strokeWeight(2);
      stroke(this.hu, 255, 255, this.lifespan);
    } else {
      strokeWeight(4);
      stroke(this.hu, 255, 255);
    }
    point(this.pos.x, this.pos.y);
    colorMode(RGB);
  }
}

// --- 彩帶特效類別 ---
class Confetti {
  constructor() {
    this.x = random(width);
    this.y = -10;
    this.color = random(['#FFB7B2', '#B5EAD7', '#C7CEEA', '#FFDAC1', '#E0BBE4']);
    this.size = random(8, 15);
    this.speedY = random(2, 5);
    this.speedX = random(-2, 2);
    this.angle = random(TWO_PI);
    this.spin = random(-0.1, 0.1);
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.angle += this.spin;
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(this.color);
    noStroke();
    rect(0, 0, this.size, this.size);
    pop();
  }

  done() {
    return this.y > height;
  }
}

// --- 故事模式粒子類別 ---
class StoryParticle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(5, 15);
    this.speedY = random(0.5, 1.5);
    this.alpha = random(100, 200);
    this.color = color(random(200, 255), random(200, 255), random(255), this.alpha); // 馬卡龍色系
  }
  update() {
    this.y -= this.speedY; // 向上漂浮
    if (this.y < -20) {
      this.y = height + 20;
      this.x = random(width);
    }
  }
  show() {
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.size);
  }
}

// --- 雨滴特效類別 ---
class RainDrop {
  constructor() {
    this.x = random(width);
    this.y = -20;
    this.len = random(10, 20);
    this.speed = random(5, 10);
  }
  update() {
    this.y += this.speed;
  }
  show() {
    stroke(173, 216, 230, 150); // 淡藍色
    strokeWeight(2);
    line(this.x, this.y, this.x, this.y + this.len);
  }
  done() {
    return this.y > height;
  }
}
