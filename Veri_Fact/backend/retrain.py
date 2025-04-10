import subprocess

@app.route("/retrain", methods=["POST"])
def retrain():
    logging.info("📨 /retrain endpoint hit")

    try:
        data = request.json.get("data", [])

        if not data:
            logging.warning("⚠️ No retrain data received.")
            return jsonify({"error": "No data to retrain"}), 400

        logging.info(f"🧠 Starting retrain with {len(data)} entries...")

        file_exists = os.path.isfile("feedback.csv")
        with open("feedback.csv", "a", newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=["news", "label"])
            if not file_exists:
                logging.info("📄 feedback.csv created with headers.")
                writer.writeheader()

            for i, item in enumerate(data):
                news = item.get("news")
                label = item.get("label")
                if not news or label not in ["Fake", "Real"]:
                    continue
                logging.info(f"✍️ Writing {i+1}: {news[:60]}... | Label: {label}")
                writer.writerow({"news": news, "label": label})

        logging.info("✅ Feedback saved. Starting model retraining...")

        # Call retrain script
        subprocess.run(["python", "train_model.py"], check=True)

        logging.info("✅ Retraining completed via train_model.py")

        return jsonify({"message": "Model retrained successfully", "count": len(data)}), 200

    except subprocess.CalledProcessError as e:
        logging.error(f"❌ Retrain script failed: {e}")
        return jsonify({"error": "Retrain script failed"}), 500
    except Exception as e:
        logging.error(f"❌ /retrain error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
