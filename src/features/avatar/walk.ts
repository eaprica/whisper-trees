// 陪你的動物走路：位置一變（走過去、GPS 走動），地圖上的人物用走的過去，不是瞬間跳過去。
// 這裡只有計算；畫面在 MapPage（地圖人物）與 TreeFocusView（拉近畫面走到樹下）。
import { distanceMeters, type LngLat } from '../../lib/geo'

/** 畫面上的走路速度（公尺／秒）：比真人快很多，「走過去」不用等太久 */
export const WALK_SPEED_MPS = 15
export const WALK_MIN_MS = 700
export const WALK_MAX_MS = 3500
/** 不到這個距離不用走；超過（換區、GPS 跳點）直接換位置 */
export const WALK_MIN_M = 1
export const WALK_MAX_M = 1500

/** 從 from 走到 to 要幾毫秒；0 = 不用走，直接換位置 */
export function walkDurationMs(from: LngLat, to: LngLat): number {
  const d = distanceMeters(from, to)
  if (d < WALK_MIN_M || d > WALK_MAX_M) return 0
  return Math.round(Math.min(WALK_MAX_MS, Math.max(WALK_MIN_MS, (d / WALK_SPEED_MPS) * 1000)))
}

/** 走到一半的位置；t 是 0～1（直線，距離短，不用算大圓） */
export function walkAt(from: LngLat, to: LngLat, t: number): LngLat {
  const k = Math.min(1, Math.max(0, t))
  return [from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k]
}

export type Facing = 'left' | 'right'

/**
 * 畫面上往哪邊走就面向哪邊（美術面向右，往左走時水平翻轉）。
 * 幾乎是直直往上或往下走（左右差不到 minPx）就維持原來的方向，免得一直翻來翻去。
 */
export function facingFor(fromX: number, toX: number, current: Facing, minPx = 2): Facing {
  const dx = toX - fromX
  if (Math.abs(dx) < minPx) return current
  return dx < 0 ? 'left' : 'right'
}
