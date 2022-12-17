import { ComponentHarness, ComponentHarnessConstructor, HarnessQuery } from '@angular/cdk/testing';
import { browser, $ } from '@wdio/globals';

import { WebdriverIOHarnessEnvironment } from './WebdriverIOHarnessEnvironment.js';

/**
 * Searches for all instances of the component corresponding to the given harness type under the
 * `HarnessLoader`'s root element, and returns a list `ComponentHarness` for each instance.
 * @param query A query for a harness to create
 * @return A list instances of the given harness type.
 */
 export const getAllHarnesses = async <T extends ComponentHarness>(
    query: HarnessQuery<T>
): Promise<T[]> => {
    return (await createHarnessEnvironment()).getAllHarnesses(query);
};

export async function getHarness<T extends ComponentHarness>(harnessType: ComponentHarnessConstructor<T>, element: WebdriverIO.Element): Promise<T>;
export async function getHarness<T extends ComponentHarness>(query: HarnessQuery<T>): Promise<T>;
/**
 * Searches for an instance of the component corresponding to the given harness type or host element
 * under the `HarnessLoader`'s root element, and returns a `ComponentHarness` for that instance. If
 * multiple matching components are found, a harness for the first one is returned. If no matching
 * component is found, an error is thrown.
 * @param queryOrHarnessType A query or a harness type for a harness to create
 * @param element A raw host element for a harness to create
 * @return An instance of the given harness type
 * @throws If a matching component instance can't be found.
 */
export async function getHarness<T extends ComponentHarness>(
    queryOrHarnessType: HarnessQuery<T> | ComponentHarnessConstructor<T>,
    element?: WebdriverIO.Element
): Promise<T> {
    const env = await createHarnessEnvironment();
    if (Object.prototype.hasOwnProperty.call(queryOrHarnessType, 'hostSelector')) {
        return env.createComponentHarness(queryOrHarnessType as ComponentHarnessConstructor<T>, element as WebdriverIO.Element);
    }
    return env.getHarness(queryOrHarnessType);
};

/**
 * Returns a base harness environment instance.
 * @return An HarnessLoader instance for the current HTML document, rooted at the document's root element
 */
 export const createHarnessEnvironment = async (
    rootElement?: WebdriverIO.Element
): Promise<WebdriverIOHarnessEnvironment> => {
    return WebdriverIOHarnessEnvironment.loader(rootElement || await $('body'));
};

/**
 * Returns a promise that resolves when the application is "stable".
 * The promise might be rejected due to timeouts, or async tasks in the client
 * app that never finish (timers, etc).
 */
export const waitForAngular = async (): Promise<void> => {
    await browser.waitUntil(() => browser.executeScript(`
        return Array.isArray(window.frameworkStabilizers)
    `, []));
    await browser.executeAsyncScript(`
        const done = arguments[0];
        const promises = window.frameworkStabilizers.map(stabilizer => {
            // Stabilizer will invoke the resolve function with a
            // boolean to indicate whether any work is done.
            return new Promise(resolve => stabilizer(resolve));
        });
        Promise.all(promises).then(done);
    `, []);
};
