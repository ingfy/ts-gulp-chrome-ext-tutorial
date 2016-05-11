import {expect} from 'chai';

import * as hello from './hello';

describe('hello', () => {
    describe('main()', () => {
        it('should greet the people', () => {
            hello.main();
            expect(document.querySelector('p').textContent).to.match(/hello/gi);
        });
    });
});