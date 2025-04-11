import torch
from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments
from torch.utils.data import Dataset
import pandas as pd
from sklearn.model_selection import train_test_split

# ✅ Load dataset
df = pd.read_csv("news_dataset.csv")

# ✅ Convert labels to integers if needed
if df["label"].dtype == object:
    df["label"] = df["label"].map({"FAKE": 0, "REAL": 1})  # Convert to 0/1

tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

# ✅ Convert data to BERT input format
class FakeNewsDataset(Dataset):
    def _init_(self, texts, labels):
        self.texts = texts
        self.labels = labels

    def _len_(self):
        return len(self.texts)

    def _getitem_(self, idx):
        text = self.texts[idx]
        label = self.labels[idx]

        encoding = tokenizer(text, truncation=True, padding="max_length", max_length=256, return_tensors="pt")
        
        return {
            "input_ids": encoding["input_ids"].squeeze(0),
            "attention_mask": encoding["attention_mask"].squeeze(0),
            "labels": torch.tensor(label, dtype=torch.long),  
        }

# ✅ Split dataset into training and validation sets
train_texts, val_texts, train_labels, val_labels = train_test_split(df["text"], df["label"], test_size=0.2, random_state=42)

# ✅ Create Dataset objects
train_dataset = FakeNewsDataset(train_texts.tolist(), train_labels.tolist())
val_dataset = FakeNewsDataset(val_texts.tolist(), val_labels.tolist())

# ✅ Define model with correct classification head
model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)

# ✅ Define training arguments
training_args = TrainingArguments(
    output_dir="./results",
    eval_strategy="epoch",
    save_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=4,
    per_device_eval_batch_size=4,
    num_train_epochs=3,
    weight_decay=0.01,
    logging_dir="./logs",
    logging_steps=500,
    save_total_limit=2,
    fp16=True,  # ✅ Enables mixed-precision for speedup on GPU
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
)

# ✅ Train model
trainer.train()

# ✅ Save final trained model
model.save_pretrained("bert_fake_news")
tokenizer.save_pretrained("bert_fake_news")
