document.addEventListener('DOMContentLoaded', () => {
  const buttons = [
    { id: 'syncHtmlBtn', action: 'syncHtml' },
    { id: 'checkDataModule', action: 'dataModule' },
    { id: 'checkDataEditable', action: 'dataEditable' },
    { id: 'checkDataEditableAll', action: 'dataEditableAll' },
    { id: 'checkMaxText', action: 'maxText' },
    { id: 'checkMinText', action: 'minText' },
    { id: 'checkRandomText', action: 'randomText' },
    { id: 'checkTagHTML', action: 'tagCheck' },
    { id: 'moduleAddTextAll', action: 'moduleAddTextAll' },
    { id: 'moduleAddTextOne', action: 'moduleAddTextOne' },
    { id: 'moduleAddTextRandom', action: 'moduleAddTextRandom' }
  ];

  function updateButtonState(buttonId, isActive) {
    const button = document.getElementById(buttonId);
    if (button) {
      if (isActive) {
        button.classList.add('--on');
        button.classList.remove('--off');
      } else {
        button.classList.add('--off');
        button.classList.remove('--on');
      }
    }
  }

  function sendButtonMessage(action, isActive) {
    chrome.runtime.sendMessage({
      action: isActive ? `${action}On` : `${action}Off`
    });
  }

  function setButtonEvent(buttonId, action) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', () => {
        const isCurrentlyActive = !button.classList.contains('--on');
        updateButtonState(buttonId, isCurrentlyActive);

        chrome.storage.local.set({ [action]: isCurrentlyActive });

        sendButtonMessage(action, isCurrentlyActive);  
      });
    }
  }

  const loopOn = document.getElementById('toggleLoopOn');
  if (loopOn) {
    loopOn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: "toggleLoopOn" });
    });
  }
  const loopOff = document.getElementById('toggleLoopOff');
  if (loopOff) {
    loopOff.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: "toggleLoopOff" });
    });
  }

  chrome.storage.local.get({
    syncHtml: false,
    dataModule: false,
    dataEditable: false,
    maxText: false,
    tagCheck: false
  }, (data) => {
    buttons.forEach(button => {
      const isActive = data[button.action] ?? false;
      updateButtonState(button.id, isActive);
      setButtonEvent(button.id, button.action);
    });
  });

  const checkImageButton = document.getElementById("checkImage");
  if (checkImageButton) {
    checkImageButton.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "imgTestRandom" });
    });
  }

  const generateInputsButton = document.getElementById('generateInputs');
  if (generateInputsButton) {
    generateInputsButton.addEventListener('click', function() {
      const numInputs = document.getElementById('numInputs').value;
      const container = document.getElementById('colorInputsContainer');
      container.innerHTML = '';
  
      for (let i = 1; i <= numInputs; i++) {
        const label = document.createElement('label');
        if(i < 10) {
          label.innerText = `--color0${i}`;
        } else {
          label.innerText = `--color${i}`;
        }
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Color ${i} (Hex code)`;
        input.id = `color${i}`;
        input.maxLength = 8;
        container.appendChild(label);
        label.appendChild(input);
      }
  
      document.getElementById('addColorBtn').style.display = 'inline-block';
    });
  }

  const addColorBtnButton = document.getElementById('addColorBtn');
  if (addColorBtnButton) {
    addColorBtnButton.addEventListener('click', function() {
      const numInputs = document.getElementById('numInputs').value;
      let styles = ':root {\n';
      for (let i = 1; i <= numInputs; i++) {
        const color = document.getElementById(`color${i}`).value;
        if (color) {
          styles += `  --color${String(i).padStart(2, '0')}: #${color};\n`;
        }
      }
      styles += '}';
      chrome.runtime.sendMessage({
        action: 'addStyle',
        style: styles
      });
    });
  }

  const moduleAddImageButton = document.getElementById("moduleAddImage");
  if (moduleAddImageButton) {
    moduleAddImageButton.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "moduleAddImg" });
    });
  }

  const textareaColor = document.getElementById('inputColor');
  chrome.storage.sync.get(['textareaContent'], function(result) {
    if (result.textareaContent) {
      textareaColor.value = result.textareaContent;
    }
  });
  textareaColor.addEventListener('input', function () {
    chrome.storage.sync.set({ textareaContent: textareaColor.value });
  });

  const getCssFileButton = document.getElementById("getCssFile");
  if (getCssFileButton) {
    getCssFileButton.addEventListener("click", function () {
      const inputColor = document.getElementById("inputColor").value;
      const matches = [...inputColor.matchAll(/--([a-zA-Z0-9_-]+):\s*(#[a-fA-F0-9]{6,8})/g)];
    
      const arrayColor = matches.map(match => ({
        name: match[1],
        color: match[2].replace("#", "")
      }));
    
      chrome.runtime.sendMessage({
        action: 'getCssFile',
        arg: arrayColor
      });
    });
  }

  const urlInput = document.getElementById("urlInput");
  chrome.storage.sync.get(["urlSyncData"], (result) => {
    if (result.urlSyncData) {
      urlInput.value = result.urlSyncData;
    }
  });
  urlInput.addEventListener("input", () => {
    const url = urlInput.value.trim();
    chrome.storage.sync.set({ urlSyncData: url }, () => {
      console.log("URL Sync: ", url);
    });
  });
});