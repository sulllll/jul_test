(function() {
    function isMobileDevice() {
        return /Mobi/i.test(navigator.userAgent) || /Android/i.test(navigator.userAgent) || /iPhone/i.test(navigator.userAgent);
    }

    function loadCSS(filename) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        // link.href = filename; // Path will be relative to where index.html is, or needs to be adjusted
        // Adjust path for files in subdirectories like pages/
        // This simple path assumes main_loader.js is referenced from index.html in root
        // and css files are in css/ folder also from root.
        // For pages in pages/ folder, this path needs to be ../css/filename
        // A more robust solution might involve passing a base path or checking current page depth.
        // For now, we'll assume this script is loaded from index.html in the root.
        // We will address path correction for pages/ later if needed, or adjust HTML script tags there.
        
        // Determine base path for CSS files.
        // If this script (main_loader.js) is in js/ and index.html is in root,
        // then css files are in css/ relative to root.
        // For pages in pages/, the path to css/ would be ../css/
        // We need to ensure the path is correct from where the HTML file is located.
        var currentPath = window.location.pathname;
        var cssBasePath = 'css/'; // Default for root index.html
        if (currentPath.includes('/pages/')) {
            cssBasePath = '../css/';
        }
        link.href = cssBasePath + filename;

        document.getElementsByTagName('head')[0].appendChild(link);
    }

    if (isMobileDevice()) {
        console.log("Mobile device detected. Loading mobile.css");
        loadCSS('mobile.css');
        document.documentElement.classList.add('mobile-device'); // Optional
    } else {
        console.log("Desktop device detected. Loading desktop.css");
        loadCSS('desktop.css');
        document.documentElement.classList.add('desktop-device'); // Optional
    }
})();
