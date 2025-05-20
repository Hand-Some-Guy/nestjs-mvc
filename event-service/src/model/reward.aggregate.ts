export class Reward {
  private rid: string;
  private eid: string;
  private items: string[];
  private amount: number[];

  constructor(rid: string, eid: string, items: string[], amount: number[]) {
    this.validate(eid, items, amount);
    this.rid = rid;
    this.eid = eid;
    this.items = items;
    this.amount = amount;
  }

  private validate(eid: string, items: string[], amount: number[]): void {
    if (!eid) {
      throw new Error('Event ID is required');
    }
    if (!items.length || !amount.length || items.length !== amount.length) {
      throw new Error('Invalid reward data: items and amount must be non-empty and of equal length');
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

  public getAmount(): number[] {
    return this.amount;
  }
}