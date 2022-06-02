import {
  Chart,
  BarController,
  ControllerDatasetOptions,
  ScriptableAndArrayOptions,
  CommonHoverOptions,
  ChartItem,
  ChartConfiguration,
  LinearScale,
  CategoryScale,
  AnimationOptions,
} from 'chart.js';
import { merge } from 'chart.js/helpers';
import type { ITimeOfDay } from '../data';
import { StatsBase } from './StatsBase';
import { Boxes, IStatsBaseOptions } from '../elements';
import patchController from './patchController';

export class TimeOfDayController extends StatsBase<ITimeOfDay> {
  // eslint-disable-next-line class-methods-use-this
  protected _parseStats(value: any): ITimeOfDay | undefined {
    if (!value) {
      return undefined;
    }
    return value;
  }

  static readonly id = 'timeofday';

  static readonly defaults: any = /* #__PURE__ */ merge({}, [
    BarController.defaults,
    {
      animations: {
        numbers: {
          type: 'number',
          properties: (BarController.defaults as any).animations.numbers.properties.concat(['startTimes', 'endTimes']),
        },
      },
      dataElementType: Boxes.id,
    },
  ]);

  static readonly overrides: any = /* #__PURE__ */ merge({}, [(BarController as any).overrides]);
}

export interface TimeOfDayControllerDatasetOptions
  extends ControllerDatasetOptions,
    ScriptableAndArrayOptions<IStatsBaseOptions, 'timeofday'>,
    ScriptableAndArrayOptions<CommonHoverOptions, 'timeofday'>,
    AnimationOptions<'timeofday'> {}

export type TimeOfDayDataPoint = number[] | ITimeOfDay;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITimeOfDayChartOptions {}

declare module 'chart.js' {
  export interface ChartTypeRegistry {
    timeofday: {
      chartOptions: ITimeOfDayChartOptions;
      datasetOptions: TimeOfDayControllerDatasetOptions;
      defaultDataPoint: TimeOfDayDataPoint;
      scales: keyof CartesianScaleTypeRegistry;
      metaExtensions: Record<string, never>;
      parsedDataType: ITimeOfDay & ChartTypeRegistry['bar']['parsedDataType'];
    };
  }
}

export class BoxPlotChart<DATA extends unknown[] = TimeOfDayDataPoint[], LABEL = string> extends Chart<
  'timeofday',
  DATA,
  LABEL
> {
  static id = TimeOfDayController.id;

  constructor(item: ChartItem, config: Omit<ChartConfiguration<'timeofday', DATA, LABEL>, 'type'>) {
    super(item, patchController('timeofday', config, TimeOfDayController, Boxes, [LinearScale, CategoryScale]));
  }
}
