import { registry } from 'chart.js';
import { BoxPlotController } from './controllers';
import { BoxAndWiskers } from './elements';

export * from '.';

registry.addControllers(BoxPlotController);
registry.addElements(BoxAndWiskers);
