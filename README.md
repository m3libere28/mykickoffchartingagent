# Kickoff Charting V2

Kickoff Charting V2 is a local, private-use drafting assistant for clinical dietitians. It processes de-identified visit notes (TXT, PDF, or image formats like JPG/PNG/HEIC) and uses AI to generate structured DRAFT ADIME charting output.

**IMPORTANT: This is a DRAFTING ASSISTANT only.** It is not a final charting system, and all generated content requires manual clinician review before entry into an EHR like Kickoff.

## 🚀 Features

*   **Multi-format Intake:** Supports drag-and-drop uploads of `.txt`, `.pdf`, `.jpg`, `.png`, and iOS `.heic` files.
*   **The 4-Stage Processing Pipeline:**
    1.  *File Triage:* Validates and categorizes the uploaded files.
    2.  *Extraction:* Extracts raw text and prepares images (converting HEIC if necessary). Runs a basic regex sweep to warn if likely PHI is detected.
    3.  *AI Generation:* Routes safe content to OpenAI (Vision for images, Text-only for plain text) to structure into an ADIME format focusing on dietitian workflows (weight management, GI, PCOS, etc.).
    4.  *Validation:* Rules-based engine checks the AI output for clinical completeness (missing A/D/I/M/E sections, missing measurements, unsupported PES statements) and flags them for the clinician.
*   **Privacy-First Mindset:** Runs locally. Built-in warnings and pre-flight regex checks remind the user strictly to upload de-identified data.
*   **Clinician Review Dashboard:** Easy to read, copy-to-clipboard functionality per section or all at once, with prominent "Needs Review" and missing item flags.

## 📋 Prerequisites

To run this application locally, you will need:
*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
*   An [OpenAI API Key](https://platform.openai.com/)

## ⚙️ Setup & Installation

The application is structured as a monorepo with separate `frontend` and `backend` directories.

### 1. Backend Setup

Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```

**Environment Variables:**
In the `backend` folder, duplicate the `.env.example` file and rename it to `.env`. Fill in your values:

```env
PORT=3001
FRONTEND_ORIGIN=http://localhost:5173
APP_USERNAME=demo
APP_PASSWORD=password
OPENAI_API_KEY=your_actual_openai_api_key_here
```
*(The Username and Password defined here are what you'll use to log in via the browser.)*

**Start the Backend:**
```bash
npm start
# or use node server.js
```

### 2. Frontend Setup

Open a new, separate terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

**Start the Frontend:**
```bash
npm run dev
```
The app will typically be available at `http://localhost:5173`.

## 🧪 Testing with Sample Data

A `sample_data/` folder is included in the project root containing `sample_note_weight_management.txt`.

1.  Open `http://localhost:5173` in your browser.
2.  Log in using the `APP_USERNAME` and `APP_PASSWORD` you set in the backend `.env` file.
3.  Drag and drop the `sample_note_weight_management.txt` file into the upload zone.
4.  Click "Process Notes".
5.  Review the generated ADIME output, noting any missing details or review warnings flagged by the validation engine.
6.  Use the "Copy Full Draft" button to test the clipboard functionality.

---

### Privacy Limitations & De-identification Expectations

The De-Identification scanner in this V1 is **rules-based (Regex) and not an infallible NLP HIPAA scrubber**. It exists as an extra layer of warning, but **the responsibility of removing names, DOBs, MRNs, phone numbers, and addresses lies on the user before uploading.**

### Future Improvement Ideas
- **Advanced De-Identification:** Integrate a robust NLP library like Presidio for stronger PHI redacting.
- **Custom Prompts:** Allow the user to save and switch between specific dietitian specialty prompts (e.g. Renal vs. Eating Disorder focus).
- **Persistent Local Storage:** Allow saving drafts locally to SQLite instead of losing them on page refresh.
