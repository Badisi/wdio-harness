import { MatCalendarCellHarness, MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { browser, $, expect as expectWdio } from '@wdio/globals';

import { getHarness } from '../library/src/index.js';

describe('Angular Material Harness', () => {
    beforeEach(async () => {
        await browser.url('http://localhost:4200');
    });

    it('MatButton - click()', async () => {
        const button = await getHarness(MatButtonHarness.with({ selector: '#demo-button' }));
        await button.click();

        const messageEl = $('.message');

        // Webdriverio syntax
        await expectWdio(messageEl).toHaveText('CLICKED', { message: 'Message should be equal to CLICKED' });

        // Jasmine syntax
        expect(await messageEl.getText()).withContext('Message should be equal to CLICKED').toBe('CLICKED');
        await expectAsync(messageEl.getText()).withContext('Message should be equal to CLICKED').toBeResolvedTo('CLICKED');
    });

    it('MatSelect - select()', async () => {
        const select = await getHarness(MatSelectHarness);
        await select.open();
        const options = await select.getOptions();
        expect(options.length).withContext('Select should have 3 options').toBe(3);
        await options[2].click();
        await expectAsync(select.getValueText()).withContext('"Tacos" should be selected').toBeResolvedTo('Tacos');
    });

    it('MatDatePicker - setValue()', async () => {
        const datepicker = await getHarness(MatDatepickerInputHarness.with({ selector: '#demo-datepicker-input' }));
        await datepicker.setValue('9/27/1954');
        await expectAsync(datepicker.getValue()).withContext('Date should be 9/27/1954').toBeResolvedTo('9/27/1954');
    });

    it('MatDatePicker - selectCell()', async () => {
        const datepicker = await getHarness(MatDatepickerInputHarness.with({ selector: '#demo-datepicker-input' }));
        await datepicker.setValue('9/27/1954');
        await datepicker.openCalendar();

        const calendar = await datepicker.getCalendar();
        await calendar.next();
        /**
         * Using `Calendar.selectCell()` is causing issues on Windows.
         * @example await calendar.selectCell({ text: '20' });
         * @error ERROR webdriver: Request failed with status 404 due to invalid session id: invalid session id
         * Moreover this api is not efficient as it loops through all the cells no matter the filter.
         */
        const cellElement = await calendar.element().$('div.mat-calendar-body-cell-content=20');
        const cell = await getHarness(MatCalendarCellHarness, cellElement);
        await cell.select();
        /** -- */
        await expectAsync(datepicker.getValue()).withContext('Date should be 10/20/1954').toBeResolvedTo('10/20/1954');
    });
});
