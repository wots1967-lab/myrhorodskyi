import { useState, useEffect, useCallback, useMemo } from 'react';
import { financialTestData, transitionMessages } from '@/data/financialTestQuestions';
import { Answers, AnswerValue, TestSubmission } from '@/types/financialTest';

const STORAGE_KEY = 'financial_test_progress';
const RESULTS_KEY = 'financial_test_results';

function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function useFinancialTest() {
  const blocks = financialTestData.blocks;
  const totalQuestions = blocks.reduce((sum, b) => sum + b.questions.length, 0);

  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showIntro, setShowIntro] = useState(true);
  const [showTransition, setShowTransition] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasExistingProgress, setHasExistingProgress] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.answers && Object.keys(data.answers).length > 0) {
          setHasExistingProgress(true);
        }
      } catch { /* ignore */ }
    }
  }, []);

  const restoreProgress = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setAnswers(data.answers || {});
        setCurrentBlockIndex(data.currentBlockIndex || 0);
        setShowIntro(false);
        setHasExistingProgress(false);
      } catch { /* ignore */ }
    }
  }, []);

  const startFresh = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAnswers({});
    setCurrentBlockIndex(0);
    setShowIntro(true);
    setHasExistingProgress(false);
  }, []);

  // Auto-save
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, currentBlockIndex }));
    }
  }, [answers, currentBlockIndex]);

  const setAnswer = useCallback((questionId: string, value: AnswerValue) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter(v => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)).length;
  }, [answers]);

  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const estimatedMinutesLeft = useMemo(() => {
    const remaining = totalQuestions - answeredCount;
    return Math.max(1, Math.round(remaining * 0.5));
  }, [answeredCount, totalQuestions]);

  const currentBlock = blocks[currentBlockIndex];
  const transitionMessage = transitionMessages[currentBlockIndex];

  const goNextBlock = useCallback(() => {
    if (currentBlockIndex < blocks.length - 1) {
      setShowTransition(true);
    }
  }, [currentBlockIndex, blocks.length]);

  const confirmTransition = useCallback(() => {
    setShowTransition(false);
    setCurrentBlockIndex(prev => prev + 1);
    setShowIntro(true);
  }, []);

  const goPrevBlock = useCallback(() => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(prev => prev - 1);
      setShowIntro(false);
    }
  }, [currentBlockIndex]);

  const dismissIntro = useCallback(() => setShowIntro(false), []);

  const isLastBlock = currentBlockIndex === blocks.length - 1;

  // Save result
  const saveResult = useCallback((email: string, name?: string, phone?: string, wantsConsultation = false): string => {
    const slug = generateSlug();
    const submission: TestSubmission = {
      slug,
      answers,
      email,
      name,
      phone,
      wantsConsultation,
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem(RESULTS_KEY) || '{}');
    existing[slug] = submission;
    localStorage.setItem(RESULTS_KEY, JSON.stringify(existing));
    localStorage.removeItem(STORAGE_KEY);
    return slug;
  }, [answers]);

  const getResult = useCallback((slug: string): TestSubmission | null => {
    const existing = JSON.parse(localStorage.getItem(RESULTS_KEY) || '{}');
    return existing[slug] || null;
  }, []);

  return {
    currentBlock,
    currentBlockIndex,
    totalBlocks: blocks.length,
    answers,
    setAnswer,
    progressPercent,
    estimatedMinutesLeft,
    showIntro,
    dismissIntro,
    showTransition,
    transitionMessage,
    goNextBlock,
    confirmTransition,
    goPrevBlock,
    isPaused,
    setIsPaused,
    isLastBlock,
    hasExistingProgress,
    restoreProgress,
    startFresh,
    saveResult,
    getResult,
    answeredCount,
    totalQuestions,
  };
}
