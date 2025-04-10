from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import csv
import os
import logging
import subprocess

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

model = joblib.load("model.pkl")
vectorizer = joblib.load("tfidf.pkl")

@app.route("/")
def home():
    return "✅ Fake News Detection Backend is Running"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        news = data.get("news", "")
        if not news:
            return jsonify({"error": "No news content provided"}), 400

        vectorized_news = vectorizer.transform([news])
        prediction = model.predict(vectorized_news)[0]
        confidence = model.predict_proba(vectorized_news).max()

        logging.info(f"📊 Model prediction made using model id: {id(model)}")

        return jsonify({
            "prediction": "Fake" if prediction == 0 else "Real",
            "confidence": round(confidence * 100, 2)
        })

    except Exception as e:
        logging.error(f"❌ Prediction error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/feedback", methods=["POST"])
def feedback():
    try:
        data = request.json.get("data", [])
        if not data:
            return jsonify({"error": "No data provided"}), 400

        file_exists = os.path.isfile("feedback.csv")
        with open("feedback.csv", "a", newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=["news", "label"])
            if not file_exists:
                writer.writeheader()
            for item in data:
                news = item.get("news")
                label = item.get("label")
                if news and label in ["Fake", "Real"]:
                    writer.writerow({"news": news, "label": label})

        return jsonify({"message": "Feedback stored", "count": len(data)}), 200

    except Exception as e:
        logging.error(f"❌ Feedback error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/retrain", methods=["POST"])
def retrain():
    logging.info("📨 /retrain endpoint hit")

    try:
        data = request.json.get("data", [])
        logging.info(f"Received JSON: {request.json}")

        if not os.path.exists("feedback.csv"):
            logging.warning("⚠️ feedback.csv not found.")
            return jsonify({"error": "feedback.csv not found"}), 500

        logging.info("✅ Starting model retraining...")
        result = subprocess.run(
            ["python", "train_model.py"],
            check=True,
            capture_output=True,
            text=True
        )

        logging.info("✅ Retraining completed")
        logging.info(f"📤 Output from train_model.py:\n{result.stdout}")

        # ✅ Reload model and vectorizer after retraining
        try:
            global model, vectorizer
            model = joblib.load("model.pkl")
            vectorizer = joblib.load("tfidf.pkl")
            logging.info(f"🔁 Model and vectorizer reloaded successfully. Model ID: {id(model)}")
        except Exception as reload_error:
            logging.error(f"❌ Failed to reload model/vectorizer: {reload_error}")

        return jsonify({
            "message": "✅ Model retrained successfully!",
            "details": result.stdout + "\n" + result.stderr
        }), 200

    except subprocess.CalledProcessError as e:
        logging.error(f"❌ Retrain script failed: {e}")
        return jsonify({"error": "Retrain script failed"}), 500
    except Exception as e:
        logging.error(f"❌ Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
