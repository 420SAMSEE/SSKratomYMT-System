import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";

// ค่าการกำหนดค่า Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAUx88kZih0rpQhMZr4sUCcmppU3XS9JH8",
  authDomain: "sskratomymt.firebaseapp.com",
  projectId: "sskratomymt",
  storageBucket: "sskratomymt.firebasestorage.app",
  messagingSenderId: "576346207013",
  appId: "1:576346207013:web:2ae8559eefd2158764e0cc",
  measurementId: "G-YCG2235SCF"
};

// เริ่มต้น Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// ฟังก์ชันบันทึกข้อมูลการขาย
export async function saveSaleData(saleData) {
  try {
    const docRef = await addDoc(collection(db, "sales"), {
      ...saleData,
      createdAt: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
    return false;
  }
}

// ฟังก์ชันดึงข้อมูลการขายล่าสุด
export async function getRecentSales(limitCount = 7) {
  try {
    const q = query(
      collection(db, "sales"), 
      orderBy("createdAt", "desc"), 
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const sales = [];
    
    querySnapshot.forEach((doc) => {
      sales.push({ id: doc.id, ...doc.data() });
    });
    
    return sales;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
}

// ฟังก์ชันลบข้อมูลการขาย
export async function deleteSale(saleId) {
  try {
    await deleteDoc(doc(db, "sales", saleId));
    console.log("Document deleted with ID: ", saleId);
    return true;
  } catch (error) {
    console.error("Error deleting document: ", error);
    return false;
  }
}

// ฟังก์ชันส่งออกข้อมูลเป็น CSV
export async function exportSalesData() {
  try {
    const sales = await getRecentSales(30); // ดึงข้อมูล 30 วันล่าสุด
    
    if (sales.length === 0) {
      alert("ไม่มีข้อมูลที่จะส่งออก");
      return;
    }
    
    // สร้างหัวข้อ CSV
    let csv = "วันที่,จำนวนขาย(ขวด),ค้างน้ำดิบ(ขวด),เคลียร์ยอดค้าง(ขวด),รายรับ(บาท),รายจ่าย(บาท),ยอดคงเหลือ(บาท)\n";
    
    // เพิ่มข้อมูลแต่ละวัน
    sales.forEach(sale => {
      const date = new Date(sale.date).toLocaleDateString('th-TH');
      csv += `${date},${sale.sold},${sale.pending},${sale.cleared},${sale.revenue},${sale.expense},${sale.balance}\n`;
    });
    
    // สร้างไฟล์และดาวน์โหลด
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sales_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (error) {
    console.error("Error exporting data: ", error);
    alert("เกิดข้อผิดพลาดในการส่งออกข้อมูล");
  }
}