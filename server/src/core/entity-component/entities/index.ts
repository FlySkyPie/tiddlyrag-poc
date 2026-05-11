import type { AgentEntity } from './agent.entity';
import type { DocumentPageEntity } from './document.page.entity';
import type { GitContentEntity } from './git-content.entity';
import type { InvestigatedContentEntity } from './investigated-content.entity';

export type Entity = Partial<GitContentEntity> &
  Partial<InvestigatedContentEntity> &
  Partial<AgentEntity> &
  Partial<DocumentPageEntity>;
