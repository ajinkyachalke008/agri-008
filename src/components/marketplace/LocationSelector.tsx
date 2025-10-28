import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { maharashtraDistricts } from "@/data/maharashtraLocations";
import { useLanguage } from "@/contexts/LanguageContext";

interface LocationSelectorProps {
  district: string;
  taluka: string;
  onDistrictChange: (value: string) => void;
  onTalukaChange: (value: string) => void;
}

export const LocationSelector = ({
  district,
  taluka,
  onDistrictChange,
  onTalukaChange,
}: LocationSelectorProps) => {
  const { language } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState(district);

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    onDistrictChange(value);
    onTalukaChange(""); // Reset taluka when district changes
  };

  const talukas = maharashtraDistricts.find(d => d.name === selectedDistrict)?.talukas || [];

  return (
    <div className="space-y-4">
      <div>
        <Label>
          {language === 'mr' ? 'जिल्हा' : 'District'} <span className="text-destructive">*</span>
        </Label>
        <Select value={district} onValueChange={handleDistrictChange}>
          <SelectTrigger>
            <SelectValue placeholder={language === 'mr' ? 'जिल्हा निवडा' : 'Select District'} />
          </SelectTrigger>
          <SelectContent className="bg-background">
            {maharashtraDistricts.map((d) => (
              <SelectItem key={d.name} value={d.name}>
                {language === 'mr' ? d.nameHi : d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedDistrict && (
        <div>
          <Label>
            {language === 'mr' ? 'तालुका' : 'Taluka'}
          </Label>
          <Select value={taluka} onValueChange={onTalukaChange}>
            <SelectTrigger>
              <SelectValue placeholder={language === 'mr' ? 'तालुका निवडा' : 'Select Taluka'} />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {talukas.map((t) => (
                <SelectItem key={t.name} value={t.name}>
                  {language === 'mr' ? t.nameHi : t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
