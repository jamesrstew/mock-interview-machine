# Product Requirements Document: Mock Interview Question Selector

## Overview
A simple web application to help product management candidates practice for interviews by randomly selecting questions from an uploaded CSV dataset, with intelligent parsing and categorization.

## Problem Statement
Product management interview candidates need a way to practice with randomized questions specific to their target company and question type, but existing question banks lack intelligent categorization and randomization features.

## Solution
A web application that allows users to upload a CSV of interview questions and randomly select questions filtered by company (Meta) and question type (Product Sense or Analytical Thinking).

## Key Features

### 1. CSV Upload & Processing
- **File Upload**: Users can upload CSV files containing interview questions
- **Expected Columns**: 
  - `Timestamp` - Date/time of question entry
  - `Company` - Company name (target: Meta/Facebook variants)
  - `What was the interview question?` - The actual interview question text
  - `Question Type (e.g. Product, Strategy)` - Category of question
  - Additional columns: `Interview Type`, `Comments`, `What was the job title for this question?`
- **Intelligent Parsing**: Smart normalization of similar company and question type values

### 2. Company Normalization
Meta company variations to be recognized as equivalent:
- Facebook
- Meta
- FB
- Facebook/Meta
- Meta / Facebook
- Meta Platforms
- facebook (case variations)

### 3. Question Type Normalization
**Product Sense** variations:
- Product Sense
- Product Design
- Product Strategy  
- Product design / strategy
- Product
- Product Execution
- Design & Strategy

**Analytical Thinking** variations:
- Analytics
- Analytical
- Analytical Thinking
- A/B Testing
- Estimation
- Data orientation
- Analytics + Strategy
- Product + Estimation
- Analytics/Stratergy
- Strategy, Estimation
- Estimation, Design, Metrics

### 4. User Interface
- **Upload Section**: Drag-and-drop or file picker for CSV upload
- **Filter Controls**: Radio buttons or dropdown to select question type
- **Question Display**: Large, readable area showing the selected question
- **Randomize Button**: Primary CTA to generate a new random question
- **Question Counter**: Shows total questions available for selected filters

## Technical Requirements

### Frontend
- Modern web technologies (HTML5, CSS3, JavaScript)
- Responsive design for desktop and mobile
- Client-side CSV parsing
- Clean, minimal UI focused on usability

### Data Processing
- CSV parsing with header detection
- Fuzzy matching algorithm for company/question type normalization
- Client-side data storage (no server required)
- Error handling for malformed CSV files

### Performance
- Fast CSV processing (up to 1000+ questions)
- Instant question randomization
- Smooth user interactions

## User Flow
1. User loads the application
2. User uploads CSV file with interview questions
3. System parses and normalizes the data
4. User selects desired question type (Product Sense or Analytical Thinking)
5. User clicks "Get Random Question" button
6. System displays a randomly selected question matching the criteria
7. User can repeat step 6 for additional practice questions

## Success Metrics
- Successful CSV parsing accuracy (>95%)
- Correct company/question type normalization
- User can successfully practice with randomized questions
- Application works offline after initial load

## Future Considerations
- Support for additional companies beyond Meta
- Question history/tracking to avoid repetition
- Timer functionality for practice sessions
- Question difficulty levels
- Export functionality for selected questions

## Technical Constraints
- Client-side only (no backend required)
- Works with standard CSV format
- Compatible with modern web browsers
- Mobile-responsive design