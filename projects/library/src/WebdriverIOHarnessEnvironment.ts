import { ComponentHarness, ComponentHarnessConstructor, HarnessEnvironment } from '@angular/cdk/testing';
import { Element as WebdriverIOElement, ElementArray as WebdriverIOElementArray } from 'webdriverio';
import logger from '@wdio/logger';

import { WebdriverIOTestElement } from './WebdriverIOTestElement.js';

import colors from '@colors/colors/safe.js';
const { magenta, green } = colors;

/** Registers the environment logger. */
const log = logger('wdio-harness');

/**
 * A `HarnessEnvironment` implementation for WebdriverIO.
 */
export class WebdriverIOHarnessEnvironment extends HarnessEnvironment<WebdriverIOElement> {
    /**
     * Keep a reference to the `document` element because `rawRootElement`
     * will be the root element of the harness's environment.
     */
    private documentRoot: WebdriverIOElement;

    protected constructor(
        rawRootElement: WebdriverIOElement,
        options: { documentRoot: WebdriverIOElement; }
    ) {
        super(rawRootElement);
        this.documentRoot = options.documentRoot;
    }

    /** Creates a `HarnessLoader` rooted at the document root. */
    static async loader(documentRoot: WebdriverIOElement): Promise<WebdriverIOHarnessEnvironment> {
        return new WebdriverIOHarnessEnvironment(documentRoot, { documentRoot });
    }

    /**
     * Flushes change detection and async tasks captured in the Angular zone.
     * In most cases it should not be necessary to call this manually. However, there may be some edge
     * cases where it is needed to fully flush animation events.
     */
    async forceStabilize(): Promise<void> {
        /* await browser.executeAsyncScript(`
            const done = arguments[0];
            window.requestAnimationFrame(done);
        `, []);*/
    }

    async waitForTasksOutsideAngular(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    /** Creates a `ComponentHarness` for the given harness type with the given raw host element. */
    createComponentHarness<T extends ComponentHarness>(
        harnessType: ComponentHarnessConstructor<T>,
        element: WebdriverIOElement
    ): T {
        return super.createComponentHarness(harnessType, element);
    }

    /** Gets a list of all elements matching the given selector under this environment's root element. */
    protected async getAllRawElements(selector: string): Promise<WebdriverIOElementArray> {
        log.info(`${magenta('GET_ALL_RAW_ELEMENTS')} ${green(selector.toString())}`);
        return await this.rawRootElement.$$(selector);
    }

    /** Gets the root element for the document. */
    protected getDocumentRoot(): WebdriverIOElement {
        return this.documentRoot;
    }

    /** Creates a `TestElement` from a raw element. */
    protected createTestElement(element: WebdriverIOElement): WebdriverIOTestElement {
        return new WebdriverIOTestElement(element);
    }

    /** Creates a `HarnessLoader` rooted at the given raw element. */
    protected createEnvironment(element: WebdriverIOElement): HarnessEnvironment<WebdriverIOElement> {
        return new WebdriverIOHarnessEnvironment(element, {
            documentRoot: this.documentRoot
        });
    }
}
