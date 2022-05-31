import { registry } from 'chart.js';
import { TimeOfDayController } from './controllers';
import { BoxAndWiskers } from './elements';

export * from '.';

registry.addControllers(TimeOfDayController);
registry.addElements(BoxAndWiskers);
