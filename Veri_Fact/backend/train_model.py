import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import SGDClassifier
import joblib
import nltk
import string
import logging
import os
from pathlib import Path

from nltk.corpus import stopwords
nltk.download("stopwords")

logging.basicConfig(level=logging.INFO)

def clean_text(text):
    """Clean and preprocess text data"""
    if not isinstance(text, str):
        return ""
    stop_words = set(stopwords.words("english"))
    text = text.lower()
    text = text.translate(str.maketrans("", "", string.punctuation))
    tokens = text.split()
    tokens = [word for word in tokens if word not in stop_words]
    return " ".join(tokens)

def load_and_prepare_data():
    """Load and combine all training data"""
    try:
        logging.info("📥 Loading base datasets")
        fake_df = pd.read_csv("fake.csv")
        true_df = pd.read_csv("true.csv")

        # Prepare base data
        fake_df["label"] = 0
        true_df["label"] = 1
        original_df = pd.concat([fake_df, true_df], ignore_index=True)
        original_df["text"] = original_df["text"].astype(str)
        original_df["cleaned_text"] = original_df["text"].apply(clean_text)
        logging.info(f"✅ Base data: {len(original_df)} entries")

        # Prepare feedback data
        feedback_df = pd.DataFrame(columns=["text", "label"])
        if Path("feedback.csv").exists():
            feedback_df = pd.read_csv("feedback.csv")
            if not feedback_df.empty:
                feedback_df["label"] = feedback_df["label"].map({"Fake": 0, "Real": 1})
                feedback_df["text"] = feedback_df["news"].astype(str)
                feedback_df["cleaned_text"] = feedback_df["text"].apply(clean_text)
                feedback_df.dropna(subset=["text", "label"], inplace=True)
                logging.info(f"✅ Feedback data: {len(feedback_df)} entries")

        # Combine datasets with weights
        combined_df = pd.concat([
            original_df[["cleaned_text", "label"]],
            feedback_df[["cleaned_text", "label"]]
        ], ignore_index=True)

        # Add sample weights (5x weight for feedback samples)
        combined_df["weight"] = 1
        if not feedback_df.empty:
            feedback_start_idx = len(original_df)
            combined_df.loc[feedback_start_idx:, "weight"] = 5

        return combined_df, len(original_df)

    except Exception as e:
        logging.error(f"❌ Data loading error: {e}")
        raise

def train_model():
    """Main training function with feedback persistence"""
    try:
        # Load and prepare data
        combined_df, original_count = load_and_prepare_data()
        
        # Check if we have enough data
        if len(combined_df) < 100:
            raise ValueError("Insufficient training data (minimum 100 samples required)")

        logging.info("🔠 Vectorizing text data")
        tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
        X = tfidf.fit_transform(combined_df["cleaned_text"])
        y = combined_df["label"]
        weights = combined_df["weight"]

        # Split data preserving feedback distribution
        X_train, X_test, y_train, y_test, weights_train, _ = train_test_split(
            X, y, weights, test_size=0.2, stratify=y, random_state=42
        )

        logging.info(f"🧪 Train samples: {X_train.shape[0]}, Test samples: {X_test.shape[0]}")

        # Train model with class balancing and sample weights
        logging.info("🧠 Training SGD Classifier")
        model = SGDClassifier(
            loss='log_loss',  # Logistic regression
            class_weight='balanced',
            max_iter=1000,
            early_stopping=True,
            n_iter_no_change=5,
            random_state=42
        )
        
        model.fit(X_train, y_train, sample_weight=weights_train)

        # Save artifacts
        joblib.dump(model, "model.pkl")
        joblib.dump(tfidf, "tfidf.pkl")
        logging.info("💾 Saved updated model and vectorizer")

        # Keep feedback data for future runs
        logging.info("✅ Training completed. Feedback data preserved for future training.")

        # Return training metrics
        train_acc = model.score(X_train, y_train)
        test_acc = model.score(X_test, y_test)
        logging.info(f"📊 Training accuracy: {train_acc:.2f}, Test accuracy: {test_acc:.2f}")

    except Exception as e:
        logging.error(f"❌ Training failed: {e}")
        raise

if __name__ == "__main__":
    train_model()