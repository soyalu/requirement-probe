# Requirement Probe · 业务需求探针

面向 FDE 客户现场的**业务问题发现—证据关联—原因假设—核验任务—需求共创**工具。

## M1：可交互前端 PoC

- React + TypeScript + Vite；主题蓝 `#1790D0`
- 三栏工作台：原始证据、问题与原因假设、核验任务与客户共识
- 证据分类与搜索、来源定位、假设切换、支持/冲突证据展示
- 生成及完成模拟核验任务、生成确认草稿、模拟确认、导出需求定义卡
- 全部为**演示数据**，当前无后端、无真实模型推断和数据持久化

## 启动

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run test:e2e  # 需要先执行 npx playwright install chromium
```

## 设计边界

M1 不接入客户生产系统、不使用真实资料，也不建设专用 Agent 平台。模型接入及证据质量评估将在后续里程碑实施。完整任务说明参见 [M1 验收文档](docs/M1-acceptance.md)。

**安全提醒：** 当前仓库为 Public。禁止提交真实客户资料、敏感日志、API Key、内部地址或未经授权的图片。

主开发分支：`dev`；`main` 作为稳定基线。
