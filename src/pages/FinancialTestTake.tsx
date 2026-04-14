import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancialTest } from '@/hooks/useFinancialTest';
import QuestionRenderer from '@/components/financial-test/QuestionRenderer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Pause, Play, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const FinancialTestTake = () => {
  const navigate = useNavigate();
  const {
    currentBlock,
    currentBlockIndex,
    totalBlocks,
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
  } = useFinancialTest();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentBlockIndex, showIntro, showTransition]);

  // Resume popup
  if (hasExistingProgress) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full text-center shadow-lg">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-4">У тебе є незавершений тест</h2>
          <p className="text-muted-foreground mb-8">Хочеш продовжити з того ж місця чи почати заново?</p>
          <div className="flex flex-col gap-3">
            <Button variant="cta" onClick={restoreProgress} className="w-full">Продовжити</Button>
            <Button variant="outline" onClick={startFresh} className="w-full">Почати заново</Button>
          </div>
        </div>
      </div>
    );
  }

  // Paused screen
  if (isPaused) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full text-center shadow-lg">
          <Pause className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Пауза</h2>
          <p className="text-muted-foreground mb-2">Твій прогрес збережено.</p>
          <p className="text-muted-foreground mb-8">Повернись, коли готовий.</p>
          <Button variant="cta" onClick={() => setIsPaused(false)} className="w-full gap-2">
            <Play className="w-4 h-4" /> Продовжити
          </Button>
        </div>
      </div>
    );
  }

  // Transition screen between blocks
  if (showTransition && transitionMessage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-lg">
          <p className="font-display text-2xl md:text-3xl text-foreground font-medium mb-10 leading-relaxed">
            "{transitionMessage}"
          </p>
          <Button variant="cta" size="lg" onClick={confirmTransition}>Далі</Button>
        </div>
      </div>
    );
  }

  // Block intro
  if (showIntro) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-lg">
          <span className="text-sm text-muted-foreground mb-2 block">Блок {currentBlockIndex + 1} з {totalBlocks}</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">{currentBlock.title}</h2>
          <p className="text-lg text-primary font-medium mb-4">{currentBlock.subtitle}</p>
          <p className="text-muted-foreground mb-10">{currentBlock.intro_text}</p>
          <Button variant="cta" size="lg" onClick={dismissIntro}>Почати блок</Button>
        </div>
      </div>
    );
  }

  // Main question view
  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container-custom py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Блок {currentBlockIndex + 1} з {totalBlocks}: {currentBlock.title}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> ~{estimatedMinutesLeft} хв
              </span>
              <button
                onClick={() => setIsPaused(true)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Pause className="w-3 h-3" /> Пауза
              </button>
            </div>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <span className="text-xs text-muted-foreground mt-1 block">{progressPercent}%</span>
        </div>
      </div>

      {/* Questions */}
      <div className="container-custom max-w-2xl py-8">
        {currentBlock.questions.map((q, i) => (
          <QuestionRenderer
            key={q.id}
            question={q}
            value={answers[q.id] ?? null}
            onChange={(val) => setAnswer(q.id, val)}
            questionIndex={i}
          />
        ))}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border py-4 z-50">
        <div className="container-custom max-w-2xl flex justify-between">
          <Button
            variant="outline"
            onClick={goPrevBlock}
            disabled={currentBlockIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Назад
          </Button>
          {isLastBlock ? (
            <Button variant="cta" onClick={() => navigate('/test/finish')} className="gap-2">
              Завершити <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="cta" onClick={goNextBlock} className="gap-2">
              Далі <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialTestTake;
