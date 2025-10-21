// utils/number.ts
export function formatThousands(
  value: number | string,
  locale: string = 'zh-TW',           // 台灣用逗號分隔
  opts: Intl.NumberFormatOptions = {} // 需要小數位可透過這裡控制
): string {
  if (value === null || value === undefined || value === '') return '';
  // 若後端回來是字串，先轉數字；轉換失敗就原樣回傳
  const num = typeof value === 'string' ? Number(value.replace(/,/g, '')) : value;
  if (!Number.isFinite(num)) return String(value);
  return new Intl.NumberFormat(locale, opts).format(num);
}
