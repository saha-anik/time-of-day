import { registry } from 'chart.js';
import { TimeOfDayController } from './controllers';
import { Boxes } from './elements';

export * from '.';

registry.addControllers(TimeOfDayController);
registry.addElements(Boxes);
