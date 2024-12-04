
import { env, pipeline, cos_sim, FeatureExtractionPipeline, Tensor } from "@xenova/transformers";
env.localModelPath = "../models/models/";
env.allowRemoteModels = false;
env.allowLocalModels = true;
env.backends.onnx.wasm.numThreads = 1;


class EmbeddingModel {
	pipeline: FeatureExtractionPipeline | null = null;
	async init() {
		if (this.pipeline != null) return;
		this.pipeline = await pipeline("feature-extraction", "all-MiniLM-L6-v2/", {
			quantized: true,
			local_files_only: true,
		});
	}

	async generateEmbeddings(sentences: string[]) {
		// Create a feature-extraction pipeline
		// Compute sentence embeddings
		if (this.pipeline == undefined) throw new Error("Pipeline not initialized");
		const output = await this.pipeline([...sentences], { pooling: "mean", normalize: true });
		return output;
	}

	async similarityScore(a: string, b: string) {
		const embeddings: Tensor = await this.generateEmbeddings([a, b]);
		const similarity = cos_sim(Array.from(embeddings[0].data), Array.from(embeddings[1]!.data));
		return similarity;
	}

	async retrieve(query: string, embeddings: Tensor, k: number, cutoff: number): Promise<{ similarity: number; index: number }[]> {
		// Check if the pipeline is initialized
		if (!this.pipeline) throw new Error("Pipeline not initialized");

		// Generate the embedding for the query
		const queryEmbedding: Tensor | undefined = await this.generateEmbeddings([query]);
		if (!queryEmbedding || queryEmbedding.data.length === 0) {
			throw new Error("Failed to compute query embedding");
		}

		// Ensure embeddings and queryEmbedding dimensions are compatible
		if (embeddings.dims[1] !== queryEmbedding.dims[1]) {
			throw new Error("Embedding dimensions do not match");
		}

		const results: { similarity: number; index: number }[] = [];
		const queryData = queryEmbedding.data;

		// Iterate through the embedding vectors
		for (let i = 0; i < embeddings.dims[0]; i++) {
			// Extract the embedding vector for the current index
			const startIdx = i * embeddings.dims[1];
			const endIdx = startIdx + embeddings.dims[1];
			const embeddingVector = Array.from(embeddings.data.slice(startIdx, endIdx));

			// Compute cosine similarity
			const similarity = cos_sim(queryData, embeddingVector);

			// Add to results if similarity is above the cutoff
			if (similarity >= cutoff) {
				results.push({ similarity, index: i });
			}
		}

		// Sort the results by similarity in descending order
		results.sort((a, b) => b.similarity - a.similarity);

		// Return the top-k results
		return results.slice(0, Math.min(k, results.length));
	}

	async dispose() {
		await this.pipeline?.dispose();
	}
}


export default EmbeddingModel
