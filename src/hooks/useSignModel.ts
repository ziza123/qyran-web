/**
 * useSignModel — React hook for loading and running the Qyran sign language model.
 *
 * Usage:
 *   const { predict, isLoaded, labels } = useSignModel();
 *
 *   // landmarks = Float32Array of shape [60, 255] flattened
 *   const result = await predict(landmarks);
 *   // result = { label: "хороший", confidence: 0.92, top5: [...] }
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';

interface PredictionResult {
  label: string;
  confidence: number;
  classIndex: number;
  top5: { label: string; confidence: number }[];
}

interface UseSignModelReturn {
  predict: (landmarks: Float32Array | number[][]) => Promise<PredictionResult | null>;
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  labels: string[];
  numClasses: number;
}

const MODEL_URL = '/model/model.json';
const LABEL_MAP_URL = '/model/label_map.json';
const SCALER_URL = '/model/scaler.json';
const SEQ_LEN = 60;
const FEATURES = 255;

export function useSignModel(): UseSignModelReturn {
  const modelRef = useRef<tf.GraphModel | tf.LayersModel | null>(null);
  const scalerRef = useRef<{ mean: number[]; scale: number[] } | null>(null);
  const [labelMap, setLabelMap] = useState<Record<string, number>>({});
  const [idxToLabel, setIdxToLabel] = useState<Record<number, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load model + label map + scaler
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        // Load label map and scaler in parallel
        const [lmRes, scalerRes] = await Promise.all([
          fetch(LABEL_MAP_URL),
          fetch(SCALER_URL),
        ]);

        if (!lmRes.ok) throw new Error(`Failed to load label_map.json: ${lmRes.status}`);
        if (!scalerRes.ok) throw new Error(`Failed to load scaler.json: ${scalerRes.status}`);

        const lm: Record<string, number> = await lmRes.json();
        const scalerData = await scalerRes.json();
        if (cancelled) return;

        scalerRef.current = scalerData;
        setLabelMap(lm);
        const i2l: Record<number, string> = {};
        for (const [label, idx] of Object.entries(lm)) {
          i2l[idx] = label;
        }
        setIdxToLabel(i2l);

        // Load as layers model (Keras export)
        let model: tf.GraphModel | tf.LayersModel;
        try {
          model = await tf.loadLayersModel(MODEL_URL, { strict: false });
          console.log('[Qyran] Loaded as LayersModel');
        } catch (e1: any) {
          console.warn('[Qyran] LayersModel failed:', e1.message);
          try {
            model = await tf.loadGraphModel(MODEL_URL);
            console.log('[Qyran] Loaded as GraphModel');
          } catch (e2: any) {
            throw new Error(`LayersModel: ${e1.message} | GraphModel: ${e2.message}`);
          }
        }

        if (cancelled) { model.dispose(); return; }

        modelRef.current = model;
        setIsLoaded(true);
        console.log(`[Qyran] Model ready. Classes: ${Object.keys(lm).length}`);

        // Warmup inference
        const dummy = tf.zeros([1, SEQ_LEN, FEATURES]);
        const warmup = model instanceof tf.GraphModel
          ? model.predict(dummy)
          : (model as tf.LayersModel).predict(dummy);
        if (warmup instanceof tf.Tensor) warmup.dispose();
        else if (Array.isArray(warmup)) warmup.forEach(t => t.dispose());
        dummy.dispose();
        console.log('[Qyran] Warmup done');
      } catch (err: any) {
        if (!cancelled) {
          console.error('[Qyran] Load error:', err);
          setError(err.message || 'Failed to load model');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // Predict
  const predict = useCallback(async (
    landmarks: Float32Array | number[][]
  ): Promise<PredictionResult | null> => {
    const model = modelRef.current;
    const scaler = scalerRef.current;
    if (!model || Object.keys(idxToLabel).length === 0) return null;

    return tf.tidy(() => {
      // Convert input to tensor [1, 60, 255]
      let input: tf.Tensor3D;

      if (landmarks instanceof Float32Array) {
        if (landmarks.length !== SEQ_LEN * FEATURES) {
          console.warn(`[Qyran] Expected ${SEQ_LEN * FEATURES} values, got ${landmarks.length}`);
          return null;
        }
        input = tf.tensor3d(landmarks, [1, SEQ_LEN, FEATURES]);
      } else {
        input = tf.tensor3d([landmarks], [1, SEQ_LEN, FEATURES]);
      }

      // Apply scaler normalization: (x - mean) / scale
      if (scaler) {
        const mean = tf.tensor1d(scaler.mean);
        const scale = tf.tensor1d(scaler.scale);
        input = input.sub(mean).div(scale) as tf.Tensor3D;
      }

      // Run inference
      const output = model instanceof tf.GraphModel
        ? model.predict(input)
        : (model as tf.LayersModel).predict(input);

      const probsTensor = output instanceof tf.Tensor ? output : (output as tf.Tensor[])[0];
      const probs = probsTensor.dataSync() as Float32Array;

      // Find top-5
      const indexed = Array.from(probs).map((p, i) => ({ idx: i, prob: p }));
      indexed.sort((a, b) => b.prob - a.prob);
      const top5 = indexed.slice(0, 5).map(({ idx, prob }) => ({
        label: idxToLabel[idx] || `class_${idx}`,
        confidence: prob,
      }));

      return {
        label: top5[0].label,
        confidence: top5[0].confidence,
        classIndex: indexed[0].idx,
        top5,
      };
    });
  }, [idxToLabel]);

  return {
    predict,
    isLoaded,
    isLoading,
    error,
    labels: Object.keys(labelMap),
    numClasses: Object.keys(labelMap).length,
  };
}
