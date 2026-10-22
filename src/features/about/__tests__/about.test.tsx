import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import AboutPage from '../../../pages/AboutPage'
import { OTHER_CONTRIBUTORS, TEAM } from '../about'

const html = renderToStaticMarkup(
  <MemoryRouter>
    <AboutPage />
  </MemoryRouter>,
)

describe('關於曦語', () => {
  it('隊員卡 4 張，圓形徽章的字是 愛 R +1 薄', () => {
    expect(TEAM).toHaveLength(4)
    expect(TEAM.map((m) => m.initial)).toEqual(['愛', 'R', '+1', '薄'])
    expect(html.match(/data-testid="team-member"/g)).toHaveLength(4)
    for (const m of TEAM) {
      expect(html).toContain(m.name)
      expect(html).toContain(m.title.replace('&', '&amp;'))
    }
  })
  it('職稱、本案做的事與專長三行', () => {
    expect(TEAM.map((m) => [m.name, m.title, m.role])).toEqual([
      ['愛皮卡', '概念發起人', '發想曦語的遊戲概念與世界觀，第一人稱玩家角色設計，UI/UX 介面設計'],
      ['Ray', '軟體工程師', '整理臺北市樹木開放資料，做出這個網頁 Demo'],
      ['+1', '軟韌體工程師', undefined],
      ['薄荷', '後端工程師・專案經理', '評估樹牌打卡方案，畫出遊戲操作流程'],
    ])
    for (const m of TEAM) expect(Boolean(m.skills)).toBe(Boolean(m.role))
    // 自我介紹還沒定的人不留空白段落
    expect(html).not.toMatch(/<p class="team-role"><\/p>|<p class="muted small team-skills"><\/p>/)
    expect(html).not.toContain('佳宜')
  })
  it('其他協力人員只列名字，沒有職稱與介紹', () => {
    expect(OTHER_CONTRIBUTORS).toEqual(['Mars／瑪斯', '克洛伊伊'])
    expect(html).toContain('其他協力人員')
    expect(html).toMatch(/data-testid="team-others"[^>]*>Mars／瑪斯・克洛伊伊</)
    for (const s of ['計畫管理師', 'UI/UX 設計師', '公園處圖資', 'Figma']) expect(html).not.toContain(s)
  })
  it('一般的「台北」寫成「臺北」，只有專有名稱保留「台北」', () => {
    const rest = html.replace('台北市政 Debug 松', '').replace('台北市網路公祭網站', '')
    expect(rest).not.toContain('台北')
    expect(html).toContain('臺北')
  })
  it('頁尾有溫和的下一步：去掃一棵樹（/scan）與回地圖（/）', () => {
    expect(html).toMatch(/href="\/scan"[^>]*>去掃一棵樹/)
    expect(html).toMatch(/href="\/"[^>]*>回地圖/)
  })
  it('名字、品牌精神與雙向含義', () => {
    expect(html).toContain('「曦」是清晨第一道陽光，音近「細語」：白天走到樹下，輕聲說心事。')
    expect(html).toContain('xī yǔ')
    expect(html).toContain('曦光細語，蘊憩身心')
    expect(html).toContain('Trees that whisper')
    expect(html).toContain('Trees you whisper to')
    for (const s of ['慢下來', '無壓陪伴', '共好城市']) expect(html).toContain(s)
    expect(html).toContain('6 位隊員・設計 2・工程 3・計畫管理 1')
    expect(html).toContain('台北市政 Debug 松・題目 #1 把樹種回來')
  })
  it('返回「我的」，沒有聯絡方式', () => {
    expect(html).toContain('href="/me"')
    expect(html).not.toMatch(/@|mailto:|tel:|https?:\/\//)
  })
})
