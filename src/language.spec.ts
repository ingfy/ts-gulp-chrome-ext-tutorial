import {expect} from 'chai';

import {createElement} from './dom';
import * as language from './language';

describe('language', () => {
    describe('getLanguage', () => {
        it('should not crash on elements without classes', () => {
            var e = createElement('pre');            
            expect(() => language.getLanguage(e)).to.not.throw();
        });
        
        it('should map the class to a Codepen language', () => {
            var e = createElement('pre', {"class": "lang-cpp"});
            expect(language.getLanguage(e)).to.equal("C++");
        });        
    });
});