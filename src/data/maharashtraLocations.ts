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
  // Mumbai Region (Konkan Division)
  {
    name: "Mumbai City",
    nameHi: "मुंबई शहर",
    talukas: [{ name: "Mumbai City", nameHi: "मुंबई शहर" }]
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
    name: "Palghar",
    nameHi: "पालघर",
    talukas: [
      { name: "Palghar", nameHi: "पालघर" },
      { name: "Vasai", nameHi: "वसई" },
      { name: "Dahanu", nameHi: "डहाणू" },
      { name: "Talasari", nameHi: "तलासरी" },
      { name: "Jawhar", nameHi: "जव्हार" },
      { name: "Mokhada", nameHi: "मोखाडा" },
      { name: "Vikramgad", nameHi: "विक्रमगड" },
      { name: "Wada", nameHi: "वाडा" }
    ]
  },
  {
    name: "Raigad",
    nameHi: "रायगड",
    talukas: [
      { name: "Alibag", nameHi: "अलिबाग" },
      { name: "Pen", nameHi: "पेण" },
      { name: "Panvel", nameHi: "पनवेल" },
      { name: "Uran", nameHi: "उरण" },
      { name: "Karjat", nameHi: "कर्जत" },
      { name: "Khalapur", nameHi: "खालापूर" },
      { name: "Mangaon", nameHi: "मंगाव" },
      { name: "Tala", nameHi: "ताला" },
      { name: "Roha", nameHi: "रोहा" },
      { name: "Sudhagad", nameHi: "सुधागड" },
      { name: "Mahad", nameHi: "महाड" },
      { name: "Poladpur", nameHi: "पोलादपूर" },
      { name: "Shrivardhan", nameHi: "श्रीवर्धन" },
      { name: "Mhasala", nameHi: "म्हसळा" },
      { name: "Murud", nameHi: "मुरुड" }
    ]
  },
  {
    name: "Ratnagiri",
    nameHi: "रत्नागिरी",
    talukas: [
      { name: "Ratnagiri", nameHi: "रत्नागिरी" },
      { name: "Chiplun", nameHi: "चिपळूण" },
      { name: "Khed", nameHi: "खेड" },
      { name: "Guhagar", nameHi: "गुहागर" },
      { name: "Dapoli", nameHi: "दापोली" },
      { name: "Mandangad", nameHi: "मंडणगड" },
      { name: "Sangameshwar", nameHi: "संगमेश्वर" },
      { name: "Lanja", nameHi: "लांजा" },
      { name: "Rajapur", nameHi: "राजापूर" }
    ]
  },
  {
    name: "Sindhudurg",
    nameHi: "सिंधुदुर्ग",
    talukas: [
      { name: "Sawantwadi", nameHi: "सावंतवाडी" },
      { name: "Kudal", nameHi: "कुडाळ" },
      { name: "Vengurla", nameHi: "वेंगुर्ला" },
      { name: "Malvan", nameHi: "मालवण" },
      { name: "Devgad", nameHi: "देवगड" },
      { name: "Kankavli", nameHi: "कणकवली" },
      { name: "Vaibhavwadi", nameHi: "वैभववाडी" },
      { name: "Dodamarg", nameHi: "दोडामार्ग" }
    ]
  },
  // Pune Division
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
    name: "Satara",
    nameHi: "सातारा",
    talukas: [
      { name: "Satara", nameHi: "सातारा" },
      { name: "Karad", nameHi: "कराड" },
      { name: "Wai", nameHi: "वाई" },
      { name: "Mahabaleshwar", nameHi: "महाबळेश्वर" },
      { name: "Patan", nameHi: "पाटण" },
      { name: "Jaoli", nameHi: "जावली" },
      { name: "Koregaon", nameHi: "कोरेगाव" },
      { name: "Khatav", nameHi: "खटाव" },
      { name: "Man", nameHi: "माण" },
      { name: "Phaltan", nameHi: "फलटण" },
      { name: "Khandala", nameHi: "खंडाळा" }
    ]
  },
  {
    name: "Sangli",
    nameHi: "सांगली",
    talukas: [
      { name: "Sangli", nameHi: "सांगली" },
      { name: "Miraj", nameHi: "मिरज" },
      { name: "Tasgaon", nameHi: "तासगाव" },
      { name: "Khanapur", nameHi: "खानापूर" },
      { name: "Atpadi", nameHi: "आटपाडी" },
      { name: "Jat", nameHi: "जत" },
      { name: "Kavathemahankal", nameHi: "कवठेमहांकाल" },
      { name: "Walwa", nameHi: "वाळवा" },
      { name: "Shirala", nameHi: "शिराळा" },
      { name: "Kadegaon", nameHi: "कडेगाव" }
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
  // Nashik Division
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
  },
  {
    name: "Dhule",
    nameHi: "धुळे",
    talukas: [
      { name: "Dhule", nameHi: "धुळे" },
      { name: "Sakri", nameHi: "साक्री" },
      { name: "Sindkheda", nameHi: "सिंदखेडा" },
      { name: "Shirpur", nameHi: "शिरपूर" }
    ]
  },
  {
    name: "Jalgaon",
    nameHi: "जळगाव",
    talukas: [
      { name: "Jalgaon", nameHi: "जळगाव" },
      { name: "Bhusawal", nameHi: "भुसावळ" },
      { name: "Yawal", nameHi: "यावल" },
      { name: "Raver", nameHi: "रावेर" },
      { name: "Muktainagar", nameHi: "मुक्ताईनगर" },
      { name: "Bodwad", nameHi: "बोदवड" },
      { name: "Amalner", nameHi: "अमळनेर" },
      { name: "Parola", nameHi: "पारोळा" },
      { name: "Erandol", nameHi: "एरंडोल" },
      { name: "Dharangaon", nameHi: "धरणगाव" },
      { name: "Chopda", nameHi: "चोपडा" },
      { name: "Pachora", nameHi: "पाचोरा" },
      { name: "Bhadgaon", nameHi: "भडगाव" },
      { name: "Chalisgaon", nameHi: "चाळीसगाव" },
      { name: "Jamner", nameHi: "जामनेर" }
    ]
  },
  {
    name: "Nandurbar",
    nameHi: "नंदुरबार",
    talukas: [
      { name: "Nandurbar", nameHi: "नंदुरबार" },
      { name: "Shahada", nameHi: "शहादा" },
      { name: "Taloda", nameHi: "तळोदा" },
      { name: "Akkalkuwa", nameHi: "अक्कलकुवा" },
      { name: "Akrani", nameHi: "अक्राणी" },
      { name: "Navapur", nameHi: "नवापूर" }
    ]
  },
  // Chhatrapati Sambhajinagar Division (formerly Aurangabad)
  {
    name: "Chhatrapati Sambhajinagar",
    nameHi: "छत्रपती संभाजीनगर",
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
    name: "Beed",
    nameHi: "बीड",
    talukas: [
      { name: "Beed", nameHi: "बीड" },
      { name: "Gevrai", nameHi: "गेवराई" },
      { name: "Majalgaon", nameHi: "माजलगाव" },
      { name: "Wadwani", nameHi: "वडवणी" },
      { name: "Kaij", nameHi: "कैज" },
      { name: "Dharur", nameHi: "धारूर" },
      { name: "Parli", nameHi: "परळी" },
      { name: "Ambejogai", nameHi: "अंबाजोगाई" },
      { name: "Patoda", nameHi: "पाटोदा" },
      { name: "Shirur Kasar", nameHi: "शिरूर कासार" },
      { name: "Ashti", nameHi: "आष्टी" }
    ]
  },
  {
    name: "Jalna",
    nameHi: "जालना",
    talukas: [
      { name: "Jalna", nameHi: "जालना" },
      { name: "Badnapur", nameHi: "बदनापूर" },
      { name: "Ambad", nameHi: "अंबड" },
      { name: "Ghansawangi", nameHi: "घनसावंगी" },
      { name: "Partur", nameHi: "परतूर" },
      { name: "Mantha", nameHi: "मांथा" },
      { name: "Bhokardan", nameHi: "भोकरदन" },
      { name: "Jafrabad", nameHi: "जाफराबाद" }
    ]
  },
  {
    name: "Dharashiv",
    nameHi: "धाराशिव",
    talukas: [
      { name: "Osmanabad", nameHi: "उस्मानाबाद" },
      { name: "Tuljapur", nameHi: "तुळजापूर" },
      { name: "Omerga", nameHi: "उमरगा" },
      { name: "Lohara", nameHi: "लोहारा" },
      { name: "Kallam", nameHi: "कळंब" },
      { name: "Bhoom", nameHi: "भूम" },
      { name: "Paranda", nameHi: "परांडा" },
      { name: "Washi", nameHi: "वाशी" }
    ]
  },
  {
    name: "Nanded",
    nameHi: "नांदेड",
    talukas: [
      { name: "Nanded", nameHi: "नांदेड" },
      { name: "Ardhapur", nameHi: "अर्धापूर" },
      { name: "Mudkhed", nameHi: "मुदखेड" },
      { name: "Bhokar", nameHi: "भोकर" },
      { name: "Umri", nameHi: "उमरी" },
      { name: "Loha", nameHi: "लोहा" },
      { name: "Kandhar", nameHi: "कंधार" },
      { name: "Kinwat", nameHi: "किनवट" },
      { name: "Himayatnagar", nameHi: "हिमायतनगर" },
      { name: "Hadgaon", nameHi: "हदगाव" },
      { name: "Mahur", nameHi: "माहूर" },
      { name: "Deglur", nameHi: "देगलूर" },
      { name: "Mukhed", nameHi: "मुखेड" },
      { name: "Dharmabad", nameHi: "धर्माबाद" },
      { name: "Biloli", nameHi: "बिलोली" },
      { name: "Naigaon", nameHi: "नायगाव" }
    ]
  },
  {
    name: "Latur",
    nameHi: "लातूर",
    talukas: [
      { name: "Latur", nameHi: "लातूर" },
      { name: "Renapur", nameHi: "रेणापूर" },
      { name: "Ausa", nameHi: "औसा" },
      { name: "Nilanga", nameHi: "निलंगा" },
      { name: "Chakur", nameHi: "चाकूर" },
      { name: "Udgir", nameHi: "उदगीर" },
      { name: "Ahmedpur", nameHi: "अहमदपूर" },
      { name: "Jalkot", nameHi: "जळकोट" },
      { name: "Deoni", nameHi: "देवणी" },
      { name: "Shirur Anantpal", nameHi: "शिरूर अनंतपाळ" }
    ]
  },
  {
    name: "Parbhani",
    nameHi: "परभणी",
    talukas: [
      { name: "Parbhani", nameHi: "परभणी" },
      { name: "Gangakhed", nameHi: "गंगाखेड" },
      { name: "Sonpeth", nameHi: "सोनपेठ" },
      { name: "Palam", nameHi: "पालम" },
      { name: "Purna", nameHi: "पूर्णा" },
      { name: "Sailu", nameHi: "सैलू" },
      { name: "Jintur", nameHi: "जिंतूर" },
      { name: "Manwat", nameHi: "मानवत" },
      { name: "Pathri", nameHi: "पाथरी" }
    ]
  },
  {
    name: "Hingoli",
    nameHi: "हिंगोली",
    talukas: [
      { name: "Hingoli", nameHi: "हिंगोली" },
      { name: "Sengaon", nameHi: "सेनगाव" },
      { name: "Kalamnuri", nameHi: "कळमनुरी" },
      { name: "Basmath", nameHi: "बस्मत" },
      { name: "Aundha Nagnath", nameHi: "औंढा नागनाथ" }
    ]
  },
  // Amravati Division
  {
    name: "Amravati",
    nameHi: "अमरावती",
    talukas: [
      { name: "Amravati", nameHi: "अमरावती" },
      { name: "Achalpur", nameHi: "अचलपूर" },
      { name: "Chandurbazar", nameHi: "चांदूरबाजार" },
      { name: "Morshi", nameHi: "मोर्शी" },
      { name: "Warud", nameHi: "वरुड" },
      { name: "Daryapur", nameHi: "दर्यापूर" },
      { name: "Anjangaon Surji", nameHi: "अंजनगाव सुर्जी" },
      { name: "Nandgaon Khandeshwar", nameHi: "नांदगाव खंडेश्वर" },
      { name: "Tiosa", nameHi: "तिवसा" },
      { name: "Bhatkuli", nameHi: "भातकुली" },
      { name: "Chikhaldara", nameHi: "चिखलदरा" },
      { name: "Dharni", nameHi: "धारणी" },
      { name: "Dhamangaon Railway", nameHi: "धामणगाव रेल्वे" },
      { name: "Chandur Railway", nameHi: "चांदूर रेल्वे" }
    ]
  },
  {
    name: "Akola",
    nameHi: "अकोला",
    talukas: [
      { name: "Akola", nameHi: "अकोला" },
      { name: "Akot", nameHi: "अकोट" },
      { name: "Telhara", nameHi: "तेल्हारा" },
      { name: "Balapur", nameHi: "बाळापूर" },
      { name: "Patur", nameHi: "पातूर" },
      { name: "Murtizapur", nameHi: "मूर्तिझापूर" },
      { name: "Barshitakli", nameHi: "बार्शीटाकळी" }
    ]
  },
  {
    name: "Buldhana",
    nameHi: "बुलढाणा",
    talukas: [
      { name: "Buldhana", nameHi: "बुलढाणा" },
      { name: "Chikhli", nameHi: "चिखली" },
      { name: "Deulgaon Raja", nameHi: "देऊळगाव राजा" },
      { name: "Jalgaon Jamod", nameHi: "जळगाव जामोद" },
      { name: "Sangrampur", nameHi: "संग्रामपूर" },
      { name: "Malkapur", nameHi: "मलकापूर" },
      { name: "Motala", nameHi: "मोताळा" },
      { name: "Nandura", nameHi: "नांदुरा" },
      { name: "Khamgaon", nameHi: "खामगाव" },
      { name: "Shegaon", nameHi: "शेगाव" },
      { name: "Mehkar", nameHi: "मेहकर" },
      { name: "Sindkhed Raja", nameHi: "सिंदखेड राजा" },
      { name: "Lonar", nameHi: "लोणार" }
    ]
  },
  {
    name: "Yavatmal",
    nameHi: "यवतमाळ",
    talukas: [
      { name: "Yavatmal", nameHi: "यवतमाळ" },
      { name: "Arni", nameHi: "आर्णी" },
      { name: "Babhulgaon", nameHi: "बाभूळगाव" },
      { name: "Kalamb", nameHi: "कळंब" },
      { name: "Darwha", nameHi: "दारव्हा" },
      { name: "Digras", nameHi: "दिग्रस" },
      { name: "Ner", nameHi: "नेर" },
      { name: "Pusad", nameHi: "पुसद" },
      { name: "Umarkhed", nameHi: "उमरखेड" },
      { name: "Mahagaon", nameHi: "महागाव" },
      { name: "Kelapur", nameHi: "केळापूर" },
      { name: "Ralegaon", nameHi: "राळेगाव" },
      { name: "Ghatanji", nameHi: "घाटंजी" },
      { name: "Wani", nameHi: "वणी" },
      { name: "Maregaon", nameHi: "मारेगाव" },
      { name: "Zari Jamni", nameHi: "झरी जामणी" }
    ]
  },
  {
    name: "Washim",
    nameHi: "वाशिम",
    talukas: [
      { name: "Washim", nameHi: "वाशिम" },
      { name: "Risod", nameHi: "रिसोड" },
      { name: "Malegaon", nameHi: "मालेगाव" },
      { name: "Mangrulpir", nameHi: "मंगरूळपीर" },
      { name: "Karanja", nameHi: "कारंजा" },
      { name: "Manora", nameHi: "मानोरा" }
    ]
  },
  // Nagpur Division
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
    name: "Wardha",
    nameHi: "वर्धा",
    talukas: [
      { name: "Wardha", nameHi: "वर्धा" },
      { name: "Deoli", nameHi: "देवळी" },
      { name: "Seloo", nameHi: "सेलू" },
      { name: "Arvi", nameHi: "आर्वी" },
      { name: "Ashti", nameHi: "आष्टी" },
      { name: "Karanja", nameHi: "कारंजा" },
      { name: "Hinganghat", nameHi: "हिंगणघाट" },
      { name: "Samudrapur", nameHi: "समुद्रपूर" }
    ]
  },
  {
    name: "Bhandara",
    nameHi: "भंडारा",
    talukas: [
      { name: "Bhandara", nameHi: "भंडारा" },
      { name: "Tumsar", nameHi: "तुमसर" },
      { name: "Pauni", nameHi: "पवनी" },
      { name: "Mohadi", nameHi: "मोहाडी" },
      { name: "Sakoli", nameHi: "साकोली" },
      { name: "Lakhni", nameHi: "लाखनी" },
      { name: "Lakhandur", nameHi: "लाखांदूर" }
    ]
  },
  {
    name: "Gondia",
    nameHi: "गोंदिया",
    talukas: [
      { name: "Gondia", nameHi: "गोंदिया" },
      { name: "Goregaon", nameHi: "गोरेगाव" },
      { name: "Tirora", nameHi: "तिरोडा" },
      { name: "Amgaon", nameHi: "आमगाव" },
      { name: "Arjuni Morgaon", nameHi: "अर्जुनी मोरगाव" },
      { name: "Salekasa", nameHi: "सालेकसा" },
      { name: "Sadak Arjuni", nameHi: "सडक अर्जुनी" },
      { name: "Deori", nameHi: "देवरी" }
    ]
  },
  {
    name: "Chandrapur",
    nameHi: "चंद्रपूर",
    talukas: [
      { name: "Chandrapur", nameHi: "चंद्रपूर" },
      { name: "Bhadravati", nameHi: "भद्रावती" },
      { name: "Warora", nameHi: "वरोरा" },
      { name: "Chimur", nameHi: "चिमूर" },
      { name: "Nagbhid", nameHi: "नागभीड" },
      { name: "Bramhapuri", nameHi: "ब्रह्मपुरी" },
      { name: "Sindewahi", nameHi: "सिंदेवाही" },
      { name: "Mul", nameHi: "मूल" },
      { name: "Saoli", nameHi: "सावली" },
      { name: "Gondpipri", nameHi: "गोंडपिपरी" },
      { name: "Pombhurna", nameHi: "पोंभुर्णा" },
      { name: "Rajura", nameHi: "राजुरा" },
      { name: "Korpana", nameHi: "कोरपना" },
      { name: "Jiwati", nameHi: "जिवती" },
      { name: "Ballarpur", nameHi: "बल्लारपूर" }
    ]
  },
  {
    name: "Gadchiroli",
    nameHi: "गडचिरोली",
    talukas: [
      { name: "Gadchiroli", nameHi: "गडचिरोली" },
      { name: "Dhanora", nameHi: "धानोरा" },
      { name: "Chamorshi", nameHi: "चामोर्शी" },
      { name: "Mulchera", nameHi: "मुलचेरा" },
      { name: "Desaiganj", nameHi: "देसाईगंज" },
      { name: "Armori", nameHi: "आरमोरी" },
      { name: "Kurkheda", nameHi: "कुरखेडा" },
      { name: "Korchi", nameHi: "कोर्ची" },
      { name: "Aheri", nameHi: "आहेरी" },
      { name: "Etapalli", nameHi: "एटापल्ली" },
      { name: "Bhamragad", nameHi: "भामरागड" },
      { name: "Sironcha", nameHi: "सिरोंचा" }
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
