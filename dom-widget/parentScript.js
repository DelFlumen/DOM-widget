//add highlighted-dom-element class to style tag
const style = document.createElement('style');
style.innerText = '.highlighted-dom-element { background-color: lavender !important; } .collapsedFrame { height: 12vh !important; border-radius: 5px !important}';
document.head.appendChild(style);

const iframe = document.getElementById('frame');

window.addEventListener('DOMContentLoaded', function() {
    //make each element identifiable for DOM widget: attach id to each element (using class attribute in order to not overwrite existing id attribute)
    document.querySelectorAll('*').forEach((elem, idx) => {
        elem.classList.add(`widgetId-${idx}`);
    })

    const frame = window.document.getElementById('frame').contentWindow;

    document.onreadystatechange = () => {
        if (document.readyState === 'complete' && document.querySelector('body').innerText) {
            frame.postMessage({parentDocument: JSON.parse(JSON.stringify(window.document.documentElement.outerHTML))}, '*');
        }
    }
}, false);

window.addEventListener('message', function(event) {
    if (event.data.type === 'showTree') {
        iframe.setAttribute('scrolling', 'auto');
    }

    //handle widget hiding
    else if (event.data.type === 'hideWidget' || event.data.type === 'showWidget') {
        if (iframe && event.data.type === 'hideWidget') {
            iframe.classList.add('collapsedFrame');
        }
        else {
            iframe.classList.remove('collapsedFrame');
        }
    }

    //handle element highlighting
    else if (event.data.type === 'highlightNode') {
        //remove previous highlighting
        const prevElem = document.querySelector('.highlighted-dom-element'); 

        if (prevElem) {         
            prevElem?.classList.remove('highlighted-dom-element');
        }
        // find and highlight newly selected node in the parent window
        const { className } = event.data;          
        const selectedNode = document.querySelector(`.${className.split(' ').join('.')}`); 

        if (selectedNode) {
            selectedNode.classList.add('highlighted-dom-element');
            selectedNode.scrollIntoView({ behavior: 'smooth' });
        } 
    }
}, false);