import type { Evidence, Hypothesis, Problem, Requirement, VerificationTask } from './models';

export function buildRequirementMarkdown(input: {
  problem: Problem;
  hypothesis: Hypothesis;
  relatedEvidence: Evidence[];
  tasks: VerificationTask[];
  requirement: Requirement;
  confirmationLabel: string;
}): string {
  const { problem, hypothesis, relatedEvidence, tasks, requirement, confirmationLabel } = input;
  const evidenceLines = relatedEvidence.map(item => '- ' + item.id + ' [' + item.source + ' / ' + item.locator + '] ' + item.text).join('\n');
  const taskLines = tasks.map(item => '- [' + (item.status === 'done' ? 'x' : ' ') + '] ' + item.title + '：' + item.description).join('\n');
  return [
    '# 业务问题定义卡（模拟数据）',
    '> 此文档为 PoC 演示输出，不代表真实客户已确认。',
    '',
    '## 业务问题', problem.id + ' · ' + problem.title,
    problem.description,
    '',
    '## 当前原因假设', hypothesis.id + ' · ' + hypothesis.title,
    hypothesis.summary,
    '',
    '## 原始证据', evidenceLines || '暂无关联证据',
    '',
    '## 关键证据缺口', hypothesis.gap,
    '',
    '## 核验任务', taskLines || '尚未创建',
    '',
    '## 目标及边界', requirement.businessGoal,
    '- 衡量指标：' + requirement.measurement.join('、'),
    '- 验证范围：' + requirement.scope,
    '',
    '## 确认状态', confirmationLabel,
    '',
  ].join('\n');
}

export function downloadText(filename: string, value: string) {
  const blob = new Blob([value], { type: 'text/markdown;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const node = document.createElement('a');
  node.href = href;
  node.download = filename;
  document.body.appendChild(node);
  node.click();
  node.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1500);
}
