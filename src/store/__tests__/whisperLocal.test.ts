import { beforeEach, describe, expect, it, vi } from 'vitest'

// 樹洞只存在這台裝置（whisper-trees:whispers），不放進主資料（whisper-trees:v1），也不上雲端。
// Vitest 的環境沒有 localStorage：每個測試換一個記憶體版的，重新載入 store。
function memoryStorage(): Storage {
  const m = new Map<string, string>()
  return {
    get length() {
      return m.size
    },
    clear: () => m.clear(),
    getItem: (k) => m.get(k) ?? null,
    key: (i) => [...m.keys()][i] ?? null,
    removeItem: (k) => void m.delete(k),
    setItem: (k, v) => void m.set(k, String(v)),
  }
}

let ls: Storage
async function freshStore() {
  vi.resetModules()
  return import('..')
}

beforeEach(() => {
  ls = memoryStorage()
  vi.stubGlobal('localStorage', ls)
})

describe('whispers stay on this device', () => {
  it('are saved under their own key, not in the main state', async () => {
    const store = await freshStore()
    store.addWhisper('AA0000000003', '只有我知道')
    expect(JSON.parse(ls.getItem(store.WHISPER_KEY)!).AA0000000003[0].text).toBe('只有我知道')
    store.createWish({ pitId: 'p9', lngLat: [121, 25], road: 'x', district: '中正區', reasons: ['太曬'], feasibility: 'emptyPit' })
    expect(JSON.parse(ls.getItem('whisper-trees:v1')!).whispers).toEqual({})
    // 重新載入後還在
    const again = await freshStore()
    expect(again.whispersOf('AA0000000003').map((w) => w.text)).toContain('只有我知道')
  })

  it('are wiped by resetAll', async () => {
    const store = await freshStore()
    store.addWhisper('AA0000000004', 'bye')
    store.resetAll()
    expect(ls.getItem(store.WHISPER_KEY)).toBeNull()
    expect(store.whispersOf('AA0000000004')).toEqual([])
  })

  it('old versions kept them in the main state: moved once on load, the rest of the state kept', async () => {
    ls.setItem(
      'whisper-trees:v1',
      JSON.stringify({ checkins: [{ treeId: 'T1', result: 'ok', at: 1 }], whispers: { T1: [{ text: '舊的話', at: 1000 }] } }),
    )
    const store = await freshStore()
    expect(store.whispersOf('T1').map((w) => w.text)).toContain('舊的話')
    expect(JSON.parse(ls.getItem(store.WHISPER_KEY)!).T1).toHaveLength(1)
    const main = JSON.parse(ls.getItem('whisper-trees:v1')!)
    expect(main.whispers).toEqual({})
    expect(main.checkins).toHaveLength(1)
    // 再載入一次不會重複
    await freshStore()
    expect(JSON.parse(ls.getItem('whisper-trees:whispers')!).T1).toHaveLength(1)
  })
})
