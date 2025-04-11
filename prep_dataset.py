import pandas as pd

# ✅ Load datasets
fake_df = pd.read_csv("fake.csv")
true_df = pd.read_csv("true.csv")

# ✅ Add labels (1 = real, 0 = fake)
fake_df["label"] = 0
true_df["label"] = 1

# ✅ Select relevant columns (assuming 'text' column contains the news article)
fake_df = fake_df[["text", "label"]]
true_df = true_df[["text", "label"]]

# ✅ Merge datasets
df = pd.concat([fake_df, true_df], ignore_index=True)

# ✅ Shuffle dataset
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

# ✅ Save the dataset
df.to_csv("news_dataset.csv", index=False)

print("✅ news_dataset.csv created successfully!")