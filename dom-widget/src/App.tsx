import {useEffect, useState, useCallback} from 'react';
import './App.css';

type Node = { tag: string; attributes: NamedNodeMap; children: Node[] | null; } | null;

function App() {
  const [tree, setTree] = useState<Node>(null);
  window.parent.postMessage({message: 'Hello world'}, "*");

  const handleGetDOM = useCallback((event: MessageEvent<any>) => {
    const generateDOMTree = (node: HTMLElement | Element | null) => {
      if (!node) return null;
      const children: Node[] = Array.from(node.children).map((child) => generateDOMTree(child));

      return {tag: node.tagName, attributes: node.attributes, children};
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(event.data.parentDocument, 'text/html');
    console.log({doc})

    //remove iframeElem from parent html copy
    const iframeElem = doc.querySelector('iframe');
    if (iframeElem) {
      iframeElem.parentNode?.removeChild(iframeElem);
    }

    const generatedTree = generateDOMTree(doc.querySelector('body'));

    setTree(generatedTree);    
  }, []);

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

  const highlightNode = (node: Node) => {
    window.parent.postMessage({type: 'highlightNode', tagName: node?.tag, attributes: node?.attributes}, '*');
  }

  const renderParentDOM = (tree: Node) => { 
    if (!tree) return null;

    return (
    <ul>
      <li key={tree.tag} onMouseEnter={() => highlightNode(tree)}>
        {tree.tag}
        {tree.children && tree.children.map(child => renderParentDOM(child))}
      </li> 
    </ul>)
   }
  
  return (
    <div className="App">
      <h1>DOM tree widget</h1>
      {tree && renderParentDOM(tree)}
    </div>
  );
}

export default App;
