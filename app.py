from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from transformers import RobertaTokenizer, RobertaForSequenceClassification
import torch
import os

app = Flask(__name__)
CORS(app)

# Path to the model directory
MODEL_PATH = "./saved_model"

# Load Model and Tokenizer
model, tokenizer = None, None
try:
    model = RobertaForSequenceClassification.from_pretrained(MODEL_PATH, local_files_only=True)
    tokenizer = RobertaTokenizer.from_pretrained(MODEL_PATH, local_files_only=True)
    print("Model and tokenizer loaded successfully.")
except Exception as e:
    print(f"Could not load model/tokenizer from '{MODEL_PATH}': {e}")

# emotion labels (based on DailyDialog dataset)
emotion_labels = ["neutral", "anger", "disgust", "fear", "joy", "sadness", "surprise"]

# Emotion Detection Function with Rule-based Improvements
def detect_emotion(text):
    if not model or not tokenizer or not emotion_labels:
        raise RuntimeError("Model, tokenizer, or labels not loaded.")

    # Tokenize the input
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)

    # Move inputs to the same device as the model (CPU or GPU)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    inputs = {key: val.to(device) for key, val in inputs.items()}

    # Predict
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)[0]
        predicted_class = torch.argmax(probs).item()

    predicted_emotion = emotion_labels[predicted_class]

    # Rule-based improvements for common errors
    lowered = text.lower()
    if "not angry" in lowered and predicted_emotion in ["anger", "disgust"]:
        predicted_emotion = "neutral"
    elif "surprised" in lowered or "surprise" in lowered:
        predicted_emotion = "surprise"
    elif "happy" in lowered or "glad" in lowered:
        predicted_emotion = "joy"
    elif "not sad" in lowered and predicted_emotion == "sadness":
        predicted_emotion = "neutral"
    elif "sad" in lowered and predicted_emotion not in ["sadness"]:
        predicted_emotion = "sadness"
    elif "happy" in lowered and predicted_emotion != "joy":
        predicted_emotion = "joy"
    elif "angry" in lowered and predicted_emotion != "anger":
        predicted_emotion = "anger"

    return predicted_emotion, [float(p) for p in probs]

# === Routes ===

@app.route('/')
def home():
    return render_template('welcome.html')

@app.route('/welcome.html')
def welcome():
    return render_template('welcome.html')

@app.route('/index.html')
def index():
    return render_template('index.html')

@app.route('/contact.html')
def contact():
    return render_template('contact.html')

@app.route('/about.html')
def about():
    return render_template('about.html')

@app.route('/feature.html')
def feature():
    return render_template('feature.html')

@app.route('/predict', methods=['POST'])
def predict():
    if not model or not tokenizer or not emotion_labels:
        return jsonify({'error': 'Model not loaded. Please check server logs.'}), 500

    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'Invalid input. "text" field is required.'}), 400

    user_input = data['text'].strip()
    if not user_input:
        return jsonify({'error': 'Empty input text.'}), 400

    try:
        predicted_emotion, probabilities = detect_emotion(user_input)

        # Map each emotion label to its probability
        emotion_scores = dict(zip(emotion_labels, probabilities))

        #  7 emotions from DailyDialog
        main_emotions = ['neutral', 'anger', 'disgust', 'fear', 'joy', 'sadness', 'surprise']
        filtered_emotion_scores = {emotion: round(emotion_scores.get(emotion, 0), 4) for emotion in main_emotions}

        return jsonify({
            'predicted_emotion': predicted_emotion,
            'emotion_scores': filtered_emotion_scores,
            'probabilities': probabilities,
            'labels': emotion_labels
        })
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': 'Analysis failed'}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)