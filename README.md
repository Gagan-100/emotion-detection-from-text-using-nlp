
🎭 Emotion Detection from Text using NLP
A web-based application that detects emotions from user-input text using a fine-tuned RoBERTa model.
Frontend: HTML, CSS, JavaScript | Backend: Flask | Visualization: Chart.js

![image alt](https://github.com/Gagan-100/emotion-detection-from-text-using-nlp/blob/d8be0b218ed8af4f0905ae936403bf364e505cb7/emotion%20detection%20.png)

---

## 📌 Overview
This project uses the **DailyDialog** dataset (13,118 dialogues, ~104,944 utterances) to train a **RoBERTa** model for multi-class emotion classification.  
Users can input text, instantly receive predictions, and view results through an interactive bar chart.

## ✨ Key Features
- **Real-time predictions** – Instant emotion detection after submitting text.  
- **Interactive visualization** – Dynamic bar chart using Chart.js.  
- **Responsive design** – Works seamlessly on desktop & mobile.  
- **Rule-based enhancements** – Improves nuanced predictions.  

## 📊 Dataset
- **Source:** DailyDialog Dataset  
- **Emotions:** Neutral, Anger, Disgust, Fear, Joy, Sadness, Surprise (7 classes)  
- **Size:** 13,118 dialogues (~104,944 utterances)  


## 🤖 Model Details
- **Architecture:** Fine-tuned roberta-base from Hugging Face  
- **Backend API:** Flask (`/predict` endpoint)  
- **Libraries:** PyTorch, Transformers, Flask-CORS  
- **Performance:**  
  - Test Accuracy: **85.01%** (Validation peak: **89.99%**)  
  - F1-Score: ~**0.85** (weighted), ~**0.80** (macro)  
  - False Positive Rate: ~**3.21%** (macro), highest for **Neutral** (**12.75%**)  


---

## 🖥️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript, Chart.js  
- **Backend:** Python (Flask)  
- **NLP Model:** RoBERTa (fine-tuned via Hugging Face Transformers)  
- **Other Libraries:** PyTorch, NumPy, Pandas, Flask-CORS  

## 🚀 Quick Start Guide

💻 **1. Open the Webpage**  
Launch the application in your preferred browser.  

✏️ **2. Enter Your Text**  
Type something in the textarea — for example:  
> *"I am so happy today!"*  

📊 **3. Click “Analyze”**  
Instantly view the **predicted emotion** along with an **interactive bar chart** showing emotion scores.  

🌐 **4. Explore More**  
Navigate to **About**, **Contact**, and **Features** pages to learn more about the application.

## 📊 Model Evaluation

### 📌 Metrics
- **Test Accuracy:** `85.01%` *(95% CI: 84.48% – 85.48%)*
- **Validation Accuracy (Peak):** `89.99%`
- **F1-Score:**  
  - **Weighted Avg:** ~`0.85`  
  - **Macro Avg:** ~`0.80`
- **False Positive Rate (FPR):**  
  - **Macro Avg:** ~`3.21%`  
  - **Highest:** Neutral (`12.75%`)

### 🔍 Qualitative Examples
- ✅ `"I am so happy today!"` → **Joy** *(0.95)* — **Correct**  
- ❌ `"This is disgusting!"` → **Neutral** *(0.55)* — **Incorrect**

## 🚀 Future Work

- ⚡ **Optimize Inference Speed** — Apply *quantization* or switch to **DistilRoBERTa** for faster predictions.  
- ☁ **Cloud Deployment** — Host the model on platforms like **Heroku** or **AWS** for global accessibility.  
- 🌍 **Feature Expansion** — Add **sentiment analysis**, **multilingual support**, and **real-time conversation tracking**.  
- 📈 **Data Improvements** — Mitigate class imbalance through **data augmentation** techniques.

## 🙏 Acknowledgments

- 🤗 **Hugging Face** — For the amazing **Transformers** and **Datasets** libraries.  
- 📊 **Chart.js** — For providing beautiful **visualization** capabilities.  
- 💻 **Google Colab** — For free **GPU training support**.  
- 📚 **DailyDialog Dataset Authors** (*Li et al., 2017*) — For creating a rich conversational dataset.




