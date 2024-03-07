import {useCallback, useEffect, useState} from 'react';
import './App.css';

type Node = { tag: string; className?: string; children: Node[] | null; } | null;

function App() {
  const [tree, setTree] = useState<Node>(null);
  const [isTreeDisplayed, setIsTreeDisplayed] = useState(false);
  const [isWidgetDisplayed, setIsWidgetDisplayed] = useState(true);
  
  const generateDOMTree = useCallback((node: HTMLElement | Element | null) => {
    if (!node) return null;
    const children: Node[] = Array.from(node.children).map((child) => generateDOMTree(child));

    return {tag: node.tagName, className: node.className, children};
  }, []);

  const handleGetDOM = useCallback((event: MessageEvent<any>) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(event.data.parentDocument, 'text/html');
    if (!doc.querySelector('body')?.children.length) return;

    //remove frame and script from parent html copy
    const iframeElem = doc.querySelector('iframe');
    if (iframeElem) {
      iframeElem.parentNode?.removeChild(iframeElem);
    }
    const scriptElem = doc.querySelector('script');
    if (scriptElem) {
      scriptElem.parentNode?.removeChild(scriptElem);
    }

    const generatedTree = generateDOMTree(doc.querySelector('body'));

    setTree(generatedTree);    
  }, [generateDOMTree]);

  useEffect(() => {
    window.addEventListener('message', handleGetDOM, false);

    return () => {
      window.removeEventListener('message', handleGetDOM, false);
    }
  }, [handleGetDOM]);

  const highlightNode = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, node: Node) => {
    window.parent.postMessage({type: 'highlightNode', className: node?.className }, '*');
  }

  const hideShowWidget = () => { 
    window.parent.postMessage({type: `${isWidgetDisplayed ? 'hideWidget' : 'showWidget'}`}, '*');
    setIsWidgetDisplayed(!isWidgetDisplayed);
  }

  const renderParentDOMTree = (tree: Node) => { 
    if (!tree) return null;

    return (
      <ul key={`${tree.className}-ul`}>
        <li key={`${tree.className}-li`}>
          <div onClick={(e) => highlightNode(e, tree)}>{tree.tag}</div>
          {tree.children && tree.children.map((child) => renderParentDOMTree(child))}
        </li> 
      </ul>)
   }
  
  return (
    <div className="App">
      <button title={(isWidgetDisplayed ? 'hide' : 'show') + ' widget'} 
              onClick={hideShowWidget} 
              className='showHideBtn'>{(isWidgetDisplayed ? '–' : '+')}
      </button>
      <h1>DOM Tree Widget</h1>
      <div className="divider"></div>
      {tree && isTreeDisplayed 
      ? renderParentDOMTree(tree) 
      : <div className='showDomTreeWrapper'>
          <button onClick={() => setIsTreeDisplayed(true)}>Show DOM Tree</button>
        </div>}
    </div>
  );
}

export default App;
