# ts-talk

Dette prosjektet er en nettleserutvidelse til Google Chrome skrevet i Typescript, med enhetstester. Nettleserutvidelsen legger til "kjør kode"-funksjonalitet på StackOverflow-kodesnutter, som åpner et nytt nettleservindu med Codepad.org og koden limt inn. Poenget med prosjektet er en presentasjon for Ciber Developer Update i mai 2016 (CDU).

Hovedfokuset med prosjektet og presentasjonen er den underliggende teknologien, altså Typescript,gulp og enhetstesting med karma og PhantomJS, og ikke det faktum at produktet er en Chrome-utvidelse.

## Codepad.org

[Codepad](http://codepad.org/) er en side der man kan kjøre små kodesnutter i forskjellige språk, og lage "pastes", dvs. lenker til kode man kan dele med andre. Vår utvidelse kan bruke denne siden til å støtte kjøring av kodesnutter på nettsider.

Heldigvis kan Codepad-hjemmesiden motta en anonym POST-spørring som inneholder skjemadata og gi tilbake en side. Vi er heldige her, siden de ikke krever noen cookie eller noe lignende for at POST-spørringen skal fungere.

Det finnes mange slike sider på nettet, men Codepad er veldig enkelt å integere mot. Antallet støttede språk er dessverre ikke så høyt. 

Liste over tilgjengelige språk på Codepad:

* C
* C++
* D
* Haskell
* Lua
* OCaml
* PHP
* Perl
* Python
* Ruby
* Scheme
* Tcl

## StackOverflow

[StackOverflow](http://stackoverflow.com/) er en en utviklers beste venn. Det er en Q&A-side der man kan stille spørsmål, få svar, og ikke minst lese andre brukere sine spørsmål. Både spørsmål og svar på denne siden har ofte tilhørende kodesnutter. Av og til er disse kodesnuttene egnet til å kjøres som en selvstendig enhet, og der er her Codepad-integrasjonen denne nettleserutvidelsen kommer inn i bildet.

Kodesnuttene på StackOverflow legges inn i tagger `<pre><code>`. Disse taggene dekoreres med klasser som viser hvilket programmeringsspråk kodesnutten er for.

## Algoritme

> Antar at nettleseren er på en StackOverflow-side.
>
> 1. Finn alle `<pre><code>...</code></pre>`-elementer
> 2. Finn ut hvilket språk de er på
> 3. Legg til en knapp "Run in codepad!"
> 4. Trykk på knappen gjør:
> 5. Åpne et nytt nettleservindu
> 6. Send en POST-spørring til http://codepad.org/ med skjemadata:
>
>    ```
>    lang: <language> (ex.: Python)
>    code: <content>
>    run: True
>    submit: Submit
>    ``` 


## Google Chrome-utvidelser

Chrome-utvidelser kan brukes til å legge inn funksjonalitet i selve nettleseren, og til å forbedre spesfikke nettsider. Dette gjøres ved hjelp av bakgrunns-/eventsider og innholdsscript. Eventsider kjøres i bakgrunnen og kan integrere med nettleseren, mens innholdsscript hører til en spesifikk nettside som matcher en gitt URL og har tilgang til DOM-en på den nettsiden. Siden dette prosjekter fokuserer på teknologi, vil denne utvidelsen kun inneholde et innholdsscript.

En utvidelse til Chrome består av et manifest, et sett med JavaScript- og HTML-filer, og tilleggsressurser som ikoner og bilder. Alle utvidelser til Google Chrome må inneholde et manifest "`manifest.json`", som beskriver funksjonaliteten til utvidelsen og hvilke tilganger den trenger.

## Oppbygning

Følgende rammeverk og verktøy er brukt:

1. Typescript
2. Gulp
3. Karma
4. Mocha
5. PhantomJS
6. SystemJS

### Teknologien i bruk

Gulp kjører alle oppgavene våre.

| Oppgave   | Beskrivelse |
| --------- | ----------- |
| compile   | Kompilér Typescript-kode (kildekode og testkode) til Javascript og legg output i `build/app`.  | 
| manifest  | Kopier manifestet til `build/`.                                                                |
| resources | Kopiler bilder (ikonet) til `build/resources`.                                                 |
| loader    | Konkatenér system.js og loader.js og legg resultatet som `build/contentScript.js`. Dette er inngangspunktet til appen.                                                                                   |
| build     | `compile, manifest, resources`                                                                 |
| test      | Kjør opp en karmaserver med PhantomJS. Bruk SystemJS til å laste inn test- og kildekodefiler   |
|           | til Phantom og bruk Mocha til å teste dem.                                                     |

## Fremgangsmåte

Her er en oppskrift på å bygge utvidelsen.

### 1. Hvordan skal vi bygge opp dette her?

Vi må tenke litt på hva vi skal lage først. Siden vi skal lage en Chrome-utvidelse må vi finne ut hva slags script vi skal kjøre. Målet med utvidelsen vår er å legge til en knapp som åpner en ny tab som sender en POST-spørring til Codepad. POST-spørringen kan vi heldigvis implementere med å legge inn HTML `<form>`-elementer på StackOverflow-siden, med action som poster til Codepad. Dermed behøver ikke utvidelsen vår å snakke med Chrome-API-et. Det er en stor fordel, siden vi kan gjøre en del forenklinger når vi vet at utvidelsen vår bare trenger å bestå av et innholdsscript.

### 2. De første filene: den første kildefila og alt det andre

Vi starter oppsettet av applikasjonen med det vanlige: sette opp et git-repo og en npm-pakke. Vi må også lage et Chrome Extension-manifest og en typescript-fil. Vi legger også inn et ikon for utvidelsen vår. Når de grunnleggende filene er satt opp, lager vi de første kildefilene som en proof of concept. Det er så på tide å teste utvidelsen i Google Chrome! Den gjør ikke stort ennå, men det er viktig å validere at oppsettet vårt fungerer før vi går videre.

1. Opprett et git-repository: `git init`
2. Husk .gitignore!

    ```gitignore
    # .gitignore
    
    dist/
    build/
    node_modules/
    tmp/
    typings/
    ``` 

3. Opprett en npm-pakke: `npm init`
4. Lag et Chrome Extension-manifest i `manifest.json`:

    ```json
    {
      "name": "<navn>",
      "description": "<beskrivelse>",
      "version": "0.0.1",
      "manifest_version": 2,
      "permissions": [],
      "icons": {
        "128": "resources/icon128.png"
      },
      "content_scripts": [{
        "matches": ["*://*.stackoverflow.com/*"],
        "js": ["contentScript.js"]
      }]
    }
    ```
    
5. Installer typescript globalt: `$ npm install -g typescript`
6. Lag en `typescript.json` for å deklarere kompileringen av Typescript i prosjektet. Vi targeter ES5 siden det kjører i Chrome.
    
    ```json
    {
      "compilerOptions": {
        "target": "es5",
        "outDir": "build",
        "noImplicitAny": false
      },
      "exclude": [
        "node_modules",
        "build"
      ]
    }
    ```
  
7. src/contentScript.ts

    ```javascript
    // src/contentScript.ts
    
    var hello = document.createElement('p');
    hello.textContent = 'Hello CDU!';
    document.body.appendChild(hello);
    ```
    
8. src/contentScript.spec.ts (????? -- ;)...)

    ```javascript
    // src/contentScript.spec.ts
    
    // TODO: test applikasjonen! (husk å late som at du skrev testene først)
    ```
    
9. Ikonet vårt! https://github.com/ingfy/crispy-lamp/resources/icon128.png
10. Bygg ts-fila manuelt og lag pakke manuelt:

    ```bash
    $ mkdir build
    $ mkdir build/resources
    $ cp resources/icon128.png build/resources
    $ cp manifest.json build
    $ tsc
    ```

11. Last inn i Chrome som developer extension via [Chrome sin extension-side](chrome://extension) og gå til StackOverflow og sjekk at det kommer en ny tag der

### 3. Gulp: Starte på gulpfila

Vi vil bruke gulp til å bygge prosjektet siden det er veldig fleksibelt og lett å bruke. Vi kan også skrive gulpfiler i Typescript! Det gir oss enda en mulighet for å bruke TS. Vi setter opp en ganske grunnleggende gulpfil for å bygge prosjektet, og så bruker vi den til å automatisere opprettingen av pakken.

1. Legg til `gulpfile.ts` i "exclude" i typescript.json:

    ```json
    {
      "...": "...",
      "exclude": ["gulpfile.ts", "..."]
    }
    ```
2. Installere gulp og de pluginene vi trenger:

    ```bash
    $ npm install -g gulp
    $ npm install --save-dev typescript gulp del gulp-sourcemaps gulp-typescript
    ``` 
    
3. Lag en gulpfile.js som kjører en gulpfile.ts med typescript.transpile();
    
    ```javascript
    // gulpfile.js
    
    let typescript = require('typescript');
    let fs = require('fs');
    let gulpfile = fs.readFileSync('./gulpfile.ts').toString();
    eval(typescript.transpile(gulpfile));
    ```

4. Starte med typings. Typings er et program som lar oss laste ned og holde styr på typedeklarasjoner som Typescript kan bruke.

  a. Installere typings globalt og lokalt: `npm install -g typings; npm install --save-dev typings`
  b. Last ned typings vi trenger til hele prosjektet: https://github.com/ingfy/crispy-lamp/blob/master/typings.json og lagre som fil typings.json
  c. Installer typene med `typings install`
    
5. Legg til typings browser-filer i exclude i `typescript.json`. Siden vi kan generere sourcemaps med hjelp av gulp, skrur vi det også av:
 
    ```json
    {
      "compilerOptions": {
        "...": "...",
        "sourceMap": false
      },
      "exclude": [
        "...", 
        "typings/browser.d.ts",
        "typings/browser"
      ]
    }
    ```
    
6. 
    
5. Opprett en gulpfile.ts med must-have gulpoppgaver: compile, build (default), resources, manifest, clean og watch:
  
    ```typescript
    // gulpfile.ts

    import gulp = require('gulp');
    import del = require('del');
    import sourcemaps = require('gulp-sourcemaps');
    import typescript = require('gulp-typescript');
    import fs = require('fs');

    gulp.task('compile', () => {
        let project = typescript.createProject('tsconfig.json');
        
        return project.src()
          .pipe(sourcemaps.init())
          .pipe(typescript(project))
          .pipe(sourcemaps.write({sourceRoot: './src'}))
          .pipe(gulp.dest('build'));
    });

    gulp.task('manifest', () => {
        return gulp.src('manifest.json')
          .pipe(gulp.dest('build'));
    });

    gulp.task('resources', () => {
        return gulp.src('resources/**/*')
          .pipe(gulp.dest('build/resources'));
    });
    
    gulp.task('build', ['compile', 'manifest', 'resources']);

    gulp.task('clean', cb => del.sync(['build']));

    gulp.task('watch', () => gulp.watch("src/**/*", ['build']));

    gulp.task('default', ['build']);
    ```
  
6. Hvorfor må vi bruke en merkelig måte på å transpilere gulpfila?
7. Få "POC-utvidelsen" til å kjøre med gulp. Kjør `gulp build` og reload utvidelsen med Chrome Extension-sida. Refresh StackOverflow-sida og verifiser at hilsenen er der fortsatt.
8. Gå inn i Developer Tools i Google Chrome og sjekk at sourcemaps virker.

### 4. Hva med flere kildekodefiler i applikasjonen?

Vi vil så absolutt bruke Typescript sitt modulsystem. Vi trenger et modulsystem som nettleseren støtter, siden Chrome-utvidelser kjører i nettleseren. SystemJS gir svaret: "universell modullaster for JavaScript". Vanligvis brukes SystemJS med at bibiolteket lastes først i en browser, også kjøres en konfigurasjon, før den første fila lastes og kjøres ved hjelp av `System.import()`. Vi kan konkattenere disse tre stegene til en JavaScript-fil ved hjelp av en gulptask. Vi ender dermed opp med en ny fil som entry-point til content-scriptet vårt.
 
1. Installer SystemJS: `npm install --save system.js`
2. Fortell typescript-kompilatoren at den skal generere SystemJS-moduler ved å endre `typescript.json`:
 
    ```json
    {
        "compilerOptions": {
            "module": "system",
            "...": "..."
        },
        "...": "..."
    }
    ```

3. Skriv om `hello.ts` til å eksponere en `main()`-funksjon som inneholder funksjonaliteten:

    ```typescript
    // src/hello.ts
    
    export function main() {
      var hello = document.createElement('p');
      
      hello.textContent = 'Hello CDU!';
      document.body.appendChild(hello);
    }
    ```

4. Ny fil som kan konfe SystemJS til å bruke en pakke som vi kaller "app" og laste applikasjonen:

    ```javascript
    // system.loader.js
    
    System.config({
      baseURL: chrome.extension.getURL('/'), // Hent den merkelige hash-URL-en til utvidelsen. Sjekk Chrome dev tools!
      packages: {
        'app': {
          defaultExtension: 'js'
        }
      }
    })
    
    System.import('app/hello').then(entry => entry.main());
    ```

5. Modifiser compile-oppgaven slik at den spytter ut filer til `build/app`:

    ```typescript
    // gulpfile.ts
    
    gulp.task('compile, () => {
        //...
        .pipe(gulp.dest('build/app'));
    });
    ```

6. Nytt entry point: Omdøp `src/contentScript.ts` til `src/hello.ts` (og tilsvarende med .spec.ts-fila)
7. Installer gulp-concat: `npm install --save-dev gulp-concat`
8. Ny gulp-task: "loader", og endre på "build"-oppgaven til å kjøre den:

    ```typescript
    // gulpfile.ts
    
    import concat = require('gulp-concat');
    
    gulp.task('loader', ['compile'], () => {
      return gulp.src(['node_modules/systemjs/dist/system.src.js', 'system.loader.js'])
        .pipe(concat('contentScript.js'))
        .pipe(gulp.dest('build'));
    });
    
    gulp.task('build', ['compile', 'manifest', 'resources', 'loader']);
    ```
    
8. Utvid manifestet `manifest.json` til å deklarere alle javascript-filene i "app"-pakken som tilgjengelige via XHR:

    ```json
    {
      "...": "...",
      "web_accessible_resources": ["app/*.js"]
    }
    ```
9. Bygg utvidelsen på nytt med `gulp build`. Sjekk at SystemJS fungerer ved å laste utvidelsen på nytt (gå til [Chrome sin extension side](chrome://extensions) og trykk på "reload"). Gå så til StackOverflow-spørsmålet og valider at hilsingen fortsatt ligger der.

### 5. Sette opp enhetstester

Hvordan skal vi kjøre testene? Rene unittester? I kontekst av en browser? Headless? Vi bruker testrammeverket Mocha og assertion-bibioteket chai fordi det er enkelt. Vi kjører Mocha gjennom Karma, som setter opp en "hodeløs" nettleser som heter PhantomJS. Dermed kan vi teste kode i kontekst av en nettleser--slik som utvidelsen (som er et innholdsscript) vil kjøre.  

1. Skriv en test for `hello.ts`:

    ```typescript
    // src/hello.spec.ts
    
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
    ```

2. Installer Mocha, Chai, Karma, PhantomJS og avhengigheter:

    ```bash
    $ npm install --save-dev karma mocha karma-mocha chai karma-mocha-reporter phantomjs-prebuilt karma-phantomjs-launcher
    ```
    
3. Konfigurer karma til å bruke Mocha og PhantomJS, og å hente opp kompilerte filer:

    ```javascript
    // karma.conf.js
    
    'use strict';

    module.exports = config => {
      config.set({
        basePath: './',        
        frameworks: ['mocha'],
        plugins: [
          'karma-mocha', 
          'karma-phantomjs-launcher',
          'karma-mocha-reporter'
        ],
        files: [
          {pattern: 'build/*.js', incldued: false, watched: true},
          {pattern: 'build/**/*.js', incldued: false, watched: true},
          {pattern: 'build/*.spec.js', included: true, watched: true},
          {pattern: 'build/**/*.spec.js', included: true, watched: true}
        ],
        exclude: [
          'build/contentScript.js'
        ],
        reporters: ['mocha'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_WARN,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: true
      });
    };
    ```

4. Konfigurer Karma til å bruke SystemJS, og PhantomJS, og la filer hente opp chai gjennom systemjs konfig, ved å merge inn følgende konfigurasjon for SystemJS:

    ```javascript
    // karma.conf.js
    
    ...      
      frameworks: ['systemjs', ...],
      plugins: ['karma-systemjs', ...],
      systemjs: {
        config: {
          transpiler: null,
          paths: {
            'systemjs': 'node_modules/systemjs/dist/system.js',
            'chai': 'node_modules/chai/chai.js'
          },
          packages: {
            'build/app': {
              defaultExtension: 'js'
            }
          }
        },
        serveFiles: [
          'node_modules/**/*.js',
          'build/**/*.js'
        ]
      },
    ...
    
    ```

5. Kjør karma direkte og test: `.\node_modules\.bin\karma start`
6. Lag gulp-tasker for å starte karma og watche:

    ```typescript
    // gulpfile.ts
        
    import {Server as KarmaServer} from 'karma';
    import { join } from 'path';
    
    function runKarma(singleRun: boolean, cb?: () => void) {    
      new KarmaServer({
        configFile: path.join(__dirname, 'karma.conf.js'),
        singleRun: singleRun
      }, cb).start();
    }
    
    gulp.task('test', ['build'], cb => runKarma(true, cb));
    gulp.task('test-watch', cb => runKarma(false, cb));    
    gulp.task('watch', () => {
      gulp.watch("src/**/*", ['build']);
      runKarma(false);
    });
    ```
    
7. Kjør testene fra gulp med `gulp test`!

### 6. Programmere utvidelsen med watch kjørende

Tid for å utvikle selve funksjonaliteten til utvidelsen, og ta i bruk Typescript for alvor!

1. Start `gulp watch` og ha den kjørende synlig mens vi koder.
2. Siden strategien vår er å legge inn DOM-elementer på StackOverflow-siden må vi ha kode for å opprette disse elementene. Vi starter med å lage en modul `dom.ts` og tilhørende `dom.spec.ts`.
  
  a. Modulen `dom.ts` må eksportere en funksjon for å lage skjemaet vi skal dytte inn på siden, og vi lager en utility-funksjon for å lage et generelt element med gitte attributter. Vi eksporterer også denne funksjonen, slik at vi kan teste den. Vi definerer API-et til "dom"-modulen:
  
  
    ```typescript
    // src/dom.ts
    export function createCodepenForm(language: string, code: string): HTMLFormElement {}
    export function createElement<T extends HTMLElement>(type: string, attributes: {[key: string]: string} = {}): T {}
    ```
        
  b. I god testdrevet stil skriver vi nå tester som spesifiserer funksjonaliteten til modulen:

    ```typescript
    // src/dom.spec.ts
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
    ```
  
  c. Deretter skriver vi implementasjonen, med god hjelp av Typescript sitt typesystem:
  
    ```typescript
    // src/dom.ts
    
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
    ```
        
3. Vi trenger en modul som tolker klassene fra et StackOverflow `<pre>`-element og gir oss språk-navn som Codepad kan tolke.
  
  a. Vi oppretter `language.ts` med signaturen vi trenger:
    
    ```typescript
    // src/language.ts
    export function getLanguage(element: HTMLElement): string {}
    ```
    
  b. Vi oppretter `language.spec.ts` og skriver en test for å verifisere funksjonaliteten:
      
    ```typescript
    // src/language.spec.ts
    
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
          var e = createElement('pre', {'class': 'lang-cpp'});
          expect(language.getLanguage(e)).to.equal('C++');
        });        
      });
    });
    ```
      
  c. Vi fyller inn `language.ts` med funkjsonalitet for å tolke programmeringsspråk:
  
    ```typescript
    // src/language.ts
    
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
    ```
      
4. Til slutt trenger vi en hovedmodul som tolker StackOverflow-siden og legger inn knapper.
  
  a. Vi oppretter `processStackOverflow.ts` og definerer signaturene vi trenger:
  
    ```typescript
    // src/processStackOverflow.ts
    
    export function addOpenButton(codeElement: Element) {}
    export function main() {}
    ```
      
  b. Vi skriver enhetstester i `processStackOverflow.spec.ts` for å spesifisere funksjonaliteten. Vi tester mot HTML-en til en ekte post som vi finner på StackOverflow: http://stackoverflow.com/a/53522
    
    ```typescript
    // src/processStackOverflow.spec.ts
    import {expect} from 'chai';

    import * as processStackOverflow from './processStackOverflow';

    describe('processStackOverflow', () => {
      describe('addOpenButton', () => {
        var dummyPost;
        
        beforeEach(() => {
          dummyPost = document.createElement('div');
          dummyPost.innerHTML = '<div class="post-text" itemprop="text"><pre class="lang-py prettyprint prettyprinted"><code><span class="kwd">if</span><span class="pln"> </span><span class="kwd">not</span><span class="pln"> a</span><span class="pun">:</span><span class="pln"></span><span class="kwd">print</span><span class="pln"> </span><span class="str">"List is empty"</span></code></pre><p>Using the implicit booleanness of the empty list is quite pythonic.</p></div>';
        });
        
        it('should add a single form element to the post', () => {
            processStackOverflow.addOpenButton(dummyPost.querySelector('pre code'));
            expect(dummyPost.querySelectorAll('form').length).to.equal(1);
        });
      });
    });
    ```
      
  c. Vi skriver funksjonaliteten:
  
    ```typescript
    // src/processStackOverflow.ts
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
    ```
      
5. Siden vi har laget en ny modul som skal være hovedmodulen må vi bytte entrypunkt i `system.loader.js`:
  
    ```javascript
    // system.loader.js
    
    //...
    System.import('app/processStackOverflow').then(process => process.main());
    ```
    
6. Slett de nå utdaterte filene vi begynte med `hello.ts` og `hello.spec.ts`.
      
7. Åpne [Google Chrome Extensions-siden](chrome://extensions), reload utvidelsen og sjekk StackOverflow! Test utvidelsen på et spørsmål: http://stackoverflow.com/a/2612815

### 7. Pakking av utvidelsen

For å automatisk pakke utvidelsen for publisering kan vi lage en "zip"-oppgave i gulp. Det finnes ikke typings for denne, så den må vi lage selv.

1. Vi trenger avhengigheten gulp-zip: `npm install --save-dev gulp-zip`
2. Skriv en typing for 'gulp-zip', for det vi trenger:

    ```typescript
    // custom-typings/gulp-zip.d.ts
    
    declare module 'gulp-zip' {
      function zip(filename: string): NodeJS.ReadWriteStream;
      
      export = zip;
    }
    ```
  
3. Legg inn en referanse til typingen og opprett tasken:

    ```typescript    
    // gulpfile.ts
    /// <reference path="./custom-typings/gulp-zip.d.ts" />
    
    import zip = require('gulp-zip');
    
    // ...
    
    gulp.task('zip', ['build'], () => {
      let manifest = JSON.parse(fs.readFileSync('build/manifest.json').toString());
      let packageName = `${manifest.name} v${manifest.version}`;
      let packageFileName = `${packageName}.zip`;
      
      return gulp.src('build/**/*')
        .pipe(zip(packageName))
        .pipe(gulp.dest('dist'));
    });
    ```
  
4. Kjør `gulp zip` for å lage en pakke, som havner i `dist/`!
