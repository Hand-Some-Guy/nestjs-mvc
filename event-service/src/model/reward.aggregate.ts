export class Reward {
  private rid: string;
  private eid: string;
  private items: string[];
  private condition: string[];
  private amount: number[];

  constructor(rid: string, eid: string, items: string[], amount: number[], condition: string[]) {
    this.validate(eid, items, amount, condition);
    this.rid = rid;
    this.eid = eid;
    this.items = items;
    this.amount = amount;
    this.condition = condition;
  }

  private validate(eid: string, items: string[], amount: number[], condition: string[]): void {
    if (!eid) {
      throw new Error('Event ID is required');
    }
    if (!items.length || !amount.length || !condition.length || items.length !== amount.length || items.length !== condition.length) {
      throw new Error('Invalid reward data: items, amount, and condition must be non-empty and of equal length');
    }
    if (amount.some(a => a <= 0)) {
      throw new Error('Amount must be positive');
    }
  }

  public getRid(): string {
    return this.rid;
  }

  public getEid(): string {
    return this.eid;
  }

  public getItems(): string[] {
    return this.items;
  }

  public getCondition(): string[] {
    return this.condition;
  }

  public getAmount(): number[] {
    return this.amount;
  }
}