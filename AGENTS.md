# Requirement Probe 工程约定

## 项目目标
将客户现场模糊诉求转化为有证据支撑、可核验、可确认的需求定义；避免把模型假设当作客户事实。

## M1 技术栈
React + TypeScript + Vite，模拟业务数据，无后端。主题色 #1790D0。

## 工程规范
- 保持证据 Evidence、业务问题 Problem、原因假设 Hypothesis、验证任务 VerificationTask、确认需求 Requirement 五个模型分离。
- 每条证据必须保留来源定位字段；假设必须与已验证事实区分。
- 任何客户确认动作在 Demo 中都必须明确标注“模拟”，禁止伪装为真实客户确认。
- 所有交互必须可用；不要采用没有操作逻辑的假按钮。
- 优先沿用当前组件和 CSS，不擅自整体重设计。
- 修改后运行 npm run typecheck、npm run build；有浏览器环境时运行 npm run test:e2e。
- 不得通过跳过断言、删除测试的方式处理失败。
- 不要提交真实客户数据、令牌、私有 API 地址或内部系统内容。
