# Mock Interview Question Selector

A web application to help product management candidates practice for interviews by randomly selecting questions from an uploaded CSV dataset, with intelligent parsing and advanced filtering capabilities.

## Features

### 🎯 Smart Question Selection
- **CSV Upload**: Drag-and-drop or file picker for CSV files
- **Random Question Generation**: Get randomized questions based on your filters
- **Question Type Filtering**: Focus on Product Sense or Analytical Thinking questions

### 🏢 Company Intelligence
- **40+ Company Support**: Automatically normalizes company name variations
- **Smart Matching**: Maps variations like "Facebook", "FB", "Meta" → "Meta"
- **Autocomplete Search**: Type-ahead company selector with question counts
- **Major Tech Companies**: Google, Meta, Amazon, Microsoft, Apple, and more

### 📅 Advanced Date Filtering
- **Recent Questions**: Quick filter for questions from the last 3 months
- **Custom Date Range**: Select specific start and end dates
- **Intelligent Date Parsing**: Handles MM/DD/YYYY and other date formats

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Clean Interface**: Organized filter sections with visual feedback
- **Keyboard Navigation**: Full keyboard support for company selection
- **Real-time Updates**: Question counts update dynamically as filters change

## Usage

1. **Upload CSV**: Drag and drop your CSV file with interview questions
2. **Select Company**: Choose from the autocomplete dropdown (e.g., type "meta" for Meta/Facebook)
3. **Pick Date Range**: Use recent questions filter or select custom dates
4. **Choose Question Type**: Product Sense or Analytical Thinking
5. **Get Random Question**: Click to receive a filtered random question

## CSV Format

The app expects a CSV with these columns:
- `Timestamp` - Date when the question was recorded
- `Company` - Company name (will be normalized automatically)
- `What was the interview question?` - The actual interview question
- `Question Type (e.g. Product, Strategy)` - Category of the question

## Company Normalization

The app intelligently maps company name variations:

| Variations | Normalized To |
|------------|---------------|
| Facebook, Meta, FB, facebook, meta | Meta |
| Google, google, Google Cloud | Google |
| Amazon, AWS, amazon aws | Amazon |
| Microsoft, MICROSOFT, microsoft | Microsoft |
| DoorDash, Doordash, Door Dash | DoorDash |

...and 35+ more companies!

## Question Type Classification

**Product Sense Questions:**
- Product Design, Product Strategy, Product Sense
- Design & Strategy, Product Execution
- Any question containing "product", "design", or "strategy"

**Analytical Thinking Questions:**
- Analytics, Estimation, A/B Testing
- Data Analysis, Quantitative, Data Orientation
- Any question containing "analyt", "estimation", or "data"

## Technology

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Features**: Client-side CSV parsing, responsive design
- **Dependencies**: None - runs entirely in the browser
- **Compatibility**: Modern browsers with ES6+ support

## Getting Started

1. Clone this repository
2. Open `index.html` in your web browser
3. Upload your CSV file and start practicing!

No server setup required - everything runs client-side.

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - see LICENSE file for details.