/**
 * Format angka ke format mata uang Rupiah Indonesia
 * @param {number} num
 * @returns {string} contoh: "Rp 25.000"
 */
export const formatRupiah = (num) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num)
