# 樹種插畫對照

地圖點樹後的拉近畫面，中間的大樹依樹種換成這裡的插畫；沒列在這裡的樹種用通用的 `tree-focus`。程式對照在 `src/features/map/speciesArt.ts`（有單元測試），檔案在 `public/assets/trees/<檔名>.webp`（透明背景、高 800 px）。

棵數取自 `public/data/species.json`（臺北市行道樹與公園樹）。24 種合計約佔全市登錄樹木的 70%。

| 中文名 | 英文名 | 學名 | 檔名 | 棵數 | 美術來源 |
|---|---|---|---|---:|---|
| 榕樹 | Chinese banyan | *Ficus microcarpa* | `ficus_microcarpa` | 18,643 | ChatGPT |
| 茄苳 | Bishop wood | *Bischofia javanica* | `bischofia_javanica` | 14,127 | ChatGPT |
| 樟樹 | Camphor tree | *Camphora officinarum* | `camphora_officinarum` | 11,848 | Gemini |
| 楓香 | Formosan sweetgum | *Liquidambar formosana* | `liquidambar_formosana` | 10,395 | ChatGPT |
| 臺灣欒樹 | Taiwan golden rain tree | *Koelreuteria elegans* subsp. *formosana* | `koelreuteria_elegans` | 8,782 | Gemini |
| 黑板樹 | Blackboard tree | *Alstonia scholaris* | `alstonia_scholaris` | 7,565 | Gemini |
| 白千層 | Paperbark tree | *Melaleuca quinquenervia* | `melaleuca_quinquenervia` | 5,576 | Gemini |
| 小葉欖仁 | Madagascar almond | *Terminalia mantaly* | `terminalia_mantaly` | 4,833 | Gemini |
| 水黃皮 | Pongam tree | *Pongamia pinnata*（異名 *Millettia pinnata*） | `pongamia_pinnata` | 3,908 | Gemini |
| 大花紫薇 | Queen's crape myrtle | *Lagerstroemia speciosa* | `lagerstroemia_speciosa` | 2,844 | Gemini |
| 大王椰子 | Royal palm | *Roystonea regia* | `roystonea_regia` | 2,726 | Gemini |
| 光蠟樹 | Griffith's ash | *Fraxinus griffithii* | `fraxinus_griffithii` | 2,671 | Gemini |
| 阿勃勒 | Golden shower tree | *Cassia fistula* | `cassia_fistula` | 2,479 | Gemini |
| 苦楝 | Chinaberry | *Melia azedarach* | `melia_azedarach` | 2,432 | Gemini |
| 木棉 | Red silk-cotton tree | *Bombax ceiba* | `bombax_ceiba` | 2,119 | Gemini |
| 垂榕 | Weeping fig | *Ficus benjamina* | `ficus_benjamina` | 2,022 | Gemini |
| 福木 | Fukugi tree | *Garcinia subelliptica* | `garcinia_subelliptica` | 1,982 | Gemini |
| 蒲葵 | Chinese fan palm | *Livistona chinensis* | `livistona_chinensis` | 1,781 | Gemini |
| 大葉山欖 | Formosan nato tree | *Palaquium formosanum* | `palaquium_formosanum` | 473 | ChatGPT |
| 無患子 | Soapberry | *Sapindus mukorossi* | `sapindus_mukorossi` | 358 | ChatGPT |
| 桂花 | Sweet osmanthus | *Osmanthus fragrans* | `osmanthus_fragrans` | 284 | ChatGPT |
| 麵包樹 | Breadfruit | *Artocarpus altilis* | `artocarpus_altilis` | 124 | ChatGPT |
| 銀樺 | Silky oak | *Grevillea robusta* | `grevillea_robusta` | 73 | ChatGPT |
| 櫻花類（櫻花、山櫻花、吉野櫻、富士櫻、河津櫻、八重櫻、寒櫻、昭和櫻、大漁櫻） | Cherry | *Prunus* spp. | `prunus` | 4,789 | ChatGPT |

- ChatGPT 的 9 張：愛皮卡請 ChatGPT 依她的插畫風格產生；榕樹由 ChatGPT 去背，其餘由 Claude 從九宮格原圖切出、去背並以 Real-ESRGAN 放大。
- Gemini 的 15 張：愛皮卡請 Google Gemini 產生，Claude 去背。
- 美術保留所有權利，不在 MIT 授權範圍內（見 README「授權」與 `NOTICE`）。

## 新增一個樹種

1. 透明背景的 PNG 母檔交給設計保管；App 用的是裁掉空白、高 800 px 的 WebP，存成 `public/assets/trees/<學名小寫底線>.webp`（和 `material/raw/inat/` 的資料夾名稱一致）。
2. 在 `speciesArt.ts` 的對照表加一筆（中文名用開放資料的寫法）。
3. 在這份表加一列，跑 `npm test`。
