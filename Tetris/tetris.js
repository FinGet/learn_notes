// 获取DOM元素
const canvas = document.getElementById('tetris');
const nextCanvas = document.getElementById('next');
const ctx = canvas.getContext('2d');
const nextCtx = nextCanvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const autoBtn = document.getElementById('auto-btn'); // 添加自动模式按钮

// 获取移动端控制按钮
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const downBtn = document.getElementById('down-btn');
const rotateBtn = document.getElementById('rotate-btn');
const dropBtn = document.getElementById('drop-btn');

// 设置游戏常量
const TARGET_ROWS = 20; // 游戏的目标行数
let ROWS = TARGET_ROWS; // 初始化为目标行数
const COLS = 17; // 列数
let BLOCK_SIZE = calculateBlockSize(); // 动态计算方块大小
const EMPTY = '#1a2a3a'; // 空格的颜色

// 设置游戏变量
let score = 0;
let level = 1;
let lines = 0;
let dropInterval = 1000; // 方块下落速度的初始值（毫秒）
let dropStart;
let gameStarted = false;
let gamePaused = false;
let gameOver = false;
let requestId = null;
let autoMode = false; // 是否为自动模式
let autoMoveInterval = null; // 自动移动的定时器
let normalDropInterval = 1000; // 普通模式下的下落速度
let autoDropInterval = 500; // 自动模式下的下落速度（更快）
let lastAIDecision = 0; // 上次AI决策的时间
let aiDecisionInterval = 300; // AI决策的间隔时间（毫秒）

// 定义方块的颜色
const COLORS = [
    null,
    '#FF0D72', // I 形方块
    '#0DC2FF', // J 形方块
    '#0DFF72', // L 形方块
    '#F538FF', // O 形方块
    '#FF8E0D', // S 形方块
    '#FFE138', // T 形方块
    '#3877FF'  // Z 形方块
];

// 定义方块的形状
const SHAPES = [
    [],
    // I 形方块
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    // J 形方块
    [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
    ],
    // L 形方块
    [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]
    ],
    // O 形方块
    [
        [4, 4],
        [4, 4]
    ],
    // S 形方块
    [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]
    ],
    // T 形方块
    [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0]
    ],
    // Z 形方块
    [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]
    ]
];

// 创建游戏板
let board = createBoard();
function createBoard() {
    let board = [];
    for (let row = 0; row < ROWS; row++) {
        board[row] = [];
        for (let col = 0; col < COLS; col++) {
            board[row][col] = 0;
        }
    }
    return board;
}

// 绘制游戏板
function drawBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            drawBlock(col, row, board[row][col]);
        }
    }
}

// 绘制一个方块
function drawBlock(x, y, color) {
    const colorCode = color === 0 ? EMPTY : COLORS[color];
    ctx.fillStyle = colorCode;
    
    // 确保只在有效的画布区域内绘制方块
    if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
        // 计算实际绘制坐标，确保不超出画布
        const pixelX = Math.min(x * BLOCK_SIZE, canvas.width - BLOCK_SIZE);
        const pixelY = Math.min(y * BLOCK_SIZE, canvas.height - BLOCK_SIZE);
        
        ctx.fillRect(pixelX, pixelY, BLOCK_SIZE, BLOCK_SIZE);
        
        if (color !== 0) {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.strokeRect(pixelX, pixelY, BLOCK_SIZE, BLOCK_SIZE);
            
            // 添加一点光效
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(pixelX + 1, pixelY + 1, BLOCK_SIZE - 2, 2);
            ctx.fillRect(pixelX + 1, pixelY + 1, 2, BLOCK_SIZE - 2);
        }
    }
}

// 当前方块对象
const piece = {
    position: { x: 5, y: 0 },
    shape: null,
    color: null
};

// 下一个方块
let nextPiece = null;

// 生成随机方块
function getRandomPiece() {
    const shapeIndex = Math.floor(Math.random() * 7) + 1;
    return {
        shape: SHAPES[shapeIndex],
        color: shapeIndex
    };
}

// 重置方块位置
function resetPiece() {
    // 如果没有下一个方块，创建一个
    if (!nextPiece) {
        nextPiece = getRandomPiece();
    }
    
    // 将下一个方块设为当前方块
    piece.shape = nextPiece.shape;
    piece.color = nextPiece.color;
    // 确保方块在更宽的界面中居中显示
    piece.position.x = Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2);
    piece.position.y = 0;
    
    // 创建新的下一个方块
    nextPiece = getRandomPiece();
    
    // 绘制下一个方块
    drawNextPiece();
    
    // 检查游戏是否结束
    if (collision()) {
        gameOver = true;
        cancelAnimationFrame(requestId);
        requestId = null;
        
        // 添加更好的游戏结束界面
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 游戏结束文本
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('游戏结束', canvas.width / 2, canvas.height / 2 - 30);
        
        // 分数显示
        ctx.font = '24px Arial';
        ctx.fillStyle = '#e74c3c';
        ctx.fillText('最终分数: ' + score, canvas.width / 2, canvas.height / 2 + 20);
        
        // 重新开始提示
        ctx.font = '18px Arial';
        ctx.fillStyle = '#3498db';
        ctx.fillText('点击"重新开始"按钮继续', canvas.width / 2, canvas.height / 2 + 60);
    }
}

// 绘制下一个方块
function drawNextPiece() {
    // 清除下一个画布
    nextCtx.fillStyle = '#1a2a3a';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    if (!nextPiece) return;
    
    // 为下一个方块计算合适的方块大小
    const nextBlockSize = Math.min(15, Math.floor(nextCanvas.width / 6));
    
    // 计算居中位置
    const offsetX = (nextCanvas.width - (nextPiece.shape[0].length * nextBlockSize)) / 2;
    const offsetY = (nextCanvas.height - (nextPiece.shape.length * nextBlockSize)) / 2;
    
    // 绘制下一个方块
    for (let row = 0; row < nextPiece.shape.length; row++) {
        for (let col = 0; col < nextPiece.shape[row].length; col++) {
            if (nextPiece.shape[row][col]) {
                // 绘制方块
                const x = offsetX + col * nextBlockSize;
                const y = offsetY + row * nextBlockSize;
                
                nextCtx.fillStyle = COLORS[nextPiece.color];
                nextCtx.fillRect(x, y, nextBlockSize, nextBlockSize);
                
                // 绘制边框
                nextCtx.strokeStyle = '#000';
                nextCtx.lineWidth = 1;
                nextCtx.strokeRect(x, y, nextBlockSize, nextBlockSize);
                
                // 添加光效
                nextCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                nextCtx.fillRect(x + 1, y + 1, nextBlockSize - 2, 2);
                nextCtx.fillRect(x + 1, y + 1, 2, nextBlockSize - 2);
            }
        }
    }
}

// 绘制当前方块
function drawPiece() {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col]) {
                drawBlock(piece.position.x + col, piece.position.y + row, piece.color);
            }
        }
    }
}

// 检查碰撞
function collision() {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (!piece.shape[row][col]) continue;
            
            const newX = piece.position.x + col;
            const newY = piece.position.y + row;
            
            // 检查是否超出游戏边界
            if (newX < 0 || newX >= COLS || newY >= ROWS) {
                return true;
            }
            
            // 如果在游戏顶部之上，则不检查碰撞
            if (newY < 0) {
                continue;
            }
            
            // 检查与其他方块的碰撞
            if (board[newY][newX]) {
                return true;
            }
        }
    }
    return false;
}

// 移动方块
function movePiece(direction) {
    piece.position.x += direction;
    if (collision()) {
        piece.position.x -= direction;
        return false;
    }
    return true;
}

// 旋转方块
function rotatePiece() {
    // 保存原始形状
    const originalShape = piece.shape;
    
    // 创建新的二维数组用于存储旋转后的形状
    const newShape = [];
    for (let i = 0; i < originalShape[0].length; i++) {
        newShape[i] = [];
        for (let j = 0; j < originalShape.length; j++) {
            newShape[i][j] = originalShape[originalShape.length - 1 - j][i];
        }
    }
    
    // 临时应用旋转后的形状
    piece.shape = newShape;
    
    // 检查旋转后是否有碰撞
    if (collision()) {
        // 如果有碰撞，恢复原始形状
        piece.shape = originalShape;
        return false;
    }
    
    return true;
}

// 把方块固定到游戏板上
function lockPiece() {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (!piece.shape[row][col]) continue;
            
            // 游戏结束检查
            if (piece.position.y + row < 0) {
                gameOver = true;
                cancelAnimationFrame(requestId);
                requestId = null;
                return;
            }
            
            // 将方块添加到游戏板
            board[piece.position.y + row][piece.position.x + col] = piece.color;
        }
    }
}

// 删除已填满的行
function removeRows() {
    let rowsCleared = 0;
    
    outer: for (let row = ROWS - 1; row >= 0; row--) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] === 0) {
                continue outer;
            }
        }
        
        // 删除填满的行
        const removedRow = board.splice(row, 1)[0];
        board.unshift(Array(COLS).fill(0));
        rowsCleared++;
        row++; // 检查相同的行，因为我们移除了一行
    }
    
    // 更新分数
    if (rowsCleared > 0) {
        // 消除行数统计
        lines += rowsCleared;
        linesElement.textContent = lines;
        
        // 计算分数 (根据消除的行数给不同的分数)
        switch (rowsCleared) {
            case 1:
                score += 100 * level;
                break;
            case 2:
                score += 300 * level;
                break;
            case 3:
                score += 500 * level;
                break;
            case 4:
                score += 800 * level;
                break;
        }
        
        scoreElement.textContent = score;
        
        // 检查是否升级
        if (lines >= level * 10) {
            level++;
            levelElement.textContent = level;
            
            // 增加下落速度
            dropInterval = Math.max(100, 1000 - (level - 1) * 100);
        }
    }
}

// 硬下落（每个时间间隔的下落）
function hardDrop() {
    piece.position.y++;
    
    if (collision()) {
        piece.position.y--;
        lockPiece();
        removeRows();
        resetPiece();
    }
    
    dropStart = Date.now();
}

// 立即让方块落到底部
function dropToBottom() {
    let dropCount = 0;
    
    // 继续下移方块直到发生碰撞
    while (!collision()) {
        piece.position.y++;
        dropCount++;
    }
    
    // 回退一步，因为最后一步发生了碰撞
    if (dropCount > 0) {
        piece.position.y--;
    }
    
    lockPiece();
    removeRows();
    resetPiece();
    dropStart = Date.now();
}

// 更新游戏状态
function update() {
    const now = Date.now();
    const delta = now - dropStart;
    
    if (delta > dropInterval) {
        hardDrop();
    }
    
    // 在自动模式下决策下一步移动，但限制频率
    if (autoMode && gameStarted && !gamePaused && !gameOver) {
        if (now - lastAIDecision > aiDecisionInterval) {
            makeAIDecision();
            lastAIDecision = now;
        }
    }
    
    draw();
    
    if (!gameOver && gameStarted && !gamePaused) {
        requestId = requestAnimationFrame(update);
    }
}

// 绘制整个游戏界面
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPiece();
}

// 初始化游戏
function init() {
    // 优化设备显示设置
    optimizeForDevice();
    
    // 重新计算方块大小和调整画布尺寸
    BLOCK_SIZE = calculateBlockSize();
    
    // 调整行数以匹配画布高度，确保不小于TARGET_ROWS
    ROWS = Math.max(Math.floor(canvas.height / BLOCK_SIZE), TARGET_ROWS);
    
    // 重新创建游戏板
    board = createBoard();
    
    score = 0;
    level = 1;
    lines = 0;
    
    // 确保使用正确的下落速度
    dropInterval = autoMode ? autoDropInterval : normalDropInterval;
    gameOver = false;
    
    scoreElement.textContent = score;
    levelElement.textContent = level;
    linesElement.textContent = lines;
    
    // 初始化方块
    nextPiece = getRandomPiece();
    resetPiece();
    
    // 打印游戏区域信息，用于调试
    console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
    console.log(`Block size: ${BLOCK_SIZE}`);
    console.log(`Game grid: ${COLS}x${ROWS}`);
    console.log(`Max Y position: ${ROWS - 1}`);
    console.log(`Auto mode: ${autoMode ? 'on' : 'off'}`);
    
    draw();
}

// 开始游戏
function startGame() {
    if (!gameStarted || gameOver) {
        init();
        gameStarted = true;
        gamePaused = false;
        dropStart = Date.now();
        pauseBtn.setAttribute('aria-label', '暂停');
        startBtn.setAttribute('aria-label', '游戏中...');
        startBtn.disabled = true;
        
        // 确认自动模式UI状态与实际状态一致
        if (autoMode) {
            autoBtn.classList.add('active-mode');
            autoBtn.setAttribute('aria-label', '切换到手动');
            dropInterval = autoDropInterval;
            lastAIDecision = Date.now();
        } else {
            autoBtn.classList.remove('active-mode');
            autoBtn.setAttribute('aria-label', '切换到自动');
            dropInterval = normalDropInterval;
        }
        
        if (requestId) {
            cancelAnimationFrame(requestId);
        }
        
        requestId = requestAnimationFrame(update);
    }
}

// 暂停游戏
function togglePause() {
    if (!gameStarted || gameOver) return;
    
    gamePaused = !gamePaused;
    
    if (gamePaused) {
        cancelAnimationFrame(requestId);
        requestId = null;
        pauseBtn.setAttribute('aria-label', '继续');
        
        // 显示暂停文本
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('已暂停', canvas.width / 2, canvas.height / 2);
        
        // 添加简单的阴影效果
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = 'rgba(231, 76, 60, 0.8)';
        ctx.fillText('已暂停', canvas.width / 2 + 2, canvas.height / 2 + 2);
    } else {
        dropStart = Date.now();
        pauseBtn.setAttribute('aria-label', '暂停');
        requestId = requestAnimationFrame(update);
    }
}

// 重置游戏
function resetGame() {
    if (requestId) {
        cancelAnimationFrame(requestId);
        requestId = null;
    }
    
    gameStarted = false;
    gamePaused = false;
    gameOver = false;
    
    // 重置自动模式
    if (autoMode) {
        autoMode = false;
        autoBtn.setAttribute('aria-label', '切换到自动');
        autoBtn.classList.remove('active-mode'); // 移除高亮样式类
    }
    
    startBtn.disabled = false;
    startBtn.setAttribute('aria-label', '开始游戏');
    pauseBtn.setAttribute('aria-label', '暂停');
    
    init();
}

// AI决策逻辑
function makeAIDecision() {
    // 简单AI算法，评估每种可能位置和旋转，选择最佳位置
    let bestScore = -Infinity;
    let bestMoves = { rotations: 0, translation: 0 };
    
    // 保存当前状态
    const originalX = piece.position.x;
    const originalY = piece.position.y;
    const originalShape = [];
    
    // 深拷贝原始形状（更高效的方式）
    for (let i = 0; i < piece.shape.length; i++) {
        originalShape[i] = [];
        for (let j = 0; j < piece.shape[i].length; j++) {
            originalShape[i][j] = piece.shape[i][j];
        }
    }
    
    // 尝试所有可能的旋转和左右移动组合
    for (let rotations = 0; rotations < 4; rotations++) {
        // 重置位置
        piece.position.x = originalX;
        
        // 重置形状（深拷贝）
        piece.shape = [];
        for (let i = 0; i < originalShape.length; i++) {
            piece.shape[i] = [];
            for (let j = 0; j < originalShape[i].length; j++) {
                piece.shape[i][j] = originalShape[i][j];
            }
        }
        
        // 应用旋转
        for (let r = 0; r < rotations; r++) {
            if (!rotatePiece()) {
                break; // 如果无法旋转，则尝试下一种可能
            }
        }
        
        // 尝试所有可能的平移
        for (let translation = -5; translation <= 5; translation++) {
            // 重置X位置
            piece.position.x = originalX;
            
            // 应用平移
            for (let t = 0; t < Math.abs(translation); t++) {
                if (!movePiece(translation > 0 ? 1 : -1)) {
                    break;
                }
            }
            
            // 模拟下落到底部
            let landingY = piece.position.y;
            while (!collision()) {
                piece.position.y++;
            }
            piece.position.y--;
            
            // 评估这个位置
            const score = evaluatePosition();
            
            if (score > bestScore) {
                bestScore = score;
                bestMoves = { rotations, translation };
            }
            
            // 恢复Y位置
            piece.position.y = landingY;
        }
    }
    
    // 恢复原始状态
    piece.position.x = originalX;
    piece.position.y = originalY;
    
    // 恢复原始形状
    piece.shape = [];
    for (let i = 0; i < originalShape.length; i++) {
        piece.shape[i] = [];
        for (let j = 0; j < originalShape[i].length; j++) {
            piece.shape[i][j] = originalShape[i][j];
        }
    }
    
    // 执行最佳移动
    for (let r = 0; r < bestMoves.rotations; r++) {
        rotatePiece();
    }
    
    for (let t = 0; t < Math.abs(bestMoves.translation); t++) {
        movePiece(bestMoves.translation > 0 ? 1 : -1);
    }
    
    // 立即下落
    if (Math.random() < 0.8) { // 80%的概率直接下落到底部
        dropToBottom();
    }
}

// 评估当前方块位置的分数
function evaluatePosition() {
    // 创建一个临时的游戏板来模拟放置方块
    const tempBoard = board.map(row => [...row]);
    
    // 模拟放置方块
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (!piece.shape[row][col]) continue;
            
            const boardRow = piece.position.y + row;
            const boardCol = piece.position.x + col;
            
            if (boardRow >= 0 && boardRow < ROWS && boardCol >= 0 && boardCol < COLS) {
                tempBoard[boardRow][boardCol] = piece.color;
            }
        }
    }
    
    // 评分标准
    let score = 0;
    
    // 1. 完整行数
    let completedLines = 0;
    for (let row = 0; row < ROWS; row++) {
        let isComplete = true;
        for (let col = 0; col < COLS; col++) {
            if (tempBoard[row][col] === 0) {
                isComplete = false;
                break;
            }
        }
        if (isComplete) {
            completedLines++;
        }
    }
    score += completedLines * 100; // 完整行给高分
    
    // 2. 高度惩罚 - 越高的位置放置方块越不好
    let maxHeight = 0;
    for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
            if (tempBoard[row][col] !== 0) {
                maxHeight = Math.max(maxHeight, ROWS - row);
                break;
            }
        }
    }
    score -= maxHeight * 2;
    
    // 3. 洞的惩罚 - 下面是空的，上面有方块的情况
    let holes = 0;
    for (let col = 0; col < COLS; col++) {
        let block = false;
        for (let row = 0; row < ROWS; row++) {
            if (tempBoard[row][col] !== 0) {
                block = true;
            } else if (block) {
                holes++;
            }
        }
    }
    score -= holes * 10;
    
    // 4. 平整度奖励 - 鼓励表面平整
    let heights = [];
    for (let col = 0; col < COLS; col++) {
        let height = ROWS;
        for (let row = 0; row < ROWS; row++) {
            if (tempBoard[row][col] !== 0) {
                height = row;
                break;
            }
        }
        heights.push(height);
    }
    
    let bumpiness = 0;
    for (let i = 0; i < heights.length - 1; i++) {
        bumpiness += Math.abs(heights[i] - heights[i + 1]);
    }
    score -= bumpiness * 2;
    
    return score;
}

// 切换自动/手动模式
function toggleAutoMode() {
    autoMode = !autoMode;
    
    if (autoMode) {
        autoBtn.setAttribute('aria-label', '切换到手动');
        autoBtn.classList.add('active-mode'); // 添加高亮样式类
        dropInterval = autoDropInterval;
        lastAIDecision = Date.now(); // 重置AI决策时间
    } else {
        autoBtn.setAttribute('aria-label', '切换到自动');
        autoBtn.classList.remove('active-mode'); // 移除高亮样式类
        dropInterval = normalDropInterval;
    }
    
    // 如果游戏已经开始，则更新下落速度
    if (gameStarted && !gamePaused) {
        dropStart = Date.now();
    }
}

// 添加移动端按钮事件处理
function addMobileControls() {
    // 左移按钮
    leftBtn.addEventListener('touchstart', function(e) {
        e.preventDefault(); // 防止页面滚动
        if (!gameStarted || gameOver || gamePaused || autoMode) return;
        movePiece(-1);
    });
    
    // 右移按钮
    rightBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (!gameStarted || gameOver || gamePaused || autoMode) return;
        movePiece(1);
    });
    
    // 向下移动按钮
    downBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (!gameStarted || gameOver || gamePaused || autoMode) return;
        hardDrop();
    });
    
    // 旋转按钮
    rotateBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (!gameStarted || gameOver || gamePaused || autoMode) return;
        rotatePiece();
    });
    
    // 直接落下按钮
    dropBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (!gameStarted || gameOver || gamePaused || autoMode) return;
        dropToBottom();
    });
    
    // 为移动设备添加长按支持
    let touchInterval;
    
    leftBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (!gameStarted || gameOver || gamePaused || autoMode) return;
        touchInterval = setInterval(function() {
            movePiece(-1);
        }, 150);
    });
    
    rightBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (!gameStarted || gameOver || gamePaused || autoMode) return;
        touchInterval = setInterval(function() {
            movePiece(1);
        }, 150);
    });
    
    downBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (!gameStarted || gameOver || gamePaused || autoMode) return;
        touchInterval = setInterval(function() {
            hardDrop();
        }, 100);
    });
    
    // 触摸结束时清除定时器
    leftBtn.addEventListener('touchend', function() {
        clearInterval(touchInterval);
    });
    
    rightBtn.addEventListener('touchend', function() {
        clearInterval(touchInterval);
    });
    
    downBtn.addEventListener('touchend', function() {
        clearInterval(touchInterval);
    });
}

// 键盘事件处理
document.addEventListener('keydown', event => {
    if (!gameStarted || gameOver || gamePaused) return;
    
    // 在自动模式下，忽略方向键的输入
    if (autoMode && (event.keyCode >= 37 && event.keyCode <= 40)) {
        return;
    }
    
    switch (event.keyCode) {
        case 37: // 左箭头
            movePiece(-1);
            break;
        case 39: // 右箭头
            movePiece(1);
            break;
        case 40: // 下箭头
            hardDrop();
            break;
        case 38: // 上箭头
            rotatePiece();
            break;
        case 32: // 空格
            dropToBottom();
            break;
        case 80: // P键
            togglePause();
            break;
        case 65: // A键 - 切换自动/手动模式
            toggleAutoMode();
            break;
    }
});

// 按钮事件
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', resetGame);
autoBtn.addEventListener('click', toggleAutoMode); // 添加自动模式按钮事件

// 添加移动端控制
addMobileControls();

// 计算合适的方块大小
function calculateBlockSize() {
    // 获取游戏区域的宽度和高度
    const gameWidth = canvas.width;
    const gameHeight = canvas.height;
    
    // 计算基于宽度的方块大小
    const widthBasedSize = Math.floor(gameWidth / COLS);
    
    // 计算基于高度的方块大小, 使用TARGET_ROWS而不是硬编码20
    const heightBasedSize = Math.floor(gameHeight / TARGET_ROWS);
    
    // 取两者的较小值，确保方块完全适合画布
    let size = Math.min(widthBasedSize, heightBasedSize);
    
    // 根据设备类型调整大小，但确保方块能完整显示TARGET_ROWS行
    if (isMobileDevice()) {
        // 在移动设备上，确保方块大小不会太小也不会太大
        size = Math.max(Math.min(size, 22), 15);
    } else {
        // 在桌面设备上使用更大的方块
        size = Math.max(Math.min(size, 25), 15);
    }
    
    return size;
}

// 调整游戏尺寸
function resizeGame() {
    // 先计算方块大小
    BLOCK_SIZE = calculateBlockSize();
    
    // 确保计算的行数不小于预期的TARGET_ROWS
    ROWS = Math.max(Math.floor(canvas.height / BLOCK_SIZE), TARGET_ROWS);
    
    // 如果游戏已经开始，重新创建游戏板并绘制
    if (gameStarted) {
        board = createBoard();
        draw();
    }
}

// 检测是否为移动设备
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || 
           (navigator.userAgent.indexOf('IEMobile') !== -1) ||
           (window.innerWidth <= 768);
}

// 根据设备类型优化显示
function optimizeForDevice() {
    const isMobile = isMobileDevice();
    
    if (isMobile) {
        // 在移动设备上调整设置
        aiDecisionInterval = 400; // 降低AI决策频率以提高性能
        
        // 确保Canvas尺寸适合移动设备屏幕
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // 如果屏幕宽度小于350，调整Canvas尺寸
        if (screenWidth < 350) {
            canvas.width = Math.max(screenWidth * 0.85, 280);
            // 保持宽高比，确保高度足够容纳TARGET_ROWS行
            const minHeight = TARGET_ROWS * 15; // 最小方块大小为15
            canvas.height = Math.max(Math.min(canvas.width * 1.5, screenHeight * 0.5), minHeight);
        }
        
        // 在小屏设备上调整下落速度
        if (screenWidth < 375) {
            normalDropInterval = 1200; // 稍微降低速度，让移动设备上的用户有更多反应时间
        }
    }
    
    // 重新计算方块大小
    BLOCK_SIZE = calculateBlockSize();
    
    // 调整行数，确保不小于TARGET_ROWS
    ROWS = Math.max(Math.floor(canvas.height / BLOCK_SIZE), TARGET_ROWS);
    
    // 打印调试信息
    console.log(`Canvas optimized: ${canvas.width}x${canvas.height}`);
    console.log(`Block size: ${BLOCK_SIZE}`);
    console.log(`Game rows: ${ROWS}, cols: ${COLS}`);
}

// 添加窗口大小变化监听
window.addEventListener('resize', resizeGame);

// 确保nextCanvas的大小与HTML中定义的一致
nextCanvas.width = 70;
nextCanvas.height = 70;

// 初始化设备优化
optimizeForDevice();

// 初始化游戏
init(); 