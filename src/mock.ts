import type { Evidence, Hypothesis, Problem, Requirement, VerificationTask } from './models';

export const problem: Problem = {
  id: 'P-03',
  title: '跨系统查询与重复整理影响工单预处理',
  description: '一线操作存在多系统切换，但尚无充分耗时分布证据，不能认定其为主要瓶颈。',
  priority: 'high',
  status: 'under_review',
};

export const evidence: Evidence[] = [
  { id: 'E-012', kind: 'interview', text: '“处理工单时，通常需要分别打开工单系统、告警平台和设备资源页面。”', source: '一线人员 A · 模拟访谈', locator: '访谈记录 §03', reviewed: true },
  { id: 'E-008', kind: 'observation', text: '典型故障处理过程中，观察到多次切换系统页面及重复复制设备标识。', source: '模拟现场跟班记录', locator: '操作记录 00:18', reviewed: true },
  { id: 'E-015', kind: 'record', text: '28 条模拟工单中，部分工单存在较长的信息查询等待时间，仍需分类型统计。', source: '模拟工单样本集合 A', locator: '数据表 / 样本 15', reviewed: false },
  { id: 'E-017', kind: 'interview', text: '主管认为派单等待是主要瓶颈，与一线人员的查询耗时反馈存在差异。', source: '主管 B · 模拟访谈', locator: '访谈记录 §05', reviewed: false },
  { id: 'E-006', kind: 'observation', text: '两位操作人员处理同一故障类型时采用了不同的查询顺序与处置习惯。', source: '模拟现场跟班记录', locator: '操作记录 00:42', reviewed: true },
  { id: 'E-002', kind: 'interview', text: '新人表示历史工单查询路径较长，希望在统一入口查看相关信息。', source: '一线人员 C · 模拟访谈', locator: '访谈记录 §02', reviewed: false },
];

export const hypotheses: Hypothesis[] = [
  { id: 'H-01', title: '信息入口分散', summary: '信息分布于多个系统，可能导致频繁切换和重复查询。', gap: '缺少按故障类别拆分的处理耗时记录，无法判断跨系统查询是否为主要瓶颈。', links: [{ evidenceId: 'E-012', role: 'support' }, { evidenceId: 'E-008', role: 'support' }, { evidenceId: 'E-017', role: 'conflict' }] },
  { id: 'H-02', title: '系统字段关联不足', summary: '工单、告警与资源标识可能缺少可靠关联。', gap: '尚未取得授权的接口字段字典、关联成功率和失败样本。', links: [{ evidenceId: 'E-008', role: 'support' }, { evidenceId: 'E-015', role: 'conflict' }] },
  { id: 'H-03', title: '处置经验不一致', summary: '人员经验和操作顺序差异可能影响处理时长。', gap: '尚未核对现行 SOP，也未对比不同熟练度人员的同类任务耗时。', links: [{ evidenceId: 'E-006', role: 'support' }, { evidenceId: 'E-002', role: 'support' }] },
];

export const initialTasks: VerificationTask[] = [
  { id: 'V-01', hypothesisId: 'H-01', title: '跟班记录三类典型故障', description: '对比查询、判断、派单环节的耗时构成', owner: '现场观察 · FDE', status: 'todo' },
  { id: 'V-02', hypothesisId: 'H-01', title: '取得脱敏工单处理日志', description: '核对任务分布、查询次数和异常处置情况', owner: '数据核验 · 运维负责人', status: 'todo', requiresAuthorization: true },
  { id: 'V-03', hypothesisId: 'H-01', title: '与主管复核业务指标', description: '确定预处理耗时的统计口径和目标边界', owner: '业务访谈 · 综调主管', status: 'todo' },
];

export const requirement: Requirement = {
  id: 'R-01',
  problemId: problem.id,
  businessGoal: '减少多系统重复查询并改善典型故障工单预处理效率（待确认）',
  measurement: ['平均预处理耗时', '跨系统查询次数', '一次处理成功率'],
  scope: '优先验证工单信息聚合与辅助处置建议；不执行真实派单。',
  assumptions: ['需验证查询耗时是否为主要瓶颈', '需确认现有系统接口与数据完整性'],
  confirmationStatus: 'unconfirmed',
};
