// Helper Functions
function getCurrentUsername() {
    return sessionStorage.getItem('currentUser') || null;
}

function getUserInventoryKey() {
    const username = getCurrentUsername();
    return username ? `inventory_${username}` : 'inventory';
}

function getUserCollectedKey() {
    const username = getCurrentUsername();
    return username ? `collectedItems_${username}` : 'collectedItems';
}

function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function hashPassword(password) {
    // Simple hash function (ในการใช้งานจริงควรใช้ bcrypt หรือ crypto API)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

// Login Functions
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    if (!username || !password) {ห
        
        alert('กรุณากรอก Username และ Password');
        return;
    }

    // ดึงข้อมูลผู้ใช้จาก localStorage
    const users = getUsers();
    const user = users.find(u => u.username === username);

    // ตรวจสอบว่ามี username นี้หรือไม่
    if (!user) {
        alert('ไม่พบ Username นี้ในระบบ\nกรุณา Register ก่อน');
        return;
    }

    // ตรวจสอบรหัสผ่าน
    if (user.password !== hashPassword(password)) {
        alert('รหัสผ่านไม่ถูกต้อง');
        return;
    }

    // Login สำเร็จ
    alert('Login สำเร็จ! ยินดีต้อนรับ ' + username);

    // เก็บข้อมูล session
    sessionStorage.setItem('currentUser', username);

    if (remember) {
        localStorage.setItem('rememberedUser', username);
        console.log('จดจำข้อมูล');
    }

    // ไปหน้าเกม
    window.location.href = 'game.html';
}

function goToRegister() {
    window.location.href = 'register.html';
}

function forgotPassword() {
    window.location.href = 'changepass.html';
}

// Register Functions
function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const email = document.getElementById('email').value;

    // ตรวจสอบความยาว Username
    if (username.length < 3) {
        alert('Username ต้องมีอย่างน้อย 3 ตัวอักษร');
        return;
    }

    // ตรวจสอบความยาว Password
    if (password.length < 6) {
        alert('Password ต้องมีอย่างน้อย 6 ตัวอักษร');
        return;
    }

    // ตรวจสอบว่า Password ตรงกันหรือไม่
    if (password !== confirmPassword) {
        alert('Password ไม่ตรงกัน กรุณากรอกใหม่');
        return;
    }

    // ตรวจสอบรูปแบบ Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('กรุณากรอก Email ให้ถูกต้อง');
        return;
    }

    // ดึงข้อมูลผู้ใช้ที่มีอยู่
    const users = getUsers();

    // ตรวจสอบว่า Username ซ้ำหรือไม่
    if (users.find(u => u.username === username)) {
        alert('Username นี้มีผู้ใช้แล้ว\nกรุณาเลือก Username อื่น');
        return;
    }

    // ตรวจสอบว่า Email ซ้ำหรือไม่
    if (users.find(u => u.email === email)) {
        alert('Email นี้ถูกใช้งานแล้ว\nกรุณาใช้ Email อื่น');
        return;
    }

    // สร้างผู้ใช้ใหม่
    const newUser = {
        username: username,
        password: hashPassword(password),
        email: email,
        createdAt: new Date().toISOString()
    };

    // เพิ่มผู้ใช้ใหม่และบันทึก
    users.push(newUser);
    saveUsers(users);

    // ถ้าผ่านทุกเงื่อนไข
    alert('สมัครสมาชิกสำเร็จ!\n\nUsername: ' + username + '\nEmail: ' + email + '\n\nกำลังไปหน้า Login...');

    // ไปหน้า Login
    window.location.href = 'login.html';
}

// Reset Password Functions
function handleResetPassword(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // ตรวจสอบ Username
    if (username.length < 3) {
        alert('Username ต้องมีอย่างน้อย 3 ตัวอักษร');
        return;
    }

    // ตรวจสอบความยาว Password
    if (newPassword.length < 6) {
        alert('Password ต้องมีอย่างน้อย 6 ตัวอักษร');
        return;
    }

    // ตรวจสอบว่า Password ตรงกันหรือไม่
    if (newPassword !== confirmPassword) {
        alert('Password ไม่ตรงกัน กรุณากรอกใหม่');
        return;
    }

    // ตรวจสอบว่า Password ใหม่ไม่เหมือน Password เก่า
    if (oldPassword === newPassword) {
        alert('Password ใหม่ต้องไม่เหมือน Password เก่า');
        return;
    }

    // ดึงข้อมูลผู้ใช้
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === username);

    // ตรวจสอบว่ามี username นี้หรือไม่
    if (userIndex === -1) {
        alert('ไม่พบ Username นี้ในระบบ');
        return;
    }

    // ตรวจสอบรหัสผ่านเก่า
    if (users[userIndex].password !== hashPassword(oldPassword)) {
        alert('รหัสผ่านเก่าไม่ถูกต้อง');
        return;
    }

    // อัพเดทรหัสผ่านใหม่
    users[userIndex].password = hashPassword(newPassword);
    users[userIndex].updatedAt = new Date().toISOString();
    saveUsers(users);

    // ถ้าผ่านทุกเงื่อนไข
    alert('รีเซ็ตรหัสผ่านสำเร็จ!\n\nUsername: ' + username + '\n\nกำลังไปหน้า Login...');

    // ไปหน้า Login
    window.location.href = 'login.html';
}

// Game Page Functions
function selectIsland(islandName) {
    console.log('Selected island:', islandName);

    // แปลงชื่อเกาะเป็นชื่อไฟล์
    const islandPages = {
        'earth': 'Ingame/EarthIsland.html',
        'shadow': 'Ingame/ShadowIsland.html',
        'frame': 'Ingame/FrameIsland.html',
        'thunder': 'Ingame/ThunderIsland.html',
        'rainbow': 'Ingame/RainbowIsland.html',
        'lightdark': 'Ingame/Light_DarkIsland.html',
        'ice': 'Ingame/IceIsland.html'
    };

    // นำทางไปยังหน้าเกาะนั้นๆ
    if (islandPages[islandName]) {
        window.location.href = islandPages[islandName];
    }
}

// Collect Ore with fruit popup animation
function collectOreWithFruit(element, oreType) {
    // ตรวจสอบว่าแร่ถูกเก็บไปแล้วหรือยัง
    if (element.classList.contains('collected')) {
        return; // ถ้าเก็บไปแล้ว ไม่ทำอะไร
    }

    element.classList.add('collected');

    // ปิดการคลิกซ้ำ
    element.style.pointerEvents = 'none';

    // กำหนดผลไม้ที่ได้ตามประเภท Ore
    let fruitImage;
    
    // ถ้าเป็นแร่จากเกาะ Earth ให้ได้ water เท่านั้น
    if (oreType === 'water') {
        fruitImage = 'water.png';
    } else {
        // แร่จากเกาะอื่นๆ สุ่มตามปกติ
        const random = Math.random(); // 0 - 1
        console.log(random);

        if (random < 0.50) {
            fruitImage = 'copper.png';
        } else if (random < 0.70) {
            fruitImage = 'silver.png';
        } else if (random < 0.80) {
            fruitImage = 'gold.png';
        } else if (random < 0.85) {
            fruitImage = 'soil.png';
        } else if (random < 0.90) {
            fruitImage = 'water.png';
        } else if (random < 0.95) {
            fruitImage = 'fire.png';
        } else {
            fruitImage = 'air.png';
        }
    }


    // หาตำแหน่งของแร่
    const rect = element.getBoundingClientRect();
    const oreX = rect.left + rect.width / 2;
    const oreY = rect.top;

    // สร้าง popup แสดงผลไม้
    const popup = document.createElement('div');
    popup.className = 'fruit-popup';
    popup.style.cssText = `
        position: fixed;
        left: ${oreX}px;
        top: ${oreY}px;
        transform: translate(-50%, 0) scale(0);
        z-index: 9999;
        pointer-events: none;
    `;

    const fruitImg = document.createElement('img');
    fruitImg.src = '../image/' + fruitImage;
    // กำหนดสีของ shadow ตามประเภทของ Ore
    const shadowColors = {
        'Frame': 'rgba(128, 128, 128, 0.8)',
        'Cabon': 'rgba(64, 64, 64, 0.8)',
        'Tita': 'rgba(192, 192, 192, 0.8)',
        'Earth': 'rgba(139, 69, 19, 0.8)',
        'Shadow': 'rgba(75, 0, 130, 0.8)',
        'Thunder': 'rgba(255, 255, 0, 0.8)',
        'Rainbow': 'rgba(255, 194, 255, 0.8)',
        'Light': 'rgba(255, 255, 255, 0.8)',
        'Dark': 'rgba(0, 0, 0, 0.8)',
        'Ice': 'rgba(0, 191, 255, 0.8)'
    };



    const shadowColor = shadowColors[oreType] || 'rgba(255, 255, 255, 0.8)';

    fruitImg.style.cssText = `
        width: 200px;
        height: 200px;
        object-fit: contain;
        filter: drop-shadow(0 0 20px ${shadowColor});
    `;

    popup.appendChild(fruitImg);
    document.body.appendChild(popup);

    // Animation popup ขึ้นจากแร่
    setTimeout(() => {
        popup.style.transition = 'all 0.5s ease-out';
        popup.style.transform = 'translate(-50%, -100px) scale(1)';
    }, 10);

    // เพิ่มแร่เข้า inventory
    const inventoryKey = getUserInventoryKey();
    let inventory = JSON.parse(localStorage.getItem(inventoryKey)) || [];
    const oreId = `ore_${oreType}_${Date.now()}`;
    const fruitName = fruitImage.replace('.png', '');
    
    inventory.push({
        id: oreId,
        name: fruitName,
        image: `image/${fruitImage}`,
        type: 'ore',
        oreType: oreType
    });
    localStorage.setItem(inventoryKey, JSON.stringify(inventory));

    // ซ่อน popup หลัง 1.5 วินาที
    setTimeout(() => {
        popup.style.transform = 'translate(-50%, -100px) scale(0)';
        setTimeout(() => {
            popup.remove();
        }, 500);
    }, 1500);

    // ลบ ore element
    setTimeout(() => {
        element.remove();
    }, 500);
}

// Initialize game animations when page loads
if (document.querySelector('.island')) {
    // Add floating animation to islands
    document.querySelectorAll('.island').forEach((island, index) => {
        island.style.animation = `float ${3 + index * 0.3}s ease-in-out infinite`;
    });

    // Create floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-15px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Add event listener to the inventory_icon button
function openInventory() {
    // ลบข้อมูลซ้ำออกจาก inventory
    const inventoryKey = getUserInventoryKey();
    let inventory = JSON.parse(localStorage.getItem(inventoryKey)) || [];
    const uniqueInventory = [];
    const seenIds = new Set();
    
    inventory.forEach(item => {
        const itemId = item.id || item.name;
        if (!seenIds.has(itemId)) {
            seenIds.add(itemId);
            uniqueInventory.push(item);
        }
    });
    
    // บันทึก inventory ที่ไม่ซ้ำกลับไป
    localStorage.setItem(inventoryKey, JSON.stringify(uniqueInventory));

    // Create popup container
    const popup = document.createElement('div');
    popup.id = 'inventory-popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.borderRadius = '10px';
    popup.style.zIndex = '1000';

    // Add inventory image as background
    const inventoryImage = document.createElement('img');
    inventoryImage.src = './image/inventory.png';
    inventoryImage.alt = 'Inventory';
    inventoryImage.style.width = '900px';
    inventoryImage.style.height = 'auto';
    inventoryImage.style.display = 'block';
    popup.appendChild(inventoryImage);

    // Create items container overlay
    const itemsContainer = document.createElement('div');
    itemsContainer.id = 'inventory-items';
    itemsContainer.style.position = 'absolute';
    itemsContainer.style.top = '147px';
    itemsContainer.style.left = '50%';
    itemsContainer.style.transform = 'translateX(-50%)';
    itemsContainer.style.width = '572px';
    itemsContainer.style.height = '396px';
    itemsContainer.style.display = 'grid';
    itemsContainer.style.gridTemplateColumns = 'repeat(4, 134px)';
    itemsContainer.style.gridTemplateRows = 'repeat(3, 128px)';
    itemsContainer.style.rowGap = '1px';
    itemsContainer.style.columnGap = '4px';
    itemsContainer.style.padding = '0px';
    itemsContainer.style.overflow = 'visible';
    popup.appendChild(itemsContainer);

    // ตัวแปรปรับแต่งกรอบ - เปลี่ยนค่าตรงนี้เพื่อปรับขนาดและสไตล์กรอบ
    const BORDER_WIDTH = '0px';           // ความหนาของกรอบ (ปิดเพราะใช้กรอบจากรูป)
    const BORDER_COLOR = '#FFD700';       // สีของกรอบ
    const BORDER_RADIUS = '20px';         // มุมโค้งของกรอบ
    const BOX_PADDING = '0px';            // ช่องว่างภายในกรอบ
    const HOVER_BG_COLOR = 'rgba(255, 215, 0, 0.2)'; // สีพื้นหลังเมื่อเมาส์อยู่บนกรอบ
    const HOVER_SCALE = '1.05';           // ขยายกรอบเมื่อ hover

    // แสดงเฉพาะไอเทมที่ไม่ซ้ำ
    uniqueInventory.forEach((item) => {
        const itemDiv = document.createElement('div');
        itemDiv.style.position = 'relative';
        itemDiv.style.textAlign = 'center';
        itemDiv.style.background = 'transparent';
        itemDiv.style.borderRadius = BORDER_RADIUS;
        itemDiv.style.padding = BOX_PADDING;
        itemDiv.style.border = `${BORDER_WIDTH} solid ${BORDER_COLOR}`;
        itemDiv.style.outline = 'none';
        itemDiv.style.transition = 'all 0.3s';
        itemDiv.style.cursor = 'pointer';
        itemDiv.style.display = 'flex';
        itemDiv.style.alignItems = 'center';
        itemDiv.style.justifyContent = 'center';
        
        const itemImg = document.createElement('img');
        // แก้ path ให้ถูกต้อง - ลบ ../ ออกและใช้แค่ image/
        let imagePath = item.image.replace('../', '');
        itemImg.src = imagePath;
        itemImg.alt = item.name;
        
        // ปรับขนาดให้พอดีกับกรอบ
        if (item.name === 'รูป1' || item.name === 'รูป2' || item.name === 'รูป3') {
            itemImg.style.width = '80px';
            itemImg.style.height = '80px';
        } else if (item.name === 'copper' || item.name === 'silver' || item.name === 'gold') {
            itemImg.style.width = '70px';
            itemImg.style.height = '70px';
        } else if (item.name === 'soil' || item.name === 'fire' || item.name === 'air') {
            itemImg.style.width = '75px';
            itemImg.style.height = '75px';
        } else if (item.name === 'water') {
            itemImg.style.width = '70px';
            itemImg.style.height = '70px';
        } else {
            itemImg.style.width = '80px';
            itemImg.style.height = '80px';
        }
        
        itemDiv.onmouseover = () => {
            itemDiv.style.background = HOVER_BG_COLOR;
            itemDiv.style.transform = `scale(${HOVER_SCALE})`;
        };
        itemDiv.onmouseout = () => {
            itemDiv.style.background = 'transparent';
            itemDiv.style.transform = 'scale(1)';
        };
        
        itemImg.style.objectFit = 'contain';
        itemImg.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))';
        itemImg.onerror = function() {
            console.log('Image failed to load:', imagePath);
            this.style.display = 'none';
        };
        
        itemDiv.appendChild(itemImg);
        itemsContainer.appendChild(itemDiv);
    });

    // Append popup to body
    document.body.appendChild(popup);

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.style.position = 'absolute';
    closeButton.style.top = '90px';
    closeButton.style.right = '135px';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '10%';
    closeButton.style.width = '35px';
    closeButton.style.height = '35px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.backgroundColor = 'transparent';

    // Close popup on button click
    closeButton.addEventListener('click', () => {
        popup.remove();
    });

    popup.appendChild(closeButton);
}

// Profile Functions
// ตั้งค่าขนาด popup
const POPUP_WIDTH = '90%';  // 
const POPUP_HEIGHT = '90%'; // 

function openProfile() {
    const profilePopup = document.getElementById("profilePopup");
    const popupContent = document.querySelector(".popup-content");
    if (profilePopup) {
        // ตั้งค่าขนาด
        if (popupContent) {
            popupContent.style.width = POPUP_WIDTH;
            popupContent.style.height = POPUP_HEIGHT;
        }
        profilePopup.style.display = "flex"; // แสดง popup
        loadProfileMixedFruits();
    }
}

// โหลดผลไม้ที่ mix ได้มาแสดงในหน้า profile
function loadProfileMixedFruits() {
    const username = getCurrentUsername();
    if (!username) {
        console.log('No username found');
        return;
    }
    
    const mixedFruitsKey = 'mixedFruits_' + username;
    let mixedFruits = JSON.parse(localStorage.getItem(mixedFruitsKey)) || [];
    
    const profileGrid = document.getElementById('profile-grid');
    const profileGrid2 = document.getElementById('profile-grid-2');
    const profileGrid3 = document.getElementById('profile-grid-3');
    
    if (!profileGrid) {
        console.log('Profile grid not found');
        return;
    }
    
    // ล้างกรอบทั้งหมด
    profileGrid.innerHTML = '';
    if (profileGrid2) profileGrid2.innerHTML = '';
    if (profileGrid3) profileGrid3.innerHTML = '';
    
    // แสดงผลไม้ล่าสุด 3 ตัว
    const grids = [profileGrid, profileGrid2, profileGrid3];
    const latestFruits = mixedFruits.slice(-3).reverse(); // เอา 3 ตัวล่าสุด และกลับด้าน
    
    latestFruits.forEach((fruit, index) => {
        if (grids[index]) {
            const itemDiv = document.createElement('div');
            itemDiv.style.display = 'flex';
            itemDiv.style.alignItems = 'center';
            itemDiv.style.justifyContent = 'center';
            
            const itemImg = document.createElement('img');
            // แก้ path ให้ถูกต้อง
            let imagePath = fruit.image;
            if (imagePath.startsWith('../image/')) {
                imagePath = imagePath.replace('../image/', 'image/');
            }
            itemImg.src = imagePath;
            itemImg.alt = fruit.name;
            itemImg.style.width = '70px';
            itemImg.style.height = '70px';
            itemImg.style.objectFit = 'contain';
            itemImg.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))';
            
            itemDiv.appendChild(itemImg);
            grids[index].appendChild(itemDiv);
            console.log('Loaded mixed fruit:', fruit.name);
        }
    });
}

function closeProfile() {
    const profilePopup = document.getElementById("profilePopup");
    if (profilePopup) {
        profilePopup.style.display = "none"; // ซ่อน popup
    }
}

// Info Functions
function openInfo() {
    const infoPopup = document.getElementById("infoPopup");
    if (infoPopup) {
        infoPopup.style.display = "flex";
    }
}

function closeInfo() {
    const infoPopup = document.getElementById("infoPopup");
    if (infoPopup) {
        infoPopup.style.display = "none";
    }
}

// ปิด popup เมื่อคลิกที่พื้นหลังดำ
document.addEventListener('DOMContentLoaded', () => {
    const profilePopup = document.getElementById("profilePopup");
    if (profilePopup) {
        profilePopup.addEventListener('click', (event) => {
            // ถ้าคลิกที่พื้นหลัง (ไม่ใช่ popup-content)
            if (event.target === profilePopup) {
                closeProfile();
            }
        });
    }

    const potPopup = document.getElementById("potPopup");
    if (potPopup) {
        potPopup.addEventListener('click', (event) => {
            // ถ้าคลิกที่พื้นหลัง (ไม่ใช่ popup-content)
            if (event.target === potPopup) {
                closePot();
            }
        });
    }

    const infoPopup = document.getElementById("infoPopup");
    if (infoPopup) {
        infoPopup.addEventListener('click', (event) => {
            // ถ้าคลิกที่พื้นหลัง (ไม่ใช่ popup-content)
            if (event.target === infoPopup) {
                closeInfo();
            }
        });
    }
});

function openPot() {
    window.location.href = 'Ingame/mixroom.html';
}

function closePot() {
    const potPopup = document.getElementById("potPopup");
    if (potPopup) {
        potPopup.style.display = "none"; // ซ่อน popup
    }
}

// Marble popup open/close (mixing iframe)
function openMarblePopup() {
    const popup = document.getElementById('MarblePopup');
    if (popup) popup.style.display = 'flex';
}
function closeMarblePopup() {
    const popup = document.getElementById('MarblePopup');
    if (popup) popup.style.display = 'none';
}

// Eternal Book popup open/close
function openEternalBookPopup() {
    const popup = document.getElementById('EternalBookPopup');
    if (popup) popup.style.display = 'flex';
}
function closeEternalBookPopup() {
    const popup = document.getElementById('EternalBookPopup');
    if (popup) popup.style.display = 'none';
}

// ปิด popup เมื่อคลิกพื้นหลัง
window.addEventListener('click', function (e) {
    const marblePopup = document.getElementById('MarblePopup');
    const bookPopup = document.getElementById('EternalBookPopup');
    if (e.target === marblePopup) closeMarblePopup();
    if (e.target === bookPopup) closeEternalBookPopup();
});

