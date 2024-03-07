# DOM tree navigation widget

Steps to embed the widget:

1. In your target site: put <script> tag in html with the code from parentScript.js (dom-widget/parentScript.js in the current repository)
2. In your target site: put next element as a **first child** of the body element:
    <iframe
          id="frame"
          src="https://dom-widget.onrender.com/"
          style="border-radius: 5px; transition: height .5s ease-in-out; border: none; z-index: 3; box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px; background-color: #2d3c5e; height: 80vh; width: 30vw; position: fixed; display: inline-block; right: 0;"
          width="100%"
          frameborder="0" 
          scrolling="no" 
        >
    </iframe>
3. Launch the target site in a browser of your choice
4. Enjoy navigating DOM tree!
