export function systemHtml() {
  document.body.classList.add('html-testing-hidden');
  const rootElement = document.querySelector('.root');

  if (rootElement) {
    const nextDiv = document.createElement('div');
    nextDiv.id = '__next';
    nextDiv.className = 'html-testing';
    const bodyWrapper = document.createElement('div');
    bodyWrapper.className = 'relative z-[1] h-[100vh] w-[100vw] overflow-auto';
    bodyWrapper.id = 'main-scroll';
    const header = document.createElement('header');
    header.className = 'header-main';
    header.innerHTML = `
      <div class="header-nav">
        <a class="logo-img" href="#">
          <h1>
            <img alt="logo test" loading="eager" width="385" height="60" decoding="async" data-nimg="1" style="color:transparent" sizes="100vw" src="${chrome.runtime.getURL('images/logo_w.png')}">
          </h1>
        </a>
        <ul class="header-nav__menu">
          <li class="active"><a target="_self" href="#">トップ</a></li>
          <li class=""><a target="_self" href="#">About us</a></li>
          <li class=""><a target="_self" href="#">Content</a></li>
        </ul>
      </div>
      <div class="header-nav__btn btn__apply">
        <a target="_self" href="#">詳細を見る</a>
      </div>
    `;

    const bodyMain = document.createElement('div');
    bodyMain.className = 'body-main';
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
      <div class="footer__content">
        <a class="footer__logo logo-img" href="#">
          <h1>
            <img alt="logo test" loading="eager" width="385" height="60" decoding="async" data-nimg="1" style="color:transparent" sizes="100vw" src="${chrome.runtime.getURL('images/logo_w.png')}">
          </h1>
        </a>
        <ul class="footer__menu">
          <li class=""><a target="_self" href="#">トップ</a></li>
          <li class=""><a target="_self" href="#">About us</a></li>
          <li class=""><a target="_self" href="#">Content</a></li>
        </ul>
      </div>
      <div class="footer__copyright">
        <div class="footer__copyright__text"><span>© 2024</span>HTML testing data</div>
      </div>
    `;

    const images = rootElement.querySelectorAll('img');
    images.forEach(img => {
      const wrapper = document.createElement('div');
      wrapper.className = 'img-content-sg-c-module';
      img.parentElement.insertBefore(wrapper, img);
      wrapper.appendChild(img);
    });

    const iframes = rootElement.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      const iframeSrc = iframe.src;
      let wrapper;

      if (iframeSrc.includes('youtube.com')) {
        wrapper = document.createElement('div');
        wrapper.className = 'sg-module-movie-1';
      } else if (iframeSrc.includes('google.com/maps')) {
        wrapper = document.createElement('div');
        wrapper.className = 'sg-module-map-1';
      }

      if (wrapper) {
        iframe.parentElement.insertBefore(wrapper, iframe);
        wrapper.appendChild(iframe);
      }
    });

    while (rootElement.firstChild) {
      bodyMain.appendChild(rootElement.firstChild);
    }

    bodyWrapper.appendChild(header);
    bodyWrapper.appendChild(bodyMain);
    bodyWrapper.appendChild(footer);
    nextDiv.appendChild(bodyWrapper);

    document.body.innerHTML = '';
    document.body.appendChild(nextDiv);
  }

  const header = document.getElementById('main-scroll');
  if (header) {
    const headerEl = document.querySelector(".header-main");
    const divAfterHeader = header.parentElement.querySelector('header + div');
    let hWindow = window.innerHeight;
    let hActive = 0;
    const updateHeaderState = () => {
      let hContent = divAfterHeader.offsetHeight;
      if (hContent <= hWindow && hActive == 0) {
        headerEl.classList.add('active');
        divAfterHeader.style.marginTop = '80px';
      } else if(hActive != 1) {
        headerEl.classList.remove('active');
        divAfterHeader.style.marginTop = '0';
        hActive = 1;
      }
    };
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          updateHeaderState();
        }
      }
    });
    resizeObserver.observe(divAfterHeader);
    window.addEventListener('resize', () => {
      hWindow = window.innerHeight;
      updateHeaderState();
    });
    header.addEventListener('scroll', function (e) {
      if (e.target.scrollTop > 1) {
        headerEl.classList.add('active');
      } else {
        headerEl.classList.remove('active');
      }
    });
    updateHeaderState();
  }
}

export function localHtml() {
  document.body.classList.remove('html-testing-hidden');
  const rootElement = document.querySelector('.body-main');

  if (rootElement) {
    const rootMain = document.createElement('div');
    rootMain.className = 'root';

    const replaceContainer = (selector) => {
      const containers = rootElement.querySelectorAll(selector);
      containers.forEach(container => {
        const child = container.querySelector('img, iframe');
        if (child) {
          container.replaceWith(child);
        }
      });
    };
    replaceContainer('.img-content-sg-c-module');
    replaceContainer('.sg-module-movie-1');
    replaceContainer('.sg-module-map-1');

    while (rootElement.firstChild) {
      rootMain.appendChild(rootElement.firstChild);
    }

    document.body.innerHTML = '';
    document.body.appendChild(rootMain);
  }
}

export function dataModuleOn() {
  const rootElement = document.querySelector('.root') || document.querySelector('.body-main');
  if (rootElement) {
    const divModules = rootElement.children;
    Array.from(divModules).forEach(divModule => {
      divModule.classList.add('data-moduleCheck');

      const dataCss = divModule.getAttribute('data-css') || 'null';
      const dataModule = divModule.getAttribute('data-module') || 'null';
      const dataTypeName = divModule.getAttribute('data-type-name') || 'null';

      const dataModuleDiv = document.createElement('div');
      dataModuleDiv.className = 'data-module';
      const dataModuleBg = document.createElement('div');
      dataModuleBg.className = 'data-module__bg';

      const dataCssSpan = document.createElement('span');
      dataCssSpan.className = dataCss !== 'null' ? 'check-success' : 'check-error';
      dataCssSpan.textContent = `data-css: ${dataCss}`;

      const dataModuleSpan = document.createElement('span');
      dataModuleSpan.className = dataModule !== 'null' ? 'check-success' : 'check-error';
      dataModuleSpan.textContent = `data-module: ${dataModule}`;

      const dataTypeNameSpan = document.createElement('span');
      dataTypeNameSpan.className = dataTypeName !== 'null' ? 'check-success' : 'check-error';
      dataTypeNameSpan.textContent = `data-type-name: ${dataTypeName}`;

      dataModuleDiv.appendChild(dataCssSpan);
      dataModuleDiv.appendChild(dataModuleSpan);
      dataModuleDiv.appendChild(dataTypeNameSpan);

      divModule.appendChild(dataModuleDiv);
      divModule.appendChild(dataModuleBg);
    });
  }
}

export function dataModuleOff() {
  const rootElement = document.querySelector('.root') || document.querySelector('.body-main');
  if (rootElement) {
    const divModules = rootElement.querySelectorAll('div.data-moduleCheck');
    divModules.forEach(divModule => {
      divModule.classList.remove('data-moduleCheck');

      const dataModuleDiv = divModule.querySelector('.data-module');
      const dataModuleBg = divModule.querySelector('.data-module__bg');
      if (dataModuleDiv) {
        divModule.removeChild(dataModuleDiv);
      }
      if (dataModuleBg) {
        divModule.removeChild(dataModuleBg);
      }
    });
  }
}

export function dataEditableOn() {
  const elements = document.querySelectorAll('.root *:is(h1, h2, h3, h4, h5, h6, p, button, img, iframe, div[data-series]), .body-main *:is(h1, h2, h3, h4, h5, h6, p, button, img, iframe, div[data-series])');

  elements.forEach((el) => {
    if (el.matches('h1, h2, h3, h4, h5, h6, p, button')) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('data-editableCheck');

      const dataType = el.getAttribute('data-type') || 'null';
      const dataLabel = el.getAttribute('data-label') || 'null';
      const dataPlaceHolder = el.getAttribute('data-placeholder-id') || 'null';
      const max = el.getAttribute('max') || 'null';

      const dataTypeSpan = document.createElement('span');
      dataTypeSpan.classList.add('sg-check-attr');
      dataTypeSpan.textContent = `data-type: ${dataType}`;

      const dataLabelSpan = document.createElement('span');
      dataLabelSpan.classList.add('sg-check-attr');
      dataLabelSpan.textContent = `data-label: ${dataLabel}`;

      const dataPlaceHolderSpan = document.createElement('span');
      dataPlaceHolderSpan.classList.add('sg-check-attr');
      dataPlaceHolderSpan.textContent = `data-placeholder-id: ${dataPlaceHolder}`;

      const maxSpan = document.createElement('span');
      maxSpan.classList.add('sg-check-attr');
      maxSpan.textContent = `max: ${max}`;

      wrapper.appendChild(maxSpan);
      wrapper.appendChild(dataTypeSpan);
      // wrapper.appendChild(dataLabelSpan);
      wrapper.appendChild(dataPlaceHolderSpan);

      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);

      dataTypeSpan.style.left = `${maxSpan.offsetWidth + 10}px`;
      dataPlaceHolderSpan.style.left = `${maxSpan.offsetWidth + dataTypeSpan.offsetWidth + 20}px`;
      // dataLabelSpan.style.left = `${maxSpan.offsetWidth + dataTypeSpan.offsetWidth + 20}px`;
    }

    if (el.matches('img')) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('img-content-sg-c-module');

      const dataLabel = el.getAttribute('data-label') || 'null';

      const dataLabelSpan = document.createElement('span');
      dataLabelSpan.classList.add('sg-check-attr');
      dataLabelSpan.textContent = `data-label: ${dataLabel}`;
      wrapper.appendChild(dataLabelSpan);

      if (el.hasAttribute('data-readonly')) {
        const dataReadonly = el.getAttribute('data-readonly');
        const dataReadonlySpan = document.createElement('span');
        dataReadonlySpan.classList.add('sg-check-attr');
        dataReadonlySpan.textContent = `data-readonly: ${dataReadonly}`;
        dataReadonlySpan.style.left = `${dataLabelSpan.offsetWidth + 10}px`;
        wrapper.appendChild(dataReadonlySpan);
      }

      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    }

    if (el.matches('iframe')) {
      const wrapper = document.createElement('div');

      const src = el.getAttribute('src');
      if (src) {
        if (src.includes('google.com/maps')) {
          wrapper.classList.add('sg-module-map-1');
        } else if (src.includes('youtube.com') || src.includes('vimeo.com')) {
          wrapper.classList.add('sg-module-movie-1');
        }
      }

      const dataLabel = el.getAttribute('data-label') || 'null';
      const max = el.hasAttribute('max') ? el.getAttribute('max') : 'null';

      const dataLabelSpan = document.createElement('span');
      dataLabelSpan.classList.add('sg-check-attr');
      dataLabelSpan.textContent = `data-label: ${dataLabel}`;

      const maxSpan = document.createElement('span');
      maxSpan.classList.add('sg-check-attr');
      maxSpan.textContent = `max: ${max}`;

      wrapper.appendChild(maxSpan);
      wrapper.appendChild(dataLabelSpan);

      wrapper.classList.add(el.hasAttribute('max') && el.hasAttribute('data-type') ? 'check-success' : 'check-error');
      
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);

      dataLabelSpan.style.left = `${maxSpan.offsetWidth + 10}px`;
      if (el.hasAttribute('data-type')) {
        const dataTypeSpan = document.createElement('span');
        dataTypeSpan.classList.add('sg-check-attr');
        dataTypeSpan.textContent = `data-type: ${el.getAttribute('data-type')}`;
        wrapper.appendChild(dataTypeSpan);
        dataTypeSpan.style.left = `${maxSpan.offsetWidth + dataLabelSpan.offsetWidth + 20}px`;
      }
    }

    if (el.matches('div[data-series]')) {
      el.classList.add('data-editableCheck');

      if (el.hasAttribute('data-type')) {
        const dataTypeSpan = document.createElement('span');
        dataTypeSpan.classList.add('sg-check-attr');
        dataTypeSpan.textContent = `data-type: ${el.getAttribute('data-type')}`;
        dataTypeSpan.style.top = '0';
        el.appendChild(dataTypeSpan);
      }
    }
  });
}

export function dataEditableOff() {
  const wrappers = document.querySelectorAll('.data-editableCheck, .img-content-sg-c-module, .sg-module-map-1, .sg-module-movie-1');

  wrappers.forEach((wrapper) => {
    const spans = wrapper.querySelectorAll('.sg-check-attr');
    spans.forEach(span => span.remove());
    while (wrapper.firstChild) {
      wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
    }
    wrapper.remove();
  });
}

export function dataEditableAllOn() {
  const spanData = document.querySelectorAll('span[class^="sg-check"]');
  spanData.forEach((item) => {
    if (item) {
      item.classList.add('showAll');
    }
  });
}

export function dataEditableAllOff() {
  const spanData = document.querySelectorAll('span[class^="sg-check"]');
  spanData.forEach((item) => {
    if (item) {
      item.classList.remove('showAll');
    }
  });
}

export function tagHTMLOn() {
  const elements = document.querySelectorAll('.root *:is(h1, h2, h3, h4, h5, h6, p, button, img, iframe), .body-main *:is(h1, h2, h3, h4, h5, h6, p, button, img, iframe)');

  elements.forEach((el) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('data-tagCheck');
    
    const tagSpan = document.createElement('span');
    tagSpan.classList.add('sg-check-tag');
    tagSpan.textContent = el.tagName.toLowerCase();

    wrapper.appendChild(tagSpan);

    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  });
}

export function tagHTMLOff() {
  const wrappers = document.querySelectorAll('.data-tagCheck');

  wrappers.forEach((wrapper) => {
    const spans = wrapper.querySelectorAll('.sg-check-tag');
    spans.forEach(span => span.remove());
    while (wrapper.firstChild) {
      wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
    }
    wrapper.remove();
  });
}

export function maxTextOn() {
  const elements = document.querySelectorAll('h1[max], h2[max], h3[max], h4[max], h5[max], h6[max], p[max], button[max]');
  
  elements.forEach((el) => {
    const maxLength = parseInt(el.getAttribute('max'), 10);
    if (!isNaN(maxLength) && maxLength > 0) {
      const dummyText = 'DUMMY'.repeat(Math.ceil(maxLength / 5));
      el.textContent = dummyText.slice(0, maxLength);
    }
  });
}

export function maxTextOff() {
  const elements = document.querySelectorAll('h1[max], h2[max], h3[max], h4[max], h5[max], h6[max], p[max], button[max]');
  
  elements.forEach((el) => {
    const maxLength = parseInt(el.getAttribute('max'), 10);
    if (!isNaN(maxLength) && maxLength > 0) {
      const dummyText = 'の'.repeat(Math.ceil(maxLength / 1));
      el.textContent = dummyText.slice(0, maxLength);
    }
  });
}

export function minTextOn() {
  const elements = document.querySelectorAll('h1[max], h2[max], h3[max], h4[max], h5[max], h6[max], p[max], button[max]');
  
  elements.forEach((el) => {
    el.textContent = 'A';
  });
}

export function minTextOff() {
  const elements = document.querySelectorAll('h1[max], h2[max], h3[max], h4[max], h5[max], h6[max], p[max], button[max]');
  
  elements.forEach((el) => {
    el.textContent = 'あ';
  });
}

export function randomTextOn() {
  const elements = document.querySelectorAll('h1[max], h2[max], h3[max], h4[max], h5[max], h6[max], p[max], button[max]');
  const generateRandomText = (length) => {
    const words = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'
    ];
    let text = '';
    while (text.length < length) {
      text += words[Math.floor(Math.random() * words.length)] + ' ';
    }
    return text.trim().slice(0, length);
  };
  elements.forEach((el) => {
    const maxLength = parseInt(el.getAttribute('max'), 10);
    if (!isNaN(maxLength) && maxLength > 0) {
      el.textContent = generateRandomText(maxLength);
    }
  });
}

export function randomTextOff() {
  const elements = document.querySelectorAll('h1[max], h2[max], h3[max], h4[max], h5[max], h6[max], p[max], button[max]');
  const generateRandomText = (length) => {
    const words = [
      'こんにちは', 'ありがとう', 'さようなら', 'おはよう', 'こんばんは', 
      'すみません', 'お願いします', 'いただきます', 'ごめんなさい', 
      '大丈夫', '美味しい', '楽しい', '頑張って', '友達', '学校', 
      '先生', '日本', '東京', '京都', '面白い'
    ];
    let text = '';
    while (text.length < length) {
      text += words[Math.floor(Math.random() * words.length)] + ' ';
    }
    return text.trim().slice(0, length);
  };
  elements.forEach((el) => {
    const maxLength = parseInt(el.getAttribute('max'), 10);
    if (!isNaN(maxLength) && maxLength > 0) {
      el.textContent = generateRandomText(maxLength);
    }
  });
}

export function imgRandom() {
  const container = document.querySelector('.root') || document.querySelector('.body-main');
  
  if (container) {
    const images = container.querySelectorAll('img:not([data-readonly="true"])');
    const imageSources = [
      'images/data/img_1.jpg',
      'images/data/img_2.jpg',
      'images/data/img_3.jpg',
      'images/data/img_4.jpg',
      'images/data/img_5.jpg',
      'images/data/img_6.jpg',
      'images/data/img_7.jpg',
      'images/data/img_8.jpg',
      'images/data/img_9.jpg',
      'images/data/img_10.jpg'
    ].map(src => chrome.runtime.getURL(src));

    images.forEach((img) => {
      const randomIndex = Math.floor(Math.random() * imageSources.length);
      img.src = imageSources[randomIndex];
    });
  }
}

export function addColorStyle(styleContent) {
  const styleElement = document.createElement('style');
  styleElement.textContent = styleContent;
  document.head.appendChild(styleElement);
}

export function moduleAddTextAllOn() {
  console.log('click');
  const elField = document.querySelectorAll('.ql-editor');
  const generateRandomText = (length) => {
    const words = 'DUMMY';
    let text = '';
    while (text.length < length) {
      text += words[Math.floor(Math.random() * words.length)];
    }
    return text.trim().slice(0, length);
  };
  elField.forEach((el) => {
    let parent = el.parentElement;
    while (
      (parent && parent.id !== "undefined-undefined-textarea") 
      && (parent && !parent.matches('div[id^="-sg-module"][id$="textarea"]'))
      && (parent && !parent.matches('div[id$="textarea"]'))
    ) {
      parent = parent.parentElement;
    }

    if (parent) {
      const nextElement = parent.nextElementSibling;
      if (nextElement) {
        const text = nextElement.textContent.trim();
        const parts = text.split(' / ');
        if (parts.length > 1) {
          const max = parts[1];
          const number = parseFloat(max.replace(/\D/g, ''));
          el.textContent = generateRandomText(number);
          console.log(number);
        }
      }
    }
  });

  const inpItems = document.querySelectorAll('input[name^="modules"]');
  inpItems.forEach((item) => {
    let parent = item.parentElement;
    while (parent && !parent.id.startsWith("modules")) {
      parent = parent.parentElement;
    }
    if (parent) {
      const spanElement = parent.querySelector('span');
      
      if (spanElement) {
        const text = spanElement.textContent.trim();
        const parts = text.split(' / ');
        if (parts.length > 1) {
          const max = parts[1];
          const number = parseFloat(max.replace(/\D/g, ''));
          Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(item, generateRandomText(number));
          item.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    }
  });

  const inpCheck = document.querySelectorAll('input[id^="modules"][type="radio"][value="1"]');
  inpCheck.forEach((iCheck) => {
    iCheck.click();
    iCheck.dispatchEvent(new Event('click', { bubbles: true }));
  });
}

export function moduleAddTextAllOff() {
  const elField = document.querySelectorAll('.ql-editor');
  const generateRandomText = (length) => {
    const words = 'の';
    let text = '';
    while (text.length < length) {
      text += words[Math.floor(Math.random() * words.length)];
    }
    return text.trim().slice(0, length);
  };
  elField.forEach((el) => {
    let parent = el.parentElement;
    while (
      (parent && parent.id !== "undefined-undefined-textarea") 
      && (parent && !parent.matches('div[id^="-sg-module"][id$="textarea"]'))
      && (parent && !parent.matches('div[id$="textarea"]'))
    ) {
      parent = parent.parentElement;
    }

    if (parent) {
      const nextElement = parent.nextElementSibling;
      
      if (nextElement) {
        const text = nextElement.textContent.trim();
        const parts = text.split(' / ');
        if (parts.length > 1) {
          const max = parts[1];
          const number = parseFloat(max.replace(/\D/g, ''));
          el.textContent = generateRandomText(number);
        }
      }
    }
  });

  const inpItems = document.querySelectorAll('input[name^="modules"]');
  inpItems.forEach((item) => {
    let parent = item.parentElement;
    while (parent && !parent.id.startsWith("modules")) {
      parent = parent.parentElement;
    }
    if (parent) {
      const spanElement = parent.querySelector('span');
      
      if (spanElement) {
        const text = spanElement.textContent.trim();
        const parts = text.split(' / ');
        if (parts.length > 1) {
          const max = parts[1];
          const number = parseFloat(max.replace(/\D/g, ''));
          Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(item, generateRandomText(number));
          item.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    }
  });

  const inpCheck = document.querySelectorAll('input[id^="modules"][type="radio"][value="1"]');
  inpCheck.forEach((iCheck) => {
    iCheck.click();
    iCheck.dispatchEvent(new Event('click', { bubbles: true }));
  });
}

export function moduleAddTextOneOn() {
  const elField = document.querySelectorAll('.ql-editor');
  elField.forEach((el) => {
    el.textContent = "A";
  });

  const inpItems = document.querySelectorAll('input[name^="modules"]');
  inpItems.forEach((item) => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(item, "A");
    item.dispatchEvent(new Event('input', { bubbles: true }));
  });

  const inpCheck = document.querySelectorAll('input[id^="modules"][type="radio"][value="1"]');
  inpCheck.forEach((iCheck) => {
    iCheck.click();
    iCheck.dispatchEvent(new Event('click', { bubbles: true }));
  });
}

export function moduleAddTextOneOff() {
  const elField = document.querySelectorAll('.ql-editor');
  elField.forEach((el) => {
    el.textContent = "あ";
  });

  const inpItems = document.querySelectorAll('input[name^="modules"]');
  inpItems.forEach((item) => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(item, "あ");
    item.dispatchEvent(new Event('input', { bubbles: true }));
  });

  const inpCheck = document.querySelectorAll('input[id^="modules"][type="radio"][value="1"]');
  inpCheck.forEach((iCheck) => {
    iCheck.click();
    iCheck.dispatchEvent(new Event('click', { bubbles: true }));
  });
}

export function moduleAddTextRandomOn() {
  let i = 0;
  const elField = document.querySelectorAll('.ql-editor');
  const generateRandomText = (length) => {
    const words = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'
    ];
    let text = '';
    while (text.length < length) {
      text += words[Math.floor(i + Math.random() * words.length)] + ' ';
    }
    text = `${i} ` + text.trim().slice(0, length);
    i++;
    return text.trim().slice(0, length);
  };
  elField.forEach((el) => {
    let parent = el.parentElement;
    while (
      (parent && parent.id !== "undefined-undefined-textarea") 
      && (parent && !parent.matches('div[id^="-sg-module"][id$="textarea"]'))
      && (parent && !parent.matches('div[id$="textarea"]'))
    ) {
      parent = parent.parentElement;
    }

    if (parent) {
      const nextElement = parent.nextElementSibling;
      
      if (nextElement) {
        const text = nextElement.textContent.trim();
        const parts = text.split(' / ');
        if (parts.length > 1) {
          const max = parts[1];
          const number = parseFloat(max.replace(/\D/g, ''));
          el.textContent = generateRandomText(number);
        }
      }
    }
  });

  const inpItems = document.querySelectorAll('input[name^="modules"]');
  inpItems.forEach((item) => {
    let parent = item.parentElement;
    while (
      (parent && !parent.id.startsWith("modules"))
      && (parent && !parent.matches('div[class="relative w-full rounded-md"]'))
    ) {
      parent = parent.parentElement;
    }
    if (parent) {
      const spanElement = parent.querySelector('span');
      
      if (spanElement) {
        const text = spanElement.textContent.trim();
        const parts = text.split(' / ');
        if (parts.length > 1) {
          const max = parts[1];
          const number = parseFloat(max.replace(/\D/g, ''));
          Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(item, generateRandomText(number));
          item.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    }
  });

  const inpCheck = document.querySelectorAll('input[id^="modules"][type="radio"][value="1"]');
  inpCheck.forEach((iCheck) => {
    iCheck.click();
    iCheck.dispatchEvent(new Event('click', { bubbles: true }));
  });
}

export function moduleAddTextRandomOff() {
  let i = 0;
  const elField = document.querySelectorAll('.ql-editor');
  const generateRandomText = (length) => {
    const words = [
      'こんにちは', 'ありがとう', 'さようなら', 'おはよう', 'こんばんは', 
      'すみません', 'お願いします', 'いただきます', 'ごめんなさい', 
      '大丈夫', '美味しい', '楽しい', '頑張って', '友達', '学校', 
      '先生', '日本', '東京', '京都', '面白い'
    ];
    let text = '';
    while (text.length < length) {
      text += words[Math.floor(i + Math.random() * words.length)] + ' ';
    }
    text = `${i} ` + text.trim().slice(0, length);
    i++;
    return text.trim().slice(0, length);
  };
  elField.forEach((el) => {
    let parent = el.parentElement;
    while (
      (parent && parent.id !== "undefined-undefined-textarea") 
      && (parent && !parent.matches('div[id^="-sg-module"][id$="textarea"]'))
      && (parent && !parent.matches('div[id$="textarea"]'))
    ) {
      parent = parent.parentElement;
    }

    if (parent) {
      const nextElement = parent.nextElementSibling;
      
      if (nextElement) {
        const text = nextElement.textContent.trim();
        const parts = text.split(' / ');
        if (parts.length > 1) {
          const max = parts[1];
          const number = parseFloat(max.replace(/\D/g, ''));
          el.textContent = generateRandomText(number);
        }
      }
    }
  });

  const inpItems = document.querySelectorAll('input[name^="modules"]');
  inpItems.forEach((item) => {
    let parent = item.parentElement;
    while (
      (parent && !parent.id.startsWith("modules"))
      && (parent && !parent.matches('div[class="relative w-full rounded-md"]'))
    ) {
      parent = parent.parentElement;
    }
    if (parent) {
      const spanElement = parent.querySelector('span');
      
      if (spanElement) {
        const text = spanElement.textContent.trim();
        const parts = text.split(' / ');
        if (parts.length > 1) {
          const max = parts[1];
          const number = parseFloat(max.replace(/\D/g, ''));
          Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(item, generateRandomText(number));
          item.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    }
  });

  const inpCheck = document.querySelectorAll('input[id^="modules"][type="radio"][value="1"]');
  inpCheck.forEach((iCheck) => {
    iCheck.click();
    iCheck.dispatchEvent(new Event('click', { bubbles: true }));
  });
}

export async function moduleAddImg() {
  function waitForModal(selector) {
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        const modal = document.querySelector(selector);
        if (modal) {
          observer.disconnect();
          resolve(modal);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  function waitForButtons(selector) {
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        const buttons = document.querySelectorAll(selector);
        if (buttons.length > 0) {
          observer.disconnect();
          resolve(buttons);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  function waitForButtonById(buttonId) {
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        const button = document.getElementById(buttonId);
        if (button) {
          observer.disconnect();
          resolve(button);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  const imgInp = document.querySelectorAll('input[type="file"][accept=".jpg, .jpeg, .png"]');
  let imageCount = 0;

  for (const input of imgInp) {
    const imgInpEl = input.nextElementSibling;
    if (imgInpEl) {
      const imgBtn = imgInpEl.querySelector('button');
      if (imgBtn) {
        imgBtn.click();
        await waitForModal('.atom-modal-container');

        const modal = document.querySelector('.atom-modal-container');
        const tabs = modal.querySelectorAll('.atom-tabs__tab');
        if (tabs.length > 1) {
          tabs[1].click();

          const buttonsWithSvg = await waitForButtons('.flex.h-44.w-52.flex-col.gap-3.rounded-md.bg-vars-light.p-4 svg');
          const buttons = Array.from(buttonsWithSvg).map(svg => svg.closest('button[type="button"]'));

          if (buttons.length > 0) {
            const randomButton = buttons[Math.floor(Math.random() * buttons.length)];
            randomButton.click();

            await new Promise(resolve => setTimeout(resolve, 300));
            const actionButtons = document.querySelectorAll('.atom-modal-container__content .pt-3 button');
            if (actionButtons.length > 0) {
              actionButtons[1].click();

              const closeButton = await waitForButtonById('close-icon-container');
              closeButton.click();

              await new Promise(resolve => {
                const interval = setInterval(() => {
                  if (!document.querySelector('.atom-modal-container')) {
                    clearInterval(interval);
                    imageCount++;
                    console.log(`Image added: ${imageCount}`);
                    resolve();
                  }
                }, 100);
              });
            }
          }
        }
      }
    }
  }
  console.log(`Images Done`);
}

export async function getCssFile(arrayColor) {
  const regexColor = /color(\d+|n)/gm;
  const matchColor=regexColor.test(arrayColor[0].name);
  console.log(matchColor);
  
  
  if(!matchColor){
    document.querySelectorAll('input[name^="color"][name$="name"]').forEach((item, index) => {
      const data = arrayColor[index];
      if (!data) return;
  
      const newValue = `color_${data.name}`;
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(item, newValue);
      item.dispatchEvent(new Event('input', { bubbles: true }));
    });
    document.querySelectorAll('input[name^="color"][name$="code"]').forEach((item, index) => {
      const data = arrayColor[index];
      if (!data) return;

      const newValue = data.color || "";
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(item, newValue);
      item.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }else{
    document.querySelectorAll('input[name^="color"][name$="name"]').forEach((item, index) => {
      const data = arrayColor[index];
      if (!data) return;
  
      const newValue = `color-${index+1}`;
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(item, newValue);
      item.dispatchEvent(new Event('input', { bubbles: true }));
    });
    document.querySelectorAll('input[name^="color"][name$="code"]').forEach((item,index) => {
      const data = arrayColor[index]||" ";
      if (!data) return;
      const newValue=data.color;
      
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(item, newValue);
      item.dispatchEvent(new Event('input', { bubbles: true }));
    })
  }
}

export function toggleLoopOn() {
  const processLoopEls = (loopEls, config) => {
    loopEls.forEach(el => {
      el.style.position = 'relative';

      const { minAttr, maxAttr, onAdd, onRemove } = config;
      const minItems = parseInt(el.getAttribute(minAttr), 10);
      const maxItems = parseInt(el.getAttribute(maxAttr), 10);

      const addMore = document.createElement('button');
      addMore.classList.add('extBtn-add');
      const subtractBtn = document.createElement('button');
      subtractBtn.classList.add('extBtn-sub');
      const divWrap = document.createElement('div');
      divWrap.classList.add('extLoop-wrap');

      el.parentNode.insertBefore(divWrap, el);
      divWrap.appendChild(el);
      divWrap.appendChild(addMore);
      divWrap.appendChild(subtractBtn);

      const updateButtons = () => {
        const itemCount = el.children.length;
        addMore.disabled = itemCount >= maxItems;
        subtractBtn.disabled = itemCount <= minItems;
      };

      addMore.addEventListener('click', () => {
        if (el.children.length < maxItems) {
          onAdd(el);
          updateButtons();
        }
      });

      subtractBtn.addEventListener('click', () => {
        if (el.children.length > minItems) {
          onRemove(el);
          updateButtons();
        }
      });

      updateButtons();
    });
  };

  const loopEls = document.querySelectorAll('div[data-type="loop-DOM"], div[data-type="issue-list"]');
  processLoopEls(loopEls, {
    minAttr: 'min',
    maxAttr: 'max',
    onAdd: el => {
      const newItem = el.children[0]?.cloneNode(true);
      if (newItem) el.appendChild(newItem);
    },
    onRemove: el => {
      el.removeChild(el.lastElementChild);
    },
  });

  const loopTb = document.querySelectorAll('div[data-type="loop-table"]');
  loopTb.forEach(el => {
    el.style.position = 'relative';
    const elTable = el.querySelector('.loop-table__inner');
    const minRows = parseInt(el.getAttribute('min-rows'), 10);
    const maxRows = parseInt(el.getAttribute('max-rows'), 10);
    const minCols = parseInt(el.getAttribute('min-columns'), 10);
    const maxCols = parseInt(el.getAttribute('max-columns'), 10);
    
    const addMoreRow = document.createElement('button');
    addMoreRow.classList.add('extBtn-addRow');
    const subtractBtnRow = document.createElement('button');
    subtractBtnRow.classList.add('extBtn-subRow');

    const addMoreCol = document.createElement('button');
    addMoreCol.classList.add('extBtn-addCol');
    const subtractBtnCol = document.createElement('button');
    subtractBtnCol.classList.add('extBtn-subCol');

    const divWrap = document.createElement('div');
    divWrap.classList.add('extLoop-wrap');
    const divWrapTxt = document.createElement('div');
    divWrapTxt.classList.add('extLoop-wrap__text');

    el.parentNode.insertBefore(divWrap, el);
    divWrap.appendChild(el);
    divWrap.appendChild(divWrapTxt);
    divWrap.appendChild(addMoreRow);
    divWrap.appendChild(subtractBtnRow);
    divWrap.appendChild(addMoreCol);
    divWrap.appendChild(subtractBtnCol);

    function updateButtons() {
      const currentRows = elTable.querySelectorAll('.loop-table__row');
      const currentCols = currentRows[0]?.querySelectorAll('.loop-table__column') || [];
      
      addMoreRow.disabled = currentRows.length >= maxRows;
      subtractBtnRow.disabled = currentRows.length <= minRows;
    
      addMoreCol.disabled = currentCols.length >= maxCols;
      subtractBtnCol.disabled = currentCols.length <= minCols;
    }

    function addRow() {
      const currentRows = elTable.querySelectorAll('.loop-table__row');
      if (currentRows.length < maxRows) {
        const firstRow = currentRows[2];
        if (!firstRow) return;
        const newRow = firstRow.cloneNode(true);
        elTable.appendChild(newRow);
        updateButtons();
      }
    }

    function removeRow() {
      const currentRows = elTable.querySelectorAll('.loop-table__row');
      if (currentRows.length > minRows) {
        elTable.removeChild(currentRows[currentRows.length - 1]);
        updateButtons();
      }
    }

    function addColumn() {
      const currentRows = elTable.querySelectorAll('.loop-table__row');
      if (currentRows.length > 0) {
        const hasSecondColumn = Array.from(currentRows).every(row => row.children[1]);
        if (!hasSecondColumn) return;
    
        currentRows.forEach(row => {
          const secondColumn = row.children[1];
          row.appendChild(secondColumn.cloneNode(true));
        });
        updateButtons();
      }
    }  

    function removeColumn() {
      const currentRows = elTable.querySelectorAll('.loop-table__row');
      if (currentRows.length > 0) {
        currentRows.forEach(row => {
          if (row.children.length > minCols) {
            row.removeChild(row.lastElementChild);
          }
        });
        updateButtons();
      }
    }

    addMoreRow.addEventListener('click', addRow);
    subtractBtnRow.addEventListener('click', removeRow);
    addMoreCol.addEventListener('click', addColumn);
    subtractBtnCol.addEventListener('click', removeColumn);

    updateButtons();
  });
}

export function toggleLoopOff() {
  console.log('off');
  const wrappers = document.querySelectorAll('.extLoop-wrap');

  wrappers.forEach((wrapper) => {
    const btn = wrapper.querySelectorAll('button[class*="extBtn"]');
    btn.forEach(span => span.remove());
    while (wrapper.firstChild) {
      wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
    }
    wrapper.remove();
  });
}