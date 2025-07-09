export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Order {
  entry: number;
  stopLoss: number;
  takeProfit: number;
  time: string;
  direction: 'BUY' | 'SELL';
  expires: number; // minutes
}

export interface Position extends Order {}

export class TradeManager {
  private pending: Order[] = [];
  private position: Position | null = null;
  private history: any[] = [];

  update(candle: Candle) {
    if (this.position) {
      if (this.position.direction === 'BUY') {
        if (candle.low <= this.position.stopLoss) {
          this.closePosition(candle.time, this.position.stopLoss);
        } else if (candle.high >= this.position.takeProfit) {
          this.closePosition(candle.time, this.position.takeProfit);
        }
      } else {
        if (candle.high >= this.position.stopLoss) {
          this.closePosition(candle.time, this.position.stopLoss);
        } else if (candle.low <= this.position.takeProfit) {
          this.closePosition(candle.time, this.position.takeProfit);
        }
      }
    }

    this.pending = this.pending.filter(o => {
      const age = new Date(candle.time).getTime() - new Date(o.time).getTime();
      if (age > o.expires * 60000) return false;
      if (o.direction === 'BUY' && candle.high >= o.entry) {
        this.position = {...o};
        return false;
      }
      if (o.direction === 'SELL' && candle.low <= o.entry) {
        this.position = {...o};
        return false;
      }
      return true;
    });
  }

  openOrder(order: Order) {
    this.pending.push(order);
  }

  closePosition(time:string, price:number) {
    if (!this.position) return;
    const pnl = this.position.direction === 'BUY' ? price - this.position.entry : this.position.entry - price;
    this.history.push({
      ...this.position,
      closeTime: time,
      closePrice: price,
      profit: pnl
    });
    this.position = null;
  }

  hasOpenPosition() {
    return this.position !== null;
  }

  getHistory() {
    return this.history;
  }
}
