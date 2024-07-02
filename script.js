const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎'];
const numRows = 4; // 總行數
const numCols = 6; // 每行格子數
var playerCoin = 0;
var playerBet = 0;
const coin = document.getElementById('coin');
let spinning = false; // 控制是否正在進行動畫
const noWinSound = new Audio('audio/loss.mp3');
noWinSound.volume = 1;
const winSound = new Audio('audio/win.mp3');
winSound.volume = 1;
const spinSound = new Audio('audio/spinner.mp3');
spinSound.volume = 0.6;

document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('backgroundMusic').volume = 0.5;
    document.getElementById('backgroundMusic').play();
});

function bet() {
    if (spinning) {
        return;
    }
    if (playerBet >= 1000) {
        playerBet = 100;
    } else {
        playerBet += 100;
    }
    document.getElementById('bet').value = playerBet;
}

function charge() {
    if (spinning) {
        return;
    }
    playerCoin += 10000;
    coin.value = playerCoin;
}

function spin() {
    if (spinning || playerCoin === 0 || playerCoin < playerBet || playerBet === 0) {
        return; // 如果正在進行動畫，直接返回，避免重複觸發
    }

    noWinSound.pause(); // 停止
    noWinSound.currentTime = 0;
    spinSound.play();
    var bet = document.getElementById('bet').value;
    playerCoin -= bet;

    spinning = true; // 設置為正在進行動畫

    const slots = document.querySelectorAll('.slot');
    clearWinningSlots(); // 清除之前的中獎閃爍效果

    const backgroundMusic = document.getElementById('backgroundMusic');
    if (backgroundMusic.paused) {
        backgroundMusic.play().catch(error => {
            console.error('音樂播放失敗:', error);
        });
    }

    let animationInterval = setInterval(() => {
        let tempResults = [];
        slots.forEach(slot => {
            const randomIndex = Math.floor(Math.random() * symbols.length);
            tempResults.push(symbols[randomIndex]);
        });
        updateSlots(tempResults);
    }, 100); // 每 100 毫秒更新一次圖標，模擬動畫效果

    setTimeout(() => {
        clearInterval(animationInterval); // 停止動畫效果
        const finalResults = [];
        slots.forEach(slot => {
            const randomIndex = Math.floor(Math.random() * symbols.length);
            finalResults.push(symbols[randomIndex]);
        });
        updateSlots(finalResults);
        setTimeout(() => {
            spinSound.pause(); // 停止旋轉音效
            spinSound.currentTime = 0; // 重設旋轉音效
            checkWin(finalResults); // 在顯示最終結果後，檢查中獎
            spinning = false; // 動畫結束，重置為未進行動畫
        }, 500); // 等待一段時間後再檢查中獎，確保使用者能看清最終結果
    }, 2000); // 2 秒後停止動畫，並顯示最終結果
    coin.value = playerCoin;
}

function updateSlots(results) {
    const slots = document.querySelectorAll('.slot');
    slots.forEach((slot, index) => {
        slot.textContent = results[index];
    });
}

function checkWin(results) {
    let winningIndexes = [];

    // 檢查每一行的中獎情況
    for (let row = 0; row < numRows; row++) {
        const firstSymbol = results[row * numCols]; // 當前行的第一個格子
        // 檢查其他行的中獎條件
        for (let otherRow = 0; otherRow < numRows; otherRow++) {
            const secondSymbol = results[otherRow * numCols + 1]; // 其他行的第二個格子
            if (secondSymbol === firstSymbol) { // 所有行第二個格子跟第一格一樣 才繼續比對
                for (let thirdRow = 0; thirdRow < numRows; thirdRow++) {
                    const thirdSymbol = results[thirdRow * numCols + 2]; // 其他行的第三個格子
                    // 檢查是否有第三格與基準圖示相同
                    if (thirdSymbol === firstSymbol) {
                        for (let fourRow = 0; fourRow < numRows; fourRow++) {
                            const fourSymbol = results[fourRow * numCols + 3]; // 其他行的第四個格子
                            if (fourSymbol === firstSymbol) {
                                for (let fifthRow = 0; fifthRow < numRows; fifthRow++) {
                                    const fifthSymbol = results[fifthRow * numCols + 4]; // 其他行的第五個格子
                                    if (fifthSymbol === firstSymbol) {
                                        for (let sixthRow = 0; sixthRow < numRows; sixthRow++) {
                                            const sixthSymbol = results[sixthRow * numCols + 5]; // 其他行的第六個格子
                                            if (sixthSymbol === firstSymbol) {
                                                winningIndexes.push(sixthRow * numCols + 5); // 加入中獎的第六格
                                            }
                                        }
                                        winningIndexes.push(fifthRow * numCols + 4); // 加入中獎的第五格
                                    }
                                }
                                winningIndexes.push(fourRow * numCols + 3); // 加入中獎的第四格
                            }
                        }
                        winningIndexes.push(row * numCols); // 加入中獎的第一格
                        winningIndexes.push(otherRow * numCols + 1); // 加入中獎的第二格
                        winningIndexes.push(thirdRow * numCols + 2); // 加入中獎的第三格
                    }
                }
            }
        }
    }

    if (winningIndexes.length === 0) {
        noWinSound.play();
    } else {
        winSound.play();
        var playerWin = (playerBet * winningIndexes.length);
        document.getElementById('win').value = playerWin / 2;
        playerCoin += playerWin / 2;
        coin.value = playerCoin;
        // const slotMachine = document.getElementById("slot-machine");
        // slotMachine.classList.add('machineWinning');
    }

    // 高亮中獎的格子
    highlightWinningSlots(winningIndexes);
}

function highlightWinningSlots(winningIndexes) {
    const slots = document.querySelectorAll('.slot');
    slots.forEach((slot, index) => {
        if (winningIndexes.includes(index)) {
            slot.classList.add('winning');
        }
    });

}

function clearWinningSlots() {
    const slots = document.querySelectorAll('.slot');
    // const slotMachine = document.getElementById("slot-machine");
    // slotMachine.classList.remove('machineWinning');
    slots.forEach(slot => {
        slot.classList.remove('winning');
    });
}

const spinButton = document.getElementById('spinButton');
const betButton = document.getElementById('betButton');
const chargeButton = document.getElementById('chargeButton');
spinButton.addEventListener('click', spin);
chargeButton.addEventListener('click', charge);
betButton.addEventListener('click', bet);
