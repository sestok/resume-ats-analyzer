from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

nltk.download('punkt')
nltk.download('stopwords')

app = Flask(__name__)
CORS(app)  # To allow requests from the frontend development server

def extract_text_from_pdf(file):
    doc = fitz.open(stream=file.read(), filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def analyze_and_feedback(resume_text, job_description):
    resume_words = word_tokenize(resume_text.lower())
    job_desc_words = word_tokenize(job_description.lower())
    stop_words = set(stopwords.words('english'))
    
    resume_filtered = [word for word in resume_words if word.isalpha() and word not in stop_words]
    job_desc_filtered = [word for word in job_desc_words if word.isalpha() and word not in stop_words]
    
    matches = set(resume_filtered) & set(job_desc_filtered)
    return list(matches)

@app.route('/analyze', methods=['POST'])
def analyze():
    job_description = request.form['jobDescription']
    resume_file = request.files['resume']
    resume_text = extract_text_from_pdf(resume_file)
    matched_keywords = analyze_and_feedback(resume_text, job_description)
    return jsonify(matched_keywords=matched_keywords)

if __name__ == '__main__':
    app.run(debug=True)
