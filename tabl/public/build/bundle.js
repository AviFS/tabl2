var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function r(t){return"function"==typeof t}function c(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function i(t,n){t.appendChild(n)}function u(t,n,e){t.insertBefore(n,e||null)}function s(t){t.parentNode.removeChild(t)}function a(t){return document.createElement(t)}function l(){return t=" ",document.createTextNode(t);var t}function f(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}let d;function p(t){d=t}const $=[],h=[],g=[],m=[],b=Promise.resolve();let v=!1;function y(t){g.push(t)}const _=new Set;let x=0;function k(){const t=d;do{for(;x<$.length;){const t=$[x];x++,p(t),w(t.$$)}for(p(null),$.length=0,x=0;h.length;)h.pop()();for(let t=0;t<g.length;t+=1){const n=g[t];_.has(n)||(_.add(n),n())}g.length=0}while($.length);for(;m.length;)m.pop()();v=!1,_.clear(),p(t)}function w(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(y)}}const E=new Set;function A(t,n){t&&t.i&&(E.delete(t),t.i(n))}function j(t,e,c,i){const{fragment:u,on_mount:s,on_destroy:a,after_update:l}=t.$$;u&&u.m(e,c),i||y((()=>{const e=s.map(n).filter(r);a?a.push(...e):o(e),t.$$.on_mount=[]})),l.forEach(y)}function M(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function N(t,n){-1===t.$$.dirty[0]&&($.push(t),v||(v=!0,b.then(k)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function O(n,r,c,i,u,a,l,f=[-1]){const $=d;p(n);const h=n.$$={fragment:null,ctx:null,props:a,update:t,not_equal:u,bound:e(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(r.context||($?$.$$.context:[])),callbacks:e(),dirty:f,skip_bound:!1,root:r.target||$.$$.root};l&&l(h.root);let g=!1;if(h.ctx=c?c(n,r.props||{},((t,e,...o)=>{const r=o.length?o[0]:e;return h.ctx&&u(h.ctx[t],h.ctx[t]=r)&&(!h.skip_bound&&h.bound[t]&&h.bound[t](r),g&&N(n,t)),e})):[],h.update(),g=!0,o(h.before_update),h.fragment=!!i&&i(h.ctx),r.target){if(r.hydrate){const t=function(t){return Array.from(t.childNodes)}(r.target);h.fragment&&h.fragment.l(t),t.forEach(s)}else h.fragment&&h.fragment.c();r.intro&&A(n.$$.fragment),j(n,r.target,r.anchor,r.customElement),k()}p($)}class T{$destroy(){M(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function q(n){let e;return{c(){e=a("main"),e.innerHTML='<textarea id="left" class="child svelte-10f4kgn"></textarea> \n    <div id="right" class="child svelte-10f4kgn"></div>',f(e,"class","svelte-10f4kgn")},m(t,n){u(t,e,n)},p:t,i:t,o:t,d(t){t&&s(e)}}}class C extends T{constructor(t){super(),O(this,t,null,q,c,{})}}function H(n){let e,o,r,c,d;return c=new C({}),{c(){var t;e=a("main"),o=a("div"),o.innerHTML='<div id="input" contenteditable="true"></div> \n       <div id="output"></div>',r=l(),(t=c.$$.fragment)&&t.c(),f(o,"id","inout"),f(e,"class","svelte-1qx0deh")},m(t,n){u(t,e,n),i(e,o),i(e,r),j(c,e,null),d=!0},p:t,i(t){d||(A(c.$$.fragment,t),d=!0)},o(t){!function(t,n,e,o){if(t&&t.o){if(E.has(t))return;E.add(t),(void 0).c.push((()=>{E.delete(t),o&&(e&&t.d(1),o())})),t.o(n)}}(c.$$.fragment,t),d=!1},d(t){t&&s(e),M(c)}}}return new class extends T{constructor(t){super(),O(this,t,null,H,c,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
