import { apiClient, USE_MOCK } from './api';
import { SpeechEvalResponse } from '../types';
import { calculateSimilarity } from '../utils/tamilPhonetics';

export const speechService = {
  async evaluateSpeech(
    audioBlob: Blob | null,
    targetText: string,
    transcriptHint?: string
  ): Promise<SpeechEvalResponse> {
    if (USE_MOCK || !audioBlob) {
      // Mock evaluation based on target text and transcription
      const simulatedTranscript = transcriptHint || targetText;
      const targetWords = targetText.trim().split(/\s+/);
      const spokenWords = simulatedTranscript.trim().split(/\s+/);

      const per_word = targetWords.map((word, index) => {
        const spokenWord = spokenWords[index] || '';
        const sim = calculateSimilarity(word, spokenWord);
        let status: 'correct' | 'close' | 'missed' = 'missed';
        if (sim >= 0.75) status = 'correct';
        else if (sim >= 0.45) status = 'close';

        return {
          word,
          status,
          similarity: sim,
          feedback:
            status === 'correct'
              ? 'Clear and sweet pronunciation!'
              : status === 'close'
              ? 'Very close! Try keeping the vowel length steady.'
              : 'Listen to Kili and give it another try!',
        };
      });

      const avgSim = per_word.reduce((acc, curr) => acc + curr.similarity, 0) / per_word.length;
      const score = Math.round(Math.max(50, avgSim * 100));

      let feedback_text = 'Super pronunciation! Kili is dancing with joy! 🦜✨';
      if (score < 70) {
        feedback_text = 'Good try! Tamil pronunciation takes a little practice. Let’s do it once more!';
      } else if (score < 85) {
        feedback_text = 'Great effort! Your Tamil sounds so clear and lovely!';
      }

      return {
        score,
        transcript: simulatedTranscript,
        target_text: targetText,
        per_word,
        feedback_text,
      };
    }

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'speech.webm');
      formData.append('target_text', targetText);

      const response = await apiClient.post('/speech/evaluate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      console.warn('Backend speech evaluate failed, falling back to local evaluation');
      return speechService.evaluateSpeech(null, targetText, transcriptHint);
    }
  },
};
