import {
    _getTextWithExcludedElements,
    ElementDimensions,
    EventData,
    ModifierKeys,
    TestElement,
    TestKey,
    TextOptions,
    ComponentHarness
} from '@angular/cdk/testing';
import { browser } from '@wdio/globals';
import { Element as WebdriverIOElement } from 'webdriverio';
import logger from '@wdio/logger';

import colors from '@colors/colors/safe.js';
const { magenta, green } = colors;

enum Button {
    LEFT = 'left',
    MIDDLE = 'middle',
    RIGHT = 'right'
}

/** Registers the element logger. */
const log = logger('wdio-harness');

/** Maps the `TestKey` constants to WebdriverIO's `Key` constants. */
const keyMap = {
    [TestKey.BACKSPACE]: 'Backspace',
    [TestKey.TAB]: 'Tab',
    [TestKey.ENTER]: 'Enter',
    [TestKey.SHIFT]: 'Shift',
    [TestKey.CONTROL]: 'Control',
    [TestKey.ALT]: 'Alt',
    [TestKey.ESCAPE]: 'Escape',
    [TestKey.PAGE_UP]: 'PageUp',
    [TestKey.PAGE_DOWN]: 'PageDown',
    [TestKey.END]: 'End',
    [TestKey.HOME]: 'Home',
    [TestKey.LEFT_ARROW]: 'ArrowLeft',
    [TestKey.UP_ARROW]: 'ArrowUp',
    [TestKey.RIGHT_ARROW]: 'ArrowRight',
    [TestKey.DOWN_ARROW]: 'ArrowDown',
    [TestKey.INSERT]: 'Insert',
    [TestKey.DELETE]: 'Delete',
    [TestKey.F1]: 'F1',
    [TestKey.F2]: 'F2',
    [TestKey.F3]: 'F3',
    [TestKey.F4]: 'F4',
    [TestKey.F5]: 'F5',
    [TestKey.F6]: 'F6',
    [TestKey.F7]: 'F7',
    [TestKey.F8]: 'F8',
    [TestKey.F9]: 'F9',
    [TestKey.F10]: 'F10',
    [TestKey.F11]: 'F11',
    [TestKey.F12]: 'F12',
    [TestKey.META]: 'Meta'
};

/** Module augmentation to expose the host element as a public api */
declare module '@angular/cdk/testing' {
    interface ComponentHarness {
        element(): WebdriverIOElement;
    }
    interface TestElement {
        element(): WebdriverIOElement;
    }
}
ComponentHarness.prototype.element = function (this: ComponentHarness): WebdriverIOElement {
    return this.locatorFactory.rootElement.element();
};

/** Converts a `ModifierKeys` object to a list of WebdriverIO `Key`s. */
const toWebdriverIOModifierKeys = (modifiers: ModifierKeys): string[] => {
    const result: string[] = [];
    if (modifiers.control) {
        result.push(keyMap[TestKey.CONTROL]);
    }
    if (modifiers.alt) {
        result.push(keyMap[TestKey.ALT]);
    }
    if (modifiers.shift) {
        result.push(keyMap[TestKey.SHIFT]);
    }
    if (modifiers.meta) {
        result.push(keyMap[TestKey.META]);
    }
    return result;
};

/**
 * A `TestElement` implementation for WebdriverIO.
 */
export class WebdriverIOTestElement implements TestElement {
    constructor(readonly hostElement: WebdriverIOElement) { }

    /** Return the host element. */
    element(): WebdriverIOElement {
        return this.hostElement;
    }

    /** Blur the element. */
    async blur(): Promise<void> {
        this.logAction('BLUR');
        return browser.executeScript('arguments[0].blur()', [this.hostElement]);
    }

    /** Clear the element's input (for input and textarea elements only). */
    async clear(): Promise<void> {
        this.logAction('CLEAR');
        return this.hostElement.clearValue();
    }

    /**
     * Click the element at the default location for the current environment. If you need to guarantee
     * the element is clicked at a specific location, consider using `click('center')` or
     * `click(x, y)` instead.
     */
    async click(modifiers?: ModifierKeys): Promise<void>;
    /** Click the element at the element's center. */
    async click(location: 'center', modifiers?: ModifierKeys): Promise<void>;
    /**
     * Click the element at the specified coordinates relative to the top-left of the element.
     * @param relativeX Coordinate within the element, along the X-axis at which to click.
     * @param relativeY Coordinate within the element, along the Y-axis at which to click.
     * @param modifiers Modifier keys held while clicking
     */
    async click(relativeX: number, relativeY: number, modifiers?: ModifierKeys): Promise<void>;
    async click(...args: [ModifierKeys?] | ['center', ModifierKeys?] | [number, number, ModifierKeys?]): Promise<void> {
        this.logAction('CLICK');
        return this.dispatchClickEventSequence(args, Button.LEFT);
    }

    /**
     * Right clicks on the element at the specified coordinates relative to the top-left of it.
     * @param relativeX Coordinate within the element, along the X-axis at which to click.
     * @param relativeY Coordinate within the element, along the Y-axis at which to click.
     * @param modifiers Modifier keys held while clicking
     */
    async rightClick(relativeX: number, relativeY: number, modifiers?: ModifierKeys): Promise<void>;
    async rightClick(...args: [ModifierKeys?] | ['center', ModifierKeys?] | [number, number, ModifierKeys?]): Promise<void> {
        this.logAction('RIGHT_CLICK');
        return this.dispatchClickEventSequence(args, Button.RIGHT);
    }

    /** Focus the element. */
    async focus(): Promise<void> {
        this.logAction('FOCUS');
        return browser.executeScript('arguments[0].focus()', [this.hostElement]);
    }

    /** Get the computed value of the given CSS property for the element. */
    async getCssValue(property: string): Promise<string> {
        this.logAction('GET_CSS_VALUE');
        return (await this.hostElement.getCSSProperty(property)).value ?? '';
    }

    /** Hovers the mouse over the element. */
    async hover(): Promise<void> {
        this.logAction('HOVER');
        return this.hostElement.moveTo();
    }

    /** Moves the mouse away from the element. */
    async mouseAway(): Promise<void> {
        this.logAction('MOUSE_AWAY');
        return this.hostElement.moveTo({ xOffset: -1, yOffset: -1 });
    }

    /**
     * Sends the given string to the input as a series of key presses. Also fires input events
     * and attempts to add the string to the Element's value.
     */
    async sendKeys(...keys: (string | TestKey)[]): Promise<void>;
    /**
     * Sends the given string to the input as a series of key presses. Also fires input events
     * and attempts to add the string to the Element's value.
     */
    async sendKeys(modifiers: ModifierKeys, ...keys: (string | TestKey)[]): Promise<void>;
    async sendKeys(...modifiersAndKeys: any[]): Promise<void> {
        let modifiers: ModifierKeys;
        let rest: (string | TestKey)[];

        const first = modifiersAndKeys[0];
        if (first !== undefined && typeof first !== 'string' && typeof first !== 'number') {
            modifiers = first;
            rest = modifiersAndKeys.slice(1);
        } else {
            modifiers = {};
            rest = modifiersAndKeys;
        }

        const KeyNULL = String.fromCharCode(57344);
        const modifierKeys = toWebdriverIOModifierKeys(modifiers);
        const keys = rest
            .map(k => (typeof k === 'string' ? k.split('') : [keyMap[k]]))
            .reduce((arr, k) => arr.concat(k), [])
            .reduce((arr, k) => {
                if (modifierKeys.length > 0) {
                    return arr.concat(...modifierKeys, k, KeyNULL);
                }
                return arr.concat(k);
            }, [] as string[]);

        this.logAction('SEND_KEYS', `[${keys.join(', ')}]`);
        if (keys.length !== 0) {
            await this.focus();
            return browser.keys(keys);
        }
    }

    /** Gets the text from the element. */
    async text(options?: TextOptions): Promise<string> {
        this.logAction('TEXT', `{ exclude: ${options?.exclude} }`);
        if (options?.exclude) {
            return browser.executeScript(`
                const clone = arguments[0].cloneNode(true) as Element;
                const exclusions = clone.querySelectorAll(arguments[1]);
                for (let i = 0; i < exclusions.length; i++) {
                    exclusions[i].remove();
                }
                return (clone.textContent ?? '').trim();
            `, [this.hostElement, options.exclude]);
        }
        // We don't go through WebdriverIO's `getText`, because it excludes text from hidden elements.
        return browser.executeScript(`return (arguments[0].textContent ?? '').trim()`, [this.hostElement]);
    }

    /** Gets the value for the given attribute from the element. */
    async getAttribute(name: string): Promise<string | null> {
        this.logAction('GET_ATTRIBUTE', name);
        return this.hostElement.getAttribute(name);
    }

    /** Checks whether the element has the given class. */
    async hasClass(name: string): Promise<boolean> {
        this.logAction('HAS_CLASS', name);
        const classes = (await this.getAttribute('class')) || '';
        return new Set(classes.split(/\s+/).filter(c => c)).has(name);
    }

    /** Gets the dimensions of the element. */
    async getDimensions(): Promise<ElementDimensions> {
        this.logAction('GET_DIMENSIONS');
        const { width, height } = await this.hostElement.getSize();
        const { x: left, y: top } = await this.hostElement.getLocation();
        return { width, height, left, top };
    }

    /** Gets the value of a property of an element. */
    async getProperty(name: string): Promise<any> {
        this.logAction('GET_PROPERTY', name);
        return this.hostElement.getProperty(name);
    }

    /** Checks whether this element matches the given selector. */
    async matchesSelector(selector: string): Promise<boolean> {
        this.logAction('MATCHES_SELECTOR', selector);
        return browser.executeScript(`
            return (Element.prototype.matches ?? Element.prototype.msMatchesSelector).call(arguments[0], arguments[1])
        `, [this.hostElement, selector]);
    }

    /** Checks whether the element is focused. */
    async isFocused(): Promise<boolean> {
        this.logAction('IS_FOCUSED');
        return this.hostElement.isFocused();
    }

    /** Sets the value of a property of an input. */
    async setInputValue(value: string): Promise<void> {
        this.logAction('SET_INPUT_VALUE', value);
        return this.hostElement.setValue(value);
    }

    /** Selects the options at the specified indexes inside of a native `select` element. */
    async selectOptions(...optionIndexes: number[]): Promise<void> {
        this.logAction('SELECT_OPTIONS', `[${optionIndexes.join(', ')}]`);

        const options = await this.hostElement.$$('option');
        const indexes = new Set(optionIndexes); // Convert to a set to remove duplicates.

        if (options.length && indexes.size) {
            // Reset the value so all the selected states are cleared. We can
            // reuse the input-specific method since the logic is the same.
            await this.setInputValue('');

            for (let i = 0; i < options.length; i++) {
                if (indexes.has(i)) {
                    // We have to hold the control key while clicking on options so that multiple can be
                    // selected in multi-selection mode. The key doesn't do anything for single selection.
                    await this.keyDown(keyMap[TestKey.CONTROL]);
                    await options[i].click();
                    await this.keyUp(keyMap[TestKey.CONTROL]);
                }
            }
        }
    }

    /** Dispatches an event with a particular name. */
    async dispatchEvent(name: string, data?: Record<string, EventData>): Promise<void> {
        this.logAction('DISPATCH_EVENT', name);
        return browser.executeScript(`
            const event = document.createEvent('Event');
            event.initEvent(arguments[0]);
            if (arguments[2]) {
                Object.assign(event, arguments[2]);
            }
            arguments[1]['dispatchEvent'](event);
        `, [name, this.hostElement, data]);
    }

    /** Performs a key-down action. */
    async keyDown(value: string): Promise<void> {
        this.logAction('KEY_DOWN:', value);
        return browser.performActions([{
            id: 'keyboard',
            type: 'key',
            actions: [{ type: 'keyDown', value }],
        }]);
    }

    /** Performs a key-up action. */
    async keyUp(value: string): Promise<void> {
        this.logAction('KEY_UP:', value);
        return browser.performActions([{
            id: 'keyboard',
            type: 'key',
            actions: [{ type: 'keyUp', value }],
        }]);
    }

    // --- HELPER(s) ---

    /** Dispatches all the events that are part of a click event sequence. */
    private async dispatchClickEventSequence(
        args: [ModifierKeys?] | ['center', ModifierKeys?] | [number, number, ModifierKeys?], button: Button,
    ) {
        let modifiers: ModifierKeys = {};
        if (args.length && typeof args[args.length - 1] === 'object') {
            modifiers = args.pop() as ModifierKeys;
        }
        const modifierKeys = toWebdriverIOModifierKeys(modifiers);

        // Omitting the offset argument to mouseMove results in clicking the center.
        // This is the default behavior we want, so we use an empty array of offsetArgs if
        // no args remain after popping the modifiers from the args passed to this function.
        const offsetArgs = (args.length === 2 ? { xOffset: Number(args[0]), yOffset: Number(args[1]) } : undefined);

        await this.hostElement.moveTo(offsetArgs);
        for (const modifierKey of modifierKeys) {
            this.keyDown(modifierKey);
        }
        await this.hostElement.click({ button });
        for (const modifierKey of modifierKeys) {
            this.keyUp(modifierKey);
        }
    }

    /** Writes info to the console outputs. */
    private logAction(action: string, args?: string): void {
        log.info(`${magenta(action)} ${green(this.hostElement.selector.toString())} ${args ? args : ''}`);
    }
}
