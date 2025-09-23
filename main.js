document.getElementById("fileInput").addEventListener("change", function () {
  handleFileChange(this, document.getElementById("fileNameSpan"));
});
document.getElementById("fileInput_sp").addEventListener("change", function () {
  handleFileChange(this, document.getElementById("fileNameSpan_sp"));
});

function handleFileChange(fileInput, fileNameSpan) {
  const file = fileInput.files[0];
  if (file) {
    fileNameSpan.innerText = file.name;
  } else {
    fileNameSpan.innerText = "No file chosen";
  }
}

const ttModulPc = document.getElementById("ttModule_pc");
const ttModulSp = document.getElementById("ttModule_sp");
const blockDocument = document.getElementById("blockDocument");
const blockReturn = document.querySelector(".blockReturn");

// const blockReturnFirst = document.querySelector(".blockReturn__first");
const blockReturnContent = document.querySelector(".blockReturn__content");
const blockReturnModule = document.querySelector(".blockReturn__module");
// const inputCssFiles = document.getElementById("cssFiles");
// const inputCssFiles_sp = document.getElementById("cssFiles_sp");
const bHtmlDisplay = document.querySelector('.htmlDisplay');
const bHtmlDisplay_sp = document.querySelector('.htmlDisplay_sp');
const btnReUp = document.getElementById("reData");
const errorTotal = document.querySelector(".txt-error");
const inpGr = document.querySelectorAll(".inp-gr input:not([type='checkbox'])");
const onOffControl = document.querySelector(".onOffControl");
const onOffCheck = document.getElementById('onOff');
const inlineToggleCheck = document.getElementById('inlineToggle');
const toggleRevertBTN = document.querySelector('.toggleEditor');
errorTotal.innerText = '';

document.getElementById("colorCheckbox").addEventListener("change", function () {
  const isChecked = this.checked;
  document.getElementById("colorCountInput").disabled = isChecked;
  document.getElementById("colorCountData").disabled = !isChecked;
});

document.getElementById("extract-html").addEventListener("click", async function () {
  document.querySelector(".htmlDisplay").innerHTML = '';
  document.querySelector(".htmlDisplay_sp").innerHTML = '';
  blockReturnModule.innerHTML = '';
  blockReturnContent.classList.remove('d-none');
  onOffCheck.checked = false;
  inlineToggleCheck.checked = false;
  toggleRevertBTN.classList.add('d-none');

  const colorCheck = document.getElementById("colorCheckbox");
  const colorNum = parseInt(document.getElementById("colorCountInput").value, 10);
  const colorData = document.getElementById("colorCountData").value.trim();
  let colorCount;
  if (!colorCheck.checked) {
    if (isNaN(colorNum) || colorNum <= 0) {
      alert("Please enter a valid number of colors.");
      return;
    } else {
      colorCount = colorNum;
    }
  } else {
    if (colorData === "") {
      alert("Please enter valid color data.");
      return;
    } else {
      colorCount = colorData;
    }
  }

  const placeholderJson = document.getElementById("dataPlaceId").value;
  if (placeholderJson === "") {
    alert("Plz select the correct placeholder list");
    return;
  }

  await handleFileProcessing(document.getElementById("fileInput"), document.querySelector(".htmlDisplay"), colorCount, true);
  await handleFileProcessing(document.getElementById("fileInput_sp"), document.querySelector(".htmlDisplay_sp"), colorCount, false);

  setTimeout(initToggleBlockReplace, 0);
  setTimeout(initToggleInlineStyle, 0);

  const pcModuleNum = countBlocks(document.querySelector(".htmlDisplay"));
  const spModuleNum = countBlocks(document.querySelector(".htmlDisplay_sp"));
  ttModulPc.innerText = ": " + pcModuleNum + " modules";
  ttModulSp.innerText = ": " + spModuleNum + " modules";
  blockDocument.style.display = 'none';
  blockReturn.style.display = 'flex';

  btnReUp.parentNode.classList.remove('d-none');

  if(pcModuleNum !== spModuleNum) {
    errorTotal.innerText = ' (Unequal number of modules)';
    btnReUp.parentNode.classList.add('disable');
  } else {
    errorTotal.innerText = '';
    btnReUp.parentNode.classList.remove('disable');
  }

  blockReturn.style.display = 'block';
});

document.getElementById("reData").addEventListener("click", function () {
  inpGr.forEach(input => {
    input.setAttribute("disabled", "true");
  });
  const pcBlocks = document.querySelectorAll('.htmlDisplay .block');
  const spBlocks = document.querySelectorAll('.htmlDisplay_sp .block');
  const copyCssBtn = document.querySelectorAll('.copy-css-btn');
  const copyHtmlBtn = document.querySelectorAll('.copy-btn');
  const toggleBtn = document.querySelectorAll('.toggle-btn');
  
  blockReturn.classList.add('rModule');
  blockReturnContent.classList.add('d-none');
  toggleRevertBTN.classList.add('d-none');
  copyCssBtn.forEach(btn => btn.classList.add('d-none'));
  copyHtmlBtn.forEach(btn => btn.classList.add('d-none'));
  toggleBtn.forEach(btn => btn.classList.add('d-none'));
  
  blockReturnModule.classList.remove('d-none');

  const blockReturnData = document.createElement('div');
  blockReturnData.className = 'blockReturn__data';

  const tabContainer = document.createElement('div');
  tabContainer.className = 'tab';
  
  const pcModules = Array.from(pcBlocks).map(block => block.getAttribute('data-module'));
  const spModules = Array.from(spBlocks).map(block => block.getAttribute('data-module'));

  setTimeout(initToggleBlockReplace, 0);
  setTimeout(initToggleInlineStyle, 0);

  pcModules.forEach(pcModule => {
    if (spModules.includes(pcModule)) {
      const tabButton = document.createElement('button');
      tabButton.className = 'tablinks';
      tabButton.innerText = pcModule;

      const displayDiv = document.createElement('div');
      displayDiv.className = 'htmlDisplay';
      displayDiv.style.display = 'none';

      const pcBlock = Array.from(pcBlocks).find(block => block.getAttribute('data-module') === pcModule);
      const spBlock = Array.from(spBlocks).find(block => block.getAttribute('data-module') === pcModule);

      if (pcBlock) {
        const moduleTypeValue = pcBlock.getAttribute('module-type');

        const moduleHeader = document.createElement('div');
        moduleHeader.className = 'module-header';

        const inpModuleType = document.createElement('input');
        inpModuleType.type = 'text';
        inpModuleType.classList.add('module-type-name');
        inpModuleType.value = moduleTypeValue || '';
        moduleHeader.appendChild(inpModuleType);

        const btnCreateModule = document.createElement('button');
        btnCreateModule.innerText = 'Add Module';
        btnCreateModule.classList.add('btnCreateModule');
        moduleHeader.appendChild(btnCreateModule);

        const moduleHeaderSub = document.createElement('div');
        moduleHeaderSub.className = 'module-header-sub';

        const addContentType = document.createElement("button");
        addContentType.className = "addBtnContent --type";
        addContentType.textContent = "Add Type";

        const addContent = document.createElement("button");
        addContent.className = "addBtnContent --pc";
        addContent.textContent = "Add PC";

        const addContentSP = document.createElement("button");
        addContentSP.className = "addBtnContent --sp";
        addContentSP.textContent = "Add SP";

        moduleHeaderSub.appendChild(addContentType);
        moduleHeaderSub.appendChild(addContent);
        moduleHeaderSub.appendChild(addContentSP);

        const confirmModuleCheckbox = document.createElement('input');
        confirmModuleCheckbox.type = 'checkbox';
        confirmModuleCheckbox.id = 'confirmModule';
        const confirmModuleLabel = document.createElement('label');
        confirmModuleLabel.htmlFor = 'confirmModule';
        confirmModuleLabel.innerText = 'Confirm module';
        confirmModuleLabel.appendChild(confirmModuleCheckbox);
        moduleHeader.appendChild(confirmModuleLabel);
        
        displayDiv.appendChild(moduleHeader);
        displayDiv.appendChild(moduleHeaderSub);

        const pcClone = pcBlock.cloneNode(true);
        pcClone.classList.add('pc');
        pcClone.setAttribute('css-file', 'pc');
        
        const pcHtmlCode = pcClone.querySelector(".block-cont .edit-cont code");
        const pcCssCode = pcClone.querySelector(".block-cont .css-cont code");

        const copyHtmlBtnPC = document.createElement("button");
        copyHtmlBtnPC.className = "copyBtn-html";
        copyHtmlBtnPC.textContent = "HTML";
        copyHtmlBtnPC.addEventListener("click", function () {
          copyContent(pcHtmlCode, copyHtmlBtnPC);
        });
        const copyCssBtnPC = document.createElement("button");
        copyCssBtnPC.className = "copyBtn-css";
        copyCssBtnPC.textContent = "CSS";
        copyCssBtnPC.addEventListener("click", function () {
          copyContent(pcCssCode, copyCssBtnPC);
        });

        const copyCont = document.createElement("div");
        copyCont.classList.add("copyCont");
        copyCont.appendChild(copyHtmlBtnPC);
        copyCont.appendChild(copyCssBtnPC);
        pcClone.prepend(copyCont);

        displayDiv.appendChild(pcClone);
      }

      if (spBlock) {
        const spClone = spBlock.cloneNode(true);
        spClone.classList.add('sp');
        spClone.setAttribute('css-file', 'sp');
        
        const spHtmlCode = spClone.querySelector(".block-cont .edit-cont code");
        const spCssCode = spClone.querySelector(".block-cont .css-cont code");

        const copyHtmlBtnSP = document.createElement("button");
        copyHtmlBtnSP.className = "copyBtn-html";
        copyHtmlBtnSP.textContent = "HTML";
        copyHtmlBtnSP.addEventListener("click", function () {
          copyContent(spHtmlCode, copyHtmlBtnSP);
        });
        const copyCssBtnSP = document.createElement("button");
        copyCssBtnSP.className = "copyBtn-css";
        copyCssBtnSP.textContent = "CSS";
        copyCssBtnSP.addEventListener("click", function () {
          copyContent(spCssCode, copyCssBtnSP);
        });
        
        const copyContSP = document.createElement("div");
        copyContSP.classList.add("copyCont");
        copyContSP.appendChild(copyHtmlBtnSP);
        copyContSP.appendChild(copyCssBtnSP);
        
        spClone.prepend(copyContSP);

        displayDiv.appendChild(spClone);
      }

      tabButton.displayDiv = displayDiv;

      tabContainer.appendChild(tabButton);
      blockReturnData.appendChild(displayDiv);

      blockReturnModule.innerHTML = '';
      blockReturnData.insertBefore(tabContainer, blockReturnData.firstChild);
      blockReturnModule.appendChild(blockReturnData);
      
      const blockReview = document.createElement('div');
      blockReview.className = 'blockReview';
      blockReview.innerHTML=`
        <div class="blockReview__pc"></div>
        <div class="blockReview__sp"></div>
      `;
      blockReturnModule.appendChild(blockReview);

      tabButton.addEventListener('click', function () {
        const allDisplays = blockReturnData.querySelectorAll('.htmlDisplay');
        allDisplays.forEach(display => display.style.display = 'none');

        const allTabButtons = tabContainer.querySelectorAll('.tablinks');
        allTabButtons.forEach(button => button.classList.remove('active'));
        this.classList.add('active');

        this.displayDiv.style.display = 'block';
      });
    }
  });

  const firstTabButton = tabContainer.querySelector('.tablinks');
  if (firstTabButton) {
    firstTabButton.click();
    btnReUp.parentNode.classList.add('disable');
  } else {
    const noModulesMessage = document.createElement('div');
    noModulesMessage.innerText = "There is no module mapping between PC and SP, please check the data-module attribute on your HTML files";
    blockReturnModule.appendChild(noModulesMessage);
  }
});

document.getElementById("clean-html").addEventListener("click", async function () {
  location.reload();
  return false;
});

let idIndex = 0;
function handleFileProcessing(fileInput, htmlDisplay, colorCount) {
  return new Promise((resolve, reject) => {
    const file = fileInput.files[0];

    if (!file) {
      alert("Please select a file.");
      return reject("No file selected");
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const htmlContent = event.target.result;
      const tempElement = document.createElement('div');
      tempElement.innerHTML = htmlContent;
      const rootElement = tempElement.querySelector('.root');
      if (rootElement) {
        const clonedRootElement = rootElement.cloneNode(true);
        const blockElements = clonedRootElement.querySelectorAll('.root > div');

        const promises = Array.from(blockElements).map((blockElement, index) => {
          let htmlTextBlock = '';
          const blockComment = getBlockComment(blockElement);
          htmlTextBlock += blockComment;
          replaceElements(blockElement);
          const blockHtmlText = getBlockHtml(blockElement);
          htmlTextBlock += blockHtmlText + '\n<!-- End Module -->\n';

          const dataCss = blockElement.getAttribute('data-css');
          const dataModule = blockElement.getAttribute('data-module');
          const dataTypeName = blockElement.getAttribute('data-type-name');
        
          return displayHTMLContent(htmlTextBlock, idIndex++, colorCount, blockElement.classList, htmlDisplay, dataCss, dataModule, dataTypeName);
        });
        
        const childDivs = rootElement.querySelectorAll('.root > div');

        const dataList = Array.from(childDivs).map(div => {
          return {
            dataCss: div.getAttribute('data-css'),
            dataTypeName: div.getAttribute('data-type-name')
          };
        });

        Promise.all(promises).then(resolve).catch(reject);
      } else {
        alert('HTML does not have class ".root"');
        reject('HTML does not have class ".root"');
      }
    };
    reader.readAsText(file, 'UTF-8');
  });
}

function displayHTMLContent(htmlContent, index, colorCount, blockClasses, htmlDisplay, dataCss, dataModule, dataTypeName) {
  return new Promise((resolve) => {
    htmlContent = htmlContent.replaceAll("></editable>", " />");
    htmlContent = htmlContent.replaceAll("</img>", "");
    // htmlContent = htmlContent.replace(/data-type-name="[^"]*"/g, "").replace(/data-css="[^"]*"/g, "").replace("   ", " ");
    htmlContent = htmlContent.replace(/<editable([^>]*)><\/editable>/g, "<editable$1 />");

    const blockDiv = document.createElement("div");
    blockDiv.className = "block";
    const contDiv = document.createElement("div");
    contDiv.className = "block-cont";

    if (dataCss) {
      contDiv.setAttribute("id", dataCss);
    }
    if (dataModule) {
      blockDiv.setAttribute("data-module", dataModule);
    }
    if (dataTypeName) {
      blockDiv.setAttribute("module-type", dataTypeName);
    }

    const editDiv = document.createElement("div");
    editDiv.className = "edit-cont";
    const cssDiv = document.createElement("div");
    cssDiv.className = "css-cont";
    contDiv.appendChild(editDiv);
    contDiv.appendChild(cssDiv);
    blockDiv.appendChild(contDiv);

    const preElement = document.createElement("pre");
    const codeElement = document.createElement("code");
    codeElement.className = "line-numbers language-html";
    codeElement.textContent = htmlContent.trim();
    preElement.setAttribute("id", "htmlBlock_" + index);
    preElement.appendChild(codeElement);
    editDiv.appendChild(preElement);
    
    Prism.highlightElement(codeElement);

    const cssBlock = createCSSBlock(colorCount, blockClasses);
    const cssCodeElement = document.createElement("code");
    cssCodeElement.className = "language-css";
    cssCodeElement.textContent = cssBlock;

    const cssPreElement = document.createElement("pre");
    cssPreElement.setAttribute("id", "cssBlock_" + index);
    cssPreElement.appendChild(cssCodeElement);
    cssDiv.appendChild(cssPreElement);
    Prism.highlightElement(cssCodeElement);

    const copyCssBtn = document.createElement("button");
    copyCssBtn.className = "copy-css-btn";
    copyCssBtn.textContent = "CSS";
    copyCssBtn.setAttribute("title", "Copy CSS");
    copyCssBtn.addEventListener("click", function () {
      copyContentID("cssBlock_" + index, copyCssBtn);
    });
    blockDiv.appendChild(copyCssBtn);
    htmlDisplay.appendChild(blockDiv);

    const copyHtmlBtn = document.createElement("button");
    copyHtmlBtn.className = "copy-btn";
    copyHtmlBtn.setAttribute("title", "Copy HTML");
    copyHtmlBtn.addEventListener("click", function () {
      copyContentID("htmlBlock_" + index, copyHtmlBtn);
    });
    blockDiv.appendChild(copyHtmlBtn);

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "toggle-btn";
    toggleBtn.addEventListener("click", function () {
      toggleBtn.classList.toggle('off');
      toggleBtn.parentElement.classList.toggle('off');
    });
    blockDiv.appendChild(toggleBtn);

    resolve();
  });
}

function copyContent(codeElement, btnEls) {
  const range = document.createRange();
  range.selectNodeContents(codeElement);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand("copy");
  selection.removeAllRanges();
  btnEls.classList.add('loading');
  setTimeout(() => {
    btnEls.classList.remove('loading');
  }, 300);
}
function copyContentID(elementId, btnEls) {
  const element = document.getElementById(elementId);
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand("copy");
  selection.removeAllRanges();

  btnEls.classList.add('loading');

  setTimeout(() => {
    btnEls.classList.remove('loading');
  }, 300);
}

function createCSSBlock(colorCount, parentClasses) {
  const firstClassName = parentClasses[0];
  let cssBlock = `.${firstClassName} {\n`;
  if (typeof colorCount === "number") {
    for (let i = 1; i <= colorCount; i++) {
      cssBlock += `  --color${i.toString().padStart(2, '0')}: color-${i};\n`;
    }
  } else if (typeof colorCount === "string") {
    const lines = colorCount
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.startsWith("--") && line.includes(":"));

    lines.forEach(line => {
      const varName = line.split(":")[0].replace(";", "").trim();
      const shortName = varName.replace(/^--/, "");
      cssBlock += `  ${varName}: color_${shortName};\n`;
    });
  }
  cssBlock += `}`;
  return cssBlock;
}

function countBlocks(htmlDisplay) {
  return htmlDisplay.querySelectorAll(".block").length;
}

document.addEventListener('DOMContentLoaded', (event) => {
  const textToAdd = "Q29weXJpZ2h0IKkgQWtpcmEgSHQ=";
  const decodedText = atob(textToAdd);
  const textContainer = document.createElement('span');
  textContainer.className = "cr";
  textContainer.innerHTML = decodedText;
  document.body.appendChild(textContainer);

  const colorCheckbox = document.getElementById("colorCheckbox");
  const colorCountInput = document.getElementById("colorCountInput");
  const colorCountData = document.getElementById("colorCountData");
  const isChecked = colorCheckbox.checked;
  colorCountInput.disabled = isChecked;
  colorCountData.disabled = !isChecked;

  initToggleBlockReplace();
  initToggleInlineStyle();
});

function addCssContentToBlock(files, displayTarget) {
  Array.from(files).forEach(file => {
    if (file.type === "text/css") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        const blockConts = displayTarget.querySelectorAll('.block-cont');
        blockConts.forEach(blockCont => {
          if (blockCont.id === file.name) {
            const codeElement = blockCont.querySelector('.css-cont code.language-css');
            if (codeElement) {
              codeElement.textContent += '\n\n' + fileContent;
              Prism.highlightElement(codeElement);
            }
          }
        });
      };
      reader.readAsText(file);
    }
  });
}

const inputCssFiles = document.getElementById("cssFiles");
const inputCssFiles_sp = document.getElementById("cssFiles_sp");
const htmlDisplay = document.querySelector('.htmlDisplay');
const htmlDisplay_sp = document.querySelector('.htmlDisplay_sp');

[inputCssFiles, inputCssFiles_sp].forEach(input => {
  input.addEventListener("change", () => {
    addCssContentToBlock(input.files, input.id === "cssFiles" ? htmlDisplay : htmlDisplay_sp);
    input.parentElement.querySelector('span').textContent = `${input.files.length} files css added`;
    input.parentElement.classList.add("added");
  });
});

function initToggleBlockReplace() {
  const codeBlocks = document.querySelectorAll('pre.language-html code');

  if (codeBlocks.length === 0) return;

  codeBlocks.forEach(code => {
    if (!code.hasAttribute('data-original')) {
      code.setAttribute('data-original', code.textContent);
    }
  });

  onOffCheck.addEventListener('change', () => {
    codeBlocks.forEach(code => {
      
      if (onOffCheck.checked) {
        let modified = code.textContent.replace(/<block/g, '<div').replace(/<\/block>/g, '</div>').replace(/\s*data-display="[^"]*"/g, '');
        code.textContent = modified;
      } else {
        code.textContent = code.getAttribute('data-original');
      }
      Prism.highlightElement(code);
    });
  });
}

function stripHtml(html) {
  const temp = document.createElement("div");

  html = html.replace(/<br\s*\/?>/gi, "\\n");
  temp.innerHTML = html;
  let text = temp.textContent || temp.innerText || "";

  return text.replace(/\r?\n/g, "\\n");
}

function initToggleInlineStyle() {
  const codeBlocks = document.querySelectorAll('pre.language-html code');

  if (codeBlocks.length === 0) return;

  codeBlocks.forEach(code => {
    if (!code.hasAttribute('data-original')) {
      code.setAttribute('data-original', code.textContent);
    }
  });

  inlineToggleCheck.addEventListener('change', () => {
    codeBlocks.forEach(code => {
      const original = code.getAttribute('data-original');
      if (inlineToggleCheck.checked) {
        let modified = original.replace(
          /(data-sample=")([^"]*)(")/g,
          (match, p1, p2, p3) => p1 + stripHtml(p2) + p3
        );
        modified = modified.replace(/<block/g, '<div').replace(/<\/block>/g, '</div>').replace(/\s*data-display="[^"]*"/g, '');
        code.textContent = modified;
      } else {
        code.textContent = code.getAttribute('data-original');
      }
      Prism.highlightElement(code);
    });
  });
}