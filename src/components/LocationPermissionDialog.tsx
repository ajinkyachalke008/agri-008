import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LocationPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAllow: () => void;
}

const LocationPermissionDialog = ({
  open,
  onOpenChange,
  onAllow,
}: LocationPermissionDialogProps) => {
  const { t } = useLanguage();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-card">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <AlertDialogTitle className="text-lg">
              {t('permission.location.title')}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            {t('permission.location.body')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="btn-secondary">
            {t('permission.location.deny')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onAllow} className="btn-primary">
            {t('permission.location.allow')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LocationPermissionDialog;
