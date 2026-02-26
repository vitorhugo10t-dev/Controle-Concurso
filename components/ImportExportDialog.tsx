'use client';

import { useRef, useState } from 'react';
import { Download, RefreshCcw, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useStudyStore } from '@/store/useStudyStore';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export function ImportExportDialog() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [feedback, setFeedback] = useState('');
  const [open, setOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const exportData = useStudyStore((state) => state.exportData);
  const importData = useStudyStore((state) => state.importData);
  const resetData = useStudyStore((state) => state.resetData);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(exportData(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'controle-estudos.json';
    anchor.click();
    URL.revokeObjectURL(url);
    setFeedback('Exportação concluída.');
  };

  const handleImport = async (file: File) => {
    const raw = await file.text();
    try {
      const parsed = JSON.parse(raw) as unknown;
      const result = importData(parsed);
      setFeedback(result.success ? 'Importação concluída.' : `Erro: ${result.error}`);
    } catch {
      setFeedback('Erro: JSON inválido.');
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Importar / Exportar</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dados</DialogTitle>
            <DialogDescription>Faça backup, restaure ou reset os dados locais.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <Button onClick={handleExport} className="justify-start">
              <Download className="mr-2 h-4 w-4" />
              Exportar JSON
            </Button>
            <Button variant="outline" onClick={() => inputRef.current?.click()} className="justify-start">
              <Upload className="mr-2 h-4 w-4" />
              Importar JSON
            </Button>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept="application/json"
              aria-label="Importar arquivo JSON"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleImport(file);
                }
                event.target.value = '';
              }}
            />
            <Button variant="destructive" onClick={() => setConfirmResetOpen(true)} className="justify-start">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Resetar dados
            </Button>
            {feedback && <p className="text-sm text-muted-foreground">{feedback}</p>}
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={confirmResetOpen}
        onOpenChange={setConfirmResetOpen}
        title="Resetar dados"
        description="Todos os dados salvos localmente serão substituídos pelo seed inicial."
        onConfirm={() => {
          resetData();
          setFeedback('Dados resetados com sucesso.');
        }}
        confirmText="Resetar"
      />
    </>
  );
}
