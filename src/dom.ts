export function createCodepenForm(language: string, code: string): HTMLFormElement {
    var formData = {
        lang: language,
        code: code,
        run: "True",
        submit: "Submit"
    };
    
    var form = createElement<HTMLFormElement>('form', {
        'method': 'POST',
        'target': '_blank',
        'action': 'http://codepad.org'
    });

    for (var key in formData) {
        form.appendChild(createElement('input', {
            'type': 'hidden',
            'name': key,
            'value': formData[key]
        }));
    }

    var submit = createElement('input', {
        'type': 'submit',
        'value': `Open the damn ${language} snippet in codepad!`
    });

    form.appendChild(submit);
    
    return form;
};

export function createElement<T extends HTMLElement>(type: string, attributes: {[key: string]: string} = {}): T {
    var element = document.createElement(type);
    for (var key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    return <T>element;
}