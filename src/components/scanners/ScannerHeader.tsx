import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface ScannerHeaderProps {
  title: string;
}

const ScannerHeader = ({ title }: ScannerHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="glass-card p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default ScannerHeader;
