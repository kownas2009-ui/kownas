import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Send, Loader2, FileText, Paperclip, X } from "lucide-react";
import { z } from "zod";

const noteSchema = z.object({
  title: z.string().trim().min(1, "Tytuł jest wymagany").max(120, "Tytuł max 120 znaków"),
  body: z.string().trim().min(1, "Treść jest wymagana").max(5000, "Treść max 5000 znaków"),
});

interface SendNoteDialogProps {
  studentUserId: string;
  studentName: string;
  onSuccess?: () => void;
  children: React.ReactNode;
}

const SendNoteDialog = ({ studentUserId, studentName, onSuccess, children }: SendNoteDialogProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Max 10MB
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Plik jest za duży (max 10MB)");
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${studentUserId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("note-attachments")
      .upload(fileName, selectedFile);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("Błąd podczas przesyłania pliku");
    }

    const { data: { publicUrl } } = supabase.storage
      .from("note-attachments")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = noteSchema.safeParse({ title, body });
    if (!validation.success) {
      const fieldErrors: { title?: string; body?: string } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0] === "title") fieldErrors.title = err.message;
        if (err.path[0] === "body") fieldErrors.body = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      let fileUrl: string | null = null;
      
      if (selectedFile) {
        fileUrl = await uploadFile();
      }

      const { error } = await (supabase as any)
        .from("student_notes")
        .insert({
          student_user_id: studentUserId,
          created_by_user_id: user!.id,
          title: validation.data.title,
          body: validation.data.body,
          file_url: fileUrl,
        });

      if (error) throw error;

      toast.success("Notatka wysłana!");
      setTitle("");
      setBody("");
      setSelectedFile(null);
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error sending note:", error);
      toast.error("Błąd podczas wysyłania notatki");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Wyślij notatkę
          </DialogTitle>
          <DialogDescription>
            Wyślij notatkę do ucznia: <strong>{studentName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tytuł</label>
            <Input
              placeholder="np. Materiały do następnej lekcji"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              maxLength={120}
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Treść</label>
            <Textarea
              placeholder="Napisz wiadomość dla ucznia..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={isLoading}
              rows={6}
              maxLength={5000}
            />
            {errors.body && (
              <p className="text-sm text-destructive mt-1">{errors.body}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {body.length}/5000
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Załącznik (opcjonalnie)</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading}
            />
            
            {selectedFile ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted border border-border">
                <Paperclip className="w-4 h-4 text-primary" />
                <span className="flex-1 text-sm truncate">{selectedFile.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="w-full"
              >
                <Paperclip className="w-4 h-4 mr-2" />
                Dodaj plik (max 10MB)
              </Button>
            )}
          </div>

          <Button
            type="submit"
            variant="hero"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Wyślij notatkę
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SendNoteDialog;
