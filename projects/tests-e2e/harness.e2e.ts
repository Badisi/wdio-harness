import { MatButtonHarness } from '@angular/material/button/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { getHarness } from '../library/src/index.js';

// const nodeMajorVersion = process.versions.node.split('.')[0];

describe('Angular Material Harness', () => {
    /**
     * `expect-webdriverio` is not working on Node16
     *  patch until https://github.com/webdriverio/webdriverio/issues/8219 is fixed.
     */
    /*if (nodeMajorVersion === '16') {
        beforeAll(async () => {
            require('expect-webdriverio');
            // @ts-ignore
            global.wdioExpect = global.expect;
            const jasmine = require('jasmine');
            // @ts-ignore
            global.expect = jasmine.expect;
        });
    }*/

    beforeAll(async () => {
        await browser.url('http://localhost:4200');
    });

    it('MatButton', async () => {
        const button = await getHarness(MatButtonHarness.with({ selector: '#demo-button' }));
        await button.click();

        const messageEl = $('.message');

        // Webdriverio syntax
        //if (nodeMajorVersion === '16') {
            // await global.wdioExpect(messageEl).toHaveText('CLICKED', { message: 'Message should be equal to CLICKED' });
        //} else {
        await expect(messageEl).toHaveText('CLICKED', { message: 'Message should be equal to CLICKED' });
        //}

        // Jasmine syntax
        // expect(await messageEl.getText()).withContext('Message should be equal to CLICKED').toBe('CLICKED');
        await expectAsync(messageEl.getText()).withContext('Message should be equal to CLICKED').toBeResolvedTo('CLICKED');
    });

    it('MatSelect', async () => {
        const select = await getHarness(MatSelectHarness.with({ selector: '#demo-select' }));

        await select.open();
        const options = await select.getOptions();
        // expect(options.length).withContext('Select should have 3 options').toBe(3);
        expect(options.length).toBe(3);
        await options[2].click();
        // expect(await select.getValueText()).withContext('"Tacos" should be selected').toBe('Tacos');
        await expectAsync(select.getValueText()).withContext('"Tacos" should be selected').toBeResolvedTo('Tacos');
    });

    it('MatDatePicker', async () => {
        const datepicker = await getHarness(MatDatepickerInputHarness.with({ selector: '#demo-datepicker-input' }));

        await datepicker.setValue('9/27/1954');
        // expect(await datepicker.getValue()).withContext('Date should be 9/27/1954').toBe('9/27/1954');
        await expectAsync(datepicker.getValue()).withContext('Date should be 9/27/1954').toBeResolvedTo('9/27/1954');

        await datepicker.openCalendar();
        const calendar = await datepicker.getCalendar();
        await calendar.next();
        await calendar.selectCell({ text: '20' });
        // expect(await datepicker.getValue()).withContext('Date should be 10/20/1954').toBe('10/20/1954');
        await expectAsync(datepicker.getValue()).withContext('Date should be 10/20/1954').toBeResolvedTo('10/20/1954');
    });
});
