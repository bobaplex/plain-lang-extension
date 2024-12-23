document.addEventListener('DOMContentLoaded', function() {
  // Select elements
  const scoreElement = document.getElementById('score');
  const feedbackElement = document.getElementById('feedback');

  // Ensure elements exist
  if (!scoreElement || !feedbackElement) {
    console.error('Required popup elements not found');
    return;
  }

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (!tabs[0] || !tabs[0].id) {
      console.error('No active tab found');
      updatePopup("-", "Error: Unable to access the current tab");
      return;
    }

    // First, get selected text
    chrome.tabs.sendMessage(tabs[0].id, {type: 'getSelectedText'}, function(response) {
      // Log the selected text to console
      if (response && response.selectedText) {
        console.log("Selected Text:", response.selectedText);
        
        // Update popup with selected text length or preview
        document.getElementById('feedback').textContent = 
          response.selectedText.length > 50 
            ? response.selectedText.substring(0, 50) + "..." 
            : response.selectedText;

        // Attempt to analyze text
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'analyzePlainLanguage', 
          text: response.selectedText
        }, function(analysis) {
          if (chrome.runtime.lastError) {
            console.error('Analysis error:', chrome.runtime.lastError);
            updatePopup("-", "Error analyzing text");
            return;
          }

          if (analysis) {
            updatePopup(analysis.score || "-", analysis.feedback || "No detailed feedback");
          } else {
            updatePopup("-", "No analysis available");
          }
        });
      } else {
        console.log("No text selected");
        updatePopup("-", "No text selected");
      }
    });
  });

  function updatePopup(score, feedback) {
    const scoreElement = document.getElementById('score');
    const feedbackElement = document.getElementById('feedback');

    if (scoreElement) scoreElement.textContent = score + '/100';
    
    // Convert feedback to bullet points
    if (feedbackElement) {
      // Split feedback by newlines and create an unordered list
      const feedbackItems = feedback.split('\n').filter(item => item.trim() !== '');
      
      if (feedbackItems.length > 0) {
        const ul = document.createElement('ul');
        feedbackItems.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item.trim();
          ul.appendChild(li);
        });
        
        // Clear existing content and add the new list
        feedbackElement.innerHTML = '';
        feedbackElement.appendChild(ul);
      } else {
        feedbackElement.textContent = "No specific feedback available";
      }
    }
  }
});