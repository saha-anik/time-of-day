import { BarController, Element, ChartMeta, LinearScale, UpdateMode } from 'chart.js';
import { formatNumber } from 'chart.js/helpers';
import type { ITimeOfDayOptions, ITimeOfDay } from '../data';

export /* #__PURE__ */ function baseDefaults(keys: string[]): Record<string, unknown> {
  const colorKeys = ['borderColor', 'backgroundColor'].concat(keys.filter((c) => c.endsWith('Color')));
  return {
    animations: {
      colors: {
        type: 'color',
        properties: colorKeys,
      },
    },
    transitions: {
      show: {
        animations: {
          colors: {
            type: 'color',
            properties: colorKeys,
            from: 'transparent',
          },
        },
      },
      hide: {
        animations: {
          colors: {
            type: 'color',
            properties: colorKeys,
            to: 'transparent',
          },
        },
      },
    },
    minStats: 'min',
    maxStats: 'max',
  };
}

export abstract class StatsBase<S extends ITimeOfDay, C extends Required<ITimeOfDayOptions>> extends BarController {
  declare options: C;

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/explicit-module-boundary-types
  protected _transformStats<T>(target: any, source: S, mapper: (v: number) => T): void {
    for (const key of ['startTimes', 'endTimes']) {
      if (Array.isArray(source[key as keyof ITimeOfDay])) {
        // eslint-disable-next-line no-param-reassign
        target[key] = source[key as 'startTimes' | 'endTimes'].map(mapper);
      }
    }
  }

  parsePrimitiveData(meta: ChartMeta, data: any[], start: number, count: number): Record<string, unknown>[] {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const vScale = meta.vScale!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const iScale = meta.iScale!;
    const labels = iScale.getLabels();
    const r = [];
    for (let i = 0; i < count; i += 1) {
      const index = i + start;
      const parsed: any = {};
      parsed[iScale.axis] = iScale.parse(labels[index], index);
      const stats = this._parseStats(data == null ? null : data[index], this.options);
      if (stats) {
        Object.assign(parsed, stats);
        parsed[vScale.axis] = stats.median;
      }
      r.push(parsed);
    }
    return r;
  }

  parseArrayData(meta: ChartMeta, data: any[], start: number, count: number): Record<string, unknown>[] {
    return this.parsePrimitiveData(meta, data, start, count);
  }

  parseObjectData(meta: ChartMeta, data: any[], start: number, count: number): Record<string, unknown>[] {
    return this.parsePrimitiveData(meta, data, start, count);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected abstract _parseStats(value: any, options: C): S | undefined;

  getLabelAndValue(index: number): { label: string; value: string & { raw: S; hoveredOutlierIndex: number } & S } {
    const r = super.getLabelAndValue(index) as any;
    const { vScale } = this._cachedMeta;
    const parsed = this.getParsed(index) as unknown as S;
    if (!vScale || !parsed || r.value === 'NaN') {
      return r;
    }
    r.value = {
      raw: parsed,
      hoveredOutlierIndex: -1,
    };
    this._transformStats(r.value, parsed, (v) => vScale.getLabelForValue(v));
    const s = this._toStringStats(r.value.raw);
    r.value.toString = function toString() {
      // custom to string function for the 'value'
      if (this.hoveredOutlierIndex >= 0) {
        // TODO formatter
        return `(outlier: ${this.outliers[this.hoveredOutlierIndex]})`;
      }
      return s;
    };
    return r;
  }

  // eslint-disable-next-line class-methods-use-this
  protected _toStringStats(b: S): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const f = (v: number) => (v == null ? 'NaN' : formatNumber(v, this.chart.options.locale!, {}));
    return `(min: ${f(b.min)}, 25% quantile: ${f(b.q1)}, median: ${f(b.median)}, mean: ${f(b.mean)}, 75% quantile: ${f(
      b.q3
    )}, max: ${f(b.max)})`;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  updateElement(rectangle: Element, index: number, properties: any, mode: UpdateMode): void {
    const reset = mode === 'reset';
    const scale = this._cachedMeta.vScale as LinearScale;
    const parsed = this.getParsed(index) as unknown as S;
    const base = scale.getBasePixel();
    // eslint-disable-next-line no-param-reassign
    properties._datasetIndex = this.index;
    // eslint-disable-next-line no-param-reassign
    properties._index = index;
    this._transformStats(properties, parsed, (v) => (reset ? base : scale.getPixelForValue(v, index)));
    super.updateElement(rectangle, index, properties, mode);
  }
}
