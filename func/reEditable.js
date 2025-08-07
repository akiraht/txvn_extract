function reverseEditableElements(inputText) {
  const editableRegex = /<editable\b([\s\S]*?)\/>/gi;

  return inputText.replace(editableRegex, (match) => {
    const wrappedHtml = `<wrapper>${match}</wrapper>`;
    const doc = new DOMParser().parseFromString(wrappedHtml, "text/html");
    const el = doc.querySelector("editable");
    if (!el) return match;

    const type = el.getAttribute("data-type");
    const sample = el.getAttribute("data-sample") || "";
    const tag = el.getAttribute("data-html-tag") || "h2";

    const attrs = [...el.attributes].reduce((acc, attr) => {
      acc[attr.name] = attr.value;
      return acc;
    }, {});

    const attrString = Object.entries(attrs)
      .filter(([key]) => {
        if (["data-sample", "data-label", "data-hint", "data-html-tag"].includes(key)) return false;
        if ((type === "headline" || type === "image" || type === "movie") && key === "data-type") return false;
        if ((type === "movie") && key === "max") return false;

        return true;
      })
      .map(([key, val]) => ` ${key}="${val}"`)
      .join("");

    const isHtmlSample = containsRealHTML(sample);
    const content = isHtmlSample ? sample : sample.replace(/\\n/g, "<br>");

    if (type === "multi-text" || type === "single-text") {
      return `<p${attrString}>${content}</p>`;
    }

    if (type === "headline") {
      return `<${tag}${attrString}>${content}</${tag}>`;
    }

    if (type === "button") {
      return `<button${attrString}>${content}</button>`;
    }

    if (type === "image") {
      return `<img${attrString}>`;
    }

    if (type === "map") {
      try {
        const decoded = decodeURIComponent(sample);
        return decoded.replace(/<iframe/i, `<iframe data-type="map" max="1000"`);
      } catch {
        return sample;
      }
    }

    if (type === "movie") {
      return `<iframe data-type="movie" max="1000" width="100%" height="100%" src="${sample}"${attrString} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>`;
    }

    return match;
  });
}

function containsRealHTML(sample) {
  const doc = new DOMParser().parseFromString(`<div>${sample}</div>`, 'text/html');
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.tagName.toLowerCase() !== 'br') {
      return true;
    }
  }
  return false;
}


document.querySelector('.toggleEditor input[type="checkbox"]').addEventListener('change', function(e) {
  if (e.target.checked) {
    const currentHtml = outputDiv.textContent;
    const reversedHtml = reverseEditableElements(currentHtml);

    outputDiv.textContent = reversedHtml;
    Prism.highlightElement(outputDiv);
  } else {
    processInputContent(); // gọi lại hàm chính để chuyển từ textarea sang editable
  }
});
