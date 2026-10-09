# SUBMISSION

T1：抽离无 DOM 纯函数生成环节链；不计入环节设零时长占位(start===end)并保留 countInTotal，显示"（不计时）"；结束环节=总时长；过滤已存结束占位防重复；formatTime 钳负、跳转 timeLeft 钳于[0,总时长]。

T2：Web Audio 合成约 220ms 短音(无外部资源)；自然跨入、"下一环节"、下拉跳转均提示并按索引去重；新增"环节切换提示音"复选框，完整复用 displaySettings 持久化；AudioContext 仅首次手势创建；同开关控制闪烁高亮。

T3：新增 package.json 用 node --test(零依赖)；导出守卫暴露纯函数、测试内最小 DOM 桩；覆盖 formatTime、calculateEndTime、validateAndFormatTime、转换函数及最低用例集与防御用例。
