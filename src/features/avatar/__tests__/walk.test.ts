import { describe, expect, it } from 'vitest'
import type { LngLat } from '../../../lib/geo'
import { distanceMeters, offsetNorth } from '../../../lib/geo'
import { facingFor, walkAt, walkDurationMs, WALK_MAX_MS, WALK_MIN_MS } from '../walk'
import { ANIMALS } from '../animals'
import { ASSETS } from '../../../assets'

const a: LngLat = [121.5287, 25.0335]

describe('陪你的動物走路', () => {
  it('太近不用走、太遠直接換位置，其他照距離算時間（有上下限）', () => {
    expect(walkDurationMs(a, a)).toBe(0)
    expect(walkDurationMs(a, offsetNorth(a, 0.5))).toBe(0)
    expect(walkDurationMs(a, offsetNorth(a, 3))).toBe(WALK_MIN_MS)
    expect(walkDurationMs(a, offsetNorth(a, 30))).toBeCloseTo(2000, -1)
    expect(walkDurationMs(a, offsetNorth(a, 1000))).toBe(WALK_MAX_MS)
    expect(walkDurationMs(a, offsetNorth(a, 2000))).toBe(0)
  })
  it('走到一半的位置在兩點連線上，t 超出 0～1 就停在端點', () => {
    const b = offsetNorth(a, 40)
    expect(distanceMeters(a, walkAt(a, b, 0.5))).toBeCloseTo(20, 0)
    expect(walkAt(a, b, -1)).toEqual(a)
    expect(walkAt(a, b, 2)).toEqual(b)
  })
  it('往左走面向左、往右走面向右，幾乎直上直下就維持原方向', () => {
    expect(facingFor(100, 60, 'right')).toBe('left')
    expect(facingFor(60, 100, 'left')).toBe('right')
    expect(facingFor(100, 101, 'left')).toBe('left')
  })
  it('有走路美術的只有臺灣黑狗，而且素材清單裡有它', () => {
    expect(ANIMALS.filter((x) => x.walkArt).map((x) => [x.id, x.walkArt])).toEqual([['taiwan-dog', 'avatar-taiwan-dog-walk']])
    expect(ASSETS.some((x) => x.id === 'avatar-taiwan-dog-walk')).toBe(true)
  })
})
