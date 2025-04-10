import math
import random

class LogisticRegression:
    def __init__(self, learning_rate=0.01, iterations=1000):
        self.learning_rate = learning_rate
        self.iterations = iterations
        self.weights = None
        self.bias = None
    
    def sigmoid(self, z):
        return 1 / (1 + math.exp(-z))
    
    def compute_cost(self, y, y_hat):
        m = len(y)
        cost = (-1 / m) * sum(y[i] * math.log(y_hat[i]) + (1 - y[i]) * math.log(1 - y_hat[i]) for i in range(m))
        return cost
    
    def fit(self, X, y):
        m, n = len(X), len(X[0])
        self.weights = [0] * n
        self.bias = 0
        
        for _ in range(self.iterations):
            y_hat = [self.sigmoid(sum(X[i][j] * self.weights[j] for j in range(n)) + self.bias) for i in range(m)]
            
            dw = [sum((y_hat[i] - y[i]) * X[i][j] for i in range(m)) / m for j in range(n)]
            db = sum(y_hat[i] - y[i] for i in range(m)) / m
            
            self.weights = [self.weights[j] - self.learning_rate * dw[j] for j in range(n)]
            self.bias -= self.learning_rate * db
    
    def predict(self, X):
        return [1 if self.sigmoid(sum(X[i][j] * self.weights[j] for j in range(len(self.weights))) + self.bias) > 0.5 else 0 for i in range(len(X))]
    
    def accuracy(self, y_true, y_pred):
        return sum(1 for i in range(len(y_true)) if y_true[i] == y_pred[i]) / len(y_true) * 100

# Generate synthetic dataset
random.seed(42)
m = 1000
n = 10
X = [[random.uniform(-1, 1) for _ in range(n)] for _ in range(m)]
y = [random.randint(0, 1) for _ in range(m)]

# Split dataset into training and testing sets
test_size = int(0.2 * m)
X_train, X_test = X[:-test_size], X[-test_size:]
y_train, y_test = y[:-test_size], y[-test_size:]

# Train logistic regression model
model = LogisticRegression(learning_rate=0.01, iterations=5000)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# Evaluate the model
accuracy = model.accuracy(y_test, y_pred)
print(f"Model Accuracy: {accuracy:.2f}%")