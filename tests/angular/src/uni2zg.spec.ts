// tslint:disable: mocha-no-side-effect-code
// tslint:disable: no-var-requires
// tslint:disable: no-require-imports
// tslint:disable: no-floating-promises
// tslint:disable: no-unsafe-any

import { TestBed } from '@angular/core/testing';

import { NoopTranslitRuleLoaderModule, TranslitModule, TranslitRule, TranslitService } from '@myanmartools/ng-translit';

const uni2zgRules: TranslitRule[] = require('../../../rules/unicode-to-zawgyi-rules/uni2zg.json');

const uni2zgInputs: [] = require('../../test-data/uni2zg-inputs.json');
const uni2zgExpects: [] = require('../../test-data/uni2zg-expects.json');

export function formatCodePoints(word: string): string {
    const cpArray: string[] = [];

    for (const c of word) {
        const cp = c.codePointAt(0);
        if (!cp) {
            continue;
        }

        cpArray.push(`\\u${cp.toString(16)}`);
    }

    return cpArray.join('');
}

describe('TranslitService', () => {
    let translitService: TranslitService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslitModule,
                NoopTranslitRuleLoaderModule
            ]
        });

        translitService = TestBed.get(TranslitService);
    });

    it('Converting Unicode to Zawgyi, should be Zawgyi expected text', (done: DoneFn) => {
        translitService.useRule('uni', 'zg', uni2zgRules);

        const inputText = uni2zgInputs.join('\n');

        translitService.translit(inputText, 'uni', 'zg')
            .subscribe(result => {
                const outputText = result.outputText;
                const actualWords = outputText.split('\n');

                let wrongCount = 0;

                for (let i = 0; i < actualWords.length; i++) {
                    const actualWord = actualWords[i];
                    const expectedWord = uni2zgExpects[i];

                    const isEquals = actualWord === expectedWord;

                    if (!isEquals) {
                        wrongCount++;

                        if (wrongCount < 4) {
                            const cpActual = formatCodePoints(actualWord);
                            const cpExpected = formatCodePoints(expectedWord);

                            expect(isEquals).toBeTruthy(`Not equal, line: ${i}, actual: ${cpActual}, expected: ${cpExpected}`);
                        }
                    }
                }

                expect(wrongCount).toEqual(0, 'Should wrongCount 0');
                done();
            });
    });
});
