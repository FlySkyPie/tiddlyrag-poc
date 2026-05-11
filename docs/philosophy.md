# 技術決策與哲學

這裡是一些技術決策的過程以及背後的哲學。

## Why BT (Behavior Tree)?

LangChain 是 LLM 領域十分熱門的封裝函式庫，它對不同的 LLM 供應商（如 OpenAI, Anthropic, Google...）進行抽象封裝，並提供諸如 Agent、Tools 等主流 LLM 模式的實用工具與封裝。然而若從「OpenAI-Compatible API 為事實標準」的角度來看，供應商的抽象就顯得有點無用，加上筆者的立場是「開放權重模型本位主義」，因此閉源模型與特規 API 皆在考慮範圍之外。

LangChain 的 Agent 模式將流程控制權完全交給 LLM 因此造成了不可預測性，於是導入了 LangGraph 能夠預先建立某些固定的節點來大幅提高 LLM 流程的可控性。然而其本質就是一個有限狀態機 (FSM, Finite-State Machine)，在複雜情況行為會變得不容易理解，而且缺乏擴展彈性。

行為樹 (BT) 因為其穩定可靠的特性在遊戲產業已經行之有年，比起 FSM 具有更高的可控性、可觀測性（易於理解），更關鍵的價值來自於流程架構以及行為實做的解偶，透過適當的生態系支持便可允許由非程式背景的人員設計與調試流程架構，實現職責分離。在複雜的 AI 應用情境被視為 FSM 的實質後繼者是產業的普遍共識。

在遊戲產業亦有其他被廣泛使用的演算法，諸如 Utility AI、GOAP (Goal Oriented Action Planning)、HTN (Hierarchical Task Network)...，但是這類算法的目的更著重於啟發式、有機性...，也就是讓演算法表現的更自然但是更不可預測，這在遊戲中是理所當然的需求，然而對於注重再現性、可控性、可靠性、可預測性的資料領域產業的應用反而是負面影響。

綜合上述，最終考慮使用行為樹，而不是 LLM 開發圈主流的 LangChain 生態，並且排除遊戲開發圈的其他經典 AI 演算法。

## Why ECS (Entity-Component-System)?

BT 的行為節點本身是無狀態的，持久化的職責通常以黑板模式 (Blackboard Pattern) 實踐，但是其本質是一個巨大的 Key-Value 表，實務上就像是一個巨大的全域變數，容易讓資料變得凌亂難以管理。

ECS 遵守和 BT 類似的架構哲學：資料與邏輯分離，導致兩者的相性異常的好，把 ECS 的 System 換成 BT 或把 BT 的黑板換成 EC在架構上都不太會破壞原本的職責，而且能融合兩者的優點並消弭一些原本缺點。

ECS 要求預先定義 Component，作為黑板的替代方案這麼做可以大幅的約束資料的複雜性，而 Entity 的特性也允許繼承黑板模式那種「寫入大量不確定有沒有用資料」的功能，ECS 遍歷資料的模式也比黑板模式更能處理「大量但是類似的資料」。System 原本是為了高度動態以及高併發的運算邏輯而存在的，在單一 Agent、單一 BT 的情況下並沒有存在的必要，但是同時架構上允許未來需求變複雜的時候再次引入 System 組件。

## Why Mistreevous and Miniplex?

| GitHub 連結 | 星星數量 (Stars) |
| :--- | :--- |
| [hmans/miniplex](https://github.com/hmans/miniplex) | 1k ⭐ |
| [nikkorn/mistreevous](https://github.com/nikkorn/mistreevous) | 132 ⭐ |

Mistreevous 和 Miniplex 兩個都不是特別有名的函式庫，即便是在各自的領域 (BT/ECS) 也不是最有聲望的那一個，但是它們有一些相同的特性讓我選擇了它們，更重要的是這些特性讓這個組合可能實現。

Mistreevous 是 Typescript 友善的 BT 函式庫，使用基於 Function （相對於 Object） 的實作，它不關心開發者如何實現資料儲存。大部分行為樹函式庫都會內建黑板樹，但是它沒有；經典的實現多是基於 Object 的，但是它也不是。另一方面它是我調查所有 BT Javascript 庫中，唯一內建 Promise 處理的函式庫，它能夠自動將非同步函數 (Promise) 轉換成 BT 中 Running。

Miniplex 是 Typescript 友善的 ECS 函式庫，專注於處理 Entity/Component 管理，它不關心開發者如何實現 System。大部分 ECS 庫都會實現 System，但是它沒有。另一方面，它實現了 DoP (Data-oriented programming) 但是沒有實現 DoD (Data-oriented design)，也就是它讓開發者在架構上用 ECS 的邏輯去思考資料與職責分離，但是底層實做並不像經典的 ECS 有進行高密度的資料排列，例如 SoA (Structure of Arrays)。

一個是不內建黑板的 BT；令一個是不內建 System 的 ECS。與其說是我先有架構的構想，不如說是先看到這兩個函式庫才想到這個架構組合的。

## Why Clean Architecture (-ish)?

先聲明，我並不打算 100% 的遵守乾淨架構的邏輯，只是建立抽象的程度對於不怎麼建立抽象的開發者來說，大概跟乾淨架構一樣囉唆。

直覺上我想避免使用了 Mistreevous 和 Miniplex 的程式碼耦合在一起，這裡有兩個理由。第一個直覺是來自於這兩個函式庫的個性，正如我先前所說的，它們在各自的領域都是特立獨行的存在，我不敢保證當這兩個函式庫深度耦合交互作用之後會不會災難性的副作用。第二個理由是認知負荷，BT 和 ECS 任一個對於普通的後端開發者而言都是相對陌生的概念，而且理解起來會伴隨大量的認知負荷，如果兩種系統不做適當的職責分離耦合在一起，造成的認知負荷會大幅度的提高並增加後進開發者接手的門檻。

撇開直覺不談，Mistreevous 和 Miniplex 都是相對冷門的函式庫，而且維護已經不太活躍，只會偶爾更新仰賴的版本修復一些上游漏洞，從理性的角度來考慮也應該建立適度的抽象避免跟它們直接耦合。

再來是另外一個因子：NestJS，我的程式會運行在 NestJS 建構起來的框架，然而 NestJS 所假設的世界是大部分實例都是無狀態的單例，透過 DI 把各種邏輯串在一起，中間再由 Request/Response 貫穿整個流程。在 NestJS 的框架內它不會主動銷毀 Request/Response （以及生命週期相關連） 以外的實例，因此 Agent (ECS/BT) 的實作必須徹底的跟 NestJS 的框架解偶，只有在 WebSocket 相關的整合點透過抽象界面有最小限度接觸。

## Why Inspector (Visualizer)?

對於 POC 來說，準備一個視覺化工具似乎有點過頭了，但是事實是這樣的，BT 是一個複雜的運算結構，它不是單純的 Request/Response 邏輯，僅靠文字日誌難以理解與除錯。而在 POC 中，它的位置遠在 HTTP 界面之後的深處（WebSocket → Session 兼容層 → ECS/BT），缺乏對應的工具會造成很難讓開發者理解自己現在正在寫什麼。

事實是，BT 的一大特性就是透過職責分離，讓非工程背景的人也能在視覺化工具中觀察並設計 BT，這也是我進行技術決策的一大考量，最初我甚至考慮使用 [BehaviorTree.CPP](https://github.com/BehaviorTree/BehaviorTree.CPP)。BehaviorTree.CPP 的 GitHub 星星有 4k 之多，而 C++ 的開發者大多比較含蓄，跟 Javascript 的生態相比它們的星星價值比較高，並且它把自己定位在機器人領域的 BT 解決方案，有著厚實的剛性需求作為基礎。最重要的是它的生態系內建了名為 [Groot](https://github.com/BehaviorTree/Groot) 的視覺化工具，提供了瀏覽編輯 BT、回放日誌與實時程式...等功能。

可惜的是 BehaviorTree.CPP 缺乏原生的 Javascript 移植，Groot 也已經不再維護，Groot2 是需要訂閱制付費的閉源軟體。不然我原本還想就算不使用 BehaviorTree.CPP 也要根據 Groot 的 ZeroMQ 界面在 Javascript 實做一個兼容層，直接使用 Groot 作為視覺化工具。

慶幸的是 Mistreevous 的作者有實作[視覺化工具](https://github.com/nikkorn/mistreevous-visualiser)並且目前是 Source Available，只要實做簡單的機制讓 BT 從後端透過 WebSocket 把狀態往前送，再把資料存進 visualiser 的狀態就能實現實時觀察了，修改程式碼的工作量並不會太大。
