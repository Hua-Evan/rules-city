# Gate 5 Navigation Path Audit

此表依目前 `gate5.js`、`gate5-dialogue.js` 與覆寫腳本整理。`quiz1`～`quiz4`、`results`、`proportion`、`fine`、`summary`、`final` 都有核心 render case；未知值由 Runtime fallback 至 `start`。

| 實際 scene | 入口／操作 | 預期下一步 | handler | state／overlay 防護 | render | 靜態檢查 |
|---|---|---|---|---|---|---|
| `start` | 開始 | `intro` | core `action(start)` | preflight 驗證 | 有 | PASS |
| `intro` | 抵達霧川站入口 | `act1` | core `action(intro)` | preflight 驗證 | 有 | PASS |
| `act1` | 對話、A/B/C、結果繼續 | `quiz1` | `safeDialogueNext` / core quiz | 對話防連點 | 有 | PASS |
| `quiz1` | 答題／結果 | 第一幕結果→`act2` | core answer / `safeTransition(act2)` | overlay cleanup | 有 | PASS |
| `act2` | NPC、A/B/C/D、結果繼續 | `quiz2` | `safeDialogueNext` → `safeTransition(quiz2)` | cleanup + registry | 有 | PASS |
| `quiz2` | 答題／前往第三幕 | `results` | core answer / `safeTransition(results)` | overlay cleanup | 有 | PASS |
| `results` | 選 A/B/C | policy result sequence | policy handler | safe result-order fallback | 有 | PASS |
| policy result | 查看下一個／重選 | `quiz3` | policy handler → `safeTransition(quiz3)` | index guard | 有 | PASS |
| `quiz3` | 答題 | `proportion` | core answer | preflight 驗證 | 有 | PASS |
| `proportion` | 前往第四幕 | `fine` | core action | preflight 驗證 | 有 | PASS |
| `fine` | A/B/C、結果繼續 | `quiz4` | immediate-time / core | SafeButton | 有 | PASS |
| `quiz4` | 答題／繼續 | runner | custom runner capture | runner 僅按下後 mount | 有 | PASS |
| runner | 跳躍、換道、成功／失敗 | `summary`／重試 | runner runtime | cancel frame/timer on finish | 自訂 mount | PASS |
| `summary` | 概念整理繼續 | `final` | core action | preflight 驗證 | 有 | PASS |
| `final` | 綜合題 | `complete` | core final answer | preflight 驗證 | 有 | PASS |

## Scene Registry 對照

| Registry | 現行核心 scene |
|---|---|
| `INTRO` | `start` |
| `SCENE1_ENTRY` / `SCENE1_DIALOGUE` / `SCENE1_QUESTION` | `intro` / `act1` / `quiz1` |
| `SCENE2_INTRO` / `SCENE2_QUESTION` | `act2` / `quiz2` |
| `SCENE3_CHOICE` / `SCENE3_QUESTION` / `SCENE3_PROPORTIONALITY` | `results` / `quiz3` / `proportion` |
| `SCENE4_INTRO` / `SCENE4_QUESTION` | `fine` / `quiz4` |
| `SUMMARY` / `FINAL_QUESTION` / `COMPLETE` | `summary` / `final` / `complete` |

Runner 的 frame、鍵盤、觸控與障礙物不會在 app 啟動時 mount；只有按下開始跑酷後才初始化，結束時取消 frame 與 timer。
