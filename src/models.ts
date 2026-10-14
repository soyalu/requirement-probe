export type EvidenceKind = 'interview' | 'observation' | 'record';
export type EvidenceLinkRole = 'support' | 'conflict';
export type VerificationStatus = 'todo' | 'done';
export type ConfirmationStatus = 'unconfirmed' | 'draft' | 'simulated';

export interface Evidence {
  id: string;
  kind: EvidenceKind;
  text: string;
  source: string;
  locator: string;
  reviewed: boolean;
}
export interface Problem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'under_review' | 'confirmed';
}
export interface Hypothesis {
  id: string;
  title: string;
  summary: string;
  gap: string;
  links: { evidenceId: string; role: EvidenceLinkRole }[];
}
export interface VerificationTask {
  id: string;
  hypothesisId: string;
  title: string;
  description: string;
  owner: string;
  status: VerificationStatus;
  requiresAuthorization?: boolean;
}
export interface Requirement {
  id: string;
  problemId: string;
  businessGoal: string;
  measurement: string[];
  scope: string;
  assumptions: string[];
  confirmationStatus: ConfirmationStatus;
}
