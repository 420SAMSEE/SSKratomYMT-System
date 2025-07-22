document.addEventListener('DOMContentLoaded', function() {
  // ตั้งค่าวันที่ปัจจุบัน
  const currentDateElement = document.getElementById('currentDate');
  const today = new Date();
  const formattedDate = formatDate(today);
  currentDateElement.textContent = formattedDate;
  
  // ฟังก์ชันจัดรูปแบบวันที่
  function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('th-TH', options);
  }
  
  // องค์ประกอบฟอร์ม
  const leafInput = document.getElementById('leafInput');
  const waterInput = document.getElementById('waterInput');
  const yieldInput = document.getElementById('yieldInput');
  const calculateButton = document.getElementById('calculateButton');
  const resetButton = document.getElementById('resetButton');
  const resultContainer = document.getElementById('resultContainer');
  
  // ผลลัพธ์
  const resultGroundLeaf = document.getElementById('resultGroundLeaf');
  const resultGroundWater = document.getElementById('resultGroundWater');
  const resultGroundYield = document.getElementById('resultGroundYield');
  
  const resultNotGroundLeaf1 = document.getElementById('resultNotGroundLeaf1');
  const resultNotGroundWater1 = document.getElementById('resultNotGroundWater1');
  const resultNotGroundYield1 = document.getElementById('resultNotGroundYield1');
  
  const resultNotGroundLeaf2 = document.getElementById('resultNotGroundLeaf2');
  const resultNotGroundWater2 = document.getElementById('resultNotGroundWater2');
  const resultNotGroundYield2 = document.getElementById('resultNotGroundYield2');
  
  // คำนวณ
  calculateButton.addEventListener('click', function() {
    const leaf = parseFloat(leafInput.value) || 0;
    const water = parseFloat(waterInput.value) || 0;
    const yieldDesired = parseFloat(yieldInput.value) || 0;
    
    if (leaf < 0 || water < 0 || yieldDesired < 0) {
      alert('⚠️ กรุณากรอกค่าที่เป็นบวกเท่านั้น!');
      return;
    }
    
    let groundLeaf = 0, groundWater = 0, groundYield = 0;
    let notGroundLeaf1 = 0, notGroundWater1 = 0, notGroundYield1 = 0;
    let notGroundLeaf2 = 0, notGroundWater2 = 0, notGroundYield2 = 0;
    
    // อัตราส่วนสำหรับวิธีบด
    const groundRatioLeafToWater = 20; // กก. ใบ : ลิตร น้ำ
    const groundRatioWaterToYield = 15 / 20; // ลิตร น้ำ : ลิตร น้ำกระท่อมดิบ
    
    // อัตราส่วนสำหรับวิธีไม่บด ( # 0.65 # )
    const notGroundRatioLeafToWater1 = 15.38; // กก. ใบ : ลิตร น้ำ
    const notGroundRatioWaterToYield1 = 12 / 15.38; // ลิตร น้ำ : ลิตร น้ำกระท่อมดิบ
    
    // อัตราส่วนสำหรับวิธีไม่บด ( # 0.66 # )
    const notGroundRatioLeafToWater2 = 15.15151515; // กก. ใบ : ลิตร น้ำ
    const notGroundRatioWaterToYield2 = 12 / 15.15151515; // ลิตร น้ำ : ลิตร น้ำกระท่อมดิบ
    
    if (leaf > 0) {
      groundLeaf = leaf;
      groundWater = leaf * groundRatioLeafToWater;
      groundYield = groundWater * groundRatioWaterToYield;
      
      notGroundLeaf1 = leaf;
      notGroundWater1 = leaf * notGroundRatioLeafToWater1;
      notGroundYield1 = notGroundWater1 * notGroundRatioWaterToYield1;
      
      notGroundLeaf2 = leaf;
      notGroundWater2 = leaf * notGroundRatioLeafToWater2;
      notGroundYield2 = notGroundWater2 * notGroundRatioWaterToYield2;
      
    } else if (water > 0) {
      groundWater = water;
      groundLeaf = water / groundRatioLeafToWater;
      groundYield = water * groundRatioWaterToYield;
      
      notGroundWater1 = water;
      notGroundLeaf1 = water / notGroundRatioLeafToWater1;
      notGroundYield1 = water * notGroundRatioWaterToYield1;
      
      notGroundWater2 = water;
      notGroundLeaf2 = water / notGroundRatioLeafToWater2;
      notGroundYield2 = water * notGroundRatioWaterToYield2;
      
    } else if (yieldDesired > 0) {
      groundYield = yieldDesired;
      groundWater = yieldDesired / groundRatioWaterToYield;
      groundLeaf = groundWater / groundRatioLeafToWater;
      
      notGroundYield1 = yieldDesired;
      notGroundWater1 = yieldDesired / notGroundRatioWaterToYield1;
      notGroundLeaf1 = notGroundWater1 / notGroundRatioLeafToWater1;
      
      notGroundYield2 = yieldDesired;
      notGroundWater2 = yieldDesired / notGroundRatioWaterToYield2;
      notGroundLeaf2 = notGroundWater2 / notGroundRatioLeafToWater2;
      
    } else {
      alert('⚠️ กรุณากรอกค่าข้อมูลอย่างน้อยหนึ่งช่อง!');
      return;
    }
    
    // แสดงผลลัพธ์
    resultGroundLeaf.textContent = groundLeaf.toFixed(2);
    resultGroundWater.textContent = groundWater.toFixed(2);
    resultGroundYield.textContent = groundYield.toFixed(2);
    
    resultNotGroundLeaf1.textContent = notGroundLeaf1.toFixed(2);
    resultNotGroundWater1.textContent = notGroundWater1.toFixed(2);
    resultNotGroundYield1.textContent = notGroundYield1.toFixed(2);
    
    resultNotGroundLeaf2.textContent = notGroundLeaf2.toFixed(2);
    resultNotGroundWater2.textContent = notGroundWater2.toFixed(2);
    resultNotGroundYield2.textContent = notGroundYield2.toFixed(2);
    
    // แสดงผลลัพธ์
    resultContainer.style.display = 'block';
  });
  
  // รีเซ็ตฟอร์ม
  resetButton.addEventListener('click', function() {
    leafInput.value = '';
    waterInput.value = '';
    yieldInput.value = '';
    resultContainer.style.display = 'none';
  });
});