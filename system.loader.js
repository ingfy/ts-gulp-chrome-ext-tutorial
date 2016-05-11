System.config({
    baseURL: chrome.extension.getURL('/'),
    packages: {
        'app': {
            defaultExtension: 'js'
        }
    }
})
System.import('app/hello').then(process => process.main());