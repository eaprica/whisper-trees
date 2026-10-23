import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { SPECIES_WITH_ART, speciesArtIsWide, speciesArtSlug, speciesArtUrl } from '../speciesArt'

describe('speciesArt', () => {
  it('maps species with an illustration to its file', () => {
    expect(speciesArtSlug('榕樹')).toBe('ficus_microcarpa')
    expect(speciesArtSlug('茄苳')).toBe('bischofia_javanica')
    expect(speciesArtSlug('樟樹')).toBe('camphora_officinarum')
    expect(speciesArtSlug('臺灣欒樹')).toBe('koelreuteria_elegans')
    expect(speciesArtSlug('山櫻花')).toBe('prunus')
    expect(speciesArtUrl('桂花')).toMatch(/assets\/trees\/osmanthus_fragrans\.webp$/)
  })

  it('falls back (null) for species without an illustration', () => {
    expect(speciesArtSlug('鳳凰木')).toBeNull()
    expect(speciesArtSlug('未知')).toBeNull()
    expect(speciesArtSlug('')).toBeNull()
    expect(speciesArtUrl(undefined)).toBeNull()
  })

  it('wide art is only the banyan', () => {
    expect(speciesArtIsWide('榕樹')).toBe(true)
    expect(speciesArtIsWide('茄苳')).toBe(false)
    expect(speciesArtIsWide('鳳凰木')).toBe(false)
  })

  it('every mapped file exists in public/assets/trees', () => {
    for (const sp of SPECIES_WITH_ART) {
      expect(existsSync(`public/assets/trees/${speciesArtSlug(sp)}.webp`), sp).toBe(true)
    }
  })
})
