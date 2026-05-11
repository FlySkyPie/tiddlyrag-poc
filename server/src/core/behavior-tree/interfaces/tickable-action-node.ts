export interface TickableActionNode {
  /**
   * Boolean present Succeeded (false) or Failed (true), promise present running.
   */
  tick(): Promise<boolean> | boolean;
}
