const attributesToCopy = {
  "headline": ["class", "max", "data-sample", "data-label", "data-hint", "data-monitor", "data-display"],
  "image": ["class", "data-aspect", "data-readonly", "data-monitor", "data-display", "max"],
  "button": ["class", "max", "data-sample", "data-label", "data-hint", "data-empty", "data-type", "data-hidden-label"],
  "text": ["class", "max", "data-sample", "data-label", "data-hint", "data-monitor", "data-display", "data-faq-question", "data-faq-answer"],
  "iframe": ["class", "max", "data-sample", "data-label", "data-hint"],
  "job": ["class", "data-type", "data-sample-thumbnail", "data-sample-name", "data-sample-description"],
  "recruitment": ["class", "data-type", "data-sample-thumbnail", "data-sample-title", "data-sample-type", "data-sample-location", "data-sample-salary", "data-sample-salaryType", "data-sample-companyName"],
  "chart": ["class", "data-type", "data-series", "data-format", "min", "max"]
};
const placeholderMapping = {
  "1": { label: "label", hint: "hint" },
};

document.addEventListener("DOMContentLoaded", async function () {
  const selectElement = document.getElementById("dataPlaceId");

  if (selectElement.value) {
    try {
      const response = await fetch(selectElement.value);
      if (!response.ok) throw new Error("File not found or error fetching data");
      const data = await response.json();
      updatePlaceholderMapping(data);
    } catch (error) {
      console.error("Error loading the JSON file on page load:", error);
    }
  }

  selectElement.addEventListener("change", async function () {
    const selectedFile = this.value;
    try {
      const response = await fetch(selectedFile);
      if (!response.ok) throw new Error("File not found or error fetching data");
      const data = await response.json();
      updatePlaceholderMapping(data);

      placeholderData = data;
      placeholderLoaded = true;

      processInputContent();

    } catch (error) {
      console.error("Error loading the JSON file:", error);
    }
  });
});

function updatePlaceholderMapping(data) {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const placeholder = data[key];
      placeholderMapping[key] = placeholder;
    }
  }
}

function checkDataPlaceholder(editableElement, originalElement) {
  const placeholderId = originalElement.getAttribute("data-placeholder-id");
  if (placeholderId && placeholderMapping[placeholderId]) {
    const { label, hint } = placeholderMapping[placeholderId];
    editableElement.setAttribute("data-placeholder-id", placeholderId);
    if (!originalElement.hasAttribute("data-label")) {
      editableElement.setAttribute("data-label", label);
    }
    if (!originalElement.hasAttribute("data-hint")) {
      editableElement.setAttribute("data-hint", hint);
    }
  }
}

function skipEl(element) {
  return element.getAttribute("data-skip") === "true";
}

function addAttributes(editableElement, originalElement, attributes) {
  attributes.forEach(attr => {
    const attrValue = originalElement.getAttribute(attr);
    if (attrValue) {
      editableElement.setAttribute(attr, attrValue);
    }
  });
}

function dataPlaceholder(text) {
  // return text.replace(/<br\s*\/?>/g, "\\n").trim().replace(/\s+/g, " ").replace(/"/g, "'");
 
  const hasHtmlTag = /<(?!br\s*\/?>)[^>]+>/g.test(text);
  if (!hasHtmlTag) {
    text = text.replace(/<br\s*\/?>/g, "\\n");
  }
  text = text.trim().replace(/\s+/g, " ").replace(/"/g, "'");

  return text;
}

function setDefaultLabelAndHint(editableElement, labelValue, hintValue) {
  if (!editableElement.hasAttribute("data-label")) {
    editableElement.setAttribute("data-label", labelValue);
  }
  if (!editableElement.hasAttribute("data-hint")) {
    editableElement.setAttribute("data-hint", hintValue);
  }
}

function handleIframe(iframeElement) {
  const editableElement = document.createElement("editable");
  const type = iframeElement.getAttribute("data-type");
  const dataMaxValue = iframeElement.getAttribute("max") || "1000";

  if (type === "movie") {
    editableElement.setAttribute("data-type", "movie");
    const srcValue = iframeElement.getAttribute("src");
    if (srcValue) {
      editableElement.setAttribute("data-sample", srcValue);
    }
    setDefaultLabelAndHint(editableElement, "動画 URL", "");
  } else if (type === "map") {
    editableElement.setAttribute("data-type", "map");
    iframeElement.removeAttribute("data-type");
    iframeElement.removeAttribute("max");
    const encodedSrc = encodeURIComponent(iframeElement.outerHTML);
    editableElement.setAttribute("data-sample", encodedSrc);
    setDefaultLabelAndHint(editableElement, "地図 URL", "");
  }
  editableElement.setAttribute("max", dataMaxValue);
  addAttributes(editableElement, iframeElement, attributesToCopy["iframe"]);
  return editableElement;
}

function handleLoopElements(blockElement) {
  const loopElIssues = blockElement.querySelectorAll("div[data-type='issue-list']");
  loopElIssues.forEach((loopElIssue, index) => {
    let sampleData = '';
    let maxData = '';
    const firstEl = loopElIssue.querySelector(".loop-list__item-text > *");
    sampleData = firstEl.getAttribute('data-sample');
    maxData = firstEl.getAttribute('max');
    
    const editableElement = document.createElement("editable");
    Array.from(loopElIssue.attributes).forEach(attr => {
      editableElement.setAttribute(attr.name, attr.value);
    });

    editableElement.setAttribute("data-type", loopElIssue.getAttribute("data-type"));
    editableElement.setAttribute("class", loopElIssue.getAttribute("class"));

    const dataItemRow = loopElIssue.getAttribute("data-item-row");
    if (dataItemRow) {
      editableElement.setAttribute("data-item-row", dataItemRow);
    }
    const dataItemColumn = loopElIssue.getAttribute("data-item-column");
    if (dataItemColumn) {
      editableElement.setAttribute("data-item-column", dataItemColumn);
    }

    loopElIssue.parentNode.replaceChild(editableElement, loopElIssue);

    const itemTextElement = loopElIssue.querySelector(".loop-list__item-text > *");
    if (itemTextElement) {
      const placeholderId = itemTextElement.getAttribute("data-placeholder-id");
      const placeholder = placeholderMapping[placeholderId];
      const label = placeholder ? placeholder.label : '';
      const hint = placeholder ? placeholder.hint : '';
      
      editableElement.setAttribute("data-item-max", maxData);
      editableElement.setAttribute("data-sample", sampleData);
      editableElement.setAttribute("data-placeholder-id", placeholderId);
      editableElement.setAttribute("data-item-label", label);
      editableElement.setAttribute("data-item-hint", hint);
    }
  });

  const loopElTables = blockElement.querySelectorAll("div[data-type='loop-table']");
  loopElTables.forEach((loopElTable, index) => {
    let dataRowMax = '';
    let dataRowMin = '';
    let dataRowLabel = '';
    let dataRowHint = '';
    let dataRowSample = '';
    let dataColMax = '';
    let dataColMin = '';
    let dataColLabel = '';
    let dataColHint = '';
    let dataColSample = '';
    let dataCellMax = '';
    let dataCellMin = '';
    let dataCellLabel = '';
    let dataCellHint = '';
    let dataCellSample = '';
    const tbHead = loopElTable.querySelector(".loop-table__head");

    if(tbHead) {
      const tbHeadEl = tbHead.children[1].children[0];
      const tbHeadMax = tbHeadEl.getAttribute("max");
      const tbHeadMin = tbHeadEl.getAttribute("min");
      const tbHeadSample = tbHeadEl.getAttribute("data-type") === "image" ? "画像" : tbHeadEl.getAttribute("data-sample");
      const tbHeadId = tbHeadEl.getAttribute("data-placeholder-id");
      const tbHeadPlaceholder = placeholderMapping[tbHeadId];
      const tbHeadLabel = tbHeadPlaceholder ? tbHeadPlaceholder.label : '';
      const tbHeadHint = tbHeadPlaceholder ? tbHeadPlaceholder.hint : '';
      dataRowMax = tbHeadMax;
      if(tbHeadMin) {
        dataRowMin = tbHeadMin;
      } else {
        dataRowMin = "1";
      }
      dataRowLabel = tbHeadLabel;
      dataRowHint = tbHeadHint;
      dataRowSample = tbHeadSample;
    }
    
    const tbRow = loopElTable.querySelectorAll(".loop-table__row")[1];
    if(tbRow) {
      const tbRowElCol = tbRow.children[0].children[0];
      const tbRowElColSp = tbRow.children[0].children[0];
      if(tbRowElCol) {
        const tbColMax = tbRowElCol.getAttribute("max");
        const tbColMin = tbRowElCol.getAttribute("min");
        const tbColSample = tbRowElColSp.getAttribute("data-type") === "image" ? "画像" : tbRowElColSp.getAttribute("data-sample");
        const tbColId = tbRowElCol.getAttribute("data-placeholder-id");
        const tbRowElColPlaceholder = placeholderMapping[tbColId];
        const tbRowLabel = tbRowElColPlaceholder ? tbRowElColPlaceholder.label : '';
        const tbRowHint = tbRowElColPlaceholder ? tbRowElColPlaceholder.hint : '';
        dataColMax = tbColMax;
        if(tbColMin) {
          dataColMin = tbColMin;
        } else {
          dataColMin = "1";
        }
        dataColLabel = tbRowLabel;
        dataColHint = tbRowHint;
        dataColSample = tbColSample;
      }

      const tbCellEl = tbRow.children[1].children[0];
      if(tbCellEl) {
        const tbCellMax = tbCellEl.getAttribute("max");
        const tbCellMin = tbCellEl.getAttribute("min");
        const tbCellSample = tbCellEl.getAttribute("data-sample");
        const tbCellId = tbCellEl.getAttribute("data-placeholder-id");
        const tbCellElPlaceholder = placeholderMapping[tbCellId];
        const tbCellLabel = tbCellElPlaceholder ? tbCellElPlaceholder.label : '';
        const tbCellHint = tbCellElPlaceholder ? tbCellElPlaceholder.hint : '';
        dataCellMax = tbCellMax;
        if(tbCellMin) {
          dataCellMin = tbCellMin;
        } else {
          dataCellMin = "1";
        }
        dataCellLabel = tbCellLabel;
        dataCellHint = tbCellHint;
        dataCellSample = tbCellSample;
      }
    }
    
    const editableElement = document.createElement("editable");
    Array.from(loopElTable.attributes).forEach(attr => {
      editableElement.setAttribute(attr.name, attr.value);
    });

    loopElTable.parentNode.replaceChild(editableElement, loopElTable);

    editableElement.setAttribute("data-row-max", dataRowMax);
    editableElement.setAttribute("data-row-min", dataRowMin);
    editableElement.setAttribute("data-row-label", dataRowLabel);
    editableElement.setAttribute("data-row-hint", dataRowHint);
    editableElement.setAttribute("data-row-sample", dataRowSample);
    editableElement.setAttribute("data-col-max", dataColMax);
    editableElement.setAttribute("data-col-min", dataColMin);
    editableElement.setAttribute("data-col-label", dataColLabel);
    editableElement.setAttribute("data-col-hint", dataColHint);
    editableElement.setAttribute("data-col-sample", dataColSample);
    editableElement.setAttribute("data-cell-max", dataCellMax);
    editableElement.setAttribute("data-cell-min", dataCellMin);
    editableElement.setAttribute("data-cell-label", dataCellLabel);
    editableElement.setAttribute("data-cell-hint", dataCellHint);
    editableElement.setAttribute("data-cell-sample", dataCellSample);
  });

  const loopElGrids = blockElement.querySelectorAll("div[data-type='loop-grid']");
  loopElGrids.forEach(loopElGrid => {
    const editableElement = document.createElement("editable");
    Array.from(loopElGrid.attributes).forEach(attr => {
      editableElement.setAttribute(attr.name, attr.value);
    });

    editableElement.setAttribute("data-type", loopElGrid.getAttribute("data-type"));
    editableElement.setAttribute("class", loopElGrid.getAttribute("class"));

    const dataItemRow = loopElGrid.getAttribute("data-item-row");
    if (dataItemRow) {
      editableElement.setAttribute("data-item-row", dataItemRow);
    }
    const dataItemColumn = loopElGrid.getAttribute("data-item-column");
    if (dataItemColumn) {
      editableElement.setAttribute("data-item-column", dataItemColumn);
    }

    loopElGrid.parentNode.replaceChild(editableElement, loopElGrid);
  });
}

function handleLoopMulti(blockElement) {
  if (!(blockElement instanceof Element)) return;

  const loopDOMElements = Array.from(blockElement.querySelectorAll("div[data-type='loop-DOM']")).sort((a, b) => {
    return b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_CONTAINED_BY ? -1 : 1;
  });

  loopDOMElements.forEach(loopDOMElement => {
    if (loopDOMElement.tagName.toLowerCase() === 'loop') return;

    const loopDOMElementsChild = loopDOMElement.children;
    const hasConditionOption = loopDOMElement.getAttribute("data-condition-type") === "select";
    const hasConditionGroup = loopDOMElement.getAttribute("data-condition-type") === "group";

    if (hasConditionOption) {
      const conditionElement = document.createElement('condition');
      const options = [];
      const firstChildClass = loopDOMElementsChild[0]?.getAttribute('class') || '';
      conditionElement.setAttribute('class', firstChildClass); 

      Array.from(loopDOMElementsChild).forEach((childElement) => {
        const optionValue = parseInt(childElement.getAttribute('data-option-value'), 10);
        const optionLabel = childElement.getAttribute('data-option-label');
        
        if (optionValue && optionLabel) {
          options.push({
            label: optionLabel,
            value: optionValue
          });

          const optionElement = document.createElement('option');
          optionElement.setAttribute('render', `(parentData, loopItem) => { return parentData.value === ${optionValue}; }`);

          Array.from(childElement.children).forEach(conChild => {
            const clone = conChild.cloneNode(true);
            handleLoopMulti(clone);
            optionElement.appendChild(clone);
          });

          conditionElement.appendChild(optionElement);
        }
      });

      conditionElement.setAttribute('options', JSON.stringify(options).replace(/"/g, "'"));

      const newElement = document.createElement('loop');
      Array.from(loopDOMElement.attributes).forEach(attr => {
        newElement.setAttribute(attr.name, attr.value);
      });

      newElement.appendChild(conditionElement);
      loopDOMElement.parentNode.replaceChild(newElement, loopDOMElement);

    } else if (hasConditionGroup) {
      const newElement = document.createElement('loop');
      Array.from(loopDOMElement.attributes).forEach(attr => {
        newElement.setAttribute(attr.name, attr.value);
      });
    
      const conditionElement = document.createElement('condition');
      const childElements = Array.from(loopDOMElementsChild);
      const firstConditionChild = childElements.find(child => child.getAttribute('data-type') === 'condition');
      if (firstConditionChild?.classList.length > 0) {
        conditionElement.setAttribute('class', firstConditionChild.classList.value);
      }
    
      childElements.forEach(child => {
        if (child.getAttribute('data-type') === 'condition') {
          const renderValue = child.getAttribute('data-render');
          const optionElement = document.createElement('option');
          optionElement.setAttribute('render', renderValue);
    
          while (child.firstChild) {
            const move = child.firstChild;
            handleLoopMulti(move);
            optionElement.appendChild(move);
          }

          conditionElement.appendChild(optionElement);
        }
      });
    
      if (conditionElement.children.length > 0) {
        newElement.appendChild(conditionElement);
        if (loopDOMElement.parentNode) {
          loopDOMElement.parentNode.replaceChild(newElement, loopDOMElement);
        }
      }
    } else {
      const newElement = document.createElement('loop');
    
      Array.from(loopDOMElement.attributes).forEach(attr => {
        newElement.setAttribute(attr.name, attr.value);
      });
    
      const firstChildElement = loopDOMElement.firstElementChild;
      if (firstChildElement) {
        const cloned = firstChildElement.cloneNode(true);
        handleLoopMulti(cloned);
        newElement.appendChild(cloned);
      }
    
      if (loopDOMElement.parentNode) {
        loopDOMElement.parentNode.replaceChild(newElement, loopDOMElement);
      }
    }
  });
}

function divCondition(blockElement) {
  const conditionSelects = blockElement.querySelectorAll('[data-condition-type="select"]');
  conditionSelects.forEach(select => {
    const optionDivs = Array.from(select.children).filter(child => child.hasAttribute('data-option-value') && child.hasAttribute('data-option-label'));
    if (optionDivs.length === 0) return;

    const optionsArray = [];
    const conditionWrapper = document.createElement('condition');
    const firstClass = optionDivs[0].getAttribute('class');
    if (firstClass) {
      conditionWrapper.setAttribute('class', firstClass);
    }
    conditionWrapper.setAttribute('data-type', 'condition');

    optionDivs.forEach(opt => {
      const value = opt.getAttribute('data-option-value');
      const label = opt.getAttribute('data-option-label');
      optionsArray.push({ label, value: isNaN(value) ? value : Number(value) });

      const optionElement = document.createElement('option');
      optionElement.setAttribute('render', `(parentData, loopItem) => { return parentData.value === ${value}; }`);

      while (opt.firstChild) {
        optionElement.appendChild(opt.firstChild);
      }

      conditionWrapper.appendChild(optionElement);
      opt.remove();
    });

    conditionWrapper.setAttribute('options', JSON.stringify(optionsArray).replace(/"/g, "'"));
    select.appendChild(conditionWrapper);
  });
}

function replaceElements(blockElement) {
  function hasJobOrRecruitmentParent(element) {
    let currentElement = element;
    while (currentElement.parentNode) {
      currentElement = currentElement.parentNode;
      if (["job", "recruitment"].includes(currentElement.getAttribute("data-type"))) {
        return true;
      }
    }
    return false;
  }

  // Headline
  function processHeaders(start, end) {
    for (let i = start; i <= end; i++) {
      const headerElements = blockElement.querySelectorAll(`h${i}`);
      headerElements.forEach(headerElement => {
        if (!hasJobOrRecruitmentParent(headerElement) && !skipEl(headerElement)) {
          const editableElement = document.createElement("editable");
          editableElement.setAttribute("data-type", "headline");
          editableElement.setAttribute("data-html-tag", `h${i}`);
          const placeholderText = dataPlaceholder(headerElement.innerHTML);
          editableElement.setAttribute("data-sample", placeholderText);

          checkDataPlaceholder(editableElement, headerElement);
          
          addAttributes(editableElement, headerElement, attributesToCopy["headline"]);
          headerElement.parentNode.replaceChild(editableElement, headerElement);
        }
      });
    }
  }
  processHeaders(1, 6);

  // Img
  const imgElements = blockElement.querySelectorAll("img");
  imgElements.forEach(imgElement => {
    if (!skipEl(imgElement)) {
      const editableElement = document.createElement("editable");
      const dataField = imgElement.getAttribute("data-field");
      if (dataField === "job.thumbnail") {
        imgElement.removeAttribute("data-field");
        imgElement.setAttribute("src", "{{job.thumbnail}}");
        imgElement.setAttribute("alt", "{{job.name}}");
      } else if (dataField === "recruitment.thumbnail") {
        imgElement.removeAttribute("data-field");
        imgElement.setAttribute("src", "{{recruitment.thumbnail}}");
        imgElement.setAttribute("alt", "{{recruitment.title}}");
      } else {
        editableElement.setAttribute("data-type", "image");
        if (imgElement.getAttribute("data-readonly") === "true" || imgElement.hasAttribute("readonly")) {
          editableElement.setAttribute("data-readonly", "true");
        }
        const dataAspect = imgElement.getAttribute("data-aspect");
        if (dataAspect) {
          editableElement.setAttribute("data-aspect", dataAspect);
        }
        setDefaultLabelAndHint(editableElement, "画像", "");
        addAttributes(editableElement, imgElement, attributesToCopy["image"]);
        imgElement.parentNode.replaceChild(editableElement, imgElement);
      }
    } else {
      imgElement.setAttribute("src", "/img/empty.png");
    }
  });

  // Button
  let buttonCount = 0;
  const labelElements = blockElement.querySelectorAll("label");
  labelElements.forEach(labelElement => {
    if (!hasJobOrRecruitmentParent(labelElement)) {
      const btnElement = labelElement.querySelector("button");
      if (btnElement) {
        const editableElement = document.createElement("editable");
        const buttonId = "sg-module-button-" + (++buttonCount);

        if (btnElement.getAttribute("data-type") === "button") {
          editableElement.setAttribute("id", buttonId);
          labelElement.setAttribute("htmlfor", buttonId);
        } else {
          labelElement.removeAttribute("htmlfor");
        }
        // editableElement.setAttribute("data-type", "button");
        const placeholderText = dataPlaceholder(btnElement.innerHTML);
        editableElement.setAttribute("data-sample", placeholderText);
        if (btnElement.getAttribute("data-empty") === "true" || btnElement.hasAttribute("empty")) {
          editableElement.setAttribute("data-empty", "true");
        }

        checkDataPlaceholder(editableElement, btnElement);
        
        addAttributes(editableElement, btnElement, attributesToCopy["button"]);
        btnElement.parentNode.replaceChild(editableElement, btnElement);
      }
    } else {
      labelElement.removeAttribute("htmlfor");
      const btnElements = labelElement.querySelectorAll("button");
      btnElements.forEach(btnElement => {
        btnElement.removeAttribute("id");
        btnElement.removeAttribute("max");
      });
    }
  });

  // Text
  const textElements = blockElement.querySelectorAll("p");
  textElements.forEach(textElement => {
    if (!hasJobOrRecruitmentParent(textElement) && !skipEl(textElement)) {
      const innerHtml = textElement.innerHTML;
      if (hasJobOrRecruitmentParent(textElement)) {
        textElement.removeAttribute("min");
        textElement.removeAttribute("max");
        textElement.removeAttribute("data-type");
      } else {
        const editableElement = document.createElement("editable");
        editableElement.setAttribute("data-type", innerHtml.includes("<br>") || textElement.getAttribute("data-type") === "multi-text" ? "multi-text" : "single-text");
        const placeholderText = dataPlaceholder(innerHtml);
        editableElement.setAttribute("data-sample", placeholderText);

        checkDataPlaceholder(editableElement, textElement);

        addAttributes(editableElement, textElement, attributesToCopy["text"]);
        textElement.parentNode.replaceChild(editableElement, textElement);
      }
    }
  });

  // Iframe
  const iframeElements = blockElement.querySelectorAll("iframe");
  iframeElements.forEach(iframeElement => {
    const editableElement = handleIframe(iframeElement);
    iframeElement.parentNode.replaceChild(editableElement, iframeElement);
  });

  // Job and Recruitment
  ['job', 'recruitment'].forEach(type => {
    const elements = blockElement.querySelectorAll(`div[data-type='${type}']`);
    elements.forEach((element, index) => {
      if (index === 0) {
        const editableElement = document.createElement("editable");
        editableElement.setAttribute("data-type", type);
        const fields = attributesToCopy[type];
        
        const processField = (field, placeholderAttr, defaultValue) => {
          const el = element.querySelector(`[data-field='${field}']`);
          if (el) {
            const text = dataPlaceholder(el.innerHTML);
            if (!editableElement.hasAttribute(placeholderAttr)) {
              editableElement.setAttributeNS(null, placeholderAttr, text || defaultValue);
            }
          }
        };
        
        if (type === 'job') {
          processField('job.name', 'data-sample-name');
          processField('job.description', 'data-sample-description');
        }
        
        if (type === 'recruitment') {
          processField('recruitment.title', 'data-sample-title');
          processField('recruitment.type', 'data-sample-type');
          processField('recruitment.location', 'data-sample-location');
          processField('recruitment.companyName', 'data-sample-companyName');
          if (!editableElement.hasAttribute('data-sample-salary')) {
            editableElement.setAttribute('data-sample-salary', '235,000円');
          }
          if (!editableElement.hasAttribute('data-sample-salaryType')) {
            editableElement.setAttributeNS(null, 'data-sample-salaryType', '月給');
          }
        }

        addAttributes(editableElement, element, fields);
        const firstChildElement = element.firstElementChild.cloneNode(true);
        editableElement.appendChild(firstChildElement);
        element.parentNode.replaceChild(editableElement, element);
      } else {
        element.parentNode.removeChild(element);
      }
    });
  });

  // Div types
  const divElements = [
    { type: 'job.name', content: '{{job.name}}' },
    { type: 'job.description', content: '{{job.description}}' },
    { type: 'recruitment.company', content: '{{recruitment.companyName}}' },
    { type: 'recruitment.title', content: '{{recruitment.title}}' },
    { type: 'recruitment.type', content: '{{recruitment.type}}' },
    { type: 'recruitment.location', content: '{{recruitment.location}}' },
    { type: 'recruitment.salary', content: '{{recruitment.salaryType}} {{recruitment.salary}}' },
  ];
  divElements.forEach(item => {
    const elements = blockElement.querySelectorAll(`[data-field='${item.type}']`);
    elements.forEach(element => {
      element.removeAttribute("data-field");
      element.innerHTML = item.content;
    });
  });

  // Chart
  const chartElements = blockElement.querySelectorAll("div[data-type='chart']");
  chartElements.forEach(chartElement => {
    const editableElement = document.createElement("editable");
    editableElement.setAttribute("data-type", "chart");
    addAttributes(editableElement, chartElement, attributesToCopy["chart"]);
    editableElement.setAttribute("data-chart", chartElement.getAttribute("data-chart"));
    const dataSeriesValue = chartElement.getAttribute("data-options");
    if (dataSeriesValue) {
      const replacedValue = dataSeriesValue.replace(/\s+/g, '');
      editableElement.setAttribute("data-options", replacedValue);
    }
    
    chartElement.parentNode.replaceChild(editableElement, chartElement);
  });

  // Loop
  handleLoopElements(blockElement);
  handleLoopMulti(blockElement);
  divCondition(blockElement);

  // Block
  const displayDivs = blockElement.querySelectorAll("div[data-display]");
  displayDivs.forEach(div => {
    const block = document.createElement("block");

    for (const attr of div.attributes) {
      block.setAttribute(attr.name, attr.value);
    }

    while (div.firstChild) {
      block.appendChild(div.firstChild);
    }

    div.parentNode.replaceChild(block, div);
  });
  
}