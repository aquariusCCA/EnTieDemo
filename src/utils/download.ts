/**
 * 下載 Blob 為檔案
 * @param blob  Binary data
 * @param filename  完整檔名 (含副檔名)
 */
export function downloadBlob (blob: Blob, filename: string) {
  console.log('downloadBlob origin =', window.location.origin);
  const url = URL.createObjectURL(blob)
  const a   = document.createElement('a')
  a.href        = url
  a.download    = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  // 延遲撤銷，確保瀏覽器已開始讀取
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}
