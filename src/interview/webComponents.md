# Custom elements
##  Autonomous custom elements
自主的自定义元素都继承自HTMLElement
```
// Create a class for the element
class PopUpInfo extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    // Create a shadow root
    const shadow = this.attachShadow({mode: 'open'});

    // Create spans
    const wrapper = document.createElement('span');
    wrapper.setAttribute('class', 'wrapper');

    const icon = document.createElement('span');
    icon.setAttribute('class', 'icon');
    icon.setAttribute('tabindex', 0);

    const info = document.createElement('span');
    info.setAttribute('class', 'info');

    // Take attribute content and put it inside the info span
    const text = this.getAttribute('data-text');
    info.textContent = text;

    // Insert icon
    let imgUrl;
    if(this.hasAttribute('img')) {
      imgUrl = this.getAttribute('img');
    } else {
      imgUrl = 'img/default.png';
    }

    const img = document.createElement('img');
    img.src = imgUrl;
    icon.appendChild(img);

    // Create some CSS to apply to the shadow dom
    const style = document.createElement('style');
    console.log(style.isConnected);

    style.textContent = `
      .wrapper {
        position: relative;
      }

      .info {
        font-size: 0.8rem;
        width: 200px;
        display: inline-block;
        border: 1px solid black;
        padding: 10px;
        background: white;
        border-radius: 10px;
        opacity: 0;
        transition: 0.6s all;
        position: absolute;
        bottom: 20px;
        left: 10px;
        z-index: 3;
      }

      img {
        width: 1.2rem;
      }

      .icon:hover + .info, .icon:focus + .info {
        opacity: 1;
      }
    `;

    // Attach the created elements to the shadow dom
    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(icon);
    wrapper.appendChild(info);
  }
}

// Define the new element
customElements.define('popup-info', PopUpInfo);

// 页面使用
<popup-info img="img/alt.png" data-text="Your card validation code (CVC)
  is an extra security feature — it is the last 3 or 4 numbers on the
  back of your card.">
```
##  Customized built-in elements
继承自内置元素的自定义元素
```
// Create a class for the element
class ExpandingList extends HTMLUListElement {
  constructor() {
    // Always call super first in constructor
    // Return value from super() is a reference to this element
    self = super();

    // Get ul and li elements that are a child of this custom ul element
    // li elements can be containers if they have uls within them
    const uls = Array.from(self.querySelectorAll('ul'));
    const lis = Array.from(self.querySelectorAll('li'));

    // Hide all child uls
    // These lists will be shown when the user clicks a higher level container
    uls.forEach(ul => {
      ul.style.display = 'none';
    });

        // Look through each li element in the ul
    lis.forEach(li => {
      // If this li has a ul as a child, decorate it and add a click handler
      if (li.querySelectorAll('ul').length > 0) {
        // Add an attribute which can be used  by the style
        // to show an open or closed icon
        li.setAttribute('class', 'closed');

        // Wrap the li element's text in a new span element
        // so we can assign style and event handlers to the span
        const childText = li.childNodes[0];
        const newSpan = document.createElement('span');

        // Copy text from li to span, set cursor style
        newSpan.textContent = childText.textContent;
        newSpan.style.cursor = 'pointer';
        
        // Add click handler to this span
        newSpan.onclick = self.showul;
        
        // Add the span and remove the bare text node from the li
        childText.parentNode.insertBefore(newSpan, childText);
        childText.parentNode.removeChild(childText);
      }
    });
  }

  // li click handler
  showul = function (e) {
    // next sibling to the span should be the ul
    const nextul = e.target.nextElementSibling;

    // Toggle visible state and update class attribute on ul
    if (nextul.style.display == 'block') {
      nextul.style.display = 'none';
      nextul.parentNode.setAttribute('class', 'closed');
    } else {
      nextul.style.display = 'block';
      nextul.parentNode.setAttribute('class', 'open');
    }
  };
}

// Define the new element
customElements.define('expanding-list', ExpandingList, { extends: 'ul' });

// 使用，注意有个 is 属性
<ul is="expanding-list">
  <li>
  UK        
  </li>
</ul>

// 使用生命周期回调函数
connectedCallback：当 custom element首次被插入文档DOM时，被调用。
disconnectedCallback：当 custom element从文档DOM中删除时，被调用。
adoptedCallback：当 custom element被移动到新的文档时，被调用。
attributeChangedCallback: 当 custom element增加、删除、修改自身属性时，被调用。
```
# Shadow DOM
```
// 基本概念
// 浏览器自带的 input、audio、video（需在 settting/Show user agent shadow DOM）
Shadow host：一个常规 DOM节点，Shadow DOM 会被附加到这个节点上。
Shadow tree：Shadow DOM内部的DOM树。
Shadow boundary：Shadow DOM结束的地方，也是常规 DOM开始的地方。
Shadow root: Shadow tree的根节点。
// 基本用法
// 将一个 shadow root 附加到任何一个元素上
let shadow = elementRef.attachShadow({mode: 'open'});
// mode 属性，值可以是 open 或者 closed，页面内的 JavaScript 方法来获取 Shadow DOM
let myShadowDom = myCustomElem.shadowRoot;
// 为 shadow root 添加元素
shadow.appendChild(style);
shadow.appendChild(wrapper);
```
# templates and slots
```
<template id="my-paragraph">
  <p>My paragraph</p>
</template>
let template = document.getElementById('my-paragraph');
let templateContent = template.content;
document.body.appendChild(templateContent);

// 定义 template
<template id="element-details-template">
  <style>
  h4 span { border: 1px solid #cee9f9; border-radius: 4px }
  </style>
  <details>
    <summary>
      <span>
        <code class="name">&lt;<slot name="element-name">NEED NAME</slot>&gt;</code>
        <i class="desc"><slot name="description">NEED DESCRIPTION</slot></i>
      </span>
    </summary>
    <div class="attributes">
      <h4><span>Attributes</span></h4>
      <slot name="attributes"><p>None</p></slot>
    </div>
  </details>
  <hr>
</template>

// 注册 element-details 元素
customElements.define('element-details',
  class extends HTMLElement {
    constructor() {
      super();
      const template = document
        .getElementById('element-details-template')
        .content;
      const shadowRoot = this.attachShadow({mode: 'open'})
        .appendChild(template.cloneNode(true));
  }
});

// 在html中使用
<element-details>
  <span slot="element-name">slot</span>
  <span slot="description">A placeholder inside a web
    component that users can fill with their own markup,
    with the effect of composing different DOM trees
    together.</span>
  <dl slot="attributes">
    <dt>name</dt>
    <dd>The name of the slot.</dd>
  </dl>
</element-details>
```

参考文档：
[web-components-examples](https://github.com/mdn/web-components-examples)

