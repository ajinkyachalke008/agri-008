export interface Taluka {
  name: string;
  nameHi: string;
}

export interface District {
  name: string;
  nameHi: string;
  talukas: Taluka[];
}

export const maharashtraDistricts: District[] = [
  {
    name: "Mumbai City",
    nameHi: "मुंबई शहर",
    talukas: [
      { name: "Mumbai City", nameHi: "मुंबई शहर" }
    ]
  },
  {
    name: "Mumbai Suburban",
    nameHi: "मुंबई उपनगर",
    talukas: [
      { name: "Andheri", nameHi: "अंधेरी" },
      { name: "Borivali", nameHi: "बोरिवली" },
      { name: "Kurla", nameHi: "कुर्ला" }
    ]
  },
  {
    name: "Pune",
    nameHi: "पुणे",
    talukas: [
      { name: "Pune City", nameHi: "पुणे शहर" },
      { name: "Haveli", nameHi: "हवेली" },
      { name: "Mulshi", nameHi: "मुळशी" },
      { name: "Maval", nameHi: "मावळ" },
      { name: "Bhor", nameHi: "भोर" },
      { name: "Velhe", nameHi: "वेल्हे" },
      { name: "Baramati", nameHi: "बारामती" },
      { name: "Indapur", nameHi: "इंदापूर" },
      { name: "Daund", nameHi: "दौंड" },
      { name: "Purandhar", nameHi: "पुरंदर" },
      { name: "Shirur", nameHi: "शिरूर" },
      { name: "Khed", nameHi: "खेड" },
      { name: "Junnar", nameHi: "जुन्नर" },
      { name: "Ambegaon", nameHi: "आंबेगाव" }
    ]
  },
  {
    name: "Nagpur",
    nameHi: "नागपूर",
    talukas: [
      { name: "Nagpur Urban", nameHi: "नागपूर शहरी" },
      { name: "Nagpur Rural", nameHi: "नागपूर ग्रामीण" },
      { name: "Kamptee", nameHi: "कांपटी" },
      { name: "Hingna", nameHi: "हिंगणा" },
      { name: "Katol", nameHi: "कटोल" },
      { name: "Narkhed", nameHi: "नरखेड" },
      { name: "Savner", nameHi: "सावनेर" },
      { name: "Kalameshwar", nameHi: "कलमेश्वर" },
      { name: "Ramtek", nameHi: "रामटेक" },
      { name: "Mouda", nameHi: "मौदा" },
      { name: "Parseoni", nameHi: "परसेवनी" },
      { name: "Umred", nameHi: "उमरेड" },
      { name: "Kuhi", nameHi: "कुही" },
      { name: "Bhiwapur", nameHi: "भिवापूर" }
    ]
  },
  {
    name: "Nashik",
    nameHi: "नाशिक",
    talukas: [
      { name: "Nashik", nameHi: "नाशिक" },
      { name: "Igatpuri", nameHi: "इगतपुरी" },
      { name: "Dindori", nameHi: "दिंडोरी" },
      { name: "Peth", nameHi: "पेठ" },
      { name: "Trimbakeshwar", nameHi: "त्र्यंबकेश्वर" },
      { name: "Kalwan", nameHi: "कळवण" },
      { name: "Deola", nameHi: "देवळा" },
      { name: "Surgana", nameHi: "सुरगाणा" },
      { name: "Baglan", nameHi: "बागलाण" },
      { name: "Malegaon", nameHi: "मालेगाव" },
      { name: "Nandgaon", nameHi: "नांदगाव" },
      { name: "Chandwad", nameHi: "चांदवड" },
      { name: "Niphad", nameHi: "निफाड" },
      { name: "Sinnar", nameHi: "सिन्नर" },
      { name: "Yeola", nameHi: "येवला" }
    ]
  },
  {
    name: "Thane",
    nameHi: "ठाणे",
    talukas: [
      { name: "Thane", nameHi: "ठाणे" },
      { name: "Kalyan", nameHi: "कल्याण" },
      { name: "Murbad", nameHi: "मुरबाड" },
      { name: "Bhiwandi", nameHi: "भिवंडी" },
      { name: "Shahapur", nameHi: "शहापूर" },
      { name: "Ulhasnagar", nameHi: "उल्हासनगर" },
      { name: "Ambarnath", nameHi: "अंबरनाथ" }
    ]
  },
  {
    name: "Aurangabad",
    nameHi: "औरंगाबाद",
    talukas: [
      { name: "Aurangabad", nameHi: "औरंगाबाद" },
      { name: "Kannad", nameHi: "कन्नड" },
      { name: "Soegaon", nameHi: "सोयगाव" },
      { name: "Sillod", nameHi: "सिल्लोड" },
      { name: "Phulambri", nameHi: "फुलंब्री" },
      { name: "Khuldabad", nameHi: "खुलदाबाद" },
      { name: "Vaijapur", nameHi: "वैजापूर" },
      { name: "Gangapur", nameHi: "गंगापूर" },
      { name: "Paithan", nameHi: "पैठण" }
    ]
  },
  {
    name: "Solapur",
    nameHi: "सोलापूर",
    talukas: [
      { name: "Solapur North", nameHi: "सोलापूर उत्तर" },
      { name: "Solapur South", nameHi: "सोलापूर दक्षिण" },
      { name: "Barshi", nameHi: "बार्शी" },
      { name: "Madha", nameHi: "माढा" },
      { name: "Karmala", nameHi: "करमाळा" },
      { name: "Pandharpur", nameHi: "पंढरपूर" },
      { name: "Malshiras", nameHi: "माळशिरस" },
      { name: "Mohol", nameHi: "मोहोळ" },
      { name: "Sangole", nameHi: "सांगोला" },
      { name: "Mangalvedhe", nameHi: "मंगळवेढा" },
      { name: "Akkalkot", nameHi: "अक्कलकोट" }
    ]
  },
  {
    name: "Kolhapur",
    nameHi: "कोल्हापूर",
    talukas: [
      { name: "Karvir", nameHi: "करवीर" },
      { name: "Panhala", nameHi: "पन्हाळा" },
      { name: "Shahuwadi", nameHi: "शाहूवाडी" },
      { name: "Kagal", nameHi: "कागल" },
      { name: "Hatkanangle", nameHi: "हातकणंगले" },
      { name: "Shirol", nameHi: "शिरोळ" },
      { name: "Radhanagari", nameHi: "राधानगरी" },
      { name: "Gaganbawada", nameHi: "गगनबवडा" },
      { name: "Bhudargad", nameHi: "भूदरगड" },
      { name: "Gadhinglaj", nameHi: "गडहिंग्लज" },
      { name: "Chandgad", nameHi: "चांदगड" },
      { name: "Ajra", nameHi: "आजरा" }
    ]
  },
  {
    name: "Ahmednagar",
    nameHi: "अहमदनगर",
    talukas: [
      { name: "Ahmednagar", nameHi: "अहमदनगर" },
      { name: "Shevgaon", nameHi: "शेवगाव" },
      { name: "Pathardi", nameHi: "पाठर्डी" },
      { name: "Parner", nameHi: "पारनेर" },
      { name: "Sangamner", nameHi: "सांगमनेर" },
      { name: "Kopargaon", nameHi: "कोपरगाव" },
      { name: "Akole", nameHi: "आकोले" },
      { name: "Shrirampur", nameHi: "श्रीरामपूर" },
      { name: "Nevasa", nameHi: "नेवासा" },
      { name: "Rahata", nameHi: "राहाता" },
      { name: "Rahuri", nameHi: "राहुरी" },
      { name: "Shrigonda", nameHi: "श्रीगोंदा" },
      { name: "Karjat", nameHi: "कर्जत" },
      { name: "Jamkhed", nameHi: "जामखेड" }
    ]
  }
];

export const cropCategories = [
  { value: "cereals", label: "Cereals", labelHi: "अनाज" },
  { value: "pulses", label: "Pulses", labelHi: "दाळी" },
  { value: "vegetables", label: "Vegetables", labelHi: "भाज्या" },
  { value: "fruits", label: "Fruits", labelHi: "फळे" },
  { value: "oilseeds", label: "Oilseeds", labelHi: "तेलबिया" },
  { value: "spices", label: "Spices", labelHi: "मसाले" },
  { value: "cash_crops", label: "Cash Crops", labelHi: "नगदी पिके" },
];

export const storageTypes = [
  { value: "none", label: "No Storage", labelHi: "साठवण नाही" },
  { value: "warehouse", label: "Warehouse", labelHi: "गोदाम" },
  { value: "cold_storage", label: "Cold Storage", labelHi: "कोल्ड स्टोरेज" },
  { value: "cooling_container", label: "Cooling Container", labelHi: "कूलिंग कंटेनर" },
  { value: "grain_silo", label: "Grain Silo", labelHi: "धान्य साठा" },
];

export const units = [
  { value: "quintal", label: "Quintal (100 kg)", labelHi: "क्विंटल (100 किलो)" },
  { value: "kg", label: "Kilogram", labelHi: "किलोग्राम" },
  { value: "ton", label: "Ton (1000 kg)", labelHi: "टन (1000 किलो)" },
];
