
import { saveSaleData, getRecentSales, deleteSale, exportSalesData } from './firebase.js';


document.addEventListener('DOMContentLoaded', async function() {
  // ตั้งค่าวันที่ปัจจุบัน
  const dateInput = document.getElementById('date');
  const currentDateElement = document.getElementById('currentDate');
  const today = new Date();
  const formattedDate = formatDate(today);
  
  dateInput.value = today.toISOString().substr(0, 10);
  currentDateElement.textContent = formattedDate;
  
  // ฟังก์ชันจัดรูปแบบวันที่
  function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('th-TH', options);
  }
  
  // องค์ประกอบฟอร์ม
  const sold = document.getElementById('sold');
  const pending = document.getElementById('pending');
  const cleared = document.getElementById('cleared');
  const price = document.getElementById('price');
  const revenueOut = document.getElementById('revenue');
  
  const leafCost = document.getElementById('leafCost');
  const pipeFee = document.getElementById('pipeFee');
  const shareFee = document.getElementById('shareFee');
  const otherFee = document.getElementById('otherFee');
  const saveFee = document.getElementById('saveFee');
  const expenseOut = document.getElementById('expense');
  
  const balanceOut = document.getElementById('balance');
  const form = document.getElementById('saleForm');
  const msg = document.getElementById('msg');
  const salesTableBody = document.getElementById('salesTableBody');
  const exportBtn = document.getElementById('exportBtn');
  
// ตัวอย่างในฟังก์ชัน loadSalesData
  async function loadSalesData() {
    showMessage('กำลังโหลดข้อมูล...', 'info');
    const sales = await getRecentSales();
    
    // ...โค้ดแสดงผลในตาราง...
  }
  
  // ตัวอย่างในฟังก์ชัน submit
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // ...โค้ดตรวจสอบและเตรียมข้อมูล...
    
    const success = await saveSaleData(saleData);
    
    sales.forEach(sale => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${formatDisplayDate(sale.date)}</td>
        <td>${sale.sold}</td>
        <td>${sale.pending}</td>
        <td>${sale.cleared}</td>
        <td>${sale.revenue.toLocaleString()}</td>
        <td>${sale.expense.toLocaleString()}</td>
        <td>${sale.balance.toLocaleString()}</td>
        <td>
          <button class="delete-btn" data-id="${sale.id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      
      salesTableBody.appendChild(row);
    });
    
    // เพิ่มเหตุการณ์คลิกให้ปุ่มลบ
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async function() {
        const saleId = this.getAttribute('data-id');
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) {
          const success = await deleteSale(saleId);
          if (success) {
            showMessage('ลบรายการเรียบร้อย', 'success');
            loadSalesData();
          } else {
            showMessage('เกิดข้อผิดพลาดในการลบรายการ', 'error');
          }
        }
      });
    });
    
    showMessage('', '');
  }
  
  // จัดรูปแบบวันที่สำหรับแสดง
  function formatDisplayDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH');
  }
  
  // คำนวณรายรับ
  function calcRevenue() {
    const rev = (Number(sold.value) + Number(cleared.value) - Number(pending.value)) * Number(price.value);
    revenueOut.textContent = rev.toLocaleString();
    return rev;
  }
  
  // คำนวณรายจ่าย
  function calcExpense() {
    const exp = Number(leafCost.value) + Number(pipeFee.value) + Number(shareFee.value) + 
                Number(otherFee.value) + Number(saveFee.value);
    expenseOut.textContent = exp.toLocaleString();
    return exp;
  }
  
  // คำนวณยอดคงเหลือ
  function calcBalance() {
    const bal = calcRevenue() - calcExpense();
    balanceOut.textContent = bal.toLocaleString();
    return bal;
  }
  
  // ผูกเหตุการณ์การเปลี่ยนแปลงค่า
  [sold, pending, cleared, price].forEach(e => e.addEventListener('input', calcRevenue));
  [leafCost, pipeFee, shareFee, otherFee, saveFee].forEach(e => e.addEventListener('input', calcExpense));
  [...document.querySelectorAll('input')].forEach(e => e.addEventListener('input', calcBalance));
  
  // ส่งฟอร์ม
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // ตรวจสอบความถูกต้อง
    if (!dateInput.value) {
      showMessage('โปรดเลือกวันที่', 'error');
      return;
    }
    
    // เตรียมข้อมูล
    const saleData = {
      date: dateInput.value,
      sold: Number(sold.value),
      pending: Number(pending.value),
      cleared: Number(cleared.value),
      price: Number(price.value),
      revenue: calcRevenue(),
      leafCost: Number(leafCost.value),
      pipeFee: Number(pipeFee.value),
      shareFee: Number(shareFee.value),
      otherFee: Number(otherFee.value),
      saveFee: Number(saveFee.value),
      expense: calcExpense(),
      balance: calcBalance(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    showMessage('กำลังบันทึกข้อมูล...', 'info');
    
    // บันทึกข้อมูล
    const success = await saveSaleData(saleData);
    
    if (success) {
      showMessage('บันทึกข้อมูลเรียบร้อย', 'success');
      form.reset();
      dateInput.value = today.toISOString().substr(0, 10);
      price.value = 40;
      shareFee.value = 100;
      saveFee.value = 500;
      calcRevenue();
      calcExpense();
      calcBalance();
      loadSalesData();
    } else {
      showMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    }
  });
  
  // ส่งออกข้อมูล
  exportBtn.addEventListener('click', exportSalesData);
  
  // แสดงข้อความสถานะ
  function showMessage(message, type) {
    msg.textContent = message;
    msg.className = 'msg-box';
    
    switch(type) {
      case 'error':
        msg.style.backgroundColor = '#FFEBEE';
        msg.style.color = 'var(--error-color)';
        msg.style.borderLeft = '4px solid var(--error-color)';
        break;
      case 'success':
        msg.style.backgroundColor = '#E8F5E9';
        msg.style.color = 'var(--success-color)';
        msg.style.borderLeft = '4px solid var(--success-color)';
        break;
      case 'info':
        msg.style.backgroundColor = '#E3F2FD';
        msg.style.color = 'var(--info-color)';
        msg.style.borderLeft = '4px solid var(--info-color)';
        break;
      default:
        msg.style.display = 'none';
    }
    
    if (message) {
      msg.style.display = 'block';
    }
  }
  
  // โหลดข้อมูลเริ่มต้น
  loadSalesData();
  calcRevenue();
  calcExpense();
  calcBalance();
});