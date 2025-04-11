import joblib
import re
import string
import nltk
import spacy
from nltk.tokenize import word_tokenize
from transformers import BertTokenizer, BertForSequenceClassification
import torch
import torch.nn.functional as F

# Load NLP resources
nltk.download("punkt")

# Load spaCy's NER model
nlp = spacy.load("en_core_web_sm")

# Load saved models
vectorizer = joblib.load("vectorizer.pkl")  
classifier = joblib.load("model.pkl")  
bert_model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)
bert_tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

# ✅ Function to clean text
def clean_text(text):
    text = text.lower()
    text = re.sub(r"\d+", "", text)  
    text = text.translate(str.maketrans("", "", string.punctuation))  
    tokens = word_tokenize(text)
    return " ".join(tokens)

# ✅ Function to check geographical facts
def check_fact(text):
    doc = nlp(text)
    locations = [ent.text for ent in doc.ents if ent.label_ == "GPE"]  # GPE = Geo-Political Entity

    # Hardcoded real-world facts (extend this list)
    geo_facts = {
        "delhi": "india",
        "paris": "france",
        "new york": "usa",
        "beijing": "china",
    }

    for loc in locations:
        if loc.lower() in geo_facts and geo_facts[loc.lower()] not in text.lower():
            return False  # Fact is incorrect

    return True  # Fact is correct

# ✅ Function to predict using the model
def predict_news(news_text):
    cleaned_text = clean_text(news_text)

   # Traditional model prediction
    features = vectorizer.transform([cleaned_text])
    traditional_pred = classifier.predict(features)[0]  # 1 for real, 0 for fake
    traditional_label = "real" if traditional_pred == 1 else "fake"

    # BERT prediction
# BERT prediction with confidence
inputs = bert_tokenizer(clean_text, return_tensors="pt", padding=True, truncation=True, max_length=512)
outputs = bert_model(**inputs)
logits = outputs.logits
probs = torch.nn.functional.softmax(logits, dim=1)

bert_pred = torch.argmax(probs).item()
bert_confidence = probs[0][bert_pred].item()
bert_label = "real" if bert_pred == 1 else "fake"

print(f"BERT predicted: {bert_label} (Confidence: {bert_confidence:.2f})")