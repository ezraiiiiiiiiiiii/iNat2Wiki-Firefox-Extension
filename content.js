(function() {
    'use strict';
    
    function getObservationId() {
        const path = window.location.pathname;
        const match = path.match(/\/observations\/(\d+)/);
        return match ? match[1] : null;
    }
    
    function hasCompatibleLicense() {
        const attribution = document.querySelector('.ObservationAttribution');
        if (!attribution) {
            return null;
        }
        
        const licenseLink = attribution.querySelector('a[href*="creativecommons.org"]');
        if (!licenseLink) {
            return false;
        }
        
        const href = licenseLink.getAttribute('href');
        
        const compatibleLicenses = [
            'https://creativecommons.org/publicdomain/cc0/',
            'https://creativecommons.org/licenses/by/',
            'https://creativecommons.org/licenses/by-sa/'
        ];
        
        return compatibleLicenses.some(license => href.startsWith(license));
    }
    
    function addToolforgeButton() {
        const observationId = getObservationId();
        if (!observationId) return;
        
        if (document.getElementById('toolforge-button-container')) return;
        
        const licenseCheck = hasCompatibleLicense();
        if (licenseCheck === null) return;
        if (!licenseCheck) return;
        
        const mapDiv = document.querySelector('.Map');
        if (!mapDiv) return;
        
        const container = document.createElement('div');
        container.id = 'toolforge-button-container';
        container.style.cssText = `
            margin: 10px 0;
            padding: 0 15px;
        `;
        
        const button = document.createElement('button');
        button.id = 'toolforge-button';
        button.innerHTML = '📸 Open in iNat2Wiki';
        button.className = 'btn btn-default';
        button.style.cssText = `
            width: 100%;
            background: #74ac00;
            color: white;
            border: 1px solid #5a8000;
            padding: 8px 12px;
            font-size: 14px;
            font-weight: bold;
            transition: background 0.2s;
        `;
        
        button.addEventListener('mouseover', () => {
            button.style.background = '#5a8000';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.background = '#74ac00';
        });
        
        button.addEventListener('click', function() {
            const toolforgeUrl = `https://inat2wiki-dev.toolforge.org/parse/${observationId}`;
            window.open(toolforgeUrl, '_blank');
        });
        
        container.appendChild(button);
        mapDiv.parentNode.insertBefore(container, mapDiv.nextSibling);
    }
    
    function tryAddButton(attempts = 0) {
        const maxAttempts = 20;
        
        if (attempts >= maxAttempts) return;
        
        const mapDiv = document.querySelector('.Map');
        const attribution = document.querySelector('.ObservationAttribution');
        
        if (mapDiv && attribution) {
            addToolforgeButton();
        } else {
            setTimeout(() => tryAddButton(attempts + 1), 300);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => tryAddButton());
    } else {
        tryAddButton();
    }
    
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            const existingContainer = document.getElementById('toolforge-button-container');
            if (existingContainer) {
                existingContainer.remove();
            }
            setTimeout(() => tryAddButton(), 500);
        }
    });
    
    observer.observe(document, { 
        subtree: true, 
        childList: true 
    });
})();
