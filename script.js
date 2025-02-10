const cells = document.querySelectorAll('.cell');
let fireSpreadInterval;
let activeFireCells = []; // Yangın yanan hücrelerin listesi

function updateCellStatus(cell, status) {
    const statusText = cell.querySelector('.status');
    if (statusText) {
        statusText.textContent = status;
    }
}

function startFireSpread() {
    // Spread fire to neighboring cells after a certain time
    fireSpreadInterval = setInterval(() => {
        const newFireCells = [];
        
        activeFireCells.forEach(cell => {
            const allCells = Array.from(cells);
            const index = allCells.indexOf(cell);
            const neighbors = getNeighbors(index);

            neighbors.forEach(neighbor => {
                if (!neighbor.classList.contains('on-fire') && !neighbor.classList.contains('hot')) {
                    neighbor.classList.add('hot'); // Hücre ısınmaya başlar
                    updateCellStatus(neighbor, 'Isınmış');
                    newFireCells.push(neighbor);
                }
            });
        });

        // Yangın başlamış hücrelerin durumunu değiştir
        newFireCells.forEach(neighbor => {
            setTimeout(() => {
                neighbor.classList.remove('hot');
                neighbor.classList.add('on-fire');
                updateCellStatus(neighbor, 'Yanıyor');
            }, 2000); // Yangının 2 saniye sonra başlamasını sağlar
        });

        // Eğer tüm hücreler alev almışsa durdur
        if (activeFireCells.length >= cells.length) {
            clearInterval(fireSpreadInterval);
        }

        // Yeni yangın yanan hücreleri aktif hücrelere ekle
        activeFireCells = [...activeFireCells, ...newFireCells];
    }, 2000); // Yangının yayılma hızı (2 saniye)
}

function getNeighbors(index) {
    const neighbors = [];
    const row = Math.floor(index / 4); // Calculate row (0 to 3)
    const col = index % 4; // Calculate column (0 to 3)

    // Check left, right, top, bottom neighbors
    if (col > 0) neighbors.push(cells[index - 1]); // Left
    if (col < 3) neighbors.push(cells[index + 1]); // Right
    if (row > 0) neighbors.push(cells[index - 4]); // Top
    if (row < 3) neighbors.push(cells[index + 4]); // Bottom

    return neighbors;
}

cells.forEach(cell => {
    // İlk başta metni 'Sağlam' olarak ekleyelim
    const statusDiv = document.createElement('div');
    statusDiv.classList.add('status');
    updateCellStatus(cell, 'Sağlam'); // Hücre normalde sağlam olarak başlar
    cell.appendChild(statusDiv);

    cell.addEventListener('click', () => {
        if (!cell.classList.contains('on-fire') && !cell.classList.contains('hot')) {
            cell.classList.add('hot'); // Hücre ısınmaya başlar
            updateCellStatus(cell, 'Isınmış');

            // 1 saniye sonra yangın başlat
            setTimeout(() => {
                if (cell.classList.contains('hot')) {
                    cell.classList.remove('hot');
                    cell.classList.add('on-fire'); // Yangın başlar
                    updateCellStatus(cell, 'Yanıyor');
                    activeFireCells.push(cell); // Yangın başlatan hücreyi aktif hücrelere ekle
                    startFireSpread(); // Yangının yayılmasını başlat
                }
            }, 1000);
        }
    });
});
