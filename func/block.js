function getBlockComment(blockElement) {
  let sibling = blockElement.previousSibling;
  while (sibling) {
    if (sibling.nodeType === Node.COMMENT_NODE) {
      return (
        "\n<!-- " + sibling.nodeValue.trim() + " -->\n"
      );
    }
    sibling = sibling.previousSibling;
  }
  return "";
}

function getBlockHtml(element, indentation = "") {
  var htmlText = "";
  if (element) {
    htmlText += indentation + "<" + element.tagName.toLowerCase();

    for (var i = 0; i < element.attributes.length; i++) {
      var attr = element.attributes[i];
      htmlText += " " + attr.name + '="' + attr.value + '"';
    }

    htmlText += ">";

    if (element.childNodes.length > 0) {
      var childIndentation = indentation + "\t";
      var hasChildElement = false;

      for (var i = 0; i < element.childNodes.length; i++) {
        var child = element.childNodes[i];
        if (child.nodeType === 3) {
          // Node.TEXT_NODE
          var trimmedValue = child.nodeValue.trim();
          if (trimmedValue) {
            htmlText += "\n" + childIndentation + trimmedValue;
          }
        } else if (child.nodeType === 1) {
          // Node.ELEMENT_NODE
          var childHtml = getBlockHtml(child, childIndentation);
          if (childHtml) {
            htmlText += "\n" + childHtml;
            hasChildElement = true;
          }
        }
      }

      if (hasChildElement || htmlText.includes(childIndentation)) {
        htmlText += "\n" + indentation;
      }
    }

    htmlText += "</" + element.tagName.toLowerCase() + ">";
  }
  return htmlText;
}