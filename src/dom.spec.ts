import {expect} from 'chai';

import * as dom from './dom';

describe('dom', () => {
   describe('createElement', () => {
       it('should return a bare element when given no attributes', () => {
           expect(dom.createElement('p').getAttribute('class')).to.equal(null);
       });
   });
   
   describe('craeteCodepenForm', () => {
       it('should return a form', () => {
           expect(dom.createCodepenForm("Python", `a = "hei"`).tagName).to.equal("FORM");
       });
       
       it('should contain form values for language and code', () => {
           let lang = "Lua";
           let code = `print("Hello Lua World")`;
           
           let form = dom.createCodepenForm(lang, code);
           
           expect((<HTMLInputElement>form.querySelector('input[name=lang]')).value).to.equal(lang);
           expect((<HTMLInputElement>form.querySelector('input[name=code]')).value).to.equal(code);
       });
   });
});