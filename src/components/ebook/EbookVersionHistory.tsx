import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { History, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Version {
  id: string;
  version_number: number;
  title: string;
  created_at: string;
}

interface EbookVersionHistoryProps {
  projectId: string;
  onRestore: (versionId: string) => Promise<void>;
  loadVersions: (projectId: string) => Promise<Version[]>;
  onSaveVersion: () => Promise<void>;
}

export function EbookVersionHistory({ 
  projectId, 
  onRestore, 
  loadVersions,
  onSaveVersion 
}: EbookVersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingVersion, setIsSavingVersion] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && projectId) {
      loadVersionHistory();
    }
  }, [open, projectId]);

  const loadVersionHistory = async () => {
    setIsLoading(true);
    try {
      const data = await loadVersions(projectId);
      setVersions(data);
    } catch (error) {
      console.error("Error loading versions:", error);
      toast.error("Erreur lors du chargement des versions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (versionId: string) => {
    try {
      await onRestore(versionId);
      setOpen(false);
    } catch (error) {
      console.error("Error restoring version:", error);
      toast.error("Erreur lors de la restauration");
    }
  };

  const handleSaveVersion = async () => {
    setIsSavingVersion(true);
    try {
      await onSaveVersion();
      await loadVersionHistory();
    } catch (error) {
      console.error("Error saving version:", error);
      toast.error("Erreur lors de la sauvegarde de la version");
    } finally {
      setIsSavingVersion(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="h-4 w-4 mr-2" />
          Historique
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Historique des versions</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Button 
            onClick={handleSaveVersion} 
            disabled={isSavingVersion}
            className="w-full"
          >
            {isSavingVersion ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sauvegarde en cours...
              </>
            ) : (
              "Créer une nouvelle version"
            )}
          </Button>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : versions.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              Aucune version sauvegardée pour ce projet
            </Card>
          ) : (
            <div className="space-y-2">
              {versions.map((version) => (
                <Card key={version.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">
                        Version {version.version_number}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {version.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(version.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(version.id)}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restaurer
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
