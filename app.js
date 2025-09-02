class MockInterviewApp {
    constructor() {
        this.questions = [];
        this.filteredQuestions = [];
        this.currentQuestionType = null;
        this.selectedCompany = null;
        this.companies = new Map();
        this.highlightedIndex = -1;
        this.initializeElements();
        this.setupEventListeners();
        this.setupCompanyNormalization();
    }

    initializeElements() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.browseButton = document.getElementById('browseButton');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.fileStats = document.getElementById('fileStats');
        this.questionSection = document.getElementById('questionSection');
        
        // Company selector elements
        this.companyInput = document.getElementById('companyInput');
        this.companyDropdown = document.getElementById('companyDropdown');
        this.selectedCompanyElement = document.getElementById('selectedCompany');
        this.selectedCompanyName = document.getElementById('selectedCompanyName');
        this.selectedCompanyCount = document.getElementById('selectedCompanyCount');
        this.clearCompany = document.getElementById('clearCompany');
        
        // Date filter elements
        this.recentQuestionsOnly = document.getElementById('recentQuestionsOnly');
        this.customDateRange = document.getElementById('customDateRange');
        this.dateRange = document.getElementById('dateRange');
        this.startDate = document.getElementById('startDate');
        this.endDate = document.getElementById('endDate');
        
        // Question type elements
        this.productRadio = document.getElementById('productRadio');
        this.analyticalRadio = document.getElementById('analyticalRadio');
        this.productCount = document.getElementById('productCount');
        this.analyticalCount = document.getElementById('analyticalCount');
        
        this.randomizeButton = document.getElementById('randomizeButton');
        this.questionDisplay = document.getElementById('questionDisplay');
        this.questionText = document.getElementById('questionText');
        this.questionMeta = document.getElementById('questionMeta');
        this.errorMessage = document.getElementById('errorMessage');
    }

    setupEventListeners() {
        // File upload events
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.browseButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.fileInput.click();
        });
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Drag and drop events
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // Company selector events
        this.companyInput.addEventListener('input', (e) => this.handleCompanyInput(e));
        this.companyInput.addEventListener('keydown', (e) => this.handleCompanyKeydown(e));
        this.companyInput.addEventListener('focus', () => this.showCompanyDropdown());
        this.companyInput.addEventListener('blur', (e) => {
            setTimeout(() => this.hideCompanyDropdown(), 200);
        });
        this.clearCompany.addEventListener('click', () => this.clearCompanySelection());

        // Date filter events
        this.recentQuestionsOnly.addEventListener('change', () => this.handleRecentQuestionsToggle());
        this.customDateRange.addEventListener('click', () => this.toggleCustomDateRange());
        this.startDate.addEventListener('change', () => this.updateFilteredQuestions());
        this.endDate.addEventListener('change', () => this.updateFilteredQuestions());

        // Question type selection
        this.productRadio.addEventListener('change', () => this.handleQuestionTypeChange('product'));
        this.analyticalRadio.addEventListener('change', () => this.handleQuestionTypeChange('analytical'));

        // Randomize button
        this.randomizeButton.addEventListener('click', () => this.showRandomQuestion());

        // Click outside to close dropdown
        document.addEventListener('click', (e) => {
            if (!this.companyInput.contains(e.target) && !this.companyDropdown.contains(e.target)) {
                this.hideCompanyDropdown();
            }
        });
    }

    setupCompanyNormalization() {
        this.companyMapping = {
            'Meta': ['meta', 'facebook', 'fb', 'meta/facebook', 'facebook/meta', 'meta / facebook', 'facebook / meta', 'meta platforms', 'faceboook', 'facbook', 'facebook', 'meg'],
            'Google': ['google', 'googlw', 'google`', 'google cloud', 'google (gcp)', 'google/amazon'],
            'Amazon': ['amazon', 'amazxon', 'amzon', 'amazon aws', 'aws'],
            'Microsoft': ['microsoft', 'microsoft round 1', 'msft'],
            'DoorDash': ['doordash', 'door dash'],
            'LinkedIn': ['linkedin', 'linkedin'],
            'Apple': ['apple'],
            'Uber': ['uber', 'uner'],
            'Lyft': ['lyft'],
            'Airbnb': ['airbnb'],
            'Netflix': ['netflix'],
            'Stripe': ['stripe'],
            'Coinbase': ['coinbase'],
            'Dropbox': ['dropbox'],
            'Pinterest': ['pinterest'],
            'Shopify': ['shopify'],
            'TikTok': ['tiktok', 'tik tok'],
            'PayPal': ['paypal'],
            'Salesforce': ['salesforce'],
            'Adobe': ['adobe'],
            'Asana': ['asana'],
            'Instacart': ['instacart'],
            'Walmart': ['walmart', 'walmart e-commerce'],
            'Capital One': ['capital one', 'capitalone'],
            'Intuit': ['intuit', 'inuit'],
            'Affirm': ['affirm'],
            'Quora': ['quora'],
            'eBay': ['ebay'],
            'Zoom': ['zoom'],
            'Robinhood': ['robinhood'],
            'Square': ['square'],
            'Twilio': ['twilio'],
            'Datadog': ['datadog'],
            'Atlassian': ['atlassian'],
            'Redfin': ['redfin'],
            'Glassdoor': ['glassdoor'],
            'Tinder': ['tinder'],
            'Wayfair': ['wayfair'],
            'Yelp': ['yelp'],
            'Zillow': ['zillow'],
            'Spotify': ['spotify'],
            'Roblox': ['roblox'],
            'Disney': ['disney'],
            'Oracle': ['oracle'],
            'Cisco': ['cisco', 'cisco meraki'],
            'Databricks': ['databricks'],
            'Thumbtack': ['thumbtack']
        };
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        if (!file.name.toLowerCase().endsWith('.csv')) {
            this.showError('Please upload a CSV file.');
            return;
        }

        this.fileName.textContent = file.name;
        this.fileStats.textContent = `Size: ${(file.size / 1024).toFixed(1)} KB`;
        this.fileInfo.style.display = 'block';

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.parseCSV(e.target.result);
                this.buildCompanyList();
                this.showQuestionSection();
            } catch (error) {
                this.showError('Error parsing CSV file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n').map(line => line.trim()).filter(line => line);
        if (lines.length < 2) {
            throw new Error('CSV file must have at least a header and one data row');
        }

        // Parse header
        const header = this.parseCSVLine(lines[0]);
        const timestampCol = this.findColumn(header, ['timestamp']);
        const companyCol = this.findColumn(header, ['company']);
        const questionCol = this.findColumn(header, ['what was the interview question?', 'question', 'interview question']);
        const questionTypeCol = this.findColumn(header, ['question type (e.g. product, strategy)', 'question type', 'type']);

        if (questionCol === -1) {
            throw new Error('Could not find question column in CSV');
        }
        if (questionTypeCol === -1) {
            throw new Error('Could not find question type column in CSV');
        }

        // Parse data rows
        this.questions = [];
        for (let i = 1; i < lines.length; i++) {
            try {
                const row = this.parseCSVLine(lines[i]);
                if (row.length <= Math.max(companyCol, questionCol, questionTypeCol)) {
                    continue;
                }

                const company = companyCol >= 0 ? row[companyCol]?.trim() : '';
                const question = row[questionCol]?.trim();
                const questionType = row[questionTypeCol]?.trim();
                const timestamp = timestampCol >= 0 ? row[timestampCol]?.trim() : '';

                if (!question || !questionType) {
                    continue;
                }

                const normalizedCompany = this.normalizeCompany(company);
                const normalizedType = this.normalizeQuestionType(questionType);
                const parsedDate = this.parseDate(timestamp);

                if (normalizedType && normalizedCompany) {
                    this.questions.push({
                        company: normalizedCompany,
                        originalCompany: company,
                        question,
                        originalType: questionType,
                        normalizedType,
                        timestamp,
                        date: parsedDate
                    });
                }
            } catch (error) {
                console.warn(`Error parsing row ${i + 1}:`, error);
                continue;
            }
        }

        if (this.questions.length === 0) {
            throw new Error('No valid questions found in the CSV file');
        }
    }

    parseDate(dateStr) {
        if (!dateStr) return null;
        try {
            // Handle MM/DD/YYYY format
            if (dateStr.includes('/')) {
                const [month, day, year] = dateStr.split(' ')[0].split('/');
                return new Date(year, month - 1, day);
            }
            return new Date(dateStr);
        } catch {
            return null;
        }
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        let i = 0;

        while (i < line.length) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"';
                    i += 2;
                    continue;
                }
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
            i++;
        }

        result.push(current);
        return result;
    }

    findColumn(header, possibleNames) {
        for (let name of possibleNames) {
            const index = header.findIndex(col => 
                col.toLowerCase().trim() === name.toLowerCase()
            );
            if (index !== -1) return index;
        }
        return -1;
    }

    normalizeCompany(company) {
        if (!company) return null;
        
        const normalized = company.toLowerCase().trim();
        
        for (const [normalizedName, variants] of Object.entries(this.companyMapping)) {
            if (variants.some(variant => normalized === variant || normalized.includes(variant))) {
                return normalizedName;
            }
        }
        
        // If no exact match, return the original company name (capitalized)
        return company.trim().replace(/\b\w/g, l => l.toUpperCase());
    }

    normalizeQuestionType(type) {
        if (!type) return null;
        
        const normalized = type.toLowerCase().trim();
        
        const productSenseKeywords = [
            'product sense', 'product design', 'product strategy', 'product execution',
            'product', 'design & strategy', 'design', 'product design / strategy'
        ];
        
        const analyticalKeywords = [
            'analytics', 'analytical', 'analytical thinking', 'a/b testing',
            'estimation', 'data orientation', 'quantitative', 'data analysis'
        ];

        for (let keyword of productSenseKeywords) {
            if (normalized.includes(keyword)) {
                return 'product';
            }
        }

        for (let keyword of analyticalKeywords) {
            if (normalized.includes(keyword)) {
                return 'analytical';
            }
        }

        if (normalized.includes('analyt') || normalized.includes('estimation') || 
            normalized.includes('data') || normalized.includes('a/b')) {
            return 'analytical';
        }

        if (normalized.includes('product') || normalized.includes('design') || 
            normalized.includes('strategy')) {
            return 'product';
        }

        return null;
    }

    buildCompanyList() {
        this.companies.clear();
        this.questions.forEach(q => {
            const count = this.companies.get(q.company) || 0;
            this.companies.set(q.company, count + 1);
        });

        // Sort companies by question count (descending)
        this.companiesSorted = Array.from(this.companies.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => ({ name, count }));
    }

    handleCompanyInput(e) {
        const query = e.target.value.toLowerCase().trim();
        this.showCompanyDropdown();
        this.populateCompanyDropdown(query);
        this.highlightedIndex = -1;
    }

    handleCompanyKeydown(e) {
        const options = this.companyDropdown.querySelectorAll('.company-option');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.highlightedIndex = Math.min(this.highlightedIndex + 1, options.length - 1);
            this.updateHighlighting();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1);
            this.updateHighlighting();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.highlightedIndex >= 0 && options[this.highlightedIndex]) {
                const companyName = options[this.highlightedIndex].querySelector('.company-option-name').textContent;
                this.selectCompany(companyName);
            }
        } else if (e.key === 'Escape') {
            this.hideCompanyDropdown();
        }
    }

    updateHighlighting() {
        const options = this.companyDropdown.querySelectorAll('.company-option');
        options.forEach((option, index) => {
            option.classList.toggle('highlighted', index === this.highlightedIndex);
        });
    }

    showCompanyDropdown() {
        if (this.selectedCompany !== null) return;
        this.companyDropdown.style.display = 'block';
        this.populateCompanyDropdown(this.companyInput.value.toLowerCase().trim());
    }

    hideCompanyDropdown() {
        this.companyDropdown.style.display = 'none';
        this.highlightedIndex = -1;
    }

    populateCompanyDropdown(query) {
        const filtered = this.companiesSorted.filter(company => 
            company.name.toLowerCase().includes(query)
        );

        this.companyDropdown.innerHTML = '';
        filtered.forEach(company => {
            const option = document.createElement('div');
            option.className = 'company-option';
            option.innerHTML = `
                <span class="company-option-name">${company.name}</span>
                <span class="company-option-count">(${company.count} questions)</span>
            `;
            option.addEventListener('click', () => this.selectCompany(company.name));
            this.companyDropdown.appendChild(option);
        });
    }

    selectCompany(companyName) {
        this.selectedCompany = companyName;
        this.companyInput.style.display = 'none';
        this.selectedCompanyElement.style.display = 'flex';
        this.selectedCompanyName.textContent = companyName;
        this.selectedCompanyCount.textContent = `(${this.companies.get(companyName)} questions)`;
        this.hideCompanyDropdown();
        this.updateFilteredQuestions();
    }

    clearCompanySelection() {
        this.selectedCompany = null;
        this.companyInput.style.display = 'block';
        this.companyInput.value = '';
        this.selectedCompanyElement.style.display = 'none';
        this.updateFilteredQuestions();
    }

    handleRecentQuestionsToggle() {
        if (this.recentQuestionsOnly.checked) {
            this.customDateRange.classList.remove('active');
            this.dateRange.style.display = 'none';
            
            // Set date to 3 months ago
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            this.startDate.value = threeMonthsAgo.toISOString().split('T')[0];
            this.endDate.value = new Date().toISOString().split('T')[0];
        }
        this.updateFilteredQuestions();
    }

    toggleCustomDateRange() {
        const isActive = this.customDateRange.classList.toggle('active');
        this.dateRange.style.display = isActive ? 'flex' : 'none';
        
        if (isActive) {
            this.recentQuestionsOnly.checked = false;
        }
        
        this.updateFilteredQuestions();
    }

    updateFilteredQuestions() {
        let filtered = [...this.questions];

        // Filter by company
        if (this.selectedCompany) {
            filtered = filtered.filter(q => q.company === this.selectedCompany);
        }

        // Filter by date
        if (this.recentQuestionsOnly.checked || this.customDateRange.classList.contains('active')) {
            const startDate = new Date(this.startDate.value);
            const endDate = new Date(this.endDate.value);
            
            if (this.startDate.value && this.endDate.value) {
                filtered = filtered.filter(q => {
                    if (!q.date) return false;
                    return q.date >= startDate && q.date <= endDate;
                });
            }
        }

        // Filter by question type
        if (this.currentQuestionType) {
            filtered = filtered.filter(q => q.normalizedType === this.currentQuestionType);
        }

        this.filteredQuestions = filtered;
        this.updateQuestionCounts();
        this.randomizeButton.disabled = this.filteredQuestions.length === 0;
    }

    updateQuestionCounts() {
        let productCount = 0;
        let analyticalCount = 0;

        if (this.selectedCompany || this.recentQuestionsOnly.checked || this.customDateRange.classList.contains('active')) {
            // Use filtered questions for counts when filters are applied
            let baseFiltered = [...this.questions];

            if (this.selectedCompany) {
                baseFiltered = baseFiltered.filter(q => q.company === this.selectedCompany);
            }

            if (this.recentQuestionsOnly.checked || this.customDateRange.classList.contains('active')) {
                const startDate = new Date(this.startDate.value);
                const endDate = new Date(this.endDate.value);
                
                if (this.startDate.value && this.endDate.value) {
                    baseFiltered = baseFiltered.filter(q => {
                        if (!q.date) return false;
                        return q.date >= startDate && q.date <= endDate;
                    });
                }
            }

            productCount = baseFiltered.filter(q => q.normalizedType === 'product').length;
            analyticalCount = baseFiltered.filter(q => q.normalizedType === 'analytical').length;
        } else {
            productCount = this.questions.filter(q => q.normalizedType === 'product').length;
            analyticalCount = this.questions.filter(q => q.normalizedType === 'analytical').length;
        }

        this.productCount.textContent = `(${productCount} questions)`;
        this.analyticalCount.textContent = `(${analyticalCount} questions)`;

        this.productRadio.disabled = productCount === 0;
        this.analyticalRadio.disabled = analyticalCount === 0;
    }

    showQuestionSection() {
        this.questionSection.style.display = 'block';
        this.hideError();
        this.updateQuestionCounts();
    }

    handleQuestionTypeChange(type) {
        this.currentQuestionType = type;
        this.updateFilteredQuestions();
        this.questionDisplay.style.display = 'none';
    }

    showRandomQuestion() {
        if (this.filteredQuestions.length === 0) return;

        const randomIndex = Math.floor(Math.random() * this.filteredQuestions.length);
        const question = this.filteredQuestions[randomIndex];

        this.questionText.textContent = question.question;
        this.questionMeta.innerHTML = `
            <strong>Company:</strong> ${question.company}<br>
            <strong>Original Type:</strong> ${question.originalType}<br>
            <strong>Date:</strong> ${question.timestamp || 'N/A'}
        `;

        this.questionDisplay.style.display = 'block';
        this.questionDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
    }

    hideError() {
        this.errorMessage.style.display = 'none';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MockInterviewApp();
});