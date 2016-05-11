import {getLanguage} from './language';
import {createCodepenForm} from './dom';

export function addOpenButton(codeElement: Element) {
    let pre = codeElement.parentElement;
    let lang = getLanguage(pre);

    if (!lang) return;

    pre.parentElement.insertBefore(createCodepenForm(lang, codeElement.textContent), pre);
}

export function main() {
    for (var node of Array.prototype.slice.call(document.querySelectorAll('pre code'))) {
        addOpenButton(node);
    }
}