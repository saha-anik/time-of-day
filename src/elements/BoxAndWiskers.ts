import { BarElement } from 'chart.js';
import { StatsBase, baseDefaults, baseOptionKeys, baseRoutes, IStatsBaseOptions, IStatsBaseProps } from './base';

export const boxOptionsKeys = baseOptionKeys.concat(['medianColor', 'lowerBackgroundColor']);

export interface IBoxAndWhiskersOptions extends IStatsBaseOptions {
  /**
   * separate color for the median line
   * @default 'transparent' takes the current borderColor
   * @scriptable
   * @indexable
   */
  medianColor: string;

  /**
   * color the lower half (median-q3) of the box in a different color
   * @default 'transparent' takes the current borderColor
   * @scriptable
   * @indexable
   */
  lowerBackgroundColor: string;
}

export interface IBoxAndWhiskerProps extends IStatsBaseProps {
  q1: number;
  q3: number;
  median: number;
  whiskerMin: number;
  whiskerMax: number;
  mean: number;
  startTimes: number[];
  endTimes: number[];
}

export class BoxAndWiskers extends StatsBase<IBoxAndWhiskerProps, IStatsBaseOptions> {
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.fillStyle = this.options.backgroundColor;
    ctx.strokeStyle = this.options.borderColor;
    ctx.lineWidth = this.options.borderWidth;
    this._drawBoxPlot(ctx);
    ctx.restore();
  }

  protected _drawBoxPlot(ctx: CanvasRenderingContext2D): void {
    this._drawBoxPlotVertical(ctx);
  }

  protected _drawBoxPlotVertical(ctx: CanvasRenderingContext2D): void {
    //const { options } = this;
    const props = this.getProps([
      'x',
      'width',
      'q1',
      'q3',
      'median',
      'whiskerMin',
      'whiskerMax',
      'startTimes',
      'endTimes',
    ]);
    const { startTimes } = props;
    const { endTimes } = props;
    const { x } = props;
    const { width } = props;
    //const { whiskerMax, whiskerMin } = props;
    const x0 = x - width / 2;

    for (let i = 0; i < startTimes.length; i++) {
      ctx.fillRect(x0, startTimes[i], width, endTimes[i] - startTimes[i]);
      //ctx.restore();
    }
    /*ctx.fillStyle = '000000';
    ctx.fillRect(x0, whiskerMin, width, whiskerMax - whiskerMin);*/
    ctx.save();
  }

  _getBounds(useFinalPosition?: boolean): { left: number; top: number; right: number; bottom: number } {
    const vert = this.isVertical();
    if (this.x == null) {
      return {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      };
    }

    if (vert) {
      const { x, width, whiskerMax, whiskerMin } = this.getProps(
        ['x', 'width', 'whiskerMin', 'whiskerMax'],
        useFinalPosition
      );
      const x0 = x - width / 2;
      return {
        left: x0,
        top: whiskerMax,
        right: x0 + width,
        bottom: whiskerMin,
      };
    }
    const { y, height, whiskerMax, whiskerMin } = this.getProps(
      ['y', 'height', 'whiskerMin', 'whiskerMax'],
      useFinalPosition
    );
    const y0 = y - height / 2;
    return {
      left: whiskerMin,
      top: y0,
      right: whiskerMax,
      bottom: y0 + height,
    };
  }

  static id = 'boxandwhiskers';

  static defaults = /* #__PURE__ */ {
    ...BarElement.defaults,
    ...baseDefaults,
    medianColor: 'transparent',
    lowerBackgroundColor: 'transparent',
  };

  static defaultRoutes = /* #__PURE__ */ { ...BarElement.defaultRoutes, ...baseRoutes };
}

declare module 'chart.js' {
  export interface ElementOptionsByType<TType extends ChartType> {
    boxplot: ScriptableAndArrayOptions<IBoxAndWhiskersOptions & CommonHoverOptions, ScriptableContext<TType>>;
  }
}
