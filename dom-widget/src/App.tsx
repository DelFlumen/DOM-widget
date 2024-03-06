import {useEffect, useState, useCallback} from 'react';
import './App.css';

type Node = { tag: string; className?: string; children: Node[] | null; } | null;

function App() {
  const [tree, setTree] = useState<Node>(null);

console.log({tree})

  useEffect(() => {
    window.parent.postMessage({type: 'getDOM'}, '*');
  
    
  }, [])
  
  const generateDOMTree = (node: HTMLElement | Element | null) => {
    if (!node) return null;
    const children: Node[] = Array.from(node.children).map((child) => generateDOMTree(child));

    return {tag: node.tagName, className: node.className, children};
  }

  const handleGetDOM = (event: MessageEvent<any>) => {

    const parser = new DOMParser();
    const doc = parser.parseFromString(event.data.parentDocument, 'text/html');
    console.log({doc})
    if (!doc.querySelector('body')?.children.length) return;

    //remove iframeElem from parent html copy
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
  };

  useEffect(() => {
    window.addEventListener('message', handleGetDOM, false);

    return () => {
      window.removeEventListener('message', handleGetDOM, false);
    }
  }, []);

console.log(tree);

  const highlightNode = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, node: Node) => {
    console.log('hover');
    e.stopPropagation();
    window.parent.postMessage({type: 'highlightNode', className: node?.className }, '*');
  }

  const renderParentDOM = (tree: Node) => { 
    if (!tree) return null;

    return (
    <ul key={`${tree.className}-ul`}>
      <li key={`${tree.className}-li`}>
        <div onClick={(e) => highlightNode(e, tree)}>{tree.tag}</div>
        {tree.children && tree.children.map((child, idx) => renderParentDOM(child))}
      </li> 
    </ul>)
   }
  
  return (
    <div className="App">
      <h1>DOM tree</h1>
      <div id="divider"></div>
      {tree && renderParentDOM(tree)}
    </div>
  );
}

export default App;
