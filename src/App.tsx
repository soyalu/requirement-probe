import { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, BadgeCheck, BookOpen, Check, CheckCircle2,
  ChevronRight, CircleHelp, ClipboardCheck, ClipboardList, Clock3, Database, Download,
  FileCheck2, FileText, FolderSearch, GitBranch, Layers3, Link2, ListChecks,
  MessageSquare, Plus, Radar, Search, ShieldCheck, Sparkles, Target, Users, X,
} from 'lucide-react';
import { evidence, hypotheses, initialTasks, problem, requirement } from './mock';
import type { ConfirmationStatus, EvidenceKind, VerificationTask } from './models';
import { buildRequirementMarkdown, downloadText } from './export';

type Filter = 'all' | EvidenceKind;
const filterOptions: { key: Filter; title: string }[] = [
  { key: 'all', title: '全部' }, { key: 'interview', title: '访谈' },
  { key: 'observation', title: '观察' }, { key: 'record', title: '数据' },
];
const kindLabel: Record<EvidenceKind, string> = { interview: '业务访谈', observation: '现场观察', record: '工单样本' };

export default function App() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState('E-012');
  const [selectedHypothesis, setSelectedHypothesis] = useState('H-01');
  const [tasks, setTasks] = useState<VerificationTask[]>(initialTasks);
  const [confirmation, setConfirmation] = useState<ConfirmationStatus>('unconfirmed');
  const [notice, setNotice] = useState('');
  const [showSource, setShowSource] = useState(false);

  const hypothesis = hypotheses.find(h => h.id === selectedHypothesis) ?? hypotheses[0];
  const activeEvidence = evidence.find(e => e.id === selectedEvidence) ?? evidence[0];
  const visibleEvidence = useMemo(() => evidence.filter(e =>
    (filter === 'all' || e.kind === filter) &&
    (e.id + e.text + e.source).toLowerCase().includes(query.trim().toLowerCase())
  ), [filter, query]);
  const linkedEvidence = hypothesis.links.map(link => ({
    link, item: evidence.find(e => e.id === link.evidenceId),
  })).filter((entry): entry is { link: typeof entry.link; item: NonNullable<typeof entry.item> } => Boolean(entry.item));
  const completeCount = tasks.filter(t => t.status === 'done').length;
  const confirmationLabel = confirmation === 'simulated' ? '模拟客户已确认' : confirmation === 'draft' ? '确认草稿待复核' : '尚未确认';

  function createTask() {
    const existing = tasks.some(t => t.title === '补充核验：' + hypothesis.title);
    if (existing) {
      setNotice('该假设已有补充核验任务，请先查看任务清单。');
      return;
    }
    const next: VerificationTask = {
      id: 'V-' + String(tasks.length + 1).padStart(2, '0'),
      hypothesisId: hypothesis.id,
      title: '补充核验：' + hypothesis.title,
      description: hypothesis.gap,
      owner: '待分配 · FDE',
      status: 'todo',
    };
    setTasks(current => [...current, next]);
    setConfirmation('unconfirmed');
    setNotice('已创建核验建议，需 FDE 核实并安排执行。');
  }
  function toggleTask(id: string) {
    setTasks(current => current.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t));
    setConfirmation('unconfirmed');
  }
  function progressConfirmation() {
    if (confirmation === 'unconfirmed') {
      setConfirmation('draft');
      setNotice('已形成客户确认材料草稿。真实项目应经业务负责人复核。');
      return;
    }
    if (confirmation === 'draft') {
      if (completeCount < tasks.length) {
        setNotice('仍有未完成的核验任务；请先完成核验后再模拟确认。');
        return;
      }
      setConfirmation('simulated');
      setNotice('仅模拟确认完成：不代表真实客户已授权或签字。');
      return;
    }
    setNotice('已处于模拟确认状态，可导出需求定义卡。');
  }
  function exportCard() {
    const md = buildRequirementMarkdown({
      problem, hypothesis,
      relatedEvidence: linkedEvidence.map(row => row.item),
      tasks, requirement: { ...requirement, confirmationStatus: confirmation },
      confirmationLabel,
    });
    downloadText('P-03_问题定义卡_演示.md', md);
    setNotice('已导出 Markdown 需求定义卡（演示数据）。');
  }
  function inspectEvidence(id: string) {
    setSelectedEvidence(id);
    setShowSource(true);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><div className="brand-logo"><Radar size={25} strokeWidth={2.6} /></div><div><strong>业务需求探针</strong><small>REQUIREMENT PROBE · FDE WORKSPACE</small></div></div>
        <div className="top-center"><span className="breadcrumb">工作空间 <ChevronRight size={13} /> 运营商综调调研</span><span className="top-chip"><Layers3 size={15} /> 当前问题：<b>P-03</b></span></div>
        <div className="top-actions"><span className="demo-tag">演示数据 · 无真实客户信息</span><span className="avatar">FDE</span></div>
      </header>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-caption">现场工作空间</div>
          <div className="sidebar-item active"><Radar size={18} />问题工作台</div>
          <div className="sidebar-item muted"><FolderSearch size={18} />调研资料<span>规划中</span></div>
          <div className="sidebar-item muted"><GitBranch size={18} />需求地图<span>规划中</span></div>
          <div className="sidebar-item muted"><ListChecks size={18} />核验记录<span>规划中</span></div>
          <div className="sidebar-item muted"><FileText size={18} />需求成果<span>规划中</span></div>
          <div className="side-bottom"><BookOpen size={18} /><strong>FDE 方法指导</strong><p>先发现问题，再澄清需求；所有判断保留证据和确认状态。</p><small>M1 · Mock 演示</small></div>
        </aside>
        <main className="main">
          <div className="heading-row">
            <div><div className="crumb">现场调研 / 业务问题诊断 / 证据与假设核验</div><h1>业务问题证据与假设验证工作台</h1><p>从原始现场资料出发，核对事实、形成问题假设、制定下一步核验计划</p></div>
            <div className="head-actions"><button className="button ghost" onClick={exportCard}><Download size={15} /> 导出需求卡</button><button className="button primary" onClick={createTask}><Plus size={16} /> 创建核验任务</button></div>
          </div>
          <div className="stats">
            <div className="stat"><span className="stat-icon blue"><FileText size={20} /></span><div><span>现场证据</span><strong>{evidence.length}<small>条</small></strong></div></div>
            <div className="stat"><span className="stat-icon teal"><Target size={20} /></span><div><span>候选原因假设</span><strong>{hypotheses.length}<small>项</small></strong></div></div>
            <div className="stat"><span className="stat-icon amber"><ClipboardCheck size={20} /></span><div><span>待核验任务</span><strong>{tasks.length - completeCount}<small>项</small></strong></div></div>
            <div className="stat"><span className="stat-icon violet"><ShieldCheck size={20} /></span><div><span>客户确认状态</span><strong className="stat-word">{confirmationLabel}</strong></div></div>
          </div>
          <div className="panels">
            <section className="panel evidence-panel">
              <div className="panel-head"><h2><span className="accent" />原始资料与证据</h2><small>可追溯的事实来源</small></div>
              <div className="segment">{filterOptions.map(option => <button key={option.key} className={filter === option.key ? 'selected' : ''} onClick={() => setFilter(option.key)}>{option.title}</button>)}</div>
              <label className="search-field"><Search size={15} /><input aria-label="搜索证据" placeholder="搜索证据编号、内容或来源" value={query} onChange={event => setQuery(event.target.value)} /></label>
              <div className="panel-scroll evidence-list" role="region" aria-label="证据资料列表">
                {visibleEvidence.map(item => <button key={item.id} className={'evidence-card' + (selectedEvidence === item.id ? ' selected' : '')} onClick={() => inspectEvidence(item.id)}>
                  <span className="evidence-card-top"><b>{item.id}</b><span className={'kind ' + item.kind}>{kindLabel[item.kind]}</span><span className={'status ' + (item.reviewed ? 'verified' : 'pending')}>{item.reviewed ? '样例已核对' : '待核验'}</span></span>
                  <span className="evidence-copy">{item.text}</span>
                  <span className="evidence-foot"><span>{item.source}</span><span>查看来源 ↗</span></span>
                </button>)}
                {visibleEvidence.length === 0 && <div className="empty">没有匹配的证据。请调整搜索条件。</div>}
              </div>
              <div className="panel-foot">当前选择：<b>{selectedEvidence}</b><span>{activeEvidence.locator}</span></div>
            </section>
            <section className="panel analysis-panel">
              <div className="panel-head"><h2><span className="accent" />业务问题与原因假设</h2><small>分析 ≠ 已确认事实</small></div>
              <div className="stage-line"><span className="done">资料采集</span><ChevronRight size={13}/><span className="done">问题识别</span><ChevronRight size={13}/><span className="current">假设核验</span><ChevronRight size={13}/><span>客户确认</span></div>
              <div className="panel-scroll analysis-scroll">
                <div className="problem-card"><div className="problem-kicker"><b>{problem.id} · 重点问题</b><span>高优先 · 核验中</span></div><h3>{problem.title}</h3><p>{problem.description}</p><div className="chips"><span>综调预处理</span><span>业务痛点</span><span className="warm">非最终结论</span></div></div>
                <div className="subheading"><strong>候选根因假设</strong><small>选择假设，检查支持与冲突证据</small></div>
                <div className="hypothesis-list">{hypotheses.map((h,idx) => <button key={h.id} className={'hypothesis' + (h.id === selectedHypothesis ? ' active' : '')} onClick={() => setSelectedHypothesis(h.id)}>
                  <span className="hyp-number">{idx + 1}</span><span className="hyp-main"><b>{h.id}　{h.title}</b><small>{h.summary}</small></span><span className="hyp-status">待验证</span>
                </button>)}</div>
                <div className="analysis-box"><div className="box-heading"><strong>证据关联分析</strong><small>{hypothesis.id} · {linkedEvidence.length} 条</small></div>
                  <div className="support-row">{linkedEvidence.map(({ link, item }) => <button key={item.id} className={'relation ' + link.role} onClick={() => inspectEvidence(item.id)}><span>{link.role === 'support' ? '✓ 支持' : '! 观点冲突'}</span> {item.id} ↗</button>)}</div>
                </div>
                <div className="gap-box"><AlertTriangle size={17}/><span><b>关键证据缺口：</b>{hypothesis.gap}</span></div>
              </div>
              <div className="analysis-actions"><button className="button outline" onClick={() => inspectEvidence(hypothesis.links[0]?.evidenceId ?? selectedEvidence)}><Link2 size={15}/> 查看证据链</button><button className="button primary" onClick={createTask}><ListChecks size={15}/> 生成核验建议</button></div>
            </section>
            <section className="panel verify-panel">
              <div className="panel-head"><h2><span className="accent" />核验计划与客户共识</h2><small>下一步做什么？</small></div>
              <div className="progress-summary"><div className="progress-title"><b>核验任务进度</b><strong>{completeCount} / {tasks.length}</strong></div><div className="progress-track"><div style={{width:(tasks.length ? completeCount / tasks.length * 100 : 0)+'%'}} /></div><div className="progress-note">完成状态由 FDE 手工标记 · 全部为模拟任务</div></div>
              <div className="subheading right-title"><strong>建议下一轮现场动作</strong><small>待执行 {tasks.length - completeCount}</small></div>
              <div className="panel-scroll task-scroll"><div className="task-list">{tasks.map(task => <div className="task" key={task.id}>
                <div className="task-head"><button aria-label={task.status === 'done' ? '撤销完成 '+task.title : '标记完成 '+task.title} className={'task-check ' + (task.status === 'done' ? 'done' : '')} onClick={() => toggleTask(task.id)}>{task.status === 'done' ? <Check size={13}/> : null}</button><b>{task.title}</b>{task.requiresAuthorization && <span className="auth-badge">需授权</span>}</div>
                <p>{task.description}</p><div className="task-foot"><span>{task.owner}</span><span>{task.status === 'done' ? '已标记完成' : '待执行'}</span></div>
              </div>)}</div></div>
              <div className="confirm-card"><div className="confirm-title"><b>客户确认与需求转化</b><span className={confirmation === 'simulated' ? 'confirmed' : ''}>{confirmationLabel}</span></div><p>{confirmation === 'unconfirmed' ? '建议完成关键证据核验后，再与客户确认业务目标与指标。' : confirmation === 'draft' ? '已形成待复核草稿。真实项目应留存客户审批或签字记录。' : '仅为演示确认，需求卡不得作为真实客户签认材料。'}</p><button className="button confirm-button" onClick={progressConfirmation}>{confirmation === 'unconfirmed' ? '生成客户确认草稿' : confirmation === 'draft' ? '模拟客户确认' : '已模拟确认'} <ArrowRight size={15}/></button></div>
            </section>
          </div>
          <footer className="footer"><div className="workflow"><span className="finished"><CheckCircle2 size={15}/> 资料采集</span><ChevronRight size={14}/><span className="finished"><CheckCircle2 size={15}/> 问题识别</span><ChevronRight size={14}/><span className="current"><Clock3 size={15}/> 证据核验</span><ChevronRight size={14}/><span>客户确认</span><ChevronRight size={14}/><span>方案设计 / PoC</span></div><span>Requirement Probe · M1 Mock</span></footer>
        </main>
      </div>
      {showSource && <div className="drawer-backdrop" onClick={() => setShowSource(false)}><aside className="source-drawer" role="dialog" aria-label="证据来源" onClick={event => event.stopPropagation()}><div className="drawer-heading"><h2>原始证据详情</h2><button className="icon-button" aria-label="关闭证据详情" onClick={() => setShowSource(false)}><X size={18}/></button></div><span className="drawer-label">{activeEvidence.id} · {kindLabel[activeEvidence.kind]}</span><blockquote>{activeEvidence.text}</blockquote><div className="source-meta"><strong>资料来源</strong><p>{activeEvidence.source}</p><strong>定位信息</strong><p>{activeEvidence.locator}</p><strong>校对状态</strong><p>{activeEvidence.reviewed ? '模拟样例已核对' : '待核验'}</p></div><div className="drawer-warning"><CircleHelp size={16}/>演示资料并非真实客户文件，真实项目应链接到原文片段与授权资料位置。</div></aside></div>}
      {notice && <div role="status" className="toast"><Sparkles size={16}/>{notice}<button onClick={() => setNotice('')} aria-label="关闭提示"><X size={14}/></button></div>}
    </div>
  );
}
