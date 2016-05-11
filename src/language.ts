var languageClasses = {
    'lang-php': 'PHP',
    'lang-py': 'Python',
    'lang-cpp': 'C++',
    'lang-c': 'C',
    'lang-d': 'D',
    'lang-perl': 'Prel',
    'lang-scheme': 'Scheme',
    'lang-lua': 'Lua',
    'lang-haskell': 'Haskell',
    'lang-ocaml': 'Ocaml'
};

export function getLanguage(element: HTMLElement): string {
    for (let soClass of element.className.split(" ")) {
        let lang = languageClasses[soClass];
        
        if (lang) return lang;
    }   
    
    return null;
}