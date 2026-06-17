from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class LocalVectorStore:
    def __init__(self):
        self.documents = []
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = None

    def add_document(self, text: str, metadata: dict) -> None:
        """
        Store a text document and metadata in the vector database
        """
        self.documents.append({"text": text, "metadata": metadata})
        texts = [doc["text"] for doc in self.documents]
        self.tfidf_matrix = self.vectorizer.fit_transform(texts)

    def search(self, query: str, top_k: int = 2) -> list:
        """
        Perform semantic search against indexed documents using Cosine Similarity
        """
        if not self.documents or self.tfidf_matrix is None:
            return []

        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        
        # Get top matching indices
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        results = []
        for idx in top_indices:
            score = float(similarities[idx])
            if score > 0.05: # Threshold
                results.append({
                    "document": self.documents[idx],
                    "similarityScore": round(score, 4)
                })
        return results
