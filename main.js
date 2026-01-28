let dataMotor = [];

fetch('harga_pasar_motor_bogor.json')
  .then(res => res.json())
  .then(data => dataMotor = data);

const input = document.getElementById('filterInput');
const resultDiv = document.getElementById('result');

input.addEventListener('input', () => {
  input.value = input.value.toUpperCase();
  
  const keyword = input.value.trim();
  resultDiv.innerHTML = '';
  if (!keyword) return;
  
  const tahunMatch = keyword.match(/\d{2,4}/);
  let tahun = null;
  
  if (tahunMatch) {
    tahun = tahunMatch[0].length === 2 ?
      '20' + tahunMatch[0] :
      tahunMatch[0];
  }
  
  const namaMotor = keyword.replace(/\d+/g, '').trim();
  
  const hasil = dataMotor.filter(item => {
    const cocokNama = namaMotor ?
      item.nama_motor.toUpperCase().includes(namaMotor) :
      true;
    
    const cocokTahun = tahun ?
      item.tahun.toString().includes(tahun) :
      true;
    
    return cocokNama && cocokTahun;
  });
  
  if (hasil.length === 0) {
    resultDiv.innerHTML = '<p>Data tidak ditemukan</p>';
    return;
  }
  
  hasil.slice(0, 20).forEach(item => {
    const hargaPasar = item.harga_pasar;
    
    let pajakHTML = '';
    for (let tahunMati = 1; tahunMati <= 5; tahunMati++) {
      const potongan = tahunMati * 5; // %
      const hargaAkhir = hargaPasar - (hargaPasar * potongan / 100);
      
      pajakHTML += `
        <div>
          Pajak mati ${tahunMati} th (${potongan}%): 
          <b>Rp ${hargaAkhir.toLocaleString('id-ID')}</b>
        </div>
      `;
    }
    
    resultDiv.innerHTML += `
      <div class="result-item">
        <strong>${item.nama_motor}</strong><br>
        Tahun: ${item.tahun}<br>
        Harga Pasar: <b>Rp ${hargaPasar.toLocaleString('id-ID')}</b>
        <hr>
        <b>Harga setelah pajak mati</b>
        ${pajakHTML}
      </div>
    `;
  });
});
