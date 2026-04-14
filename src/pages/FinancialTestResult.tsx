import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Answers } from '@/types/financialTest';
import { financialTestData } from '@/data/financialTestQuestions';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Download, Copy, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ResultData {
  answers: Answers;
  createdAt: string;
}

const FinancialTestResult = () => {
  const { slug } = useParams<{ slug: string }>();
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!slug) return;
    const fetchResult = async () => {
      const { data } = await supabase
        .from('financial_test_results')
        .select('answers, created_at')
        .eq('slug', slug)
        .single();
      if (data) {
        setResult({ answers: data.answers as unknown as Answers, createdAt: data.created_at });
      }
      setLoading(false);
    };
    fetchResult();
  }, [slug]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({ title: 'Посилання скопійовано' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    if (!resultRef.current) return;
    const html2pdf = (await import('html2pdf.js')).default;
    const clone = resultRef.current.cloneNode(true) as HTMLElement;
    clone.style.background = 'white';
    clone.style.color = 'black';
    clone.style.padding = '24px';
    clone.querySelectorAll('*').forEach(el => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.color = '#1a1a1a';
      htmlEl.style.borderColor = '#e0e0e0';
    });

    (html2pdf() as any).set({
      margin: [10, 10],
      filename: 'financial-personality-report.pdf',
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).from(clone).save();
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Результат не знайдено</h1>
          <p className="text-muted-foreground mb-6">Можливо, дані були видалені з браузера.</p>
          <Button variant="cta" asChild><Link to="/test">Пройти тест</Link></Button>
        </div>
      </div>
    );
  }

  const renderAnswer = (questionId: string, type: string) => {
    const val = result.answers[questionId];
    if (val === null || val === undefined || val === '') return <span className="text-muted-foreground italic">пропущено</span>;

    if (type === 'scale_1_5') {
      const n = val as number;
      return (
        <div className="flex items-center gap-2">
          <Progress value={n * 20} className="h-2 flex-1 max-w-[120px]" />
          <span className="text-sm font-medium text-foreground">{n}/5</span>
          <span className="text-xs text-muted-foreground">{financialTestData.scale_labels[String(n)]}</span>
        </div>
      );
    }

    if (type === 'multi_choice' && Array.isArray(val)) {
      return (
        <div className="flex flex-wrap gap-1.5">
          {(val as string[]).map(v => (
            <span key={v} className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-sm">{v}</span>
          ))}
        </div>
      );
    }

    if (type === 'composite_scale' && typeof val === 'object' && !Array.isArray(val)) {
      const obj = val as Record<string, number>;
      return (
        <div className="space-y-1.5">
          {Object.entries(obj).map(([subId, subVal]) => {
            const block = financialTestData.blocks.find(b => b.questions.some(q => q.subquestions?.some(s => s.id === subId)));
            const subQ = block?.questions.flatMap(q => q.subquestions || []).find(s => s.id === subId);
            return (
              <div key={subId} className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground flex-1 min-w-0 truncate">{subQ?.text || subId}</span>
                <Progress value={subVal * 20} className="h-1.5 w-20" />
                <span className="font-medium text-foreground w-6 text-right">{subVal}</span>
              </div>
            );
          })}
        </div>
      );
    }

    if (type === 'open_text' || type === 'short_text') {
      return <blockquote className="border-l-2 border-primary/30 pl-3 text-foreground/90 italic text-sm">{String(val)}</blockquote>;
    }

    return <span className="text-foreground">{String(val)}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-28 pb-16 container-custom max-w-3xl">
        <div ref={resultRef}>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">
            Твій фінансовий психологічний портрет
          </h1>
          <p className="text-center text-muted-foreground mb-10">
            {new Date(result.createdAt).toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          {financialTestData.blocks.map((block) => (
            <div key={block.id} className="mb-10">
              <h2 className="font-display text-xl font-semibold text-foreground mb-1">
                {block.id + 1}. {block.title}
              </h2>
              <p className="text-sm text-primary mb-4">{block.subtitle}</p>

              <div className="space-y-4">
                {block.questions.map((q) => (
                  <div key={q.id} className="bg-card rounded-xl border border-border p-4">
                    <p className="text-sm text-muted-foreground mb-2">{q.text}</p>
                    {renderAnswer(q.id, q.type)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-10 justify-center">
          <Button variant="cta" onClick={handleDownloadPDF} className="gap-2">
            <Download className="w-4 h-4" /> Завантажити PDF
          </Button>
          <Button variant="outline" onClick={handleCopyLink} className="gap-2">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Скопійовано' : 'Поділитися посиланням'}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FinancialTestResult;
