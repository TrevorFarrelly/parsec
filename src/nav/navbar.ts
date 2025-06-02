// Renderer is a generic interface for rendering HTML elements in a document.
import "./nav.css";

const Size = "4.25rem";
const IconScale = "75%";

interface Renderer {
    render(doc: Document): HTMLDivElement;
}

class Scroll implements Renderer {
    render(doc: Document): HTMLDivElement {
        let overflow = doc.createElement('div');
        overflow.className += 'scroll';
        overflow.style.height = Size;
        return overflow;
    }
}

const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'cyan', 'lime', 'brown'];

export class NavButton implements Renderer {
    render(doc: Document): HTMLDivElement {
        let col = colors[Math.floor(Math.random() * colors.length)];
        let boundingBox = doc.createElement('div');
        boundingBox.className = 'navbutton';
        boundingBox.style.width = Size;
        boundingBox.style.height = Size;
        let icon = document.createElement('div');
        icon.className = 'navicon';
        icon.style.width = IconScale;
        icon.style.height = IconScale;
        icon.style.backgroundColor = col;
        boundingBox.appendChild(icon);
        return boundingBox;
    }
}

// NavBar implements the renderer for the server navigation bar at the top of the window.
export class NavBar implements Renderer {
    children: Renderer[] = [];

    constructor(...args: Renderer[]) {
        this.children = args;
    }
    addChild(child: Renderer): void {
        this.children.push(child);
    }
    render(doc: Document): HTMLDivElement {
        let navBar = doc.createElement('div');
        navBar.className += 'navbar';
        for (let child of this.children) {
            let childElement = child.render(doc);
            if (childElement) {
                navBar.appendChild(childElement);
            }
        }
        // nest the NavBar inside a scrollable container.
        let overflow = new Scroll().render(doc);
        overflow.appendChild(navBar);
        navBar.style.paddingBottom = navBar.offsetHeight - navBar.clientHeight + "px"
        return overflow;
        // let grid = new Grid().render(doc);
        // grid.appendChild(overflow);
        // return grid
    }
}