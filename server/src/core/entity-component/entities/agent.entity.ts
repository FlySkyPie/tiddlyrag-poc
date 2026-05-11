export interface PlanEntity {
  outline: {
    title: string;
    targetFsPaths: string[];
    status: 'pending' | 'in-progress' | 'completed';
  }[];

  currentStep: number;
}

interface ReasoningAgentEntity {
  /**
   * The final goal of the angent.
   */
  goal: string;

  /**
   * Short term goal or intention that agent currently have.
   */
  intention: string;
}

export interface AgentEntity extends ReasoningAgentEntity, PlanEntity {
  id: string;

  /**
   * Some action node would using LLM, which spend token, the value would behavior like
   * magic points in RPG game.
   */
  remainingToken: number;
}
