const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎'];
const numRows = 3; // 總行數
const numCols = 5; // 每行格子數
let spinning = false; // 控制是否正在進行動畫

function spin() {
    if (spinning) {
        return; // 如果正在進行動畫，直接返回，避免重複觸發
    }
    spinning = true; // 設置為正在進行動畫

    const slots = document.querySelectorAll('.slot');
    clearWinningSlots(); // 清除之前的中獎閃爍效果
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
            checkWin(finalResults); // 在顯示最終結果後，檢查中獎
            spinning = false; // 動畫結束，重置為未進行動畫
        }, 500); // 等待一段時間後再檢查中獎，確保使用者能看清最終結果
    }, 2000); // 2 秒後停止動畫，並顯示最終結果
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
    slots.forEach(slot => {
        slot.classList.remove('winning');
    });
}

const spinButton = document.getElementById('spinButton');
spinButton.addEventListener('click', spin);
