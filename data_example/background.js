import {
  systemHtml,
  localHtml,
  dataModuleOn,
  dataModuleOff,
  dataEditableOn,
  dataEditableOff,
  dataEditableAllOn,
  dataEditableAllOff,
  maxTextOn,
  maxTextOff,
  minTextOn,
  minTextOff,
  randomTextOn,
  randomTextOff,
  tagHTMLOn,
  tagHTMLOff,
  imgRandom,
  addColorStyle,
  moduleAddTextAllOn,
  moduleAddTextAllOff,
  moduleAddTextOneOn,
  moduleAddTextOneOff,
  moduleAddTextRandomOn,
  moduleAddTextRandomOff,
  moduleAddImg,
  getCssFile,
  toggleLoopOn,
  toggleLoopOff
} from './lib/function.js';

function actionScript(func, args=[]) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: func,
        args: args
      });
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'syncHtmlOn':
      actionScript(systemHtml);
      break;
    case 'syncHtmlOff':
      actionScript(localHtml);
      break;
    case 'dataModuleOn':
      actionScript(dataModuleOn);
      break;
    case 'dataModuleOff':
      actionScript(dataModuleOff);
      break;
    case 'dataEditableOn':
      actionScript(dataEditableOn);
      break;
    case 'dataEditableOff':
      actionScript(dataEditableOff);
      break;
    case 'dataEditableAllOn':
      actionScript(dataEditableAllOn);
      break;
    case 'dataEditableAllOff':
      actionScript(dataEditableAllOff);
      break;
    case 'maxTextOn':
      actionScript(maxTextOn);
      break;
    case 'maxTextOff':
      actionScript(maxTextOff);
      break;
    case 'minTextOn':
      actionScript(minTextOn);
      break;
    case 'minTextOff':
      actionScript(minTextOff);
      break;
    case 'randomTextOn':
      actionScript(randomTextOn);
      break;
    case 'randomTextOff':
      actionScript(randomTextOff);
      break;
    case 'tagCheckOn':
      actionScript(tagHTMLOn);
      break;
    case 'tagCheckOff':
      actionScript(tagHTMLOff);
      break;
    case 'imgTestRandom':
      actionScript(imgRandom);
      break;
    case 'addStyle':
      actionScript(addColorStyle, [message.style]);
      break;
    case 'moduleAddTextAllOn':
      actionScript(moduleAddTextAllOn);
      break;
    case 'moduleAddTextAllOff':
      actionScript(moduleAddTextAllOff);
      break;
    case 'moduleAddTextOneOn':
      actionScript(moduleAddTextOneOn);
      break;
    case 'moduleAddTextOneOff':
      actionScript(moduleAddTextOneOff);
      break;
    case 'moduleAddTextRandomOn':
      actionScript(moduleAddTextRandomOn);
      break;
    case 'moduleAddTextRandomOff':
      actionScript(moduleAddTextRandomOff);
      break;
    case 'moduleAddImg':
      actionScript(moduleAddImg);
      break;
    case 'getCssFile':
      actionScript(getCssFile, [message.arg]);
      break;
    case 'toggleLoopOn':
      actionScript(toggleLoopOn);
      break;
    case 'toggleLoopOff':
      actionScript(toggleLoopOff);
      break;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "createModule") {
    const { htmlPCContent, cssPCContent, htmlSPContent, cssSPContent, moduleType } = message.data;

    chrome.storage.sync.get(["urlSyncData"], (result) => {
      const url = result.urlSyncData || "";
      if (!url) {
        return;
      }

      chrome.tabs.query({ url: `${url}*` }, (tabs) => {
        if (tabs.length > 0) {
          const tabId = tabs[0].id;

          chrome.scripting.executeScript({
            target: { tabId },
            func: async (htmlPCContent, cssPCContent, htmlSPContent, cssSPContent, moduleType) => {
              if (document.readyState !== 'loading') {
                await doWork(htmlPCContent, cssPCContent, htmlSPContent, cssSPContent, moduleType);
              } else {
                document.addEventListener('DOMContentLoaded', () => {
                  doWork(htmlPCContent, cssPCContent, htmlSPContent, cssSPContent, moduleType);
                });
              }
              async function waitForEl(selector) {
                return new Promise(resolve => {
                  const observer = new MutationObserver((mutationsList, observer) => {
                    for (const mutation of mutationsList) {
                      if (mutation.type === 'childList') {
                        const element = document.querySelector(selector);
                        if (element) {
                          observer.disconnect();
                          resolve(element);
                          return;
                        }
                      }
                    }
                  });

                  observer.observe(document.body, { childList: true, subtree: true });
                });
              }
              async function doWork(htmlPCContent, cssPCContent, htmlSPContent, cssSPContent, moduleType) {
                const layout = document.querySelector("#root-layout");
                if (layout) {
                  const layoutModule = layout.firstElementChild;
                  const btnCreateModule = layoutModule.querySelector("div[class='flex justify-between'] > a");
                  console.log("1. Create module: " + moduleType);
                  if (btnCreateModule) btnCreateModule.click();

                  const observer = new MutationObserver(async (mutationsList, observer) => {
                    const findForm = document.querySelector("#root-layout").firstElementChild.querySelector("form");

                    if (findForm) {
                      console.log("2. Add data");

                      const aceHtmlPc = document.getElementById('modules.0.html.PC');
                      const aceCssPc = document.getElementById('modules.0.css.PC');
                      const btnPCView = document.querySelector('div[data-name="modules.0.css.PC"]').nextElementSibling;
                      const btnSwitchSP = layout.querySelector('.form-field[data-name="modules.0.code"] button[type="button"]');

                      const aceHtmlEditorPC = aceHtmlPc.querySelector("textarea.ace_text-input");
                      const aceCssEditorPC = aceCssPc.querySelector("textarea.ace_text-input");
                      aceHtmlEditorPC.value = htmlPCContent;
                      aceHtmlEditorPC.dispatchEvent(new Event("input", { bubbles: true }));
                      aceCssEditorPC.value = cssPCContent;
                      aceCssEditorPC.dispatchEvent(new Event("input", { bubbles: true }));

                      console.log("3. Add HTML/CSS PC Done");
                      const attributeObserver = new MutationObserver(async () => {
                        if (btnPCView && btnPCView.getAttribute("data-disabled") !== "true") {
                          btnPCView.click();
                          console.log("4. Switch to SP");
                          attributeObserver.disconnect();

                          btnSwitchSP.click();
                          await waitForEl('#modules\\.0\\.html\\.SP');
                          const aceHtmlSp = document.getElementById('modules.0.html.SP');
                          const aceCssSp = document.getElementById('modules.0.css.SP');
                          const btnSPView = document.querySelector('div[data-name="modules.0.css.SP"]').nextElementSibling;
                          const btnSumit = document.querySelector('button[type="submit"]');

                          const aceHtmlEditorSP = aceHtmlSp.querySelector("textarea.ace_text-input");
                          const aceCssEditorSP = aceCssSp.querySelector("textarea.ace_text-input");
                          aceHtmlEditorSP.value = htmlSPContent;
                          aceHtmlEditorSP.dispatchEvent(new Event("input", { bubbles: true }));
                          aceCssEditorSP.value = cssSPContent;
                          aceCssEditorSP.dispatchEvent(new Event("input", { bubbles: true }));
                          console.log("6. Add HTML/CSS SP Done");
                          btnSPView.click();
                          
                          const moduleColor = document.querySelector('.form-field[data-name="modules.0.color_set_id"] div[data-slot="innerWrapper"]');
                          if (moduleColor) {
                            moduleColor.click();
                            await waitForEl('ul[data-slot="listbox"]');
                            const listBoxColor = document.querySelector('ul[data-slot="listbox"]');
                            if (listBoxColor) {
                              const firstItem = listBoxColor.querySelector('li');
                              if (firstItem) {
                                firstItem.click();
                                console.log('7. Color selected');
                              }
                            }
                          }

                          // const moduleTypeList = await waitForEl('.form-field[data-name="modules.0.module_type_id"] div[data-slot="inner-wrapper"]');
                          // if (moduleTypeList) {
                          //   moduleTypeList.click();
                          //   await waitForEl('ul[data-slot="list"]');
                          //   const listBoxModule = document.querySelector('ul[data-slot="list"]');
                          //   if (listBoxModule) {
                          //     const items = listBoxModule.querySelectorAll('li > span');
                          //     for (let item of items) {
                          //       if (item.innerText.trim() === moduleType) {
                          //         item.parentElement.click();
                          //         console.log('8. Module type selected');
                          //         btnSumit.click();
                          //         break;
                          //       }
                          //     }
                          //   }
                          // }
                          const moduleTypeList = await waitForEl('.form-field[data-name="modules.0.module_type_id"] div[data-slot="inner-wrapper"]');
                          if (moduleTypeList) {
                            moduleTypeList.click();
                            
                            const inputModuleType = await waitForEl('input[data-slot="input"]');
                            if (inputModuleType) {
                              inputModuleType.value = moduleType;
                              inputModuleType.dispatchEvent(new Event("input", { bubbles: true }));
                              
                              await waitForEl('ul[data-slot="list"]');
                              
                              const listBoxModule = document.querySelector('ul[data-slot="list"]');
                              if (listBoxModule && listBoxModule.children.length > 0) {
                                const firstItem = listBoxModule.querySelector('li > span');
                                if (firstItem) {
                                  firstItem.parentElement.click();
                                  console.log('8. Module type selected');
                                  
                                  const btnSubmit = document.querySelector('button[type="submit"]');
                                  if (btnSubmit) {
                                    btnSubmit.click();
                                    console.log('9. Form submitted');
                                  }
                                }
                              } else {
                                console.error('No items found in the module type list');
                              }
                            }
                          }
                        }
                      });
                      attributeObserver.observe(btnPCView, { attributes: true, attributeFilter: ["data-disabled"] });

                      observer.disconnect();
                    }
                  });

                  observer.observe(document.body, { childList: true, subtree: true });
                }
              }
              
            },
            args: [htmlPCContent, cssPCContent, htmlSPContent, cssSPContent, moduleType],
          });
        } else {
          
        }
      });
    });
  }

  if (message.action === "mdAddType") {
    const { moduleType } = message.data;
  
    chrome.storage.sync.get(["urlSyncData"], (result) => {
      const url = result.urlSyncData || "";
      if (!url) {
        return;
      }

      chrome.tabs.query({ url: `${url}*` }, (tabs) => {
        if (tabs.length > 0) {
          const tabId = tabs[0].id;

          chrome.scripting.executeScript({
            target: { tabId },
            func: async (moduleType) => {
              if (document.readyState !== 'loading') {
                await doWork(moduleType);
              } else {
                document.addEventListener('DOMContentLoaded', () => {
                  doWork(moduleType);
                });
              }
              async function waitForEl(selector) {
                return new Promise(resolve => {
                  const observer = new MutationObserver((mutationsList, observer) => {
                    for (const mutation of mutationsList) {
                      if (mutation.type === 'childList') {
                        const element = document.querySelector(selector);
                        if (element) {
                          observer.disconnect();
                          resolve(element);
                          return;
                        }
                      }
                    }
                  });

                  observer.observe(document.body, { childList: true, subtree: true });
                });
              }
              async function doWork(moduleType) {
                const layout = document.querySelector("#root-layout");
                if (layout) {
                  const layoutModule = layout.firstElementChild;
                  const btnCreateModule = layoutModule.querySelector("div[class='flex justify-between'] > a");
                  console.log("1. Create module: " + moduleType);
                  if (btnCreateModule) btnCreateModule.click();
  
                  const observer = new MutationObserver(async (mutationsList, observer) => {
                    const findForm = document.querySelector("#root-layout").firstElementChild.querySelector("form");
  
                    if (findForm) {
                      console.log("2. Add data");
  
                      const moduleColor = document.querySelector('.form-field[data-name="modules.0.color_set_id"] div[data-slot="innerWrapper"]');
                      if (moduleColor) {
                        moduleColor.click();
                        await waitForEl('ul[data-slot="listbox"]');
                        const listBoxColor = document.querySelector('ul[data-slot="listbox"]');
                        if (listBoxColor) {
                          const firstItem = listBoxColor.querySelector('li');
                          if (firstItem) {
                            firstItem.click();
                            console.log('3. Color selected');
                          }
                        }
                      }
  
                      const moduleTypeList = await waitForEl('.form-field[data-name="modules.0.module_type_id"] div[data-slot="inner-wrapper"]');
                      if (moduleTypeList) {
                        moduleTypeList.click();
                        const inputModuleType = await waitForEl('input[data-slot="input"]');
                        if (inputModuleType) {
                          inputModuleType.value = moduleType;
                          inputModuleType.dispatchEvent(new Event("input", { bubbles: true }));
  
                          await waitForEl('ul[data-slot="list"]');
                          const listBoxModule = document.querySelector('ul[data-slot="list"]');
                          if (listBoxModule && listBoxModule.children.length > 0) {
                            const firstItem = listBoxModule.querySelector('li > span');
                            if (firstItem) {
                              firstItem.parentElement.click();
                              console.log('4. Module type selected');
                            }
                          }
                        }
                      }
                    }
                  });
  
                  observer.disconnect();
                }
              }
  
            },
            args: [moduleType],
          });
        }
      });
    });
  }
  
  if (message.action === "mdAddPc") {
    const { htmlPCContent, cssPCContent } = message.data;

    chrome.storage.sync.get(["urlSyncData"], (result) => {
      const url = result.urlSyncData || "";
      if (!url) {
        return;
      }

      chrome.tabs.query({ url: `${url}*` }, (tabs) => {
        if (tabs.length > 0) {
          const tabId = tabs[0].id;

          chrome.scripting.executeScript({
            target: { tabId },
            func: async (htmlPCContent, cssPCContent) => {
              if (document.readyState !== 'loading') {
                await doWork(htmlPCContent, cssPCContent);
              } else {
                document.addEventListener('DOMContentLoaded', () => {
                  doWork(htmlPCContent, cssPCContent);
                });
              }
              async function waitForEl(selector) {
                return new Promise(resolve => {
                  const observer = new MutationObserver((mutationsList, observer) => {
                    for (const mutation of mutationsList) {
                      if (mutation.type === 'childList') {
                        const element = document.querySelector(selector);
                        if (element) {
                          observer.disconnect();
                          resolve(element);
                          return;
                        }
                      }
                    }
                  });

                  observer.observe(document.body, { childList: true, subtree: true });
                });
              }
              async function doWork(htmlPCContent, cssPCContent) {
                const layout = document.querySelector("#root-layout");
                if (layout) {
                  const layoutModule = layout.firstElementChild;
                  const btnCreateModule = layoutModule.querySelector("div[class='flex justify-between'] > a");
                  console.log("1. Create module: " + moduleType);
                  if (btnCreateModule) btnCreateModule.click();

                  const observer = new MutationObserver(async (mutationsList, observer) => {
                    const findForm = document.querySelector("#root-layout").firstElementChild.querySelector("form");

                    if (findForm) {
                      console.log("2. Add data");

                      const aceHtmlPc = document.getElementById('modules.0.html.PC');
                      const aceCssPc = document.getElementById('modules.0.css.PC');
                      const btnPCView = document.querySelector('div[data-name="modules.0.css.PC"]').nextElementSibling;
                      const btnSwitchSP = layout.querySelector('.form-field[data-name="modules.0.code"] button[type="button"]');

                      const aceHtmlEditorPC = aceHtmlPc.querySelector("textarea.ace_text-input");
                      const aceCssEditorPC = aceCssPc.querySelector("textarea.ace_text-input");
                      aceHtmlEditorPC.value = htmlPCContent;
                      aceHtmlEditorPC.dispatchEvent(new Event("input", { bubbles: true }));
                      aceCssEditorPC.value = cssPCContent;
                      aceCssEditorPC.dispatchEvent(new Event("input", { bubbles: true }));

                      console.log("3. Add HTML/CSS PC Done");
                      const attributeObserver = new MutationObserver(async () => {
                        if (btnPCView && btnPCView.getAttribute("data-disabled") !== "true") {
                          btnPCView.click();
                          console.log("4. Switch to SP");
                          attributeObserver.disconnect();

                          btnSwitchSP.click();
                          await waitForEl('#modules\\.0\\.html\\.SP');
                          const aceHtmlSp = document.getElementById('modules.0.html.SP');
                          const aceCssSp = document.getElementById('modules.0.css.SP');
                          const btnSPView = document.querySelector('div[data-name="modules.0.css.SP"]').nextElementSibling;
                          const btnSumit = document.querySelector('button[type="submit"]');

                          const aceHtmlEditorSP = aceHtmlSp.querySelector("textarea.ace_text-input");
                          const aceCssEditorSP = aceCssSp.querySelector("textarea.ace_text-input");
                          aceHtmlEditorSP.value = htmlSPContent;
                          aceHtmlEditorSP.dispatchEvent(new Event("input", { bubbles: true }));
                          aceCssEditorSP.value = cssSPContent;
                          aceCssEditorSP.dispatchEvent(new Event("input", { bubbles: true }));
                          console.log("6. Add HTML/CSS SP Done");
                          btnSPView.click();
                          
                          const moduleColor = document.querySelector('.form-field[data-name="modules.0.color_set_id"] div[data-slot="innerWrapper"]');
                          if (moduleColor) {
                            moduleColor.click();
                            await waitForEl('ul[data-slot="listbox"]');
                            const listBoxColor = document.querySelector('ul[data-slot="listbox"]');
                            if (listBoxColor) {
                              const firstItem = listBoxColor.querySelector('li');
                              if (firstItem) {
                                firstItem.click();
                                console.log('7. Color selected');
                              }
                            }
                          }

                          // const moduleTypeList = await waitForEl('.form-field[data-name="modules.0.module_type_id"] div[data-slot="inner-wrapper"]');
                          // if (moduleTypeList) {
                          //   moduleTypeList.click();
                          //   await waitForEl('ul[data-slot="list"]');
                          //   const listBoxModule = document.querySelector('ul[data-slot="list"]');
                          //   if (listBoxModule) {
                          //     const items = listBoxModule.querySelectorAll('li > span');
                          //     for (let item of items) {
                          //       if (item.innerText.trim() === moduleType) {
                          //         item.parentElement.click();
                          //         console.log('8. Module type selected');
                          //         btnSumit.click();
                          //         break;
                          //       }
                          //     }
                          //   }
                          // }
                          const moduleTypeList = await waitForEl('.form-field[data-name="modules.0.module_type_id"] div[data-slot="inner-wrapper"]');
                          if (moduleTypeList) {
                            moduleTypeList.click();
                            
                            const inputModuleType = await waitForEl('input[data-slot="input"]');
                            if (inputModuleType) {
                              inputModuleType.value = moduleType;
                              inputModuleType.dispatchEvent(new Event("input", { bubbles: true }));
                              
                              await waitForEl('ul[data-slot="list"]');
                              
                              const listBoxModule = document.querySelector('ul[data-slot="list"]');
                              if (listBoxModule && listBoxModule.children.length > 0) {
                                const firstItem = listBoxModule.querySelector('li > span');
                                if (firstItem) {
                                  firstItem.parentElement.click();
                                  console.log('8. Module type selected');
                                  
                                  const btnSubmit = document.querySelector('button[type="submit"]');
                                  if (btnSubmit) {
                                    btnSubmit.click();
                                    console.log('9. Form submitted');
                                  }
                                }
                              } else {
                                console.error('No items found in the module type list');
                              }
                            }
                          }
                        }
                      });
                      attributeObserver.observe(btnPCView, { attributes: true, attributeFilter: ["data-disabled"] });

                      observer.disconnect();
                    }
                  });

                  observer.observe(document.body, { childList: true, subtree: true });
                }
              }
              
            },
            args: [htmlPCContent, cssPCContent, htmlSPContent, cssSPContent, moduleType],
          });
        } else {
          
        }
      });
    });
  }
});