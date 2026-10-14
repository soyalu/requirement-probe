import { test, expect } from '@playwright/test';

test('工作台展示三栏及模拟数据提示', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '业务问题证据与假设验证工作台' })).toBeVisible();
  await expect(page.getByText('演示数据 · 无真实客户信息')).toBeVisible();
  await expect(page.getByRole('heading', { name: '原始资料与证据' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '业务问题与原因假设' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '核验计划与客户共识' })).toBeVisible();
});

test('证据查询和来源详情可用', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: '搜索证据' }).fill('E-017');
  const evidenceList = page.getByRole('region', { name: '证据资料列表' });
  await expect(evidenceList.getByRole('button', { name: /E-017/ })).toBeVisible();
  await expect(evidenceList.getByRole('button', { name: /E-012/ })).toHaveCount(0);
  await evidenceList.getByRole('button', { name: /E-017/ }).click();
  await expect(page.getByRole('dialog', { name: '证据来源' })).toBeVisible();
  await expect(page.getByRole('dialog', { name: '证据来源' }).getByText('访谈记录 §05')).toBeVisible();
});

test('假设切换、核验任务创建与状态更新', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /H-02.*系统字段关联不足/ }).click();
  await expect(page.getByText(/接口字段字典/)).toBeVisible();
  await page.getByRole('button', { name: /生成核验建议/ }).click();
  await expect(page.getByText('补充核验：系统字段关联不足')).toBeVisible();
  await page.getByRole('button', { name: '标记完成 补充核验：系统字段关联不足' }).click();
  await expect(page.getByRole('button', { name: '撤销完成 补充核验：系统字段关联不足' })).toBeVisible();
});

test('需求卡能导出，客户确认明确标注模拟', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /生成客户确认草稿/ }).click();
  await expect(page.getByText('确认草稿待复核').first()).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: /导出需求卡/ }).click();
  expect((await download).suggestedFilename()).toContain('问题定义卡');
});
