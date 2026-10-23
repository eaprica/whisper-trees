/**
 * 拉近畫面中間的大樹：有畫好插畫的樹種，換成該樹種的插畫；其他樹種沿用通用的 tree-focus 美術。
 * 插畫在 public/assets/trees/<slug>.webp（透明背景、高 800 px，由愛皮卡交的 PNG 裁切壓縮而來）。
 */

/** 樹種名稱（開放資料的寫法）→ 插畫檔名 */
const SPECIES_ART: Record<string, string> = {
  榕樹: 'ficus_microcarpa',
  茄苳: 'bischofia_javanica',
  楓香: 'liquidambar_formosana',
  無患子: 'sapindus_mukorossi',
  大葉山欖: 'palaquium_formosanum',
  桂花: 'osmanthus_fragrans',
  麵包樹: 'artocarpus_altilis',
  銀樺: 'grevillea_robusta',
  // 櫻花類共用一張
  櫻花: 'prunus',
  山櫻花: 'prunus',
  吉野櫻: 'prunus',
  富士櫻: 'prunus',
  河津櫻: 'prunus',
  八重櫻: 'prunus',
  寒櫻: 'prunus',
  昭和櫻: 'prunus',
  大漁櫻: 'prunus',
}

/** 這個樹種有沒有自己的插畫；有的話回傳檔名（不含副檔名），沒有回傳 null */
export function speciesArtSlug(species: string | null | undefined): string | null {
  if (!species) return null
  return SPECIES_ART[species.trim()] ?? null
}

/** 插畫網址；沒有插畫的樹種回傳 null（呼叫端改用通用的 tree-focus） */
export function speciesArtUrl(species: string | null | undefined): string | null {
  const slug = speciesArtSlug(species)
  return slug ? `${import.meta.env.BASE_URL}assets/trees/${slug}.webp` : null
}

/** 橫寬的插畫（榕樹）：在拉近畫面放大、底部對齊，樹冠才接得住上方的按鈕 */
const WIDE = new Set(['ficus_microcarpa'])

export function speciesArtIsWide(species: string | null | undefined): boolean {
  const slug = speciesArtSlug(species)
  return slug !== null && WIDE.has(slug)
}

/** 有插畫的樹種（測試與文件用） */
export const SPECIES_WITH_ART = Object.keys(SPECIES_ART)
