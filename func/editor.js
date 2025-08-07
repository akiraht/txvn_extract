const textarea = document.getElementById('html-input');
const outputDiv = document.getElementById('html-output').querySelector('code');

let placeholderData = null;
let placeholderLoaded = false;

textarea.addEventListener('input', function(e) {
  const value = textarea.value;
  const cursorPos = textarea.selectionStart;

  const openTagMatch = value.slice(0, cursorPos).match(/<(\w+)>$/);
  if (openTagMatch) {
    const tagName = openTagMatch[1];

    const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'base'];
    if (!selfClosingTags.includes(tagName)) {
      const before = value.slice(0, cursorPos);
      const after = value.slice(cursorPos);
      textarea.value = before + `</${tagName}>` + after;

      textarea.selectionStart = textarea.selectionEnd = cursorPos;
    }
  }
});

textarea.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    e.preventDefault(); 

    const start = this.selectionStart;
    const end = this.selectionEnd;

    this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
    this.selectionStart = this.selectionEnd = start + 2;
  }
});

function protectSvgTags(inputText) {
  return inputText.replace(/<path[^>]*>.*?<\/path>/gs, match => {
    return `%%PROTECT_PATH%%${btoa(match)}%%END_PATH%%`;
  });
}

function restoreSvgTags(inputText) {
  return inputText.replace(/%%PROTECT_PATH%%(.*?)%%END_PATH%%/gs, (_, encoded) => {
    return atob(encoded);
  });
}

function convertEditable(inputText) {
  let buttonCounter = 1;

  // p tag
  inputText = inputText.replace(/<p([^>]*)>(.*?)<\/p>/gs, (_, attrs, content) => {
    const hasHtmlTag = /<(?!br\s*\/?>)[^>]+>/g.test(content);
    const dataType = content.includes('<br') ? "multi-text" : "single-text";
    let sample = content.trim().replace(/\s+/g, " ").replace(/"/g, "'");

    if (!hasHtmlTag) {
      sample = sample.replace(/<br\s*\/?>/g, "\\n");
    }

    if (!attrs || !attrs.includes('data-type')) {
      attrs = `${attrs ? attrs.trim() + ' ' : ''}data-type="${dataType}"`;
    } else {
      attrs = attrs.replace(/data-type="[^"]*"/, `data-type="${dataType}"`);
    }

    return `<editable ${attrs} data-sample="${sample}" />`;
  });

  // h tag
  inputText = inputText.replace(/<(h[1-6])([^>]*)>(.*?)<\/\1>/gs, (_, tagName, attrs, content) => {
    const hasHtmlTag = /<(?!br\s*\/?>)[^>]+>/g.test(content);
    let sample = content.trim().replace(/\s+/g, " ").replace(/"/g, "'");

    if (!hasHtmlTag) {
      sample = sample.replace(/<br\s*\/?>/g, "\\n");
    }

    if (attrs) {
      return `<editable data-type="headline" data-html-tag="${tagName}" ${attrs} data-sample="${sample}" />`;
    } else {
      return `<editable data-type="headline" data-html-tag="${tagName}" data-sample="${sample}" />`;
    }
  });

  // img tag
  inputText = inputText.replace(/<img([^>]*)>/g, (_, attrs) => {
    attrs = attrs.replace(/\s*src\s*=\s*(['"])[^'"]*\1/, '').replace(/\s*alt\s*=\s*(['"])[^'"]*\1/, '').trim();
    return `<editable data-type="image"${attrs ? ' ' + attrs : ''} />`;
  });

  // button tag
  inputText = inputText.replace(/<button([^>]*)>(.*?)<\/button>/gs, (_, attrs, content) => {
    const hasHtmlTag = /<(?!br\s*\/?>)[^>]+>/g.test(content);
    if (!hasHtmlTag) {
      content = content.replace(/<br\s*\/?>/g, "\\n");
    }
    content = content.trim().replace(/\s+/g, " ").replace(/"/g, "'");
  
    const id = `sg-module-button-${buttonCounter++}`;
    attrs = attrs.trim();
  
    return `<editable data-type="button" id="${id}"${attrs ? ' ' + attrs : ''} data-sample="${content}" />`;
  });
  

  // iframe tag
  inputText = inputText.replace(/<iframe([^>]*)><\/iframe>/gs, (match, attrs) => {
    const srcMatch = attrs.match(/src="([^"]+)"/);
    if (srcMatch) {
      const src = srcMatch[1];
      let dataType = "";
      if (src.includes("youtube.com")) {
        dataType = "movie";
      } else if (src.includes("www.google.com/maps")) {
        dataType = "map";
      }

      const maxMatch = attrs.match(/max="(\d+)"/);
      const max = maxMatch ? maxMatch[1] : "1000";

      attrs = attrs.replace(/ data-type="[^"]*"/g, '').replace(/ max="\d+"/g, '');

      let encodedIframe = "";
      if (dataType === "map") {
        encodedIframe = encodeURIComponent(`<iframe src="${src}"${attrs}></iframe>`);
      } else {
        encodedIframe = src;
      }

      return `<editable data-type="${dataType}" max="${max}" data-sample="${encodedIframe}" />`;
    }
    return match;
  });

  return inputText;
}

// function processInputContent() {
//   let htmlContent = textarea.value;
  
//   htmlContent = convertEditable(htmlContent);

//   outputDiv.textContent = htmlContent;
//   Prism.highlightElement(outputDiv);
// }

function formatWithIndentation(node, level = 0) {
  const indent = '  '.repeat(level);
  let result = '';

  node.childNodes.forEach(child => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const tagName = child.tagName.toLowerCase();
      const attrs = Array.from(child.attributes).map(attr => `${attr.name}="${attr.value}"`).join(' ');
      const openTag = `<${tagName}${attrs ? ' ' + attrs : ''}>`;
      const closeTag = `</${tagName}>`;

      if (child.childNodes.length === 0) {
        result += `${indent}${openTag.replace(/>$/, ' />')}\n`;
      } else {
        result += `${indent}${openTag}\n`;
        result += formatWithIndentation(child, level + 1);
        result += `${indent}${closeTag}\n`;
      }
    } else if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent.trim();
      if (text) {
        result += `${indent}  ${text}\n`;
      }
    }
  });

  return result;
}

// function processInputContent() {
//   let htmlContent = textarea.value;
//   const tempDiv = document.createElement('div');
//   tempDiv.innerHTML = htmlContent;

//   replaceElements(tempDiv);

//   const formattedHtml = formatWithIndentation(tempDiv).trim();

//   outputDiv.textContent = formattedHtml;
//   Prism.highlightElement(outputDiv);
// }

function processInputContent() {
  let htmlContent = textarea.value;

  if (document.querySelector('.toggleEditor input[type="checkbox"]').checked) {
    htmlContent = reverseEditableElements(htmlContent);
  } else {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    replaceElements(tempDiv);
    htmlContent = formatWithIndentation(tempDiv).trim();
  }

  outputDiv.textContent = htmlContent;
  Prism.highlightElement(outputDiv);
}


textarea.addEventListener('input', processInputContent);