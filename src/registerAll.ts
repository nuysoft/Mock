import * as a1 from './mock/random/basic';
import * as a2 from './mock/random/color';
import * as a3 from './mock/random/name';
import * as a4 from './mock/random/helper';
import * as a5 from './mock/random/misc';
import * as a6 from './mock/random/text';
import * as a7 from './mock/random/web';
import * as a8 from './mock/random/date';
import * as a9 from './mock/random/image';
import * as a10 from './mock/random/address';
import * as a11 from './mock/random/file';
import { registerRandom } from './mock/random';

export const registerAll = () => {
    Object.entries({ ...a1, ...a2, ...a3, ...a4, ...a5, ...a6, ...a7, ...a8, ...a9, ...a10, ...a11 }).map(
        ([name, fn]) => {
            registerRandom(name, fn);
        },
    );
};
