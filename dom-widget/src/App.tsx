import {useEffect, useState, useCallback} from 'react';
import './App.css';

type Node = { tag: string; id?: string; className?: string; children: Node[] | null; } | null;

function App() {
  const [tree, setTree] = useState<Node>(null);

console.log({tree})

  useEffect(() => {
    window.parent.postMessage({type: 'getDOM'}, '*');
  
    
  }, [])
  
  const generateDOMTree = (node: HTMLElement | Element | null) => {
    if (!node) return null;
    const children: Node[] = Array.from(node.children).map((child) => generateDOMTree(child));

    // @ts-expect-error
    const id = node?.attributes && node.attributes.id ? node.attributes.value : null;
    // @ts-expect-error
    const className = node?.attributes && node.attributes.class ? node.attributes.class.value : null;

    return {tag: node.tagName, id, className, children};
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

  // window.addEventListener('message', function(event) {
  //   // if(event.origin === 'http://localhost/3000')
  //   // {
  //     // alert('Received message: ' + event.data.message);
  //     console.log(event.data);
  //   // }
  //   // else
  //   // {
  //   //   alert('Origin not allowed!');
  //   // }
  // }, false);

  const highlightNode = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, node: Node) => {
    console.log('hover');
    e.stopPropagation();
    window.parent.postMessage({type: 'highlightNode', tag: node?.tag, id: node?.id, className: node?.className }, '*');
  }

  const undoHighlightNode = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, node: Node) => {
    console.log('hover');
    e.stopPropagation();
  

    window.parent.postMessage({type: 'undoHighlightNode', tag: node?.tag, id: node?.id, className: node?.className }, '*');
  }

  const renderParentDOM = (tree: Node, level = 0, idx?: number) => { 
    if (!tree) return null;

    return (
    <ul key={`${tree.tag}-${tree.id}-${tree.className}-${level}-${idx}-ul`}>
      <li key={`${tree.tag}-${tree.id}-${tree.className}-${level}-${idx}-li`}>
        <div onMouseEnter={(e) => highlightNode(e, tree)} onMouseLeave={(e) => undoHighlightNode(e, tree)}>{tree.tag}</div>
        {tree.children && tree.children.map((child, idx) => renderParentDOM(child, level + 1, idx))}
      </li> 
    </ul>)
   }
  
  return (
    <div className="App">
      <h1>DOM tree</h1>
      {tree && renderParentDOM(tree)}
    </div>
  );
}

export default App;
