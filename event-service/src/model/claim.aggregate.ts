
export class Claim {
  private cid: string;
  private uid: string;
  private rid: string;
  private eid: string;
  private state: string;
  private awardedAt: Date;

  constructor(cid: string, uid: string, rid: string, eid: string, state: string, awardedAt: Date) {
    this.validate(uid, rid, eid, state, awardedAt);
    this.cid = cid;
    this.uid = uid;
    this.rid = rid;
    this.eid = eid;
    this.state = state;
    this.awardedAt = awardedAt;
  }

  private validate(uid: string, rid: string, eid: string, state: string, awardedAt: Date): void {
    if (!uid || !rid || !eid) {
      throw new Error('User ID, Reward ID, and Event ID are required');
    }
    if (!['pending', 'awarded', 'failed'].includes(state)) {
      throw new Error('Invalid claim state');
    }
    if (isNaN(awardedAt.getTime())) {
      throw new Error('Invalid awarded date');
    }
  }

  public getCid(): string {
    return this.cid;
  }

  public getUid(): string {
    return this.uid;
  }

  public getRid(): string {
    return this.rid;
  }

  public getEid(): string {
    return this.eid;
  }

  public getState(): string {
    return this.state;
  }

  public getAwardedAt(): Date {
    return this.awardedAt;
  }
}