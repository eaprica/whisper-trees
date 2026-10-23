import { useId, useState } from 'react'
import { seededInt, weekKey } from '../../lib/seed'
import { useStore, visitedThisWeek } from '../../store'
import { MockTag } from '../../components/ui'
import { IconGlow } from '../../components/icons'

/**
 * 本週微光人數（模擬：每棵樹每週一個固定的數，自己這週打過卡再加 1）。
 * 「?」是 44 px 的按鈕，和句子同一行（句子太長可以折行），說明展開在下面整列。
 * 樹的頁面與地圖拉近畫面共用。
 */
export function GlowLine({ treeId }: { treeId: string }) {
  const [open, setOpen] = useState(false)
  const helpId = useId()
  const visited = useStore((s) => visitedThisWeek(treeId, s))
  const glow = seededInt(`${treeId}:${weekKey()}`, 0, 30) + (visited ? 1 : 0)
  return (
    <div className="glow-line">
      <span className="ornament sm glow" aria-hidden>
        <IconGlow />
      </span>
      <span className="glow-sentence">
        這棵樹本週有 <strong>{glow}</strong> 道微光陪伴
      </span>
      <MockTag />
      <button type="button" className="help-btn" aria-label="微光是什麼？" aria-expanded={open} aria-controls={helpId} onClick={() => setOpen(!open)}>
        <span className="help-dot" aria-hidden>
          ?
        </span>
      </button>
      {open && (
        <p id={helpId} className="glow-help muted small">
          每個在這棵樹旁打卡的人，就是一道微光。只顯示人數，不會顯示任何人說了什麼。
        </p>
      )}
    </div>
  )
}
