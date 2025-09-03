"use client";

import React, { useState } from "react";
import Link from "next/link";
import { runInference } from "@/lib/onnxInference";
import { encodeInput } from "@/lib/encode";
import { IFormData, IPredictionResult } from "@/types";
import { defaultFormData, formConfig } from "@/constants";

export default function TreatmentNeedPage() {
  const [formData, setFormData] = useState<IFormData>(defaultFormData);
  const [prediction, setPrediction] = useState<IPredictionResult | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    try {
      const inputData = encodeInput(formData);
      const result: IPredictionResult = await runInference(inputData);
      setPrediction(result);
    } catch (error) {
      console.error("Prediction failed:", error);
    }
  };

  const handleReset = () => {
    setFormData(defaultFormData);
    setPrediction(null);
  };

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="max-w-screen-md mx-auto p-6 space-y-6 text-gray-700">
          <h1 className="text-3xl font-bold text-purple-700">
            Mental Health Treatment Need Predictor
          </h1>

          <Link
            href="/"
            className="inline-block text-purple-600 hover:text-purple-800 text-md font-medium underline"
          >
            ← Back to Home
          </Link>

          <blockquote className="text-gray-500 italic mt-2">
            The purpose of this tool is to give you insight into whether
            professional mental health support may be beneficial. It is not a
            diagnosis, just a reflection tool powered by data to help you better
            understand your needs.
          </blockquote>

          {formConfig.map((field) => (
            <div key={field.name}>
              <label className="block font-medium mb-1">{field.label}</label>

              {field.type === "number" ? (
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name as keyof IFormData] || ""}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="w-full border rounded-lg p-2"
                />
              ) : (
                <select
                  name={field.name}
                  value={formData[field.name as keyof IFormData] || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}

          {prediction && (
            <div className="mt-6 p-6 border rounded-2xl shadow-md bg-white">
              <h2 className="text-lg font-bold mb-4 text-gray-800">
                Prediction Result
              </h2>

              {/* Predicted Class */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">Predicted Class</p>
                <p className="text-xl font-semibold text-purple-500">
                  {prediction.predictedClass}
                </p>
              </div>

              {/* Probabilities */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Probabilities</p>
                <div className="space-y-2">
                  {Object.entries(prediction.probabilities).map(
                    ([label, prob]) => (
                      <div key={label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-700">{label}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {(prob * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-purple-400 h-3 rounded-full"
                            style={{ width: `${(prob * 100).toFixed(2)}%` }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="mt-6 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 cursor-pointer font-medium"
              >
                Reset Form
              </button>
            </div>
          )}

          {!prediction && (
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer font-semibold"
              onClick={handlePredict}
            >
              Predict
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
