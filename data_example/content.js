function setupEventListener() {
  const addButtons = document.querySelectorAll(".btnCreateModule");
  if (addButtons) {
    Array.from(addButtons).forEach((addButton, index) => {
      addButton.addEventListener("click", () => {
        const displayDiv = addButton.parentNode.parentNode;
        const htmlPCContent = displayDiv.querySelector('.block.pc .block-cont .edit-cont code').textContent;
        const cssPCContent = displayDiv.querySelector('.block.pc .block-cont .css-cont code').textContent;
        const htmlSPContent = displayDiv.querySelector('.block.sp .block-cont .edit-cont code').textContent;
        const cssSPContent = displayDiv.querySelector('.block.sp .block-cont .css-cont code').textContent;
        const moduleType = addButton.parentNode.querySelector('.module-type-name').value;
        console.log('===== Create ' + moduleType + ' module =====');
  
        chrome.runtime.sendMessage({
          action: "createModule",
          data: { htmlPCContent, cssPCContent, htmlSPContent, cssSPContent, moduleType },
        });
      });
    });
  }

  const addBtnTypes = document.querySelectorAll(".addBtnContent.--type");
  if (addBtnTypes.length > 0) {
    Array.from(addBtnTypes).forEach((addBtnType) => {
      addBtnType.addEventListener("click", () => {
        const moduleType = addBtnType.parentNode.previousSibling.querySelector('.module-type-name').value;
        console.log('===== Create ' + moduleType + ' module =====');
        chrome.runtime.sendMessage({
          action: "mdAddType",
          data: { moduleType },
        });
      });
    });
  }


  // const addBtnPcs = document.querySelectorAll(".addBtnContent.--pc");
  // if (addBtnPcs) {
  //   Array.from(addButtons).forEach((addBtnPc, index) => {
  //     addBtnPc.addEventListener("click", () => {
  //       const displayDiv = addBtnPc.parentNode.parentNode;
  //       const htmlPCContent = displayDiv.querySelector('.block.pc .block-cont .edit-cont code').textContent;
  //       const cssPCContent = displayDiv.querySelector('.block.pc .block-cont .css-cont code').textContent;
  //       console.log('===== Added PC =====');
  
  //       chrome.runtime.sendMessage({
  //         action: "mdAddPc",
  //         data: { htmlPCContent, cssPCContent },
  //       });
  //     });
  //   });
  // }

  // const addBtnSps = document.querySelectorAll(".addBtnContent.--sp");
  // if (addBtnSps) {
  //   Array.from(addButtons).forEach((addBtnSp, index) => {
  //     addBtnSp.addEventListener("click", () => {
  //       const displayDiv = addBtnSp.parentNode.parentNode;
  //       const htmlSPContent = displayDiv.querySelector('.block.sp .block-cont .edit-cont code').textContent;
  //       const cssSPContent = displayDiv.querySelector('.block.sp .block-cont .css-cont code').textContent;
  //       console.log('===== Added SP =====');
  
  //       chrome.runtime.sendMessage({
  //         action: "mdAddSp",
  //         data: { htmlSPContent, cssSPContent },
  //       });
  //     });
  //   });
  // }

}

const observer = new MutationObserver(() => {
  setupEventListener();
});
observer.observe(document.body, { childList: true, subtree: true });