import { Element } from 'chart.js';

export interface TooltipArea {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface IStatsBaseOptions {
  /**
   * @default see rectangle
   * @scriptable
   * @indexable
   */
  backgroundColor: string;

  /**
   * @default see rectangle
   * @scriptable
   * @indexable
   */
  borderColor: string;

  /**
   * @default 1
   * @scriptable
   * @indexable
   */
  borderWidth: number;

  /**
   * padding that is added around the bounding box when computing a mouse hit
   * @default 2
   * @scriptable
   * @indexable
   */
  hitPadding: number;
}

export interface IStatsBaseProps {
  x: number;
  y: number;
  width: number;
  height: number;
  whiskerMin: number;
  whiskerMax: number;
  startTimes: number[];
  endTimes: number[];
}

export class StatsBase<T extends IStatsBaseProps, O extends IStatsBaseOptions> extends Element<T, O> {
  declare _datasetIndex: number;

  declare horizontal: boolean;

  declare _index: number;

  isVertical(): boolean {
    return !this.horizontal;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  _getBounds(_useFinalPosition?: boolean): { left: number; top: number; right: number; bottom: number } {
    // abstract
    return {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    };
  }

  _getHitBounds(useFinalPosition?: boolean): { left: number; top: number; right: number; bottom: number } {
    const padding = this.options.hitPadding;
    const b = this._getBounds(useFinalPosition);
    return {
      left: b.left - padding,
      top: b.top - padding,
      right: b.right + padding,
      bottom: b.bottom + padding,
    };
  }

  inRange(mouseX: number, mouseY: number, useFinalPosition?: boolean): boolean {
    if (Number.isNaN(this.x) && Number.isNaN(this.y)) {
      return false;
    }
    return this._boxInRange(mouseX, mouseY, useFinalPosition);
  }

  inXRange(mouseX: number, useFinalPosition?: boolean): boolean {
    const bounds = this._getHitBounds(useFinalPosition);
    return mouseX >= bounds.left && mouseX <= bounds.right;
  }

  inYRange(mouseY: number, useFinalPosition?: boolean): boolean {
    const bounds = this._getHitBounds(useFinalPosition);
    return mouseY >= bounds.top && mouseY <= bounds.bottom;
  }

  protected _boxInRange(mouseX: number, mouseY: number, useFinalPosition?: boolean): boolean {
    const bounds = this._getHitBounds(useFinalPosition);
    return mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
  }

  getCenterPoint(useFinalPosition?: boolean): { x: number; y: number } {
    const props = this.getProps(['x', 'y'], useFinalPosition);
    return {
      x: props.x,
      y: props.y,
    };
  }
}
