import { Element, Text } from "parser";
const enum NodeType {
  H5 = "H5",
  Text = "#text",
  Em = "EM",
  I = "I",
  BR = "BR",
  LABEL = "LABEL",
  H2 = "H2",
}
const schoolRegex = /\*\*([^*]+)\*\*/;

/**
 * this function expect this node structure
 * ```html
 * <div class="info">
    <div class="heading">Special Ability</div>
    <div class="text">
        <h5>Dual Matrix</h5>
        When attacked, increase Def by 30% for 4 seconds.
        When Justice Edge hits, increase Atk by 30% for 4 seconds.</div>
    </div>
 * ```
 * @returns return an array of tuple. the first element is the label and the second is the value
 */
export function parseHeroAbilities(infos: Element[]): Array<[string, string]> {
  const fields: Array<[string, string]> = [];
  for (const info of infos) {
    const head = info.getElementsByClassName("heading")[0];
    const text = info.getElementsByClassName("text")[0];
    let headerBuilder = "";
    let bodyBuilder = "";

    for (const node of head.childNodes) {
      switch (node.nodeName) {
        case NodeType.Text:
          headerBuilder += `${(node as Text).textContent}`;
          break;
        case NodeType.Em:
          headerBuilder += `*${(node as Element).innerText}*`;
          break;
        case NodeType.I: {
          const Iel = node as Element;
          if (Iel.classList.value.includes("fa-arrow-alt-circle-right")) {
            headerBuilder += `->`;
          }
          break;
        }
      }
    }

    for (const node of text.childNodes) {
      switch (node.nodeName) {
        case NodeType.H5: {
          bodyBuilder += `*** ${
            (node as Element).textContent.replaceAll("\n", "")
          } *** \n`;
          break;
        }
        case NodeType.H2: {
          bodyBuilder += `*** ${
            (node as Element).textContent.replaceAll("\n", "")
          } ***\n`;
          break;
        }
        case NodeType.Em: {
          bodyBuilder += `*${
            (node as Element).textContent.replaceAll("\n", "")
          }*`;
          break;
        }
        case NodeType.Text: {
          bodyBuilder += `${(node as Text).textContent.replaceAll("\n", "")} `;
          break;
        }
        case NodeType.BR: {
          bodyBuilder += "\n";
          break;
        }
      }
    }
    fields.push([headerBuilder, bodyBuilder]);
  }
  return fields;
}

/**
 * this function expect this kind of dom structure
 * ```html
     <div class="stats">
       <div>
            <label>Name:</label>
         KAI
         </div>
         <div>
             <label>School:</label>
             <em>Light</em>
         </div>
         <div>
             <em>
                 <label>Group Buff:</label>
                 Normal Atk Damage  / Skill Atk </em>
             </div>
         <div>
             <label>Introduced:</label>
             April 18th, 2023
         </div>
     </div>
 * ```

 * @returns return a list of tuple. first element is the label. and the last is the value
 */
export function parseHeroStats(stats: Element[]): Array<[string, string]> {
  const fields: Array<[string, string]> = [];
  for (const stat of stats) {
    let label = "";
    let builder = "";

    for (const node of stat.childNodes) {
      switch (node.nodeName) {
        case NodeType.Text: {
          builder += (node as Text).textContent;
          break;
        }
        case NodeType.Em: {
          if (node.childNodes.length > 1) {
            for (const emNode of node.childNodes) {
              switch (emNode.nodeName) {
                case NodeType.LABEL:
                  label = (emNode as Element).innerText;
                  break;
                case NodeType.Text:
                  builder += `  **${(emNode as Text).textContent}**  `;
                  break;
              }
            }
          } else {
            builder += `**${(node as Element).innerText}**`;
          }
          break;
        }
        case NodeType.LABEL: {
          label = (node as Element).innerText;
          break;
        }
      }
    }
    label = label === "School:" ? "Element:" : label;
    fields.push([label, builder]);
  }
  return fields;
}
