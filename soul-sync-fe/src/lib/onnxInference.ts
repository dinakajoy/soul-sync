import { IInputData } from "@/types";
import * as ort from "onnxruntime-web";

export async function runInference(inputData: IInputData) {
  try {
    const session = await ort.InferenceSession.create(
      "mental_health_model_deployment.onnx"
    );

    const inputArray = Object.values(inputData);

    // Create a tensor of shape [1, num_features]
    const tensor = new ort.Tensor("float32", Float32Array.from(inputArray), [
      1,
      inputArray.length,
    ]);

    // The input name must match the name used when exporting your ONNX model
    const feeds = { float_input: tensor };

    // Run inference
    const results: ort.InferenceSession.OnnxValueMapType = await session.run(
      feeds
    );
    if (!results) {
      throw new Error("No results from ONNX inference");
    }

    const label = Number(results.label.data[0]);
    const probabilities = Array.from(
      results.probabilities.data as Float32Array
    );

    const classes = ["No Treatment", "Needs Treatment"];

    const output = {
      predictedClass: classes[label],
      probabilities: {
        [classes[0]]: probabilities[0],
        [classes[1]]: probabilities[1],
      },
    };

    return output;
  } catch (e) {
    console.error("Error during ONNX inference:", e);
    throw e;
  }
}
