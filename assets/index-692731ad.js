(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const o of l)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function r(l){const o={};return l.integrity&&(o.integrity=l.integrity),l.referrerPolicy&&(o.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?o.credentials="include":l.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(l){if(l.ep)return;l.ep=!0;const o=r(l);fetch(l.href,o)}})();const style="";class Text{lineAt(e){if(e<0||e>this.length)throw new RangeError(`Invalid position ${e} in document of length ${this.length}`);return this.lineInner(e,!1,1,0)}line(e){if(e<1||e>this.lines)throw new RangeError(`Invalid line number ${e} in ${this.lines}-line document`);return this.lineInner(e,!0,1,0)}replace(e,r,s){let l=[];return this.decompose(0,e,l,2),s.length&&s.decompose(0,s.length,l,3),this.decompose(r,this.length,l,1),TextNode.from(l,this.length-(r-e)+s.length)}append(e){return this.replace(this.length,this.length,e)}slice(e,r=this.length){let s=[];return this.decompose(e,r,s,0),TextNode.from(s,r-e)}eq(e){if(e==this)return!0;if(e.length!=this.length||e.lines!=this.lines)return!1;let r=this.scanIdentical(e,1),s=this.length-this.scanIdentical(e,-1),l=new RawTextCursor(this),o=new RawTextCursor(e);for(let a=r,c=r;;){if(l.next(a),o.next(a),a=0,l.lineBreak!=o.lineBreak||l.done!=o.done||l.value!=o.value)return!1;if(c+=l.value.length,l.done||c>=s)return!0}}iter(e=1){return new RawTextCursor(this,e)}iterRange(e,r=this.length){return new PartialTextCursor(this,e,r)}iterLines(e,r){let s;if(e==null)s=this.iter();else{r==null&&(r=this.lines+1);let l=this.line(e).from;s=this.iterRange(l,Math.max(l,r==this.lines+1?this.length:r<=1?0:this.line(r-1).to))}return new LineCursor(s)}toString(){return this.sliceString(0)}toJSON(){let e=[];return this.flatten(e),e}constructor(){}static of(e){if(e.length==0)throw new RangeError("A document must have at least one line");return e.length==1&&!e[0]?Text.empty:e.length<=32?new TextLeaf(e):TextNode.from(TextLeaf.split(e,[]))}}class TextLeaf extends Text{constructor(e,r=textLength(e)){super(),this.text=e,this.length=r}get lines(){return this.text.length}get children(){return null}lineInner(e,r,s,l){for(let o=0;;o++){let a=this.text[o],c=l+a.length;if((r?s:c)>=e)return new Line(l,c,s,a);l=c+1,s++}}decompose(e,r,s,l){let o=e<=0&&r>=this.length?this:new TextLeaf(sliceText(this.text,e,r),Math.min(r,this.length)-Math.max(0,e));if(l&1){let a=s.pop(),c=appendText(o.text,a.text.slice(),0,o.length);if(c.length<=32)s.push(new TextLeaf(c,a.length+o.length));else{let M=c.length>>1;s.push(new TextLeaf(c.slice(0,M)),new TextLeaf(c.slice(M)))}}else s.push(o)}replace(e,r,s){if(!(s instanceof TextLeaf))return super.replace(e,r,s);let l=appendText(this.text,appendText(s.text,sliceText(this.text,0,e)),r),o=this.length+s.length-(r-e);return l.length<=32?new TextLeaf(l,o):TextNode.from(TextLeaf.split(l,[]),o)}sliceString(e,r=this.length,s=`
`){let l="";for(let o=0,a=0;o<=r&&a<this.text.length;a++){let c=this.text[a],M=o+c.length;o>e&&a&&(l+=s),e<M&&r>o&&(l+=c.slice(Math.max(0,e-o),r-o)),o=M+1}return l}flatten(e){for(let r of this.text)e.push(r)}scanIdentical(){return 0}static split(e,r){let s=[],l=-1;for(let o of e)s.push(o),l+=o.length+1,s.length==32&&(r.push(new TextLeaf(s,l)),s=[],l=-1);return l>-1&&r.push(new TextLeaf(s,l)),r}}class TextNode extends Text{constructor(e,r){super(),this.children=e,this.length=r,this.lines=0;for(let s of e)this.lines+=s.lines}lineInner(e,r,s,l){for(let o=0;;o++){let a=this.children[o],c=l+a.length,M=s+a.lines-1;if((r?M:c)>=e)return a.lineInner(e,r,s,l);l=c+1,s=M+1}}decompose(e,r,s,l){for(let o=0,a=0;a<=r&&o<this.children.length;o++){let c=this.children[o],M=a+c.length;if(e<=M&&r>=a){let f=l&((a<=e?1:0)|(M>=r?2:0));a>=e&&M<=r&&!f?s.push(c):c.decompose(e-a,r-a,s,f)}a=M+1}}replace(e,r,s){if(s.lines<this.lines)for(let l=0,o=0;l<this.children.length;l++){let a=this.children[l],c=o+a.length;if(e>=o&&r<=c){let M=a.replace(e-o,r-o,s),f=this.lines-a.lines+M.lines;if(M.lines<f>>5-1&&M.lines>f>>5+1){let u=this.children.slice();return u[l]=M,new TextNode(u,this.length-(r-e)+s.length)}return super.replace(o,c,M)}o=c+1}return super.replace(e,r,s)}sliceString(e,r=this.length,s=`
`){let l="";for(let o=0,a=0;o<this.children.length&&a<=r;o++){let c=this.children[o],M=a+c.length;a>e&&o&&(l+=s),e<M&&r>a&&(l+=c.sliceString(e-a,r-a,s)),a=M+1}return l}flatten(e){for(let r of this.children)r.flatten(e)}scanIdentical(e,r){if(!(e instanceof TextNode))return 0;let s=0,[l,o,a,c]=r>0?[0,0,this.children.length,e.children.length]:[this.children.length-1,e.children.length-1,-1,-1];for(;;l+=r,o+=r){if(l==a||o==c)return s;let M=this.children[l],f=e.children[o];if(M!=f)return s+M.scanIdentical(f,r);s+=M.length+1}}static from(e,r=e.reduce((s,l)=>s+l.length+1,-1)){let s=0;for(let p of e)s+=p.lines;if(s<32){let p=[];for(let m of e)m.flatten(p);return new TextLeaf(p,r)}let l=Math.max(32,s>>5),o=l<<1,a=l>>1,c=[],M=0,f=-1,u=[];function g(p){let m;if(p.lines>o&&p instanceof TextNode)for(let w of p.children)g(w);else p.lines>a&&(M>a||!M)?(d(),c.push(p)):p instanceof TextLeaf&&M&&(m=u[u.length-1])instanceof TextLeaf&&p.lines+m.lines<=32?(M+=p.lines,f+=p.length+1,u[u.length-1]=new TextLeaf(m.text.concat(p.text),m.length+1+p.length)):(M+p.lines>l&&d(),M+=p.lines,f+=p.length+1,u.push(p))}function d(){M!=0&&(c.push(u.length==1?u[0]:TextNode.from(u,f)),f=-1,M=u.length=0)}for(let p of e)g(p);return d(),c.length==1?c[0]:new TextNode(c,r)}}Text.empty=new TextLeaf([""],0);function textLength(h){let e=-1;for(let r of h)e+=r.length+1;return e}function appendText(h,e,r=0,s=1e9){for(let l=0,o=0,a=!0;o<h.length&&l<=s;o++){let c=h[o],M=l+c.length;M>=r&&(M>s&&(c=c.slice(0,s-l)),l<r&&(c=c.slice(r-l)),a?(e[e.length-1]+=c,a=!1):e.push(c)),l=M+1}return e}function sliceText(h,e,r){return appendText(h,[""],e,r)}class RawTextCursor{constructor(e,r=1){this.dir=r,this.done=!1,this.lineBreak=!1,this.value="",this.nodes=[e],this.offsets=[r>0?1:(e instanceof TextLeaf?e.text.length:e.children.length)<<1]}nextInner(e,r){for(this.done=this.lineBreak=!1;;){let s=this.nodes.length-1,l=this.nodes[s],o=this.offsets[s],a=o>>1,c=l instanceof TextLeaf?l.text.length:l.children.length;if(a==(r>0?c:0)){if(s==0)return this.done=!0,this.value="",this;r>0&&this.offsets[s-1]++,this.nodes.pop(),this.offsets.pop()}else if((o&1)==(r>0?0:1)){if(this.offsets[s]+=r,e==0)return this.lineBreak=!0,this.value=`
`,this;e--}else if(l instanceof TextLeaf){let M=l.text[a+(r<0?-1:0)];if(this.offsets[s]+=r,M.length>Math.max(0,e))return this.value=e==0?M:r>0?M.slice(e):M.slice(0,M.length-e),this;e-=M.length}else{let M=l.children[a+(r<0?-1:0)];e>M.length?(e-=M.length,this.offsets[s]+=r):(r<0&&this.offsets[s]--,this.nodes.push(M),this.offsets.push(r>0?1:(M instanceof TextLeaf?M.text.length:M.children.length)<<1))}}}next(e=0){return e<0&&(this.nextInner(-e,-this.dir),e=this.value.length),this.nextInner(e,this.dir)}}class PartialTextCursor{constructor(e,r,s){this.value="",this.done=!1,this.cursor=new RawTextCursor(e,r>s?-1:1),this.pos=r>s?e.length:0,this.from=Math.min(r,s),this.to=Math.max(r,s)}nextInner(e,r){if(r<0?this.pos<=this.from:this.pos>=this.to)return this.value="",this.done=!0,this;e+=Math.max(0,r<0?this.pos-this.to:this.from-this.pos);let s=r<0?this.pos-this.from:this.to-this.pos;e>s&&(e=s),s-=e;let{value:l}=this.cursor.next(e);return this.pos+=(l.length+e)*r,this.value=l.length<=s?l:r<0?l.slice(l.length-s):l.slice(0,s),this.done=!this.value,this}next(e=0){return e<0?e=Math.max(e,this.from-this.pos):e>0&&(e=Math.min(e,this.to-this.pos)),this.nextInner(e,this.cursor.dir)}get lineBreak(){return this.cursor.lineBreak&&this.value!=""}}class LineCursor{constructor(e){this.inner=e,this.afterBreak=!0,this.value="",this.done=!1}next(e=0){let{done:r,lineBreak:s,value:l}=this.inner.next(e);return r?(this.done=!0,this.value=""):s?this.afterBreak?this.value="":(this.afterBreak=!0,this.next()):(this.value=l,this.afterBreak=!1),this}get lineBreak(){return!1}}typeof Symbol<"u"&&(Text.prototype[Symbol.iterator]=function(){return this.iter()},RawTextCursor.prototype[Symbol.iterator]=PartialTextCursor.prototype[Symbol.iterator]=LineCursor.prototype[Symbol.iterator]=function(){return this});class Line{constructor(e,r,s,l){this.from=e,this.to=r,this.number=s,this.text=l}get length(){return this.to-this.from}}let extend="lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map(h=>h?parseInt(h,36):1);for(let h=1;h<extend.length;h++)extend[h]+=extend[h-1];function isExtendingChar(h){for(let e=1;e<extend.length;e+=2)if(extend[e]>h)return extend[e-1]<=h;return!1}function isRegionalIndicator(h){return h>=127462&&h<=127487}const ZWJ=8205;function findClusterBreak(h,e,r=!0,s=!0){return(r?nextClusterBreak:prevClusterBreak)(h,e,s)}function nextClusterBreak(h,e,r){if(e==h.length)return e;e&&surrogateLow(h.charCodeAt(e))&&surrogateHigh(h.charCodeAt(e-1))&&e--;let s=codePointAt(h,e);for(e+=codePointSize(s);e<h.length;){let l=codePointAt(h,e);if(s==ZWJ||l==ZWJ||r&&isExtendingChar(l))e+=codePointSize(l),s=l;else if(isRegionalIndicator(l)){let o=0,a=e-2;for(;a>=0&&isRegionalIndicator(codePointAt(h,a));)o++,a-=2;if(o%2==0)break;e+=2}else break}return e}function prevClusterBreak(h,e,r){for(;e>0;){let s=nextClusterBreak(h,e-2,r);if(s<e)return s;e--}return 0}function surrogateLow(h){return h>=56320&&h<57344}function surrogateHigh(h){return h>=55296&&h<56320}function codePointAt(h,e){let r=h.charCodeAt(e);if(!surrogateHigh(r)||e+1==h.length)return r;let s=h.charCodeAt(e+1);return surrogateLow(s)?(r-55296<<10)+(s-56320)+65536:r}function fromCodePoint(h){return h<=65535?String.fromCharCode(h):(h-=65536,String.fromCharCode((h>>10)+55296,(h&1023)+56320))}function codePointSize(h){return h<65536?1:2}const DefaultSplit=/\r\n?|\n/;var MapMode=function(h){return h[h.Simple=0]="Simple",h[h.TrackDel=1]="TrackDel",h[h.TrackBefore=2]="TrackBefore",h[h.TrackAfter=3]="TrackAfter",h}(MapMode||(MapMode={}));class ChangeDesc{constructor(e){this.sections=e}get length(){let e=0;for(let r=0;r<this.sections.length;r+=2)e+=this.sections[r];return e}get newLength(){let e=0;for(let r=0;r<this.sections.length;r+=2){let s=this.sections[r+1];e+=s<0?this.sections[r]:s}return e}get empty(){return this.sections.length==0||this.sections.length==2&&this.sections[1]<0}iterGaps(e){for(let r=0,s=0,l=0;r<this.sections.length;){let o=this.sections[r++],a=this.sections[r++];a<0?(e(s,l,o),l+=o):l+=a,s+=o}}iterChangedRanges(e,r=!1){iterChanges(this,e,r)}get invertedDesc(){let e=[];for(let r=0;r<this.sections.length;){let s=this.sections[r++],l=this.sections[r++];l<0?e.push(s,l):e.push(l,s)}return new ChangeDesc(e)}composeDesc(e){return this.empty?e:e.empty?this:composeSets(this,e)}mapDesc(e,r=!1){return e.empty?this:mapSet(this,e,r)}mapPos(e,r=-1,s=MapMode.Simple){let l=0,o=0;for(let a=0;a<this.sections.length;){let c=this.sections[a++],M=this.sections[a++],f=l+c;if(M<0){if(f>e)return o+(e-l);o+=c}else{if(s!=MapMode.Simple&&f>=e&&(s==MapMode.TrackDel&&l<e&&f>e||s==MapMode.TrackBefore&&l<e||s==MapMode.TrackAfter&&f>e))return null;if(f>e||f==e&&r<0&&!c)return e==l||r<0?o:o+M;o+=M}l=f}if(e>l)throw new RangeError(`Position ${e} is out of range for changeset of length ${l}`);return o}touchesRange(e,r=e){for(let s=0,l=0;s<this.sections.length&&l<=r;){let o=this.sections[s++],a=this.sections[s++],c=l+o;if(a>=0&&l<=r&&c>=e)return l<e&&c>r?"cover":!0;l=c}return!1}toString(){let e="";for(let r=0;r<this.sections.length;){let s=this.sections[r++],l=this.sections[r++];e+=(e?" ":"")+s+(l>=0?":"+l:"")}return e}toJSON(){return this.sections}static fromJSON(e){if(!Array.isArray(e)||e.length%2||e.some(r=>typeof r!="number"))throw new RangeError("Invalid JSON representation of ChangeDesc");return new ChangeDesc(e)}static create(e){return new ChangeDesc(e)}}class ChangeSet extends ChangeDesc{constructor(e,r){super(e),this.inserted=r}apply(e){if(this.length!=e.length)throw new RangeError("Applying change set to a document with the wrong length");return iterChanges(this,(r,s,l,o,a)=>e=e.replace(l,l+(s-r),a),!1),e}mapDesc(e,r=!1){return mapSet(this,e,r,!0)}invert(e){let r=this.sections.slice(),s=[];for(let l=0,o=0;l<r.length;l+=2){let a=r[l],c=r[l+1];if(c>=0){r[l]=c,r[l+1]=a;let M=l>>1;for(;s.length<M;)s.push(Text.empty);s.push(a?e.slice(o,o+a):Text.empty)}o+=a}return new ChangeSet(r,s)}compose(e){return this.empty?e:e.empty?this:composeSets(this,e,!0)}map(e,r=!1){return e.empty?this:mapSet(this,e,r,!0)}iterChanges(e,r=!1){iterChanges(this,e,r)}get desc(){return ChangeDesc.create(this.sections)}filter(e){let r=[],s=[],l=[],o=new SectionIter(this);e:for(let a=0,c=0;;){let M=a==e.length?1e9:e[a++];for(;c<M||c==M&&o.len==0;){if(o.done)break e;let u=Math.min(o.len,M-c);addSection(l,u,-1);let g=o.ins==-1?-1:o.off==0?o.ins:0;addSection(r,u,g),g>0&&addInsert(s,r,o.text),o.forward(u),c+=u}let f=e[a++];for(;c<f;){if(o.done)break e;let u=Math.min(o.len,f-c);addSection(r,u,-1),addSection(l,u,o.ins==-1?-1:o.off==0?o.ins:0),o.forward(u),c+=u}}return{changes:new ChangeSet(r,s),filtered:ChangeDesc.create(l)}}toJSON(){let e=[];for(let r=0;r<this.sections.length;r+=2){let s=this.sections[r],l=this.sections[r+1];l<0?e.push(s):l==0?e.push([s]):e.push([s].concat(this.inserted[r>>1].toJSON()))}return e}static of(e,r,s){let l=[],o=[],a=0,c=null;function M(u=!1){if(!u&&!l.length)return;a<r&&addSection(l,r-a,-1);let g=new ChangeSet(l,o);c=c?c.compose(g.map(c)):g,l=[],o=[],a=0}function f(u){if(Array.isArray(u))for(let g of u)f(g);else if(u instanceof ChangeSet){if(u.length!=r)throw new RangeError(`Mismatched change set length (got ${u.length}, expected ${r})`);M(),c=c?c.compose(u.map(c)):u}else{let{from:g,to:d=g,insert:p}=u;if(g>d||g<0||d>r)throw new RangeError(`Invalid change range ${g} to ${d} (in doc of length ${r})`);let m=p?typeof p=="string"?Text.of(p.split(s||DefaultSplit)):p:Text.empty,w=m.length;if(g==d&&w==0)return;g<a&&M(),g>a&&addSection(l,g-a,-1),addSection(l,d-g,w),addInsert(o,l,m),a=d}}return f(e),M(!c),c}static empty(e){return new ChangeSet(e?[e,-1]:[],[])}static fromJSON(e){if(!Array.isArray(e))throw new RangeError("Invalid JSON representation of ChangeSet");let r=[],s=[];for(let l=0;l<e.length;l++){let o=e[l];if(typeof o=="number")r.push(o,-1);else{if(!Array.isArray(o)||typeof o[0]!="number"||o.some((a,c)=>c&&typeof a!="string"))throw new RangeError("Invalid JSON representation of ChangeSet");if(o.length==1)r.push(o[0],0);else{for(;s.length<l;)s.push(Text.empty);s[l]=Text.of(o.slice(1)),r.push(o[0],s[l].length)}}}return new ChangeSet(r,s)}static createSet(e,r){return new ChangeSet(e,r)}}function addSection(h,e,r,s=!1){if(e==0&&r<=0)return;let l=h.length-2;l>=0&&r<=0&&r==h[l+1]?h[l]+=e:e==0&&h[l]==0?h[l+1]+=r:s?(h[l]+=e,h[l+1]+=r):h.push(e,r)}function addInsert(h,e,r){if(r.length==0)return;let s=e.length-2>>1;if(s<h.length)h[h.length-1]=h[h.length-1].append(r);else{for(;h.length<s;)h.push(Text.empty);h.push(r)}}function iterChanges(h,e,r){let s=h.inserted;for(let l=0,o=0,a=0;a<h.sections.length;){let c=h.sections[a++],M=h.sections[a++];if(M<0)l+=c,o+=c;else{let f=l,u=o,g=Text.empty;for(;f+=c,u+=M,M&&s&&(g=g.append(s[a-2>>1])),!(r||a==h.sections.length||h.sections[a+1]<0);)c=h.sections[a++],M=h.sections[a++];e(l,f,o,u,g),l=f,o=u}}}function mapSet(h,e,r,s=!1){let l=[],o=s?[]:null,a=new SectionIter(h),c=new SectionIter(e);for(let M=-1;;)if(a.ins==-1&&c.ins==-1){let f=Math.min(a.len,c.len);addSection(l,f,-1),a.forward(f),c.forward(f)}else if(c.ins>=0&&(a.ins<0||M==a.i||a.off==0&&(c.len<a.len||c.len==a.len&&!r))){let f=c.len;for(addSection(l,c.ins,-1);f;){let u=Math.min(a.len,f);a.ins>=0&&M<a.i&&a.len<=u&&(addSection(l,0,a.ins),o&&addInsert(o,l,a.text),M=a.i),a.forward(u),f-=u}c.next()}else if(a.ins>=0){let f=0,u=a.len;for(;u;)if(c.ins==-1){let g=Math.min(u,c.len);f+=g,u-=g,c.forward(g)}else if(c.ins==0&&c.len<u)u-=c.len,c.next();else break;addSection(l,f,M<a.i?a.ins:0),o&&M<a.i&&addInsert(o,l,a.text),M=a.i,a.forward(a.len-u)}else{if(a.done&&c.done)return o?ChangeSet.createSet(l,o):ChangeDesc.create(l);throw new Error("Mismatched change set lengths")}}function composeSets(h,e,r=!1){let s=[],l=r?[]:null,o=new SectionIter(h),a=new SectionIter(e);for(let c=!1;;){if(o.done&&a.done)return l?ChangeSet.createSet(s,l):ChangeDesc.create(s);if(o.ins==0)addSection(s,o.len,0,c),o.next();else if(a.len==0&&!a.done)addSection(s,0,a.ins,c),l&&addInsert(l,s,a.text),a.next();else{if(o.done||a.done)throw new Error("Mismatched change set lengths");{let M=Math.min(o.len2,a.len),f=s.length;if(o.ins==-1){let u=a.ins==-1?-1:a.off?0:a.ins;addSection(s,M,u,c),l&&u&&addInsert(l,s,a.text)}else a.ins==-1?(addSection(s,o.off?0:o.len,M,c),l&&addInsert(l,s,o.textBit(M))):(addSection(s,o.off?0:o.len,a.off?0:a.ins,c),l&&!a.off&&addInsert(l,s,a.text));c=(o.ins>M||a.ins>=0&&a.len>M)&&(c||s.length>f),o.forward2(M),a.forward(M)}}}}class SectionIter{constructor(e){this.set=e,this.i=0,this.next()}next(){let{sections:e}=this.set;this.i<e.length?(this.len=e[this.i++],this.ins=e[this.i++]):(this.len=0,this.ins=-2),this.off=0}get done(){return this.ins==-2}get len2(){return this.ins<0?this.len:this.ins}get text(){let{inserted:e}=this.set,r=this.i-2>>1;return r>=e.length?Text.empty:e[r]}textBit(e){let{inserted:r}=this.set,s=this.i-2>>1;return s>=r.length&&!e?Text.empty:r[s].slice(this.off,e==null?void 0:this.off+e)}forward(e){e==this.len?this.next():(this.len-=e,this.off+=e)}forward2(e){this.ins==-1?this.forward(e):e==this.ins?this.next():(this.ins-=e,this.off+=e)}}class SelectionRange{constructor(e,r,s){this.from=e,this.to=r,this.flags=s}get anchor(){return this.flags&16?this.to:this.from}get head(){return this.flags&16?this.from:this.to}get empty(){return this.from==this.to}get assoc(){return this.flags&4?-1:this.flags&8?1:0}get bidiLevel(){let e=this.flags&3;return e==3?null:e}get goalColumn(){let e=this.flags>>5;return e==33554431?void 0:e}map(e,r=-1){let s,l;return this.empty?s=l=e.mapPos(this.from,r):(s=e.mapPos(this.from,1),l=e.mapPos(this.to,-1)),s==this.from&&l==this.to?this:new SelectionRange(s,l,this.flags)}extend(e,r=e){if(e<=this.anchor&&r>=this.anchor)return EditorSelection.range(e,r);let s=Math.abs(e-this.anchor)>Math.abs(r-this.anchor)?e:r;return EditorSelection.range(this.anchor,s)}eq(e){return this.anchor==e.anchor&&this.head==e.head}toJSON(){return{anchor:this.anchor,head:this.head}}static fromJSON(e){if(!e||typeof e.anchor!="number"||typeof e.head!="number")throw new RangeError("Invalid JSON representation for SelectionRange");return EditorSelection.range(e.anchor,e.head)}static create(e,r,s){return new SelectionRange(e,r,s)}}class EditorSelection{constructor(e,r){this.ranges=e,this.mainIndex=r}map(e,r=-1){return e.empty?this:EditorSelection.create(this.ranges.map(s=>s.map(e,r)),this.mainIndex)}eq(e){if(this.ranges.length!=e.ranges.length||this.mainIndex!=e.mainIndex)return!1;for(let r=0;r<this.ranges.length;r++)if(!this.ranges[r].eq(e.ranges[r]))return!1;return!0}get main(){return this.ranges[this.mainIndex]}asSingle(){return this.ranges.length==1?this:new EditorSelection([this.main],0)}addRange(e,r=!0){return EditorSelection.create([e].concat(this.ranges),r?0:this.mainIndex+1)}replaceRange(e,r=this.mainIndex){let s=this.ranges.slice();return s[r]=e,EditorSelection.create(s,this.mainIndex)}toJSON(){return{ranges:this.ranges.map(e=>e.toJSON()),main:this.mainIndex}}static fromJSON(e){if(!e||!Array.isArray(e.ranges)||typeof e.main!="number"||e.main>=e.ranges.length)throw new RangeError("Invalid JSON representation for EditorSelection");return new EditorSelection(e.ranges.map(r=>SelectionRange.fromJSON(r)),e.main)}static single(e,r=e){return new EditorSelection([EditorSelection.range(e,r)],0)}static create(e,r=0){if(e.length==0)throw new RangeError("A selection needs at least one range");for(let s=0,l=0;l<e.length;l++){let o=e[l];if(o.empty?o.from<=s:o.from<s)return EditorSelection.normalized(e.slice(),r);s=o.to}return new EditorSelection(e,r)}static cursor(e,r=0,s,l){return SelectionRange.create(e,e,(r==0?0:r<0?4:8)|(s==null?3:Math.min(2,s))|(l??33554431)<<5)}static range(e,r,s,l){let o=(s??33554431)<<5|(l==null?3:Math.min(2,l));return r<e?SelectionRange.create(r,e,24|o):SelectionRange.create(e,r,(r>e?4:0)|o)}static normalized(e,r=0){let s=e[r];e.sort((l,o)=>l.from-o.from),r=e.indexOf(s);for(let l=1;l<e.length;l++){let o=e[l],a=e[l-1];if(o.empty?o.from<=a.to:o.from<a.to){let c=a.from,M=Math.max(o.to,a.to);l<=r&&r--,e.splice(--l,2,o.anchor>o.head?EditorSelection.range(M,c):EditorSelection.range(c,M))}}return new EditorSelection(e,r)}}function checkSelection(h,e){for(let r of h.ranges)if(r.to>e)throw new RangeError("Selection points outside of document")}let nextID=0;class Facet{constructor(e,r,s,l,o){this.combine=e,this.compareInput=r,this.compare=s,this.isStatic=l,this.id=nextID++,this.default=e([]),this.extensions=typeof o=="function"?o(this):o}static define(e={}){return new Facet(e.combine||(r=>r),e.compareInput||((r,s)=>r===s),e.compare||(e.combine?(r,s)=>r===s:sameArray$1),!!e.static,e.enables)}of(e){return new FacetProvider([],this,0,e)}compute(e,r){if(this.isStatic)throw new Error("Can't compute a static facet");return new FacetProvider(e,this,1,r)}computeN(e,r){if(this.isStatic)throw new Error("Can't compute a static facet");return new FacetProvider(e,this,2,r)}from(e,r){return r||(r=s=>s),this.compute([e],s=>r(s.field(e)))}}function sameArray$1(h,e){return h==e||h.length==e.length&&h.every((r,s)=>r===e[s])}class FacetProvider{constructor(e,r,s,l){this.dependencies=e,this.facet=r,this.type=s,this.value=l,this.id=nextID++}dynamicSlot(e){var r;let s=this.value,l=this.facet.compareInput,o=this.id,a=e[o]>>1,c=this.type==2,M=!1,f=!1,u=[];for(let g of this.dependencies)g=="doc"?M=!0:g=="selection"?f=!0:((r=e[g.id])!==null&&r!==void 0?r:1)&1||u.push(e[g.id]);return{create(g){return g.values[a]=s(g),1},update(g,d){if(M&&d.docChanged||f&&(d.docChanged||d.selection)||ensureAll(g,u)){let p=s(g);if(c?!compareArray(p,g.values[a],l):!l(p,g.values[a]))return g.values[a]=p,1}return 0},reconfigure:(g,d)=>{let p,m=d.config.address[o];if(m!=null){let w=getAddr(d,m);if(this.dependencies.every(y=>y instanceof Facet?d.facet(y)===g.facet(y):y instanceof StateField?d.field(y,!1)==g.field(y,!1):!0)||(c?compareArray(p=s(g),w,l):l(p=s(g),w)))return g.values[a]=w,0}else p=s(g);return g.values[a]=p,1}}}}function compareArray(h,e,r){if(h.length!=e.length)return!1;for(let s=0;s<h.length;s++)if(!r(h[s],e[s]))return!1;return!0}function ensureAll(h,e){let r=!1;for(let s of e)ensureAddr(h,s)&1&&(r=!0);return r}function dynamicFacetSlot(h,e,r){let s=r.map(M=>h[M.id]),l=r.map(M=>M.type),o=s.filter(M=>!(M&1)),a=h[e.id]>>1;function c(M){let f=[];for(let u=0;u<s.length;u++){let g=getAddr(M,s[u]);if(l[u]==2)for(let d of g)f.push(d);else f.push(g)}return e.combine(f)}return{create(M){for(let f of s)ensureAddr(M,f);return M.values[a]=c(M),1},update(M,f){if(!ensureAll(M,o))return 0;let u=c(M);return e.compare(u,M.values[a])?0:(M.values[a]=u,1)},reconfigure(M,f){let u=ensureAll(M,s),g=f.config.facets[e.id],d=f.facet(e);if(g&&!u&&sameArray$1(r,g))return M.values[a]=d,0;let p=c(M);return e.compare(p,d)?(M.values[a]=d,0):(M.values[a]=p,1)}}}const initField=Facet.define({static:!0});class StateField{constructor(e,r,s,l,o){this.id=e,this.createF=r,this.updateF=s,this.compareF=l,this.spec=o,this.provides=void 0}static define(e){let r=new StateField(nextID++,e.create,e.update,e.compare||((s,l)=>s===l),e);return e.provide&&(r.provides=e.provide(r)),r}create(e){let r=e.facet(initField).find(s=>s.field==this);return((r==null?void 0:r.create)||this.createF)(e)}slot(e){let r=e[this.id]>>1;return{create:s=>(s.values[r]=this.create(s),1),update:(s,l)=>{let o=s.values[r],a=this.updateF(o,l);return this.compareF(o,a)?0:(s.values[r]=a,1)},reconfigure:(s,l)=>l.config.address[this.id]!=null?(s.values[r]=l.field(this),0):(s.values[r]=this.create(s),1)}}init(e){return[this,initField.of({field:this,create:e})]}get extension(){return this}}const Prec_={lowest:4,low:3,default:2,high:1,highest:0};function prec(h){return e=>new PrecExtension(e,h)}const Prec={highest:prec(Prec_.highest),high:prec(Prec_.high),default:prec(Prec_.default),low:prec(Prec_.low),lowest:prec(Prec_.lowest)};class PrecExtension{constructor(e,r){this.inner=e,this.prec=r}}class Compartment{of(e){return new CompartmentInstance(this,e)}reconfigure(e){return Compartment.reconfigure.of({compartment:this,extension:e})}get(e){return e.config.compartments.get(this)}}class CompartmentInstance{constructor(e,r){this.compartment=e,this.inner=r}}class Configuration{constructor(e,r,s,l,o,a){for(this.base=e,this.compartments=r,this.dynamicSlots=s,this.address=l,this.staticValues=o,this.facets=a,this.statusTemplate=[];this.statusTemplate.length<s.length;)this.statusTemplate.push(0)}staticFacet(e){let r=this.address[e.id];return r==null?e.default:this.staticValues[r>>1]}static resolve(e,r,s){let l=[],o=Object.create(null),a=new Map;for(let d of flatten(e,r,a))d instanceof StateField?l.push(d):(o[d.facet.id]||(o[d.facet.id]=[])).push(d);let c=Object.create(null),M=[],f=[];for(let d of l)c[d.id]=f.length<<1,f.push(p=>d.slot(p));let u=s==null?void 0:s.config.facets;for(let d in o){let p=o[d],m=p[0].facet,w=u&&u[d]||[];if(p.every(y=>y.type==0))if(c[m.id]=M.length<<1|1,sameArray$1(w,p))M.push(s.facet(m));else{let y=m.combine(p.map(b=>b.value));M.push(s&&m.compare(y,s.facet(m))?s.facet(m):y)}else{for(let y of p)y.type==0?(c[y.id]=M.length<<1|1,M.push(y.value)):(c[y.id]=f.length<<1,f.push(b=>y.dynamicSlot(b)));c[m.id]=f.length<<1,f.push(y=>dynamicFacetSlot(y,m,p))}}let g=f.map(d=>d(c));return new Configuration(e,a,g,c,M,o)}}function flatten(h,e,r){let s=[[],[],[],[],[]],l=new Map;function o(a,c){let M=l.get(a);if(M!=null){if(M<=c)return;let f=s[M].indexOf(a);f>-1&&s[M].splice(f,1),a instanceof CompartmentInstance&&r.delete(a.compartment)}if(l.set(a,c),Array.isArray(a))for(let f of a)o(f,c);else if(a instanceof CompartmentInstance){if(r.has(a.compartment))throw new RangeError("Duplicate use of compartment in extensions");let f=e.get(a.compartment)||a.inner;r.set(a.compartment,f),o(f,c)}else if(a instanceof PrecExtension)o(a.inner,a.prec);else if(a instanceof StateField)s[c].push(a),a.provides&&o(a.provides,c);else if(a instanceof FacetProvider)s[c].push(a),a.facet.extensions&&o(a.facet.extensions,Prec_.default);else{let f=a.extension;if(!f)throw new Error(`Unrecognized extension value in extension set (${a}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);o(f,c)}}return o(h,Prec_.default),s.reduce((a,c)=>a.concat(c))}function ensureAddr(h,e){if(e&1)return 2;let r=e>>1,s=h.status[r];if(s==4)throw new Error("Cyclic dependency between fields and/or facets");if(s&2)return s;h.status[r]=4;let l=h.computeSlot(h,h.config.dynamicSlots[r]);return h.status[r]=2|l}function getAddr(h,e){return e&1?h.config.staticValues[e>>1]:h.values[e>>1]}const languageData=Facet.define(),allowMultipleSelections=Facet.define({combine:h=>h.some(e=>e),static:!0}),lineSeparator=Facet.define({combine:h=>h.length?h[0]:void 0,static:!0}),changeFilter=Facet.define(),transactionFilter=Facet.define(),transactionExtender=Facet.define(),readOnly=Facet.define({combine:h=>h.length?h[0]:!1});class Annotation{constructor(e,r){this.type=e,this.value=r}static define(){return new AnnotationType}}class AnnotationType{of(e){return new Annotation(this,e)}}class StateEffectType{constructor(e){this.map=e}of(e){return new StateEffect(this,e)}}class StateEffect{constructor(e,r){this.type=e,this.value=r}map(e){let r=this.type.map(this.value,e);return r===void 0?void 0:r==this.value?this:new StateEffect(this.type,r)}is(e){return this.type==e}static define(e={}){return new StateEffectType(e.map||(r=>r))}static mapEffects(e,r){if(!e.length)return e;let s=[];for(let l of e){let o=l.map(r);o&&s.push(o)}return s}}StateEffect.reconfigure=StateEffect.define();StateEffect.appendConfig=StateEffect.define();class Transaction{constructor(e,r,s,l,o,a){this.startState=e,this.changes=r,this.selection=s,this.effects=l,this.annotations=o,this.scrollIntoView=a,this._doc=null,this._state=null,s&&checkSelection(s,r.newLength),o.some(c=>c.type==Transaction.time)||(this.annotations=o.concat(Transaction.time.of(Date.now())))}static create(e,r,s,l,o,a){return new Transaction(e,r,s,l,o,a)}get newDoc(){return this._doc||(this._doc=this.changes.apply(this.startState.doc))}get newSelection(){return this.selection||this.startState.selection.map(this.changes)}get state(){return this._state||this.startState.applyTransaction(this),this._state}annotation(e){for(let r of this.annotations)if(r.type==e)return r.value}get docChanged(){return!this.changes.empty}get reconfigured(){return this.startState.config!=this.state.config}isUserEvent(e){let r=this.annotation(Transaction.userEvent);return!!(r&&(r==e||r.length>e.length&&r.slice(0,e.length)==e&&r[e.length]=="."))}}Transaction.time=Annotation.define();Transaction.userEvent=Annotation.define();Transaction.addToHistory=Annotation.define();Transaction.remote=Annotation.define();function joinRanges(h,e){let r=[];for(let s=0,l=0;;){let o,a;if(s<h.length&&(l==e.length||e[l]>=h[s]))o=h[s++],a=h[s++];else if(l<e.length)o=e[l++],a=e[l++];else return r;!r.length||r[r.length-1]<o?r.push(o,a):r[r.length-1]<a&&(r[r.length-1]=a)}}function mergeTransaction(h,e,r){var s;let l,o,a;return r?(l=e.changes,o=ChangeSet.empty(e.changes.length),a=h.changes.compose(e.changes)):(l=e.changes.map(h.changes),o=h.changes.mapDesc(e.changes,!0),a=h.changes.compose(l)),{changes:a,selection:e.selection?e.selection.map(o):(s=h.selection)===null||s===void 0?void 0:s.map(l),effects:StateEffect.mapEffects(h.effects,l).concat(StateEffect.mapEffects(e.effects,o)),annotations:h.annotations.length?h.annotations.concat(e.annotations):e.annotations,scrollIntoView:h.scrollIntoView||e.scrollIntoView}}function resolveTransactionInner(h,e,r){let s=e.selection,l=asArray$1(e.annotations);return e.userEvent&&(l=l.concat(Transaction.userEvent.of(e.userEvent))),{changes:e.changes instanceof ChangeSet?e.changes:ChangeSet.of(e.changes||[],r,h.facet(lineSeparator)),selection:s&&(s instanceof EditorSelection?s:EditorSelection.single(s.anchor,s.head)),effects:asArray$1(e.effects),annotations:l,scrollIntoView:!!e.scrollIntoView}}function resolveTransaction(h,e,r){let s=resolveTransactionInner(h,e.length?e[0]:{},h.doc.length);e.length&&e[0].filter===!1&&(r=!1);for(let o=1;o<e.length;o++){e[o].filter===!1&&(r=!1);let a=!!e[o].sequential;s=mergeTransaction(s,resolveTransactionInner(h,e[o],a?s.changes.newLength:h.doc.length),a)}let l=Transaction.create(h,s.changes,s.selection,s.effects,s.annotations,s.scrollIntoView);return extendTransaction(r?filterTransaction(l):l)}function filterTransaction(h){let e=h.startState,r=!0;for(let l of e.facet(changeFilter)){let o=l(h);if(o===!1){r=!1;break}Array.isArray(o)&&(r=r===!0?o:joinRanges(r,o))}if(r!==!0){let l,o;if(r===!1)o=h.changes.invertedDesc,l=ChangeSet.empty(e.doc.length);else{let a=h.changes.filter(r);l=a.changes,o=a.filtered.mapDesc(a.changes).invertedDesc}h=Transaction.create(e,l,h.selection&&h.selection.map(o),StateEffect.mapEffects(h.effects,o),h.annotations,h.scrollIntoView)}let s=e.facet(transactionFilter);for(let l=s.length-1;l>=0;l--){let o=s[l](h);o instanceof Transaction?h=o:Array.isArray(o)&&o.length==1&&o[0]instanceof Transaction?h=o[0]:h=resolveTransaction(e,asArray$1(o),!1)}return h}function extendTransaction(h){let e=h.startState,r=e.facet(transactionExtender),s=h;for(let l=r.length-1;l>=0;l--){let o=r[l](h);o&&Object.keys(o).length&&(s=mergeTransaction(s,resolveTransactionInner(e,o,h.changes.newLength),!0))}return s==h?h:Transaction.create(e,h.changes,h.selection,s.effects,s.annotations,s.scrollIntoView)}const none$2=[];function asArray$1(h){return h==null?none$2:Array.isArray(h)?h:[h]}var CharCategory=function(h){return h[h.Word=0]="Word",h[h.Space=1]="Space",h[h.Other=2]="Other",h}(CharCategory||(CharCategory={}));const nonASCIISingleCaseWordChar=/[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;let wordChar;try{wordChar=new RegExp("[\\p{Alphabetic}\\p{Number}_]","u")}catch{}function hasWordChar(h){if(wordChar)return wordChar.test(h);for(let e=0;e<h.length;e++){let r=h[e];if(/\w/.test(r)||r>""&&(r.toUpperCase()!=r.toLowerCase()||nonASCIISingleCaseWordChar.test(r)))return!0}return!1}function makeCategorizer(h){return e=>{if(!/\S/.test(e))return CharCategory.Space;if(hasWordChar(e))return CharCategory.Word;for(let r=0;r<h.length;r++)if(e.indexOf(h[r])>-1)return CharCategory.Word;return CharCategory.Other}}class EditorState{constructor(e,r,s,l,o,a){this.config=e,this.doc=r,this.selection=s,this.values=l,this.status=e.statusTemplate.slice(),this.computeSlot=o,a&&(a._state=this);for(let c=0;c<this.config.dynamicSlots.length;c++)ensureAddr(this,c<<1);this.computeSlot=null}field(e,r=!0){let s=this.config.address[e.id];if(s==null){if(r)throw new RangeError("Field is not present in this state");return}return ensureAddr(this,s),getAddr(this,s)}update(...e){return resolveTransaction(this,e,!0)}applyTransaction(e){let r=this.config,{base:s,compartments:l}=r;for(let a of e.effects)a.is(Compartment.reconfigure)?(r&&(l=new Map,r.compartments.forEach((c,M)=>l.set(M,c)),r=null),l.set(a.value.compartment,a.value.extension)):a.is(StateEffect.reconfigure)?(r=null,s=a.value):a.is(StateEffect.appendConfig)&&(r=null,s=asArray$1(s).concat(a.value));let o;r?o=e.startState.values.slice():(r=Configuration.resolve(s,l,this),o=new EditorState(r,this.doc,this.selection,r.dynamicSlots.map(()=>null),(c,M)=>M.reconfigure(c,this),null).values),new EditorState(r,e.newDoc,e.newSelection,o,(a,c)=>c.update(a,e),e)}replaceSelection(e){return typeof e=="string"&&(e=this.toText(e)),this.changeByRange(r=>({changes:{from:r.from,to:r.to,insert:e},range:EditorSelection.cursor(r.from+e.length)}))}changeByRange(e){let r=this.selection,s=e(r.ranges[0]),l=this.changes(s.changes),o=[s.range],a=asArray$1(s.effects);for(let c=1;c<r.ranges.length;c++){let M=e(r.ranges[c]),f=this.changes(M.changes),u=f.map(l);for(let d=0;d<c;d++)o[d]=o[d].map(u);let g=l.mapDesc(f,!0);o.push(M.range.map(g)),l=l.compose(u),a=StateEffect.mapEffects(a,u).concat(StateEffect.mapEffects(asArray$1(M.effects),g))}return{changes:l,selection:EditorSelection.create(o,r.mainIndex),effects:a}}changes(e=[]){return e instanceof ChangeSet?e:ChangeSet.of(e,this.doc.length,this.facet(EditorState.lineSeparator))}toText(e){return Text.of(e.split(this.facet(EditorState.lineSeparator)||DefaultSplit))}sliceDoc(e=0,r=this.doc.length){return this.doc.sliceString(e,r,this.lineBreak)}facet(e){let r=this.config.address[e.id];return r==null?e.default:(ensureAddr(this,r),getAddr(this,r))}toJSON(e){let r={doc:this.sliceDoc(),selection:this.selection.toJSON()};if(e)for(let s in e){let l=e[s];l instanceof StateField&&this.config.address[l.id]!=null&&(r[s]=l.spec.toJSON(this.field(e[s]),this))}return r}static fromJSON(e,r={},s){if(!e||typeof e.doc!="string")throw new RangeError("Invalid JSON representation for EditorState");let l=[];if(s){for(let o in s)if(Object.prototype.hasOwnProperty.call(e,o)){let a=s[o],c=e[o];l.push(a.init(M=>a.spec.fromJSON(c,M)))}}return EditorState.create({doc:e.doc,selection:EditorSelection.fromJSON(e.selection),extensions:r.extensions?l.concat([r.extensions]):l})}static create(e={}){let r=Configuration.resolve(e.extensions||[],new Map),s=e.doc instanceof Text?e.doc:Text.of((e.doc||"").split(r.staticFacet(EditorState.lineSeparator)||DefaultSplit)),l=e.selection?e.selection instanceof EditorSelection?e.selection:EditorSelection.single(e.selection.anchor,e.selection.head):EditorSelection.single(0);return checkSelection(l,s.length),r.staticFacet(allowMultipleSelections)||(l=l.asSingle()),new EditorState(r,s,l,r.dynamicSlots.map(()=>null),(o,a)=>a.create(o),null)}get tabSize(){return this.facet(EditorState.tabSize)}get lineBreak(){return this.facet(EditorState.lineSeparator)||`
`}get readOnly(){return this.facet(readOnly)}phrase(e,...r){for(let s of this.facet(EditorState.phrases))if(Object.prototype.hasOwnProperty.call(s,e)){e=s[e];break}return r.length&&(e=e.replace(/\$(\$|\d*)/g,(s,l)=>{if(l=="$")return"$";let o=+(l||1);return!o||o>r.length?s:r[o-1]})),e}languageDataAt(e,r,s=-1){let l=[];for(let o of this.facet(languageData))for(let a of o(this,r,s))Object.prototype.hasOwnProperty.call(a,e)&&l.push(a[e]);return l}charCategorizer(e){return makeCategorizer(this.languageDataAt("wordChars",e).join(""))}wordAt(e){let{text:r,from:s,length:l}=this.doc.lineAt(e),o=this.charCategorizer(e),a=e-s,c=e-s;for(;a>0;){let M=findClusterBreak(r,a,!1);if(o(r.slice(M,a))!=CharCategory.Word)break;a=M}for(;c<l;){let M=findClusterBreak(r,c);if(o(r.slice(c,M))!=CharCategory.Word)break;c=M}return a==c?null:EditorSelection.range(a+s,c+s)}}EditorState.allowMultipleSelections=allowMultipleSelections;EditorState.tabSize=Facet.define({combine:h=>h.length?h[0]:4});EditorState.lineSeparator=lineSeparator;EditorState.readOnly=readOnly;EditorState.phrases=Facet.define({compare(h,e){let r=Object.keys(h),s=Object.keys(e);return r.length==s.length&&r.every(l=>h[l]==e[l])}});EditorState.languageData=languageData;EditorState.changeFilter=changeFilter;EditorState.transactionFilter=transactionFilter;EditorState.transactionExtender=transactionExtender;Compartment.reconfigure=StateEffect.define();function combineConfig(h,e,r={}){let s={};for(let l of h)for(let o of Object.keys(l)){let a=l[o],c=s[o];if(c===void 0)s[o]=a;else if(!(c===a||a===void 0))if(Object.hasOwnProperty.call(r,o))s[o]=r[o](c,a);else throw new Error("Config merge conflict for field "+o)}for(let l in e)s[l]===void 0&&(s[l]=e[l]);return s}class RangeValue{eq(e){return this==e}range(e,r=e){return Range$1.create(e,r,this)}}RangeValue.prototype.startSide=RangeValue.prototype.endSide=0;RangeValue.prototype.point=!1;RangeValue.prototype.mapMode=MapMode.TrackDel;let Range$1=class j{constructor(e,r,s){this.from=e,this.to=r,this.value=s}static create(e,r,s){return new j(e,r,s)}};function cmpRange(h,e){return h.from-e.from||h.value.startSide-e.value.startSide}class Chunk{constructor(e,r,s,l){this.from=e,this.to=r,this.value=s,this.maxPoint=l}get length(){return this.to[this.to.length-1]}findIndex(e,r,s,l=0){let o=s?this.to:this.from;for(let a=l,c=o.length;;){if(a==c)return a;let M=a+c>>1,f=o[M]-e||(s?this.value[M].endSide:this.value[M].startSide)-r;if(M==a)return f>=0?a:c;f>=0?c=M:a=M+1}}between(e,r,s,l){for(let o=this.findIndex(r,-1e9,!0),a=this.findIndex(s,1e9,!1,o);o<a;o++)if(l(this.from[o]+e,this.to[o]+e,this.value[o])===!1)return!1}map(e,r){let s=[],l=[],o=[],a=-1,c=-1;for(let M=0;M<this.value.length;M++){let f=this.value[M],u=this.from[M]+e,g=this.to[M]+e,d,p;if(u==g){let m=r.mapPos(u,f.startSide,f.mapMode);if(m==null||(d=p=m,f.startSide!=f.endSide&&(p=r.mapPos(u,f.endSide),p<d)))continue}else if(d=r.mapPos(u,f.startSide),p=r.mapPos(g,f.endSide),d>p||d==p&&f.startSide>0&&f.endSide<=0)continue;(p-d||f.endSide-f.startSide)<0||(a<0&&(a=d),f.point&&(c=Math.max(c,p-d)),s.push(f),l.push(d-a),o.push(p-a))}return{mapped:s.length?new Chunk(l,o,s,c):null,pos:a}}}class RangeSet{constructor(e,r,s,l){this.chunkPos=e,this.chunk=r,this.nextLayer=s,this.maxPoint=l}static create(e,r,s,l){return new RangeSet(e,r,s,l)}get length(){let e=this.chunk.length-1;return e<0?0:Math.max(this.chunkEnd(e),this.nextLayer.length)}get size(){if(this.isEmpty)return 0;let e=this.nextLayer.size;for(let r of this.chunk)e+=r.value.length;return e}chunkEnd(e){return this.chunkPos[e]+this.chunk[e].length}update(e){let{add:r=[],sort:s=!1,filterFrom:l=0,filterTo:o=this.length}=e,a=e.filter;if(r.length==0&&!a)return this;if(s&&(r=r.slice().sort(cmpRange)),this.isEmpty)return r.length?RangeSet.of(r):this;let c=new LayerCursor(this,null,-1).goto(0),M=0,f=[],u=new RangeSetBuilder;for(;c.value||M<r.length;)if(M<r.length&&(c.from-r[M].from||c.startSide-r[M].value.startSide)>=0){let g=r[M++];u.addInner(g.from,g.to,g.value)||f.push(g)}else c.rangeIndex==1&&c.chunkIndex<this.chunk.length&&(M==r.length||this.chunkEnd(c.chunkIndex)<r[M].from)&&(!a||l>this.chunkEnd(c.chunkIndex)||o<this.chunkPos[c.chunkIndex])&&u.addChunk(this.chunkPos[c.chunkIndex],this.chunk[c.chunkIndex])?c.nextChunk():((!a||l>c.to||o<c.from||a(c.from,c.to,c.value))&&(u.addInner(c.from,c.to,c.value)||f.push(Range$1.create(c.from,c.to,c.value))),c.next());return u.finishInner(this.nextLayer.isEmpty&&!f.length?RangeSet.empty:this.nextLayer.update({add:f,filter:a,filterFrom:l,filterTo:o}))}map(e){if(e.empty||this.isEmpty)return this;let r=[],s=[],l=-1;for(let a=0;a<this.chunk.length;a++){let c=this.chunkPos[a],M=this.chunk[a],f=e.touchesRange(c,c+M.length);if(f===!1)l=Math.max(l,M.maxPoint),r.push(M),s.push(e.mapPos(c));else if(f===!0){let{mapped:u,pos:g}=M.map(c,e);u&&(l=Math.max(l,u.maxPoint),r.push(u),s.push(g))}}let o=this.nextLayer.map(e);return r.length==0?o:new RangeSet(s,r,o||RangeSet.empty,l)}between(e,r,s){if(!this.isEmpty){for(let l=0;l<this.chunk.length;l++){let o=this.chunkPos[l],a=this.chunk[l];if(r>=o&&e<=o+a.length&&a.between(o,e-o,r-o,s)===!1)return}this.nextLayer.between(e,r,s)}}iter(e=0){return HeapCursor.from([this]).goto(e)}get isEmpty(){return this.nextLayer==this}static iter(e,r=0){return HeapCursor.from(e).goto(r)}static compare(e,r,s,l,o=-1){let a=e.filter(g=>g.maxPoint>0||!g.isEmpty&&g.maxPoint>=o),c=r.filter(g=>g.maxPoint>0||!g.isEmpty&&g.maxPoint>=o),M=findSharedChunks(a,c,s),f=new SpanCursor(a,M,o),u=new SpanCursor(c,M,o);s.iterGaps((g,d,p)=>compare(f,g,u,d,p,l)),s.empty&&s.length==0&&compare(f,0,u,0,0,l)}static eq(e,r,s=0,l){l==null&&(l=1e9-1);let o=e.filter(u=>!u.isEmpty&&r.indexOf(u)<0),a=r.filter(u=>!u.isEmpty&&e.indexOf(u)<0);if(o.length!=a.length)return!1;if(!o.length)return!0;let c=findSharedChunks(o,a),M=new SpanCursor(o,c,0).goto(s),f=new SpanCursor(a,c,0).goto(s);for(;;){if(M.to!=f.to||!sameValues(M.active,f.active)||M.point&&(!f.point||!M.point.eq(f.point)))return!1;if(M.to>l)return!0;M.next(),f.next()}}static spans(e,r,s,l,o=-1){let a=new SpanCursor(e,null,o).goto(r),c=r,M=a.openStart;for(;;){let f=Math.min(a.to,s);if(a.point){let u=a.activeForPoint(a.to),g=a.pointFrom<r?u.length+1:Math.min(u.length,M);l.point(c,f,a.point,u,g,a.pointRank),M=Math.min(a.openEnd(f),u.length)}else f>c&&(l.span(c,f,a.active,M),M=a.openEnd(f));if(a.to>s)return M+(a.point&&a.to>s?1:0);c=a.to,a.next()}}static of(e,r=!1){let s=new RangeSetBuilder;for(let l of e instanceof Range$1?[e]:r?lazySort(e):e)s.add(l.from,l.to,l.value);return s.finish()}}RangeSet.empty=new RangeSet([],[],null,-1);function lazySort(h){if(h.length>1)for(let e=h[0],r=1;r<h.length;r++){let s=h[r];if(cmpRange(e,s)>0)return h.slice().sort(cmpRange);e=s}return h}RangeSet.empty.nextLayer=RangeSet.empty;class RangeSetBuilder{finishChunk(e){this.chunks.push(new Chunk(this.from,this.to,this.value,this.maxPoint)),this.chunkPos.push(this.chunkStart),this.chunkStart=-1,this.setMaxPoint=Math.max(this.setMaxPoint,this.maxPoint),this.maxPoint=-1,e&&(this.from=[],this.to=[],this.value=[])}constructor(){this.chunks=[],this.chunkPos=[],this.chunkStart=-1,this.last=null,this.lastFrom=-1e9,this.lastTo=-1e9,this.from=[],this.to=[],this.value=[],this.maxPoint=-1,this.setMaxPoint=-1,this.nextLayer=null}add(e,r,s){this.addInner(e,r,s)||(this.nextLayer||(this.nextLayer=new RangeSetBuilder)).add(e,r,s)}addInner(e,r,s){let l=e-this.lastTo||s.startSide-this.last.endSide;if(l<=0&&(e-this.lastFrom||s.startSide-this.last.startSide)<0)throw new Error("Ranges must be added sorted by `from` position and `startSide`");return l<0?!1:(this.from.length==250&&this.finishChunk(!0),this.chunkStart<0&&(this.chunkStart=e),this.from.push(e-this.chunkStart),this.to.push(r-this.chunkStart),this.last=s,this.lastFrom=e,this.lastTo=r,this.value.push(s),s.point&&(this.maxPoint=Math.max(this.maxPoint,r-e)),!0)}addChunk(e,r){if((e-this.lastTo||r.value[0].startSide-this.last.endSide)<0)return!1;this.from.length&&this.finishChunk(!0),this.setMaxPoint=Math.max(this.setMaxPoint,r.maxPoint),this.chunks.push(r),this.chunkPos.push(e);let s=r.value.length-1;return this.last=r.value[s],this.lastFrom=r.from[s]+e,this.lastTo=r.to[s]+e,!0}finish(){return this.finishInner(RangeSet.empty)}finishInner(e){if(this.from.length&&this.finishChunk(!1),this.chunks.length==0)return e;let r=RangeSet.create(this.chunkPos,this.chunks,this.nextLayer?this.nextLayer.finishInner(e):e,this.setMaxPoint);return this.from=null,r}}function findSharedChunks(h,e,r){let s=new Map;for(let o of h)for(let a=0;a<o.chunk.length;a++)o.chunk[a].maxPoint<=0&&s.set(o.chunk[a],o.chunkPos[a]);let l=new Set;for(let o of e)for(let a=0;a<o.chunk.length;a++){let c=s.get(o.chunk[a]);c!=null&&(r?r.mapPos(c):c)==o.chunkPos[a]&&!(r!=null&&r.touchesRange(c,c+o.chunk[a].length))&&l.add(o.chunk[a])}return l}class LayerCursor{constructor(e,r,s,l=0){this.layer=e,this.skip=r,this.minPoint=s,this.rank=l}get startSide(){return this.value?this.value.startSide:0}get endSide(){return this.value?this.value.endSide:0}goto(e,r=-1e9){return this.chunkIndex=this.rangeIndex=0,this.gotoInner(e,r,!1),this}gotoInner(e,r,s){for(;this.chunkIndex<this.layer.chunk.length;){let l=this.layer.chunk[this.chunkIndex];if(!(this.skip&&this.skip.has(l)||this.layer.chunkEnd(this.chunkIndex)<e||l.maxPoint<this.minPoint))break;this.chunkIndex++,s=!1}if(this.chunkIndex<this.layer.chunk.length){let l=this.layer.chunk[this.chunkIndex].findIndex(e-this.layer.chunkPos[this.chunkIndex],r,!0);(!s||this.rangeIndex<l)&&this.setRangeIndex(l)}this.next()}forward(e,r){(this.to-e||this.endSide-r)<0&&this.gotoInner(e,r,!0)}next(){for(;;)if(this.chunkIndex==this.layer.chunk.length){this.from=this.to=1e9,this.value=null;break}else{let e=this.layer.chunkPos[this.chunkIndex],r=this.layer.chunk[this.chunkIndex],s=e+r.from[this.rangeIndex];if(this.from=s,this.to=e+r.to[this.rangeIndex],this.value=r.value[this.rangeIndex],this.setRangeIndex(this.rangeIndex+1),this.minPoint<0||this.value.point&&this.to-this.from>=this.minPoint)break}}setRangeIndex(e){if(e==this.layer.chunk[this.chunkIndex].value.length){if(this.chunkIndex++,this.skip)for(;this.chunkIndex<this.layer.chunk.length&&this.skip.has(this.layer.chunk[this.chunkIndex]);)this.chunkIndex++;this.rangeIndex=0}else this.rangeIndex=e}nextChunk(){this.chunkIndex++,this.rangeIndex=0,this.next()}compare(e){return this.from-e.from||this.startSide-e.startSide||this.rank-e.rank||this.to-e.to||this.endSide-e.endSide}}class HeapCursor{constructor(e){this.heap=e}static from(e,r=null,s=-1){let l=[];for(let o=0;o<e.length;o++)for(let a=e[o];!a.isEmpty;a=a.nextLayer)a.maxPoint>=s&&l.push(new LayerCursor(a,r,s,o));return l.length==1?l[0]:new HeapCursor(l)}get startSide(){return this.value?this.value.startSide:0}goto(e,r=-1e9){for(let s of this.heap)s.goto(e,r);for(let s=this.heap.length>>1;s>=0;s--)heapBubble(this.heap,s);return this.next(),this}forward(e,r){for(let s of this.heap)s.forward(e,r);for(let s=this.heap.length>>1;s>=0;s--)heapBubble(this.heap,s);(this.to-e||this.value.endSide-r)<0&&this.next()}next(){if(this.heap.length==0)this.from=this.to=1e9,this.value=null,this.rank=-1;else{let e=this.heap[0];this.from=e.from,this.to=e.to,this.value=e.value,this.rank=e.rank,e.value&&e.next(),heapBubble(this.heap,0)}}}function heapBubble(h,e){for(let r=h[e];;){let s=(e<<1)+1;if(s>=h.length)break;let l=h[s];if(s+1<h.length&&l.compare(h[s+1])>=0&&(l=h[s+1],s++),r.compare(l)<0)break;h[s]=r,h[e]=l,e=s}}class SpanCursor{constructor(e,r,s){this.minPoint=s,this.active=[],this.activeTo=[],this.activeRank=[],this.minActive=-1,this.point=null,this.pointFrom=0,this.pointRank=0,this.to=-1e9,this.endSide=0,this.openStart=-1,this.cursor=HeapCursor.from(e,r,s)}goto(e,r=-1e9){return this.cursor.goto(e,r),this.active.length=this.activeTo.length=this.activeRank.length=0,this.minActive=-1,this.to=e,this.endSide=r,this.openStart=-1,this.next(),this}forward(e,r){for(;this.minActive>-1&&(this.activeTo[this.minActive]-e||this.active[this.minActive].endSide-r)<0;)this.removeActive(this.minActive);this.cursor.forward(e,r)}removeActive(e){remove(this.active,e),remove(this.activeTo,e),remove(this.activeRank,e),this.minActive=findMinIndex(this.active,this.activeTo)}addActive(e){let r=0,{value:s,to:l,rank:o}=this.cursor;for(;r<this.activeRank.length&&this.activeRank[r]<=o;)r++;insert(this.active,r,s),insert(this.activeTo,r,l),insert(this.activeRank,r,o),e&&insert(e,r,this.cursor.from),this.minActive=findMinIndex(this.active,this.activeTo)}next(){let e=this.to,r=this.point;this.point=null;let s=this.openStart<0?[]:null;for(;;){let l=this.minActive;if(l>-1&&(this.activeTo[l]-this.cursor.from||this.active[l].endSide-this.cursor.startSide)<0){if(this.activeTo[l]>e){this.to=this.activeTo[l],this.endSide=this.active[l].endSide;break}this.removeActive(l),s&&remove(s,l)}else if(this.cursor.value)if(this.cursor.from>e){this.to=this.cursor.from,this.endSide=this.cursor.startSide;break}else{let o=this.cursor.value;if(!o.point)this.addActive(s),this.cursor.next();else if(r&&this.cursor.to==this.to&&this.cursor.from<this.cursor.to)this.cursor.next();else{this.point=o,this.pointFrom=this.cursor.from,this.pointRank=this.cursor.rank,this.to=this.cursor.to,this.endSide=o.endSide,this.cursor.next(),this.forward(this.to,this.endSide);break}}else{this.to=this.endSide=1e9;break}}if(s){this.openStart=0;for(let l=s.length-1;l>=0&&s[l]<e;l--)this.openStart++}}activeForPoint(e){if(!this.active.length)return this.active;let r=[];for(let s=this.active.length-1;s>=0&&!(this.activeRank[s]<this.pointRank);s--)(this.activeTo[s]>e||this.activeTo[s]==e&&this.active[s].endSide>=this.point.endSide)&&r.push(this.active[s]);return r.reverse()}openEnd(e){let r=0;for(let s=this.activeTo.length-1;s>=0&&this.activeTo[s]>e;s--)r++;return r}}function compare(h,e,r,s,l,o){h.goto(e),r.goto(s);let a=s+l,c=s,M=s-e;for(;;){let f=h.to+M-r.to||h.endSide-r.endSide,u=f<0?h.to+M:r.to,g=Math.min(u,a);if(h.point||r.point?h.point&&r.point&&(h.point==r.point||h.point.eq(r.point))&&sameValues(h.activeForPoint(h.to),r.activeForPoint(r.to))||o.comparePoint(c,g,h.point,r.point):g>c&&!sameValues(h.active,r.active)&&o.compareRange(c,g,h.active,r.active),u>a)break;c=u,f<=0&&h.next(),f>=0&&r.next()}}function sameValues(h,e){if(h.length!=e.length)return!1;for(let r=0;r<h.length;r++)if(h[r]!=e[r]&&!h[r].eq(e[r]))return!1;return!0}function remove(h,e){for(let r=e,s=h.length-1;r<s;r++)h[r]=h[r+1];h.pop()}function insert(h,e,r){for(let s=h.length-1;s>=e;s--)h[s+1]=h[s];h[e]=r}function findMinIndex(h,e){let r=-1,s=1e9;for(let l=0;l<e.length;l++)(e[l]-s||h[l].endSide-h[r].endSide)<0&&(r=l,s=e[l]);return r}function countColumn(h,e,r=h.length){let s=0;for(let l=0;l<r;)h.charCodeAt(l)==9?(s+=e-s%e,l++):(s++,l=findClusterBreak(h,l));return s}function findColumn(h,e,r,s){for(let l=0,o=0;;){if(o>=e)return l;if(l==h.length)break;o+=h.charCodeAt(l)==9?r-o%r:1,l=findClusterBreak(h,l)}return s===!0?-1:h.length}const C="ͼ",COUNT=typeof Symbol>"u"?"__"+C:Symbol.for(C),SET=typeof Symbol>"u"?"__styleSet"+Math.floor(Math.random()*1e8):Symbol("styleSet"),top=typeof globalThis<"u"?globalThis:typeof window<"u"?window:{};class StyleModule{constructor(e,r){this.rules=[];let{finish:s}=r||{};function l(a){return/^@/.test(a)?[a]:a.split(/,\s*/)}function o(a,c,M,f){let u=[],g=/^@(\w+)\b/.exec(a[0]),d=g&&g[1]=="keyframes";if(g&&c==null)return M.push(a[0]+";");for(let p in c){let m=c[p];if(/&/.test(p))o(p.split(/,\s*/).map(w=>a.map(y=>w.replace(/&/,y))).reduce((w,y)=>w.concat(y)),m,M);else if(m&&typeof m=="object"){if(!g)throw new RangeError("The value of a property ("+p+") should be a primitive value.");o(l(p),m,u,d)}else m!=null&&u.push(p.replace(/_.*/,"").replace(/[A-Z]/g,w=>"-"+w.toLowerCase())+": "+m+";")}(u.length||d)&&M.push((s&&!g&&!f?a.map(s):a).join(", ")+" {"+u.join(" ")+"}")}for(let a in e)o(l(a),e[a],this.rules)}getRules(){return this.rules.join(`
`)}static newName(){let e=top[COUNT]||1;return top[COUNT]=e+1,C+e.toString(36)}static mount(e,r,s){let l=e[SET],o=s&&s.nonce;l?o&&l.setNonce(o):l=new StyleSet(e,o),l.mount(Array.isArray(r)?r:[r])}}let adoptedSet=new Map;class StyleSet{constructor(e,r){let s=e.ownerDocument||e,l=s.defaultView;if(!e.head&&e.adoptedStyleSheets&&l.CSSStyleSheet){let o=adoptedSet.get(s);if(o)return e.adoptedStyleSheets=[o.sheet,...e.adoptedStyleSheets],e[SET]=o;this.sheet=new l.CSSStyleSheet,e.adoptedStyleSheets=[this.sheet,...e.adoptedStyleSheets],adoptedSet.set(s,this)}else{this.styleTag=s.createElement("style"),r&&this.styleTag.setAttribute("nonce",r);let o=e.head||e;o.insertBefore(this.styleTag,o.firstChild)}this.modules=[],e[SET]=this}mount(e){let r=this.sheet,s=0,l=0;for(let o=0;o<e.length;o++){let a=e[o],c=this.modules.indexOf(a);if(c<l&&c>-1&&(this.modules.splice(c,1),l--,c=-1),c==-1){if(this.modules.splice(l++,0,a),r)for(let M=0;M<a.rules.length;M++)r.insertRule(a.rules[M],s++)}else{for(;l<c;)s+=this.modules[l++].rules.length;s+=a.rules.length,l++}}if(!r){let o="";for(let a=0;a<this.modules.length;a++)o+=this.modules[a].getRules()+`
`;this.styleTag.textContent=o}}setNonce(e){this.styleTag&&this.styleTag.getAttribute("nonce")!=e&&this.styleTag.setAttribute("nonce",e)}}var base={8:"Backspace",9:"Tab",10:"Enter",12:"NumLock",13:"Enter",16:"Shift",17:"Control",18:"Alt",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",44:"PrintScreen",45:"Insert",46:"Delete",59:";",61:"=",91:"Meta",92:"Meta",106:"*",107:"+",108:",",109:"-",110:".",111:"/",144:"NumLock",145:"ScrollLock",160:"Shift",161:"Shift",162:"Control",163:"Control",164:"Alt",165:"Alt",173:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},shift={48:")",49:"!",50:"@",51:"#",52:"$",53:"%",54:"^",55:"&",56:"*",57:"(",59:":",61:"+",173:"_",186:":",187:"+",188:"<",189:"_",190:">",191:"?",192:"~",219:"{",220:"|",221:"}",222:'"'},mac=typeof navigator<"u"&&/Mac/.test(navigator.platform),ie$1=typeof navigator<"u"&&/MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);for(var i=0;i<10;i++)base[48+i]=base[96+i]=String(i);for(var i=1;i<=24;i++)base[i+111]="F"+i;for(var i=65;i<=90;i++)base[i]=String.fromCharCode(i+32),shift[i]=String.fromCharCode(i);for(var code in base)shift.hasOwnProperty(code)||(shift[code]=base[code]);function keyName(h){var e=mac&&h.metaKey&&h.shiftKey&&!h.ctrlKey&&!h.altKey||ie$1&&h.shiftKey&&h.key&&h.key.length==1||h.key=="Unidentified",r=!e&&h.key||(h.shiftKey?shift:base)[h.keyCode]||h.key||"Unidentified";return r=="Esc"&&(r="Escape"),r=="Del"&&(r="Delete"),r=="Left"&&(r="ArrowLeft"),r=="Up"&&(r="ArrowUp"),r=="Right"&&(r="ArrowRight"),r=="Down"&&(r="ArrowDown"),r}function getSelection(h){let e;return h.nodeType==11?e=h.getSelection?h:h.ownerDocument:e=h,e.getSelection()}function contains(h,e){return e?h==e||h.contains(e.nodeType!=1?e.parentNode:e):!1}function deepActiveElement(h){let e=h.activeElement;for(;e&&e.shadowRoot;)e=e.shadowRoot.activeElement;return e}function hasSelection(h,e){if(!e.anchorNode)return!1;try{return contains(h,e.anchorNode)}catch{return!1}}function clientRectsFor(h){return h.nodeType==3?textRange(h,0,h.nodeValue.length).getClientRects():h.nodeType==1?h.getClientRects():[]}function isEquivalentPosition(h,e,r,s){return r?scanFor(h,e,r,s,-1)||scanFor(h,e,r,s,1):!1}function domIndex(h){for(var e=0;;e++)if(h=h.previousSibling,!h)return e}function scanFor(h,e,r,s,l){for(;;){if(h==r&&e==s)return!0;if(e==(l<0?0:maxOffset(h))){if(h.nodeName=="DIV")return!1;let o=h.parentNode;if(!o||o.nodeType!=1)return!1;e=domIndex(h)+(l<0?0:1),h=o}else if(h.nodeType==1){if(h=h.childNodes[e+(l<0?-1:0)],h.nodeType==1&&h.contentEditable=="false")return!1;e=l<0?maxOffset(h):0}else return!1}}function maxOffset(h){return h.nodeType==3?h.nodeValue.length:h.childNodes.length}function flattenRect(h,e){let r=e?h.left:h.right;return{left:r,right:r,top:h.top,bottom:h.bottom}}function windowRect(h){return{left:0,right:h.innerWidth,top:0,bottom:h.innerHeight}}function scrollRectIntoView(h,e,r,s,l,o,a,c){let M=h.ownerDocument,f=M.defaultView||window;for(let u=h,g=!1;u&&!g;)if(u.nodeType==1){let d,p=u==M.body,m=1,w=1;if(p)d=windowRect(f);else{if(/^(fixed|sticky)$/.test(getComputedStyle(u).position)&&(g=!0),u.scrollHeight<=u.clientHeight&&u.scrollWidth<=u.clientWidth){u=u.assignedSlot||u.parentNode;continue}let O=u.getBoundingClientRect();m=O.width/u.offsetWidth,w=O.height/u.offsetHeight,d={left:O.left,right:O.left+u.clientWidth*m,top:O.top,bottom:O.top+u.clientHeight*w}}let y=0,b=0;if(l=="nearest")e.top<d.top?(b=-(d.top-e.top+a),r>0&&e.bottom>d.bottom+b&&(b=e.bottom-d.bottom+b+a)):e.bottom>d.bottom&&(b=e.bottom-d.bottom+a,r<0&&e.top-b<d.top&&(b=-(d.top+b-e.top+a)));else{let O=e.bottom-e.top,P=d.bottom-d.top;b=(l=="center"&&O<=P?e.top+O/2-P/2:l=="start"||l=="center"&&r<0?e.top-a:e.bottom-P+a)-d.top}if(s=="nearest"?e.left<d.left?(y=-(d.left-e.left+o),r>0&&e.right>d.right+y&&(y=e.right-d.right+y+o)):e.right>d.right&&(y=e.right-d.right+o,r<0&&e.left<d.left+y&&(y=-(d.left+y-e.left+o))):y=(s=="center"?e.left+(e.right-e.left)/2-(d.right-d.left)/2:s=="start"==c?e.left-o:e.right-(d.right-d.left)+o)-d.left,y||b)if(p)f.scrollBy(y,b);else{let O=0,P=0;if(b){let v=u.scrollTop;u.scrollTop+=b/w,P=(u.scrollTop-v)*w}if(y){let v=u.scrollLeft;u.scrollLeft+=y/m,O=(u.scrollLeft-v)*m}e={left:e.left-O,top:e.top-P,right:e.right-O,bottom:e.bottom-P},O&&Math.abs(O-y)<1&&(s="nearest"),P&&Math.abs(P-b)<1&&(l="nearest")}if(p)break;u=u.assignedSlot||u.parentNode}else if(u.nodeType==11)u=u.host;else break}function scrollableParent(h){let e=h.ownerDocument;for(let r=h.parentNode;r&&r!=e.body;)if(r.nodeType==1){if(r.scrollHeight>r.clientHeight||r.scrollWidth>r.clientWidth)return r;r=r.assignedSlot||r.parentNode}else if(r.nodeType==11)r=r.host;else break;return null}class DOMSelectionState{constructor(){this.anchorNode=null,this.anchorOffset=0,this.focusNode=null,this.focusOffset=0}eq(e){return this.anchorNode==e.anchorNode&&this.anchorOffset==e.anchorOffset&&this.focusNode==e.focusNode&&this.focusOffset==e.focusOffset}setRange(e){let{anchorNode:r,focusNode:s}=e;this.set(r,Math.min(e.anchorOffset,r?maxOffset(r):0),s,Math.min(e.focusOffset,s?maxOffset(s):0))}set(e,r,s,l){this.anchorNode=e,this.anchorOffset=r,this.focusNode=s,this.focusOffset=l}}let preventScrollSupported=null;function focusPreventScroll(h){if(h.setActive)return h.setActive();if(preventScrollSupported)return h.focus(preventScrollSupported);let e=[];for(let r=h;r&&(e.push(r,r.scrollTop,r.scrollLeft),r!=r.ownerDocument);r=r.parentNode);if(h.focus(preventScrollSupported==null?{get preventScroll(){return preventScrollSupported={preventScroll:!0},!0}}:void 0),!preventScrollSupported){preventScrollSupported=!1;for(let r=0;r<e.length;){let s=e[r++],l=e[r++],o=e[r++];s.scrollTop!=l&&(s.scrollTop=l),s.scrollLeft!=o&&(s.scrollLeft=o)}}}let scratchRange;function textRange(h,e,r=e){let s=scratchRange||(scratchRange=document.createRange());return s.setEnd(h,r),s.setStart(h,e),s}function dispatchKey(h,e,r){let s={key:e,code:e,keyCode:r,which:r,cancelable:!0},l=new KeyboardEvent("keydown",s);l.synthetic=!0,h.dispatchEvent(l);let o=new KeyboardEvent("keyup",s);return o.synthetic=!0,h.dispatchEvent(o),l.defaultPrevented||o.defaultPrevented}function getRoot(h){for(;h;){if(h&&(h.nodeType==9||h.nodeType==11&&h.host))return h;h=h.assignedSlot||h.parentNode}return null}function clearAttributes(h){for(;h.attributes.length;)h.removeAttributeNode(h.attributes[0])}function atElementStart(h,e){let r=e.focusNode,s=e.focusOffset;if(!r||e.anchorNode!=r||e.anchorOffset!=s)return!1;for(s=Math.min(s,maxOffset(r));;)if(s){if(r.nodeType!=1)return!1;let l=r.childNodes[s-1];l.contentEditable=="false"?s--:(r=l,s=maxOffset(r))}else{if(r==h)return!0;s=domIndex(r),r=r.parentNode}}function isScrolledToBottom(h){return h.scrollTop>Math.max(1,h.scrollHeight-h.clientHeight-4)}class DOMPos{constructor(e,r,s=!0){this.node=e,this.offset=r,this.precise=s}static before(e,r){return new DOMPos(e.parentNode,domIndex(e),r)}static after(e,r){return new DOMPos(e.parentNode,domIndex(e)+1,r)}}const noChildren=[];class ContentView{constructor(){this.parent=null,this.dom=null,this.flags=2}get overrideDOMText(){return null}get posAtStart(){return this.parent?this.parent.posBefore(this):0}get posAtEnd(){return this.posAtStart+this.length}posBefore(e){let r=this.posAtStart;for(let s of this.children){if(s==e)return r;r+=s.length+s.breakAfter}throw new RangeError("Invalid child in posBefore")}posAfter(e){return this.posBefore(e)+e.length}sync(e,r){if(this.flags&2){let s=this.dom,l=null,o;for(let a of this.children){if(a.flags&7){if(!a.dom&&(o=l?l.nextSibling:s.firstChild)){let c=ContentView.get(o);(!c||!c.parent&&c.canReuseDOM(a))&&a.reuseDOM(o)}a.sync(e,r),a.flags&=-8}if(o=l?l.nextSibling:s.firstChild,r&&!r.written&&r.node==s&&o!=a.dom&&(r.written=!0),a.dom.parentNode==s)for(;o&&o!=a.dom;)o=rm$1(o);else s.insertBefore(a.dom,o);l=a.dom}for(o=l?l.nextSibling:s.firstChild,o&&r&&r.node==s&&(r.written=!0);o;)o=rm$1(o)}else if(this.flags&1)for(let s of this.children)s.flags&7&&(s.sync(e,r),s.flags&=-8)}reuseDOM(e){}localPosFromDOM(e,r){let s;if(e==this.dom)s=this.dom.childNodes[r];else{let l=maxOffset(e)==0?0:r==0?-1:1;for(;;){let o=e.parentNode;if(o==this.dom)break;l==0&&o.firstChild!=o.lastChild&&(e==o.firstChild?l=-1:l=1),e=o}l<0?s=e:s=e.nextSibling}if(s==this.dom.firstChild)return 0;for(;s&&!ContentView.get(s);)s=s.nextSibling;if(!s)return this.length;for(let l=0,o=0;;l++){let a=this.children[l];if(a.dom==s)return o;o+=a.length+a.breakAfter}}domBoundsAround(e,r,s=0){let l=-1,o=-1,a=-1,c=-1;for(let M=0,f=s,u=s;M<this.children.length;M++){let g=this.children[M],d=f+g.length;if(f<e&&d>r)return g.domBoundsAround(e,r,f);if(d>=e&&l==-1&&(l=M,o=f),f>r&&g.dom.parentNode==this.dom){a=M,c=u;break}u=d,f=d+g.breakAfter}return{from:o,to:c<0?s+this.length:c,startDOM:(l?this.children[l-1].dom.nextSibling:null)||this.dom.firstChild,endDOM:a<this.children.length&&a>=0?this.children[a].dom:null}}markDirty(e=!1){this.flags|=2,this.markParentsDirty(e)}markParentsDirty(e){for(let r=this.parent;r;r=r.parent){if(e&&(r.flags|=2),r.flags&1)return;r.flags|=1,e=!1}}setParent(e){this.parent!=e&&(this.parent=e,this.flags&7&&this.markParentsDirty(!0))}setDOM(e){this.dom!=e&&(this.dom&&(this.dom.cmView=null),this.dom=e,e.cmView=this)}get rootView(){for(let e=this;;){let r=e.parent;if(!r)return e;e=r}}replaceChildren(e,r,s=noChildren){this.markDirty();for(let l=e;l<r;l++){let o=this.children[l];o.parent==this&&o.destroy()}this.children.splice(e,r-e,...s);for(let l=0;l<s.length;l++)s[l].setParent(this)}ignoreMutation(e){return!1}ignoreEvent(e){return!1}childCursor(e=this.length){return new ChildCursor(this.children,e,this.children.length)}childPos(e,r=1){return this.childCursor().findPos(e,r)}toString(){let e=this.constructor.name.replace("View","");return e+(this.children.length?"("+this.children.join()+")":this.length?"["+(e=="Text"?this.text:this.length)+"]":"")+(this.breakAfter?"#":"")}static get(e){return e.cmView}get isEditable(){return!0}get isWidget(){return!1}get isHidden(){return!1}merge(e,r,s,l,o,a){return!1}become(e){return!1}canReuseDOM(e){return e.constructor==this.constructor&&!((this.flags|e.flags)&8)}getSide(){return 0}destroy(){this.parent=null}}ContentView.prototype.breakAfter=0;function rm$1(h){let e=h.nextSibling;return h.parentNode.removeChild(h),e}class ChildCursor{constructor(e,r,s){this.children=e,this.pos=r,this.i=s,this.off=0}findPos(e,r=1){for(;;){if(e>this.pos||e==this.pos&&(r>0||this.i==0||this.children[this.i-1].breakAfter))return this.off=e-this.pos,this;let s=this.children[--this.i];this.pos-=s.length+s.breakAfter}}}function replaceRange(h,e,r,s,l,o,a,c,M){let{children:f}=h,u=f.length?f[e]:null,g=o.length?o[o.length-1]:null,d=g?g.breakAfter:a;if(!(e==s&&u&&!a&&!d&&o.length<2&&u.merge(r,l,o.length?g:null,r==0,c,M))){if(s<f.length){let p=f[s];p&&l<p.length?(e==s&&(p=p.split(l),l=0),!d&&g&&p.merge(0,l,g,!0,0,M)?o[o.length-1]=p:(l&&p.merge(0,l,null,!1,0,M),o.push(p))):p!=null&&p.breakAfter&&(g?g.breakAfter=1:a=1),s++}for(u&&(u.breakAfter=a,r>0&&(!a&&o.length&&u.merge(r,u.length,o[0],!1,c,0)?u.breakAfter=o.shift().breakAfter:(r<u.length||u.children.length&&u.children[u.children.length-1].length==0)&&u.merge(r,u.length,null,!1,c,0),e++));e<s&&o.length;)if(f[s-1].become(o[o.length-1]))s--,o.pop(),M=o.length?0:c;else if(f[e].become(o[0]))e++,o.shift(),c=o.length?0:M;else break;!o.length&&e&&s<f.length&&!f[e-1].breakAfter&&f[s].merge(0,0,f[e-1],!1,c,M)&&e--,(e<s||o.length)&&h.replaceChildren(e,s,o)}}function mergeChildrenInto(h,e,r,s,l,o){let a=h.childCursor(),{i:c,off:M}=a.findPos(r,1),{i:f,off:u}=a.findPos(e,-1),g=e-r;for(let d of s)g+=d.length;h.length+=g,replaceRange(h,f,u,c,M,s,0,l,o)}let nav=typeof navigator<"u"?navigator:{userAgent:"",vendor:"",platform:""},doc=typeof document<"u"?document:{documentElement:{style:{}}};const ie_edge=/Edge\/(\d+)/.exec(nav.userAgent),ie_upto10=/MSIE \d/.test(nav.userAgent),ie_11up=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(nav.userAgent),ie=!!(ie_upto10||ie_11up||ie_edge),gecko=!ie&&/gecko\/(\d+)/i.test(nav.userAgent),chrome=!ie&&/Chrome\/(\d+)/.exec(nav.userAgent),webkit="webkitFontSmoothing"in doc.documentElement.style,safari=!ie&&/Apple Computer/.test(nav.vendor),ios=safari&&(/Mobile\/\w+/.test(nav.userAgent)||nav.maxTouchPoints>2);var browser={mac:ios||/Mac/.test(nav.platform),windows:/Win/.test(nav.platform),linux:/Linux|X11/.test(nav.platform),ie,ie_version:ie_upto10?doc.documentMode||6:ie_11up?+ie_11up[1]:ie_edge?+ie_edge[1]:0,gecko,gecko_version:gecko?+(/Firefox\/(\d+)/.exec(nav.userAgent)||[0,0])[1]:0,chrome:!!chrome,chrome_version:chrome?+chrome[1]:0,ios,android:/Android\b/.test(nav.userAgent),webkit,safari,webkit_version:webkit?+(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent)||[0,0])[1]:0,tabSize:doc.documentElement.style.tabSize!=null?"tab-size":"-moz-tab-size"};const MaxJoinLen=256;class TextView extends ContentView{constructor(e){super(),this.text=e}get length(){return this.text.length}createDOM(e){this.setDOM(e||document.createTextNode(this.text))}sync(e,r){this.dom||this.createDOM(),this.dom.nodeValue!=this.text&&(r&&r.node==this.dom&&(r.written=!0),this.dom.nodeValue=this.text)}reuseDOM(e){e.nodeType==3&&this.createDOM(e)}merge(e,r,s){return this.flags&8||s&&(!(s instanceof TextView)||this.length-(r-e)+s.length>MaxJoinLen||s.flags&8)?!1:(this.text=this.text.slice(0,e)+(s?s.text:"")+this.text.slice(r),this.markDirty(),!0)}split(e){let r=new TextView(this.text.slice(e));return this.text=this.text.slice(0,e),this.markDirty(),r.flags|=this.flags&8,r}localPosFromDOM(e,r){return e==this.dom?r:r?this.text.length:0}domAtPos(e){return new DOMPos(this.dom,e)}domBoundsAround(e,r,s){return{from:s,to:s+this.length,startDOM:this.dom,endDOM:this.dom.nextSibling}}coordsAt(e,r){return textCoords(this.dom,e,r)}}class MarkView extends ContentView{constructor(e,r=[],s=0){super(),this.mark=e,this.children=r,this.length=s;for(let l of r)l.setParent(this)}setAttrs(e){if(clearAttributes(e),this.mark.class&&(e.className=this.mark.class),this.mark.attrs)for(let r in this.mark.attrs)e.setAttribute(r,this.mark.attrs[r]);return e}canReuseDOM(e){return super.canReuseDOM(e)&&!((this.flags|e.flags)&8)}reuseDOM(e){e.nodeName==this.mark.tagName.toUpperCase()&&(this.setDOM(e),this.flags|=6)}sync(e,r){this.dom?this.flags&4&&this.setAttrs(this.dom):this.setDOM(this.setAttrs(document.createElement(this.mark.tagName))),super.sync(e,r)}merge(e,r,s,l,o,a){return s&&(!(s instanceof MarkView&&s.mark.eq(this.mark))||e&&o<=0||r<this.length&&a<=0)?!1:(mergeChildrenInto(this,e,r,s?s.children:[],o-1,a-1),this.markDirty(),!0)}split(e){let r=[],s=0,l=-1,o=0;for(let c of this.children){let M=s+c.length;M>e&&r.push(s<e?c.split(e-s):c),l<0&&s>=e&&(l=o),s=M,o++}let a=this.length-e;return this.length=e,l>-1&&(this.children.length=l,this.markDirty()),new MarkView(this.mark,r,a)}domAtPos(e){return inlineDOMAtPos(this,e)}coordsAt(e,r){return coordsInChildren(this,e,r)}}function textCoords(h,e,r){let s=h.nodeValue.length;e>s&&(e=s);let l=e,o=e,a=0;e==0&&r<0||e==s&&r>=0?browser.chrome||browser.gecko||(e?(l--,a=1):o<s&&(o++,a=-1)):r<0?l--:o<s&&o++;let c=textRange(h,l,o).getClientRects();if(!c.length)return null;let M=c[(a?a<0:r>=0)?0:c.length-1];return browser.safari&&!a&&M.width==0&&(M=Array.prototype.find.call(c,f=>f.width)||M),a?flattenRect(M,a<0):M||null}class WidgetView extends ContentView{static create(e,r,s){return new WidgetView(e,r,s)}constructor(e,r,s){super(),this.widget=e,this.length=r,this.side=s,this.prevWidget=null}split(e){let r=WidgetView.create(this.widget,this.length-e,this.side);return this.length-=e,r}sync(e){(!this.dom||!this.widget.updateDOM(this.dom,e))&&(this.dom&&this.prevWidget&&this.prevWidget.destroy(this.dom),this.prevWidget=null,this.setDOM(this.widget.toDOM(e)),this.dom.contentEditable="false")}getSide(){return this.side}merge(e,r,s,l,o,a){return s&&(!(s instanceof WidgetView)||!this.widget.compare(s.widget)||e>0&&o<=0||r<this.length&&a<=0)?!1:(this.length=e+(s?s.length:0)+(this.length-r),!0)}become(e){return e instanceof WidgetView&&e.side==this.side&&this.widget.constructor==e.widget.constructor?(this.widget.compare(e.widget)||this.markDirty(!0),this.dom&&!this.prevWidget&&(this.prevWidget=this.widget),this.widget=e.widget,this.length=e.length,!0):!1}ignoreMutation(){return!0}ignoreEvent(e){return this.widget.ignoreEvent(e)}get overrideDOMText(){if(this.length==0)return Text.empty;let e=this;for(;e.parent;)e=e.parent;let{view:r}=e,s=r&&r.state.doc,l=this.posAtStart;return s?s.slice(l,l+this.length):Text.empty}domAtPos(e){return(this.length?e==0:this.side>0)?DOMPos.before(this.dom):DOMPos.after(this.dom,e==this.length)}domBoundsAround(){return null}coordsAt(e,r){let s=this.widget.coordsAt(this.dom,e,r);if(s)return s;let l=this.dom.getClientRects(),o=null;if(!l.length)return null;let a=this.side?this.side<0:e>0;for(let c=a?l.length-1:0;o=l[c],!(e>0?c==0:c==l.length-1||o.top<o.bottom);c+=a?-1:1);return flattenRect(o,!a)}get isEditable(){return!1}get isWidget(){return!0}get isHidden(){return this.widget.isHidden}destroy(){super.destroy(),this.dom&&this.widget.destroy(this.dom)}}class WidgetBufferView extends ContentView{constructor(e){super(),this.side=e}get length(){return 0}merge(){return!1}become(e){return e instanceof WidgetBufferView&&e.side==this.side}split(){return new WidgetBufferView(this.side)}sync(){if(!this.dom){let e=document.createElement("img");e.className="cm-widgetBuffer",e.setAttribute("aria-hidden","true"),this.setDOM(e)}}getSide(){return this.side}domAtPos(e){return this.side>0?DOMPos.before(this.dom):DOMPos.after(this.dom)}localPosFromDOM(){return 0}domBoundsAround(){return null}coordsAt(e){return this.dom.getBoundingClientRect()}get overrideDOMText(){return Text.empty}get isHidden(){return!0}}TextView.prototype.children=WidgetView.prototype.children=WidgetBufferView.prototype.children=noChildren;function inlineDOMAtPos(h,e){let r=h.dom,{children:s}=h,l=0;for(let o=0;l<s.length;l++){let a=s[l],c=o+a.length;if(!(c==o&&a.getSide()<=0)){if(e>o&&e<c&&a.dom.parentNode==r)return a.domAtPos(e-o);if(e<=o)break;o=c}}for(let o=l;o>0;o--){let a=s[o-1];if(a.dom.parentNode==r)return a.domAtPos(a.length)}for(let o=l;o<s.length;o++){let a=s[o];if(a.dom.parentNode==r)return a.domAtPos(0)}return new DOMPos(r,0)}function joinInlineInto(h,e,r){let s,{children:l}=h;r>0&&e instanceof MarkView&&l.length&&(s=l[l.length-1])instanceof MarkView&&s.mark.eq(e.mark)?joinInlineInto(s,e.children[0],r-1):(l.push(e),e.setParent(h)),h.length+=e.length}function coordsInChildren(h,e,r){let s=null,l=-1,o=null,a=-1;function c(f,u){for(let g=0,d=0;g<f.children.length&&d<=u;g++){let p=f.children[g],m=d+p.length;m>=u&&(p.children.length?c(p,u-d):(!o||o.isHidden&&r>0)&&(m>u||d==m&&p.getSide()>0)?(o=p,a=u-d):(d<u||d==m&&p.getSide()<0&&!p.isHidden)&&(s=p,l=u-d)),d=m}}c(h,e);let M=(r<0?s:o)||s||o;return M?M.coordsAt(Math.max(0,M==s?l:a),r):fallbackRect(h)}function fallbackRect(h){let e=h.dom.lastChild;if(!e)return h.dom.getBoundingClientRect();let r=clientRectsFor(e);return r[r.length-1]||null}function combineAttrs(h,e){for(let r in h)r=="class"&&e.class?e.class+=" "+h.class:r=="style"&&e.style?e.style+=";"+h.style:e[r]=h[r];return e}const noAttrs=Object.create(null);function attrsEq(h,e,r){if(h==e)return!0;h||(h=noAttrs),e||(e=noAttrs);let s=Object.keys(h),l=Object.keys(e);if(s.length-(r&&s.indexOf(r)>-1?1:0)!=l.length-(r&&l.indexOf(r)>-1?1:0))return!1;for(let o of s)if(o!=r&&(l.indexOf(o)==-1||h[o]!==e[o]))return!1;return!0}function updateAttrs(h,e,r){let s=!1;if(e)for(let l in e)r&&l in r||(s=!0,l=="style"?h.style.cssText="":h.removeAttribute(l));if(r)for(let l in r)e&&e[l]==r[l]||(s=!0,l=="style"?h.style.cssText=r[l]:h.setAttribute(l,r[l]));return s}function getAttrs(h){let e=Object.create(null);for(let r=0;r<h.attributes.length;r++){let s=h.attributes[r];e[s.name]=s.value}return e}class WidgetType{eq(e){return!1}updateDOM(e,r){return!1}compare(e){return this==e||this.constructor==e.constructor&&this.eq(e)}get estimatedHeight(){return-1}get lineBreaks(){return 0}ignoreEvent(e){return!0}coordsAt(e,r,s){return null}get isHidden(){return!1}destroy(e){}}var BlockType=function(h){return h[h.Text=0]="Text",h[h.WidgetBefore=1]="WidgetBefore",h[h.WidgetAfter=2]="WidgetAfter",h[h.WidgetRange=3]="WidgetRange",h}(BlockType||(BlockType={}));class Decoration extends RangeValue{constructor(e,r,s,l){super(),this.startSide=e,this.endSide=r,this.widget=s,this.spec=l}get heightRelevant(){return!1}static mark(e){return new MarkDecoration(e)}static widget(e){let r=Math.max(-1e4,Math.min(1e4,e.side||0)),s=!!e.block;return r+=s&&!e.inlineOrder?r>0?3e8:-4e8:r>0?1e8:-1e8,new PointDecoration(e,r,r,s,e.widget||null,!1)}static replace(e){let r=!!e.block,s,l;if(e.isBlockGap)s=-5e8,l=4e8;else{let{start:o,end:a}=getInclusive(e,r);s=(o?r?-3e8:-1:5e8)-1,l=(a?r?2e8:1:-6e8)+1}return new PointDecoration(e,s,l,r,e.widget||null,!0)}static line(e){return new LineDecoration(e)}static set(e,r=!1){return RangeSet.of(e,r)}hasHeight(){return this.widget?this.widget.estimatedHeight>-1:!1}}Decoration.none=RangeSet.empty;class MarkDecoration extends Decoration{constructor(e){let{start:r,end:s}=getInclusive(e);super(r?-1:5e8,s?1:-6e8,null,e),this.tagName=e.tagName||"span",this.class=e.class||"",this.attrs=e.attributes||null}eq(e){var r,s;return this==e||e instanceof MarkDecoration&&this.tagName==e.tagName&&(this.class||((r=this.attrs)===null||r===void 0?void 0:r.class))==(e.class||((s=e.attrs)===null||s===void 0?void 0:s.class))&&attrsEq(this.attrs,e.attrs,"class")}range(e,r=e){if(e>=r)throw new RangeError("Mark decorations may not be empty");return super.range(e,r)}}MarkDecoration.prototype.point=!1;class LineDecoration extends Decoration{constructor(e){super(-2e8,-2e8,null,e)}eq(e){return e instanceof LineDecoration&&this.spec.class==e.spec.class&&attrsEq(this.spec.attributes,e.spec.attributes)}range(e,r=e){if(r!=e)throw new RangeError("Line decoration ranges must be zero-length");return super.range(e,r)}}LineDecoration.prototype.mapMode=MapMode.TrackBefore;LineDecoration.prototype.point=!0;class PointDecoration extends Decoration{constructor(e,r,s,l,o,a){super(r,s,o,e),this.block=l,this.isReplace=a,this.mapMode=l?r<=0?MapMode.TrackBefore:MapMode.TrackAfter:MapMode.TrackDel}get type(){return this.startSide<this.endSide?BlockType.WidgetRange:this.startSide<=0?BlockType.WidgetBefore:BlockType.WidgetAfter}get heightRelevant(){return this.block||!!this.widget&&(this.widget.estimatedHeight>=5||this.widget.lineBreaks>0)}eq(e){return e instanceof PointDecoration&&widgetsEq(this.widget,e.widget)&&this.block==e.block&&this.startSide==e.startSide&&this.endSide==e.endSide}range(e,r=e){if(this.isReplace&&(e>r||e==r&&this.startSide>0&&this.endSide<=0))throw new RangeError("Invalid range for replacement decoration");if(!this.isReplace&&r!=e)throw new RangeError("Widget decorations can only have zero-length ranges");return super.range(e,r)}}PointDecoration.prototype.point=!0;function getInclusive(h,e=!1){let{inclusiveStart:r,inclusiveEnd:s}=h;return r==null&&(r=h.inclusive),s==null&&(s=h.inclusive),{start:r??e,end:s??e}}function widgetsEq(h,e){return h==e||!!(h&&e&&h.compare(e))}function addRange(h,e,r,s=0){let l=r.length-1;l>=0&&r[l]+s>=h?r[l]=Math.max(r[l],e):r.push(h,e)}class LineView extends ContentView{constructor(){super(...arguments),this.children=[],this.length=0,this.prevAttrs=void 0,this.attrs=null,this.breakAfter=0}merge(e,r,s,l,o,a){if(s){if(!(s instanceof LineView))return!1;this.dom||s.transferDOM(this)}return l&&this.setDeco(s?s.attrs:null),mergeChildrenInto(this,e,r,s?s.children:[],o,a),!0}split(e){let r=new LineView;if(r.breakAfter=this.breakAfter,this.length==0)return r;let{i:s,off:l}=this.childPos(e);l&&(r.append(this.children[s].split(l),0),this.children[s].merge(l,this.children[s].length,null,!1,0,0),s++);for(let o=s;o<this.children.length;o++)r.append(this.children[o],0);for(;s>0&&this.children[s-1].length==0;)this.children[--s].destroy();return this.children.length=s,this.markDirty(),this.length=e,r}transferDOM(e){this.dom&&(this.markDirty(),e.setDOM(this.dom),e.prevAttrs=this.prevAttrs===void 0?this.attrs:this.prevAttrs,this.prevAttrs=void 0,this.dom=null)}setDeco(e){attrsEq(this.attrs,e)||(this.dom&&(this.prevAttrs=this.attrs,this.markDirty()),this.attrs=e)}append(e,r){joinInlineInto(this,e,r)}addLineDeco(e){let r=e.spec.attributes,s=e.spec.class;r&&(this.attrs=combineAttrs(r,this.attrs||{})),s&&(this.attrs=combineAttrs({class:s},this.attrs||{}))}domAtPos(e){return inlineDOMAtPos(this,e)}reuseDOM(e){e.nodeName=="DIV"&&(this.setDOM(e),this.flags|=6)}sync(e,r){var s;this.dom?this.flags&4&&(clearAttributes(this.dom),this.dom.className="cm-line",this.prevAttrs=this.attrs?null:void 0):(this.setDOM(document.createElement("div")),this.dom.className="cm-line",this.prevAttrs=this.attrs?null:void 0),this.prevAttrs!==void 0&&(updateAttrs(this.dom,this.prevAttrs,this.attrs),this.dom.classList.add("cm-line"),this.prevAttrs=void 0),super.sync(e,r);let l=this.dom.lastChild;for(;l&&ContentView.get(l)instanceof MarkView;)l=l.lastChild;if(!l||!this.length||l.nodeName!="BR"&&((s=ContentView.get(l))===null||s===void 0?void 0:s.isEditable)==!1&&(!browser.ios||!this.children.some(o=>o instanceof TextView))){let o=document.createElement("BR");o.cmIgnore=!0,this.dom.appendChild(o)}}measureTextSize(){if(this.children.length==0||this.length>20)return null;let e=0,r;for(let s of this.children){if(!(s instanceof TextView)||/[^ -~]/.test(s.text))return null;let l=clientRectsFor(s.dom);if(l.length!=1)return null;e+=l[0].width,r=l[0].height}return e?{lineHeight:this.dom.getBoundingClientRect().height,charWidth:e/this.length,textHeight:r}:null}coordsAt(e,r){let s=coordsInChildren(this,e,r);if(!this.children.length&&s&&this.parent){let{heightOracle:l}=this.parent.view.viewState,o=s.bottom-s.top;if(Math.abs(o-l.lineHeight)<2&&l.textHeight<o){let a=(o-l.textHeight)/2;return{top:s.top+a,bottom:s.bottom-a,left:s.left,right:s.left}}}return s}become(e){return!1}get type(){return BlockType.Text}static find(e,r){for(let s=0,l=0;s<e.children.length;s++){let o=e.children[s],a=l+o.length;if(a>=r){if(o instanceof LineView)return o;if(a>r)break}l=a+o.breakAfter}return null}}class BlockWidgetView extends ContentView{constructor(e,r,s){super(),this.widget=e,this.length=r,this.type=s,this.breakAfter=0,this.prevWidget=null}merge(e,r,s,l,o,a){return s&&(!(s instanceof BlockWidgetView)||!this.widget.compare(s.widget)||e>0&&o<=0||r<this.length&&a<=0)?!1:(this.length=e+(s?s.length:0)+(this.length-r),!0)}domAtPos(e){return e==0?DOMPos.before(this.dom):DOMPos.after(this.dom,e==this.length)}split(e){let r=this.length-e;this.length=e;let s=new BlockWidgetView(this.widget,r,this.type);return s.breakAfter=this.breakAfter,s}get children(){return noChildren}sync(e){(!this.dom||!this.widget.updateDOM(this.dom,e))&&(this.dom&&this.prevWidget&&this.prevWidget.destroy(this.dom),this.prevWidget=null,this.setDOM(this.widget.toDOM(e)),this.dom.contentEditable="false")}get overrideDOMText(){return this.parent?this.parent.view.state.doc.slice(this.posAtStart,this.posAtEnd):Text.empty}domBoundsAround(){return null}become(e){return e instanceof BlockWidgetView&&e.widget.constructor==this.widget.constructor?(e.widget.compare(this.widget)||this.markDirty(!0),this.dom&&!this.prevWidget&&(this.prevWidget=this.widget),this.widget=e.widget,this.length=e.length,this.type=e.type,this.breakAfter=e.breakAfter,!0):!1}ignoreMutation(){return!0}ignoreEvent(e){return this.widget.ignoreEvent(e)}get isEditable(){return!1}get isWidget(){return!0}coordsAt(e,r){return this.widget.coordsAt(this.dom,e,r)}destroy(){super.destroy(),this.dom&&this.widget.destroy(this.dom)}}class ContentBuilder{constructor(e,r,s,l){this.doc=e,this.pos=r,this.end=s,this.disallowBlockEffectsFor=l,this.content=[],this.curLine=null,this.breakAtStart=0,this.pendingBuffer=0,this.bufferMarks=[],this.atCursorPos=!0,this.openStart=-1,this.openEnd=-1,this.text="",this.textOff=0,this.cursor=e.iter(),this.skip=r}posCovered(){if(this.content.length==0)return!this.breakAtStart&&this.doc.lineAt(this.pos).from!=this.pos;let e=this.content[this.content.length-1];return!e.breakAfter&&!(e instanceof BlockWidgetView&&e.type==BlockType.WidgetBefore)}getLine(){return this.curLine||(this.content.push(this.curLine=new LineView),this.atCursorPos=!0),this.curLine}flushBuffer(e=this.bufferMarks){this.pendingBuffer&&(this.curLine.append(wrapMarks(new WidgetBufferView(-1),e),e.length),this.pendingBuffer=0)}addBlockWidget(e){this.flushBuffer(),this.curLine=null,this.content.push(e)}finish(e){this.pendingBuffer&&e<=this.bufferMarks.length?this.flushBuffer():this.pendingBuffer=0,this.posCovered()||this.getLine()}buildText(e,r,s){for(;e>0;){if(this.textOff==this.text.length){let{value:o,lineBreak:a,done:c}=this.cursor.next(this.skip);if(this.skip=0,c)throw new Error("Ran out of text content when drawing inline views");if(a){this.posCovered()||this.getLine(),this.content.length?this.content[this.content.length-1].breakAfter=1:this.breakAtStart=1,this.flushBuffer(),this.curLine=null,this.atCursorPos=!0,e--;continue}else this.text=o,this.textOff=0}let l=Math.min(this.text.length-this.textOff,e,512);this.flushBuffer(r.slice(r.length-s)),this.getLine().append(wrapMarks(new TextView(this.text.slice(this.textOff,this.textOff+l)),r),s),this.atCursorPos=!0,this.textOff+=l,e-=l,s=0}}span(e,r,s,l){this.buildText(r-e,s,l),this.pos=r,this.openStart<0&&(this.openStart=l)}point(e,r,s,l,o,a){if(this.disallowBlockEffectsFor[a]&&s instanceof PointDecoration){if(s.block)throw new RangeError("Block decorations may not be specified via plugins");if(r>this.doc.lineAt(this.pos).to)throw new RangeError("Decorations that replace line breaks may not be specified via plugins")}let c=r-e;if(s instanceof PointDecoration)if(s.block){let{type:M}=s;M==BlockType.WidgetAfter&&!this.posCovered()&&this.getLine(),this.addBlockWidget(new BlockWidgetView(s.widget||new NullWidget("div"),c,M))}else{let M=WidgetView.create(s.widget||new NullWidget("span"),c,c?0:s.startSide),f=this.atCursorPos&&!M.isEditable&&o<=l.length&&(e<r||s.startSide>0),u=!M.isEditable&&(e<r||o>l.length||s.startSide<=0),g=this.getLine();this.pendingBuffer==2&&!f&&!M.isEditable&&(this.pendingBuffer=0),this.flushBuffer(l),f&&(g.append(wrapMarks(new WidgetBufferView(1),l),o),o=l.length+Math.max(0,o-l.length)),g.append(wrapMarks(M,l),o),this.atCursorPos=u,this.pendingBuffer=u?e<r||o>l.length?1:2:0,this.pendingBuffer&&(this.bufferMarks=l.slice())}else this.doc.lineAt(this.pos).from==this.pos&&this.getLine().addLineDeco(s);c&&(this.textOff+c<=this.text.length?this.textOff+=c:(this.skip+=c-(this.text.length-this.textOff),this.text="",this.textOff=0),this.pos=r),this.openStart<0&&(this.openStart=o)}static build(e,r,s,l,o){let a=new ContentBuilder(e,r,s,o);return a.openEnd=RangeSet.spans(l,r,s,a),a.openStart<0&&(a.openStart=a.openEnd),a.finish(a.openEnd),a}}function wrapMarks(h,e){for(let r of e)h=new MarkView(r,[h],h.length);return h}class NullWidget extends WidgetType{constructor(e){super(),this.tag=e}eq(e){return e.tag==this.tag}toDOM(){return document.createElement(this.tag)}updateDOM(e){return e.nodeName.toLowerCase()==this.tag}get isHidden(){return!0}}const clickAddsSelectionRange=Facet.define(),dragMovesSelection$1=Facet.define(),mouseSelectionStyle=Facet.define(),exceptionSink=Facet.define(),updateListener=Facet.define(),inputHandler$1=Facet.define(),focusChangeEffect=Facet.define(),perLineTextDirection=Facet.define({combine:h=>h.some(e=>e)}),nativeSelectionHidden=Facet.define({combine:h=>h.some(e=>e)});class ScrollTarget{constructor(e,r="nearest",s="nearest",l=5,o=5){this.range=e,this.y=r,this.x=s,this.yMargin=l,this.xMargin=o}map(e){return e.empty?this:new ScrollTarget(this.range.map(e),this.y,this.x,this.yMargin,this.xMargin)}}const scrollIntoView$1=StateEffect.define({map:(h,e)=>h.map(e)});function logException(h,e,r){let s=h.facet(exceptionSink);s.length?s[0](e):window.onerror?window.onerror(String(e),r,void 0,void 0,e):r?console.error(r+":",e):console.error(e)}const editable=Facet.define({combine:h=>h.length?h[0]:!0});let nextPluginID=0;const viewPlugin=Facet.define();class ViewPlugin{constructor(e,r,s,l){this.id=e,this.create=r,this.domEventHandlers=s,this.extension=l(this)}static define(e,r){const{eventHandlers:s,provide:l,decorations:o}=r||{};return new ViewPlugin(nextPluginID++,e,s,a=>{let c=[viewPlugin.of(a)];return o&&c.push(decorations.of(M=>{let f=M.plugin(a);return f?o(f):Decoration.none})),l&&c.push(l(a)),c})}static fromClass(e,r){return ViewPlugin.define(s=>new e(s),r)}}class PluginInstance{constructor(e){this.spec=e,this.mustUpdate=null,this.value=null}update(e){if(this.value){if(this.mustUpdate){let r=this.mustUpdate;if(this.mustUpdate=null,this.value.update)try{this.value.update(r)}catch(s){if(logException(r.state,s,"CodeMirror plugin crashed"),this.value.destroy)try{this.value.destroy()}catch{}this.deactivate()}}}else if(this.spec)try{this.value=this.spec.create(e)}catch(r){logException(e.state,r,"CodeMirror plugin crashed"),this.deactivate()}return this}destroy(e){var r;if(!((r=this.value)===null||r===void 0)&&r.destroy)try{this.value.destroy()}catch(s){logException(e.state,s,"CodeMirror plugin crashed")}}deactivate(){this.spec=this.value=null}}const editorAttributes=Facet.define(),contentAttributes=Facet.define(),decorations=Facet.define(),atomicRanges=Facet.define(),bidiIsolatedRanges=Facet.define();function getIsolatedRanges(h,e,r){let s=h.state.facet(bidiIsolatedRanges);if(!s.length)return s;let l=s.map(a=>a instanceof Function?a(h):a),o=[];return RangeSet.spans(l,e,r,{point(){},span(a,c,M,f){let u=o;for(let g=M.length-1;g>=0;g--,f--){let d=M[g].spec.bidiIsolate,p;if(d!=null)if(f>0&&u.length&&(p=u[u.length-1]).to==a&&p.direction==d)p.to=c,u=p.inner;else{let m={from:a,to:c,direction:d,inner:[]};u.push(m),u=m.inner}}}}),o}const scrollMargins=Facet.define();function getScrollMargins(h){let e=0,r=0,s=0,l=0;for(let o of h.state.facet(scrollMargins)){let a=o(h);a&&(a.left!=null&&(e=Math.max(e,a.left)),a.right!=null&&(r=Math.max(r,a.right)),a.top!=null&&(s=Math.max(s,a.top)),a.bottom!=null&&(l=Math.max(l,a.bottom)))}return{left:e,right:r,top:s,bottom:l}}const styleModule=Facet.define();class ChangedRange{constructor(e,r,s,l){this.fromA=e,this.toA=r,this.fromB=s,this.toB=l}join(e){return new ChangedRange(Math.min(this.fromA,e.fromA),Math.max(this.toA,e.toA),Math.min(this.fromB,e.fromB),Math.max(this.toB,e.toB))}addToSet(e){let r=e.length,s=this;for(;r>0;r--){let l=e[r-1];if(!(l.fromA>s.toA)){if(l.toA<s.fromA)break;s=s.join(l),e.splice(r-1,1)}}return e.splice(r,0,s),e}static extendWithRanges(e,r){if(r.length==0)return e;let s=[];for(let l=0,o=0,a=0,c=0;;l++){let M=l==e.length?null:e[l],f=a-c,u=M?M.fromB:1e9;for(;o<r.length&&r[o]<u;){let g=r[o],d=r[o+1],p=Math.max(c,g),m=Math.min(u,d);if(p<=m&&new ChangedRange(p+f,m+f,p,m).addToSet(s),d>u)break;o+=2}if(!M)return s;new ChangedRange(M.fromA,M.toA,M.fromB,M.toB).addToSet(s),a=M.toA,c=M.toB}}}class ViewUpdate{constructor(e,r,s){this.view=e,this.state=r,this.transactions=s,this.flags=0,this.startState=e.state,this.changes=ChangeSet.empty(this.startState.doc.length);for(let o of s)this.changes=this.changes.compose(o.changes);let l=[];this.changes.iterChangedRanges((o,a,c,M)=>l.push(new ChangedRange(o,a,c,M))),this.changedRanges=l}static create(e,r,s){return new ViewUpdate(e,r,s)}get viewportChanged(){return(this.flags&4)>0}get heightChanged(){return(this.flags&2)>0}get geometryChanged(){return this.docChanged||(this.flags&10)>0}get focusChanged(){return(this.flags&1)>0}get docChanged(){return!this.changes.empty}get selectionSet(){return this.transactions.some(e=>e.selection)}get empty(){return this.flags==0&&this.transactions.length==0}}var Direction=function(h){return h[h.LTR=0]="LTR",h[h.RTL=1]="RTL",h}(Direction||(Direction={}));const LTR=Direction.LTR,RTL=Direction.RTL;function dec(h){let e=[];for(let r=0;r<h.length;r++)e.push(1<<+h[r]);return e}const LowTypes=dec("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"),ArabicTypes=dec("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"),Brackets=Object.create(null),BracketStack=[];for(let h of["()","[]","{}"]){let e=h.charCodeAt(0),r=h.charCodeAt(1);Brackets[e]=r,Brackets[r]=-e}function charType(h){return h<=247?LowTypes[h]:1424<=h&&h<=1524?2:1536<=h&&h<=1785?ArabicTypes[h-1536]:1774<=h&&h<=2220?4:8192<=h&&h<=8203?256:64336<=h&&h<=65023?4:h==8204?256:1}const BidiRE=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;class BidiSpan{get dir(){return this.level%2?RTL:LTR}constructor(e,r,s){this.from=e,this.to=r,this.level=s}side(e,r){return this.dir==r==e?this.to:this.from}static find(e,r,s,l){let o=-1;for(let a=0;a<e.length;a++){let c=e[a];if(c.from<=r&&c.to>=r){if(c.level==s)return a;(o<0||(l!=0?l<0?c.from<r:c.to>r:e[o].level>c.level))&&(o=a)}}if(o<0)throw new RangeError("Index out of range");return o}}function isolatesEq(h,e){if(h.length!=e.length)return!1;for(let r=0;r<h.length;r++){let s=h[r],l=e[r];if(s.from!=l.from||s.to!=l.to||s.direction!=l.direction||!isolatesEq(s.inner,l.inner))return!1}return!0}const types=[];function computeCharTypes(h,e,r,s,l){for(let o=0;o<=s.length;o++){let a=o?s[o-1].to:e,c=o<s.length?s[o].from:r,M=o?256:l;for(let f=a,u=M,g=M;f<c;f++){let d=charType(h.charCodeAt(f));d==512?d=u:d==8&&g==4&&(d=16),types[f]=d==4?2:d,d&7&&(g=d),u=d}for(let f=a,u=M,g=M;f<c;f++){let d=types[f];if(d==128)f<c-1&&u==types[f+1]&&u&24?d=types[f]=u:types[f]=256;else if(d==64){let p=f+1;for(;p<c&&types[p]==64;)p++;let m=f&&u==8||p<r&&types[p]==8?g==1?1:8:256;for(let w=f;w<p;w++)types[w]=m;f=p-1}else d==8&&g==1&&(types[f]=1);u=d,d&7&&(g=d)}}}function processBracketPairs(h,e,r,s,l){let o=l==1?2:1;for(let a=0,c=0,M=0;a<=s.length;a++){let f=a?s[a-1].to:e,u=a<s.length?s[a].from:r;for(let g=f,d,p,m;g<u;g++)if(p=Brackets[d=h.charCodeAt(g)])if(p<0){for(let w=c-3;w>=0;w-=3)if(BracketStack[w+1]==-p){let y=BracketStack[w+2],b=y&2?l:y&4?y&1?o:l:0;b&&(types[g]=types[BracketStack[w]]=b),c=w;break}}else{if(BracketStack.length==189)break;BracketStack[c++]=g,BracketStack[c++]=d,BracketStack[c++]=M}else if((m=types[g])==2||m==1){let w=m==l;M=w?0:1;for(let y=c-3;y>=0;y-=3){let b=BracketStack[y+2];if(b&2)break;if(w)BracketStack[y+2]|=2;else{if(b&4)break;BracketStack[y+2]|=4}}}}}function processNeutrals(h,e,r,s){for(let l=0,o=s;l<=r.length;l++){let a=l?r[l-1].to:h,c=l<r.length?r[l].from:e;for(let M=a;M<c;){let f=types[M];if(f==256){let u=M+1;for(;;)if(u==c){if(l==r.length)break;u=r[l++].to,c=l<r.length?r[l].from:e}else if(types[u]==256)u++;else break;let g=o==1,d=(u<e?types[u]:s)==1,p=g==d?g?1:2:s;for(let m=u,w=l,y=w?r[w-1].to:h;m>M;)m==y&&(m=r[--w].from,y=w?r[w-1].to:h),types[--m]=p;M=u}else o=f,M++}}}function emitSpans(h,e,r,s,l,o,a){let c=s%2?2:1;if(s%2==l%2)for(let M=e,f=0;M<r;){let u=!0,g=!1;if(f==o.length||M<o[f].from){let w=types[M];w!=c&&(u=!1,g=w==16)}let d=!u&&c==1?[]:null,p=u?s:s+1,m=M;e:for(;;)if(f<o.length&&m==o[f].from){if(g)break e;let w=o[f];if(!u)for(let y=w.to,b=f+1;;){if(y==r)break e;if(b<o.length&&o[b].from==y)y=o[b++].to;else{if(types[y]==c)break e;break}}if(f++,d)d.push(w);else{w.from>M&&a.push(new BidiSpan(M,w.from,p));let y=w.direction==LTR!=!(p%2);computeSectionOrder(h,y?s+1:s,l,w.inner,w.from,w.to,a),M=w.to}m=w.to}else{if(m==r||(u?types[m]!=c:types[m]==c))break;m++}d?emitSpans(h,M,m,s+1,l,d,a):M<m&&a.push(new BidiSpan(M,m,p)),M=m}else for(let M=r,f=o.length;M>e;){let u=!0,g=!1;if(!f||M>o[f-1].to){let w=types[M-1];w!=c&&(u=!1,g=w==16)}let d=!u&&c==1?[]:null,p=u?s:s+1,m=M;e:for(;;)if(f&&m==o[f-1].to){if(g)break e;let w=o[--f];if(!u)for(let y=w.from,b=f;;){if(y==e)break e;if(b&&o[b-1].to==y)y=o[--b].from;else{if(types[y-1]==c)break e;break}}if(d)d.push(w);else{w.to<M&&a.push(new BidiSpan(w.to,M,p));let y=w.direction==LTR!=!(p%2);computeSectionOrder(h,y?s+1:s,l,w.inner,w.from,w.to,a),M=w.from}m=w.from}else{if(m==e||(u?types[m-1]!=c:types[m-1]==c))break;m--}d?emitSpans(h,m,M,s+1,l,d,a):m<M&&a.push(new BidiSpan(m,M,p)),M=m}}function computeSectionOrder(h,e,r,s,l,o,a){let c=e%2?2:1;computeCharTypes(h,l,o,s,c),processBracketPairs(h,l,o,s,c),processNeutrals(l,o,s,c),emitSpans(h,l,o,e,r,s,a)}function computeOrder(h,e,r){if(!h)return[new BidiSpan(0,0,e==RTL?1:0)];if(e==LTR&&!r.length&&!BidiRE.test(h))return trivialOrder(h.length);if(r.length)for(;h.length>types.length;)types[types.length]=256;let s=[],l=e==LTR?0:1;return computeSectionOrder(h,l,l,r,0,h.length,s),s}function trivialOrder(h){return[new BidiSpan(0,h,0)]}let movedOver="";function moveVisually(h,e,r,s,l){var o;let a=s.head-h.from,c=-1;if(a==0){if(!l||!h.length)return null;e[0].level!=r&&(a=e[0].side(!1,r),c=0)}else if(a==h.length){if(l)return null;let d=e[e.length-1];d.level!=r&&(a=d.side(!0,r),c=e.length-1)}c<0&&(c=BidiSpan.find(e,a,(o=s.bidiLevel)!==null&&o!==void 0?o:-1,s.assoc));let M=e[c];a==M.side(l,r)&&(M=e[c+=l?1:-1],a=M.side(!l,r));let f=l==(M.dir==r),u=findClusterBreak(h.text,a,f);if(movedOver=h.text.slice(Math.min(a,u),Math.max(a,u)),u!=M.side(l,r))return EditorSelection.cursor(u+h.from,f?-1:1,M.level);let g=c==(l?e.length-1:0)?null:e[c+(l?1:-1)];return!g&&M.level!=r?EditorSelection.cursor(l?h.to:h.from,l?-1:1,r):g&&g.level<M.level?EditorSelection.cursor(g.side(!l,r)+h.from,l?1:-1,g.level):EditorSelection.cursor(u+h.from,l?-1:1,M.level)}class DocView extends ContentView{get length(){return this.view.state.doc.length}constructor(e){super(),this.view=e,this.decorations=[],this.dynamicDecorationMap=[],this.domChanged=null,this.hasComposition=null,this.markedForComposition=new Set,this.minWidth=0,this.minWidthFrom=0,this.minWidthTo=0,this.impreciseAnchor=null,this.impreciseHead=null,this.forceSelection=!1,this.lastUpdate=Date.now(),this.setDOM(e.contentDOM),this.children=[new LineView],this.children[0].setParent(this),this.updateDeco(),this.updateInner([new ChangedRange(0,0,0,e.state.doc.length)],0,null)}update(e){var r;let s=e.changedRanges;this.minWidth>0&&s.length&&(s.every(({fromA:f,toA:u})=>u<this.minWidthFrom||f>this.minWidthTo)?(this.minWidthFrom=e.changes.mapPos(this.minWidthFrom,1),this.minWidthTo=e.changes.mapPos(this.minWidthTo,1)):this.minWidth=this.minWidthFrom=this.minWidthTo=0);let l=-1;this.view.inputState.composing>=0&&(!((r=this.domChanged)===null||r===void 0)&&r.newSel?l=this.domChanged.newSel.head:!touchesComposition(e.changes,this.hasComposition)&&!e.selectionSet&&(l=e.state.selection.main.head));let o=l>-1?findCompositionRange(this.view,e.changes,l):null;if(this.domChanged=null,this.hasComposition){this.markedForComposition.clear();let{from:f,to:u}=this.hasComposition;s=new ChangedRange(f,u,e.changes.mapPos(f,-1),e.changes.mapPos(u,1)).addToSet(s.slice())}this.hasComposition=o?{from:o.range.fromB,to:o.range.toB}:null,(browser.ie||browser.chrome)&&!o&&e&&e.state.doc.lines!=e.startState.doc.lines&&(this.forceSelection=!0);let a=this.decorations,c=this.updateDeco(),M=findChangedDeco(a,c,e.changes);return s=ChangedRange.extendWithRanges(s,M),!(this.flags&7)&&s.length==0?!1:(this.updateInner(s,e.startState.doc.length,o),e.transactions.length&&(this.lastUpdate=Date.now()),!0)}updateInner(e,r,s){this.view.viewState.mustMeasureContent=!0,this.updateChildren(e,r,s);let{observer:l}=this.view;l.ignore(()=>{this.dom.style.height=this.view.viewState.contentHeight/this.view.scaleY+"px",this.dom.style.flexBasis=this.minWidth?this.minWidth+"px":"";let a=browser.chrome||browser.ios?{node:l.selectionRange.focusNode,written:!1}:void 0;this.sync(this.view,a),this.flags&=-8,a&&(a.written||l.selectionRange.focusNode!=a.node)&&(this.forceSelection=!0),this.dom.style.height=""}),this.markedForComposition.forEach(a=>a.flags&=-9);let o=[];if(this.view.viewport.from||this.view.viewport.to<this.view.state.doc.length)for(let a of this.children)a instanceof BlockWidgetView&&a.widget instanceof BlockGapWidget&&o.push(a.dom);l.updateGaps(o)}updateChildren(e,r,s){let l=s?s.range.addToSet(e.slice()):e,o=this.childCursor(r);for(let a=l.length-1;;a--){let c=a>=0?l[a]:null;if(!c)break;let{fromA:M,toA:f,fromB:u,toB:g}=c,d,p,m,w;if(s&&s.range.fromB<g&&s.range.toB>u){let v=ContentBuilder.build(this.view.state.doc,u,s.range.fromB,this.decorations,this.dynamicDecorationMap),S=ContentBuilder.build(this.view.state.doc,s.range.toB,g,this.decorations,this.dynamicDecorationMap);p=v.breakAtStart,m=v.openStart,w=S.openEnd;let k=this.compositionView(s);S.breakAtStart?k.breakAfter=1:S.content.length&&k.merge(k.length,k.length,S.content[0],!1,S.openStart,0)&&(k.breakAfter=S.content[0].breakAfter,S.content.shift()),v.content.length&&k.merge(0,0,v.content[v.content.length-1],!0,0,v.openEnd)&&v.content.pop(),d=v.content.concat(k).concat(S.content)}else({content:d,breakAtStart:p,openStart:m,openEnd:w}=ContentBuilder.build(this.view.state.doc,u,g,this.decorations,this.dynamicDecorationMap));let{i:y,off:b}=o.findPos(f,1),{i:O,off:P}=o.findPos(M,-1);replaceRange(this,O,P,y,b,d,p,m,w)}s&&this.fixCompositionDOM(s)}compositionView(e){let r=new TextView(e.text.nodeValue);r.flags|=8;for(let{deco:l}of e.marks)r=new MarkView(l,[r],r.length);let s=new LineView;return s.append(r,0),s}fixCompositionDOM(e){let r=(o,a)=>{a.flags|=8|(a.children.some(M=>M.flags&7)?1:0),this.markedForComposition.add(a);let c=ContentView.get(o);c&&c!=a&&(c.dom=null),a.setDOM(o)},s=this.childPos(e.range.fromB,1),l=this.children[s.i];r(e.line,l);for(let o=e.marks.length-1;o>=-1;o--)s=l.childPos(s.off,1),l=l.children[s.i],r(o>=0?e.marks[o].node:e.text,l)}updateSelection(e=!1,r=!1){(e||!this.view.observer.selectionRange.focusNode)&&this.view.observer.readSelectionRange();let s=this.view.root.activeElement,l=s==this.dom,o=!l&&hasSelection(this.dom,this.view.observer.selectionRange)&&!(s&&this.dom.contains(s));if(!(l||r||o))return;let a=this.forceSelection;this.forceSelection=!1;let c=this.view.state.selection.main,M=this.moveToLine(this.domAtPos(c.anchor)),f=c.empty?M:this.moveToLine(this.domAtPos(c.head));if(browser.gecko&&c.empty&&!this.hasComposition&&betweenUneditable(M)){let g=document.createTextNode("");this.view.observer.ignore(()=>M.node.insertBefore(g,M.node.childNodes[M.offset]||null)),M=f=new DOMPos(g,0),a=!0}let u=this.view.observer.selectionRange;(a||!u.focusNode||!isEquivalentPosition(M.node,M.offset,u.anchorNode,u.anchorOffset)||!isEquivalentPosition(f.node,f.offset,u.focusNode,u.focusOffset))&&(this.view.observer.ignore(()=>{browser.android&&browser.chrome&&this.dom.contains(u.focusNode)&&inUneditable(u.focusNode,this.dom)&&(this.dom.blur(),this.dom.focus({preventScroll:!0}));let g=getSelection(this.view.root);if(g)if(c.empty){if(browser.gecko){let d=nextToUneditable(M.node,M.offset);if(d&&d!=3){let p=nearbyTextNode(M.node,M.offset,d==1?1:-1);p&&(M=new DOMPos(p.node,p.offset))}}g.collapse(M.node,M.offset),c.bidiLevel!=null&&g.caretBidiLevel!==void 0&&(g.caretBidiLevel=c.bidiLevel)}else if(g.extend){g.collapse(M.node,M.offset);try{g.extend(f.node,f.offset)}catch{}}else{let d=document.createRange();c.anchor>c.head&&([M,f]=[f,M]),d.setEnd(f.node,f.offset),d.setStart(M.node,M.offset),g.removeAllRanges(),g.addRange(d)}o&&this.view.root.activeElement==this.dom&&(this.dom.blur(),s&&s.focus())}),this.view.observer.setSelectionRange(M,f)),this.impreciseAnchor=M.precise?null:new DOMPos(u.anchorNode,u.anchorOffset),this.impreciseHead=f.precise?null:new DOMPos(u.focusNode,u.focusOffset)}enforceCursorAssoc(){if(this.hasComposition)return;let{view:e}=this,r=e.state.selection.main,s=getSelection(e.root),{anchorNode:l,anchorOffset:o}=e.observer.selectionRange;if(!s||!r.empty||!r.assoc||!s.modify)return;let a=LineView.find(this,r.head);if(!a)return;let c=a.posAtStart;if(r.head==c||r.head==c+a.length)return;let M=this.coordsAt(r.head,-1),f=this.coordsAt(r.head,1);if(!M||!f||M.bottom>f.top)return;let u=this.domAtPos(r.head+r.assoc);s.collapse(u.node,u.offset),s.modify("move",r.assoc<0?"forward":"backward","lineboundary"),e.observer.readSelectionRange();let g=e.observer.selectionRange;e.docView.posFromDOM(g.anchorNode,g.anchorOffset)!=r.from&&s.collapse(l,o)}moveToLine(e){let r=this.dom,s;if(e.node!=r)return e;for(let l=e.offset;!s&&l<r.childNodes.length;l++){let o=ContentView.get(r.childNodes[l]);o instanceof LineView&&(s=o.domAtPos(0))}for(let l=e.offset-1;!s&&l>=0;l--){let o=ContentView.get(r.childNodes[l]);o instanceof LineView&&(s=o.domAtPos(o.length))}return s?new DOMPos(s.node,s.offset,!0):e}nearest(e){for(let r=e;r;){let s=ContentView.get(r);if(s&&s.rootView==this)return s;r=r.parentNode}return null}posFromDOM(e,r){let s=this.nearest(e);if(!s)throw new RangeError("Trying to find position for a DOM position outside of the document");return s.localPosFromDOM(e,r)+s.posAtStart}domAtPos(e){let{i:r,off:s}=this.childCursor().findPos(e,-1);for(;r<this.children.length-1;){let l=this.children[r];if(s<l.length||l instanceof LineView)break;r++,s=0}return this.children[r].domAtPos(s)}coordsAt(e,r){for(let s=this.length,l=this.children.length-1;;l--){let o=this.children[l],a=s-o.breakAfter-o.length;if(e>a||e==a&&o.type!=BlockType.WidgetBefore&&o.type!=BlockType.WidgetAfter&&(!l||r==2||this.children[l-1].breakAfter||this.children[l-1].type==BlockType.WidgetBefore&&r>-2))return o.coordsAt(e-a,r);s=a}}coordsForChar(e){let{i:r,off:s}=this.childPos(e,1),l=this.children[r];if(!(l instanceof LineView))return null;for(;l.children.length;){let{i:c,off:M}=l.childPos(s,1);for(;;c++){if(c==l.children.length)return null;if((l=l.children[c]).length)break}s=M}if(!(l instanceof TextView))return null;let o=findClusterBreak(l.text,s);if(o==s)return null;let a=textRange(l.dom,s,o).getClientRects();return!a.length||a[0].top>=a[0].bottom?null:a[0]}measureVisibleLineHeights(e){let r=[],{from:s,to:l}=e,o=this.view.contentDOM.clientWidth,a=o>Math.max(this.view.scrollDOM.clientWidth,this.minWidth)+1,c=-1,M=this.view.textDirection==Direction.LTR;for(let f=0,u=0;u<this.children.length;u++){let g=this.children[u],d=f+g.length;if(d>l)break;if(f>=s){let p=g.dom.getBoundingClientRect();if(r.push(p.height),a){let m=g.dom.lastChild,w=m?clientRectsFor(m):[];if(w.length){let y=w[w.length-1],b=M?y.right-p.left:p.right-y.left;b>c&&(c=b,this.minWidth=o,this.minWidthFrom=f,this.minWidthTo=d)}}}f=d+g.breakAfter}return r}textDirectionAt(e){let{i:r}=this.childPos(e,1);return getComputedStyle(this.children[r].dom).direction=="rtl"?Direction.RTL:Direction.LTR}measureTextSize(){for(let o of this.children)if(o instanceof LineView){let a=o.measureTextSize();if(a)return a}let e=document.createElement("div"),r,s,l;return e.className="cm-line",e.style.width="99999px",e.style.position="absolute",e.textContent="abc def ghi jkl mno pqr stu",this.view.observer.ignore(()=>{this.dom.appendChild(e);let o=clientRectsFor(e.firstChild)[0];r=e.getBoundingClientRect().height,s=o?o.width/27:7,l=o?o.height:r,e.remove()}),{lineHeight:r,charWidth:s,textHeight:l}}childCursor(e=this.length){let r=this.children.length;return r&&(e-=this.children[--r].length),new ChildCursor(this.children,e,r)}computeBlockGapDeco(){let e=[],r=this.view.viewState;for(let s=0,l=0;;l++){let o=l==r.viewports.length?null:r.viewports[l],a=o?o.from-1:this.length;if(a>s){let c=(r.lineBlockAt(a).bottom-r.lineBlockAt(s).top)/this.view.scaleY;e.push(Decoration.replace({widget:new BlockGapWidget(c),block:!0,inclusive:!0,isBlockGap:!0}).range(s,a))}if(!o)break;s=o.to+1}return Decoration.set(e)}updateDeco(){let e=this.view.state.facet(decorations).map((r,s)=>(this.dynamicDecorationMap[s]=typeof r=="function")?r(this.view):r);for(let r=e.length;r<e.length+3;r++)this.dynamicDecorationMap[r]=!1;return this.decorations=[...e,this.computeBlockGapDeco(),this.view.viewState.lineGapDeco]}scrollIntoView(e){let{range:r}=e,s=this.coordsAt(r.head,r.empty?r.assoc:r.head>r.anchor?-1:1),l;if(!s)return;!r.empty&&(l=this.coordsAt(r.anchor,r.anchor>r.head?-1:1))&&(s={left:Math.min(s.left,l.left),top:Math.min(s.top,l.top),right:Math.max(s.right,l.right),bottom:Math.max(s.bottom,l.bottom)});let o=getScrollMargins(this.view),a={left:s.left-o.left,top:s.top-o.top,right:s.right+o.right,bottom:s.bottom+o.bottom};scrollRectIntoView(this.view.scrollDOM,a,r.head<r.anchor?-1:1,e.x,e.y,e.xMargin,e.yMargin,this.view.textDirection==Direction.LTR)}}function betweenUneditable(h){return h.node.nodeType==1&&h.node.firstChild&&(h.offset==0||h.node.childNodes[h.offset-1].contentEditable=="false")&&(h.offset==h.node.childNodes.length||h.node.childNodes[h.offset].contentEditable=="false")}class BlockGapWidget extends WidgetType{constructor(e){super(),this.height=e}toDOM(){let e=document.createElement("div");return this.updateDOM(e),e}eq(e){return e.height==this.height}updateDOM(e){return e.style.height=this.height+"px",!0}get estimatedHeight(){return this.height}}function findCompositionNode(h,e){let r=h.observer.selectionRange,s=r.focusNode&&nearbyTextNode(r.focusNode,r.focusOffset,0);if(!s)return null;let l=e-s.offset;return{from:l,to:l+s.node.nodeValue.length,node:s.node}}function findCompositionRange(h,e,r){let s=findCompositionNode(h,r);if(!s)return null;let{node:l,from:o,to:a}=s,c=l.nodeValue;if(/[\n\r]/.test(c)||h.state.doc.sliceString(s.from,s.to)!=c)return null;let M=e.invertedDesc,f=new ChangedRange(M.mapPos(o),M.mapPos(a),o,a),u=[];for(let g=l.parentNode;;g=g.parentNode){let d=ContentView.get(g);if(d instanceof MarkView)u.push({node:g,deco:d.mark});else{if(d instanceof LineView||g.nodeName=="DIV"&&g.parentNode==h.contentDOM)return{range:f,text:l,marks:u,line:g};if(g!=h.contentDOM)u.push({node:g,deco:new MarkDecoration({inclusive:!0,attributes:getAttrs(g),tagName:g.tagName.toLowerCase()})});else return null}}}function nearbyTextNode(h,e,r){if(r<=0)for(let s=h,l=e;;){if(s.nodeType==3)return{node:s,offset:l};if(s.nodeType==1&&l>0)s=s.childNodes[l-1],l=maxOffset(s);else break}if(r>=0)for(let s=h,l=e;;){if(s.nodeType==3)return{node:s,offset:l};if(s.nodeType==1&&l<s.childNodes.length&&r>=0)s=s.childNodes[l],l=0;else break}return null}function nextToUneditable(h,e){return h.nodeType!=1?0:(e&&h.childNodes[e-1].contentEditable=="false"?1:0)|(e<h.childNodes.length&&h.childNodes[e].contentEditable=="false"?2:0)}let DecorationComparator$1=class{constructor(){this.changes=[]}compareRange(e,r){addRange(e,r,this.changes)}comparePoint(e,r){addRange(e,r,this.changes)}};function findChangedDeco(h,e,r){let s=new DecorationComparator$1;return RangeSet.compare(h,e,r,s),s.changes}function inUneditable(h,e){for(let r=h;r&&r!=e;r=r.assignedSlot||r.parentNode)if(r.nodeType==1&&r.contentEditable=="false")return!0;return!1}function touchesComposition(h,e){let r=!1;return e&&h.iterChangedRanges((s,l)=>{s<e.to&&l>e.from&&(r=!0)}),r}function groupAt(h,e,r=1){let s=h.charCategorizer(e),l=h.doc.lineAt(e),o=e-l.from;if(l.length==0)return EditorSelection.cursor(e);o==0?r=1:o==l.length&&(r=-1);let a=o,c=o;r<0?a=findClusterBreak(l.text,o,!1):c=findClusterBreak(l.text,o);let M=s(l.text.slice(a,c));for(;a>0;){let f=findClusterBreak(l.text,a,!1);if(s(l.text.slice(f,a))!=M)break;a=f}for(;c<l.length;){let f=findClusterBreak(l.text,c);if(s(l.text.slice(c,f))!=M)break;c=f}return EditorSelection.range(a+l.from,c+l.from)}function getdx(h,e){return e.left>h?e.left-h:Math.max(0,h-e.right)}function getdy(h,e){return e.top>h?e.top-h:Math.max(0,h-e.bottom)}function yOverlap(h,e){return h.top<e.bottom-1&&h.bottom>e.top+1}function upTop(h,e){return e<h.top?{top:e,left:h.left,right:h.right,bottom:h.bottom}:h}function upBot(h,e){return e>h.bottom?{top:h.top,left:h.left,right:h.right,bottom:e}:h}function domPosAtCoords(h,e,r){let s,l,o,a,c=!1,M,f,u,g;for(let m=h.firstChild;m;m=m.nextSibling){let w=clientRectsFor(m);for(let y=0;y<w.length;y++){let b=w[y];l&&yOverlap(l,b)&&(b=upTop(upBot(b,l.bottom),l.top));let O=getdx(e,b),P=getdy(r,b);if(O==0&&P==0)return m.nodeType==3?domPosInText(m,e,r):domPosAtCoords(m,e,r);if(!s||a>P||a==P&&o>O){s=m,l=b,o=O,a=P;let v=P?r<b.top?-1:1:O?e<b.left?-1:1:0;c=!v||(v>0?y<w.length-1:y>0)}O==0?r>b.bottom&&(!u||u.bottom<b.bottom)?(M=m,u=b):r<b.top&&(!g||g.top>b.top)&&(f=m,g=b):u&&yOverlap(u,b)?u=upBot(u,b.bottom):g&&yOverlap(g,b)&&(g=upTop(g,b.top))}}if(u&&u.bottom>=r?(s=M,l=u):g&&g.top<=r&&(s=f,l=g),!s)return{node:h,offset:0};let d=Math.max(l.left,Math.min(l.right,e));if(s.nodeType==3)return domPosInText(s,d,r);if(c&&s.contentEditable!="false")return domPosAtCoords(s,d,r);let p=Array.prototype.indexOf.call(h.childNodes,s)+(e>=(l.left+l.right)/2?1:0);return{node:h,offset:p}}function domPosInText(h,e,r){let s=h.nodeValue.length,l=-1,o=1e9,a=0;for(let c=0;c<s;c++){let M=textRange(h,c,c+1).getClientRects();for(let f=0;f<M.length;f++){let u=M[f];if(u.top==u.bottom)continue;a||(a=e-u.left);let g=(u.top>r?u.top-r:r-u.bottom)-1;if(u.left-1<=e&&u.right+1>=e&&g<o){let d=e>=(u.left+u.right)/2,p=d;if((browser.chrome||browser.gecko)&&textRange(h,c).getBoundingClientRect().left==u.right&&(p=!d),g<=0)return{node:h,offset:c+(p?1:0)};l=c+(p?1:0),o=g}}}return{node:h,offset:l>-1?l:a>0?h.nodeValue.length:0}}function posAtCoords(h,e,r,s=-1){var l,o;let a=h.contentDOM.getBoundingClientRect(),c=a.top+h.viewState.paddingTop,M,{docHeight:f}=h.viewState,{x:u,y:g}=e,d=g-c;if(d<0)return 0;if(d>f)return h.state.doc.length;for(let v=h.viewState.heightOracle.textHeight/2,S=!1;M=h.elementAtHeight(d),M.type!=BlockType.Text;)for(;d=s>0?M.bottom+v:M.top-v,!(d>=0&&d<=f);){if(S)return r?null:0;S=!0,s=-s}g=c+d;let p=M.from;if(p<h.viewport.from)return h.viewport.from==0?0:r?null:posAtCoordsImprecise(h,a,M,u,g);if(p>h.viewport.to)return h.viewport.to==h.state.doc.length?h.state.doc.length:r?null:posAtCoordsImprecise(h,a,M,u,g);let m=h.dom.ownerDocument,w=h.root.elementFromPoint?h.root:m,y=w.elementFromPoint(u,g);y&&!h.contentDOM.contains(y)&&(y=null),y||(u=Math.max(a.left+1,Math.min(a.right-1,u)),y=w.elementFromPoint(u,g),y&&!h.contentDOM.contains(y)&&(y=null));let b,O=-1;if(y&&((l=h.docView.nearest(y))===null||l===void 0?void 0:l.isEditable)!=!1){if(m.caretPositionFromPoint){let v=m.caretPositionFromPoint(u,g);v&&({offsetNode:b,offset:O}=v)}else if(m.caretRangeFromPoint){let v=m.caretRangeFromPoint(u,g);v&&({startContainer:b,startOffset:O}=v,(!h.contentDOM.contains(b)||browser.safari&&isSuspiciousSafariCaretResult(b,O,u)||browser.chrome&&isSuspiciousChromeCaretResult(b,O,u))&&(b=void 0))}}if(!b||!h.docView.dom.contains(b)){let v=LineView.find(h.docView,p);if(!v)return d>M.top+M.height/2?M.to:M.from;({node:b,offset:O}=domPosAtCoords(v.dom,u,g))}let P=h.docView.nearest(b);if(!P)return null;if(P.isWidget&&((o=P.dom)===null||o===void 0?void 0:o.nodeType)==1){let v=P.dom.getBoundingClientRect();return e.y<v.top||e.y<=v.bottom&&e.x<=(v.left+v.right)/2?P.posAtStart:P.posAtEnd}else return P.localPosFromDOM(b,O)+P.posAtStart}function posAtCoordsImprecise(h,e,r,s,l){let o=Math.round((s-e.left)*h.defaultCharacterWidth);if(h.lineWrapping&&r.height>h.defaultLineHeight*1.5){let c=h.viewState.heightOracle.textHeight,M=Math.floor((l-r.top-(h.defaultLineHeight-c)*.5)/c);o+=M*h.viewState.heightOracle.lineLength}let a=h.state.sliceDoc(r.from,r.to);return r.from+findColumn(a,o,h.state.tabSize)}function isSuspiciousSafariCaretResult(h,e,r){let s;if(h.nodeType!=3||e!=(s=h.nodeValue.length))return!1;for(let l=h.nextSibling;l;l=l.nextSibling)if(l.nodeType!=1||l.nodeName!="BR")return!1;return textRange(h,s-1,s).getBoundingClientRect().left>r}function isSuspiciousChromeCaretResult(h,e,r){if(e!=0)return!1;for(let l=h;;){let o=l.parentNode;if(!o||o.nodeType!=1||o.firstChild!=l)return!1;if(o.classList.contains("cm-line"))break;l=o}let s=h.nodeType==1?h.getBoundingClientRect():textRange(h,0,Math.max(h.nodeValue.length,1)).getBoundingClientRect();return r-s.left>5}function blockAt(h,e){let r=h.lineBlockAt(e);if(Array.isArray(r.type)){for(let s of r.type)if(s.to>e||s.to==e&&(s.to==r.to||s.type==BlockType.Text))return s}return r}function moveToLineBoundary(h,e,r,s){let l=blockAt(h,e.head),o=!s||l.type!=BlockType.Text||!(h.lineWrapping||l.widgetLineBreaks)?null:h.coordsAtPos(e.assoc<0&&e.head>l.from?e.head-1:e.head);if(o){let a=h.dom.getBoundingClientRect(),c=h.textDirectionAt(l.from),M=h.posAtCoords({x:r==(c==Direction.LTR)?a.right-1:a.left+1,y:(o.top+o.bottom)/2});if(M!=null)return EditorSelection.cursor(M,r?-1:1)}return EditorSelection.cursor(r?l.to:l.from,r?-1:1)}function moveByChar(h,e,r,s){let l=h.state.doc.lineAt(e.head),o=h.bidiSpans(l),a=h.textDirectionAt(l.from);for(let c=e,M=null;;){let f=moveVisually(l,o,a,c,r),u=movedOver;if(!f){if(l.number==(r?h.state.doc.lines:1))return c;u=`
`,l=h.state.doc.line(l.number+(r?1:-1)),o=h.bidiSpans(l),f=EditorSelection.cursor(r?l.from:l.to)}if(M){if(!M(u))return c}else{if(!s)return f;M=s(u)}c=f}}function byGroup(h,e,r){let s=h.state.charCategorizer(e),l=s(r);return o=>{let a=s(o);return l==CharCategory.Space&&(l=a),l==a}}function moveVertically(h,e,r,s){let l=e.head,o=r?1:-1;if(l==(r?h.state.doc.length:0))return EditorSelection.cursor(l,e.assoc);let a=e.goalColumn,c,M=h.contentDOM.getBoundingClientRect(),f=h.coordsAtPos(l),u=h.documentTop;if(f)a==null&&(a=f.left-M.left),c=o<0?f.top:f.bottom;else{let p=h.viewState.lineBlockAt(l);a==null&&(a=Math.min(M.right-M.left,h.defaultCharacterWidth*(l-p.from))),c=(o<0?p.top:p.bottom)+u}let g=M.left+a,d=s??h.viewState.heightOracle.textHeight>>1;for(let p=0;;p+=10){let m=c+(d+p)*o,w=posAtCoords(h,{x:g,y:m},!1,o);if(m<M.top||m>M.bottom||(o<0?w<l:w>l))return EditorSelection.cursor(w,e.assoc,void 0,a)}}function skipAtomicRanges(h,e,r){for(;;){let s=0;for(let l of h)l.between(e-1,e+1,(o,a,c)=>{if(e>o&&e<a){let M=s||r||(e-o<a-e?-1:1);e=M<0?o:a,s=M}});if(!s)return e}}function skipAtoms(h,e,r){let s=skipAtomicRanges(h.state.facet(atomicRanges).map(l=>l(h)),r.from,e.head>r.from?-1:1);return s==r.from?r:EditorSelection.cursor(s,s<r.from?1:-1)}class InputState{setSelectionOrigin(e){this.lastSelectionOrigin=e,this.lastSelectionTime=Date.now()}constructor(e){this.lastKeyCode=0,this.lastKeyTime=0,this.lastTouchTime=0,this.lastFocusTime=0,this.lastScrollTop=0,this.lastScrollLeft=0,this.chromeScrollHack=-1,this.pendingIOSKey=void 0,this.lastSelectionOrigin=null,this.lastSelectionTime=0,this.lastEscPress=0,this.lastContextMenu=0,this.scrollHandlers=[],this.registeredEvents=[],this.customHandlers=[],this.composing=-1,this.compositionFirstChange=null,this.compositionEndedAt=0,this.compositionPendingKey=!1,this.compositionPendingChange=!1,this.mouseSelection=null;let r=(s,l)=>{this.ignoreDuringComposition(l)||l.type=="keydown"&&this.keydown(e,l)||(this.mustFlushObserver(l)&&e.observer.forceFlush(),this.runCustomHandlers(l.type,e,l)?l.preventDefault():s(e,l))};for(let s in handlers){let l=handlers[s];e.contentDOM.addEventListener(s,o=>{eventBelongsToEditor(e,o)&&r(l,o)},handlerOptions[s]),this.registeredEvents.push(s)}e.scrollDOM.addEventListener("mousedown",s=>{if(s.target==e.scrollDOM&&s.clientY>e.contentDOM.getBoundingClientRect().bottom&&(r(handlers.mousedown,s),!s.defaultPrevented&&s.button==2)){let l=e.contentDOM.style.minHeight;e.contentDOM.style.minHeight="100%",setTimeout(()=>e.contentDOM.style.minHeight=l,200)}}),e.scrollDOM.addEventListener("drop",s=>{s.target==e.scrollDOM&&s.clientY>e.contentDOM.getBoundingClientRect().bottom&&r(handlers.drop,s)}),browser.chrome&&browser.chrome_version==102&&e.scrollDOM.addEventListener("wheel",()=>{this.chromeScrollHack<0?e.contentDOM.style.pointerEvents="none":window.clearTimeout(this.chromeScrollHack),this.chromeScrollHack=setTimeout(()=>{this.chromeScrollHack=-1,e.contentDOM.style.pointerEvents=""},100)},{passive:!0}),this.notifiedFocused=e.hasFocus,browser.safari&&e.contentDOM.addEventListener("input",()=>null),browser.gecko&&firefoxCopyCutHack(e.contentDOM.ownerDocument)}ensureHandlers(e,r){var s;let l;this.customHandlers=[];for(let o of r)if(l=(s=o.update(e).spec)===null||s===void 0?void 0:s.domEventHandlers){this.customHandlers.push({plugin:o.value,handlers:l});for(let a in l)this.registeredEvents.indexOf(a)<0&&a!="scroll"&&(this.registeredEvents.push(a),e.contentDOM.addEventListener(a,c=>{eventBelongsToEditor(e,c)&&this.runCustomHandlers(a,e,c)&&c.preventDefault()}))}}runCustomHandlers(e,r,s){for(let l of this.customHandlers){let o=l.handlers[e];if(o)try{if(o.call(l.plugin,s,r)||s.defaultPrevented)return!0}catch(a){logException(r.state,a)}}return!1}runScrollHandlers(e,r){this.lastScrollTop=e.scrollDOM.scrollTop,this.lastScrollLeft=e.scrollDOM.scrollLeft;for(let s of this.customHandlers){let l=s.handlers.scroll;if(l)try{l.call(s.plugin,r,e)}catch(o){logException(e.state,o)}}}keydown(e,r){if(this.lastKeyCode=r.keyCode,this.lastKeyTime=Date.now(),r.keyCode==9&&Date.now()<this.lastEscPress+2e3)return!0;if(r.keyCode!=27&&modifierCodes.indexOf(r.keyCode)<0&&(e.inputState.lastEscPress=0),browser.android&&browser.chrome&&!r.synthetic&&(r.keyCode==13||r.keyCode==8))return e.observer.delayAndroidKey(r.key,r.keyCode),!0;let s;return browser.ios&&!r.synthetic&&!r.altKey&&!r.metaKey&&((s=PendingKeys.find(l=>l.keyCode==r.keyCode))&&!r.ctrlKey||EmacsyPendingKeys.indexOf(r.key)>-1&&r.ctrlKey&&!r.shiftKey)?(this.pendingIOSKey=s||r,setTimeout(()=>this.flushIOSKey(e),250),!0):!1}flushIOSKey(e){let r=this.pendingIOSKey;return r?(this.pendingIOSKey=void 0,dispatchKey(e.contentDOM,r.key,r.keyCode)):!1}ignoreDuringComposition(e){return/^key/.test(e.type)?this.composing>0?!0:browser.safari&&!browser.ios&&this.compositionPendingKey&&Date.now()-this.compositionEndedAt<100?(this.compositionPendingKey=!1,!0):!1:!1}mustFlushObserver(e){return e.type=="keydown"&&e.keyCode!=229}startMouseSelection(e){this.mouseSelection&&this.mouseSelection.destroy(),this.mouseSelection=e}update(e){this.mouseSelection&&this.mouseSelection.update(e),e.transactions.length&&(this.lastKeyCode=this.lastSelectionTime=0)}destroy(){this.mouseSelection&&this.mouseSelection.destroy()}}const PendingKeys=[{key:"Backspace",keyCode:8,inputType:"deleteContentBackward"},{key:"Enter",keyCode:13,inputType:"insertParagraph"},{key:"Enter",keyCode:13,inputType:"insertLineBreak"},{key:"Delete",keyCode:46,inputType:"deleteContentForward"}],EmacsyPendingKeys="dthko",modifierCodes=[16,17,18,20,91,92,224,225],dragScrollMargin=6;function dragScrollSpeed(h){return Math.max(0,h)*.7+8}function dist(h,e){return Math.max(Math.abs(h.clientX-e.clientX),Math.abs(h.clientY-e.clientY))}class MouseSelection{constructor(e,r,s,l){this.view=e,this.startEvent=r,this.style=s,this.mustSelect=l,this.scrollSpeed={x:0,y:0},this.scrolling=-1,this.lastEvent=r,this.scrollParent=scrollableParent(e.contentDOM),this.atoms=e.state.facet(atomicRanges).map(a=>a(e));let o=e.contentDOM.ownerDocument;o.addEventListener("mousemove",this.move=this.move.bind(this)),o.addEventListener("mouseup",this.up=this.up.bind(this)),this.extend=r.shiftKey,this.multiple=e.state.facet(EditorState.allowMultipleSelections)&&addsSelectionRange(e,r),this.dragging=isInPrimarySelection(e,r)&&getClickType(r)==1?null:!1}start(e){this.dragging===!1&&(e.preventDefault(),this.select(e))}move(e){var r;if(e.buttons==0)return this.destroy();if(this.dragging||this.dragging==null&&dist(this.startEvent,e)<10)return;this.select(this.lastEvent=e);let s=0,l=0,o=((r=this.scrollParent)===null||r===void 0?void 0:r.getBoundingClientRect())||{left:0,top:0,right:this.view.win.innerWidth,bottom:this.view.win.innerHeight},a=getScrollMargins(this.view);e.clientX-a.left<=o.left+dragScrollMargin?s=-dragScrollSpeed(o.left-e.clientX):e.clientX+a.right>=o.right-dragScrollMargin&&(s=dragScrollSpeed(e.clientX-o.right)),e.clientY-a.top<=o.top+dragScrollMargin?l=-dragScrollSpeed(o.top-e.clientY):e.clientY+a.bottom>=o.bottom-dragScrollMargin&&(l=dragScrollSpeed(e.clientY-o.bottom)),this.setScrollSpeed(s,l)}up(e){this.dragging==null&&this.select(this.lastEvent),this.dragging||e.preventDefault(),this.destroy()}destroy(){this.setScrollSpeed(0,0);let e=this.view.contentDOM.ownerDocument;e.removeEventListener("mousemove",this.move),e.removeEventListener("mouseup",this.up),this.view.inputState.mouseSelection=null}setScrollSpeed(e,r){this.scrollSpeed={x:e,y:r},e||r?this.scrolling<0&&(this.scrolling=setInterval(()=>this.scroll(),50)):this.scrolling>-1&&(clearInterval(this.scrolling),this.scrolling=-1)}scroll(){this.scrollParent?(this.scrollParent.scrollLeft+=this.scrollSpeed.x,this.scrollParent.scrollTop+=this.scrollSpeed.y):this.view.win.scrollBy(this.scrollSpeed.x,this.scrollSpeed.y),this.dragging===!1&&this.select(this.lastEvent)}skipAtoms(e){let r=null;for(let s=0;s<e.ranges.length;s++){let l=e.ranges[s],o=null;if(l.empty){let a=skipAtomicRanges(this.atoms,l.from,0);a!=l.from&&(o=EditorSelection.cursor(a,-1))}else{let a=skipAtomicRanges(this.atoms,l.from,-1),c=skipAtomicRanges(this.atoms,l.to,1);(a!=l.from||c!=l.to)&&(o=EditorSelection.range(l.from==l.anchor?a:c,l.from==l.head?a:c))}o&&(r||(r=e.ranges.slice()),r[s]=o)}return r?EditorSelection.create(r,e.mainIndex):e}select(e){let{view:r}=this,s=this.skipAtoms(this.style.get(e,this.extend,this.multiple));(this.mustSelect||!s.eq(r.state.selection)||s.main.assoc!=r.state.selection.main.assoc&&this.dragging===!1)&&this.view.dispatch({selection:s,userEvent:"select.pointer"}),this.mustSelect=!1}update(e){e.docChanged&&this.dragging&&(this.dragging=this.dragging.map(e.changes)),this.style.update(e)&&setTimeout(()=>this.select(this.lastEvent),20)}}function addsSelectionRange(h,e){let r=h.state.facet(clickAddsSelectionRange);return r.length?r[0](e):browser.mac?e.metaKey:e.ctrlKey}function dragMovesSelection(h,e){let r=h.state.facet(dragMovesSelection$1);return r.length?r[0](e):browser.mac?!e.altKey:!e.ctrlKey}function isInPrimarySelection(h,e){let{main:r}=h.state.selection;if(r.empty)return!1;let s=getSelection(h.root);if(!s||s.rangeCount==0)return!0;let l=s.getRangeAt(0).getClientRects();for(let o=0;o<l.length;o++){let a=l[o];if(a.left<=e.clientX&&a.right>=e.clientX&&a.top<=e.clientY&&a.bottom>=e.clientY)return!0}return!1}function eventBelongsToEditor(h,e){if(!e.bubbles)return!0;if(e.defaultPrevented)return!1;for(let r=e.target,s;r!=h.contentDOM;r=r.parentNode)if(!r||r.nodeType==11||(s=ContentView.get(r))&&s.ignoreEvent(e))return!1;return!0}const handlers=Object.create(null),handlerOptions=Object.create(null),brokenClipboardAPI=browser.ie&&browser.ie_version<15||browser.ios&&browser.webkit_version<604;function capturePaste(h){let e=h.dom.parentNode;if(!e)return;let r=e.appendChild(document.createElement("textarea"));r.style.cssText="position: fixed; left: -10000px; top: 10px",r.focus(),setTimeout(()=>{h.focus(),r.remove(),doPaste(h,r.value)},50)}function doPaste(h,e){let{state:r}=h,s,l=1,o=r.toText(e),a=o.lines==r.selection.ranges.length;if(lastLinewiseCopy!=null&&r.selection.ranges.every(M=>M.empty)&&lastLinewiseCopy==o.toString()){let M=-1;s=r.changeByRange(f=>{let u=r.doc.lineAt(f.from);if(u.from==M)return{range:f};M=u.from;let g=r.toText((a?o.line(l++).text:e)+r.lineBreak);return{changes:{from:u.from,insert:g},range:EditorSelection.cursor(f.from+g.length)}})}else a?s=r.changeByRange(M=>{let f=o.line(l++);return{changes:{from:M.from,to:M.to,insert:f.text},range:EditorSelection.cursor(M.from+f.length)}}):s=r.replaceSelection(o);h.dispatch(s,{userEvent:"input.paste",scrollIntoView:!0})}handlers.keydown=(h,e)=>{h.inputState.setSelectionOrigin("select"),e.keyCode==27&&(h.inputState.lastEscPress=Date.now())};handlers.touchstart=(h,e)=>{h.inputState.lastTouchTime=Date.now(),h.inputState.setSelectionOrigin("select.pointer")};handlers.touchmove=h=>{h.inputState.setSelectionOrigin("select.pointer")};handlerOptions.touchstart=handlerOptions.touchmove={passive:!0};handlers.mousedown=(h,e)=>{if(h.observer.flush(),h.inputState.lastTouchTime>Date.now()-2e3)return;let r=null;for(let s of h.state.facet(mouseSelectionStyle))if(r=s(h,e),r)break;if(!r&&e.button==0&&(r=basicMouseSelection(h,e)),r){let s=!h.hasFocus;h.inputState.startMouseSelection(new MouseSelection(h,e,r,s)),s&&h.observer.ignore(()=>focusPreventScroll(h.contentDOM)),h.inputState.mouseSelection&&h.inputState.mouseSelection.start(e)}};function rangeForClick(h,e,r,s){if(s==1)return EditorSelection.cursor(e,r);if(s==2)return groupAt(h.state,e,r);{let l=LineView.find(h.docView,e),o=h.state.doc.lineAt(l?l.posAtEnd:e),a=l?l.posAtStart:o.from,c=l?l.posAtEnd:o.to;return c<h.state.doc.length&&c==o.to&&c++,EditorSelection.range(a,c)}}let insideY=(h,e)=>h>=e.top&&h<=e.bottom,inside=(h,e,r)=>insideY(e,r)&&h>=r.left&&h<=r.right;function findPositionSide(h,e,r,s){let l=LineView.find(h.docView,e);if(!l)return 1;let o=e-l.posAtStart;if(o==0)return 1;if(o==l.length)return-1;let a=l.coordsAt(o,-1);if(a&&inside(r,s,a))return-1;let c=l.coordsAt(o,1);return c&&inside(r,s,c)?1:a&&insideY(s,a)?-1:1}function queryPos(h,e){let r=h.posAtCoords({x:e.clientX,y:e.clientY},!1);return{pos:r,bias:findPositionSide(h,r,e.clientX,e.clientY)}}const BadMouseDetail=browser.ie&&browser.ie_version<=11;let lastMouseDown=null,lastMouseDownCount=0,lastMouseDownTime=0;function getClickType(h){if(!BadMouseDetail)return h.detail;let e=lastMouseDown,r=lastMouseDownTime;return lastMouseDown=h,lastMouseDownTime=Date.now(),lastMouseDownCount=!e||r>Date.now()-400&&Math.abs(e.clientX-h.clientX)<2&&Math.abs(e.clientY-h.clientY)<2?(lastMouseDownCount+1)%3:1}function basicMouseSelection(h,e){let r=queryPos(h,e),s=getClickType(e),l=h.state.selection;return{update(o){o.docChanged&&(r.pos=o.changes.mapPos(r.pos),l=l.map(o.changes))},get(o,a,c){let M=queryPos(h,o),f,u=rangeForClick(h,M.pos,M.bias,s);if(r.pos!=M.pos&&!a){let g=rangeForClick(h,r.pos,r.bias,s),d=Math.min(g.from,u.from),p=Math.max(g.to,u.to);u=d<u.from?EditorSelection.range(d,p):EditorSelection.range(p,d)}return a?l.replaceRange(l.main.extend(u.from,u.to)):c&&s==1&&l.ranges.length>1&&(f=removeRangeAround(l,M.pos))?f:c?l.addRange(u):EditorSelection.create([u])}}}function removeRangeAround(h,e){for(let r=0;r<h.ranges.length;r++){let{from:s,to:l}=h.ranges[r];if(s<=e&&l>=e)return EditorSelection.create(h.ranges.slice(0,r).concat(h.ranges.slice(r+1)),h.mainIndex==r?0:h.mainIndex-(h.mainIndex>r?1:0))}return null}handlers.dragstart=(h,e)=>{let{selection:{main:r}}=h.state,{mouseSelection:s}=h.inputState;s&&(s.dragging=r),e.dataTransfer&&(e.dataTransfer.setData("Text",h.state.sliceDoc(r.from,r.to)),e.dataTransfer.effectAllowed="copyMove")};function dropText(h,e,r,s){if(!r)return;let l=h.posAtCoords({x:e.clientX,y:e.clientY},!1);e.preventDefault();let{mouseSelection:o}=h.inputState,a=s&&o&&o.dragging&&dragMovesSelection(h,e)?{from:o.dragging.from,to:o.dragging.to}:null,c={from:l,insert:r},M=h.state.changes(a?[a,c]:c);h.focus(),h.dispatch({changes:M,selection:{anchor:M.mapPos(l,-1),head:M.mapPos(l,1)},userEvent:a?"move.drop":"input.drop"})}handlers.drop=(h,e)=>{if(!e.dataTransfer)return;if(h.state.readOnly)return e.preventDefault();let r=e.dataTransfer.files;if(r&&r.length){e.preventDefault();let s=Array(r.length),l=0,o=()=>{++l==r.length&&dropText(h,e,s.filter(a=>a!=null).join(h.state.lineBreak),!1)};for(let a=0;a<r.length;a++){let c=new FileReader;c.onerror=o,c.onload=()=>{/[\x00-\x08\x0e-\x1f]{2}/.test(c.result)||(s[a]=c.result),o()},c.readAsText(r[a])}}else dropText(h,e,e.dataTransfer.getData("Text"),!0)};handlers.paste=(h,e)=>{if(h.state.readOnly)return e.preventDefault();h.observer.flush();let r=brokenClipboardAPI?null:e.clipboardData;r?(doPaste(h,r.getData("text/plain")||r.getData("text/uri-text")),e.preventDefault()):capturePaste(h)};function captureCopy(h,e){let r=h.dom.parentNode;if(!r)return;let s=r.appendChild(document.createElement("textarea"));s.style.cssText="position: fixed; left: -10000px; top: 10px",s.value=e,s.focus(),s.selectionEnd=e.length,s.selectionStart=0,setTimeout(()=>{s.remove(),h.focus()},50)}function copiedRange(h){let e=[],r=[],s=!1;for(let l of h.selection.ranges)l.empty||(e.push(h.sliceDoc(l.from,l.to)),r.push(l));if(!e.length){let l=-1;for(let{from:o}of h.selection.ranges){let a=h.doc.lineAt(o);a.number>l&&(e.push(a.text),r.push({from:a.from,to:Math.min(h.doc.length,a.to+1)})),l=a.number}s=!0}return{text:e.join(h.lineBreak),ranges:r,linewise:s}}let lastLinewiseCopy=null;handlers.copy=handlers.cut=(h,e)=>{let{text:r,ranges:s,linewise:l}=copiedRange(h.state);if(!r&&!l)return;lastLinewiseCopy=l?r:null;let o=brokenClipboardAPI?null:e.clipboardData;o?(e.preventDefault(),o.clearData(),o.setData("text/plain",r)):captureCopy(h,r),e.type=="cut"&&!h.state.readOnly&&h.dispatch({changes:s,scrollIntoView:!0,userEvent:"delete.cut"})};const isFocusChange=Annotation.define();function focusChangeTransaction(h,e){let r=[];for(let s of h.facet(focusChangeEffect)){let l=s(h,e);l&&r.push(l)}return r?h.update({effects:r,annotations:isFocusChange.of(!0)}):null}function updateForFocusChange(h){setTimeout(()=>{let e=h.hasFocus;if(e!=h.inputState.notifiedFocused){let r=focusChangeTransaction(h.state,e);r?h.dispatch(r):h.update([])}},10)}handlers.focus=h=>{h.inputState.lastFocusTime=Date.now(),!h.scrollDOM.scrollTop&&(h.inputState.lastScrollTop||h.inputState.lastScrollLeft)&&(h.scrollDOM.scrollTop=h.inputState.lastScrollTop,h.scrollDOM.scrollLeft=h.inputState.lastScrollLeft),updateForFocusChange(h)};handlers.blur=h=>{h.observer.clearSelectionRange(),updateForFocusChange(h)};handlers.compositionstart=handlers.compositionupdate=h=>{h.inputState.compositionFirstChange==null&&(h.inputState.compositionFirstChange=!0),h.inputState.composing<0&&(h.inputState.composing=0)};handlers.compositionend=h=>{h.inputState.composing=-1,h.inputState.compositionEndedAt=Date.now(),h.inputState.compositionPendingKey=!0,h.inputState.compositionPendingChange=h.observer.pendingRecords().length>0,h.inputState.compositionFirstChange=null,browser.chrome&&browser.android?h.observer.flushSoon():h.inputState.compositionPendingChange?Promise.resolve().then(()=>h.observer.flush()):setTimeout(()=>{h.inputState.composing<0&&h.docView.hasComposition&&h.update([])},50)};handlers.contextmenu=h=>{h.inputState.lastContextMenu=Date.now()};handlers.beforeinput=(h,e)=>{var r;let s;if(browser.chrome&&browser.android&&(s=PendingKeys.find(l=>l.inputType==e.inputType))&&(h.observer.delayAndroidKey(s.key,s.keyCode),s.key=="Backspace"||s.key=="Delete")){let l=((r=window.visualViewport)===null||r===void 0?void 0:r.height)||0;setTimeout(()=>{var o;(((o=window.visualViewport)===null||o===void 0?void 0:o.height)||0)>l+10&&h.hasFocus&&(h.contentDOM.blur(),h.focus())},100)}};const appliedFirefoxHack=new Set;function firefoxCopyCutHack(h){appliedFirefoxHack.has(h)||(appliedFirefoxHack.add(h),h.addEventListener("copy",()=>{}),h.addEventListener("cut",()=>{}))}const wrappingWhiteSpace=["pre-wrap","normal","pre-line","break-spaces"];class HeightOracle{constructor(e){this.lineWrapping=e,this.doc=Text.empty,this.heightSamples={},this.lineHeight=14,this.charWidth=7,this.textHeight=14,this.lineLength=30,this.heightChanged=!1}heightForGap(e,r){let s=this.doc.lineAt(r).number-this.doc.lineAt(e).number+1;return this.lineWrapping&&(s+=Math.max(0,Math.ceil((r-e-s*this.lineLength*.5)/this.lineLength))),this.lineHeight*s}heightForLine(e){return this.lineWrapping?(1+Math.max(0,Math.ceil((e-this.lineLength)/(this.lineLength-5))))*this.lineHeight:this.lineHeight}setDoc(e){return this.doc=e,this}mustRefreshForWrapping(e){return wrappingWhiteSpace.indexOf(e)>-1!=this.lineWrapping}mustRefreshForHeights(e){let r=!1;for(let s=0;s<e.length;s++){let l=e[s];l<0?s++:this.heightSamples[Math.floor(l*10)]||(r=!0,this.heightSamples[Math.floor(l*10)]=!0)}return r}refresh(e,r,s,l,o,a){let c=wrappingWhiteSpace.indexOf(e)>-1,M=Math.round(r)!=Math.round(this.lineHeight)||this.lineWrapping!=c;if(this.lineWrapping=c,this.lineHeight=r,this.charWidth=s,this.textHeight=l,this.lineLength=o,M){this.heightSamples={};for(let f=0;f<a.length;f++){let u=a[f];u<0?f++:this.heightSamples[Math.floor(u*10)]=!0}}return M}}class MeasuredHeights{constructor(e,r){this.from=e,this.heights=r,this.index=0}get more(){return this.index<this.heights.length}}class BlockInfo{constructor(e,r,s,l,o){this.from=e,this.length=r,this.top=s,this.height=l,this._content=o}get type(){return typeof this._content=="number"?BlockType.Text:Array.isArray(this._content)?this._content:this._content.type}get to(){return this.from+this.length}get bottom(){return this.top+this.height}get widget(){return this._content instanceof PointDecoration?this._content.widget:null}get widgetLineBreaks(){return typeof this._content=="number"?this._content:0}join(e){let r=(Array.isArray(this._content)?this._content:[this]).concat(Array.isArray(e._content)?e._content:[e]);return new BlockInfo(this.from,this.length+e.length,this.top,this.height+e.height,r)}}var QueryType$1=function(h){return h[h.ByPos=0]="ByPos",h[h.ByHeight=1]="ByHeight",h[h.ByPosNoHeight=2]="ByPosNoHeight",h}(QueryType$1||(QueryType$1={}));const Epsilon=.001;class HeightMap{constructor(e,r,s=2){this.length=e,this.height=r,this.flags=s}get outdated(){return(this.flags&2)>0}set outdated(e){this.flags=(e?2:0)|this.flags&-3}setHeight(e,r){this.height!=r&&(Math.abs(this.height-r)>Epsilon&&(e.heightChanged=!0),this.height=r)}replace(e,r,s){return HeightMap.of(s)}decomposeLeft(e,r){r.push(this)}decomposeRight(e,r){r.push(this)}applyChanges(e,r,s,l){let o=this,a=s.doc;for(let c=l.length-1;c>=0;c--){let{fromA:M,toA:f,fromB:u,toB:g}=l[c],d=o.lineAt(M,QueryType$1.ByPosNoHeight,s.setDoc(r),0,0),p=d.to>=f?d:o.lineAt(f,QueryType$1.ByPosNoHeight,s,0,0);for(g+=p.to-f,f=p.to;c>0&&d.from<=l[c-1].toA;)M=l[c-1].fromA,u=l[c-1].fromB,c--,M<d.from&&(d=o.lineAt(M,QueryType$1.ByPosNoHeight,s,0,0));u+=d.from-M,M=d.from;let m=NodeBuilder.build(s.setDoc(a),e,u,g);o=o.replace(M,f,m)}return o.updateHeight(s,0)}static empty(){return new HeightMapText(0,0)}static of(e){if(e.length==1)return e[0];let r=0,s=e.length,l=0,o=0;for(;;)if(r==s)if(l>o*2){let c=e[r-1];c.break?e.splice(--r,1,c.left,null,c.right):e.splice(--r,1,c.left,c.right),s+=1+c.break,l-=c.size}else if(o>l*2){let c=e[s];c.break?e.splice(s,1,c.left,null,c.right):e.splice(s,1,c.left,c.right),s+=2+c.break,o-=c.size}else break;else if(l<o){let c=e[r++];c&&(l+=c.size)}else{let c=e[--s];c&&(o+=c.size)}let a=0;return e[r-1]==null?(a=1,r--):e[r]==null&&(a=1,s++),new HeightMapBranch(HeightMap.of(e.slice(0,r)),a,HeightMap.of(e.slice(s)))}}HeightMap.prototype.size=1;class HeightMapBlock extends HeightMap{constructor(e,r,s){super(e,r),this.deco=s}blockAt(e,r,s,l){return new BlockInfo(l,this.length,s,this.height,this.deco||0)}lineAt(e,r,s,l,o){return this.blockAt(0,s,l,o)}forEachLine(e,r,s,l,o,a){e<=o+this.length&&r>=o&&a(this.blockAt(0,s,l,o))}updateHeight(e,r=0,s=!1,l){return l&&l.from<=r&&l.more&&this.setHeight(e,l.heights[l.index++]),this.outdated=!1,this}toString(){return`block(${this.length})`}}class HeightMapText extends HeightMapBlock{constructor(e,r){super(e,r,null),this.collapsed=0,this.widgetHeight=0,this.breaks=0}blockAt(e,r,s,l){return new BlockInfo(l,this.length,s,this.height,this.breaks)}replace(e,r,s){let l=s[0];return s.length==1&&(l instanceof HeightMapText||l instanceof HeightMapGap&&l.flags&4)&&Math.abs(this.length-l.length)<10?(l instanceof HeightMapGap?l=new HeightMapText(l.length,this.height):l.height=this.height,this.outdated||(l.outdated=!1),l):HeightMap.of(s)}updateHeight(e,r=0,s=!1,l){return l&&l.from<=r&&l.more?this.setHeight(e,l.heights[l.index++]):(s||this.outdated)&&this.setHeight(e,Math.max(this.widgetHeight,e.heightForLine(this.length-this.collapsed))+this.breaks*e.lineHeight),this.outdated=!1,this}toString(){return`line(${this.length}${this.collapsed?-this.collapsed:""}${this.widgetHeight?":"+this.widgetHeight:""})`}}class HeightMapGap extends HeightMap{constructor(e){super(e,0)}heightMetrics(e,r){let s=e.doc.lineAt(r).number,l=e.doc.lineAt(r+this.length).number,o=l-s+1,a,c=0;if(e.lineWrapping){let M=Math.min(this.height,e.lineHeight*o);a=M/o,this.length>o+1&&(c=(this.height-M)/(this.length-o-1))}else a=this.height/o;return{firstLine:s,lastLine:l,perLine:a,perChar:c}}blockAt(e,r,s,l){let{firstLine:o,lastLine:a,perLine:c,perChar:M}=this.heightMetrics(r,l);if(r.lineWrapping){let f=l+Math.round(Math.max(0,Math.min(1,(e-s)/this.height))*this.length),u=r.doc.lineAt(f),g=c+u.length*M,d=Math.max(s,e-g/2);return new BlockInfo(u.from,u.length,d,g,0)}else{let f=Math.max(0,Math.min(a-o,Math.floor((e-s)/c))),{from:u,length:g}=r.doc.line(o+f);return new BlockInfo(u,g,s+c*f,c,0)}}lineAt(e,r,s,l,o){if(r==QueryType$1.ByHeight)return this.blockAt(e,s,l,o);if(r==QueryType$1.ByPosNoHeight){let{from:p,to:m}=s.doc.lineAt(e);return new BlockInfo(p,m-p,0,0,0)}let{firstLine:a,perLine:c,perChar:M}=this.heightMetrics(s,o),f=s.doc.lineAt(e),u=c+f.length*M,g=f.number-a,d=l+c*g+M*(f.from-o-g);return new BlockInfo(f.from,f.length,Math.max(l,Math.min(d,l+this.height-u)),u,0)}forEachLine(e,r,s,l,o,a){e=Math.max(e,o),r=Math.min(r,o+this.length);let{firstLine:c,perLine:M,perChar:f}=this.heightMetrics(s,o);for(let u=e,g=l;u<=r;){let d=s.doc.lineAt(u);if(u==e){let m=d.number-c;g+=M*m+f*(e-o-m)}let p=M+f*d.length;a(new BlockInfo(d.from,d.length,g,p,0)),g+=p,u=d.to+1}}replace(e,r,s){let l=this.length-r;if(l>0){let o=s[s.length-1];o instanceof HeightMapGap?s[s.length-1]=new HeightMapGap(o.length+l):s.push(null,new HeightMapGap(l-1))}if(e>0){let o=s[0];o instanceof HeightMapGap?s[0]=new HeightMapGap(e+o.length):s.unshift(new HeightMapGap(e-1),null)}return HeightMap.of(s)}decomposeLeft(e,r){r.push(new HeightMapGap(e-1),null)}decomposeRight(e,r){r.push(null,new HeightMapGap(this.length-e-1))}updateHeight(e,r=0,s=!1,l){let o=r+this.length;if(l&&l.from<=r+this.length&&l.more){let a=[],c=Math.max(r,l.from),M=-1;for(l.from>r&&a.push(new HeightMapGap(l.from-r-1).updateHeight(e,r));c<=o&&l.more;){let u=e.doc.lineAt(c).length;a.length&&a.push(null);let g=l.heights[l.index++];M==-1?M=g:Math.abs(g-M)>=Epsilon&&(M=-2);let d=new HeightMapText(u,g);d.outdated=!1,a.push(d),c+=u+1}c<=o&&a.push(null,new HeightMapGap(o-c).updateHeight(e,c));let f=HeightMap.of(a);return(M<0||Math.abs(f.height-this.height)>=Epsilon||Math.abs(M-this.heightMetrics(e,r).perLine)>=Epsilon)&&(e.heightChanged=!0),f}else(s||this.outdated)&&(this.setHeight(e,e.heightForGap(r,r+this.length)),this.outdated=!1);return this}toString(){return`gap(${this.length})`}}class HeightMapBranch extends HeightMap{constructor(e,r,s){super(e.length+r+s.length,e.height+s.height,r|(e.outdated||s.outdated?2:0)),this.left=e,this.right=s,this.size=e.size+s.size}get break(){return this.flags&1}blockAt(e,r,s,l){let o=s+this.left.height;return e<o?this.left.blockAt(e,r,s,l):this.right.blockAt(e,r,o,l+this.left.length+this.break)}lineAt(e,r,s,l,o){let a=l+this.left.height,c=o+this.left.length+this.break,M=r==QueryType$1.ByHeight?e<a:e<c,f=M?this.left.lineAt(e,r,s,l,o):this.right.lineAt(e,r,s,a,c);if(this.break||(M?f.to<c:f.from>c))return f;let u=r==QueryType$1.ByPosNoHeight?QueryType$1.ByPosNoHeight:QueryType$1.ByPos;return M?f.join(this.right.lineAt(c,u,s,a,c)):this.left.lineAt(c,u,s,l,o).join(f)}forEachLine(e,r,s,l,o,a){let c=l+this.left.height,M=o+this.left.length+this.break;if(this.break)e<M&&this.left.forEachLine(e,r,s,l,o,a),r>=M&&this.right.forEachLine(e,r,s,c,M,a);else{let f=this.lineAt(M,QueryType$1.ByPos,s,l,o);e<f.from&&this.left.forEachLine(e,f.from-1,s,l,o,a),f.to>=e&&f.from<=r&&a(f),r>f.to&&this.right.forEachLine(f.to+1,r,s,c,M,a)}}replace(e,r,s){let l=this.left.length+this.break;if(r<l)return this.balanced(this.left.replace(e,r,s),this.right);if(e>this.left.length)return this.balanced(this.left,this.right.replace(e-l,r-l,s));let o=[];e>0&&this.decomposeLeft(e,o);let a=o.length;for(let c of s)o.push(c);if(e>0&&mergeGaps(o,a-1),r<this.length){let c=o.length;this.decomposeRight(r,o),mergeGaps(o,c)}return HeightMap.of(o)}decomposeLeft(e,r){let s=this.left.length;if(e<=s)return this.left.decomposeLeft(e,r);r.push(this.left),this.break&&(s++,e>=s&&r.push(null)),e>s&&this.right.decomposeLeft(e-s,r)}decomposeRight(e,r){let s=this.left.length,l=s+this.break;if(e>=l)return this.right.decomposeRight(e-l,r);e<s&&this.left.decomposeRight(e,r),this.break&&e<l&&r.push(null),r.push(this.right)}balanced(e,r){return e.size>2*r.size||r.size>2*e.size?HeightMap.of(this.break?[e,null,r]:[e,r]):(this.left=e,this.right=r,this.height=e.height+r.height,this.outdated=e.outdated||r.outdated,this.size=e.size+r.size,this.length=e.length+this.break+r.length,this)}updateHeight(e,r=0,s=!1,l){let{left:o,right:a}=this,c=r+o.length+this.break,M=null;return l&&l.from<=r+o.length&&l.more?M=o=o.updateHeight(e,r,s,l):o.updateHeight(e,r,s),l&&l.from<=c+a.length&&l.more?M=a=a.updateHeight(e,c,s,l):a.updateHeight(e,c,s),M?this.balanced(o,a):(this.height=this.left.height+this.right.height,this.outdated=!1,this)}toString(){return this.left+(this.break?" ":"-")+this.right}}function mergeGaps(h,e){let r,s;h[e]==null&&(r=h[e-1])instanceof HeightMapGap&&(s=h[e+1])instanceof HeightMapGap&&h.splice(e-1,3,new HeightMapGap(r.length+1+s.length))}const relevantWidgetHeight=5;class NodeBuilder{constructor(e,r){this.pos=e,this.oracle=r,this.nodes=[],this.lineStart=-1,this.lineEnd=-1,this.covering=null,this.writtenTo=e}get isCovered(){return this.covering&&this.nodes[this.nodes.length-1]==this.covering}span(e,r){if(this.lineStart>-1){let s=Math.min(r,this.lineEnd),l=this.nodes[this.nodes.length-1];l instanceof HeightMapText?l.length+=s-this.pos:(s>this.pos||!this.isCovered)&&this.nodes.push(new HeightMapText(s-this.pos,-1)),this.writtenTo=s,r>s&&(this.nodes.push(null),this.writtenTo++,this.lineStart=-1)}this.pos=r}point(e,r,s){if(e<r||s.heightRelevant){let l=s.widget?s.widget.estimatedHeight:0,o=s.widget?s.widget.lineBreaks:0;l<0&&(l=this.oracle.lineHeight);let a=r-e;s.block?this.addBlock(new HeightMapBlock(a,l,s)):(a||o||l>=relevantWidgetHeight)&&this.addLineDeco(l,o,a)}else r>e&&this.span(e,r);this.lineEnd>-1&&this.lineEnd<this.pos&&(this.lineEnd=this.oracle.doc.lineAt(this.pos).to)}enterLine(){if(this.lineStart>-1)return;let{from:e,to:r}=this.oracle.doc.lineAt(this.pos);this.lineStart=e,this.lineEnd=r,this.writtenTo<e&&((this.writtenTo<e-1||this.nodes[this.nodes.length-1]==null)&&this.nodes.push(this.blankContent(this.writtenTo,e-1)),this.nodes.push(null)),this.pos>e&&this.nodes.push(new HeightMapText(this.pos-e,-1)),this.writtenTo=this.pos}blankContent(e,r){let s=new HeightMapGap(r-e);return this.oracle.doc.lineAt(e).to==r&&(s.flags|=4),s}ensureLine(){this.enterLine();let e=this.nodes.length?this.nodes[this.nodes.length-1]:null;if(e instanceof HeightMapText)return e;let r=new HeightMapText(0,-1);return this.nodes.push(r),r}addBlock(e){var r;this.enterLine();let s=(r=e.deco)===null||r===void 0?void 0:r.type;s==BlockType.WidgetAfter&&!this.isCovered&&this.ensureLine(),this.nodes.push(e),this.writtenTo=this.pos=this.pos+e.length,s!=BlockType.WidgetBefore&&(this.covering=e)}addLineDeco(e,r,s){let l=this.ensureLine();l.length+=s,l.collapsed+=s,l.widgetHeight=Math.max(l.widgetHeight,e),l.breaks+=r,this.writtenTo=this.pos=this.pos+s}finish(e){let r=this.nodes.length==0?null:this.nodes[this.nodes.length-1];this.lineStart>-1&&!(r instanceof HeightMapText)&&!this.isCovered?this.nodes.push(new HeightMapText(0,-1)):(this.writtenTo<this.pos||r==null)&&this.nodes.push(this.blankContent(this.writtenTo,this.pos));let s=e;for(let l of this.nodes)l instanceof HeightMapText&&l.updateHeight(this.oracle,s),s+=l?l.length:1;return this.nodes}static build(e,r,s,l){let o=new NodeBuilder(s,e);return RangeSet.spans(r,s,l,o,0),o.finish(s)}}function heightRelevantDecoChanges(h,e,r){let s=new DecorationComparator;return RangeSet.compare(h,e,r,s,0),s.changes}class DecorationComparator{constructor(){this.changes=[]}compareRange(){}comparePoint(e,r,s,l){(e<r||s&&s.heightRelevant||l&&l.heightRelevant)&&addRange(e,r,this.changes,5)}}function visiblePixelRange(h,e){let r=h.getBoundingClientRect(),s=h.ownerDocument,l=s.defaultView||window,o=Math.max(0,r.left),a=Math.min(l.innerWidth,r.right),c=Math.max(0,r.top),M=Math.min(l.innerHeight,r.bottom);for(let f=h.parentNode;f&&f!=s.body;)if(f.nodeType==1){let u=f,g=window.getComputedStyle(u);if((u.scrollHeight>u.clientHeight||u.scrollWidth>u.clientWidth)&&g.overflow!="visible"){let d=u.getBoundingClientRect();o=Math.max(o,d.left),a=Math.min(a,d.right),c=Math.max(c,d.top),M=f==h.parentNode?d.bottom:Math.min(M,d.bottom)}f=g.position=="absolute"||g.position=="fixed"?u.offsetParent:u.parentNode}else if(f.nodeType==11)f=f.host;else break;return{left:o-r.left,right:Math.max(o,a)-r.left,top:c-(r.top+e),bottom:Math.max(c,M)-(r.top+e)}}function fullPixelRange(h,e){let r=h.getBoundingClientRect();return{left:0,right:r.right-r.left,top:e,bottom:r.bottom-(r.top+e)}}class LineGap{constructor(e,r,s){this.from=e,this.to=r,this.size=s}static same(e,r){if(e.length!=r.length)return!1;for(let s=0;s<e.length;s++){let l=e[s],o=r[s];if(l.from!=o.from||l.to!=o.to||l.size!=o.size)return!1}return!0}draw(e,r){return Decoration.replace({widget:new LineGapWidget(this.size*(r?e.scaleY:e.scaleX),r)}).range(this.from,this.to)}}class LineGapWidget extends WidgetType{constructor(e,r){super(),this.size=e,this.vertical=r}eq(e){return e.size==this.size&&e.vertical==this.vertical}toDOM(){let e=document.createElement("div");return this.vertical?e.style.height=this.size+"px":(e.style.width=this.size+"px",e.style.height="2px",e.style.display="inline-block"),e}get estimatedHeight(){return this.vertical?this.size:-1}}class ViewState{constructor(e){this.state=e,this.pixelViewport={left:0,right:window.innerWidth,top:0,bottom:0},this.inView=!0,this.paddingTop=0,this.paddingBottom=0,this.contentDOMWidth=0,this.contentDOMHeight=0,this.editorHeight=0,this.editorWidth=0,this.scrollTop=0,this.scrolledToBottom=!0,this.scaleX=1,this.scaleY=1,this.scrollAnchorPos=0,this.scrollAnchorHeight=-1,this.scaler=IdScaler,this.scrollTarget=null,this.printing=!1,this.mustMeasureContent=!0,this.defaultTextDirection=Direction.LTR,this.visibleRanges=[],this.mustEnforceCursorAssoc=!1;let r=e.facet(contentAttributes).some(s=>typeof s!="function"&&s.class=="cm-lineWrapping");this.heightOracle=new HeightOracle(r),this.stateDeco=e.facet(decorations).filter(s=>typeof s!="function"),this.heightMap=HeightMap.empty().applyChanges(this.stateDeco,Text.empty,this.heightOracle.setDoc(e.doc),[new ChangedRange(0,0,0,e.doc.length)]),this.viewport=this.getViewport(0,null),this.updateViewportLines(),this.updateForViewport(),this.lineGaps=this.ensureLineGaps([]),this.lineGapDeco=Decoration.set(this.lineGaps.map(s=>s.draw(this,!1))),this.computeVisibleRanges()}updateForViewport(){let e=[this.viewport],{main:r}=this.state.selection;for(let s=0;s<=1;s++){let l=s?r.head:r.anchor;if(!e.some(({from:o,to:a})=>l>=o&&l<=a)){let{from:o,to:a}=this.lineBlockAt(l);e.push(new Viewport(o,a))}}this.viewports=e.sort((s,l)=>s.from-l.from),this.scaler=this.heightMap.height<=7e6?IdScaler:new BigScaler(this.heightOracle,this.heightMap,this.viewports)}updateViewportLines(){this.viewportLines=[],this.heightMap.forEachLine(this.viewport.from,this.viewport.to,this.heightOracle.setDoc(this.state.doc),0,0,e=>{this.viewportLines.push(this.scaler.scale==1?e:scaleBlock(e,this.scaler))})}update(e,r=null){this.state=e.state;let s=this.stateDeco;this.stateDeco=this.state.facet(decorations).filter(u=>typeof u!="function");let l=e.changedRanges,o=ChangedRange.extendWithRanges(l,heightRelevantDecoChanges(s,this.stateDeco,e?e.changes:ChangeSet.empty(this.state.doc.length))),a=this.heightMap.height,c=this.scrolledToBottom?null:this.scrollAnchorAt(this.scrollTop);this.heightMap=this.heightMap.applyChanges(this.stateDeco,e.startState.doc,this.heightOracle.setDoc(this.state.doc),o),this.heightMap.height!=a&&(e.flags|=2),c?(this.scrollAnchorPos=e.changes.mapPos(c.from,-1),this.scrollAnchorHeight=c.top):(this.scrollAnchorPos=-1,this.scrollAnchorHeight=this.heightMap.height);let M=o.length?this.mapViewport(this.viewport,e.changes):this.viewport;(r&&(r.range.head<M.from||r.range.head>M.to)||!this.viewportIsAppropriate(M))&&(M=this.getViewport(0,r));let f=!e.changes.empty||e.flags&2||M.from!=this.viewport.from||M.to!=this.viewport.to;this.viewport=M,this.updateForViewport(),f&&this.updateViewportLines(),(this.lineGaps.length||this.viewport.to-this.viewport.from>4e3)&&this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps,e.changes))),e.flags|=this.computeVisibleRanges(),r&&(this.scrollTarget=r),!this.mustEnforceCursorAssoc&&e.selectionSet&&e.view.lineWrapping&&e.state.selection.main.empty&&e.state.selection.main.assoc&&!e.state.facet(nativeSelectionHidden)&&(this.mustEnforceCursorAssoc=!0)}measure(e){let r=e.contentDOM,s=window.getComputedStyle(r),l=this.heightOracle,o=s.whiteSpace;this.defaultTextDirection=s.direction=="rtl"?Direction.RTL:Direction.LTR;let a=this.heightOracle.mustRefreshForWrapping(o),c=r.getBoundingClientRect(),M=a||this.mustMeasureContent||this.contentDOMHeight!=c.height;this.contentDOMHeight=c.height,this.mustMeasureContent=!1;let f=0,u=0;if(c.width&&c.height){let v=c.width/r.offsetWidth,S=c.height/r.offsetHeight;v>.995&&v<1.005&&(v=1),S>.995&&S<1.005&&(S=1),(this.scaleX!=v||this.scaleY!=S)&&(this.scaleX=v,this.scaleY=S,f|=8,a=M=!0)}let g=(parseInt(s.paddingTop)||0)*this.scaleY,d=(parseInt(s.paddingBottom)||0)*this.scaleY;(this.paddingTop!=g||this.paddingBottom!=d)&&(this.paddingTop=g,this.paddingBottom=d,f|=10),this.editorWidth!=e.scrollDOM.clientWidth&&(l.lineWrapping&&(M=!0),this.editorWidth=e.scrollDOM.clientWidth,f|=8);let p=e.scrollDOM.scrollTop*this.scaleY;this.scrollTop!=p&&(this.scrollAnchorHeight=-1,this.scrollTop=p),this.scrolledToBottom=isScrolledToBottom(e.scrollDOM);let m=(this.printing?fullPixelRange:visiblePixelRange)(r,this.paddingTop),w=m.top-this.pixelViewport.top,y=m.bottom-this.pixelViewport.bottom;this.pixelViewport=m;let b=this.pixelViewport.bottom>this.pixelViewport.top&&this.pixelViewport.right>this.pixelViewport.left;if(b!=this.inView&&(this.inView=b,b&&(M=!0)),!this.inView&&!this.scrollTarget)return 0;let O=c.width;if((this.contentDOMWidth!=O||this.editorHeight!=e.scrollDOM.clientHeight)&&(this.contentDOMWidth=c.width,this.editorHeight=e.scrollDOM.clientHeight,f|=8),M){let v=e.docView.measureVisibleLineHeights(this.viewport);if(l.mustRefreshForHeights(v)&&(a=!0),a||l.lineWrapping&&Math.abs(O-this.contentDOMWidth)>l.charWidth){let{lineHeight:S,charWidth:k,textHeight:T}=e.docView.measureTextSize();a=S>0&&l.refresh(o,S,k,T,O/k,v),a&&(e.docView.minWidth=0,f|=8)}w>0&&y>0?u=Math.max(w,y):w<0&&y<0&&(u=Math.min(w,y)),l.heightChanged=!1;for(let S of this.viewports){let k=S.from==this.viewport.from?v:e.docView.measureVisibleLineHeights(S);this.heightMap=(a?HeightMap.empty().applyChanges(this.stateDeco,Text.empty,this.heightOracle,[new ChangedRange(0,0,0,e.state.doc.length)]):this.heightMap).updateHeight(l,0,a,new MeasuredHeights(S.from,k))}l.heightChanged&&(f|=2)}let P=!this.viewportIsAppropriate(this.viewport,u)||this.scrollTarget&&(this.scrollTarget.range.head<this.viewport.from||this.scrollTarget.range.head>this.viewport.to);return P&&(this.viewport=this.getViewport(u,this.scrollTarget)),this.updateForViewport(),(f&2||P)&&this.updateViewportLines(),(this.lineGaps.length||this.viewport.to-this.viewport.from>4e3)&&this.updateLineGaps(this.ensureLineGaps(a?[]:this.lineGaps,e)),f|=this.computeVisibleRanges(),this.mustEnforceCursorAssoc&&(this.mustEnforceCursorAssoc=!1,e.docView.enforceCursorAssoc()),f}get visibleTop(){return this.scaler.fromDOM(this.pixelViewport.top)}get visibleBottom(){return this.scaler.fromDOM(this.pixelViewport.bottom)}getViewport(e,r){let s=.5-Math.max(-.5,Math.min(.5,e/1e3/2)),l=this.heightMap,o=this.heightOracle,{visibleTop:a,visibleBottom:c}=this,M=new Viewport(l.lineAt(a-s*1e3,QueryType$1.ByHeight,o,0,0).from,l.lineAt(c+(1-s)*1e3,QueryType$1.ByHeight,o,0,0).to);if(r){let{head:f}=r.range;if(f<M.from||f>M.to){let u=Math.min(this.editorHeight,this.pixelViewport.bottom-this.pixelViewport.top),g=l.lineAt(f,QueryType$1.ByPos,o,0,0),d;r.y=="center"?d=(g.top+g.bottom)/2-u/2:r.y=="start"||r.y=="nearest"&&f<M.from?d=g.top:d=g.bottom-u,M=new Viewport(l.lineAt(d-1e3/2,QueryType$1.ByHeight,o,0,0).from,l.lineAt(d+u+1e3/2,QueryType$1.ByHeight,o,0,0).to)}}return M}mapViewport(e,r){let s=r.mapPos(e.from,-1),l=r.mapPos(e.to,1);return new Viewport(this.heightMap.lineAt(s,QueryType$1.ByPos,this.heightOracle,0,0).from,this.heightMap.lineAt(l,QueryType$1.ByPos,this.heightOracle,0,0).to)}viewportIsAppropriate({from:e,to:r},s=0){if(!this.inView)return!0;let{top:l}=this.heightMap.lineAt(e,QueryType$1.ByPos,this.heightOracle,0,0),{bottom:o}=this.heightMap.lineAt(r,QueryType$1.ByPos,this.heightOracle,0,0),{visibleTop:a,visibleBottom:c}=this;return(e==0||l<=a-Math.max(10,Math.min(-s,250)))&&(r==this.state.doc.length||o>=c+Math.max(10,Math.min(s,250)))&&l>a-2*1e3&&o<c+2*1e3}mapLineGaps(e,r){if(!e.length||r.empty)return e;let s=[];for(let l of e)r.touchesRange(l.from,l.to)||s.push(new LineGap(r.mapPos(l.from),r.mapPos(l.to),l.size));return s}ensureLineGaps(e,r){let s=this.heightOracle.lineWrapping,l=s?1e4:2e3,o=l>>1,a=l<<1;if(this.defaultTextDirection!=Direction.LTR&&!s)return[];let c=[],M=(f,u,g,d)=>{if(u-f<o)return;let p=this.state.selection.main,m=[p.from];p.empty||m.push(p.to);for(let y of m)if(y>f&&y<u){M(f,y-10,g,d),M(y+10,u,g,d);return}let w=find(e,y=>y.from>=g.from&&y.to<=g.to&&Math.abs(y.from-f)<o&&Math.abs(y.to-u)<o&&!m.some(b=>y.from<b&&y.to>b));if(!w){if(u<g.to&&r&&s&&r.visibleRanges.some(y=>y.from<=u&&y.to>=u)){let y=r.moveToLineBoundary(EditorSelection.cursor(u),!1,!0).head;y>f&&(u=y)}w=new LineGap(f,u,this.gapSize(g,f,u,d))}c.push(w)};for(let f of this.viewportLines){if(f.length<a)continue;let u=lineStructure(f.from,f.to,this.stateDeco);if(u.total<a)continue;let g=this.scrollTarget?this.scrollTarget.range.head:null,d,p;if(s){let m=l/this.heightOracle.lineLength*this.heightOracle.lineHeight,w,y;if(g!=null){let b=findFraction(u,g),O=((this.visibleBottom-this.visibleTop)/2+m)/f.height;w=b-O,y=b+O}else w=(this.visibleTop-f.top-m)/f.height,y=(this.visibleBottom-f.top+m)/f.height;d=findPosition(u,w),p=findPosition(u,y)}else{let m=u.total*this.heightOracle.charWidth,w=l*this.heightOracle.charWidth,y,b;if(g!=null){let O=findFraction(u,g),P=((this.pixelViewport.right-this.pixelViewport.left)/2+w)/m;y=O-P,b=O+P}else y=(this.pixelViewport.left-w)/m,b=(this.pixelViewport.right+w)/m;d=findPosition(u,y),p=findPosition(u,b)}d>f.from&&M(f.from,d,f,u),p<f.to&&M(p,f.to,f,u)}return c}gapSize(e,r,s,l){let o=findFraction(l,s)-findFraction(l,r);return this.heightOracle.lineWrapping?e.height*o:l.total*this.heightOracle.charWidth*o}updateLineGaps(e){LineGap.same(e,this.lineGaps)||(this.lineGaps=e,this.lineGapDeco=Decoration.set(e.map(r=>r.draw(this,this.heightOracle.lineWrapping))))}computeVisibleRanges(){let e=this.stateDeco;this.lineGaps.length&&(e=e.concat(this.lineGapDeco));let r=[];RangeSet.spans(e,this.viewport.from,this.viewport.to,{span(l,o){r.push({from:l,to:o})},point(){}},20);let s=r.length!=this.visibleRanges.length||this.visibleRanges.some((l,o)=>l.from!=r[o].from||l.to!=r[o].to);return this.visibleRanges=r,s?4:0}lineBlockAt(e){return e>=this.viewport.from&&e<=this.viewport.to&&this.viewportLines.find(r=>r.from<=e&&r.to>=e)||scaleBlock(this.heightMap.lineAt(e,QueryType$1.ByPos,this.heightOracle,0,0),this.scaler)}lineBlockAtHeight(e){return scaleBlock(this.heightMap.lineAt(this.scaler.fromDOM(e),QueryType$1.ByHeight,this.heightOracle,0,0),this.scaler)}scrollAnchorAt(e){let r=this.lineBlockAtHeight(e+8);return r.from>=this.viewport.from||this.viewportLines[0].top-e>200?r:this.viewportLines[0]}elementAtHeight(e){return scaleBlock(this.heightMap.blockAt(this.scaler.fromDOM(e),this.heightOracle,0,0),this.scaler)}get docHeight(){return this.scaler.toDOM(this.heightMap.height)}get contentHeight(){return this.docHeight+this.paddingTop+this.paddingBottom}}class Viewport{constructor(e,r){this.from=e,this.to=r}}function lineStructure(h,e,r){let s=[],l=h,o=0;return RangeSet.spans(r,h,e,{span(){},point(a,c){a>l&&(s.push({from:l,to:a}),o+=a-l),l=c}},20),l<e&&(s.push({from:l,to:e}),o+=e-l),{total:o,ranges:s}}function findPosition({total:h,ranges:e},r){if(r<=0)return e[0].from;if(r>=1)return e[e.length-1].to;let s=Math.floor(h*r);for(let l=0;;l++){let{from:o,to:a}=e[l],c=a-o;if(s<=c)return o+s;s-=c}}function findFraction(h,e){let r=0;for(let{from:s,to:l}of h.ranges){if(e<=l){r+=e-s;break}r+=l-s}return r/h.total}function find(h,e){for(let r of h)if(e(r))return r}const IdScaler={toDOM(h){return h},fromDOM(h){return h},scale:1};class BigScaler{constructor(e,r,s){let l=0,o=0,a=0;this.viewports=s.map(({from:c,to:M})=>{let f=r.lineAt(c,QueryType$1.ByPos,e,0,0).top,u=r.lineAt(M,QueryType$1.ByPos,e,0,0).bottom;return l+=u-f,{from:c,to:M,top:f,bottom:u,domTop:0,domBottom:0}}),this.scale=(7e6-l)/(r.height-l);for(let c of this.viewports)c.domTop=a+(c.top-o)*this.scale,a=c.domBottom=c.domTop+(c.bottom-c.top),o=c.bottom}toDOM(e){for(let r=0,s=0,l=0;;r++){let o=r<this.viewports.length?this.viewports[r]:null;if(!o||e<o.top)return l+(e-s)*this.scale;if(e<=o.bottom)return o.domTop+(e-o.top);s=o.bottom,l=o.domBottom}}fromDOM(e){for(let r=0,s=0,l=0;;r++){let o=r<this.viewports.length?this.viewports[r]:null;if(!o||e<o.domTop)return s+(e-l)/this.scale;if(e<=o.domBottom)return o.top+(e-o.domTop);s=o.bottom,l=o.domBottom}}}function scaleBlock(h,e){if(e.scale==1)return h;let r=e.toDOM(h.top),s=e.toDOM(h.bottom);return new BlockInfo(h.from,h.length,r,s-r,Array.isArray(h._content)?h._content.map(l=>scaleBlock(l,e)):h._content)}const theme=Facet.define({combine:h=>h.join(" ")}),darkTheme=Facet.define({combine:h=>h.indexOf(!0)>-1}),baseThemeID=StyleModule.newName(),baseLightID=StyleModule.newName(),baseDarkID=StyleModule.newName(),lightDarkIDs={"&light":"."+baseLightID,"&dark":"."+baseDarkID};function buildTheme(h,e,r){return new StyleModule(e,{finish(s){return/&/.test(s)?s.replace(/&\w*/,l=>{if(l=="&")return h;if(!r||!r[l])throw new RangeError(`Unsupported selector: ${l}`);return r[l]}):h+" "+s}})}const baseTheme$1$3=buildTheme("."+baseThemeID,{"&":{position:"relative !important",boxSizing:"border-box","&.cm-focused":{outline:"1px dotted #212121"},display:"flex !important",flexDirection:"column"},".cm-scroller":{display:"flex !important",alignItems:"flex-start !important",fontFamily:"monospace",lineHeight:1.4,height:"100%",overflowX:"auto",position:"relative",zIndex:0},".cm-content":{margin:0,flexGrow:2,flexShrink:0,display:"block",whiteSpace:"pre",wordWrap:"normal",boxSizing:"border-box",padding:"4px 0",outline:"none","&[contenteditable=true]":{WebkitUserModify:"read-write-plaintext-only"}},".cm-lineWrapping":{whiteSpace_fallback:"pre-wrap",whiteSpace:"break-spaces",wordBreak:"break-word",overflowWrap:"anywhere",flexShrink:1},"&light .cm-content":{caretColor:"black"},"&dark .cm-content":{caretColor:"white"},".cm-line":{display:"block",padding:"0 2px 0 6px"},".cm-layer":{position:"absolute",left:0,top:0,contain:"size style","& > *":{position:"absolute"}},"&light .cm-selectionBackground":{background:"#d9d9d9"},"&dark .cm-selectionBackground":{background:"#222"},"&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground":{background:"#d7d4f0"},"&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground":{background:"#233"},".cm-cursorLayer":{pointerEvents:"none"},"&.cm-focused > .cm-scroller > .cm-cursorLayer":{animation:"steps(1) cm-blink 1.2s infinite"},"@keyframes cm-blink":{"0%":{},"50%":{opacity:0},"100%":{}},"@keyframes cm-blink2":{"0%":{},"50%":{opacity:0},"100%":{}},".cm-cursor, .cm-dropCursor":{borderLeft:"1.2px solid black",marginLeft:"-0.6px",pointerEvents:"none"},".cm-cursor":{display:"none"},"&dark .cm-cursor":{borderLeftColor:"#444"},".cm-dropCursor":{position:"absolute"},"&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor":{display:"block"},"&light .cm-activeLine":{backgroundColor:"#cceeff44"},"&dark .cm-activeLine":{backgroundColor:"#99eeff33"},"&light .cm-specialChar":{color:"red"},"&dark .cm-specialChar":{color:"#f78"},".cm-gutters":{flexShrink:0,display:"flex",height:"100%",boxSizing:"border-box",insetInlineStart:0,zIndex:200},"&light .cm-gutters":{backgroundColor:"#f5f5f5",color:"#6c6c6c",borderRight:"1px solid #ddd"},"&dark .cm-gutters":{backgroundColor:"#333338",color:"#ccc"},".cm-gutter":{display:"flex !important",flexDirection:"column",flexShrink:0,boxSizing:"border-box",minHeight:"100%",overflow:"hidden"},".cm-gutterElement":{boxSizing:"border-box"},".cm-lineNumbers .cm-gutterElement":{padding:"0 3px 0 5px",minWidth:"20px",textAlign:"right",whiteSpace:"nowrap"},"&light .cm-activeLineGutter":{backgroundColor:"#e2f2ff"},"&dark .cm-activeLineGutter":{backgroundColor:"#222227"},".cm-panels":{boxSizing:"border-box",position:"sticky",left:0,right:0},"&light .cm-panels":{backgroundColor:"#f5f5f5",color:"black"},"&light .cm-panels-top":{borderBottom:"1px solid #ddd"},"&light .cm-panels-bottom":{borderTop:"1px solid #ddd"},"&dark .cm-panels":{backgroundColor:"#333338",color:"white"},".cm-tab":{display:"inline-block",overflow:"hidden",verticalAlign:"bottom"},".cm-widgetBuffer":{verticalAlign:"text-top",height:"1em",width:0,display:"inline"},".cm-placeholder":{color:"#888",display:"inline-block",verticalAlign:"top"},".cm-highlightSpace:before":{content:"attr(data-display)",position:"absolute",pointerEvents:"none",color:"#888"},".cm-highlightTab":{backgroundImage:`url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>')`,backgroundSize:"auto 100%",backgroundPosition:"right 90%",backgroundRepeat:"no-repeat"},".cm-trailingSpace":{backgroundColor:"#ff332255"},".cm-button":{verticalAlign:"middle",color:"inherit",fontSize:"70%",padding:".2em 1em",borderRadius:"1px"},"&light .cm-button":{backgroundImage:"linear-gradient(#eff1f5, #d9d9df)",border:"1px solid #888","&:active":{backgroundImage:"linear-gradient(#b4b4b4, #d0d3d6)"}},"&dark .cm-button":{backgroundImage:"linear-gradient(#393939, #111)",border:"1px solid #888","&:active":{backgroundImage:"linear-gradient(#111, #333)"}},".cm-textfield":{verticalAlign:"middle",color:"inherit",fontSize:"70%",border:"1px solid silver",padding:".2em .5em"},"&light .cm-textfield":{backgroundColor:"white"},"&dark .cm-textfield":{border:"1px solid #555",backgroundColor:"inherit"}},lightDarkIDs),LineBreakPlaceholder="￿";class DOMReader{constructor(e,r){this.points=e,this.text="",this.lineSeparator=r.facet(EditorState.lineSeparator)}append(e){this.text+=e}lineBreak(){this.text+=LineBreakPlaceholder}readRange(e,r){if(!e)return this;let s=e.parentNode;for(let l=e;;){this.findPointBefore(s,l);let o=this.text.length;this.readNode(l);let a=l.nextSibling;if(a==r)break;let c=ContentView.get(l),M=ContentView.get(a);(c&&M?c.breakAfter:(c?c.breakAfter:isBlockElement(l))||isBlockElement(a)&&(l.nodeName!="BR"||l.cmIgnore)&&this.text.length>o)&&this.lineBreak(),l=a}return this.findPointBefore(s,r),this}readTextNode(e){let r=e.nodeValue;for(let s of this.points)s.node==e&&(s.pos=this.text.length+Math.min(s.offset,r.length));for(let s=0,l=this.lineSeparator?null:/\r\n?|\n/g;;){let o=-1,a=1,c;if(this.lineSeparator?(o=r.indexOf(this.lineSeparator,s),a=this.lineSeparator.length):(c=l.exec(r))&&(o=c.index,a=c[0].length),this.append(r.slice(s,o<0?r.length:o)),o<0)break;if(this.lineBreak(),a>1)for(let M of this.points)M.node==e&&M.pos>this.text.length&&(M.pos-=a-1);s=o+a}}readNode(e){if(e.cmIgnore)return;let r=ContentView.get(e),s=r&&r.overrideDOMText;if(s!=null){this.findPointInside(e,s.length);for(let l=s.iter();!l.next().done;)l.lineBreak?this.lineBreak():this.append(l.value)}else e.nodeType==3?this.readTextNode(e):e.nodeName=="BR"?e.nextSibling&&this.lineBreak():e.nodeType==1&&this.readRange(e.firstChild,null)}findPointBefore(e,r){for(let s of this.points)s.node==e&&e.childNodes[s.offset]==r&&(s.pos=this.text.length)}findPointInside(e,r){for(let s of this.points)(e.nodeType==3?s.node==e:e.contains(s.node))&&(s.pos=this.text.length+Math.min(r,s.offset))}}function isBlockElement(h){return h.nodeType==1&&/^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(h.nodeName)}class DOMPoint{constructor(e,r){this.node=e,this.offset=r,this.pos=-1}}class DOMChange{constructor(e,r,s,l){this.typeOver=l,this.bounds=null,this.text="";let{impreciseHead:o,impreciseAnchor:a}=e.docView;if(e.state.readOnly&&r>-1)this.newSel=null;else if(r>-1&&(this.bounds=e.docView.domBoundsAround(r,s,0))){let c=o||a?[]:selectionPoints(e),M=new DOMReader(c,e.state);M.readRange(this.bounds.startDOM,this.bounds.endDOM),this.text=M.text,this.newSel=selectionFromPoints(c,this.bounds.from)}else{let c=e.observer.selectionRange,M=o&&o.node==c.focusNode&&o.offset==c.focusOffset||!contains(e.contentDOM,c.focusNode)?e.state.selection.main.head:e.docView.posFromDOM(c.focusNode,c.focusOffset),f=a&&a.node==c.anchorNode&&a.offset==c.anchorOffset||!contains(e.contentDOM,c.anchorNode)?e.state.selection.main.anchor:e.docView.posFromDOM(c.anchorNode,c.anchorOffset);this.newSel=EditorSelection.single(f,M)}}}function applyDOMChange(h,e){let r,{newSel:s}=e,l=h.state.selection.main,o=h.inputState.lastKeyTime>Date.now()-100?h.inputState.lastKeyCode:-1;if(e.bounds){let{from:a,to:c}=e.bounds,M=l.from,f=null;(o===8||browser.android&&e.text.length<c-a)&&(M=l.to,f="end");let u=findDiff(h.state.doc.sliceString(a,c,LineBreakPlaceholder),e.text,M-a,f);u&&(browser.chrome&&o==13&&u.toB==u.from+2&&e.text.slice(u.from,u.toB)==LineBreakPlaceholder+LineBreakPlaceholder&&u.toB--,r={from:a+u.from,to:a+u.toA,insert:Text.of(e.text.slice(u.from,u.toB).split(LineBreakPlaceholder))})}else s&&(!h.hasFocus&&h.state.facet(editable)||s.main.eq(l))&&(s=null);if(!r&&!s)return!1;if(!r&&e.typeOver&&!l.empty&&s&&s.main.empty?r={from:l.from,to:l.to,insert:h.state.doc.slice(l.from,l.to)}:r&&r.from>=l.from&&r.to<=l.to&&(r.from!=l.from||r.to!=l.to)&&l.to-l.from-(r.to-r.from)<=4?r={from:l.from,to:l.to,insert:h.state.doc.slice(l.from,r.from).append(r.insert).append(h.state.doc.slice(r.to,l.to))}:(browser.mac||browser.android)&&r&&r.from==r.to&&r.from==l.head-1&&/^\. ?$/.test(r.insert.toString())&&h.contentDOM.getAttribute("autocorrect")=="off"?(s&&r.insert.length==2&&(s=EditorSelection.single(s.main.anchor-1,s.main.head-1)),r={from:l.from,to:l.to,insert:Text.of([" "])}):browser.chrome&&r&&r.from==r.to&&r.from==l.head&&r.insert.toString()==`
 `&&h.lineWrapping&&(s&&(s=EditorSelection.single(s.main.anchor-1,s.main.head-1)),r={from:l.from,to:l.to,insert:Text.of([" "])}),r){if(browser.ios&&h.inputState.flushIOSKey(h)||browser.android&&(r.from==l.from&&r.to==l.to&&r.insert.length==1&&r.insert.lines==2&&dispatchKey(h.contentDOM,"Enter",13)||(r.from==l.from-1&&r.to==l.to&&r.insert.length==0||o==8&&r.insert.length<r.to-r.from&&r.to>l.head)&&dispatchKey(h.contentDOM,"Backspace",8)||r.from==l.from&&r.to==l.to+1&&r.insert.length==0&&dispatchKey(h.contentDOM,"Delete",46)))return!0;let a=r.insert.toString();h.inputState.composing>=0&&h.inputState.composing++;let c,M=()=>c||(c=applyDefaultInsert(h,r,s));return h.state.facet(inputHandler$1).some(f=>f(h,r.from,r.to,a,M))||h.dispatch(M()),!0}else if(s&&!s.main.eq(l)){let a=!1,c="select";return h.inputState.lastSelectionTime>Date.now()-50&&(h.inputState.lastSelectionOrigin=="select"&&(a=!0),c=h.inputState.lastSelectionOrigin),h.dispatch({selection:s,scrollIntoView:a,userEvent:c}),!0}else return!1}function applyDefaultInsert(h,e,r){let s,l=h.state,o=l.selection.main;if(e.from>=o.from&&e.to<=o.to&&e.to-e.from>=(o.to-o.from)/3&&(!r||r.main.empty&&r.main.from==e.from+e.insert.length)&&h.inputState.composing<0){let c=o.from<e.from?l.sliceDoc(o.from,e.from):"",M=o.to>e.to?l.sliceDoc(e.to,o.to):"";s=l.replaceSelection(h.state.toText(c+e.insert.sliceString(0,void 0,h.state.lineBreak)+M))}else{let c=l.changes(e),M=r&&r.main.to<=c.newLength?r.main:void 0;if(l.selection.ranges.length>1&&h.inputState.composing>=0&&e.to<=o.to&&e.to>=o.to-10){let f=h.state.sliceDoc(e.from,e.to),u,g=r&&findCompositionNode(h,r.main.head);if(g){let m=e.insert.length-(e.to-e.from);u={from:g.from,to:g.to-m}}else u=h.state.doc.lineAt(o.head);let d=o.to-e.to,p=o.to-o.from;s=l.changeByRange(m=>{if(m.from==o.from&&m.to==o.to)return{changes:c,range:M||m.map(c)};let w=m.to-d,y=w-f.length;if(m.to-m.from!=p||h.state.sliceDoc(y,w)!=f||m.to>=u.from&&m.from<=u.to)return{range:m};let b=l.changes({from:y,to:w,insert:e.insert}),O=m.to-o.to;return{changes:b,range:M?EditorSelection.range(Math.max(0,M.anchor+O),Math.max(0,M.head+O)):m.map(b)}})}else s={changes:c,selection:M&&l.selection.replaceRange(M)}}let a="input.type";return(h.composing||h.inputState.compositionPendingChange&&h.inputState.compositionEndedAt>Date.now()-50)&&(h.inputState.compositionPendingChange=!1,a+=".compose",h.inputState.compositionFirstChange&&(a+=".start",h.inputState.compositionFirstChange=!1)),l.update(s,{userEvent:a,scrollIntoView:!0})}function findDiff(h,e,r,s){let l=Math.min(h.length,e.length),o=0;for(;o<l&&h.charCodeAt(o)==e.charCodeAt(o);)o++;if(o==l&&h.length==e.length)return null;let a=h.length,c=e.length;for(;a>0&&c>0&&h.charCodeAt(a-1)==e.charCodeAt(c-1);)a--,c--;if(s=="end"){let M=Math.max(0,o-Math.min(a,c));r-=a+M-o}if(a<o&&h.length<e.length){let M=r<=o&&r>=a?o-r:0;o-=M,c=o+(c-a),a=o}else if(c<o){let M=r<=o&&r>=c?o-r:0;o-=M,a=o+(a-c),c=o}return{from:o,toA:a,toB:c}}function selectionPoints(h){let e=[];if(h.root.activeElement!=h.contentDOM)return e;let{anchorNode:r,anchorOffset:s,focusNode:l,focusOffset:o}=h.observer.selectionRange;return r&&(e.push(new DOMPoint(r,s)),(l!=r||o!=s)&&e.push(new DOMPoint(l,o))),e}function selectionFromPoints(h,e){if(h.length==0)return null;let r=h[0].pos,s=h.length==2?h[1].pos:r;return r>-1&&s>-1?EditorSelection.single(r+e,s+e):null}const observeOptions={childList:!0,characterData:!0,subtree:!0,attributes:!0,characterDataOldValue:!0},useCharData=browser.ie&&browser.ie_version<=11;class DOMObserver{constructor(e){this.view=e,this.active=!1,this.selectionRange=new DOMSelectionState,this.selectionChanged=!1,this.delayedFlush=-1,this.resizeTimeout=-1,this.queue=[],this.delayedAndroidKey=null,this.flushingAndroidKey=-1,this.lastChange=0,this.scrollTargets=[],this.intersection=null,this.resizeScroll=null,this.resizeContent=null,this.intersecting=!1,this.gapIntersection=null,this.gaps=[],this.parentCheck=-1,this.dom=e.contentDOM,this.observer=new MutationObserver(r=>{for(let s of r)this.queue.push(s);(browser.ie&&browser.ie_version<=11||browser.ios&&e.composing)&&r.some(s=>s.type=="childList"&&s.removedNodes.length||s.type=="characterData"&&s.oldValue.length>s.target.nodeValue.length)?this.flushSoon():this.flush()}),useCharData&&(this.onCharData=r=>{this.queue.push({target:r.target,type:"characterData",oldValue:r.prevValue}),this.flushSoon()}),this.onSelectionChange=this.onSelectionChange.bind(this),this.onResize=this.onResize.bind(this),this.onPrint=this.onPrint.bind(this),this.onScroll=this.onScroll.bind(this),typeof ResizeObserver=="function"&&(this.resizeScroll=new ResizeObserver(()=>{var r;((r=this.view.docView)===null||r===void 0?void 0:r.lastUpdate)<Date.now()-75&&this.onResize()}),this.resizeScroll.observe(e.scrollDOM),this.resizeContent=new ResizeObserver(()=>this.view.requestMeasure()),this.resizeContent.observe(e.contentDOM)),this.addWindowListeners(this.win=e.win),this.start(),typeof IntersectionObserver=="function"&&(this.intersection=new IntersectionObserver(r=>{this.parentCheck<0&&(this.parentCheck=setTimeout(this.listenForScroll.bind(this),1e3)),r.length>0&&r[r.length-1].intersectionRatio>0!=this.intersecting&&(this.intersecting=!this.intersecting,this.intersecting!=this.view.inView&&this.onScrollChanged(document.createEvent("Event")))},{threshold:[0,.001]}),this.intersection.observe(this.dom),this.gapIntersection=new IntersectionObserver(r=>{r.length>0&&r[r.length-1].intersectionRatio>0&&this.onScrollChanged(document.createEvent("Event"))},{})),this.listenForScroll(),this.readSelectionRange()}onScrollChanged(e){this.view.inputState.runScrollHandlers(this.view,e),this.intersecting&&this.view.measure()}onScroll(e){this.intersecting&&this.flush(!1),this.onScrollChanged(e)}onResize(){this.resizeTimeout<0&&(this.resizeTimeout=setTimeout(()=>{this.resizeTimeout=-1,this.view.requestMeasure()},50))}onPrint(){this.view.viewState.printing=!0,this.view.measure(),setTimeout(()=>{this.view.viewState.printing=!1,this.view.requestMeasure()},500)}updateGaps(e){if(this.gapIntersection&&(e.length!=this.gaps.length||this.gaps.some((r,s)=>r!=e[s]))){this.gapIntersection.disconnect();for(let r of e)this.gapIntersection.observe(r);this.gaps=e}}onSelectionChange(e){let r=this.selectionChanged;if(!this.readSelectionRange()||this.delayedAndroidKey)return;let{view:s}=this,l=this.selectionRange;if(s.state.facet(editable)?s.root.activeElement!=this.dom:!hasSelection(s.dom,l))return;let o=l.anchorNode&&s.docView.nearest(l.anchorNode);if(o&&o.ignoreEvent(e)){r||(this.selectionChanged=!1);return}(browser.ie&&browser.ie_version<=11||browser.android&&browser.chrome)&&!s.state.selection.main.empty&&l.focusNode&&isEquivalentPosition(l.focusNode,l.focusOffset,l.anchorNode,l.anchorOffset)?this.flushSoon():this.flush(!1)}readSelectionRange(){let{view:e}=this,r=browser.safari&&e.root.nodeType==11&&deepActiveElement(this.dom.ownerDocument)==this.dom&&safariSelectionRangeHack(this.view)||getSelection(e.root);if(!r||this.selectionRange.eq(r))return!1;let s=hasSelection(this.dom,r);return s&&!this.selectionChanged&&e.inputState.lastFocusTime>Date.now()-200&&e.inputState.lastTouchTime<Date.now()-300&&atElementStart(this.dom,r)?(this.view.inputState.lastFocusTime=0,e.docView.updateSelection(),!1):(this.selectionRange.setRange(r),s&&(this.selectionChanged=!0),!0)}setSelectionRange(e,r){this.selectionRange.set(e.node,e.offset,r.node,r.offset),this.selectionChanged=!1}clearSelectionRange(){this.selectionRange.set(null,0,null,0)}listenForScroll(){this.parentCheck=-1;let e=0,r=null;for(let s=this.dom;s;)if(s.nodeType==1)!r&&e<this.scrollTargets.length&&this.scrollTargets[e]==s?e++:r||(r=this.scrollTargets.slice(0,e)),r&&r.push(s),s=s.assignedSlot||s.parentNode;else if(s.nodeType==11)s=s.host;else break;if(e<this.scrollTargets.length&&!r&&(r=this.scrollTargets.slice(0,e)),r){for(let s of this.scrollTargets)s.removeEventListener("scroll",this.onScroll);for(let s of this.scrollTargets=r)s.addEventListener("scroll",this.onScroll)}}ignore(e){if(!this.active)return e();try{return this.stop(),e()}finally{this.start(),this.clear()}}start(){this.active||(this.observer.observe(this.dom,observeOptions),useCharData&&this.dom.addEventListener("DOMCharacterDataModified",this.onCharData),this.active=!0)}stop(){this.active&&(this.active=!1,this.observer.disconnect(),useCharData&&this.dom.removeEventListener("DOMCharacterDataModified",this.onCharData))}clear(){this.processRecords(),this.queue.length=0,this.selectionChanged=!1}delayAndroidKey(e,r){var s;if(!this.delayedAndroidKey){let l=()=>{let o=this.delayedAndroidKey;o&&(this.clearDelayedAndroidKey(),this.view.inputState.lastKeyCode=o.keyCode,this.view.inputState.lastKeyTime=Date.now(),!this.flush()&&o.force&&dispatchKey(this.dom,o.key,o.keyCode))};this.flushingAndroidKey=this.view.win.requestAnimationFrame(l)}(!this.delayedAndroidKey||e=="Enter")&&(this.delayedAndroidKey={key:e,keyCode:r,force:this.lastChange<Date.now()-50||!!(!((s=this.delayedAndroidKey)===null||s===void 0)&&s.force)})}clearDelayedAndroidKey(){this.win.cancelAnimationFrame(this.flushingAndroidKey),this.delayedAndroidKey=null,this.flushingAndroidKey=-1}flushSoon(){this.delayedFlush<0&&(this.delayedFlush=this.view.win.requestAnimationFrame(()=>{this.delayedFlush=-1,this.flush()}))}forceFlush(){this.delayedFlush>=0&&(this.view.win.cancelAnimationFrame(this.delayedFlush),this.delayedFlush=-1),this.flush()}pendingRecords(){for(let e of this.observer.takeRecords())this.queue.push(e);return this.queue}processRecords(){let e=this.pendingRecords();e.length&&(this.queue=[]);let r=-1,s=-1,l=!1;for(let o of e){let a=this.readMutation(o);a&&(a.typeOver&&(l=!0),r==-1?{from:r,to:s}=a:(r=Math.min(a.from,r),s=Math.max(a.to,s)))}return{from:r,to:s,typeOver:l}}readChange(){let{from:e,to:r,typeOver:s}=this.processRecords(),l=this.selectionChanged&&hasSelection(this.dom,this.selectionRange);if(e<0&&!l)return null;e>-1&&(this.lastChange=Date.now()),this.view.inputState.lastFocusTime=0,this.selectionChanged=!1;let o=new DOMChange(this.view,e,r,s);return this.view.docView.domChanged={newSel:o.newSel?o.newSel.main:null},o}flush(e=!0){if(this.delayedFlush>=0||this.delayedAndroidKey)return!1;e&&this.readSelectionRange();let r=this.readChange();if(!r)return!1;let s=this.view.state,l=applyDOMChange(this.view,r);return this.view.state==s&&this.view.update([]),l}readMutation(e){let r=this.view.docView.nearest(e.target);if(!r||r.ignoreMutation(e))return null;if(r.markDirty(e.type=="attributes"),e.type=="attributes"&&(r.flags|=4),e.type=="childList"){let s=findChild(r,e.previousSibling||e.target.previousSibling,-1),l=findChild(r,e.nextSibling||e.target.nextSibling,1);return{from:s?r.posAfter(s):r.posAtStart,to:l?r.posBefore(l):r.posAtEnd,typeOver:!1}}else return e.type=="characterData"?{from:r.posAtStart,to:r.posAtEnd,typeOver:e.target.nodeValue==e.oldValue}:null}setWindow(e){e!=this.win&&(this.removeWindowListeners(this.win),this.win=e,this.addWindowListeners(this.win))}addWindowListeners(e){e.addEventListener("resize",this.onResize),e.addEventListener("beforeprint",this.onPrint),e.addEventListener("scroll",this.onScroll),e.document.addEventListener("selectionchange",this.onSelectionChange)}removeWindowListeners(e){e.removeEventListener("scroll",this.onScroll),e.removeEventListener("resize",this.onResize),e.removeEventListener("beforeprint",this.onPrint),e.document.removeEventListener("selectionchange",this.onSelectionChange)}destroy(){var e,r,s,l;this.stop(),(e=this.intersection)===null||e===void 0||e.disconnect(),(r=this.gapIntersection)===null||r===void 0||r.disconnect(),(s=this.resizeScroll)===null||s===void 0||s.disconnect(),(l=this.resizeContent)===null||l===void 0||l.disconnect();for(let o of this.scrollTargets)o.removeEventListener("scroll",this.onScroll);this.removeWindowListeners(this.win),clearTimeout(this.parentCheck),clearTimeout(this.resizeTimeout),this.win.cancelAnimationFrame(this.delayedFlush),this.win.cancelAnimationFrame(this.flushingAndroidKey)}}function findChild(h,e,r){for(;e;){let s=ContentView.get(e);if(s&&s.parent==h)return s;let l=e.parentNode;e=l!=h.dom?l:r>0?e.nextSibling:e.previousSibling}return null}function safariSelectionRangeHack(h){let e=null;function r(M){M.preventDefault(),M.stopImmediatePropagation(),e=M.getTargetRanges()[0]}if(h.contentDOM.addEventListener("beforeinput",r,!0),h.dom.ownerDocument.execCommand("indent"),h.contentDOM.removeEventListener("beforeinput",r,!0),!e)return null;let s=e.startContainer,l=e.startOffset,o=e.endContainer,a=e.endOffset,c=h.docView.domAtPos(h.state.selection.main.anchor);return isEquivalentPosition(c.node,c.offset,o,a)&&([s,l,o,a]=[o,a,s,l]),{anchorNode:s,anchorOffset:l,focusNode:o,focusOffset:a}}class EditorView{get state(){return this.viewState.state}get viewport(){return this.viewState.viewport}get visibleRanges(){return this.viewState.visibleRanges}get inView(){return this.viewState.inView}get composing(){return this.inputState.composing>0}get compositionStarted(){return this.inputState.composing>=0}get root(){return this._root}get win(){return this.dom.ownerDocument.defaultView||window}constructor(e={}){this.plugins=[],this.pluginMap=new Map,this.editorAttrs={},this.contentAttrs={},this.bidiCache=[],this.destroyed=!1,this.updateState=2,this.measureScheduled=-1,this.measureRequests=[],this.contentDOM=document.createElement("div"),this.scrollDOM=document.createElement("div"),this.scrollDOM.tabIndex=-1,this.scrollDOM.className="cm-scroller",this.scrollDOM.appendChild(this.contentDOM),this.announceDOM=document.createElement("div"),this.announceDOM.style.cssText="position: fixed; top: -10000px",this.announceDOM.setAttribute("aria-live","polite"),this.dom=document.createElement("div"),this.dom.appendChild(this.announceDOM),this.dom.appendChild(this.scrollDOM);let{dispatch:r}=e;this.dispatchTransactions=e.dispatchTransactions||r&&(s=>s.forEach(l=>r(l,this)))||(s=>this.update(s)),this.dispatch=this.dispatch.bind(this),this._root=e.root||getRoot(e.parent)||document,this.viewState=new ViewState(e.state||EditorState.create(e)),this.plugins=this.state.facet(viewPlugin).map(s=>new PluginInstance(s));for(let s of this.plugins)s.update(this);this.observer=new DOMObserver(this),this.inputState=new InputState(this),this.inputState.ensureHandlers(this,this.plugins),this.docView=new DocView(this),this.mountStyles(),this.updateAttrs(),this.updateState=0,this.requestMeasure(),e.parent&&e.parent.appendChild(this.dom)}dispatch(...e){let r=e.length==1&&e[0]instanceof Transaction?e:e.length==1&&Array.isArray(e[0])?e[0]:[this.state.update(...e)];this.dispatchTransactions(r,this)}update(e){if(this.updateState!=0)throw new Error("Calls to EditorView.update are not allowed while an update is in progress");let r=!1,s=!1,l,o=this.state;for(let d of e){if(d.startState!=o)throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");o=d.state}if(this.destroyed){this.viewState.state=o;return}let a=this.hasFocus,c=0,M=null;e.some(d=>d.annotation(isFocusChange))?(this.inputState.notifiedFocused=a,c=1):a!=this.inputState.notifiedFocused&&(this.inputState.notifiedFocused=a,M=focusChangeTransaction(o,a),M||(c=1));let f=this.observer.delayedAndroidKey,u=null;if(f?(this.observer.clearDelayedAndroidKey(),u=this.observer.readChange(),(u&&!this.state.doc.eq(o.doc)||!this.state.selection.eq(o.selection))&&(u=null)):this.observer.clear(),o.facet(EditorState.phrases)!=this.state.facet(EditorState.phrases))return this.setState(o);l=ViewUpdate.create(this,o,e),l.flags|=c;let g=this.viewState.scrollTarget;try{this.updateState=2;for(let d of e){if(g&&(g=g.map(d.changes)),d.scrollIntoView){let{main:p}=d.state.selection;g=new ScrollTarget(p.empty?p:EditorSelection.cursor(p.head,p.head>p.anchor?-1:1))}for(let p of d.effects)p.is(scrollIntoView$1)&&(g=p.value)}this.viewState.update(l,g),this.bidiCache=CachedOrder.update(this.bidiCache,l.changes),l.empty||(this.updatePlugins(l),this.inputState.update(l)),r=this.docView.update(l),this.state.facet(styleModule)!=this.styleModules&&this.mountStyles(),s=this.updateAttrs(),this.showAnnouncements(e),this.docView.updateSelection(r,e.some(d=>d.isUserEvent("select.pointer")))}finally{this.updateState=0}if(l.startState.facet(theme)!=l.state.facet(theme)&&(this.viewState.mustMeasureContent=!0),(r||s||g||this.viewState.mustEnforceCursorAssoc||this.viewState.mustMeasureContent)&&this.requestMeasure(),!l.empty)for(let d of this.state.facet(updateListener))d(l);(M||u)&&Promise.resolve().then(()=>{M&&this.state==M.startState&&this.dispatch(M),u&&!applyDOMChange(this,u)&&f.force&&dispatchKey(this.contentDOM,f.key,f.keyCode)})}setState(e){if(this.updateState!=0)throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");if(this.destroyed){this.viewState.state=e;return}this.updateState=2;let r=this.hasFocus;try{for(let s of this.plugins)s.destroy(this);this.viewState=new ViewState(e),this.plugins=e.facet(viewPlugin).map(s=>new PluginInstance(s)),this.pluginMap.clear();for(let s of this.plugins)s.update(this);this.docView=new DocView(this),this.inputState.ensureHandlers(this,this.plugins),this.mountStyles(),this.updateAttrs(),this.bidiCache=[]}finally{this.updateState=0}r&&this.focus(),this.requestMeasure()}updatePlugins(e){let r=e.startState.facet(viewPlugin),s=e.state.facet(viewPlugin);if(r!=s){let l=[];for(let o of s){let a=r.indexOf(o);if(a<0)l.push(new PluginInstance(o));else{let c=this.plugins[a];c.mustUpdate=e,l.push(c)}}for(let o of this.plugins)o.mustUpdate!=e&&o.destroy(this);this.plugins=l,this.pluginMap.clear(),this.inputState.ensureHandlers(this,this.plugins)}else for(let l of this.plugins)l.mustUpdate=e;for(let l=0;l<this.plugins.length;l++)this.plugins[l].update(this)}measure(e=!0){if(this.destroyed)return;if(this.measureScheduled>-1&&this.win.cancelAnimationFrame(this.measureScheduled),this.observer.delayedAndroidKey){this.measureScheduled=-1,this.requestMeasure();return}this.measureScheduled=0,e&&this.observer.forceFlush();let r=null,s=this.scrollDOM,l=s.scrollTop*this.scaleY,{scrollAnchorPos:o,scrollAnchorHeight:a}=this.viewState;Math.abs(l-this.viewState.scrollTop)>1&&(a=-1),this.viewState.scrollAnchorHeight=-1;try{for(let c=0;;c++){if(a<0)if(isScrolledToBottom(s))o=-1,a=this.viewState.heightMap.height;else{let p=this.viewState.scrollAnchorAt(l);o=p.from,a=p.top}this.updateState=1;let M=this.viewState.measure(this);if(!M&&!this.measureRequests.length&&this.viewState.scrollTarget==null)break;if(c>5){console.warn(this.measureRequests.length?"Measure loop restarted more than 5 times":"Viewport failed to stabilize");break}let f=[];M&4||([this.measureRequests,f]=[f,this.measureRequests]);let u=f.map(p=>{try{return p.read(this)}catch(m){return logException(this.state,m),BadMeasure}}),g=ViewUpdate.create(this,this.state,[]),d=!1;g.flags|=M,r?r.flags|=M:r=g,this.updateState=2,g.empty||(this.updatePlugins(g),this.inputState.update(g),this.updateAttrs(),d=this.docView.update(g));for(let p=0;p<f.length;p++)if(u[p]!=BadMeasure)try{let m=f[p];m.write&&m.write(u[p],this)}catch(m){logException(this.state,m)}if(d&&this.docView.updateSelection(!0),!g.viewportChanged&&this.measureRequests.length==0){if(this.viewState.editorHeight)if(this.viewState.scrollTarget){this.docView.scrollIntoView(this.viewState.scrollTarget),this.viewState.scrollTarget=null;continue}else{let m=(o<0?this.viewState.heightMap.height:this.viewState.lineBlockAt(o).top)-a;if(m>1||m<-1){l=l+m,s.scrollTop=l/this.scaleY,a=-1;continue}}break}}}finally{this.updateState=0,this.measureScheduled=-1}if(r&&!r.empty)for(let c of this.state.facet(updateListener))c(r)}get themeClasses(){return baseThemeID+" "+(this.state.facet(darkTheme)?baseDarkID:baseLightID)+" "+this.state.facet(theme)}updateAttrs(){let e=attrsFromFacet(this,editorAttributes,{class:"cm-editor"+(this.hasFocus?" cm-focused ":" ")+this.themeClasses}),r={spellcheck:"false",autocorrect:"off",autocapitalize:"off",translate:"no",contenteditable:this.state.facet(editable)?"true":"false",class:"cm-content",style:`${browser.tabSize}: ${this.state.tabSize}`,role:"textbox","aria-multiline":"true"};this.state.readOnly&&(r["aria-readonly"]="true"),attrsFromFacet(this,contentAttributes,r);let s=this.observer.ignore(()=>{let l=updateAttrs(this.contentDOM,this.contentAttrs,r),o=updateAttrs(this.dom,this.editorAttrs,e);return l||o});return this.editorAttrs=e,this.contentAttrs=r,s}showAnnouncements(e){let r=!0;for(let s of e)for(let l of s.effects)if(l.is(EditorView.announce)){r&&(this.announceDOM.textContent=""),r=!1;let o=this.announceDOM.appendChild(document.createElement("div"));o.textContent=l.value}}mountStyles(){this.styleModules=this.state.facet(styleModule);let e=this.state.facet(EditorView.cspNonce);StyleModule.mount(this.root,this.styleModules.concat(baseTheme$1$3).reverse(),e?{nonce:e}:void 0)}readMeasured(){if(this.updateState==2)throw new Error("Reading the editor layout isn't allowed during an update");this.updateState==0&&this.measureScheduled>-1&&this.measure(!1)}requestMeasure(e){if(this.measureScheduled<0&&(this.measureScheduled=this.win.requestAnimationFrame(()=>this.measure())),e){if(this.measureRequests.indexOf(e)>-1)return;if(e.key!=null){for(let r=0;r<this.measureRequests.length;r++)if(this.measureRequests[r].key===e.key){this.measureRequests[r]=e;return}}this.measureRequests.push(e)}}plugin(e){let r=this.pluginMap.get(e);return(r===void 0||r&&r.spec!=e)&&this.pluginMap.set(e,r=this.plugins.find(s=>s.spec==e)||null),r&&r.update(this).value}get documentTop(){return this.contentDOM.getBoundingClientRect().top+this.viewState.paddingTop}get documentPadding(){return{top:this.viewState.paddingTop,bottom:this.viewState.paddingBottom}}get scaleX(){return this.viewState.scaleX}get scaleY(){return this.viewState.scaleY}elementAtHeight(e){return this.readMeasured(),this.viewState.elementAtHeight(e)}lineBlockAtHeight(e){return this.readMeasured(),this.viewState.lineBlockAtHeight(e)}get viewportLineBlocks(){return this.viewState.viewportLines}lineBlockAt(e){return this.viewState.lineBlockAt(e)}get contentHeight(){return this.viewState.contentHeight}moveByChar(e,r,s){return skipAtoms(this,e,moveByChar(this,e,r,s))}moveByGroup(e,r){return skipAtoms(this,e,moveByChar(this,e,r,s=>byGroup(this,e.head,s)))}moveToLineBoundary(e,r,s=!0){return moveToLineBoundary(this,e,r,s)}moveVertically(e,r,s){return skipAtoms(this,e,moveVertically(this,e,r,s))}domAtPos(e){return this.docView.domAtPos(e)}posAtDOM(e,r=0){return this.docView.posFromDOM(e,r)}posAtCoords(e,r=!0){return this.readMeasured(),posAtCoords(this,e,r)}coordsAtPos(e,r=1){this.readMeasured();let s=this.docView.coordsAt(e,r);if(!s||s.left==s.right)return s;let l=this.state.doc.lineAt(e),o=this.bidiSpans(l),a=o[BidiSpan.find(o,e-l.from,-1,r)];return flattenRect(s,a.dir==Direction.LTR==r>0)}coordsForChar(e){return this.readMeasured(),this.docView.coordsForChar(e)}get defaultCharacterWidth(){return this.viewState.heightOracle.charWidth}get defaultLineHeight(){return this.viewState.heightOracle.lineHeight}get textDirection(){return this.viewState.defaultTextDirection}textDirectionAt(e){return!this.state.facet(perLineTextDirection)||e<this.viewport.from||e>this.viewport.to?this.textDirection:(this.readMeasured(),this.docView.textDirectionAt(e))}get lineWrapping(){return this.viewState.heightOracle.lineWrapping}bidiSpans(e){if(e.length>MaxBidiLine)return trivialOrder(e.length);let r=this.textDirectionAt(e.from),s;for(let o of this.bidiCache)if(o.from==e.from&&o.dir==r&&(o.fresh||isolatesEq(o.isolates,s=getIsolatedRanges(this,e.from,e.to))))return o.order;s||(s=getIsolatedRanges(this,e.from,e.to));let l=computeOrder(e.text,r,s);return this.bidiCache.push(new CachedOrder(e.from,e.to,r,s,!0,l)),l}get hasFocus(){var e;return(this.dom.ownerDocument.hasFocus()||browser.safari&&((e=this.inputState)===null||e===void 0?void 0:e.lastContextMenu)>Date.now()-3e4)&&this.root.activeElement==this.contentDOM}focus(){this.observer.ignore(()=>{focusPreventScroll(this.contentDOM),this.docView.updateSelection()})}setRoot(e){this._root!=e&&(this._root=e,this.observer.setWindow((e.nodeType==9?e:e.ownerDocument).defaultView||window),this.mountStyles())}destroy(){for(let e of this.plugins)e.destroy(this);this.plugins=[],this.inputState.destroy(),this.dom.remove(),this.observer.destroy(),this.measureScheduled>-1&&this.win.cancelAnimationFrame(this.measureScheduled),this.destroyed=!0}static scrollIntoView(e,r={}){return scrollIntoView$1.of(new ScrollTarget(typeof e=="number"?EditorSelection.cursor(e):e,r.y,r.x,r.yMargin,r.xMargin))}static domEventHandlers(e){return ViewPlugin.define(()=>({}),{eventHandlers:e})}static theme(e,r){let s=StyleModule.newName(),l=[theme.of(s),styleModule.of(buildTheme(`.${s}`,e))];return r&&r.dark&&l.push(darkTheme.of(!0)),l}static baseTheme(e){return Prec.lowest(styleModule.of(buildTheme("."+baseThemeID,e,lightDarkIDs)))}static findFromDOM(e){var r;let s=e.querySelector(".cm-content"),l=s&&ContentView.get(s)||ContentView.get(e);return((r=l==null?void 0:l.rootView)===null||r===void 0?void 0:r.view)||null}}EditorView.styleModule=styleModule;EditorView.inputHandler=inputHandler$1;EditorView.focusChangeEffect=focusChangeEffect;EditorView.perLineTextDirection=perLineTextDirection;EditorView.exceptionSink=exceptionSink;EditorView.updateListener=updateListener;EditorView.editable=editable;EditorView.mouseSelectionStyle=mouseSelectionStyle;EditorView.dragMovesSelection=dragMovesSelection$1;EditorView.clickAddsSelectionRange=clickAddsSelectionRange;EditorView.decorations=decorations;EditorView.atomicRanges=atomicRanges;EditorView.bidiIsolatedRanges=bidiIsolatedRanges;EditorView.scrollMargins=scrollMargins;EditorView.darkTheme=darkTheme;EditorView.cspNonce=Facet.define({combine:h=>h.length?h[0]:""});EditorView.contentAttributes=contentAttributes;EditorView.editorAttributes=editorAttributes;EditorView.lineWrapping=EditorView.contentAttributes.of({class:"cm-lineWrapping"});EditorView.announce=StateEffect.define();const MaxBidiLine=4096,BadMeasure={};class CachedOrder{constructor(e,r,s,l,o,a){this.from=e,this.to=r,this.dir=s,this.isolates=l,this.fresh=o,this.order=a}static update(e,r){if(r.empty&&!e.some(o=>o.fresh))return e;let s=[],l=e.length?e[e.length-1].dir:Direction.LTR;for(let o=Math.max(0,e.length-10);o<e.length;o++){let a=e[o];a.dir==l&&!r.touchesRange(a.from,a.to)&&s.push(new CachedOrder(r.mapPos(a.from,1),r.mapPos(a.to,-1),a.dir,a.isolates,!1,a.order))}return s}}function attrsFromFacet(h,e,r){for(let s=h.state.facet(e),l=s.length-1;l>=0;l--){let o=s[l],a=typeof o=="function"?o(h):o;a&&combineAttrs(a,r)}return r}const currentPlatform=browser.mac?"mac":browser.windows?"win":browser.linux?"linux":"key";function normalizeKeyName(h,e){const r=h.split(/-(?!$)/);let s=r[r.length-1];s=="Space"&&(s=" ");let l,o,a,c;for(let M=0;M<r.length-1;++M){const f=r[M];if(/^(cmd|meta|m)$/i.test(f))c=!0;else if(/^a(lt)?$/i.test(f))l=!0;else if(/^(c|ctrl|control)$/i.test(f))o=!0;else if(/^s(hift)?$/i.test(f))a=!0;else if(/^mod$/i.test(f))e=="mac"?c=!0:o=!0;else throw new Error("Unrecognized modifier name: "+f)}return l&&(s="Alt-"+s),o&&(s="Ctrl-"+s),c&&(s="Meta-"+s),a&&(s="Shift-"+s),s}function modifiers(h,e,r){return e.altKey&&(h="Alt-"+h),e.ctrlKey&&(h="Ctrl-"+h),e.metaKey&&(h="Meta-"+h),r!==!1&&e.shiftKey&&(h="Shift-"+h),h}const handleKeyEvents=Prec.default(EditorView.domEventHandlers({keydown(h,e){return runHandlers(getKeymap(e.state),h,e,"editor")}})),keymap=Facet.define({enables:handleKeyEvents}),Keymaps=new WeakMap;function getKeymap(h){let e=h.facet(keymap),r=Keymaps.get(e);return r||Keymaps.set(e,r=buildKeymap(e.reduce((s,l)=>s.concat(l),[]))),r}function runScopeHandlers(h,e,r){return runHandlers(getKeymap(h.state),e,h,r)}let storedPrefix=null;const PrefixTimeout=4e3;function buildKeymap(h,e=currentPlatform){let r=Object.create(null),s=Object.create(null),l=(a,c)=>{let M=s[a];if(M==null)s[a]=c;else if(M!=c)throw new Error("Key binding "+a+" is used both as a regular binding and as a multi-stroke prefix")},o=(a,c,M,f,u)=>{var g,d;let p=r[a]||(r[a]=Object.create(null)),m=c.split(/ (?!$)/).map(b=>normalizeKeyName(b,e));for(let b=1;b<m.length;b++){let O=m.slice(0,b).join(" ");l(O,!0),p[O]||(p[O]={preventDefault:!0,stopPropagation:!1,run:[P=>{let v=storedPrefix={view:P,prefix:O,scope:a};return setTimeout(()=>{storedPrefix==v&&(storedPrefix=null)},PrefixTimeout),!0}]})}let w=m.join(" ");l(w,!1);let y=p[w]||(p[w]={preventDefault:!1,stopPropagation:!1,run:((d=(g=p._any)===null||g===void 0?void 0:g.run)===null||d===void 0?void 0:d.slice())||[]});M&&y.run.push(M),f&&(y.preventDefault=!0),u&&(y.stopPropagation=!0)};for(let a of h){let c=a.scope?a.scope.split(" "):["editor"];if(a.any)for(let f of c){let u=r[f]||(r[f]=Object.create(null));u._any||(u._any={preventDefault:!1,stopPropagation:!1,run:[]});for(let g in u)u[g].run.push(a.any)}let M=a[e]||a.key;if(M)for(let f of c)o(f,M,a.run,a.preventDefault,a.stopPropagation),a.shift&&o(f,"Shift-"+M,a.shift,a.preventDefault,a.stopPropagation)}return r}function runHandlers(h,e,r,s){let l=keyName(e),o=codePointAt(l,0),a=codePointSize(o)==l.length&&l!=" ",c="",M=!1,f=!1,u=!1;storedPrefix&&storedPrefix.view==r&&storedPrefix.scope==s&&(c=storedPrefix.prefix+" ",modifierCodes.indexOf(e.keyCode)<0&&(f=!0,storedPrefix=null));let g=new Set,d=y=>{if(y){for(let b of y.run)if(!g.has(b)&&(g.add(b),b(r,e)))return y.stopPropagation&&(u=!0),!0;y.preventDefault&&(y.stopPropagation&&(u=!0),f=!0)}return!1},p=h[s],m,w;return p&&(d(p[c+modifiers(l,e,!a)])?M=!0:a&&(e.altKey||e.metaKey||e.ctrlKey)&&!(browser.windows&&e.ctrlKey&&e.altKey)&&(m=base[e.keyCode])&&m!=l?(d(p[c+modifiers(m,e,!0)])||e.shiftKey&&(w=shift[e.keyCode])!=l&&w!=m&&d(p[c+modifiers(w,e,!1)]))&&(M=!0):a&&e.shiftKey&&d(p[c+modifiers(l,e,!0)])&&(M=!0),!M&&d(p._any)&&(M=!0)),f&&(M=!0),M&&u&&e.stopPropagation(),M}class RectangleMarker{constructor(e,r,s,l,o){this.className=e,this.left=r,this.top=s,this.width=l,this.height=o}draw(){let e=document.createElement("div");return e.className=this.className,this.adjust(e),e}update(e,r){return r.className!=this.className?!1:(this.adjust(e),!0)}adjust(e){e.style.left=this.left+"px",e.style.top=this.top+"px",this.width!=null&&(e.style.width=this.width+"px"),e.style.height=this.height+"px"}eq(e){return this.left==e.left&&this.top==e.top&&this.width==e.width&&this.height==e.height&&this.className==e.className}static forRange(e,r,s){if(s.empty){let l=e.coordsAtPos(s.head,s.assoc||1);if(!l)return[];let o=getBase(e);return[new RectangleMarker(r,l.left-o.left,l.top-o.top,null,l.bottom-l.top)]}else return rectanglesForRange(e,r,s)}}function getBase(h){let e=h.scrollDOM.getBoundingClientRect();return{left:(h.textDirection==Direction.LTR?e.left:e.right-h.scrollDOM.clientWidth*h.scaleX)-h.scrollDOM.scrollLeft*h.scaleX,top:e.top-h.scrollDOM.scrollTop*h.scaleY}}function wrappedLine(h,e,r){let s=EditorSelection.cursor(e);return{from:Math.max(r.from,h.moveToLineBoundary(s,!1,!0).from),to:Math.min(r.to,h.moveToLineBoundary(s,!0,!0).from),type:BlockType.Text}}function rectanglesForRange(h,e,r){if(r.to<=h.viewport.from||r.from>=h.viewport.to)return[];let s=Math.max(r.from,h.viewport.from),l=Math.min(r.to,h.viewport.to),o=h.textDirection==Direction.LTR,a=h.contentDOM,c=a.getBoundingClientRect(),M=getBase(h),f=a.querySelector(".cm-line"),u=f&&window.getComputedStyle(f),g=c.left+(u?parseInt(u.paddingLeft)+Math.min(0,parseInt(u.textIndent)):0),d=c.right-(u?parseInt(u.paddingRight):0),p=blockAt(h,s),m=blockAt(h,l),w=p.type==BlockType.Text?p:null,y=m.type==BlockType.Text?m:null;if(w&&(h.lineWrapping||p.widgetLineBreaks)&&(w=wrappedLine(h,s,w)),y&&(h.lineWrapping||m.widgetLineBreaks)&&(y=wrappedLine(h,l,y)),w&&y&&w.from==y.from)return O(P(r.from,r.to,w));{let S=w?P(r.from,null,w):v(p,!1),k=y?P(null,r.to,y):v(m,!0),T=[];return(w||p).to<(y||m).from-(w&&y?1:0)||p.widgetLineBreaks>1&&S.bottom+h.defaultLineHeight/2<k.top?T.push(b(g,S.bottom,d,k.top)):S.bottom<k.top&&h.elementAtHeight((S.bottom+k.top)/2).type==BlockType.Text&&(S.bottom=k.top=(S.bottom+k.top)/2),O(S).concat(T).concat(O(k))}function b(S,k,T,A){return new RectangleMarker(e,S-M.left,k-M.top-.01,T-S,A-k+.01)}function O({top:S,bottom:k,horizontal:T}){let A=[];for(let E=0;E<T.length;E+=2)A.push(b(T[E],S,T[E+1],k));return A}function P(S,k,T){let A=1e9,E=-1e9,_=[];function R(z,L,N,Q,q){let D=h.coordsAtPos(z,z==T.to?-2:2),$=h.coordsAtPos(N,N==T.from?2:-2);!D||!$||(A=Math.min(D.top,$.top,A),E=Math.max(D.bottom,$.bottom,E),q==Direction.LTR?_.push(o&&L?g:D.left,o&&Q?d:$.right):_.push(!o&&Q?g:$.left,!o&&L?d:D.right))}let B=S??T.from,I=k??T.to;for(let z of h.visibleRanges)if(z.to>B&&z.from<I)for(let L=Math.max(z.from,B),N=Math.min(z.to,I);;){let Q=h.state.doc.lineAt(L);for(let q of h.bidiSpans(Q)){let D=q.from+Q.from,$=q.to+Q.from;if(D>=N)break;$>L&&R(Math.max(D,L),S==null&&D<=B,Math.min($,N),k==null&&$>=I,q.dir)}if(L=Q.to+1,L>=N)break}return _.length==0&&R(B,S==null,I,k==null,h.textDirection),{top:A,bottom:E,horizontal:_}}function v(S,k){let T=c.top+(k?S.top:S.bottom);return{top:T,bottom:T,horizontal:[]}}}function sameMarker(h,e){return h.constructor==e.constructor&&h.eq(e)}class LayerView{constructor(e,r){this.view=e,this.layer=r,this.drawn=[],this.scaleX=1,this.scaleY=1,this.measureReq={read:this.measure.bind(this),write:this.draw.bind(this)},this.dom=e.scrollDOM.appendChild(document.createElement("div")),this.dom.classList.add("cm-layer"),r.above&&this.dom.classList.add("cm-layer-above"),r.class&&this.dom.classList.add(r.class),this.scale(),this.dom.setAttribute("aria-hidden","true"),this.setOrder(e.state),e.requestMeasure(this.measureReq),r.mount&&r.mount(this.dom,e)}update(e){e.startState.facet(layerOrder)!=e.state.facet(layerOrder)&&this.setOrder(e.state),(this.layer.update(e,this.dom)||e.geometryChanged)&&(this.scale(),e.view.requestMeasure(this.measureReq))}setOrder(e){let r=0,s=e.facet(layerOrder);for(;r<s.length&&s[r]!=this.layer;)r++;this.dom.style.zIndex=String((this.layer.above?150:-1)-r)}measure(){return this.layer.markers(this.view)}scale(){let{scaleX:e,scaleY:r}=this.view;(e!=this.scaleX||r!=this.scaleY)&&(this.scaleX=e,this.scaleY=r,this.dom.style.transform=`scale(${1/e}, ${1/r})`)}draw(e){if(e.length!=this.drawn.length||e.some((r,s)=>!sameMarker(r,this.drawn[s]))){let r=this.dom.firstChild,s=0;for(let l of e)l.update&&r&&l.constructor&&this.drawn[s].constructor&&l.update(r,this.drawn[s])?(r=r.nextSibling,s++):this.dom.insertBefore(l.draw(),r);for(;r;){let l=r.nextSibling;r.remove(),r=l}this.drawn=e}}destroy(){this.layer.destroy&&this.layer.destroy(this.dom,this.view),this.dom.remove()}}const layerOrder=Facet.define();function layer(h){return[ViewPlugin.define(e=>new LayerView(e,h)),layerOrder.of(h)]}const CanHidePrimary=!browser.ios,selectionConfig=Facet.define({combine(h){return combineConfig(h,{cursorBlinkRate:1200,drawRangeCursor:!0},{cursorBlinkRate:(e,r)=>Math.min(e,r),drawRangeCursor:(e,r)=>e||r})}});function drawSelection(h={}){return[selectionConfig.of(h),cursorLayer,selectionLayer,hideNativeSelection,nativeSelectionHidden.of(!0)]}function configChanged(h){return h.startState.facet(selectionConfig)!=h.state.facet(selectionConfig)}const cursorLayer=layer({above:!0,markers(h){let{state:e}=h,r=e.facet(selectionConfig),s=[];for(let l of e.selection.ranges){let o=l==e.selection.main;if(l.empty?!o||CanHidePrimary:r.drawRangeCursor){let a=o?"cm-cursor cm-cursor-primary":"cm-cursor cm-cursor-secondary",c=l.empty?l:EditorSelection.cursor(l.head,l.head>l.anchor?-1:1);for(let M of RectangleMarker.forRange(h,a,c))s.push(M)}}return s},update(h,e){h.transactions.some(s=>s.selection)&&(e.style.animationName=e.style.animationName=="cm-blink"?"cm-blink2":"cm-blink");let r=configChanged(h);return r&&setBlinkRate(h.state,e),h.docChanged||h.selectionSet||r},mount(h,e){setBlinkRate(e.state,h)},class:"cm-cursorLayer"});function setBlinkRate(h,e){e.style.animationDuration=h.facet(selectionConfig).cursorBlinkRate+"ms"}const selectionLayer=layer({above:!1,markers(h){return h.state.selection.ranges.map(e=>e.empty?[]:RectangleMarker.forRange(h,"cm-selectionBackground",e)).reduce((e,r)=>e.concat(r))},update(h,e){return h.docChanged||h.selectionSet||h.viewportChanged||configChanged(h)},class:"cm-selectionLayer"}),themeSpec={".cm-line":{"& ::selection":{backgroundColor:"transparent !important"},"&::selection":{backgroundColor:"transparent !important"}}};CanHidePrimary&&(themeSpec[".cm-line"].caretColor="transparent !important");const hideNativeSelection=Prec.highest(EditorView.theme(themeSpec)),setDropCursorPos=StateEffect.define({map(h,e){return h==null?null:e.mapPos(h)}}),dropCursorPos=StateField.define({create(){return null},update(h,e){return h!=null&&(h=e.changes.mapPos(h)),e.effects.reduce((r,s)=>s.is(setDropCursorPos)?s.value:r,h)}}),drawDropCursor=ViewPlugin.fromClass(class{constructor(h){this.view=h,this.cursor=null,this.measureReq={read:this.readPos.bind(this),write:this.drawCursor.bind(this)}}update(h){var e;let r=h.state.field(dropCursorPos);r==null?this.cursor!=null&&((e=this.cursor)===null||e===void 0||e.remove(),this.cursor=null):(this.cursor||(this.cursor=this.view.scrollDOM.appendChild(document.createElement("div")),this.cursor.className="cm-dropCursor"),(h.startState.field(dropCursorPos)!=r||h.docChanged||h.geometryChanged)&&this.view.requestMeasure(this.measureReq))}readPos(){let{view:h}=this,e=h.state.field(dropCursorPos),r=e!=null&&h.coordsAtPos(e);if(!r)return null;let s=h.scrollDOM.getBoundingClientRect();return{left:r.left-s.left+h.scrollDOM.scrollLeft*h.scaleX,top:r.top-s.top+h.scrollDOM.scrollTop*h.scaleY,height:r.bottom-r.top}}drawCursor(h){if(this.cursor){let{scaleX:e,scaleY:r}=this.view;h?(this.cursor.style.left=h.left/e+"px",this.cursor.style.top=h.top/r+"px",this.cursor.style.height=h.height/r+"px"):this.cursor.style.left="-100000px"}}destroy(){this.cursor&&this.cursor.remove()}setDropPos(h){this.view.state.field(dropCursorPos)!=h&&this.view.dispatch({effects:setDropCursorPos.of(h)})}},{eventHandlers:{dragover(h){this.setDropPos(this.view.posAtCoords({x:h.clientX,y:h.clientY}))},dragleave(h){(h.target==this.view.contentDOM||!this.view.contentDOM.contains(h.relatedTarget))&&this.setDropPos(null)},dragend(){this.setDropPos(null)},drop(){this.setDropPos(null)}}});function dropCursor(){return[dropCursorPos,drawDropCursor]}function iterMatches(h,e,r,s,l){e.lastIndex=0;for(let o=h.iterRange(r,s),a=r,c;!o.next().done;a+=o.value.length)if(!o.lineBreak)for(;c=e.exec(o.value);)l(a+c.index,c)}function matchRanges(h,e){let r=h.visibleRanges;if(r.length==1&&r[0].from==h.viewport.from&&r[0].to==h.viewport.to)return r;let s=[];for(let{from:l,to:o}of r)l=Math.max(h.state.doc.lineAt(l).from,l-e),o=Math.min(h.state.doc.lineAt(o).to,o+e),s.length&&s[s.length-1].to>=l?s[s.length-1].to=o:s.push({from:l,to:o});return s}class MatchDecorator{constructor(e){const{regexp:r,decoration:s,decorate:l,boundary:o,maxLength:a=1e3}=e;if(!r.global)throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");if(this.regexp=r,l)this.addMatch=(c,M,f,u)=>l(u,f,f+c[0].length,c,M);else if(typeof s=="function")this.addMatch=(c,M,f,u)=>{let g=s(c,M,f);g&&u(f,f+c[0].length,g)};else if(s)this.addMatch=(c,M,f,u)=>u(f,f+c[0].length,s);else throw new RangeError("Either 'decorate' or 'decoration' should be provided to MatchDecorator");this.boundary=o,this.maxLength=a}createDeco(e){let r=new RangeSetBuilder,s=r.add.bind(r);for(let{from:l,to:o}of matchRanges(e,this.maxLength))iterMatches(e.state.doc,this.regexp,l,o,(a,c)=>this.addMatch(c,e,a,s));return r.finish()}updateDeco(e,r){let s=1e9,l=-1;return e.docChanged&&e.changes.iterChanges((o,a,c,M)=>{M>e.view.viewport.from&&c<e.view.viewport.to&&(s=Math.min(c,s),l=Math.max(M,l))}),e.viewportChanged||l-s>1e3?this.createDeco(e.view):l>-1?this.updateRange(e.view,r.map(e.changes),s,l):r}updateRange(e,r,s,l){for(let o of e.visibleRanges){let a=Math.max(o.from,s),c=Math.min(o.to,l);if(c>a){let M=e.state.doc.lineAt(a),f=M.to<c?e.state.doc.lineAt(c):M,u=Math.max(o.from,M.from),g=Math.min(o.to,f.to);if(this.boundary){for(;a>M.from;a--)if(this.boundary.test(M.text[a-1-M.from])){u=a;break}for(;c<f.to;c++)if(this.boundary.test(f.text[c-f.from])){g=c;break}}let d=[],p,m=(w,y,b)=>d.push(b.range(w,y));if(M==f)for(this.regexp.lastIndex=u-M.from;(p=this.regexp.exec(M.text))&&p.index<g-M.from;)this.addMatch(p,e,p.index+M.from,m);else iterMatches(e.state.doc,this.regexp,u,g,(w,y)=>this.addMatch(y,e,w,m));r=r.update({filterFrom:u,filterTo:g,filter:(w,y)=>w<u||y>g,add:d})}}return r}}const UnicodeRegexpSupport=/x/.unicode!=null?"gu":"g",Specials=new RegExp(`[\0-\b
--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩\uFEFF￹-￼]`,UnicodeRegexpSupport),Names={0:"null",7:"bell",8:"backspace",10:"newline",11:"vertical tab",13:"carriage return",27:"escape",8203:"zero width space",8204:"zero width non-joiner",8205:"zero width joiner",8206:"left-to-right mark",8207:"right-to-left mark",8232:"line separator",8237:"left-to-right override",8238:"right-to-left override",8294:"left-to-right isolate",8295:"right-to-left isolate",8297:"pop directional isolate",8233:"paragraph separator",65279:"zero width no-break space",65532:"object replacement"};let _supportsTabSize=null;function supportsTabSize(){var h;if(_supportsTabSize==null&&typeof document<"u"&&document.body){let e=document.body.style;_supportsTabSize=((h=e.tabSize)!==null&&h!==void 0?h:e.MozTabSize)!=null}return _supportsTabSize||!1}const specialCharConfig=Facet.define({combine(h){let e=combineConfig(h,{render:null,specialChars:Specials,addSpecialChars:null});return(e.replaceTabs=!supportsTabSize())&&(e.specialChars=new RegExp("	|"+e.specialChars.source,UnicodeRegexpSupport)),e.addSpecialChars&&(e.specialChars=new RegExp(e.specialChars.source+"|"+e.addSpecialChars.source,UnicodeRegexpSupport)),e}});function highlightSpecialChars(h={}){return[specialCharConfig.of(h),specialCharPlugin()]}let _plugin=null;function specialCharPlugin(){return _plugin||(_plugin=ViewPlugin.fromClass(class{constructor(h){this.view=h,this.decorations=Decoration.none,this.decorationCache=Object.create(null),this.decorator=this.makeDecorator(h.state.facet(specialCharConfig)),this.decorations=this.decorator.createDeco(h)}makeDecorator(h){return new MatchDecorator({regexp:h.specialChars,decoration:(e,r,s)=>{let{doc:l}=r.state,o=codePointAt(e[0],0);if(o==9){let a=l.lineAt(s),c=r.state.tabSize,M=countColumn(a.text,c,s-a.from);return Decoration.replace({widget:new TabWidget((c-M%c)*this.view.defaultCharacterWidth/this.view.scaleX)})}return this.decorationCache[o]||(this.decorationCache[o]=Decoration.replace({widget:new SpecialCharWidget(h,o)}))},boundary:h.replaceTabs?void 0:/[^]/})}update(h){let e=h.state.facet(specialCharConfig);h.startState.facet(specialCharConfig)!=e?(this.decorator=this.makeDecorator(e),this.decorations=this.decorator.createDeco(h.view)):this.decorations=this.decorator.updateDeco(h,this.decorations)}},{decorations:h=>h.decorations}))}const DefaultPlaceholder="•";function placeholder$1(h){return h>=32?DefaultPlaceholder:h==10?"␤":String.fromCharCode(9216+h)}class SpecialCharWidget extends WidgetType{constructor(e,r){super(),this.options=e,this.code=r}eq(e){return e.code==this.code}toDOM(e){let r=placeholder$1(this.code),s=e.state.phrase("Control character")+" "+(Names[this.code]||"0x"+this.code.toString(16)),l=this.options.render&&this.options.render(this.code,s,r);if(l)return l;let o=document.createElement("span");return o.textContent=r,o.title=s,o.setAttribute("aria-label",s),o.className="cm-specialChar",o}ignoreEvent(){return!1}}class TabWidget extends WidgetType{constructor(e){super(),this.width=e}eq(e){return e.width==this.width}toDOM(){let e=document.createElement("span");return e.textContent="	",e.className="cm-tab",e.style.width=this.width+"px",e}ignoreEvent(){return!1}}function highlightActiveLine(){return activeLineHighlighter}const lineDeco=Decoration.line({class:"cm-activeLine"}),activeLineHighlighter=ViewPlugin.fromClass(class{constructor(h){this.decorations=this.getDeco(h)}update(h){(h.docChanged||h.selectionSet)&&(this.decorations=this.getDeco(h.view))}getDeco(h){let e=-1,r=[];for(let s of h.state.selection.ranges){let l=h.lineBlockAt(s.head);l.from>e&&(r.push(lineDeco.range(l.from)),e=l.from)}return Decoration.set(r)}},{decorations:h=>h.decorations}),MaxOff=2e3;function rectangleFor(h,e,r){let s=Math.min(e.line,r.line),l=Math.max(e.line,r.line),o=[];if(e.off>MaxOff||r.off>MaxOff||e.col<0||r.col<0){let a=Math.min(e.off,r.off),c=Math.max(e.off,r.off);for(let M=s;M<=l;M++){let f=h.doc.line(M);f.length<=c&&o.push(EditorSelection.range(f.from+a,f.to+c))}}else{let a=Math.min(e.col,r.col),c=Math.max(e.col,r.col);for(let M=s;M<=l;M++){let f=h.doc.line(M),u=findColumn(f.text,a,h.tabSize,!0);if(u<0)o.push(EditorSelection.cursor(f.to));else{let g=findColumn(f.text,c,h.tabSize);o.push(EditorSelection.range(f.from+u,f.from+g))}}}return o}function absoluteColumn(h,e){let r=h.coordsAtPos(h.viewport.from);return r?Math.round(Math.abs((r.left-e)/h.defaultCharacterWidth)):-1}function getPos(h,e){let r=h.posAtCoords({x:e.clientX,y:e.clientY},!1),s=h.state.doc.lineAt(r),l=r-s.from,o=l>MaxOff?-1:l==s.length?absoluteColumn(h,e.clientX):countColumn(s.text,h.state.tabSize,r-s.from);return{line:s.number,col:o,off:l}}function rectangleSelectionStyle(h,e){let r=getPos(h,e),s=h.state.selection;return r?{update(l){if(l.docChanged){let o=l.changes.mapPos(l.startState.doc.line(r.line).from),a=l.state.doc.lineAt(o);r={line:a.number,col:r.col,off:Math.min(r.off,a.length)},s=s.map(l.changes)}},get(l,o,a){let c=getPos(h,l);if(!c)return s;let M=rectangleFor(h.state,r,c);return M.length?a?EditorSelection.create(M.concat(s.ranges)):EditorSelection.create(M):s}}:null}function rectangularSelection(h){let e=(h==null?void 0:h.eventFilter)||(r=>r.altKey&&r.button==0);return EditorView.mouseSelectionStyle.of((r,s)=>e(s)?rectangleSelectionStyle(r,s):null)}const keys$1={Alt:[18,h=>!!h.altKey],Control:[17,h=>!!h.ctrlKey],Shift:[16,h=>!!h.shiftKey],Meta:[91,h=>!!h.metaKey]},showCrosshair={style:"cursor: crosshair"};function crosshairCursor(h={}){let[e,r]=keys$1[h.key||"Alt"],s=ViewPlugin.fromClass(class{constructor(l){this.view=l,this.isDown=!1}set(l){this.isDown!=l&&(this.isDown=l,this.view.update([]))}},{eventHandlers:{keydown(l){this.set(l.keyCode==e||r(l))},keyup(l){(l.keyCode==e||!r(l))&&this.set(!1)},mousemove(l){this.set(r(l))}}});return[s,EditorView.contentAttributes.of(l=>{var o;return!((o=l.plugin(s))===null||o===void 0)&&o.isDown?showCrosshair:null})]}const Outside="-10000px";class TooltipViewManager{constructor(e,r,s){this.facet=r,this.createTooltipView=s,this.input=e.state.facet(r),this.tooltips=this.input.filter(l=>l),this.tooltipViews=this.tooltips.map(s)}update(e){var r;let s=e.state.facet(this.facet),l=s.filter(a=>a);if(s===this.input){for(let a of this.tooltipViews)a.update&&a.update(e);return!1}let o=[];for(let a=0;a<l.length;a++){let c=l[a],M=-1;if(c){for(let f=0;f<this.tooltips.length;f++){let u=this.tooltips[f];u&&u.create==c.create&&(M=f)}if(M<0)o[a]=this.createTooltipView(c);else{let f=o[a]=this.tooltipViews[M];f.update&&f.update(e)}}}for(let a of this.tooltipViews)o.indexOf(a)<0&&(a.dom.remove(),(r=a.destroy)===null||r===void 0||r.call(a));return this.input=s,this.tooltips=l,this.tooltipViews=o,!0}}function windowSpace(h){let{win:e}=h;return{top:0,left:0,bottom:e.innerHeight,right:e.innerWidth}}const tooltipConfig=Facet.define({combine:h=>{var e,r,s;return{position:browser.ios?"absolute":((e=h.find(l=>l.position))===null||e===void 0?void 0:e.position)||"fixed",parent:((r=h.find(l=>l.parent))===null||r===void 0?void 0:r.parent)||null,tooltipSpace:((s=h.find(l=>l.tooltipSpace))===null||s===void 0?void 0:s.tooltipSpace)||windowSpace}}}),knownHeight=new WeakMap,tooltipPlugin=ViewPlugin.fromClass(class{constructor(h){this.view=h,this.inView=!0,this.madeAbsolute=!1,this.lastTransaction=0,this.measureTimeout=-1;let e=h.state.facet(tooltipConfig);this.position=e.position,this.parent=e.parent,this.classes=h.themeClasses,this.createContainer(),this.measureReq={read:this.readMeasure.bind(this),write:this.writeMeasure.bind(this),key:this},this.manager=new TooltipViewManager(h,showTooltip,r=>this.createTooltip(r)),this.intersectionObserver=typeof IntersectionObserver=="function"?new IntersectionObserver(r=>{Date.now()>this.lastTransaction-50&&r.length>0&&r[r.length-1].intersectionRatio<1&&this.measureSoon()},{threshold:[1]}):null,this.observeIntersection(),h.win.addEventListener("resize",this.measureSoon=this.measureSoon.bind(this)),this.maybeMeasure()}createContainer(){this.parent?(this.container=document.createElement("div"),this.container.style.position="relative",this.container.className=this.view.themeClasses,this.parent.appendChild(this.container)):this.container=this.view.dom}observeIntersection(){if(this.intersectionObserver){this.intersectionObserver.disconnect();for(let h of this.manager.tooltipViews)this.intersectionObserver.observe(h.dom)}}measureSoon(){this.measureTimeout<0&&(this.measureTimeout=setTimeout(()=>{this.measureTimeout=-1,this.maybeMeasure()},50))}update(h){h.transactions.length&&(this.lastTransaction=Date.now());let e=this.manager.update(h);e&&this.observeIntersection();let r=e||h.geometryChanged,s=h.state.facet(tooltipConfig);if(s.position!=this.position&&!this.madeAbsolute){this.position=s.position;for(let l of this.manager.tooltipViews)l.dom.style.position=this.position;r=!0}if(s.parent!=this.parent){this.parent&&this.container.remove(),this.parent=s.parent,this.createContainer();for(let l of this.manager.tooltipViews)this.container.appendChild(l.dom);r=!0}else this.parent&&this.view.themeClasses!=this.classes&&(this.classes=this.container.className=this.view.themeClasses);r&&this.maybeMeasure()}createTooltip(h){let e=h.create(this.view);if(e.dom.classList.add("cm-tooltip"),h.arrow&&!e.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow")){let r=document.createElement("div");r.className="cm-tooltip-arrow",e.dom.appendChild(r)}return e.dom.style.position=this.position,e.dom.style.top=Outside,this.container.appendChild(e.dom),e.mount&&e.mount(this.view),e}destroy(){var h,e;this.view.win.removeEventListener("resize",this.measureSoon);for(let r of this.manager.tooltipViews)r.dom.remove(),(h=r.destroy)===null||h===void 0||h.call(r);(e=this.intersectionObserver)===null||e===void 0||e.disconnect(),clearTimeout(this.measureTimeout)}readMeasure(){let h=this.view.dom.getBoundingClientRect(),e=1,r=1,s=!1;if(this.position=="fixed"){let l=this.manager.tooltipViews;s=l.length>0&&l[0].dom.offsetParent!=this.container.ownerDocument.body}if(s||this.position=="absolute")if(this.parent){let l=this.parent.getBoundingClientRect();l.width&&l.height&&(e=l.width/this.parent.offsetWidth,r=l.height/this.parent.offsetHeight)}else({scaleX:e,scaleY:r}=this.view.viewState);return{editor:h,parent:this.parent?this.container.getBoundingClientRect():h,pos:this.manager.tooltips.map((l,o)=>{let a=this.manager.tooltipViews[o];return a.getCoords?a.getCoords(l.pos):this.view.coordsAtPos(l.pos)}),size:this.manager.tooltipViews.map(({dom:l})=>l.getBoundingClientRect()),space:this.view.state.facet(tooltipConfig).tooltipSpace(this.view),scaleX:e,scaleY:r,makeAbsolute:s}}writeMeasure(h){var e;if(h.makeAbsolute){this.madeAbsolute=!0,this.position="absolute";for(let c of this.manager.tooltipViews)c.dom.style.position="absolute"}let{editor:r,space:s,scaleX:l,scaleY:o}=h,a=[];for(let c=0;c<this.manager.tooltips.length;c++){let M=this.manager.tooltips[c],f=this.manager.tooltipViews[c],{dom:u}=f,g=h.pos[c],d=h.size[c];if(!g||g.bottom<=Math.max(r.top,s.top)||g.top>=Math.min(r.bottom,s.bottom)||g.right<Math.max(r.left,s.left)-.1||g.left>Math.min(r.right,s.right)+.1){u.style.top=Outside;continue}let p=M.arrow?f.dom.querySelector(".cm-tooltip-arrow"):null,m=p?7:0,w=d.right-d.left,y=(e=knownHeight.get(f))!==null&&e!==void 0?e:d.bottom-d.top,b=f.offset||noOffset,O=this.view.textDirection==Direction.LTR,P=d.width>s.right-s.left?O?s.left:s.right-d.width:O?Math.min(g.left-(p?14:0)+b.x,s.right-w):Math.max(s.left,g.left-w+(p?14:0)-b.x),v=!!M.above;!M.strictSide&&(v?g.top-(d.bottom-d.top)-b.y<s.top:g.bottom+(d.bottom-d.top)+b.y>s.bottom)&&v==s.bottom-g.bottom>g.top-s.top&&(v=!v);let S=(v?g.top-s.top:s.bottom-g.bottom)-m;if(S<y&&f.resize!==!1){if(S<this.view.defaultLineHeight){u.style.top=Outside;continue}knownHeight.set(f,y),u.style.height=(y=S)/o+"px"}else u.style.height&&(u.style.height="");let k=v?g.top-y-m-b.y:g.bottom+m+b.y,T=P+w;if(f.overlap!==!0)for(let A of a)A.left<T&&A.right>P&&A.top<k+y&&A.bottom>k&&(k=v?A.top-y-2-m:A.bottom+m+2);if(this.position=="absolute"?(u.style.top=(k-h.parent.top)/o+"px",u.style.left=(P-h.parent.left)/l+"px"):(u.style.top=k/o+"px",u.style.left=P/l+"px"),p){let A=g.left+(O?b.x:-b.x)-(P+14-7);p.style.left=A/l+"px"}f.overlap!==!0&&a.push({left:P,top:k,right:T,bottom:k+y}),u.classList.toggle("cm-tooltip-above",v),u.classList.toggle("cm-tooltip-below",!v),f.positioned&&f.positioned(h.space)}}maybeMeasure(){if(this.manager.tooltips.length&&(this.view.inView&&this.view.requestMeasure(this.measureReq),this.inView!=this.view.inView&&(this.inView=this.view.inView,!this.inView)))for(let h of this.manager.tooltipViews)h.dom.style.top=Outside}},{eventHandlers:{scroll(){this.maybeMeasure()}}}),baseTheme$4=EditorView.baseTheme({".cm-tooltip":{zIndex:100,boxSizing:"border-box"},"&light .cm-tooltip":{border:"1px solid #bbb",backgroundColor:"#f5f5f5"},"&light .cm-tooltip-section:not(:first-child)":{borderTop:"1px solid #bbb"},"&dark .cm-tooltip":{backgroundColor:"#333338",color:"white"},".cm-tooltip-arrow":{height:"7px",width:`${7*2}px`,position:"absolute",zIndex:-1,overflow:"hidden","&:before, &:after":{content:"''",position:"absolute",width:0,height:0,borderLeft:"7px solid transparent",borderRight:"7px solid transparent"},".cm-tooltip-above &":{bottom:"-7px","&:before":{borderTop:"7px solid #bbb"},"&:after":{borderTop:"7px solid #f5f5f5",bottom:"1px"}},".cm-tooltip-below &":{top:"-7px","&:before":{borderBottom:"7px solid #bbb"},"&:after":{borderBottom:"7px solid #f5f5f5",top:"1px"}}},"&dark .cm-tooltip .cm-tooltip-arrow":{"&:before":{borderTopColor:"#333338",borderBottomColor:"#333338"},"&:after":{borderTopColor:"transparent",borderBottomColor:"transparent"}}}),noOffset={x:0,y:0},showTooltip=Facet.define({enables:[tooltipPlugin,baseTheme$4]}),showHoverTooltip=Facet.define();class HoverTooltipHost{static create(e){return new HoverTooltipHost(e)}constructor(e){this.view=e,this.mounted=!1,this.dom=document.createElement("div"),this.dom.classList.add("cm-tooltip-hover"),this.manager=new TooltipViewManager(e,showHoverTooltip,r=>this.createHostedView(r))}createHostedView(e){let r=e.create(this.view);return r.dom.classList.add("cm-tooltip-section"),this.dom.appendChild(r.dom),this.mounted&&r.mount&&r.mount(this.view),r}mount(e){for(let r of this.manager.tooltipViews)r.mount&&r.mount(e);this.mounted=!0}positioned(e){for(let r of this.manager.tooltipViews)r.positioned&&r.positioned(e)}update(e){this.manager.update(e)}destroy(){var e;for(let r of this.manager.tooltipViews)(e=r.destroy)===null||e===void 0||e.call(r)}}const showHoverTooltipHost=showTooltip.compute([showHoverTooltip],h=>{let e=h.facet(showHoverTooltip).filter(r=>r);return e.length===0?null:{pos:Math.min(...e.map(r=>r.pos)),end:Math.max(...e.filter(r=>r.end!=null).map(r=>r.end)),create:HoverTooltipHost.create,above:e[0].above,arrow:e.some(r=>r.arrow)}});class HoverPlugin{constructor(e,r,s,l,o){this.view=e,this.source=r,this.field=s,this.setHover=l,this.hoverTime=o,this.hoverTimeout=-1,this.restartTimeout=-1,this.pending=null,this.lastMove={x:0,y:0,target:e.dom,time:0},this.checkHover=this.checkHover.bind(this),e.dom.addEventListener("mouseleave",this.mouseleave=this.mouseleave.bind(this)),e.dom.addEventListener("mousemove",this.mousemove=this.mousemove.bind(this))}update(){this.pending&&(this.pending=null,clearTimeout(this.restartTimeout),this.restartTimeout=setTimeout(()=>this.startHover(),20))}get active(){return this.view.state.field(this.field)}checkHover(){if(this.hoverTimeout=-1,this.active)return;let e=Date.now()-this.lastMove.time;e<this.hoverTime?this.hoverTimeout=setTimeout(this.checkHover,this.hoverTime-e):this.startHover()}startHover(){clearTimeout(this.restartTimeout);let{view:e,lastMove:r}=this,s=e.docView.nearest(r.target);if(!s)return;let l,o=1;if(s instanceof WidgetView)l=s.posAtStart;else{if(l=e.posAtCoords(r),l==null)return;let c=e.coordsAtPos(l);if(!c||r.y<c.top||r.y>c.bottom||r.x<c.left-e.defaultCharacterWidth||r.x>c.right+e.defaultCharacterWidth)return;let M=e.bidiSpans(e.state.doc.lineAt(l)).find(u=>u.from<=l&&u.to>=l),f=M&&M.dir==Direction.RTL?-1:1;o=r.x<c.left?-f:f}let a=this.source(e,l,o);if(a!=null&&a.then){let c=this.pending={pos:l};a.then(M=>{this.pending==c&&(this.pending=null,M&&e.dispatch({effects:this.setHover.of(M)}))},M=>logException(e.state,M,"hover tooltip"))}else a&&e.dispatch({effects:this.setHover.of(a)})}mousemove(e){var r;this.lastMove={x:e.clientX,y:e.clientY,target:e.target,time:Date.now()},this.hoverTimeout<0&&(this.hoverTimeout=setTimeout(this.checkHover,this.hoverTime));let s=this.active;if(s&&!isInTooltip(this.lastMove.target)||this.pending){let{pos:l}=s||this.pending,o=(r=s==null?void 0:s.end)!==null&&r!==void 0?r:l;(l==o?this.view.posAtCoords(this.lastMove)!=l:!isOverRange(this.view,l,o,e.clientX,e.clientY))&&(this.view.dispatch({effects:this.setHover.of(null)}),this.pending=null)}}mouseleave(e){clearTimeout(this.hoverTimeout),this.hoverTimeout=-1,this.active&&!isInTooltip(e.relatedTarget)&&this.view.dispatch({effects:this.setHover.of(null)})}destroy(){clearTimeout(this.hoverTimeout),this.view.dom.removeEventListener("mouseleave",this.mouseleave),this.view.dom.removeEventListener("mousemove",this.mousemove)}}function isInTooltip(h){for(let e=h;e;e=e.parentNode)if(e.nodeType==1&&e.classList.contains("cm-tooltip"))return!0;return!1}function isOverRange(h,e,r,s,l,o){let a=h.scrollDOM.getBoundingClientRect(),c=h.documentTop+h.documentPadding.top+h.contentHeight;if(a.left>s||a.right<s||a.top>l||Math.min(a.bottom,c)<l)return!1;let M=h.posAtCoords({x:s,y:l},!1);return M>=e&&M<=r}function hoverTooltip(h,e={}){let r=StateEffect.define(),s=StateField.define({create(){return null},update(l,o){if(l&&(e.hideOnChange&&(o.docChanged||o.selection)||e.hideOn&&e.hideOn(o,l)))return null;if(l&&o.docChanged){let a=o.changes.mapPos(l.pos,-1,MapMode.TrackDel);if(a==null)return null;let c=Object.assign(Object.create(null),l);c.pos=a,l.end!=null&&(c.end=o.changes.mapPos(l.end)),l=c}for(let a of o.effects)a.is(r)&&(l=a.value),a.is(closeHoverTooltipEffect)&&(l=null);return l},provide:l=>showHoverTooltip.from(l)});return[s,ViewPlugin.define(l=>new HoverPlugin(l,h,s,r,e.hoverTime||300)),showHoverTooltipHost]}function getTooltip(h,e){let r=h.plugin(tooltipPlugin);if(!r)return null;let s=r.manager.tooltips.indexOf(e);return s<0?null:r.manager.tooltipViews[s]}const closeHoverTooltipEffect=StateEffect.define(),panelConfig=Facet.define({combine(h){let e,r;for(let s of h)e=e||s.topContainer,r=r||s.bottomContainer;return{topContainer:e,bottomContainer:r}}});function getPanel(h,e){let r=h.plugin(panelPlugin),s=r?r.specs.indexOf(e):-1;return s>-1?r.panels[s]:null}const panelPlugin=ViewPlugin.fromClass(class{constructor(h){this.input=h.state.facet(showPanel),this.specs=this.input.filter(r=>r),this.panels=this.specs.map(r=>r(h));let e=h.state.facet(panelConfig);this.top=new PanelGroup(h,!0,e.topContainer),this.bottom=new PanelGroup(h,!1,e.bottomContainer),this.top.sync(this.panels.filter(r=>r.top)),this.bottom.sync(this.panels.filter(r=>!r.top));for(let r of this.panels)r.dom.classList.add("cm-panel"),r.mount&&r.mount()}update(h){let e=h.state.facet(panelConfig);this.top.container!=e.topContainer&&(this.top.sync([]),this.top=new PanelGroup(h.view,!0,e.topContainer)),this.bottom.container!=e.bottomContainer&&(this.bottom.sync([]),this.bottom=new PanelGroup(h.view,!1,e.bottomContainer)),this.top.syncClasses(),this.bottom.syncClasses();let r=h.state.facet(showPanel);if(r!=this.input){let s=r.filter(M=>M),l=[],o=[],a=[],c=[];for(let M of s){let f=this.specs.indexOf(M),u;f<0?(u=M(h.view),c.push(u)):(u=this.panels[f],u.update&&u.update(h)),l.push(u),(u.top?o:a).push(u)}this.specs=s,this.panels=l,this.top.sync(o),this.bottom.sync(a);for(let M of c)M.dom.classList.add("cm-panel"),M.mount&&M.mount()}else for(let s of this.panels)s.update&&s.update(h)}destroy(){this.top.sync([]),this.bottom.sync([])}},{provide:h=>EditorView.scrollMargins.of(e=>{let r=e.plugin(h);return r&&{top:r.top.scrollMargin(),bottom:r.bottom.scrollMargin()}})});class PanelGroup{constructor(e,r,s){this.view=e,this.top=r,this.container=s,this.dom=void 0,this.classes="",this.panels=[],this.syncClasses()}sync(e){for(let r of this.panels)r.destroy&&e.indexOf(r)<0&&r.destroy();this.panels=e,this.syncDOM()}syncDOM(){if(this.panels.length==0){this.dom&&(this.dom.remove(),this.dom=void 0);return}if(!this.dom){this.dom=document.createElement("div"),this.dom.className=this.top?"cm-panels cm-panels-top":"cm-panels cm-panels-bottom",this.dom.style[this.top?"top":"bottom"]="0";let r=this.container||this.view.dom;r.insertBefore(this.dom,this.top?r.firstChild:null)}let e=this.dom.firstChild;for(let r of this.panels)if(r.dom.parentNode==this.dom){for(;e!=r.dom;)e=rm(e);e=e.nextSibling}else this.dom.insertBefore(r.dom,e);for(;e;)e=rm(e)}scrollMargin(){return!this.dom||this.container?0:Math.max(0,this.top?this.dom.getBoundingClientRect().bottom-Math.max(0,this.view.scrollDOM.getBoundingClientRect().top):Math.min(innerHeight,this.view.scrollDOM.getBoundingClientRect().bottom)-this.dom.getBoundingClientRect().top)}syncClasses(){if(!(!this.container||this.classes==this.view.themeClasses)){for(let e of this.classes.split(" "))e&&this.container.classList.remove(e);for(let e of(this.classes=this.view.themeClasses).split(" "))e&&this.container.classList.add(e)}}}function rm(h){let e=h.nextSibling;return h.remove(),e}const showPanel=Facet.define({enables:panelPlugin});class GutterMarker extends RangeValue{compare(e){return this==e||this.constructor==e.constructor&&this.eq(e)}eq(e){return!1}destroy(e){}}GutterMarker.prototype.elementClass="";GutterMarker.prototype.toDOM=void 0;GutterMarker.prototype.mapMode=MapMode.TrackBefore;GutterMarker.prototype.startSide=GutterMarker.prototype.endSide=-1;GutterMarker.prototype.point=!0;const gutterLineClass=Facet.define(),defaults$1={class:"",renderEmptyElements:!1,elementStyle:"",markers:()=>RangeSet.empty,lineMarker:()=>null,widgetMarker:()=>null,lineMarkerChange:null,initialSpacer:null,updateSpacer:null,domEventHandlers:{}},activeGutters=Facet.define();function gutter(h){return[gutters(),activeGutters.of(Object.assign(Object.assign({},defaults$1),h))]}const unfixGutters=Facet.define({combine:h=>h.some(e=>e)});function gutters(h){let e=[gutterView];return h&&h.fixed===!1&&e.push(unfixGutters.of(!0)),e}const gutterView=ViewPlugin.fromClass(class{constructor(h){this.view=h,this.prevViewport=h.viewport,this.dom=document.createElement("div"),this.dom.className="cm-gutters",this.dom.setAttribute("aria-hidden","true"),this.dom.style.minHeight=this.view.contentHeight/this.view.scaleY+"px",this.gutters=h.state.facet(activeGutters).map(e=>new SingleGutterView(h,e));for(let e of this.gutters)this.dom.appendChild(e.dom);this.fixed=!h.state.facet(unfixGutters),this.fixed&&(this.dom.style.position="sticky"),this.syncGutters(!1),h.scrollDOM.insertBefore(this.dom,h.contentDOM)}update(h){if(this.updateGutters(h)){let e=this.prevViewport,r=h.view.viewport,s=Math.min(e.to,r.to)-Math.max(e.from,r.from);this.syncGutters(s<(r.to-r.from)*.8)}h.geometryChanged&&(this.dom.style.minHeight=this.view.contentHeight+"px"),this.view.state.facet(unfixGutters)!=!this.fixed&&(this.fixed=!this.fixed,this.dom.style.position=this.fixed?"sticky":""),this.prevViewport=h.view.viewport}syncGutters(h){let e=this.dom.nextSibling;h&&this.dom.remove();let r=RangeSet.iter(this.view.state.facet(gutterLineClass),this.view.viewport.from),s=[],l=this.gutters.map(o=>new UpdateContext(o,this.view.viewport,-this.view.documentPadding.top));for(let o of this.view.viewportLineBlocks)if(s.length&&(s=[]),Array.isArray(o.type)){let a=!0;for(let c of o.type)if(c.type==BlockType.Text&&a){advanceCursor(r,s,c.from);for(let M of l)M.line(this.view,c,s);a=!1}else if(c.widget)for(let M of l)M.widget(this.view,c)}else if(o.type==BlockType.Text){advanceCursor(r,s,o.from);for(let a of l)a.line(this.view,o,s)}else if(o.widget)for(let a of l)a.widget(this.view,o);for(let o of l)o.finish();h&&this.view.scrollDOM.insertBefore(this.dom,e)}updateGutters(h){let e=h.startState.facet(activeGutters),r=h.state.facet(activeGutters),s=h.docChanged||h.heightChanged||h.viewportChanged||!RangeSet.eq(h.startState.facet(gutterLineClass),h.state.facet(gutterLineClass),h.view.viewport.from,h.view.viewport.to);if(e==r)for(let l of this.gutters)l.update(h)&&(s=!0);else{s=!0;let l=[];for(let o of r){let a=e.indexOf(o);a<0?l.push(new SingleGutterView(this.view,o)):(this.gutters[a].update(h),l.push(this.gutters[a]))}for(let o of this.gutters)o.dom.remove(),l.indexOf(o)<0&&o.destroy();for(let o of l)this.dom.appendChild(o.dom);this.gutters=l}return s}destroy(){for(let h of this.gutters)h.destroy();this.dom.remove()}},{provide:h=>EditorView.scrollMargins.of(e=>{let r=e.plugin(h);return!r||r.gutters.length==0||!r.fixed?null:e.textDirection==Direction.LTR?{left:r.dom.offsetWidth*e.scaleX}:{right:r.dom.offsetWidth*e.scaleX}})});function asArray(h){return Array.isArray(h)?h:[h]}function advanceCursor(h,e,r){for(;h.value&&h.from<=r;)h.from==r&&e.push(h.value),h.next()}class UpdateContext{constructor(e,r,s){this.gutter=e,this.height=s,this.i=0,this.cursor=RangeSet.iter(e.markers,r.from)}addElement(e,r,s){let{gutter:l}=this,o=r.top-this.height;if(this.i==l.elements.length){let a=new GutterElement(e,r.height,o,s);l.elements.push(a),l.dom.appendChild(a.dom)}else l.elements[this.i].update(e,r.height,o,s);this.height=r.bottom,this.i++}line(e,r,s){let l=[];advanceCursor(this.cursor,l,r.from),s.length&&(l=l.concat(s));let o=this.gutter.config.lineMarker(e,r,l);o&&l.unshift(o);let a=this.gutter;l.length==0&&!a.config.renderEmptyElements||this.addElement(e,r,l)}widget(e,r){let s=this.gutter.config.widgetMarker(e,r.widget,r);s&&this.addElement(e,r,[s])}finish(){let e=this.gutter;for(;e.elements.length>this.i;){let r=e.elements.pop();e.dom.removeChild(r.dom),r.destroy()}}}class SingleGutterView{constructor(e,r){this.view=e,this.config=r,this.elements=[],this.spacer=null,this.dom=document.createElement("div"),this.dom.className="cm-gutter"+(this.config.class?" "+this.config.class:"");for(let s in r.domEventHandlers)this.dom.addEventListener(s,l=>{let o=l.target,a;if(o!=this.dom&&this.dom.contains(o)){for(;o.parentNode!=this.dom;)o=o.parentNode;let M=o.getBoundingClientRect();a=(M.top+M.bottom)/2}else a=l.clientY;let c=e.lineBlockAtHeight(a-e.documentTop);r.domEventHandlers[s](e,c,l)&&l.preventDefault()});this.markers=asArray(r.markers(e)),r.initialSpacer&&(this.spacer=new GutterElement(e,0,0,[r.initialSpacer(e)]),this.dom.appendChild(this.spacer.dom),this.spacer.dom.style.cssText+="visibility: hidden; pointer-events: none")}update(e){let r=this.markers;if(this.markers=asArray(this.config.markers(e.view)),this.spacer&&this.config.updateSpacer){let l=this.config.updateSpacer(this.spacer.markers[0],e);l!=this.spacer.markers[0]&&this.spacer.update(e.view,0,0,[l])}let s=e.view.viewport;return!RangeSet.eq(this.markers,r,s.from,s.to)||(this.config.lineMarkerChange?this.config.lineMarkerChange(e):!1)}destroy(){for(let e of this.elements)e.destroy()}}class GutterElement{constructor(e,r,s,l){this.height=-1,this.above=0,this.markers=[],this.dom=document.createElement("div"),this.dom.className="cm-gutterElement",this.update(e,r,s,l)}update(e,r,s,l){this.height!=r&&(this.height=r,this.dom.style.height=r/e.scaleY+"px"),this.above!=s&&(this.dom.style.marginTop=(this.above=s)?s/e.scaleY+"px":""),sameMarkers(this.markers,l)||this.setMarkers(e,l)}setMarkers(e,r){let s="cm-gutterElement",l=this.dom.firstChild;for(let o=0,a=0;;){let c=a,M=o<r.length?r[o++]:null,f=!1;if(M){let u=M.elementClass;u&&(s+=" "+u);for(let g=a;g<this.markers.length;g++)if(this.markers[g].compare(M)){c=g,f=!0;break}}else c=this.markers.length;for(;a<c;){let u=this.markers[a++];if(u.toDOM){u.destroy(l);let g=l.nextSibling;l.remove(),l=g}}if(!M)break;M.toDOM&&(f?l=l.nextSibling:this.dom.insertBefore(M.toDOM(e),l)),f&&a++}this.dom.className=s,this.markers=r}destroy(){this.setMarkers(null,[])}}function sameMarkers(h,e){if(h.length!=e.length)return!1;for(let r=0;r<h.length;r++)if(!h[r].compare(e[r]))return!1;return!0}const lineNumberMarkers=Facet.define(),lineNumberConfig=Facet.define({combine(h){return combineConfig(h,{formatNumber:String,domEventHandlers:{}},{domEventHandlers(e,r){let s=Object.assign({},e);for(let l in r){let o=s[l],a=r[l];s[l]=o?(c,M,f)=>o(c,M,f)||a(c,M,f):a}return s}})}});class NumberMarker extends GutterMarker{constructor(e){super(),this.number=e}eq(e){return this.number==e.number}toDOM(){return document.createTextNode(this.number)}}function formatNumber(h,e){return h.state.facet(lineNumberConfig).formatNumber(e,h.state)}const lineNumberGutter=activeGutters.compute([lineNumberConfig],h=>({class:"cm-lineNumbers",renderEmptyElements:!1,markers(e){return e.state.facet(lineNumberMarkers)},lineMarker(e,r,s){return s.some(l=>l.toDOM)?null:new NumberMarker(formatNumber(e,e.state.doc.lineAt(r.from).number))},widgetMarker:()=>null,lineMarkerChange:e=>e.startState.facet(lineNumberConfig)!=e.state.facet(lineNumberConfig),initialSpacer(e){return new NumberMarker(formatNumber(e,maxLineNumber(e.state.doc.lines)))},updateSpacer(e,r){let s=formatNumber(r.view,maxLineNumber(r.view.state.doc.lines));return s==e.number?e:new NumberMarker(s)},domEventHandlers:h.facet(lineNumberConfig).domEventHandlers}));function lineNumbers(h={}){return[lineNumberConfig.of(h),gutters(),lineNumberGutter]}function maxLineNumber(h){let e=9;for(;e<h;)e=e*10+9;return e}const activeLineGutterMarker=new class extends GutterMarker{constructor(){super(...arguments),this.elementClass="cm-activeLineGutter"}},activeLineGutterHighlighter=gutterLineClass.compute(["selection"],h=>{let e=[],r=-1;for(let s of h.selection.ranges){let l=h.doc.lineAt(s.head).from;l>r&&(r=l,e.push(activeLineGutterMarker.range(l)))}return RangeSet.of(e)});function highlightActiveLineGutter(){return activeLineGutterHighlighter}const DefaultBufferLength=1024;let nextPropID=0;class Range{constructor(e,r){this.from=e,this.to=r}}class NodeProp{constructor(e={}){this.id=nextPropID++,this.perNode=!!e.perNode,this.deserialize=e.deserialize||(()=>{throw new Error("This node type doesn't define a deserialize function")})}add(e){if(this.perNode)throw new RangeError("Can't add per-node props to node types");return typeof e!="function"&&(e=NodeType.match(e)),r=>{let s=e(r);return s===void 0?null:[this,s]}}}NodeProp.closedBy=new NodeProp({deserialize:h=>h.split(" ")});NodeProp.openedBy=new NodeProp({deserialize:h=>h.split(" ")});NodeProp.group=new NodeProp({deserialize:h=>h.split(" ")});NodeProp.contextHash=new NodeProp({perNode:!0});NodeProp.lookAhead=new NodeProp({perNode:!0});NodeProp.mounted=new NodeProp({perNode:!0});const noProps=Object.create(null);class NodeType{constructor(e,r,s,l=0){this.name=e,this.props=r,this.id=s,this.flags=l}static define(e){let r=e.props&&e.props.length?Object.create(null):noProps,s=(e.top?1:0)|(e.skipped?2:0)|(e.error?4:0)|(e.name==null?8:0),l=new NodeType(e.name||"",r,e.id,s);if(e.props){for(let o of e.props)if(Array.isArray(o)||(o=o(l)),o){if(o[0].perNode)throw new RangeError("Can't store a per-node prop on a node type");r[o[0].id]=o[1]}}return l}prop(e){return this.props[e.id]}get isTop(){return(this.flags&1)>0}get isSkipped(){return(this.flags&2)>0}get isError(){return(this.flags&4)>0}get isAnonymous(){return(this.flags&8)>0}is(e){if(typeof e=="string"){if(this.name==e)return!0;let r=this.prop(NodeProp.group);return r?r.indexOf(e)>-1:!1}return this.id==e}static match(e){let r=Object.create(null);for(let s in e)for(let l of s.split(" "))r[l]=e[s];return s=>{for(let l=s.prop(NodeProp.group),o=-1;o<(l?l.length:0);o++){let a=r[o<0?s.name:l[o]];if(a)return a}}}}NodeType.none=new NodeType("",Object.create(null),0,8);class NodeSet{constructor(e){this.types=e;for(let r=0;r<e.length;r++)if(e[r].id!=r)throw new RangeError("Node type ids should correspond to array positions when creating a node set")}extend(...e){let r=[];for(let s of this.types){let l=null;for(let o of e){let a=o(s);a&&(l||(l=Object.assign({},s.props)),l[a[0].id]=a[1])}r.push(l?new NodeType(s.name,l,s.id,s.flags):s)}return new NodeSet(r)}}const CachedNode=new WeakMap,CachedInnerNode=new WeakMap;var IterMode;(function(h){h[h.ExcludeBuffers=1]="ExcludeBuffers",h[h.IncludeAnonymous=2]="IncludeAnonymous",h[h.IgnoreMounts=4]="IgnoreMounts",h[h.IgnoreOverlays=8]="IgnoreOverlays"})(IterMode||(IterMode={}));class Tree{constructor(e,r,s,l,o){if(this.type=e,this.children=r,this.positions=s,this.length=l,this.props=null,o&&o.length){this.props=Object.create(null);for(let[a,c]of o)this.props[typeof a=="number"?a:a.id]=c}}toString(){let e=this.prop(NodeProp.mounted);if(e&&!e.overlay)return e.tree.toString();let r="";for(let s of this.children){let l=s.toString();l&&(r&&(r+=","),r+=l)}return this.type.name?(/\W/.test(this.type.name)&&!this.type.isError?JSON.stringify(this.type.name):this.type.name)+(r.length?"("+r+")":""):r}cursor(e=0){return new TreeCursor(this.topNode,e)}cursorAt(e,r=0,s=0){let l=CachedNode.get(this)||this.topNode,o=new TreeCursor(l);return o.moveTo(e,r),CachedNode.set(this,o._tree),o}get topNode(){return new TreeNode(this,0,0,null)}resolve(e,r=0){let s=resolveNode(CachedNode.get(this)||this.topNode,e,r,!1);return CachedNode.set(this,s),s}resolveInner(e,r=0){let s=resolveNode(CachedInnerNode.get(this)||this.topNode,e,r,!0);return CachedInnerNode.set(this,s),s}iterate(e){let{enter:r,leave:s,from:l=0,to:o=this.length}=e,a=e.mode||0,c=(a&IterMode.IncludeAnonymous)>0;for(let M=this.cursor(a|IterMode.IncludeAnonymous);;){let f=!1;if(M.from<=o&&M.to>=l&&(!c&&M.type.isAnonymous||r(M)!==!1)){if(M.firstChild())continue;f=!0}for(;f&&s&&(c||!M.type.isAnonymous)&&s(M),!M.nextSibling();){if(!M.parent())return;f=!0}}}prop(e){return e.perNode?this.props?this.props[e.id]:void 0:this.type.prop(e)}get propValues(){let e=[];if(this.props)for(let r in this.props)e.push([+r,this.props[r]]);return e}balance(e={}){return this.children.length<=8?this:balanceRange(NodeType.none,this.children,this.positions,0,this.children.length,0,this.length,(r,s,l)=>new Tree(this.type,r,s,l,this.propValues),e.makeTree||((r,s,l)=>new Tree(NodeType.none,r,s,l)))}static build(e){return buildTree(e)}}Tree.empty=new Tree(NodeType.none,[],[],0);class FlatBufferCursor{constructor(e,r){this.buffer=e,this.index=r}get id(){return this.buffer[this.index-4]}get start(){return this.buffer[this.index-3]}get end(){return this.buffer[this.index-2]}get size(){return this.buffer[this.index-1]}get pos(){return this.index}next(){this.index-=4}fork(){return new FlatBufferCursor(this.buffer,this.index)}}class TreeBuffer{constructor(e,r,s){this.buffer=e,this.length=r,this.set=s}get type(){return NodeType.none}toString(){let e=[];for(let r=0;r<this.buffer.length;)e.push(this.childString(r)),r=this.buffer[r+3];return e.join(",")}childString(e){let r=this.buffer[e],s=this.buffer[e+3],l=this.set.types[r],o=l.name;if(/\W/.test(o)&&!l.isError&&(o=JSON.stringify(o)),e+=4,s==e)return o;let a=[];for(;e<s;)a.push(this.childString(e)),e=this.buffer[e+3];return o+"("+a.join(",")+")"}findChild(e,r,s,l,o){let{buffer:a}=this,c=-1;for(let M=e;M!=r&&!(checkSide(o,l,a[M+1],a[M+2])&&(c=M,s>0));M=a[M+3]);return c}slice(e,r,s){let l=this.buffer,o=new Uint16Array(r-e),a=0;for(let c=e,M=0;c<r;){o[M++]=l[c++],o[M++]=l[c++]-s;let f=o[M++]=l[c++]-s;o[M++]=l[c++]-e,a=Math.max(a,f)}return new TreeBuffer(o,a,this.set)}}function checkSide(h,e,r,s){switch(h){case-2:return r<e;case-1:return s>=e&&r<e;case 0:return r<e&&s>e;case 1:return r<=e&&s>e;case 2:return s>e;case 4:return!0}}function enterUnfinishedNodesBefore(h,e){let r=h.childBefore(e);for(;r;){let s=r.lastChild;if(!s||s.to!=r.to)break;s.type.isError&&s.from==s.to?(h=r,r=s.prevSibling):r=s}return h}function resolveNode(h,e,r,s){for(var l;h.from==h.to||(r<1?h.from>=e:h.from>e)||(r>-1?h.to<=e:h.to<e);){let a=!s&&h instanceof TreeNode&&h.index<0?null:h.parent;if(!a)return h;h=a}let o=s?0:IterMode.IgnoreOverlays;if(s)for(let a=h,c=a.parent;c;a=c,c=a.parent)a instanceof TreeNode&&a.index<0&&((l=c.enter(e,r,o))===null||l===void 0?void 0:l.from)!=a.from&&(h=c);for(;;){let a=h.enter(e,r,o);if(!a)return h;h=a}}class TreeNode{constructor(e,r,s,l){this._tree=e,this.from=r,this.index=s,this._parent=l}get type(){return this._tree.type}get name(){return this._tree.type.name}get to(){return this.from+this._tree.length}nextChild(e,r,s,l,o=0){for(let a=this;;){for(let{children:c,positions:M}=a._tree,f=r>0?c.length:-1;e!=f;e+=r){let u=c[e],g=M[e]+a.from;if(checkSide(l,s,g,g+u.length)){if(u instanceof TreeBuffer){if(o&IterMode.ExcludeBuffers)continue;let d=u.findChild(0,u.buffer.length,r,s-g,l);if(d>-1)return new BufferNode(new BufferContext(a,u,e,g),null,d)}else if(o&IterMode.IncludeAnonymous||!u.type.isAnonymous||hasChild(u)){let d;if(!(o&IterMode.IgnoreMounts)&&u.props&&(d=u.prop(NodeProp.mounted))&&!d.overlay)return new TreeNode(d.tree,g,e,a);let p=new TreeNode(u,g,e,a);return o&IterMode.IncludeAnonymous||!p.type.isAnonymous?p:p.nextChild(r<0?u.children.length-1:0,r,s,l)}}}if(o&IterMode.IncludeAnonymous||!a.type.isAnonymous||(a.index>=0?e=a.index+r:e=r<0?-1:a._parent._tree.children.length,a=a._parent,!a))return null}}get firstChild(){return this.nextChild(0,1,0,4)}get lastChild(){return this.nextChild(this._tree.children.length-1,-1,0,4)}childAfter(e){return this.nextChild(0,1,e,2)}childBefore(e){return this.nextChild(this._tree.children.length-1,-1,e,-2)}enter(e,r,s=0){let l;if(!(s&IterMode.IgnoreOverlays)&&(l=this._tree.prop(NodeProp.mounted))&&l.overlay){let o=e-this.from;for(let{from:a,to:c}of l.overlay)if((r>0?a<=o:a<o)&&(r<0?c>=o:c>o))return new TreeNode(l.tree,l.overlay[0].from+this.from,-1,this)}return this.nextChild(0,1,e,r,s)}nextSignificantParent(){let e=this;for(;e.type.isAnonymous&&e._parent;)e=e._parent;return e}get parent(){return this._parent?this._parent.nextSignificantParent():null}get nextSibling(){return this._parent&&this.index>=0?this._parent.nextChild(this.index+1,1,0,4):null}get prevSibling(){return this._parent&&this.index>=0?this._parent.nextChild(this.index-1,-1,0,4):null}cursor(e=0){return new TreeCursor(this,e)}get tree(){return this._tree}toTree(){return this._tree}resolve(e,r=0){return resolveNode(this,e,r,!1)}resolveInner(e,r=0){return resolveNode(this,e,r,!0)}enterUnfinishedNodesBefore(e){return enterUnfinishedNodesBefore(this,e)}getChild(e,r=null,s=null){let l=getChildren(this,e,r,s);return l.length?l[0]:null}getChildren(e,r=null,s=null){return getChildren(this,e,r,s)}toString(){return this._tree.toString()}get node(){return this}matchContext(e){return matchNodeContext(this,e)}}function getChildren(h,e,r,s){let l=h.cursor(),o=[];if(!l.firstChild())return o;if(r!=null){for(;!l.type.is(r);)if(!l.nextSibling())return o}for(;;){if(s!=null&&l.type.is(s))return o;if(l.type.is(e)&&o.push(l.node),!l.nextSibling())return s==null?o:[]}}function matchNodeContext(h,e,r=e.length-1){for(let s=h.parent;r>=0;s=s.parent){if(!s)return!1;if(!s.type.isAnonymous){if(e[r]&&e[r]!=s.name)return!1;r--}}return!0}class BufferContext{constructor(e,r,s,l){this.parent=e,this.buffer=r,this.index=s,this.start=l}}class BufferNode{get name(){return this.type.name}get from(){return this.context.start+this.context.buffer.buffer[this.index+1]}get to(){return this.context.start+this.context.buffer.buffer[this.index+2]}constructor(e,r,s){this.context=e,this._parent=r,this.index=s,this.type=e.buffer.set.types[e.buffer.buffer[s]]}child(e,r,s){let{buffer:l}=this.context,o=l.findChild(this.index+4,l.buffer[this.index+3],e,r-this.context.start,s);return o<0?null:new BufferNode(this.context,this,o)}get firstChild(){return this.child(1,0,4)}get lastChild(){return this.child(-1,0,4)}childAfter(e){return this.child(1,e,2)}childBefore(e){return this.child(-1,e,-2)}enter(e,r,s=0){if(s&IterMode.ExcludeBuffers)return null;let{buffer:l}=this.context,o=l.findChild(this.index+4,l.buffer[this.index+3],r>0?1:-1,e-this.context.start,r);return o<0?null:new BufferNode(this.context,this,o)}get parent(){return this._parent||this.context.parent.nextSignificantParent()}externalSibling(e){return this._parent?null:this.context.parent.nextChild(this.context.index+e,e,0,4)}get nextSibling(){let{buffer:e}=this.context,r=e.buffer[this.index+3];return r<(this._parent?e.buffer[this._parent.index+3]:e.buffer.length)?new BufferNode(this.context,this._parent,r):this.externalSibling(1)}get prevSibling(){let{buffer:e}=this.context,r=this._parent?this._parent.index+4:0;return this.index==r?this.externalSibling(-1):new BufferNode(this.context,this._parent,e.findChild(r,this.index,-1,0,4))}cursor(e=0){return new TreeCursor(this,e)}get tree(){return null}toTree(){let e=[],r=[],{buffer:s}=this.context,l=this.index+4,o=s.buffer[this.index+3];if(o>l){let a=s.buffer[this.index+1];e.push(s.slice(l,o,a)),r.push(0)}return new Tree(this.type,e,r,this.to-this.from)}resolve(e,r=0){return resolveNode(this,e,r,!1)}resolveInner(e,r=0){return resolveNode(this,e,r,!0)}enterUnfinishedNodesBefore(e){return enterUnfinishedNodesBefore(this,e)}toString(){return this.context.buffer.childString(this.index)}getChild(e,r=null,s=null){let l=getChildren(this,e,r,s);return l.length?l[0]:null}getChildren(e,r=null,s=null){return getChildren(this,e,r,s)}get node(){return this}matchContext(e){return matchNodeContext(this,e)}}class TreeCursor{get name(){return this.type.name}constructor(e,r=0){if(this.mode=r,this.buffer=null,this.stack=[],this.index=0,this.bufferNode=null,e instanceof TreeNode)this.yieldNode(e);else{this._tree=e.context.parent,this.buffer=e.context;for(let s=e._parent;s;s=s._parent)this.stack.unshift(s.index);this.bufferNode=e,this.yieldBuf(e.index)}}yieldNode(e){return e?(this._tree=e,this.type=e.type,this.from=e.from,this.to=e.to,!0):!1}yieldBuf(e,r){this.index=e;let{start:s,buffer:l}=this.buffer;return this.type=r||l.set.types[l.buffer[e]],this.from=s+l.buffer[e+1],this.to=s+l.buffer[e+2],!0}yield(e){return e?e instanceof TreeNode?(this.buffer=null,this.yieldNode(e)):(this.buffer=e.context,this.yieldBuf(e.index,e.type)):!1}toString(){return this.buffer?this.buffer.buffer.childString(this.index):this._tree.toString()}enterChild(e,r,s){if(!this.buffer)return this.yield(this._tree.nextChild(e<0?this._tree._tree.children.length-1:0,e,r,s,this.mode));let{buffer:l}=this.buffer,o=l.findChild(this.index+4,l.buffer[this.index+3],e,r-this.buffer.start,s);return o<0?!1:(this.stack.push(this.index),this.yieldBuf(o))}firstChild(){return this.enterChild(1,0,4)}lastChild(){return this.enterChild(-1,0,4)}childAfter(e){return this.enterChild(1,e,2)}childBefore(e){return this.enterChild(-1,e,-2)}enter(e,r,s=this.mode){return this.buffer?s&IterMode.ExcludeBuffers?!1:this.enterChild(1,e,r):this.yield(this._tree.enter(e,r,s))}parent(){if(!this.buffer)return this.yieldNode(this.mode&IterMode.IncludeAnonymous?this._tree._parent:this._tree.parent);if(this.stack.length)return this.yieldBuf(this.stack.pop());let e=this.mode&IterMode.IncludeAnonymous?this.buffer.parent:this.buffer.parent.nextSignificantParent();return this.buffer=null,this.yieldNode(e)}sibling(e){if(!this.buffer)return this._tree._parent?this.yield(this._tree.index<0?null:this._tree._parent.nextChild(this._tree.index+e,e,0,4,this.mode)):!1;let{buffer:r}=this.buffer,s=this.stack.length-1;if(e<0){let l=s<0?0:this.stack[s]+4;if(this.index!=l)return this.yieldBuf(r.findChild(l,this.index,-1,0,4))}else{let l=r.buffer[this.index+3];if(l<(s<0?r.buffer.length:r.buffer[this.stack[s]+3]))return this.yieldBuf(l)}return s<0?this.yield(this.buffer.parent.nextChild(this.buffer.index+e,e,0,4,this.mode)):!1}nextSibling(){return this.sibling(1)}prevSibling(){return this.sibling(-1)}atLastNode(e){let r,s,{buffer:l}=this;if(l){if(e>0){if(this.index<l.buffer.buffer.length)return!1}else for(let o=0;o<this.index;o++)if(l.buffer.buffer[o+3]<this.index)return!1;({index:r,parent:s}=l)}else({index:r,_parent:s}=this._tree);for(;s;{index:r,_parent:s}=s)if(r>-1)for(let o=r+e,a=e<0?-1:s._tree.children.length;o!=a;o+=e){let c=s._tree.children[o];if(this.mode&IterMode.IncludeAnonymous||c instanceof TreeBuffer||!c.type.isAnonymous||hasChild(c))return!1}return!0}move(e,r){if(r&&this.enterChild(e,0,4))return!0;for(;;){if(this.sibling(e))return!0;if(this.atLastNode(e)||!this.parent())return!1}}next(e=!0){return this.move(1,e)}prev(e=!0){return this.move(-1,e)}moveTo(e,r=0){for(;(this.from==this.to||(r<1?this.from>=e:this.from>e)||(r>-1?this.to<=e:this.to<e))&&this.parent(););for(;this.enterChild(1,e,r););return this}get node(){if(!this.buffer)return this._tree;let e=this.bufferNode,r=null,s=0;if(e&&e.context==this.buffer)e:for(let l=this.index,o=this.stack.length;o>=0;){for(let a=e;a;a=a._parent)if(a.index==l){if(l==this.index)return a;r=a,s=o+1;break e}l=this.stack[--o]}for(let l=s;l<this.stack.length;l++)r=new BufferNode(this.buffer,r,this.stack[l]);return this.bufferNode=new BufferNode(this.buffer,r,this.index)}get tree(){return this.buffer?null:this._tree._tree}iterate(e,r){for(let s=0;;){let l=!1;if(this.type.isAnonymous||e(this)!==!1){if(this.firstChild()){s++;continue}this.type.isAnonymous||(l=!0)}for(;l&&r&&r(this),l=this.type.isAnonymous,!this.nextSibling();){if(!s)return;this.parent(),s--,l=!0}}}matchContext(e){if(!this.buffer)return matchNodeContext(this.node,e);let{buffer:r}=this.buffer,{types:s}=r.set;for(let l=e.length-1,o=this.stack.length-1;l>=0;o--){if(o<0)return matchNodeContext(this.node,e,l);let a=s[r.buffer[this.stack[o]]];if(!a.isAnonymous){if(e[l]&&e[l]!=a.name)return!1;l--}}return!0}}function hasChild(h){return h.children.some(e=>e instanceof TreeBuffer||!e.type.isAnonymous||hasChild(e))}function buildTree(h){var e;let{buffer:r,nodeSet:s,maxBufferLength:l=DefaultBufferLength,reused:o=[],minRepeatType:a=s.types.length}=h,c=Array.isArray(r)?new FlatBufferCursor(r,r.length):r,M=s.types,f=0,u=0;function g(v,S,k,T,A){let{id:E,start:_,end:R,size:B}=c,I=u;for(;B<0;)if(c.next(),B==-1){let q=o[E];k.push(q),T.push(_-v);return}else if(B==-3){f=E;return}else if(B==-4){u=E;return}else throw new RangeError(`Unrecognized record size: ${B}`);let z=M[E],L,N,Q=_-v;if(R-_<=l&&(N=w(c.pos-S,A))){let q=new Uint16Array(N.size-N.skip),D=c.pos-N.size,$=q.length;for(;c.pos>D;)$=y(N.start,q,$);L=new TreeBuffer(q,R-N.start,s),Q=N.start-v}else{let q=c.pos-B;c.next();let D=[],$=[],V=E>=a?E:-1,F=0,H=R;for(;c.pos>q;)V>=0&&c.id==V&&c.size>=0?(c.end<=H-l&&(p(D,$,_,F,c.end,H,V,I),F=D.length,H=c.end),c.next()):g(_,q,D,$,V);if(V>=0&&F>0&&F<D.length&&p(D,$,_,F,_,H,V,I),D.reverse(),$.reverse(),V>-1&&F>0){let W=d(z);L=balanceRange(z,D,$,0,D.length,0,R-_,W,W)}else L=m(z,D,$,R-_,I-R)}k.push(L),T.push(Q)}function d(v){return(S,k,T)=>{let A=0,E=S.length-1,_,R;if(E>=0&&(_=S[E])instanceof Tree){if(!E&&_.type==v&&_.length==T)return _;(R=_.prop(NodeProp.lookAhead))&&(A=k[E]+_.length+R)}return m(v,S,k,T,A)}}function p(v,S,k,T,A,E,_,R){let B=[],I=[];for(;v.length>T;)B.push(v.pop()),I.push(S.pop()+k-A);v.push(m(s.types[_],B,I,E-A,R-E)),S.push(A-k)}function m(v,S,k,T,A=0,E){if(f){let _=[NodeProp.contextHash,f];E=E?[_].concat(E):[_]}if(A>25){let _=[NodeProp.lookAhead,A];E=E?[_].concat(E):[_]}return new Tree(v,S,k,T,E)}function w(v,S){let k=c.fork(),T=0,A=0,E=0,_=k.end-l,R={size:0,start:0,skip:0};e:for(let B=k.pos-v;k.pos>B;){let I=k.size;if(k.id==S&&I>=0){R.size=T,R.start=A,R.skip=E,E+=4,T+=4,k.next();continue}let z=k.pos-I;if(I<0||z<B||k.start<_)break;let L=k.id>=a?4:0,N=k.start;for(k.next();k.pos>z;){if(k.size<0)if(k.size==-3)L+=4;else break e;else k.id>=a&&(L+=4);k.next()}A=N,T+=I,E+=L}return(S<0||T==v)&&(R.size=T,R.start=A,R.skip=E),R.size>4?R:void 0}function y(v,S,k){let{id:T,start:A,end:E,size:_}=c;if(c.next(),_>=0&&T<a){let R=k;if(_>4){let B=c.pos-(_-4);for(;c.pos>B;)k=y(v,S,k)}S[--k]=R,S[--k]=E-v,S[--k]=A-v,S[--k]=T}else _==-3?f=T:_==-4&&(u=T);return k}let b=[],O=[];for(;c.pos>0;)g(h.start||0,h.bufferStart||0,b,O,-1);let P=(e=h.length)!==null&&e!==void 0?e:b.length?O[0]+b[0].length:0;return new Tree(M[h.topID],b.reverse(),O.reverse(),P)}const nodeSizeCache=new WeakMap;function nodeSize(h,e){if(!h.isAnonymous||e instanceof TreeBuffer||e.type!=h)return 1;let r=nodeSizeCache.get(e);if(r==null){r=1;for(let s of e.children){if(s.type!=h||!(s instanceof Tree)){r=1;break}r+=nodeSize(h,s)}nodeSizeCache.set(e,r)}return r}function balanceRange(h,e,r,s,l,o,a,c,M){let f=0;for(let m=s;m<l;m++)f+=nodeSize(h,e[m]);let u=Math.ceil(f*1.5/8),g=[],d=[];function p(m,w,y,b,O){for(let P=y;P<b;){let v=P,S=w[P],k=nodeSize(h,m[P]);for(P++;P<b;P++){let T=nodeSize(h,m[P]);if(k+T>=u)break;k+=T}if(P==v+1){if(k>u){let T=m[v];p(T.children,T.positions,0,T.children.length,w[v]+O);continue}g.push(m[v])}else{let T=w[P-1]+m[P-1].length-S;g.push(balanceRange(h,m,w,v,P,S,T,null,M))}d.push(S+O-o)}}return p(e,r,s,l,0),(c||M)(g,d,a)}class TreeFragment{constructor(e,r,s,l,o=!1,a=!1){this.from=e,this.to=r,this.tree=s,this.offset=l,this.open=(o?1:0)|(a?2:0)}get openStart(){return(this.open&1)>0}get openEnd(){return(this.open&2)>0}static addTree(e,r=[],s=!1){let l=[new TreeFragment(0,e.length,e,0,!1,s)];for(let o of r)o.to>e.length&&l.push(o);return l}static applyChanges(e,r,s=128){if(!r.length)return e;let l=[],o=1,a=e.length?e[0]:null;for(let c=0,M=0,f=0;;c++){let u=c<r.length?r[c]:null,g=u?u.fromA:1e9;if(g-M>=s)for(;a&&a.from<g;){let d=a;if(M>=d.from||g<=d.to||f){let p=Math.max(d.from,M)-f,m=Math.min(d.to,g)-f;d=p>=m?null:new TreeFragment(p,m,d.tree,d.offset+f,c>0,!!u)}if(d&&l.push(d),a.to>g)break;a=o<e.length?e[o++]:null}if(!u)break;M=u.toA,f=u.toA-u.toB}return l}}class Parser{startParse(e,r,s){return typeof e=="string"&&(e=new StringInput(e)),s=s?s.length?s.map(l=>new Range(l.from,l.to)):[new Range(0,0)]:[new Range(0,e.length)],this.createParse(e,r||[],s)}parse(e,r,s){let l=this.startParse(e,r,s);for(;;){let o=l.advance();if(o)return o}}}class StringInput{constructor(e){this.string=e}get length(){return this.string.length}chunk(e){return this.string.slice(e)}get lineChunks(){return!1}read(e,r){return this.string.slice(e,r)}}new NodeProp({perNode:!0});let nextTagID=0;class Tag{constructor(e,r,s){this.set=e,this.base=r,this.modified=s,this.id=nextTagID++}static define(e){if(e!=null&&e.base)throw new Error("Can not derive from a modified tag");let r=new Tag([],null,[]);if(r.set.push(r),e)for(let s of e.set)r.set.push(s);return r}static defineModifier(){let e=new Modifier;return r=>r.modified.indexOf(e)>-1?r:Modifier.get(r.base||r,r.modified.concat(e).sort((s,l)=>s.id-l.id))}}let nextModifierID=0;class Modifier{constructor(){this.instances=[],this.id=nextModifierID++}static get(e,r){if(!r.length)return e;let s=r[0].instances.find(c=>c.base==e&&sameArray(r,c.modified));if(s)return s;let l=[],o=new Tag(l,e,r);for(let c of r)c.instances.push(o);let a=powerSet(r);for(let c of e.set)if(!c.modified.length)for(let M of a)l.push(Modifier.get(c,M));return o}}function sameArray(h,e){return h.length==e.length&&h.every((r,s)=>r==e[s])}function powerSet(h){let e=[[]];for(let r=0;r<h.length;r++)for(let s=0,l=e.length;s<l;s++)e.push(e[s].concat(h[r]));return e.sort((r,s)=>s.length-r.length)}function styleTags(h){let e=Object.create(null);for(let r in h){let s=h[r];Array.isArray(s)||(s=[s]);for(let l of r.split(" "))if(l){let o=[],a=2,c=l;for(let g=0;;){if(c=="..."&&g>0&&g+3==l.length){a=1;break}let d=/^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(c);if(!d)throw new RangeError("Invalid path: "+l);if(o.push(d[0]=="*"?"":d[0][0]=='"'?JSON.parse(d[0]):d[0]),g+=d[0].length,g==l.length)break;let p=l[g++];if(g==l.length&&p=="!"){a=0;break}if(p!="/")throw new RangeError("Invalid path: "+l);c=l.slice(g)}let M=o.length-1,f=o[M];if(!f)throw new RangeError("Invalid path: "+l);let u=new Rule(s,a,M>0?o.slice(0,M):null);e[f]=u.sort(e[f])}}return ruleNodeProp.add(e)}const ruleNodeProp=new NodeProp;class Rule{constructor(e,r,s,l){this.tags=e,this.mode=r,this.context=s,this.next=l}get opaque(){return this.mode==0}get inherit(){return this.mode==1}sort(e){return!e||e.depth<this.depth?(this.next=e,this):(e.next=this.sort(e.next),e)}get depth(){return this.context?this.context.length:0}}Rule.empty=new Rule([],2,null);function tagHighlighter(h,e){let r=Object.create(null);for(let o of h)if(!Array.isArray(o.tag))r[o.tag.id]=o.class;else for(let a of o.tag)r[a.id]=o.class;let{scope:s,all:l=null}=e||{};return{style:o=>{let a=l;for(let c of o)for(let M of c.set){let f=r[M.id];if(f){a=a?a+" "+f:f;break}}return a},scope:s}}function highlightTags(h,e){let r=null;for(let s of h){let l=s.style(e);l&&(r=r?r+" "+l:l)}return r}function highlightTree(h,e,r,s=0,l=h.length){let o=new HighlightBuilder(s,Array.isArray(e)?e:[e],r);o.highlightRange(h.cursor(),s,l,"",o.highlighters),o.flush(l)}class HighlightBuilder{constructor(e,r,s){this.at=e,this.highlighters=r,this.span=s,this.class=""}startSpan(e,r){r!=this.class&&(this.flush(e),e>this.at&&(this.at=e),this.class=r)}flush(e){e>this.at&&this.class&&this.span(this.at,e,this.class)}highlightRange(e,r,s,l,o){let{type:a,from:c,to:M}=e;if(c>=s||M<=r)return;a.isTop&&(o=this.highlighters.filter(p=>!p.scope||p.scope(a)));let f=l,u=getStyleTags(e)||Rule.empty,g=highlightTags(o,u.tags);if(g&&(f&&(f+=" "),f+=g,u.mode==1&&(l+=(l?" ":"")+g)),this.startSpan(Math.max(r,c),f),u.opaque)return;let d=e.tree&&e.tree.prop(NodeProp.mounted);if(d&&d.overlay){let p=e.node.enter(d.overlay[0].from+c,1),m=this.highlighters.filter(y=>!y.scope||y.scope(d.tree.type)),w=e.firstChild();for(let y=0,b=c;;y++){let O=y<d.overlay.length?d.overlay[y]:null,P=O?O.from+c:M,v=Math.max(r,b),S=Math.min(s,P);if(v<S&&w)for(;e.from<S&&(this.highlightRange(e,v,S,l,o),this.startSpan(Math.min(S,e.to),f),!(e.to>=P||!e.nextSibling())););if(!O||P>s)break;b=O.to+c,b>r&&(this.highlightRange(p.cursor(),Math.max(r,O.from+c),Math.min(s,b),"",m),this.startSpan(Math.min(s,b),f))}w&&e.parent()}else if(e.firstChild()){d&&(l="");do if(!(e.to<=r)){if(e.from>=s)break;this.highlightRange(e,r,s,l,o),this.startSpan(Math.min(s,e.to),f)}while(e.nextSibling());e.parent()}}}function getStyleTags(h){let e=h.type.prop(ruleNodeProp);for(;e&&e.context&&!h.matchContext(e.context);)e=e.next;return e||null}const t=Tag.define,comment=t(),name=t(),typeName=t(name),propertyName=t(name),literal=t(),string=t(literal),number=t(literal),content=t(),heading=t(content),keyword=t(),operator=t(),punctuation=t(),bracket=t(punctuation),meta$1=t(),tags={comment,lineComment:t(comment),blockComment:t(comment),docComment:t(comment),name,variableName:t(name),typeName,tagName:t(typeName),propertyName,attributeName:t(propertyName),className:t(name),labelName:t(name),namespace:t(name),macroName:t(name),literal,string,docString:t(string),character:t(string),attributeValue:t(string),number,integer:t(number),float:t(number),bool:t(literal),regexp:t(literal),escape:t(literal),color:t(literal),url:t(literal),keyword,self:t(keyword),null:t(keyword),atom:t(keyword),unit:t(keyword),modifier:t(keyword),operatorKeyword:t(keyword),controlKeyword:t(keyword),definitionKeyword:t(keyword),moduleKeyword:t(keyword),operator,derefOperator:t(operator),arithmeticOperator:t(operator),logicOperator:t(operator),bitwiseOperator:t(operator),compareOperator:t(operator),updateOperator:t(operator),definitionOperator:t(operator),typeOperator:t(operator),controlOperator:t(operator),punctuation,separator:t(punctuation),bracket,angleBracket:t(bracket),squareBracket:t(bracket),paren:t(bracket),brace:t(bracket),content,heading,heading1:t(heading),heading2:t(heading),heading3:t(heading),heading4:t(heading),heading5:t(heading),heading6:t(heading),contentSeparator:t(content),list:t(content),quote:t(content),emphasis:t(content),strong:t(content),link:t(content),monospace:t(content),strikethrough:t(content),inserted:t(),deleted:t(),changed:t(),invalid:t(),meta:meta$1,documentMeta:t(meta$1),annotation:t(meta$1),processingInstruction:t(meta$1),definition:Tag.defineModifier(),constant:Tag.defineModifier(),function:Tag.defineModifier(),standard:Tag.defineModifier(),local:Tag.defineModifier(),special:Tag.defineModifier()};tagHighlighter([{tag:tags.link,class:"tok-link"},{tag:tags.heading,class:"tok-heading"},{tag:tags.emphasis,class:"tok-emphasis"},{tag:tags.strong,class:"tok-strong"},{tag:tags.keyword,class:"tok-keyword"},{tag:tags.atom,class:"tok-atom"},{tag:tags.bool,class:"tok-bool"},{tag:tags.url,class:"tok-url"},{tag:tags.labelName,class:"tok-labelName"},{tag:tags.inserted,class:"tok-inserted"},{tag:tags.deleted,class:"tok-deleted"},{tag:tags.literal,class:"tok-literal"},{tag:tags.string,class:"tok-string"},{tag:tags.number,class:"tok-number"},{tag:[tags.regexp,tags.escape,tags.special(tags.string)],class:"tok-string2"},{tag:tags.variableName,class:"tok-variableName"},{tag:tags.local(tags.variableName),class:"tok-variableName tok-local"},{tag:tags.definition(tags.variableName),class:"tok-variableName tok-definition"},{tag:tags.special(tags.variableName),class:"tok-variableName2"},{tag:tags.definition(tags.propertyName),class:"tok-propertyName tok-definition"},{tag:tags.typeName,class:"tok-typeName"},{tag:tags.namespace,class:"tok-namespace"},{tag:tags.className,class:"tok-className"},{tag:tags.macroName,class:"tok-macroName"},{tag:tags.propertyName,class:"tok-propertyName"},{tag:tags.operator,class:"tok-operator"},{tag:tags.comment,class:"tok-comment"},{tag:tags.meta,class:"tok-meta"},{tag:tags.invalid,class:"tok-invalid"},{tag:tags.punctuation,class:"tok-punctuation"}]);var _a;const languageDataProp=new NodeProp;function defineLanguageFacet(h){return Facet.define({combine:h?e=>e.concat(h):void 0})}const sublanguageProp=new NodeProp;class Language{constructor(e,r,s=[],l=""){this.data=e,this.name=l,EditorState.prototype.hasOwnProperty("tree")||Object.defineProperty(EditorState.prototype,"tree",{get(){return syntaxTree(this)}}),this.parser=r,this.extension=[language.of(this),EditorState.languageData.of((o,a,c)=>{let M=topNodeAt(o,a,c),f=M.type.prop(languageDataProp);if(!f)return[];let u=o.facet(f),g=M.type.prop(sublanguageProp);if(g){let d=M.resolve(a-M.from,c);for(let p of g)if(p.test(d,o)){let m=o.facet(p.facet);return p.type=="replace"?m:m.concat(u)}}return u})].concat(s)}isActiveAt(e,r,s=-1){return topNodeAt(e,r,s).type.prop(languageDataProp)==this.data}findRegions(e){let r=e.facet(language);if((r==null?void 0:r.data)==this.data)return[{from:0,to:e.doc.length}];if(!r||!r.allowsNesting)return[];let s=[],l=(o,a)=>{if(o.prop(languageDataProp)==this.data){s.push({from:a,to:a+o.length});return}let c=o.prop(NodeProp.mounted);if(c){if(c.tree.prop(languageDataProp)==this.data){if(c.overlay)for(let M of c.overlay)s.push({from:M.from+a,to:M.to+a});else s.push({from:a,to:a+o.length});return}else if(c.overlay){let M=s.length;if(l(c.tree,c.overlay[0].from+a),s.length>M)return}}for(let M=0;M<o.children.length;M++){let f=o.children[M];f instanceof Tree&&l(f,o.positions[M]+a)}};return l(syntaxTree(e),0),s}get allowsNesting(){return!0}}Language.setState=StateEffect.define();function topNodeAt(h,e,r){let s=h.facet(language),l=syntaxTree(h).topNode;if(!s||s.allowsNesting)for(let o=l;o;o=o.enter(e,r,IterMode.ExcludeBuffers))o.type.isTop&&(l=o);return l}class LRLanguage extends Language{constructor(e,r,s){super(e,r,[],s),this.parser=r}static define(e){let r=defineLanguageFacet(e.languageData);return new LRLanguage(r,e.parser.configure({props:[languageDataProp.add(s=>s.isTop?r:void 0)]}),e.name)}configure(e,r){return new LRLanguage(this.data,this.parser.configure(e),r||this.name)}get allowsNesting(){return this.parser.hasWrappers()}}function syntaxTree(h){let e=h.field(Language.state,!1);return e?e.tree:Tree.empty}class DocInput{constructor(e){this.doc=e,this.cursorPos=0,this.string="",this.cursor=e.iter()}get length(){return this.doc.length}syncTo(e){return this.string=this.cursor.next(e-this.cursorPos).value,this.cursorPos=e+this.string.length,this.cursorPos-this.string.length}chunk(e){return this.syncTo(e),this.string}get lineChunks(){return!0}read(e,r){let s=this.cursorPos-this.string.length;return e<s||r>=this.cursorPos?this.doc.sliceString(e,r):this.string.slice(e-s,r-s)}}let currentContext=null;class ParseContext{constructor(e,r,s=[],l,o,a,c,M){this.parser=e,this.state=r,this.fragments=s,this.tree=l,this.treeLen=o,this.viewport=a,this.skipped=c,this.scheduleOn=M,this.parse=null,this.tempSkipped=[]}static create(e,r,s){return new ParseContext(e,r,[],Tree.empty,0,s,[],null)}startParse(){return this.parser.startParse(new DocInput(this.state.doc),this.fragments)}work(e,r){return r!=null&&r>=this.state.doc.length&&(r=void 0),this.tree!=Tree.empty&&this.isDone(r??this.state.doc.length)?(this.takeTree(),!0):this.withContext(()=>{var s;if(typeof e=="number"){let l=Date.now()+e;e=()=>Date.now()>l}for(this.parse||(this.parse=this.startParse()),r!=null&&(this.parse.stoppedAt==null||this.parse.stoppedAt>r)&&r<this.state.doc.length&&this.parse.stopAt(r);;){let l=this.parse.advance();if(l)if(this.fragments=this.withoutTempSkipped(TreeFragment.addTree(l,this.fragments,this.parse.stoppedAt!=null)),this.treeLen=(s=this.parse.stoppedAt)!==null&&s!==void 0?s:this.state.doc.length,this.tree=l,this.parse=null,this.treeLen<(r??this.state.doc.length))this.parse=this.startParse();else return!0;if(e())return!1}})}takeTree(){let e,r;this.parse&&(e=this.parse.parsedPos)>=this.treeLen&&((this.parse.stoppedAt==null||this.parse.stoppedAt>e)&&this.parse.stopAt(e),this.withContext(()=>{for(;!(r=this.parse.advance()););}),this.treeLen=e,this.tree=r,this.fragments=this.withoutTempSkipped(TreeFragment.addTree(this.tree,this.fragments,!0)),this.parse=null)}withContext(e){let r=currentContext;currentContext=this;try{return e()}finally{currentContext=r}}withoutTempSkipped(e){for(let r;r=this.tempSkipped.pop();)e=cutFragments(e,r.from,r.to);return e}changes(e,r){let{fragments:s,tree:l,treeLen:o,viewport:a,skipped:c}=this;if(this.takeTree(),!e.empty){let M=[];if(e.iterChangedRanges((f,u,g,d)=>M.push({fromA:f,toA:u,fromB:g,toB:d})),s=TreeFragment.applyChanges(s,M),l=Tree.empty,o=0,a={from:e.mapPos(a.from,-1),to:e.mapPos(a.to,1)},this.skipped.length){c=[];for(let f of this.skipped){let u=e.mapPos(f.from,1),g=e.mapPos(f.to,-1);u<g&&c.push({from:u,to:g})}}}return new ParseContext(this.parser,r,s,l,o,a,c,this.scheduleOn)}updateViewport(e){if(this.viewport.from==e.from&&this.viewport.to==e.to)return!1;this.viewport=e;let r=this.skipped.length;for(let s=0;s<this.skipped.length;s++){let{from:l,to:o}=this.skipped[s];l<e.to&&o>e.from&&(this.fragments=cutFragments(this.fragments,l,o),this.skipped.splice(s--,1))}return this.skipped.length>=r?!1:(this.reset(),!0)}reset(){this.parse&&(this.takeTree(),this.parse=null)}skipUntilInView(e,r){this.skipped.push({from:e,to:r})}static getSkippingParser(e){return new class extends Parser{createParse(r,s,l){let o=l[0].from,a=l[l.length-1].to;return{parsedPos:o,advance(){let M=currentContext;if(M){for(let f of l)M.tempSkipped.push(f);e&&(M.scheduleOn=M.scheduleOn?Promise.all([M.scheduleOn,e]):e)}return this.parsedPos=a,new Tree(NodeType.none,[],[],a-o)},stoppedAt:null,stopAt(){}}}}}isDone(e){e=Math.min(e,this.state.doc.length);let r=this.fragments;return this.treeLen>=e&&r.length&&r[0].from==0&&r[0].to>=e}static get(){return currentContext}}function cutFragments(h,e,r){return TreeFragment.applyChanges(h,[{fromA:e,toA:r,fromB:e,toB:r}])}class LanguageState{constructor(e){this.context=e,this.tree=e.tree}apply(e){if(!e.docChanged&&this.tree==this.context.tree)return this;let r=this.context.changes(e.changes,e.state),s=this.context.treeLen==e.startState.doc.length?void 0:Math.max(e.changes.mapPos(this.context.treeLen),r.viewport.to);return r.work(20,s)||r.takeTree(),new LanguageState(r)}static init(e){let r=Math.min(3e3,e.doc.length),s=ParseContext.create(e.facet(language).parser,e,{from:0,to:r});return s.work(20,r)||s.takeTree(),new LanguageState(s)}}Language.state=StateField.define({create:LanguageState.init,update(h,e){for(let r of e.effects)if(r.is(Language.setState))return r.value;return e.startState.facet(language)!=e.state.facet(language)?LanguageState.init(e.state):h.apply(e)}});let requestIdle=h=>{let e=setTimeout(()=>h(),500);return()=>clearTimeout(e)};typeof requestIdleCallback<"u"&&(requestIdle=h=>{let e=-1,r=setTimeout(()=>{e=requestIdleCallback(h,{timeout:500-100})},100);return()=>e<0?clearTimeout(r):cancelIdleCallback(e)});const isInputPending=typeof navigator<"u"&&(!((_a=navigator.scheduling)===null||_a===void 0)&&_a.isInputPending)?()=>navigator.scheduling.isInputPending():null,parseWorker=ViewPlugin.fromClass(class{constructor(e){this.view=e,this.working=null,this.workScheduled=0,this.chunkEnd=-1,this.chunkBudget=-1,this.work=this.work.bind(this),this.scheduleWork()}update(e){let r=this.view.state.field(Language.state).context;(r.updateViewport(e.view.viewport)||this.view.viewport.to>r.treeLen)&&this.scheduleWork(),e.docChanged&&(this.view.hasFocus&&(this.chunkBudget+=50),this.scheduleWork()),this.checkAsyncSchedule(r)}scheduleWork(){if(this.working)return;let{state:e}=this.view,r=e.field(Language.state);(r.tree!=r.context.tree||!r.context.isDone(e.doc.length))&&(this.working=requestIdle(this.work))}work(e){this.working=null;let r=Date.now();if(this.chunkEnd<r&&(this.chunkEnd<0||this.view.hasFocus)&&(this.chunkEnd=r+3e4,this.chunkBudget=3e3),this.chunkBudget<=0)return;let{state:s,viewport:{to:l}}=this.view,o=s.field(Language.state);if(o.tree==o.context.tree&&o.context.isDone(l+1e5))return;let a=Date.now()+Math.min(this.chunkBudget,100,e&&!isInputPending?Math.max(25,e.timeRemaining()-5):1e9),c=o.context.treeLen<l&&s.doc.length>l+1e3,M=o.context.work(()=>isInputPending&&isInputPending()||Date.now()>a,l+(c?0:1e5));this.chunkBudget-=Date.now()-r,(M||this.chunkBudget<=0)&&(o.context.takeTree(),this.view.dispatch({effects:Language.setState.of(new LanguageState(o.context))})),this.chunkBudget>0&&!(M&&!c)&&this.scheduleWork(),this.checkAsyncSchedule(o.context)}checkAsyncSchedule(e){e.scheduleOn&&(this.workScheduled++,e.scheduleOn.then(()=>this.scheduleWork()).catch(r=>logException(this.view.state,r)).then(()=>this.workScheduled--),e.scheduleOn=null)}destroy(){this.working&&this.working()}isWorking(){return!!(this.working||this.workScheduled>0)}},{eventHandlers:{focus(){this.scheduleWork()}}}),language=Facet.define({combine(h){return h.length?h[0]:null},enables:h=>[Language.state,parseWorker,EditorView.contentAttributes.compute([h],e=>{let r=e.facet(h);return r&&r.name?{"data-language":r.name}:{}})]});class LanguageSupport{constructor(e,r=[]){this.language=e,this.support=r,this.extension=[e,r]}}const indentService=Facet.define(),indentUnit=Facet.define({combine:h=>{if(!h.length)return"  ";let e=h[0];if(!e||/\S/.test(e)||Array.from(e).some(r=>r!=e[0]))throw new Error("Invalid indent unit: "+JSON.stringify(h[0]));return e}});function getIndentUnit(h){let e=h.facet(indentUnit);return e.charCodeAt(0)==9?h.tabSize*e.length:e.length}function indentString(h,e){let r="",s=h.tabSize,l=h.facet(indentUnit)[0];if(l=="	"){for(;e>=s;)r+="	",e-=s;l=" "}for(let o=0;o<e;o++)r+=l;return r}function getIndentation(h,e){h instanceof EditorState&&(h=new IndentContext(h));for(let s of h.state.facet(indentService)){let l=s(h,e);if(l!==void 0)return l}let r=syntaxTree(h.state);return r.length>=e?syntaxIndentation(h,r,e):null}class IndentContext{constructor(e,r={}){this.state=e,this.options=r,this.unit=getIndentUnit(e)}lineAt(e,r=1){let s=this.state.doc.lineAt(e),{simulateBreak:l,simulateDoubleBreak:o}=this.options;return l!=null&&l>=s.from&&l<=s.to?o&&l==e?{text:"",from:e}:(r<0?l<e:l<=e)?{text:s.text.slice(l-s.from),from:l}:{text:s.text.slice(0,l-s.from),from:s.from}:s}textAfterPos(e,r=1){if(this.options.simulateDoubleBreak&&e==this.options.simulateBreak)return"";let{text:s,from:l}=this.lineAt(e,r);return s.slice(e-l,Math.min(s.length,e+100-l))}column(e,r=1){let{text:s,from:l}=this.lineAt(e,r),o=this.countColumn(s,e-l),a=this.options.overrideIndentation?this.options.overrideIndentation(l):-1;return a>-1&&(o+=a-this.countColumn(s,s.search(/\S|$/))),o}countColumn(e,r=e.length){return countColumn(e,this.state.tabSize,r)}lineIndent(e,r=1){let{text:s,from:l}=this.lineAt(e,r),o=this.options.overrideIndentation;if(o){let a=o(l);if(a>-1)return a}return this.countColumn(s,s.search(/\S|$/))}get simulatedBreak(){return this.options.simulateBreak||null}}const indentNodeProp=new NodeProp;function syntaxIndentation(h,e,r){return indentFrom(e.resolveInner(r).enterUnfinishedNodesBefore(r),r,h)}function ignoreClosed(h){return h.pos==h.options.simulateBreak&&h.options.simulateDoubleBreak}function indentStrategy(h){let e=h.type.prop(indentNodeProp);if(e)return e;let r=h.firstChild,s;if(r&&(s=r.type.prop(NodeProp.closedBy))){let l=h.lastChild,o=l&&s.indexOf(l.name)>-1;return a=>delimitedStrategy(a,!0,1,void 0,o&&!ignoreClosed(a)?l.from:void 0)}return h.parent==null?topIndent:null}function indentFrom(h,e,r){for(;h;h=h.parent){let s=indentStrategy(h);if(s)return s(TreeIndentContext.create(r,e,h))}return null}function topIndent(){return 0}class TreeIndentContext extends IndentContext{constructor(e,r,s){super(e.state,e.options),this.base=e,this.pos=r,this.node=s}static create(e,r,s){return new TreeIndentContext(e,r,s)}get textAfter(){return this.textAfterPos(this.pos)}get baseIndent(){return this.baseIndentFor(this.node)}baseIndentFor(e){let r=this.state.doc.lineAt(e.from);for(;;){let s=e.resolve(r.from);for(;s.parent&&s.parent.from==s.from;)s=s.parent;if(isParent(s,e))break;r=this.state.doc.lineAt(s.from)}return this.lineIndent(r.from)}continue(){let e=this.node.parent;return e?indentFrom(e,this.pos,this.base):0}}function isParent(h,e){for(let r=e;r;r=r.parent)if(h==r)return!0;return!1}function bracketedAligned(h){let e=h.node,r=e.childAfter(e.from),s=e.lastChild;if(!r)return null;let l=h.options.simulateBreak,o=h.state.doc.lineAt(r.from),a=l==null||l<=o.from?o.to:Math.min(o.to,l);for(let c=r.to;;){let M=e.childAfter(c);if(!M||M==s)return null;if(!M.type.isSkipped)return M.from<a?r:null;c=M.to}}function delimitedStrategy(h,e,r,s,l){let o=h.textAfter,a=o.match(/^\s*/)[0].length,c=s&&o.slice(a,a+s.length)==s||l==h.pos+a,M=e?bracketedAligned(h):null;return M?c?h.column(M.from):h.column(M.to):h.baseIndent+(c?0:h.unit*r)}const DontIndentBeyond=200;function indentOnInput(){return EditorState.transactionFilter.of(h=>{if(!h.docChanged||!h.isUserEvent("input.type")&&!h.isUserEvent("input.complete"))return h;let e=h.startState.languageDataAt("indentOnInput",h.startState.selection.main.head);if(!e.length)return h;let r=h.newDoc,{head:s}=h.newSelection.main,l=r.lineAt(s);if(s>l.from+DontIndentBeyond)return h;let o=r.sliceString(l.from,s);if(!e.some(f=>f.test(o)))return h;let{state:a}=h,c=-1,M=[];for(let{head:f}of a.selection.ranges){let u=a.doc.lineAt(f);if(u.from==c)continue;c=u.from;let g=getIndentation(a,u.from);if(g==null)continue;let d=/^\s*/.exec(u.text)[0],p=indentString(a,g);d!=p&&M.push({from:u.from,to:u.from+d.length,insert:p})}return M.length?[h,{changes:M,sequential:!0}]:h})}const foldService=Facet.define(),foldNodeProp=new NodeProp;function foldInside(h){let e=h.firstChild,r=h.lastChild;return e&&e.to<r.from?{from:e.to,to:r.type.isError?h.to:r.from}:null}function syntaxFolding(h,e,r){let s=syntaxTree(h);if(s.length<r)return null;let l=s.resolveInner(r,1),o=null;for(let a=l;a;a=a.parent){if(a.to<=r||a.from>r)continue;if(o&&a.from<e)break;let c=a.type.prop(foldNodeProp);if(c&&(a.to<s.length-50||s.length==h.doc.length||!isUnfinished(a))){let M=c(a,h);M&&M.from<=r&&M.from>=e&&M.to>r&&(o=M)}}return o}function isUnfinished(h){let e=h.lastChild;return e&&e.to==h.to&&e.type.isError}function foldable(h,e,r){for(let s of h.facet(foldService)){let l=s(h,e,r);if(l)return l}return syntaxFolding(h,e,r)}function mapRange(h,e){let r=e.mapPos(h.from,1),s=e.mapPos(h.to,-1);return r>=s?void 0:{from:r,to:s}}const foldEffect=StateEffect.define({map:mapRange}),unfoldEffect=StateEffect.define({map:mapRange});function selectedLines(h){let e=[];for(let{head:r}of h.state.selection.ranges)e.some(s=>s.from<=r&&s.to>=r)||e.push(h.lineBlockAt(r));return e}const foldState=StateField.define({create(){return Decoration.none},update(h,e){h=h.map(e.changes);for(let r of e.effects)if(r.is(foldEffect)&&!foldExists(h,r.value.from,r.value.to)){let{preparePlaceholder:s}=e.state.facet(foldConfig),l=s?Decoration.replace({widget:new PreparedFoldWidget(s(e.state,r.value))}):foldWidget;h=h.update({add:[l.range(r.value.from,r.value.to)]})}else r.is(unfoldEffect)&&(h=h.update({filter:(s,l)=>r.value.from!=s||r.value.to!=l,filterFrom:r.value.from,filterTo:r.value.to}));if(e.selection){let r=!1,{head:s}=e.selection.main;h.between(s,s,(l,o)=>{l<s&&o>s&&(r=!0)}),r&&(h=h.update({filterFrom:s,filterTo:s,filter:(l,o)=>o<=s||l>=s}))}return h},provide:h=>EditorView.decorations.from(h),toJSON(h,e){let r=[];return h.between(0,e.doc.length,(s,l)=>{r.push(s,l)}),r},fromJSON(h){if(!Array.isArray(h)||h.length%2)throw new RangeError("Invalid JSON for fold state");let e=[];for(let r=0;r<h.length;){let s=h[r++],l=h[r++];if(typeof s!="number"||typeof l!="number")throw new RangeError("Invalid JSON for fold state");e.push(foldWidget.range(s,l))}return Decoration.set(e,!0)}});function findFold(h,e,r){var s;let l=null;return(s=h.field(foldState,!1))===null||s===void 0||s.between(e,r,(o,a)=>{(!l||l.from>o)&&(l={from:o,to:a})}),l}function foldExists(h,e,r){let s=!1;return h.between(e,e,(l,o)=>{l==e&&o==r&&(s=!0)}),s}function maybeEnable(h,e){return h.field(foldState,!1)?e:e.concat(StateEffect.appendConfig.of(codeFolding()))}const foldCode=h=>{for(let e of selectedLines(h)){let r=foldable(h.state,e.from,e.to);if(r)return h.dispatch({effects:maybeEnable(h.state,[foldEffect.of(r),announceFold(h,r)])}),!0}return!1},unfoldCode=h=>{if(!h.state.field(foldState,!1))return!1;let e=[];for(let r of selectedLines(h)){let s=findFold(h.state,r.from,r.to);s&&e.push(unfoldEffect.of(s),announceFold(h,s,!1))}return e.length&&h.dispatch({effects:e}),e.length>0};function announceFold(h,e,r=!0){let s=h.state.doc.lineAt(e.from).number,l=h.state.doc.lineAt(e.to).number;return EditorView.announce.of(`${h.state.phrase(r?"Folded lines":"Unfolded lines")} ${s} ${h.state.phrase("to")} ${l}.`)}const foldAll=h=>{let{state:e}=h,r=[];for(let s=0;s<e.doc.length;){let l=h.lineBlockAt(s),o=foldable(e,l.from,l.to);o&&r.push(foldEffect.of(o)),s=(o?h.lineBlockAt(o.to):l).to+1}return r.length&&h.dispatch({effects:maybeEnable(h.state,r)}),!!r.length},unfoldAll=h=>{let e=h.state.field(foldState,!1);if(!e||!e.size)return!1;let r=[];return e.between(0,h.state.doc.length,(s,l)=>{r.push(unfoldEffect.of({from:s,to:l}))}),h.dispatch({effects:r}),!0},foldKeymap=[{key:"Ctrl-Shift-[",mac:"Cmd-Alt-[",run:foldCode},{key:"Ctrl-Shift-]",mac:"Cmd-Alt-]",run:unfoldCode},{key:"Ctrl-Alt-[",run:foldAll},{key:"Ctrl-Alt-]",run:unfoldAll}],defaultConfig={placeholderDOM:null,preparePlaceholder:null,placeholderText:"…"},foldConfig=Facet.define({combine(h){return combineConfig(h,defaultConfig)}});function codeFolding(h){let e=[foldState,baseTheme$1$2];return h&&e.push(foldConfig.of(h)),e}function widgetToDOM(h,e){let{state:r}=h,s=r.facet(foldConfig),l=a=>{let c=h.lineBlockAt(h.posAtDOM(a.target)),M=findFold(h.state,c.from,c.to);M&&h.dispatch({effects:unfoldEffect.of(M)}),a.preventDefault()};if(s.placeholderDOM)return s.placeholderDOM(h,l,e);let o=document.createElement("span");return o.textContent=s.placeholderText,o.setAttribute("aria-label",r.phrase("folded code")),o.title=r.phrase("unfold"),o.className="cm-foldPlaceholder",o.onclick=l,o}const foldWidget=Decoration.replace({widget:new class extends WidgetType{toDOM(h){return widgetToDOM(h,null)}}});class PreparedFoldWidget extends WidgetType{constructor(e){super(),this.value=e}eq(e){return this.value==e.value}toDOM(e){return widgetToDOM(e,this.value)}}const foldGutterDefaults={openText:"⌄",closedText:"›",markerDOM:null,domEventHandlers:{},foldingChanged:()=>!1};class FoldMarker extends GutterMarker{constructor(e,r){super(),this.config=e,this.open=r}eq(e){return this.config==e.config&&this.open==e.open}toDOM(e){if(this.config.markerDOM)return this.config.markerDOM(this.open);let r=document.createElement("span");return r.textContent=this.open?this.config.openText:this.config.closedText,r.title=e.state.phrase(this.open?"Fold line":"Unfold line"),r}}function foldGutter(h={}){let e=Object.assign(Object.assign({},foldGutterDefaults),h),r=new FoldMarker(e,!0),s=new FoldMarker(e,!1),l=ViewPlugin.fromClass(class{constructor(a){this.from=a.viewport.from,this.markers=this.buildMarkers(a)}update(a){(a.docChanged||a.viewportChanged||a.startState.facet(language)!=a.state.facet(language)||a.startState.field(foldState,!1)!=a.state.field(foldState,!1)||syntaxTree(a.startState)!=syntaxTree(a.state)||e.foldingChanged(a))&&(this.markers=this.buildMarkers(a.view))}buildMarkers(a){let c=new RangeSetBuilder;for(let M of a.viewportLineBlocks){let f=findFold(a.state,M.from,M.to)?s:foldable(a.state,M.from,M.to)?r:null;f&&c.add(M.from,M.from,f)}return c.finish()}}),{domEventHandlers:o}=e;return[l,gutter({class:"cm-foldGutter",markers(a){var c;return((c=a.plugin(l))===null||c===void 0?void 0:c.markers)||RangeSet.empty},initialSpacer(){return new FoldMarker(e,!1)},domEventHandlers:Object.assign(Object.assign({},o),{click:(a,c,M)=>{if(o.click&&o.click(a,c,M))return!0;let f=findFold(a.state,c.from,c.to);if(f)return a.dispatch({effects:unfoldEffect.of(f)}),!0;let u=foldable(a.state,c.from,c.to);return u?(a.dispatch({effects:foldEffect.of(u)}),!0):!1}})}),codeFolding()]}const baseTheme$1$2=EditorView.baseTheme({".cm-foldPlaceholder":{backgroundColor:"#eee",border:"1px solid #ddd",color:"#888",borderRadius:".2em",margin:"0 1px",padding:"0 1px",cursor:"pointer"},".cm-foldGutter span":{padding:"0 1px",cursor:"pointer"}});class HighlightStyle{constructor(e,r){this.specs=e;let s;function l(c){let M=StyleModule.newName();return(s||(s=Object.create(null)))["."+M]=c,M}const o=typeof r.all=="string"?r.all:r.all?l(r.all):void 0,a=r.scope;this.scope=a instanceof Language?c=>c.prop(languageDataProp)==a.data:a?c=>c==a:void 0,this.style=tagHighlighter(e.map(c=>({tag:c.tag,class:c.class||l(Object.assign({},c,{tag:null}))})),{all:o}).style,this.module=s?new StyleModule(s):null,this.themeType=r.themeType}static define(e,r){return new HighlightStyle(e,r||{})}}const highlighterFacet=Facet.define(),fallbackHighlighter=Facet.define({combine(h){return h.length?[h[0]]:null}});function getHighlighters(h){let e=h.facet(highlighterFacet);return e.length?e:h.facet(fallbackHighlighter)}function syntaxHighlighting(h,e){let r=[treeHighlighter],s;return h instanceof HighlightStyle&&(h.module&&r.push(EditorView.styleModule.of(h.module)),s=h.themeType),e!=null&&e.fallback?r.push(fallbackHighlighter.of(h)):s?r.push(highlighterFacet.computeN([EditorView.darkTheme],l=>l.facet(EditorView.darkTheme)==(s=="dark")?[h]:[])):r.push(highlighterFacet.of(h)),r}class TreeHighlighter{constructor(e){this.markCache=Object.create(null),this.tree=syntaxTree(e.state),this.decorations=this.buildDeco(e,getHighlighters(e.state))}update(e){let r=syntaxTree(e.state),s=getHighlighters(e.state),l=s!=getHighlighters(e.startState);r.length<e.view.viewport.to&&!l&&r.type==this.tree.type?this.decorations=this.decorations.map(e.changes):(r!=this.tree||e.viewportChanged||l)&&(this.tree=r,this.decorations=this.buildDeco(e.view,s))}buildDeco(e,r){if(!r||!this.tree.length)return Decoration.none;let s=new RangeSetBuilder;for(let{from:l,to:o}of e.visibleRanges)highlightTree(this.tree,r,(a,c,M)=>{s.add(a,c,this.markCache[M]||(this.markCache[M]=Decoration.mark({class:M})))},l,o);return s.finish()}}const treeHighlighter=Prec.high(ViewPlugin.fromClass(TreeHighlighter,{decorations:h=>h.decorations})),defaultHighlightStyle=HighlightStyle.define([{tag:tags.meta,color:"#404740"},{tag:tags.link,textDecoration:"underline"},{tag:tags.heading,textDecoration:"underline",fontWeight:"bold"},{tag:tags.emphasis,fontStyle:"italic"},{tag:tags.strong,fontWeight:"bold"},{tag:tags.strikethrough,textDecoration:"line-through"},{tag:tags.keyword,color:"#708"},{tag:[tags.atom,tags.bool,tags.url,tags.contentSeparator,tags.labelName],color:"#219"},{tag:[tags.literal,tags.inserted],color:"#164"},{tag:[tags.string,tags.deleted],color:"#a11"},{tag:[tags.regexp,tags.escape,tags.special(tags.string)],color:"#e40"},{tag:tags.definition(tags.variableName),color:"#00f"},{tag:tags.local(tags.variableName),color:"#30a"},{tag:[tags.typeName,tags.namespace],color:"#085"},{tag:tags.className,color:"#167"},{tag:[tags.special(tags.variableName),tags.macroName],color:"#256"},{tag:tags.definition(tags.propertyName),color:"#00c"},{tag:tags.comment,color:"#940"},{tag:tags.invalid,color:"#f00"}]),baseTheme$3=EditorView.baseTheme({"&.cm-focused .cm-matchingBracket":{backgroundColor:"#328c8252"},"&.cm-focused .cm-nonmatchingBracket":{backgroundColor:"#bb555544"}}),DefaultScanDist=1e4,DefaultBrackets="()[]{}",bracketMatchingConfig=Facet.define({combine(h){return combineConfig(h,{afterCursor:!0,brackets:DefaultBrackets,maxScanDistance:DefaultScanDist,renderMatch:defaultRenderMatch})}}),matchingMark=Decoration.mark({class:"cm-matchingBracket"}),nonmatchingMark=Decoration.mark({class:"cm-nonmatchingBracket"});function defaultRenderMatch(h){let e=[],r=h.matched?matchingMark:nonmatchingMark;return e.push(r.range(h.start.from,h.start.to)),h.end&&e.push(r.range(h.end.from,h.end.to)),e}const bracketMatchingState=StateField.define({create(){return Decoration.none},update(h,e){if(!e.docChanged&&!e.selection)return h;let r=[],s=e.state.facet(bracketMatchingConfig);for(let l of e.state.selection.ranges){if(!l.empty)continue;let o=matchBrackets(e.state,l.head,-1,s)||l.head>0&&matchBrackets(e.state,l.head-1,1,s)||s.afterCursor&&(matchBrackets(e.state,l.head,1,s)||l.head<e.state.doc.length&&matchBrackets(e.state,l.head+1,-1,s));o&&(r=r.concat(s.renderMatch(o,e.state)))}return Decoration.set(r,!0)},provide:h=>EditorView.decorations.from(h)}),bracketMatchingUnique=[bracketMatchingState,baseTheme$3];function bracketMatching(h={}){return[bracketMatchingConfig.of(h),bracketMatchingUnique]}const bracketMatchingHandle=new NodeProp;function matchingNodes(h,e,r){let s=h.prop(e<0?NodeProp.openedBy:NodeProp.closedBy);if(s)return s;if(h.name.length==1){let l=r.indexOf(h.name);if(l>-1&&l%2==(e<0?1:0))return[r[l+e]]}return null}function findHandle(h){let e=h.type.prop(bracketMatchingHandle);return e?e(h.node):h}function matchBrackets(h,e,r,s={}){let l=s.maxScanDistance||DefaultScanDist,o=s.brackets||DefaultBrackets,a=syntaxTree(h),c=a.resolveInner(e,r);for(let M=c;M;M=M.parent){let f=matchingNodes(M.type,r,o);if(f&&M.from<M.to){let u=findHandle(M);if(u&&(r>0?e>=u.from&&e<u.to:e>u.from&&e<=u.to))return matchMarkedBrackets(h,e,r,M,u,f,o)}}return matchPlainBrackets(h,e,r,a,c.type,l,o)}function matchMarkedBrackets(h,e,r,s,l,o,a){let c=s.parent,M={from:l.from,to:l.to},f=0,u=c==null?void 0:c.cursor();if(u&&(r<0?u.childBefore(s.from):u.childAfter(s.to)))do if(r<0?u.to<=s.from:u.from>=s.to){if(f==0&&o.indexOf(u.type.name)>-1&&u.from<u.to){let g=findHandle(u);return{start:M,end:g?{from:g.from,to:g.to}:void 0,matched:!0}}else if(matchingNodes(u.type,r,a))f++;else if(matchingNodes(u.type,-r,a)){if(f==0){let g=findHandle(u);return{start:M,end:g&&g.from<g.to?{from:g.from,to:g.to}:void 0,matched:!1}}f--}}while(r<0?u.prevSibling():u.nextSibling());return{start:M,matched:!1}}function matchPlainBrackets(h,e,r,s,l,o,a){let c=r<0?h.sliceDoc(e-1,e):h.sliceDoc(e,e+1),M=a.indexOf(c);if(M<0||M%2==0!=r>0)return null;let f={from:r<0?e-1:e,to:r>0?e+1:e},u=h.doc.iterRange(e,r>0?h.doc.length:0),g=0;for(let d=0;!u.next().done&&d<=o;){let p=u.value;r<0&&(d+=p.length);let m=e+d*r;for(let w=r>0?0:p.length-1,y=r>0?p.length:-1;w!=y;w+=r){let b=a.indexOf(p[w]);if(!(b<0||s.resolveInner(m+w,1).type!=l))if(b%2==0==r>0)g++;else{if(g==1)return{start:f,end:{from:m+w,to:m+w+1},matched:b>>1==M>>1};g--}}r>0&&(d+=p.length)}return u.done?{start:f,matched:!1}:null}const noTokens=Object.create(null),typeArray=[NodeType.none],warned=[],defaultTable=Object.create(null);for(let[h,e]of[["variable","variableName"],["variable-2","variableName.special"],["string-2","string.special"],["def","variableName.definition"],["tag","tagName"],["attribute","attributeName"],["type","typeName"],["builtin","variableName.standard"],["qualifier","modifier"],["error","invalid"],["header","heading"],["property","propertyName"]])defaultTable[h]=createTokenType(noTokens,e);function warnForPart(h,e){warned.indexOf(h)>-1||(warned.push(h),console.warn(e))}function createTokenType(h,e){let r=null;for(let o of e.split(".")){let a=h[o]||tags[o];a?typeof a=="function"?r?r=a(r):warnForPart(o,`Modifier ${o} used at start of tag`):r?warnForPart(o,`Tag ${o} used as modifier`):r=a:warnForPart(o,`Unknown highlighting tag ${o}`)}if(!r)return 0;let s=e.replace(/ /g,"_"),l=NodeType.define({id:typeArray.length,name:s,props:[styleTags({[s]:r})]});return typeArray.push(l),l.id}const toggleComment=h=>{let{state:e}=h,r=e.doc.lineAt(e.selection.main.from),s=getConfig(h.state,r.from);return s.line?toggleLineComment(h):s.block?toggleBlockCommentByLine(h):!1};function command(h,e){return({state:r,dispatch:s})=>{if(r.readOnly)return!1;let l=h(e,r);return l?(s(r.update(l)),!0):!1}}const toggleLineComment=command(changeLineComment,0),toggleBlockComment=command(changeBlockComment,0),toggleBlockCommentByLine=command((h,e)=>changeBlockComment(h,e,selectedLineRanges(e)),0);function getConfig(h,e){let r=h.languageDataAt("commentTokens",e);return r.length?r[0]:{}}const SearchMargin=50;function findBlockComment(h,{open:e,close:r},s,l){let o=h.sliceDoc(s-SearchMargin,s),a=h.sliceDoc(l,l+SearchMargin),c=/\s*$/.exec(o)[0].length,M=/^\s*/.exec(a)[0].length,f=o.length-c;if(o.slice(f-e.length,f)==e&&a.slice(M,M+r.length)==r)return{open:{pos:s-c,margin:c&&1},close:{pos:l+M,margin:M&&1}};let u,g;l-s<=2*SearchMargin?u=g=h.sliceDoc(s,l):(u=h.sliceDoc(s,s+SearchMargin),g=h.sliceDoc(l-SearchMargin,l));let d=/^\s*/.exec(u)[0].length,p=/\s*$/.exec(g)[0].length,m=g.length-p-r.length;return u.slice(d,d+e.length)==e&&g.slice(m,m+r.length)==r?{open:{pos:s+d+e.length,margin:/\s/.test(u.charAt(d+e.length))?1:0},close:{pos:l-p-r.length,margin:/\s/.test(g.charAt(m-1))?1:0}}:null}function selectedLineRanges(h){let e=[];for(let r of h.selection.ranges){let s=h.doc.lineAt(r.from),l=r.to<=s.to?s:h.doc.lineAt(r.to),o=e.length-1;o>=0&&e[o].to>s.from?e[o].to=l.to:e.push({from:s.from+/^\s*/.exec(s.text)[0].length,to:l.to})}return e}function changeBlockComment(h,e,r=e.selection.ranges){let s=r.map(o=>getConfig(e,o.from).block);if(!s.every(o=>o))return null;let l=r.map((o,a)=>findBlockComment(e,s[a],o.from,o.to));if(h!=2&&!l.every(o=>o))return{changes:e.changes(r.map((o,a)=>l[a]?[]:[{from:o.from,insert:s[a].open+" "},{from:o.to,insert:" "+s[a].close}]))};if(h!=1&&l.some(o=>o)){let o=[];for(let a=0,c;a<l.length;a++)if(c=l[a]){let M=s[a],{open:f,close:u}=c;o.push({from:f.pos-M.open.length,to:f.pos+f.margin},{from:u.pos-u.margin,to:u.pos+M.close.length})}return{changes:o}}return null}function changeLineComment(h,e,r=e.selection.ranges){let s=[],l=-1;for(let{from:o,to:a}of r){let c=s.length,M=1e9,f=getConfig(e,o).line;if(f){for(let u=o;u<=a;){let g=e.doc.lineAt(u);if(g.from>l&&(o==a||a>g.from)){l=g.from;let d=/^\s*/.exec(g.text)[0].length,p=d==g.length,m=g.text.slice(d,d+f.length)==f?d:-1;d<g.text.length&&d<M&&(M=d),s.push({line:g,comment:m,token:f,indent:d,empty:p,single:!1})}u=g.to+1}if(M<1e9)for(let u=c;u<s.length;u++)s[u].indent<s[u].line.text.length&&(s[u].indent=M);s.length==c+1&&(s[c].single=!0)}}if(h!=2&&s.some(o=>o.comment<0&&(!o.empty||o.single))){let o=[];for(let{line:c,token:M,indent:f,empty:u,single:g}of s)(g||!u)&&o.push({from:c.from+f,insert:M+" "});let a=e.changes(o);return{changes:a,selection:e.selection.map(a,1)}}else if(h!=1&&s.some(o=>o.comment>=0)){let o=[];for(let{line:a,comment:c,token:M}of s)if(c>=0){let f=a.from+c,u=f+M.length;a.text[u-a.from]==" "&&u++,o.push({from:f,to:u})}return{changes:o}}return null}const fromHistory=Annotation.define(),isolateHistory=Annotation.define(),invertedEffects=Facet.define(),historyConfig=Facet.define({combine(h){return combineConfig(h,{minDepth:100,newGroupDelay:500,joinToEvent:(e,r)=>r},{minDepth:Math.max,newGroupDelay:Math.min,joinToEvent:(e,r)=>(s,l)=>e(s,l)||r(s,l)})}});function changeEnd(h){let e=0;return h.iterChangedRanges((r,s)=>e=s),e}const historyField_=StateField.define({create(){return HistoryState.empty},update(h,e){let r=e.state.facet(historyConfig),s=e.annotation(fromHistory);if(s){let M=e.docChanged?EditorSelection.single(changeEnd(e.changes)):void 0,f=HistEvent.fromTransaction(e,M),u=s.side,g=u==0?h.undone:h.done;return f?g=updateBranch(g,g.length,r.minDepth,f):g=addSelection(g,e.startState.selection),new HistoryState(u==0?s.rest:g,u==0?g:s.rest)}let l=e.annotation(isolateHistory);if((l=="full"||l=="before")&&(h=h.isolate()),e.annotation(Transaction.addToHistory)===!1)return e.changes.empty?h:h.addMapping(e.changes.desc);let o=HistEvent.fromTransaction(e),a=e.annotation(Transaction.time),c=e.annotation(Transaction.userEvent);return o?h=h.addChanges(o,a,c,r,e):e.selection&&(h=h.addSelection(e.startState.selection,a,c,r.newGroupDelay)),(l=="full"||l=="after")&&(h=h.isolate()),h},toJSON(h){return{done:h.done.map(e=>e.toJSON()),undone:h.undone.map(e=>e.toJSON())}},fromJSON(h){return new HistoryState(h.done.map(HistEvent.fromJSON),h.undone.map(HistEvent.fromJSON))}});function history(h={}){return[historyField_,historyConfig.of(h),EditorView.domEventHandlers({beforeinput(e,r){let s=e.inputType=="historyUndo"?undo:e.inputType=="historyRedo"?redo:null;return s?(e.preventDefault(),s(r)):!1}})]}function cmd(h,e){return function({state:r,dispatch:s}){if(!e&&r.readOnly)return!1;let l=r.field(historyField_,!1);if(!l)return!1;let o=l.pop(h,r,e);return o?(s(o),!0):!1}}const undo=cmd(0,!1),redo=cmd(1,!1),undoSelection=cmd(0,!0),redoSelection=cmd(1,!0);class HistEvent{constructor(e,r,s,l,o){this.changes=e,this.effects=r,this.mapped=s,this.startSelection=l,this.selectionsAfter=o}setSelAfter(e){return new HistEvent(this.changes,this.effects,this.mapped,this.startSelection,e)}toJSON(){var e,r,s;return{changes:(e=this.changes)===null||e===void 0?void 0:e.toJSON(),mapped:(r=this.mapped)===null||r===void 0?void 0:r.toJSON(),startSelection:(s=this.startSelection)===null||s===void 0?void 0:s.toJSON(),selectionsAfter:this.selectionsAfter.map(l=>l.toJSON())}}static fromJSON(e){return new HistEvent(e.changes&&ChangeSet.fromJSON(e.changes),[],e.mapped&&ChangeDesc.fromJSON(e.mapped),e.startSelection&&EditorSelection.fromJSON(e.startSelection),e.selectionsAfter.map(EditorSelection.fromJSON))}static fromTransaction(e,r){let s=none$1;for(let l of e.startState.facet(invertedEffects)){let o=l(e);o.length&&(s=s.concat(o))}return!s.length&&e.changes.empty?null:new HistEvent(e.changes.invert(e.startState.doc),s,void 0,r||e.startState.selection,none$1)}static selection(e){return new HistEvent(void 0,none$1,void 0,void 0,e)}}function updateBranch(h,e,r,s){let l=e+1>r+20?e-r-1:0,o=h.slice(l,e);return o.push(s),o}function isAdjacent(h,e){let r=[],s=!1;return h.iterChangedRanges((l,o)=>r.push(l,o)),e.iterChangedRanges((l,o,a,c)=>{for(let M=0;M<r.length;){let f=r[M++],u=r[M++];c>=f&&a<=u&&(s=!0)}}),s}function eqSelectionShape(h,e){return h.ranges.length==e.ranges.length&&h.ranges.filter((r,s)=>r.empty!=e.ranges[s].empty).length===0}function conc(h,e){return h.length?e.length?h.concat(e):h:e}const none$1=[],MaxSelectionsPerEvent=200;function addSelection(h,e){if(h.length){let r=h[h.length-1],s=r.selectionsAfter.slice(Math.max(0,r.selectionsAfter.length-MaxSelectionsPerEvent));return s.length&&s[s.length-1].eq(e)?h:(s.push(e),updateBranch(h,h.length-1,1e9,r.setSelAfter(s)))}else return[HistEvent.selection([e])]}function popSelection(h){let e=h[h.length-1],r=h.slice();return r[h.length-1]=e.setSelAfter(e.selectionsAfter.slice(0,e.selectionsAfter.length-1)),r}function addMappingToBranch(h,e){if(!h.length)return h;let r=h.length,s=none$1;for(;r;){let l=mapEvent(h[r-1],e,s);if(l.changes&&!l.changes.empty||l.effects.length){let o=h.slice(0,r);return o[r-1]=l,o}else e=l.mapped,r--,s=l.selectionsAfter}return s.length?[HistEvent.selection(s)]:none$1}function mapEvent(h,e,r){let s=conc(h.selectionsAfter.length?h.selectionsAfter.map(c=>c.map(e)):none$1,r);if(!h.changes)return HistEvent.selection(s);let l=h.changes.map(e),o=e.mapDesc(h.changes,!0),a=h.mapped?h.mapped.composeDesc(o):o;return new HistEvent(l,StateEffect.mapEffects(h.effects,e),a,h.startSelection.map(o),s)}const joinableUserEvent=/^(input\.type|delete)($|\.)/;class HistoryState{constructor(e,r,s=0,l=void 0){this.done=e,this.undone=r,this.prevTime=s,this.prevUserEvent=l}isolate(){return this.prevTime?new HistoryState(this.done,this.undone):this}addChanges(e,r,s,l,o){let a=this.done,c=a[a.length-1];return c&&c.changes&&!c.changes.empty&&e.changes&&(!s||joinableUserEvent.test(s))&&(!c.selectionsAfter.length&&r-this.prevTime<l.newGroupDelay&&l.joinToEvent(o,isAdjacent(c.changes,e.changes))||s=="input.type.compose")?a=updateBranch(a,a.length-1,l.minDepth,new HistEvent(e.changes.compose(c.changes),conc(e.effects,c.effects),c.mapped,c.startSelection,none$1)):a=updateBranch(a,a.length,l.minDepth,e),new HistoryState(a,none$1,r,s)}addSelection(e,r,s,l){let o=this.done.length?this.done[this.done.length-1].selectionsAfter:none$1;return o.length>0&&r-this.prevTime<l&&s==this.prevUserEvent&&s&&/^select($|\.)/.test(s)&&eqSelectionShape(o[o.length-1],e)?this:new HistoryState(addSelection(this.done,e),this.undone,r,s)}addMapping(e){return new HistoryState(addMappingToBranch(this.done,e),addMappingToBranch(this.undone,e),this.prevTime,this.prevUserEvent)}pop(e,r,s){let l=e==0?this.done:this.undone;if(l.length==0)return null;let o=l[l.length-1];if(s&&o.selectionsAfter.length)return r.update({selection:o.selectionsAfter[o.selectionsAfter.length-1],annotations:fromHistory.of({side:e,rest:popSelection(l)}),userEvent:e==0?"select.undo":"select.redo",scrollIntoView:!0});if(o.changes){let a=l.length==1?none$1:l.slice(0,l.length-1);return o.mapped&&(a=addMappingToBranch(a,o.mapped)),r.update({changes:o.changes,selection:o.startSelection,effects:o.effects,annotations:fromHistory.of({side:e,rest:a}),filter:!1,userEvent:e==0?"undo":"redo",scrollIntoView:!0})}else return null}}HistoryState.empty=new HistoryState(none$1,none$1);const historyKeymap=[{key:"Mod-z",run:undo,preventDefault:!0},{key:"Mod-y",mac:"Mod-Shift-z",run:redo,preventDefault:!0},{linux:"Ctrl-Shift-z",run:redo,preventDefault:!0},{key:"Mod-u",run:undoSelection,preventDefault:!0},{key:"Alt-u",mac:"Mod-Shift-u",run:redoSelection,preventDefault:!0}];function updateSel(h,e){return EditorSelection.create(h.ranges.map(e),h.mainIndex)}function setSel(h,e){return h.update({selection:e,scrollIntoView:!0,userEvent:"select"})}function moveSel({state:h,dispatch:e},r){let s=updateSel(h.selection,r);return s.eq(h.selection)?!1:(e(setSel(h,s)),!0)}function rangeEnd(h,e){return EditorSelection.cursor(e?h.to:h.from)}function cursorByChar(h,e){return moveSel(h,r=>r.empty?h.moveByChar(r,e):rangeEnd(r,e))}function ltrAtCursor(h){return h.textDirectionAt(h.state.selection.main.head)==Direction.LTR}const cursorCharLeft=h=>cursorByChar(h,!ltrAtCursor(h)),cursorCharRight=h=>cursorByChar(h,ltrAtCursor(h));function cursorByGroup(h,e){return moveSel(h,r=>r.empty?h.moveByGroup(r,e):rangeEnd(r,e))}const cursorGroupLeft=h=>cursorByGroup(h,!ltrAtCursor(h)),cursorGroupRight=h=>cursorByGroup(h,ltrAtCursor(h));function interestingNode(h,e,r){if(e.type.prop(r))return!0;let s=e.to-e.from;return s&&(s>2||/[^\s,.;:]/.test(h.sliceDoc(e.from,e.to)))||e.firstChild}function moveBySyntax(h,e,r){let s=syntaxTree(h).resolveInner(e.head),l=r?NodeProp.closedBy:NodeProp.openedBy;for(let M=e.head;;){let f=r?s.childAfter(M):s.childBefore(M);if(!f)break;interestingNode(h,f,l)?s=f:M=r?f.to:f.from}let o=s.type.prop(l),a,c;return o&&(a=r?matchBrackets(h,s.from,1):matchBrackets(h,s.to,-1))&&a.matched?c=r?a.end.to:a.end.from:c=r?s.to:s.from,EditorSelection.cursor(c,r?-1:1)}const cursorSyntaxLeft=h=>moveSel(h,e=>moveBySyntax(h.state,e,!ltrAtCursor(h))),cursorSyntaxRight=h=>moveSel(h,e=>moveBySyntax(h.state,e,ltrAtCursor(h)));function cursorByLine(h,e){return moveSel(h,r=>{if(!r.empty)return rangeEnd(r,e);let s=h.moveVertically(r,e);return s.head!=r.head?s:h.moveToLineBoundary(r,e)})}const cursorLineUp=h=>cursorByLine(h,!1),cursorLineDown=h=>cursorByLine(h,!0);function pageInfo(h){let e=h.scrollDOM.clientHeight<h.scrollDOM.scrollHeight-2,r=0,s=0,l;if(e){for(let o of h.state.facet(EditorView.scrollMargins)){let a=o(h);a!=null&&a.top&&(r=Math.max(a==null?void 0:a.top,r)),a!=null&&a.bottom&&(s=Math.max(a==null?void 0:a.bottom,s))}l=h.scrollDOM.clientHeight-r-s}else l=(h.dom.ownerDocument.defaultView||window).innerHeight;return{marginTop:r,marginBottom:s,selfScroll:e,height:Math.max(h.defaultLineHeight,l-5)}}function cursorByPage(h,e){let r=pageInfo(h),{state:s}=h,l=updateSel(s.selection,a=>a.empty?h.moveVertically(a,e,r.height):rangeEnd(a,e));if(l.eq(s.selection))return!1;let o;if(r.selfScroll){let a=h.coordsAtPos(s.selection.main.head),c=h.scrollDOM.getBoundingClientRect(),M=c.top+r.marginTop,f=c.bottom-r.marginBottom;a&&a.top>M&&a.bottom<f&&(o=EditorView.scrollIntoView(l.main.head,{y:"start",yMargin:a.top-M}))}return h.dispatch(setSel(s,l),{effects:o}),!0}const cursorPageUp=h=>cursorByPage(h,!1),cursorPageDown=h=>cursorByPage(h,!0);function moveByLineBoundary(h,e,r){let s=h.lineBlockAt(e.head),l=h.moveToLineBoundary(e,r);if(l.head==e.head&&l.head!=(r?s.to:s.from)&&(l=h.moveToLineBoundary(e,r,!1)),!r&&l.head==s.from&&s.length){let o=/^\s*/.exec(h.state.sliceDoc(s.from,Math.min(s.from+100,s.to)))[0].length;o&&e.head!=s.from+o&&(l=EditorSelection.cursor(s.from+o))}return l}const cursorLineBoundaryForward=h=>moveSel(h,e=>moveByLineBoundary(h,e,!0)),cursorLineBoundaryBackward=h=>moveSel(h,e=>moveByLineBoundary(h,e,!1)),cursorLineBoundaryLeft=h=>moveSel(h,e=>moveByLineBoundary(h,e,!ltrAtCursor(h))),cursorLineBoundaryRight=h=>moveSel(h,e=>moveByLineBoundary(h,e,ltrAtCursor(h))),cursorLineStart=h=>moveSel(h,e=>EditorSelection.cursor(h.lineBlockAt(e.head).from,1)),cursorLineEnd=h=>moveSel(h,e=>EditorSelection.cursor(h.lineBlockAt(e.head).to,-1));function toMatchingBracket(h,e,r){let s=!1,l=updateSel(h.selection,o=>{let a=matchBrackets(h,o.head,-1)||matchBrackets(h,o.head,1)||o.head>0&&matchBrackets(h,o.head-1,1)||o.head<h.doc.length&&matchBrackets(h,o.head+1,-1);if(!a||!a.end)return o;s=!0;let c=a.start.from==o.head?a.end.to:a.end.from;return r?EditorSelection.range(o.anchor,c):EditorSelection.cursor(c)});return s?(e(setSel(h,l)),!0):!1}const cursorMatchingBracket=({state:h,dispatch:e})=>toMatchingBracket(h,e,!1);function extendSel(h,e){let r=updateSel(h.state.selection,s=>{let l=e(s);return EditorSelection.range(s.anchor,l.head,l.goalColumn,l.bidiLevel||void 0)});return r.eq(h.state.selection)?!1:(h.dispatch(setSel(h.state,r)),!0)}function selectByChar(h,e){return extendSel(h,r=>h.moveByChar(r,e))}const selectCharLeft=h=>selectByChar(h,!ltrAtCursor(h)),selectCharRight=h=>selectByChar(h,ltrAtCursor(h));function selectByGroup(h,e){return extendSel(h,r=>h.moveByGroup(r,e))}const selectGroupLeft=h=>selectByGroup(h,!ltrAtCursor(h)),selectGroupRight=h=>selectByGroup(h,ltrAtCursor(h)),selectSyntaxLeft=h=>extendSel(h,e=>moveBySyntax(h.state,e,!ltrAtCursor(h))),selectSyntaxRight=h=>extendSel(h,e=>moveBySyntax(h.state,e,ltrAtCursor(h)));function selectByLine(h,e){return extendSel(h,r=>h.moveVertically(r,e))}const selectLineUp=h=>selectByLine(h,!1),selectLineDown=h=>selectByLine(h,!0);function selectByPage(h,e){return extendSel(h,r=>h.moveVertically(r,e,pageInfo(h).height))}const selectPageUp=h=>selectByPage(h,!1),selectPageDown=h=>selectByPage(h,!0),selectLineBoundaryForward=h=>extendSel(h,e=>moveByLineBoundary(h,e,!0)),selectLineBoundaryBackward=h=>extendSel(h,e=>moveByLineBoundary(h,e,!1)),selectLineBoundaryLeft=h=>extendSel(h,e=>moveByLineBoundary(h,e,!ltrAtCursor(h))),selectLineBoundaryRight=h=>extendSel(h,e=>moveByLineBoundary(h,e,ltrAtCursor(h))),selectLineStart=h=>extendSel(h,e=>EditorSelection.cursor(h.lineBlockAt(e.head).from)),selectLineEnd=h=>extendSel(h,e=>EditorSelection.cursor(h.lineBlockAt(e.head).to)),cursorDocStart=({state:h,dispatch:e})=>(e(setSel(h,{anchor:0})),!0),cursorDocEnd=({state:h,dispatch:e})=>(e(setSel(h,{anchor:h.doc.length})),!0),selectDocStart=({state:h,dispatch:e})=>(e(setSel(h,{anchor:h.selection.main.anchor,head:0})),!0),selectDocEnd=({state:h,dispatch:e})=>(e(setSel(h,{anchor:h.selection.main.anchor,head:h.doc.length})),!0),selectAll=({state:h,dispatch:e})=>(e(h.update({selection:{anchor:0,head:h.doc.length},userEvent:"select"})),!0),selectLine=({state:h,dispatch:e})=>{let r=selectedLineBlocks(h).map(({from:s,to:l})=>EditorSelection.range(s,Math.min(l+1,h.doc.length)));return e(h.update({selection:EditorSelection.create(r),userEvent:"select"})),!0},selectParentSyntax=({state:h,dispatch:e})=>{let r=updateSel(h.selection,s=>{var l;let o=syntaxTree(h).resolveInner(s.head,1);for(;!(o.from<s.from&&o.to>=s.to||o.to>s.to&&o.from<=s.from||!(!((l=o.parent)===null||l===void 0)&&l.parent));)o=o.parent;return EditorSelection.range(o.to,o.from)});return e(setSel(h,r)),!0},simplifySelection=({state:h,dispatch:e})=>{let r=h.selection,s=null;return r.ranges.length>1?s=EditorSelection.create([r.main]):r.main.empty||(s=EditorSelection.create([EditorSelection.cursor(r.main.head)])),s?(e(setSel(h,s)),!0):!1};function deleteBy(h,e){if(h.state.readOnly)return!1;let r="delete.selection",{state:s}=h,l=s.changeByRange(o=>{let{from:a,to:c}=o;if(a==c){let M=e(a);M<a?(r="delete.backward",M=skipAtomic(h,M,!1)):M>a&&(r="delete.forward",M=skipAtomic(h,M,!0)),a=Math.min(a,M),c=Math.max(c,M)}else a=skipAtomic(h,a,!1),c=skipAtomic(h,c,!0);return a==c?{range:o}:{changes:{from:a,to:c},range:EditorSelection.cursor(a)}});return l.changes.empty?!1:(h.dispatch(s.update(l,{scrollIntoView:!0,userEvent:r,effects:r=="delete.selection"?EditorView.announce.of(s.phrase("Selection deleted")):void 0})),!0)}function skipAtomic(h,e,r){if(h instanceof EditorView)for(let s of h.state.facet(EditorView.atomicRanges).map(l=>l(h)))s.between(e,e,(l,o)=>{l<e&&o>e&&(e=r?o:l)});return e}const deleteByChar=(h,e)=>deleteBy(h,r=>{let{state:s}=h,l=s.doc.lineAt(r),o,a;if(!e&&r>l.from&&r<l.from+200&&!/[^ \t]/.test(o=l.text.slice(0,r-l.from))){if(o[o.length-1]=="	")return r-1;let c=countColumn(o,s.tabSize),M=c%getIndentUnit(s)||getIndentUnit(s);for(let f=0;f<M&&o[o.length-1-f]==" ";f++)r--;a=r}else a=findClusterBreak(l.text,r-l.from,e,e)+l.from,a==r&&l.number!=(e?s.doc.lines:1)&&(a+=e?1:-1);return a}),deleteCharBackward=h=>deleteByChar(h,!1),deleteCharForward=h=>deleteByChar(h,!0),deleteByGroup=(h,e)=>deleteBy(h,r=>{let s=r,{state:l}=h,o=l.doc.lineAt(s),a=l.charCategorizer(s);for(let c=null;;){if(s==(e?o.to:o.from)){s==r&&o.number!=(e?l.doc.lines:1)&&(s+=e?1:-1);break}let M=findClusterBreak(o.text,s-o.from,e)+o.from,f=o.text.slice(Math.min(s,M)-o.from,Math.max(s,M)-o.from),u=a(f);if(c!=null&&u!=c)break;(f!=" "||s!=r)&&(c=u),s=M}return s}),deleteGroupBackward=h=>deleteByGroup(h,!1),deleteGroupForward=h=>deleteByGroup(h,!0),deleteToLineEnd=h=>deleteBy(h,e=>{let r=h.lineBlockAt(e).to;return e<r?r:Math.min(h.state.doc.length,e+1)}),deleteToLineStart=h=>deleteBy(h,e=>{let r=h.lineBlockAt(e).from;return e>r?r:Math.max(0,e-1)}),splitLine=({state:h,dispatch:e})=>{if(h.readOnly)return!1;let r=h.changeByRange(s=>({changes:{from:s.from,to:s.to,insert:Text.of(["",""])},range:EditorSelection.cursor(s.from)}));return e(h.update(r,{scrollIntoView:!0,userEvent:"input"})),!0},transposeChars=({state:h,dispatch:e})=>{if(h.readOnly)return!1;let r=h.changeByRange(s=>{if(!s.empty||s.from==0||s.from==h.doc.length)return{range:s};let l=s.from,o=h.doc.lineAt(l),a=l==o.from?l-1:findClusterBreak(o.text,l-o.from,!1)+o.from,c=l==o.to?l+1:findClusterBreak(o.text,l-o.from,!0)+o.from;return{changes:{from:a,to:c,insert:h.doc.slice(l,c).append(h.doc.slice(a,l))},range:EditorSelection.cursor(c)}});return r.changes.empty?!1:(e(h.update(r,{scrollIntoView:!0,userEvent:"move.character"})),!0)};function selectedLineBlocks(h){let e=[],r=-1;for(let s of h.selection.ranges){let l=h.doc.lineAt(s.from),o=h.doc.lineAt(s.to);if(!s.empty&&s.to==o.from&&(o=h.doc.lineAt(s.to-1)),r>=l.number){let a=e[e.length-1];a.to=o.to,a.ranges.push(s)}else e.push({from:l.from,to:o.to,ranges:[s]});r=o.number+1}return e}function moveLine(h,e,r){if(h.readOnly)return!1;let s=[],l=[];for(let o of selectedLineBlocks(h)){if(r?o.to==h.doc.length:o.from==0)continue;let a=h.doc.lineAt(r?o.to+1:o.from-1),c=a.length+1;if(r){s.push({from:o.to,to:a.to},{from:o.from,insert:a.text+h.lineBreak});for(let M of o.ranges)l.push(EditorSelection.range(Math.min(h.doc.length,M.anchor+c),Math.min(h.doc.length,M.head+c)))}else{s.push({from:a.from,to:o.from},{from:o.to,insert:h.lineBreak+a.text});for(let M of o.ranges)l.push(EditorSelection.range(M.anchor-c,M.head-c))}}return s.length?(e(h.update({changes:s,scrollIntoView:!0,selection:EditorSelection.create(l,h.selection.mainIndex),userEvent:"move.line"})),!0):!1}const moveLineUp=({state:h,dispatch:e})=>moveLine(h,e,!1),moveLineDown=({state:h,dispatch:e})=>moveLine(h,e,!0);function copyLine(h,e,r){if(h.readOnly)return!1;let s=[];for(let l of selectedLineBlocks(h))r?s.push({from:l.from,insert:h.doc.slice(l.from,l.to)+h.lineBreak}):s.push({from:l.to,insert:h.lineBreak+h.doc.slice(l.from,l.to)});return e(h.update({changes:s,scrollIntoView:!0,userEvent:"input.copyline"})),!0}const copyLineUp=({state:h,dispatch:e})=>copyLine(h,e,!1),copyLineDown=({state:h,dispatch:e})=>copyLine(h,e,!0),deleteLine=h=>{if(h.state.readOnly)return!1;let{state:e}=h,r=e.changes(selectedLineBlocks(e).map(({from:l,to:o})=>(l>0?l--:o<e.doc.length&&o++,{from:l,to:o}))),s=updateSel(e.selection,l=>h.moveVertically(l,!0)).map(r);return h.dispatch({changes:r,selection:s,scrollIntoView:!0,userEvent:"delete.line"}),!0};function isBetweenBrackets(h,e){if(/\(\)|\[\]|\{\}/.test(h.sliceDoc(e-1,e+1)))return{from:e,to:e};let r=syntaxTree(h).resolveInner(e),s=r.childBefore(e),l=r.childAfter(e),o;return s&&l&&s.to<=e&&l.from>=e&&(o=s.type.prop(NodeProp.closedBy))&&o.indexOf(l.name)>-1&&h.doc.lineAt(s.to).from==h.doc.lineAt(l.from).from&&!/\S/.test(h.sliceDoc(s.to,l.from))?{from:s.to,to:l.from}:null}const insertNewlineAndIndent=newlineAndIndent(!1),insertBlankLine=newlineAndIndent(!0);function newlineAndIndent(h){return({state:e,dispatch:r})=>{if(e.readOnly)return!1;let s=e.changeByRange(l=>{let{from:o,to:a}=l,c=e.doc.lineAt(o),M=!h&&o==a&&isBetweenBrackets(e,o);h&&(o=a=(a<=c.to?c:e.doc.lineAt(a)).to);let f=new IndentContext(e,{simulateBreak:o,simulateDoubleBreak:!!M}),u=getIndentation(f,o);for(u==null&&(u=countColumn(/^\s*/.exec(e.doc.lineAt(o).text)[0],e.tabSize));a<c.to&&/\s/.test(c.text[a-c.from]);)a++;M?{from:o,to:a}=M:o>c.from&&o<c.from+100&&!/\S/.test(c.text.slice(0,o))&&(o=c.from);let g=["",indentString(e,u)];return M&&g.push(indentString(e,f.lineIndent(c.from,-1))),{changes:{from:o,to:a,insert:Text.of(g)},range:EditorSelection.cursor(o+1+g[1].length)}});return r(e.update(s,{scrollIntoView:!0,userEvent:"input"})),!0}}function changeBySelectedLine(h,e){let r=-1;return h.changeByRange(s=>{let l=[];for(let a=s.from;a<=s.to;){let c=h.doc.lineAt(a);c.number>r&&(s.empty||s.to>c.from)&&(e(c,l,s),r=c.number),a=c.to+1}let o=h.changes(l);return{changes:l,range:EditorSelection.range(o.mapPos(s.anchor,1),o.mapPos(s.head,1))}})}const indentSelection=({state:h,dispatch:e})=>{if(h.readOnly)return!1;let r=Object.create(null),s=new IndentContext(h,{overrideIndentation:o=>{let a=r[o];return a??-1}}),l=changeBySelectedLine(h,(o,a,c)=>{let M=getIndentation(s,o.from);if(M==null)return;/\S/.test(o.text)||(M=0);let f=/^\s*/.exec(o.text)[0],u=indentString(h,M);(f!=u||c.from<o.from+f.length)&&(r[o.from]=M,a.push({from:o.from,to:o.from+f.length,insert:u}))});return l.changes.empty||e(h.update(l,{userEvent:"indent"})),!0},indentMore=({state:h,dispatch:e})=>h.readOnly?!1:(e(h.update(changeBySelectedLine(h,(r,s)=>{s.push({from:r.from,insert:h.facet(indentUnit)})}),{userEvent:"input.indent"})),!0),indentLess=({state:h,dispatch:e})=>h.readOnly?!1:(e(h.update(changeBySelectedLine(h,(r,s)=>{let l=/^\s*/.exec(r.text)[0];if(!l)return;let o=countColumn(l,h.tabSize),a=0,c=indentString(h,Math.max(0,o-getIndentUnit(h)));for(;a<l.length&&a<c.length&&l.charCodeAt(a)==c.charCodeAt(a);)a++;s.push({from:r.from+a,to:r.from+l.length,insert:c.slice(a)})}),{userEvent:"delete.dedent"})),!0),emacsStyleKeymap=[{key:"Ctrl-b",run:cursorCharLeft,shift:selectCharLeft,preventDefault:!0},{key:"Ctrl-f",run:cursorCharRight,shift:selectCharRight},{key:"Ctrl-p",run:cursorLineUp,shift:selectLineUp},{key:"Ctrl-n",run:cursorLineDown,shift:selectLineDown},{key:"Ctrl-a",run:cursorLineStart,shift:selectLineStart},{key:"Ctrl-e",run:cursorLineEnd,shift:selectLineEnd},{key:"Ctrl-d",run:deleteCharForward},{key:"Ctrl-h",run:deleteCharBackward},{key:"Ctrl-k",run:deleteToLineEnd},{key:"Ctrl-Alt-h",run:deleteGroupBackward},{key:"Ctrl-o",run:splitLine},{key:"Ctrl-t",run:transposeChars},{key:"Ctrl-v",run:cursorPageDown}],standardKeymap=[{key:"ArrowLeft",run:cursorCharLeft,shift:selectCharLeft,preventDefault:!0},{key:"Mod-ArrowLeft",mac:"Alt-ArrowLeft",run:cursorGroupLeft,shift:selectGroupLeft,preventDefault:!0},{mac:"Cmd-ArrowLeft",run:cursorLineBoundaryLeft,shift:selectLineBoundaryLeft,preventDefault:!0},{key:"ArrowRight",run:cursorCharRight,shift:selectCharRight,preventDefault:!0},{key:"Mod-ArrowRight",mac:"Alt-ArrowRight",run:cursorGroupRight,shift:selectGroupRight,preventDefault:!0},{mac:"Cmd-ArrowRight",run:cursorLineBoundaryRight,shift:selectLineBoundaryRight,preventDefault:!0},{key:"ArrowUp",run:cursorLineUp,shift:selectLineUp,preventDefault:!0},{mac:"Cmd-ArrowUp",run:cursorDocStart,shift:selectDocStart},{mac:"Ctrl-ArrowUp",run:cursorPageUp,shift:selectPageUp},{key:"ArrowDown",run:cursorLineDown,shift:selectLineDown,preventDefault:!0},{mac:"Cmd-ArrowDown",run:cursorDocEnd,shift:selectDocEnd},{mac:"Ctrl-ArrowDown",run:cursorPageDown,shift:selectPageDown},{key:"PageUp",run:cursorPageUp,shift:selectPageUp},{key:"PageDown",run:cursorPageDown,shift:selectPageDown},{key:"Home",run:cursorLineBoundaryBackward,shift:selectLineBoundaryBackward,preventDefault:!0},{key:"Mod-Home",run:cursorDocStart,shift:selectDocStart},{key:"End",run:cursorLineBoundaryForward,shift:selectLineBoundaryForward,preventDefault:!0},{key:"Mod-End",run:cursorDocEnd,shift:selectDocEnd},{key:"Enter",run:insertNewlineAndIndent},{key:"Mod-a",run:selectAll},{key:"Backspace",run:deleteCharBackward,shift:deleteCharBackward},{key:"Delete",run:deleteCharForward},{key:"Mod-Backspace",mac:"Alt-Backspace",run:deleteGroupBackward},{key:"Mod-Delete",mac:"Alt-Delete",run:deleteGroupForward},{mac:"Mod-Backspace",run:deleteToLineStart},{mac:"Mod-Delete",run:deleteToLineEnd}].concat(emacsStyleKeymap.map(h=>({mac:h.key,run:h.run,shift:h.shift}))),defaultKeymap=[{key:"Alt-ArrowLeft",mac:"Ctrl-ArrowLeft",run:cursorSyntaxLeft,shift:selectSyntaxLeft},{key:"Alt-ArrowRight",mac:"Ctrl-ArrowRight",run:cursorSyntaxRight,shift:selectSyntaxRight},{key:"Alt-ArrowUp",run:moveLineUp},{key:"Shift-Alt-ArrowUp",run:copyLineUp},{key:"Alt-ArrowDown",run:moveLineDown},{key:"Shift-Alt-ArrowDown",run:copyLineDown},{key:"Escape",run:simplifySelection},{key:"Mod-Enter",run:insertBlankLine},{key:"Alt-l",mac:"Ctrl-l",run:selectLine},{key:"Mod-i",run:selectParentSyntax,preventDefault:!0},{key:"Mod-[",run:indentLess},{key:"Mod-]",run:indentMore},{key:"Mod-Alt-\\",run:indentSelection},{key:"Shift-Mod-k",run:deleteLine},{key:"Shift-Mod-\\",run:cursorMatchingBracket},{key:"Mod-/",run:toggleComment},{key:"Alt-A",run:toggleBlockComment}].concat(standardKeymap);function crelt(){var h=arguments[0];typeof h=="string"&&(h=document.createElement(h));var e=1,r=arguments[1];if(r&&typeof r=="object"&&r.nodeType==null&&!Array.isArray(r)){for(var s in r)if(Object.prototype.hasOwnProperty.call(r,s)){var l=r[s];typeof l=="string"?h.setAttribute(s,l):l!=null&&(h[s]=l)}e++}for(;e<arguments.length;e++)add(h,arguments[e]);return h}function add(h,e){if(typeof e=="string")h.appendChild(document.createTextNode(e));else if(e!=null)if(e.nodeType!=null)h.appendChild(e);else if(Array.isArray(e))for(var r=0;r<e.length;r++)add(h,e[r]);else throw new RangeError("Unsupported child node: "+e)}const basicNormalize=typeof String.prototype.normalize=="function"?h=>h.normalize("NFKD"):h=>h;class SearchCursor{constructor(e,r,s=0,l=e.length,o,a){this.test=a,this.value={from:0,to:0},this.done=!1,this.matches=[],this.buffer="",this.bufferPos=0,this.iter=e.iterRange(s,l),this.bufferStart=s,this.normalize=o?c=>o(basicNormalize(c)):basicNormalize,this.query=this.normalize(r)}peek(){if(this.bufferPos==this.buffer.length){if(this.bufferStart+=this.buffer.length,this.iter.next(),this.iter.done)return-1;this.bufferPos=0,this.buffer=this.iter.value}return codePointAt(this.buffer,this.bufferPos)}next(){for(;this.matches.length;)this.matches.pop();return this.nextOverlapping()}nextOverlapping(){for(;;){let e=this.peek();if(e<0)return this.done=!0,this;let r=fromCodePoint(e),s=this.bufferStart+this.bufferPos;this.bufferPos+=codePointSize(e);let l=this.normalize(r);for(let o=0,a=s;;o++){let c=l.charCodeAt(o),M=this.match(c,a);if(o==l.length-1){if(M)return this.value=M,this;break}a==s&&o<r.length&&r.charCodeAt(o)==c&&a++}}}match(e,r){let s=null;for(let l=0;l<this.matches.length;l+=2){let o=this.matches[l],a=!1;this.query.charCodeAt(o)==e&&(o==this.query.length-1?s={from:this.matches[l+1],to:r+1}:(this.matches[l]++,a=!0)),a||(this.matches.splice(l,2),l-=2)}return this.query.charCodeAt(0)==e&&(this.query.length==1?s={from:r,to:r+1}:this.matches.push(1,r)),s&&this.test&&!this.test(s.from,s.to,this.buffer,this.bufferPos)&&(s=null),s}}typeof Symbol<"u"&&(SearchCursor.prototype[Symbol.iterator]=function(){return this});const empty={from:-1,to:-1,match:/.*/.exec("")},baseFlags="gm"+(/x/.unicode==null?"":"u");class RegExpCursor{constructor(e,r,s,l=0,o=e.length){if(this.text=e,this.to=o,this.curLine="",this.done=!1,this.value=empty,/\\[sWDnr]|\n|\r|\[\^/.test(r))return new MultilineRegExpCursor(e,r,s,l,o);this.re=new RegExp(r,baseFlags+(s!=null&&s.ignoreCase?"i":"")),this.test=s==null?void 0:s.test,this.iter=e.iter();let a=e.lineAt(l);this.curLineStart=a.from,this.matchPos=toCharEnd(e,l),this.getLine(this.curLineStart)}getLine(e){this.iter.next(e),this.iter.lineBreak?this.curLine="":(this.curLine=this.iter.value,this.curLineStart+this.curLine.length>this.to&&(this.curLine=this.curLine.slice(0,this.to-this.curLineStart)),this.iter.next())}nextLine(){this.curLineStart=this.curLineStart+this.curLine.length+1,this.curLineStart>this.to?this.curLine="":this.getLine(0)}next(){for(let e=this.matchPos-this.curLineStart;;){this.re.lastIndex=e;let r=this.matchPos<=this.to&&this.re.exec(this.curLine);if(r){let s=this.curLineStart+r.index,l=s+r[0].length;if(this.matchPos=toCharEnd(this.text,l+(s==l?1:0)),s==this.curLineStart+this.curLine.length&&this.nextLine(),(s<l||s>this.value.to)&&(!this.test||this.test(s,l,r)))return this.value={from:s,to:l,match:r},this;e=this.matchPos-this.curLineStart}else if(this.curLineStart+this.curLine.length<this.to)this.nextLine(),e=0;else return this.done=!0,this}}}const flattened=new WeakMap;class FlattenedDoc{constructor(e,r){this.from=e,this.text=r}get to(){return this.from+this.text.length}static get(e,r,s){let l=flattened.get(e);if(!l||l.from>=s||l.to<=r){let c=new FlattenedDoc(r,e.sliceString(r,s));return flattened.set(e,c),c}if(l.from==r&&l.to==s)return l;let{text:o,from:a}=l;return a>r&&(o=e.sliceString(r,a)+o,a=r),l.to<s&&(o+=e.sliceString(l.to,s)),flattened.set(e,new FlattenedDoc(a,o)),new FlattenedDoc(r,o.slice(r-a,s-a))}}class MultilineRegExpCursor{constructor(e,r,s,l,o){this.text=e,this.to=o,this.done=!1,this.value=empty,this.matchPos=toCharEnd(e,l),this.re=new RegExp(r,baseFlags+(s!=null&&s.ignoreCase?"i":"")),this.test=s==null?void 0:s.test,this.flat=FlattenedDoc.get(e,l,this.chunkEnd(l+5e3))}chunkEnd(e){return e>=this.to?this.to:this.text.lineAt(e).to}next(){for(;;){let e=this.re.lastIndex=this.matchPos-this.flat.from,r=this.re.exec(this.flat.text);if(r&&!r[0]&&r.index==e&&(this.re.lastIndex=e+1,r=this.re.exec(this.flat.text)),r){let s=this.flat.from+r.index,l=s+r[0].length;if((this.flat.to>=this.to||r.index+r[0].length<=this.flat.text.length-10)&&(!this.test||this.test(s,l,r)))return this.value={from:s,to:l,match:r},this.matchPos=toCharEnd(this.text,l+(s==l?1:0)),this}if(this.flat.to==this.to)return this.done=!0,this;this.flat=FlattenedDoc.get(this.text,this.flat.from,this.chunkEnd(this.flat.from+this.flat.text.length*2))}}}typeof Symbol<"u"&&(RegExpCursor.prototype[Symbol.iterator]=MultilineRegExpCursor.prototype[Symbol.iterator]=function(){return this});function validRegExp(h){try{return new RegExp(h,baseFlags),!0}catch{return!1}}function toCharEnd(h,e){if(e>=h.length)return e;let r=h.lineAt(e),s;for(;e<r.to&&(s=r.text.charCodeAt(e-r.from))>=56320&&s<57344;)e++;return e}function createLineDialog(h){let e=crelt("input",{class:"cm-textfield",name:"line"}),r=crelt("form",{class:"cm-gotoLine",onkeydown:l=>{l.keyCode==27?(l.preventDefault(),h.dispatch({effects:dialogEffect.of(!1)}),h.focus()):l.keyCode==13&&(l.preventDefault(),s())},onsubmit:l=>{l.preventDefault(),s()}},crelt("label",h.state.phrase("Go to line"),": ",e)," ",crelt("button",{class:"cm-button",type:"submit"},h.state.phrase("go")));function s(){let l=/^([+-])?(\d+)?(:\d+)?(%)?$/.exec(e.value);if(!l)return;let{state:o}=h,a=o.doc.lineAt(o.selection.main.head),[,c,M,f,u]=l,g=f?+f.slice(1):0,d=M?+M:a.number;if(M&&u){let w=d/100;c&&(w=w*(c=="-"?-1:1)+a.number/o.doc.lines),d=Math.round(o.doc.lines*w)}else M&&c&&(d=d*(c=="-"?-1:1)+a.number);let p=o.doc.line(Math.max(1,Math.min(o.doc.lines,d))),m=EditorSelection.cursor(p.from+Math.max(0,Math.min(g,p.length)));h.dispatch({effects:[dialogEffect.of(!1),EditorView.scrollIntoView(m.from,{y:"center"})],selection:m}),h.focus()}return{dom:r}}const dialogEffect=StateEffect.define(),dialogField=StateField.define({create(){return!0},update(h,e){for(let r of e.effects)r.is(dialogEffect)&&(h=r.value);return h},provide:h=>showPanel.from(h,e=>e?createLineDialog:null)}),gotoLine=h=>{let e=getPanel(h,createLineDialog);if(!e){let r=[dialogEffect.of(!0)];h.state.field(dialogField,!1)==null&&r.push(StateEffect.appendConfig.of([dialogField,baseTheme$1$1])),h.dispatch({effects:r}),e=getPanel(h,createLineDialog)}return e&&e.dom.querySelector("input").focus(),!0},baseTheme$1$1=EditorView.baseTheme({".cm-panel.cm-gotoLine":{padding:"2px 6px 4px","& label":{fontSize:"80%"}}}),defaultHighlightOptions={highlightWordAroundCursor:!1,minSelectionLength:1,maxMatches:100,wholeWords:!1},highlightConfig=Facet.define({combine(h){return combineConfig(h,defaultHighlightOptions,{highlightWordAroundCursor:(e,r)=>e||r,minSelectionLength:Math.min,maxMatches:Math.min})}});function highlightSelectionMatches(h){let e=[defaultTheme,matchHighlighter];return h&&e.push(highlightConfig.of(h)),e}const matchDeco=Decoration.mark({class:"cm-selectionMatch"}),mainMatchDeco=Decoration.mark({class:"cm-selectionMatch cm-selectionMatch-main"});function insideWordBoundaries(h,e,r,s){return(r==0||h(e.sliceDoc(r-1,r))!=CharCategory.Word)&&(s==e.doc.length||h(e.sliceDoc(s,s+1))!=CharCategory.Word)}function insideWord(h,e,r,s){return h(e.sliceDoc(r,r+1))==CharCategory.Word&&h(e.sliceDoc(s-1,s))==CharCategory.Word}const matchHighlighter=ViewPlugin.fromClass(class{constructor(h){this.decorations=this.getDeco(h)}update(h){(h.selectionSet||h.docChanged||h.viewportChanged)&&(this.decorations=this.getDeco(h.view))}getDeco(h){let e=h.state.facet(highlightConfig),{state:r}=h,s=r.selection;if(s.ranges.length>1)return Decoration.none;let l=s.main,o,a=null;if(l.empty){if(!e.highlightWordAroundCursor)return Decoration.none;let M=r.wordAt(l.head);if(!M)return Decoration.none;a=r.charCategorizer(l.head),o=r.sliceDoc(M.from,M.to)}else{let M=l.to-l.from;if(M<e.minSelectionLength||M>200)return Decoration.none;if(e.wholeWords){if(o=r.sliceDoc(l.from,l.to),a=r.charCategorizer(l.head),!(insideWordBoundaries(a,r,l.from,l.to)&&insideWord(a,r,l.from,l.to)))return Decoration.none}else if(o=r.sliceDoc(l.from,l.to).trim(),!o)return Decoration.none}let c=[];for(let M of h.visibleRanges){let f=new SearchCursor(r.doc,o,M.from,M.to);for(;!f.next().done;){let{from:u,to:g}=f.value;if((!a||insideWordBoundaries(a,r,u,g))&&(l.empty&&u<=l.from&&g>=l.to?c.push(mainMatchDeco.range(u,g)):(u>=l.to||g<=l.from)&&c.push(matchDeco.range(u,g)),c.length>e.maxMatches))return Decoration.none}}return Decoration.set(c)}},{decorations:h=>h.decorations}),defaultTheme=EditorView.baseTheme({".cm-selectionMatch":{backgroundColor:"#99ff7780"},".cm-searchMatch .cm-selectionMatch":{backgroundColor:"transparent"}}),selectWord=({state:h,dispatch:e})=>{let{selection:r}=h,s=EditorSelection.create(r.ranges.map(l=>h.wordAt(l.head)||EditorSelection.cursor(l.head)),r.mainIndex);return s.eq(r)?!1:(e(h.update({selection:s})),!0)};function findNextOccurrence(h,e){let{main:r,ranges:s}=h.selection,l=h.wordAt(r.head),o=l&&l.from==r.from&&l.to==r.to;for(let a=!1,c=new SearchCursor(h.doc,e,s[s.length-1].to);;)if(c.next(),c.done){if(a)return null;c=new SearchCursor(h.doc,e,0,Math.max(0,s[s.length-1].from-1)),a=!0}else{if(a&&s.some(M=>M.from==c.value.from))continue;if(o){let M=h.wordAt(c.value.from);if(!M||M.from!=c.value.from||M.to!=c.value.to)continue}return c.value}}const selectNextOccurrence=({state:h,dispatch:e})=>{let{ranges:r}=h.selection;if(r.some(o=>o.from===o.to))return selectWord({state:h,dispatch:e});let s=h.sliceDoc(r[0].from,r[0].to);if(h.selection.ranges.some(o=>h.sliceDoc(o.from,o.to)!=s))return!1;let l=findNextOccurrence(h,s);return l?(e(h.update({selection:h.selection.addRange(EditorSelection.range(l.from,l.to),!1),effects:EditorView.scrollIntoView(l.to)})),!0):!1},searchConfigFacet=Facet.define({combine(h){return combineConfig(h,{top:!1,caseSensitive:!1,literal:!1,regexp:!1,wholeWord:!1,createPanel:e=>new SearchPanel(e),scrollToMatch:e=>EditorView.scrollIntoView(e)})}});class SearchQuery{constructor(e){this.search=e.search,this.caseSensitive=!!e.caseSensitive,this.literal=!!e.literal,this.regexp=!!e.regexp,this.replace=e.replace||"",this.valid=!!this.search&&(!this.regexp||validRegExp(this.search)),this.unquoted=this.unquote(this.search),this.wholeWord=!!e.wholeWord}unquote(e){return this.literal?e:e.replace(/\\([nrt\\])/g,(r,s)=>s=="n"?`
`:s=="r"?"\r":s=="t"?"	":"\\")}eq(e){return this.search==e.search&&this.replace==e.replace&&this.caseSensitive==e.caseSensitive&&this.regexp==e.regexp&&this.wholeWord==e.wholeWord}create(){return this.regexp?new RegExpQuery(this):new StringQuery(this)}getCursor(e,r=0,s){let l=e.doc?e:EditorState.create({doc:e});return s==null&&(s=l.doc.length),this.regexp?regexpCursor(this,l,r,s):stringCursor(this,l,r,s)}}class QueryType{constructor(e){this.spec=e}}function stringCursor(h,e,r,s){return new SearchCursor(e.doc,h.unquoted,r,s,h.caseSensitive?void 0:l=>l.toLowerCase(),h.wholeWord?stringWordTest(e.doc,e.charCategorizer(e.selection.main.head)):void 0)}function stringWordTest(h,e){return(r,s,l,o)=>((o>r||o+l.length<s)&&(o=Math.max(0,r-2),l=h.sliceString(o,Math.min(h.length,s+2))),(e(charBefore(l,r-o))!=CharCategory.Word||e(charAfter(l,r-o))!=CharCategory.Word)&&(e(charAfter(l,s-o))!=CharCategory.Word||e(charBefore(l,s-o))!=CharCategory.Word))}class StringQuery extends QueryType{constructor(e){super(e)}nextMatch(e,r,s){let l=stringCursor(this.spec,e,s,e.doc.length).nextOverlapping();return l.done&&(l=stringCursor(this.spec,e,0,r).nextOverlapping()),l.done?null:l.value}prevMatchInRange(e,r,s){for(let l=s;;){let o=Math.max(r,l-1e4-this.spec.unquoted.length),a=stringCursor(this.spec,e,o,l),c=null;for(;!a.nextOverlapping().done;)c=a.value;if(c)return c;if(o==r)return null;l-=1e4}}prevMatch(e,r,s){return this.prevMatchInRange(e,0,r)||this.prevMatchInRange(e,s,e.doc.length)}getReplacement(e){return this.spec.unquote(this.spec.replace)}matchAll(e,r){let s=stringCursor(this.spec,e,0,e.doc.length),l=[];for(;!s.next().done;){if(l.length>=r)return null;l.push(s.value)}return l}highlight(e,r,s,l){let o=stringCursor(this.spec,e,Math.max(0,r-this.spec.unquoted.length),Math.min(s+this.spec.unquoted.length,e.doc.length));for(;!o.next().done;)l(o.value.from,o.value.to)}}function regexpCursor(h,e,r,s){return new RegExpCursor(e.doc,h.search,{ignoreCase:!h.caseSensitive,test:h.wholeWord?regexpWordTest(e.charCategorizer(e.selection.main.head)):void 0},r,s)}function charBefore(h,e){return h.slice(findClusterBreak(h,e,!1),e)}function charAfter(h,e){return h.slice(e,findClusterBreak(h,e))}function regexpWordTest(h){return(e,r,s)=>!s[0].length||(h(charBefore(s.input,s.index))!=CharCategory.Word||h(charAfter(s.input,s.index))!=CharCategory.Word)&&(h(charAfter(s.input,s.index+s[0].length))!=CharCategory.Word||h(charBefore(s.input,s.index+s[0].length))!=CharCategory.Word)}class RegExpQuery extends QueryType{nextMatch(e,r,s){let l=regexpCursor(this.spec,e,s,e.doc.length).next();return l.done&&(l=regexpCursor(this.spec,e,0,r).next()),l.done?null:l.value}prevMatchInRange(e,r,s){for(let l=1;;l++){let o=Math.max(r,s-l*1e4),a=regexpCursor(this.spec,e,o,s),c=null;for(;!a.next().done;)c=a.value;if(c&&(o==r||c.from>o+10))return c;if(o==r)return null}}prevMatch(e,r,s){return this.prevMatchInRange(e,0,r)||this.prevMatchInRange(e,s,e.doc.length)}getReplacement(e){return this.spec.unquote(this.spec.replace.replace(/\$([$&\d+])/g,(r,s)=>s=="$"?"$":s=="&"?e.match[0]:s!="0"&&+s<e.match.length?e.match[s]:r))}matchAll(e,r){let s=regexpCursor(this.spec,e,0,e.doc.length),l=[];for(;!s.next().done;){if(l.length>=r)return null;l.push(s.value)}return l}highlight(e,r,s,l){let o=regexpCursor(this.spec,e,Math.max(0,r-250),Math.min(s+250,e.doc.length));for(;!o.next().done;)l(o.value.from,o.value.to)}}const setSearchQuery=StateEffect.define(),togglePanel$1=StateEffect.define(),searchState=StateField.define({create(h){return new SearchState(defaultQuery(h).create(),null)},update(h,e){for(let r of e.effects)r.is(setSearchQuery)?h=new SearchState(r.value.create(),h.panel):r.is(togglePanel$1)&&(h=new SearchState(h.query,r.value?createSearchPanel:null));return h},provide:h=>showPanel.from(h,e=>e.panel)});class SearchState{constructor(e,r){this.query=e,this.panel=r}}const matchMark=Decoration.mark({class:"cm-searchMatch"}),selectedMatchMark=Decoration.mark({class:"cm-searchMatch cm-searchMatch-selected"}),searchHighlighter=ViewPlugin.fromClass(class{constructor(h){this.view=h,this.decorations=this.highlight(h.state.field(searchState))}update(h){let e=h.state.field(searchState);(e!=h.startState.field(searchState)||h.docChanged||h.selectionSet||h.viewportChanged)&&(this.decorations=this.highlight(e))}highlight({query:h,panel:e}){if(!e||!h.spec.valid)return Decoration.none;let{view:r}=this,s=new RangeSetBuilder;for(let l=0,o=r.visibleRanges,a=o.length;l<a;l++){let{from:c,to:M}=o[l];for(;l<a-1&&M>o[l+1].from-2*250;)M=o[++l].to;h.highlight(r.state,c,M,(f,u)=>{let g=r.state.selection.ranges.some(d=>d.from==f&&d.to==u);s.add(f,u,g?selectedMatchMark:matchMark)})}return s.finish()}},{decorations:h=>h.decorations});function searchCommand(h){return e=>{let r=e.state.field(searchState,!1);return r&&r.query.spec.valid?h(e,r):openSearchPanel(e)}}const findNext=searchCommand((h,{query:e})=>{let{to:r}=h.state.selection.main,s=e.nextMatch(h.state,r,r);if(!s)return!1;let l=EditorSelection.single(s.from,s.to),o=h.state.facet(searchConfigFacet);return h.dispatch({selection:l,effects:[announceMatch(h,s),o.scrollToMatch(l.main,h)],userEvent:"select.search"}),selectSearchInput(h),!0}),findPrevious=searchCommand((h,{query:e})=>{let{state:r}=h,{from:s}=r.selection.main,l=e.prevMatch(r,s,s);if(!l)return!1;let o=EditorSelection.single(l.from,l.to),a=h.state.facet(searchConfigFacet);return h.dispatch({selection:o,effects:[announceMatch(h,l),a.scrollToMatch(o.main,h)],userEvent:"select.search"}),selectSearchInput(h),!0}),selectMatches=searchCommand((h,{query:e})=>{let r=e.matchAll(h.state,1e3);return!r||!r.length?!1:(h.dispatch({selection:EditorSelection.create(r.map(s=>EditorSelection.range(s.from,s.to))),userEvent:"select.search.matches"}),!0)}),selectSelectionMatches=({state:h,dispatch:e})=>{let r=h.selection;if(r.ranges.length>1||r.main.empty)return!1;let{from:s,to:l}=r.main,o=[],a=0;for(let c=new SearchCursor(h.doc,h.sliceDoc(s,l));!c.next().done;){if(o.length>1e3)return!1;c.value.from==s&&(a=o.length),o.push(EditorSelection.range(c.value.from,c.value.to))}return e(h.update({selection:EditorSelection.create(o,a),userEvent:"select.search.matches"})),!0},replaceNext=searchCommand((h,{query:e})=>{let{state:r}=h,{from:s,to:l}=r.selection.main;if(r.readOnly)return!1;let o=e.nextMatch(r,s,s);if(!o)return!1;let a=[],c,M,f=[];if(o.from==s&&o.to==l&&(M=r.toText(e.getReplacement(o)),a.push({from:o.from,to:o.to,insert:M}),o=e.nextMatch(r,o.from,o.to),f.push(EditorView.announce.of(r.phrase("replaced match on line $",r.doc.lineAt(s).number)+"."))),o){let u=a.length==0||a[0].from>=o.to?0:o.to-o.from-M.length;c=EditorSelection.single(o.from-u,o.to-u),f.push(announceMatch(h,o)),f.push(r.facet(searchConfigFacet).scrollToMatch(c.main,h))}return h.dispatch({changes:a,selection:c,effects:f,userEvent:"input.replace"}),!0}),replaceAll=searchCommand((h,{query:e})=>{if(h.state.readOnly)return!1;let r=e.matchAll(h.state,1e9).map(l=>{let{from:o,to:a}=l;return{from:o,to:a,insert:e.getReplacement(l)}});if(!r.length)return!1;let s=h.state.phrase("replaced $ matches",r.length)+".";return h.dispatch({changes:r,effects:EditorView.announce.of(s),userEvent:"input.replace.all"}),!0});function createSearchPanel(h){return h.state.facet(searchConfigFacet).createPanel(h)}function defaultQuery(h,e){var r,s,l,o,a;let c=h.selection.main,M=c.empty||c.to>c.from+100?"":h.sliceDoc(c.from,c.to);if(e&&!M)return e;let f=h.facet(searchConfigFacet);return new SearchQuery({search:((r=e==null?void 0:e.literal)!==null&&r!==void 0?r:f.literal)?M:M.replace(/\n/g,"\\n"),caseSensitive:(s=e==null?void 0:e.caseSensitive)!==null&&s!==void 0?s:f.caseSensitive,literal:(l=e==null?void 0:e.literal)!==null&&l!==void 0?l:f.literal,regexp:(o=e==null?void 0:e.regexp)!==null&&o!==void 0?o:f.regexp,wholeWord:(a=e==null?void 0:e.wholeWord)!==null&&a!==void 0?a:f.wholeWord})}function getSearchInput(h){let e=getPanel(h,createSearchPanel);return e&&e.dom.querySelector("[main-field]")}function selectSearchInput(h){let e=getSearchInput(h);e&&e==h.root.activeElement&&e.select()}const openSearchPanel=h=>{let e=h.state.field(searchState,!1);if(e&&e.panel){let r=getSearchInput(h);if(r&&r!=h.root.activeElement){let s=defaultQuery(h.state,e.query.spec);s.valid&&h.dispatch({effects:setSearchQuery.of(s)}),r.focus(),r.select()}}else h.dispatch({effects:[togglePanel$1.of(!0),e?setSearchQuery.of(defaultQuery(h.state,e.query.spec)):StateEffect.appendConfig.of(searchExtensions)]});return!0},closeSearchPanel=h=>{let e=h.state.field(searchState,!1);if(!e||!e.panel)return!1;let r=getPanel(h,createSearchPanel);return r&&r.dom.contains(h.root.activeElement)&&h.focus(),h.dispatch({effects:togglePanel$1.of(!1)}),!0},searchKeymap=[{key:"Mod-f",run:openSearchPanel,scope:"editor search-panel"},{key:"F3",run:findNext,shift:findPrevious,scope:"editor search-panel",preventDefault:!0},{key:"Mod-g",run:findNext,shift:findPrevious,scope:"editor search-panel",preventDefault:!0},{key:"Escape",run:closeSearchPanel,scope:"editor search-panel"},{key:"Mod-Shift-l",run:selectSelectionMatches},{key:"Alt-g",run:gotoLine},{key:"Mod-d",run:selectNextOccurrence,preventDefault:!0}];class SearchPanel{constructor(e){this.view=e;let r=this.query=e.state.field(searchState).query.spec;this.commit=this.commit.bind(this),this.searchField=crelt("input",{value:r.search,placeholder:phrase(e,"Find"),"aria-label":phrase(e,"Find"),class:"cm-textfield",name:"search",form:"","main-field":"true",onchange:this.commit,onkeyup:this.commit}),this.replaceField=crelt("input",{value:r.replace,placeholder:phrase(e,"Replace"),"aria-label":phrase(e,"Replace"),class:"cm-textfield",name:"replace",form:"",onchange:this.commit,onkeyup:this.commit}),this.caseField=crelt("input",{type:"checkbox",name:"case",form:"",checked:r.caseSensitive,onchange:this.commit}),this.reField=crelt("input",{type:"checkbox",name:"re",form:"",checked:r.regexp,onchange:this.commit}),this.wordField=crelt("input",{type:"checkbox",name:"word",form:"",checked:r.wholeWord,onchange:this.commit});function s(l,o,a){return crelt("button",{class:"cm-button",name:l,onclick:o,type:"button"},a)}this.dom=crelt("div",{onkeydown:l=>this.keydown(l),class:"cm-search"},[this.searchField,s("next",()=>findNext(e),[phrase(e,"next")]),s("prev",()=>findPrevious(e),[phrase(e,"previous")]),s("select",()=>selectMatches(e),[phrase(e,"all")]),crelt("label",null,[this.caseField,phrase(e,"match case")]),crelt("label",null,[this.reField,phrase(e,"regexp")]),crelt("label",null,[this.wordField,phrase(e,"by word")]),...e.state.readOnly?[]:[crelt("br"),this.replaceField,s("replace",()=>replaceNext(e),[phrase(e,"replace")]),s("replaceAll",()=>replaceAll(e),[phrase(e,"replace all")])],crelt("button",{name:"close",onclick:()=>closeSearchPanel(e),"aria-label":phrase(e,"close"),type:"button"},["×"])])}commit(){let e=new SearchQuery({search:this.searchField.value,caseSensitive:this.caseField.checked,regexp:this.reField.checked,wholeWord:this.wordField.checked,replace:this.replaceField.value});e.eq(this.query)||(this.query=e,this.view.dispatch({effects:setSearchQuery.of(e)}))}keydown(e){runScopeHandlers(this.view,e,"search-panel")?e.preventDefault():e.keyCode==13&&e.target==this.searchField?(e.preventDefault(),(e.shiftKey?findPrevious:findNext)(this.view)):e.keyCode==13&&e.target==this.replaceField&&(e.preventDefault(),replaceNext(this.view))}update(e){for(let r of e.transactions)for(let s of r.effects)s.is(setSearchQuery)&&!s.value.eq(this.query)&&this.setQuery(s.value)}setQuery(e){this.query=e,this.searchField.value=e.search,this.replaceField.value=e.replace,this.caseField.checked=e.caseSensitive,this.reField.checked=e.regexp,this.wordField.checked=e.wholeWord}mount(){this.searchField.select()}get pos(){return 80}get top(){return this.view.state.facet(searchConfigFacet).top}}function phrase(h,e){return h.state.phrase(e)}const AnnounceMargin=30,Break=/[\s\.,:;?!]/;function announceMatch(h,{from:e,to:r}){let s=h.state.doc.lineAt(e),l=h.state.doc.lineAt(r).to,o=Math.max(s.from,e-AnnounceMargin),a=Math.min(l,r+AnnounceMargin),c=h.state.sliceDoc(o,a);if(o!=s.from){for(let M=0;M<AnnounceMargin;M++)if(!Break.test(c[M+1])&&Break.test(c[M])){c=c.slice(M);break}}if(a!=l){for(let M=c.length-1;M>c.length-AnnounceMargin;M--)if(!Break.test(c[M-1])&&Break.test(c[M])){c=c.slice(0,M);break}}return EditorView.announce.of(`${h.state.phrase("current match")}. ${c} ${h.state.phrase("on line")} ${s.number}.`)}const baseTheme$2=EditorView.baseTheme({".cm-panel.cm-search":{padding:"2px 6px 4px",position:"relative","& [name=close]":{position:"absolute",top:"0",right:"4px",backgroundColor:"inherit",border:"none",font:"inherit",padding:0,margin:0},"& input, & button, & label":{margin:".2em .6em .2em 0"},"& input[type=checkbox]":{marginRight:".2em"},"& label":{fontSize:"80%",whiteSpace:"pre"}},"&light .cm-searchMatch":{backgroundColor:"#ffff0054"},"&dark .cm-searchMatch":{backgroundColor:"#00ffff8a"},"&light .cm-searchMatch-selected":{backgroundColor:"#ff6a0054"},"&dark .cm-searchMatch-selected":{backgroundColor:"#ff00ff8a"}}),searchExtensions=[searchState,Prec.low(searchHighlighter),baseTheme$2];class CompletionContext{constructor(e,r,s){this.state=e,this.pos=r,this.explicit=s,this.abortListeners=[]}tokenBefore(e){let r=syntaxTree(this.state).resolveInner(this.pos,-1);for(;r&&e.indexOf(r.name)<0;)r=r.parent;return r?{from:r.from,to:this.pos,text:this.state.sliceDoc(r.from,this.pos),type:r.type}:null}matchBefore(e){let r=this.state.doc.lineAt(this.pos),s=Math.max(r.from,this.pos-250),l=r.text.slice(s-r.from,this.pos-r.from),o=l.search(ensureAnchor(e,!1));return o<0?null:{from:s+o,to:this.pos,text:l.slice(o)}}get aborted(){return this.abortListeners==null}addEventListener(e,r){e=="abort"&&this.abortListeners&&this.abortListeners.push(r)}}function toSet$1(h){let e=Object.keys(h).join(""),r=/\w/.test(e);return r&&(e=e.replace(/\w/g,"")),`[${r?"\\w":""}${e.replace(/[^\w\s]/g,"\\$&")}]`}function prefixMatch(h){let e=Object.create(null),r=Object.create(null);for(let{label:l}of h){e[l[0]]=!0;for(let o=1;o<l.length;o++)r[l[o]]=!0}let s=toSet$1(e)+toSet$1(r)+"*$";return[new RegExp("^"+s),new RegExp(s)]}function completeFromList(h){let e=h.map(l=>typeof l=="string"?{label:l}:l),[r,s]=e.every(l=>/^\w+$/.test(l.label))?[/\w*$/,/\w+$/]:prefixMatch(e);return l=>{let o=l.matchBefore(s);return o||l.explicit?{from:o?o.from:l.pos,options:e,validFor:r}:null}}class Option{constructor(e,r,s,l){this.completion=e,this.source=r,this.match=s,this.score=l}}function cur(h){return h.selection.main.from}function ensureAnchor(h,e){var r;let{source:s}=h,l=e&&s[0]!="^",o=s[s.length-1]!="$";return!l&&!o?h:new RegExp(`${l?"^":""}(?:${s})${o?"$":""}`,(r=h.flags)!==null&&r!==void 0?r:h.ignoreCase?"i":"")}const pickedCompletion=Annotation.define();function insertCompletionText(h,e,r,s){let{main:l}=h.selection,o=r-l.from,a=s-l.from;return Object.assign(Object.assign({},h.changeByRange(c=>c!=l&&r!=s&&h.sliceDoc(c.from+o,c.from+a)!=h.sliceDoc(r,s)?{range:c}:{changes:{from:c.from+o,to:s==l.from?c.to:c.from+a,insert:e},range:EditorSelection.cursor(c.from+o+e.length)})),{userEvent:"input.complete"})}const SourceCache=new WeakMap;function asSource(h){if(!Array.isArray(h))return h;let e=SourceCache.get(h);return e||SourceCache.set(h,e=completeFromList(h)),e}const startCompletionEffect=StateEffect.define(),closeCompletionEffect=StateEffect.define();class FuzzyMatcher{constructor(e){this.pattern=e,this.chars=[],this.folded=[],this.any=[],this.precise=[],this.byWord=[],this.score=0,this.matched=[];for(let r=0;r<e.length;){let s=codePointAt(e,r),l=codePointSize(s);this.chars.push(s);let o=e.slice(r,r+l),a=o.toUpperCase();this.folded.push(codePointAt(a==o?o.toLowerCase():a,0)),r+=l}this.astral=e.length!=this.chars.length}ret(e,r){return this.score=e,this.matched=r,!0}match(e){if(this.pattern.length==0)return this.ret(-100,[]);if(e.length<this.pattern.length)return!1;let{chars:r,folded:s,any:l,precise:o,byWord:a}=this;if(r.length==1){let O=codePointAt(e,0),P=codePointSize(O),v=P==e.length?0:-100;if(O!=r[0])if(O==s[0])v+=-200;else return!1;return this.ret(v,[0,P])}let c=e.indexOf(this.pattern);if(c==0)return this.ret(e.length==this.pattern.length?0:-100,[0,this.pattern.length]);let M=r.length,f=0;if(c<0){for(let O=0,P=Math.min(e.length,200);O<P&&f<M;){let v=codePointAt(e,O);(v==r[f]||v==s[f])&&(l[f++]=O),O+=codePointSize(v)}if(f<M)return!1}let u=0,g=0,d=!1,p=0,m=-1,w=-1,y=/[a-z]/.test(e),b=!0;for(let O=0,P=Math.min(e.length,200),v=0;O<P&&g<M;){let S=codePointAt(e,O);c<0&&(u<M&&S==r[u]&&(o[u++]=O),p<M&&(S==r[p]||S==s[p]?(p==0&&(m=O),w=O+1,p++):p=0));let k,T=S<255?S>=48&&S<=57||S>=97&&S<=122?2:S>=65&&S<=90?1:0:(k=fromCodePoint(S))!=k.toLowerCase()?1:k!=k.toUpperCase()?2:0;(!O||T==1&&y||v==0&&T!=0)&&(r[g]==S||s[g]==S&&(d=!0)?a[g++]=O:a.length&&(b=!1)),v=T,O+=codePointSize(S)}return g==M&&a[0]==0&&b?this.result(-100+(d?-200:0),a,e):p==M&&m==0?this.ret(-200-e.length+(w==e.length?0:-100),[0,w]):c>-1?this.ret(-700-e.length,[c,c+this.pattern.length]):p==M?this.ret(-200+-700-e.length,[m,w]):g==M?this.result(-100+(d?-200:0)+-700+(b?0:-1100),a,e):r.length==2?!1:this.result((l[0]?-700:0)+-200+-1100,l,e)}result(e,r,s){let l=[],o=0;for(let a of r){let c=a+(this.astral?codePointSize(codePointAt(s,a)):1);o&&l[o-1]==a?l[o-1]=c:(l[o++]=a,l[o++]=c)}return this.ret(e-s.length,l)}}const completionConfig=Facet.define({combine(h){return combineConfig(h,{activateOnTyping:!0,selectOnOpen:!0,override:null,closeOnBlur:!0,maxRenderedOptions:100,defaultKeymap:!0,tooltipClass:()=>"",optionClass:()=>"",aboveCursor:!1,icons:!0,addToOptions:[],positionInfo:defaultPositionInfo,compareCompletions:(e,r)=>e.label.localeCompare(r.label),interactionDelay:75},{defaultKeymap:(e,r)=>e&&r,closeOnBlur:(e,r)=>e&&r,icons:(e,r)=>e&&r,tooltipClass:(e,r)=>s=>joinClass(e(s),r(s)),optionClass:(e,r)=>s=>joinClass(e(s),r(s)),addToOptions:(e,r)=>e.concat(r)})}});function joinClass(h,e){return h?e?h+" "+e:h:e}function defaultPositionInfo(h,e,r,s,l){let o=h.textDirection==Direction.RTL,a=o,c=!1,M="top",f,u,g=e.left-l.left,d=l.right-e.right,p=s.right-s.left,m=s.bottom-s.top;if(a&&g<Math.min(p,d)?a=!1:!a&&d<Math.min(p,g)&&(a=!0),p<=(a?g:d))f=Math.max(l.top,Math.min(r.top,l.bottom-m))-e.top,u=Math.min(400,a?g:d);else{c=!0,u=Math.min(400,(o?e.right:l.right-e.left)-30);let w=l.bottom-e.bottom;w>=m||w>e.top?f=r.bottom-e.top:(M="bottom",f=e.bottom-r.top)}return{style:`${M}: ${f}px; max-width: ${u}px`,class:"cm-completionInfo-"+(c?o?"left-narrow":"right-narrow":a?"left":"right")}}function optionContent(h){let e=h.addToOptions.slice();return h.icons&&e.push({render(r){let s=document.createElement("div");return s.classList.add("cm-completionIcon"),r.type&&s.classList.add(...r.type.split(/\s+/g).map(l=>"cm-completionIcon-"+l)),s.setAttribute("aria-hidden","true"),s},position:20}),e.push({render(r,s,l){let o=document.createElement("span");o.className="cm-completionLabel";let a=r.displayLabel||r.label,c=0;for(let M=0;M<l.length;){let f=l[M++],u=l[M++];f>c&&o.appendChild(document.createTextNode(a.slice(c,f)));let g=o.appendChild(document.createElement("span"));g.appendChild(document.createTextNode(a.slice(f,u))),g.className="cm-completionMatchedText",c=u}return c<a.length&&o.appendChild(document.createTextNode(a.slice(c))),o},position:50},{render(r){if(!r.detail)return null;let s=document.createElement("span");return s.className="cm-completionDetail",s.textContent=r.detail,s},position:80}),e.sort((r,s)=>r.position-s.position).map(r=>r.render)}function rangeAroundSelected(h,e,r){if(h<=r)return{from:0,to:h};if(e<0&&(e=0),e<=h>>1){let l=Math.floor(e/r);return{from:l*r,to:(l+1)*r}}let s=Math.floor((h-e)/r);return{from:h-(s+1)*r,to:h-s*r}}class CompletionTooltip{constructor(e,r,s){this.view=e,this.stateField=r,this.applyCompletion=s,this.info=null,this.infoDestroy=null,this.placeInfoReq={read:()=>this.measureInfo(),write:M=>this.placeInfo(M),key:this},this.space=null,this.currentClass="";let l=e.state.field(r),{options:o,selected:a}=l.open,c=e.state.facet(completionConfig);this.optionContent=optionContent(c),this.optionClass=c.optionClass,this.tooltipClass=c.tooltipClass,this.range=rangeAroundSelected(o.length,a,c.maxRenderedOptions),this.dom=document.createElement("div"),this.dom.className="cm-tooltip-autocomplete",this.updateTooltipClass(e.state),this.dom.addEventListener("mousedown",M=>{for(let f=M.target,u;f&&f!=this.dom;f=f.parentNode)if(f.nodeName=="LI"&&(u=/-(\d+)$/.exec(f.id))&&+u[1]<o.length){this.applyCompletion(e,o[+u[1]]),M.preventDefault();return}}),this.dom.addEventListener("focusout",M=>{let f=e.state.field(this.stateField,!1);f&&f.tooltip&&e.state.facet(completionConfig).closeOnBlur&&M.relatedTarget!=e.contentDOM&&e.dispatch({effects:closeCompletionEffect.of(null)})}),this.list=this.dom.appendChild(this.createListBox(o,l.id,this.range)),this.list.addEventListener("scroll",()=>{this.info&&this.view.requestMeasure(this.placeInfoReq)})}mount(){this.updateSel()}update(e){var r,s,l;let o=e.state.field(this.stateField),a=e.startState.field(this.stateField);this.updateTooltipClass(e.state),o!=a&&(this.updateSel(),((r=o.open)===null||r===void 0?void 0:r.disabled)!=((s=a.open)===null||s===void 0?void 0:s.disabled)&&this.dom.classList.toggle("cm-tooltip-autocomplete-disabled",!!(!((l=o.open)===null||l===void 0)&&l.disabled)))}updateTooltipClass(e){let r=this.tooltipClass(e);if(r!=this.currentClass){for(let s of this.currentClass.split(" "))s&&this.dom.classList.remove(s);for(let s of r.split(" "))s&&this.dom.classList.add(s);this.currentClass=r}}positioned(e){this.space=e,this.info&&this.view.requestMeasure(this.placeInfoReq)}updateSel(){let e=this.view.state.field(this.stateField),r=e.open;if((r.selected>-1&&r.selected<this.range.from||r.selected>=this.range.to)&&(this.range=rangeAroundSelected(r.options.length,r.selected,this.view.state.facet(completionConfig).maxRenderedOptions),this.list.remove(),this.list=this.dom.appendChild(this.createListBox(r.options,e.id,this.range)),this.list.addEventListener("scroll",()=>{this.info&&this.view.requestMeasure(this.placeInfoReq)})),this.updateSelectedOption(r.selected)){this.destroyInfo();let{completion:s}=r.options[r.selected],{info:l}=s;if(!l)return;let o=typeof l=="string"?document.createTextNode(l):l(s);if(!o)return;"then"in o?o.then(a=>{a&&this.view.state.field(this.stateField,!1)==e&&this.addInfoPane(a,s)}).catch(a=>logException(this.view.state,a,"completion info")):this.addInfoPane(o,s)}}addInfoPane(e,r){this.destroyInfo();let s=this.info=document.createElement("div");if(s.className="cm-tooltip cm-completionInfo",e.nodeType!=null)s.appendChild(e),this.infoDestroy=null;else{let{dom:l,destroy:o}=e;s.appendChild(l),this.infoDestroy=o||null}this.dom.appendChild(s),this.view.requestMeasure(this.placeInfoReq)}updateSelectedOption(e){let r=null;for(let s=this.list.firstChild,l=this.range.from;s;s=s.nextSibling,l++)s.nodeName!="LI"||!s.id?l--:l==e?s.hasAttribute("aria-selected")||(s.setAttribute("aria-selected","true"),r=s):s.hasAttribute("aria-selected")&&s.removeAttribute("aria-selected");return r&&scrollIntoView(this.list,r),r}measureInfo(){let e=this.dom.querySelector("[aria-selected]");if(!e||!this.info)return null;let r=this.dom.getBoundingClientRect(),s=this.info.getBoundingClientRect(),l=e.getBoundingClientRect(),o=this.space;if(!o){let a=this.dom.ownerDocument.defaultView||window;o={left:0,top:0,right:a.innerWidth,bottom:a.innerHeight}}return l.top>Math.min(o.bottom,r.bottom)-10||l.bottom<Math.max(o.top,r.top)+10?null:this.view.state.facet(completionConfig).positionInfo(this.view,r,l,s,o)}placeInfo(e){this.info&&(e?(e.style&&(this.info.style.cssText=e.style),this.info.className="cm-tooltip cm-completionInfo "+(e.class||"")):this.info.style.cssText="top: -1e6px")}createListBox(e,r,s){const l=document.createElement("ul");l.id=r,l.setAttribute("role","listbox"),l.setAttribute("aria-expanded","true"),l.setAttribute("aria-label",this.view.state.phrase("Completions"));let o=null;for(let a=s.from;a<s.to;a++){let{completion:c,match:M}=e[a],{section:f}=c;if(f){let d=typeof f=="string"?f:f.name;if(d!=o&&(a>s.from||s.from==0))if(o=d,typeof f!="string"&&f.header)l.appendChild(f.header(f));else{let p=l.appendChild(document.createElement("completion-section"));p.textContent=d}}const u=l.appendChild(document.createElement("li"));u.id=r+"-"+a,u.setAttribute("role","option");let g=this.optionClass(c);g&&(u.className=g);for(let d of this.optionContent){let p=d(c,this.view.state,M);p&&u.appendChild(p)}}return s.from&&l.classList.add("cm-completionListIncompleteTop"),s.to<e.length&&l.classList.add("cm-completionListIncompleteBottom"),l}destroyInfo(){this.info&&(this.infoDestroy&&this.infoDestroy(),this.info.remove(),this.info=null)}destroy(){this.destroyInfo()}}function completionTooltip(h,e){return r=>new CompletionTooltip(r,h,e)}function scrollIntoView(h,e){let r=h.getBoundingClientRect(),s=e.getBoundingClientRect();s.top<r.top?h.scrollTop-=r.top-s.top:s.bottom>r.bottom&&(h.scrollTop+=s.bottom-r.bottom)}function score(h){return(h.boost||0)*100+(h.apply?10:0)+(h.info?5:0)+(h.type?1:0)}function sortOptions(h,e){let r=[],s=null,l=M=>{r.push(M);let{section:f}=M.completion;if(f){s||(s=[]);let u=typeof f=="string"?f:f.name;s.some(g=>g.name==u)||s.push(typeof f=="string"?{name:u}:f)}};for(let M of h)if(M.hasResult()){let f=M.result.getMatch;if(M.result.filter===!1)for(let u of M.result.options)l(new Option(u,M.source,f?f(u):[],1e9-r.length));else{let u=new FuzzyMatcher(e.sliceDoc(M.from,M.to));for(let g of M.result.options)if(u.match(g.label)){let d=g.displayLabel?f?f(g,u.matched):[]:u.matched;l(new Option(g,M.source,d,u.score+(g.boost||0)))}}}if(s){let M=Object.create(null),f=0,u=(g,d)=>{var p,m;return((p=g.rank)!==null&&p!==void 0?p:1e9)-((m=d.rank)!==null&&m!==void 0?m:1e9)||(g.name<d.name?-1:1)};for(let g of s.sort(u))f-=1e5,M[g.name]=f;for(let g of r){let{section:d}=g.completion;d&&(g.score+=M[typeof d=="string"?d:d.name])}}let o=[],a=null,c=e.facet(completionConfig).compareCompletions;for(let M of r.sort((f,u)=>u.score-f.score||c(f.completion,u.completion))){let f=M.completion;!a||a.label!=f.label||a.detail!=f.detail||a.type!=null&&f.type!=null&&a.type!=f.type||a.apply!=f.apply||a.boost!=f.boost?o.push(M):score(M.completion)>score(a)&&(o[o.length-1]=M),a=M.completion}return o}class CompletionDialog{constructor(e,r,s,l,o,a){this.options=e,this.attrs=r,this.tooltip=s,this.timestamp=l,this.selected=o,this.disabled=a}setSelected(e,r){return e==this.selected||e>=this.options.length?this:new CompletionDialog(this.options,makeAttrs(r,e),this.tooltip,this.timestamp,e,this.disabled)}static build(e,r,s,l,o){let a=sortOptions(e,r);if(!a.length)return l&&e.some(M=>M.state==1)?new CompletionDialog(l.options,l.attrs,l.tooltip,l.timestamp,l.selected,!0):null;let c=r.facet(completionConfig).selectOnOpen?0:-1;if(l&&l.selected!=c&&l.selected!=-1){let M=l.options[l.selected].completion;for(let f=0;f<a.length;f++)if(a[f].completion==M){c=f;break}}return new CompletionDialog(a,makeAttrs(s,c),{pos:e.reduce((M,f)=>f.hasResult()?Math.min(M,f.from):M,1e8),create:completionTooltip(completionState,applyCompletion),above:o.aboveCursor},l?l.timestamp:Date.now(),c,!1)}map(e){return new CompletionDialog(this.options,this.attrs,Object.assign(Object.assign({},this.tooltip),{pos:e.mapPos(this.tooltip.pos)}),this.timestamp,this.selected,this.disabled)}}class CompletionState{constructor(e,r,s){this.active=e,this.id=r,this.open=s}static start(){return new CompletionState(none,"cm-ac-"+Math.floor(Math.random()*2e6).toString(36),null)}update(e){let{state:r}=e,s=r.facet(completionConfig),o=(s.override||r.languageDataAt("autocomplete",cur(r)).map(asSource)).map(c=>(this.active.find(f=>f.source==c)||new ActiveSource(c,this.active.some(f=>f.state!=0)?1:0)).update(e,s));o.length==this.active.length&&o.every((c,M)=>c==this.active[M])&&(o=this.active);let a=this.open;a&&e.docChanged&&(a=a.map(e.changes)),e.selection||o.some(c=>c.hasResult()&&e.changes.touchesRange(c.from,c.to))||!sameResults(o,this.active)?a=CompletionDialog.build(o,r,this.id,a,s):a&&a.disabled&&!o.some(c=>c.state==1)&&(a=null),!a&&o.every(c=>c.state!=1)&&o.some(c=>c.hasResult())&&(o=o.map(c=>c.hasResult()?new ActiveSource(c.source,0):c));for(let c of e.effects)c.is(setSelectedEffect)&&(a=a&&a.setSelected(c.value,this.id));return o==this.active&&a==this.open?this:new CompletionState(o,this.id,a)}get tooltip(){return this.open?this.open.tooltip:null}get attrs(){return this.open?this.open.attrs:baseAttrs}}function sameResults(h,e){if(h==e)return!0;for(let r=0,s=0;;){for(;r<h.length&&!h[r].hasResult;)r++;for(;s<e.length&&!e[s].hasResult;)s++;let l=r==h.length,o=s==e.length;if(l||o)return l==o;if(h[r++].result!=e[s++].result)return!1}}const baseAttrs={"aria-autocomplete":"list"};function makeAttrs(h,e){let r={"aria-autocomplete":"list","aria-haspopup":"listbox","aria-controls":h};return e>-1&&(r["aria-activedescendant"]=h+"-"+e),r}const none=[];function getUserEvent(h){return h.isUserEvent("input.type")?"input":h.isUserEvent("delete.backward")?"delete":null}class ActiveSource{constructor(e,r,s=-1){this.source=e,this.state=r,this.explicitPos=s}hasResult(){return!1}update(e,r){let s=getUserEvent(e),l=this;s?l=l.handleUserEvent(e,s,r):e.docChanged?l=l.handleChange(e):e.selection&&l.state!=0&&(l=new ActiveSource(l.source,0));for(let o of e.effects)if(o.is(startCompletionEffect))l=new ActiveSource(l.source,1,o.value?cur(e.state):-1);else if(o.is(closeCompletionEffect))l=new ActiveSource(l.source,0);else if(o.is(setActiveEffect))for(let a of o.value)a.source==l.source&&(l=a);return l}handleUserEvent(e,r,s){return r=="delete"||!s.activateOnTyping?this.map(e.changes):new ActiveSource(this.source,1)}handleChange(e){return e.changes.touchesRange(cur(e.startState))?new ActiveSource(this.source,0):this.map(e.changes)}map(e){return e.empty||this.explicitPos<0?this:new ActiveSource(this.source,this.state,e.mapPos(this.explicitPos))}}class ActiveResult extends ActiveSource{constructor(e,r,s,l,o){super(e,2,r),this.result=s,this.from=l,this.to=o}hasResult(){return!0}handleUserEvent(e,r,s){var l;let o=e.changes.mapPos(this.from),a=e.changes.mapPos(this.to,1),c=cur(e.state);if((this.explicitPos<0?c<=o:c<this.from)||c>a||r=="delete"&&cur(e.startState)==this.from)return new ActiveSource(this.source,r=="input"&&s.activateOnTyping?1:0);let M=this.explicitPos<0?-1:e.changes.mapPos(this.explicitPos),f;return checkValid(this.result.validFor,e.state,o,a)?new ActiveResult(this.source,M,this.result,o,a):this.result.update&&(f=this.result.update(this.result,o,a,new CompletionContext(e.state,c,M>=0)))?new ActiveResult(this.source,M,f,f.from,(l=f.to)!==null&&l!==void 0?l:cur(e.state)):new ActiveSource(this.source,1,M)}handleChange(e){return e.changes.touchesRange(this.from,this.to)?new ActiveSource(this.source,0):this.map(e.changes)}map(e){return e.empty?this:new ActiveResult(this.source,this.explicitPos<0?-1:e.mapPos(this.explicitPos),this.result,e.mapPos(this.from),e.mapPos(this.to,1))}}function checkValid(h,e,r,s){if(!h)return!1;let l=e.sliceDoc(r,s);return typeof h=="function"?h(l,r,s,e):ensureAnchor(h,!0).test(l)}const setActiveEffect=StateEffect.define({map(h,e){return h.map(r=>r.map(e))}}),setSelectedEffect=StateEffect.define(),completionState=StateField.define({create(){return CompletionState.start()},update(h,e){return h.update(e)},provide:h=>[showTooltip.from(h,e=>e.tooltip),EditorView.contentAttributes.from(h,e=>e.attrs)]});function applyCompletion(h,e){const r=e.completion.apply||e.completion.label;let s=h.state.field(completionState).active.find(l=>l.source==e.source);return s instanceof ActiveResult?(typeof r=="string"?h.dispatch(Object.assign(Object.assign({},insertCompletionText(h.state,r,s.from,s.to)),{annotations:pickedCompletion.of(e.completion)})):r(h,e.completion,s.from,s.to),!0):!1}function moveCompletionSelection(h,e="option"){return r=>{let s=r.state.field(completionState,!1);if(!s||!s.open||s.open.disabled||Date.now()-s.open.timestamp<r.state.facet(completionConfig).interactionDelay)return!1;let l=1,o;e=="page"&&(o=getTooltip(r,s.open.tooltip))&&(l=Math.max(2,Math.floor(o.dom.offsetHeight/o.dom.querySelector("li").offsetHeight)-1));let{length:a}=s.open.options,c=s.open.selected>-1?s.open.selected+l*(h?1:-1):h?0:a-1;return c<0?c=e=="page"?0:a-1:c>=a&&(c=e=="page"?a-1:0),r.dispatch({effects:setSelectedEffect.of(c)}),!0}}const acceptCompletion=h=>{let e=h.state.field(completionState,!1);return h.state.readOnly||!e||!e.open||e.open.selected<0||e.open.disabled||Date.now()-e.open.timestamp<h.state.facet(completionConfig).interactionDelay?!1:applyCompletion(h,e.open.options[e.open.selected])},startCompletion=h=>h.state.field(completionState,!1)?(h.dispatch({effects:startCompletionEffect.of(!0)}),!0):!1,closeCompletion=h=>{let e=h.state.field(completionState,!1);return!e||!e.active.some(r=>r.state!=0)?!1:(h.dispatch({effects:closeCompletionEffect.of(null)}),!0)};class RunningQuery{constructor(e,r){this.active=e,this.context=r,this.time=Date.now(),this.updates=[],this.done=void 0}}const DebounceTime=50,MaxUpdateCount=50,MinAbortTime=1e3,completionPlugin=ViewPlugin.fromClass(class{constructor(h){this.view=h,this.debounceUpdate=-1,this.running=[],this.debounceAccept=-1,this.composing=0;for(let e of h.state.field(completionState).active)e.state==1&&this.startQuery(e)}update(h){let e=h.state.field(completionState);if(!h.selectionSet&&!h.docChanged&&h.startState.field(completionState)==e)return;let r=h.transactions.some(s=>(s.selection||s.docChanged)&&!getUserEvent(s));for(let s=0;s<this.running.length;s++){let l=this.running[s];if(r||l.updates.length+h.transactions.length>MaxUpdateCount&&Date.now()-l.time>MinAbortTime){for(let o of l.context.abortListeners)try{o()}catch(a){logException(this.view.state,a)}l.context.abortListeners=null,this.running.splice(s--,1)}else l.updates.push(...h.transactions)}if(this.debounceUpdate>-1&&clearTimeout(this.debounceUpdate),this.debounceUpdate=e.active.some(s=>s.state==1&&!this.running.some(l=>l.active.source==s.source))?setTimeout(()=>this.startUpdate(),DebounceTime):-1,this.composing!=0)for(let s of h.transactions)getUserEvent(s)=="input"?this.composing=2:this.composing==2&&s.selection&&(this.composing=3)}startUpdate(){this.debounceUpdate=-1;let{state:h}=this.view,e=h.field(completionState);for(let r of e.active)r.state==1&&!this.running.some(s=>s.active.source==r.source)&&this.startQuery(r)}startQuery(h){let{state:e}=this.view,r=cur(e),s=new CompletionContext(e,r,h.explicitPos==r),l=new RunningQuery(h,s);this.running.push(l),Promise.resolve(h.source(s)).then(o=>{l.context.aborted||(l.done=o||null,this.scheduleAccept())},o=>{this.view.dispatch({effects:closeCompletionEffect.of(null)}),logException(this.view.state,o)})}scheduleAccept(){this.running.every(h=>h.done!==void 0)?this.accept():this.debounceAccept<0&&(this.debounceAccept=setTimeout(()=>this.accept(),DebounceTime))}accept(){var h;this.debounceAccept>-1&&clearTimeout(this.debounceAccept),this.debounceAccept=-1;let e=[],r=this.view.state.facet(completionConfig);for(let s=0;s<this.running.length;s++){let l=this.running[s];if(l.done===void 0)continue;if(this.running.splice(s--,1),l.done){let a=new ActiveResult(l.active.source,l.active.explicitPos,l.done,l.done.from,(h=l.done.to)!==null&&h!==void 0?h:cur(l.updates.length?l.updates[0].startState:this.view.state));for(let c of l.updates)a=a.update(c,r);if(a.hasResult()){e.push(a);continue}}let o=this.view.state.field(completionState).active.find(a=>a.source==l.active.source);if(o&&o.state==1)if(l.done==null){let a=new ActiveSource(l.active.source,0);for(let c of l.updates)a=a.update(c,r);a.state!=1&&e.push(a)}else this.startQuery(o)}e.length&&this.view.dispatch({effects:setActiveEffect.of(e)})}},{eventHandlers:{blur(h){let e=this.view.state.field(completionState,!1);if(e&&e.tooltip&&this.view.state.facet(completionConfig).closeOnBlur){let r=e.open&&getTooltip(this.view,e.open.tooltip);(!r||!r.dom.contains(h.relatedTarget))&&this.view.dispatch({effects:closeCompletionEffect.of(null)})}},compositionstart(){this.composing=1},compositionend(){this.composing==3&&setTimeout(()=>this.view.dispatch({effects:startCompletionEffect.of(!1)}),20),this.composing=0}}}),baseTheme$1=EditorView.baseTheme({".cm-tooltip.cm-tooltip-autocomplete":{"& > ul":{fontFamily:"monospace",whiteSpace:"nowrap",overflow:"hidden auto",maxWidth_fallback:"700px",maxWidth:"min(700px, 95vw)",minWidth:"250px",maxHeight:"10em",height:"100%",listStyle:"none",margin:0,padding:0,"& > li, & > completion-section":{padding:"1px 3px",lineHeight:1.2},"& > li":{overflowX:"hidden",textOverflow:"ellipsis",cursor:"pointer"},"& > completion-section":{display:"list-item",borderBottom:"1px solid silver",paddingLeft:"0.5em",opacity:.7}}},"&light .cm-tooltip-autocomplete ul li[aria-selected]":{background:"#17c",color:"white"},"&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]":{background:"#777"},"&dark .cm-tooltip-autocomplete ul li[aria-selected]":{background:"#347",color:"white"},"&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]":{background:"#444"},".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after":{content:'"···"',opacity:.5,display:"block",textAlign:"center"},".cm-tooltip.cm-completionInfo":{position:"absolute",padding:"3px 9px",width:"max-content",maxWidth:"400px",boxSizing:"border-box"},".cm-completionInfo.cm-completionInfo-left":{right:"100%"},".cm-completionInfo.cm-completionInfo-right":{left:"100%"},".cm-completionInfo.cm-completionInfo-left-narrow":{right:"30px"},".cm-completionInfo.cm-completionInfo-right-narrow":{left:"30px"},"&light .cm-snippetField":{backgroundColor:"#00000022"},"&dark .cm-snippetField":{backgroundColor:"#ffffff22"},".cm-snippetFieldPosition":{verticalAlign:"text-top",width:0,height:"1.15em",display:"inline-block",margin:"0 -0.7px -.7em",borderLeft:"1.4px dotted #888"},".cm-completionMatchedText":{textDecoration:"underline"},".cm-completionDetail":{marginLeft:"0.5em",fontStyle:"italic"},".cm-completionIcon":{fontSize:"90%",width:".8em",display:"inline-block",textAlign:"center",paddingRight:".6em",opacity:"0.6",boxSizing:"content-box"},".cm-completionIcon-function, .cm-completionIcon-method":{"&:after":{content:"'ƒ'"}},".cm-completionIcon-class":{"&:after":{content:"'○'"}},".cm-completionIcon-interface":{"&:after":{content:"'◌'"}},".cm-completionIcon-variable":{"&:after":{content:"'𝑥'"}},".cm-completionIcon-constant":{"&:after":{content:"'𝐶'"}},".cm-completionIcon-type":{"&:after":{content:"'𝑡'"}},".cm-completionIcon-enum":{"&:after":{content:"'∪'"}},".cm-completionIcon-property":{"&:after":{content:"'□'"}},".cm-completionIcon-keyword":{"&:after":{content:"'🔑︎'"}},".cm-completionIcon-namespace":{"&:after":{content:"'▢'"}},".cm-completionIcon-text":{"&:after":{content:"'abc'",fontSize:"50%",verticalAlign:"middle"}}}),defaults={brackets:["(","[","{","'",'"'],before:")]}:;>",stringPrefixes:[]},closeBracketEffect=StateEffect.define({map(h,e){let r=e.mapPos(h,-1,MapMode.TrackAfter);return r??void 0}}),closedBracket=new class extends RangeValue{};closedBracket.startSide=1;closedBracket.endSide=-1;const bracketState=StateField.define({create(){return RangeSet.empty},update(h,e){if(e.selection){let r=e.state.doc.lineAt(e.selection.main.head).from,s=e.startState.doc.lineAt(e.startState.selection.main.head).from;r!=e.changes.mapPos(s,-1)&&(h=RangeSet.empty)}h=h.map(e.changes);for(let r of e.effects)r.is(closeBracketEffect)&&(h=h.update({add:[closedBracket.range(r.value,r.value+1)]}));return h}});function closeBrackets(){return[inputHandler,bracketState]}const definedClosing="()[]{}<>";function closing(h){for(let e=0;e<definedClosing.length;e+=2)if(definedClosing.charCodeAt(e)==h)return definedClosing.charAt(e+1);return fromCodePoint(h<128?h:h+1)}function config(h,e){return h.languageDataAt("closeBrackets",e)[0]||defaults}const android=typeof navigator=="object"&&/Android\b/.test(navigator.userAgent),inputHandler=EditorView.inputHandler.of((h,e,r,s)=>{if((android?h.composing:h.compositionStarted)||h.state.readOnly)return!1;let l=h.state.selection.main;if(s.length>2||s.length==2&&codePointSize(codePointAt(s,0))==1||e!=l.from||r!=l.to)return!1;let o=insertBracket(h.state,s);return o?(h.dispatch(o),!0):!1}),deleteBracketPair=({state:h,dispatch:e})=>{if(h.readOnly)return!1;let s=config(h,h.selection.main.head).brackets||defaults.brackets,l=null,o=h.changeByRange(a=>{if(a.empty){let c=prevChar(h.doc,a.head);for(let M of s)if(M==c&&nextChar(h.doc,a.head)==closing(codePointAt(M,0)))return{changes:{from:a.head-M.length,to:a.head+M.length},range:EditorSelection.cursor(a.head-M.length)}}return{range:l=a}});return l||e(h.update(o,{scrollIntoView:!0,userEvent:"delete.backward"})),!l},closeBracketsKeymap=[{key:"Backspace",run:deleteBracketPair}];function insertBracket(h,e){let r=config(h,h.selection.main.head),s=r.brackets||defaults.brackets;for(let l of s){let o=closing(codePointAt(l,0));if(e==l)return o==l?handleSame(h,l,s.indexOf(l+l+l)>-1,r):handleOpen(h,l,o,r.before||defaults.before);if(e==o&&closedBracketAt(h,h.selection.main.from))return handleClose(h,l,o)}return null}function closedBracketAt(h,e){let r=!1;return h.field(bracketState).between(0,h.doc.length,s=>{s==e&&(r=!0)}),r}function nextChar(h,e){let r=h.sliceString(e,e+2);return r.slice(0,codePointSize(codePointAt(r,0)))}function prevChar(h,e){let r=h.sliceString(e-2,e);return codePointSize(codePointAt(r,0))==r.length?r:r.slice(1)}function handleOpen(h,e,r,s){let l=null,o=h.changeByRange(a=>{if(!a.empty)return{changes:[{insert:e,from:a.from},{insert:r,from:a.to}],effects:closeBracketEffect.of(a.to+e.length),range:EditorSelection.range(a.anchor+e.length,a.head+e.length)};let c=nextChar(h.doc,a.head);return!c||/\s/.test(c)||s.indexOf(c)>-1?{changes:{insert:e+r,from:a.head},effects:closeBracketEffect.of(a.head+e.length),range:EditorSelection.cursor(a.head+e.length)}:{range:l=a}});return l?null:h.update(o,{scrollIntoView:!0,userEvent:"input.type"})}function handleClose(h,e,r){let s=null,l=h.changeByRange(o=>o.empty&&nextChar(h.doc,o.head)==r?{changes:{from:o.head,to:o.head+r.length,insert:r},range:EditorSelection.cursor(o.head+r.length)}:s={range:o});return s?null:h.update(l,{scrollIntoView:!0,userEvent:"input.type"})}function handleSame(h,e,r,s){let l=s.stringPrefixes||defaults.stringPrefixes,o=null,a=h.changeByRange(c=>{if(!c.empty)return{changes:[{insert:e,from:c.from},{insert:e,from:c.to}],effects:closeBracketEffect.of(c.to+e.length),range:EditorSelection.range(c.anchor+e.length,c.head+e.length)};let M=c.head,f=nextChar(h.doc,M),u;if(f==e){if(nodeStart(h,M))return{changes:{insert:e+e,from:M},effects:closeBracketEffect.of(M+e.length),range:EditorSelection.cursor(M+e.length)};if(closedBracketAt(h,M)){let d=r&&h.sliceDoc(M,M+e.length*3)==e+e+e?e+e+e:e;return{changes:{from:M,to:M+d.length,insert:d},range:EditorSelection.cursor(M+d.length)}}}else{if(r&&h.sliceDoc(M-2*e.length,M)==e+e&&(u=canStartStringAt(h,M-2*e.length,l))>-1&&nodeStart(h,u))return{changes:{insert:e+e+e+e,from:M},effects:closeBracketEffect.of(M+e.length),range:EditorSelection.cursor(M+e.length)};if(h.charCategorizer(M)(f)!=CharCategory.Word&&canStartStringAt(h,M,l)>-1&&!probablyInString(h,M,e,l))return{changes:{insert:e+e,from:M},effects:closeBracketEffect.of(M+e.length),range:EditorSelection.cursor(M+e.length)}}return{range:o=c}});return o?null:h.update(a,{scrollIntoView:!0,userEvent:"input.type"})}function nodeStart(h,e){let r=syntaxTree(h).resolveInner(e+1);return r.parent&&r.from==e}function probablyInString(h,e,r,s){let l=syntaxTree(h).resolveInner(e,-1),o=s.reduce((a,c)=>Math.max(a,c.length),0);for(let a=0;a<5;a++){let c=h.sliceDoc(l.from,Math.min(l.to,l.from+r.length+o)),M=c.indexOf(r);if(!M||M>-1&&s.indexOf(c.slice(0,M))>-1){let u=l.firstChild;for(;u&&u.from==l.from&&u.to-u.from>r.length+M;){if(h.sliceDoc(u.to-r.length,u.to)==r)return!1;u=u.firstChild}return!0}let f=l.to==e&&l.parent;if(!f)break;l=f}return!1}function canStartStringAt(h,e,r){let s=h.charCategorizer(e);if(s(h.sliceDoc(e-1,e))!=CharCategory.Word)return e;for(let l of r){let o=e-l.length;if(h.sliceDoc(o,e)==l&&s(h.sliceDoc(o-1,o))!=CharCategory.Word)return o}return-1}function autocompletion(h={}){return[completionState,completionConfig.of(h),completionPlugin,completionKeymapExt,baseTheme$1]}const completionKeymap=[{key:"Ctrl-Space",run:startCompletion},{key:"Escape",run:closeCompletion},{key:"ArrowDown",run:moveCompletionSelection(!0)},{key:"ArrowUp",run:moveCompletionSelection(!1)},{key:"PageDown",run:moveCompletionSelection(!0,"page")},{key:"PageUp",run:moveCompletionSelection(!1,"page")},{key:"Enter",run:acceptCompletion}],completionKeymapExt=Prec.highest(keymap.computeN([completionConfig],h=>h.facet(completionConfig).defaultKeymap?[completionKeymap]:[]));class SelectedDiagnostic{constructor(e,r,s){this.from=e,this.to=r,this.diagnostic=s}}class LintState{constructor(e,r,s){this.diagnostics=e,this.panel=r,this.selected=s}static init(e,r,s){let l=e,o=s.facet(lintConfig).markerFilter;o&&(l=o(l));let a=Decoration.set(l.map(c=>c.from==c.to||c.from==c.to-1&&s.doc.lineAt(c.from).to==c.from?Decoration.widget({widget:new DiagnosticWidget(c),diagnostic:c}).range(c.from):Decoration.mark({attributes:{class:"cm-lintRange cm-lintRange-"+c.severity+(c.markClass?" "+c.markClass:"")},diagnostic:c}).range(c.from,c.to)),!0);return new LintState(a,r,findDiagnostic(a))}}function findDiagnostic(h,e=null,r=0){let s=null;return h.between(r,1e9,(l,o,{spec:a})=>{if(!(e&&a.diagnostic!=e))return s=new SelectedDiagnostic(l,o,a.diagnostic),!1}),s}function hideTooltip(h,e){let r=h.startState.doc.lineAt(e.pos);return!!(h.effects.some(s=>s.is(setDiagnosticsEffect))||h.changes.touchesRange(r.from,r.to))}function maybeEnableLint(h,e){return h.field(lintState,!1)?e:e.concat(StateEffect.appendConfig.of(lintExtensions))}const setDiagnosticsEffect=StateEffect.define(),togglePanel=StateEffect.define(),movePanelSelection=StateEffect.define(),lintState=StateField.define({create(){return new LintState(Decoration.none,null,null)},update(h,e){if(e.docChanged){let r=h.diagnostics.map(e.changes),s=null;if(h.selected){let l=e.changes.mapPos(h.selected.from,1);s=findDiagnostic(r,h.selected.diagnostic,l)||findDiagnostic(r,null,l)}h=new LintState(r,h.panel,s)}for(let r of e.effects)r.is(setDiagnosticsEffect)?h=LintState.init(r.value,h.panel,e.state):r.is(togglePanel)?h=new LintState(h.diagnostics,r.value?LintPanel.open:null,h.selected):r.is(movePanelSelection)&&(h=new LintState(h.diagnostics,h.panel,r.value));return h},provide:h=>[showPanel.from(h,e=>e.panel),EditorView.decorations.from(h,e=>e.diagnostics)]}),activeMark=Decoration.mark({class:"cm-lintRange cm-lintRange-active"});function lintTooltip(h,e,r){let{diagnostics:s}=h.state.field(lintState),l=[],o=2e8,a=0;s.between(e-(r<0?1:0),e+(r>0?1:0),(M,f,{spec:u})=>{e>=M&&e<=f&&(M==f||(e>M||r>0)&&(e<f||r<0))&&(l.push(u.diagnostic),o=Math.min(M,o),a=Math.max(f,a))});let c=h.state.facet(lintConfig).tooltipFilter;return c&&(l=c(l)),l.length?{pos:o,end:a,above:h.state.doc.lineAt(o).to<a,create(){return{dom:diagnosticsTooltip(h,l)}}}:null}function diagnosticsTooltip(h,e){return crelt("ul",{class:"cm-tooltip-lint"},e.map(r=>renderDiagnostic(h,r,!1)))}const openLintPanel=h=>{let e=h.state.field(lintState,!1);(!e||!e.panel)&&h.dispatch({effects:maybeEnableLint(h.state,[togglePanel.of(!0)])});let r=getPanel(h,LintPanel.open);return r&&r.dom.querySelector(".cm-panel-lint ul").focus(),!0},closeLintPanel=h=>{let e=h.state.field(lintState,!1);return!e||!e.panel?!1:(h.dispatch({effects:togglePanel.of(!1)}),!0)},nextDiagnostic=h=>{let e=h.state.field(lintState,!1);if(!e)return!1;let r=h.state.selection.main,s=e.diagnostics.iter(r.to+1);return!s.value&&(s=e.diagnostics.iter(0),!s.value||s.from==r.from&&s.to==r.to)?!1:(h.dispatch({selection:{anchor:s.from,head:s.to},scrollIntoView:!0}),!0)},lintKeymap=[{key:"Mod-Shift-m",run:openLintPanel,preventDefault:!0},{key:"F8",run:nextDiagnostic}],lintConfig=Facet.define({combine(h){return Object.assign({sources:h.map(e=>e.source)},combineConfig(h.map(e=>e.config),{delay:750,markerFilter:null,tooltipFilter:null,needsRefresh:null},{needsRefresh:(e,r)=>e?r?s=>e(s)||r(s):e:r}))}});function assignKeys(h){let e=[];if(h)e:for(let{name:r}of h){for(let s=0;s<r.length;s++){let l=r[s];if(/[a-zA-Z]/.test(l)&&!e.some(o=>o.toLowerCase()==l.toLowerCase())){e.push(l);continue e}}e.push("")}return e}function renderDiagnostic(h,e,r){var s;let l=r?assignKeys(e.actions):[];return crelt("li",{class:"cm-diagnostic cm-diagnostic-"+e.severity},crelt("span",{class:"cm-diagnosticText"},e.renderMessage?e.renderMessage():e.message),(s=e.actions)===null||s===void 0?void 0:s.map((o,a)=>{let c=!1,M=d=>{if(d.preventDefault(),c)return;c=!0;let p=findDiagnostic(h.state.field(lintState).diagnostics,e);p&&o.apply(h,p.from,p.to)},{name:f}=o,u=l[a]?f.indexOf(l[a]):-1,g=u<0?f:[f.slice(0,u),crelt("u",f.slice(u,u+1)),f.slice(u+1)];return crelt("button",{type:"button",class:"cm-diagnosticAction",onclick:M,onmousedown:M,"aria-label":` Action: ${f}${u<0?"":` (access key "${l[a]})"`}.`},g)}),e.source&&crelt("div",{class:"cm-diagnosticSource"},e.source))}class DiagnosticWidget extends WidgetType{constructor(e){super(),this.diagnostic=e}eq(e){return e.diagnostic==this.diagnostic}toDOM(){return crelt("span",{class:"cm-lintPoint cm-lintPoint-"+this.diagnostic.severity})}}class PanelItem{constructor(e,r){this.diagnostic=r,this.id="item_"+Math.floor(Math.random()*4294967295).toString(16),this.dom=renderDiagnostic(e,r,!0),this.dom.id=this.id,this.dom.setAttribute("role","option")}}class LintPanel{constructor(e){this.view=e,this.items=[];let r=l=>{if(l.keyCode==27)closeLintPanel(this.view),this.view.focus();else if(l.keyCode==38||l.keyCode==33)this.moveSelection((this.selectedIndex-1+this.items.length)%this.items.length);else if(l.keyCode==40||l.keyCode==34)this.moveSelection((this.selectedIndex+1)%this.items.length);else if(l.keyCode==36)this.moveSelection(0);else if(l.keyCode==35)this.moveSelection(this.items.length-1);else if(l.keyCode==13)this.view.focus();else if(l.keyCode>=65&&l.keyCode<=90&&this.selectedIndex>=0){let{diagnostic:o}=this.items[this.selectedIndex],a=assignKeys(o.actions);for(let c=0;c<a.length;c++)if(a[c].toUpperCase().charCodeAt(0)==l.keyCode){let M=findDiagnostic(this.view.state.field(lintState).diagnostics,o);M&&o.actions[c].apply(e,M.from,M.to)}}else return;l.preventDefault()},s=l=>{for(let o=0;o<this.items.length;o++)this.items[o].dom.contains(l.target)&&this.moveSelection(o)};this.list=crelt("ul",{tabIndex:0,role:"listbox","aria-label":this.view.state.phrase("Diagnostics"),onkeydown:r,onclick:s}),this.dom=crelt("div",{class:"cm-panel-lint"},this.list,crelt("button",{type:"button",name:"close","aria-label":this.view.state.phrase("close"),onclick:()=>closeLintPanel(this.view)},"×")),this.update()}get selectedIndex(){let e=this.view.state.field(lintState).selected;if(!e)return-1;for(let r=0;r<this.items.length;r++)if(this.items[r].diagnostic==e.diagnostic)return r;return-1}update(){let{diagnostics:e,selected:r}=this.view.state.field(lintState),s=0,l=!1,o=null;for(e.between(0,this.view.state.doc.length,(a,c,{spec:M})=>{let f=-1,u;for(let g=s;g<this.items.length;g++)if(this.items[g].diagnostic==M.diagnostic){f=g;break}f<0?(u=new PanelItem(this.view,M.diagnostic),this.items.splice(s,0,u),l=!0):(u=this.items[f],f>s&&(this.items.splice(s,f-s),l=!0)),r&&u.diagnostic==r.diagnostic?u.dom.hasAttribute("aria-selected")||(u.dom.setAttribute("aria-selected","true"),o=u):u.dom.hasAttribute("aria-selected")&&u.dom.removeAttribute("aria-selected"),s++});s<this.items.length&&!(this.items.length==1&&this.items[0].diagnostic.from<0);)l=!0,this.items.pop();this.items.length==0&&(this.items.push(new PanelItem(this.view,{from:-1,to:-1,severity:"info",message:this.view.state.phrase("No diagnostics")})),l=!0),o?(this.list.setAttribute("aria-activedescendant",o.id),this.view.requestMeasure({key:this,read:()=>({sel:o.dom.getBoundingClientRect(),panel:this.list.getBoundingClientRect()}),write:({sel:a,panel:c})=>{a.top<c.top?this.list.scrollTop-=c.top-a.top:a.bottom>c.bottom&&(this.list.scrollTop+=a.bottom-c.bottom)}})):this.selectedIndex<0&&this.list.removeAttribute("aria-activedescendant"),l&&this.sync()}sync(){let e=this.list.firstChild;function r(){let s=e;e=s.nextSibling,s.remove()}for(let s of this.items)if(s.dom.parentNode==this.list){for(;e!=s.dom;)r();e=s.dom.nextSibling}else this.list.insertBefore(s.dom,e);for(;e;)r()}moveSelection(e){if(this.selectedIndex<0)return;let r=this.view.state.field(lintState),s=findDiagnostic(r.diagnostics,this.items[e].diagnostic);s&&this.view.dispatch({selection:{anchor:s.from,head:s.to},scrollIntoView:!0,effects:movePanelSelection.of(s)})}static open(e){return new LintPanel(e)}}function svg(h,e='viewBox="0 0 40 40"'){return`url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${e}>${encodeURIComponent(h)}</svg>')`}function underline(h){return svg(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${h}" fill="none" stroke-width=".7"/>`,'width="6" height="3"')}const baseTheme=EditorView.baseTheme({".cm-diagnostic":{padding:"3px 6px 3px 8px",marginLeft:"-1px",display:"block",whiteSpace:"pre-wrap"},".cm-diagnostic-error":{borderLeft:"5px solid #d11"},".cm-diagnostic-warning":{borderLeft:"5px solid orange"},".cm-diagnostic-info":{borderLeft:"5px solid #999"},".cm-diagnostic-hint":{borderLeft:"5px solid #66d"},".cm-diagnosticAction":{font:"inherit",border:"none",padding:"2px 4px",backgroundColor:"#444",color:"white",borderRadius:"3px",marginLeft:"8px",cursor:"pointer"},".cm-diagnosticSource":{fontSize:"70%",opacity:.7},".cm-lintRange":{backgroundPosition:"left bottom",backgroundRepeat:"repeat-x",paddingBottom:"0.7px"},".cm-lintRange-error":{backgroundImage:underline("#d11")},".cm-lintRange-warning":{backgroundImage:underline("orange")},".cm-lintRange-info":{backgroundImage:underline("#999")},".cm-lintRange-hint":{backgroundImage:underline("#66d")},".cm-lintRange-active":{backgroundColor:"#ffdd9980"},".cm-tooltip-lint":{padding:0,margin:0},".cm-lintPoint":{position:"relative","&:after":{content:'""',position:"absolute",bottom:0,left:"-2px",borderLeft:"3px solid transparent",borderRight:"3px solid transparent",borderBottom:"4px solid #d11"}},".cm-lintPoint-warning":{"&:after":{borderBottomColor:"orange"}},".cm-lintPoint-info":{"&:after":{borderBottomColor:"#999"}},".cm-lintPoint-hint":{"&:after":{borderBottomColor:"#66d"}},".cm-panel.cm-panel-lint":{position:"relative","& ul":{maxHeight:"100px",overflowY:"auto","& [aria-selected]":{backgroundColor:"#ddd","& u":{textDecoration:"underline"}},"&:focus [aria-selected]":{background_fallback:"#bdf",backgroundColor:"Highlight",color_fallback:"white",color:"HighlightText"},"& u":{textDecoration:"none"},padding:0,margin:0},"& [name=close]":{position:"absolute",top:"0",right:"2px",background:"inherit",border:"none",font:"inherit",padding:0,margin:0}}}),lintExtensions=[lintState,EditorView.decorations.compute([lintState],h=>{let{selected:e,panel:r}=h.field(lintState);return!e||!r||e.from==e.to?Decoration.none:Decoration.set([activeMark.range(e.from,e.to)])}),hoverTooltip(lintTooltip,{hideOn:hideTooltip}),baseTheme],basicSetup=(()=>[lineNumbers(),highlightActiveLineGutter(),highlightSpecialChars(),history(),foldGutter(),drawSelection(),dropCursor(),EditorState.allowMultipleSelections.of(!0),indentOnInput(),syntaxHighlighting(defaultHighlightStyle,{fallback:!0}),bracketMatching(),closeBrackets(),autocompletion(),rectangularSelection(),crosshairCursor(),highlightActiveLine(),highlightSelectionMatches(),keymap.of([...closeBracketsKeymap,...defaultKeymap,...searchKeymap,...historyKeymap,...foldKeymap,...completionKeymap,...lintKeymap])])();class Stack{constructor(e,r,s,l,o,a,c,M,f,u=0,g){this.p=e,this.stack=r,this.state=s,this.reducePos=l,this.pos=o,this.score=a,this.buffer=c,this.bufferBase=M,this.curContext=f,this.lookAhead=u,this.parent=g}toString(){return`[${this.stack.filter((e,r)=>r%3==0).concat(this.state)}]@${this.pos}${this.score?"!"+this.score:""}`}static start(e,r,s=0){let l=e.parser.context;return new Stack(e,[],r,s,s,0,[],0,l?new StackContext(l,l.start):null,0,null)}get context(){return this.curContext?this.curContext.context:null}pushState(e,r){this.stack.push(this.state,r,this.bufferBase+this.buffer.length),this.state=e}reduce(e){var r;let s=e>>19,l=e&65535,{parser:o}=this.p,a=o.dynamicPrecedence(l);if(a&&(this.score+=a),s==0){this.pushState(o.getGoto(this.state,l,!0),this.reducePos),l<o.minRepeatTerm&&this.storeNode(l,this.reducePos,this.reducePos,4,!0),this.reduceContext(l,this.reducePos);return}let c=this.stack.length-(s-1)*3-(e&262144?6:0),M=c?this.stack[c-2]:this.p.ranges[0].from,f=this.reducePos-M;f>=2e3&&!(!((r=this.p.parser.nodeSet.types[l])===null||r===void 0)&&r.isAnonymous)&&(M==this.p.lastBigReductionStart?(this.p.bigReductionCount++,this.p.lastBigReductionSize=f):this.p.lastBigReductionSize<f&&(this.p.bigReductionCount=1,this.p.lastBigReductionStart=M,this.p.lastBigReductionSize=f));let u=c?this.stack[c-1]:0,g=this.bufferBase+this.buffer.length-u;if(l<o.minRepeatTerm||e&131072){let d=o.stateFlag(this.state,1)?this.pos:this.reducePos;this.storeNode(l,M,d,g+4,!0)}if(e&262144)this.state=this.stack[c];else{let d=this.stack[c-3];this.state=o.getGoto(d,l,!0)}for(;this.stack.length>c;)this.stack.pop();this.reduceContext(l,M)}storeNode(e,r,s,l=4,o=!1){if(e==0&&(!this.stack.length||this.stack[this.stack.length-1]<this.buffer.length+this.bufferBase)){let a=this,c=this.buffer.length;if(c==0&&a.parent&&(c=a.bufferBase-a.parent.bufferBase,a=a.parent),c>0&&a.buffer[c-4]==0&&a.buffer[c-1]>-1){if(r==s)return;if(a.buffer[c-2]>=r){a.buffer[c-2]=s;return}}}if(!o||this.pos==s)this.buffer.push(e,r,s,l);else{let a=this.buffer.length;if(a>0&&this.buffer[a-4]!=0)for(;a>0&&this.buffer[a-2]>s;)this.buffer[a]=this.buffer[a-4],this.buffer[a+1]=this.buffer[a-3],this.buffer[a+2]=this.buffer[a-2],this.buffer[a+3]=this.buffer[a-1],a-=4,l>4&&(l-=4);this.buffer[a]=e,this.buffer[a+1]=r,this.buffer[a+2]=s,this.buffer[a+3]=l}}shift(e,r,s){let l=this.pos;if(e&131072)this.pushState(e&65535,this.pos);else if(e&262144)this.pos=s,this.shiftContext(r,l),r<=this.p.parser.maxNode&&this.buffer.push(r,l,s,4);else{let o=e,{parser:a}=this.p;(s>this.pos||r<=a.maxNode)&&(this.pos=s,a.stateFlag(o,1)||(this.reducePos=s)),this.pushState(o,l),this.shiftContext(r,l),r<=a.maxNode&&this.buffer.push(r,l,s,4)}}apply(e,r,s){e&65536?this.reduce(e):this.shift(e,r,s)}useNode(e,r){let s=this.p.reused.length-1;(s<0||this.p.reused[s]!=e)&&(this.p.reused.push(e),s++);let l=this.pos;this.reducePos=this.pos=l+e.length,this.pushState(r,l),this.buffer.push(s,l,this.reducePos,-1),this.curContext&&this.updateContext(this.curContext.tracker.reuse(this.curContext.context,e,this,this.p.stream.reset(this.pos-e.length)))}split(){let e=this,r=e.buffer.length;for(;r>0&&e.buffer[r-2]>e.reducePos;)r-=4;let s=e.buffer.slice(r),l=e.bufferBase+r;for(;e&&l==e.bufferBase;)e=e.parent;return new Stack(this.p,this.stack.slice(),this.state,this.reducePos,this.pos,this.score,s,l,this.curContext,this.lookAhead,e)}recoverByDelete(e,r){let s=e<=this.p.parser.maxNode;s&&this.storeNode(e,this.pos,r,4),this.storeNode(0,this.pos,r,s?8:4),this.pos=this.reducePos=r,this.score-=190}canShift(e){for(let r=new SimulatedStack(this);;){let s=this.p.parser.stateSlot(r.state,4)||this.p.parser.hasAction(r.state,e);if(s==0)return!1;if(!(s&65536))return!0;r.reduce(s)}}recoverByInsert(e){if(this.stack.length>=300)return[];let r=this.p.parser.nextStates(this.state);if(r.length>8||this.stack.length>=120){let l=[];for(let o=0,a;o<r.length;o+=2)(a=r[o+1])!=this.state&&this.p.parser.hasAction(a,e)&&l.push(r[o],a);if(this.stack.length<120)for(let o=0;l.length<8&&o<r.length;o+=2){let a=r[o+1];l.some((c,M)=>M&1&&c==a)||l.push(r[o],a)}r=l}let s=[];for(let l=0;l<r.length&&s.length<4;l+=2){let o=r[l+1];if(o==this.state)continue;let a=this.split();a.pushState(o,this.pos),a.storeNode(0,a.pos,a.pos,4,!0),a.shiftContext(r[l],this.pos),a.score-=200,s.push(a)}return s}forceReduce(){let{parser:e}=this.p,r=e.stateSlot(this.state,5);if(!(r&65536))return!1;if(!e.validAction(this.state,r)){let s=r>>19,l=r&65535,o=this.stack.length-s*3;if(o<0||e.getGoto(this.stack[o],l,!1)<0){let a=this.findForcedReduction();if(a==null)return!1;r=a}this.storeNode(0,this.pos,this.pos,4,!0),this.score-=100}return this.reducePos=this.pos,this.reduce(r),!0}findForcedReduction(){let{parser:e}=this.p,r=[],s=(l,o)=>{if(!r.includes(l))return r.push(l),e.allActions(l,a=>{if(!(a&393216))if(a&65536){let c=(a>>19)-o;if(c>1){let M=a&65535,f=this.stack.length-c*3;if(f>=0&&e.getGoto(this.stack[f],M,!1)>=0)return c<<19|65536|M}}else{let c=s(a,o+1);if(c!=null)return c}})};return s(this.state,0)}forceAll(){for(;!this.p.parser.stateFlag(this.state,2);)if(!this.forceReduce()){this.storeNode(0,this.pos,this.pos,4,!0);break}return this}get deadEnd(){if(this.stack.length!=3)return!1;let{parser:e}=this.p;return e.data[e.stateSlot(this.state,1)]==65535&&!e.stateSlot(this.state,4)}restart(){this.state=this.stack[0],this.stack.length=0}sameState(e){if(this.state!=e.state||this.stack.length!=e.stack.length)return!1;for(let r=0;r<this.stack.length;r+=3)if(this.stack[r]!=e.stack[r])return!1;return!0}get parser(){return this.p.parser}dialectEnabled(e){return this.p.parser.dialect.flags[e]}shiftContext(e,r){this.curContext&&this.updateContext(this.curContext.tracker.shift(this.curContext.context,e,this,this.p.stream.reset(r)))}reduceContext(e,r){this.curContext&&this.updateContext(this.curContext.tracker.reduce(this.curContext.context,e,this,this.p.stream.reset(r)))}emitContext(){let e=this.buffer.length-1;(e<0||this.buffer[e]!=-3)&&this.buffer.push(this.curContext.hash,this.pos,this.pos,-3)}emitLookAhead(){let e=this.buffer.length-1;(e<0||this.buffer[e]!=-4)&&this.buffer.push(this.lookAhead,this.pos,this.pos,-4)}updateContext(e){if(e!=this.curContext.context){let r=new StackContext(this.curContext.tracker,e);r.hash!=this.curContext.hash&&this.emitContext(),this.curContext=r}}setLookAhead(e){e>this.lookAhead&&(this.emitLookAhead(),this.lookAhead=e)}close(){this.curContext&&this.curContext.tracker.strict&&this.emitContext(),this.lookAhead>0&&this.emitLookAhead()}}class StackContext{constructor(e,r){this.tracker=e,this.context=r,this.hash=e.strict?e.hash(r):0}}class SimulatedStack{constructor(e){this.start=e,this.state=e.state,this.stack=e.stack,this.base=this.stack.length}reduce(e){let r=e&65535,s=e>>19;s==0?(this.stack==this.start.stack&&(this.stack=this.stack.slice()),this.stack.push(this.state,0,0),this.base+=3):this.base-=(s-1)*3;let l=this.start.p.parser.getGoto(this.stack[this.base-3],r,!0);this.state=l}}class StackBufferCursor{constructor(e,r,s){this.stack=e,this.pos=r,this.index=s,this.buffer=e.buffer,this.index==0&&this.maybeNext()}static create(e,r=e.bufferBase+e.buffer.length){return new StackBufferCursor(e,r,r-e.bufferBase)}maybeNext(){let e=this.stack.parent;e!=null&&(this.index=this.stack.bufferBase-e.bufferBase,this.stack=e,this.buffer=e.buffer)}get id(){return this.buffer[this.index-4]}get start(){return this.buffer[this.index-3]}get end(){return this.buffer[this.index-2]}get size(){return this.buffer[this.index-1]}next(){this.index-=4,this.pos-=4,this.index==0&&this.maybeNext()}fork(){return new StackBufferCursor(this.stack,this.pos,this.index)}}function decodeArray(h,e=Uint16Array){if(typeof h!="string")return h;let r=null;for(let s=0,l=0;s<h.length;){let o=0;for(;;){let a=h.charCodeAt(s++),c=!1;if(a==126){o=65535;break}a>=92&&a--,a>=34&&a--;let M=a-32;if(M>=46&&(M-=46,c=!0),o+=M,c)break;o*=46}r?r[l++]=o:r=new e(o)}return r}class CachedToken{constructor(){this.start=-1,this.value=-1,this.end=-1,this.extended=-1,this.lookAhead=0,this.mask=0,this.context=0}}const nullToken=new CachedToken;class InputStream{constructor(e,r){this.input=e,this.ranges=r,this.chunk="",this.chunkOff=0,this.chunk2="",this.chunk2Pos=0,this.next=-1,this.token=nullToken,this.rangeIndex=0,this.pos=this.chunkPos=r[0].from,this.range=r[0],this.end=r[r.length-1].to,this.readNext()}resolveOffset(e,r){let s=this.range,l=this.rangeIndex,o=this.pos+e;for(;o<s.from;){if(!l)return null;let a=this.ranges[--l];o-=s.from-a.to,s=a}for(;r<0?o>s.to:o>=s.to;){if(l==this.ranges.length-1)return null;let a=this.ranges[++l];o+=a.from-s.to,s=a}return o}clipPos(e){if(e>=this.range.from&&e<this.range.to)return e;for(let r of this.ranges)if(r.to>e)return Math.max(e,r.from);return this.end}peek(e){let r=this.chunkOff+e,s,l;if(r>=0&&r<this.chunk.length)s=this.pos+e,l=this.chunk.charCodeAt(r);else{let o=this.resolveOffset(e,1);if(o==null)return-1;if(s=o,s>=this.chunk2Pos&&s<this.chunk2Pos+this.chunk2.length)l=this.chunk2.charCodeAt(s-this.chunk2Pos);else{let a=this.rangeIndex,c=this.range;for(;c.to<=s;)c=this.ranges[++a];this.chunk2=this.input.chunk(this.chunk2Pos=s),s+this.chunk2.length>c.to&&(this.chunk2=this.chunk2.slice(0,c.to-s)),l=this.chunk2.charCodeAt(0)}}return s>=this.token.lookAhead&&(this.token.lookAhead=s+1),l}acceptToken(e,r=0){let s=r?this.resolveOffset(r,-1):this.pos;if(s==null||s<this.token.start)throw new RangeError("Token end out of bounds");this.token.value=e,this.token.end=s}getChunk(){if(this.pos>=this.chunk2Pos&&this.pos<this.chunk2Pos+this.chunk2.length){let{chunk:e,chunkPos:r}=this;this.chunk=this.chunk2,this.chunkPos=this.chunk2Pos,this.chunk2=e,this.chunk2Pos=r,this.chunkOff=this.pos-this.chunkPos}else{this.chunk2=this.chunk,this.chunk2Pos=this.chunkPos;let e=this.input.chunk(this.pos),r=this.pos+e.length;this.chunk=r>this.range.to?e.slice(0,this.range.to-this.pos):e,this.chunkPos=this.pos,this.chunkOff=0}}readNext(){return this.chunkOff>=this.chunk.length&&(this.getChunk(),this.chunkOff==this.chunk.length)?this.next=-1:this.next=this.chunk.charCodeAt(this.chunkOff)}advance(e=1){for(this.chunkOff+=e;this.pos+e>=this.range.to;){if(this.rangeIndex==this.ranges.length-1)return this.setDone();e-=this.range.to-this.pos,this.range=this.ranges[++this.rangeIndex],this.pos=this.range.from}return this.pos+=e,this.pos>=this.token.lookAhead&&(this.token.lookAhead=this.pos+1),this.readNext()}setDone(){return this.pos=this.chunkPos=this.end,this.range=this.ranges[this.rangeIndex=this.ranges.length-1],this.chunk="",this.next=-1}reset(e,r){if(r?(this.token=r,r.start=e,r.lookAhead=e+1,r.value=r.extended=-1):this.token=nullToken,this.pos!=e){if(this.pos=e,e==this.end)return this.setDone(),this;for(;e<this.range.from;)this.range=this.ranges[--this.rangeIndex];for(;e>=this.range.to;)this.range=this.ranges[++this.rangeIndex];e>=this.chunkPos&&e<this.chunkPos+this.chunk.length?this.chunkOff=e-this.chunkPos:(this.chunk="",this.chunkOff=0),this.readNext()}return this}read(e,r){if(e>=this.chunkPos&&r<=this.chunkPos+this.chunk.length)return this.chunk.slice(e-this.chunkPos,r-this.chunkPos);if(e>=this.chunk2Pos&&r<=this.chunk2Pos+this.chunk2.length)return this.chunk2.slice(e-this.chunk2Pos,r-this.chunk2Pos);if(e>=this.range.from&&r<=this.range.to)return this.input.read(e,r);let s="";for(let l of this.ranges){if(l.from>=r)break;l.to>e&&(s+=this.input.read(Math.max(l.from,e),Math.min(l.to,r)))}return s}}class TokenGroup{constructor(e,r){this.data=e,this.id=r}token(e,r){let{parser:s}=r.p;readToken(this.data,e,r,this.id,s.data,s.tokenPrecTable)}}TokenGroup.prototype.contextual=TokenGroup.prototype.fallback=TokenGroup.prototype.extend=!1;TokenGroup.prototype.fallback=TokenGroup.prototype.extend=!1;function readToken(h,e,r,s,l,o){let a=0,c=1<<s,{dialect:M}=r.p.parser;e:for(;c&h[a];){let f=h[a+1];for(let p=a+3;p<f;p+=2)if((h[p+1]&c)>0){let m=h[p];if(M.allows(m)&&(e.token.value==-1||e.token.value==m||overrides(m,e.token.value,l,o))){e.acceptToken(m);break}}let u=e.next,g=0,d=h[a+2];if(e.next<0&&d>g&&h[f+d*3-3]==65535&&h[f+d*3-3]==65535){a=h[f+d*3-1];continue e}for(;g<d;){let p=g+d>>1,m=f+p+(p<<1),w=h[m],y=h[m+1]||65536;if(u<w)d=p;else if(u>=y)g=p+1;else{a=h[m+2],e.advance();continue e}}break}}function findOffset(h,e,r){for(let s=e,l;(l=h[s])!=65535;s++)if(l==r)return s-e;return-1}function overrides(h,e,r,s){let l=findOffset(r,s,e);return l<0||findOffset(r,s,h)<l}const verbose=typeof process<"u"&&process.env&&/\bparse\b/.test({}.LOG);let stackIDs=null;function cutAt(h,e,r){let s=h.cursor(IterMode.IncludeAnonymous);for(s.moveTo(e);;)if(!(r<0?s.childBefore(e):s.childAfter(e)))for(;;){if((r<0?s.to<e:s.from>e)&&!s.type.isError)return r<0?Math.max(0,Math.min(s.to-1,e-25)):Math.min(h.length,Math.max(s.from+1,e+25));if(r<0?s.prevSibling():s.nextSibling())break;if(!s.parent())return r<0?0:h.length}}class FragmentCursor{constructor(e,r){this.fragments=e,this.nodeSet=r,this.i=0,this.fragment=null,this.safeFrom=-1,this.safeTo=-1,this.trees=[],this.start=[],this.index=[],this.nextFragment()}nextFragment(){let e=this.fragment=this.i==this.fragments.length?null:this.fragments[this.i++];if(e){for(this.safeFrom=e.openStart?cutAt(e.tree,e.from+e.offset,1)-e.offset:e.from,this.safeTo=e.openEnd?cutAt(e.tree,e.to+e.offset,-1)-e.offset:e.to;this.trees.length;)this.trees.pop(),this.start.pop(),this.index.pop();this.trees.push(e.tree),this.start.push(-e.offset),this.index.push(0),this.nextStart=this.safeFrom}else this.nextStart=1e9}nodeAt(e){if(e<this.nextStart)return null;for(;this.fragment&&this.safeTo<=e;)this.nextFragment();if(!this.fragment)return null;for(;;){let r=this.trees.length-1;if(r<0)return this.nextFragment(),null;let s=this.trees[r],l=this.index[r];if(l==s.children.length){this.trees.pop(),this.start.pop(),this.index.pop();continue}let o=s.children[l],a=this.start[r]+s.positions[l];if(a>e)return this.nextStart=a,null;if(o instanceof Tree){if(a==e){if(a<this.safeFrom)return null;let c=a+o.length;if(c<=this.safeTo){let M=o.prop(NodeProp.lookAhead);if(!M||c+M<this.fragment.to)return o}}this.index[r]++,a+o.length>=Math.max(this.safeFrom,e)&&(this.trees.push(o),this.start.push(a),this.index.push(0))}else this.index[r]++,this.nextStart=a+o.length}}}class TokenCache{constructor(e,r){this.stream=r,this.tokens=[],this.mainToken=null,this.actions=[],this.tokens=e.tokenizers.map(s=>new CachedToken)}getActions(e){let r=0,s=null,{parser:l}=e.p,{tokenizers:o}=l,a=l.stateSlot(e.state,3),c=e.curContext?e.curContext.hash:0,M=0;for(let f=0;f<o.length;f++){if(!(1<<f&a))continue;let u=o[f],g=this.tokens[f];if(!(s&&!u.fallback)&&((u.contextual||g.start!=e.pos||g.mask!=a||g.context!=c)&&(this.updateCachedToken(g,u,e),g.mask=a,g.context=c),g.lookAhead>g.end+25&&(M=Math.max(g.lookAhead,M)),g.value!=0)){let d=r;if(g.extended>-1&&(r=this.addActions(e,g.extended,g.end,r)),r=this.addActions(e,g.value,g.end,r),!u.extend&&(s=g,r>d))break}}for(;this.actions.length>r;)this.actions.pop();return M&&e.setLookAhead(M),!s&&e.pos==this.stream.end&&(s=new CachedToken,s.value=e.p.parser.eofTerm,s.start=s.end=e.pos,r=this.addActions(e,s.value,s.end,r)),this.mainToken=s,this.actions}getMainToken(e){if(this.mainToken)return this.mainToken;let r=new CachedToken,{pos:s,p:l}=e;return r.start=s,r.end=Math.min(s+1,l.stream.end),r.value=s==l.stream.end?l.parser.eofTerm:0,r}updateCachedToken(e,r,s){let l=this.stream.clipPos(s.pos);if(r.token(this.stream.reset(l,e),s),e.value>-1){let{parser:o}=s.p;for(let a=0;a<o.specialized.length;a++)if(o.specialized[a]==e.value){let c=o.specializers[a](this.stream.read(e.start,e.end),s);if(c>=0&&s.p.parser.dialect.allows(c>>1)){c&1?e.extended=c>>1:e.value=c>>1;break}}}else e.value=0,e.end=this.stream.clipPos(l+1)}putAction(e,r,s,l){for(let o=0;o<l;o+=3)if(this.actions[o]==e)return l;return this.actions[l++]=e,this.actions[l++]=r,this.actions[l++]=s,l}addActions(e,r,s,l){let{state:o}=e,{parser:a}=e.p,{data:c}=a;for(let M=0;M<2;M++)for(let f=a.stateSlot(o,M?2:1);;f+=3){if(c[f]==65535)if(c[f+1]==1)f=pair(c,f+2);else{l==0&&c[f+1]==2&&(l=this.putAction(pair(c,f+2),r,s,l));break}c[f]==r&&(l=this.putAction(pair(c,f+1),r,s,l))}return l}}class Parse{constructor(e,r,s,l){this.parser=e,this.input=r,this.ranges=l,this.recovering=0,this.nextStackID=9812,this.minStackPos=0,this.reused=[],this.stoppedAt=null,this.lastBigReductionStart=-1,this.lastBigReductionSize=0,this.bigReductionCount=0,this.stream=new InputStream(r,l),this.tokens=new TokenCache(e,this.stream),this.topTerm=e.top[1];let{from:o}=l[0];this.stacks=[Stack.start(this,e.top[0],o)],this.fragments=s.length&&this.stream.end-o>e.bufferLength*4?new FragmentCursor(s,e.nodeSet):null}get parsedPos(){return this.minStackPos}advance(){let e=this.stacks,r=this.minStackPos,s=this.stacks=[],l,o;if(this.bigReductionCount>300&&e.length==1){let[a]=e;for(;a.forceReduce()&&a.stack.length&&a.stack[a.stack.length-2]>=this.lastBigReductionStart;);this.bigReductionCount=this.lastBigReductionSize=0}for(let a=0;a<e.length;a++){let c=e[a];for(;;){if(this.tokens.mainToken=null,c.pos>r)s.push(c);else{if(this.advanceStack(c,s,e))continue;{l||(l=[],o=[]),l.push(c);let M=this.tokens.getMainToken(c);o.push(M.value,M.end)}}break}}if(!s.length){let a=l&&findFinished(l);if(a)return verbose&&console.log("Finish with "+this.stackID(a)),this.stackToTree(a);if(this.parser.strict)throw verbose&&l&&console.log("Stuck with token "+(this.tokens.mainToken?this.parser.getName(this.tokens.mainToken.value):"none")),new SyntaxError("No parse at "+r);this.recovering||(this.recovering=5)}if(this.recovering&&l){let a=this.stoppedAt!=null&&l[0].pos>this.stoppedAt?l[0]:this.runRecovery(l,o,s);if(a)return verbose&&console.log("Force-finish "+this.stackID(a)),this.stackToTree(a.forceAll())}if(this.recovering){let a=this.recovering==1?1:this.recovering*3;if(s.length>a)for(s.sort((c,M)=>M.score-c.score);s.length>a;)s.pop();s.some(c=>c.reducePos>r)&&this.recovering--}else if(s.length>1){e:for(let a=0;a<s.length-1;a++){let c=s[a];for(let M=a+1;M<s.length;M++){let f=s[M];if(c.sameState(f)||c.buffer.length>500&&f.buffer.length>500)if((c.score-f.score||c.buffer.length-f.buffer.length)>0)s.splice(M--,1);else{s.splice(a--,1);continue e}}}s.length>12&&s.splice(12,s.length-12)}this.minStackPos=s[0].pos;for(let a=1;a<s.length;a++)s[a].pos<this.minStackPos&&(this.minStackPos=s[a].pos);return null}stopAt(e){if(this.stoppedAt!=null&&this.stoppedAt<e)throw new RangeError("Can't move stoppedAt forward");this.stoppedAt=e}advanceStack(e,r,s){let l=e.pos,{parser:o}=this,a=verbose?this.stackID(e)+" -> ":"";if(this.stoppedAt!=null&&l>this.stoppedAt)return e.forceReduce()?e:null;if(this.fragments){let f=e.curContext&&e.curContext.tracker.strict,u=f?e.curContext.hash:0;for(let g=this.fragments.nodeAt(l);g;){let d=this.parser.nodeSet.types[g.type.id]==g.type?o.getGoto(e.state,g.type.id):-1;if(d>-1&&g.length&&(!f||(g.prop(NodeProp.contextHash)||0)==u))return e.useNode(g,d),verbose&&console.log(a+this.stackID(e)+` (via reuse of ${o.getName(g.type.id)})`),!0;if(!(g instanceof Tree)||g.children.length==0||g.positions[0]>0)break;let p=g.children[0];if(p instanceof Tree&&g.positions[0]==0)g=p;else break}}let c=o.stateSlot(e.state,4);if(c>0)return e.reduce(c),verbose&&console.log(a+this.stackID(e)+` (via always-reduce ${o.getName(c&65535)})`),!0;if(e.stack.length>=15e3)for(;e.stack.length>9e3&&e.forceReduce(););let M=this.tokens.getActions(e);for(let f=0;f<M.length;){let u=M[f++],g=M[f++],d=M[f++],p=f==M.length||!s,m=p?e:e.split();if(m.apply(u,g,d),verbose&&console.log(a+this.stackID(m)+` (via ${u&65536?`reduce of ${o.getName(u&65535)}`:"shift"} for ${o.getName(g)} @ ${l}${m==e?"":", split"})`),p)return!0;m.pos>l?r.push(m):s.push(m)}return!1}advanceFully(e,r){let s=e.pos;for(;;){if(!this.advanceStack(e,null,null))return!1;if(e.pos>s)return pushStackDedup(e,r),!0}}runRecovery(e,r,s){let l=null,o=!1;for(let a=0;a<e.length;a++){let c=e[a],M=r[a<<1],f=r[(a<<1)+1],u=verbose?this.stackID(c)+" -> ":"";if(c.deadEnd&&(o||(o=!0,c.restart(),verbose&&console.log(u+this.stackID(c)+" (restarted)"),this.advanceFully(c,s))))continue;let g=c.split(),d=u;for(let p=0;g.forceReduce()&&p<10&&(verbose&&console.log(d+this.stackID(g)+" (via force-reduce)"),!this.advanceFully(g,s));p++)verbose&&(d=this.stackID(g)+" -> ");for(let p of c.recoverByInsert(M))verbose&&console.log(u+this.stackID(p)+" (via recover-insert)"),this.advanceFully(p,s);this.stream.end>c.pos?(f==c.pos&&(f++,M=0),c.recoverByDelete(M,f),verbose&&console.log(u+this.stackID(c)+` (via recover-delete ${this.parser.getName(M)})`),pushStackDedup(c,s)):(!l||l.score<c.score)&&(l=c)}return l}stackToTree(e){return e.close(),Tree.build({buffer:StackBufferCursor.create(e),nodeSet:this.parser.nodeSet,topID:this.topTerm,maxBufferLength:this.parser.bufferLength,reused:this.reused,start:this.ranges[0].from,length:e.pos-this.ranges[0].from,minRepeatType:this.parser.minRepeatTerm})}stackID(e){let r=(stackIDs||(stackIDs=new WeakMap)).get(e);return r||stackIDs.set(e,r=String.fromCodePoint(this.nextStackID++)),r+e}}function pushStackDedup(h,e){for(let r=0;r<e.length;r++){let s=e[r];if(s.pos==h.pos&&s.sameState(h)){e[r].score<h.score&&(e[r]=h);return}}e.push(h)}class Dialect{constructor(e,r,s){this.source=e,this.flags=r,this.disabled=s}allows(e){return!this.disabled||this.disabled[e]==0}}class LRParser extends Parser{constructor(e){if(super(),this.wrappers=[],e.version!=14)throw new RangeError(`Parser version (${e.version}) doesn't match runtime version (14)`);let r=e.nodeNames.split(" ");this.minRepeatTerm=r.length;for(let c=0;c<e.repeatNodeCount;c++)r.push("");let s=Object.keys(e.topRules).map(c=>e.topRules[c][1]),l=[];for(let c=0;c<r.length;c++)l.push([]);function o(c,M,f){l[c].push([M,M.deserialize(String(f))])}if(e.nodeProps)for(let c of e.nodeProps){let M=c[0];typeof M=="string"&&(M=NodeProp[M]);for(let f=1;f<c.length;){let u=c[f++];if(u>=0)o(u,M,c[f++]);else{let g=c[f+-u];for(let d=-u;d>0;d--)o(c[f++],M,g);f++}}}this.nodeSet=new NodeSet(r.map((c,M)=>NodeType.define({name:M>=this.minRepeatTerm?void 0:c,id:M,props:l[M],top:s.indexOf(M)>-1,error:M==0,skipped:e.skippedNodes&&e.skippedNodes.indexOf(M)>-1}))),e.propSources&&(this.nodeSet=this.nodeSet.extend(...e.propSources)),this.strict=!1,this.bufferLength=DefaultBufferLength;let a=decodeArray(e.tokenData);this.context=e.context,this.specializerSpecs=e.specialized||[],this.specialized=new Uint16Array(this.specializerSpecs.length);for(let c=0;c<this.specializerSpecs.length;c++)this.specialized[c]=this.specializerSpecs[c].term;this.specializers=this.specializerSpecs.map(getSpecializer),this.states=decodeArray(e.states,Uint32Array),this.data=decodeArray(e.stateData),this.goto=decodeArray(e.goto),this.maxTerm=e.maxTerm,this.tokenizers=e.tokenizers.map(c=>typeof c=="number"?new TokenGroup(a,c):c),this.topRules=e.topRules,this.dialects=e.dialects||{},this.dynamicPrecedences=e.dynamicPrecedences||null,this.tokenPrecTable=e.tokenPrec,this.termNames=e.termNames||null,this.maxNode=this.nodeSet.types.length-1,this.dialect=this.parseDialect(),this.top=this.topRules[Object.keys(this.topRules)[0]]}createParse(e,r,s){let l=new Parse(this,e,r,s);for(let o of this.wrappers)l=o(l,e,r,s);return l}getGoto(e,r,s=!1){let l=this.goto;if(r>=l[0])return-1;for(let o=l[r+1];;){let a=l[o++],c=a&1,M=l[o++];if(c&&s)return M;for(let f=o+(a>>1);o<f;o++)if(l[o]==e)return M;if(c)return-1}}hasAction(e,r){let s=this.data;for(let l=0;l<2;l++)for(let o=this.stateSlot(e,l?2:1),a;;o+=3){if((a=s[o])==65535)if(s[o+1]==1)a=s[o=pair(s,o+2)];else{if(s[o+1]==2)return pair(s,o+2);break}if(a==r||a==0)return pair(s,o+1)}return 0}stateSlot(e,r){return this.states[e*6+r]}stateFlag(e,r){return(this.stateSlot(e,0)&r)>0}validAction(e,r){return!!this.allActions(e,s=>s==r?!0:null)}allActions(e,r){let s=this.stateSlot(e,4),l=s?r(s):void 0;for(let o=this.stateSlot(e,1);l==null;o+=3){if(this.data[o]==65535)if(this.data[o+1]==1)o=pair(this.data,o+2);else break;l=r(pair(this.data,o+1))}return l}nextStates(e){let r=[];for(let s=this.stateSlot(e,1);;s+=3){if(this.data[s]==65535)if(this.data[s+1]==1)s=pair(this.data,s+2);else break;if(!(this.data[s+2]&1)){let l=this.data[s+1];r.some((o,a)=>a&1&&o==l)||r.push(this.data[s],l)}}return r}configure(e){let r=Object.assign(Object.create(LRParser.prototype),this);if(e.props&&(r.nodeSet=this.nodeSet.extend(...e.props)),e.top){let s=this.topRules[e.top];if(!s)throw new RangeError(`Invalid top rule name ${e.top}`);r.top=s}return e.tokenizers&&(r.tokenizers=this.tokenizers.map(s=>{let l=e.tokenizers.find(o=>o.from==s);return l?l.to:s})),e.specializers&&(r.specializers=this.specializers.slice(),r.specializerSpecs=this.specializerSpecs.map((s,l)=>{let o=e.specializers.find(c=>c.from==s.external);if(!o)return s;let a=Object.assign(Object.assign({},s),{external:o.to});return r.specializers[l]=getSpecializer(a),a})),e.contextTracker&&(r.context=e.contextTracker),e.dialect&&(r.dialect=this.parseDialect(e.dialect)),e.strict!=null&&(r.strict=e.strict),e.wrap&&(r.wrappers=r.wrappers.concat(e.wrap)),e.bufferLength!=null&&(r.bufferLength=e.bufferLength),r}hasWrappers(){return this.wrappers.length>0}getName(e){return this.termNames?this.termNames[e]:String(e<=this.maxNode&&this.nodeSet.types[e].name||e)}get eofTerm(){return this.maxNode+1}get topNode(){return this.nodeSet.types[this.top[1]]}dynamicPrecedence(e){let r=this.dynamicPrecedences;return r==null?0:r[e]||0}parseDialect(e){let r=Object.keys(this.dialects),s=r.map(()=>!1);if(e)for(let o of e.split(" ")){let a=r.indexOf(o);a>=0&&(s[a]=!0)}let l=null;for(let o=0;o<r.length;o++)if(!s[o])for(let a=this.dialects[r[o]],c;(c=this.data[a++])!=65535;)(l||(l=new Uint8Array(this.maxTerm+1)))[c]=1;return new Dialect(e,s,l)}static deserialize(e){return new LRParser(e)}}function pair(h,e){return h[e]|h[e+1]<<16}function findFinished(h){let e=null;for(let r of h){let s=r.p.stoppedAt;(r.pos==r.p.stream.end||s!=null&&r.pos>s)&&r.p.parser.stateFlag(r.state,2)&&(!e||e.score<r.score)&&(e=r)}return e}function getSpecializer(h){if(h.external){let e=h.extend?1:0;return(r,s)=>h.external(r,s)<<1|e}return h.get}let flag=()=>new NodeProp({deserialize:h=>!0});const coll$2=flag(),prefixColl=flag(),prefixEdge=flag(),sameEdge=flag(),prefixContainer=flag();var props=Object.freeze({__proto__:null,coll:coll$2,prefixColl,prefixEdge,sameEdge,prefixContainer});const spec_Symbol={__proto__:null,true:136,false:136,nil:138,def:147,defn:147,"defn-":147,defmacro:147,definline:147,defonce:147,deftest:147,defcard:147,ns:155},parser=LRParser.deserialize({version:14,states:"-zQ]QPOOP!pOPOOOOQO'#C`'#C`OOQO'#Cb'#CbO]QPO'#CcO]QPO'#CeO]QPO'#CgO]QPO'#CiO]QPO'#CkO]OPO'#CtO]OPO'#CvO!uOQO'#C|OOQO'#Dm'#DmQ]QPOOO$hQPO'#CqO$oQPO'#DUO$vQPO'#DXO$}OSO'#DZO%cOPO'#D]O%hOPO'#D`O%mOPO'#DbO%uOWO'#DdO]QPO'#DgO]QPO'#DhO%zQPO'#DjOOQO'#Dq'#DqP&SQPO'#C^POOO)C?e)C?eOOQO,58},58}OOQO,59P,59POOQO,59R,59ROOQO,59T,59TOOQO,59V,59VOOQO,59`,59`OOQO,59b,59bOOQO,59h,59hO'gOPO,59hOOQO-E7k-E7kOOQO'#Cr'#CrO!}QPO'#CsOOQO'#Dv'#DvO'lQPO'#D|O'sQPO'#DuOOQO'#DO'#DOOOQO'#Dz'#DzO'sQPO'#DyOOQO'#DQ'#DQOOQO'#D}'#D}O'lQPO'#D|OOQO'#Dt'#DtO(OQPO,59]O(TQPO,59pOOQO,59p,59pO([QPO,59sOOQO,59s,59sOOQO,59u,59uOOOO,59x,59xOOQO,59y,59yOOQO,5:Q,5:QOOQO,5:T,5:TOOQO,5:V,5:VOOQO,59w,59wOOQO,59z,59zOOQO,59|,59|OOQO,5:O,5:OOOQO,5:R,5:ROOQO,5:S,5:SOOQO,5:U,5:UPOOO,58x,58xOOQO1G/S1G/SOOQO,59_,59_OOQO,59k,59kOOQO,59m,59mOOQO'#Cx'#CxO'sQPO'#CyOOQO'#Dx'#DxO(cQPO,5:aO(jQPO,5:eO(qQPO,5:hOOQO1G.w1G.wOOQO1G/[1G/[OOQO1G/_1G/_OOQO,59e,59eO(xQPO'#CzO*`QPO1G/{O]QPO1G/{OOQO'#Cz'#CzO*gQPO1G0PO*gQPO1G0PO*nQPO7+%gO*uQPO7+%kP&SQPO'#CcP&SQPO'#CeP&SQPO'#CgP&SQPO'#CiP&SQPO'#CkP*|OPO'#DbP&SQPO'#DgP&SQPO'#Dh",stateData:"+[~O!dOSPOSRPQ~OTiOWSOYTO[UO^VO`WOaiObiOd^OiXOkYOoZOw_Oz`O|iO!OaO!TcO!VdO!XeO!fQO!gRO~ORjO~OosOqtO~OT!OOWSOYTO[UO^VO`WOaiObiOd^OiXOkYOoZOw_Oz`O|iO!OaO!TcO!VdO!XeO!fQO!gRO!kvO!o{O~Oc!pP~P!}Ov!UO~P]Oy!WO~P]Od^OoZOz`O!r!YO!t!]O!u!^O~Oz`O~OT!`O~OWSOd^O~O!s!bO~Ow_Oz`O~OTiOW!}OY#OO[#PO^#QO`#ROaiObiOd^OiXOkYOoZOw_Oz`O|iO!OaO!TcO!V#SO!XeO!fQO!gRO~Oo!gO~Oc!pX~P]OT!kOiXOkYO~Oc!qO~Ov!rO~P]Oy!sO~P]Oc!ia~P]Oc!ma~P]Oc!pa~P]OTnXWnXYnX[nX^nX`nXanXbnXc!eXdnXinXknXonXwnXznX|nX!OnX!TnX!VnX!XnX!fnX!gnX~Oc!ii~P]Oc!mi~P]Oc!iq~P]Oc!mq~P]OW!}Od^O~Oa!u!tT!t~",goto:"/]!rPP!sP!vP!v#nP!vP!vP!vP!vPPPPP$j%i%i%mP%mP&n&n&sP&yP'x'x'|'|PP(QPP({P!vP!v)|!v!vP!vP!vP!v!v!v*t!v+nP,fPPP-^PP.j.m.pP.v.m/PP.m/VRkP!kiOSTUVWXY]^_`fgjwy!Q!T!V!n!o!p!v!w!y!z!{!|!}#O#P#Q#R#T#U!jiOSTUVWXY]^_`fgjwy!Q!T!V!n!o!p!v!w!y!z!{!|!}#O#P#Q#R#T#UT!ad#S!jiOSTUVWXY]^_`fgjwy!Q!T!V!n!o!p!v!w!y!z!{!|!}#O#P#Q#R#T#UQ![aT!ad#STx^w!UfOSTUVWXY]_`fgy!Q!T!V!n!o!p!v!w!y!z!{!|Sw^wU!lz}!la#Tj!}#O#P#Q#R#T#UV!mz}!lQ!w!nR!z!o!fiOSTUVWXY]^_`fgjwy!Q!T!V!p!v!w!y!z!{!|!}#O#P#Q#R#T#UQ!ZaQ!u!nR!x!oT|^wT!P^w!jiOSTUVWXY]^_`fgjwy!Q!T!V!n!o!p!v!w!y!z!{!|!}#O#P#Q#R#T#UR!eh!jiOSTUVWXY]^_`fgjwy!Q!T!V!n!o!p!v!w!y!z!{!|!}#O#P#Q#R#T#UQ!XaQ!_bR!eh!kbOSTUVWXY]^_`fgjwy!Q!T!V!n!o!p!v!w!y!z!{!|!}#O#P#Q#R#T#U!YgOSTUVWXY]^_`fgwy!Q!T!V!n!o!p!v!w!y!z!{!|a#Uj!}#O#P#Q#R#T#U!khOSTUVWXY]^_`fgjwy!Q!T!V!n!o!p!v!w!y!z!{!|!}#O#P#Q#R#T#UQ]Obu]y!T!V!p!v!y!{!|Qy^Q!T_Q!V`Q!p!QQ!v!nQ!y!oQ!{!wR!|!zt[O]^_`y!Q!T!V!n!o!p!v!w!y!z!{!|SlS!}SmT#OSnU#PSoV#QSpW#RQqXQrYU!cfw#TS!dg#UR!fjR!S^R!R^Qz^R!hwQ!nzQ!o}R!t!lQ}^R!iwQ!Q^R!jw",nodeNames:"⚠ LineComment Discard #_ Boolean Symbol Nil Deref @ Quote ' SyntaxQuote ` Unquote ~ UnquoteSplice ~@ Number Keyword ) ( List DefLike Meta Metadata ^ ReaderMetadata #^ VarName Meta DocString \" String StringContent NS Meta Operator Meta ] [ Vector } { Map Character Set # NamespacedMap KeywordPrefix RegExp Var #' ReaderConditional #? SymbolicValue ## AnonymousFunction Meta TaggedLiteral ReaderTag ConstructorCall ConstructorPrefix Program",maxTerm:83,nodeProps:[[prefixEdge,-14,3,8,10,12,14,16,25,27,46,48,51,53,55,61,""],[prefixColl,-13,7,9,11,13,15,24,26,45,47,49,50,52,56,""],["openedBy",19,"(",31,'"',38,"[",41,"{"],["closedBy",20,")",31,'"',39,"]",42,"}"],[coll$2,-3,21,40,43,""],[prefixContainer,-7,23,29,35,37,57,58,60,""],[sameEdge,31,""]],skippedNodes:[0,1,2,3],repeatNodeCount:1,tokenData:"#6x~R![OX$wX^%n^p$wpq%nqr'grs,Tst,Ytu/Yuv'gvw'gwx6Vxy6jyz6}z{'g{|7b|}%n}!O7b!O!P9t!P!Q)v!Q!R!8[!R![!>t![!]!Cp!]!^!J]!^!_'g!_!`'g!`!a'g!a!b'g!b!c!Kr!c!}/Y!}#O!LV#O#P!Lj#P#Q#3w#Q#R#4[#R#S/Y#S#T#4o#T#o/Y#o#p#5S#p#q$w#q#r#5g#r#s#5z#s#y$w#y#z%n#z$f$w$f$g%n$g##l/Y##l#BY$w#BY#BZ%n#BZ$IS$w$IS$I_%n$I_$I|$w$I|$JO%n$JO$JT$w$JT$JU%n$JU$KV$w$KV$KW%n$KW&FU$w&FU&FV%n&FV~$wQ$|SqQOr$ws#O$w#O#P%Y#P~$wQ%_TqQOr$wrs$ws#O$w#O#P%Y#P~$wR%ujqQ!dPOX$wX^%n^p$wpq%nqr$ws|$w|}%n}#O$w#O#P%Y#P#y$w#y#z%n#z$f$w$f$g%n$g#BY$w#BY#BZ%n#BZ$IS$w$IS$I_%n$I_$I|$w$I|$JO%n$JO$JT$w$JT$JU%n$JU$KV$w$KV$KW%n$KW&FU$w&FU&FV%n&FV~$w_'rpqQ!sW!tSTPOq$wqr'gst)vtu'guv'gvw'gwx)vxz$wz{'g{|'g|}$w}!O'g!O!P)v!P!Q'g!Q!['g![!])v!]!^$w!^!_'g!_!`'g!`!a'g!a!b'g!b!c$w!c!}'g!}#O$w#O#P%Y#P#R$w#R#S'g#S#T$w#T#o'g#o$g$w$g##l'g##l~$wZ*PpqQ!sWTPOq$wqr)vst)vtu)vuv)vvw)vwx)vxz$wz{)v{|)v|}$w}!O)v!O!P)v!P!Q)v!Q![)v![!])v!]!^$w!^!_)v!_!`)v!`!a)v!a!b)v!b!c$w!c!})v!}#O$w#O#P%Y#P#R$w#R#S)v#S#T$w#T#o)v#o$g$w$g##l)v##l~$w~,YOo~R,a[!OPqQOr$wst-Vtw$wwx-jx!a$w!a!b-}!b#O$w#O#P%Y#P#Q$w#Q#R.b#R#S.u#S~$wR-^S!XPqQOr$ws#O$w#O#P%Y#P~$wR-qS!TPqQOr$ws#O$w#O#P%Y#P~$wR.US!VPqQOr$ws#O$w#O#P%Y#P~$wR.iSkPqQOr$ws#O$w#O#P%Y#P~$wR.|SRPqQOr$ws#O$w#O#P%Y#P~$w_/epqQ!sW!tSTPOq$wqr'gst)vtu/Yuv'gvw'gwx)vxz$wz{'g{|'g|}$w}!O'g!O!P1i!P!Q'g!Q![/Y![!])v!]!^$w!^!_'g!_!`'g!`!a'g!a!b'g!b!c$w!c!}/Y!}#O$w#O#P%Y#P#R$w#R#S/Y#S#T$w#T#o/Y#o$g$w$g##l/Y##l~$w_1rpqQ!sWTPOq$wqr)vst)vtu3vuv)vvw)vwx)vxz$wz{)v{|)v|}$w}!O)v!O!P)v!P!Q)v!Q![)v![!])v!]!^$w!^!_)v!_!`)v!`!a)v!a!b)v!b!c$w!c!}3v!}#O$w#O#P%Y#P#R$w#R#S3v#S#T$w#T#o3v#o$g$w$g##l3v##l~$w_4RpqQ!sW!uSTPOq$wqr)vst)vtu3vuv)vvw)vwx)vxz$wz{)v{|)v|}$w}!O)v!O!P1i!P!Q)v!Q![3v![!])v!]!^$w!^!_)v!_!`)v!`!a)v!a!b)v!b!c$w!c!}3v!}#O$w#O#P%Y#P#R$w#R#S3v#S#T$w#T#o3v#o$g$w$g##l3v##l~$wR6^SYPqQOr$ws#O$w#O#P%Y#P~$wV6qSdTqQOr$ws#O$w#O#P%Y#P~$wR7UScPqQOr$ws#O$w#O#P%Y#P~$w_7mqqQ!sW!tSTPOq$wqr'gst)vtu'guv'gvw'gwx)vxz$wz{'g{|'g|}$w}!O'g!O!P9t!P!Q'g!Q!RHO!R![!&|![!])v!]!^$w!^!_'g!_!`'g!`!a'g!a!b'g!b!c$w!c!}'g!}#O$w#O#P%Y#P#R$w#R#S'g#S#T$w#T#o'g#o$g$w$g##l'g##l~$wZ9}pqQ!sWTPOq$wqr)vst)vtu)vuv)vvw)vwx)vxz$wz{)v{|)v|}$w}!O)v!O!P)v!P!Q)v!Q![<R![!])v!]!^$w!^!_)v!_!`)v!`!a)v!a!b)v!b!c$w!c!})v!}#O$w#O#P%Y#P#R$w#R#S)v#S#T$w#T#o)v#o$g$w$g##l)v##l~$wZ<^tqQ!sWaPTPOq$wqr)vst)vtu)vuv)vvw)vwx)vxz$wz{)v{|)v|}$w}!O)v!O!P)v!P!Q)v!Q![<R![!])v!]!^$w!^!_)v!_!`)v!`!a)v!a!b)v!b!c$w!c!g)v!g!h>n!h!})v!}#O$w#O#P%Y#P#R$w#R#S)v#S#T$w#T#X)v#X#Y>n#Y#o)v#o$g$w$g##l)v##l~$wZ>wpqQ!sWTPOq$wqr)vst)vtu)vuv)vvw)vwx)vxz$wz{)v{|@{|}$w}!O@{!O!P)v!P!Q)v!Q![CY![!])v!]!^$w!^!_)v!_!`)v!`!a)v!a!b)v!b!c$w!c!})v!}#O$w#O#P%Y#P#R$w#R#S)v#S#T$w#T#o)v#o$g$w$g##l)v##l~$wZAUpqQ!sWTPOq$wqr)vst)vtu)vuv)vvw)vwx)vxz$wz{)v{|)v|}$w}!O)v!O!P)v!P!Q)v!Q![CY![!])v!]!^$w!^!_)v!_!`)v!`!a)v!a!b)v!b!c$w!c!})v!}#O$w#O#P%Y#P#R$w#R#S)v#S#T$w#T#o)v#o$g$w$g##l)v##l~$wZCerqQ!sWaPTPOq$wqr)vst)vtu)vuv)vvw)vwx)vxz$wz{)v{|)v|}$w}!O)v!O!P)v!P!Q)v!Q![CY![!])v!]!^$w!^!_)v!_!`)v!`!a)v!a!b)v!b!c$w!c!o)v!o!pEo!p!})v!}#O$w#O#P%Y#P#R$w#R#S)v#S#T$w#T#o)v#o$g$w$g##l)v##l~$wZEzpqQ!sWaPTPOq$wqr)vst)vtu)vuv)vvw)vwx)vxz$wz{)v{|)v|}$w}!O)v!O!P)v!P!Q)v!Q![)v![!])v!]!^$w!^!_)v!_!`)v!`!a)v!a!b)v!b!c$w!c!})v!}#O$w#O#P%Y#P#R$w#R#S)v#S#T$w#T#o)v#o$g$w$g##l)v##l~$w_H]yqQ!sWaP!tSTPOq$wqr'gst)vtu'guv'gvw'gwx)vxz$wz{'g{|'g|}$w}!O'g!O!PJ|!P!Q!![!Q![!&|![!])v!]!^$w!^!_'g!_!`'g!`!a'g!a!b'g!b!c$w!c!g'g!g!h!)t!h!o'g!o!p!0{!p!q!0{!q!}'g!}#O$w#O#P%Y#P#R$w#R#S'g#S#T$w#T#X'g#X#Y!)t#Y#l'g#l#m!3^#m#o'g#o$g$w$g##l'g##l~$wZKXvqQ!sWaPTPOq$wqr)vst)vtu)vuv)vvw)vwx)vxz$wz{)v{|)v|}$w}!O)v!O!P)v!P!Q)v!Q![J|![!])v!]!^$w!^!_)v!_!`)v!`!a)v!a!b)v!b!c$w!c!g)v!g!h>n!h!o)v!o!pMo!p!})v!}#O$w#O#P%Y#P#R$w#R#S)v#S#T$w#T#X)v#X#Y>n#Y#o)v#o$g$w$g##l)v##l~$wZMztqQ!sWaPTPOq$wqr)vst)vtu)vuv)vvw)vwx)vxz$wz{)v{|)v|}$w}!O)v!O!P)v!P!Q)v!Q![)v![!])v!]!^$w!^!_)v!_!`)v!`!a)v!a!b)v!b!c$w!c!g)v!g!h>n!h!})v!}#O$w#O#P%Y#P#R$w#R#S)v#S#T$w#T#X)v#X#Y>n#Y#o)v#o$g$w$g##l)v##l~$w_!!gpqQ!sW!tSTPOq$wqr'gst)vtu'guv'gvw'gwx)vxz$wz{'g{|'g|}$w}!O'g!O!P)v!P!Q'g!Q![!$k![!])v!]!^$w!^!_'g!_!`'g!`!a'g!a!b'g!b!c$w!c!}'g!}#O$w#O#P%Y#P#R$w#R#S'g#S#T$w#T#o'g#o$g$w$g##l'g##l~$w_!$xpqQ!sWaP!tSTPOq$wqr'gst)vtu'guv'gvw'gwx)vxz$wz{'g{|'g|}$w}!O'g!O!P)v!P!Q'g!Q![!$k![!])v!]!^$w!^!_'g!_!`'g!`!a'g!a!b'g!b!c$w!c!}'g!}#O$w#O#P%Y#P#R$w#R#S'g#S#T$w#T#o'g#o$g$w$g##l'g##l~$w_!'ZwqQ!sWaP!tSTPOq$wqr'gst)vtu'guv'gvw'gwx)vxz$wz{'g{|'g|}$w}!O'g!O!PJ|!P!Q!![!Q![!&|![!])v!]!^$w!^!_'g!_!`'g!`!a'g!a!b'g!b!c$w!c!g'g!g!h!)t!h!o'g!o!p!0{!p!q!0{!q!}'g!}#O$w#O#P%Y#P#R$w#R#S'g#S#T$w#T#X'g#X#Y!)t#Y#o'g#o$g$w$g##l'g##l~$w_!*PpqQ!sW!tSTPOq$wqr'gst)vtu'guv'gvw'gwx)vxz$wz{'g{|!,T|}$w}!O!,T!O!P)v!P!Q'g!Q![!.d![!])v!]!^$w!^!_'g!_!`'g!`!a'g!a!b'g!b!c$w!c!}'g!}#O$w#O#P%Y#P#R$w#R#S'g#S#T$w#T#o'g#o$g$w$g##l'g##l~$w_!,`pqQ!sW!tSTPOq$wqr'gst)vtu'guv'gvw'gwx)vxz$wz{'g{|'g|}$w}!O'g!O!P)v!P!Q'g!Q![!.d![!])v!]!^$w!^!_'g!_!`'g!`!a'g!a!b'g!b!c$w!c!}'g!}#O$w#O#P%Y#P#R$w#R#S'g#S#T$w#T#o'g#o$g$w$g##l'g##l~$w_!.qrqQ!sWaP!tSTPOq$wqr'gst)vtu'guv'gvw'gwx)vxz$wz{'g{|'g|}$w}!O'g!O!P)v!P!Q'g!Q![!.d![!])v!]!^$w!^!_'g!_!`'g!`!a'g!a!b'g!b!c$w!c!o'g!o!p!0{!p!}'g!}#O$w#O#P%Y#P#R$w#R#S'g#S#T$w#T#o'g#o$g$w$g##l'g##l~$w_!1YpqQ!sWaP!tSTPOq$wqr'gst)vtu'guv'gvw'gwx)vxz$wz{'g{|'g|}$w}!O'g!O!P)v!P!Q'g!Q!['g![!])v!]!^$w!^!_'g!_!`'g!`!a'g!a!b'g!b!c$w!c!}'g!}#O$w#O#P%Y#P#R$w#R#S'g#S#T$w#T#o'g#o$g$w$g##l'g##l~$w_!3irqQ!sW!tSTPOq$wqr'gst)vtu'guv'gvw'gwx)vxz$wz{'g{|'g|}$w}!O'g!O!P)v!P!Q'g!Q![!5s![!])v!]!^$w!^!_'g!_!`'g!`!a'g!a!b'g!b!c$w!c!i!5s!i!}'g!}#O$w#O#P%Y#P#R$w#R#S'g#S#T$w#T#Z!5s#Z#o'g#o$g$w$g##l'g##l~$w_!6QrqQ!sWaP!tSTPOq$wqr'gst)vtu'guv'gvw'gwx)vxz$wz{'g{|'g|}$w}!O'g!O!P)v!P!Q'g!Q![!5s![!])v!]!^$w!^!_'g!_!`'g!`!a'g!a!b'g!b!c$w!c!i!5s!i!}'g!}#O$w#O#P%Y#P#R$w#R#S'g#S#T$w#T#Z!5s#Z#o'g#o$g$w$g##l'g##l~$wR!8ceqQaPOr$ws!O$w!O!P!9t!P!Q!=r!Q![!>t![!g$w!g!h!:q!h!o$w!o!p!<n!p!q!<n!q#O$w#O#P%Y#P#U$w#U#V!?z#V#X$w#X#Y!:q#Y#c$w#c#d!AS#d#l$w#l#m!BU#m~$wR!9{[qQaPOr$ws!Q$w!Q![!9t![!g$w!g!h!:q!h!o$w!o!p!=R!p#O$w#O#P%Y#P#X$w#X#Y!:q#Y~$wR!:vYqQOr$ws{$w{|!;f|}$w}!O!;f!O!Q$w!Q![!;}![#O$w#O#P%Y#P~$wR!;kUqQOr$ws!Q$w!Q![!;}![#O$w#O#P%Y#P~$wR!<UWqQaPOr$ws!Q$w!Q![!;}![!o$w!o!p!<n!p#O$w#O#P%Y#P~$wR!<uSqQaPOr$ws#O$w#O#P%Y#P~$wR!=YWqQaPOr$ws!g$w!g!h!:q!h#O$w#O#P%Y#P#X$w#X#Y!:q#Y~$wR!=wUqQOr$ws!Q$w!Q![!>Z![#O$w#O#P%Y#P~$wR!>bUqQaPOr$ws!Q$w!Q![!>Z![#O$w#O#P%Y#P~$wR!>{_qQaPOr$ws!O$w!O!P!9t!P!Q!=r!Q![!>t![!g$w!g!h!:q!h!o$w!o!p!<n!p!q!<n!q#O$w#O#P%Y#P#X$w#X#Y!:q#Y~$wR!@PVqQOr$ws!Q$w!Q!R!@f!R!S!@f!S#O$w#O#P%Y#P~$wR!@mVqQaPOr$ws!Q$w!Q!R!@f!R!S!@f!S#O$w#O#P%Y#P~$wR!AXUqQOr$ws!Q$w!Q!Y!Ak!Y#O$w#O#P%Y#P~$wR!ArUqQaPOr$ws!Q$w!Q!Y!Ak!Y#O$w#O#P%Y#P~$wR!BZYqQOr$ws!Q$w!Q![!By![!c$w!c!i!By!i#O$w#O#P%Y#P#T$w#T#Z!By#Z~$wR!CQYqQaPOr$ws!Q$w!Q![!By![!c$w!c!i!By!i#O$w#O#P%Y#P#T$w#T#Z!By#Z~$wV!CyobPqQ!rSOq$wqr!Ezst$wtu!Ezuv!Ezvw!Ezwz$wz{!Ez{|!Ez|}$w}!O!Ez!O!P!Ez!P!Q!Ez!Q![$w![!]!HX!]!^$w!^!_!Ez!_!`!Ez!`!a!Ez!a!b!Ez!b!c$w!c!}!Ez!}#O$w#O#P%Y#P#R$w#R#S!Ez#S#T$w#T#o!Ez#o$g$w$g##l!Ez##l~$wV!FTpbPqQ!rSOq$wqr!Ezst!Eztu!Ezuv!Ezvw!Ezwx!Ezxz$wz{!Ez{|!Ez|}$w}!O!Ez!O!P!Ez!P!Q!Ez!Q![!Ez![!]!Ez!]!^$w!^!_!Ez!_!`!Ez!`!a!Ez!a!b!Ez!b!c$w!c!}!Ez!}#O$w#O#P%Y#P#R$w#R#S!Ez#S#T$w#T#o!Ez#o$g$w$g##l!Ez##l~$wV!HbmbPqQ!rSOq$wqr!Ezst$wtu!Ezuv!Ezvw!Ezwz$wz{!Ez{|!Ez|}$w}!O!Ez!O!P!Ez!P!Q!Ez!Q!^$w!^!_!Ez!_!`!Ez!`!a!Ez!a!b!Ez!b!c$w!c!}!Ez!}#O$w#O#P%Y#P#R$w#R#S!Ez#S#T$w#T#o!Ez#o$g$w$g##l!Ez##l~$wR!JdVPPqQOY!J]YZ$wZr!J]rs!Jys#O!J]#O#P!KU#P~!J]P!KOQPPOY!JyZ~!JyR!K]VPPqQOY!J]YZ$wZr!J]rs!J]s#O!J]#O#P!KU#P~!J]R!KySWPqQOr$ws#O$w#O#P%Y#P~$wR!L^SwPqQOr$ws#O$w#O#P%Y#P~$wR!LocqQOY!MzYZ$wZr!Mzrs!Mzs#O!Mz#O#P!N_#P#U!Mz#U#V!Nu#V#Y!Mz#Y#Z#$w#Z#b!Mz#b#c#(b#c#d#*{#d#f!Mz#f#g#,m#g#h#/W#h#i#/q#i#j#0s#j~!MzR!NRS|PqQOr$ws#O$w#O#P%Y#P~$wR!NfT|PqQOr$wrs$ws#O$w#O#P%Y#P~$wR!N|U|PqQOr$ws#O$w#O#P%Y#P#T$w#T#U# `#U~$wR# eUqQOr$ws#O$w#O#P%Y#P#V$w#V#W# w#W~$wR# |UqQOr$ws#O$w#O#P%Y#P#_$w#_#`#!`#`~$wR#!eUqQOr$ws#O$w#O#P%Y#P#g$w#g#h#!w#h~$wR#!|UqQOr$ws#O$w#O#P%Y#P#d$w#d#e##`#e~$wR##eUqQOr$ws#O$w#O#P%Y#P#T$w#T#U##w#U~$wR##|UqQOr$ws#O$w#O#P%Y#P#V$w#V#W#$`#W~$wR#$eUqQOr$ws#O$w#O#P%Y#P#X$w#X#Y!Mz#Y~$wR#%OU|PqQOr$ws#O$w#O#P%Y#P#c$w#c#d#%b#d~$wR#%gUqQOr$ws#O$w#O#P%Y#P#f$w#f#g#%y#g~$wR#&OUqQOr$ws#O$w#O#P%Y#P#a$w#a#b#&b#b~$wR#&gUqQOr$ws#O$w#O#P%Y#P#Y$w#Y#Z#&y#Z~$wR#'OUqQOr$ws#O$w#O#P%Y#P#X$w#X#Y#'b#Y~$wR#'gUqQOr$ws#O$w#O#P%Y#P#X$w#X#Y#'y#Y~$wR#(OUqQOr$ws#O$w#O#P%Y#P#W$w#W#X!Mz#X~$wR#(iU|PqQOr$ws#O$w#O#P%Y#P#X$w#X#Y#({#Y~$wR#)QUqQOr$ws#O$w#O#P%Y#P#k$w#k#l#)d#l~$wR#)iUqQOr$ws#O$w#O#P%Y#P#`$w#`#a#){#a~$wR#*QUqQOr$ws#O$w#O#P%Y#P#]$w#]#^#*d#^~$wR#*iUqQOr$ws#O$w#O#P%Y#P#b$w#b#c#$`#c~$wR#+SV|PqQOr$ws!Q$w!Q!U#+i!U!Y#,S!Y#O$w#O#P%Y#P~$wR#+pU|PqQOr$ws!Q$w!Q!Y#,S!Y#O$w#O#P%Y#P~$wR#,ZU|PqQOr$ws!Q$w!Q!Y!Mz!Y#O$w#O#P%Y#P~$wR#,tU|PqQOr$ws#O$w#O#P%Y#P#X$w#X#Y#-W#Y~$wR#-]UqQOr$ws#O$w#O#P%Y#P#h$w#h#i#-o#i~$wR#-tUqQOr$ws#O$w#O#P%Y#P#i$w#i#j#.W#j~$wR#.]UqQOr$ws#O$w#O#P%Y#P#f$w#f#g#.o#g~$wR#.tUqQOr$ws#O$w#O#P%Y#P#b$w#b#c!Mz#c~$wR#/_U|PqQOr$ws#O$w#O#P%Y#P#d$w#d#e##`#e~$wR#/xU|PqQOr$ws#O$w#O#P%Y#P#T$w#T#U#0[#U~$wR#0aUqQOr$ws#O$w#O#P%Y#P#U$w#U#V!Mz#V~$wR#0zY|PqQOr$ws!Q$w!Q![#1j![!c$w!c!i#1j!i#O$w#O#P%Y#P#T$w#T#Z#1j#Z~$wR#1oYqQOr$ws!Q$w!Q![#2_![!c$w!c!i#2_!i#O$w#O#P%Y#P#T$w#T#Z#2_#Z~$wR#2dYqQOr$ws!Q$w!Q![#3S![!c$w!c!i#3S!i#O$w#O#P%Y#P#T$w#T#Z#3S#Z~$wR#3XYqQOr$ws!Q$w!Q![!Mz![!c$w!c!i!Mz!i#O$w#O#P%Y#P#T$w#T#Z!Mz#Z~$wR#4OSvPqQOr$ws#O$w#O#P%Y#P~$wR#4cSiPqQOr$ws#O$w#O#P%Y#P~$wR#4vS[PqQOr$ws#O$w#O#P%Y#P~$wV#5ZSzTqQOr$ws#O$w#O#P%Y#P~$wR#5nSyPqQOr$ws#O$w#O#P%Y#P~$wR#6RU^PqQOr$ws!b$w!b!c#6e!c#O$w#O#P%Y#P~$wR#6lS`PqQOr$ws#O$w#O#P%Y#P~$w",tokenizers:[0,1,2,3],topRules:{Program:[0,62]},dynamicPrecedences:{22:1,34:2},specialized:[{term:5,get:h=>spec_Symbol[h]||-1}],tokenPrec:466});function _println(){console.log.apply(console,arguments)}function _pr_str(h,e){typeof e>"u"&&(e=!0);var r=e,s=_obj_type(h);switch(s){case"lazy-range":return"(0 1 2 3 4 5 6 7 8 9 10 ...)";case"lazy-seq":var o=[...h].map(function(c){return _pr_str(c,r)});return"("+o.join(" ")+")";case"lazy-iterable":var o=[...h].map(function(c){return _pr_str(c,r)});return"("+o.join(" ")+")";case"iterate":return"#iterate["+h.f+"]";case"cycle":return"#cycle["+h.coll+"]";case"list":var o=h.map(function(c){return _pr_str(c,r)});return"("+o.join(" ")+")";case"vector":var o=h.map(function(c){return _pr_str(c,r)});return"["+o.join(" ")+"]";case"hash-map":var o=[];for(const[c,M]of h)o.push(_pr_str(c,r),_pr_str(M,r));return"{"+o.join(" ")+"}";case"set":var l=Array.from(h),o=l.map(function(c){return _pr_str(c,r)});return"#{"+o.join(" ")+"}";case"string":return h[0]==="ʞ"?":"+h.slice(1):r?'"'+h.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n")+'"':h;case"keyword":return":"+h.slice(1);case"nil":return"nil";case"function":return h.__meta__?h._ismacro_?"#macro["+h.__meta__.get(_keyword("name"))+"]":"#function["+h.__meta__.get(_keyword("name"))+"]":h._ismacro_?"#macro[]":"#function[]";case"regex":const a=h.toString();return'#"'+a.substring(1,a.length-2)+'"';case"ratio":return h.s===-1?"-"+h.n+"/"+h.d:h.n+"/"+h.d;case"atom":return"(atom "+_pr_str(h.val,r)+")";default:return h.toString()}}const zip=`(ns clj.zip)\r
\r
(defn zip/from-trail [tree last]\r
  (if (= (nth last 0) "left")\r
    {:value (nth last 1), :left tree, :right (nth last 2)}\r
    {:value (nth last 1), :left (nth last 2), :right tree}))\r
\r
(defn zip/from-tree [tree]\r
  {:tree tree :trail []})\r
\r
(defn zip/value [z]\r
  (:value (:tree z)))\r
\r
(defn zip/zipper [tree trail]\r
  {:tree tree :trail trail})\r
\r
(defn zip/left [z]\r
  (when (:left (:tree z))\r
    (zip/zipper (:left (:tree z))\r
                (conj [["left" (:value (:tree z)) (:right (:tree z))]]\r
                      (:trail z)))))\r
(defn zip/right [z]\r
  (when (:right (:tree z))\r
    (zip/zipper (:right (:tree z))\r
                (conj [["right" (:value (:tree z)) (:left (:tree z))]]\r
                      (:trail z)))))\r
\r
(defn zip/rebuild-tree [tree trail]\r
  (if (= 0 (count trail))\r
    tree\r
    (recur (zip/from-trail tree (first trail)) (fnext trail))))\r
\r
(defn zip/to-tree [z]\r
  (zip/rebuild-tree (:tree z) (:trail z)))\r
\r
(defn zip/up [z]\r
  (when-not (zero? (count (:trail z)))\r
    (zip/zipper (zip/from-trail (:tree z) (first (:trail z)))\r
                (fnext (:trail z)))))\r
\r
(defn zip/set-value [z value]\r
  (zip/zipper {:value value,\r
               :left  (:left (:tree z)),\r
               :right (:right (:tree z))}\r
              (:trail z)))\r
\r
(defn zip/set-left [z left]\r
  (zip/zipper {:value (:value (:tree z)),\r
               :left  left,\r
               :right (:right (:tree z))}\r
              (:trail z)))\r
\r
(defn zip/set-right [z right]\r
  (zip/zipper {:value (:value (:tree z)),\r
               :left  (:left (:tree z)),\r
               :right right}\r
              (:trail z)))`,ctx=new AudioContext;var x=1;function feedback(h){var e=h&1^h>>1&1;return h=e<<14|h>>1,h}const pulse0=[-1,-1,-1,-1,-1,-1,-1,1],pulse1=[-1,-1,-1,-1,-1,-1,1,1],pulse2=[-1,-1,-1,-1,1,1,1,1],pulse3=[1,1,1,1,1,1,-1,-1];function audioBuffer(h){const e=new AudioBuffer({length:h.length,sampleRate:ctx.sampleRate}),r=e.getChannelData(0);for(let s=0;s<h.length;s++)r[s]=h[s];return e}function channelData(h,e){return h.getChannelData(e)}function playBuffer(h,e){ctx.resume();const r=new AudioBufferSourceNode(ctx,{buffer:h});r.connect(ctx.destination),r.start(ctx.currentTime+e||0)}function triangleWave(h,e){const r=Math.floor(h/e+.5);return 2*Math.abs(2*(h/e-r))-1}function quantizeTri(h){let e=[.75,.625,.5,.375,.25,.125,0,-.125,-.25,-.375,-.5,-.625,-.75,-.875,-1,.875,1];for(;e.length!=0;){if(Math.abs(e[0]-h)<.15)return e[0];e=e.slice(1)}}function tri_seq(h){const e=h.reduce((l,o)=>l.get("ʞtime")>o.get("ʞtime")?l:o),r=Math.ceil(ctx.sampleRate*e.get("ʞtime")+e.get("ʞlength"));let s=Array(r).fill(0);for(let l=0;l<h.length;l++){const o=Math.floor(h[l].get("ʞtime")*ctx.sampleRate);for(let a=0;a<Math.ceil(h[l].get("ʞlength")*ctx.sampleRate);a++){const c=midiToFreq(h[l].get("ʞpitch")),M=.5*quantizeTri(triangleWave(1/ctx.sampleRate*a,1/c)),f=ctx.sampleRate*h[l].get("ʞlength");a<150?s[o+a]=M/(500/a):a>f-200?s[o+a]=M/(500/(f-a)):s[o+a]=M}}return audioBuffer(s)}function drum_seq(h){const e=h.reduce((o,a)=>o.get("ʞtime")>a.get("ʞtime")?o:a),r=Math.ceil(ctx.sampleRate*e.get("ʞtime")+e.get("ʞlength"));let s=Array(r).fill(0);for(let o=0;o<h.length;o++){const a=Math.floor(h[o].get("ʞtime")*ctx.sampleRate),c=Math.ceil(h[o].get("ʞlength")*ctx.sampleRate);for(let M=0;M<c;M++){x=feedback(x);var l=1-M*(1/c);s[a+M]=l*(.3*x/32767*2-.25)}}return audioBuffer(s)}function pulse(h,e){const r=h.reduce((a,c)=>a.get("ʞtime")>c.get("ʞtime")?a:c),s=Math.ceil(ctx.sampleRate*r.get("ʞtime")+r.get("ʞlength"));let l=Array(s).fill(0);for(let a=0;a<h.length;a++){const c=Math.floor(h[a].get("ʞtime")*ctx.sampleRate);for(let M=0;M<Math.ceil(h[a].get("ʞlength")*ctx.sampleRate);M++){const f=midiToFreq(h[a].get("ʞpitch"));var o;if(h[a].has("ʞvibrato")){const g=h[a].get("ʞvibrato").get("ʞspeed"),d=h[a].get("ʞvibrato").get("ʞdepth");o=.15*pulse0[Math.floor(M/(1/((f+Math.sin(M*(1e-4*g))/(10/d))/(ctx.sampleRate/8))))%8]}else o=.15*e[Math.floor(M/(1/(f/(ctx.sampleRate/8))))%8];const u=ctx.sampleRate*h[a].get("ʞlength");M<150?l[c+M]=o/(500/M):M>u-200?l[c+M]=o/(500/(u-M)):l[c+M]=o}}return audioBuffer(l)}function pulse0_seq(h){return pulse(h,pulse0)}function pulse1_seq(h){return pulse(h,pulse1)}function pulse2_seq(h){return pulse(h,pulse2)}function pulse3_seq(h){return pulse(h,pulse3)}function midiToFreq(h){return 440*Math.pow(2,(h-69)/12)}function make_download(h,e){var r=URL.createObjectURL(bufferToWave(e,e.length)),s=document.createElement("a");s.setAttribute("href",r),s.setAttribute("download",h),document.body.appendChild(s),s.click(),s.remove()}function bufferToWave(h,e){console.log("calling bufferToWave");var r=h.numberOfChannels,s=e*r*2+44,l=new ArrayBuffer(s),o=new DataView(l),a=[],c,M,f=0,u=0;for(d(1179011410),d(s-8),d(1163280727),d(544501094),d(16),g(1),g(r),d(h.sampleRate),d(h.sampleRate*2*r),g(r*2),g(16),d(1635017060),d(s-u-4),c=0;c<h.numberOfChannels;c++)a.push(h.getChannelData(c));for(;u<s;){for(c=0;c<r;c++)M=Math.max(-1,Math.min(1,a[c][f])),M=(.5+M<0?M*32768:M*32767)|0,o.setInt16(u,M,!0),u+=2;f++}return new Blob([l],{type:"audio/wav"});function g(p){o.setUint16(u,p,!0),u+=2}function d(p){o.setUint32(u,p,!0),u+=4}}function mix(h){const e=Math.max(...h.map(l=>l.length)),r=[...h.map(l=>l.getChannelData(0))];let s=[];for(let l=0;l<e;l++){let o=0;for(let a=0;a<r.length;a++)r[a].length>=l&&(o+=r[a][l]);s.push(o)}return audioBuffer(s)}var mapTiles="M430 25 450 15 470 25 450 35 430 25M410 35 430 25 450 35 430 45 410 35M390 45 410 35 430 45 410 55 390 45M370 55 390 45 410 55 390 65 370 55M350 65 370 55 390 65 370 75 350 65M330 75 350 65 370 75 350 85 330 75M310 85 330 75 350 85 330 95 310 85M290 95 310 85 330 95 310 105 290 95M270 105 290 95 310 105 290 115 270 105M250 115 270 105 290 115 270 125 250 115M230 125 250 115 270 125 250 135 230 125M210 135 230 125 250 135 230 145 210 135M190 145 210 135 230 145 210 155 190 145M170 155 190 145 210 155 190 165 170 155M150 165 170 155 190 165 170 175 150 165M130 175 150 165 170 175 150 185 130 175M110 185 130 175 150 185 130 195 110 185M90 195 110 185 130 195 110 205 90 195M70 205 90 195 110 205 90 215 70 205M50 215 70 205 90 215 70 225 50 215M30 225 50 215 70 225 50 235 30 225M10 235 30 225 50 235 30 245 10 235M450 35 470 25 490 35 470 45 450 35M430 45 450 35 470 45 450 55 430 45M410 55 430 45 450 55 430 65 410 55M390 65 410 55 430 65 410 75 390 65M370 75 390 65 410 75 390 85 370 75M350 85 370 75 390 85 370 95 350 85M330 95 350 85 370 95 350 105 330 95M310 105 330 95 350 105 330 115 310 105M290 115 310 105 330 115 310 125 290 115M270 125 290 115 310 125 290 135 270 125M250 135 270 125 290 135 270 145 250 135M230 145 250 135 270 145 250 155 230 145M210 155 230 145 250 155 230 165 210 155M190 165 210 155 230 165 210 175 190 165M170 175 190 165 210 175 190 185 170 175M150 185 170 175 190 185 170 195 150 185M130 195 150 185 170 195 150 205 130 195M110 205 130 195 150 205 130 215 110 205M90 215 110 205 130 215 110 225 90 215M70 225 90 215 110 225 90 235 70 225M50 235 70 225 90 235 70 245 50 235M30 245 50 235 70 245 50 255 30 245M470 45 490 35 510 45 490 55 470 45M450 55 470 45 490 55 470 65 450 55M430 65 450 55 470 65 450 75 430 65M410 75 430 65 450 75 430 85 410 75M390 85 410 75 430 85 410 95 390 85M370 95 390 85 410 95 390 105 370 95M350 105 370 95 390 105 370 115 350 105M330 115 350 105 370 115 350 125 330 115M310 125 330 115 350 125 330 135 310 125M290 135 310 125 330 135 310 145 290 135M270 145 290 135 310 145 290 155 270 145M250 155 270 145 290 155 270 165 250 155M230 165 250 155 270 165 250 175 230 165M210 175 230 165 250 175 230 185 210 175M190 185 210 175 230 185 210 195 190 185M170 195 190 185 210 195 190 205 170 195M150 205 170 195 190 205 170 215 150 205M130 215 150 205 170 215 150 225 130 215M110 225 130 215 150 225 130 235 110 225M90 235 110 225 130 235 110 245 90 235M70 245 90 235 110 245 90 255 70 245M50 255 70 245 90 255 70 265 50 255M490 55 510 45 530 55 510 65 490 55M470 65 490 55 510 65 490 75 470 65M450 75 470 65 490 75 470 85 450 75M430 85 450 75 470 85 450 95 430 85M410 95 430 85 450 95 430 105 410 95M390 105 410 95 430 105 410 115 390 105M370 115 390 105 410 115 390 125 370 115M350 125 370 115 390 125 370 135 350 125M330 135 350 125 370 135 350 145 330 135M310 145 330 135 350 145 330 155 310 145M290 155 310 145 330 155 310 165 290 155M270 165 290 155 310 165 290 175 270 165M250 175 270 165 290 175 270 185 250 175M230 185 250 175 270 185 250 195 230 185M210 195 230 185 250 195 230 205 210 195M190 205 210 195 230 205 210 215 190 205M170 215 190 205 210 215 190 225 170 215M150 225 170 215 190 225 170 235 150 225M130 235 150 225 170 235 150 245 130 235M110 245 130 235 150 245 130 255 110 245M90 255 110 245 130 255 110 265 90 255M70 265 90 255 110 265 90 275 70 265M510 65 530 55 550 65 530 75 510 65M490 75 510 65 530 75 510 85 490 75M470 85 490 75 510 85 490 95 470 85M450 95 470 85 490 95 470 105 450 95M430 105 450 95 470 105 450 115 430 105M410 115 430 105 450 115 430 125 410 115M390 125 410 115 430 125 410 135 390 125M370 135 390 125 410 135 390 145 370 135M350 145 370 135 390 145 370 155 350 145M330 155 350 145 370 155 350 165 330 155M310 165 330 155 350 165 330 175 310 165M290 175 310 165 330 175 310 185 290 175M270 185 290 175 310 185 290 195 270 185M250 195 270 185 290 195 270 205 250 195M230 205 250 195 270 205 250 215 230 205M210 215 230 205 250 215 230 225 210 215M190 225 210 215 230 225 210 235 190 225M170 235 190 225 210 235 190 245 170 235M150 245 170 235 190 245 170 255 150 245M130 255 150 245 170 255 150 265 130 255M110 265 130 255 150 265 130 275 110 265M90 275 110 265 130 275 110 285 90 275M530 75 550 65 570 75 550 85 530 75M510 85 530 75 550 85 530 95 510 85M490 95 510 85 530 95 510 105 490 95M470 105 490 95 510 105 490 115 470 105M450 115 470 105 490 115 470 125 450 115M430 125 450 115 470 125 450 135 430 125M410 135 430 125 450 135 430 145 410 135M390 145 410 135 430 145 410 155 390 145M370 155 390 145 410 155 390 165 370 155M350 165 370 155 390 165 370 175 350 165M330 175 350 165 370 175 350 185 330 175M310 185 330 175 350 185 330 195 310 185M290 195 310 185 330 195 310 205 290 195M270 205 290 195 310 205 290 215 270 205M250 215 270 205 290 215 270 225 250 215M230 225 250 215 270 225 250 235 230 225M210 235 230 225 250 235 230 245 210 235M190 245 210 235 230 245 210 255 190 245M170 255 190 245 210 255 190 265 170 255M150 265 170 255 190 265 170 275 150 265M130 275 150 265 170 275 150 285 130 275M110 285 130 275 150 285 130 295 110 285M550 85 570 75 590 85 570 95 550 85M530 95 550 85 570 95 550 105 530 95M510 105 530 95 550 105 530 115 510 105M490 115 510 105 530 115 510 125 490 115M470 125 490 115 510 125 490 135 470 125M450 135 470 125 490 135 470 145 450 135M430 145 450 135 470 145 450 155 430 145M410 155 430 145 450 155 430 165 410 155M390 165 410 155 430 165 410 175 390 165M370 175 390 165 410 175 390 185 370 175M350 185 370 175 390 185 370 195 350 185M330 195 350 185 370 195 350 205 330 195M310 205 330 195 350 205 330 215 310 205M290 215 310 205 330 215 310 225 290 215M270 225 290 215 310 225 290 235 270 225M250 235 270 225 290 235 270 245 250 235M230 245 250 235 270 245 250 255 230 245M210 255 230 245 250 255 230 265 210 255M190 265 210 255 230 265 210 275 190 265M170 275 190 265 210 275 190 285 170 275M150 285 170 275 190 285 170 295 150 285M130 295 150 285 170 295 150 305 130 295M570 95 590 85 610 95 590 105 570 95M550 105 570 95 590 105 570 115 550 105M530 115 550 105 570 115 550 125 530 115M510 125 530 115 550 125 530 135 510 125M490 135 510 125 530 135 510 145 490 135M470 145 490 135 510 145 490 155 470 145M450 155 470 145 490 155 470 165 450 155M430 165 450 155 470 165 450 175 430 165M410 175 430 165 450 175 430 185 410 175M390 185 410 175 430 185 410 195 390 185M370 195 390 185 410 195 390 205 370 195M350 205 370 195 390 205 370 215 350 205M330 215 350 205 370 215 350 225 330 215M310 225 330 215 350 225 330 235 310 225M290 235 310 225 330 235 310 245 290 235M270 245 290 235 310 245 290 255 270 245M250 255 270 245 290 255 270 265 250 255M230 265 250 255 270 265 250 275 230 265M210 275 230 265 250 275 230 285 210 275M190 285 210 275 230 285 210 295 190 285M170 295 190 285 210 295 190 305 170 295M150 305 170 295 190 305 170 315 150 305M590 105 610 95 630 105 610 115 590 105M570 115 590 105 610 115 590 125 570 115M550 125 570 115 590 125 570 135 550 125M530 135 550 125 570 135 550 145 530 135M510 145 530 135 550 145 530 155 510 145M490 155 510 145 530 155 510 165 490 155M470 165 490 155 510 165 490 175 470 165M450 175 470 165 490 175 470 185 450 175M430 185 450 175 470 185 450 195 430 185M410 195 430 185 450 195 430 205 410 195M390 205 410 195 430 205 410 215 390 205M370 215 390 205 410 215 390 225 370 215M350 225 370 215 390 225 370 235 350 225M330 235 350 225 370 235 350 245 330 235M310 245 330 235 350 245 330 255 310 245M290 255 310 245 330 255 310 265 290 255M270 265 290 255 310 265 290 275 270 265M250 275 270 265 290 275 270 285 250 275M230 285 250 275 270 285 250 295 230 285M210 295 230 285 250 295 230 305 210 295M190 305 210 295 230 305 210 315 190 305M170 315 190 305 210 315 190 325 170 315M610 115 630 105 650 115 630 125 610 115M590 125 610 115 630 125 610 135 590 125M570 135 590 125 610 135 590 145 570 135M550 145 570 135 590 145 570 155 550 145M530 155 550 145 570 155 550 165 530 155M510 165 530 155 550 165 530 175 510 165M490 175 510 165 530 175 510 185 490 175M470 185 490 175 510 185 490 195 470 185M450 195 470 185 490 195 470 205 450 195M430 205 450 195 470 205 450 215 430 205M410 215 430 205 450 215 430 225 410 215M390 225 410 215 430 225 410 235 390 225M370 235 390 225 410 235 390 245 370 235M350 245 370 235 390 245 370 255 350 245M330 255 350 245 370 255 350 265 330 255M310 265 330 255 350 265 330 275 310 265M290 275 310 265 330 275 310 285 290 275M270 285 290 275 310 285 290 295 270 285M250 295 270 285 290 295 270 305 250 295M230 305 250 295 270 305 250 315 230 305M210 315 230 305 250 315 230 325 210 315M190 325 210 315 230 325 210 335 190 325M630 125 650 115 670 125 650 135 630 125M610 135 630 125 650 135 630 145 610 135M590 145 610 135 630 145 610 155 590 145M570 155 590 145 610 155 590 165 570 155M550 165 570 155 590 165 570 175 550 165M530 175 550 165 570 175 550 185 530 175M510 185 530 175 550 185 530 195 510 185M490 195 510 185 530 195 510 205 490 195M470 205 490 195 510 205 490 215 470 205M450 215 470 205 490 215 470 225 450 215M430 225 450 215 470 225 450 235 430 225M410 235 430 225 450 235 430 245 410 235M390 245 410 235 430 245 410 255 390 245M370 255 390 245 410 255 390 265 370 255M350 265 370 255 390 265 370 275 350 265M330 275 350 265 370 275 350 285 330 275M310 285 330 275 350 285 330 295 310 285M290 295 310 285 330 295 310 305 290 295M270 305 290 295 310 305 290 315 270 305M250 315 270 305 290 315 270 325 250 315M230 325 250 315 270 325 250 335 230 325M210 335 230 325 250 335 230 345 210 335M650 135 670 125 690 135 670 145 650 135M630 145 650 135 670 145 650 155 630 145M610 155 630 145 650 155 630 165 610 155M590 165 610 155 630 165 610 175 590 165M570 175 590 165 610 175 590 185 570 175M550 185 570 175 590 185 570 195 550 185M530 195 550 185 570 195 550 205 530 195M510 205 530 195 550 205 530 215 510 205M490 215 510 205 530 215 510 225 490 215M470 225 490 215 510 225 490 235 470 225M450 235 470 225 490 235 470 245 450 235M430 245 450 235 470 245 450 255 430 245M410 255 430 245 450 255 430 265 410 255M390 265 410 255 430 265 410 275 390 265M370 275 390 265 410 275 390 285 370 275M350 285 370 275 390 285 370 295 350 285M330 295 350 285 370 295 350 305 330 295M310 305 330 295 350 305 330 315 310 305M290 315 310 305 330 315 310 325 290 315M270 325 290 315 310 325 290 335 270 325M250 335 270 325 290 335 270 345 250 335M230 345 250 335 270 345 250 355 230 345M670 145 690 135 710 145 690 155 670 145M650 155 670 145 690 155 670 165 650 155M630 165 650 155 670 165 650 175 630 165M610 175 630 165 650 175 630 185 610 175M590 185 610 175 630 185 610 195 590 185M570 195 590 185 610 195 590 205 570 195M550 205 570 195 590 205 570 215 550 205M530 215 550 205 570 215 550 225 530 215M510 225 530 215 550 225 530 235 510 225M490 235 510 225 530 235 510 245 490 235M470 245 490 235 510 245 490 255 470 245M450 255 470 245 490 255 470 265 450 255M430 265 450 255 470 265 450 275 430 265M410 275 430 265 450 275 430 285 410 275M390 285 410 275 430 285 410 295 390 285M370 295 390 285 410 295 390 305 370 295M350 305 370 295 390 305 370 315 350 305M330 315 350 305 370 315 350 325 330 315M310 325 330 315 350 325 330 335 310 325M290 335 310 325 330 335 310 345 290 335M270 345 290 335 310 345 290 355 270 345M250 355 270 345 290 355 270 365 250 355M690 155 710 145 730 155 710 165 690 155M670 165 690 155 710 165 690 175 670 165M650 175 670 165 690 175 670 185 650 175M630 185 650 175 670 185 650 195 630 185M610 195 630 185 650 195 630 205 610 195M590 205 610 195 630 205 610 215 590 205M570 215 590 205 610 215 590 225 570 215M550 225 570 215 590 225 570 235 550 225M530 235 550 225 570 235 550 245 530 235M510 245 530 235 550 245 530 255 510 245M490 255 510 245 530 255 510 265 490 255M470 265 490 255 510 265 490 275 470 265M450 275 470 265 490 275 470 285 450 275M430 285 450 275 470 285 450 295 430 285M410 295 430 285 450 295 430 305 410 295M390 305 410 295 430 305 410 315 390 305M370 315 390 305 410 315 390 325 370 315M350 325 370 315 390 325 370 335 350 325M330 335 350 325 370 335 350 345 330 335M310 345 330 335 350 345 330 355 310 345M290 355 310 345 330 355 310 365 290 355M270 365 290 355 310 365 290 375 270 365M710 165 730 155 750 165 730 175 710 165M690 175 710 165 730 175 710 185 690 175M670 185 690 175 710 185 690 195 670 185M650 195 670 185 690 195 670 205 650 195M630 205 650 195 670 205 650 215 630 205M610 215 630 205 650 215 630 225 610 215M590 225 610 215 630 225 610 235 590 225M570 235 590 225 610 235 590 245 570 235M550 245 570 235 590 245 570 255 550 245M530 255 550 245 570 255 550 265 530 255M510 265 530 255 550 265 530 275 510 265M490 275 510 265 530 275 510 285 490 275M470 285 490 275 510 285 490 295 470 285M450 295 470 285 490 295 470 305 450 295M430 305 450 295 470 305 450 315 430 305M410 315 430 305 450 315 430 325 410 315M390 325 410 315 430 325 410 335 390 325M370 335 390 325 410 335 390 345 370 335M350 345 370 335 390 345 370 355 350 345M330 355 350 345 370 355 350 365 330 355M310 365 330 355 350 365 330 375 310 365M290 375 310 365 330 375 310 385 290 375M730 175 750 165 770 175 750 185 730 175M710 185 730 175 750 185 730 195 710 185M690 195 710 185 730 195 710 205 690 195M670 205 690 195 710 205 690 215 670 205M650 215 670 205 690 215 670 225 650 215M630 225 650 215 670 225 650 235 630 225M610 235 630 225 650 235 630 245 610 235M590 245 610 235 630 245 610 255 590 245M570 255 590 245 610 255 590 265 570 255M550 265 570 255 590 265 570 275 550 265M530 275 550 265 570 275 550 285 530 275M510 285 530 275 550 285 530 295 510 285M490 295 510 285 530 295 510 305 490 295M470 305 490 295 510 305 490 315 470 305M450 315 470 305 490 315 470 325 450 315M430 325 450 315 470 325 450 335 430 325M410 335 430 325 450 335 430 345 410 335M390 345 410 335 430 345 410 355 390 345M370 355 390 345 410 355 390 365 370 355M350 365 370 355 390 365 370 375 350 365M330 375 350 365 370 375 350 385 330 375M310 385 330 375 350 385 330 395 310 385M750 185 770 175 790 185 770 195 750 185M730 195 750 185 770 195 750 205 730 195M710 205 730 195 750 205 730 215 710 205M690 215 710 205 730 215 710 225 690 215M670 225 690 215 710 225 690 235 670 225M650 235 670 225 690 235 670 245 650 235M630 245 650 235 670 245 650 255 630 245M610 255 630 245 650 255 630 265 610 255M590 265 610 255 630 265 610 275 590 265M570 275 590 265 610 275 590 285 570 275M550 285 570 275 590 285 570 295 550 285M530 295 550 285 570 295 550 305 530 295M510 305 530 295 550 305 530 315 510 305M490 315 510 305 530 315 510 325 490 315M470 325 490 315 510 325 490 335 470 325M450 335 470 325 490 335 470 345 450 335M430 345 450 335 470 345 450 355 430 345M410 355 430 345 450 355 430 365 410 355M390 365 410 355 430 365 410 375 390 365M370 375 390 365 410 375 390 385 370 375M350 385 370 375 390 385 370 395 350 385M330 395 350 385 370 395 350 405 330 395M770 195 790 185 810 195 790 205 770 195M750 205 770 195 790 205 770 215 750 205M730 215 750 205 770 215 750 225 730 215M710 225 730 215 750 225 730 235 710 225M690 235 710 225 730 235 710 245 690 235M670 245 690 235 710 245 690 255 670 245M650 255 670 245 690 255 670 265 650 255M630 265 650 255 670 265 650 275 630 265M610 275 630 265 650 275 630 285 610 275M590 285 610 275 630 285 610 295 590 285M570 295 590 285 610 295 590 305 570 295M550 305 570 295 590 305 570 315 550 305M530 315 550 305 570 315 550 325 530 315M510 325 530 315 550 325 530 335 510 325M490 335 510 325 530 335 510 345 490 335M470 345 490 335 510 345 490 355 470 345M450 355 470 345 490 355 470 365 450 355M430 365 450 355 470 365 450 375 430 365M410 375 430 365 450 375 430 385 410 375M390 385 410 375 430 385 410 395 390 385M370 395 390 385 410 395 390 405 370 395M350 405 370 395 390 405 370 415 350 405M790 205 810 195 830 205 810 215 790 205M770 215 790 205 810 215 790 225 770 215M750 225 770 215 790 225 770 235 750 225M730 235 750 225 770 235 750 245 730 235M710 245 730 235 750 245 730 255 710 245M690 255 710 245 730 255 710 265 690 255M670 265 690 255 710 265 690 275 670 265M650 275 670 265 690 275 670 285 650 275M630 285 650 275 670 285 650 295 630 285M610 295 630 285 650 295 630 305 610 295M590 305 610 295 630 305 610 315 590 305M570 315 590 305 610 315 590 325 570 315M550 325 570 315 590 325 570 335 550 325M530 335 550 325 570 335 550 345 530 335M510 345 530 335 550 345 530 355 510 345M490 355 510 345 530 355 510 365 490 355M470 365 490 355 510 365 490 375 470 365M450 375 470 365 490 375 470 385 450 375M430 385 450 375 470 385 450 395 430 385M410 395 430 385 450 395 430 405 410 395M390 405 410 395 430 405 410 415 390 405M370 415 390 405 410 415 390 425 370 415M810 215 830 205 850 215 830 225 810 215M790 225 810 215 830 225 810 235 790 225M770 235 790 225 810 235 790 245 770 235M750 245 770 235 790 245 770 255 750 245M730 255 750 245 770 255 750 265 730 255M710 265 730 255 750 265 730 275 710 265M690 275 710 265 730 275 710 285 690 275M670 285 690 275 710 285 690 295 670 285M650 295 670 285 690 295 670 305 650 295M630 305 650 295 670 305 650 315 630 305M610 315 630 305 650 315 630 325 610 315M590 325 610 315 630 325 610 335 590 325M570 335 590 325 610 335 590 345 570 335M550 345 570 335 590 345 570 355 550 345M530 355 550 345 570 355 550 365 530 355M510 365 530 355 550 365 530 375 510 365M490 375 510 365 530 375 510 385 490 375M470 385 490 375 510 385 490 395 470 385M450 395 470 385 490 395 470 405 450 395M430 405 450 395 470 405 450 415 430 405M410 415 430 405 450 415 430 425 410 415M390 425 410 415 430 425 410 435 390 425M830 225 850 215 870 225 850 235 830 225M810 235 830 225 850 235 830 245 810 235M790 245 810 235 830 245 810 255 790 245M770 255 790 245 810 255 790 265 770 255M750 265 770 255 790 265 770 275 750 265M730 275 750 265 770 275 750 285 730 275M710 285 730 275 750 285 730 295 710 285M690 295 710 285 730 295 710 305 690 295M670 305 690 295 710 305 690 315 670 305M650 315 670 305 690 315 670 325 650 315M630 325 650 315 670 325 650 335 630 325M610 335 630 325 650 335 630 345 610 335M590 345 610 335 630 345 610 355 590 345M570 355 590 345 610 355 590 365 570 355M550 365 570 355 590 365 570 375 550 365M530 375 550 365 570 375 550 385 530 375M510 385 530 375 550 385 530 395 510 385M490 395 510 385 530 395 510 405 490 395M470 405 490 395 510 405 490 415 470 405M450 415 470 405 490 415 470 425 450 415M430 425 450 415 470 425 450 435 430 425M410 435 430 425 450 435 430 445 410 435M850 235 870 225 890 235 870 245 850 235M830 245 850 235 870 245 850 255 830 245M810 255 830 245 850 255 830 265 810 255M790 265 810 255 830 265 810 275 790 265M770 275 790 265 810 275 790 285 770 275M750 285 770 275 790 285 770 295 750 285M730 295 750 285 770 295 750 305 730 295M710 305 730 295 750 305 730 315 710 305M690 315 710 305 730 315 710 325 690 315M670 325 690 315 710 325 690 335 670 325M650 335 670 325 690 335 670 345 650 335M630 345 650 335 670 345 650 355 630 345M610 355 630 345 650 355 630 365 610 355M590 365 610 355 630 365 610 375 590 365M570 375 590 365 610 375 590 385 570 375M550 385 570 375 590 385 570 395 550 385M530 395 550 385 570 395 550 405 530 395M510 405 530 395 550 405 530 415 510 405M490 415 510 405 530 415 510 425 490 415M470 425 490 415 510 425 490 435 470 425M450 435 470 425 490 435 470 445 450 435M430 445 450 435 470 445 450 455 430 445",out_buffer="";function appendBuffer(h){out_buffer=out_buffer+h}function clearBuffer(){out_buffer=""}function _print(h){appendBuffer(h)}function _pr(h){arguments.length>1?appendBuffer(Array.from(arguments).join(" ")):appendBuffer(h)}function mal_throw(h){throw new Error(h)}function pr_str(){return Array.prototype.map.call(arguments,function(h){return _pr_str(h,!0)}).join(" ")}function str(){const h=Array.from(arguments).filter(e=>e!==null);return Array.prototype.map.call(h,function(e){return _pr_str(e,!1)}).join("")}function prn(h){arguments.length>1?appendBuffer(Array.from(arguments).join(" ")+`
`):appendBuffer(h+`
`)}function println(){_println.apply({},Array.prototype.map.call(arguments,function(h){return appendBuffer(h+`
`),_pr_str(h,!1)}))}function consolePrint(){_println.apply({},Array.prototype.map.call(arguments,function(h){return _pr_str(h,!1)}))}function slurp(h){if(typeof require<"u")return require("fs").readFileSync(h,"utf-8");var e=new XMLHttpRequest;if(e.open("GET",h,!1),e.send(),e.status==200)return e.responseText;throw new Error("Failed to slurp file: "+h)}function time_ms(){return new Date().getTime()}function assoc(h){h===null&&(h=new Map);var e=_clone(h),r=[e].concat(Array.prototype.slice.call(arguments,1));return _assoc_BANG.apply(null,r)}function dissoc(h){var e=_clone(h),r=[e].concat(Array.prototype.slice.call(arguments,1));return _dissoc_BANG.apply(null,r)}function get(h,e,r){if(_vector_Q(h)||_string_Q(h))return h[e];if(_hash_map_Q(h)){for(const[s,l]of h)if(_equal_Q(s,e))return l;return r}return h!=null?h.get(e)||r:null}function contains_Q(h,e){if(h===null)return!1;if(_hash_map_Q(h)){for(const[r,s]of h)if(_equal_Q(r,e))return!0}if(_set_Q(h)){for(const r of h)if(_equal_Q(r,e))return!0;return!1}return e in h}function keys(h){return Array.from(h.keys())}function vals(h){return Array.from(h.values())}function cons(h,e){return e!=null&&e.name==="LazySeq"?lazyCons(h,e):[h].concat(e)}function lazyCons(h,e){return lazy(function*(){yield h,yield*iterable(e)})}function concat(h){return h=h||[],h.concat.apply(h,Array.prototype.slice.call(arguments,1))}function vec(h){if(_list_Q(h)){var e=Array.prototype.slice.call(h,0);return e.__isvector__=!0,e}else return h}function re_matches(h,e){let r=h.exec(e);if(r&&e===r[0])return r.length===1?r[0]:r}function re_find(h,e){let r=h.exec(e);if(r)return r.length===1?r[0]:r}function re_seq(h,e){if(e===null)return null;const s=[...e.matchAll(h)].map(l=>l[0]);return s.length===0?null:s}function nth(h,e,r){if(_lazy_iterable_Q(h)){if(h){var s=void 0;if(h instanceof Array)s=h[e];else{let l=iterable(h),o=0;for(let a of l)if(o++==e){s=a;break}}if(s!==void 0)return s}return r}return e<h.length?h[e]:r}function first(h){return _lazy_range_Q(h)?0:h===null||h.length===0?null:seq(h)[0]}function second(h){return h===null||h.length===0?null:seq(h)[1]}function last(h){return h===null||h.length===0?null:seq(h)[seq(h).length-1]}function rest(h){return _lazy_iterable_Q(h)||_lazy_seq_Q(h)?lazy(function*(){let e=!0;for(const r of iterable(coll))e?e=!1:yield r}):h==null||h.length===0?[]:seq(h).slice(1)}function empty_Q(h){return _set_Q(h)||_hash_map_Q(h)?h.size===0:h?h.length===0:!0}function count(h){return _hash_map_Q(h)?h.size:Array.isArray(h)?h.length:_set_Q(h)?h.size:h===null?0:Object.keys(h).length}function conj(h){if(_iterate_Q(h))return"TODO: implement iterate on conj";if(_list_Q(h))return Array.prototype.slice.call(arguments,1).reverse().concat(h);if(_vector_Q(h)){var e=h.concat(Array.prototype.slice.call(arguments,1));return e.__isvector__=!0,e}else{if(_set_Q(h))return h.add(arguments[1]);if(_hash_map_Q(h)){if(arguments.length===2&&arguments[1].size===0)return h;var r=new Map(h);const l=Array.prototype.slice.call(arguments,1);let o=[];for(const a of l)_hash_map_Q(a)?o=o.concat(seq(a)):o.push(a);for(var s=0;s<o.length;s++)r.set(o[s][0],o[s][1]);return r}}}function re_pattern(h){return new RegExp(h,"g")}function split(h,e){return h.split(e)}function seq(h){return _list_Q(h)?h.length>0?h:null:_iterate_Q(h)?h.realized:_vector_Q(h)?h.length>0?Array.prototype.slice.call(h,0):null:_string_Q(h)?h.length>0?h.split(""):null:_hash_map_Q(h)?h.size>0?[...h.entries()]:null:_set_Q(h)?Array.from(h):h===null?null:h}function apply(h){var e=Array.prototype.slice.call(arguments,1);return h.apply(h,e.slice(0,e.length-1).concat(e[e.length-1]))}function with_meta(h,e){var r=_clone(h);return r.__meta__=e,r}function meta(h){if(!_sequential_Q(h)&&!_hash_map_Q(h)&&!_function_Q(h)&&!_symbol_Q(h))throw new Error("attempt to get metadata from: "+_obj_type(h));return h.__meta__}function deref(h){return h.val}function reset_BANG(h,e){return h.val=e}function swap_BANG(h,e){var r=[h.val].concat(Array.prototype.slice.call(arguments,2));return h.val=e.apply(e,r),h.val}function js_eval(str){return js_to_mal(eval(str.toString()))}function js_method_call(h){var e=Array.prototype.slice.call(arguments,1),r=resolve_js(h),s=r[0],l=r[1],o=l.apply(s,e);return js_to_mal(o)}function toSet(h){var e=new Set;for(const r of seq(h))contains_Q(e,r)||e.add(r);return e}function _union(h,e){const r=new Set(h);for(const s of e)contains_Q(r,s)||r.add(s);return r}function _intersection(h,e){const r=new Set;for(const s of e)contains_Q(h,s)&&r.add(s);return r}function setDelete(h,e){var r=new Set;for(const s of h)_equal_Q(s,e)||r.add(s);return r}function symmetricDifference(h,e){var r=new Set(h);for(const s of e)contains_Q(r,s)?r=setDelete(r,s):r.add(s);return r}function _difference(h,e){var r=new Set(h);for(const s of e)r=setDelete(r,s);return r}function _disj(h){var e=Array.from(arguments).slice(1),r=_clone(h);for(let s=0;s<e.length;s++)r.delete(e[s]);return r}function _is(h){return!!h}function resolve_js(str){if(str.match(/\./)){var re=/^(.*)\.[^\.]*$/,match=re.exec(str);return[eval(match[1]),eval(str)]}else return[GLOBAL,eval(str)]}function js_to_mal(h){if(h==null)return null;var e=[],r=JSON.stringify(h,function(s,l){if(typeof l=="object"&&l!==null){if(e.indexOf(l)!==-1)return;e.push(l)}return l});return e=null,JSON.parse(r)}function int(h){return _number_Q(h)?Math.floor(h):h[0]==="\\"?h.charCodeAt(1):h.charCodeAt(0)}function double(h){return h}function char(h){return String.fromCharCode(h)}function filter(h,e){return _lazy_iterable_Q(e)?lazy(function*(){for(const r of iterable(coll))pred(r)&&(yield r)}):_iterate_Q(e)?"TODO: filter iterate object":!e||e.length===0?[]:_set_Q(h)?seq(e).filter(function(r){return h.has(r)}):seq(e).filter(function(r){return h(r)})}function min(){return Math.min.apply(null,arguments)}function max(){return Math.max.apply(null,arguments)}function _pow(h,e){return Math.pow(h,e)}function _abs(h){return Math.abs(h)}function sum(){if(Array.from(arguments).length===0)return 0;var h=Array.from(arguments).reduce((e,r)=>e+r,0);return Array.from(arguments).every(function(e){return _ratio_Q()})&&(h=h),h}function subtract(){if(arguments.length===1)return subtract(0,arguments[0]);var h=Array.from(arguments).slice(1).reduce((e,r)=>e-r,arguments[0]);return Array.from(arguments).every(function(e){return _ratio_Q()})&&(h=h),h}function product(){if(arguments.length===0)return 1;var h=Array.from(arguments).reduce((e,r)=>e*r,1);return Array.from(arguments).every(function(e){return _ratio_Q()})&&(h=h),h}function divide(h,e){return h/e}class LazyIterable{constructor(e){this.name="LazyIterable",this.gen=e}[Symbol.iterator](){return this.gen()}}function lazy(h){return new LazyIterable(h)}function seqable_QMARK_(h){return typeof h=="string"||h===null||h===void 0||Symbol.iterator in h}function iterable(h){return h==null?[]:seqable_QMARK_(h)?h:Object.entries(h)}class LazySeq{constructor(e){this.name="LazySeq",this.f=e}*[Symbol.iterator](){yield*iterable(this.f())}}function take(h,e){if(empty_Q(e))return[];if(_lazy_range_Q(e))return range(0,h);if(_lazy_seq_Q(e)||_lazy_iterable_Q(e))return lazy(function*(){let r=h-1;for(const s of iterable(e))if(r-->=0&&(yield s),r<0)return});if(_iterate_Q(e)){for(let r=0;r<h;r++)e.next();return e.realized.slice(0,-1)}if(_cycle_Q(e)){const r=Math.floor(h/e.coll.length),s=h%e.coll.length;let l=[];for(let o=0;o<r;o++)l=l.concat(e.coll);return s!=0&&(l=l.concat(e.coll.slice(0,s))),l}return seq(e).slice(0,h)}function drop(h,e){return e===null?[]:empty_Q(e)?[]:seq(e).slice(h)}function repeat(h,e){return Array(h).fill(e)}function*makeRangeIterator(h=0,e=1/0,r=1){let s=0;for(let l=h;l<e;l+=r)s++,yield l;return s}function range(h,e,r){if(arguments.length===0){var s=makeRangeIterator();return s.name="lazyRange",s}if(r<0){var l=[];for(let a=h;a>e;a+=r)l.push(a);return l}if(!e)return h===0?[]:range(0,h);var l=[];if(r){for(let o=h;o<e;o+=r)l.push(o);return l}for(let o=h;o<e;o++)l.push(o);return l}function iterate(h,e){var r=e;return lazy(function*(){for(;;)yield r,r=h(r)})}class Cycle{constructor(e){this.name="Cycle",this.coll=e}}function cycle(h){return new Cycle(h)}function mod(h,e){return h%e}function sort(h){if(_string_Q(h))return h.split("").sort().join("");if(_list_Q(h))return h.sort(subtract);if(_hash_map_Q(h))return new Map(Array.from(h).sort(subtract));if(_set_Q(h))return new Set(Array.from(h).sort(subtract));var e=h.sort(subtract);return e.__isvector__=!0,e}function makeComparator(h){return function(e,r){let s=h(e,r);return _number_Q(s)?s:s?-1:h(r,e)?1:0}}function sort_by(){if(arguments.length===2)var h=arguments[0],e=arguments[1],r=subtract;if(arguments.length===3)var h=arguments[0],r=makeComparator(arguments[1]),e=arguments[2];if(_keyword_Q(h))var s=(o,a)=>r(get(o,h),get(a,h));else var s=(a,c)=>r(h(a),h(c));if(_string_Q(e))return e.split("").sort(s).join("");if(_list_Q(e))return e.sort(s);if(_hash_map_Q(e))return new Map(Array.from(e).sort(s));if(_set_Q(e))return new Set(Array.from(e).sort(s));var l=e.sort(s);return l.__isvector__=!0,l}function pop(h){if(_list_Q(h))return h.slice(1);var e=h.slice(0,-1);return e.__isvector__=!0,e}function peek(h){return _list_Q(h)?h[0]:h[h.length-1]}function upperCase(h){return h.toUpperCase()}function lowerCase(h){return h.toLowerCase()}function int_Q(h){return Number.isInteger(h)}function _join(h,e){return e?e.join(h):h.join("")}function _replace(h,e,r){return h.replace(e,r)}function rand_int(){return Math.floor(Math.random()*arguments[0])}function rand_nth(){const h=Math.floor(Math.random()*arguments[0].length);return arguments[0][h]}function _round(h){return Math.round(h)}function _sin(h){return Math.sin(h)}function _sqrt(h){return Math.sqrt(h)}function _substring(h,e,r){return r?h.substring(e,r):h.substring(e,h.length)}function dec2bin(h){return(h>>>0).toString(2)}function repeatedly(h,e){let r=[];for(let s=0;s<h;s++)r.push(e());return r}function _subvec(h,e,r){return h.slice(e,r)}function _trim(h){return h.trim()}function printEnv(){console.log(repl_env)}function _require(h){switch(h){case"zip":evalString("(do "+zip+")");break;case"set":evalString("(do "+clj_set+")");break}}function downloadObjectAsJson(h,e){var r="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(h)),s=document.createElement("a");s.setAttribute("href",r),s.setAttribute("download",e),document.body.appendChild(s),s.click(),s.remove()}function spit_json(h,e){return downloadObjectAsJson(e,h)}function map_indexed(h,e){let r=[],s=0;for(const l of e)r.push(h(s,l)),s++;return r}function _isNaN(h){return!!isNaN(h)}function _map(h,e){var r=h,s=e.length,l=[...Array(s).keys()],o=l.map(m=>_symbol("s"+m)),a=e.map(m=>seq(m)),c=l.flatMap(m=>{var w=a[m];w.__isvector__=!0;var y=[o[m],w];return y.__isvector__=!0,y}),M=[];M.__isvector__=!0,c.push(_symbol("res"),M),c.__isvector__=!0;var f=[_symbol("or")].concat(o.map(m=>[_symbol("empty?"),m])),u=[_symbol("recur")].concat(o.map(m=>[_symbol("rest"),m])),g=[_symbol("conj"),_symbol("res")];g.push([r].concat(o.map(m=>[_symbol("first"),m])));var d=u.concat([g]),p=[_symbol("loop")];return p.push(c),p.push([_symbol("if"),f,[_symbol("apply"),_symbol("list"),_symbol("res")],d]),EVAL(p,repl_env)}var svgDiv=document.getElementById("svg_out");svgDiv.setAttribute("width","1000");svgDiv.setAttribute("height","1000");var svgGroup=document.createElementNS("http://www.w3.org/2000/svg","g");svgDiv.appendChild(svgGroup);function appendPath(h,e,r,s,l){var o=document.createElementNS("http://www.w3.org/2000/svg","path");o.setAttribute("d",h),o.style.stroke=e||"black",o.style.strokeWidth="1",o.style.fill="lightgreen",l?o.setAttribute("transform","translate("+r.toString()+","+s.toString()+") scale("+l+")"):typeof r=="number"&&o.setAttribute("transform","translate("+r.toString()+","+s.toString()+")"),svgGroup.appendChild(o)}function clearSVG(){svgGroup.innerHTML=""}var ns={env:printEnv,"map-tiles":mapTiles,play:playBuffer,mix,"tri-seq":tri_seq,"drum-seq":drum_seq,"pulse0-seq":pulse0_seq,"pulse1-seq":pulse1_seq,"pulse2-seq":pulse2_seq,"pulse3-seq":pulse3_seq,"sample-rate":ctx.sampleRate,"channel-data":channelData,"midi->freq":midiToFreq,"current-time":ctx.currentTime,"ctx-state":ctx.state,"audio-buffer":audioBuffer,"spit-wav":make_download,"append-path":appendPath,"clear-svg":clearSVG,"console-print":consolePrint,_map,print:_print,"Integer/parseInt":parseInt,"js/parseInt":parseInt,"js/Number.POSITIVE_INFINITY":Number.POSITIVE_INFINITY,"js/Number.NEGATIVE_INFINITY":Number.NEGATIVE_INFINITY,"nan?":_isNaN,pr:_pr,"spit-json":spit_json,LazySeq,"lazy-cons":lazyCons,require:_require,type:_obj_type,"=":allEqual,"==":allEqual,throw:mal_throw,"nil?":_nil_Q,"true?":_true_Q,is:_is,"false?":_false_Q,"ratio?":_ratio_Q,"number?":_number_Q,"string?":_string_Q,symbol:_symbol,"symbol?":_symbol_Q,"set?":_set_Q,keyword:_keyword,"keyword?":_keyword_Q,"map-entry?":_mapEntry_Q,"re-matches":re_matches,"re-find":re_find,"fn?":_fn_Q,"macro?":_macro_Q,char,"int?":int_Q,repeatedly,"rand-int":rand_int,"rand-nth":rand_nth,"Math/round":_round,"Math/sqrt":_sqrt,"Math/pow":_pow,"Math/abs":_abs,sin:_sin,abs:_abs,"Integer/toBinaryString":dec2bin,"str/trim":_trim,cycle,"str/split":split,"re-pattern":re_pattern,double,"pr-str":pr_str,str,prn,println,"read-string":read_str,slurp,lt:function(h,e){return h<e},lte:function(h,e){return h<=e},gt:function(h,e){return h>e},gte:function(h,e){return h>=e},"+":sum,"-":subtract,"*":product,"/":divide,inc:function(h){return h+1},"time-ms":time_ms,max,min,range,sort,peek,pop,"lower-case":lowerCase,"upper-case":upperCase,"str/lower-case":lowerCase,"str/upper-case":upperCase,subs:_substring,subvec:_subvec,"map-indexed":map_indexed,list:_list,"list?":_list_Q,vector:_vector,"vector?":_vector_Q,"hash-map":_hash_map,"map?":_hash_map_Q,assoc,dissoc,get,"re-seq":re_seq,"contains?":contains_Q,keys,vals,int,rem:mod,iterate,walk,"sort-by":sort_by,"sequential?":_sequential_Q,cons,concat,vec,nth,first,second,rest,last,take,drop,"empty?":empty_Q,count,"apply*":apply,repeat,join:_join,"str/join":_join,"str/replace":_replace,conj,seq,filter,"with-meta":with_meta,meta,atom:_atom,"atom?":_atom_Q,deref,"reset!":reset_BANG,"swap!":swap_BANG,"js-eval":js_eval,".":js_method_call,set:toSet,disj:_disj,"set/union":_union,"set/intersection":_intersection,"set/symmetric-difference":symmetricDifference,"set/difference":_difference};function _obj_type(h){if(_symbol_Q(h))return"symbol";if(_hash_map_Q(h))return"hash-map";if(_list_Q(h))return"list";if(_vector_Q(h))return"vector";if(_lazy_range_Q(h))return"lazy-range";if(_lazy_iterable_Q(h))return"lazy-iterable";if(_lazy_seq_Q(h))return"lazy-seq";if(_iterate_Q(h))return"iterate";if(_cycle_Q(h))return"cycle";if(_function_Q(h))return"function";if(_set_Q(h))return"set";if(_nil_Q(h))return"nil";if(_regex_Q(h))return"regex";if(_true_Q(h))return"true";if(_false_Q(h))return"false";if(_atom_Q(h))return"atom";switch(typeof h){case"number":return"number";case"function":return"function";case"object":return"object";case"string":return h[0]=="ʞ"?"keyword":"string";default:throw new Error("Unknown type '"+typeof h+"'")}}function _iterate_Q(h){return h===null?!1:typeof h=="object"?Object.hasOwn(h,"name")&&h.name==="Iterate":!1}function _cycle_Q(h){return h===null?!1:typeof h=="object"?Object.hasOwn(h,"name")&&h.name==="Cycle":!1}function _lazy_range_Q(h){return h===null?!1:typeof h=="object"?Object.hasOwn(h,"name")&&h.name==="lazyRange":!1}function _lazy_iterable_Q(h){return h===null?!1:typeof h=="object"?Object.hasOwn(h,"name")&&h.name==="LazyIterable":!1}function _lazy_seq_Q(h){return h===null?!1:typeof h=="object"?Object.hasOwn(h,"name")&&h.name==="LazySeq":!1}function _sequential_Q(h){return _list_Q(h)||_vector_Q(h)}function _equal_Q(h,e){var r=_obj_type(h),s=_obj_type(e);if(!(r===s||_sequential_Q(h)&&_sequential_Q(e)))return!1;switch(r){case"symbol":return h.value===e.value;case"set":return h.size===e.size&&[...h].every(c=>{for(const M of e)if(_equal_Q(M,c))return!0;return!1});case"list":case"vector":if(h.length!==e.length)return!1;for(var l=0;l<h.length;l++)if(!_equal_Q(h[l],e[l]))return!1;return!0;case"hash-map":if(h.size!==e.size)return!1;for(var[o,a]of h)if(!contains_Q(e,o)||!_equal_Q(get(h,o),get(e,o)))return!1;return!0;case"ratio":return h.equals(e);default:return h===e}}function allEqual(){const h=Array.from(arguments);return h.every(e=>_equal_Q(e,h[0]))}function _clone(h){var e;switch(_obj_type(h)){case"list":e=h.slice(0);break;case"vector":e=h.slice(0),e.__isvector__=!0;break;case"hash-map":e=new Map(h);break;case"function":e=h.clone();break;case"lazy-iterable":e=iterable(h);break;case"set":e=new Set(h);break;case"symbol":e=_symbol(h.value);break;default:throw new Error("clone of non-collection: "+_obj_type(h))}return Object.defineProperty(e,"__meta__",{enumerable:!1,writable:!0}),e}function _nil_Q(h){return h===null}function _true_Q(h){return h===!0}function _false_Q(h){return h===!1}function _number_Q(h){return typeof h=="number"}function _string_Q(h){return typeof h=="string"&&h[0]!=="ʞ"}function Symbol$1(h){return this.value=h,this}Symbol$1.prototype.toString=function(){return this.value};function _symbol(h,e){return e?h===null?new Symbol$1(e):new Symbol$1(h+"/"+e):new Symbol$1(h)}function _symbol_Q(h){return h instanceof Symbol$1}function _ratio(h){return h}function _ratio_Q(h){return!1}function _keyword(h,e){return e?h===null?"ʞ"+e:"ʞ"+h+"/"+e:(e=h,typeof e=="string"&&e[0]==="ʞ"?e:"ʞ"+e)}function _keyword_Q(h){return typeof h=="string"&&h[0]==="ʞ"}function _mapEntry_Q(h){return Object.hasOwn(h,"__mapEntry__")&&h.__mapEntry__===!0}function _regex_Q(h){return h instanceof RegExp}function walk(h,e,r){if(typeof r>"u")return null;if(_list_Q(r))return e(r.map(h));if(r===null)return null;if(_vector_Q(r)){let s=e(r.map(h));return s.__isvector__=!0,s}else if(r.__mapEntry__){const s=h(r[0]),l=h(r[1]);let o=[s,l];return o.__mapEntry__=!0,e(o)}else if(_hash_map_Q(r)){let s=new Map;return r.forEach((l,o,a)=>s.set(o,h(l))),e(s)}else return e(r)}function postwalk(h,e){return walk(r=>postwalk(h,r),h,e)}function hasLoop(h){let e=[];return postwalk(r=>r.value==_symbol("loop")||r.value==_symbol("loop*")?(e.push(!0),!0):r,h),e.length>0}function hasRecur(h){let e=[];return postwalk(r=>r.value==_symbol("recur")?(e.push(!0),!0):r,h),e.length>0}function _function(h,e,r,s,l){var o=function(){return h(r,new e(s,l,arguments))};return o.__meta__=null,o.__ast__=r,o.__gen_env__=function(a){return new e(s,l,a)},o._ismacro_=!1,o}function findVariadic(h){for(let e=0;e<h.length;e++)if(h[e][0].toString().includes("&"))return h[e]}function findFixedArity(h,e){for(let r=0;r<e.length;r++)if(e[r][0].length===h&&!e[r][0].toString().includes("&"))return e[r]}function multifn(h,e,r,s){var l=function(){var o=arguments.length,a=findFixedArity(o,r)||findVariadic(r);return h(a[1],new e(s,a[0],arguments))};return l.__meta__=null,l.__multifn__=!0,l.__ast__=function(o){var a=o.length,c=findFixedArity(a,r)||findVariadic(r);return c[1]},l.__gen_env__=function(o){var a=o.length,c=findFixedArity(a,r)||findVariadic(r);return new e(s,c[0],o)},l._ismacro_=!1,l}function _function_Q(h){return typeof h=="function"}Function.prototype.clone=function(){var h=this,e=function(){return h.apply(this,arguments)};for(var r in this)e[r]=this[r];return e};function _fn_Q(h){return _function_Q(h)&&!h._ismacro_}function _macro_Q(h){return _function_Q(h)&&!!h._ismacro_}function _list(){return Array.prototype.slice.call(arguments,0)}function _list_Q(h){return Array.isArray(h)&&!h.__isvector__}function _vector(){var h=Array.prototype.slice.call(arguments,0);return h.__isvector__=!0,h}function _vector_Q(h){return Array.isArray(h)&&!!h.__isvector__}function _hash_map(){if(arguments.length%2===1)throw new Error("Odd number of hash map arguments");var e=[new Map].concat(Array.prototype.slice.call(arguments,0));return _assoc_BANG.apply(null,e)}function _hash_map_Q(h){return typeof h=="object"&&h instanceof Map}function _assoc_BANG(h){if(arguments.length%2!==1)throw new Error("Odd number of assoc arguments");if(_vector_Q(h)){for(let a=0;a<arguments.length;a++){var e=arguments[a],r=arguments[a+1];h[e]=r}return h}var s=new Set;for(let a=1;a<arguments.length;a+=2)s.add(arguments[a]);var l=new Map;for(const[a,c]of h)contains_Q(s,a)||l.set(a,c);for(var o=1;o<arguments.length;o+=2){var e=arguments[o],r=arguments[o+1];l.set(e,r)}return l}function _dissoc_BANG(h){for(var e=1;e<arguments.length;e++){var r=arguments[e];h.delete(r)}return h}function _set(){return new Set(arguments)}function _set_Q(h){return typeof h=="object"&&h instanceof Set}function Atom(h){this.val=h}function _atom(h){return new Atom(h)}function _atom_Q(h){return h instanceof Atom}function Reader(h){this.tokens=h.map(function(e){return e}),this.position=0}Reader.prototype.next=function(){return this.tokens[this.position++]};Reader.prototype.peek=function(){return this.tokens[this.position]};function tokenize(h){var e=/[\s,]*(~@|#{|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g,r=[];let s="";for(;(s=e.exec(h)[1])!="";)s[0]!==";"&&r.push(s);return r}const int_pattern=/^([-+]?)(?:(0)|([1-9][0-9]*)|0[xX]([0-9A-Fa-f]+)|0([0-7]+)|([1-9][0-9]?)[rR]([0-9A-Za-z]+)|0[0-9]+)(N)?$/,float_pattern=/([-+]?[0-9]+(\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?/;function matchInt(h){const e=h.match(int_pattern);if(e[2])return 0;let r;e[3]?r=[e[3],10]:e[4]?r=[e[4],16]:e[5]?r=[e[5],8]:e[7]?r=[e[7],parseInt(e[6])]:r=[null,null];const s=r[0];let l=parseInt(s,r[1]);return e[1]==="-"&&(l=l*-1),l}function matchFloat(h){const e=h.match(float_pattern);return e[4]?parseFloat(e[1]):parseFloat(h)}function char_code(h,e){const r=parseInt(h,e);return isNaN(r)?-1:r}function read_unicode_char(h,e,r,s){const l=e+r;let o=0;for(let a=e;a<l+1;a++){if(a===l)return String.fromCharCode(o);let c=char_code(h[a],s);if(c===-1)throw new Error("Invalid Unicode digit '"+h[a]+"' in "+h);o=o*s+c}}function read_char(h){if(h.length===2)return h[1];if(h[1]==="u")return read_unicode_char(h.slice(1),1,4,16);if(h[1]==="o")return read_unicode_char(h.slice(1),1,h.length-2,8);if(h==="\\newline")return"\\n";if(h==="\\space")return" ";if(h==="\\tab")return"\\t";if(h==="\\backspace")return"\\b";if(h==="\\formfeed")return"\\f";if(h==="\\return")return"\\r";throw new Error("Unsupported character: '"+h+"'")}function read_atom(h){var e=h.next();if(e.match(int_pattern))return matchInt(e);if(e.match(/^([-+]?[0-9]+)\/([0-9]+)$/))return e.split("/");if(e[0]==="\\")return read_char(e);if(e.match(/^([-+]?[0-9]+(\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?$/))return matchFloat(e);if(e.match(/^"(?:\\.|[^\\"])*"$/))return e.slice(1,e.length-1).replace(/\\(.)/g,function(r,s){return s==="n"?`
`:s});if(e[0]==='"')throw new Error(`expected '"', got EOF`);return e[0]===":"?_keyword(e.slice(1)):e==="nil"?null:e==="true"?!0:e==="false"?!1:e==="##NaN"?Number.NaN:e==="##Inf"?Number.POSITIVE_INFINITY:e==="##-Inf"?Number.NEGATIVE_INFINITY:_symbol(e)}function read_list(h,e,r){e=e||"(",r=r||")";var s=[],l=h.next();if(l!==e)throw new Error("expected '"+e+"'");for(;(l=h.peek())!==r;){if(!l)throw new Error("expected '"+r+"', got EOF");s.push(read_form(h))}return h.next(),s}function read_vector(h){var e=read_list(h,"[","]");return _vector.apply(null,e)}function read_hash_map(h){var e=read_list(h,"{","}");return _hash_map.apply(null,e)}function read_set(h){var e=read_list(h,"#{","}");return _set.apply(null,e)}function read_form(h){var e=h.peek();switch(e){case";":return null;case"'":return h.next(),[_symbol("quote"),read_form(h)];case"`":return h.next(),[_symbol("quasiquote"),read_form(h)];case"~":return h.next(),[_symbol("unquote"),read_form(h)];case"~@":return h.next(),[_symbol("splice-unquote"),read_form(h)];case"^":h.next();var r=read_form(h);return[_symbol("with-meta"),read_form(h),r];case"@":return h.next(),[_symbol("deref"),read_form(h)];case"#":return h.next(),[_symbol("dispatch"),read_form(h)];case"#_":return h.next(),[_symbol("discard-form"),read_form(h)];case")":throw new Error("unexpected ')'");case"(":return read_list(h);case"]":throw new Error("unexpected ']'");case"[":return read_vector(h);case"#{":return read_set(h);case"}":throw new Error("unexpected '}'");case"{":return read_hash_map(h);default:return read_atom(h)}}function BlankException(h){}function read_str(h){var e=tokenize(h);if(e.length===0)throw new BlankException;return read_form(new Reader(e))}function Env(h,e,r){if(this.data={},this.outer=h||null,e&&r)for(var s=0;s<e.length;s++)if(e[s].value==="&"){this.data[e[s+1].value]=Array.prototype.slice.call(r,s);break}else this.data[e[s].value]=r[s];return this}Env.prototype.find=function(h){return h.value in this.data?this:this.outer?this.outer.find(h):null};Env.prototype.set=function(h,e){return this.data[h.value]=e,e};Env.prototype.get=function(h){var e=this.find(h);if(!e)throw new Error("'"+h.value+"' not found");return e.data[h.value]};const core_clj=`(ns core {:clj-kondo/ignore true})\r
\r
(defmacro or\r
  "Evaluates exprs one at a time, from left to right. If a form\r
    returns a logical true value, or returns that value and doesn't\r
    evaluate any of the other expressions, otherwise it returns the\r
    value of the last expression. (or) returns nil."\r
  [& xs]\r
  (if (empty? xs) nil\r
      (if (= 1 (count xs))\r
        (first xs)\r
        (let* [condvar (gensym)]\r
              \`(let* [~condvar ~(first xs)]\r
                     (if ~condvar ~condvar (or ~@(rest xs))))))))\r
\r
(defmacro and\r
  "Evaluates exprs one at a time, from left to right. If a form\r
    returns logical false (nil or false), and returns that value and\r
    doesn't evaluate any of the other expressions, otherwise it returns\r
    the value of the last expr. (and) returns true."\r
  [& xs]\r
  (cond (empty? xs)      true\r
        (= 1 (count xs)) (first xs)\r
        :else\r
        (let* [condvar (gensym)]\r
              \`(let* [~condvar ~(first xs)]\r
                     (if ~condvar (and ~@(rest xs)) ~condvar)))))\r
\r
(defmacro when\r
  "Evaluates test. If logical true, evaluates body in an implicit do."\r
  [x & xs]\r
  (list 'if x (cons 'do xs)))\r
\r
(defmacro cond\r
  "Takes a set of test/expr pairs. It evaluates each test one at a\r
time.  If a test returns logical true, cond evaluates and returns\r
the value of the corresponding expr and doesn't evaluate any of the\r
other tests or exprs. (cond) returns nil."\r
  [& xs]\r
  (when (gt (count xs) 0)\r
    (list 'if (first xs)\r
          (if (gt (count xs) 1)\r
            (nth xs 1)\r
            (throw "odd number of forms to cond"))\r
          (cons 'cond (rest (rest xs))))))\r
\r
(def spread (fn* [arglist]\r
                 (cond\r
                   (nil? arglist) nil\r
                   (nil? (next arglist)) (seq (first arglist))\r
                   :else (cons (first arglist) (spread (next arglist))))))\r
\r
(def list*\r
  (with-meta\r
    (fn*\r
     ([args] (seq args))\r
     ([a args] (cons a args))\r
     ([a b args] (cons a (cons b args)))\r
     ([a b c args] (cons a (cons b (cons c args))))\r
     ([a b c d & more]\r
      (cons a (cons b (cons c (cons d (spread more)))))))\r
    {:doc      "Creates a new seq containing the items prepended to the rest, the\r
last of which will be treated as a sequence."\r
     :arglists '([args] [a args] [a b args] [a b c args] [a b c d & more])}))\r
\r
(def apply\r
  (with-meta\r
    (fn*\r
     ([f args]\r
      (if (keyword? f)\r
        (get args f)\r
        (apply* f args)))\r
     ([f x args]\r
      (apply f (list* x args)))\r
     ([f x y args]\r
      (apply f (list* x y args)))\r
     ([f x y z args]\r
      (apply f (list* x y z args)))\r
     ([f a b c d & args]\r
      (apply f (cons a (cons b (cons c (cons d (spread args))))))))\r
    {:doc "Applies fn f to the argument list formed by prepending intervening arguments to args."\r
     :arglists '([f args] [f x args] [f x y args] [f x y z args] [f a b c d & args])}))\r
\r
(defmacro lazy-seq\r
  "Takes a body of expressions that returns an ISeq or nil, and yields\r
    a Seqable object that will invoke the body only the first time seq\r
    is called, and will cache the result and return it on all subsequent\r
    seq calls. See also - realized?"\r
  [& body]\r
  \`(new LazySeq (fn* [] ~@body)))\r
\r
;; Clojure's lazy map, doesn't work yet\r
\r
(def map-step\r
  (fn*\r
   [cs]\r
   (lazy-seq\r
    (let [ss (map seq cs)]\r
      (when (every? identity ss)\r
        (cons (map first ss) (map-step (map rest ss))))))))\r
\r
#_(def map\r
  (fn*\r
   ([f coll]\r
    (lazy-seq\r
     (when-let [s (seq coll)]\r
       (cons (f (first s)) (map f (rest s))))))\r
   ([f c1 c2]\r
    (lazy-seq\r
     (let [s1 (seq c1) s2 (seq c2)]\r
       (when (and s1 s2)\r
         (cons (f (first s1) (first s2))\r
               (map f (rest s1) (rest s2)))))))\r
   ([f c1 c2 c3]\r
    (lazy-seq\r
     (let [s1 (seq c1) s2 (seq c2) s3 (seq c3)]\r
       (when (and  s1 s2 s3)\r
         (cons (f (first s1) (first s2) (first s3))\r
               (map f (rest s1) (rest s2) (rest s3)))))))\r
   ([f c1 c2 c3 & colls]\r
      (map #(apply f %) (map-step (conj colls c3 c2 c1))))))\r
\r
(def map\r
  (with-meta\r
    (fn* \r
     ([f coll]\r
      (loop* [s (seq coll) res []]\r
             (if (empty? s) (apply list res)\r
                 (recur (rest s)\r
                        (conj res (if (keyword? f) (get (first s) f) (f (first s))))))))\r
     ([f c1 c2]\r
      (loop* [s1 (seq c1) s2 (seq c2) res []]\r
             (if (or (empty? s1) (empty? s2)) (apply list res)\r
                 (recur (rest s1) (rest s2)\r
                        (conj res (f (first s1) (first s2)))))))\r
     ([f c1 c2 c3]\r
      (loop* [s1 (seq c1) s2 (seq c2) s3 (seq c3) res []]\r
             (if (or (empty? s1) (empty? s2) (empty? s3)) (apply list res)\r
                 (recur (rest s1) (rest s2) (rest s3)\r
                        (conj res (f (first s1) (first s2) (first s3)))))))\r
     ([f c1 c2 c3 c4]\r
      (loop* [s1 (seq c1) s2 (seq c2) s3 (seq c3) s4 (seq c4) res []]\r
             (if (or (empty? s1) (empty? s2) (empty? s3) (empty? s4)) (apply list res)\r
                 (recur (rest s1) (rest s2) (rest s3) (rest s4)\r
                        (conj res (f (first s1) (first s2) (first s3) (first s4)))))))\r
     ([f c0 c1 c2 & colls]\r
      (_map f (list* c0 c1 c2 colls))))\r
      {:doc "Returns a sequence consisting of the result of applying f to\r
            the set of first items of each coll, followed by applying f to the\r
            set of second items in each coll, until any one of the colls is\r
            exhausted.  Any remaining items in other colls are ignored. Function\r
            f should accept number-of-colls arguments."\r
       :arglists '([f coll] [f c1 c2] [f c1 c2 c3] [f c1 c2 c3 c4] [f c0 c1 c2 & colls])}))\r
\r
(def seq? \r
  (with-meta\r
    (fn* [x] (list? x))\r
    {:doc "Returns true if x can be sequenced"\r
     :arglists '([x])}))\r
\r
(def gensym-counter\r
  (atom 0))\r
\r
(def gensym \r
  (with-meta\r
    (fn* \r
     ([] (symbol (str "G__" (swap! gensym-counter inc))))\r
     ([prefix]\r
      (symbol (str prefix (swap! gensym-counter inc)))))\r
    {:doc      "Returns a new symbol with a unique name. If a prefix string is\r
supplied, the name is prefix# where # is some unique number. If\r
prefix is not supplied, the prefix is 'G__'."\r
     :arglists '([] [prefix])}))\r
\r
;; prints elapsed time twice for some reason\r
(defmacro time [exp]\r
  (let* [start (gensym)\r
         ret   (gensym)]\r
        \`(let* [~start (time-ms)\r
                       ~ret   ~exp]\r
               (do\r
                 (println "Elapsed time:" (- (time-ms) ~start) "msecs")\r
                 ~ret))))\r
\r
;; first define let, loop, fn without destructuring\r
\r
(defmacro let [bindings & body]\r
  \`(let* ~bindings ~@body))\r
\r
(defmacro loop [& decl]\r
   (cons 'loop* decl))\r
\r
(defmacro fn [& sigs]\r
  (let [name (if (symbol? (first sigs)) (first sigs) nil)\r
        sigs (if name (next sigs) sigs)\r
        sigs (if (vector? (first sigs))\r
               (list sigs)\r
               (if (seq? (first sigs))\r
                 sigs\r
                 (throw (if (seq sigs)\r
                          (str "Parameter declaration "\r
                               (first sigs)\r
                               " should be a vector")\r
                          (str "Parameter declaration missing")))))\r
        psig (fn* [sig]\r
                  sig)\r
        new-sigs (map psig sigs)]\r
    (if name\r
      (list* 'fn* name new-sigs)\r
      (cons 'fn* new-sigs))))\r
\r
(def next\r
  (with-meta\r
   (fn [coll]\r
    (if (or (= 1 (count coll)) (= 0 (count coll)))\r
      nil\r
      (rest coll)))\r
    {:doc "Returns a seq of the items after the first. Calls seq on its\r
argument.  If there are no more items, returns nil."\r
     :arglists '([coll])}))\r
\r
(def sigs\r
  (fn [fdecl]\r
    (let [asig\r
          (fn [fdecl]\r
            (let [arglist (first fdecl)\r
                  body (next fdecl)]\r
              (if (map? (first body))\r
                (if (next body)\r
                  (with-meta arglist (conj (if (meta arglist) (meta arglist) {}) (first body)))\r
                  arglist)\r
                arglist)))]\r
      (if (seq? (first fdecl))\r
        (loop [ret [] fdecls fdecl]\r
          (if fdecls\r
            (recur (conj ret (asig (first fdecls))) (next fdecls))\r
            (seq ret)))\r
        (list (asig fdecl))))))\r
\r
(defmacro defn\r
  "Same as (def name (fn [params* ] exprs*)) or (def\r
  name (fn ([params* ] exprs*)+)) with any doc-string or attrs added\r
  to the var metadata."\r
  [name & fdecl]\r
  (let* [m (if (string? (first fdecl))\r
             {:doc  (first fdecl)\r
              :name (str name)}\r
             {:name (str name)})\r
         fdecl (if (string? (first fdecl))\r
                 (next fdecl)\r
                 fdecl)\r
         m (if (map? (first fdecl))\r
             (conj m (first fdecl))\r
             m)\r
         fdecl (if (map? (first fdecl))\r
                 (next fdecl)\r
                 fdecl)\r
         fdecl (if (vector? (first fdecl))\r
                 (list fdecl)\r
                 fdecl)\r
         m (if (map? (last fdecl))\r
             (conj m (last fdecl))\r
             m)\r
         fdecl (if (map? (last fdecl))\r
                 (butlast fdecl)\r
                 fdecl)\r
         m (conj {:arglists (list 'quote (sigs fdecl))} m)\r
         m (conj (if (meta name) (meta name) {}) m)]\r
    \`(def ~(with-meta name m) (with-meta (fn ~@fdecl) ~m))))\r
\r
(defmacro defn-\r
  "Same as defn, yielding non-public def"\r
  [name & decls]\r
   (list* \`defn (with-meta name (assoc (meta name) :private true)) decls))\r
\r
(defn load-file [f]\r
  (eval\r
   (read-string\r
    (str "(do " (slurp f) ")"))))\r
\r
(defn not\r
  "Returns true if x is logical false, false otherwise."\r
  [a]\r
  (if a false true))\r
\r
(defn not=\r
  "Same as (not (= obj1 obj2))"\r
  [a b]\r
  (not (= a b)))\r
\r
(defn dec\r
  "Returns a number one less than n."\r
  [n]\r
  (- n 1))\r
\r
(defn zero?\r
  "Returns true if num is zero, else false"\r
  [n]\r
  (= 0 n))\r
\r
(defn identity\r
  "Returns its argument."\r
  [x]\r
  x)\r
\r
(defn nnext\r
  "Same as (next (next x))"\r
  [s]\r
  (next (next s)))\r
\r
(defn reduce\r
  "f should be a function of 2 arguments. If val is not supplied,\r
returns the result of applying f to the first 2 items in coll, then\r
applying f to that result and the 3rd item, etc. If coll contains no\r
items, f must accept no arguments as well, and reduce returns the\r
result of calling f with no arguments. If coll has only 1 item, it\r
is returned and f is not called.  If val is supplied, returns the\r
result of applying f to val and the first item in coll, then\r
applying f to that result and the 2nd item, etc. If coll contains no\r
items, returns val and f is not called."\r
  ([f xs] (reduce f (first xs) (rest xs)))\r
  ([f init xs]\r
   (if (empty? xs)\r
     init\r
     (reduce f (f init (first xs)) (rest xs)))))\r
\r
(defn reductions\r
  "Returns a sequence of the intermediate values of the reduction (as\r
per reduce) of coll by f, starting with init."\r
  [f init xs]\r
  (loop* [s xs acc init res [init]]\r
    (if (empty? s)\r
      res\r
      (recur (rest s)\r
             (f acc (first s))\r
             (conj res (f acc (first s)))))))\r
\r
(defn reverse\r
  "Returns a seq of the items in coll in reverse order. Not lazy."\r
  [coll]\r
  (reduce conj '() coll))\r
\r
(defmacro if-not\r
  "Evaluates test. If logical false, evaluates and returns then expr, \r
otherwise else expr, if supplied, else nil."\r
  [test then else]\r
  (if else\r
    \`(if (not ~test) ~then ~else)\r
    \`(if-not ~test ~then nil)))\r
\r
(defn sorted-map\r
  "Returns a new sorted map with supplied mappings. If any keys are\r
equal, they are handled as if by repeated uses of assoc."\r
  [& keyvals]\r
  (into\r
   (with-meta {} {:sorted-map true})\r
   (sort (partition 2 keyvals))))\r
\r
(defn sorted-set\r
  "Returns a new sorted set with supplied keys.  Any equal keys are\r
handled as if by repeated uses of conj."\r
  [& keys]\r
  (into\r
   (with-meta #{} {:sorted-set true})\r
   (sort keys)))\r
\r
(defn merge-with\r
  "Returns a map that consists of the rest of the maps conj-ed onto\r
the first.  If a key occurs in more than one map, the mapping(s)\r
from the latter (left-to-right) will be combined with the mapping in\r
the result by calling (f val-in-result val-in-latter)."\r
  [f & maps]\r
  (when (some identity maps)\r
    (let [merge-entry (fn* [m e]\r
                        (let [k (key e) v (val e)]\r
                          (if (contains? m k)\r
                            (assoc m k (f (get m k) v))\r
                            (assoc m k v))))\r
          merge2 (fn* [m1 m2]\r
                   (reduce merge-entry (or m1 {}) (seq m2)))]\r
      (reduce merge2 maps))))\r
\r
(defn str/escape\r
  "Return a new string, using cmap to escape each character ch\r
 from s"\r
  [s cmap]\r
  (loop* [index  0\r
         buffer ""]\r
    (if (= (count s) index) buffer\r
        (recur (inc index) \r
               (str buffer (get cmap (nth s index) (nth s index)))))))\r
\r
(defn juxt\r
  "Takes a set of functions and returns a fn that is the juxtaposition\r
of those fns.  The returned fn takes a variable number of args, and\r
returns a vector containing the result of applying each fn to the\r
args (left-to-right). Example: ((juxt a b c) x) => [(a x) (b x) (c x)]"\r
  ([f]\r
   (fn*\r
     ([] [(f)])\r
     ([x] [(f x)])\r
     ([x y] [(f x y)])\r
     ([x y z] [(f x y z)])\r
     ([x y z & args] [(apply f x y z args)])))\r
  ([f g]\r
   (fn*\r
     ([] [(f) (g)])\r
     ([x] [(f x) (g x)])\r
     ([x y] [(f x y) (g x y)])\r
     ([x y z] [(f x y z) (g x y z)])\r
     ([x y z & args] [(apply f x y z args) (apply g x y z args)])))\r
  ([f g h]\r
   (fn*\r
     ([] [(f) (g) (h)])\r
     ([x] [(f x) (g x) (h x)])\r
     ([x y] [(f x y) (g x y) (h x y)])\r
     ([x y z] [(f x y z) (g x y z) (h x y z)])\r
     ([x y z & args] [(apply f x y z args) (apply g x y z args) (apply h x y z args)])))\r
  ([f g h & fs]\r
   (let [fs (list* f g h fs)]\r
     (fn*\r
       ([] (reduce #(conj %1 (%2)) [] fs))\r
       ([x] (reduce #(conj %1 (%2 x)) [] fs))\r
       ([x y] (reduce #(conj %1 (%2 x y)) [] fs))\r
       ([x y z] (reduce #(conj %1 (%2 x y z)) [] fs))\r
       ([x y z & args] (reduce #(conj %1 (apply %2 x y z args)) [] fs))))))\r
\r
(defn comp\r
  "Takes a set of functions and returns a fn that is the composition\r
of those fns.  The returned fn takes a variable number of args,\r
applies the rightmost of fns to the args, the next\r
fn (right-to-left) to the result, etc."\r
  ([] identity)\r
  ([f] f)\r
  ([f g]\r
   (fn*\r
     ([] (f (g)))\r
     ([x] (f (g x)))\r
     ([x y] (f (g x y)))\r
     ([x y z] (f (g x y z)))\r
     ([x y z & args] (f (apply g x y z args)))))\r
  ([f g & fs]\r
   (reduce comp (list* f g fs))))\r
\r
(defn .toUpperCase\r
  "Converts string to all upper-case."\r
  [s]\r
  (. (str "'" s "'" ".toUpperCase")))\r
\r
(defn .toLowerCase\r
  "Converts string to all lower-case."\r
  [s]\r
  (. (str "'" s "'" ".toLowerCase")))\r
\r
(defn _iter-> [acc form]\r
  (if (list? form)\r
    \`(~(first form) ~acc ~@(rest form))\r
    (list form acc)))\r
\r
(defmacro ->\r
  "Threads the expr through the forms. Inserts x as the\r
second item in the first form, making a list of it if it is not a\r
list already. If there are more forms, inserts the first form as the\r
second item in second form, etc."\r
  [x & xs]\r
  (reduce _iter-> x xs))\r
\r
(defn _iter->> [acc form]\r
  (if (list? form)\r
    \`(~(first form) ~@(rest form) ~acc) (list form acc)))\r
\r
(defmacro ->>\r
  "Threads the expr through the forms. Inserts x as the\r
last item in the first form, making a list of it if it is not a\r
list already. If there are more forms, inserts the first form as the\r
last item in second form, etc."\r
  [x & xs]\r
  (reduce _iter->> x xs))\r
\r
(defn memoize\r
  "Returns a memoized version of a referentially transparent function. The\r
memoized version of the function keeps a cache of the mapping from arguments\r
to results and, when calls with the same arguments are repeated often, has\r
higher performance at the expense of higher memory use."\r
  [f]\r
  (let* [mem (atom {})]\r
        (fn* [& args]\r
          (let* [key (str args)]\r
                (if (contains? @mem key)\r
                  (get @mem key)\r
                  (let* [ret (apply f args)]\r
                        (do (swap! mem assoc key ret)\r
                            ret)))))))\r
\r
(defn partial\r
  "Takes a function f and fewer than the normal arguments to f, and\r
returns a fn that takes a variable number of additional args. When\r
called, the returned function calls f with args + additional args."\r
  [pfn & args]\r
  (fn* [& args-inner]\r
    (apply pfn (concat args args-inner))))\r
\r
(defn every?\r
  "Returns true if (pred x) is logical true for every x in coll, else\r
false."\r
  [pred xs]\r
  (cond (empty? xs)       true\r
        (pred (first xs)) (every? pred (rest xs))\r
        true              false))\r
\r
(defn postwalk\r
  "Performs a depth-first, post-order traversal of form.  Calls f on\r
each sub-form, uses f's return value in place of the original.\r
Recognizes all Clojure data structures. Consumes seqs as with doall."\r
  [f form]\r
  (walk (partial postwalk f) f form))\r
\r
(defn prewalk\r
  "Like postwalk, but does pre-order traversal."\r
  [f form]\r
  (walk (partial prewalk f) identity (f form)))\r
\r
(defn postwalk-replace\r
  "Recursively transforms form by replacing keys in smap with their\r
values. Like clojure/replace but works on any data structure. Does\r
replacement at the leaves of the tree first."\r
  [smap form]\r
  (postwalk (fn* [x] (if (contains? smap x) (smap x) x)) form))\r
\r
(defn not-every?\r
  "Returns false if (pred x) is logical true for every x in\r
coll, else true."\r
  [pred xs]\r
  (not (every? pred xs)))\r
\r
(defmacro if-not\r
  "Evaluates test. If logical false, evaluates and returns then expr, \r
otherwise else expr, if supplied, else nil."\r
  [test then else]\r
  \`(if (not ~test) ~then ~else))\r
\r
(defmacro when-not\r
  "Evaluates test. If logical false, evaluates body in an implicit do."\r
  [test & body]\r
  (list 'if test nil (cons 'do body)))\r
\r
(defn fnext\r
  "Same as (first (next x))"\r
  [x]\r
  (first (next x)))\r
\r
(defn ffirst\r
  "Same as (first (first x))"\r
  [x]\r
  (first (first x)))\r
\r
(defn second\r
  "Same as (first (next x))"\r
  [l] (nth l 1))\r
\r
(defn some\r
  "Returns the first logical true value of (pred x) for any x in coll,\r
else nil.  One common idiom is to use a set as pred, for example\r
this will return :fred if :fred is in the sequence, otherwise nil:\r
(some #{:fred} coll)"\r
  [pred xs]\r
  (if (set? pred)\r
    (if (empty? xs) nil\r
      (or (when (contains? pred (first xs))\r
            (first xs))\r
          (some pred (rest xs))))\r
    (if (map? pred)\r
      (if (empty? xs) nil\r
          (or (when (contains? pred (first xs))\r
                (get pred (first xs)))\r
              (some pred (rest xs))))\r
      (if (empty? xs) nil\r
        (or (pred (first xs))\r
            (some pred (rest xs)))))))\r
\r
(defn not-any?\r
  "Returns false if (pred x) is logical true for any x in coll,\r
else true."\r
  [pred coll]\r
  (not (some pred coll)))\r
\r
(defn quot\r
  "quot[ient] of dividing numerator by denominator."\r
  [n d]\r
  (int (double (/ n d))))\r
\r
(defn pos?\r
  "Returns true if num is greater than zero, else false"\r
  [n]\r
  (> n 0))\r
\r
(defn neg?\r
  "Returns true if num is less than zero, else false"\r
  [n]\r
  (> 0 n))\r
\r
(defn even?\r
  "Returns true if n is even, throws an exception if n is not an integer"\r
  [n]\r
  (zero? (mod n 2)))\r
\r
(defn odd?\r
  "Returns true if n is odd, throws an exception if n is not an integer"\r
  [n]\r
  (not (zero? (mod n 2))))\r
\r
(defn complement\r
  "Takes a fn f and returns a fn that takes the same arguments as f,\r
has the same effects, if any, and returns the opposite truth value."\r
  [f]\r
  (fn*\r
    ([] (not (f)))\r
    ([x] (not (f x)))\r
    ([x y] (not (f x y)))\r
    ([x y & zs] (not (apply f x y zs)))))\r
\r
(defn mapcat\r
  "Returns the result of applying concat to the result of applying map\r
to f and colls.  Thus function f should return a collection."\r
  [f & colls]\r
  (apply concat (apply map f colls)))\r
\r
(defn remove\r
  "Returns a lazy sequence of the items in coll for which\r
(pred item) returns logical false. pred must be free of side-effects."\r
  [pred coll]\r
  (filter (complement pred) coll))\r
\r
(defn tree-seq\r
  "Returns a lazy sequence of the nodes in a tree, via a depth-first walk.\r
 branch? must be a fn of one arg that returns true if passed a node\r
 that can have children (but may not).  children must be a fn of one\r
 arg that returns a sequence of the children. Will only be called on\r
 nodes for which branch? returns true. Root is the root node of the\r
tree."\r
  [branch? children node]\r
  (remove nil?\r
          (cons node\r
                (when (branch? node)\r
                  (mapcat (fn* [x] (tree-seq branch? children x))\r
                          (children node))))))\r
\r
(defn flatten\r
  "Takes any nested combination of sequential things (lists, vectors,\r
etc.) and returns their contents as a single, flat lazy sequence.\r
(flatten nil) returns an empty sequence."\r
  [x]\r
  (filter (complement sequential?)\r
          (rest (tree-seq sequential? seq x))))\r
\r
(defn mod\r
  "Modulus of num and div. Truncates toward negative infinity."\r
  [num div]\r
  (let* [m (rem num div)]\r
        (if (or (zero? m) (= (pos? num) (pos? div)))\r
          m\r
          (+ m div))))\r
\r
(defn take-while\r
  "Returns a lazy sequence of successive items from coll while\r
(pred item) returns logical true. pred must be free of side-effects."\r
  [pred coll]\r
  (loop* [s (seq coll) res []]\r
    (if (empty? s) res\r
        (if (pred (first s))\r
          (recur (rest s) (conj res (first s)))\r
          res))))\r
\r
(defn drop-while\r
  "Returns a lazy sequence of the items in coll starting from the\r
first item for which (pred item) returns logical false."\r
  [pred coll]\r
  (loop* [s   (seq coll)]\r
    (if (empty? s) s\r
        (if (and s (pred (first s)))\r
          (recur (rest s))\r
          s))))\r
\r
(defn partition\r
  "Returns a lazy sequence of lists of n items each, at offsets step\r
apart. If step is not supplied, defaults to n, i.e. the partitions\r
do not overlap. If a pad collection is supplied, use its elements as\r
necessary to complete last partition upto n items. In case there are\r
not enough padding elements, return a partition with less than n items."\r
  ([n coll]\r
   (partition n n coll))\r
  ([n step coll]\r
     (loop* [s coll p []]\r
       (if (= 0 (count s))\r
         (filter #(= n (count %)) p)\r
         (recur (drop step s) (conj p (take n s))))))\r
  ([n step pad coll]\r
     (loop* [s coll p []]\r
           (if (= n (count (take n s)))\r
             (recur (drop step s) (conj p (take n s)))\r
             (conj p (concat (take n s) pad))))))\r
\r
(defn boolean\r
  "Coerce to boolean"\r
  [x]\r
  (if x true false))\r
\r
(defn split-at\r
  "Returns a vector of [(take n coll) (drop n coll)]"\r
  [n coll]\r
  [(take n coll) (drop n coll)])\r
\r
(defn split-with\r
  "Returns a vector of [(take-while pred coll) (drop-while pred coll)]"\r
  [pred coll]\r
  [(take-while pred coll) (drop-while pred coll)])\r
\r
(defn str/split-lines\r
  "Splits s on \\\\n or \\\\r\\\\n."\r
  [s]\r
  (str/split s #"\\r?\\n"))\r
\r
(defn partition-all\r
  "Returns a lazy sequence of lists like partition, but may include\r
partitions with fewer than n items at the end."\r
  ([n coll]\r
   (partition-all n n coll))\r
  ([n step coll]\r
     (loop* [s coll p []]\r
            (if (= 0 (count s)) p\r
                (recur (drop step s)\r
                       (conj p (take n s)))))))\r
\r
(defn partition-by\r
  "Applies f to each value in coll, splitting it each time f returns a\r
 new value.  Returns a sequenc of partitions."\r
  [f coll]\r
  (loop* [s (seq coll) res []]\r
    (if (= 0 (count s)) res\r
        (recur (drop (count (take-while (fn* [x] (= (f (first s)) (f x))) s)) s)\r
               (conj res (take-while (fn* [x] (= (f (first s)) (f x))) s))))))\r
\r
(defn coll?\r
  "Returns true if x is a list, vector, set or map"\r
  [x]\r
  (or (list? x) (vector? x) (set? x) (map? x)))\r
\r
(defn group-by\r
  "Returns a map of the elements of coll keyed by the result of\r
f on each element. The value at each key will be a vector of the\r
corresponding elements, in the order they appeared in coll."\r
  [f coll]\r
  (reduce\r
   (fn* [ret x]\r
     (let* [k (f x)]\r
           (assoc ret k (conj (get ret k []) x))))\r
   {} coll))\r
\r
(defn fromCharCode\r
  "Returns a string created from the specified sequence of UTF-16 code units."\r
  [int]\r
  (js-eval (str "String.fromCharCode(" int ")")))\r
\r
(defn Character/isAlphabetic\r
  "Returns true if char code represents a letter."\r
  [int]\r
  (not= (upper-case (fromCharCode int))\r
        (lower-case (fromCharCode int))))\r
\r
(defn Character/digit\r
  "Returns the numerical value of char using radix r."\r
  [char r]\r
  (Integer/parseInt (first char) r))\r
\r
(defn Character/isLetter\r
  "Returns true if char is a letter."\r
  [char]\r
  (not= (upper-case char)\r
        (lower-case char)))\r
\r
(defn Character/isUpperCase\r
  "Takes a character or a code point. Returns true if x is uppercase."\r
  [x]\r
  (if (int? x)\r
    (and (Character/isLetter (fromCharCode x))\r
         (= (fromCharCode x)\r
            (upper-case (fromCharCode x))))\r
    (and (Character/isLetter x)\r
         (= x (upper-case x)))))\r
\r
(defn Character/isLowerCase\r
  "Takes a character or a code point. Returns true if x is lowercase."\r
  [x]\r
  (if (int? x)\r
    (and (Character/isLetter (fromCharCode x))\r
         (= (fromCharCode x)\r
            (lower-case (fromCharCode x))))\r
    (and (Character/isLetter x)\r
         (= x (lower-case x)))))\r
\r
(defn zipmap\r
  "Returns a map with the keys mapped to the corresponding vals."\r
  [keys vals]\r
  (loop* [map {}\r
         ks (seq keys)\r
         vs (seq vals)]\r
    (if-not (and ks vs) map\r
            (recur (assoc map (first ks) (first vs))\r
                   (next ks)\r
                   (next vs)))))\r
\r
(defn empty\r
  "Returns an empty collection of the same category as coll, or nil"\r
  [coll]\r
  (cond\r
    (list? coll) '()\r
    (vector? coll) []\r
    (set? coll) #{}\r
    (map? coll) {}\r
    (string? coll) ""))\r
\r
(defn mapv\r
  "Returns a vector consisting of the result of applying f to the\r
set of first items of each coll, followed by applying f to the set\r
of second items in each coll, until any one of the colls is\r
exhausted.  Any remaining items in other colls are ignored. Function\r
f should accept number-of-colls arguments."\r
  ([f coll]\r
   (-> (reduce (fn [v o] (conj v (f o))) [] coll)))\r
  ([f c1 c2]\r
   (into [] (map f c1 c2)))\r
  ([f c1 c2 c3]\r
   (into [] (map f c1 c2 c3)))\r
  ([f c1 c2 c3 & colls]\r
   (into [] (apply map f c1 c2 c3 colls))))\r
\r
(defn drop-last\r
  "Return a sequence of all but the last n (default 1) items in coll"\r
  [n coll]\r
  (if-not coll\r
    (drop-last 1 n)\r
    (map (fn* [x _] x) coll (drop n coll))))\r
\r
(defn interleave\r
  "Returns a seq of the first item in each coll, then the second etc."\r
  [c1 c2]\r
  (loop* [s1  (seq c1)\r
         s2  (seq c2)\r
         res []]\r
    (if (or (empty? s1) (empty? s2))\r
      res\r
      (recur (rest s1)\r
             (rest s2)\r
             (conj res (first s1) (first s2))))))\r
\r
(defn interpose\r
  "Returns a seq of the elements of coll separated by sep."\r
  [sep coll]\r
  (drop 1 (interleave (repeat (count coll) sep) coll)))\r
\r
(defn into\r
  "Returns a new coll consisting of to-coll with all of the items of\r
from-coll conjoined."\r
  [to from]\r
  (reduce conj to from))\r
\r
(defmacro if-let\r
    "If test is true, evaluates then with binding-form bound to the value of \r
  test, if not, yields else"\r
  [bindings then else & oldform]\r
  (if-not else\r
    \`(if-let ~bindings ~then nil)\r
    (let* [form (get bindings 0) tst (get bindings 1)\r
           temp# (gensym)]\r
          \`(let [temp# ~tst]\r
             (if temp#\r
               (let [~form temp#]\r
                 ~then)\r
               ~else)))))\r
\r
\r
(defn frequencies\r
  "Returns a map from distinct items in coll to the number of times\r
they appear."\r
  [coll]\r
  (reduce (fn* [counts x]\r
            (assoc counts x (inc (get counts x 0))))\r
          {} coll))\r
\r
(defn constantly\r
  "Returns a function that takes any number of arguments and returns x."\r
  [x]\r
  (fn* [& args] x))\r
\r
(defn str/capitalize\r
  "Converts first character of the string to upper-case, all other\r
characters to lower-case."\r
  [s]\r
  (let* [s (str s)]\r
        (if (< (count s) 2)\r
          (upper-case s)\r
          (str (upper-case (subs s 0 1))\r
               (lower-case (subs s 1))))))\r
\r
(defn keep\r
  "Returns a sequence of the non-nil results of (f item). Note,\r
this means false return values will be included.  f must be free of\r
side-effects."\r
  [s]\r
  (remove nil? s))\r
\r
(defn not-empty\r
  "If coll is empty, returns nil, else coll"\r
  [coll]\r
  (when (seq coll) coll))\r
\r
(defn reduce-kv\r
  "Reduces an associative collection. f should be a function of 3\r
arguments. Returns the result of applying f to init, the first key\r
and the first value in coll, then applying f to that result and the\r
2nd key and value, etc. If coll contains no entries, returns init\r
and f is not called. Note that reduce-kv is supported on vectors,\r
where the keys will be the ordinals."\r
  [f init coll]\r
  (reduce (fn* [ret kv] (f ret (first kv) (last kv))) init coll))\r
\r
(defn merge\r
  "Returns a map that consists of the rest of the maps conj-ed onto\r
the first.  If a key occurs in more than one map, the mapping from\r
the latter (left-to-right) will be the mapping in the result."\r
  [& maps]\r
  (loop* [maps (mapcat seq maps) res {}]\r
    (if-not (some identity maps) res\r
            (recur (rest maps) (conj res (first maps))))))\r
\r
(defmacro when-let\r
  "When test is true, evaluates body with binding-form bound to the value of test"\r
  [bindings & body]\r
  (let* [form (get bindings 0) tst (get bindings 1)\r
         temp# (gensym)]\r
        \`(let* [temp# ~tst]\r
               (when temp#\r
                 (let* [~form temp#]\r
                       ~@body)))))\r
\r
(defmacro when-first\r
  "Roughly the same as (when (seq xs) (let [x (first xs)] body)) but xs is evaluated only once."\r
  [bindings & body]\r
  (let* [x   (first bindings)\r
         xs  (last bindings)\r
         xs# (gensym)]\r
        \`(when-let [xs# (seq ~xs)]\r
           (let* [~x (first xs#)]\r
                 ~@body))))\r
  \r
(defmacro as->\r
  "Binds name to expr, evaluates the first form in the lexical context\r
of that binding, then binds name to that result, repeating for each\r
successive form, returning the result of the last form."\r
  [expr name & forms]\r
  \`(let* [~name ~expr\r
          ~@(interleave (repeat (count forms) name) (butlast forms))]\r
         ~(if (empty? forms)\r
            name\r
            (last forms))))\r
\r
(defmacro some->\r
  "When expr is not nil, threads it into the first form (via ->),\r
and when that result is not nil, through the next etc"\r
  [expr & forms]\r
  (let [g (gensym)\r
        steps (map (fn [step] \`(if (nil? ~g) nil (-> ~g ~step)))\r
                   forms)]\r
    \`(let [~g ~expr\r
           ~@(interleave (repeat (count forms) g) (butlast steps))]\r
       ~(if (empty? steps)\r
          g\r
          (last steps)))))\r
\r
(defmacro some->>\r
  "When expr is not nil, threads it into the first form (via ->>),\r
and when that result is not nil, through the next etc"\r
  [expr & forms]\r
  (let [g (gensym)\r
        steps (map (fn [step] \`(if (nil? ~g) nil (->> ~g ~step)))\r
                   forms)]\r
    \`(let [~g ~expr\r
           ~@(interleave (repeat (count forms) g) (butlast steps))]\r
       ~(if (empty? steps)\r
          g\r
          (last steps)))))\r
\r
(defn distinct?\r
  "Returns true if no two of the arguments are ="\r
  [x y & more]\r
  (if-not more\r
    (if-not y\r
      true\r
      (not (= x y)))\r
    (if (not= x y)\r
      (loop* [s (set [x y]) xs more]\r
        (if xs\r
          (if (contains? s (first xs))\r
            false\r
            (recur (conj s (first xs)) (next xs)))\r
          true))\r
      false)))\r
\r
(defn distinct\r
  "Returns a sequence of the elements of coll with duplicates removed."\r
  [coll]\r
  (into (empty coll) (set coll)))\r
\r
(defn parseInt\r
  "Parses a string argument and returns an integer of the specified radix."\r
  [s r]\r
  (Integer/parseInt s r))\r
\r
(defn Math/floor\r
  "Rounds down and returns the largest integer less than or equal to a given number."\r
  [x]\r
  (js-eval (str "Math.floor(" x ")")))\r
\r
(defn Math/ceil\r
  "Rounds up and returns the smallest integer greater than or equal to a given number."\r
  [x]\r
  (js-eval (str "Math.ceil(" x ")")))\r
\r
(defn get-in\r
  "Returns the value in a nested associative structure,\r
where ks is a sequence of keys. Returns nil if the key\r
is not present, or the not-found value if supplied."\r
  [m ks]\r
  (reduce #(get % %2) m ks))\r
\r
(defn some?\r
  "Returns true if x is not nil, false otherwise."\r
  [x]\r
  (not (nil? x)))\r
\r
(defn nthnext\r
  "Returns the nth next of coll, (seq coll) when n is 0."\r
  [coll n]\r
  (loop [n n xs (seq coll)]\r
    (if (and xs (pos? n))\r
      (recur (dec n) (next xs))\r
      xs)))\r
\r
(defn update\r
  "'Updates' a value in an associative structure, where k is a\r
key and f is a function that will take the old value\r
and any supplied args and return the new value, and returns a new\r
structure.  If the key does not exist, nil is passed as the old value."\r
  ([m k f]\r
   (assoc m k (f (get m k))))\r
  ([m k f x]\r
   (assoc m k (f (get m k) x)))\r
  ([m k f x y]\r
   (assoc m k (f (get m k) x y)))\r
  ([m k f x y z]\r
   (assoc m k (f (get m k) x y z)))\r
  ([m k f x y z & more]\r
   (assoc m k (apply f (get m k) x y z more))))\r
\r
(defn emit-for [bindings body-expr]\r
  (let [giter (gensym "iter__")\r
        gxs (gensym "s__")\r
        iterys# (gensym "iterys__")\r
        fs#     (gensym "fs__")\r
        ;; TODO: create named lambdas so won't need to do this\r
        do-mod (defn do-mod [mod]\r
                 (cond\r
                   (= (ffirst mod) :let) \`(let ~(second (first mod)) \r
                                            ~(do-mod (next mod)))\r
                   (= (ffirst mod) :while) \`(when ~(second (first mod)) \r
                                              ~(do-mod (next mod)))\r
                   (= (ffirst mod) :when) \`(if ~(second (first mod))\r
                                             ~(do-mod (next mod))\r
                                             (recur (rest ~gxs)))\r
                   (keyword?  (ffirst mod)) (throw (str "Invalid 'for' keyword " (ffirst mod)))\r
                   (next bindings)\r
                   \`(let [~iterys# ~(emit-for (next bindings) body-expr)\r
                          ~fs# (seq (~iterys# ~(second (first (next bindings)))))]\r
                      (if ~fs#\r
                        (concat ~fs# (~giter (rest ~gxs)))\r
                        (recur (rest ~gxs))))\r
                   :else \`(cons ~body-expr (~giter (rest ~gxs)))))]\r
    (if (next bindings)\r
      \`(defn ~giter [~gxs]\r
         (loop [~gxs ~gxs]\r
           (when-first [~(ffirst bindings) ~gxs]\r
             ~(do-mod (subvec (first bindings) 2)))))\r
      \`(defn ~giter [~gxs]\r
         (loop [~gxs ~gxs]\r
           (when-let [~gxs (seq ~gxs)]\r
             (let [~(ffirst bindings) (first ~gxs)]\r
               ~(do-mod (subvec (first bindings) 2)))))))))\r
\r
(defmacro for\r
  "List comprehension. Takes a vector of one or more\r
 binding-form/collection-expr pairs, each followed by zero or more\r
 modifiers, and yields a lazy sequence of evaluations of expr.\r
 Collections are iterated in a nested fashion, rightmost fastest,\r
 and nested coll-exprs can refer to bindings created in prior\r
 binding-forms.  Supported modifiers are: :let [binding-form expr ...],\r
 :while test, :when test. Example:\r
 (take 100 (for [x (range 100000000) y (range 1000000) :while (< y x)] [x y]))"\r
  [seq-exprs body-expr]\r
  (let [body-expr* body-expr\r
        iter#      (gensym)\r
        to-groups  (fn* [seq-exprs]\r
                        (reduce (fn* [groups kv]\r
                                     (if (keyword? (first kv))\r
                                       (conj (pop groups) \r
                                             (conj (peek groups) [(first kv) (last kv)]))\r
                                       (conj groups [(first kv) (last kv)])))\r
                                [] (partition 2 seq-exprs)))]\r
    \`(let [~iter# ~(emit-for (to-groups seq-exprs) body-expr)]\r
       (remove nil?\r
               (~iter# ~(second seq-exprs))))))\r
\r
(defn key\r
  "Returns the key of the map entry."\r
  [e]\r
  (first e))\r
\r
(defn val\r
  "Returns the value of the map entry."\r
  [e]\r
  (last e))\r
\r
(defn butlast\r
  "Return a seq of all but the last item in coll, in linear time"\r
  [s]\r
  (loop* [ret []\r
         s   s]\r
    (if (next s)\r
      (recur (conj ret (first s)) (next s))\r
      (seq ret))))\r
\r
(defn assoc-in\r
  "Associates a value in a nested associative structure, where ks is a\r
sequence of keys and v is the new value and returns a new nested structure.\r
If any levels do not exist, hash-maps will be created."\r
  [m ks v]\r
  (if (next ks)\r
    (assoc m (first ks) (assoc-in (get m (first ks)) (rest ks) v))\r
    (assoc m (first ks) v)))\r
\r
(defn str/includes?\r
  "Returns true if s includes substr."\r
  [s substr]\r
  (js-eval (str "'" s "'" ".includes(" "'" substr "'" ")")))\r
\r
(defn take-nth\r
  "Returns a seq of every nth item in coll."\r
  [n coll]\r
  (loop* [s coll res []]\r
    (if (empty? s) res\r
        (recur (drop n s) (conj res (first s))))))\r
\r
(defn namespace\r
  "Returns the namespace String of a symbol or keyword, or nil if not present."\r
  [x]\r
  (when (str/includes? x "/")\r
    (first (str/split (str x) "/"))))\r
\r
(defn name\r
  "Returns the name String of a string, symbol or keyword."\r
  [x]\r
  (if (keyword? x)\r
    (subs (str x) 1)\r
    (str x)))\r
\r
(defn comment\r
  "Ignores body, yields nil"\r
  [& forms])\r
\r
(defn pvec [bvec b val]\r
  (let [gvec (gensym "vec__")\r
        gseq (gensym "seq__")\r
        gfirst (gensym "first__")\r
        has-rest (some #{'&} b)]\r
        (loop* [ret (let [ret (conj bvec gvec val)]\r
                         (if has-rest\r
                           (conj ret gseq (list seq gvec))\r
                           ret))\r
               n 0\r
               bs b\r
               seen-rest? false]\r
          (if (seq bs)\r
            (let [firstb (first bs)]\r
                  (cond\r
                    (= firstb '&) (recur (pb ret (second bs) gseq)\r
                                         n\r
                                         (nnext bs)\r
                                         true)\r
                    (= firstb :as) (pb ret (second bs) gvec)\r
                    :else (if seen-rest?\r
                            (throw "Unsupported binding form, only :as can follow & parameter")\r
                            (recur (pb (if has-rest\r
                                         (conj ret\r
                                               gfirst \`(~first ~gseq)\r
                                               gseq \`(~next ~gseq))\r
                                         ret)\r
                                       firstb\r
                                       (if has-rest\r
                                         gfirst\r
                                         (list 'nth gvec n nil)))\r
                                   (inc n)\r
                                   (next bs)\r
                                   seen-rest?))))\r
            ret))))\r
\r
(defn pmap [bvec b v]\r
  (let* [gmap (gensym "map__")\r
         defaults (:or b)]\r
        (loop* [ret (-> bvec (conj gmap) (conj v)\r
                       (conj gmap) (conj gmap)\r
                       ((fn* [ret]\r
                          (if (:as b)\r
                            (conj ret (:as b) gmap)\r
                            ret))))\r
               bes (let* [transforms\r
                          (reduce\r
                           (fn* [transforms mk]\r
                             (if (keyword? mk)\r
                               (let* [mkns (namespace mk)\r
                                      mkn (name mk)]\r
                                     (cond (= mkn "keys") (assoc transforms mk (fn* [k] (keyword (or mkns (namespace k)) (name k))))\r
                                           (= mkn "syms") (assoc transforms mk (fn* [k] (list \`quote (symbol (or mkns (namespace k)) (name k)))))\r
                                           (= mkn "strs") (assoc transforms mk str)\r
                                           :else transforms))\r
                               transforms))\r
                           {}\r
                           (keys b))]\r
                         (reduce\r
                          (fn* [bes entry] (reduce (fn* [a b] (assoc a b ((val entry) b))) (dissoc bes (key entry)) (get bes (key entry))))\r
                          (dissoc b :as :or)\r
                          transforms))]\r
          bes\r
          (if (seq bes)\r
            (let* [bb (key (first bes))\r
                   bk (val (first bes))\r
                   local bb\r
                   bv (if (contains? defaults local)\r
                        (list \`get gmap bk (get defaults local))\r
                        (list \`get gmap bk))]\r
                  (recur\r
                   (if (or (keyword? bb) (symbol? bb))\r
                     (-> ret (conj local bv))\r
                     (pb ret bb bv))\r
                   (next bes)))\r
            ret))))\r
\r
(defn pb [bvec b v]\r
  (cond\r
    (symbol? b) (-> bvec (conj (if (namespace b)\r
                                 (symbol (name b)) b)) (conj v))\r
    (keyword? b) (-> bvec (conj (symbol (name b))) (conj v))\r
    (vector? b) (pvec bvec b v)\r
    (map? b) (pmap bvec b v)\r
    :else (throw (str "Unsupported binding form: " b))))\r
\r
(defn destructure\r
  "Takes a binding form and outputs bindings with all destructuring forms expanded."\r
  [bindings]\r
  (let* [bents (partition 2 bindings)\r
         process-entry (fn* [bvec b] (pb bvec (first b) (second b)))]\r
        (if (every? symbol? (map first bents))\r
          bindings\r
          (if-let [kwbs (seq (filter #(keyword? (first %)) bents))]\r
            (throw (str "Unsupported binding key: " (ffirst kwbs)))\r
            (reduce process-entry [] bents)))))\r
\r
(defmacro let\r
    "Evaluates the exprs in a lexical context in which the symbols in\r
  the binding-forms are bound to their respective init-exprs or parts\r
  therein."\r
  [bindings & body]\r
  \`(let* ~(destructure bindings) ~@body))\r
\r
(defmacro loop\r
  "Evaluates the exprs in a lexical context in which the symbols in\r
the binding-forms are bound to their respective init-exprs or parts\r
therein. Acts as a recur target."\r
  [bindings & body]\r
  (let [db (destructure bindings)]\r
    (if (= db bindings)\r
      \`(loop* ~bindings ~@body)\r
      (let [vs (take-nth 2 (drop 1 bindings))\r
            bs (take-nth 2 bindings)\r
            gs (map (fn [b] (if (symbol? b) b (gensym))) bs)\r
            bfs (reduce (fn [ret [b v g]]\r
                           (if (symbol? b)\r
                             (conj ret g v)\r
                             (conj ret g v b g)))\r
                         [] (map vector bs vs gs))]\r
        \`(let ~bfs\r
           (loop* ~(vec (interleave gs gs))\r
                  (let ~(vec (interleave bs gs))\r
                    ~@body)))))))\r
\r
(defn maybe-destructured [params body]\r
  (if (every? symbol? params)\r
    (cons params body)\r
    (loop* [params params\r
           new-params (with-meta [] (meta params))\r
           lets []]\r
      (if params\r
        (if (symbol? (first params))\r
          (recur (next params) (conj new-params (first params)) lets)\r
          (let [gparam (gensym "p__")]\r
            (recur (next params) (conj new-params gparam)\r
                   (-> lets (conj (first params)) (conj gparam)))))\r
        \`(~new-params\r
          (let ~lets\r
            ~@body))))))\r
\r
;redefine fn with destructuring\r
(defmacro fn\r
  "Defines a function."\r
  [& sigs]\r
  (let [name (if (symbol? (first sigs)) (first sigs) nil)\r
        sigs (if name (next sigs) sigs)\r
        sigs (if (vector? (first sigs))\r
               (list sigs)\r
               (if (seq? (first sigs))\r
                 sigs\r
                 (throw (if (seq sigs)\r
                          (str "Parameter declaration "\r
                               (first sigs)\r
                               " should be a vector")\r
                          (str "Parameter declaration missing")))))\r
        psig (fn* [sig]\r
                  (let [[params & body] sig]\r
                    (maybe-destructured params body)))\r
        new-sigs (map psig sigs)]\r
    (if name\r
      (list* 'fn* name new-sigs)\r
      (cons 'fn* new-sigs))))\r
\r
(defmacro cond->\r
  "Takes an expression and a set of test/form pairs. Threads expr (via ->)\r
through each form for which the corresponding test\r
expression is true. Note that, unlike cond branching, cond-> threading does\r
not short circuit after the first true test expression."\r
  [expr & clauses]\r
  (let [g (gensym)\r
        steps (map (fn [[test step]] \`(if ~test (-> ~g ~step) ~g))\r
                   (partition 2 clauses))]\r
    \`(let [~g ~expr\r
           ~@(interleave (repeat (count clauses) g) (butlast steps))]\r
       ~(if (empty? steps)\r
          g\r
          (last steps)))))\r
\r
(defmacro cond->>\r
  "Takes an expression and a set of test/form pairs. Threads expr (via ->>)\r
through each form for which the corresponding test expression\r
is true.  Note that, unlike cond branching, cond->> threading does not short circuit\r
after the first true test expression."\r
  [expr & clauses]\r
  (let [g (gensym)\r
        steps (map (fn [[test step]] \`(if ~test (->> ~g ~step) ~g))\r
                   (partition 2 clauses))]\r
    \`(let [~g ~expr\r
           ~@(interleave (repeat (count clauses) g) (butlast steps))]\r
       ~(if (empty? steps)\r
          g\r
          (last steps)))))\r
\r
(defn update-in* [m ks f args]\r
  (let [[k & ks] ks]\r
    (if ks\r
      (assoc m k (update-in* (get m k) ks f args))\r
      (assoc m k (apply f (get m k) args)))))\r
\r
(defn update-in\r
  "'Updates' a value in a nested associative structure, where ks is a\r
sequence of keys and f is a function that will take the old value\r
and any supplied args and return the new value, and returns a new\r
nested structure.  If any levels do not exist, hash-maps will be\r
created."\r
  ([m ks f & args]\r
     (update-in* m ks f args)))\r
\r
(defmacro condp\r
  "Takes a binary predicate, an expression, and a set of clauses.\r
   For each clause, (pred test-expr expr) is evaluated. If it returns\r
logical true, the clause is a match. If a binary clause matches, the\r
result-expr is returned, if a ternary clause matches, its result-fn,\r
which must be a unary function, is called with the result of the\r
predicate as its argument, the result of that call being the return\r
value of condp. A single default expression can follow the clauses,\r
and its value will be returned if no clause matches. If no default\r
expression is provided and no clause matches, an exception is thrown."\r
  [pred expr & clauses]\r
  (let [gpred (gensym "pred__")\r
        gexpr (gensym "expr__")\r
        emit-condp (defn emit-condp [pred expr args]\r
               (let [[[a b c :as clause] more]\r
                     (split-at (if (= :>> (second args)) 3 2) args)\r
                     n (count clause)]\r
                 (cond\r
                   (= 0 n) \`(throw (str "No matching clause: " ~expr))\r
                   (= 1 n) a\r
                   (= 2 n) \`(if (~pred ~a ~expr)\r
                              ~b\r
                              ~(emit-condp pred expr more))\r
                   :else \`(if-let [p# (~pred ~a ~expr)]\r
                            (~c p#)\r
                            ~(emit-condp pred expr more)))))]\r
    \`(let [~gpred ~pred\r
           ~gexpr ~expr]\r
       ~(emit-condp gpred gexpr clauses))))\r
\r
(defn Math/log\r
  "Returns the natural logarithm (base e) of a number."\r
  [n]\r
  (js-eval (str "Math.log(" n ")")))\r
\r
(def Integer/MIN_VALUE\r
  (js-eval "Number.MIN_VALUE"))\r
\r
(def Integer/MAX_VALUE\r
  (js-eval "Number.MAX_VALUE"))\r
\r
(defn bit-shift-left\r
  "Bitwise shift left"\r
  [x n]\r
  (js-eval (str x " << " n)))\r
\r
(defn bit-shift-right\r
  "Bitwise shift right"\r
  [x n]\r
  (js-eval (str x " >> " n)))\r
\r
(defn bit-test\r
  "Test bit at index n"\r
  [x n]\r
  (js-eval (str "((" x " >> " n ") % 2 != 0)")))\r
\r
(defn bit-set\r
  "Set bit at index n"\r
  [x n]\r
  (js-eval (str x " | 1 << " n)))\r
\r
(defn bit-clear\r
  "Clear bit at index n"\r
  [x n]\r
  (js-eval (str x " & ~(1 << " n ")")))\r
\r
(defn bit-flip\r
  "Flip bit at index n"\r
  [x n]\r
  (if (bit-test x n)\r
    (bit-clear x n)\r
    (bit-set x n)))\r
\r
(defn bit-and\r
  "Bitwise and"\r
  [x y]\r
  (js-eval (str x " & " y)))\r
\r
(defn str/starts-with?\r
  "Returns true if s starts with substr."\r
  [s substr]\r
  (js-eval (str "'" s "'" ".startsWith ('" substr "')")))\r
\r
\r
(defn <\r
  "Returns non-nil if nums are in monotonically increasing order,\r
  otherwise false."\r
  ([x] true)\r
  ([x y] (lt x y))\r
  ([x y & more]\r
   (if (< x y)\r
     (if (next more)\r
       (recur y (first more) (next more))\r
       (< y (first more)))\r
     false)))\r
\r
(defn <=\r
  "Returns non-nil if nums are in monotonically non-decreasing order,\r
  otherwise false."\r
  ([x] true)\r
  ([x y] (lte x y))\r
  ([x y & more]\r
   (if (<= x y)\r
     (if (next more)\r
       (recur y (first more) (next more))\r
       (<= y (first more)))\r
     false)))\r
\r
\r
(defn >\r
  "Returns non-nil if nums are in monotonically decreasing order,\r
  otherwise false."\r
  ([x] true)\r
  ([x y] (gt x y))\r
  ([x y & more]\r
   (if (> x y)\r
     (if (next more)\r
       (recur y (first more) (next more))\r
       (> y (first more)))\r
     false)))\r
\r
(defn >=\r
  "Returns non-nil if nums are in monotonically non-increasing order,\r
  otherwise false."\r
  ([x] true)\r
  ([x y] (gte x y))\r
  ([x y & more]\r
   (if (>= x y)\r
     (if (next more)\r
       (recur y (first more) (next more))\r
       (>= y (first more)))\r
     false)))`,pprint=`(ns pprint {:clj-kondo/ignore true})\r
\r
(defn spaces- [indent]\r
     (if (> indent 0)\r
       (str " " (spaces- (dec indent)))\r
       ""))\r
\r
(defn pp-seq- [obj indent]\r
  ;; set char length threshold for newlines\r
  (if (> (count (str obj)) 65)\r
    (apply str (pp- (first obj) 0)\r
           (map (fn [x] (str "\\n" (spaces- (inc indent))\r
                             (pp- x (inc indent))))\r
                (rest obj)))\r
    (apply str (pp- (first obj) 0)\r
           (map (fn [x] (str " " (pp- x (inc indent))))\r
                (rest obj)))))\r
\r
;; old pp-seq function\r
#_(defn pp-seq- [obj indent]\r
  (apply str (pp- (first obj) 0)\r
         (map (fn [x] (str "\\n" (spaces- (inc indent))\r
                           (pp- x (inc indent))))\r
              (rest obj))))\r
\r
(defn pp-map- [obj indent]\r
     (let* [ks (keys obj)\r
            kindent (+ 1 indent)\r
            kwidth (count (seq (str (first ks))))\r
            vindent (+ 1 (+ kwidth kindent))]\r
           (apply str (pp- (first ks) 0)\r
                  " "\r
                  (pp- (get obj (first ks)) 0)\r
                  (map (fn [k] (str "\\n" (spaces- kindent)\r
                                     (pp- k kindent)\r
                                     " "\r
                                     (pp- (get obj k) vindent)))\r
                       (rest (keys obj))))))\r
\r
(defn pp- [obj indent]\r
  (do #_(console-print "[pp-]" obj)\r
      (cond\r
        (= "" obj) "\\"\\""\r
        (empty? obj) (str obj)\r
        (list? obj)   \r
        (do #_(console-print "[pp-]" "list" obj)\r
         (str "(" (pp-seq- obj indent) ")"))\r
        (vector? obj) \r
        (do #_(console-print "[pp-]" "vector" obj)\r
         (str "[" (pp-seq- obj indent) "]"))\r
        (set? obj) (str "#{" (pp-seq- obj indent) "}")\r
        (map? obj)    (str "{" (pp-map- obj indent) "}")\r
        :else         (pr-str obj))))\r
\r
(defn pprint [obj]\r
  (if (nil? obj) "nil"\r
      (do #_(console-print "[pprint]" obj)\r
          (cond \r
            (= "" obj) "\\"\\""\r
            (empty? obj) (str obj)\r
            :else (pp- obj 0)))))`,simLispy=`(ns simlispy.core {:clj-kondo/ignore true})\r
\r
(defn isometric->screen [x y]\r
   [(* (- x y)  (/ 1 2))\r
    (* (+ x y)  (/ 1 4))])\r
\r
 (defn make-path [points]\r
   (str "M" (apply str (interpose " " points))))\r
\r
(def ground-tile-1 [["#694518" "M27 1h1M25 2h3M23 3h2M27 3h1M21 4h3M27 4h1M22 5h2M27 5h1M22 6h2M27 6h1M15 7h2M22 7h2M27 7h1M13 8h15M15 9h4M24 9h1M27 9h1M9 10h1M15 10h4M24 10h1M27 10h1M7 11h3M15 11h2M24 11h1M27 11h1M5 12h5M15 12h2M24 12h1M27 12h1M3 13h2M9 13h8M22 13h6M1 14h1M9 14h1M15 14h7M27 14h1M0 15h2M9 15h1M15 15h7M27 15h1M0 16h2M7 16h3M15 16h7M27 16h1M0 17h2M7 17h3M15 17h7M27 17h1M0 18h7M10 18h5M17 18h2M22 18h6M0 19h2M5 19h2M12 19h2M17 19h2M24 19h1M27 19h1M0 20h2M5 20h2M12 20h2M17 20h2M24 20h1M27 20h1M0 21h2M5 21h2M12 21h2M17 21h2M24 21h4M0 22h2M5 22h2M12 22h2M17 22h2M24 22h4M0 23h7M10 23h15M27 23h1M0 24h2M7 24h5M17 24h2M22 24h2M27 24h1M0 25h2M7 25h5M17 25h2M22 25h2M27 25h1M0 26h2M5 26h2M10 26h2M15 26h2M22 26h2M27 26h1M0 27h2M5 27h2M10 27h2M15 27h2M22 27h2M27 27h1M0 28h7M10 28h2M14 28h14M0 29h4M7 29h3M15 29h4M24 29h1M27 29h1M0 30h4M7 30h3M15 30h4M24 30h1M27 30h1M0 31h2M7 31h3M15 31h2M24 31h1M27 31h1M0 32h5M9 32h8M22 32h6M0 33h5M9 33h8M22 33h6M0 34h2M9 34h1M15 34h7M27 34h1M0 35h2M9 35h1M15 35h7M27 35h1M0 36h2M7 36h3M15 36h7M27 36h1M0 37h7M10 37h5M17 37h2M22 37h6M0 38h7M10 38h5M17 38h2M22 38h6M0 39h2M5 39h2M12 39h2M17 39h2M24 39h1M27 39h1M0 40h2M5 40h2M12 40h2M17 40h2M24 40h1M27 40h1M0 41h2M5 41h2M12 41h2M17 41h2M24 41h4M0 42h7M10 42h15M27 42h1M0 43h7M10 43h15M27 43h1M0 44h2M7 44h5M17 44h2M22 44h2M27 44h1M0 45h2M7 45h5M17 45h2M22 45h2M27 45h1M0 46h2M5 46h2M10 46h2M15 46h2M22 46h2M27 46h1M0 47h7M10 47h2M14 47h14M0 48h7M10 48h2M14 48h14M0 49h4M7 49h3M15 49h4M24 49h1M27 49h1M0 50h4M7 50h3M15 50h4M24 50h1M27 50h1M0 51h2M7 51h3M15 51h2M24 51h1M27 51h1M0 52h5M9 52h8M22 52h6M0 53h5M9 53h8M22 53h6M0 54h2M9 54h1M15 54h7M27 54h1M0 55h2M9 55h1M15 55h7M27 55h1M0 56h2M7 56h3M15 56h7M27 56h1M0 57h7M10 57h5M17 57h2M22 57h6M0 58h7M10 58h5M17 58h2M22 58h6M0 59h2M5 59h2M12 59h2M17 59h2M24 59h1M27 59h1M0 60h2M5 60h2M12 60h2M17 60h2M24 60h1M27 60h1M0 61h2M5 61h2M12 61h2M17 61h2M24 61h4M0 62h7M10 62h15M27 62h1M0 63h7M10 63h15M27 63h1M0 64h2M7 64h5M17 64h2M22 64h2M27 64h1M0 65h2M7 65h5M17 65h2M22 65h2M27 65h1M0 66h2M5 66h2M10 66h2M15 66h2M22 66h2M27 66h1M0 67h7M10 67h2M14 67h14M0 68h7M10 68h2M14 68h14M0 69h4M7 69h3M15 69h4M24 69h1M27 69h1M0 70h4M7 70h3M15 70h4M24 70h1M27 70h1M0 71h2M7 71h3M15 71h2M24 71h1M27 71h1M0 72h5M9 72h8M22 72h6M0 73h5M9 73h8M22 73h6M0 74h2M9 74h1M15 74h7M27 74h1M0 75h2M9 75h1M15 75h7M27 75h1M0 76h2M7 76h3M15 76h7M27 76h1M0 77h7M10 77h5M17 77h2M22 77h6M0 78h7M10 78h5M17 78h2M22 78h6M0 79h2M5 79h2M12 79h2M17 79h2M24 79h1M27 79h1M0 80h2M5 80h2M12 80h2M17 80h2M24 80h1M27 80h1M0 81h2M5 81h2M12 81h2M17 81h2M24 81h4M0 82h7M10 82h15M27 82h1M0 83h7M10 83h15M27 83h1M0 84h2M7 84h5M17 84h2M22 84h2M27 84h1M0 85h2M5 85h2M10 85h2M15 85h2M22 85h2M27 85h1M0 86h2M5 86h2M10 86h2M15 86h2M22 86h2M27 86h1M0 87h7M10 87h2M14 87h14M0 88h7M10 88h2M14 88h14M0 89h4M7 89h3M15 89h4M24 89h1M27 89h1M0 90h2M7 90h3M15 90h2M24 90h1M27 90h1M0 91h2M7 91h3M15 91h2M24 91h1M27 91h1M0 92h5M9 92h8M22 92h6M0 93h5M9 93h8M22 93h6M0 94h2M9 94h1M15 94h7M27 94h1M0 95h2M7 95h3M15 95h7M27 95h1M0 96h2M7 96h3M15 96h7M27 96h1M0 97h7M10 97h5M17 97h2M22 97h6M0 98h7M10 98h5M17 98h2M22 98h6M0 99h2M5 99h2M12 99h2M17 99h2M24 99h1M27 99h1M0 100h2M5 100h2M12 100h2M17 100h2M24 100h4M0 101h2M5 101h2M12 101h2M17 101h2M24 101h4M0 102h7M10 102h15M27 102h1M0 103h7M10 103h15M27 103h1M0 104h2M7 104h5M17 104h2M22 104h2M27 104h1M0 105h2M5 105h2M10 105h2M15 105h2M22 105h2M27 105h1M0 106h2M5 106h2M10 106h2M15 106h2M22 106h2M27 106h1M0 107h7M10 107h2M14 107h14M0 108h7M10 108h2M14 108h14M0 109h4M7 109h3M15 109h4M24 109h1M27 109h1M0 110h2M7 110h3M15 110h2M24 110h1M27 110h1M0 111h2M7 111h3M15 111h2M24 111h1M27 111h1M0 112h5M9 112h8M22 112h6M0 113h5M9 113h8M22 113h6M0 114h2M9 114h1M15 114h7M27 114h1M0 115h2M7 115h3M15 115h7M27 115h1M0 116h2M7 116h3M15 116h7M27 116h1M0 117h7M10 117h5M17 117h2M22 117h6M0 118h7M10 118h5M17 118h2M22 118h6M0 119h2M5 119h2M12 119h2M17 119h2M24 119h1M27 119h1M0 120h2M5 120h2M12 120h2M17 120h2M24 120h4M0 121h2M5 121h2M12 121h2M17 121h2M24 121h4M0 122h7M10 122h15M27 122h1M0 123h7M10 123h15M27 123h1M0 124h2M7 124h5M17 124h2M22 124h2M27 124h1M0 125h2M5 125h2M10 125h2M15 125h2M22 125h2M27 125h1M0 126h2M5 126h2M10 126h2M15 126h2M22 126h2M27 126h1M0 127h7M10 127h2M14 127h14M0 128h7M10 128h2M14 128h14M0 129h4M7 129h3M15 129h4M24 129h1M27 129h1M0 130h2M7 130h3M15 130h2M24 130h1M27 130h1M0 131h2M7 131h3M15 131h2M24 131h1M27 131h1M0 132h5M9 132h8M22 132h6M0 133h5M9 133h8M22 133h6M0 134h2M9 134h1M15 134h7M27 134h1M0 135h2M7 135h3M15 135h7M27 135h1M0 136h2M7 136h3M15 136h7M27 136h1M0 137h7M10 137h5M17 137h2M22 137h6M0 138h2M5 138h2M12 138h2M17 138h2M24 138h1M27 138h1M0 139h2M5 139h2M12 139h2M17 139h2M24 139h1M27 139h1M0 140h2M5 140h2M12 140h2M17 140h2M24 140h4M0 141h2M5 141h2M12 141h2M17 141h2M24 141h4M0 142h7M10 142h15M27 142h1M0 143h2M7 143h5M17 143h2M22 143h2M27 143h1M0 144h2M7 144h5M17 144h2M22 144h2M27 144h1M0 145h2M5 145h2M10 145h2M15 145h2M22 145h2M27 145h1M0 146h2M5 146h2M10 146h2M15 146h2M22 146h2M27 146h1M0 147h7M10 147h2M14 147h14M0 148h4M7 148h3M15 148h4M24 148h1M27 148h1M0 149h4M7 149h3M15 149h4M24 149h1M27 149h1M0 150h2M7 150h3M15 150h2M24 150h1M27 150h1M0 151h2M7 151h3M15 151h2M24 151h1M27 151h1M0 152h5M9 152h8M22 152h6M0 153h2M9 153h1M15 153h7M27 153h1M0 154h2M9 154h1M15 154h7M27 154h1M0 155h2M7 155h3M15 155h7M27 155h1M0 156h2M7 156h3M15 156h7M27 156h1M0 157h7M10 157h5M17 157h2M22 157h6M0 158h2M5 158h2M12 158h2M17 158h2M24 158h1M27 158h1M0 159h2M5 159h2M12 159h2M17 159h2M24 159h1M27 159h1M0 160h2M5 160h2M12 160h2M17 160h2M24 160h1M0 161h2M5 161h2M12 161h2M17 161h2M24 161h1M0 162h7M10 162h12M0 163h2M7 163h5M17 163h2M0 164h2M7 164h5M17 164h2M0 165h2M5 165h2M10 165h2M0 166h2M5 166h2M10 166h2M0 167h7M10 167h2M0 168h4M7 168h2M0 169h4M7 169h2M0 170h2M0 171h2M0 172h2"] ["#8e8e8e" "M25 3h2M24 4h1M24 5h1M18 6h2M25 6h2M17 7h3M25 7h2M14 9h1M19 9h1M10 10h2M14 10h1M19 10h1M10 11h5M17 11h2M20 11h2M25 11h2M10 12h5M17 12h2M20 12h2M25 12h2M5 13h2M17 13h3M2 14h2M5 14h2M10 14h2M14 14h1M22 14h2M25 14h2M2 15h2M5 15h2M10 15h2M14 15h1M22 15h2M25 15h2M2 16h3M10 16h4M24 16h3M2 17h3M10 17h4M24 17h3M7 18h2M15 18h2M19 18h1M4 19h1M9 19h1M14 19h1M25 19h2M4 20h1M9 20h1M14 20h1M25 20h2M2 21h3M9 21h1M14 21h3M19 21h5M2 22h3M9 22h1M14 22h3M19 22h5M25 23h2M5 24h2M12 24h2M15 24h2M24 24h1M5 25h2M12 25h2M15 25h2M24 25h1M2 26h3M9 26h1M12 26h3M17 26h3M25 26h2M2 27h3M9 27h1M12 27h3M17 27h3M25 27h2M7 28h3M5 29h2M10 29h2M14 29h1M19 29h1M5 30h2M10 30h2M14 30h1M19 30h1M2 31h3M10 31h5M17 31h2M20 31h2M25 31h2M5 32h2M17 32h3M5 33h2M17 33h3M2 34h2M5 34h2M10 34h2M14 34h1M22 34h2M25 34h2M2 35h2M5 35h2M10 35h2M14 35h1M22 35h2M25 35h2M2 36h3M10 36h4M24 36h3M7 37h2M15 37h2M19 37h1M7 38h2M15 38h2M19 38h1M4 39h1M9 39h1M14 39h1M25 39h2M4 40h1M9 40h1M14 40h1M25 40h2M2 41h3M9 41h1M14 41h3M19 41h5M25 42h2M25 43h2M5 44h2M12 44h2M15 44h2M24 44h1M5 45h2M12 45h2M15 45h2M24 45h1M2 46h3M9 46h1M12 46h3M17 46h3M25 46h2M7 47h3M7 48h3M5 49h2M10 49h2M14 49h1M19 49h1M5 50h2M10 50h2M14 50h1M19 50h1M2 51h3M10 51h5M17 51h2M20 51h2M25 51h2M5 52h2M17 52h3M5 53h2M17 53h3M2 54h2M5 54h2M10 54h2M14 54h1M22 54h2M25 54h2M2 55h2M5 55h2M10 55h2M14 55h1M22 55h2M25 55h2M2 56h3M10 56h4M24 56h3M7 57h2M15 57h2M19 57h1M7 58h2M15 58h2M19 58h1M4 59h1M9 59h1M14 59h1M25 59h2M4 60h1M9 60h1M14 60h1M25 60h2M2 61h3M9 61h1M14 61h3M19 61h5M25 62h2M25 63h2M5 64h2M12 64h2M15 64h2M24 64h1M5 65h2M12 65h2M15 65h2M24 65h1M2 66h3M9 66h1M12 66h3M17 66h3M25 66h2M7 67h3M7 68h3M5 69h2M10 69h2M14 69h1M19 69h1M5 70h2M10 70h2M14 70h1M19 70h1M2 71h3M10 71h5M17 71h2M20 71h2M25 71h2M5 72h2M17 72h3M5 73h2M17 73h3M2 74h2M5 74h2M10 74h2M14 74h1M22 74h2M25 74h2M2 75h2M5 75h2M10 75h2M14 75h1M22 75h2M25 75h2M2 76h3M10 76h4M24 76h3M7 77h2M15 77h2M19 77h1M7 78h2M15 78h2M19 78h1M4 79h1M9 79h1M14 79h1M25 79h2M4 80h1M9 80h1M14 80h1M25 80h2M2 81h3M9 81h1M14 81h3M19 81h5M25 82h2M25 83h2M5 84h2M12 84h2M15 84h2M24 84h1M2 85h3M9 85h1M12 85h3M17 85h3M25 85h2M2 86h3M9 86h1M12 86h3M17 86h3M25 86h2M7 87h3M7 88h3M5 89h2M10 89h2M14 89h1M19 89h1M2 90h3M10 90h5M17 90h2M20 90h2M25 90h2M2 91h3M10 91h5M17 91h2M20 91h2M25 91h2M5 92h2M17 92h3M5 93h2M17 93h3M2 94h2M5 94h2M10 94h2M14 94h1M22 94h2M25 94h2M2 95h3M10 95h4M24 95h3M2 96h3M10 96h4M24 96h3M7 97h2M15 97h2M19 97h1M7 98h2M15 98h2M19 98h1M4 99h1M9 99h1M14 99h1M25 99h2M2 100h3M9 100h1M14 100h3M19 100h5M2 101h3M9 101h1M14 101h3M19 101h5M25 102h2M25 103h2M5 104h2M12 104h2M15 104h2M24 104h1M2 105h3M9 105h1M12 105h3M17 105h3M25 105h2M2 106h3M9 106h1M12 106h3M17 106h3M25 106h2M7 107h3M7 108h3M5 109h2M10 109h2M14 109h1M19 109h1M2 110h3M10 110h5M17 110h2M20 110h2M25 110h2M2 111h3M10 111h5M17 111h2M20 111h2M25 111h2M5 112h2M17 112h3M5 113h2M17 113h3M2 114h2M5 114h2M10 114h2M14 114h1M22 114h2M25 114h2M2 115h3M10 115h4M24 115h3M2 116h3M10 116h4M24 116h3M7 117h2M15 117h2M19 117h1M7 118h2M15 118h2M19 118h1M4 119h1M9 119h1M14 119h1M25 119h2M2 120h3M9 120h1M14 120h3M19 120h5M2 121h3M9 121h1M14 121h3M19 121h5M25 122h2M25 123h2M5 124h2M12 124h2M15 124h2M24 124h1M2 125h3M9 125h1M12 125h3M17 125h3M25 125h2M2 126h3M9 126h1M12 126h3M17 126h3M25 126h2M7 127h3M7 128h3M5 129h2M10 129h2M14 129h1M19 129h1M2 130h3M10 130h5M17 130h2M20 130h2M25 130h2M2 131h3M10 131h5M17 131h2M20 131h2M25 131h2M5 132h2M17 132h3M5 133h2M17 133h3M2 134h2M5 134h2M10 134h2M14 134h1M22 134h2M25 134h2M2 135h3M10 135h4M24 135h3M2 136h3M10 136h4M24 136h3M7 137h2M15 137h2M19 137h1M4 138h1M9 138h1M14 138h1M25 138h2M4 139h1M9 139h1M14 139h1M25 139h2M2 140h3M9 140h1M14 140h3M19 140h5M2 141h3M9 141h1M14 141h3M19 141h5M25 142h2M5 143h2M12 143h2M15 143h2M24 143h1M5 144h2M12 144h2M15 144h2M24 144h1M2 145h3M9 145h1M12 145h3M17 145h3M25 145h2M2 146h3M9 146h1M12 146h3M17 146h3M25 146h2M7 147h3M5 148h2M10 148h2M14 148h1M19 148h1M5 149h2M10 149h2M14 149h1M19 149h1M2 150h3M10 150h5M17 150h2M20 150h2M25 150h2M2 151h3M10 151h5M17 151h2M20 151h2M25 151h2M5 152h2M17 152h3M2 153h2M5 153h2M10 153h2M14 153h1M22 153h2M25 153h2M2 154h2M5 154h2M10 154h2M14 154h1M22 154h2M25 154h2M2 155h3M10 155h4M24 155h3M2 156h3M10 156h4M24 156h3M7 157h2M15 157h2M19 157h1M4 158h1M9 158h1M14 158h1M25 158h2M4 159h1M9 159h1M14 159h1M25 159h2M2 160h3M9 160h1M14 160h3M19 160h5M2 161h3M9 161h1M14 161h3M19 161h5M5 163h2M12 163h2M15 163h2M5 164h2M12 164h2M15 164h2M2 165h3M9 165h1M12 165h3M2 166h3M9 166h1M12 166h3M7 167h3M5 168h2M5 169h2M2 170h3M2 171h3"] ["#aaaaaa" "M25 4h2M25 5h2M12 9h2M20 9h2M25 9h2M12 10h2M20 10h2M25 10h2M19 11h1M19 12h1M4 14h1M12 14h2M24 14h1M4 15h1M12 15h2M24 15h1M2 19h2M7 19h2M15 19h2M19 19h3M2 20h2M7 20h2M15 20h2M19 20h3M7 21h2M7 22h2M2 24h3M14 24h1M25 24h2M2 25h3M14 25h1M25 25h2M7 26h2M7 27h2M4 29h1M12 29h2M20 29h2M25 29h2M4 30h1M12 30h2M20 30h2M25 30h2M19 31h1M4 34h1M12 34h2M24 34h1M4 35h1M12 35h2M24 35h1M2 39h2M7 39h2M15 39h2M19 39h3M2 40h2M7 40h2M15 40h2M19 40h3M7 41h2M2 44h3M14 44h1M25 44h2M2 45h3M14 45h1M25 45h2M7 46h2M4 49h1M12 49h2M20 49h2M25 49h2M4 50h1M12 50h2M20 50h2M25 50h2M19 51h1M4 54h1M12 54h2M24 54h1M4 55h1M12 55h2M24 55h1M2 59h2M7 59h2M15 59h2M19 59h3M2 60h2M7 60h2M15 60h2M19 60h3M7 61h2M2 64h3M14 64h1M25 64h2M2 65h3M14 65h1M25 65h2M7 66h2M4 69h1M12 69h2M20 69h2M25 69h2M4 70h1M12 70h2M20 70h2M25 70h2M19 71h1M4 74h1M12 74h2M24 74h1M4 75h1M12 75h2M24 75h1M2 79h2M7 79h2M15 79h2M19 79h3M2 80h2M7 80h2M15 80h2M19 80h3M7 81h2M2 84h3M14 84h1M25 84h2M7 85h2M7 86h2M4 89h1M12 89h2M20 89h2M25 89h2M19 90h1M19 91h1M4 94h1M12 94h2M24 94h1M2 99h2M7 99h2M15 99h2M19 99h3M7 100h2M7 101h2M2 104h3M14 104h1M25 104h2M7 105h2M7 106h2M4 109h1M12 109h2M20 109h2M25 109h2M19 110h1M19 111h1M4 114h1M12 114h2M24 114h1M2 119h2M7 119h2M15 119h2M19 119h3M7 120h2M7 121h2M2 124h3M14 124h1M25 124h2M7 125h2M7 126h2M4 129h1M12 129h2M20 129h2M25 129h2M19 130h1M19 131h1M4 134h1M12 134h2M24 134h1M2 138h2M7 138h2M15 138h2M19 138h3M2 139h2M7 139h2M15 139h2M19 139h3M7 140h2M7 141h2M2 143h3M14 143h1M25 143h2M2 144h3M14 144h1M25 144h2M7 145h2M7 146h2M4 148h1M12 148h2M20 148h2M25 148h2M4 149h1M12 149h2M20 149h2M25 149h2M19 150h1M19 151h1M4 153h1M12 153h2M24 153h1M4 154h1M12 154h2M24 154h1M2 158h2M7 158h2M15 158h2M19 158h3M2 159h2M7 159h2M15 159h2M19 159h3M7 160h2M7 161h2M2 163h3M14 163h1M2 164h3M14 164h1M7 165h2M7 166h2M4 168h1M4 169h1"] ["#656565" "M19 5h3M17 6h1M20 6h2M24 6h1M20 7h2M24 7h1M11 9h1M22 9h2M22 10h2M22 11h2M22 12h2M7 13h2M20 13h2M7 14h2M7 15h2M5 16h2M14 16h1M22 16h2M5 17h2M14 17h1M22 17h2M9 18h1M20 18h2M10 19h2M22 19h2M10 20h2M22 20h2M10 21h2M10 22h2M7 23h3M19 24h3M19 25h3M20 26h2M24 26h1M20 27h2M24 27h1M12 28h2M22 29h2M22 30h2M5 31h2M22 31h2M7 32h2M20 32h2M7 33h2M20 33h2M7 34h2M7 35h2M5 36h2M14 36h1M22 36h2M9 37h1M20 37h2M9 38h1M20 38h2M10 39h2M22 39h2M10 40h2M22 40h2M10 41h2M7 42h3M7 43h3M19 44h3M19 45h3M20 46h2M24 46h1M12 47h2M12 48h2M22 49h2M22 50h2M5 51h2M22 51h2M7 52h2M20 52h2M7 53h2M20 53h2M7 54h2M7 55h2M5 56h2M14 56h1M22 56h2M9 57h1M20 57h2M9 58h1M20 58h2M10 59h2M22 59h2M10 60h2M22 60h2M10 61h2M7 62h3M7 63h3M19 64h3M19 65h3M20 66h2M24 66h1M12 67h2M12 68h2M22 69h2M22 70h2M5 71h2M22 71h2M7 72h2M20 72h2M7 73h2M20 73h2M7 74h2M7 75h2M5 76h2M14 76h1M22 76h2M9 77h1M20 77h2M9 78h1M20 78h2M10 79h2M22 79h2M10 80h2M22 80h2M10 81h2M7 82h3M7 83h3M19 84h3M20 85h2M24 85h1M20 86h2M24 86h1M12 87h2M12 88h2M22 89h2M5 90h2M22 90h2M5 91h2M22 91h2M7 92h2M20 92h2M7 93h2M20 93h2M7 94h2M5 95h2M14 95h1M22 95h2M5 96h2M14 96h1M22 96h2M9 97h1M20 97h2M9 98h1M20 98h2M10 99h2M22 99h2M10 100h2M10 101h2M7 102h3M7 103h3M19 104h3M20 105h2M24 105h1M20 106h2M24 106h1M12 107h2M12 108h2M22 109h2M5 110h2M22 110h2M5 111h2M22 111h2M7 112h2M20 112h2M7 113h2M20 113h2M7 114h2M5 115h2M14 115h1M22 115h2M5 116h2M14 116h1M22 116h2M9 117h1M20 117h2M9 118h1M20 118h2M10 119h2M22 119h2M10 120h2M10 121h2M7 122h3M7 123h3M19 124h3M20 125h2M24 125h1M20 126h2M24 126h1M12 127h2M12 128h2M22 129h2M5 130h2M22 130h2M5 131h2M22 131h2M7 132h2M20 132h2M7 133h2M20 133h2M7 134h2M5 135h2M14 135h1M22 135h2M5 136h2M14 136h1M22 136h2M9 137h1M20 137h2M10 138h2M22 138h2M10 139h2M22 139h2M10 140h2M10 141h2M7 142h3M19 143h3M19 144h3M20 145h2M24 145h1M20 146h2M24 146h1M12 147h2M22 148h2M22 149h2M5 150h2M22 150h2M5 151h2M22 151h2M7 152h2M20 152h2M7 153h2M7 154h2M5 155h2M14 155h1M22 155h2M5 156h2M14 156h1M22 156h2M9 157h1M20 157h2M10 158h2M22 158h2M10 159h2M22 159h2M10 160h2M10 161h2M7 162h3M19 163h1M19 164h1M12 167h2M5 170h2M5 171h1"]])\r
(def ground-tile-2 [["#411c04" "M0 3h2M0 4h2M3 4h1M0 5h2M0 6h6M0 7h6M9 7h1M0 8h1M4 8h2M9 8h2M0 9h1M6 9h5M0 10h1M6 10h5M0 11h6M9 11h9M0 12h6M9 12h11M0 13h1M4 13h2M11 13h1M16 13h1M0 14h1M4 14h2M11 14h1M16 14h1M22 14h3M0 15h1M4 15h2M11 15h1M16 15h1M22 15h2M0 16h6M9 16h5M16 16h1M21 16h4M0 17h6M9 17h5M16 17h1M21 17h4M0 18h1M4 18h5M12 18h10M0 19h1M6 19h3M14 19h7M0 20h1M6 20h3M14 20h7M0 21h4M6 21h10M19 21h6M0 22h4M6 22h10M19 22h6M0 23h1M4 23h5M14 23h2M22 23h2M0 24h2M6 24h5M14 24h3M22 24h2M0 25h2M6 25h5M14 25h3M22 25h2M0 26h6M11 26h14M0 27h6M11 27h14M0 28h1M4 28h2M9 28h2M14 28h3M21 28h3M0 29h1M6 29h5M17 29h5M0 30h1M6 30h5M17 30h5M0 31h6M9 31h8M21 31h3M0 32h1M4 32h2M11 32h1M16 32h1M24 32h1M0 33h1M4 33h2M11 33h1M16 33h1M24 33h1M0 34h1M4 34h2M11 34h1M16 34h1M22 34h2M0 35h1M4 35h2M11 35h1M16 35h1M22 35h2M0 36h6M9 36h5M16 36h1M21 36h4M0 37h1M4 37h5M12 37h10M0 38h1M4 38h5M12 38h10M0 39h1M6 39h3M14 39h7M0 40h1M6 40h3M14 40h7M0 41h4M6 41h10M19 41h6M0 42h1M4 42h5M14 42h2M22 42h2M0 43h1M4 43h5M14 43h2M22 43h2M0 44h2M6 44h5M14 44h3M22 44h2M0 45h2M6 45h5M14 45h3M22 45h2M0 46h6M11 46h14M0 47h1M4 47h2M9 47h2M14 47h3M21 47h3M0 48h1M4 48h2M9 48h2M14 48h3M21 48h3M0 49h1M6 49h5M17 49h5M0 50h1M6 50h5M17 50h5M0 51h6M9 51h8M21 51h3M0 52h1M4 52h2M11 52h1M16 52h1M24 52h1M0 53h1M4 53h2M11 53h1M16 53h1M24 53h1M0 54h1M4 54h2M11 54h1M16 54h1M22 54h2M0 55h1M4 55h2M11 55h1M16 55h1M22 55h2M0 56h6M9 56h5M16 56h1M21 56h4M0 57h1M4 57h5M12 57h10M0 58h1M4 58h5M12 58h10M0 59h1M6 59h3M14 59h7M0 60h1M6 60h3M14 60h7M0 61h4M6 61h10M19 61h6M0 62h1M4 62h5M14 62h2M22 62h2M0 63h1M4 63h5M14 63h2M22 63h2M0 64h2M6 64h5M14 64h3M22 64h2M0 65h2M6 65h5M14 65h3M22 65h2M0 66h6M11 66h14M0 67h1M4 67h2M9 67h2M14 67h3M21 67h3M0 68h1M4 68h2M9 68h2M14 68h3M21 68h3M0 69h1M6 69h5M17 69h5M0 70h1M6 70h5M17 70h5M0 71h6M9 71h8M21 71h3M0 72h1M4 72h2M11 72h1M16 72h1M24 72h1M0 73h1M4 73h2M11 73h1M16 73h1M24 73h1M0 74h1M4 74h2M11 74h1M16 74h1M22 74h2M0 75h1M4 75h2M11 75h1M16 75h1M22 75h2M0 76h6M9 76h5M16 76h1M21 76h4M0 77h1M4 77h5M12 77h10M0 78h1M4 78h5M12 78h10M0 79h1M6 79h3M14 79h7M0 80h1M6 80h3M14 80h7M0 81h4M6 81h10M19 81h6M0 82h1M4 82h5M14 82h2M22 82h2M0 83h1M4 83h5M14 83h2M22 83h2M0 84h2M6 84h5M14 84h3M22 84h2M0 85h6M11 85h14M0 86h6M11 86h14M0 87h1M4 87h2M9 87h2M14 87h3M21 87h3M0 88h1M4 88h2M9 88h2M14 88h3M21 88h3M0 89h1M6 89h5M17 89h5M0 90h6M9 90h8M21 90h3M0 91h6M9 91h8M21 91h3M0 92h1M4 92h2M11 92h1M16 92h1M24 92h1M0 93h1M4 93h2M11 93h1M16 93h1M24 93h1M0 94h1M4 94h2M11 94h1M16 94h1M22 94h2M0 95h6M9 95h5M16 95h1M21 95h4M0 96h6M9 96h5M16 96h1M21 96h4M0 97h1M4 97h5M12 97h10M0 98h1M4 98h5M12 98h10M0 99h1M6 99h3M14 99h7M0 100h4M6 100h10M19 100h6M0 101h4M6 101h10M19 101h6M0 102h1M4 102h5M14 102h2M22 102h2M0 103h1M4 103h5M14 103h2M22 103h2M0 104h2M6 104h5M14 104h3M22 104h2M0 105h6M11 105h14M0 106h6M11 106h14M0 107h1M4 107h2M9 107h2M14 107h3M21 107h3M0 108h1M4 108h2M9 108h2M14 108h3M21 108h3M0 109h1M6 109h5M17 109h5M0 110h6M9 110h8M21 110h3M0 111h6M9 111h8M21 111h3M0 112h1M4 112h2M11 112h1M16 112h1M24 112h1M0 113h1M4 113h2M11 113h1M16 113h1M24 113h1M0 114h1M4 114h2M11 114h1M16 114h1M22 114h2M0 115h6M9 115h5M16 115h1M21 115h4M0 116h6M9 116h5M16 116h1M21 116h4M0 117h1M4 117h5M12 117h10M0 118h1M4 118h5M12 118h10M0 119h1M6 119h3M14 119h7M0 120h4M6 120h10M19 120h6M0 121h4M6 121h10M19 121h6M0 122h1M4 122h5M14 122h2M22 122h2M0 123h1M4 123h5M14 123h2M22 123h2M0 124h2M6 124h5M14 124h3M22 124h2M0 125h6M11 125h14M0 126h6M11 126h14M0 127h1M4 127h2M9 127h2M14 127h3M21 127h3M0 128h1M4 128h2M9 128h2M14 128h3M21 128h3M0 129h1M6 129h5M17 129h5M0 130h6M9 130h8M21 130h3M0 131h6M9 131h8M21 131h3M0 132h1M4 132h2M11 132h1M16 132h1M24 132h1M0 133h1M4 133h2M11 133h1M16 133h1M24 133h1M0 134h1M4 134h2M11 134h1M16 134h1M22 134h2M0 135h6M9 135h5M16 135h1M21 135h4M0 136h6M9 136h5M16 136h1M21 136h4M0 137h1M4 137h5M12 137h10M0 138h1M6 138h3M14 138h7M0 139h1M6 139h3M14 139h7M0 140h4M6 140h10M19 140h6M0 141h4M6 141h10M19 141h6M0 142h1M4 142h5M14 142h2M22 142h2M0 143h2M6 143h5M14 143h3M22 143h2M0 144h2M6 144h5M14 144h3M22 144h2M0 145h6M11 145h14M0 146h6M11 146h14M0 147h1M4 147h2M9 147h2M14 147h3M21 147h3M0 148h1M6 148h5M17 148h5M0 149h1M6 149h5M17 149h5M0 150h6M9 150h8M21 150h3M0 151h6M9 151h8M21 151h3M0 152h1M4 152h2M11 152h1M16 152h1M24 152h1M0 153h1M4 153h2M11 153h1M16 153h1M22 153h2M0 154h1M4 154h2M11 154h1M16 154h1M22 154h2M0 155h6M9 155h5M16 155h1M21 155h4M0 156h6M9 156h5M16 156h1M21 156h4M0 157h1M4 157h5M12 157h10M0 158h1M6 158h3M14 158h7M0 159h1M6 159h3M14 159h7M0 160h4M6 160h10M19 160h6M1 161h3M6 161h10M19 161h6M4 162h5M14 162h2M22 162h2M5 163h6M14 163h3M22 163h2M8 164h3M14 164h3M22 164h2M9 165h1M11 165h14M12 166h13M14 167h3M21 167h3M17 168h5M19 169h3M20 170h4M23 171h1M24 172h1"] ["#494949" "M2 4h1M2 5h4M7 6h1M7 7h2M2 8h2M6 8h3M1 9h5M11 9h3M1 10h5M11 10h5M6 11h3M6 12h3M2 13h2M9 13h2M14 13h2M21 13h1M1 14h3M9 14h2M12 14h4M21 14h1M1 15h3M9 15h2M12 15h4M21 15h1M24 15h1M6 16h3M14 16h2M17 16h4M6 17h3M14 17h2M17 17h4M1 18h3M9 18h3M22 18h2M1 19h1M4 19h2M12 19h2M21 19h1M24 19h1M1 20h1M4 20h2M12 20h2M21 20h1M24 20h1M4 21h2M16 21h3M4 22h2M16 22h3M1 23h1M9 23h2M12 23h2M16 23h1M21 23h1M24 23h1M2 24h4M11 24h3M17 24h5M24 24h1M2 25h4M11 25h3M17 25h5M24 25h1M7 26h2M7 27h2M2 28h2M6 28h3M19 28h2M24 28h1M1 29h5M11 29h5M22 29h2M1 30h5M11 30h5M22 30h2M6 31h3M24 31h1M2 32h2M9 32h2M14 32h2M21 32h1M2 33h2M9 33h2M14 33h2M21 33h1M1 34h3M9 34h2M12 34h4M21 34h1M24 34h1M1 35h3M9 35h2M12 35h4M21 35h1M24 35h1M6 36h3M14 36h2M17 36h4M1 37h3M9 37h3M22 37h2M1 38h3M9 38h3M22 38h2M1 39h1M4 39h2M12 39h2M21 39h1M24 39h1M1 40h1M4 40h2M12 40h2M21 40h1M24 40h1M4 41h2M16 41h3M1 42h1M9 42h2M12 42h2M16 42h1M21 42h1M24 42h1M1 43h1M9 43h2M12 43h2M16 43h1M21 43h1M24 43h1M2 44h4M11 44h3M17 44h5M24 44h1M2 45h4M11 45h3M17 45h5M24 45h1M7 46h2M2 47h2M6 47h3M19 47h2M24 47h1M2 48h2M6 48h3M19 48h2M24 48h1M1 49h5M11 49h5M22 49h2M1 50h5M11 50h5M22 50h2M6 51h3M24 51h1M2 52h2M9 52h2M14 52h2M21 52h1M2 53h2M9 53h2M14 53h2M21 53h1M1 54h3M9 54h2M12 54h4M21 54h1M24 54h1M1 55h3M9 55h2M12 55h4M21 55h1M24 55h1M6 56h3M14 56h2M17 56h4M1 57h3M9 57h3M22 57h2M1 58h3M9 58h3M22 58h2M1 59h1M4 59h2M12 59h2M21 59h1M24 59h1M1 60h1M4 60h2M12 60h2M21 60h1M24 60h1M4 61h2M16 61h3M1 62h1M9 62h2M12 62h2M16 62h1M21 62h1M24 62h1M1 63h1M9 63h2M12 63h2M16 63h1M21 63h1M24 63h1M2 64h4M11 64h3M17 64h5M24 64h1M2 65h4M11 65h3M17 65h5M24 65h1M7 66h2M2 67h2M6 67h3M19 67h2M24 67h1M2 68h2M6 68h3M19 68h2M24 68h1M1 69h5M11 69h5M22 69h2M1 70h5M11 70h5M22 70h2M6 71h3M24 71h1M2 72h2M9 72h2M14 72h2M21 72h1M2 73h2M9 73h2M14 73h2M21 73h1M1 74h3M9 74h2M12 74h4M21 74h1M24 74h1M1 75h3M9 75h2M12 75h4M21 75h1M24 75h1M6 76h3M14 76h2M17 76h4M1 77h3M9 77h3M22 77h2M1 78h3M9 78h3M22 78h2M1 79h1M4 79h2M12 79h2M21 79h1M24 79h1M1 80h1M4 80h2M12 80h2M21 80h1M24 80h1M4 81h2M16 81h3M1 82h1M9 82h2M12 82h2M16 82h1M21 82h1M24 82h1M1 83h1M9 83h2M12 83h2M16 83h1M21 83h1M24 83h1M2 84h4M11 84h3M17 84h5M24 84h1M7 85h2M7 86h2M2 87h2M6 87h3M19 87h2M24 87h1M2 88h2M6 88h3M19 88h2M24 88h1M1 89h5M11 89h5M22 89h2M6 90h3M24 90h1M6 91h3M24 91h1M2 92h2M9 92h2M14 92h2M21 92h1M2 93h2M9 93h2M14 93h2M21 93h1M1 94h3M9 94h2M12 94h4M21 94h1M24 94h1M6 95h3M14 95h2M17 95h4M6 96h3M14 96h2M17 96h4M1 97h3M9 97h3M22 97h2M1 98h3M9 98h3M22 98h2M1 99h1M4 99h2M12 99h2M21 99h1M24 99h1M4 100h2M16 100h3M4 101h2M16 101h3M1 102h1M9 102h2M12 102h2M16 102h1M21 102h1M24 102h1M1 103h1M9 103h2M12 103h2M16 103h1M21 103h1M24 103h1M2 104h4M11 104h3M17 104h5M24 104h1M7 105h2M7 106h2M2 107h2M6 107h3M19 107h2M24 107h1M2 108h2M6 108h3M19 108h2M24 108h1M1 109h5M11 109h5M22 109h2M6 110h3M24 110h1M6 111h3M24 111h1M2 112h2M9 112h2M14 112h2M21 112h1M2 113h2M9 113h2M14 113h2M21 113h1M1 114h3M9 114h2M12 114h4M21 114h1M24 114h1M6 115h3M14 115h2M17 115h4M6 116h3M14 116h2M17 116h4M1 117h3M9 117h3M22 117h2M1 118h3M9 118h3M22 118h2M1 119h1M4 119h2M12 119h2M21 119h1M24 119h1M4 120h2M16 120h3M4 121h2M16 121h3M1 122h1M9 122h2M12 122h2M16 122h1M21 122h1M24 122h1M1 123h1M9 123h2M12 123h2M16 123h1M21 123h1M24 123h1M2 124h4M11 124h3M17 124h5M24 124h1M7 125h2M7 126h2M2 127h2M6 127h3M19 127h2M24 127h1M2 128h2M6 128h3M19 128h2M24 128h1M1 129h5M11 129h5M22 129h2M6 130h3M24 130h1M6 131h3M24 131h1M2 132h2M9 132h2M14 132h2M21 132h1M2 133h2M9 133h2M14 133h2M21 133h1M1 134h3M9 134h2M12 134h4M21 134h1M24 134h1M6 135h3M14 135h2M17 135h4M6 136h3M14 136h2M17 136h4M1 137h3M9 137h3M22 137h2M1 138h1M4 138h2M12 138h2M21 138h1M24 138h1M1 139h1M4 139h2M12 139h2M21 139h1M24 139h1M4 140h2M16 140h3M4 141h2M16 141h3M1 142h1M9 142h2M12 142h2M16 142h1M21 142h1M24 142h1M2 143h4M11 143h3M17 143h5M24 143h1M2 144h4M11 144h3M17 144h5M24 144h1M7 145h2M7 146h2M2 147h2M6 147h3M19 147h2M24 147h1M1 148h5M11 148h5M22 148h2M1 149h5M11 149h5M22 149h2M6 150h3M24 150h1M6 151h3M24 151h1M2 152h2M9 152h2M14 152h2M21 152h1M1 153h3M9 153h2M12 153h4M21 153h1M24 153h1M1 154h3M9 154h2M12 154h4M21 154h1M24 154h1M6 155h3M14 155h2M17 155h4M6 156h3M14 156h2M17 156h4M1 157h3M9 157h3M22 157h2M1 158h1M4 158h2M12 158h2M21 158h1M24 158h1M1 159h1M4 159h2M12 159h2M21 159h1M24 159h1M4 160h2M16 160h3M4 161h2M16 161h3M3 162h1M9 162h2M12 162h2M16 162h1M21 162h1M24 162h1M11 163h3M17 163h5M24 163h1M11 164h3M17 164h5M24 164h1M19 167h2M24 167h1M16 168h1M22 168h2M22 169h2M24 170h1M24 171h1"] ["#555555" "M6 6h1M6 7h1M1 8h1M11 8h1M1 13h1M7 13h2M12 13h2M19 13h2M6 14h3M17 14h4M6 15h3M17 15h4M24 18h1M2 19h2M11 19h1M22 19h2M2 20h2M11 20h1M22 20h2M2 23h2M11 23h1M19 23h2M6 26h1M9 26h2M6 27h1M9 27h2M1 28h1M12 28h2M17 28h2M16 29h1M24 29h1M16 30h1M24 30h1M17 31h4M1 32h1M7 32h2M12 32h2M19 32h2M22 32h2M1 33h1M7 33h2M12 33h2M19 33h2M22 33h2M6 34h3M17 34h4M6 35h3M17 35h4M24 37h1M24 38h1M2 39h2M11 39h1M22 39h2M2 40h2M11 40h1M22 40h2M2 42h2M11 42h1M19 42h2M2 43h2M11 43h1M19 43h2M6 46h1M9 46h2M1 47h1M12 47h2M17 47h2M1 48h1M12 48h2M17 48h2M16 49h1M24 49h1M16 50h1M24 50h1M17 51h4M1 52h1M7 52h2M12 52h2M19 52h2M22 52h2M1 53h1M7 53h2M12 53h2M19 53h2M22 53h2M6 54h3M17 54h4M6 55h3M17 55h4M24 57h1M24 58h1M2 59h2M11 59h1M22 59h2M2 60h2M11 60h1M22 60h2M2 62h2M11 62h1M19 62h2M2 63h2M11 63h1M19 63h2M6 66h1M9 66h2M1 67h1M12 67h2M17 67h2M1 68h1M12 68h2M17 68h2M16 69h1M24 69h1M16 70h1M24 70h1M17 71h4M1 72h1M7 72h2M12 72h2M19 72h2M22 72h2M1 73h1M7 73h2M12 73h2M19 73h2M22 73h2M6 74h3M17 74h4M6 75h3M17 75h4M24 77h1M24 78h1M2 79h2M11 79h1M22 79h2M2 80h2M11 80h1M22 80h2M2 82h2M11 82h1M19 82h2M2 83h2M11 83h1M19 83h2M6 85h1M9 85h2M6 86h1M9 86h2M1 87h1M12 87h2M17 87h2M1 88h1M12 88h2M17 88h2M16 89h1M24 89h1M17 90h4M17 91h4M1 92h1M7 92h2M12 92h2M19 92h2M22 92h2M1 93h1M7 93h2M12 93h2M19 93h2M22 93h2M6 94h3M17 94h4M24 97h1M24 98h1M2 99h2M11 99h1M22 99h2M2 102h2M11 102h1M19 102h2M2 103h2M11 103h1M19 103h2M6 105h1M9 105h2M6 106h1M9 106h2M1 107h1M12 107h2M17 107h2M1 108h1M12 108h2M17 108h2M16 109h1M24 109h1M17 110h4M17 111h4M1 112h1M7 112h2M12 112h2M19 112h2M22 112h2M1 113h1M7 113h2M12 113h2M19 113h2M22 113h2M6 114h3M17 114h4M24 117h1M24 118h1M2 119h2M11 119h1M22 119h2M2 122h2M11 122h1M19 122h2M2 123h2M11 123h1M19 123h2M6 125h1M9 125h2M6 126h1M9 126h2M1 127h1M12 127h2M17 127h2M1 128h1M12 128h2M17 128h2M16 129h1M24 129h1M17 130h4M17 131h4M1 132h1M7 132h2M12 132h2M19 132h2M22 132h2M1 133h1M7 133h2M12 133h2M19 133h2M22 133h2M6 134h3M17 134h4M24 137h1M2 138h2M11 138h1M22 138h2M2 139h2M11 139h1M22 139h2M2 142h2M11 142h1M19 142h2M6 145h1M9 145h2M6 146h1M9 146h2M1 147h1M12 147h2M17 147h2M16 148h1M24 148h1M16 149h1M24 149h1M17 150h4M17 151h4M1 152h1M7 152h2M12 152h2M19 152h2M22 152h2M6 153h3M17 153h4M6 154h3M17 154h4M24 157h1M2 158h2M11 158h1M22 158h2M2 159h2M11 159h1M22 159h2M11 162h1M19 162h2M10 165h1M17 167h2M24 168h1M24 169h1"] ["#656565" "M6 13h1M17 13h2M9 19h2M9 20h2M17 23h2M11 28h1M6 32h1M17 32h2M6 33h1M17 33h2M9 39h2M9 40h2M17 42h2M17 43h2M11 47h1M11 48h1M6 52h1M17 52h2M6 53h1M17 53h2M9 59h2M9 60h2M17 62h2M17 63h2M11 67h1M11 68h1M6 72h1M17 72h2M6 73h1M17 73h2M9 79h2M9 80h2M17 82h2M17 83h2M11 87h1M11 88h1M6 92h1M17 92h2M6 93h1M17 93h2M9 99h2M17 102h2M17 103h2M11 107h1M11 108h1M6 112h1M17 112h2M6 113h1M17 113h2M9 119h2M17 122h2M17 123h2M11 127h1M11 128h1M6 132h1M17 132h2M6 133h1M17 133h2M9 138h2M9 139h2M17 142h2M11 147h1M6 152h1M17 152h2M9 158h2M9 159h2M17 162h2"]])\r
(def factory-button [["#d7d7d7" "M0 0h31M0 1h30M0 2h30M0 3h3M0 4h3M0 5h3M0 6h3M0 7h3M0 8h3M0 9h3M0 10h3M0 11h3M0 12h3M0 13h3M0 14h3M0 15h3M0 16h3M0 17h3M0 18h3M0 19h3M0 20h3M0 21h3M0 22h3M0 23h3M0 24h3M0 25h3M0 26h3M0 27h3M0 28h3M0 29h3M0 30h1"] ["#717171" "M31 0h2M7 9h1M11 9h2M16 9h1M7 10h1M11 10h2M16 10h1M7 11h1M11 11h2M16 11h1M7 12h1M11 12h2M16 12h1M7 13h1M11 13h2M16 13h1M7 14h1M11 14h2M16 14h1M7 15h1M11 15h2M16 15h1M7 16h1M11 16h2M16 16h1M14 19h2M18 19h2M6 20h2M10 20h7M18 20h2M21 20h2M8 21h2M14 21h2M18 21h2M23 21h1M8 22h2M14 22h2M18 22h2M23 22h1M6 23h14M24 23h2M6 24h1M8 24h2M11 24h2M14 24h2M17 24h3M6 25h1M8 25h2M11 25h2M14 25h2M17 25h3M0 31h1M0 32h1"] ["#8e8e8e" "M30 1h1M30 2h1M6 17h14M6 18h14M6 19h1M8 19h2M11 19h2M17 19h1M8 20h2M17 20h1M23 20h3M6 21h1M11 21h2M17 21h1M24 21h2M6 22h1M11 22h2M17 22h1M24 22h2M1 30h2"] ["#383838" "M31 1h2M31 2h2M30 3h3M30 4h3M30 5h3M30 6h3M30 7h3M30 8h3M13 9h1M30 9h3M30 10h3M30 11h3M30 12h3M30 13h3M30 14h3M30 15h3M30 16h3M30 17h3M30 18h3M30 19h3M20 20h1M30 20h3M20 21h1M30 21h3M20 22h1M30 22h3M30 23h3M30 24h3M30 25h3M20 26h6M30 26h3M30 27h3M30 28h3M30 29h3M3 30h30M1 31h32M1 32h32"] ["#aa9a1c" "M3 3h27M3 4h1M28 4h2M3 5h1M28 5h2M3 6h1M28 6h2M3 7h1M28 7h2M3 8h1M28 8h2M3 9h1M28 9h2M3 10h1M28 10h2M3 11h1M28 11h2M3 12h1M28 12h2M3 13h1M28 13h2M3 14h1M28 14h2M3 15h1M28 15h2M3 16h1M28 16h2M3 17h1M28 17h2M3 18h1M28 18h2M3 19h1M28 19h2M3 20h1M28 20h2M3 21h1M28 21h2M3 22h1M28 22h2M3 23h1M28 23h2M3 24h1M28 24h2M3 25h1M28 25h2M3 26h1M27 26h3M3 27h1M28 27h2M3 28h27M3 29h27"] ["#d3cf38" "M4 4h24M4 5h24M4 6h24M4 7h24M4 8h24M4 9h3M10 9h1M14 9h2M18 9h10M4 10h3M10 10h1M14 10h2M18 10h10M4 11h3M10 11h1M14 11h2M18 11h10M4 12h3M10 12h1M14 12h2M18 12h10M4 13h3M10 13h1M14 13h2M18 13h10M4 14h3M10 14h1M14 14h2M18 14h10M4 15h3M10 15h1M14 15h2M18 15h10M23 16h5M23 17h5M23 18h5M4 27h24"] ["#000000" "M8 9h2M17 9h1M8 10h2M13 10h1M17 10h1M8 11h2M13 11h1M17 11h1M8 12h2M13 12h1M17 12h1M8 13h2M13 13h1M17 13h1M8 14h2M13 14h1M17 14h1M8 15h2M13 15h1M17 15h1M6 16h1M8 16h3M13 16h3M17 16h6M20 17h3M20 18h3M7 19h1M10 19h1M13 19h1M16 19h1M20 19h8M26 20h2M7 21h1M10 21h1M13 21h1M16 21h1M26 21h2M7 22h1M10 22h1M13 22h1M16 22h1M26 22h2M20 23h1M23 23h1M26 23h2M7 24h1M10 24h1M13 24h1M16 24h1M20 24h1M23 24h1M26 24h2M7 25h1M10 25h1M13 25h1M16 25h1M20 25h1M23 25h1M26 25h2M7 26h1M26 26h1"] ["#555555" "M4 16h2M4 17h2M4 18h2M4 19h2M4 20h2M4 21h2M21 21h2M4 22h2M21 22h2M4 23h2M21 23h2M4 24h2M21 24h2M24 24h2M4 25h2M21 25h2M24 25h2M4 26h3M8 26h12"]])\r
(def small-factory [["#444f75" "M130 29h3M133 31h1M92 40h4M94 42h2M110 51h1M94 53h2M111 53h4M91 58h1M91 59h1M82 60h1M87 60h1M100 60h1M188 60h1M100 61h1M78 62h5M85 62h2M100 62h1M198 62h4M78 63h1M100 63h1M83 64h2M101 64h4M195 64h1M198 64h4M146 65h1M197 65h1M82 66h1M108 66h1M146 66h1M197 66h1M69 67h1M188 67h1M193 67h1M69 68h1M109 68h1M188 68h1M193 68h1M184 69h1M184 70h1M57 71h4M67 71h4M186 71h1M67 72h1M152 72h1M186 72h1M199 72h1M56 73h5M63 73h4M151 73h2M186 73h1M202 73h2M149 74h4M184 74h1M186 74h1M56 75h7M149 75h4M184 75h2M56 76h1M143 76h6M151 76h2M143 77h6M151 77h2M51 78h1M138 78h4M151 78h2M186 78h1M51 79h1M138 79h4M151 79h2M186 79h1M134 80h4M151 80h2M186 80h1M134 81h4M151 81h2M186 81h1M57 82h3M151 82h2M162 82h1M186 82h1M60 83h1M129 83h5M151 83h2M186 83h1M61 84h4M151 84h2M186 84h1M125 85h4M151 85h2M186 85h1M47 86h1M125 86h4M151 86h2M186 86h1M121 87h4M151 87h2M186 87h1M45 88h2M69 88h1M121 88h4M151 88h2M186 88h1M116 89h6M151 89h2M186 89h1M116 90h6M151 90h2M186 90h1M112 91h6M151 91h2M186 91h1M112 92h6M151 92h2M186 92h1M56 93h1M60 93h1M79 93h4M151 93h2M186 93h1M82 94h1M107 94h4M151 94h2M186 94h1M107 95h4M151 95h2M184 95h3M103 96h6M151 96h2M103 97h6M151 97h2M73 98h1M91 98h1M98 98h5M151 98h2M65 99h4M73 99h1M91 99h1M99 99h4M151 99h2M91 100h1M94 100h4M149 100h4M173 100h1M184 100h1M91 101h1M94 101h4M149 101h4M173 101h1M184 101h1M76 102h4M91 102h1M94 102h2M145 102h4M173 102h1M184 102h1M91 103h1M94 103h2M145 103h4M173 103h1M184 103h1M91 104h1M94 104h2M140 104h4M171 104h2M184 104h1M206 104h1M91 105h1M94 105h2M140 105h4M184 105h1M91 106h1M94 106h2M183 106h1M200 106h2M91 107h1M94 107h2M136 107h4M182 107h1M91 108h1M94 108h2M182 108h1M91 109h1M94 109h2M131 109h4M182 109h1M197 109h1M219 109h1M91 110h1M94 110h2M131 110h4M197 110h1M91 111h1M94 111h2M127 111h4M197 111h1M91 112h1M94 112h2M127 112h4M197 112h1M49 113h1M91 113h1M94 113h2M123 113h4M91 114h1M94 114h2M122 114h5M91 115h1M94 115h2M118 115h4M178 115h2M91 116h1M94 116h2M118 116h4M173 116h1M91 117h1M94 117h2M174 117h4M56 118h1M91 118h1M94 118h2M114 118h4M57 119h3M91 119h1M94 119h2M91 120h1M94 120h2M109 120h4M91 121h1M94 121h2M109 121h4M91 122h1M94 122h2M105 122h4M91 123h1M94 123h2M105 123h4M46 124h1M91 124h1M94 124h2M98 124h6M91 125h1M94 125h2M98 125h6M91 126h1M94 126h6M91 127h1M94 127h6M91 128h1M94 128h2M36 129h1M91 129h1M94 129h2M36 130h1M91 130h1M94 130h1M62 131h1M91 131h1M62 132h1M91 132h1M36 133h1M53 133h1M200 133h4M36 134h1M200 134h4M36 135h1M54 135h4M96 135h4M199 135h1M204 135h2M196 136h4M36 137h1M58 137h1M195 137h1M36 138h1M62 138h1M191 138h4M36 139h1M191 139h4M206 139h1M185 140h1M189 140h2M208 140h1M185 141h1M189 141h2M208 141h1M36 142h1M71 142h1M113 142h1M180 142h4M186 142h1M204 142h4M36 143h1M71 143h1M113 143h1M180 143h4M186 143h1M204 143h4M72 144h4M176 144h4M188 144h1M200 144h4M176 145h4M200 145h4M36 146h1M76 146h4M118 146h4M175 146h1M199 146h1M36 147h1M93 147h1M171 147h4M196 147h4M80 148h1M93 148h1M171 148h1M191 148h2M195 148h1M93 149h1M169 149h2M189 149h2M193 149h2M41 150h4M93 150h1M169 150h2M189 150h2M194 150h1M93 151h1M160 151h6M189 151h2M93 152h1M160 152h6M189 152h2M93 153h1M156 153h4M165 153h1M185 153h4M93 154h1M156 154h4M165 154h1M185 154h4M93 155h1M152 155h4M168 155h1M180 155h4M93 156h1M151 156h4M180 156h4M54 157h5M93 157h1M151 157h1M171 157h1M93 158h1M147 158h4M171 158h2M176 158h4M54 159h4M93 159h1M147 159h2M173 159h1M175 159h1M58 160h1M93 160h1M147 160h2M169 160h2M174 160h1M58 161h1M62 161h1M93 161h1M147 161h2M169 161h2M174 161h1M93 162h1M167 162h4M93 163h1M167 163h4M58 164h1M62 164h1M71 164h1M93 164h1M162 164h4M58 165h1M71 165h1M93 165h1M162 165h4M54 166h4M63 166h4M72 166h4M158 166h4M158 167h4M50 168h4M59 168h4M67 168h4M76 168h4M157 168h1M58 169h1M71 169h1M156 169h2M50 170h2M58 170h5M67 170h5M76 170h4M151 170h2M155 170h1M154 171h1M154 172h1M51 173h1M71 173h1M93 173h1M51 174h1M71 174h1M93 174h1M93 175h1M102 175h1M93 176h1M219 176h1M56 177h5M67 177h5M76 177h4M93 177h1M60 178h1M71 178h1M93 178h1M57 179h3M65 179h4M76 179h4M93 179h1M108 179h3M69 180h1M93 180h1M111 180h1M51 181h1M61 181h4M69 181h4M93 181h1M112 181h3M93 182h1M93 183h1M69 184h1M93 184h1M120 184h1M69 185h1M93 185h1M120 185h1M93 186h1M104 186h1M120 186h1M93 187h1M104 187h1M120 187h1M93 188h1M104 188h1M120 188h1M78 189h1M93 189h1M104 189h1M120 189h1M69 190h1M79 190h1M82 190h1M93 190h1M120 190h1M93 191h1M120 191h1M188 191h1M45 192h2M70 192h4M93 192h1M120 192h1M187 192h1M191 192h4M220 192h4M247 192h3M93 193h1M120 193h1M93 194h1M120 194h1M224 194h1M78 195h1M93 195h1M120 195h1M93 196h1M120 196h1M57 197h3M74 197h4M120 197h1M204 197h1M207 197h3M233 197h4M120 198h1M120 199h1M120 200h1M120 201h1M120 202h1M219 202h1M120 203h1M213 203h1M219 203h1M120 204h1M120 205h1M120 206h1M188 206h1M199 206h1M78 207h1M120 207h1M120 208h1M200 208h1M203 208h1M109 209h1M120 209h1M122 211h1M123 212h3M109 213h1M135 217h1M104 218h1"] \r
                    ["#ad6140" "M100 38h1M104 38h1M100 39h1M104 39h1M96 40h4M104 40h1M114 40h2M104 41h1M96 42h5M105 42h9M100 43h1M100 44h5M124 46h1M111 47h1M111 48h1M120 51h1M127 51h4M120 52h1M120 53h5M127 53h4M125 55h2M45 126h4M45 127h5M45 128h5M45 129h9M45 130h9M38 131h1M40 131h1M47 131h11M38 132h1M40 132h1M47 132h11M38 133h1M54 133h9M38 134h1M54 134h9M38 135h1M45 135h2M58 135h9M38 136h1M58 136h9M38 137h1M47 137h7M59 137h12M38 138h1M63 138h9M38 139h1M43 139h4M63 139h9M38 140h1M47 140h1M58 140h1M67 140h9M38 141h1M47 141h1M58 141h1M67 141h9M38 142h1M49 142h1M62 142h1M72 142h9M38 143h1M49 143h1M62 143h1M72 143h9M38 144h1M47 144h1M58 144h1M76 144h9M38 145h1M47 145h1M58 145h1M76 145h9M39 146h2M43 146h7M56 146h5M67 146h5M80 146h9M49 147h1M58 147h1M60 147h1M71 147h1M80 147h9M41 148h4M47 148h3M54 148h2M58 148h1M60 148h1M67 148h3M71 148h5M81 148h10M58 149h1M60 149h1M69 149h1M89 149h3M45 150h2M58 150h1M60 150h3M65 150h2M69 150h2M89 150h3M47 151h1M60 151h1M71 151h1M80 151h1M85 151h7M47 152h1M60 152h1M71 152h1M80 152h1M85 152h7M67 153h1M71 153h1M80 153h1M85 153h7M67 154h1M71 154h1M80 154h1M85 154h7M58 155h1M65 155h2M69 155h1M71 155h3M80 155h1M85 155h7M58 156h1M69 156h1M71 156h1M80 156h1M85 156h7M59 157h4M69 157h3M80 157h1M85 157h7M80 158h1M85 158h7M63 159h4M74 159h2M80 159h1M85 159h7M67 160h1M80 160h1M85 160h7M67 161h4M80 161h1M85 161h7M71 162h1M80 162h1M85 162h7M71 163h1M80 163h1M85 163h7M80 164h1M85 164h4M80 165h1M85 165h4"] ["#43d1f1" "M184 60h3M184 61h3M180 62h9M180 63h9M180 64h9M184 65h7M185 66h6M189 67h4M189 68h4M50 80h2M50 81h2M50 82h6M50 83h6M50 84h10M50 85h11M50 86h2M54 86h7M54 87h11M54 88h11M56 89h14M56 90h14M63 91h11M63 92h11M65 93h13M65 94h13M65 95h17M69 96h14M70 97h13M76 98h9M76 99h9M80 100h9M81 101h3M85 101h4M82 102h1M86 102h3M81 103h1M87 103h2M81 104h1M87 104h2M80 105h1M88 105h1M88 106h1M88 107h1M88 108h1M88 109h1M88 110h1M88 111h1M88 112h1M88 113h1M88 114h1M88 115h1M88 116h1M88 117h1M88 118h1M88 119h1M50 120h4M88 120h1M50 121h4M88 121h1M50 122h13M88 122h1M50 123h13M88 123h1M50 124h17M88 124h1M50 125h17M88 125h1M54 126h15M80 126h1M87 126h2M54 127h15M80 127h1M86 127h3M54 128h15M80 128h1M86 128h3M58 129h23M86 129h3M58 130h24M86 130h3M63 131h20M85 131h4M63 132h26M67 133h25M67 134h25M71 135h25M72 136h24M76 137h24M76 138h24M76 139h25M81 140h24M81 141h24M85 142h24M85 143h24M89 144h25M89 145h13M107 145h7M94 146h7M108 146h10M94 147h6M109 147h9M94 148h6M110 148h12M94 149h6M111 149h12M94 150h6M112 150h11M94 151h6M105 151h1M112 151h15M94 152h6M105 152h1M116 152h11M94 153h6M105 153h2M118 153h11M94 154h6M105 154h2M120 154h9M94 155h6M105 155h3M120 155h9M94 156h6M121 156h8M94 157h6M121 157h8M94 158h6M122 158h7M94 159h6M123 159h6M94 160h6M123 160h6M94 161h6M123 161h6M94 162h6M124 162h5M94 163h5M124 163h5M94 164h4M124 164h5M94 165h3M123 165h6M90 166h7M123 166h6M89 167h8M123 167h6M85 168h13M122 168h7M85 169h14M122 169h7M85 170h20M123 170h6M83 171h11M98 171h9M124 171h5M83 172h11M98 172h10M125 172h4M83 173h9M102 173h8M126 173h3M83 174h9M102 174h10M126 174h3M83 175h9M107 175h6M127 175h2M83 176h9M107 176h12M127 176h2M83 177h9M111 177h9M127 177h2M83 178h9M111 178h10M128 178h1M83 179h9M112 179h9M128 179h1M83 180h9M116 180h6M128 180h1M83 181h9M116 181h7M127 181h2M83 182h9M120 182h9M83 183h9M120 183h9M83 184h9M122 184h7M83 185h9M122 185h7M83 186h9M105 186h2M122 186h7M83 187h9M105 187h2M122 187h7M83 188h9M105 188h6M122 188h7M83 189h9M105 189h6M122 189h7M83 190h9M105 190h7M122 190h7M87 191h5M107 191h7M122 191h7M87 192h5M107 192h7M122 192h7M111 193h3M122 193h7M111 194h3M122 194h7M122 195h7M122 196h7M122 197h7M122 198h7M122 199h7M122 200h7M122 201h7M122 202h7M122 203h7M122 204h7M122 205h7M122 206h7M122 207h7M122 208h7M122 209h7M123 210h6M127 211h2M127 212h2"] ["#3a4466" "M124 42h1M96 44h4M100 45h1M100 46h1M109 50h1M111 51h1M111 52h1M115 53h1M116 55h2M87 57h1M120 58h1M120 59h1M79 60h3M88 60h3M120 60h1M180 60h4M195 60h1M198 60h4M82 61h1M87 61h4M120 61h1M195 61h1M87 62h5M120 62h1M195 62h1M85 63h9M120 63h1M195 63h1M197 63h1M74 64h4M89 64h5M100 64h1M120 64h1M196 64h2M83 65h2M89 65h11M120 65h1M140 65h2M73 66h1M83 66h2M89 66h11M120 66h1M140 66h2M76 67h4M85 67h20M120 67h1M140 67h7M178 67h6M198 67h4M76 68h4M85 68h20M120 68h1M140 68h7M178 68h6M198 68h4M72 69h13M89 69h20M113 69h1M120 69h1M140 69h11M185 69h4M193 69h9M72 70h13M89 70h20M113 70h1M120 70h1M140 70h11M185 70h4M193 70h9M71 71h23M98 71h15M136 71h11M151 71h2M187 71h2M193 71h7M56 72h1M60 72h1M68 72h26M98 72h15M136 72h11M151 72h1M187 72h2M193 72h6M67 73h27M103 73h11M135 73h7M149 73h2M180 73h4M187 73h2M193 73h2M200 73h2M63 74h35M103 74h15M131 74h11M187 74h2M193 74h2M52 75h4M63 75h35M104 75h14M131 75h7M182 75h2M186 75h1M57 76h45M105 76h13M127 76h11M142 76h1M149 76h2M184 76h1M196 76h6M51 77h1M56 77h46M105 77h13M127 77h11M142 77h1M149 77h2M184 77h1M196 77h6M49 78h1M56 78h53M114 78h19M142 78h9M157 78h1M187 78h2M193 78h9M49 79h1M56 79h53M114 79h19M142 79h9M157 79h1M187 79h2M193 79h9M61 80h68M138 80h13M187 80h2M195 80h7M61 81h68M138 81h13M187 81h2M195 81h7M60 82h1M65 82h60M129 82h22M156 82h2M187 82h2M197 82h5M65 83h60M134 83h10M145 83h6M156 83h2M187 83h2M198 83h4M69 84h51M125 84h18M146 84h5M156 84h6M166 84h1M187 84h2M198 84h4M70 85h50M129 85h11M142 85h2M146 85h5M156 85h6M187 85h2M200 85h2M65 86h5M73 86h43M124 86h1M129 86h11M143 86h1M146 86h5M156 86h7M187 86h2M200 86h2M69 87h1M74 87h42M120 87h1M125 87h14M146 87h5M156 87h9M187 87h2M200 87h2M47 88h1M74 88h42M120 88h1M125 88h12M147 88h4M156 88h9M187 88h2M200 88h2M78 89h33M122 89h14M142 89h1M147 89h4M156 89h13M187 89h2M198 89h4M78 90h33M122 90h11M143 90h2M147 90h4M156 90h13M187 90h2M198 90h4M56 91h4M83 91h24M111 91h1M118 91h15M140 91h1M143 91h2M147 91h4M156 91h15M187 91h2M195 91h7M83 92h24M111 92h1M118 92h11M130 92h2M135 92h3M143 92h2M147 92h4M156 92h15M187 92h2M195 92h7M87 93h16M107 93h12M121 93h7M131 93h1M135 93h4M142 93h3M147 93h4M156 93h19M179 93h1M187 93h2M194 93h8M87 94h15M111 94h8M122 94h6M130 94h3M139 94h1M142 94h2M147 94h4M156 94h19M187 94h2M193 94h9M83 95h4M91 95h7M103 95h4M111 95h9M123 95h7M132 95h5M139 95h1M143 95h1M147 95h4M156 95h17M175 95h9M187 95h2M193 95h9M92 96h6M109 96h12M123 96h7M133 96h2M139 96h2M144 96h7M156 96h17M175 96h1M185 96h4M193 96h9M87 97h1M92 97h6M102 97h1M109 97h12M124 97h7M134 97h1M139 97h3M144 97h7M156 97h17M175 97h1M184 97h4M193 97h9M65 98h1M103 98h19M125 98h7M135 98h7M144 98h7M156 98h17M175 98h1M184 98h1M193 98h5M69 99h1M98 99h1M103 99h19M125 99h8M135 99h16M156 99h17M175 99h1M184 99h1M193 99h5M98 100h7M109 100h14M126 100h5M132 100h2M135 100h14M156 100h15M185 100h1M191 100h4M98 101h6M110 101h10M122 101h2M127 101h3M132 101h17M156 101h15M185 101h1M191 101h4M96 102h7M106 102h2M110 102h1M114 102h4M123 102h2M127 102h1M132 102h13M156 102h15M185 102h1M189 102h4M96 103h6M105 103h6M114 103h1M124 103h1M131 103h14M156 103h15M185 103h1M189 103h4M76 104h1M96 104h6M104 104h11M121 104h1M125 104h1M129 104h11M144 104h1M156 104h13M185 104h1M189 104h4M76 105h1M96 105h6M104 105h9M115 105h1M122 105h1M125 105h15M144 105h1M156 105h13M185 105h1M189 105h4M76 106h1M96 106h6M104 106h9M115 106h2M119 106h1M125 106h19M155 106h14M184 106h1M189 106h5M76 107h1M96 107h6M105 107h8M116 107h1M120 107h1M123 107h13M151 107h18M183 107h1M189 107h6M76 108h1M96 108h7M112 108h2M116 108h2M121 108h19M151 108h18M183 108h1M189 108h7M198 108h2M76 109h1M96 109h9M112 109h2M117 109h2M121 109h10M135 109h1M149 109h18M183 109h1M189 109h8M76 110h1M96 110h14M112 110h3M118 110h13M135 110h1M149 110h18M182 110h2M189 110h8M45 111h4M76 111h1M96 111h14M112 111h3M118 111h9M142 111h25M180 111h2M187 111h6M202 111h7M76 112h1M96 112h14M112 112h4M118 112h9M142 112h25M180 112h2M187 112h6M202 112h7M76 113h1M96 113h14M112 113h11M138 113h26M180 113h2M185 113h8M198 113h8M76 114h1M96 114h7M105 114h4M112 114h10M138 114h26M180 114h2M185 114h8M198 114h8M76 115h1M96 115h7M111 115h7M122 115h1M132 115h32M169 115h4M185 115h4M197 115h5M76 116h1M96 116h8M110 116h8M131 116h33M178 116h2M185 116h4M193 116h9M76 117h1M96 117h26M131 117h33M173 117h1M193 117h5M76 118h1M96 118h18M129 118h40M176 118h2M182 118h2M189 118h8M76 119h1M96 119h22M129 119h40M176 119h1M182 119h2M189 119h8M64 120h1M76 120h1M96 120h13M113 120h1M127 120h46M185 120h8M64 121h1M76 121h1M96 121h13M113 121h1M127 121h46M185 121h8M65 122h4M76 122h1M96 122h9M120 122h69M76 123h1M96 123h9M120 123h69M76 124h1M96 124h2M104 124h1M116 124h68M76 125h1M96 125h2M104 125h1M116 125h68M100 126h1M112 126h68M111 127h69M53 128h1M96 128h4M111 128h65M41 129h4M109 129h66M41 130h4M95 130h1M109 130h66M45 131h2M105 131h66M45 132h2M105 132h66M47 133h6M103 133h64M47 134h7M103 134h64M105 135h57M196 135h3M206 135h1M54 136h4M100 136h1M105 136h57M195 136h1M206 136h1M101 137h4M109 137h49M191 137h4M206 137h1M59 138h3M109 138h49M206 138h1M59 139h4M109 139h48M63 140h4M114 140h26M145 140h8M184 140h1M186 140h1M63 141h4M114 141h26M145 141h8M184 141h1M186 141h1M47 142h1M67 142h4M84 142h1M118 142h11M133 142h5M147 142h2M208 142h1M47 143h1M67 143h4M84 143h1M118 143h11M133 143h5M147 143h2M208 143h1M85 144h4M123 144h4M72 145h4M123 145h4M175 145h1M122 146h1M171 146h4M47 147h1M76 147h4M122 147h1M123 148h4M169 148h1M190 148h1M196 148h4M81 149h4M81 150h4M193 150h1M131 151h1M166 151h1M45 152h1M131 152h1M166 152h1M83 153h2M131 153h1M166 153h1M83 154h2M131 154h1M166 154h1M49 155h1M83 155h2M131 155h1M151 155h1M184 155h1M49 156h1M83 156h2M131 156h1M50 157h4M83 157h2M131 157h1M147 157h4M58 158h1M83 158h2M131 158h1M50 159h4M58 159h5M83 159h2M131 159h1M171 159h2M176 159h4M49 160h1M83 160h2M131 160h1M173 160h1M175 160h1M49 161h1M83 161h2M131 161h1M173 161h1M175 161h1M58 162h1M83 162h2M131 162h1M58 163h1M83 163h2M131 163h1M49 164h1M83 164h2M131 164h1M166 164h1M49 165h1M83 165h2M131 165h1M166 165h1M58 166h1M62 166h1M67 166h1M71 166h1M83 166h2M131 166h1M162 166h1M58 167h1M71 167h1M83 167h2M131 167h1M54 168h5M63 168h4M71 168h5M84 168h1M131 168h1M158 168h4M49 169h1M80 169h1M84 169h1M131 169h1M49 170h1M54 170h4M63 170h4M72 170h4M80 170h1M82 170h1M131 170h1M156 170h2M58 171h1M71 171h1M131 171h1M153 171h1M155 171h1M51 172h1M58 172h1M71 172h1M131 172h1M153 172h1M155 172h1M49 173h1M80 173h1M131 173h1M49 174h1M80 174h1M131 174h1M51 175h1M60 175h1M71 175h1M131 175h1M60 176h1M71 176h1M102 176h1M131 176h1M52 177h3M61 177h4M72 177h4M80 177h1M101 177h6M131 177h1M80 178h1M101 178h1M131 178h1M56 179h1M60 179h5M72 179h4M101 179h2M107 179h1M131 179h1M60 180h1M101 180h6M131 180h1M224 180h1M60 181h1M76 181h1M101 181h6M111 181h1M131 181h1M206 181h1M69 182h1M80 182h1M101 182h10M131 182h1M69 183h1M80 183h1M101 183h10M131 183h1M42 184h1M56 184h1M101 184h1M107 184h9M131 184h1M56 185h1M101 185h1M107 185h9M131 185h1M37 186h1M80 186h1M101 186h1M112 186h6M131 186h1M211 186h4M238 186h3M80 187h1M101 187h1M112 187h6M131 187h1M241 187h1M74 188h4M80 188h1M101 188h1M116 188h2M131 188h1M42 189h1M80 189h1M101 189h1M116 189h2M131 189h1M78 190h1M101 190h1M104 190h1M116 190h2M131 190h1M82 191h1M101 191h1M116 191h2M131 191h1M101 192h1M116 192h2M131 192h1M101 193h6M116 193h2M131 193h1M224 193h1M101 194h6M116 194h2M131 194h1M91 195h1M101 195h10M116 195h2M131 195h1M241 195h1M91 196h1M101 196h10M116 196h2M131 196h1M241 196h1M101 197h4M109 197h9M131 197h1M206 197h1M56 198h1M101 198h4M109 198h9M131 198h1M101 199h4M114 199h4M131 199h1M101 200h8M114 200h4M131 200h1M104 201h5M114 201h4M131 201h1M73 202h1M105 202h13M131 202h1M213 202h1M224 202h1M66 203h7M96 203h4M105 203h13M131 203h1M187 203h4M214 203h3M225 203h3M109 204h9M131 204h1M109 205h9M131 205h1M114 206h4M131 206h1M213 206h1M114 207h4M131 207h1M199 207h1M109 208h1M131 208h1M131 209h1M120 210h2M131 210h1M131 211h1M122 212h1M131 212h1M131 213h1M92 214h4M110 214h3M121 214h3M174 214h3"] ["#181425" "M108 21h3M107 22h4M106 23h7M106 24h7M106 25h7M106 26h7M119 26h3M106 27h1M111 27h2M116 27h8M106 28h1M112 28h1M117 28h7M106 29h1M112 29h1M117 29h7M106 30h1M112 30h1M117 30h7M130 30h3M106 31h1M112 31h1M117 31h1M122 31h2M130 31h3M106 32h1M112 32h1M117 32h1M123 32h1M128 32h7M106 33h1M112 33h1M117 33h1M123 33h1M128 33h7M106 34h1M112 34h1M117 34h1M123 34h1M128 34h7M196 34h1M106 35h1M112 35h1M117 35h1M123 35h1M128 35h7M196 35h1M105 36h2M112 36h1M117 36h1M123 36h1M128 36h1M134 36h1M196 36h1M101 37h6M112 37h1M117 37h1M123 37h1M128 37h1M134 37h1M196 37h1M106 38h1M112 38h2M116 38h2M123 38h1M128 38h1M134 38h1M196 38h1M96 39h1M106 39h1M112 39h1M116 39h2M123 39h1M128 39h1M134 39h1M196 39h1M106 40h1M112 40h1M117 40h1M123 40h1M128 40h1M134 40h1M196 40h1M92 41h3M106 41h1M112 41h1M117 41h1M123 41h1M128 41h1M134 41h1M196 41h1M92 42h1M117 42h1M123 42h1M128 42h1M134 42h1M196 42h1M92 43h1M96 43h4M117 43h1M123 43h6M134 43h1M196 43h1M92 44h1M117 44h1M123 44h1M127 44h2M134 44h1M196 44h1M92 45h1M117 45h1M123 45h1M128 45h1M134 45h1M196 45h1M92 46h1M128 46h1M134 46h1M196 46h1M92 47h1M128 47h1M134 47h1M196 47h1M92 48h1M106 48h5M128 48h1M134 48h1M196 48h1M92 49h1M128 49h1M134 49h2M196 49h1M92 50h1M111 50h4M134 50h5M196 50h1M92 51h1M132 51h4M138 51h1M196 51h1M92 52h1M116 52h3M132 52h4M138 52h1M196 52h1M92 53h1M138 53h1M196 53h1M92 54h2M123 54h1M128 54h3M138 54h1M196 54h1M92 55h2M123 55h1M127 55h4M138 55h1M190 55h1M196 55h1M92 56h2M123 56h1M126 56h1M138 56h1M190 56h1M196 56h1M91 57h3M123 57h4M138 57h1M190 57h1M192 57h1M196 57h1M84 58h3M92 58h2M123 58h2M138 58h1M185 58h6M194 58h3M92 59h2M123 59h2M138 59h1M189 59h2M196 59h1M92 60h4M123 60h2M138 60h1M190 60h1M196 60h1M92 61h4M123 61h2M138 61h1M180 61h1M190 61h1M196 61h2M201 61h1M95 62h5M123 62h2M138 62h1M190 62h1M196 62h1M75 63h2M95 63h5M123 63h2M138 63h3M190 63h1M196 63h1M202 63h1M123 64h2M138 64h2M202 64h1M70 65h3M86 65h3M101 65h3M123 65h2M138 65h1M143 65h3M179 65h4M198 65h8M123 66h2M138 66h1M204 66h2M65 67h1M84 67h1M123 67h2M138 67h1M205 67h1M66 68h3M81 68h4M105 68h4M123 68h2M138 68h1M147 68h3M176 68h1M185 68h3M194 68h3M205 68h1M61 69h3M85 69h4M110 69h3M123 69h2M136 69h3M152 69h3M176 69h1M189 69h4M205 69h1M64 70h1M123 70h2M154 70h1M176 70h1M190 70h2M205 70h1M121 71h4M132 71h3M154 71h1M176 71h2M190 71h2M204 71h2M57 72h3M95 72h2M114 72h11M131 72h4M148 72h2M154 72h1M176 72h4M190 72h2M202 72h4M118 73h2M122 73h9M147 73h2M154 73h1M176 73h2M190 73h2M205 73h1M53 74h2M98 74h4M118 74h2M123 74h8M143 74h6M154 74h1M176 74h2M180 74h4M190 74h2M196 74h6M205 74h1M118 75h2M122 75h5M154 75h1M176 75h2M180 75h2M190 75h2M205 75h1M48 76h3M103 76h1M118 76h9M138 76h4M154 76h1M176 76h2M185 76h10M205 76h1M48 77h1M154 77h1M176 77h2M188 77h6M205 77h1M48 78h1M137 78h1M154 78h1M176 78h2M190 78h2M205 78h1M48 79h1M52 79h4M110 79h3M134 79h4M154 79h3M176 79h2M190 79h2M205 79h1M48 80h1M57 80h3M129 80h4M154 80h1M176 80h2M190 80h3M205 80h1M48 81h1M129 81h1M154 81h1M159 81h2M176 81h2M190 81h3M205 81h1M48 82h1M154 82h1M176 82h1M190 82h3M205 82h1M48 83h1M61 83h4M125 83h3M154 83h1M162 83h4M176 83h1M190 83h3M205 83h1M48 84h1M154 84h1M176 84h1M190 84h3M205 84h1M48 85h1M65 85h4M121 85h3M154 85h1M167 85h3M176 85h1M190 85h3M205 85h1M48 86h1M145 86h1M154 86h1M167 86h4M176 86h1M190 86h3M205 86h1M70 87h3M117 87h2M143 87h1M154 87h1M171 87h1M176 87h1M190 87h3M205 87h1M43 88h2M142 88h1M154 88h1M171 88h6M190 88h3M205 88h1M144 89h1M154 89h1M176 89h1M190 89h3M205 89h1M75 90h2M112 90h3M137 90h1M145 90h2M154 90h1M176 90h1M190 90h3M205 90h1M79 91h3M107 91h4M146 91h1M154 91h1M176 91h1M190 91h3M205 91h1M107 92h1M146 92h1M154 92h1M176 92h1M190 92h3M205 92h1M128 93h1M134 93h1M141 93h1M146 93h1M154 93h1M176 93h1M190 93h2M205 93h1M84 94h3M103 94h4M133 94h1M146 94h1M154 94h1M176 94h4M190 94h2M205 94h1M131 95h1M138 95h1M154 95h1M190 95h2M205 95h1M88 96h3M98 96h4M121 96h1M138 96h1M154 96h1M174 96h1M180 96h4M190 96h2M205 96h1M131 97h1M154 97h1M174 97h1M190 97h2M205 97h1M122 98h1M154 98h1M174 98h1M189 98h3M205 98h1M92 99h6M154 99h1M185 99h8M205 99h1M92 100h1M154 100h1M171 100h1M187 100h4M205 100h1M92 101h1M124 101h1M154 101h1M171 101h1M187 101h2M190 101h1M205 101h1M92 102h1M153 102h2M171 102h1M187 102h1M205 102h1M92 103h1M149 103h6M171 103h1M187 103h1M205 103h1M92 104h1M187 104h1M205 104h1M92 105h1M103 105h1M145 105h4M169 105h1M187 105h1M205 105h5M92 106h1M113 106h1M169 106h1M187 106h1M205 106h2M92 107h1M104 107h1M115 107h1M121 107h2M141 107h3M169 107h1M185 107h3M205 107h1M211 107h3M92 108h1M141 108h3M185 108h3M205 108h1M211 108h4M92 109h1M185 109h3M202 109h1M205 109h1M215 109h1M92 110h1M115 110h1M136 110h4M167 110h1M185 110h3M203 110h3M215 110h4M92 111h1M132 111h4M167 111h1M183 111h3M198 111h4M211 111h5M217 111h2M92 112h1M132 112h4M183 112h1M211 112h5M217 112h2M92 113h1M183 113h1M209 113h2M217 113h2M92 114h1M109 114h1M128 114h3M165 114h2M183 114h1M194 114h3M207 114h4M217 114h2M92 115h1M165 115h3M182 115h2M217 115h2M92 116h1M105 116h3M123 116h4M165 116h4M180 116h4M190 116h2M202 116h4M217 116h2M92 117h1M180 117h2M203 117h3M217 117h2M92 118h1M118 118h4M169 118h4M179 118h2M185 118h3M198 118h4M217 118h2M92 119h1M118 119h4M179 119h2M198 119h4M217 119h2M48 120h1M92 120h1M174 120h1M178 120h4M197 120h1M217 120h2M48 121h1M92 121h1M114 121h4M174 121h10M194 121h4M217 121h2M48 122h1M92 122h1M110 122h3M189 122h4M217 122h2M48 123h1M92 123h1M110 123h3M190 123h2M217 123h2M48 124h1M92 124h1M217 124h2M46 125h3M92 125h1M106 125h3M185 125h4M217 125h2M92 126h1M217 126h2M42 127h2M50 127h3M78 127h2M92 127h1M101 127h4M180 127h4M217 127h2M92 128h1M101 128h3M180 128h4M217 128h2M92 129h1M96 129h3M176 129h4M217 129h2M37 130h1M92 130h1M96 130h4M176 130h4M217 130h2M37 131h1M92 131h2M95 131h1M171 131h1M201 131h5M217 131h2M37 132h1M59 132h3M95 132h1M171 132h4M201 132h5M217 132h2M37 133h1M46 133h1M96 133h4M167 133h4M196 133h3M205 133h1M217 133h2M37 134h1M96 134h1M168 134h3M217 134h2M37 135h1M101 135h1M191 135h4M207 135h1M217 135h2M37 136h1M48 136h6M68 136h3M101 136h3M163 136h4M191 136h4M207 136h2M217 136h2M37 137h1M207 137h2M217 137h2M37 138h1M54 138h4M72 138h4M106 138h2M159 138h3M184 138h7M207 138h2M217 138h2M37 139h1M158 139h4M187 139h2M217 139h2M37 140h1M76 140h1M157 140h1M180 140h4M187 140h1M210 140h1M217 140h2M37 141h1M154 141h4M180 141h4M187 141h1M210 141h1M217 141h2M37 142h1M64 142h2M81 142h3M114 142h4M149 142h4M176 142h4M187 142h1M210 142h1M217 142h2M37 143h1M149 143h4M179 143h1M210 143h1M217 143h2M37 144h1M68 144h3M119 144h3M145 144h4M171 144h4M209 144h4M217 144h2M37 145h1M86 145h2M118 145h4M145 145h4M171 145h4M190 145h1M205 145h8M217 145h2M37 146h1M167 146h4M190 146h1M211 146h2M217 146h2M37 147h3M72 147h4M90 147h3M123 147h4M140 147h4M167 147h3M190 147h1M201 147h3M211 147h2M217 147h2M92 148h1M140 148h3M166 148h3M211 148h2M217 148h2M42 149h2M77 149h3M86 149h2M92 149h1M128 149h3M136 149h4M160 149h8M191 149h1M196 149h4M207 149h6M217 149h2M92 150h1M136 150h4M167 150h1M191 150h1M196 150h4M207 150h6M217 150h2M92 151h1M132 151h4M156 151h4M191 151h2M202 151h4M217 151h2M81 152h3M92 152h1M132 152h4M156 152h4M191 152h4M202 152h4M217 152h2M48 153h5M81 153h1M92 153h1M132 153h2M151 153h4M189 153h4M198 153h4M217 153h2M48 154h1M81 154h1M92 154h1M132 154h2M151 154h1M190 154h2M198 154h4M217 154h2M48 155h1M81 155h1M92 155h1M132 155h2M147 155h4M193 155h4M217 155h2M48 156h1M54 156h4M81 156h1M92 156h1M132 156h2M147 156h3M185 156h4M193 156h5M217 156h2M48 157h1M81 157h1M92 157h1M132 157h2M145 157h1M200 157h4M217 157h2M48 158h6M59 158h3M81 158h1M92 158h1M132 158h1M145 158h1M180 158h4M191 158h2M200 158h4M217 158h2M48 159h1M81 159h1M92 159h1M132 159h1M144 159h2M181 159h3M191 159h2M200 159h4M217 159h2M48 160h1M54 160h3M64 160h2M81 160h1M92 160h1M132 160h1M142 160h4M176 160h4M187 160h4M198 160h8M217 160h2M48 161h1M81 161h1M92 161h1M132 161h1M142 161h4M176 161h4M187 161h4M198 161h8M217 161h2M48 162h1M53 162h1M81 162h1M92 162h1M132 162h1M142 162h5M148 162h1M172 162h1M182 162h4M191 162h15M217 162h2M48 163h5M59 163h3M68 163h3M81 163h1M92 163h1M132 163h1M142 163h7M172 163h3M182 163h4M191 163h15M217 163h2M48 164h1M54 164h4M63 164h4M81 164h1M91 164h2M132 164h1M142 164h7M167 164h4M178 164h4M189 164h17M218 164h1M48 165h1M75 165h1M81 165h1M132 165h1M142 165h7M168 165h3M179 165h2M189 165h17M218 165h1M48 166h1M81 166h1M132 166h1M142 166h7M174 166h4M182 166h22M218 166h1M48 167h6M59 167h3M68 167h3M76 167h6M86 167h2M132 167h1M142 167h8M163 167h4M173 167h5M182 167h22M218 167h1M48 168h1M81 168h1M132 168h1M142 168h8M182 168h20M218 168h1M48 169h1M54 169h4M64 169h2M72 169h4M81 169h3M132 169h1M142 169h8M159 169h3M171 169h2M180 169h22M218 169h1M48 170h1M81 170h1M132 170h1M142 170h8M158 170h4M171 170h2M180 170h22M218 170h1M48 171h2M76 171h1M80 171h2M132 171h1M142 171h9M157 171h1M167 171h4M173 171h27M218 171h1M48 172h2M80 172h2M132 172h1M142 172h11M156 172h2M167 172h4M173 172h27M218 172h1M48 173h1M75 173h1M81 173h1M132 173h1M142 173h11M156 173h4M162 173h5M171 173h27M218 173h1M48 174h1M75 174h1M81 174h1M95 174h2M132 174h1M142 174h18M162 174h5M171 174h27M218 174h1M48 175h2M80 175h2M95 175h1M132 175h1M142 175h11M160 175h2M169 175h26M215 175h4M48 176h3M76 176h1M81 176h1M95 176h1M98 176h3M132 176h1M142 176h11M160 176h2M169 176h26M215 176h1M48 177h3M81 177h1M95 177h1M98 177h2M132 177h1M147 177h6M162 177h7M173 177h20M211 177h4M48 178h7M61 178h4M72 178h4M81 178h1M95 178h1M98 178h2M103 178h4M132 178h1M147 178h6M162 178h7M173 178h20M211 178h3M221 178h2M48 179h7M81 179h1M95 179h1M98 179h2M132 179h1M151 179h2M162 179h3M177 179h14M48 180h12M65 180h4M76 180h6M95 180h1M98 180h2M107 180h4M132 180h1M151 180h2M160 180h4M178 180h13M207 180h3M225 180h3M53 181h7M81 181h1M95 181h1M98 181h2M132 181h1M151 181h2M160 181h4M178 181h13M53 182h7M64 182h1M81 182h1M95 182h1M98 182h2M132 182h1M156 182h4M182 182h7M202 182h4M232 182h1M56 183h9M70 183h3M81 183h1M95 183h1M98 183h2M112 183h3M132 183h1M156 183h4M182 183h7M39 184h3M57 184h12M75 184h7M95 184h1M98 184h2M103 184h4M116 184h3M132 184h1M156 184h2M160 184h4M178 184h4M184 184h3M198 184h4M207 184h3M234 184h3M61 185h8M81 185h1M95 185h1M98 185h2M103 185h1M118 185h1M132 185h1M156 185h2M160 185h4M179 185h2M184 185h2M61 186h8M81 186h1M95 186h1M98 186h2M103 186h1M108 186h3M118 186h1M132 186h1M156 186h2M165 186h4M174 186h4M184 186h2M193 186h4M65 187h8M81 187h1M95 187h1M98 187h2M103 187h1M118 187h1M132 187h1M156 187h2M165 187h4M173 187h5M184 187h2M193 187h1M65 188h9M81 188h1M95 188h1M98 188h2M103 188h1M118 188h1M132 188h1M156 188h2M169 188h4M184 188h9M39 189h3M66 189h11M81 189h1M95 189h1M98 189h2M103 189h1M112 189h3M118 189h1M132 189h1M156 189h2M169 189h4M184 189h8M216 189h3M243 189h2M70 190h7M81 190h1M95 190h1M98 190h2M103 190h1M114 190h1M118 190h1M132 190h1M156 190h2M169 190h3M184 190h4M191 190h1M44 191h2M70 191h12M95 191h1M98 191h2M103 191h3M118 191h1M132 191h1M156 191h2M169 191h2M180 191h8M192 191h5M221 191h2M247 191h3M75 192h7M95 192h1M98 192h2M118 192h1M132 192h1M156 192h2M169 192h2M180 192h6M196 192h1M75 193h7M95 193h1M98 193h2M118 193h1M132 193h1M156 193h2M169 193h2M176 193h6M184 193h2M196 193h1M74 194h1M78 194h8M95 194h1M98 194h2M107 194h4M118 194h1M132 194h1M156 194h2M169 194h2M176 194h6M184 194h2M200 194h2M52 195h1M55 195h1M79 195h12M95 195h1M98 195h2M113 195h2M118 195h1M132 195h1M156 195h8M169 195h2M173 195h9M184 195h2M201 195h1M79 196h3M88 196h3M95 196h1M98 196h2M115 196h1M118 196h1M132 196h1M156 196h8M169 196h2M173 196h9M184 196h2M205 196h1M232 196h1M79 197h3M88 197h3M94 197h6M118 197h1M132 197h1M154 197h12M169 197h2M176 197h6M184 197h2M205 197h1M57 198h3M75 198h7M88 198h12M106 198h2M118 198h1M132 198h1M154 198h13M169 198h2M176 198h6M184 198h2M205 198h5M234 198h3M75 199h2M92 199h8M118 199h1M132 199h1M158 199h9M168 199h3M175 199h3M184 199h2M61 200h3M70 200h7M92 200h8M110 200h3M118 200h1M132 200h1M145 200h8M158 200h13M173 200h5M182 200h4M210 200h4M229 200h3M70 201h3M96 201h4M118 201h1M132 201h1M145 201h8M158 201h13M173 201h4M183 201h3M69 202h4M96 202h8M118 202h1M132 202h1M140 202h4M162 202h9M173 202h2M184 202h3M214 202h2M101 203h3M118 203h1M132 203h1M140 203h4M162 203h9M174 203h1M184 203h2M218 203h1M101 204h4M118 204h1M132 204h1M140 204h2M145 204h4M159 204h8M169 204h2M182 204h4M191 204h1M218 204h1M75 205h3M101 205h7M118 205h1M132 205h1M140 205h2M145 205h4M158 205h9M169 205h2M182 205h4M192 205h3M218 205h5M106 206h7M118 206h1M132 206h1M140 206h2M149 206h2M154 206h4M169 206h2M178 206h8M110 207h3M118 207h1M132 207h1M140 207h2M149 207h1M154 207h4M169 207h2M178 207h4M110 208h4M118 208h1M132 208h1M140 208h2M151 208h5M169 208h2M174 208h7M84 209h2M110 209h9M132 209h1M140 209h2M151 209h5M169 209h2M173 209h8M201 209h2M210 209h2M114 210h5M132 210h1M140 210h2M153 210h3M169 210h2M173 210h6M88 211h3M115 211h7M132 211h1M140 211h2M154 211h2M169 211h10M205 211h3M121 212h1M132 212h1M140 212h2M154 212h2M169 212h8M121 213h1M132 213h1M140 213h2M154 213h2M169 213h8M125 214h1M132 214h1M140 214h2M154 214h2M169 214h4M96 215h1M126 215h1M131 215h2M136 215h6M154 215h2M169 215h3M96 216h1M129 216h4M140 216h2M154 216h2M169 216h2M130 217h5M141 217h3M154 217h2M162 217h8M154 218h2M162 218h7M145 219h11M158 219h10M145 220h11M158 220h10M149 221h7M158 221h3M150 222h11"] ["#00ddff" "M84 101h1M83 102h3M82 103h5M82 104h5M81 105h7M80 106h8M80 107h8M80 108h8M80 109h8M80 110h8M80 111h8M80 112h8M80 113h8M80 114h8M80 115h8M80 116h8M80 117h8M80 118h8M80 119h8M80 120h8M80 121h8M80 122h8M80 123h8M80 124h8M80 125h8M81 126h6M81 127h5M81 128h5M81 129h5M82 130h4M83 131h2M102 145h5M101 146h7M100 147h9M100 148h10M100 149h11M100 150h12M100 151h5M106 151h6M100 152h5M106 152h10M100 153h5M107 153h11M100 154h5M107 154h13M100 155h5M108 155h12M100 156h21M100 157h21M100 158h22M100 159h23M100 160h23M100 161h23M100 162h24M99 163h25M98 164h26M97 165h26M97 166h26M97 167h26M98 168h24M99 169h23M105 170h18M107 171h17M108 172h17M110 173h16M112 174h14M113 175h14M119 176h8M120 177h7M121 178h7M121 179h7M122 180h6M123 181h4"] ["#3e2731" "M113 40h1M95 41h1M113 41h1M124 44h3M104 45h1M124 45h1M104 46h1M116 46h2M122 46h2M111 49h5M115 50h1M116 51h4M131 51h1M131 52h1M131 53h1M124 54h1M124 55h1M50 128h3M38 130h2M54 130h4M58 131h1M58 132h1M45 133h1M45 134h1M47 135h1M47 136h1M67 136h1M54 139h4M72 139h4M59 141h4M76 141h4M67 144h1M67 145h1M38 146h1M40 147h1M89 147h1M91 148h1M67 149h1M76 149h1M59 150h1M76 150h4M85 150h4M62 151h1M84 151h1M62 152h1M84 152h1M53 153h1M53 154h1M54 155h4M70 155h1M62 158h1M72 164h4M89 164h2M89 165h1M76 166h5M85 166h4M96 175h2M96 176h2M96 177h2M169 177h4M96 178h2M169 178h4M96 179h2M165 179h12M96 180h2M164 180h14M96 181h2M164 181h14M96 182h2M160 182h22M96 183h2M160 183h22M96 184h2M164 184h14M96 185h2M164 185h14M96 186h2M169 186h5M96 187h2M169 187h4M96 188h2M96 189h2M96 190h2M96 191h2M96 192h2M96 193h2M96 194h2M96 195h2M96 196h2M153 199h5M153 200h5M153 201h5M144 202h18M144 203h18M149 204h9M149 205h9M151 206h3M151 207h3"] ["#97b7d2" "M111 20h1M195 33h1M197 33h1M191 43h1M191 44h1M191 45h1M191 46h1M191 47h1M191 48h1M191 49h1M191 50h1M191 51h1M191 52h1M191 53h1M191 54h1M191 55h4M193 56h2M193 57h2M82 58h1M82 59h1M73 62h1M142 62h1M73 63h1M142 63h1M69 64h1M51 73h1M51 74h1M52 86h2M52 87h2M52 88h2M51 91h1M61 91h2M51 92h1M61 92h2M52 93h4M56 95h4M60 96h1M60 97h1M74 98h2M74 99h2M69 100h1M76 100h4M69 101h1M76 101h5M73 102h1M81 102h1M74 104h2M49 111h1M49 112h1M51 113h1M52 115h4M50 116h2M50 117h2M56 117h5M50 118h6M60 118h1M50 119h6M60 119h1M54 120h6M54 121h6M63 122h2M69 122h1M63 123h2M69 123h1M67 124h2M67 125h2M69 126h1M74 126h2M69 127h5M69 128h5M216 177h3M215 178h5M215 179h5M228 179h1M211 180h13M44 181h3M211 181h13M47 182h5M207 182h21M42 183h1M47 183h5M207 183h22M233 183h3M43 184h13M202 184h4M211 184h22M43 185h13M202 185h4M211 185h22M39 186h21M198 186h13M215 186h22M39 187h21M198 187h13M215 187h22M35 188h2M43 188h22M194 188h21M220 188h21M246 188h1M37 189h1M43 189h22M193 189h22M220 189h22M246 189h1M38 190h1M47 190h18M197 190h19M224 190h18M250 190h2M47 191h22M189 191h2M198 191h22M224 191h22M251 191h1M43 192h1M48 192h21M189 192h2M198 192h22M224 192h22M251 192h1M44 193h3M52 193h22M187 193h8M202 193h22M229 193h13M246 193h2M52 194h22M187 194h8M202 194h22M229 194h13M47 195h1M51 195h1M56 195h22M187 195h13M207 195h21M233 195h4M242 195h1M51 196h1M56 196h22M187 196h13M207 196h21M233 196h4M51 197h5M61 197h13M83 197h4M187 197h17M211 197h22M238 197h4M55 198h1M61 198h13M83 198h4M187 198h17M211 198h22M238 198h1M55 199h2M65 199h5M82 199h5M187 199h18M215 199h14M237 199h2M65 200h4M78 200h13M187 200h22M215 200h13M233 200h1M60 201h1M67 201h2M78 201h14M187 201h22M216 201h12M233 201h1M63 202h2M74 202h22M191 202h22M220 202h4M229 202h1M74 203h22M191 203h22M220 203h4M229 203h1M69 204h5M78 204h22M187 204h4M196 204h21M224 204h2M73 205h1M78 205h22M187 205h4M196 205h21M83 206h22M200 206h13M83 207h22M200 207h13M78 208h1M87 208h22M182 208h2M196 208h4M204 208h5M213 208h5M82 209h1M87 209h22M199 209h1M204 209h5M213 209h1M82 210h1M91 210h19M213 210h1M86 211h1M92 211h22M180 211h1M202 211h2M209 211h2M92 212h21M96 213h13M114 213h2M96 214h13M114 214h1M92 215h4M100 215h5M109 215h1M173 215h1M95 216h1M100 216h5M109 216h1M96 217h1M102 219h2M143 219h1M162 222h1"] ["#193c3e" "M179 63h1M53 127h1M63 133h4M205 146h6M204 147h7M200 148h11M200 149h7M200 150h6M195 151h7M195 152h7M193 153h5M193 154h5M189 155h4M189 156h4M185 157h8M184 158h7M180 159h1M184 159h7M180 160h7M180 161h7M175 162h7M175 163h7M171 164h7M171 165h7M167 166h7M167 167h6M163 168h10M162 169h9M162 170h9M158 171h9M158 172h9M160 173h2M160 174h2M158 184h2M158 185h2M158 186h6M107 187h1M158 187h7M158 188h11M158 189h11M158 190h11M106 191h1M158 191h11M158 192h11M158 193h11M158 194h11M112 195h1M164 195h5M164 196h5M166 197h3M167 198h2M167 199h1M142 204h3M167 204h2M142 205h3M167 205h2M142 206h7M158 206h11M142 207h7M158 207h11M142 208h9M156 208h13M142 209h9M156 209h13M142 210h11M156 210h13M142 211h12M156 211h13M142 212h12M156 212h13M142 213h12M156 213h13M142 214h12M156 214h13M142 215h12M156 215h13M142 216h12M156 216h13M144 217h10M156 217h6M144 218h10M156 218h6M156 219h2M156 220h2M156 221h2"] ["#171324" "M105 23h1M105 24h1M105 25h1M119 25h3M105 26h1M105 27h1M105 28h1M116 28h1M105 29h1M116 29h1M105 30h1M116 30h1M105 31h1M116 31h1M105 32h1M116 32h1M127 32h1M105 33h1M116 33h1M127 33h1M105 34h1M116 34h1M127 34h1M105 35h1M116 35h1M127 35h1M101 36h4M116 36h1M127 36h1M116 37h1M127 37h1M105 38h1M127 38h1M97 39h3M105 39h1M113 39h3M127 39h1M105 40h1M116 40h1M127 40h1M105 41h1M116 41h1M127 41h1M116 42h1M127 42h1M116 43h1M189 43h1M116 44h1M189 44h1M101 45h3M116 45h1M127 45h1M189 45h1M127 46h1M189 46h1M105 47h6M127 47h1M189 47h1M105 48h1M127 48h1M189 48h1M127 49h1M189 49h1M127 50h2M139 50h1M189 50h1M139 51h1M189 51h1M119 52h1M139 52h1M189 52h1M139 53h1M189 53h1M127 54h1M139 54h1M189 54h1M139 55h1M189 55h1M88 56h4M124 56h2M139 56h1M189 56h1M191 56h2M139 57h1M189 57h1M83 58h1M139 58h1M83 59h4M139 59h1M185 59h4M194 59h2M139 60h1M189 60h1M79 61h3M139 61h1M181 61h3M189 61h1M198 61h3M94 62h1M139 62h1M189 62h1M74 63h1M77 63h1M94 63h1M141 63h1M178 63h1M189 63h1M203 63h1M178 64h1M203 64h1M85 65h1M139 65h1M178 65h1M183 65h1M139 66h1M66 67h3M81 67h3M105 67h4M139 67h1M147 67h4M176 67h1M185 67h3M194 67h3M139 68h1M150 68h1M139 69h1M61 70h3M85 70h4M110 70h3M136 70h4M152 70h2M189 70h1M192 70h1M189 71h1M192 71h1M94 72h1M97 72h1M147 72h1M150 72h1M189 72h1M192 72h1M189 73h1M192 73h1M52 74h1M55 74h1M189 74h1M192 74h1M189 75h1M192 75h1M52 78h4M110 78h3M134 78h3M155 78h2M189 78h1M192 78h1M189 79h1M192 79h1M189 80h1M57 81h3M130 81h3M158 81h1M161 81h1M189 81h1M189 82h1M128 83h1M189 83h1M144 84h1M189 84h1M144 85h1M170 85h1M189 85h1M140 86h2M144 86h1M189 86h1M43 87h2M116 87h1M119 87h1M141 87h2M144 87h2M172 87h4M189 87h1M138 88h3M143 88h3M189 88h1M74 89h4M112 89h3M137 89h2M140 89h2M145 89h1M189 89h1M74 90h1M77 90h1M134 90h2M138 90h1M141 90h1M189 90h1M133 91h2M138 91h2M141 91h1M189 91h1M79 92h3M108 92h3M133 92h1M139 92h3M189 92h1M120 93h1M129 93h1M133 93h1M140 93h1M189 93h1M192 93h1M83 94h1M120 94h2M134 94h4M140 94h2M145 94h1M189 94h1M192 94h1M121 95h1M130 95h1M137 95h1M141 95h1M145 95h1M189 95h1M192 95h1M122 96h1M131 96h1M137 96h1M142 96h1M189 96h1M192 96h1M122 97h1M132 97h1M136 97h2M142 97h2M189 97h1M192 97h1M92 98h6M123 98h1M132 98h2M185 98h4M192 98h1M123 99h2M133 99h2M124 100h1M172 100h1M105 101h5M125 101h1M130 101h2M172 101h1M189 101h1M104 102h2M109 102h1M112 102h1M119 102h3M125 102h2M129 102h2M172 102h1M103 103h2M112 103h1M116 103h4M121 103h2M126 103h4M172 103h1M103 104h1M116 104h2M119 104h1M122 104h2M127 104h1M102 105h1M116 105h2M119 105h2M123 105h1M170 105h1M102 106h2M114 106h1M117 106h2M120 106h2M170 106h1M103 107h1M114 107h1M118 107h1M170 107h1M214 107h1M104 108h7M115 108h1M118 108h2M109 109h2M115 109h1M119 109h1M136 109h4M167 109h1M203 109h2M216 109h3M110 110h1M116 110h1M110 111h1M116 111h1M110 112h1M167 112h1M184 112h2M198 112h4M110 113h1M103 114h1M110 114h1M127 114h1M103 115h7M189 116h1M192 116h1M178 118h1M181 118h1M178 119h1M181 119h1M114 120h4M175 120h3M182 120h2M194 120h3M189 123h1M192 123h1M105 125h1M41 127h1M44 127h1M37 129h3M54 129h4M99 129h1M41 131h4M59 131h3M94 131h1M172 131h3M200 131h1M41 132h4M92 132h3M200 132h1M46 134h1M63 134h4M97 134h3M167 134h1M196 134h3M205 134h1M105 138h1M108 138h1M158 138h1M59 140h3M77 140h3M110 140h3M154 140h3M209 140h1M209 141h1M63 142h1M66 142h1M209 142h1M63 143h4M81 143h3M114 143h4M176 143h3M187 143h1M209 143h1M68 145h3M85 145h1M88 145h1M189 145h1M189 146h1M170 147h1M189 147h1M200 147h1M41 149h1M44 149h1M85 149h1M88 149h1M127 149h1M192 149h1M192 150h1M46 151h1M81 151h3M167 151h1M193 151h2M167 152h1M167 153h1M49 154h4M152 154h3M167 154h1M189 154h1M192 154h1M150 156h1M169 156h2M169 157h2M169 158h2M57 160h1M63 160h1M66 160h1M172 160h1M172 161h1M49 162h4M59 162h3M68 162h3M147 162h1M173 162h2M54 165h4M63 165h4M72 165h3M90 165h3M167 165h1M178 165h1M181 165h1M85 167h1M88 167h1M150 167h1M150 168h1M63 169h1M66 169h1M150 169h1M158 169h1M150 170h1M50 171h1M59 171h3M68 171h3M77 171h3M151 171h2M156 171h1M52 173h4M63 173h4M72 173h3M94 173h4M153 173h3M52 174h4M63 174h4M72 174h3M94 174h1M97 174h1M94 175h1M57 176h3M68 176h3M77 176h4M94 176h1M101 176h1M216 176h3M94 177h1M55 178h1M94 178h1M214 178h1M220 178h1M223 178h1M55 179h1M94 179h1M94 180h1M52 181h1M94 181h1M43 182h4M52 182h1M60 182h4M70 182h3M94 182h1M112 182h3M229 182h3M94 183h1M74 184h1M94 184h1M119 184h1M39 185h3M57 185h4M74 185h7M94 185h1M104 185h3M116 185h2M119 185h1M178 185h1M181 185h1M198 185h4M207 185h3M234 185h3M94 186h1M119 186h1M35 187h3M61 187h4M94 187h1M108 187h3M119 187h1M194 187h3M211 187h4M238 187h3M94 188h1M119 188h1M77 189h1M94 189h1M119 189h1M192 189h1M242 189h1M245 189h1M77 190h1M94 190h1M119 190h1M192 190h1M46 191h1M94 191h1M114 191h1M119 191h1M220 191h1M223 191h1M74 192h1M94 192h1M114 192h1M119 192h1M48 193h3M74 193h1M82 193h5M94 193h1M107 193h4M114 193h1M119 193h1M197 193h5M225 193h3M242 193h4M86 194h1M94 194h1M114 194h1M119 194h1M94 195h1M119 195h1M200 195h1M52 196h4M82 196h6M94 196h1M112 196h3M119 196h1M200 196h5M229 196h3M238 196h3M119 197h1M74 198h1M105 198h1M108 198h1M119 198h1M74 199h1M77 199h1M119 199h1M209 199h1M77 200h1M119 200h1M209 200h1M214 200h1M119 201h1M214 201h1M66 202h3M119 202h1M187 202h3M216 202h3M225 202h3M119 203h1M74 204h4M105 204h4M119 204h1M158 204h1M192 204h3M219 204h5M74 205h1M108 205h1M119 205h1M223 205h1M105 206h1M119 206h1M79 207h3M105 207h5M119 207h1M150 207h1M182 207h6M196 207h3M214 207h3M119 208h1M181 208h1M83 209h1M86 209h1M119 209h1M181 209h1M200 209h1M203 209h1M209 209h1M212 209h1M119 210h1M114 211h1M92 213h3M110 213h3M122 213h4M97 215h3M105 215h4M125 215h1M127 215h4M172 215h1M97 216h3M105 216h4M125 216h4M136 216h4M171 216h2M170 217h1M101 218h3M130 218h5M141 218h3M169 218h2M161 221h1M161 222h1"] ["#332d47" "M129 30h1M93 43h1M93 44h1M93 45h1M93 46h1M118 46h4M93 47h1M93 48h1M93 49h1M109 49h1M136 49h4M93 50h1M93 51h1M115 51h1M93 52h1M95 54h1M95 55h1M87 56h1M95 56h1M118 56h1M95 57h1M118 57h2M193 58h1M193 59h1M91 60h1M98 60h2M91 61h1M92 62h2M197 62h1M85 64h4M94 64h6M141 64h1M104 65h1M70 66h3M100 66h1M104 66h1M142 66h1M202 66h2M80 67h1M204 67h1M80 68h1M204 68h1M177 69h1M204 69h1M177 70h1M204 70h1M113 71h7M153 71h1M178 71h2M202 71h2M113 72h1M153 72h1M94 73h4M102 73h1M114 73h4M131 73h4M142 73h1M153 73h1M195 73h1M199 73h1M153 74h1M204 74h1M98 75h1M102 75h2M138 75h11M153 75h1M187 75h2M193 75h3M204 75h1M51 76h1M102 76h1M153 76h1M195 76h1M204 76h1M102 77h1M153 77h1M180 77h2M195 77h1M204 77h1M133 78h1M153 78h1M179 78h1M204 78h1M133 79h1M153 79h1M179 79h1M204 79h1M60 80h1M133 80h1M153 80h1M156 80h2M179 80h1M193 80h2M204 80h1M133 81h1M153 81h1M156 81h2M193 81h2M204 81h1M153 82h1M177 82h1M193 82h4M204 82h1M144 83h1M153 83h1M158 83h4M177 83h1M193 83h5M204 83h1M65 84h4M120 84h5M143 84h1M153 84h1M177 84h1M193 84h5M204 84h1M69 85h1M124 85h1M141 85h1M153 85h1M162 85h4M177 85h1M193 85h7M204 85h1M70 86h3M116 86h8M153 86h1M163 86h4M177 86h1M193 86h7M204 86h1M153 87h1M165 87h6M177 87h1M193 87h7M204 87h1M146 88h1M153 88h1M165 88h6M177 88h1M193 88h7M204 88h1M136 89h1M139 89h1M153 89h1M169 89h6M177 89h1M193 89h5M204 89h1M139 90h1M142 90h1M153 90h1M169 90h6M177 90h1M193 90h5M204 90h1M78 91h1M136 91h2M142 91h1M153 91h1M171 91h4M177 91h1M193 91h2M204 91h1M78 92h1M132 92h1M134 92h1M138 92h1M142 92h1M153 92h1M171 92h4M177 92h1M193 92h2M204 92h1M130 93h1M132 93h1M153 93h1M175 93h1M178 93h1M193 93h1M204 93h1M102 94h1M119 94h1M128 94h1M138 94h1M144 94h1M153 94h1M175 94h1M204 94h1M87 95h4M98 95h5M144 95h1M146 95h1M153 95h1M173 95h2M204 95h1M91 96h1M102 96h1M135 96h1M143 96h1M153 96h1M184 96h1M204 96h1M88 97h4M98 97h1M121 97h1M138 97h1M153 97h1M180 97h4M188 97h1M204 97h1M124 98h1M142 98h1M153 98h1M198 98h4M204 98h1M122 99h1M153 99h1M198 99h4M204 99h1M105 100h1M108 100h1M123 100h1M134 100h1M153 100h1M186 100h1M195 100h7M204 100h1M120 101h2M153 101h1M186 101h1M195 101h7M204 101h1M108 102h1M111 102h1M113 102h1M131 102h1M186 102h1M193 102h9M204 102h1M102 103h1M125 103h1M130 103h1M186 103h1M193 103h9M204 103h1M145 104h4M155 104h1M186 104h1M193 104h9M204 104h1M149 105h7M186 105h1M193 105h9M204 105h1M210 105h1M123 106h2M144 106h1M149 106h6M185 106h1M194 106h6M204 106h1M210 106h1M113 107h1M145 107h6M195 107h5M204 107h1M207 107h4M111 108h1M145 108h6M169 108h2M196 108h2M204 108h1M207 108h4M111 109h1M114 109h1M140 109h9M207 109h8M111 110h1M117 110h1M140 110h9M207 110h8M111 111h1M115 111h1M131 111h1M136 111h6M209 111h2M111 112h1M131 112h1M136 112h6M209 112h2M111 113h1M132 113h6M164 113h1M168 113h1M184 113h1M193 113h5M206 113h1M111 114h1M132 114h6M164 114h1M168 114h1M184 114h1M206 114h1M123 115h4M131 115h1M164 115h1M184 115h1M193 115h4M202 115h1M108 116h2M122 116h1M127 116h4M164 116h1M184 116h1M122 117h1M127 117h4M164 117h1M178 117h2M184 117h5M198 117h4M123 118h6M175 118h1M197 118h1M123 119h6M175 119h1M177 119h1M197 119h1M118 120h9M184 120h1M118 121h9M184 121h1M114 122h6M114 123h6M47 124h1M113 124h3M184 124h1M45 125h1M109 125h7M76 126h1M101 126h4M109 126h3M180 126h4M100 127h1M105 127h6M100 128h1M105 128h6M176 128h4M101 129h8M175 129h1M40 130h1M101 130h8M175 130h1M96 131h9M96 132h9M101 133h2M101 134h2M53 135h1M100 135h1M104 135h1M162 135h1M195 135h1M54 137h4M105 137h4M158 137h4M58 138h1M58 139h1M105 139h4M157 139h1M185 139h1M189 139h2M207 139h2M109 140h1M140 140h5M45 141h2M109 141h1M113 141h1M140 141h5M129 142h4M138 142h9M188 142h1M129 143h4M138 143h9M188 143h1M45 144h2M54 144h4M71 144h1M122 144h1M127 144h17M175 144h1M204 144h1M122 145h1M127 145h17M204 145h1M127 146h13M200 146h4M127 147h13M76 148h4M131 148h5M170 148h1M189 148h1M80 149h1M132 149h3M195 149h1M67 150h1M80 150h1M127 150h8M195 150h1M45 151h1M65 151h1M61 152h1M65 152h1M67 152h4M65 153h1M72 153h4M155 153h1M65 154h1M155 154h1M169 155h2M184 156h1M49 157h1M180 157h4M49 159h1M169 159h2M62 162h1M62 163h1M67 163h1M50 166h4M59 166h3M68 166h3M149 166h2M62 167h1M67 167h1M49 168h1M80 168h1M83 168h1M51 171h1M62 171h1M67 171h1M62 172h1M67 172h1M56 175h1M67 175h1M51 176h1M67 176h1M55 177h1M100 177h1M100 178h1M102 178h1M80 179h1M100 179h1M103 179h4M210 179h1M100 180h1M210 180h1M65 181h4M77 181h3M100 181h1M100 182h1M43 183h4M53 183h3M73 183h1M100 183h1M111 183h1M202 183h4M229 183h4M100 184h1M102 184h1M210 184h1M42 185h1M100 185h1M102 185h1M210 185h1M73 186h1M100 186h1M102 186h1M111 186h1M100 187h1M102 187h1M111 187h1M100 188h1M102 188h1M115 188h1M100 189h1M102 189h1M80 190h1M100 190h1M102 190h1M188 190h1M100 191h1M102 191h1M82 192h1M100 192h1M102 192h1M186 192h1M195 192h1M100 193h1M100 194h1M100 195h1M111 195h1M100 196h1M87 197h1M92 197h1M100 197h1M87 198h1M100 198h1M210 198h1M100 199h1M105 199h5M113 199h1M100 200h1M73 201h1M101 201h3M109 201h1M113 201h1M100 203h1M186 203h1M217 203h1M213 207h1M87 211h1M120 212h1M177 212h1M124 214h1M131 214h1M173 214h1M101 217h3M129 217h1M129 218h1M168 219h1M168 220h1"] ["#cbe1f0" "M45 89h2M45 90h2M45 91h6M45 92h6M45 93h7M45 94h11M45 95h11M45 96h15M45 97h15M45 98h20M45 99h20M45 100h24M45 101h24M45 102h28M45 103h29M45 104h29M45 105h31M45 106h31M45 107h31M45 108h31M45 109h31M45 110h31M50 111h26M50 112h26M52 113h24M52 114h24M56 115h20M56 116h20M61 117h15M61 118h15M61 119h15M65 120h11M65 121h11M70 122h6M70 123h6M74 124h2M74 125h2"] ["#5a6988" "M107 20h4M111 21h1M111 22h1M113 23h1M113 24h1M113 25h1M122 25h1M113 26h1M122 26h1M113 27h1M113 28h1M124 28h1M113 29h1M124 29h1M129 29h1M133 29h1M113 30h1M124 30h1M133 30h1M113 31h1M124 31h1M127 31h2M134 31h2M113 32h1M124 32h1M135 32h1M113 33h1M124 33h1M135 33h1M196 33h1M113 34h1M124 34h1M135 34h1M195 34h1M197 34h1M113 35h1M124 35h1M135 35h1M195 35h1M197 35h1M100 36h1M113 36h1M124 36h1M135 36h1M195 36h1M197 36h1M100 37h1M113 37h1M124 37h1M135 37h1M195 37h1M197 37h1M124 38h1M135 38h1M195 38h1M197 38h1M124 39h1M135 39h1M195 39h1M197 39h1M124 40h1M135 40h1M195 40h1M197 40h1M91 41h1M124 41h1M135 41h1M195 41h1M197 41h1M91 42h1M135 42h1M189 42h1M195 42h1M197 42h1M91 43h1M94 43h2M135 43h1M195 43h1M197 43h1M91 44h1M94 44h2M135 44h1M195 44h1M197 44h1M91 45h1M94 45h6M135 45h1M195 45h1M197 45h1M91 46h1M94 46h6M135 46h1M195 46h1M197 46h1M91 47h1M94 47h11M135 47h1M195 47h1M197 47h1M91 48h1M94 48h11M135 48h1M195 48h1M197 48h1M91 49h1M94 49h15M195 49h1M197 49h1M91 50h1M94 50h15M195 50h1M197 50h1M91 51h1M94 51h16M195 51h1M197 51h1M91 52h1M94 52h17M195 52h1M197 52h1M91 53h1M96 53h15M195 53h1M197 53h1M91 54h1M96 54h20M195 54h1M197 54h1M91 55h1M96 55h20M195 55h1M197 55h1M96 56h22M195 56h1M197 56h1M96 57h22M195 57h1M197 57h1M87 58h4M98 58h18M118 58h2M184 58h1M191 58h2M197 58h1M87 59h4M98 59h18M118 59h2M184 59h1M191 59h2M197 59h1M78 60h1M83 60h4M101 60h19M187 60h1M191 60h4M78 61h1M83 61h4M101 61h19M187 61h2M191 61h4M74 62h4M83 62h2M101 62h19M140 62h2M178 62h2M191 62h4M202 62h2M79 63h6M101 63h19M191 63h4M198 63h4M70 64h4M78 64h5M105 64h15M142 64h1M189 64h6M204 64h1M69 65h1M74 65h9M105 65h15M191 65h6M206 65h1M69 66h1M74 66h8M105 66h3M109 66h11M184 66h1M191 66h6M206 66h1M70 67h6M109 67h11M202 67h2M206 67h1M70 68h6M110 68h10M202 68h2M206 68h1M60 69h1M65 69h7M114 69h6M155 69h1M178 69h6M202 69h2M206 69h1M60 70h1M65 70h7M114 70h6M155 70h1M178 70h6M202 70h2M206 70h1M56 71h1M61 71h6M155 71h1M180 71h6M200 71h2M206 71h1M61 72h6M155 72h1M180 72h6M200 72h2M206 72h1M52 73h4M61 73h2M155 73h1M184 73h2M206 73h1M56 74h7M155 74h1M185 74h1M202 74h2M206 74h1M51 75h1M155 75h1M202 75h2M206 75h1M47 76h1M52 76h4M155 76h1M182 76h2M202 76h2M206 76h1M47 77h1M52 77h4M155 77h1M182 77h2M202 77h2M206 77h1M47 78h1M50 78h1M180 78h6M202 78h2M206 78h1M47 79h1M50 79h1M180 79h6M202 79h2M206 79h1M47 80h1M49 80h1M52 80h4M180 80h6M202 80h2M206 80h1M47 81h1M49 81h1M52 81h4M180 81h6M202 81h2M206 81h1M47 82h1M49 82h1M56 82h1M178 82h8M202 82h2M206 82h1M47 83h1M49 83h1M56 83h4M175 83h1M178 83h8M202 83h2M206 83h1M47 84h1M49 84h1M60 84h1M167 84h4M175 84h1M178 84h8M202 84h2M206 84h1M47 85h1M49 85h1M61 85h4M175 85h1M178 85h8M202 85h2M206 85h1M49 86h1M61 86h4M171 86h1M175 86h1M178 86h8M202 86h2M206 86h1M51 87h1M65 87h4M178 87h8M202 87h2M206 87h1M51 88h1M65 88h4M178 88h8M202 88h2M206 88h1M47 89h1M70 89h4M178 89h8M202 89h2M206 89h1M47 90h1M70 90h4M178 90h8M202 90h2M206 90h1M60 91h1M74 91h4M178 91h8M202 91h2M206 91h1M60 92h1M74 92h4M178 92h8M202 92h2M206 92h1M61 93h4M78 93h1M180 93h6M202 93h2M206 93h1M56 94h1M78 94h4M180 94h6M202 94h2M206 94h1M60 95h1M82 95h1M202 95h2M206 95h1M83 96h4M176 96h4M202 96h2M206 96h1M61 97h4M69 97h1M83 97h4M176 97h4M202 97h2M206 97h1M85 98h6M176 98h8M202 98h2M206 98h1M85 99h6M176 99h8M202 99h2M206 99h1M89 100h2M174 100h10M202 100h2M206 100h1M89 101h2M174 101h10M202 101h2M206 101h1M80 102h1M89 102h2M174 102h10M202 102h2M206 102h1M80 103h1M89 103h2M174 103h10M202 103h2M206 103h1M80 104h1M89 104h2M173 104h11M202 104h2M207 104h4M89 105h2M171 105h13M202 105h2M89 106h2M171 106h12M202 106h2M211 106h1M89 107h2M171 107h11M200 107h4M89 108h2M171 108h11M200 108h4M89 109h2M169 109h13M198 109h4M89 110h2M169 110h13M198 110h4M219 110h1M89 111h2M169 111h11M193 111h4M219 111h1M89 112h2M169 112h11M193 112h4M219 112h1M47 113h1M50 113h1M89 113h2M169 113h11M219 113h1M47 114h1M51 114h1M89 114h2M169 114h11M219 114h1M47 115h1M49 115h3M89 115h2M173 115h5M219 115h1M47 116h1M49 116h1M89 116h2M174 116h4M219 116h1M47 117h1M49 117h1M52 117h4M89 117h2M219 117h1M47 118h1M49 118h1M89 118h2M219 118h1M47 119h1M49 119h1M56 119h1M89 119h2M219 119h1M47 120h1M49 120h1M60 120h1M89 120h2M219 120h1M47 121h1M49 121h1M60 121h1M89 121h2M219 121h1M47 122h1M49 122h1M89 122h2M219 122h1M47 123h1M49 123h1M89 123h2M219 123h1M45 124h1M49 124h1M69 124h5M89 124h2M219 124h1M49 125h1M69 125h1M73 125h1M89 125h2M219 125h1M41 126h4M49 126h5M70 126h4M89 126h2M219 126h1M89 127h2M219 127h1M40 128h1M74 128h6M89 128h2M219 128h1M89 129h2M219 129h1M89 130h2M219 130h1M36 131h1M89 131h2M219 131h1M36 132h1M89 132h2M219 132h1M92 133h4M219 133h1M92 134h4M219 134h1M67 135h4M200 135h4M219 135h1M36 136h1M71 136h1M96 136h4M200 136h6M219 136h1M71 137h5M100 137h1M196 137h10M219 137h1M100 138h5M195 138h11M219 138h1M101 139h4M195 139h11M219 139h1M36 140h1M80 140h1M105 140h4M191 140h17M219 140h1M36 141h1M80 141h1M105 141h4M191 141h17M219 141h1M109 142h4M184 142h2M189 142h15M219 142h1M109 143h4M184 143h2M189 143h15M219 143h1M36 144h1M114 144h4M180 144h8M191 144h9M219 144h1M36 145h1M114 145h4M180 145h9M191 145h9M219 145h1M89 146h5M176 146h13M191 146h8M219 146h1M118 147h4M175 147h14M191 147h5M219 147h1M36 148h5M122 148h1M172 148h17M193 148h2M219 148h1M123 149h4M171 149h18M219 149h1M123 150h4M171 150h18M219 150h1M127 151h4M169 151h20M219 151h1M127 152h4M169 152h20M219 152h1M47 153h1M129 153h2M160 153h5M169 153h16M219 153h1M47 154h1M129 154h2M160 154h5M169 154h16M219 154h1M47 155h1M50 155h4M129 155h2M156 155h12M171 155h9M219 155h1M47 156h1M50 156h4M129 156h2M155 156h14M171 156h9M219 156h1M47 157h1M129 157h2M152 157h17M172 157h8M219 157h1M47 158h1M54 158h4M129 158h2M151 158h18M173 158h3M219 158h1M47 159h1M129 159h2M149 159h20M174 159h1M219 159h1M47 160h1M50 160h4M59 160h4M129 160h2M149 160h20M219 160h1M47 161h1M50 161h4M59 161h3M129 161h2M149 161h20M219 161h1M47 162h1M54 162h4M63 162h4M129 162h2M149 162h18M219 162h1M47 163h1M54 163h4M63 163h4M129 163h2M149 163h18M219 163h1M47 164h1M50 164h4M59 164h3M67 164h4M129 164h2M149 164h13M219 164h1M47 165h1M50 165h4M59 165h4M67 165h4M129 165h2M149 165h13M219 165h1M47 166h1M89 166h1M129 166h2M151 166h7M219 166h1M47 167h1M54 167h4M63 167h4M72 167h4M129 167h2M151 167h7M219 167h1M47 168h1M129 168h2M151 168h6M219 168h1M47 169h1M50 169h4M59 169h4M67 169h4M76 169h4M129 169h2M151 169h5M219 169h1M47 170h1M52 170h2M83 170h2M129 170h2M153 170h2M219 170h1M47 171h1M52 171h6M63 171h4M72 171h4M82 171h1M94 171h4M129 171h2M219 171h1M47 172h1M52 172h6M63 172h4M72 172h4M82 172h1M94 172h4M129 172h2M219 172h1M47 173h1M50 173h1M56 173h7M67 173h4M76 173h4M82 173h1M92 173h1M98 173h4M129 173h2M219 173h1M47 174h1M50 174h1M56 174h7M67 174h4M76 174h4M82 174h1M92 174h1M98 174h4M129 174h2M219 174h1M47 175h1M52 175h4M61 175h6M72 175h4M82 175h1M92 175h1M103 175h4M129 175h2M219 175h1M47 176h1M52 176h4M61 176h6M72 176h4M82 176h1M92 176h1M103 176h4M129 176h2M47 177h1M65 177h2M82 177h1M92 177h1M107 177h4M129 177h2M215 177h1M219 177h5M47 178h1M56 178h4M65 178h6M76 178h4M82 178h1M92 178h1M107 178h4M129 178h2M47 179h1M69 179h3M82 179h1M92 179h1M111 179h1M129 179h2M211 179h4M220 179h8M47 180h1M61 180h4M70 180h6M82 180h1M92 180h1M112 180h4M129 180h2M228 180h1M47 181h4M73 181h3M82 181h1M92 181h1M115 181h1M129 181h2M207 181h4M224 181h5M65 182h4M74 182h6M82 182h1M92 182h1M116 182h4M129 182h2M206 182h1M228 182h1M65 183h4M74 183h6M82 183h1M92 183h1M116 183h4M129 183h2M206 183h1M38 184h1M70 184h4M82 184h1M92 184h1M121 184h1M129 184h2M206 184h1M237 184h1M38 185h1M70 185h4M82 185h1M92 185h1M121 185h1M129 185h2M206 185h1M237 185h1M38 186h1M60 186h1M74 186h6M82 186h1M92 186h1M121 186h1M129 186h2M197 186h1M237 186h1M241 186h1M38 187h1M60 187h1M74 187h6M82 187h1M92 187h1M121 187h1M129 187h2M197 187h1M237 187h1M37 188h6M78 188h2M82 188h1M92 188h1M111 188h1M121 188h1M129 188h2M193 188h1M215 188h5M241 188h5M38 189h1M79 189h1M82 189h1M92 189h1M111 189h1M121 189h1M129 189h2M215 189h1M219 189h1M39 190h8M65 190h4M92 190h1M112 190h2M121 190h1M129 190h2M189 190h2M193 190h4M216 190h8M242 190h8M69 191h1M83 191h4M92 191h1M121 191h1M129 191h2M197 191h1M246 191h1M250 191h1M44 192h1M47 192h1M69 192h1M83 192h4M92 192h1M121 192h1M129 192h2M188 192h1M197 192h1M246 192h1M250 192h1M47 193h1M51 193h1M87 193h6M121 193h1M129 193h2M186 193h1M195 193h1M228 193h1M47 194h1M51 194h1M87 194h6M121 194h1M129 194h2M186 194h1M195 194h1M228 194h1M92 195h1M121 195h1M129 195h2M186 195h1M206 195h1M228 195h1M237 195h1M78 196h1M92 196h1M121 196h1M129 196h2M186 196h1M206 196h1M228 196h1M237 196h1M56 197h1M60 197h1M82 197h1M121 197h1M129 197h2M186 197h1M210 197h1M237 197h1M60 198h1M82 198h1M121 198h1M129 198h2M186 198h1M204 198h1M237 198h1M57 199h8M70 199h4M78 199h4M87 199h5M121 199h1M129 199h2M186 199h1M205 199h4M211 199h4M229 199h8M60 200h1M69 200h1M91 200h1M121 200h1M129 200h2M186 200h1M228 200h1M61 201h6M69 201h1M74 201h4M92 201h4M121 201h1M129 201h2M186 201h1M209 201h4M215 201h1M228 201h5M121 202h1M129 202h2M228 202h1M65 203h1M73 203h1M121 203h1M129 203h2M224 203h1M228 203h1M100 204h1M121 204h1M129 204h2M186 204h1M195 204h1M217 204h1M100 205h1M121 205h1M129 205h2M186 205h1M195 205h1M217 205h1M78 206h1M82 206h1M121 206h1M129 206h2M195 206h1M217 206h1M82 207h1M121 207h1M129 207h2M195 207h1M217 207h1M82 208h5M121 208h1M129 208h2M201 208h2M209 208h4M121 209h1M129 209h2M83 210h8M110 210h4M122 210h1M129 210h2M180 210h2M201 210h12M91 211h1M123 211h4M129 211h2M204 211h1M208 211h1M87 212h5M113 212h7M126 212h1M129 212h2M178 212h2M204 212h5M91 213h1M113 213h1M120 213h1M127 213h4M91 214h1M109 214h1M113 214h1M120 214h1M127 214h4M100 217h1M104 217h1M100 218h1M135 218h1M144 219h1M146 221h3M162 221h7M152 223h10"] ["#b86f50" "M101 38h3M101 39h3M100 40h4M96 41h8M114 41h2M101 42h4M114 42h2M101 43h15M105 44h11M105 45h11M125 45h2M105 46h11M125 46h2M112 47h15M112 48h15M116 49h11M116 50h11M121 51h6M121 52h10M125 53h2M125 54h2M39 131h1M39 132h1M39 133h6M39 134h6M39 135h6M39 136h8M39 137h8M39 138h15M39 139h4M47 139h7M39 140h4M48 140h10M39 141h4M48 141h10M39 142h4M45 142h2M50 142h12M39 143h4M45 143h2M50 143h12M39 144h4M48 144h6M59 144h8M39 145h4M48 145h6M59 145h8M41 146h2M50 146h4M61 146h6M41 147h6M50 147h4M56 147h2M61 147h10M45 148h2M50 148h4M56 148h2M61 148h6M70 148h1M45 149h13M61 149h6M70 149h6M47 150h11M63 150h2M71 150h5M48 151h12M63 151h2M72 151h8M48 152h12M63 152h2M72 152h8M54 153h11M68 153h3M76 153h4M54 154h11M68 154h3M76 154h4M59 155h6M67 155h2M76 155h4M59 156h10M72 156h2M76 156h4M63 157h6M72 157h2M76 157h4M63 158h11M76 158h4M67 159h7M76 159h4M68 160h12M71 161h9M72 162h8M72 163h8M76 164h4M76 165h4"] ["#262b44" "M107 21h1M118 25h1M118 26h1M107 27h4M107 28h5M107 29h5M107 30h5M107 31h5M118 31h4M129 31h1M107 32h5M118 32h5M107 33h5M118 33h5M107 34h5M118 34h5M107 35h5M118 35h5M107 36h5M118 36h5M129 36h5M107 37h5M118 37h5M129 37h5M96 38h4M107 38h5M114 38h2M118 38h5M129 38h5M107 39h5M118 39h5M129 39h5M107 40h5M118 40h5M129 40h5M107 41h5M118 41h5M129 41h5M93 42h1M118 42h5M129 42h5M118 43h5M129 43h5M190 43h1M118 44h5M129 44h5M190 44h1M118 45h5M129 45h5M190 45h1M101 46h3M129 46h5M190 46h1M129 47h5M190 47h1M129 48h5M190 48h1M110 49h1M129 49h5M190 49h1M110 50h1M129 50h5M190 50h1M112 51h3M136 51h2M190 51h1M112 52h4M136 52h2M190 52h1M93 53h1M116 53h4M132 53h6M190 53h1M94 54h1M116 54h7M131 54h7M190 54h1M94 55h1M118 55h5M131 55h7M94 56h1M119 56h4M127 56h11M88 57h3M94 57h1M120 57h3M127 57h11M191 57h1M94 58h4M116 58h2M121 58h2M125 58h13M94 59h4M116 59h2M121 59h2M125 59h13M96 60h2M121 60h2M125 60h13M197 60h1M96 61h4M121 61h2M125 61h13M121 62h2M125 62h13M121 63h2M125 63h13M121 64h2M125 64h13M140 64h1M179 64h1M73 65h1M100 65h1M121 65h2M125 65h13M142 65h1M85 66h4M101 66h3M121 66h2M125 66h13M143 66h3M178 66h6M198 66h4M121 67h2M125 67h13M177 67h1M184 67h1M197 67h1M65 68h1M121 68h2M125 68h13M177 68h1M184 68h1M197 68h1M64 69h1M109 69h1M121 69h2M125 69h11M151 69h1M109 70h1M121 70h2M125 70h11M151 70h1M94 71h4M120 71h1M125 71h7M135 71h1M147 71h4M125 72h6M135 72h1M98 73h4M120 73h2M143 73h4M178 73h2M196 73h3M204 73h1M102 74h1M120 74h3M142 74h1M178 74h2M195 74h1M99 75h3M120 75h2M127 75h4M178 75h2M196 75h6M104 76h1M178 76h4M49 77h2M103 77h2M118 77h9M138 77h4M178 77h2M185 77h3M194 77h1M109 78h1M113 78h1M178 78h1M109 79h1M113 79h1M178 79h1M56 80h1M155 80h1M158 80h3M178 80h1M56 81h1M60 81h1M155 81h1M178 81h2M61 82h4M125 82h4M155 82h1M158 82h4M155 83h1M145 84h1M155 84h1M162 84h4M120 85h1M140 85h1M145 85h1M155 85h1M166 85h1M142 86h1M155 86h1M45 87h6M73 87h1M139 87h2M155 87h1M48 88h3M70 88h4M116 88h4M137 88h1M141 88h1M155 88h1M43 89h2M48 89h8M111 89h1M115 89h1M143 89h1M146 89h1M155 89h1M175 89h1M43 90h2M48 90h8M111 90h1M115 90h1M133 90h1M136 90h1M140 90h1M155 90h1M175 90h1M43 91h2M52 91h4M82 91h1M135 91h1M145 91h1M155 91h1M175 91h1M43 92h2M52 92h8M82 92h1M129 92h1M145 92h1M155 92h1M175 92h1M43 93h2M57 93h3M83 93h4M103 93h4M119 93h1M139 93h1M145 93h1M155 93h1M177 93h1M43 94h2M57 94h8M129 94h1M155 94h1M43 95h2M61 95h4M120 95h1M122 95h1M140 95h1M142 95h1M155 95h1M43 96h2M61 96h8M87 96h1M130 96h1M132 96h1M136 96h1M141 96h1M155 96h1M173 96h1M43 97h2M65 97h4M99 97h3M123 97h1M133 97h1M135 97h1M155 97h1M173 97h1M43 98h2M66 98h7M134 98h1M143 98h1M155 98h1M173 98h1M43 99h2M70 99h3M155 99h1M173 99h2M43 100h2M70 100h6M93 100h1M106 100h2M125 100h1M131 100h1M155 100h1M43 101h2M70 101h6M93 101h1M104 101h1M126 101h1M155 101h1M43 102h2M74 102h2M93 102h1M103 102h1M118 102h1M122 102h1M128 102h1M149 102h4M155 102h1M188 102h1M43 103h2M74 103h6M93 103h1M111 103h1M113 103h1M115 103h1M120 103h1M123 103h1M155 103h1M188 103h1M43 104h2M77 104h3M93 104h1M102 104h1M115 104h1M118 104h1M120 104h1M124 104h1M126 104h1M128 104h1M149 104h6M169 104h2M188 104h1M43 105h2M77 105h3M93 105h1M113 105h2M118 105h1M121 105h1M124 105h1M188 105h1M43 106h2M77 106h3M93 106h1M122 106h1M145 106h4M186 106h1M188 106h1M207 106h3M43 107h2M77 107h3M93 107h1M102 107h1M117 107h1M119 107h1M140 107h1M144 107h1M184 107h1M188 107h1M206 107h1M43 108h2M77 108h3M93 108h1M103 108h1M114 108h1M120 108h1M140 108h1M144 108h1M184 108h1M188 108h1M206 108h1M43 109h2M77 109h3M93 109h1M105 109h4M116 109h1M120 109h1M168 109h1M184 109h1M188 109h1M206 109h1M43 110h2M77 110h3M93 110h1M168 110h1M184 110h1M188 110h1M202 110h1M206 110h1M43 111h2M77 111h3M93 111h1M117 111h1M168 111h1M182 111h1M186 111h1M216 111h1M43 112h6M77 112h3M93 112h1M116 112h2M168 112h1M182 112h1M186 112h1M216 112h1M48 113h1M77 113h3M93 113h1M127 113h5M165 113h3M182 113h1M207 113h2M211 113h6M48 114h3M77 114h3M93 114h1M104 114h1M131 114h1M167 114h1M182 114h1M193 114h1M197 114h1M211 114h6M48 115h1M77 115h3M93 115h1M110 115h1M127 115h4M168 115h1M180 115h2M189 115h4M203 115h14M48 116h1M52 116h4M77 116h3M93 116h1M104 116h1M169 116h4M206 116h11M48 117h1M77 117h3M93 117h1M123 117h4M165 117h8M182 117h2M189 117h4M202 117h1M206 117h11M48 118h1M57 118h3M77 118h3M93 118h1M122 118h1M173 118h2M184 118h1M188 118h1M202 118h15M48 119h1M77 119h3M93 119h1M122 119h1M169 119h6M184 119h5M202 119h15M61 120h3M77 120h3M93 120h1M173 120h1M193 120h1M198 120h19M61 121h3M77 121h3M93 121h1M173 121h1M193 121h1M198 121h19M77 122h3M93 122h1M109 122h1M113 122h1M193 122h24M65 123h4M77 123h3M93 123h1M109 123h1M113 123h1M193 123h24M77 124h3M93 124h1M105 124h8M185 124h32M70 125h3M77 125h3M93 125h1M184 125h1M189 125h28M77 126h3M93 126h1M105 126h4M184 126h33M74 127h4M93 127h1M184 127h33M41 128h4M93 128h1M104 128h1M184 128h33M40 129h1M93 129h1M100 129h1M180 129h37M93 130h1M100 130h1M180 130h37M175 131h25M206 131h11M175 132h25M206 132h11M100 133h1M171 133h25M199 133h1M204 133h1M206 133h11M100 134h1M171 134h25M199 134h1M204 134h1M206 134h11M48 135h5M102 135h2M163 135h28M208 135h9M104 136h1M162 136h1M167 136h24M209 136h8M162 137h29M209 137h8M162 138h22M209 138h8M162 139h23M186 139h1M209 139h8M43 140h4M62 140h1M113 140h1M153 140h1M158 140h22M188 140h1M211 140h6M43 141h2M110 141h3M153 141h1M158 141h22M188 141h1M211 141h6M43 142h2M48 142h1M153 142h23M211 142h6M43 143h2M48 143h1M153 143h23M211 143h6M43 144h2M118 144h1M144 144h1M149 144h22M189 144h2M205 144h4M213 144h4M43 145h4M54 145h4M71 145h1M144 145h1M149 145h22M213 145h4M54 146h2M72 146h4M123 146h4M140 146h27M204 146h1M213 146h4M48 147h1M54 147h2M59 147h1M144 147h23M213 147h4M59 148h1M127 148h4M136 148h4M143 148h23M213 148h4M59 149h1M68 149h1M131 149h1M135 149h1M140 149h20M168 149h1M213 149h4M68 150h1M135 150h1M140 150h27M168 150h1M206 150h1M213 150h4M61 151h1M66 151h5M136 151h20M168 151h1M206 151h11M46 152h1M66 152h1M136 152h20M168 152h1M206 152h11M66 153h1M82 153h1M134 153h17M168 153h1M202 153h15M66 154h1M72 154h4M82 154h1M134 154h17M168 154h1M202 154h15M74 155h2M82 155h1M134 155h13M185 155h4M197 155h20M70 156h1M74 156h2M82 156h1M134 156h13M198 156h19M74 157h2M82 157h1M134 157h11M146 157h1M184 157h1M193 157h7M204 157h13M74 158h2M82 158h1M133 158h12M146 158h1M193 158h7M204 158h13M82 159h1M133 159h11M146 159h1M193 159h7M204 159h13M82 160h1M133 160h9M146 160h1M171 160h1M191 160h7M206 160h11M54 161h4M63 161h4M82 161h1M133 161h9M146 161h1M171 161h1M191 161h7M206 161h11M67 162h1M82 162h1M133 162h9M171 162h1M186 162h5M206 162h11M53 163h1M82 163h1M133 163h9M171 163h1M186 163h5M206 163h11M82 164h1M133 164h9M182 164h7M206 164h12M82 165h1M133 165h9M182 165h7M206 165h12M49 166h1M82 166h1M133 166h9M163 166h4M178 166h4M204 166h14M82 167h1M133 167h9M162 167h1M178 167h4M204 167h14M82 168h1M133 168h9M162 168h1M173 168h9M202 168h16M133 169h9M173 169h7M202 169h16M133 170h9M173 170h7M202 170h16M133 171h9M171 171h2M200 171h18M50 172h1M59 172h3M68 172h3M76 172h4M133 172h9M171 172h2M200 172h18M133 173h9M167 173h4M198 173h20M133 174h9M167 174h4M198 174h20M50 175h1M57 175h3M68 175h3M76 175h4M98 175h4M133 175h9M153 175h7M162 175h7M195 175h20M56 176h1M133 176h9M153 176h7M162 176h7M195 176h20M51 177h1M133 177h14M153 177h9M193 177h18M133 178h14M153 178h9M193 178h18M133 179h18M153 179h9M191 179h19M133 180h18M153 180h7M191 180h16M80 181h1M107 181h4M133 181h18M153 181h7M191 181h15M73 182h1M111 182h1M115 182h1M133 182h23M189 182h13M52 183h1M115 183h1M133 183h23M189 183h13M133 184h23M182 184h2M187 184h11M233 184h1M133 185h23M182 185h2M186 185h12M233 185h1M69 186h4M107 186h1M133 186h23M164 186h1M178 186h6M186 186h7M73 187h1M133 187h23M178 187h6M186 187h7M112 188h3M133 188h23M173 188h11M65 189h1M115 189h1M133 189h23M173 189h11M115 190h1M133 190h23M172 190h12M43 191h1M115 191h1M133 191h23M171 191h9M191 191h1M103 192h4M115 192h1M133 192h23M171 192h9M115 193h1M133 193h23M171 193h5M182 193h2M48 194h3M75 194h3M115 194h1M133 194h23M171 194h5M182 194h2M196 194h4M225 194h3M242 194h1M53 195h2M115 195h1M133 195h23M171 195h2M182 195h2M202 195h4M229 195h4M238 195h3M111 196h1M133 196h23M171 196h2M182 196h2M78 197h1M91 197h1M93 197h1M105 197h4M133 197h21M171 197h5M182 197h2M133 198h21M171 198h5M182 198h2M233 198h1M110 199h3M133 199h20M171 199h4M178 199h6M210 199h1M64 200h1M109 200h1M113 200h1M133 200h12M171 200h2M178 200h4M232 200h1M100 201h1M110 201h3M133 201h12M171 201h2M177 201h6M213 201h1M65 202h1M104 202h1M133 202h7M171 202h2M175 202h9M190 202h1M104 203h1M133 203h7M171 203h3M175 203h9M133 204h7M171 204h11M133 205h7M171 205h11M191 205h1M79 206h3M113 206h1M133 206h7M171 206h7M186 206h2M196 206h3M214 206h3M113 207h1M133 207h7M171 207h7M114 208h4M133 208h7M171 208h3M133 209h7M171 209h2M133 210h7M171 210h2M179 210h1M133 211h7M179 211h1M133 212h7M95 213h1M126 213h1M133 213h7M126 214h1M133 214h7M133 215h3M133 216h3M149 222h1"]])\r
\r
#_(append-path map-tiles)\r
\r
(defn tile-1 [x y]\r
  (for [[color path] ground-tile-1]\r
    (append-path path color x y)))\r
\r
(defn tile-2 [x y]\r
  (for [[color path] ground-tile-2]\r
    (append-path path color x y)))\r
\r
#_(for [y (range -400 450 39)]\r
  (apply tile-1 (isometric->screen 1330 (+ y 6))))\r
\r
#_(for [x (range 475 1320 40)]\r
  (apply tile-2 (isometric->screen (- x 2) 458)))\r
\r
(defn factory [x y]\r
  (for [[color path] factory-button]\r
    (append-path path color x y 2)))\r
\r
#_(factory 0 0)\r
\r
`,confuzion=`(ns simlispy.confuzion)\r
\r
(defn bass1 [time]\r
  [{:time (+ time 0), :length 0.5, :pitch 71}\r
   {:time (+ time 1.5) :length 0.25, :pitch 71}\r
   {:time (+ time 2) :length 0.5, :pitch 71}\r
   {:time (+ time 3) :length 0.25, :pitch 73}\r
   {:time (+ time 3.5) :length 0.25, :pitch 69}\r
   {:time (+ time 4) :length 0.5, :pitch 69}\r
   {:time (+ time 5.5) :length 0.25, :pitch 69}\r
   {:time (+ time 6) :length 0.5, :pitch 69}\r
   {:time (+ time 8) :length 0.5, :pitch 64}\r
   {:time (+ time 9.5) :length 0.25, :pitch 64}\r
   {:time (+ time 10) :length 0.5, :pitch 64}\r
   {:time (+ time 12) :length 0.5, :pitch 64}\r
   {:time (+ time 13.5) :length 0.25, :pitch 64}\r
   {:time (+ time 14) :length 0.5, :pitch 64}])\r
\r
(defn bass2 [time]\r
  (map (fn [m] (update m :time #(+ % time)))\r
       [{:time 29.5, :length 0.5, :pitch 69}\r
        {:time 29, :length 0.5, :pitch 64}\r
        {:time 31, :length 0.25, :pitch 64}\r
        {:time 26, :length 0.5, :pitch 69}\r
        {:time 25.5, :length 0.25, :pitch 69}\r
        {:time 24, :length 0.5, :pitch 69}\r
        {:time 23, :length 0.5, :pitch 67}\r
        {:time 22.5, :length 0.5, :pitch 66}\r
        {:time 17.5, :length 0.25, :pitch 64}\r
        {:time 0, :length 0.5, :pitch 71}\r
        {:time 1.5, :length 0.25, :pitch 66}\r
        {:time 2, :length 0.25, :pitch 64}\r
        {:time 2.5, :length 0.5, :pitch 62}\r
        {:time 3.5, :length 0.5, :pitch 59}\r
        {:time 5.5, :length 0.25, :pitch 66}\r
        {:time 6, :length 0.5, :pitch 64}\r
        {:time 7, :length 0.5, :pitch 62}\r
        {:time 8, :length 0.5, :pitch 69}\r
        {:time 9.5, :length 0.25, :pitch 64}\r
        {:time 10, :length 0.25, :pitch 62}\r
        {:time 10.5, :length 0.5, :pitch 61}\r
        {:time 11.5, :length 0.5, :pitch 57}\r
        {:time 13.5, :length 0.25, :pitch 64}\r
        {:time 14, :length 0.5, :pitch 62}\r
        {:time 15, :length 0.5, :pitch 61}\r
        {:time 16, :length 0.5, :pitch 64}\r
        {:time 18.5, :length 0.5, :pitch 64}\r
        {:time 19, :length 0.25, :pitch 66}\r
        {:time 19.5, :length 0.5, :pitch 67}\r
        {:time 20.5, :length 0.25, :pitch 66}\r
        {:time 21, :length 0.25, :pitch 64}\r
        {:time 21.5, :length 0.5, :pitch 64}]))\r
\r
(defn bass3 [time]\r
  (map (fn [m] (update m :time #(+ % time)))\r
       [{:time 0, :length 0.5, :pitch 66}\r
        {:time 1.5, :length 0.25, :pitch 66}\r
        {:time 2, :length 0.5, :pitch 66}\r
        {:time 3, :length 0.5, :pitch 69}\r
        {:time 4, :length 0.5, :pitch 64}\r
        {:time 5.5, :length 0.25, :pitch 64}\r
        {:time 6, :length 0.5, :pitch 64}\r
        {:time 8, :length 0.5, :pitch 64}\r
        {:time 9.5, :length 0.25, :pitch 64}\r
        {:time 10, :length 0.5, :pitch 64}\r
        {:time 11, :length 0.5, :pitch 61}\r
        {:time 12, :length 0.5, :pitch 62}\r
        {:time 13.5, :length 0.25, :pitch 62}\r
        {:time 14, :length 0.5, :pitch 62}\r
        {:time 16, :length 0.5, :pitch 62}\r
        {:time 17.5, :length 0.25, :pitch 62}\r
        {:time 18, :length 0.5, :pitch 62}\r
        {:time 20, :length 0.5, :pitch 61}\r
        {:time 21.5, :length 0.25, :pitch 61}\r
        {:time 22, :length 0.5, :pitch 61}\r
        {:time 24, :length 0.5, :pitch 61}\r
        {:time 25.5, :length 0.5, :pitch 73}\r
        {:time 26.5, :length 0.25, :pitch 71}\r
        {:time 27, :length 0.25, :pitch 69}\r
        {:time 27.5, :length 0.25, :pitch 68}]))\r
\r
(defn bass4 [time]\r
  (map (fn [m] (update m :time #(+ % time)))\r
       [{:time 0, :length 0.5, :pitch 66}\r
        {:time 1.5, :length 0.25, :pitch 66}\r
        {:time 2, :length 0.5, :pitch 66}\r
        {:time 4, :length 0.5, :pitch 64}\r
        {:time 5.5, :length 0.25, :pitch 64}\r
        {:time 6, :length 0.5, :pitch 64}\r
        {:time 7, :length 0.5, :pitch 61}\r
        {:time 8, :length 0.5, :pitch 62}\r
        {:time 9.5, :length 0.25, :pitch 62}\r
        {:time 10, :length 0.5, :pitch 62}\r
        {:time 12, :length 0.5, :pitch 69}\r
        {:time 13.5, :length 0.25, :pitch 69}\r
        {:time 14, :length 0.5, :pitch 69}]))\r
\r
(defn bass5 [time]\r
  (map (fn [m] (update m :time #(+ % time)))\r
       [{:time 0, :length 0.5, :pitch 67}\r
        {:time 8, :length 0.5, :pitch 66}\r
        {:time 16, :length 0.5, :pitch 64}\r
        {:time 17, :length 0.5, :pitch 62}\r
        {:time 18, :length 0.5, :pitch 61}\r
        {:time 19, :length 0.5, :pitch 59}]))\r
\r
(defn bass6 [time]\r
  (map (fn [m] (update m :time #(+ % time)))\r
       [{:time 0, :length 0.5, :pitch 71}\r
        {:time 1.5, :length 0.25, :pitch 66}\r
        {:time 2, :length 0.25, :pitch 71}\r
        {:time 2.5, :length 0.5, :pitch 66}\r
        {:time 3.5, :length 0.25, :pitch 66}\r
        {:time 4, :length 0.5, :pitch 69}\r
        {:time 5.5, :length 0.25, :pitch 69}\r
        {:time 6, :length 0.5, :pitch 69}\r
        {:time 8, :length 0.5, :pitch 68}\r
        {:time 9.5, :length 0.25, :pitch 64}\r
        {:time 10, :length 0.25, :pitch 68}\r
        {:time 10.5, :length 0.5, :pitch 64}\r
        {:time 11.5, :length 0.25, :pitch 64}\r
        {:time 12, :length 0.5, :pitch 66}\r
        {:time 13.5, :length 0.25, :pitch 66}\r
        {:time 14, :length 0.5, :pitch 66}]))\r
\r
(defn bass7 [time]\r
  (map (fn [m] (update m :time #(+ % time)))\r
       [{:time 0, :length 0.5, :pitch 67}\r
        {:time 1, :length 0.25, :pitch 62}\r
        {:time 1.5, :length 0.25, :pitch 64}\r
        {:time 2, :length 0.25, :pitch 67}\r
        {:time 2.5, :length 0.25, :pitch 62}\r
        {:time 3, :length 0.25, :pitch 67}\r
        {:time 3.5, :length 0.25, :pitch 67}\r
        {:time 4, :length 0.5, :pitch 66}\r
        {:time 5.5, :length 0.25, :pitch 66}\r
        {:time 6, :length 0.5, :pitch 66}\r
        {:time 8, :length 0.5, :pitch 67}\r
        {:time 9, :length 0.25, :pitch 62}\r
        {:time 9.5, :length 0.25, :pitch 64}\r
        {:time 10, :length 0.25, :pitch 67}\r
        {:time 10.5, :length 0.25, :pitch 62}\r
        {:time 11, :length 0.25, :pitch 67}\r
        {:time 11.5, :length 0.25, :pitch 66}\r
        {:time 12, :length 0.5, :pitch 64}\r
        {:time 13.5, :length 0.25, :pitch 64}\r
        {:time 14, :length 0.5, :pitch 64}\r
        {:time 16, :length 0.5, :pitch 64}\r
        {:time 17.5, :length 0.25, :pitch 64}\r
        {:time 18, :length 0.5, :pitch 64}]))\r
\r
(def bass-pat-1\r
  (concat (bass1 0) (bass1 16) (bass2 32) (bass3 64) (bass4 92) (bass4 108) (bass5 124)))\r
\r
(def bass-pat-2\r
  (concat (bass6 144) (bass6 160) (bass7 176) (bass1 196) (bass1 212)))\r
\r
(def bass-pat-3\r
  (concat (bass2 228) (bass3 260) (bass4 288) (bass4 304) (bass5 320)))\r
\r
(def bass-pat-4\r
  (concat (bass6 340) (bass6 356) (bass7 372) (bass1 392) (bass1 408)))\r
\r
(def bass-pat-5\r
  (concat (bass1 424) (bass1 440) (bass1 456) (bass1 472) (bass1 488) (bass1 504) (bass1 520)))\r
\r
#_(def bass (concat bass-pat-1 bass-pat-2 bass-pat-3 bass-pat-4 bass-pat-5))\r
\r
(def bass [{:pitch 45\r
            :length 0.5\r
            :time 0}\r
           {:pitch 45\r
            :length 0.25\r
            :time 0.6}\r
           {:pitch 45\r
            :length 0.5\r
            :time 0.8}\r
           {:pitch 47\r
            :length 0.25\r
            :time 1.2}\r
           {:pitch 43\r
            :length 0.25\r
            :time 1.4}\r
           {:pitch 43\r
            :length 0.5\r
            :time 1.6}\r
           {:pitch 43\r
            :length 0.25\r
            :time 2.2}\r
           {:pitch 43\r
            :length 0.5\r
            :time 2.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 3.2}\r
           {:pitch 38\r
            :length 0.25\r
            :time 3.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 4.8}\r
           {:pitch 38\r
            :length 0.25\r
            :time 5.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 5.6}\r
           {:pitch 45\r
            :length 0.5\r
            :time 6.4}\r
           {:pitch 45\r
            :length 0.25\r
            :time 7}\r
           {:pitch 45\r
            :length 0.5\r
            :time 7.2}\r
           {:pitch 47\r
            :length 0.25\r
            :time 7.6}\r
           {:pitch 43\r
            :length 0.25\r
            :time 7.8}\r
           {:pitch 43\r
            :length 0.5\r
            :time 8}\r
           {:pitch 43\r
            :length 0.25\r
            :time 8.6}\r
           {:pitch 43\r
            :length 0.5\r
            :time 8.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 9.6}\r
           {:pitch 38\r
            :length 0.25\r
            :time 10.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 10.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 11.2}\r
           {:pitch 38\r
            :length 0.25\r
            :time 11.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 12}\r
           {:pitch 45\r
            :length 0.5\r
            :time 12.8}\r
           {:pitch 40\r
            :length 0.25\r
            :time 13.4}\r
           {:pitch 38\r
            :length 0.25\r
            :time 13.6}\r
           {:pitch 36\r
            :length 0.5\r
            :time 13.8}\r
           {:pitch 33\r
            :length 0.5\r
            :time 14.2}\r
           {:pitch 40\r
            :length 0.25\r
            :time 15}\r
           {:pitch 38\r
            :length 0.5\r
            :time 15.2}\r
           {:pitch 36\r
            :length 0.5\r
            :time 15.6}\r
           {:pitch 43\r
            :length 0.5\r
            :time 16}\r
           {:pitch 38\r
            :length 0.25\r
            :time 16.6}\r
           {:pitch 36\r
            :length 0.25\r
            :time 16.8}\r
           {:pitch 35\r
            :length 0.5\r
            :time 17}\r
           {:pitch 31\r
            :length 0.5\r
            :time 17.4}\r
           {:pitch 38\r
            :length 0.25\r
            :time 18.2}\r
           {:pitch 36\r
            :length 0.5\r
            :time 18.4}\r
           {:pitch 35\r
            :length 0.5\r
            :time 18.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 19.2}\r
           {:pitch 38\r
            :length 0.25\r
            :time 19.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 20.2}\r
           {:pitch 40\r
            :length 0.25\r
            :time 20.4}\r
           {:pitch 41\r
            :length 0.5\r
            :time 20.6}\r
           {:pitch 40\r
            :length 0.25\r
            :time 21}\r
           {:pitch 38\r
            :length 0.25\r
            :time 21.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 21.4}\r
           {:pitch 40\r
            :length 0.5\r
            :time 21.8}\r
           {:pitch 41\r
            :length 0.5\r
            :time 22}\r
           {:pitch 43\r
            :length 0.5\r
            :time 22.4}\r
           {:pitch 43\r
            :length 0.25\r
            :time 23}\r
           {:pitch 43\r
            :length 0.5\r
            :time 23.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 24.4}\r
           {:pitch 43\r
            :length 0.5\r
            :time 24.6}\r
           {:pitch 38\r
            :length 0.25\r
            :time 25.2}\r
           {:pitch 40\r
            :length 0.5\r
            :time 25.6}\r
           {:pitch 40\r
            :length 0.25\r
            :time 26.2}\r
           {:pitch 40\r
            :length 0.5\r
            :time 26.4}\r
           {:pitch 43\r
            :length 0.5\r
            :time 26.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 27.2}\r
           {:pitch 38\r
            :length 0.25\r
            :time 27.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 28}\r
           {:pitch 38\r
            :length 0.5\r
            :time 28.8}\r
           {:pitch 38\r
            :length 0.25\r
            :time 29.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 29.6}\r
           {:pitch 35\r
            :length 0.5\r
            :time 30}\r
           {:pitch 36\r
            :length 0.5\r
            :time 30.4}\r
           {:pitch 36\r
            :length 0.25\r
            :time 31}\r
           {:pitch 36\r
            :length 0.5\r
            :time 31.2}\r
           {:pitch 36\r
            :length 0.5\r
            :time 32}\r
           {:pitch 36\r
            :length 0.25\r
            :time 32.6}\r
           {:pitch 36\r
            :length 0.5\r
            :time 32.8}\r
           {:pitch 35\r
            :length 0.5\r
            :time 33.6}\r
           {:pitch 35\r
            :length 0.25\r
            :time 34.2}\r
           {:pitch 35\r
            :length 0.5\r
            :time 34.4}\r
           {:pitch 35\r
            :length 0.5\r
            :time 35.2}\r
           {:pitch 47\r
            :length 0.5\r
            :time 35.8}\r
           {:pitch 45\r
            :length 0.25\r
            :time 36.2}\r
           {:pitch 43\r
            :length 0.25\r
            :time 36.4}\r
           {:pitch 42\r
            :length 0.25\r
            :time 36.6}\r
           {:pitch 40\r
            :length 0.5\r
            :time 36.8}\r
           {:pitch 40\r
            :length 0.25\r
            :time 37.4}\r
           {:pitch 40\r
            :length 0.5\r
            :time 37.6}\r
           {:pitch 38\r
            :length 0.5\r
            :time 38.4}\r
           {:pitch 38\r
            :length 0.25\r
            :time 39}\r
           {:pitch 38\r
            :length 0.5\r
            :time 39.2}\r
           {:pitch 35\r
            :length 0.5\r
            :time 39.6}\r
           {:pitch 36\r
            :length 0.5\r
            :time 40}\r
           {:pitch 36\r
            :length 0.25\r
            :time 40.6}\r
           {:pitch 36\r
            :length 0.5\r
            :time 40.8}\r
           {:pitch 43\r
            :length 0.5\r
            :time 41.6}\r
           {:pitch 43\r
            :length 0.25\r
            :time 42.2}\r
           {:pitch 43\r
            :length 0.5\r
            :time 42.4}\r
           {:pitch 40\r
            :length 0.5\r
            :time 43.2}\r
           {:pitch 40\r
            :length 0.25\r
            :time 43.8}\r
           {:pitch 40\r
            :length 0.5\r
            :time 44}\r
           {:pitch 38\r
            :length 0.5\r
            :time 44.8}\r
           {:pitch 38\r
            :length 0.25\r
            :time 45.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 45.6}\r
           {:pitch 35\r
            :length 0.5\r
            :time 46}\r
           {:pitch 36\r
            :length 0.5\r
            :time 46.4}\r
           {:pitch 36\r
            :length 0.25\r
            :time 47}\r
           {:pitch 36\r
            :length 0.5\r
            :time 47.2}\r
           {:pitch 43\r
            :length 0.5\r
            :time 48}\r
           {:pitch 43\r
            :length 0.25\r
            :time 48.6}\r
           {:pitch 43\r
            :length 0.5\r
            :time 48.8}\r
           {:pitch 41\r
            :length 0.5\r
            :time 49.6}\r
           {:pitch 40\r
            :length 0.5\r
            :time 52.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 56}\r
           {:pitch 36\r
            :length 0.5\r
            :time 56.4}\r
           {:pitch 35\r
            :length 0.5\r
            :time 56.8}\r
           {:pitch 33\r
            :length 0.5\r
            :time 57.2}\r
           {:pitch 45\r
            :length 0.5\r
            :time 57.6}\r
           {:pitch 40\r
            :length 0.25\r
            :time 58.2}\r
           {:pitch 45\r
            :length 0.25\r
            :time 58.4}\r
           {:pitch 40\r
            :length 0.5\r
            :time 58.6}\r
           {:pitch 40\r
            :length 0.25\r
            :time 59}\r
           {:pitch 43\r
            :length 0.5\r
            :time 59.2}\r
           {:pitch 43\r
            :length 0.25\r
            :time 59.8}\r
           {:pitch 43\r
            :length 0.5\r
            :time 60}\r
           {:pitch 42\r
            :length 0.5\r
            :time 60.8}\r
           {:pitch 38\r
            :length 0.25\r
            :time 61.4}\r
           {:pitch 42\r
            :length 0.25\r
            :time 61.6}\r
           {:pitch 38\r
            :length 0.5\r
            :time 61.8}\r
           {:pitch 38\r
            :length 0.25\r
            :time 62.2}\r
           {:pitch 40\r
            :length 0.5\r
            :time 62.4}\r
           {:pitch 40\r
            :length 0.25\r
            :time 63}\r
           {:pitch 40\r
            :length 0.5\r
            :time 63.2}\r
           {:pitch 45\r
            :length 0.5\r
            :time 64}\r
           {:pitch 40\r
            :length 0.25\r
            :time 64.6}\r
           {:pitch 45\r
            :length 0.25\r
            :time 64.8}\r
           {:pitch 40\r
            :length 0.5\r
            :time 65}\r
           {:pitch 40\r
            :length 0.25\r
            :time 65.4}\r
           {:pitch 43\r
            :length 0.5\r
            :time 65.6}\r
           {:pitch 43\r
            :length 0.25\r
            :time 66.2}\r
           {:pitch 43\r
            :length 0.5\r
            :time 66.4}\r
           {:pitch 42\r
            :length 0.5\r
            :time 67.2}\r
           {:pitch 38\r
            :length 0.25\r
            :time 67.8}\r
           {:pitch 42\r
            :length 0.25\r
            :time 68}\r
           {:pitch 38\r
            :length 0.5\r
            :time 68.2}\r
           {:pitch 38\r
            :length 0.25\r
            :time 68.6}\r
           {:pitch 40\r
            :length 0.5\r
            :time 68.8}\r
           {:pitch 40\r
            :length 0.25\r
            :time 69.4}\r
           {:pitch 40\r
            :length 0.5\r
            :time 69.6}\r
           {:pitch 41\r
            :length 0.5\r
            :time 70.4}\r
           {:pitch 36\r
            :length 0.25\r
            :time 70.8}\r
           {:pitch 38\r
            :length 0.25\r
            :time 71}\r
           {:pitch 41\r
            :length 0.25\r
            :time 71.2}\r
           {:pitch 36\r
            :length 0.25\r
            :time 71.4}\r
           {:pitch 41\r
            :length 0.25\r
            :time 71.6}\r
           {:pitch 41\r
            :length 0.25\r
            :time 71.8}\r
           {:pitch 40\r
            :length 0.5\r
            :time 72}\r
           {:pitch 40\r
            :length 0.25\r
            :time 72.6}\r
           {:pitch 40\r
            :length 0.5\r
            :time 72.8}\r
           {:pitch 41\r
            :length 0.5\r
            :time 73.6}\r
           {:pitch 36\r
            :length 0.25\r
            :time 74}\r
           {:pitch 38\r
            :length 0.25\r
            :time 74.2}\r
           {:pitch 41\r
            :length 0.25\r
            :time 74.4}\r
           {:pitch 36\r
            :length 0.25\r
            :time 74.6}\r
           {:pitch 41\r
            :length 0.25\r
            :time 74.8}\r
           {:pitch 40\r
            :length 0.25\r
            :time 75}\r
           {:pitch 38\r
            :length 0.5\r
            :time 75.2}\r
           {:pitch 38\r
            :length 0.25\r
            :time 75.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 76}\r
           {:pitch 38\r
            :length 0.5\r
            :time 76.8}\r
           {:pitch 38\r
            :length 0.25\r
            :time 77.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 77.6}\r
           {:pitch 45\r
            :length 0.5\r
            :time 78.4}\r
           {:pitch 45\r
            :length 0.25\r
            :time 79}\r
           {:pitch 45\r
            :length 0.5\r
            :time 79.2}\r
           {:pitch 47\r
            :length 0.25\r
            :time 79.6}\r
           {:pitch 43\r
            :length 0.25\r
            :time 79.8}\r
           {:pitch 43\r
            :length 0.5\r
            :time 80}\r
           {:pitch 43\r
            :length 0.25\r
            :time 80.6}\r
           {:pitch 43\r
            :length 0.5\r
            :time 80.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 81.6}\r
           {:pitch 38\r
            :length 0.25\r
            :time 82.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 82.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 83.2}\r
           {:pitch 38\r
            :length 0.25\r
            :time 83.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 84}\r
           {:pitch 45\r
            :length 0.5\r
            :time 84.8}\r
           {:pitch 45\r
            :length 0.25\r
            :time 85.4}\r
           {:pitch 45\r
            :length 0.5\r
            :time 85.6}\r
           {:pitch 47\r
            :length 0.25\r
            :time 86}\r
           {:pitch 43\r
            :length 0.25\r
            :time 86.2}\r
           {:pitch 43\r
            :length 0.5\r
            :time 86.4}\r
           {:pitch 43\r
            :length 0.25\r
            :time 87}\r
           {:pitch 43\r
            :length 0.5\r
            :time 87.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 88}\r
           {:pitch 38\r
            :length 0.25\r
            :time 88.6}\r
           {:pitch 38\r
            :length 0.5\r
            :time 88.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 89.6}\r
           {:pitch 38\r
            :length 0.25\r
            :time 90.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 90.4}\r
           {:pitch 45\r
            :length 0.5\r
            :time 91.2}\r
           {:pitch 40\r
            :length 0.25\r
            :time 91.8}\r
           {:pitch 38\r
            :length 0.25\r
            :time 92}\r
           {:pitch 36\r
            :length 0.5\r
            :time 92.2}\r
           {:pitch 33\r
            :length 0.5\r
            :time 92.6}\r
           {:pitch 40\r
            :length 0.25\r
            :time 93.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 93.6}\r
           {:pitch 36\r
            :length 0.5\r
            :time 94}\r
           {:pitch 43\r
            :length 0.5\r
            :time 94.4}\r
           {:pitch 38\r
            :length 0.25\r
            :time 95}\r
           {:pitch 36\r
            :length 0.25\r
            :time 95.2}\r
           {:pitch 35\r
            :length 0.5\r
            :time 95.4}\r
           {:pitch 31\r
            :length 0.5\r
            :time 95.8}\r
           {:pitch 38\r
            :length 0.25\r
            :time 96.6}\r
           {:pitch 36\r
            :length 0.5\r
            :time 96.8}\r
           {:pitch 35\r
            :length 0.5\r
            :time 97.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 97.6}\r
           {:pitch 38\r
            :length 0.25\r
            :time 98.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 98.6}\r
           {:pitch 40\r
            :length 0.25\r
            :time 98.8}\r
           {:pitch 41\r
            :length 0.5\r
            :time 99}\r
           {:pitch 40\r
            :length 0.25\r
            :time 99.4}\r
           {:pitch 38\r
            :length 0.25\r
            :time 99.6}\r
           {:pitch 38\r
            :length 0.5\r
            :time 99.8}\r
           {:pitch 40\r
            :length 0.5\r
            :time 100.2}\r
           {:pitch 41\r
            :length 0.5\r
            :time 100.4}\r
           {:pitch 43\r
            :length 0.5\r
            :time 100.8}\r
           {:pitch 43\r
            :length 0.25\r
            :time 101.4}\r
           {:pitch 43\r
            :length 0.5\r
            :time 101.6}\r
           {:pitch 38\r
            :length 0.5\r
            :time 102.8}\r
           {:pitch 43\r
            :length 0.5\r
            :time 103}\r
           {:pitch 38\r
            :length 0.25\r
            :time 103.6}\r
           {:pitch 40\r
            :length 0.5\r
            :time 104}\r
           {:pitch 40\r
            :length 0.25\r
            :time 104.6}\r
           {:pitch 40\r
            :length 0.5\r
            :time 104.8}\r
           {:pitch 43\r
            :length 0.5\r
            :time 105.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 105.6}\r
           {:pitch 38\r
            :length 0.25\r
            :time 106.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 106.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 107.2}\r
           {:pitch 38\r
            :length 0.25\r
            :time 107.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 108}\r
           {:pitch 35\r
            :length 0.5\r
            :time 108.4}\r
           {:pitch 36\r
            :length 0.5\r
            :time 108.8}\r
           {:pitch 36\r
            :length 0.25\r
            :time 109.4}\r
           {:pitch 36\r
            :length 0.5\r
            :time 109.6}\r
           {:pitch 36\r
            :length 0.5\r
            :time 110.4}\r
           {:pitch 36\r
            :length 0.25\r
            :time 111}\r
           {:pitch 36\r
            :length 0.5\r
            :time 111.2}\r
           {:pitch 35\r
            :length 0.5\r
            :time 112}\r
           {:pitch 35\r
            :length 0.25\r
            :time 112.6}\r
           {:pitch 35\r
            :length 0.5\r
            :time 112.8}\r
           {:pitch 35\r
            :length 0.5\r
            :time 113.6}\r
           {:pitch 47\r
            :length 0.5\r
            :time 114.2}\r
           {:pitch 45\r
            :length 0.25\r
            :time 114.6}\r
           {:pitch 43\r
            :length 0.25\r
            :time 114.8}\r
           {:pitch 42\r
            :length 0.25\r
            :time 115}\r
           {:pitch 40\r
            :length 0.5\r
            :time 115.2}\r
           {:pitch 40\r
            :length 0.25\r
            :time 115.8}\r
           {:pitch 40\r
            :length 0.5\r
            :time 116}\r
           {:pitch 38\r
            :length 0.5\r
            :time 116.8}\r
           {:pitch 38\r
            :length 0.25\r
            :time 117.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 117.6}\r
           {:pitch 35\r
            :length 0.5\r
            :time 118}\r
           {:pitch 36\r
            :length 0.5\r
            :time 118.4}\r
           {:pitch 36\r
            :length 0.25\r
            :time 119}\r
           {:pitch 36\r
            :length 0.5\r
            :time 119.2}\r
           {:pitch 43\r
            :length 0.5\r
            :time 120}\r
           {:pitch 43\r
            :length 0.25\r
            :time 120.6}\r
           {:pitch 43\r
            :length 0.5\r
            :time 120.8}\r
           {:pitch 40\r
            :length 0.5\r
            :time 121.6}\r
           {:pitch 40\r
            :length 0.25\r
            :time 122.2}\r
           {:pitch 40\r
            :length 0.5\r
            :time 122.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 123.2}\r
           {:pitch 38\r
            :length 0.25\r
            :time 123.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 124}\r
           {:pitch 35\r
            :length 0.5\r
            :time 124.4}\r
           {:pitch 36\r
            :length 0.5\r
            :time 124.8}\r
           {:pitch 36\r
            :length 0.25\r
            :time 125.4}\r
           {:pitch 36\r
            :length 0.5\r
            :time 125.6}\r
           {:pitch 43\r
            :length 0.5\r
            :time 126.4}\r
           {:pitch 43\r
            :length 0.25\r
            :time 127}\r
           {:pitch 43\r
            :length 0.5\r
            :time 127.2}\r
           {:pitch 41\r
            :length 0.5\r
            :time 128}\r
           {:pitch 40\r
            :length 0.5\r
            :time 131.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 134.4}\r
           {:pitch 36\r
            :length 0.5\r
            :time 134.8}\r
           {:pitch 35\r
            :length 0.5\r
            :time 135.2}\r
           {:pitch 33\r
            :length 0.5\r
            :time 135.6}\r
           {:pitch 45\r
            :length 0.5\r
            :time 136}\r
           {:pitch 40\r
            :length 0.25\r
            :time 136.6}\r
           {:pitch 45\r
            :length 0.25\r
            :time 136.8}\r
           {:pitch 40\r
            :length 0.5\r
            :time 137}\r
           {:pitch 40\r
            :length 0.25\r
            :time 137.4}\r
           {:pitch 43\r
            :length 0.5\r
            :time 137.6}\r
           {:pitch 43\r
            :length 0.25\r
            :time 138.2}\r
           {:pitch 43\r
            :length 0.5\r
            :time 138.4}\r
           {:pitch 42\r
            :length 0.5\r
            :time 139.2}\r
           {:pitch 38\r
            :length 0.25\r
            :time 139.8}\r
           {:pitch 42\r
            :length 0.25\r
            :time 140}\r
           {:pitch 38\r
            :length 0.5\r
            :time 140.2}\r
           {:pitch 38\r
            :length 0.25\r
            :time 140.6}\r
           {:pitch 40\r
            :length 0.5\r
            :time 140.8}\r
           {:pitch 40\r
            :length 0.25\r
            :time 141.4}\r
           {:pitch 40\r
            :length 0.5\r
            :time 141.6}\r
           {:pitch 45\r
            :length 0.5\r
            :time 142.4}\r
           {:pitch 40\r
            :length 0.25\r
            :time 143}\r
           {:pitch 45\r
            :length 0.25\r
            :time 143.2}\r
           {:pitch 40\r
            :length 0.5\r
            :time 143.4}\r
           {:pitch 40\r
            :length 0.25\r
            :time 143.8}\r
           {:pitch 43\r
            :length 0.5\r
            :time 144}\r
           {:pitch 43\r
            :length 0.25\r
            :time 144.6}\r
           {:pitch 43\r
            :length 0.5\r
            :time 144.8}\r
           {:pitch 42\r
            :length 0.5\r
            :time 145.6}\r
           {:pitch 38\r
            :length 0.25\r
            :time 146.2}\r
           {:pitch 42\r
            :length 0.25\r
            :time 146.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 146.6}\r
           {:pitch 38\r
            :length 0.25\r
            :time 147}\r
           {:pitch 40\r
            :length 0.5\r
            :time 147.2}\r
           {:pitch 40\r
            :length 0.25\r
            :time 147.8}\r
           {:pitch 40\r
            :length 0.5\r
            :time 148}\r
           {:pitch 41\r
            :length 0.5\r
            :time 148.8}\r
           {:pitch 36\r
            :length 0.25\r
            :time 149.2}\r
           {:pitch 38\r
            :length 0.25\r
            :time 149.4}\r
           {:pitch 41\r
            :length 0.25\r
            :time 149.6}\r
           {:pitch 36\r
            :length 0.25\r
            :time 149.8}\r
           {:pitch 41\r
            :length 0.25\r
            :time 150}\r
           {:pitch 41\r
            :length 0.25\r
            :time 150.2}\r
           {:pitch 40\r
            :length 0.5\r
            :time 150.4}\r
           {:pitch 40\r
            :length 0.25\r
            :time 151}\r
           {:pitch 40\r
            :length 0.5\r
            :time 151.2}\r
           {:pitch 41\r
            :length 0.5\r
            :time 152}\r
           {:pitch 36\r
            :length 0.25\r
            :time 152.4}\r
           {:pitch 38\r
            :length 0.25\r
            :time 152.6}\r
           {:pitch 41\r
            :length 0.25\r
            :time 152.8}\r
           {:pitch 36\r
            :length 0.25\r
            :time 153}\r
           {:pitch 41\r
            :length 0.25\r
            :time 153.2}\r
           {:pitch 40\r
            :length 0.25\r
            :time 153.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 153.6}\r
           {:pitch 38\r
            :length 0.25\r
            :time 154.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 154.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 155.2}\r
           {:pitch 38\r
            :length 0.25\r
            :time 155.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 156}\r
           {:pitch 45\r
            :length 0.5\r
            :time 156.8}\r
           {:pitch 45\r
            :length 0.25\r
            :time 157.4}\r
           {:pitch 45\r
            :length 0.5\r
            :time 157.6}\r
           {:pitch 47\r
            :length 0.25\r
            :time 158}\r
           {:pitch 43\r
            :length 0.25\r
            :time 158.2}\r
           {:pitch 43\r
            :length 0.5\r
            :time 158.4}\r
           {:pitch 43\r
            :length 0.25\r
            :time 159}\r
           {:pitch 43\r
            :length 0.5\r
            :time 159.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 160}\r
           {:pitch 38\r
            :length 0.25\r
            :time 160.6}\r
           {:pitch 38\r
            :length 0.5\r
            :time 160.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 161.6}\r
           {:pitch 38\r
            :length 0.25\r
            :time 162.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 162.4}\r
           {:pitch 45\r
            :length 0.5\r
            :time 163.2}\r
           {:pitch 45\r
            :length 0.25\r
            :time 163.8}\r
           {:pitch 45\r
            :length 0.5\r
            :time 164}\r
           {:pitch 47\r
            :length 0.25\r
            :time 164.4}\r
           {:pitch 43\r
            :length 0.25\r
            :time 164.6}\r
           {:pitch 43\r
            :length 0.5\r
            :time 164.8}\r
           {:pitch 43\r
            :length 0.25\r
            :time 165.4}\r
           {:pitch 43\r
            :length 0.5\r
            :time 165.6}\r
           {:pitch 38\r
            :length 0.5\r
            :time 166.4}\r
           {:pitch 38\r
            :length 0.25\r
            :time 167}\r
           {:pitch 38\r
            :length 0.5\r
            :time 167.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 168}\r
           {:pitch 38\r
            :length 0.25\r
            :time 168.6}\r
           {:pitch 38\r
            :length 0.5\r
            :time 168.8}\r
           {:pitch 45\r
            :length 0.5\r
            :time 169.6}\r
           {:pitch 45\r
            :length 0.25\r
            :time 170.2}\r
           {:pitch 45\r
            :length 0.5\r
            :time 170.4}\r
           {:pitch 47\r
            :length 0.25\r
            :time 170.8}\r
           {:pitch 43\r
            :length 0.25\r
            :time 171}\r
           {:pitch 43\r
            :length 0.5\r
            :time 171.2}\r
           {:pitch 43\r
            :length 0.25\r
            :time 171.8}\r
           {:pitch 43\r
            :length 0.5\r
            :time 172}\r
           {:pitch 38\r
            :length 0.5\r
            :time 172.8}\r
           {:pitch 38\r
            :length 0.25\r
            :time 173.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 173.6}\r
           {:pitch 38\r
            :length 0.5\r
            :time 174.4}\r
           {:pitch 38\r
            :length 0.25\r
            :time 175}\r
           {:pitch 38\r
            :length 0.5\r
            :time 175.2}\r
           {:pitch 45\r
            :length 0.5\r
            :time 176}\r
           {:pitch 45\r
            :length 0.25\r
            :time 176.6}\r
           {:pitch 45\r
            :length 0.5\r
            :time 176.8}\r
           {:pitch 47\r
            :length 0.25\r
            :time 177.2}\r
           {:pitch 43\r
            :length 0.25\r
            :time 177.4}\r
           {:pitch 43\r
            :length 0.5\r
            :time 177.6}\r
           {:pitch 43\r
            :length 0.25\r
            :time 178.2}\r
           {:pitch 43\r
            :length 0.5\r
            :time 178.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 179.2}\r
           {:pitch 38\r
            :length 0.25\r
            :time 179.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 180}\r
           {:pitch 38\r
            :length 0.5\r
            :time 180.8}\r
           {:pitch 38\r
            :length 0.25\r
            :time 181.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 181.6}\r
           {:pitch 45\r
            :length 0.5\r
            :time 182.4}\r
           {:pitch 45\r
            :length 0.25\r
            :time 183}\r
           {:pitch 45\r
            :length 0.5\r
            :time 183.2}\r
           {:pitch 47\r
            :length 0.25\r
            :time 183.6}\r
           {:pitch 43\r
            :length 0.25\r
            :time 183.8}\r
           {:pitch 43\r
            :length 0.5\r
            :time 184}\r
           {:pitch 43\r
            :length 0.25\r
            :time 184.6}\r
           {:pitch 43\r
            :length 0.5\r
            :time 184.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 185.6}\r
           {:pitch 38\r
            :length 0.25\r
            :time 186.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 186.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 187.2}\r
           {:pitch 38\r
            :length 0.25\r
            :time 187.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 188}\r
           {:pitch 45\r
            :length 0.5\r
            :time 188.8}\r
           {:pitch 45\r
            :length 0.25\r
            :time 189.4}\r
           {:pitch 45\r
            :length 0.5\r
            :time 189.6}\r
           {:pitch 47\r
            :length 0.25\r
            :time 190}\r
           {:pitch 43\r
            :length 0.25\r
            :time 190.2}\r
           {:pitch 43\r
            :length 0.5\r
            :time 190.4}\r
           {:pitch 43\r
            :length 0.25\r
            :time 191}\r
           {:pitch 43\r
            :length 0.5\r
            :time 191.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 192}\r
           {:pitch 38\r
            :length 0.25\r
            :time 192.6}\r
           {:pitch 38\r
            :length 0.5\r
            :time 192.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 193.6}\r
           {:pitch 38\r
            :length 0.25\r
            :time 194.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 194.4}\r
           {:pitch 45\r
            :length 0.5\r
            :time 195.2}\r
           {:pitch 45\r
            :length 0.25\r
            :time 195.8}\r
           {:pitch 45\r
            :length 0.5\r
            :time 196}\r
           {:pitch 47\r
            :length 0.25\r
            :time 196.4}\r
           {:pitch 43\r
            :length 0.25\r
            :time 196.6}\r
           {:pitch 43\r
            :length 0.5\r
            :time 196.8}\r
           {:pitch 43\r
            :length 0.25\r
            :time 197.4}\r
           {:pitch 43\r
            :length 0.5\r
            :time 197.6}\r
           {:pitch 38\r
            :length 0.5\r
            :time 198.4}\r
           {:pitch 38\r
            :length 0.25\r
            :time 199}\r
           {:pitch 38\r
            :length 0.5\r
            :time 199.2}\r
           {:pitch 38\r
            :length 0.5\r
            :time 200}\r
           {:pitch 38\r
            :length 0.25\r
            :time 200.6}\r
           {:pitch 38\r
            :length 0.5\r
            :time 200.8}\r
           {:pitch 45\r
            :length 0.5\r
            :time 201.6}\r
           {:pitch 45\r
            :length 0.25\r
            :time 202.2}\r
           {:pitch 45\r
            :length 0.5\r
            :time 202.4}\r
           {:pitch 47\r
            :length 0.25\r
            :time 202.8}\r
           {:pitch 43\r
            :length 0.25\r
            :time 203}\r
           {:pitch 43\r
            :length 0.5\r
            :time 203.2}\r
           {:pitch 43\r
            :length 0.25\r
            :time 203.8}\r
           {:pitch 43\r
            :length 0.5\r
            :time 204}\r
           {:pitch 38\r
            :length 0.5\r
            :time 204.8}\r
           {:pitch 38\r
            :length 0.25\r
            :time 205.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 205.6}\r
           {:pitch 38\r
            :length 0.5\r
            :time 206.4}\r
           {:pitch 38\r
            :length 0.25\r
            :time 207}\r
           {:pitch 38\r
            :length 0.5\r
            :time 207.2}\r
           {:pitch 45\r
            :length 0.5\r
            :time 208}\r
           {:pitch 45\r
            :length 0.25\r
            :time 208.6}\r
           {:pitch 45\r
            :length 0.5\r
            :time 208.8}\r
           {:pitch 47\r
            :length 0.25\r
            :time 209.2}\r
           {:pitch 43\r
            :length 0.25\r
            :time 209.4}\r
           {:pitch 43\r
            :length 0.5\r
            :time 209.6}\r
           {:pitch 43\r
            :length 0.25\r
            :time 210.2}\r
           {:pitch 43\r
            :length 0.5\r
            :time 210.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 211.2}\r
           {:pitch 38\r
            :length 0.25\r
            :time 211.8}\r
           {:pitch 38\r
            :length 0.5\r
            :time 212}\r
           {:pitch 38\r
            :length 0.5\r
            :time 212.8}\r
           {:pitch 38\r
            :length 0.25\r
            :time 213.4}\r
           {:pitch 38\r
            :length 0.5\r
            :time 213.6}])\r
\r
(defn drums1 [time]\r
  (map (fn [m] (update m :time #(+ % time)))\r
       [{:time 15, :length 0.5, :pitch 67}\r
        {:time 14, :length 0.07, :pitch 77}\r
        {:time 13, :length 0.07, :pitch 77}\r
        {:time 12, :length 0.07, :pitch 77}\r
        {:time 11, :length 0.5, :pitch 67}\r
        {:time 10, :length 0.07, :pitch 77}\r
        {:time 9, :length 0.07, :pitch 77}\r
        {:time 8, :length 0.07, :pitch 77}\r
        {:time 7, :length 0.5, :pitch 67}\r
        {:time 6, :length 0.07, :pitch 77}\r
        {:time 5, :length 0.07, :pitch 77}\r
        {:time 4, :length 0.07, :pitch 77}\r
        {:time 3, :length 0.5, :pitch 67}\r
        {:time 2, :length 0.07, :pitch 77}\r
        {:time 1, :length 0.07, :pitch 77}\r
        {:time 0, :length 0.07, :pitch 77}]))\r
\r
(defn drums2 [time]\r
  (map (fn [m] (update m :time #(+ % time)))\r
       [{:time 7.5, :length 0.07, :pitch 77}\r
            {:time 7, :length 0.5, :pitch 67}\r
            {:time 6.5, :length 0.07, :pitch 77}\r
            {:time 6, :length 0.07, :pitch 77}\r
            {:time 5.5, :length 0.07, :pitch 77}\r
            {:time 5, :length 0.5, :pitch 67}\r
            {:time 4.5, :length 0.07, :pitch 77}\r
            {:time 4, :length 0.07, :pitch 77}\r
            {:time 3.5, :length 0.07, :pitch 77}\r
            {:time 3, :length 0.5, :pitch 67}\r
            {:time 2.5, :length 0.07, :pitch 77}\r
            {:time 2, :length 0.07, :pitch 77}\r
            {:time 1.5, :length 0.07, :pitch 77}\r
            {:time 1, :length 0.5, :pitch 67}\r
            {:time 0.5, :length 0.07, :pitch 77}\r
            {:time 0, :length 0.07, :pitch 77}]))\r
\r
(defn drums-pat-1 [time]\r
  (map (fn [m] (update m :time #(+ % time)))\r
       (concat (drums1 0) (drums1 16) (drums1 32) (drums1 48) (drums1 64) (drums1 80) (drums1 96) (drums1 112)\r
               [{:time 131, :length 0.5, :pitch 67}\r
            {:time 130, :length 0.07, :pitch 77}\r
            {:time 129, :length 0.07, :pitch 77}\r
            {:time 128, :length 0.07, :pitch 77}])))\r
\r
(defn drums-pat-2 [time]\r
  (map (fn [m] (update m :time #(+ % time)))\r
       (concat\r
        (drums2 132)\r
        (drums2 140)\r
        (drums2 148)\r
        (drums2 156)\r
        (drums2 164)\r
        (drums2 172)\r
        (drums2 180)\r
        (drums2 188))))\r
\r
#_(def drums (concat (drums-pat-1 0) (drums-pat-2 0) (drums-pat-1 196) (drums-pat-2 196) (drums-pat-2 260) (drums-pat-2 324) (drums2 520) (drums2 528)))\r
\r
(def drums [{:length 0.07\r
             :time 0}\r
            {:length 0.07\r
             :time 0.4}\r
            {:length 0.07\r
             :time 0.8}\r
            {:length 0.5\r
             :time 1.2}\r
            {:length 0.07\r
             :time 1.6}\r
            {:length 0.07\r
             :time 2}\r
            {:length 0.07\r
             :time 2.4}\r
            {:length 0.5\r
             :time 2.8}\r
            {:length 0.07\r
             :time 3.2}\r
            {:length 0.07\r
             :time 3.6}\r
            {:length 0.07\r
             :time 4}\r
            {:length 0.5\r
             :time 4.4}\r
            {:length 0.07\r
             :time 4.8}\r
            {:length 0.07\r
             :time 5.2}\r
            {:length 0.07\r
             :time 5.6}\r
            {:length 0.5\r
             :time 6}\r
            {:length 0.07\r
             :time 6.4}\r
            {:length 0.07\r
             :time 6.8}\r
            {:length 0.07\r
             :time 7.2}\r
            {:length 0.5\r
             :time 7.6}\r
            {:length 0.07\r
             :time 8}\r
            {:length 0.07\r
             :time 8.4}\r
            {:length 0.07\r
             :time 8.8}\r
            {:length 0.5\r
             :time 9.2}\r
            {:length 0.07\r
             :time 9.6}\r
            {:length 0.07\r
             :time 10}\r
            {:length 0.07\r
             :time 10.4}\r
            {:length 0.5\r
             :time 10.8}\r
            {:length 0.07\r
             :time 11.2}\r
            {:length 0.07\r
             :time 11.6}\r
            {:length 0.07\r
             :time 12}\r
            {:length 0.5\r
             :time 12.4}\r
            {:length 0.07\r
             :time 12.8}\r
            {:length 0.07\r
             :time 13.2}\r
            {:length 0.07\r
             :time 13.6}\r
            {:length 0.5\r
             :time 14}\r
            {:length 0.07\r
             :time 14.4}\r
            {:length 0.07\r
             :time 14.8}\r
            {:length 0.07\r
             :time 15.2}\r
            {:length 0.5\r
             :time 15.6}\r
            {:length 0.07\r
             :time 16}\r
            {:length 0.07\r
             :time 16.4}\r
            {:length 0.07\r
             :time 16.8}\r
            {:length 0.5\r
             :time 17.2}\r
            {:length 0.07\r
             :time 17.6}\r
            {:length 0.07\r
             :time 18}\r
            {:length 0.07\r
             :time 18.4}\r
            {:length 0.5\r
             :time 18.8}\r
            {:length 0.07\r
             :time 19.2}\r
            {:length 0.07\r
             :time 19.6}\r
            {:length 0.07\r
             :time 20}\r
            {:length 0.5\r
             :time 20.4}\r
            {:length 0.07\r
             :time 20.8}\r
            {:length 0.07\r
             :time 21.2}\r
            {:length 0.07\r
             :time 21.6}\r
            {:length 0.5\r
             :time 22}\r
            {:length 0.07\r
             :time 22.4}\r
            {:length 0.07\r
             :time 22.8}\r
            {:length 0.07\r
             :time 23.2}\r
            {:length 0.5\r
             :time 23.6}\r
            {:length 0.07\r
             :time 24}\r
            {:length 0.07\r
             :time 24.4}\r
            {:length 0.07\r
             :time 24.8}\r
            {:length 0.5\r
             :time 25.2}\r
            {:length 0.07\r
             :time 25.6}\r
            {:length 0.07\r
             :time 26}\r
            {:length 0.07\r
             :time 26.4}\r
            {:length 0.5\r
             :time 26.8}\r
            {:length 0.07\r
             :time 27.2}\r
            {:length 0.07\r
             :time 27.6}\r
            {:length 0.07\r
             :time 28}\r
            {:length 0.5\r
             :time 28.4}\r
            {:length 0.07\r
             :time 28.8}\r
            {:length 0.07\r
             :time 29.2}\r
            {:length 0.07\r
             :time 29.6}\r
            {:length 0.5\r
             :time 30}\r
            {:length 0.07\r
             :time 30.4}\r
            {:length 0.07\r
             :time 30.8}\r
            {:length 0.07\r
             :time 31.2}\r
            {:length 0.5\r
             :time 31.6}\r
            {:length 0.07\r
             :time 32}\r
            {:length 0.07\r
             :time 32.4}\r
            {:length 0.07\r
             :time 32.8}\r
            {:length 0.5\r
             :time 33.2}\r
            {:length 0.07\r
             :time 33.6}\r
            {:length 0.07\r
             :time 34}\r
            {:length 0.07\r
             :time 34.4}\r
            {:length 0.5\r
             :time 34.8}\r
            {:length 0.07\r
             :time 35.2}\r
            {:length 0.07\r
             :time 35.6}\r
            {:length 0.07\r
             :time 36}\r
            {:length 0.5\r
             :time 36.4}\r
            {:length 0.07\r
             :time 36.8}\r
            {:length 0.07\r
             :time 37.2}\r
            {:length 0.07\r
             :time 37.6}\r
            {:length 0.5\r
             :time 38}\r
            {:length 0.07\r
             :time 38.4}\r
            {:length 0.07\r
             :time 38.8}\r
            {:length 0.07\r
             :time 39.2}\r
            {:length 0.5\r
             :time 39.6}\r
            {:length 0.07\r
             :time 40}\r
            {:length 0.07\r
             :time 40.4}\r
            {:length 0.07\r
             :time 40.8}\r
            {:length 0.5\r
             :time 41.2}\r
            {:length 0.07\r
             :time 41.6}\r
            {:length 0.07\r
             :time 42}\r
            {:length 0.07\r
             :time 42.4}\r
            {:length 0.5\r
             :time 42.8}\r
            {:length 0.07\r
             :time 43.2}\r
            {:length 0.07\r
             :time 43.6}\r
            {:length 0.07\r
             :time 44}\r
            {:length 0.5\r
             :time 44.4}\r
            {:length 0.07\r
             :time 44.8}\r
            {:length 0.07\r
             :time 45.2}\r
            {:length 0.07\r
             :time 45.6}\r
            {:length 0.5\r
             :time 46}\r
            {:length 0.07\r
             :time 46.4}\r
            {:length 0.07\r
             :time 46.8}\r
            {:length 0.07\r
             :time 47.2}\r
            {:length 0.5\r
             :time 47.6}\r
            {:length 0.07\r
             :time 48}\r
            {:length 0.07\r
             :time 48.4}\r
            {:length 0.07\r
             :time 48.8}\r
            {:length 0.5\r
             :time 49.2}\r
            {:length 0.07\r
             :time 49.6}\r
            {:length 0.07\r
             :time 50}\r
            {:length 0.07\r
             :time 50.4}\r
            {:length 0.5\r
             :time 50.8}\r
            {:length 0.07\r
             :time 51.2}\r
            {:length 0.07\r
             :time 51.6}\r
            {:length 0.07\r
             :time 52}\r
            {:length 0.5\r
             :time 52.4}\r
            {:length 0.07\r
             :time 52.8}\r
            {:length 0.07\r
             :time 53}\r
            {:length 0.5\r
             :time 53.2}\r
            {:length 0.07\r
             :time 53.4}\r
            {:length 0.07\r
             :time 53.6}\r
            {:length 0.07\r
             :time 53.8}\r
            {:length 0.5\r
             :time 54}\r
            {:length 0.07\r
             :time 54.2}\r
            {:length 0.07\r
             :time 54.4}\r
            {:length 0.07\r
             :time 54.6}\r
            {:length 0.5\r
             :time 54.8}\r
            {:length 0.07\r
             :time 55}\r
            {:length 0.07\r
             :time 55.2}\r
            {:length 0.07\r
             :time 55.4}\r
            {:length 0.5\r
             :time 55.6}\r
            {:length 0.07\r
             :time 55.8}\r
            {:length 0.07\r
             :time 56}\r
            {:length 0.07\r
             :time 56.2}\r
            {:length 0.5\r
             :time 56.4}\r
            {:length 0.07\r
             :time 56.6}\r
            {:length 0.07\r
             :time 56.8}\r
            {:length 0.07\r
             :time 57}\r
            {:length 0.5\r
             :time 57.2}\r
            {:length 0.07\r
             :time 57.4}\r
            {:length 0.07\r
             :time 57.6}\r
            {:length 0.07\r
             :time 57.8}\r
            {:length 0.5\r
             :time 58}\r
            {:length 0.07\r
             :time 58.2}\r
            {:length 0.07\r
             :time 58.4}\r
            {:length 0.07\r
             :time 58.6}\r
            {:length 0.5\r
             :time 58.8}\r
            {:length 0.07\r
             :time 59}\r
            {:length 0.07\r
             :time 59.2}\r
            {:length 0.07\r
             :time 59.4}\r
            {:length 0.5\r
             :time 59.6}\r
            {:length 0.07\r
             :time 59.8}\r
            {:length 0.07\r
             :time 60}\r
            {:length 0.07\r
             :time 60.2}\r
            {:length 0.5\r
             :time 60.4}\r
            {:length 0.07\r
             :time 60.6}\r
            {:length 0.07\r
             :time 60.8}\r
            {:length 0.07\r
             :time 61}\r
            {:length 0.5\r
             :time 61.2}\r
            {:length 0.07\r
             :time 61.4}\r
            {:length 0.07\r
             :time 61.6}\r
            {:length 0.07\r
             :time 61.8}\r
            {:length 0.5\r
             :time 62}\r
            {:length 0.07\r
             :time 62.2}\r
            {:length 0.07\r
             :time 62.4}\r
            {:length 0.07\r
             :time 62.6}\r
            {:length 0.5\r
             :time 62.8}\r
            {:length 0.07\r
             :time 63}\r
            {:length 0.07\r
             :time 63.2}\r
            {:length 0.07\r
             :time 63.4}\r
            {:length 0.5\r
             :time 63.6}\r
            {:length 0.07\r
             :time 63.8}\r
            {:length 0.07\r
             :time 64}\r
            {:length 0.07\r
             :time 64.2}\r
            {:length 0.5\r
             :time 64.4}\r
            {:length 0.07\r
             :time 64.6}\r
            {:length 0.07\r
             :time 64.8}\r
            {:length 0.07\r
             :time 65}\r
            {:length 0.5\r
             :time 65.2}\r
            {:length 0.07\r
             :time 65.4}\r
            {:length 0.07\r
             :time 65.6}\r
            {:length 0.07\r
             :time 65.8}\r
            {:length 0.5\r
             :time 66}\r
            {:length 0.07\r
             :time 66.2}\r
            {:length 0.07\r
             :time 66.4}\r
            {:length 0.07\r
             :time 66.6}\r
            {:length 0.5\r
             :time 66.8}\r
            {:length 0.07\r
             :time 67}\r
            {:length 0.07\r
             :time 67.2}\r
            {:length 0.07\r
             :time 67.4}\r
            {:length 0.5\r
             :time 67.6}\r
            {:length 0.07\r
             :time 67.8}\r
            {:length 0.07\r
             :time 68}\r
            {:length 0.07\r
             :time 68.2}\r
            {:length 0.5\r
             :time 68.4}\r
            {:length 0.07\r
             :time 68.6}\r
            {:length 0.07\r
             :time 68.8}\r
            {:length 0.07\r
             :time 69}\r
            {:length 0.5\r
             :time 69.2}\r
            {:length 0.07\r
             :time 69.4}\r
            {:length 0.07\r
             :time 69.6}\r
            {:length 0.07\r
             :time 69.8}\r
            {:length 0.5\r
             :time 70}\r
            {:length 0.07\r
             :time 70.2}\r
            {:length 0.07\r
             :time 70.4}\r
            {:length 0.07\r
             :time 70.6}\r
            {:length 0.5\r
             :time 70.8}\r
            {:length 0.07\r
             :time 71}\r
            {:length 0.07\r
             :time 71.2}\r
            {:length 0.07\r
             :time 71.4}\r
            {:length 0.5\r
             :time 71.6}\r
            {:length 0.07\r
             :time 71.8}\r
            {:length 0.07\r
             :time 72}\r
            {:length 0.07\r
             :time 72.2}\r
            {:length 0.5\r
             :time 72.4}\r
            {:length 0.07\r
             :time 72.6}\r
            {:length 0.07\r
             :time 72.8}\r
            {:length 0.07\r
             :time 73}\r
            {:length 0.5\r
             :time 73.2}\r
            {:length 0.07\r
             :time 73.4}\r
            {:length 0.07\r
             :time 73.6}\r
            {:length 0.07\r
             :time 73.8}\r
            {:length 0.5\r
             :time 74}\r
            {:length 0.07\r
             :time 74.2}\r
            {:length 0.07\r
             :time 74.4}\r
            {:length 0.07\r
             :time 74.6}\r
            {:length 0.5\r
             :time 74.8}\r
            {:length 0.07\r
             :time 75}\r
            {:length 0.07\r
             :time 75.2}\r
            {:length 0.07\r
             :time 75.4}\r
            {:length 0.5\r
             :time 75.6}\r
            {:length 0.07\r
             :time 75.8}\r
            {:length 0.07\r
             :time 76}\r
            {:length 0.07\r
             :time 76.2}\r
            {:length 0.5\r
             :time 76.4}\r
            {:length 0.07\r
             :time 76.6}\r
            {:length 0.07\r
             :time 76.8}\r
            {:length 0.07\r
             :time 77}\r
            {:length 0.5\r
             :time 77.2}\r
            {:length 0.07\r
             :time 77.4}\r
            {:length 0.07\r
             :time 77.6}\r
            {:length 0.07\r
             :time 77.8}\r
            {:length 0.5\r
             :time 78}\r
            {:length 0.07\r
             :time 78.2}\r
            {:length 0.07\r
             :time 78.4}\r
            {:length 0.07\r
             :time 78.8}\r
            {:length 0.07\r
             :time 79.2}\r
            {:length 0.5\r
             :time 79.6}\r
            {:length 0.07\r
             :time 80}\r
            {:length 0.07\r
             :time 80.4}\r
            {:length 0.07\r
             :time 80.8}\r
            {:length 0.5\r
             :time 81.2}\r
            {:length 0.07\r
             :time 81.6}\r
            {:length 0.07\r
             :time 82}\r
            {:length 0.07\r
             :time 82.4}\r
            {:length 0.5\r
             :time 82.8}\r
            {:length 0.07\r
             :time 83.2}\r
            {:length 0.07\r
             :time 83.6}\r
            {:length 0.07\r
             :time 84}\r
            {:length 0.5\r
             :time 84.4}\r
            {:length 0.07\r
             :time 84.8}\r
            {:length 0.07\r
             :time 85.2}\r
            {:length 0.07\r
             :time 85.6}\r
            {:length 0.5\r
             :time 86}\r
            {:length 0.07\r
             :time 86.4}\r
            {:length 0.07\r
             :time 86.8}\r
            {:length 0.07\r
             :time 87.2}\r
            {:length 0.5\r
             :time 87.6}\r
            {:length 0.07\r
             :time 88}\r
            {:length 0.07\r
             :time 88.4}\r
            {:length 0.07\r
             :time 88.8}\r
            {:length 0.5\r
             :time 89.2}\r
            {:length 0.07\r
             :time 89.6}\r
            {:length 0.07\r
             :time 90}\r
            {:length 0.07\r
             :time 90.4}\r
            {:length 0.5\r
             :time 90.8}\r
            {:length 0.07\r
             :time 91.2}\r
            {:length 0.07\r
             :time 91.6}\r
            {:length 0.07\r
             :time 92}\r
            {:length 0.5\r
             :time 92.4}\r
            {:length 0.07\r
             :time 92.8}\r
            {:length 0.07\r
             :time 93.2}\r
            {:length 0.07\r
             :time 93.6}\r
            {:length 0.5\r
             :time 94}\r
            {:length 0.07\r
             :time 94.4}\r
            {:length 0.07\r
             :time 94.8}\r
            {:length 0.07\r
             :time 95.2}\r
            {:length 0.5\r
             :time 95.6}\r
            {:length 0.07\r
             :time 96}\r
            {:length 0.07\r
             :time 96.4}\r
            {:length 0.07\r
             :time 96.8}\r
            {:length 0.5\r
             :time 97.2}\r
            {:length 0.07\r
             :time 97.6}\r
            {:length 0.07\r
             :time 98}\r
            {:length 0.07\r
             :time 98.4}\r
            {:length 0.5\r
             :time 98.8}\r
            {:length 0.07\r
             :time 99.2}\r
            {:length 0.07\r
             :time 99.6}\r
            {:length 0.07\r
             :time 100}\r
            {:length 0.5\r
             :time 100.4}\r
            {:length 0.07\r
             :time 100.8}\r
            {:length 0.07\r
             :time 101.2}\r
            {:length 0.07\r
             :time 101.6}\r
            {:length 0.5\r
             :time 102}\r
            {:length 0.07\r
             :time 102.4}\r
            {:length 0.07\r
             :time 102.8}\r
            {:length 0.07\r
             :time 103.2}\r
            {:length 0.5\r
             :time 103.6}\r
            {:length 0.07\r
             :time 104}\r
            {:length 0.07\r
             :time 104.4}\r
            {:length 0.07\r
             :time 104.8}\r
            {:length 0.5\r
             :time 105.2}\r
            {:length 0.07\r
             :time 105.6}\r
            {:length 0.07\r
             :time 106}\r
            {:length 0.07\r
             :time 106.4}\r
            {:length 0.5\r
             :time 106.8}\r
            {:length 0.07\r
             :time 107.2}\r
            {:length 0.07\r
             :time 107.6}\r
            {:length 0.07\r
             :time 108}\r
            {:length 0.5\r
             :time 108.4}\r
            {:length 0.07\r
             :time 108.8}\r
            {:length 0.07\r
             :time 109.2}\r
            {:length 0.07\r
             :time 109.6}\r
            {:length 0.5\r
             :time 110}\r
            {:length 0.07\r
             :time 110.4}\r
            {:length 0.07\r
             :time 110.8}\r
            {:length 0.07\r
             :time 111.2}\r
            {:length 0.5\r
             :time 111.6}\r
            {:length 0.07\r
             :time 112}\r
            {:length 0.07\r
             :time 112.4}\r
            {:length 0.07\r
             :time 112.8}\r
            {:length 0.5\r
             :time 113.2}\r
            {:length 0.07\r
             :time 113.6}\r
            {:length 0.07\r
             :time 114}\r
            {:length 0.07\r
             :time 114.4}\r
            {:length 0.5\r
             :time 114.8}\r
            {:length 0.07\r
             :time 115.2}\r
            {:length 0.07\r
             :time 115.6}\r
            {:length 0.07\r
             :time 116}\r
            {:length 0.5\r
             :time 116.4}\r
            {:length 0.07\r
             :time 116.8}\r
            {:length 0.07\r
             :time 117.2}\r
            {:length 0.07\r
             :time 117.6}\r
            {:length 0.5\r
             :time 118}\r
            {:length 0.07\r
             :time 118.4}\r
            {:length 0.07\r
             :time 118.8}\r
            {:length 0.07\r
             :time 119.2}\r
            {:length 0.5\r
             :time 119.6}\r
            {:length 0.07\r
             :time 120}\r
            {:length 0.07\r
             :time 120.4}\r
            {:length 0.07\r
             :time 120.8}\r
            {:length 0.5\r
             :time 121.2}\r
            {:length 0.07\r
             :time 121.6}\r
            {:length 0.07\r
             :time 122}\r
            {:length 0.07\r
             :time 122.4}\r
            {:length 0.5\r
             :time 122.8}\r
            {:length 0.07\r
             :time 123.2}\r
            {:length 0.07\r
             :time 123.6}\r
            {:length 0.07\r
             :time 124}\r
            {:length 0.5\r
             :time 124.4}\r
            {:length 0.07\r
             :time 124.8}\r
            {:length 0.07\r
             :time 125.2}\r
            {:length 0.07\r
             :time 125.6}\r
            {:length 0.5\r
             :time 126}\r
            {:length 0.07\r
             :time 126.4}\r
            {:length 0.07\r
             :time 126.8}\r
            {:length 0.07\r
             :time 127.2}\r
            {:length 0.5\r
             :time 127.6}\r
            {:length 0.07\r
             :time 128}\r
            {:length 0.07\r
             :time 128.4}\r
            {:length 0.07\r
             :time 128.8}\r
            {:length 0.5\r
             :time 129.2}\r
            {:length 0.07\r
             :time 129.6}\r
            {:length 0.07\r
             :time 130}\r
            {:length 0.07\r
             :time 130.4}\r
            {:length 0.5\r
             :time 130.8}\r
            {:length 0.07\r
             :time 131.2}\r
            {:length 0.07\r
             :time 131.4}\r
            {:length 0.5\r
             :time 131.6}\r
            {:length 0.07\r
             :time 131.8}\r
            {:length 0.07\r
             :time 132}\r
            {:length 0.07\r
             :time 132.2}\r
            {:length 0.5\r
             :time 132.4}\r
            {:length 0.07\r
             :time 132.6}\r
            {:length 0.07\r
             :time 132.8}\r
            {:length 0.07\r
             :time 133}\r
            {:length 0.5\r
             :time 133.2}\r
            {:length 0.07\r
             :time 133.4}\r
            {:length 0.07\r
             :time 133.6}\r
            {:length 0.07\r
             :time 133.8}\r
            {:length 0.5\r
             :time 134}\r
            {:length 0.07\r
             :time 134.2}\r
            {:length 0.07\r
             :time 134.4}\r
            {:length 0.07\r
             :time 134.6}\r
            {:length 0.5\r
             :time 134.8}\r
            {:length 0.07\r
             :time 135}\r
            {:length 0.07\r
             :time 135.2}\r
            {:length 0.07\r
             :time 135.4}\r
            {:length 0.5\r
             :time 135.6}\r
            {:length 0.07\r
             :time 135.8}\r
            {:length 0.07\r
             :time 136}\r
            {:length 0.07\r
             :time 136.2}\r
            {:length 0.5\r
             :time 136.4}\r
            {:length 0.07\r
             :time 136.6}\r
            {:length 0.07\r
             :time 136.8}\r
            {:length 0.07\r
             :time 137}\r
            {:length 0.5\r
             :time 137.2}\r
            {:length 0.07\r
             :time 137.4}\r
            {:length 0.07\r
             :time 137.6}\r
            {:length 0.07\r
             :time 137.8}\r
            {:length 0.5\r
             :time 138}\r
            {:length 0.07\r
             :time 138.2}\r
            {:length 0.07\r
             :time 138.4}\r
            {:length 0.07\r
             :time 138.6}\r
            {:length 0.5\r
             :time 138.8}\r
            {:length 0.07\r
             :time 139}\r
            {:length 0.07\r
             :time 139.2}\r
            {:length 0.07\r
             :time 139.4}\r
            {:length 0.5\r
             :time 139.6}\r
            {:length 0.07\r
             :time 139.8}\r
            {:length 0.07\r
             :time 140}\r
            {:length 0.07\r
             :time 140.2}\r
            {:length 0.5\r
             :time 140.4}\r
            {:length 0.07\r
             :time 140.6}\r
            {:length 0.07\r
             :time 140.8}\r
            {:length 0.07\r
             :time 141}\r
            {:length 0.5\r
             :time 141.2}\r
            {:length 0.07\r
             :time 141.4}\r
            {:length 0.07\r
             :time 141.6}\r
            {:length 0.07\r
             :time 141.8}\r
            {:length 0.5\r
             :time 142}\r
            {:length 0.07\r
             :time 142.2}\r
            {:length 0.07\r
             :time 142.4}\r
            {:length 0.07\r
             :time 142.6}\r
            {:length 0.5\r
             :time 142.8}\r
            {:length 0.07\r
             :time 143}\r
            {:length 0.07\r
             :time 143.2}\r
            {:length 0.07\r
             :time 143.4}\r
            {:length 0.5\r
             :time 143.6}\r
            {:length 0.07\r
             :time 143.8}\r
            {:length 0.07\r
             :time 144}\r
            {:length 0.07\r
             :time 144.2}\r
            {:length 0.5\r
             :time 144.4}\r
            {:length 0.07\r
             :time 144.6}\r
            {:length 0.07\r
             :time 144.8}\r
            {:length 0.07\r
             :time 145}\r
            {:length 0.5\r
             :time 145.2}\r
            {:length 0.07\r
             :time 145.4}\r
            {:length 0.07\r
             :time 145.6}\r
            {:length 0.07\r
             :time 145.8}\r
            {:length 0.5\r
             :time 146}\r
            {:length 0.07\r
             :time 146.2}\r
            {:length 0.07\r
             :time 146.4}\r
            {:length 0.07\r
             :time 146.6}\r
            {:length 0.5\r
             :time 146.8}\r
            {:length 0.07\r
             :time 147}\r
            {:length 0.07\r
             :time 147.2}\r
            {:length 0.07\r
             :time 147.4}\r
            {:length 0.5\r
             :time 147.6}\r
            {:length 0.07\r
             :time 147.8}\r
            {:length 0.07\r
             :time 148}\r
            {:length 0.07\r
             :time 148.2}\r
            {:length 0.5\r
             :time 148.4}\r
            {:length 0.07\r
             :time 148.6}\r
            {:length 0.07\r
             :time 148.8}\r
            {:length 0.07\r
             :time 149}\r
            {:length 0.5\r
             :time 149.2}\r
            {:length 0.07\r
             :time 149.4}\r
            {:length 0.07\r
             :time 149.6}\r
            {:length 0.07\r
             :time 149.8}\r
            {:length 0.5\r
             :time 150}\r
            {:length 0.07\r
             :time 150.2}\r
            {:length 0.07\r
             :time 150.4}\r
            {:length 0.07\r
             :time 150.6}\r
            {:length 0.5\r
             :time 150.8}\r
            {:length 0.07\r
             :time 151}\r
            {:length 0.07\r
             :time 151.2}\r
            {:length 0.07\r
             :time 151.4}\r
            {:length 0.5\r
             :time 151.6}\r
            {:length 0.07\r
             :time 151.8}\r
            {:length 0.07\r
             :time 152}\r
            {:length 0.07\r
             :time 152.2}\r
            {:length 0.5\r
             :time 152.4}\r
            {:length 0.07\r
             :time 152.6}\r
            {:length 0.07\r
             :time 152.8}\r
            {:length 0.07\r
             :time 153}\r
            {:length 0.5\r
             :time 153.2}\r
            {:length 0.07\r
             :time 153.4}\r
            {:length 0.07\r
             :time 153.6}\r
            {:length 0.07\r
             :time 153.8}\r
            {:length 0.5\r
             :time 154}\r
            {:length 0.07\r
             :time 154.2}\r
            {:length 0.07\r
             :time 154.4}\r
            {:length 0.07\r
             :time 154.6}\r
            {:length 0.5\r
             :time 154.8}\r
            {:length 0.07\r
             :time 155}\r
            {:length 0.07\r
             :time 155.2}\r
            {:length 0.07\r
             :time 155.4}\r
            {:length 0.5\r
             :time 155.6}\r
            {:length 0.07\r
             :time 155.8}\r
            {:length 0.07\r
             :time 156}\r
            {:length 0.07\r
             :time 156.2}\r
            {:length 0.5\r
             :time 156.4}\r
            {:length 0.07\r
             :time 156.6}\r
            {:length 0.07\r
             :time 156.8}\r
            {:length 0.07\r
             :time 157}\r
            {:length 0.5\r
             :time 157.2}\r
            {:length 0.07\r
             :time 157.4}\r
            {:length 0.07\r
             :time 157.6}\r
            {:length 0.07\r
             :time 157.8}\r
            {:length 0.5\r
             :time 158}\r
            {:length 0.07\r
             :time 158.2}\r
            {:length 0.07\r
             :time 158.4}\r
            {:length 0.07\r
             :time 158.6}\r
            {:length 0.5\r
             :time 158.8}\r
            {:length 0.07\r
             :time 159}\r
            {:length 0.07\r
             :time 159.2}\r
            {:length 0.07\r
             :time 159.4}\r
            {:length 0.5\r
             :time 159.6}\r
            {:length 0.07\r
             :time 159.8}\r
            {:length 0.07\r
             :time 160}\r
            {:length 0.07\r
             :time 160.2}\r
            {:length 0.5\r
             :time 160.4}\r
            {:length 0.07\r
             :time 160.6}\r
            {:length 0.07\r
             :time 160.8}\r
            {:length 0.07\r
             :time 161}\r
            {:length 0.5\r
             :time 161.2}\r
            {:length 0.07\r
             :time 161.4}\r
            {:length 0.07\r
             :time 161.6}\r
            {:length 0.07\r
             :time 161.8}\r
            {:length 0.5\r
             :time 162}\r
            {:length 0.07\r
             :time 162.2}\r
            {:length 0.07\r
             :time 162.4}\r
            {:length 0.07\r
             :time 162.6}\r
            {:length 0.5\r
             :time 162.8}\r
            {:length 0.07\r
             :time 163}\r
            {:length 0.07\r
             :time 163.2}\r
            {:length 0.07\r
             :time 163.4}\r
            {:length 0.5\r
             :time 163.6}\r
            {:length 0.07\r
             :time 163.8}\r
            {:length 0.07\r
             :time 164}\r
            {:length 0.07\r
             :time 164.2}\r
            {:length 0.5\r
             :time 164.4}\r
            {:length 0.07\r
             :time 164.6}\r
            {:length 0.07\r
             :time 164.8}\r
            {:length 0.07\r
             :time 165}\r
            {:length 0.5\r
             :time 165.2}\r
            {:length 0.07\r
             :time 165.4}\r
            {:length 0.07\r
             :time 165.6}\r
            {:length 0.07\r
             :time 165.8}\r
            {:length 0.5\r
             :time 166}\r
            {:length 0.07\r
             :time 166.2}\r
            {:length 0.07\r
             :time 166.4}\r
            {:length 0.07\r
             :time 166.6}\r
            {:length 0.5\r
             :time 166.8}\r
            {:length 0.07\r
             :time 167}\r
            {:length 0.07\r
             :time 167.2}\r
            {:length 0.07\r
             :time 167.4}\r
            {:length 0.5\r
             :time 167.6}\r
            {:length 0.07\r
             :time 167.8}\r
            {:length 0.07\r
             :time 168}\r
            {:length 0.07\r
             :time 168.2}\r
            {:length 0.5\r
             :time 168.4}\r
            {:length 0.07\r
             :time 168.6}\r
            {:length 0.07\r
             :time 168.8}\r
            {:length 0.07\r
             :time 169}\r
            {:length 0.5\r
             :time 169.2}\r
            {:length 0.07\r
             :time 169.4}\r
            {:length 0.07\r
             :time 169.6}\r
            {:length 0.07\r
             :time 169.8}\r
            {:length 0.5\r
             :time 170}\r
            {:length 0.07\r
             :time 170.2}\r
            {:length 0.07\r
             :time 170.4}\r
            {:length 0.07\r
             :time 170.6}\r
            {:length 0.5\r
             :time 170.8}\r
            {:length 0.07\r
             :time 171}\r
            {:length 0.07\r
             :time 171.2}\r
            {:length 0.07\r
             :time 171.4}\r
            {:length 0.5\r
             :time 171.6}\r
            {:length 0.07\r
             :time 171.8}\r
            {:length 0.07\r
             :time 172}\r
            {:length 0.07\r
             :time 172.2}\r
            {:length 0.5\r
             :time 172.4}\r
            {:length 0.07\r
             :time 172.6}\r
            {:length 0.07\r
             :time 172.8}\r
            {:length 0.07\r
             :time 173}\r
            {:length 0.5\r
             :time 173.2}\r
            {:length 0.07\r
             :time 173.4}\r
            {:length 0.07\r
             :time 173.6}\r
            {:length 0.07\r
             :time 173.8}\r
            {:length 0.5\r
             :time 174}\r
            {:length 0.07\r
             :time 174.2}\r
            {:length 0.07\r
             :time 174.4}\r
            {:length 0.07\r
             :time 174.6}\r
            {:length 0.5\r
             :time 174.8}\r
            {:length 0.07\r
             :time 175}\r
            {:length 0.07\r
             :time 175.2}\r
            {:length 0.07\r
             :time 175.4}\r
            {:length 0.5\r
             :time 175.6}\r
            {:length 0.07\r
             :time 175.8}\r
            {:length 0.07\r
             :time 176}\r
            {:length 0.07\r
             :time 176.2}\r
            {:length 0.5\r
             :time 176.4}\r
            {:length 0.07\r
             :time 176.6}\r
            {:length 0.07\r
             :time 176.8}\r
            {:length 0.07\r
             :time 177}\r
            {:length 0.5\r
             :time 177.2}\r
            {:length 0.07\r
             :time 177.4}\r
            {:length 0.07\r
             :time 177.6}\r
            {:length 0.07\r
             :time 177.8}\r
            {:length 0.5\r
             :time 178}\r
            {:length 0.07\r
             :time 178.2}\r
            {:length 0.07\r
             :time 178.4}\r
            {:length 0.07\r
             :time 178.6}\r
            {:length 0.5\r
             :time 178.8}\r
            {:length 0.07\r
             :time 179}\r
            {:length 0.07\r
             :time 179.2}\r
            {:length 0.07\r
             :time 179.4}\r
            {:length 0.5\r
             :time 179.6}\r
            {:length 0.07\r
             :time 179.8}\r
            {:length 0.07\r
             :time 180}\r
            {:length 0.07\r
             :time 180.2}\r
            {:length 0.5\r
             :time 180.4}\r
            {:length 0.07\r
             :time 180.6}\r
            {:length 0.07\r
             :time 180.8}\r
            {:length 0.07\r
             :time 181}\r
            {:length 0.5\r
             :time 181.2}\r
            {:length 0.07\r
             :time 181.4}\r
            {:length 0.07\r
             :time 181.6}\r
            {:length 0.07\r
             :time 181.8}\r
            {:length 0.5\r
             :time 182}\r
            {:length 0.07\r
             :time 182.2}\r
            {:length 0.07\r
             :time 182.4}\r
            {:length 0.07\r
             :time 182.6}\r
            {:length 0.5\r
             :time 182.8}\r
            {:length 0.07\r
             :time 183}\r
            {:length 0.07\r
             :time 183.2}\r
            {:length 0.07\r
             :time 183.4}\r
            {:length 0.5\r
             :time 183.6}\r
            {:length 0.07\r
             :time 183.8}\r
            {:length 0.07\r
             :time 184}\r
            {:length 0.07\r
             :time 184.2}\r
            {:length 0.5\r
             :time 184.4}\r
            {:length 0.07\r
             :time 184.6}\r
            {:length 0.07\r
             :time 184.8}\r
            {:length 0.07\r
             :time 185}\r
            {:length 0.5\r
             :time 185.2}\r
            {:length 0.07\r
             :time 185.4}\r
            {:length 0.07\r
             :time 185.6}\r
            {:length 0.07\r
             :time 185.8}\r
            {:length 0.5\r
             :time 186}\r
            {:length 0.07\r
             :time 186.2}\r
            {:length 0.07\r
             :time 186.4}\r
            {:length 0.07\r
             :time 186.6}\r
            {:length 0.5\r
             :time 186.8}\r
            {:length 0.07\r
             :time 187}\r
            {:length 0.07\r
             :time 187.2}\r
            {:length 0.07\r
             :time 187.4}\r
            {:length 0.5\r
             :time 187.6}\r
            {:length 0.07\r
             :time 187.8}\r
            {:length 0.07\r
             :time 188}\r
            {:length 0.07\r
             :time 188.2}\r
            {:length 0.5\r
             :time 188.4}\r
            {:length 0.07\r
             :time 188.6}\r
            {:length 0.07\r
             :time 188.8}\r
            {:length 0.07\r
             :time 189}\r
            {:length 0.5\r
             :time 189.2}\r
            {:length 0.07\r
             :time 189.4}\r
            {:length 0.07\r
             :time 189.6}\r
            {:length 0.07\r
             :time 189.8}\r
            {:length 0.5\r
             :time 190}\r
            {:length 0.07\r
             :time 190.2}\r
            {:length 0.07\r
             :time 190.4}\r
            {:length 0.07\r
             :time 190.6}\r
            {:length 0.5\r
             :time 190.8}\r
            {:length 0.07\r
             :time 191}\r
            {:length 0.07\r
             :time 191.2}\r
            {:length 0.07\r
             :time 191.4}\r
            {:length 0.5\r
             :time 191.6}\r
            {:length 0.07\r
             :time 191.8}\r
            {:length 0.07\r
             :time 192}\r
            {:length 0.07\r
             :time 192.2}\r
            {:length 0.5\r
             :time 192.4}\r
            {:length 0.07\r
             :time 192.6}\r
            {:length 0.07\r
             :time 192.8}\r
            {:length 0.07\r
             :time 193}\r
            {:length 0.5\r
             :time 193.2}\r
            {:length 0.07\r
             :time 193.4}\r
            {:length 0.07\r
             :time 193.6}\r
            {:length 0.07\r
             :time 193.8}\r
            {:length 0.5\r
             :time 194}\r
            {:length 0.07\r
             :time 194.2}\r
            {:length 0.07\r
             :time 194.4}\r
            {:length 0.07\r
             :time 194.6}\r
            {:length 0.5\r
             :time 194.8}\r
            {:length 0.07\r
             :time 195}\r
            {:length 0.07\r
             :time 195.2}\r
            {:length 0.07\r
             :time 195.4}\r
            {:length 0.5\r
             :time 195.6}\r
            {:length 0.07\r
             :time 195.8}\r
            {:length 0.07\r
             :time 196}\r
            {:length 0.07\r
             :time 196.2}\r
            {:length 0.5\r
             :time 196.4}\r
            {:length 0.07\r
             :time 196.6}\r
            {:length 0.07\r
             :time 196.8}\r
            {:length 0.07\r
             :time 197}\r
            {:length 0.5\r
             :time 197.2}\r
            {:length 0.07\r
             :time 197.4}\r
            {:length 0.07\r
             :time 197.6}\r
            {:length 0.07\r
             :time 197.8}\r
            {:length 0.5\r
             :time 198}\r
            {:length 0.07\r
             :time 198.2}\r
            {:length 0.07\r
             :time 198.4}\r
            {:length 0.07\r
             :time 198.6}\r
            {:length 0.5\r
             :time 198.8}\r
            {:length 0.07\r
             :time 199}\r
            {:length 0.07\r
             :time 199.2}\r
            {:length 0.07\r
             :time 199.4}\r
            {:length 0.5\r
             :time 199.6}\r
            {:length 0.07\r
             :time 199.8}\r
            {:length 0.07\r
             :time 200}\r
            {:length 0.07\r
             :time 200.2}\r
            {:length 0.5\r
             :time 200.4}\r
            {:length 0.07\r
             :time 200.6}\r
            {:length 0.07\r
             :time 200.8}\r
            {:length 0.07\r
             :time 201}\r
            {:length 0.5\r
             :time 201.2}\r
            {:length 0.07\r
             :time 201.4}\r
            {:length 0.07\r
             :time 201.6}\r
            {:length 0.07\r
             :time 201.8}\r
            {:length 0.5\r
             :time 202}\r
            {:length 0.07\r
             :time 202.2}\r
            {:length 0.07\r
             :time 202.4}\r
            {:length 0.07\r
             :time 202.6}\r
            {:length 0.5\r
             :time 202.8}\r
            {:length 0.07\r
             :time 203}\r
            {:length 0.07\r
             :time 203.2}\r
            {:length 0.07\r
             :time 203.4}\r
            {:length 0.5\r
             :time 203.6}\r
            {:length 0.07\r
             :time 203.8}\r
            {:length 0.07\r
             :time 204}\r
            {:length 0.07\r
             :time 204.2}\r
            {:length 0.5\r
             :time 204.4}\r
            {:length 0.07\r
             :time 204.6}\r
            {:length 0.07\r
             :time 204.8}\r
            {:length 0.07\r
             :time 205}\r
            {:length 0.5\r
             :time 205.2}\r
            {:length 0.07\r
             :time 205.4}\r
            {:length 0.07\r
             :time 205.6}\r
            {:length 0.07\r
             :time 205.8}\r
            {:length 0.5\r
             :time 206}\r
            {:length 0.07\r
             :time 206.2}\r
            {:length 0.07\r
             :time 206.4}\r
            {:length 0.07\r
             :time 206.6}\r
            {:length 0.5\r
             :time 206.8}\r
            {:length 0.07\r
             :time 207}\r
            {:length 0.07\r
             :time 207.2}\r
            {:length 0.07\r
             :time 207.4}\r
            {:length 0.5\r
             :time 207.6}\r
            {:length 0.07\r
             :time 207.8}\r
            {:length 0.07\r
             :time 208}\r
            {:length 0.07\r
             :time 208.2}\r
            {:length 0.5\r
             :time 208.4}\r
            {:length 0.07\r
             :time 208.6}\r
            {:length 0.07\r
             :time 208.8}\r
            {:length 0.07\r
             :time 209}\r
            {:length 0.5\r
             :time 209.2}\r
            {:length 0.07\r
             :time 209.4}\r
            {:length 0.07\r
             :time 209.6}\r
            {:length 0.07\r
             :time 209.8}\r
            {:length 0.5\r
             :time 210}\r
            {:length 0.07\r
             :time 210.2}\r
            {:length 0.07\r
             :time 210.4}\r
            {:length 0.07\r
             :time 210.6}\r
            {:length 0.5\r
             :time 210.8}\r
            {:length 0.07\r
             :time 211}\r
            {:length 0.07\r
             :time 211.2}\r
            {:length 0.07\r
             :time 211.4}\r
            {:length 0.5\r
             :time 211.6}\r
            {:length 0.07\r
             :time 211.8}\r
            {:length 0.07\r
             :time 212}\r
            {:length 0.07\r
             :time 212.2}\r
            {:length 0.5\r
             :time 212.4}\r
            {:length 0.07\r
             :time 212.6}\r
            {:length 0.07\r
             :time 212.8}\r
            {:length 0.07\r
             :time 213}\r
            {:length 0.5\r
             :time 213.2}\r
            {:length 0.07\r
             :time 213.4}\r
            {:length 0.07\r
             :time 213.6}\r
            {:length 0.07\r
             :time 213.8}\r
            {:length 0.5\r
             :time 214}\r
            {:length 0.07\r
             :time 214.2}])\r
\r
(def lead1 [{:time 1.5, :length 0.3, :pitch 69}\r
            {:time 2, :length 0.3, :pitch 71}\r
            {:time 2.5, :length 0.3, :pitch 74}\r
            {:time 3, :length 0.3, :pitch 76}\r
            {:time 3.5, :length 0.6, :pitch 78}\r
            {:time 5, :length 0.3, :pitch 76}\r
            {:time 6, :length 0.3, :pitch 74}\r
            {:time 6.5, :length 0.2, :pitch 76}\r
            {:time 7.5, :length 0.2, :pitch 74}\r
            {:time 7.75, :length 0.3, :pitch 76}\r
            {:time 8, :length 0.6, :pitch 74}\r
            {:time 9.5, :length 0.3, :pitch 71}\r
            {:time 10.0, :length 0.1, :pitch 71}\r
            {:time 10.1, :length 0.1, :pitch 70}\r
            {:time 10.2, :length 0.1, :pitch 69}\r
            {:time 10.3, :length 0.1, :pitch 68}\r
            {:time 10.4, :length 0.1, :pitch 67}\r
            {:time 10.5, :length 0.1, :pitch 66}\r
            {:time 10.6, :length 0.1, :pitch 65}\r
            {:time 10.7, :length 0.1, :pitch 64}\r
            {:time 10.8, :length 0.1, :pitch 63}\r
            {:time 10.9, :length 0.1, :pitch 62}\r
            {:time 11.0, :length 0.1, :pitch 61}\r
            {:time 11.1, :length 0.1, :pitch 60}\r
            {:time 11.2, :length 0.1, :pitch 60}\r
            {:time 11.299999999999999, :length 0.1, :pitch 60}\r
            {:time 12, :length 0.3, :pitch 74}\r
            {:time 12.5, :length 0.3, :pitch 74}\r
            {:time 13.5, :length 0.3, :pitch 74}\r
            {:time 14.5, :length 0.3, :pitch 71}\r
            {:time 15.5, :length 0.3, :pitch 69}\r
            {:time 16, :length 0.3, :pitch 71}\r
            {:time 16.0, :length 0.1, :pitch 71}\r
            {:time 16.1, :length 0.1, :pitch 70}\r
            {:time 16.2, :length 0.1, :pitch 69}\r
            {:time 16.3, :length 0.1, :pitch 68}\r
            {:time 16.4, :length 0.1, :pitch 67}\r
            {:time 16.5, :length 0.1, :pitch 66}\r
            {:time 16.6, :length 0.1, :pitch 65}\r
            {:time 16.7, :length 0.1, :pitch 64}\r
            {:time 16.8, :length 0.1, :pitch 64}\r
            {:time 16.9, :length 0.1, :pitch 64}\r
            {:time 17.5, :length 0.3, :pitch 64}\r
            {:time 18, :length 0.3, :pitch 66}\r
            {:time 18.5, :length 0.3, :pitch 69}\r
            {:time 19, :length 0.3, :pitch 71}\r
            {:time 20, :length 0.3, :pitch 71}\r
            {:time 20.5, :length 0.3, :pitch 73}\r
            {:time 21.5, :length 0.6, :pitch 69}\r
            {:time 24, :length 0.3, :pitch 66}\r
            {:time 24.5, :length 0.3, :pitch 64}\r
            {:time 25.5, :length 0.6, :pitch 64}])\r
\r
(def lead2 [{:time 32, :length 0.5, :pitch 66}\r
            {:time 33.5, :length 1, :pitch 71}\r
            {:time 39, :length 0.5, :pitch 71}\r
            {:time 40, :length 0.3, :pitch 71}\r
            {:time 40.5, :length 0.5, :pitch 69}\r
            {:time 41.5, :length 1, :pitch 64}\r
            {:time 47, :length 0.5, :pitch 66}\r
            {:time 48, :length 0.2, :pitch 67}\r
            {:time 48.5, :length 0.2, :pitch 64}\r
            {:time 49, :length 0.2, :pitch 59}\r
            {:time 49.5, :length 1, :pitch 64}\r
            {:time 53, :length 0.2, :pitch 61}\r
            {:time 53.5, :length 0.2, :pitch 61}\r
            {:time 54.5, :length 0.5, :pitch 62}\r
            {:time 56, :length 0.5, :pitch 66}\r
            {:time 57.5, :length 1, :pitch 64}])\r
\r
(def lead3 [{:time 65, :length 0.2, :pitch 73}\r
            {:time 65.5, :length 0.5, :pitch 73}\r
            {:time 67, :length 0.3, :pitch 73}\r
            {:time 68, :length 0.3, :pitch 73}\r
            {:time 69, :length 0.2, :pitch 74}\r
            {:time 69.5, :length 1, :pitch 71}\r
            {:time 73.5, :length 0.2, :pitch 71}\r
            {:time 74, :length 0.5, :pitch 71}\r
            {:time 75, :length 0.5, :pitch 71}\r
            {:time 76, :length 0.2, :pitch 71}\r
            {:time 76.5, :length 0.2, :pitch 73}\r
            {:time 77, :length 0.2, :pitch 71}\r
            {:time 77.5, :length 1, :pitch 69}\r
            {:time 81, :length 0.15, :pitch 69}\r
            {:time 81.5, :length 0.3, :pitch 69}\r
            {:time 82.5, :length 0.3, :pitch 68}\r
            {:time 83.5, :length 0.2, :pitch 66}\r
            {:time 84, :length 0.5, :pitch 68}\r
            {:time 85.5, :length 0.6, :pitch 66}\r
            {:time 88, :length 0.2, :pitch 65}\r
            {:time 88.5, :length 0.5, :pitch 66}\r
            {:time 89.5, :length 0.5, :pitch 68}\r
            {:time 91.5, :length 1, :pitch 69}])\r
\r
(def lead5 [{:time 93.5, :length 0.2, :pitch 64}\r
            {:time 94, :length 0.2, :pitch 66}\r
            {:time 94.5, :length 0.2, :pitch 69}\r
            {:time 95, :length 0.2, :pitch 71}\r
            {:time 95.5, :length 1, :pitch 73}\r
            {:time 97, :length 0.3, :pitch 71}\r
            {:time 98, :length 0.2, :pitch 69}\r
            {:time 98.5, :length 0.4, :pitch 71}\r
            {:time 99.5, :length 0.1, :pitch 69}\r
            {:time 99.75, :length 0.2, :pitch 71}\r
            {:time 100, :length 0.5, :pitch 69}\r
            {:time 101.5, :length 1, :pitch 66}\r
            {:time 105.5, :length 0.1, :pitch 69}\r
            {:time 106, :length 0.17, :pitch 69}\r
            {:time 106.5, :length 0.17, :pitch 69}\r
            {:time 107, :length 0.17, :pitch 68}\r
            {:time 107.5, :length 0.17, :pitch 68}\r
            {:time 108, :length 1, :pitch 66}\r
            {:time 105.5, :length 0.1, :pitch 57}\r
            {:time 106, :length 0.17, :pitch 57}\r
            {:time 106.5, :length 0.17, :pitch 57}\r
            {:time 107, :length 0.17, :pitch 56}\r
            {:time 107.5, :length 0.17, :pitch 56}\r
            {:time 108, :length 1, :pitch 54}\r
            {:time 110, :length 0.2, :pitch 78}\r
            {:time 110.5, :length 0.2, :pitch 76}\r
            {:time 111, :length 0.2, :pitch 73}\r
            {:time 111.5, :length 0.2, :pitch 71}\r
            {:time 112, :length 1, :pitch 73}\r
            {:time 114.5, :length 0.2, :pitch 71}\r
            {:time 115, :length 0.2, :pitch 73}\r
            {:time 115.5, :length 0.2, :pitch 71}\r
            {:time 116, :length 0.2, :pitch 71}\r
            {:time 116.5, :length 0.5, :pitch 69}\r
            {:time 117.5, :length 0.2, :pitch 69}\r
            {:time 118, :length 0.5, :pitch 62}\r
            {:time 119, :length 0.5, :pitch 74}\r
            {:time 120, :length 1, :pitch 73}])\r
\r
(def lead6 [{:time 176, :length 0.5, :pitch 74}\r
            {:time 177, :length 0.5, :pitch 74}\r
            {:time 178, :length 1, :pitch 74}\r
            {:time 179.5, :length 0.5, :pitch 74}\r
            {:time 180.5, :length 1, :pitch 73}\r
            {:time 184, :length 0.5, :pitch 74}\r
            {:time 185, :length 0.5, :pitch 74}\r
            {:time 186, :length 1, :pitch 74}\r
            {:time 188, :length 0.5, :pitch 76}\r
            {:time 189, :length 0.2, :pitch 78}\r
            {:time 189.5, :length 1, :pitch 76}\r
            {:time 193.5, :length 0.2, :pitch 76}\r
            {:time 194, :length 0.2, :pitch 76}\r
            {:time 194.5, :length 0.2, :pitch 74}\r
            {:time 195, :length 0.2, :pitch 73}\r
            {:time 195.5, :length 1, :pitch 71}])\r
\r
(def lead7 [{:time 197.5, :length 0.2, :pitch 69}\r
            {:time 198, :length 0.2, :pitch 71}\r
            {:time 198.5, :length 0.2, :pitch 74}\r
            {:time 199, :length 0.2, :pitch 76}\r
            {:time 199.5, :length 1, :pitch 78}\r
            {:time 201, :length 0.2, :pitch 76}\r
            {:time 202, :length 0.2, :pitch 74}\r
            {:time 202.5, :length 0.4, :pitch 76}\r
            {:time 203.5, :length 0.1, :pitch 74}\r
            {:time 203.75, :length 0.1, :pitch 76}\r
            {:time 204, :length 0.8, :pitch 74}\r
            {:time 205.5, :length 0.2, :pitch 71}\r
            {:time 206.1, :length 0.1, :pitch 70}\r
            {:time 206.2, :length 0.1, :pitch 69}\r
            {:time 206.3, :length 0.1, :pitch 68}\r
            {:time 206.4, :length 0.1, :pitch 67}\r
            {:time 206.5, :length 0.1, :pitch 66}\r
            {:time 206.6, :length 0.1, :pitch 65}\r
            {:time 206.7, :length 0.1, :pitch 64}\r
            {:time 206.8, :length 0.1, :pitch 63}\r
            {:time 206.9, :length 0.1, :pitch 62}\r
            {:time 207.0, :length 0.1, :pitch 61}\r
            {:time 207.1, :length 0.1, :pitch 60}\r
            {:time 207.2, :length 0.1, :pitch 60}\r
            {:time 207.3, :length 0.2, :pitch 60}\r
            {:time 208, :length 0.2, :pitch 74}\r
            {:time 208.5, :length 0.2, :pitch 74}\r
            {:time 209.5, :length 0.2, :pitch 74}\r
            {:time 210.5, :length 0.2, :pitch 71}\r
            {:time 211.5, :length 0.2, :pitch 69}\r
            {:time 212, :length 0.1, :pitch 71}\r
            {:time 212.1, :length 0.1, :pitch 70}\r
            {:time 212.2, :length 0.1, :pitch 69}\r
            {:time 212.3, :length 0.1, :pitch 68}\r
            {:time 212.4, :length 0.1, :pitch 67}\r
            {:time 212.5, :length 0.1, :pitch 66}\r
            {:time 212.6, :length 0.1, :pitch 65}\r
            {:time 212.7, :length 0.1, :pitch 64}\r
            {:time 212.8, :length 0.1, :pitch 64}\r
            {:time 212.9, :length 0.1, :pitch 64}\r
            {:time 213.5, :length 0.2, :pitch 64}\r
            {:time 214, :length 0.2, :pitch 66}\r
            {:time 214.5, :length 0.2, :pitch 69}\r
            {:time 215, :length 0.5, :pitch 71}\r
            {:time 216, :length 0.2, :pitch 71}\r
            {:time 216.5, :length 0.5, :pitch 73}\r
            {:time 217.5, :length 1, :pitch 69}\r
            {:time 220, :length 0.2, :pitch 66}\r
            {:time 220.5, :length 0.5, :pitch 64}\r
            {:time 221.5, :length 1, :pitch 64}])\r
\r
(def lead8 [{:time 228, :length 0.6, :pitch 66} \r
            {:time 229.5, :length 1, :pitch 71} \r
            {:time 235, :length 0.4, :pitch 71} \r
            {:time 236, :length 0.2, :pitch 71} \r
            {:time 236.5, :length 0.6, :pitch 69} \r
            {:time 237.5, :length 1, :pitch 64} \r
            {:time 243, :length 0.3, :pitch 66} \r
            {:time 244, :length 0.2, :pitch 67} \r
            {:time 244.5, :length 0.2, :pitch 64} \r
            {:time 245, :length 0.2, :pitch 59} \r
            {:time 245.5, :length 1, :pitch 64} \r
            {:time 249, :length 0.2, :pitch 61} \r
            {:time 249.5, :length 0.5, :pitch 61} \r
            {:time 250.5, :length 0.5, :pitch 62} \r
            {:time 252, :length 0.5, :pitch 66} \r
            {:time 253.5, :length 1, :pitch 64}])\r
(def lead9 [{:time 261, :length 0.2, :pitch 73} \r
            {:time 261.5, :length 0.5, :pitch 73} \r
            {:time 263, :length 0.5, :pitch 73} \r
            {:time 264, :length 0.5, :pitch 73} \r
            {:time 265, :length 0.2, :pitch 74} \r
            {:time 265.5, :length 1, :pitch 71} \r
            {:time 269.5, :length 0.1, :pitch 71} \r
            {:time 270, :length 0.5, :pitch 71} \r
            {:time 271, :length 0.5, :pitch 71} \r
            {:time 272, :length 0.2, :pitch 71} \r
            {:time 272.5, :length 0.2, :pitch 73} \r
            {:time 273, :length 0.2, :pitch 71} \r
            {:time 273.5, :length 1, :pitch 69} \r
            {:time 277, :length 0.1, :pitch 69} \r
            {:time 277.5, :length 0.4, :pitch 69} \r
            {:time 278.5, :length 0.3, :pitch 68} \r
            {:time 279.5, :length 0.2, :pitch 66} \r
            {:time 280, :length 0.5, :pitch 68} \r
            {:time 281.5, :length 1, :pitch 66} \r
            {:time 284, :length 0.2, :pitch 65} \r
            {:time 284.5, :length 0.5, :pitch 66} \r
            {:time 285.5, :length 1, :pitch 68} \r
            {:time 287.5, :length 1, :pitch 69}])\r
(def lead11 [{:time 289.5, :length 0.2, :pitch 64} \r
            {:time 290, :length 0.2, :pitch 66} \r
            {:time 290.5, :length 0.2, :pitch 69} \r
            {:time 291, :length 0.2, :pitch 71} \r
            {:time 291.5, :length 1, :pitch 73} \r
            {:time 293, :length 0.3, :pitch 71} \r
            {:time 294, :length 0.2, :pitch 69} \r
            {:time 294.5, :length 0.4, :pitch 71} \r
            {:time 295.5, :length 0.1, :pitch 69} \r
            {:time 295.75, :length 0.1, :pitch 71} \r
            {:time 296, :length 0.5, :pitch 69} \r
            {:time 297.5, :length 1, :pitch 66} \r
            {:time 301.5, :length 0.17, :pitch 69} \r
            {:time 302, :length 0.17, :pitch 69} \r
            {:time 302.5, :length 0.17, :pitch 69} \r
            {:time 303, :length 0.17, :pitch 68} \r
            {:time 303.5, :length 0.17, :pitch 68} \r
            {:time 304, :length 0.5, :pitch 66} \r
            {:time 301.5, :length 0.17, :pitch 57} \r
            {:time 302, :length 0.17, :pitch 57} \r
            {:time 302.5, :length 0.17, :pitch 57} \r
            {:time 303, :length 0.17, :pitch 56} \r
            {:time 303.5, :length 0.17, :pitch 56} \r
            {:time 304, :length 0.5, :pitch 54} \r
            {:time 306, :length 0.2, :pitch 78} \r
            {:time 306.5, :length 0.2, :pitch 76} \r
            {:time 307, :length 0.2, :pitch 73} \r
            {:time 307.5, :length 0.4, :pitch 71} \r
            {:time 308, :length 0.5, :pitch 73} \r
            {:time 310.5, :length 0.2, :pitch 71} \r
            {:time 311, :length 0.2, :pitch 73} \r
            {:time 311.5, :length 0.2, :pitch 71} \r
            {:time 312, :length 0.2, :pitch 71} \r
            {:time 312.5, :length 0.4, :pitch 69} \r
            {:time 313.5, :length 0.1, :pitch 69} \r
            {:time 314, :length 0.4, :pitch 66} \r
            {:time 315, :length 0.5, :pitch 74} \r
            {:time 316, :length 1, :pitch 73}])\r
(def lead12 [{:time 372, :length 0.5, :pitch 74} \r
            {:time 373, :length 0.5, :pitch 74} \r
            {:time 374, :length 1, :pitch 74} \r
            {:time 375.5, :length 0.5, :pitch 74} \r
            {:time 376.5, :length 1, :pitch 73} \r
            {:time 380, :length 0.5, :pitch 74} \r
            {:time 381, :length 0.5, :pitch 74} \r
            {:time 382, :length 1, :pitch 74} \r
            {:time 384, :length 0.4, :pitch 76} \r
            {:time 385, :length 0.2, :pitch 78} \r
            {:time 385.5, :length 1, :pitch 76} \r
            {:time 389.5, :length 0.2, :pitch 76} \r
            {:time 390, :length 0.2, :pitch 76} \r
            {:time 390.5, :length 0.2, :pitch 74} \r
            {:time 391, :length 0.2, :pitch 73} \r
            {:time 391.5, :length 1, :pitch 71}])\r
(def lead13 [{:time 393.5, :length 0.2, :pitch 69} \r
            {:time 394, :length 0.2, :pitch 71} \r
            {:time 394.5, :length 0.2, :pitch 74} \r
            {:time 395, :length 0.2, :pitch 76} \r
            {:time 395.5, :length 1, :pitch 78} \r
            {:time 397, :length 0.4, :pitch 76} \r
            {:time 398, :length 0.2, :pitch 74} \r
            {:time 398.5, :length 0.4, :pitch 76} \r
            {:time 399.5, :length 0.1, :pitch 74} \r
            {:time 399.75, :length 0.1, :pitch 76} \r
            {:time 400, :length 0.4, :pitch 74} \r
            {:time 401, :length 0.5, :pitch 71} \r
            {:time 402.1, :length 0.1, :pitch 70} \r
            {:time 402.2, :length 0.1, :pitch 69} \r
            {:time 402.3, :length 0.1, :pitch 68} \r
            {:time 402.4, :length 0.1, :pitch 67} \r
            {:time 402.5, :length 0.1, :pitch 66} \r
            {:time 402.6, :length 0.1, :pitch 65} \r
            {:time 402.7, :length 0.1, :pitch 64} \r
            {:time 402.8, :length 0.1, :pitch 63} \r
            {:time 402.9, :length 0.1, :pitch 62} \r
            {:time 403.0, :length 0.1, :pitch 61} \r
            {:time 403.1, :length 0.1, :pitch 60} \r
            {:time 403.2, :length 0.1, :pitch 60} \r
            {:time 403.3, :length 0.2, :pitch 60} \r
            {:time 404, :length 0.2, :pitch 74} \r
            {:time 404.5, :length 0.5, :pitch 74}\r
            {:time 405.5, :length 0.2, :pitch 74} \r
            {:time 406.5, :length 0.2, :pitch 71} \r
            {:time 407.5, :length 0.4, :pitch 69} \r
            {:time 408, :length 0.2, :pitch 71} \r
            {:time 408.1, :length 0.1, :pitch 70} \r
            {:time 408.2, :length 0.1, :pitch 69} \r
            {:time 408.3, :length 0.1, :pitch 68} \r
            {:time 408.4, :length 0.1, :pitch 67} \r
            {:time 408.5, :length 0.1, :pitch 66} \r
            {:time 408.6, :length 0.1, :pitch 65} \r
            {:time 408.7, :length 0.1, :pitch 64} \r
            {:time 408.8, :length 0.1, :pitch 64} \r
            {:time 408.9, :length 0.1, :pitch 64} \r
            {:time 409.5, :length 0.2, :pitch 64} \r
            {:time 410, :length 0.2, :pitch 66} \r
            {:time 410.5, :length 0.2, :pitch 69} \r
            {:time 411, :length 0.4, :pitch 71} \r
            {:time 412, :length 0.2, :pitch 71} \r
            {:time 412.5, :length 0.4, :pitch 73} \r
            {:time 413.5, :length 0.5, :pitch 69} \r
            {:time 416, :length 0.2, :pitch 66} \r
            {:time 416.5, :length 0.4, :pitch 64} \r
            {:time 417.5, :length 1, :pitch 64}])\r
(def lead14 [{:time 425.5, :length 0.2, :pitch 69} \r
            {:time 426, :length 0.2, :pitch 71} \r
            {:time 426.5, :length 0.2, :pitch 74} \r
            {:time 427, :length 0.2, :pitch 76} \r
            {:time 427.5, :length 0.7, :pitch 78} \r
            {:time 429, :length 0.3, :pitch 76} \r
            {:time 430, :length 0.2, :pitch 74} \r
            {:time 430.5, :length 0.4, :pitch 76} \r
            {:time 431.5, :length 0.1, :pitch 74} \r
            {:time 431.75, :length 0.1, :pitch 76} \r
            {:time 432, :length 0.4, :pitch 74} \r
            {:time 433.5, :length 0.2, :pitch 71} \r
            {:time 434.1, :length 0.1, :pitch 70} \r
            {:time 434.2, :length 0.1, :pitch 69} \r
            {:time 434.3, :length 0.1, :pitch 68} \r
            {:time 434.4, :length 0.1, :pitch 67} \r
            {:time 434.5, :length 0.1, :pitch 66} \r
            {:time 434.6, :length 0.1, :pitch 65} \r
            {:time 434.7, :length 0.1, :pitch 64} \r
            {:time 434.8, :length 0.1, :pitch 63} \r
            {:time 434.9, :length 0.1, :pitch 62} \r
            {:time 435.0, :length 0.1, :pitch 61} \r
            {:time 435.1, :length 0.1, :pitch 60} \r
            {:time 435.2, :length 0.1, :pitch 60} \r
            {:time 435.3, :length 0.2, :pitch 60} \r
            {:time 436, :length 0.2, :pitch 74} \r
            {:time 436.5, :length 0.2, :pitch 74} \r
            {:time 437.5, :length 0.2, :pitch 74} \r
            {:time 438.5, :length 0.4, :pitch 71} \r
            {:time 439.5, :length 0.2, :pitch 69} \r
            {:time 440, :length 0.2, :pitch 71} \r
            {:time 440.1, :length 0.1, :pitch 70} \r
            {:time 440.2, :length 0.1, :pitch 69} \r
            {:time 440.3, :length 0.1, :pitch 68} \r
            {:time 440.4, :length 0.1, :pitch 67} \r
            {:time 440.5, :length 0.1, :pitch 66} \r
            {:time 440.6, :length 0.1, :pitch 65} \r
            {:time 440.7, :length 0.1, :pitch 64} \r
            {:time 440.8, :length 0.1, :pitch 64} \r
            {:time 440.9, :length 0.1, :pitch 64} \r
            {:time 441.5, :length 0.2, :pitch 64} \r
            {:time 442, :length 0.2, :pitch 66} \r
            {:time 442.5, :length 0.2, :pitch 69} \r
            {:time 443, :length 0.2, :pitch 71} \r
            {:time 444, :length 0.2, :pitch 71} \r
            {:time 444.5, :length 0.2, :pitch 73} \r
            {:time 445.5, :length 0.2, :pitch 69} \r
            {:time 446.5, :length 0.2, :pitch 69} \r
            {:time 447.5, :length 0.2, :pitch 64} \r
            {:time 448, :length 0.2, :pitch 64} \r
            {:time 448.5, :length 0.2, :pitch 64} \r
            {:time 449, :length 0.2, :pitch 64} \r
            {:time 449.5, :length 0.2, :pitch 59} \r
            {:time 450, :length 0.2, :pitch 59} \r
            {:time 450.5, :length 0.2, :pitch 59} \r
            {:time 451, :length 0.2, :pitch 59} \r
            {:time 451.5, :length 0.2, :pitch 54} \r
            {:time 452, :length 0.2, :pitch 54} \r
            {:time 452.5, :length 0.2, :pitch 54} \r
            {:time 453, :length 0.2, :pitch 54} \r
            {:time 453.5, :length 0.2, :pitch 52} \r
            {:time 454, :length 0.2, :pitch 54} \r
            {:time 454.5, :length 0.2, :pitch 52} \r
            {:time 448, :length 0.2, :pitch 76} \r
            {:time 448.5, :length 0.2, :pitch 76} \r
            {:time 449, :length 0.2, :pitch 76} \r
            {:time 449.5, :length 0.2, :pitch 71} \r
            {:time 450, :length 0.2, :pitch 71} \r
            {:time 450.5, :length 0.2, :pitch 71} \r
            {:time 451, :length 0.2, :pitch 71} \r
            {:time 451.5, :length 0.2, :pitch 66} \r
            {:time 452, :length 0.2, :pitch 66} \r
            {:time 452.5, :length 0.2, :pitch 66} \r
            {:time 453, :length 0.2, :pitch 66} \r
            {:time 453.5, :length 0.2, :pitch 64} \r
            {:time 454, :length 0.2, :pitch 66} \r
            {:time 454.5, :length 0.2, :pitch 64}])\r
(def lead15 [{:time 458, :length 0.2, :pitch 74} \r
            {:time 458.5, :length 0.2, :pitch 74} \r
            {:time 459.5, :length 0.5, :pitch 74} \r
            {:time 461, :length 0.5, :pitch 76} \r
            {:time 464, :length 0.5, :pitch 83} \r
            {:time 465.5, :length 0.5, :pitch 80} \r
            {:time 468, :length 0.5, :pitch 78} \r
            {:time 469.5, :length 0.5, :pitch 80} \r
            {:time 472, :length 0.2, :pitch 76} \r
            {:time 472.5, :length 0.2, :pitch 74} \r
            {:time 473.5, :length 0.2, :pitch 71} \r
            {:time 476, :length 0.2, :pitch 69} \r
            {:time 476.5, :length 0.5, :pitch 71} \r
            {:time 477.5, :length 0.5, :pitch 69} \r
            {:time 480, :length 0.5, :pitch 66} \r
            {:time 481.5, :length 1, :pitch 64}])\r
(def lead16 [{:time 488, :length 0.2, :pitch 73} \r
            {:time 488, :length 0.2, :pitch 76} \r
            {:time 489, :length 0.2, :pitch 73} \r
            {:time 489, :length 0.2, :pitch 76} \r
            {:time 490.5, :length 0.2, :pitch 73} \r
            {:time 490.5, :length 0.2, :pitch 76} \r
            {:time 491.5, :length 0.2, :pitch 73} \r
            {:time 491.5, :length 0.2, :pitch 76} \r
            {:time 492, :length 0.2, :pitch 71} \r
            {:time 492, :length 0.2, :pitch 78} \r
            {:time 493, :length 0.2, :pitch 71} \r
            {:time 493, :length 0.2, :pitch 78} \r
            {:time 494.5, :length 0.2, :pitch 71} \r
            {:time 494.5, :length 0.2, :pitch 78} \r
            {:time 495.5, :length 0.2, :pitch 71} \r
            {:time 495.5, :length 0.2, :pitch 78} \r
            {:time 496, :length 0.2, :pitch 71} \r
            {:time 496, :length 0.2, :pitch 76} \r
            {:time 497, :length 0.2, :pitch 71} \r
            {:time 497, :length 0.2, :pitch 76} \r
            {:time 498.5, :length 0.2, :pitch 71} \r
            {:time 498.5, :length 0.2, :pitch 76} \r
            {:time 499.5, :length 0.2, :pitch 71} \r
            {:time 499.5, :length 0.2, :pitch 76} \r
            {:time 500, :length 0.2, :pitch 71} \r
            {:time 500, :length 0.2, :pitch 78} \r
            {:time 500.5, :length 0.2, :pitch 71} \r
            {:time 500.5, :length 0.2, :pitch 78} \r
            {:time 501, :length 0.2, :pitch 71} \r
            {:time 501, :length 0.2, :pitch 78} \r
            {:time 501.5, :length 0.2, :pitch 71} \r
            {:time 501.5, :length 0.2, :pitch 76} \r
            {:time 502.5, :length 0.2, :pitch 71} \r
            {:time 502.5, :length 0.2, :pitch 76} \r
            {:time 503.5, :length 0.2, :pitch 71} \r
            {:time 503.5, :length 0.2, :pitch 76}])\r
(def lead17 [{:time 504, :length 0.2, :pitch 73} \r
            {:time 504, :length 0.2, :pitch 76} \r
            {:time 505, :length 0.2, :pitch 73} \r
            {:time 505, :length 0.2, :pitch 76} \r
            {:time 506.5, :length 0.2, :pitch 73} \r
            {:time 506.5, :length 0.2, :pitch 76} \r
            {:time 507.5, :length 0.2, :pitch 73} \r
            {:time 507.5, :length 0.2, :pitch 76} \r
            {:time 508, :length 0.2, :pitch 71} \r
            {:time 508, :length 0.2, :pitch 78} \r
            {:time 509, :length 0.2, :pitch 71} \r
            {:time 509, :length 0.2, :pitch 78} \r
            {:time 510.5, :length 0.2, :pitch 71} \r
            {:time 510.5, :length 0.2, :pitch 78} \r
            {:time 511.5, :length 0.2, :pitch 71} \r
            {:time 511.5, :length 0.2, :pitch 78} \r
            {:time 512, :length 0.2, :pitch 71} \r
            {:time 512, :length 0.2, :pitch 76} \r
            {:time 513, :length 0.2, :pitch 71} \r
            {:time 513, :length 0.2, :pitch 76} \r
            {:time 514.5, :length 0.2, :pitch 71} \r
            {:time 514.5, :length 0.2, :pitch 76} \r
            {:time 515.5, :length 0.2, :pitch 71} \r
            {:time 515.5, :length 0.2, :pitch 76} \r
            {:time 516, :length 0.2, :pitch 71} \r
            {:time 516, :length 0.2, :pitch 78} \r
            {:time 516.5, :length 0.2, :pitch 71} \r
            {:time 516.5, :length 0.2, :pitch 78} \r
            {:time 517, :length 0.2, :pitch 71} \r
            {:time 517, :length 0.2, :pitch 78} \r
            {:time 517.5, :length 0.2, :pitch 71} \r
            {:time 517.5, :length 0.2, :pitch 76} \r
            {:time 518.5, :length 0.2, :pitch 71} \r
            {:time 518.5, :length 0.2, :pitch 76} \r
            {:time 519.5, :length 0.2, :pitch 71} \r
            {:time 519.5, :length 0.2, :pitch 76}])\r
(def lead18 [{:time 520, :length 0.2, :pitch 73} \r
            {:time 520, :length 0.2, :pitch 76} \r
            {:time 521, :length 0.2, :pitch 73} \r
            {:time 521, :length 0.2, :pitch 76} \r
            {:time 522.5, :length 0.2, :pitch 73} \r
            {:time 522.5, :length 0.2, :pitch 76} \r
            {:time 523.5, :length 0.2, :pitch 73} \r
            {:time 523.5, :length 0.2, :pitch 76} \r
            {:time 524, :length 0.2, :pitch 71} \r
            {:time 524, :length 0.2, :pitch 78} \r
            {:time 525, :length 0.2, :pitch 71} \r
            {:time 525, :length 0.2, :pitch 78} \r
            {:time 526.5, :length 0.2, :pitch 71} \r
            {:time 526.5, :length 0.2, :pitch 78} \r
            {:time 527.5, :length 0.2, :pitch 71} \r
            {:time 527.5, :length 0.2, :pitch 78} \r
            {:time 528, :length 0.2, :pitch 71} \r
            {:time 528, :length 0.2, :pitch 76} \r
            {:time 529, :length 0.2, :pitch 71} \r
            {:time 529, :length 0.2, :pitch 76} \r
            {:time 530.5, :length 0.2, :pitch 71} \r
            {:time 530.5, :length 0.2, :pitch 76} \r
            {:time 531.5, :length 0.2, :pitch 71} \r
            {:time 531.5, :length 0.2, :pitch 76} \r
            {:time 532, :length 0.2, :pitch 71} \r
            {:time 532, :length 0.2, :pitch 78} \r
            {:time 532.5, :length 0.2, :pitch 71} \r
            {:time 532.5, :length 0.2, :pitch 78} \r
            {:time 533, :length 0.2, :pitch 71} \r
            {:time 533, :length 0.2, :pitch 78} \r
            {:time 533.5, :length 0.2, :pitch 71} \r
            {:time 533.5, :length 0.2, :pitch 76} \r
            {:time 534.5, :length 0.2, :pitch 71} \r
            {:time 534.5, :length 0.2, :pitch 76} \r
            {:time 535.5, :length 0.2, :pitch 71} \r
            {:time 535.5, :length 0.2, :pitch 76}])\r
\r
(def lead (concat lead1 lead2 lead3 lead5 lead6 lead7 lead8 lead9 lead11 lead12 lead13 lead14 lead15 lead16 lead17 lead18))\r
\r
\r
(defn gb1 [time]\r
  (map (fn [m] (update m :time #(+ % time)))\r
       [{:time 102, :length 0.5, :pitch 66}\r
        {:time 103, :length 0.5, :pitch 74}\r
        {:time 104, :length 0.5, :pitch 73}\r
        {:time 118, :length 0.5, :pitch 66}\r
        {:time 119, :length 0.5, :pitch 74}\r
        {:time 120, :length 0.5, :pitch 73} \r
        {:time 125.5, :length 0.15, :pitch 71}\r
        {:time 126, :length 0.15, :pitch 71}\r
        {:time 126.5, :length 0.5, :pitch 71}\r
        {:time 128, :length 0.5, :pitch 71}\r
        {:time 128.5, :length 0.5, :pitch 73}\r
        {:time 129.5, :length 0.5, :pitch 69}\r
        {:time 133.5, :length 0.5, :pitch 69}\r
        {:time 134, :length 0.5, :pitch 69}\r
        {:time 135, :length 0.5, :pitch 66} \r
        {:time 136, :length 0.5, :pitch 69} \r
        {:time 137.5, :length 0.5, :pitch 68}]))\r
\r
(defn plane1 [time]\r
  (map (fn [m] (update m :time #(+ % time)))\r
       [{:time 125.5, :length 0.5, :pitch 74} {:time 126, :length 0.5, :pitch 74} {:time 126.5, :length 0.5, :pitch 74} {:time 128, :length 0.5, :pitch 74} {:time 128.5, :length 0.5, :pitch 76} {:time 129.5, :length 0.5, :pitch 73} {:time 133.5, :length 0.5, :pitch 73} {:time 134, :length 0.5, :pitch 73} {:time 135, :length 0.5, :pitch 69} {:time 136, :length 0.5, :pitch 73} {:time 137.5, :length 0.5, :pitch 71}]))\r
\r
(defn flower1 [time]\r
  (map (fn [m] (update m :time #(+ % time)))\r
       [{:time 144, :length 0.3, :pitch 66}\r
        {:time 144.5, :length 0.3, :pitch 62}\r
        {:time 145, :length 0.3, :pitch 59}\r
        {:time 145.5, :length 0.5, :pitch 66} \r
        {:time 146.5, :length 0.3, :pitch 62} \r
        {:time 147, :length 0.3, :pitch 59} \r
        {:time 147.5, :length 0.5, :pitch 64} \r
        {:time 148.5, :length 0.5, :pitch 61} \r
        {:time 149.5, :length 0.3, :pitch 59} \r
        {:time 150, :length 0.5, :pitch 57}\r
        {:time 152, :length 0.3, :pitch 68}\r
        {:time 152.5, :length 0.3, :pitch 64}\r
        {:time 153, :length 0.3, :pitch 61} \r
        {:time 153.5, :length 0.5, :pitch 68}\r
        {:time 154.5, :length 0.5, :pitch 64}\r
        {:time 155.5, :length 0.5, :pitch 66}]))\r
\r
(defn star1 [time]\r
  (map (fn [m] (update m :time #(+ % time)))\r
       [{:time 157, :length 0.5, :pitch 70}\r
        {:time 158, :length 0.5, :pitch 71}\r
        {:time 159, :length 0.5, :pitch 73}]))\r
\r
(def leadA (concat (gb1 0) (plane1 0) (flower1 0) \r
                   (map (fn [m] (update m :time #(+ % 16)))\r
                        (flower1 0))\r
                   (star1 0)\r
                   (map (fn [m] (update m :time #(+ % 16)))\r
                        (star1 0))\r
                   (gb1 196) (plane1 196)\r
                   (flower1 196)\r
                   (map (fn [m] (update m :time #(+ % 16)))\r
                        (flower1 196))\r
                   (star1 196)\r
                   (map (fn [m] (update m :time #(+ % 16)))\r
                        (star1 196))))\r
\r
(def pulse-0\r
  [{:pitch 67\r
    :length 0.3\r
    :time 0.6}\r
   {:pitch 69\r
    :length 0.3\r
    :time 0.8}\r
   {:pitch 72\r
    :length 0.3\r
    :time 1}\r
   {:pitch 74\r
    :length 0.3\r
    :time 1.2}\r
   {:pitch 76\r
    :length 0.6\r
    :time 1.4}\r
   {:pitch 74\r
    :length 0.3\r
    :time 2}\r
   {:pitch 72\r
    :length 0.3\r
    :time 2.4}\r
   {:pitch 74\r
    :length 0.2\r
    :time 2.6}\r
   {:pitch 72\r
    :length 0.2\r
    :time 3}\r
   {:pitch 74\r
    :length 0.3\r
    :time 3.1}\r
   {:pitch 72\r
    :length 0.6\r
    :time 3.2}\r
   {:pitch 69\r
    :length 0.3\r
    :time 3.8}\r
   {:pitch 69\r
    :length 0.1\r
    :time 4}\r
   {:pitch 68\r
    :length 0.1\r
    :time 4.04}\r
   {:pitch 67\r
    :length 0.1\r
    :time 4.08}\r
   {:pitch 66\r
    :length 0.1\r
    :time 4.12}\r
   {:pitch 65\r
    :length 0.1\r
    :time 4.16}\r
   {:pitch 64\r
    :length 0.1\r
    :time 4.2}\r
   {:pitch 63\r
    :length 0.1\r
    :time 4.24}\r
   {:pitch 62\r
    :length 0.1\r
    :time 4.279999999999999}\r
   {:pitch 61\r
    :length 0.1\r
    :time 4.32}\r
   {:pitch 60\r
    :length 0.1\r
    :time 4.36}\r
   {:pitch 59\r
    :length 0.1\r
    :time 4.4}\r
   {:pitch 58\r
    :length 0.1\r
    :time 4.4399999999999995}\r
   {:pitch 58\r
    :length 0.1\r
    :time 4.4799999999999995}\r
   {:pitch 58\r
    :length 0.1\r
    :time 4.52}\r
   {:pitch 72\r
    :length 0.3\r
    :time 4.8}\r
   {:pitch 72\r
    :length 0.3\r
    :time 5}\r
   {:pitch 72\r
    :length 0.3\r
    :time 5.4}\r
   {:pitch 69\r
    :length 0.3\r
    :time 5.8}\r
   {:pitch 67\r
    :length 0.3\r
    :time 6.2}\r
   {:pitch 69\r
    :length 0.3\r
    :time 6.4}\r
   {:pitch 69\r
    :length 0.1\r
    :time 6.4}\r
   {:pitch 68\r
    :length 0.1\r
    :time 6.44}\r
   {:pitch 67\r
    :length 0.1\r
    :time 6.4799999999999995}\r
   {:pitch 66\r
    :length 0.1\r
    :time 6.5200000000000005}\r
   {:pitch 65\r
    :length 0.1\r
    :time 6.56}\r
   {:pitch 64\r
    :length 0.1\r
    :time 6.6}\r
   {:pitch 63\r
    :length 0.1\r
    :time 6.640000000000001}\r
   {:pitch 62\r
    :length 0.1\r
    :time 6.68}\r
   {:pitch 62\r
    :length 0.1\r
    :time 6.720000000000001}\r
   {:pitch 62\r
    :length 0.1\r
    :time 6.76}\r
   {:pitch 62\r
    :length 0.3\r
    :time 7}\r
   {:pitch 64\r
    :length 0.3\r
    :time 7.2}\r
   {:pitch 67\r
    :length 0.3\r
    :time 7.4}\r
   {:pitch 69\r
    :length 0.3\r
    :time 7.6}\r
   {:pitch 69\r
    :length 0.3\r
    :time 8}\r
   {:pitch 71\r
    :length 0.3\r
    :time 8.2}\r
   {:pitch 67\r
    :length 0.6\r
    :time 8.6}\r
   {:pitch 64\r
    :length 0.3\r
    :time 9.6}\r
   {:pitch 62\r
    :length 0.3\r
    :time 9.8}\r
   {:pitch 62\r
    :length 0.6\r
    :time 10.2}\r
   {:pitch 64\r
    :length 0.5\r
    :time 12.8}\r
   {:pitch 69\r
    :length 1\r
    :time 13.4}\r
   {:pitch 69\r
    :length 0.5\r
    :time 15.6}\r
   {:pitch 69\r
    :length 0.3\r
    :time 16}\r
   {:pitch 67\r
    :length 0.5\r
    :time 16.2}\r
   {:pitch 62\r
    :length 1\r
    :time 16.6}\r
   {:pitch 64\r
    :length 0.5\r
    :time 18.8}\r
   {:pitch 65\r
    :length 0.2\r
    :time 19.2}\r
   {:pitch 62\r
    :length 0.2\r
    :time 19.4}\r
   {:pitch 57\r
    :length 0.2\r
    :time 19.6}\r
   {:pitch 62\r
    :length 1\r
    :time 19.8}\r
   {:pitch 59\r
    :length 0.2\r
    :time 21.2}\r
   {:pitch 59\r
    :length 0.2\r
    :time 21.4}\r
   {:pitch 60\r
    :length 0.5\r
    :time 21.8}\r
   {:pitch 64\r
    :length 0.5\r
    :time 22.4}\r
   {:pitch 62\r
    :length 1\r
    :time 23}\r
   {:pitch 71\r
    :length 0.2\r
    :time 26}\r
   {:pitch 71\r
    :length 0.5\r
    :time 26.2}\r
   {:pitch 71\r
    :length 0.3\r
    :time 26.8}\r
   {:pitch 71\r
    :length 0.3\r
    :time 27.2}\r
   {:pitch 72\r
    :length 0.2\r
    :time 27.6}\r
   {:pitch 69\r
    :length 1\r
    :time 27.8}\r
   {:pitch 69\r
    :length 0.2\r
    :time 29.4}\r
   {:pitch 69\r
    :length 0.5\r
    :time 29.6}\r
   {:pitch 69\r
    :length 0.5\r
    :time 30}\r
   {:pitch 69\r
    :length 0.2\r
    :time 30.4}\r
   {:pitch 71\r
    :length 0.2\r
    :time 30.6}\r
   {:pitch 69\r
    :length 0.2\r
    :time 30.8}\r
   {:pitch 67\r
    :length 1\r
    :time 31}\r
   {:pitch 67\r
    :length 0.15\r
    :time 32.4}\r
   {:pitch 67\r
    :length 0.3\r
    :time 32.6}\r
   {:pitch 66\r
    :length 0.3\r
    :time 33}\r
   {:pitch 64\r
    :length 0.2\r
    :time 33.4}\r
   {:pitch 66\r
    :length 0.5\r
    :time 33.6}\r
   {:pitch 64\r
    :length 0.6\r
    :time 34.2}\r
   {:pitch 63\r
    :length 0.2\r
    :time 35.2}\r
   {:pitch 64\r
    :length 0.5\r
    :time 35.4}\r
   {:pitch 66\r
    :length 0.5\r
    :time 35.8}\r
   {:pitch 67\r
    :length 1\r
    :time 36.6}\r
   {:pitch 62\r
    :length 0.2\r
    :time 37.4}\r
   {:pitch 64\r
    :length 0.2\r
    :time 37.6}\r
   {:pitch 67\r
    :length 0.2\r
    :time 37.8}\r
   {:pitch 69\r
    :length 0.2\r
    :time 38}\r
   {:pitch 71\r
    :length 1\r
    :time 38.2}\r
   {:pitch 69\r
    :length 0.3\r
    :time 38.8}\r
   {:pitch 67\r
    :length 0.2\r
    :time 39.2}\r
   {:pitch 69\r
    :length 0.4\r
    :time 39.4}\r
   {:pitch 67\r
    :length 0.1\r
    :time 39.8}\r
   {:pitch 69\r
    :length 0.2\r
    :time 39.9}\r
   {:pitch 67\r
    :length 0.5\r
    :time 40}\r
   {:pitch 64\r
    :length 1\r
    :time 40.6}\r
   {:pitch 67\r
    :length 0.1\r
    :time 42.2}\r
   {:pitch 55\r
    :length 0.1\r
    :time 42.2}\r
   {:pitch 67\r
    :length 0.17\r
    :time 42.4}\r
   {:pitch 55\r
    :length 0.17\r
    :time 42.4}\r
   {:pitch 67\r
    :length 0.17\r
    :time 42.6}\r
   {:pitch 55\r
    :length 0.17\r
    :time 42.6}\r
   {:pitch 66\r
    :length 0.17\r
    :time 42.8}\r
   {:pitch 54\r
    :length 0.17\r
    :time 42.8}\r
   {:pitch 66\r
    :length 0.17\r
    :time 43}\r
   {:pitch 54\r
    :length 0.17\r
    :time 43}\r
   {:pitch 64\r
    :length 1\r
    :time 43.2}\r
   {:pitch 52\r
    :length 1\r
    :time 43.2}\r
   {:pitch 76\r
    :length 0.2\r
    :time 44}\r
   {:pitch 74\r
    :length 0.2\r
    :time 44.2}\r
   {:pitch 71\r
    :length 0.2\r
    :time 44.4}\r
   {:pitch 69\r
    :length 0.2\r
    :time 44.6}\r
   {:pitch 71\r
    :length 1\r
    :time 44.8}\r
   {:pitch 69\r
    :length 0.2\r
    :time 45.8}\r
   {:pitch 71\r
    :length 0.2\r
    :time 46}\r
   {:pitch 69\r
    :length 0.2\r
    :time 46.2}\r
   {:pitch 69\r
    :length 0.2\r
    :time 46.4}\r
   {:pitch 67\r
    :length 0.5\r
    :time 46.6}\r
   {:pitch 67\r
    :length 0.2\r
    :time 47}\r
   {:pitch 60\r
    :length 0.5\r
    :time 47.2}\r
   {:pitch 72\r
    :length 0.5\r
    :time 47.6}\r
   {:pitch 71\r
    :length 1\r
    :time 48}\r
   {:pitch 72\r
    :length 0.5\r
    :time 70.4}\r
   {:pitch 72\r
    :length 0.5\r
    :time 70.8}\r
   {:pitch 72\r
    :length 1\r
    :time 71.2}\r
   {:pitch 72\r
    :length 0.5\r
    :time 71.8}\r
   {:pitch 71\r
    :length 1\r
    :time 72.2}\r
   {:pitch 72\r
    :length 0.5\r
    :time 73.6}\r
   {:pitch 72\r
    :length 0.5\r
    :time 74}\r
   {:pitch 72\r
    :length 1\r
    :time 74.4}\r
   {:pitch 74\r
    :length 0.5\r
    :time 75.2}\r
   {:pitch 76\r
    :length 0.2\r
    :time 75.6}\r
   {:pitch 74\r
    :length 1\r
    :time 75.8}\r
   {:pitch 74\r
    :length 0.2\r
    :time 77.4}\r
   {:pitch 74\r
    :length 0.2\r
    :time 77.6}\r
   {:pitch 72\r
    :length 0.2\r
    :time 77.8}\r
   {:pitch 71\r
    :length 0.2\r
    :time 78}\r
   {:pitch 69\r
    :length 1\r
    :time 78.2}\r
   {:pitch 67\r
    :length 0.2\r
    :time 79}\r
   {:pitch 69\r
    :length 0.2\r
    :time 79.2}\r
   {:pitch 72\r
    :length 0.2\r
    :time 79.4}\r
   {:pitch 74\r
    :length 0.2\r
    :time 79.6}\r
   {:pitch 76\r
    :length 1\r
    :time 79.8}\r
   {:pitch 74\r
    :length 0.2\r
    :time 80.4}\r
   {:pitch 72\r
    :length 0.2\r
    :time 80.8}\r
   {:pitch 74\r
    :length 0.4\r
    :time 81}\r
   {:pitch 72\r
    :length 0.1\r
    :time 81.4}\r
   {:pitch 74\r
    :length 0.1\r
    :time 81.5}\r
   {:pitch 72\r
    :length 0.8\r
    :time 81.6}\r
   {:pitch 69\r
    :length 0.2\r
    :time 82.2}\r
   {:pitch 68\r
    :length 0.1\r
    :time 82.44}\r
   {:pitch 67\r
    :length 0.1\r
    :time 82.47999999999999}\r
   {:pitch 66\r
    :length 0.1\r
    :time 82.52000000000001}\r
   {:pitch 65\r
    :length 0.1\r
    :time 82.56}\r
   {:pitch 64\r
    :length 0.1\r
    :time 82.6}\r
   {:pitch 63\r
    :length 0.1\r
    :time 82.64}\r
   {:pitch 62\r
    :length 0.1\r
    :time 82.67999999999999}\r
   {:pitch 61\r
    :length 0.1\r
    :time 82.72}\r
   {:pitch 60\r
    :length 0.1\r
    :time 82.76}\r
   {:pitch 59\r
    :length 0.1\r
    :time 82.8}\r
   {:pitch 58\r
    :length 0.1\r
    :time 82.84}\r
   {:pitch 58\r
    :length 0.1\r
    :time 82.88}\r
   {:pitch 58\r
    :length 0.2\r
    :time 82.92}\r
   {:pitch 72\r
    :length 0.2\r
    :time 83.2}\r
   {:pitch 72\r
    :length 0.2\r
    :time 83.4}\r
   {:pitch 72\r
    :length 0.2\r
    :time 83.8}\r
   {:pitch 69\r
    :length 0.2\r
    :time 84.2}\r
   {:pitch 67\r
    :length 0.2\r
    :time 84.6}\r
   {:pitch 69\r
    :length 0.1\r
    :time 84.8}\r
   {:pitch 68\r
    :length 0.1\r
    :time 84.84}\r
   {:pitch 67\r
    :length 0.1\r
    :time 84.88}\r
   {:pitch 66\r
    :length 0.1\r
    :time 84.92}\r
   {:pitch 65\r
    :length 0.1\r
    :time 84.96000000000001}\r
   {:pitch 64\r
    :length 0.1\r
    :time 85}\r
   {:pitch 63\r
    :length 0.1\r
    :time 85.03999999999999}\r
   {:pitch 62\r
    :length 0.1\r
    :time 85.08}\r
   {:pitch 62\r
    :length 0.1\r
    :time 85.12}\r
   {:pitch 62\r
    :length 0.1\r
    :time 85.16}\r
   {:pitch 62\r
    :length 0.2\r
    :time 85.4}\r
   {:pitch 64\r
    :length 0.2\r
    :time 85.6}\r
   {:pitch 67\r
    :length 0.2\r
    :time 85.8}\r
   {:pitch 69\r
    :length 0.5\r
    :time 86}\r
   {:pitch 69\r
    :length 0.2\r
    :time 86.4}\r
   {:pitch 71\r
    :length 0.5\r
    :time 86.6}\r
   {:pitch 67\r
    :length 1\r
    :time 87}\r
   {:pitch 64\r
    :length 0.2\r
    :time 88}\r
   {:pitch 62\r
    :length 0.5\r
    :time 88.2}\r
   {:pitch 62\r
    :length 1\r
    :time 88.6}\r
   {:pitch 64\r
    :length 0.6\r
    :time 91.2}\r
   {:pitch 69\r
    :length 1\r
    :time 91.8}\r
   {:pitch 69\r
    :length 0.4\r
    :time 94}\r
   {:pitch 69\r
    :length 0.2\r
    :time 94.4}\r
   {:pitch 67\r
    :length 0.6\r
    :time 94.6}\r
   {:pitch 62\r
    :length 1\r
    :time 95}\r
   {:pitch 64\r
    :length 0.3\r
    :time 97.2}\r
   {:pitch 65\r
    :length 0.2\r
    :time 97.6}\r
   {:pitch 62\r
    :length 0.2\r
    :time 97.8}\r
   {:pitch 57\r
    :length 0.2\r
    :time 98}\r
   {:pitch 62\r
    :length 1\r
    :time 98.2}\r
   {:pitch 59\r
    :length 0.2\r
    :time 99.6}\r
   {:pitch 59\r
    :length 0.5\r
    :time 99.8}\r
   {:pitch 60\r
    :length 0.5\r
    :time 100.2}\r
   {:pitch 64\r
    :length 0.5\r
    :time 100.8}\r
   {:pitch 62\r
    :length 1\r
    :time 101.4}\r
   {:pitch 71\r
    :length 0.2\r
    :time 104.4}\r
   {:pitch 71\r
    :length 0.5\r
    :time 104.6}\r
   {:pitch 71\r
    :length 0.5\r
    :time 105.2}\r
   {:pitch 71\r
    :length 0.5\r
    :time 105.6}\r
   {:pitch 72\r
    :length 0.2\r
    :time 106}\r
   {:pitch 69\r
    :length 1\r
    :time 106.2}\r
   {:pitch 69\r
    :length 0.1\r
    :time 107.8}\r
   {:pitch 69\r
    :length 0.5\r
    :time 108}\r
   {:pitch 69\r
    :length 0.5\r
    :time 108.4}\r
   {:pitch 69\r
    :length 0.2\r
    :time 108.8}\r
   {:pitch 71\r
    :length 0.2\r
    :time 109}\r
   {:pitch 69\r
    :length 0.2\r
    :time 109.2}\r
   {:pitch 67\r
    :length 1\r
    :time 109.4}\r
   {:pitch 67\r
    :length 0.1\r
    :time 110.8}\r
   {:pitch 67\r
    :length 0.4\r
    :time 111}\r
   {:pitch 66\r
    :length 0.3\r
    :time 111.4}\r
   {:pitch 64\r
    :length 0.2\r
    :time 111.8}\r
   {:pitch 66\r
    :length 0.5\r
    :time 112}\r
   {:pitch 64\r
    :length 1\r
    :time 112.6}\r
   {:pitch 63\r
    :length 0.2\r
    :time 113.6}\r
   {:pitch 64\r
    :length 0.5\r
    :time 113.8}\r
   {:pitch 66\r
    :length 1\r
    :time 114.2}\r
   {:pitch 67\r
    :length 1\r
    :time 115}\r
   {:pitch 62\r
    :length 0.2\r
    :time 115.8}\r
   {:pitch 64\r
    :length 0.2\r
    :time 116}\r
   {:pitch 67\r
    :length 0.2\r
    :time 116.2}\r
   {:pitch 69\r
    :length 0.2\r
    :time 116.4}\r
   {:pitch 71\r
    :length 1\r
    :time 116.6}\r
   {:pitch 69\r
    :length 0.3\r
    :time 117.2}\r
   {:pitch 67\r
    :length 0.2\r
    :time 117.6}\r
   {:pitch 69\r
    :length 0.4\r
    :time 117.8}\r
   {:pitch 67\r
    :length 0.1\r
    :time 118.2}\r
   {:pitch 69\r
    :length 0.1\r
    :time 118.3}\r
   {:pitch 67\r
    :length 0.5\r
    :time 118.4}\r
   {:pitch 64\r
    :length 1\r
    :time 119}\r
   {:pitch 67\r
    :length 0.17\r
    :time 120.6}\r
   {:pitch 55\r
    :length 0.17\r
    :time 120.6}\r
   {:pitch 67\r
    :length 0.17\r
    :time 120.8}\r
   {:pitch 55\r
    :length 0.17\r
    :time 120.8}\r
   {:pitch 67\r
    :length 0.17\r
    :time 121}\r
   {:pitch 55\r
    :length 0.17\r
    :time 121}\r
   {:pitch 66\r
    :length 0.17\r
    :time 121.2}\r
   {:pitch 54\r
    :length 0.17\r
    :time 121.2}\r
   {:pitch 66\r
    :length 0.17\r
    :time 121.4}\r
   {:pitch 54\r
    :length 0.17\r
    :time 121.4}\r
   {:pitch 64\r
    :length 0.5\r
    :time 121.6}\r
   {:pitch 52\r
    :length 0.5\r
    :time 121.6}\r
   {:pitch 76\r
    :length 0.2\r
    :time 122.4}\r
   {:pitch 74\r
    :length 0.2\r
    :time 122.6}\r
   {:pitch 71\r
    :length 0.2\r
    :time 122.8}\r
   {:pitch 69\r
    :length 0.4\r
    :time 123}\r
   {:pitch 71\r
    :length 0.5\r
    :time 123.2}\r
   {:pitch 69\r
    :length 0.2\r
    :time 124.2}\r
   {:pitch 71\r
    :length 0.2\r
    :time 124.4}\r
   {:pitch 69\r
    :length 0.2\r
    :time 124.6}\r
   {:pitch 69\r
    :length 0.2\r
    :time 124.8}\r
   {:pitch 67\r
    :length 0.4\r
    :time 125}\r
   {:pitch 67\r
    :length 0.1\r
    :time 125.4}\r
   {:pitch 64\r
    :length 0.4\r
    :time 125.6}\r
   {:pitch 72\r
    :length 0.5\r
    :time 126}\r
   {:pitch 71\r
    :length 1\r
    :time 126.4}\r
   {:pitch 72\r
    :length 0.5\r
    :time 148.8}\r
   {:pitch 72\r
    :length 0.5\r
    :time 149.2}\r
   {:pitch 72\r
    :length 1\r
    :time 149.6}\r
   {:pitch 72\r
    :length 0.5\r
    :time 150.2}\r
   {:pitch 71\r
    :length 1\r
    :time 150.6}\r
   {:pitch 72\r
    :length 0.5\r
    :time 152}\r
   {:pitch 72\r
    :length 0.5\r
    :time 152.4}\r
   {:pitch 72\r
    :length 1\r
    :time 152.8}\r
   {:pitch 74\r
    :length 0.4\r
    :time 153.6}\r
   {:pitch 76\r
    :length 0.2\r
    :time 154}\r
   {:pitch 74\r
    :length 1\r
    :time 154.2}\r
   {:pitch 74\r
    :length 0.2\r
    :time 155.8}\r
   {:pitch 74\r
    :length 0.2\r
    :time 156}\r
   {:pitch 72\r
    :length 0.2\r
    :time 156.2}\r
   {:pitch 71\r
    :length 0.2\r
    :time 156.4}\r
   {:pitch 69\r
    :length 1\r
    :time 156.6}\r
   {:pitch 67\r
    :length 0.2\r
    :time 157.4}\r
   {:pitch 69\r
    :length 0.2\r
    :time 157.6}\r
   {:pitch 72\r
    :length 0.2\r
    :time 157.8}\r
   {:pitch 74\r
    :length 0.2\r
    :time 158}\r
   {:pitch 76\r
    :length 1\r
    :time 158.2}\r
   {:pitch 74\r
    :length 0.4\r
    :time 158.8}\r
   {:pitch 72\r
    :length 0.2\r
    :time 159.2}\r
   {:pitch 74\r
    :length 0.4\r
    :time 159.4}\r
   {:pitch 72\r
    :length 0.1\r
    :time 159.8}\r
   {:pitch 74\r
    :length 0.1\r
    :time 159.9}\r
   {:pitch 72\r
    :length 0.4\r
    :time 160}\r
   {:pitch 69\r
    :length 0.5\r
    :time 160.4}\r
   {:pitch 68\r
    :length 0.1\r
    :time 160.84}\r
   {:pitch 67\r
    :length 0.1\r
    :time 160.88}\r
   {:pitch 66\r
    :length 0.1\r
    :time 160.92000000000002}\r
   {:pitch 65\r
    :length 0.1\r
    :time 160.95999999999998}\r
   {:pitch 64\r
    :length 0.1\r
    :time 161}\r
   {:pitch 63\r
    :length 0.1\r
    :time 161.04000000000002}\r
   {:pitch 62\r
    :length 0.1\r
    :time 161.07999999999998}\r
   {:pitch 61\r
    :length 0.1\r
    :time 161.12}\r
   {:pitch 60\r
    :length 0.1\r
    :time 161.16}\r
   {:pitch 59\r
    :length 0.1\r
    :time 161.2}\r
   {:pitch 58\r
    :length 0.1\r
    :time 161.24}\r
   {:pitch 58\r
    :length 0.1\r
    :time 161.28}\r
   {:pitch 58\r
    :length 0.2\r
    :time 161.32}\r
   {:pitch 72\r
    :length 0.2\r
    :time 161.6}\r
   {:pitch 72\r
    :length 0.5\r
    :time 161.8}\r
   {:pitch 72\r
    :length 0.2\r
    :time 162.2}\r
   {:pitch 69\r
    :length 0.2\r
    :time 162.6}\r
   {:pitch 67\r
    :length 0.4\r
    :time 163}\r
   {:pitch 69\r
    :length 0.2\r
    :time 163.2}\r
   {:pitch 68\r
    :length 0.1\r
    :time 163.24}\r
   {:pitch 67\r
    :length 0.1\r
    :time 163.28}\r
   {:pitch 66\r
    :length 0.1\r
    :time 163.32}\r
   {:pitch 65\r
    :length 0.1\r
    :time 163.35999999999999}\r
   {:pitch 64\r
    :length 0.1\r
    :time 163.4}\r
   {:pitch 63\r
    :length 0.1\r
    :time 163.44}\r
   {:pitch 62\r
    :length 0.1\r
    :time 163.48}\r
   {:pitch 62\r
    :length 0.1\r
    :time 163.52}\r
   {:pitch 62\r
    :length 0.1\r
    :time 163.56}\r
   {:pitch 62\r
    :length 0.2\r
    :time 163.8}\r
   {:pitch 64\r
    :length 0.2\r
    :time 164}\r
   {:pitch 67\r
    :length 0.2\r
    :time 164.2}\r
   {:pitch 69\r
    :length 0.4\r
    :time 164.4}\r
   {:pitch 69\r
    :length 0.2\r
    :time 164.8}\r
   {:pitch 71\r
    :length 0.4\r
    :time 165}\r
   {:pitch 67\r
    :length 0.5\r
    :time 165.4}\r
   {:pitch 64\r
    :length 0.2\r
    :time 166.4}\r
   {:pitch 62\r
    :length 0.4\r
    :time 166.6}\r
   {:pitch 62\r
    :length 1\r
    :time 167}\r
   {:pitch 67\r
    :length 0.2\r
    :time 170.2}\r
   {:pitch 69\r
    :length 0.2\r
    :time 170.4}\r
   {:pitch 72\r
    :length 0.2\r
    :time 170.6}\r
   {:pitch 74\r
    :length 0.2\r
    :time 170.8}\r
   {:pitch 76\r
    :length 0.7\r
    :time 171}\r
   {:pitch 74\r
    :length 0.3\r
    :time 171.6}\r
   {:pitch 72\r
    :length 0.2\r
    :time 172}\r
   {:pitch 74\r
    :length 0.4\r
    :time 172.2}\r
   {:pitch 72\r
    :length 0.1\r
    :time 172.6}\r
   {:pitch 74\r
    :length 0.1\r
    :time 172.7}\r
   {:pitch 72\r
    :length 0.4\r
    :time 172.8}\r
   {:pitch 69\r
    :length 0.2\r
    :time 173.4}\r
   {:pitch 68\r
    :length 0.1\r
    :time 173.64000000000001}\r
   {:pitch 67\r
    :length 0.1\r
    :time 173.68}\r
   {:pitch 66\r
    :length 0.1\r
    :time 173.72}\r
   {:pitch 65\r
    :length 0.1\r
    :time 173.76}\r
   {:pitch 64\r
    :length 0.1\r
    :time 173.8}\r
   {:pitch 63\r
    :length 0.1\r
    :time 173.84}\r
   {:pitch 62\r
    :length 0.1\r
    :time 173.88}\r
   {:pitch 61\r
    :length 0.1\r
    :time 173.92000000000002}\r
   {:pitch 60\r
    :length 0.1\r
    :time 173.95999999999998}\r
   {:pitch 59\r
    :length 0.1\r
    :time 174}\r
   {:pitch 58\r
    :length 0.1\r
    :time 174.04000000000002}\r
   {:pitch 58\r
    :length 0.1\r
    :time 174.07999999999998}\r
   {:pitch 58\r
    :length 0.2\r
    :time 174.12}\r
   {:pitch 72\r
    :length 0.2\r
    :time 174.4}\r
   {:pitch 72\r
    :length 0.2\r
    :time 174.6}\r
   {:pitch 72\r
    :length 0.2\r
    :time 175}\r
   {:pitch 69\r
    :length 0.4\r
    :time 175.4}\r
   {:pitch 67\r
    :length 0.2\r
    :time 175.8}\r
   {:pitch 69\r
    :length 0.2\r
    :time 176}\r
   {:pitch 68\r
    :length 0.1\r
    :time 176.04000000000002}\r
   {:pitch 67\r
    :length 0.1\r
    :time 176.07999999999998}\r
   {:pitch 66\r
    :length 0.1\r
    :time 176.12}\r
   {:pitch 65\r
    :length 0.1\r
    :time 176.16}\r
   {:pitch 64\r
    :length 0.1\r
    :time 176.2}\r
   {:pitch 63\r
    :length 0.1\r
    :time 176.24}\r
   {:pitch 62\r
    :length 0.1\r
    :time 176.28}\r
   {:pitch 62\r
    :length 0.1\r
    :time 176.32}\r
   {:pitch 62\r
    :length 0.1\r
    :time 176.35999999999999}\r
   {:pitch 62\r
    :length 0.2\r
    :time 176.6}\r
   {:pitch 64\r
    :length 0.2\r
    :time 176.8}\r
   {:pitch 67\r
    :length 0.2\r
    :time 177}\r
   {:pitch 69\r
    :length 0.2\r
    :time 177.2}\r
   {:pitch 69\r
    :length 0.2\r
    :time 177.6}\r
   {:pitch 71\r
    :length 0.2\r
    :time 177.8}\r
   {:pitch 67\r
    :length 0.2\r
    :time 178.2}\r
   {:pitch 67\r
    :length 0.2\r
    :time 178.6}\r
   {:pitch 62\r
    :length 0.2\r
    :time 179}\r
   {:pitch 62\r
    :length 0.2\r
    :time 179.2}\r
   {:pitch 74\r
    :length 0.2\r
    :time 179.2}\r
   {:pitch 62\r
    :length 0.2\r
    :time 179.4}\r
   {:pitch 74\r
    :length 0.2\r
    :time 179.4}\r
   {:pitch 62\r
    :length 0.2\r
    :time 179.6}\r
   {:pitch 74\r
    :length 0.2\r
    :time 179.6}\r
   {:pitch 57\r
    :length 0.2\r
    :time 179.8}\r
   {:pitch 69\r
    :length 0.2\r
    :time 179.8}\r
   {:pitch 57\r
    :length 0.2\r
    :time 180}\r
   {:pitch 69\r
    :length 0.2\r
    :time 180}\r
   {:pitch 57\r
    :length 0.2\r
    :time 180.2}\r
   {:pitch 69\r
    :length 0.2\r
    :time 180.2}\r
   {:pitch 57\r
    :length 0.2\r
    :time 180.4}\r
   {:pitch 69\r
    :length 0.2\r
    :time 180.4}\r
   {:pitch 52\r
    :length 0.2\r
    :time 180.6}\r
   {:pitch 64\r
    :length 0.2\r
    :time 180.6}\r
   {:pitch 52\r
    :length 0.2\r
    :time 180.8}\r
   {:pitch 64\r
    :length 0.2\r
    :time 180.8}\r
   {:pitch 52\r
    :length 0.2\r
    :time 181}\r
   {:pitch 64\r
    :length 0.2\r
    :time 181}\r
   {:pitch 52\r
    :length 0.2\r
    :time 181.2}\r
   {:pitch 64\r
    :length 0.2\r
    :time 181.2}\r
   {:pitch 50\r
    :length 0.2\r
    :time 181.4}\r
   {:pitch 62\r
    :length 0.2\r
    :time 181.4}\r
   {:pitch 52\r
    :length 0.2\r
    :time 181.6}\r
   {:pitch 64\r
    :length 0.2\r
    :time 181.6}\r
   {:pitch 50\r
    :length 0.2\r
    :time 181.8}\r
   {:pitch 62\r
    :length 0.2\r
    :time 181.8}\r
   {:pitch 72\r
    :length 0.2\r
    :time 183.2}\r
   {:pitch 72\r
    :length 0.2\r
    :time 183.4}\r
   {:pitch 72\r
    :length 0.5\r
    :time 183.8}\r
   {:pitch 74\r
    :length 0.5\r
    :time 184.4}\r
   {:pitch 81\r
    :length 0.5\r
    :time 185.6}\r
   {:pitch 78\r
    :length 0.5\r
    :time 186.2}\r
   {:pitch 76\r
    :length 0.5\r
    :time 187.2}\r
   {:pitch 78\r
    :length 0.5\r
    :time 187.8}\r
   {:pitch 74\r
    :length 0.2\r
    :time 188.8}\r
   {:pitch 72\r
    :length 0.2\r
    :time 189}\r
   {:pitch 69\r
    :length 0.2\r
    :time 189.4}\r
   {:pitch 67\r
    :length 0.2\r
    :time 190.4}\r
   {:pitch 69\r
    :length 0.5\r
    :time 190.6}\r
   {:pitch 67\r
    :length 0.5\r
    :time 191}\r
   {:pitch 64\r
    :length 0.5\r
    :time 192}\r
   {:pitch 62\r
    :length 1\r
    :time 192.6}\r
   {:pitch 71\r
    :length 0.2\r
    :time 195.2}\r
   {:pitch 74\r
    :length 0.2\r
    :time 195.2}\r
   {:pitch 71\r
    :length 0.2\r
    :time 195.6}\r
   {:pitch 74\r
    :length 0.2\r
    :time 195.6}\r
   {:pitch 71\r
    :length 0.2\r
    :time 196.2}\r
   {:pitch 74\r
    :length 0.2\r
    :time 196.2}\r
   {:pitch 71\r
    :length 0.2\r
    :time 196.6}\r
   {:pitch 74\r
    :length 0.2\r
    :time 196.6}\r
   {:pitch 69\r
    :length 0.2\r
    :time 196.8}\r
   {:pitch 76\r
    :length 0.2\r
    :time 196.8}\r
   {:pitch 69\r
    :length 0.2\r
    :time 197.2}\r
   {:pitch 76\r
    :length 0.2\r
    :time 197.2}\r
   {:pitch 69\r
    :length 0.2\r
    :time 197.8}\r
   {:pitch 76\r
    :length 0.2\r
    :time 197.8}\r
   {:pitch 69\r
    :length 0.2\r
    :time 198.2}\r
   {:pitch 76\r
    :length 0.2\r
    :time 198.2}\r
   {:pitch 69\r
    :length 0.2\r
    :time 198.4}\r
   {:pitch 74\r
    :length 0.2\r
    :time 198.4}\r
   {:pitch 69\r
    :length 0.2\r
    :time 198.8}\r
   {:pitch 74\r
    :length 0.2\r
    :time 198.8}\r
   {:pitch 69\r
    :length 0.2\r
    :time 199.4}\r
   {:pitch 74\r
    :length 0.2\r
    :time 199.4}\r
   {:pitch 69\r
    :length 0.2\r
    :time 199.8}\r
   {:pitch 74\r
    :length 0.2\r
    :time 199.8}\r
   {:pitch 69\r
    :length 0.2\r
    :time 200}\r
   {:pitch 76\r
    :length 0.2\r
    :time 200}\r
   {:pitch 69\r
    :length 0.2\r
    :time 200.2}\r
   {:pitch 76\r
    :length 0.2\r
    :time 200.2}\r
   {:pitch 69\r
    :length 0.2\r
    :time 200.4}\r
   {:pitch 76\r
    :length 0.2\r
    :time 200.4}\r
   {:pitch 69\r
    :length 0.2\r
    :time 200.6}\r
   {:pitch 74\r
    :length 0.2\r
    :time 200.6}\r
   {:pitch 69\r
    :length 0.2\r
    :time 201}\r
   {:pitch 74\r
    :length 0.2\r
    :time 201}\r
   {:pitch 69\r
    :length 0.2\r
    :time 201.4}\r
   {:pitch 74\r
    :length 0.2\r
    :time 201.4}\r
   {:pitch 71\r
    :length 0.2\r
    :time 201.6}\r
   {:pitch 74\r
    :length 0.2\r
    :time 201.6}\r
   {:pitch 71\r
    :length 0.2\r
    :time 202}\r
   {:pitch 74\r
    :length 0.2\r
    :time 202}\r
   {:pitch 71\r
    :length 0.2\r
    :time 202.6}\r
   {:pitch 74\r
    :length 0.2\r
    :time 202.6}\r
   {:pitch 71\r
    :length 0.2\r
    :time 203}\r
   {:pitch 74\r
    :length 0.2\r
    :time 203}\r
   {:pitch 69\r
    :length 0.2\r
    :time 203.2}\r
   {:pitch 76\r
    :length 0.2\r
    :time 203.2}\r
   {:pitch 69\r
    :length 0.2\r
    :time 203.6}\r
   {:pitch 76\r
    :length 0.2\r
    :time 203.6}\r
   {:pitch 69\r
    :length 0.2\r
    :time 204.2}\r
   {:pitch 76\r
    :length 0.2\r
    :time 204.2}\r
   {:pitch 69\r
    :length 0.2\r
    :time 204.6}\r
   {:pitch 76\r
    :length 0.2\r
    :time 204.6}\r
   {:pitch 69\r
    :length 0.2\r
    :time 204.8}\r
   {:pitch 74\r
    :length 0.2\r
    :time 204.8}\r
   {:pitch 69\r
    :length 0.2\r
    :time 205.2}\r
   {:pitch 74\r
    :length 0.2\r
    :time 205.2}\r
   {:pitch 69\r
    :length 0.2\r
    :time 205.8}\r
   {:pitch 74\r
    :length 0.2\r
    :time 205.8}\r
   {:pitch 69\r
    :length 0.2\r
    :time 206.2}\r
   {:pitch 74\r
    :length 0.2\r
    :time 206.2}\r
   {:pitch 69\r
    :length 0.2\r
    :time 206.4}\r
   {:pitch 76\r
    :length 0.2\r
    :time 206.4}\r
   {:pitch 69\r
    :length 0.2\r
    :time 206.6}\r
   {:pitch 76\r
    :length 0.2\r
    :time 206.6}\r
   {:pitch 69\r
    :length 0.2\r
    :time 206.8}\r
   {:pitch 76\r
    :length 0.2\r
    :time 206.8}\r
   {:pitch 69\r
    :length 0.2\r
    :time 207}\r
   {:pitch 74\r
    :length 0.2\r
    :time 207}\r
   {:pitch 69\r
    :length 0.2\r
    :time 207.4}\r
   {:pitch 74\r
    :length 0.2\r
    :time 207.4}\r
   {:pitch 69\r
    :length 0.2\r
    :time 207.8}\r
   {:pitch 74\r
    :length 0.2\r
    :time 207.8}\r
   {:pitch 71\r
    :length 0.2\r
    :time 208}\r
   {:pitch 74\r
    :length 0.2\r
    :time 208}\r
   {:pitch 71\r
    :length 0.2\r
    :time 208.4}\r
   {:pitch 74\r
    :length 0.2\r
    :time 208.4}\r
   {:pitch 71\r
    :length 0.2\r
    :time 209}\r
   {:pitch 74\r
    :length 0.2\r
    :time 209}\r
   {:pitch 71\r
    :length 0.2\r
    :time 209.4}\r
   {:pitch 74\r
    :length 0.2\r
    :time 209.4}\r
   {:pitch 69\r
    :length 0.2\r
    :time 209.6}\r
   {:pitch 76\r
    :length 0.2\r
    :time 209.6}\r
   {:pitch 69\r
    :length 0.2\r
    :time 210}\r
   {:pitch 76\r
    :length 0.2\r
    :time 210}\r
   {:pitch 69\r
    :length 0.2\r
    :time 210.6}\r
   {:pitch 76\r
    :length 0.2\r
    :time 210.6}\r
   {:pitch 69\r
    :length 0.2\r
    :time 211}\r
   {:pitch 76\r
    :length 0.2\r
    :time 211}\r
   {:pitch 69\r
    :length 0.2\r
    :time 211.2}\r
   {:pitch 74\r
    :length 0.2\r
    :time 211.2}\r
   {:pitch 69\r
    :length 0.2\r
    :time 211.6}\r
   {:pitch 74\r
    :length 0.2\r
    :time 211.6}\r
   {:pitch 69\r
    :length 0.2\r
    :time 212.2}\r
   {:pitch 74\r
    :length 0.2\r
    :time 212.2}\r
   {:pitch 69\r
    :length 0.2\r
    :time 212.6}\r
   {:pitch 74\r
    :length 0.2\r
    :time 212.6}\r
   {:pitch 69\r
    :length 0.2\r
    :time 212.8}\r
   {:pitch 76\r
    :length 0.2\r
    :time 212.8}\r
   {:pitch 69\r
    :length 0.2\r
    :time 213}\r
   {:pitch 76\r
    :length 0.2\r
    :time 213}\r
   {:pitch 69\r
    :length 0.2\r
    :time 213.2}\r
   {:pitch 76\r
    :length 0.2\r
    :time 213.2}\r
   {:pitch 69\r
    :length 0.2\r
    :time 213.4}\r
   {:pitch 74\r
    :length 0.2\r
    :time 213.4}\r
   {:pitch 69\r
    :length 0.2\r
    :time 213.8}\r
   {:pitch 74\r
    :length 0.2\r
    :time 213.8}\r
   {:pitch 69\r
    :length 0.2\r
    :time 214.2}\r
   {:pitch 74\r
    :length 0.2\r
    :time 214.2}])\r
(def pulse-2\r
  [{:pitch 64\r
    :length 0.5\r
    :time 40.8}\r
   {:pitch 72\r
    :length 0.5\r
    :time 41.2}\r
   {:pitch 71\r
    :length 0.5\r
    :time 41.6}\r
   {:pitch 64\r
    :length 0.5\r
    :time 47.2}\r
   {:pitch 72\r
    :length 0.5\r
    :time 47.6}\r
   {:pitch 71\r
    :length 0.5\r
    :time 48}\r
   {:pitch 69\r
    :length 0.15\r
    :time 50.2}\r
   {:pitch 72\r
    :length 0.5\r
    :time 50.2}\r
   {:pitch 69\r
    :length 0.15\r
    :time 50.4}\r
   {:pitch 72\r
    :length 0.5\r
    :time 50.4}\r
   {:pitch 69\r
    :length 0.5\r
    :time 50.6}\r
   {:pitch 72\r
    :length 0.5\r
    :time 50.6}\r
   {:pitch 69\r
    :length 0.5\r
    :time 51.2}\r
   {:pitch 72\r
    :length 0.5\r
    :time 51.2}\r
   {:pitch 71\r
    :length 0.5\r
    :time 51.4}\r
   {:pitch 74\r
    :length 0.5\r
    :time 51.4}\r
   {:pitch 67\r
    :length 0.5\r
    :time 51.8}\r
   {:pitch 71\r
    :length 0.5\r
    :time 51.8}\r
   {:pitch 67\r
    :length 0.5\r
    :time 53.4}\r
   {:pitch 71\r
    :length 0.5\r
    :time 53.4}\r
   {:pitch 67\r
    :length 0.5\r
    :time 53.6}\r
   {:pitch 71\r
    :length 0.5\r
    :time 53.6}\r
   {:pitch 64\r
    :length 0.5\r
    :time 54}\r
   {:pitch 67\r
    :length 0.5\r
    :time 54}\r
   {:pitch 67\r
    :length 0.5\r
    :time 54.4}\r
   {:pitch 71\r
    :length 0.5\r
    :time 54.4}\r
   {:pitch 66\r
    :length 0.5\r
    :time 55}\r
   {:pitch 69\r
    :length 0.5\r
    :time 55}\r
   {:pitch 64\r
    :length 0.3\r
    :time 57.6}\r
   {:pitch 60\r
    :length 0.3\r
    :time 57.8}\r
   {:pitch 57\r
    :length 0.3\r
    :time 58}\r
   {:pitch 64\r
    :length 0.5\r
    :time 58.2}\r
   {:pitch 60\r
    :length 0.3\r
    :time 58.6}\r
   {:pitch 57\r
    :length 0.3\r
    :time 58.8}\r
   {:pitch 62\r
    :length 0.5\r
    :time 59}\r
   {:pitch 59\r
    :length 0.5\r
    :time 59.4}\r
   {:pitch 57\r
    :length 0.3\r
    :time 59.8}\r
   {:pitch 55\r
    :length 0.5\r
    :time 60}\r
   {:pitch 66\r
    :length 0.3\r
    :time 60.8}\r
   {:pitch 62\r
    :length 0.3\r
    :time 61}\r
   {:pitch 59\r
    :length 0.3\r
    :time 61.2}\r
   {:pitch 66\r
    :length 0.5\r
    :time 61.4}\r
   {:pitch 62\r
    :length 0.5\r
    :time 61.8}\r
   {:pitch 64\r
    :length 0.5\r
    :time 62.2}\r
   {:pitch 68\r
    :length 0.5\r
    :time 62.8}\r
   {:pitch 69\r
    :length 0.5\r
    :time 63.2}\r
   {:pitch 71\r
    :length 0.5\r
    :time 63.6}\r
   {:pitch 64\r
    :length 0.3\r
    :time 64}\r
   {:pitch 60\r
    :length 0.3\r
    :time 64.2}\r
   {:pitch 57\r
    :length 0.3\r
    :time 64.4}\r
   {:pitch 64\r
    :length 0.5\r
    :time 64.6}\r
   {:pitch 60\r
    :length 0.3\r
    :time 65}\r
   {:pitch 57\r
    :length 0.3\r
    :time 65.2}\r
   {:pitch 62\r
    :length 0.5\r
    :time 65.4}\r
   {:pitch 59\r
    :length 0.5\r
    :time 65.8}\r
   {:pitch 57\r
    :length 0.3\r
    :time 66.2}\r
   {:pitch 55\r
    :length 0.5\r
    :time 66.4}\r
   {:pitch 66\r
    :length 0.3\r
    :time 67.2}\r
   {:pitch 62\r
    :length 0.3\r
    :time 67.4}\r
   {:pitch 59\r
    :length 0.3\r
    :time 67.6}\r
   {:pitch 66\r
    :length 0.5\r
    :time 67.8}\r
   {:pitch 62\r
    :length 0.5\r
    :time 68.2}\r
   {:pitch 64\r
    :length 0.5\r
    :time 68.6}\r
   {:pitch 68\r
    :length 0.5\r
    :time 69.2}\r
   {:pitch 69\r
    :length 0.5\r
    :time 69.6}\r
   {:pitch 71\r
    :length 0.5\r
    :time 70}\r
   {:pitch 64\r
    :length 0.5\r
    :time 119.2}\r
   {:pitch 72\r
    :length 0.5\r
    :time 119.6}\r
   {:pitch 71\r
    :length 0.5\r
    :time 120}\r
   {:pitch 64\r
    :length 0.5\r
    :time 125.6}\r
   {:pitch 72\r
    :length 0.5\r
    :time 126}\r
   {:pitch 71\r
    :length 0.5\r
    :time 126.4}\r
   {:pitch 69\r
    :length 0.15\r
    :time 128.6}\r
   {:pitch 72\r
    :length 0.5\r
    :time 128.6}\r
   {:pitch 69\r
    :length 0.15\r
    :time 128.8}\r
   {:pitch 72\r
    :length 0.5\r
    :time 128.8}\r
   {:pitch 69\r
    :length 0.5\r
    :time 129}\r
   {:pitch 72\r
    :length 0.5\r
    :time 129}\r
   {:pitch 69\r
    :length 0.5\r
    :time 129.6}\r
   {:pitch 72\r
    :length 0.5\r
    :time 129.6}\r
   {:pitch 71\r
    :length 0.5\r
    :time 129.8}\r
   {:pitch 74\r
    :length 0.5\r
    :time 129.8}\r
   {:pitch 67\r
    :length 0.5\r
    :time 130.2}\r
   {:pitch 71\r
    :length 0.5\r
    :time 130.2}\r
   {:pitch 67\r
    :length 0.5\r
    :time 131.8}\r
   {:pitch 71\r
    :length 0.5\r
    :time 131.8}\r
   {:pitch 67\r
    :length 0.5\r
    :time 132}\r
   {:pitch 71\r
    :length 0.5\r
    :time 132}\r
   {:pitch 64\r
    :length 0.5\r
    :time 132.4}\r
   {:pitch 67\r
    :length 0.5\r
    :time 132.4}\r
   {:pitch 67\r
    :length 0.5\r
    :time 132.8}\r
   {:pitch 71\r
    :length 0.5\r
    :time 132.8}\r
   {:pitch 66\r
    :length 0.5\r
    :time 133.4}\r
   {:pitch 69\r
    :length 0.5\r
    :time 133.4}\r
   {:pitch 64\r
    :length 0.3\r
    :time 136}\r
   {:pitch 60\r
    :length 0.3\r
    :time 136.2}\r
   {:pitch 57\r
    :length 0.3\r
    :time 136.4}\r
   {:pitch 64\r
    :length 0.5\r
    :time 136.6}\r
   {:pitch 60\r
    :length 0.3\r
    :time 137}\r
   {:pitch 57\r
    :length 0.3\r
    :time 137.2}\r
   {:pitch 62\r
    :length 0.5\r
    :time 137.4}\r
   {:pitch 59\r
    :length 0.5\r
    :time 137.8}\r
   {:pitch 57\r
    :length 0.3\r
    :time 138.2}\r
   {:pitch 55\r
    :length 0.5\r
    :time 138.4}\r
   {:pitch 66\r
    :length 0.3\r
    :time 139.2}\r
   {:pitch 62\r
    :length 0.3\r
    :time 139.4}\r
   {:pitch 59\r
    :length 0.3\r
    :time 139.6}\r
   {:pitch 66\r
    :length 0.5\r
    :time 139.8}\r
   {:pitch 62\r
    :length 0.5\r
    :time 140.2}\r
   {:pitch 64\r
    :length 0.5\r
    :time 140.6}\r
   {:pitch 68\r
    :length 0.5\r
    :time 141.2}\r
   {:pitch 69\r
    :length 0.5\r
    :time 141.6}\r
   {:pitch 71\r
    :length 0.5\r
    :time 142}\r
   {:pitch 64\r
    :length 0.3\r
    :time 142.4}\r
   {:pitch 60\r
    :length 0.3\r
    :time 142.6}\r
   {:pitch 57\r
    :length 0.3\r
    :time 142.8}\r
   {:pitch 64\r
    :length 0.5\r
    :time 143}\r
   {:pitch 60\r
    :length 0.3\r
    :time 143.4}\r
   {:pitch 57\r
    :length 0.3\r
    :time 143.6}\r
   {:pitch 62\r
    :length 0.5\r
    :time 143.8}\r
   {:pitch 59\r
    :length 0.5\r
    :time 144.2}\r
   {:pitch 57\r
    :length 0.3\r
    :time 144.6}\r
   {:pitch 55\r
    :length 0.5\r
    :time 144.8}\r
   {:pitch 66\r
    :length 0.3\r
    :time 145.6}\r
   {:pitch 62\r
    :length 0.3\r
    :time 145.8}\r
   {:pitch 59\r
    :length 0.3\r
    :time 146}\r
   {:pitch 66\r
    :length 0.5\r
    :time 146.2}\r
   {:pitch 62\r
    :length 0.5\r
    :time 146.6}\r
   {:pitch 64\r
    :length 0.5\r
    :time 147}\r
   {:pitch 68\r
    :length 0.5\r
    :time 147.6}\r
   {:pitch 69\r
    :length 0.5\r
    :time 148}\r
   {:pitch 71\r
    :length 0.5\r
    :time 148.4}])\r
`,megaman=`(def tempo 0.333333)\r
\r
(defn mmbass1 [time note]\r
  [{:time (* time tempo)  :length (* tempo 0.45) :pitch note}\r
   {:time (* tempo (+ 0.5 time)) :length (* tempo 0.2) :pitch note}\r
   {:time (* tempo (+ 0.75 time)) :length (* tempo 0.2) :pitch note}])\r
\r
(defn mmbass2 [time]\r
  (concat\r
   (apply concat\r
          (for [[beat note]\r
                [[0 61] [1 61] [2 61] [3 61] [4 61] [5 61] [6 61] [7 61]\r
                 [8 57] [9 57] [10 57] [11 57] [12 57] [13 57] [14 57] [15 57]\r
                 [16 59] [17 59] [18 59] [19 59] [20 59] [21 59] [22 59] [23 59]\r
                 [24 61] [25 61] [26 61] [27 61] [28 61] [29 61] [30 61]]]\r
            (mmbass1 (+ time beat) note)))\r
   [{:time (* tempo (+ 31 time)) :length (* tempo 0.45) :pitch 59}\r
    {:time (* tempo (+ 31.5 time)) :length (* tempo 0.75) :pitch 61}]))\r
\r
(defn mmbass3 [time]\r
  (into []\r
        (for [[beat length note]\r
              [[0 0.45 62] [0.5 0.2 62] [0.75 0.2 62] [1 0.45 62] [1.5 0.2 62]\r
               [1.75 0.2 62] [2 0.45 62] [2.5 0.2 69] [2.75 0.2 69] [3 0.2 66]\r
               [3.25 0.2 66] [3.5 0.45 66] [4.5 0.2 62] [4.75 0.2 62] [5 0.45 66]\r
               [5.5 0.2 62] [5.75 0.2 62] [6 0.4 73] [6.5 0.2 66] [6.75 0.2 66]\r
               [7 0.45 69] [7.5 0.2 62] [7.75 0.2 62]]]\r
          {:time (* tempo (+ beat time)) :length (* tempo length) :pitch note})))\r
\r
(defn mmbass4 [time]\r
  (into []\r
        (for [[beat length note]\r
              [[0 0.45 61] [0.5 0.2 61] [0.75 0.2 61] [1 0.45 61] [1.5 0.2 61]\r
               [1.75 0.2 61] [2 0.45 61] [2.5 0.2 68] [2.75 0.2 68] [3 0.2 64]\r
               [3.25 0.2 64] [3.5 0.45 71] [4.5 0.2 61] [4.75 0.2 61] [5 0.45 64]\r
               [5.5 0.2 61] [5.75 0.2 61] [6 0.45 71] [6.5 0.2 64] [6.75 0.2 64]\r
               [7 0.45 68] [7.5 0.2 61] [7.75 0.2 61]]]\r
          {:time (* tempo (+ beat time)) :length (* tempo length) :pitch note})))\r
\r
(defn mmbass5 [time]\r
  (into []\r
        (for [[beat length note]\r
              [[0 0.45 59] [0.5 0.2 59] [0.75 0.2 59] [1 0.45 59] [1.5 0.2 59]\r
               [1.75 0.2 59] [2 0.45 59] [2.5 0.2 59] [2.75 0.2 59] [3 0.45 59]\r
               [3.5 0.45 60] [4.5 0.45 60] [5 0.45 60] [5.5 0.45 60] [6 0.95 60]]]\r
          {:time (* tempo (+ beat time)) :length (* tempo length) :pitch note})))\r
\r
(defn mmbass6 [time]\r
  (into []\r
        (for [[beat length note]\r
              [[0.25 0.2 57] [0.5 0.2 57] [0.75 0.45 57] [1.25 0.2 57] [1.5 0.2 57]\r
               [1.75 0.45 57] [2.25 0.2 57] [2.5 0.2 57] [2.75 0.45 57] [3.25 0.95 59]\r
               [4.25 0.2 59] [4.5 0.2 59] [4.75 0.45 59] [5.25 0.2 59] [5.5 0.2 59]\r
               [5.75 0.45 59] [6.25 0.2 59] [6.5 0.2 59] [6.75 0.45 59] [7.25 0.95 49]\r
               [8.25 0.45 61] [8.75 0.45 51] [9.25 0.45 63] [9.75 0.45 52] [10.25 0.45 64]\r
               [10.75 0.45 51] [11.25 0.95 49] [12.25 0.45 61] [12.75 0.45 51] [13.25 0.45 63]\r
               [13.75 0.45 52] [14.25 0.45 64] [14.75 0.45 51] [15.25 0.95 57]]]\r
          {:time (* tempo (+ beat time)) :length (* tempo length) :pitch note})))\r
\r
(defn mmbass7 [time]\r
  (into []\r
        (for [[beat length note]\r
              [[0 0.95 61] [1 0.05 66] [1.05 0.05 64] [1.1 0.05 62] [1.15 0.05 61]\r
               [1.25 0.05 66] [1.3 0.05 64] [1.35 0.05 62] [1.4 0.05 61] [1.5 0.05 65]\r
               [1.55 0.05 63] [1.6 0.05 62] [1.65 0.05 60] [1.75 0.05 65] [1.8 0.05 63]\r
               [1.85 0.05 62] [1.9 0.05 60] [2 0.05 63] [2.05 0.05 62] [2.1 0.05 60]\r
               [2.15 0.05 59] [2.25 0.05 63] [2.3 0.05 62] [2.35 0.05 60] [2.4 0.05 59]\r
               [2.5 0.05 62] [2.55 0.05 61] [2.6 0.05 60] [2.65 0.05 58] [2.75 0.05 62]\r
               [2.8 0.05 61] [2.85 0.05 60] [2.9 0.05 58] [3 0.45 59] [3.5 0.95 61]\r
               [4.5 0.45 59] [5 0.95 61] [6 0.45 59] [6.5 0.45 60] [7 0.95 61]]]\r
          {:time (* tempo (+ beat time)) :length (* tempo length) :pitch note})))\r
\r
(def mmbass\r
  (concat (mmbass2 0) (rest (mmbass2 32))\r
          (rest (mmbass3 64)) (mmbass4 72) (mmbass3 80) (mmbass5 88)\r
          (mmbass2 96) (rest (mmbass2 128))\r
          (rest (mmbass3 160)) (mmbass4 168) (mmbass3 176) (mmbass5 184)\r
          [{:time (* tempo 191.5) :length (* tempo 0.95) :pitch 57}]\r
          (mmbass6 192.25) (take 18 (mmbass6 208.25))\r
          [{:time (* tempo 215) :length (* tempo 0.75) :pitch 60}]\r
          (mmbass7 216)))\r
\r
(defn mmdrums [time]\r
  [{:length 0.05 :time (* tempo (+ time 0))}\r
   {:length 0.05 :time (* tempo (+ time 0.5))}\r
   {:length 0.05 :time (* tempo (+ time 0.75))}\r
   {:length 0.2 :time (* tempo (+ time 1))}\r
   {:length 0.05 :time (* tempo (+ time 1.5))}\r
   {:length 0.05 :time (* tempo (+ time 1.75))}])\r
\r
(defn mm-lead1 [time]\r
  (into []\r
        (for [[beat length note]\r
              [[0 0.5 61] [0.5 0.25 64] [0.75 0.25 64] [1 0.5 64] [1.5 0.25 64]\r
               [1.75 0.25 64] [2 0.5 64] [2.5 0.5 61]  [3.5 0.25 61] [3.75 0.25 61]\r
               [4 0.5 64] [4.5 0.25 64] [4.75 0.25 64] [5 0.5 64] [5.5 0.5 61]\r
               [6.5 0.5 68] [7 0.5 66] [7.5 0.5 68] [8.5 0.25 64] [8.75 0.25 64]\r
               [9 0.5 64] [9.5 0.25 64] [9.75 0.25 64] [10 0.5 64] [10.5 0.5 61]\r
               [11.5 0.5 68] [12.5 0.5 66] [13.5 0.5 64] [14.5 0.5 66] [16.5 0.25 66]\r
               [16.75 0.25 66] [17 0.5 66] [17.5 0.25 66] [17.75 0.25 66] [18 0.5 66]\r
               [18.5 0.5 63] [19.5 0.5 68] [20.5 0.5 66] [21.5 0.5 64] [22.5 0.5 63]\r
               [23.5 0.5 61] [24.5 0.5 61] [25 0.5 68] [25.5 0.5 71] [26 1.5 70]\r
               [27.5 0.5 61] [28.5 0.5 61] [29 0.5 68] [29.5 0.5 71] [30 1.5 70]\r
               [31 0.5 75] [31.5 0.5 76]]]\r
          {:time (* tempo (+ beat time)) :length (* tempo (* 0.9 length)) :pitch note})))\r
\r
(defn mm-lead1a [time]\r
  (into []\r
        (for [[beat length note]\r
              [[0.5 0.25 61] [0.75 0.25 61] [1 0.5 61] [1.5 0.25 61] [1.75 0.25 61]\r
               [2 0.5 61] [2.5 0.5 56] [3.5 0.25 56] [3.75 0.25 56]\r
               [4 0.5 61] [4.5 0.25 61] [4.75 0.25 61] [5 0.5 61] [5.5 0.5 56]\r
               [6.5 0.5 64] [7 0.5 63] [7.5 0.5 64] [8.5 0.25 61] [8.75 0.25 61]\r
               [9 0.5 61] [9.5 0.25 61] [9.75 0.25 61] [10 0.5 61] [10.5 0.5 56]\r
               [11.5 0.5 64] [12.5 0.5 63] [13.5 0.5 61] [14.5 0.5 63] [16.5 0.25 63]\r
               [16.75 0.25 63] [17 0.5 63] [17.5 0.25 63] [17.75 0.25 63] [18 0.5 63]\r
               [18.5 0.5 59] [19.5 0.5 64] [20.5 0.5 63] [21.5 0.5 61] [22.5 0.5 59]\r
               [24 0.5 61] [25 0.5 61] [25.5 0.5 68] [26 0.5 71] [26.5 1 70] [28 0.5 61]\r
               [29 0.5 61] [29.5 0.5 68] [30 0.5 71] [30.5 1 70] [31 1 71] [31.5 0.5 73]]]\r
          {:time (* tempo (+ beat time)) :length (* tempo length) :pitch note})))\r
\r
(defn mm-lead2 [time]\r
  (into []\r
        (for [[beat length note]\r
              [[0 3.25 73] [3.5 0.5 71] [4 1 76] [5 1 73] [6 1 71] [7 1 73] [8.5 2 71]\r
               [10.5 0.5 71] [11 1.5 73] [12.5 0.5 68] [13 0.5 69] [13.5 0.5 68] [14 0.5 64]\r
               [15 0.5 64] [15.5 0.5 68] [16 0.5 71] [16.5 3.25 73] [19.5 0.5 71] [20 1.5 76]\r
               [21 1 73] [22 1 71] [23 1.5 73] [24.5 2 71] [26.5 0.5 71] [27 0.5 68]\r
               [27.5 0.5 71] [28 0.5 72] [29 0.5 72] [29.5 0.5 72] [30 0.5 75] [30.5 1.5 80]]]\r
          {:time (* tempo (+ beat time)) :length (* tempo length) :pitch note})))\r
\r
(defn mm-lead3 [time]\r
  (into []\r
        (for [[beat length note]\r
              [[0 3 56] [3 0.5 54] [3.5 1 59] [4.5 1 57] [5.5 1 56] [6.5 1 57] [7.5 3.5 56]\r
               [11 0.5 54] [11.5 1 59] [12.5 1 57] [13.5 1 56] [14.5 1 57] [15.5 2.5 52]\r
               [18 0.5 52] [18.5 0.5 54] [19 0.5 56] [19.5 3 51]]]\r
          {:time (* tempo (+ beat time)) :length (* tempo length) :pitch note\r
           :vibrato {:speed 10 :depth 0.75}})))\r
\r
(defn mm-lead4 [time]\r
  (into []\r
        (for [[beat length note]\r
              [[0 2 73] [2.5 1 73] [3.5 0.5 71] [4 0.5 73] [5 1.5 76] [6.5 0.5 80]\r
               [7 0.5 78] [7.5 0.5 76] [8 0.5 75] [8.5 1.5 73] [10.5 1 73] [11.5 0.5 71]\r
               [12 0.5 73] [13 1.5 76] [14.5 0.5 76] [15 0.5 78] [15.5 1 76]\r
               [16.5 2 75] [18.5 0.5 75] [19 0.5 73] [19.5 0.5 71] [20 1.5 80] [21.5 1 78]\r
               [22.5 1 76] [23.5 1 75] [24.5 0.5 75] [25 0.5 76] [25.5 0.5 75] [26 3 73]]]\r
          {:time (* tempo (+ beat time)) :length (* tempo length) :pitch note\r
           :vibrato {:speed 6 :depth 3}})))\r
\r
(defn mm-lead5 [time]\r
  (into []\r
        (for [[beat length note]\r
              [[0 0.5 64] [1 0.5 64] [1.5 0.5 64] [2 0.5 63] [2.5 1 64] [3.5 0.5 73]\r
               [4 1 71] [5 1 69] [6 1 68] [7 1 66] [8 0.5 66] [9 0.5 68] [9.5 0.5 68]\r
               [10.5 0.5 68] [12 0.5 66] [13 0.5 68] [13.5 0.5 68] [14.5 0.5 68]\r
               [15.5 0.5 66] [16 0.5 64] [17 0.5 64] [17.5 0.5 64] [18 0.5 63] [18.5 1 64]\r
               [19.5 0.5 73] [20 1 71] [21 1 69] [22 1 68] [23 1 66] [24.5 0.5 63]\r
               [25 0.5 64] [25.5 0.5 63] [26 3 61]]]\r
          {:time (* tempo (+ beat time)) :length (* tempo length) :pitch note})))\r
\r
(defn mm-lead5a [time]\r
  (into []\r
        (for [[beat length note]\r
              [[0 0.5 61] [1 0.5 61] [1.5 0.5 61] [2 0.5 59] [2.5 1 61] [3.5 0.5 69]\r
               [4 1 66] [5 1 66] [6 1 64] [7 1 63] [8 0.5 63] [9 0.5 64] [9.5 0.5 64]\r
               [10.5 0.5 64] [12 0.5 63] [13 0.5 64] [13.5 0.5 64] [14.5 0.5 64]\r
               [15.5 0.5 63] [16 0.5 61] [17 0.5 61] [17.5 0.5 61] [18 0.5 59] [18.5 1 61]\r
               [19.5 0.5 69] [20 1 66] [21 1 66] [22 1 64] [23 1 63] [24.5 0.5 59]\r
               [25 0.5 61] [25.5 0.5 59] [26 3 56]]]\r
          {:time (* tempo (+ beat time)) :length (* tempo length) :pitch note})))\r
\r
`;function READ(h){return read_str(h)}function qqLoop(h,e){return _list_Q(e)&&e.length&&_symbol_Q(e[0])&&e[0].value=="splice-unquote"?[_symbol("concat"),e[1],h]:[_symbol("cons"),quasiquote(e),h]}function quasiquote(h){return _list_Q(h)&&0<h.length&&_symbol_Q(h[0])&&h[0].value=="unquote"?h[1]:_list_Q(h)?h.reduceRight(qqLoop,[]):_vector_Q(h)?[_symbol("vec"),h.reduceRight(qqLoop,[])]:_symbol_Q(h)||_hash_map_Q(h)?[_symbol("quote"),h]:h}function is_macro_call(h,e){return _list_Q(h)&&_symbol_Q(h[0])&&e.find(h[0])&&e.get(h[0])._ismacro_}function macroexpand(h,e){for(;is_macro_call(h,e);){var r=e.get(h[0]);h=r.apply(r,h.slice(1))}return h}function eval_ast(h,e){if(_symbol_Q(h))return e.get(h);if(_list_Q(h))return h.map(function(c){return EVAL(c,e)});if(_set_Q(h)){var r=new Set;for(const c of h)r.add(EVAL(c,e));return r}else if(_vector_Q(h)){var s=h.map(function(c){return EVAL(c,e)});return s.__isvector__=!0,s}else if(_hash_map_Q(h)){var l=new Map;for(var[o,a]of h)l.set(EVAL(o,e),EVAL(h.get(o),e));return l}else return h}function _EVAL(h,e){for(;;){if(!_list_Q(h)||(h=macroexpand(h,e),!_list_Q(h)))return eval_ast(h,e);if(h.length===0)return h;var r=h[0],s=h[1],l=h[2],o=h[3];if(_keyword_Q(r))return EVAL([_symbol("get"),s,r],e);if(_hash_map_Q(r))return EVAL([_symbol("get"),r,s],e);if(_vector_Q(r))return EVAL([_symbol("get"),r,s],e);if(_set_Q(r))return EVAL([_symbol("contains?"),r,s],e);switch(r.value){case"ns":case"discard-form":return null;case"dispatch":if(_string_Q(s))return new RegExp(s,"g");if(_list_Q(s)){var a=Array.from(new Set(h.toString().match(/%\d?/g))),c=a.sort((E,_)=>parseInt(E.substring(1))-parseInt(_.substring(1))),S=c.map(E=>_symbol(E));return _function(EVAL,Env,s,e,S)}case"def":var m=EVAL(l,e);return e.set(s,m),m;case"let*":for(var M=new Env(e),f=0;f<s.length;f+=2)M.set(s[f],EVAL(s[f+1],M));h=l,e=M;break;case"loop*":for(var u=[_symbol("do")].concat(h.slice(2)),g=new Env(e),d=[],f=0;f<s.length;f+=2)d.push(s[f],EVAL(s[f+1],g));for(let A=0;A<d.length;A+=2)g.set(s[A],d[A+1]);h=u,e=g;break;case"recur":d.__isvector__=!0;var p=h.slice(1).flatMap(A=>[A,A]);for(let A=1;A<p.length;A+=2){let E=p[A];d[A]=E}h=[_symbol("loop*")].concat([d,u]);break;case"deftest":var m=h.slice(2).map(A=>EVAL(A,e));return e.set(s,m),m;case"testing":return EVAL(l,e);case"quote":return s;case"quasiquoteexpand":return quasiquote(s);case"quasiquote":h=quasiquote(s);break;case"defmacro":if(_string_Q(l)){var w=[_symbol("do")].concat(h.slice(4)),y=_function(EVAL,Env,w,e,o);y._ismacro_=!0;var b=new Map;return y.__meta__=b,b.set("ʞdoc",l),b.set("ʞname",s),b.set("ʞarglists",o),e.set(s,y)}else{var w=[_symbol("do")].concat(h.slice(3)),y=_function(EVAL,Env,w,e,l);y._ismacro_=!0;var b=new Map;return y.__meta__=b,b.set("ʞname",s),b.set("ʞarglists",l),e.set(s,y)}case"macroexpand":return macroexpand(s,e);case"try":try{return EVAL(s,e)}catch(A){if(l&&l[0].value==="catch")return A instanceof Error&&(A=A.message),EVAL(l[2],new Env(e,[l[1]],[A]));throw A}case"do":eval_ast(h.slice(1,-1),e),h=h[h.length-1];break;case"if":var O=EVAL(s,e);O===null||O===!1?h=typeof o<"u"?o:null:h=l;break;case"fn*":if(hasRecur(h)){let A=[];for(const E of h.slice(1))if(hasRecur(E)&&!hasLoop(E)){var P=E[0].flatMap(_=>_.value!="&"?[_,_]:[]);P.__isvector__=!0,A.push(E.slice(0,1).concat([[_symbol("loop*"),P,[_symbol("do")].concat(E.slice(1))]]))}else A.push(E);return multifn(EVAL,Env,A,e)}return _list_Q(s)?multifn(EVAL,Env,h.slice(1),e):_function(EVAL,Env,l,e,s);case"new":var v=EVAL(s,e),S=EVAL([_symbol("do")].concat(h.slice(2)),e);return new v(S);default:var k=eval_ast(h,e),T=k[0];if(T.__multifn__)h=T.__ast__(k.slice(1)),e=T.__gen_env__(k.slice(1));else if(T.__ast__)h=T.__ast__,e=T.__gen_env__(k.slice(1));else{if(_set_Q(T)||_keyword_Q(T)||_vector_Q(T)||_hash_map_Q(T))return EVAL([T].concat(k.slice(1)),e);var m=T.apply(T,k.slice(1));return m}}}}function EVAL(h,e){var r=_EVAL(h,e);return typeof r<"u"?r:null}function PRINT(h){return _pr_str(h,!0)}var repl_env=new Env;const evalString=function(h){return PRINT(EVAL(READ(h),repl_env))};for(var n in ns)repl_env.set(_symbol(n),ns[n]);repl_env.set(_symbol("eval"),function(h){return EVAL(h,repl_env)});repl_env.set(_symbol("*ARGV*"),[]);evalString("(do "+core_clj+")");evalString("(do "+pprint+")");evalString("(do "+simLispy+")");evalString("(do "+confuzion+")");evalString("(do "+megaman+")");const repp=function(h){return repl_env.set(_symbol("*1"),READ(evalString("(do "+h+")"))),EVAL(READ("(pprint (do "+h+"))"),repl_env)},up=h=>h.parent,isTopType=h=>h.isTop,isTop=h=>isTopType(h.type),mainSelection=h=>h.selection.asSingle().ranges[0],tree=(h,e,r)=>syntaxTree(h).resolveInner(e,r),nearestTouching=(h,e)=>tree(h,e,-1),parents=(h,e)=>isTop(h)?e:parents(up(h),e.concat(h)),rangeStr=(h,e)=>h.doc.slice(e.from,e.to).toString(),uppermostEdge=(h,e)=>{const r=parents(e,[]).filter(s=>h==s.to&&h==e.to);return r[r.length-1]||e},nodeAtCursor=h=>{const e=mainSelection(h).from,r=nearestTouching(h,e);return uppermostEdge(e,r)};let posAtFormEnd=0;const topLevelNode=h=>{const e=mainSelection(h).from,r=parents(nearestTouching(h,e),[]);return r.length===0?nodeAtCursor(h):r[r.length-1]},cursorNodeString=h=>rangeStr(h,nodeAtCursor(h)),topLevelString=h=>rangeStr(h,topLevelNode(h));var evalResult="",codeBeforeEval="",testCodeBeforeEval="",posBeforeEval=0,testPosBeforeEval=0,lastEditorEvaluated;const updateEditor=(h,e,r)=>{var s=h.dom.parentElement.id,l=h.state.doc.toString();const o=l.length;s==="app"&&(codeBeforeEval=l,posBeforeEval=h.state.selection.main.head,h.dispatch({changes:{from:0,to:o,insert:e},selection:{anchor:r,head:r}})),s==="test"&&(testCodeBeforeEval=l,testPosBeforeEval=h.state.selection.main.head,h.dispatch({changes:{from:0,to:o,insert:e},selection:{anchor:r,head:r}}))};function tryEval(h){try{return repp(h)}catch(e){return console.log(e),`
Error: `+e.message}}const clearEval=h=>{h.state.selection.main.head;const e=h.dom.parentElement.id;if(e==="app"&&lastEditorEvaluated==="app"){var r=codeBeforeEval,s=posBeforeEval;evalResult.length!=0&&(evalResult="",updateEditor(h,r,s))}if(e==="test"&&lastEditorEvaluated==="test"){var l=testCodeBeforeEval,o=testPosBeforeEval;evalResult.length!=0&&(evalResult="",updateEditor(h,l,o))}};function clearAll(h){clearEval(h),docBar.innerHTML="",docBar2.innerHTML=""}const evalAtCursor=h=>{var e=h.dom.parentElement.id;clearEval(h);var r=h.state.doc.toString();if(e==="app"){codeBeforeEval=r,posBeforeEval=h.state.selection.main.head;var s=codeBeforeEval.slice(0,posBeforeEval),l=codeBeforeEval.slice(posBeforeEval,codeBeforeEval.length);evalResult=tryEval(cursorNodeString(h.state));var o=s+` =>
`+out_buffer+evalResult+" "+l;return updateEditor(h,o,posBeforeEval),h.dispatch({selection:{anchor:posBeforeEval,head:posBeforeEval}}),clearBuffer(),lastEditorEvaluated="app",!0}if(e==="test"){testCodeBeforeEval=r,testPosBeforeEval=h.state.selection.main.head;var s=codeBeforeEval.slice(0,posBeforeEval),l=codeBeforeEval.slice(posBeforeEval,codeBeforeEval.length);evalResult=tryEval(cursorNodeString(h.state));var o=s+` =>
`+out_buffer+evalResult+" "+l;return updateEditor(h,o,posBeforeEval),h.dispatch({selection:{anchor:posBeforeEval,head:posBeforeEval}}),clearBuffer(),lastEditorEvaluated="test",!0}},evalTopLevel=h=>{var e=h.dom.parentElement.id;clearEval(h),posAtFormEnd=topLevelNode(h.state).to;var r=h.state.doc.toString();if(e==="app"){posBeforeEval=h.state.selection.main.head,codeBeforeEval=r;var s=codeBeforeEval.slice(0,posAtFormEnd),l=codeBeforeEval.slice(posAtFormEnd,codeBeforeEval.length);evalResult=tryEval(topLevelString(h.state));const o=s+`
=> 
`+out_buffer+evalResult+" "+l;return updateEditor(h,o,posBeforeEval),clearBuffer(),lastEditorEvaluated="app",!0}if(e==="test"){testPosBeforeEval=h.state.selection.main.head,testCodeBeforeEval=r;var s=testCodeBeforeEval.slice(0,posAtFormEnd),l=testCodeBeforeEval.slice(posAtFormEnd,testCodeBeforeEval.length);evalResult=tryEval(topLevelString(h.state));const c=s+`
=> 
`+out_buffer+evalResult+" "+l;return updateEditor(h,c,testPosBeforeEval),clearBuffer(),lastEditorEvaluated="test",!0}},evalCell=h=>{var e=h.dom.parentElement.id;clearEval(h);var r=h.state.doc.toString();if(e==="app"){posBeforeEval=h.state.selection.main.head,evalResult=tryEval("(do "+h.state.doc.text.join(" ")+")");var s=r+`
=> 
`+out_buffer+evalResult;return updateEditor(h,s,posBeforeEval),clearBuffer(),lastEditorEvaluated="app",!0}if(e==="test"){testPosBeforeEval=h.state.selection.main.head,evalResult=tryEval("(do "+h.state.doc.text.join(" ")+")");var s=r+`
=> 
`+out_buffer+evalResult;return updateEditor(h,s,testPosBeforeEval),clearBuffer(),lastEditorEvaluated="test",!0}},alpha=Array.from(Array(58)).map((h,e)=>e+65),alphabet=alpha.map(h=>String.fromCharCode(h));let letterKeys=[];for(let h=0;h<alphabet.length;h++)letterKeys=letterKeys.concat({key:alphabet[h],run:clearEval});const evalExtension=Prec.highest(keymap.of([{key:"Alt-Enter",run:evalCell},{key:"Mod-Enter",run:evalAtCursor},{key:"Shift-Enter",run:evalTopLevel},{key:"Escape",run:clearAll},{key:"ArrowLeft",run:clearEval},{key:"ArrowRight",run:clearEval},{key:"ArrowUp",run:clearEval},{key:"ArrowDown",run:clearEval},{key:"Backspace",run:clearEval},{key:"Enter",run:clearEval},{key:"Tab",run:clearEval},{key:"Delete",run:clearEval},{key:"0",run:clearEval},{key:"1",run:clearEval},{key:"2",run:clearEval},{key:"3",run:clearEval},{key:"4",run:clearEval},{key:"5",run:clearEval},{key:"6",run:clearEval},{key:"7",run:clearEval},{key:"8",run:clearEval},{key:"9",run:clearEval},{key:"!",run:clearEval},{key:"@",run:clearEval},{key:"#",run:clearEval},{key:"$",run:clearEval},{key:"%",run:clearEval},{key:"^",run:clearEval},{key:"&",run:clearEval},{key:"*",run:clearEval},{key:"-",run:clearEval},{key:"=",run:clearEval},{key:"+",run:clearEval},{key:"/",run:clearEval},{key:"`",run:clearEval},{key:'"',run:clearEval},{key:"'",run:clearEval},{key:";",run:clearEval},{key:":",run:clearEval},{key:"[",run:clearEval},{key:"]",run:clearEval},{key:"{",run:clearEval},{key:"}",run:clearEval},{key:"(",run:clearEval},{key:")",run:clearEval},{key:"Space",run:clearEval}].concat(letterKeys))),{coll:coll$1}=props,clojureLanguage=LRLanguage.define({parser:parser.configure({props:[styleTags({NS:tags.keyword,DefLike:tags.keyword,"Operator/Symbol":tags.keyword,"VarName/Symbol":tags.definition(tags.variableName),Boolean:tags.atom,"DocString/...":tags.emphasis,"Discard!":tags.comment,Number:tags.number,StringContent:tags.string,'"\\""':tags.string,Keyword:tags.atom,Nil:tags.null,LineComment:tags.lineComment,RegExp:tags.regexp}),indentNodeProp.add(h=>e=>{let{pos:r,unit:s,node:l,state:o,baseIndent:a,textAfter:c}=e;if(h.prop(coll$1)){let M=e.column(l.firstChild.to);return h.name=="List"&&["NS","DefLike","Operator"].includes(l.firstChild.nextSibling.type.name)?M+1:M}else return 0}),foldNodeProp.add({"Vector Map List":foldInside})]}),languageData:{commentTokens:{line:";;"}}});function getCompletions(h){let e=[{label:"macroexpand"},{label:"defmacro"}];for(const r of Object.keys(repl_env.data))e.push({label:r});return e}function myCompletions(h){let e=h.matchBefore(/\w*/);return e.from==e.to&&!h.explicit?null:{from:e.from,options:getCompletions()}}function clojure(){return new LanguageSupport(clojureLanguage,[clojureLanguage.data.of({autocomplete:myCompletions}),evalExtension])}let editorState=EditorState.create({doc:`(def drums
  (drum-seq
    (apply concat
      (for [beat (range 0 256 2)]
        (mmdrums beat)))))

(defn shorten [notes]
  (map #(update % :length (fn [v] (* v 0.9)))
    notes))

(def triangle (tri-seq (concat mmbass (mmbass2 224))))

(def pulse0
  (pulse0-seq (concat (mm-lead1 96) (take 49 (rest (mm-lead1 128))))))

(def pulse1a
  (pulse1-seq (concat (mm-lead1 0) (take 49 (rest (mm-lead1 32)))
                [{:time (* tempo 63) :length (* tempo 0.5) :pitch 71}]
                (mm-lead3 96) (mm-lead5 191.5) (mm-lead1 224))))

(def pulse1b
  (pulse1-seq (concat (mm-lead1a 0) (mm-lead1a 32) (mm-lead4 127.5)
                (mm-lead5a 191.5) (mm-lead1a 224))))

(def pulse2a (pulse2-seq (concat (mm-lead2 63.5) (mm-lead2 159.5))))

(def pulse2b
  (pulse2-seq (shorten (concat (mm-lead2 64.5) (mm-lead2 160.5)))))

(def megaman
  (mix [triangle
        pulse0
        pulse1a
        pulse1b
        pulse2a
        pulse2b
        drums]))

(play megaman)
(spit-wav "megaman2-dr-wily.wav" megaman)`,extensions:[basicSetup,clojure()]});new EditorView({state:editorState,parent:document.querySelector("#app")});
