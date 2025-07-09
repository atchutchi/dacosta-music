// Exemplo de como adicionar upload de vídeo aos eventos
// Este código pode ser integrado em app/admin/events/page.tsx

import { FileUploader } from "@/components/ui/file-uploader";
import { BUCKET_VIDEOS } from "@/lib/supabase/storage";
import { Label } from "@/components/ui/label";

interface VideoUploadProps {
  videoUrl: string;
  onVideoUploaded: (url: string) => void;
}

export function VideoUpload({ videoUrl, onVideoUploaded }: VideoUploadProps) {
  return (
    <div>
      <Label htmlFor="video">Event Video (Optional)</Label>
      <div className="mt-1">
        <FileUploader
          onFileUploaded={onVideoUploaded}
          currentFileUrl={videoUrl}
          bucket={BUCKET_VIDEOS}
          folder="events"
          acceptedFileTypes="video/*"
          maxSizeMB={100} // 100MB para vídeos
        />
      </div>
      <p className="text-sm text-white/60 mt-1">
        Formatos aceitos: MP4, WebM, MOV. Tamanho máximo: 100MB
      </p>
    </div>
  );
}

// Como usar no formulário de eventos:
// 
// 1. Adicione ao estado do componente:
// const [videoUrl, setVideoUrl] = useState("");
//
// 2. Adicione o campo no formulário:
// <VideoUpload 
//   videoUrl={newEvent.video || ""}
//   onVideoUploaded={(url) => setNewEvent(prev => ({ ...prev, video: url }))}
// />
//
// 3. Certifique-se de incluir o video_url ao salvar no banco de dados 