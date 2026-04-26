// 1. 页面滚动与导航
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            updateNav(entry.target.id);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('section').forEach(s => observer.observe(s));

function updateNav(id) {
    const sections = ['home', 'publications', 'academic', 'movies', 'travel', 'game'];
    const dots = document.querySelectorAll('.dot');
    const idx = sections.indexOf(id);
    if(idx !== -1) {
        dots.forEach(d => d.classList.remove('active'));
        dots[idx].classList.add('active');
    }
}

function scrollToSection(idx) {
    document.querySelectorAll('section')[idx].scrollIntoView({ behavior: 'smooth' });
}

// 2. 游戏逻辑 - 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 烟花系统
    const fireworksCanvas = document.getElementById('fireworksCanvas');
    const fwCtx = fireworksCanvas.getContext('2d');
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
    
    let fireworks = [];
    let fireworksRunning = false;
    
    function launchFireworks() {
        console.log('🎉 Launching fireworks!');
        
        // 立即创建20个烟花
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
            
            // 每个烟花30个粒子
            for (let j = 0; j < 30; j++) {
                const angle = (Math.PI * 2 * j) / 30;
                const speed = 2 + Math.random() * 3;
                fireworks.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }
        }
        
        if (!fireworksRunning) {
            fireworksRunning = true;
            animateFireworks();
        }
    }
    
    function animateFireworks() {
        fwCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
        
        for (let i = fireworks.length - 1; i >= 0; i--) {
            const fw = fireworks[i];
            fw.x += fw.vx;
            fw.y += fw.vy;
            fw.vy += 0.1;
            fw.life -= 0.01;
            
            if (fw.life <= 0) {
                fireworks.splice(i, 1);
                continue;
            }
            
            fwCtx.globalAlpha = fw.life;
            fwCtx.fillStyle = fw.color;
            fwCtx.beginPath();
            fwCtx.arc(fw.x, fw.y, 4, 0, Math.PI * 2);
            fwCtx.fill();
        }
        
        fwCtx.globalAlpha = 1;
        
        if (fireworks.length > 0) {
            requestAnimationFrame(animateFireworks);
        } else {
            fireworksRunning = false;
        }
    }
    
    window.addEventListener('resize', () => {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
    });
    
    const canvas = document.getElementById('flappyCanvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('game-container');
    const overScreen = document.getElementById('game-over-screen');
    const startHint = document.getElementById('start-hint');
    const restartBtn = document.getElementById('restart-btn');

    let bird, pipes, score, gameRunning = false, gameStarted = false, animationId;
    let lastCelebrationScore = 0;

    // 确保初始状态正确
    overScreen.style.display = 'none';
    startHint.style.display = 'block';

    function initCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }

    function resetGame() {
        bird = { x: 80, y: canvas.height/2, w: 30, h: 30, v: 0, g: 0.1 , jump: -3 };
        pipes = [];
        score = 0;
        gameRunning = true;
        gameStarted = true;
        lastCelebrationScore = 0;
        overScreen.style.display = 'none';
        startHint.style.display = 'none';
        if (animationId) cancelAnimationFrame(animationId);
        gameLoop();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 画鸟 (学术金色方块)
        ctx.fillStyle = '#c5a47e';
        ctx.fillRect(bird.x, bird.y, bird.w, bird.h);

        // 画柱子 (简约灰)
        ctx.fillStyle = '#cbd5e1';
        pipes.forEach(p => {
            ctx.fillRect(p.x, 0, p.w, p.topH);
            ctx.fillRect(p.x, p.bottomY, p.w, canvas.height - p.bottomY);
        });

        // 画分数
        ctx.fillStyle = '#2d2d2d';
        ctx.font = 'bold 32px DM Sans';
        ctx.fillText('Score: ' + score, 20, 50);
    }

    function update() {
        bird.v += bird.g;
        bird.y += bird.v;

        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 250) {
            const gap = 150;
            const h = Math.random() * (canvas.height - gap - 120) + 60;
            pipes.push({ x: canvas.width, topH: h, bottomY: h + gap, w: 50, scored: false });
        }

        pipes.forEach((p, i) => {
            p.x -= 2.5;
            // 碰撞检测
            if (bird.x < p.x + p.w && bird.x + bird.w > p.x &&
                (bird.y < p.topH || bird.y + bird.h > p.bottomY)) gameRunning = false;
            // 计分
            if (p.x + p.w < bird.x && !p.scored) { 
                score++; 
                p.scored = true;
                
                // 每达到10的倍数触发全屏烟花庆祝
                if (score % 10 === 0 && score > lastCelebrationScore) {
                    lastCelebrationScore = score;
                    console.log('🎉 Score ' + score + '!');
                    launchFireworks();
                }
            }
            if (p.x + p.w < 0) pipes.splice(i, 1);
        });

        if (bird.y + bird.h > canvas.height || bird.y < 0) gameRunning = false;
    }

    function gameLoop() {
        if (!gameRunning) {
            overScreen.style.display = 'flex';
            document.getElementById('final-score').innerText = "Score: " + score;
            return;
        }
        update();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }

    container.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target === restartBtn) return;
        
        if (!gameStarted || !gameRunning) {
            console.log('Starting game...');
            resetGame();
        } else if (gameRunning) {
            console.log('Bird jump!');
            bird.v = bird.jump;
        }
    });

    // 支持空格键控制
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (!gameStarted || !gameRunning) {
                console.log('Starting game with spacebar...');
                resetGame();
            } else if (gameRunning) {
                console.log('Bird jump with spacebar!');
                bird.v = bird.jump;
            }
        }
    });

    restartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('Restarting game...');
        gameStarted = false;
        resetGame();
    });

    window.addEventListener('resize', initCanvas);
    initCanvas();
});