import {expect} from 'chai';

import * as processStackOverflow from './processStackOverflow';

describe('processStackOverflow', () => {
    describe('addOpenButton', () => {
        var dummyPost;
        
        beforeEach(() => {
            dummyPost = document.createElement('div');
            dummyPost.innerHTML = `<div class="post-text" itemprop="text">
<pre class="lang-py prettyprint prettyprinted"><code><span class="kwd">if</span><span class="pln"> </span><span class="kwd">not</span><span class="pln"> a</span><span class="pun">:</span><span class="pln">
  </span><span class="kwd">print</span><span class="pln"> </span><span class="str">"List is empty"</span></code></pre>

<p>Using the implicit booleanness of the empty list is quite pythonic.</p>
    </div>`;
        });
        
        it('should add a single form element to the post', () => {
            processStackOverflow.addOpenButton(dummyPost.querySelector('pre code'));
            expect(dummyPost.querySelectorAll('form').length).to.equal(1);
        });
    });
});