document.addEventListener('DOMContentLoaded', () => {
    // 游戏变量
    const holes = document.querySelectorAll('.hole');
    const moles = document.querySelectorAll('.mole');
    const scoreEl = document.getElementById('score');
    const timeEl = document.getElementById('time');
    const startBtn = document.getElementById('start-button');
    const gameBoard = document.querySelector('.game-board');
    const hammerCursor = document.getElementById('hammer-cursor');
    
    let lastHole;
    let timeUp = false;
    let score = 0;
    let gameTimer;
    let timeLeft = 30;
    
    // 处理鼠标跟随和锤子效果
    gameBoard.addEventListener('mousemove', (e) => {
        hammerCursor.style.left = `${e.pageX - 25}px`;
        hammerCursor.style.top = `${e.pageY - 25}px`;
    });
    
    gameBoard.addEventListener('mousedown', () => {
        hammerCursor.classList.add('active');
    });
    
    gameBoard.addEventListener('mouseup', () => {
        hammerCursor.classList.remove('active');
    });
    
    // 鼠标进入游戏区域显示锤子，离开隐藏
    gameBoard.addEventListener('mouseenter', () => {
        hammerCursor.style.display = 'block';
    });
    
    gameBoard.addEventListener('mouseleave', () => {
        hammerCursor.style.display = 'none';
    });
    
    // 根据游戏进度调整难度，返回地鼠出现的时间
    function increaseDifficulty() {
        if (timeLeft <= 20 && timeLeft > 10) {
            return randomTime(500, 1000);
        } else if (timeLeft <= 10) {
            return randomTime(400, 800);
        } else {
            return randomTime(600, 1200);
        }
    }
    
    // 随机生成地鼠出现的时间
    function randomTime(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
    
    // 随机选择一个洞
    function randomHole(holes) {
        const idx = Math.floor(Math.random() * holes.length);
        const hole = holes[idx];
        
        // 避免连续出现在同一个洞
        if (hole === lastHole) {
            return randomHole(holes);
        }
        
        lastHole = hole;
        return hole;
    }
    
    // 让地鼠冒出来
    function peep() {
        // 使用难度调整函数来决定时间
        const time = increaseDifficulty();
        const hole = randomHole(holes);
        const mole = hole.querySelector('.mole');
        
        mole.classList.add('up');
        
        setTimeout(() => {
            mole.classList.remove('up');
            if (!timeUp) peep();
        }, time);
    }
    
    // 开始游戏
    function startGame() {
        // 重置游戏状态
        score = 0;
        timeLeft = 30;
        timeUp = false;
        scoreEl.textContent = score;
        timeEl.textContent = timeLeft;
        startBtn.disabled = true;
        
        // 开始游戏计时
        gameTimer = setInterval(() => {
            timeLeft--;
            timeEl.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(gameTimer);
                timeUp = true;
                startBtn.disabled = false;
                alert(`游戏结束！你的得分：${score}`);
            }
        }, 1000);
        
        // 开始地鼠出现
        peep();
    }
    
    // 创建眩晕星星效果
    function createDizzyStars(x, y) {
        // 创建5-7个星星
        const starsCount = Math.floor(Math.random() * 3) + 5;
        const starSymbols = ['★', '✦', '✯', '✰', '✪', '✫', '✭'];
        
        // 创建一个波纹效果
        createRippleEffect(x, y);
        
        // 创建星星
        for (let i = 0; i < starsCount; i++) {
            const star = document.createElement('span');
            star.textContent = starSymbols[Math.floor(Math.random() * starSymbols.length)];
            star.classList.add('star');
            
            // 随机位置偏移 - 扩大范围
            const offsetX = Math.random() * 80 - 40;
            const offsetY = Math.random() * 60 - 80;
            star.style.left = `${x + offsetX}px`;
            star.style.top = `${y + offsetY}px`;
            
            // 随机大小
            const scale = 0.8 + Math.random() * 0.7;
            star.style.transform = `scale(${scale})`;
            
            // 随机延迟
            const delay = Math.random() * 300;
            star.style.animationDelay = `${delay}ms`;
            
            document.body.appendChild(star);
            
            // 动画结束后移除
            setTimeout(() => {
                if (document.body.contains(star)) {
                    document.body.removeChild(star);
                }
            }, 1000 + delay);
        }
    }
    
    // 创建波纹效果
    function createRippleEffect(x, y) {
        for (let i = 0; i < 3; i++) {
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            
            // 随机位置微调
            const offsetX = Math.random() * 20 - 10;
            const offsetY = Math.random() * 20 - 10;
            ripple.style.left = `${x + offsetX - 20}px`;
            ripple.style.top = `${y + offsetY - 20}px`;
            
            // 随机大小
            const scale = 0.8 + Math.random() * 0.5;
            ripple.style.transform = `scale(${scale})`;
            
            // 随机延迟
            const delay = i * 150;
            ripple.style.animationDelay = `${delay}ms`;
            
            document.body.appendChild(ripple);
            
            // 动画结束后移除
            setTimeout(() => {
                if (document.body.contains(ripple)) {
                    document.body.removeChild(ripple);
                }
            }, 700 + delay);
        }
    }
    
    // 打地鼠
    function whack(e) {
        if (!e.isTrusted) return; // 防止作弊
        
        if (this.classList.contains('up')) {
            // 获取鼠标点击位置
            const rect = this.getBoundingClientRect();
            const x = e.pageX;
            const y = e.pageY;
            
            // 创建眩晕效果
            createDizzyStars(x, y);
            
            this.classList.remove('up');
            this.classList.add('hit');
            
            setTimeout(() => {
                this.classList.remove('hit');
            }, 300);
            
            score++;
            scoreEl.textContent = score;
        }
    }
    
    // 添加事件监听
    moles.forEach(mole => mole.addEventListener('click', whack));
    startBtn.addEventListener('click', startGame);
});