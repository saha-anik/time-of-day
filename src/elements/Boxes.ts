import { BarElement } from 'chart.js';
import { StatsBase, IStatsBaseOptions, IStatsBaseProps } from './base';

export class Boxes extends StatsBase<IStatsBaseProps, IStatsBaseOptions> {
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.fillStyle = this.options.backgroundColor;
    ctx.strokeStyle = this.options.borderColor;
    ctx.lineWidth = this.options.borderWidth;
    const props = this.getProps(['x', 'width', 'startTimes', 'endTimes']);
    const { startTimes } = props;
    const { endTimes } = props;
    const { x } = props;
    const { width } = props;
    const x0 = x - width / 2;

    for (let i = 0; i < startTimes.length; i++) {
      ctx.fillRect(x0, startTimes[i], width, endTimes[i] - startTimes[i]);
    }

    ctx.save();
    ctx.restore();
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

  static id = 'boxes';

  static defaults = /* #__PURE__ */ {
    ...BarElement.defaults,
    medianColor: 'transparent',
    lowerBackgroundColor: 'transparent',
  };

  static defaultRoutes = /* #__PURE__ */ { ...BarElement.defaultRoutes };
}

declare module 'chart.js' {
  export interface ElementOptionsByType<TType extends ChartType> {
    boxplot: ScriptableAndArrayOptions<IStatsBaseOptions & CommonHoverOptions, ScriptableContext<TType>>;
  }
}
