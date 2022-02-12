# @badisi/wdio-harness

🔬 [WebdriverIO][wdio] support for Angular component test harnesses.

[![npm version](https://img.shields.io/npm/v/@badisi/wdio-harness.svg?color=blue&logo=npm)][npm]
[![npm downloads](https://img.shields.io/npm/dw/@badisi/wdio-harness.svg?color=7986CB&logo=npm)][npm-dl]
[![license](https://img.shields.io/npm/l/@badisi/wdio-harness.svg?color=ff69b4)][license]

[![build status](https://github.com/badisi/wdio-harness/workflows/CI%20tests/badge.svg)][ci-tests]
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)][pullrequest]

<hr/>

#### Component test harnesses

> A component harness is a class that lets a test interact with a component via a supported API. Each harness's API interacts with a component the same way a user would. By using the harness API, a test insulates itself against updates to the internals of a component, such as changing its DOM structure. The idea for component harnesses comes from the [PageObject](https://martinfowler.com/bliki/PageObject.html) pattern commonly used for integration testing.

[More info](https://material.angular.io/cdk/test-harnesses/overview)


## Installation

```sh
npm install @badisi/wdio-harness --save-dev
```

```sh
yarn add @badisi/wdio-harness --dev
```


## Usage

__Methods__

- `createHarnessEnvironment(documentRoot)` - gets a HarnessLoader instance for the given HTML element
- `getHarness(query)` - searches for an instance of the given ComponentHarness class or HarnessPredicate
- `getAllHarnesses(query)` - acts like getHarness, but returns an array of harness instances
- `waitForAngular()` - waits for Angular to finish bootstrapping

__Example__

```ts
/** CommonJS */
// const { MatDatepickerInputHarness } = require('@angular/material/datepicker/testing');
// const { getHarness } = require('@badisi/wdio-harness');

/** ESM / Typescript */
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { getHarness, waitForAngular } from '@badisi/wdio-harness';

describe('Angular Material Harness', () => {
    beforeEach(async () => {
        await browser.url('http://localhost:4200');
        await waitForAngular();
    });

    it('MatDatePicker', async () => {
        const datepicker = await getHarness(MatDatepickerInputHarness.with({ selector: '#demo-datepicker-input' }));

        await datepicker.setValue('9/27/1954');
        expect(await datepicker.getValue()).withContext('Date should be 9/27/1954').toBe('9/27/1954');

        await datepicker.openCalendar();
        const calendar = await datepicker.getCalendar();
        await calendar.next();
        await calendar.selectCell({ text: '20' });
        expect(await datepicker.getValue()).withContext('Date should be 10/20/1954').toBe('10/20/1954');
    });
});
```

More examples [here][examples].


## Development

See the [developer docs][developer].


## Contributing

#### > Want to Help ?

Want to file a bug, contribute some code or improve documentation ? Excellent!

But please read up first on the guidelines for [contributing][contributing], and learn about submission process, coding rules and more.

#### > Code of Conduct

Please read and follow the [Code of Conduct][codeofconduct] and help me keep this project open and inclusive.




[npm]: https://www.npmjs.com/package/@badisi/wdio-harness
[npm-dl]: https://npmcharts.com/compare/@badisi/wdio-harness?minimal=true
[ci-tests]: https://github.com/badisi/wdio-harness/actions?query=workflow:CI%20tests
[pullrequest]: https://github.com/badisi/wdio-harness/blob/main/CONTRIBUTING.md#-submitting-a-pull-request-pr
[license]: https://github.com/badisi/wdio-harness/blob/main/LICENSE
[developer]: https://github.com/badisi/wdio-harness/blob/main/DEVELOPER.md
[contributing]: https://github.com/badisi/wdio-harness/blob/main/CONTRIBUTING.md
[codeofconduct]: https://github.com/badisi/wdio-harness/blob/main/CODE_OF_CONDUCT.md
[wdio]: https://webdriver.io/
[examples]: https://github.com/badisi/wdio-harness/blob/main/projects/tests/harness.e2e.ts
