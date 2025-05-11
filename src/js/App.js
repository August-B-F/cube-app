const { useState, useEffect, useRef } = React;
const { BrowserRouter, Route, Switch } = ReactRouterDOM;

function App() {
  const [showTutorial, setShowTutorial] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [grid, setGrid] = useState(Array(5).fill().map(() => [0, 0, 0, 0, 0]));
  const [filePath, setFilePath] = useState(null);
  const [contentFolder, setContentFolder] = useState('/home/user/');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [clickedHistory, setClickedHistory] = useState(Array(5).fill(null));
  const [fileContent, setFileContent] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [autoScan, setAutoScan] = useState(false);
  const [popups, setPopups] = useState([]);
  const [isClosing, setIsClosing] = useState(false);
  const [currentPDF, setCurrentPDF] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationContent, setExplanationContent] = useState('');
  const catagories = ['ACTIONS', 'DREAMS', 'SONGS', 'EMOTIONS', 'WALKS', 'HEARTBEAT', 'PAINTINGS', 'FABLES', 'THOUGHTS', 'PEOPLE', 'TRASH', 'NEWS', 'PLACES', 'IDEAS', 'POLLUTION', 'WEATHER', 'CLOUDS', 'WIND', 'ACCOUNTS', 'INSIGHTS', 'ESSAYS', 'TOOLS', 'MANUAL', 'JOURNAL', 'PHOTOS', 'ORIGINS', 'FRIENDS', 'FILMS', 'THEATER', 'LECTURES', 'ARCHIVE', 'EDITIONS', 'WEBSITE', 'MATRICES', 'TEXTURES', 'EXHIBITS'];

  // Modify your closeAllSettings function
  const closeAllSettings = (hideSettings = false) => {
    if (openOptions) {
      setIsClosing(true);
      setTimeout(() => {
        setOpenOptions(false);
        setIsClosing(false);
      }, 300); // This should match the animation duration
    }
    setShowSettings(false);
    setShowHistory(false);
    if (hideSettings === true) {
      setOpenOptions(false);
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setCurrentPDF(null);
    setFileContent(null);
    setIsLoading(false); // Reset loading state
  };

  const fetchExplanation = async (projectCode) => {
    try {
      const explanation = await window.electronAPI.loadExplanation(projectCode, language === 'it');
      return explanation;
    } catch (error) {
      console.error('Error fetching explanation:', error);
      return null;
    }
  };
  

  useEffect(() => {
    if (filePath) {
      setShowResults(true);
      setIsLoading(true); // Start loading
      window.electronAPI.loadFileContent(filePath).then((content) => {
        setFileContent(content);
        setCurrentPDF(content.path);
        setIsLoading(false); // End loading
      });
      setFilePath(null);
      setGrid(Array(5).fill().map(() => [0, 0, 0, 0, 0]));
    }
  }, [filePath]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    document.body.style.fontSize = `${fontSize}px`;
  }, [darkMode, fontSize]);

  const handleClick = (row, col) => {
    const newGrid = [...grid];
    const activeIndices = newGrid[row].reduce((acc, cell, index) => cell === 1 ? [...acc, index] : acc, []);

    // Keep track of the last clicked square in each row
    const lastClickedRow = clickedHistory[row];

    if (newGrid[row][col] === 1) {
      // If the user clicks on an already active square, deactivate it
      newGrid[row][col] = 0;
      setClickedHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory[row] = null;
        return newHistory;
      });
    } else {
      if (activeIndices.length < 2) {
        // If there are less than two active squares, activate the new one
        newGrid[row][col] = 1;
        setClickedHistory((prevHistory) => {
          const newHistory = [...prevHistory];
          newHistory[row] = col;
          return newHistory;
        });
      } else {
        // If there are already two active squares, find the one that wasn't clicked last and deactivate it
        const indexToDeactivate = activeIndices.find(index => index !== lastClickedRow);
        newGrid[row][indexToDeactivate] = 0;
        newGrid[row][col] = 1;
        setClickedHistory((prevHistory) => {
          const newHistory = [...prevHistory];
          newHistory[row] = col;
          return newHistory;
        });
      }
    }

    setGrid(newGrid);
  };

  const scanCode = async () => {
    const codeToDigit = {
      '11000': '0', '10100': '1', '10010': '2', '10001': '3', '01100': '4',
      '01010': '5', '01001': '6', '00110': '7', '00101': '8', '00011': '9'
    };

    const decoded = grid.map(row => {
      const code = row.join('');
      return codeToDigit[code] || 'X';
    }).join('');

    setResult(decoded);

    try {
      const result = await window.electronAPI.searchFile(decoded, contentFolder);
      if (result.exists) {
        setFilePath(result.path);
        const newHistoryItem = {
          code: decoded,
          timestamp: new Date().toISOString(),
          result: result.exists ? 'Found' : 'Not Found'
        };
        // if is not already in history add it, else remove the old one and add the new one
        if (!history.some(item => item.code === decoded)) {
          setHistory(prevHistory => [newHistoryItem, ...prevHistory]);
          console.log(history);
        } else {
          setHistory(prevHistory => prevHistory.filter(item => item.code !== decoded));
          setHistory(prevHistory => [newHistoryItem, ...prevHistory]);
        }
      } else {
        const id = Date.now();
        setPopups(prevPopups => [...prevPopups, { id, message: 'Project does not exist', type: 'error' }]);
        setTimeout(() => {
          setPopups(prevPopups => prevPopups.filter(popup => popup.id !== id));
        }, 2500);
      }
    } catch (error) {
      const id = Date.now();
      setPopups(prevPopups => [...prevPopups, { id, message: error.message, type: 'error' }]);
      setTimeout(() => {
        setPopups(prevPopups => prevPopups.filter(popup => popup.id !== id));
      }, 2500);
    }
  };

  const renderFileViewer = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loading-wheel"></div>
        </div>
      );
    }
  
    if (!fileContent) return <div>No content to display</div>;

    switch (fileContent.type) {
      case '.mp3':
        return (
          <div className="file-viewer audio-viewer">
            <audio controls src={fileContent.path} autoPlay>
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      case '.mp4':
        return (
          <div className="file-viewer video-viewer">
            <video controls width="100%" autoPlay disablePictureInPicture>
              <source src={fileContent.path} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case '.txt':
        return (
          <div className="file-viewer text-viewer">
            <pre>{fileContent.content}</pre>
          </div>
        );
        case '.html':
            return (
            <div className="html-viewer">
              <iframe
              srcDoc={fileContent.content}
              title="HTML Content"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              sandbox=""
              />
            </div>
            );
      case '.pdf':
        return <PDFViewer key={currentPDF} filePath={currentPDF} />;
      case '.jpg':
      case '.png':
        return (
          <div className="file-viewer image-viewer">
            <img src={fileContent.path} alt="File preview" />
          </div>
        );
      default:
        return <div>Unsupported file type</div>;
    }
  };

  const ExplanationButton = ({ projectCode }) => {
    // get what category the project belongs to by using the first two characters of the project code
    const category = catagories[(parseInt(projectCode.slice(0, 2), 10) % catagories 
    .length)-1];
  
    const handleExplanationClick = async () => {
      const content = await fetchExplanation(projectCode);
      if (content) {
        setExplanationContent(content);
        setShowExplanation(true);
      } else {
        // Show an error popup if explanation couldn't be fetched
        const id = Date.now();
        setPopups(prevPopups => [...prevPopups, { id, message: 'Failed to load explanation', type: 'error' }]);
        setTimeout(() => {
          setPopups(prevPopups => prevPopups.filter(popup => popup.id !== id));
        }, 2500);
      }
    };
  
    return (
      <div>
        <button onClick={handleExplanationClick} className="info-button">
          <img src="assets/icons/info.svg" />
        </button>
        {showExplanation && (
          <div className="explanation-popup">
            <div className="explanation-content">
              <h2>{category}: {projectCode}</h2>
              <p>{explanationContent}</p>
              <button onClick={() => setShowExplanation(false)}>{t.close}</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const openHistoryProject = async (projectCode) => {
    console.log(projectCode);
    try {
      const result = await window.electronAPI.searchFile(projectCode, contentFolder);
      if (result.exists) {
        setFilePath(result.path);
      } else {
        const id = Date.now();
        setPopups(prevPopups => [...prevPopups, { id, message: 'Project does not exist', type: 'error' }]);
        setTimeout(() => {
          setPopups(prevPopups => prevPopups.filter(popup => popup.id !== id));
        }, 2500);
      }
    } catch (error) {
      const id = Date.now();
      setPopups(prevPopups => [...prevPopups, { id, message: error.message, type: 'error' }]);
      setTimeout(() => {
        setPopups(prevPopups => prevPopups.filter(popup => popup.id !== id));
      }, 2500);
    }

    setShowHistory(false);
  };

  const translations = {
    en: {
      settings: "Settings",
      history: "History",
      historyEmpty: "History empty",
      help: "Help",
      language: "Language",
      darkMode: "Dark Mode",
      fontSize: "Font Size",
      autoScan: "Auto Scan",
      scan: "SCAN",
      welcome: "Welcome to the tutorial!",
      tutorial: "This is a simple tutorial to help you get started with the app. It shows how to use the app.",
      skip: "Skip tutorial",
      next: "Next",
      close: "Close",
    },
    it: {
      settings: "Impostazioni",
      history: "Cronologia",
      historyEmpty: "Cronologia vuota",
      help: "Aiuto",
      language: "Lingua",
      darkMode: "Modalità Scura",
      fontSize: "Dimensione Carattere",
      autoScan: "Scansione Automatica",
      scan: "SCANSIONA",
      welcome: "Benvenuto nel tutorial!",
      tutorial: "Questo è un semplice tutorial per aiutarti a iniziare con l'app. Mostra come usare l'app.",
      skip: "Salta tutorial",
      next: "Avanti",
      close: "Chiudi",
    },
  };

  const t = translations[language];

  const handleShowHistory = () => {
    closeAllSettings();
    setShowHistory(true);
  };

  const handleShowSettings = () => {
    closeAllSettings();
    setShowSettings(true);
  };

  const handleShowHelp = () => {
    closeAllSettings(true);
    setShowTutorial(true);
  };

  return (
    <BrowserRouter>
      {popups.map(popup => (
        <Popup
          key={popup.id}
          message={popup.message}
          type={popup.type}
          onClose={() => removePopup(popup.id)}
        />
      ))}
      {showTutorial && (
        <div className="tutorial-container">
          <div className="tutorial-content">
            <h2>{t.welcome}</h2>
            <p>{t.tutorial}</p>
            <div className="tutorial-actions">
              <button onClick={handleSkipTutorial}>{t.skip}</button>
              <button onClick={handleSkipTutorial}>{t.next}</button>
            </div>
          </div>
        </div>
      )}
      {showResults && (
        <div className="results-container">
          <button onClick={handleCloseResults} className="back-button">
            <img src="assets/icons/back.svg" alt="Back" />
          </button>
          <ExplanationButton projectCode={result} />
          {renderFileViewer()}
        </div>
      )}
      {!showResults && (
        <div className="grid-component">
          {openOptions && (
            <div className={`options-popup-container ${isClosing ? 'closing' : ''}`}>
              <div className="options-container" onClick={() => closeAllSettings(true)}></div>
              <div className={`options-popup ${isClosing ? 'closing' : ''}`}>
                <button className="popup-option" onClick={handleShowHistory}>
                  <img src="assets/icons/history.svg" alt="History" />
                  <span>{t.history}</span>
                </button>
                {/* <button className="popup-option" onClick={handleShowSettings}>
                    <img src="assets/icons/settings.png" alt="Settings" />
                    <span>{t.settings}</span>
                  </button> */}
                <button className="popup-option" onClick={handleShowHelp}>
                  <img src="assets/icons/help.svg" alt="Help" />
                  <span>{t.help}</span>
                </button>
                <button className="popup-option" onClick={() => changeLanguage(language === 'en' ? 'it' : 'en')}>
                  <img src="assets/icons/language.svg" alt="Language" />
                  <span>{t.language}</span>
                </button>
              </div>
            </div>
          )}
          <button onClick={() => setOpenOptions(true)} className="options-button">
            <img src="assets/icons/menu.svg" alt="Menu" />
          </button>
          <div className="grid-container">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`grid-cell ${cell ? 'active' : 'inactive'}`}
                  onClick={() => handleClick(rowIndex, colIndex)}
                />
              ))
            )}
          </div>
          <button className="scan-button" onClick={scanCode}>{t.scan}</button>
        </div>
      )}
      {showSettings && (
        <div className="settings-popup">
          <h2>{t.settings}</h2>
          <div className="setting-option">
            <span>{t.darkMode}</span>
            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          </div>
          <button onClick={() => setShowSettings(false)}>{t.close}</button>
        </div>
      )}
      {showHistory && (
        <div>
          <div className="options-container" onClick={() => closeAllSettings(true)}></div>
        
        <div className="history-popup">
          <h2>{t.history}</h2>
          <ul>
            {history.map((item, index) => (
              <li key={index} onClick={() => openHistoryProject(item.code)}>
                <span className="history-code">{item.code}</span>
                <span className="history-timestamp">{new Date(item.timestamp).toLocaleTimeString()}</span>
              </li>
            ))}
          </ul>
          {history.length == 0 && (
            <p>
              {t.historyEmpty}
            </p>
          )}
          <button onClick={() => setShowHistory(false)}>{t.close}</button>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

const PDFViewer = ({ filePath }) => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const pdfContainerRef = useRef(null);
  const lastTouchDistance = useRef(null);
  const lastPanPosition = useRef(null);

  useEffect(() => {
    const loadPDF = async () => {
      const loadingTask = pdfjsLib.getDocument(filePath);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      renderPage(pdf, 1);
    };

    loadPDF();
  }, [filePath]);

  useEffect(() => {
    const pdfContainer = document.querySelector('.pdf-container');
    if (pdfContainer && pdfContainer.children.length > 1) {
      pdfContainer.removeChild(pdfContainer.children[0]);
    }
  }, [currentPage]);

  useEffect(() => {
    const updateContainerSize = () => {
      if (pdfContainerRef.current) {
        setContainerSize({
          width: pdfContainerRef.current.offsetWidth,
          height: pdfContainerRef.current.offsetHeight,
        });
      }
    };

    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);

    return () => {
      window.removeEventListener('resize', updateContainerSize);
    };
  }, []);

  const renderPage = async (doc, pageNum) => {
    if (!doc) return;

    pdfContainerRef.current.innerHTML = '';

    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1 });
    const pdfWidth = viewport.width;
    const pdfHeight = viewport.height;

    const container = pdfContainerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    let scale = Math.min(containerWidth / pdfWidth, containerHeight / pdfHeight);

    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');

    const pixelRatio = window.devicePixelRatio || 1;
    const scaleFactor = 3;
    canvas.height = pdfHeight * scale * pixelRatio * scaleFactor;
    canvas.width = pdfWidth * scale * pixelRatio * scaleFactor;
    canvas.style.height = `${pdfHeight * scale}px`;
    canvas.style.width = `${pdfWidth * scale}px`;
    canvas.className = 'pdf-page';

    pdfContainerRef.current.appendChild(canvas);

    const renderContext = {
      canvasContext,
      viewport: page.getViewport({ scale: scale * pixelRatio * scaleFactor }),
    };
    await page.render(renderContext);
  };

  const clampPanOffset = (offset, scale) => {
    const maxPanX = Math.max(0, (containerSize.width * scale - containerSize.width) / 2);
    const maxPanY = Math.max(0, (containerSize.height * scale - containerSize.height) / 2);

    return {
      x: Math.max(Math.min(offset.x, maxPanX), -maxPanX),
      y: Math.max(Math.min(offset.y, maxPanY), -maxPanY),
    };
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const zoomFactor = 1.1; // Adjust this value to change zoom speed
        const newScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
        setScale(Math.min(Math.max(0.5, newScale), 10));
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        lastTouchDistance.current = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
      } else if (e.touches.length === 1) {
        setIsPanning(true);
        lastPanPosition.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
      
        if (lastTouchDistance.current !== null) {
          const zoomFactor = currentDistance / lastTouchDistance.current;
          const newScale = scale * zoomFactor;
          setScale(Math.min(Math.max(0.5, newScale), 10));
        }
      
        lastTouchDistance.current = currentDistance;
      } else if (e.touches.length === 1 && isPanning) {
        e.preventDefault();
        const currentPosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };

        const deltaX = currentPosition.x - lastPanPosition.current.x;
        const deltaY = currentPosition.y - lastPanPosition.current.y;

        setPanOffset((prevOffset) => {
          const newOffset = {
            x: prevOffset.x + deltaX,
            y: prevOffset.y + deltaY,
          };
          return clampPanOffset(newOffset, scale);
        });

        lastPanPosition.current = currentPosition;
      }
    };

    const handleTouchEnd = () => {
      lastTouchDistance.current = null;
      setIsPanning(false);
    };

    const container = pdfContainerRef.current;
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scale, isPanning, containerSize]);

  useEffect(() => {
    const pages = pdfContainerRef.current.querySelectorAll('.pdf-page');
    pages.forEach((page) => {
      page.style.transform = `scale(${scale})`;
    });

    setPanOffset((prevOffset) => clampPanOffset(prevOffset, scale));
  }, [scale, containerSize]);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      renderPage(pdfDoc, currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (pdfDoc && currentPage < pdfDoc.numPages) {
      setCurrentPage(currentPage + 1);
      renderPage(pdfDoc, currentPage + 1);
    }
  };

  return (
    <div className="pdf-viewer">
      <div
        ref={pdfContainerRef}
        className="pdf-container"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
        }}
      ></div>
      <div className="pdf-navigation">
        {currentPage > 1 && (
          <button onClick={goToPreviousPage} className="nav-button prev">
            <img src="assets/icons/chevron_left.svg" alt="Previous" />
          </button>
        )}
        {pdfDoc && currentPage < pdfDoc.numPages && (
          <button onClick={goToNextPage} className="nav-button next">
            <img src="assets/icons/chevron_right.svg" alt="Next" />
          </button>
        )}
      </div>
    </div>
  );
};

  const Popup = ({ message, type, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsClosing(true);
      }, 1800);

      return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      if (isClosing) {
        const closeTimer = setTimeout(() => {
          onClose();
        }, 300); // Match this with the animation duration

        return () => clearTimeout(closeTimer);
      }
    }, [isClosing, onClose]);

    return (
      <div className={`popup ${type} ${isClosing ? 'closing' : ''}`}>
        <div className="popup-icon">
          {type === 'error' && <img src="assets/icons/error.svg" alt="Error" />}
          {type === 'success' && <img src="assets/icons/success.svg" alt="Success" />}
        </div>
        <div className="popup-content">
          <h2>{type === 'error' ? 'Error' : 'Success'}</h2>
          <p>{message}</p>
        </div>
      </div>
    );
  }