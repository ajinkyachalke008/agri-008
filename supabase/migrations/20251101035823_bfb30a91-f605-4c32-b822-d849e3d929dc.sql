-- Create enum for scheme categories
CREATE TYPE public.scheme_category AS ENUM (
  'crop_insurance',
  'irrigation',
  'machinery',
  'financial_aid',
  'soil_health',
  'renewable_energy'
);

CREATE TYPE public.scheme_type AS ENUM ('central', 'state', 'district');

CREATE TYPE public.interaction_type AS ENUM ('viewed', 'bookmarked', 'applied', 'inquired');

-- Create government_schemes table
CREATE TABLE public.government_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_name TEXT NOT NULL,
  scheme_name_mr TEXT NOT NULL,
  category public.scheme_category NOT NULL,
  subcategory TEXT,
  description TEXT NOT NULL,
  description_mr TEXT NOT NULL,
  benefits JSONB NOT NULL,
  benefits_mr JSONB NOT NULL,
  eligibility_criteria JSONB NOT NULL,
  eligibility_criteria_mr JSONB NOT NULL,
  application_process TEXT NOT NULL,
  application_process_mr TEXT NOT NULL,
  required_documents JSONB NOT NULL,
  required_documents_mr JSONB NOT NULL,
  application_link TEXT,
  scheme_type public.scheme_type NOT NULL,
  state TEXT NOT NULL DEFAULT 'Maharashtra',
  districts JSONB,
  target_beneficiary TEXT[] NOT NULL,
  tags TEXT[] NOT NULL,
  amount_min NUMERIC,
  amount_max NUMERIC,
  is_active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  contact_info JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on government_schemes
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;

-- Public read access to active schemes
CREATE POLICY "Anyone can view active schemes"
  ON public.government_schemes
  FOR SELECT
  USING (is_active = true);

-- Create user_scheme_interactions table
CREATE TABLE public.user_scheme_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scheme_id UUID REFERENCES public.government_schemes(id) ON DELETE CASCADE NOT NULL,
  interaction_type public.interaction_type NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on user_scheme_interactions
ALTER TABLE public.user_scheme_interactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own interactions
CREATE POLICY "Users can view their own interactions"
  ON public.user_scheme_interactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own interactions
CREATE POLICY "Users can insert their own interactions"
  ON public.user_scheme_interactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own interactions
CREATE POLICY "Users can update their own interactions"
  ON public.user_scheme_interactions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own interactions
CREATE POLICY "Users can delete their own interactions"
  ON public.user_scheme_interactions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create scheme_recommendations table
CREATE TABLE public.scheme_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scheme_id UUID REFERENCES public.government_schemes(id) ON DELETE CASCADE NOT NULL,
  relevance_score NUMERIC NOT NULL CHECK (relevance_score >= 0 AND relevance_score <= 100),
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on scheme_recommendations
ALTER TABLE public.scheme_recommendations ENABLE ROW LEVEL SECURITY;

-- Users can view their own recommendations
CREATE POLICY "Users can view their own recommendations"
  ON public.scheme_recommendations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_government_schemes_updated_at
  BEFORE UPDATE ON public.government_schemes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed data: Central Government Schemes
INSERT INTO public.government_schemes (
  scheme_name, scheme_name_mr, category, subcategory, description, description_mr,
  benefits, benefits_mr, eligibility_criteria, eligibility_criteria_mr,
  application_process, application_process_mr, required_documents, required_documents_mr,
  application_link, scheme_type, target_beneficiary, tags,
  amount_min, amount_max, is_active, contact_info
) VALUES
(
  'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
  'पीएम-किसान (प्रधानमंत्री किसान सम्मान निधी)',
  'financial_aid',
  'Direct Income Support',
  'Direct income support of ₹6,000 per year to all farmer families in three equal installments of ₹2,000 each.',
  'सर्व शेतकरी कुटुंबांना दरवर्षी ₹६,००० ची प्रत्यक्ष आर्थिक मदत तीन समान हप्त्यांमध्ये ₹२,००० प्रत्येकी.',
  '["₹6,000 per year direct benefit transfer", "Paid in 3 installments of ₹2,000", "Direct to bank account", "No middlemen involved"]',
  '["दरवर्षी ₹६,००० थेट लाभ हस्तांतरण", "₹२,००० च्या ३ हप्त्यांमध्ये", "थेट बँक खात्यात", "कोणतेही मध्यस्थ नाहीत"]',
  '["Must be a farmer family", "Must own cultivable land", "Name in land records", "Valid Aadhaar card"]',
  '["शेतकरी कुटुंब असणे आवश्यक", "लागवडीयोग्य जमीन मालकी असणे आवश्यक", "जमीन नोंदीत नाव", "वैध आधार कार्ड"]',
  'Visit PM-KISAN portal, fill online form, upload documents, submit. Verification done by local authorities.',
  'पीएम-किसान पोर्टल भेट द्या, ऑनलाइन फॉर्म भरा, कागदपत्रे अपलोड करा, सबमिट करा. स्थानिक अधिकाऱ्यांद्वारे पडताळणी केली जाते.',
  '["Aadhaar Card", "Bank Account Details", "Land Ownership Documents", "Passport Size Photo"]',
  '["आधार कार्ड", "बँक खाते तपशील", "जमीन मालकी कागदपत्रे", "पासपोर्ट आकाराचे फोटो"]',
  'https://pmkisan.gov.in/',
  'central',
  ARRAY['landholder', 'small_farmer'],
  ARRAY['income support', 'direct benefit', 'PM-KISAN', 'cash transfer'],
  2000, 6000, true,
  '{"phone": "011-23381092", "email": "pmkisan-ict@gov.in", "helpline": "155261"}'::jsonb
),
(
  'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
  'पीएमएफबीवाय (प्रधानमंत्री फसल बीमा योजना)',
  'crop_insurance',
  'Comprehensive Crop Insurance',
  'Comprehensive crop insurance scheme covering all stages of crop cycle including post-harvest losses. Provides financial support in case of crop loss.',
  'पीक चक्राच्या सर्व टप्प्यांचा समावेश असलेली सर्वसमावेशक पीक विमा योजना, कापणीनंतरच्या नुकसानासह. पीक नुकसान झाल्यास आर्थिक सहाय्य प्रदान करते.',
  '["Coverage for all non-preventable natural risks", "Low premium rates (1.5% to 5%)", "Quick claim settlement", "Technology-based assessment", "Post-harvest coverage"]',
  '["सर्व अटळ नैसर्गिक धोक्यांसाठी संरक्षण", "कमी प्रीमियम दर (१.५% ते ५%)", "जलद दावा निपटारा", "तंत्रज्ञान-आधारित मूल्यांकन", "कापणीनंतर संरक्षण"]',
  '["Farmer with insurable interest in crop", "Must be cultivating notified crops", "Land ownership or tenancy proof", "Enrolled in previous season or new farmer"]',
  '["पिकात विमायोग्य हित असलेला शेतकरी", "अधिसूचित पिके लागवड करत असणे आवश्यक", "जमीन मालकी किंवा भाडेकरू पुरावा", "मागील हंगामात नोंदणीकृत किंवा नवीन शेतकरी"]',
  'Contact local agriculture office or bank, fill application form, pay premium, get policy document.',
  'स्थानिक कृषी कार्यालय किंवा बँकेशी संपर्क साधा, अर्ज भरा, प्रीमियम भरा, पॉलिसी कागदपत्र मिळवा.',
  '["Land Records (7/12 extract)", "Aadhaar Card", "Bank Account Details", "Sowing Certificate", "Crop Details"]',
  '["जमीन नोंदी (७/१२ उतारा)", "आधार कार्ड", "बँक खाते तपशील", "पेरणी प्रमाणपत्र", "पीक तपशील"]',
  'https://pmfby.gov.in/',
  'central',
  ARRAY['landholder', 'tenant', 'small_farmer'],
  ARRAY['crop insurance', 'PMFBY', 'risk coverage', 'natural disaster', 'weather'],
  NULL, NULL, true,
  '{"phone": "011-23382012", "email": "pmfby@gov.in", "tollfree": "18001801551"}'::jsonb
),
(
  'PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)',
  'पीएम-कुसुम (प्रधानमंत्री किसान ऊर्जा सुरक्षा एवम उत्थान महाभियान)',
  'renewable_energy',
  'Solar Pump Installation',
  'Financial assistance for installation of solar pumps and grid-connected solar power plants. Helps reduce electricity costs and provides additional income.',
  'सोलर पंप आणि ग्रिड-कनेक्टेड सौर ऊर्जा प्रकल्प स्थापनेसाठी आर्थिक सहाय्य. वीज खर्च कमी करण्यास आणि अतिरिक्त उत्पन्न प्रदान करण्यास मदत करते.',
  '["90% subsidy for solar pumps", "Reduce electricity bills", "Sell surplus power to grid", "Environment friendly", "25-year warranty on panels"]',
  '["सौर पंपासाठी ९०% अनुदान", "वीज बिले कमी करा", "अतिरिक्त वीज ग्रीडला विका", "पर्यावरणपूरक", "पॅनल्सवर २५ वर्षांची हमी"]',
  '["Individual farmers", "Group of farmers/FPO/Cooperative", "Must have own or leased land", "Water source availability", "Grid connectivity for Component-C"]',
  '["वैयक्तिक शेतकरी", "शेतकऱ्यांचा गट/FPO/सहकारी", "स्वतःची किंवा भाडेतत्वावरील जमीन असणे आवश्यक", "पाणी स्रोत उपलब्धता", "घटक-C साठी ग्रीड कनेक्टिव्हिटी"]',
  'Apply through state nodal agency, document verification, technical feasibility check, installation by empaneled vendor.',
  'राज्य नोडल एजन्सीद्वारे अर्ज करा, कागदपत्र पडताळणी, तांत्रिक व्यवहार्यता तपासणी, सूचीबद्ध विक्रेत्याद्वारे स्थापना.',
  '["Land Documents", "Identity Proof", "Bank Account Details", "Water Source Certificate", "Electricity Bill (if applicable)"]',
  '["जमीन कागदपत्रे", "ओळख पुरावा", "बँक खाते तपशील", "पाणी स्रोत प्रमाणपत्र", "वीज बिल (लागू असल्यास)"]',
  'https://pmkusum.mnre.gov.in/',
  'central',
  ARRAY['landholder', 'small_farmer', 'tenant'],
  ARRAY['solar energy', 'renewable', 'irrigation', 'electricity', 'subsidy'],
  NULL, NULL, true,
  '{"phone": "011-24361298", "email": "kusum.mnre@gov.in"}'::jsonb
),
(
  'Kisan Credit Card (KCC)',
  'किसान क्रेडिट कार्ड (KCC)',
  'financial_aid',
  'Agricultural Credit',
  'Provides adequate and timely credit support to farmers for comprehensive credit needs including crop production, post-harvest expenses, and asset maintenance.',
  'पीक उत्पादन, कापणीनंतरचे खर्च आणि मालमत्ता देखभाल यासह सर्वसमावेशक पत क्रेडिट गरजांसाठी शेतकऱ्यांना पुरेसा आणि वेळेवर क्रेडिट आधार प्रदान करते.',
  '["Interest subsidy of 2%", "Flexible repayment", "No collateral up to ₹1.6 lakh", "Covers crop production and allied activities", "Insurance coverage included"]',
  '["२% व्याज सवलत", "लवचिक परतफेड", "₹१.६ लाख पर्यंत कोणतीही तारण नाही", "पीक उत्पादन आणि संबंधित क्रियाकलाप समाविष्ट", "विमा संरक्षण समाविष्ट"]',
  '["Farmers - individual/joint borrowers", "Tenant farmers, oral lessees", "SHGs or JLGs of farmers", "Land ownership or valid tenancy agreement"]',
  '["शेतकरी - वैयक्तिक/संयुक्त कर्जदार", "भाडेकरू शेतकरी, तोंडी भाडेकरू", "शेतकऱ्यांचे SHG किंवा JLG", "जमीन मालकी किंवा वैध भाडेकरार"]',
  'Visit nearest bank branch, submit application with documents, bank assessment, KCC issuance.',
  'जवळच्या बँक शाखेला भेट द्या, कागदपत्रांसह अर्ज सबमिट करा, बँक मूल्यांकन, KCC जारी करणे.',
  '["Identity Proof (Aadhaar/Voter ID)", "Address Proof", "Land Documents (7/12)", "Passport Photo", "Income Certificate"]',
  '["ओळख पुरावा (आधार/मतदार ओळखपत्र)", "पत्ता पुरावा", "जमीन कागदपत्रे (७/१२)", "पासपोर्ट फोटो", "उत्पन्न प्रमाणपत्र"]',
  'https://www.nabard.org/content1.aspx?id=570',
  'central',
  ARRAY['landholder', 'tenant', 'small_farmer'],
  ARRAY['credit', 'loan', 'KCC', 'finance', 'subsidy'],
  NULL, 1600000, true,
  '{"phone": "022-26539895", "email": "kcc@nabard.org"}'::jsonb
),
(
  'Soil Health Card Scheme',
  'माती आरोग्य कार्ड योजना',
  'soil_health',
  'Soil Testing and Management',
  'Provides soil health cards to farmers with information on nutrient status and fertilizer recommendations for improving soil health and crop productivity.',
  'माती आरोग्य सुधारण्यासाठी आणि पीक उत्पादकता वाढविण्यासाठी पोषक स्थिती आणि खत शिफारसींची माहिती असलेली माती आरोग्य कार्डे शेतकऱ्यांना प्रदान करते.',
  '["Free soil testing", "Customized fertilizer recommendations", "Reduce input costs", "Improve soil health", "Increase crop yield", "Digital access to reports"]',
  '["मोफत माती चाचणी", "सानुकूलित खत शिफारसी", "इनपुट खर्च कमी करा", "माती आरोग्य सुधारा", "पीक उत्पन्न वाढवा", "अहवालांसाठी डिजिटल प्रवेश"]',
  '["All farmers", "Must register with local agriculture office", "Provide land details", "Sample collection by officials or self"]',
  '["सर्व शेतकरी", "स्थानिक कृषी कार्यालयात नोंदणी करणे आवश्यक", "जमीन तपशील प्रदान करा", "अधिकाऱ्यांद्वारे किंवा स्वतः नमुना संकलन"]',
  'Contact local agriculture department, register for soil testing, provide land details, collect sample, submit for testing, receive soil health card.',
  'स्थानिक कृषी विभागाशी संपर्क साधा, माती चाचणीसाठी नोंदणी करा, जमीन तपशील प्रदान करा, नमुना गोळा करा, चाचणीसाठी सबमिट करा, माती आरोग्य कार्ड प्राप्त करा.',
  '["Land Records", "Aadhaar Card", "Contact Number", "Soil Sample (as per guidelines)"]',
  '["जमीन नोंदी", "आधार कार्ड", "संपर्क क्रमांक", "माती नमुना (मार्गदर्शक तत्त्वांनुसार)"]',
  'https://soilhealth.dac.gov.in/',
  'central',
  ARRAY['landholder', 'tenant', 'small_farmer'],
  ARRAY['soil testing', 'soil health', 'fertilizer', 'productivity', 'free service'],
  NULL, NULL, true,
  '{"phone": "011-23073734", "email": "shm.dac@gov.in"}'::jsonb
),
(
  'Paramparagat Krishi Vikas Yojana (PKVY)',
  'परंपरागत कृषी विकास योजना (PKVY)',
  'soil_health',
  'Organic Farming',
  'Promotes organic farming through cluster-based approach. Provides financial assistance for organic inputs, certification, and marketing.',
  'क्लस्टर-आधारित दृष्टिकोनाद्वारे सेंद्रिय शेतीला प्रोत्साहन देते. सेंद्रिय इनपुट, प्रमाणीकरण आणि विपणनासाठी आर्थिक सहाय्य प्रदान करते.',
  '["₹50,000 per hectare for 3 years", "Organic certification support", "Training and capacity building", "Market linkage assistance", "Better prices for organic produce"]',
  '["३ वर्षांसाठी प्रति हेक्टर ₹५०,०००", "सेंद्रिय प्रमाणीकरण समर्थन", "प्रशिक्षण आणि क्षमता निर्माण", "बाजार संबंध सहाय्य", "सेंद्रिय उत्पादनांसाठी चांगल्या किमती"]',
  '["Farmers willing to adopt organic farming", "Minimum cluster size: 50 acres (20 hectares)", "Group of farmers or FPO", "Land must be free from chemical use"]',
  '["सेंद्रिय शेती स्वीकारण्यास इच्छुक शेतकरी", "किमान क्लस्टर आकार: ५० एकर (२० हेक्टर)", "शेतकऱ्यांचा गट किंवा FPO", "जमीन रासायनिक वापरापासून मुक्त असणे आवश्यक"]',
  'Form farmer group, submit proposal through state agriculture department, approval by screening committee, implementation and monitoring.',
  'शेतकरी गट तयार करा, राज्य कृषी विभागामार्फत प्रस्ताव सबमिट करा, पडताळणी समितीकडून मंजूरी, अंमलबजावणी आणि देखरेख.',
  '["Group Formation Document", "Land Records of all farmers", "NOC from landowners", "Organic Farming Plan", "Bank Details of Group"]',
  '["गट निर्मिती कागदपत्र", "सर्व शेतकऱ्यांच्या जमीन नोंदी", "जमीन मालकांकडून NOC", "सेंद्रिय शेती योजना", "गटाचे बँक तपशील"]',
  'https://pgsindia-ncof.gov.in/',
  'central',
  ARRAY['landholder', 'small_farmer', 'tenant'],
  ARRAY['organic farming', 'sustainable agriculture', 'certification', 'subsidy', 'cluster'],
  50000, 150000, true,
  '{"phone": "011-23073734", "email": "pkvy.dac@gov.in"}'::jsonb
);

-- Maharashtra State Schemes
INSERT INTO public.government_schemes (
  scheme_name, scheme_name_mr, category, subcategory, description, description_mr,
  benefits, benefits_mr, eligibility_criteria, eligibility_criteria_mr,
  application_process, application_process_mr, required_documents, required_documents_mr,
  application_link, scheme_type, target_beneficiary, tags,
  amount_min, amount_max, is_active, contact_info
) VALUES
(
  'Baliraja Free Electricity Scheme',
  'बलिराजा मोफत वीज योजना',
  'renewable_energy',
  'Electricity Subsidy',
  'Provides free electricity to agricultural pump connections in Maharashtra. Day-time farming encouraged to utilize solar power.',
  'महाराष्ट्रातील कृषी पंप कनेक्शनसाठी मोफत वीज प्रदान करते. सौर ऊर्जा वापरासाठी दिवसा शेती प्रोत्साहित केली जाते.',
  '["Free electricity for agricultural use", "Day-time power supply", "Reduced farming costs", "Sustainable energy usage", "Priority for small farmers"]',
  '["कृषी वापरासाठी मोफत वीज", "दिवसा वीज पुरवठा", "शेती खर्च कमी", "शाश्वत ऊर्जा वापर", "लहान शेतकऱ्यांना प्राधान्य"]',
  '["Farmers in Maharashtra", "Must have agricultural pump connection", "Land ownership proof", "Valid electricity connection"]',
  '["महाराष्ट्रातील शेतकरी", "कृषी पंप कनेक्शन असणे आवश्यक", "जमीन मालकी पुरावा", "वैध वीज कनेक्शन"]',
  'Apply through MSEDCL office, submit land documents and electricity connection details, verification and approval.',
  'MSEDCL कार्यालयामार्फत अर्ज करा, जमीन कागदपत्रे आणि वीज कनेक्शन तपशील सबमिट करा, पडताळणी आणि मंजूरी.',
  '["7/12 Extract", "8A Document", "Electricity Bill", "Aadhaar Card", "Bank Details"]',
  '["७/१२ उतारा", "८अ कागदपत्र", "वीज बिल", "आधार कार्ड", "बँक तपशील"]',
  'https://www.mahadiscom.in/',
  'state',
  ARRAY['landholder', 'small_farmer'],
  ARRAY['electricity', 'subsidy', 'Maharashtra', 'pump', 'solar'],
  NULL, NULL, true,
  '{"phone": "022-26561391", "email": "info@mahadiscom.in"}'::jsonb
),
(
  'Jalyukt Shivar Abhiyan',
  'जलयुक्त शिवार अभियान',
  'irrigation',
  'Water Conservation',
  'Makes villages water-sufficient through water conservation and watershed management. Focus on sustainable water management for agriculture.',
  'पाणी संवर्धन आणि पाणलोट व्यवस्थापनाद्वारे गावे पाणीपुरवठा करते. शेतीसाठी शाश्वत जल व्यवस्थापनावर लक्ष केंद्रित करते.',
  '["Village-level water conservation", "Farm pond construction support", "Desilting of water bodies", "Increased water availability", "Improved groundwater levels"]',
  '["गाव पातळीवर जल संवर्धन", "शेततळे बांधकामास समर्थन", "जलस्रोत गाळ काढणे", "पाण्याची उपलब्धता वाढली", "भूजल पातळी सुधारली"]',
  '["Villages in drought-prone areas", "Farmer groups or gram panchayat", "Must have identified water conservation structures", "Community participation required"]',
  '["दुष्काळग्रस्त भागातील गावे", "शेतकरी गट किंवा ग्रामपंचायत", "ओळखलेल्या जल संवर्धन संरचना असणे आवश्यक", "समुदाय सहभाग आवश्यक"]',
  'Village proposal through gram panchayat, submit to district administration, technical approval, implementation by beneficiary committee.',
  'ग्रामपंचायतीमार्फत गाव प्रस्ताव, जिल्हा प्रशासनाला सबमिट करा, तांत्रिक मंजूरी, लाभार्थी समितीद्वारे अंमलबजावणी.',
  '["Village Resolution", "Site Survey Report", "Cost Estimate", "Beneficiary List", "Bank Details of Committee"]',
  '["गाव ठराव", "साइट सर्वेक्षण अहवाल", "खर्चाचा अंदाज", "लाभार्थी यादी", "समितीचे बँक तपशील"]',
  'https://www.maharashtra.gov.in/jalyukt-shivar',
  'state',
  ARRAY['landholder', 'small_farmer', 'tenant'],
  ARRAY['water conservation', 'irrigation', 'Maharashtra', 'farm pond', 'watershed'],
  NULL, NULL, true,
  '{"phone": "020-26127301", "email": "jalyukt@maharashtra.gov.in"}'::jsonb
),
(
  'Maharashtra Agri Business Network (ABN)',
  'महाराष्ट्र कृषी व्यवसाय नेटवर्क (ABN)',
  'financial_aid',
  'Market Linkage',
  'Connects farmers directly with buyers, provides market information, facilitates better price realization through organized marketing.',
  'शेतकऱ्यांना थेट खरेदीदारांशी जोडते, बाजार माहिती प्रदान करते, संघटित विपणनाद्वारे चांगल्या किमतीची जाणीव सुलभ करते.',
  '["Direct market access", "Better price realization", "Reduced middlemen", "Quality grading support", "Storage facility linkage"]',
  '["थेट बाजार प्रवेश", "चांगली किंमत प्राप्ती", "मध्यस्थ कमी", "गुणवत्ता श्रेणी समर्थन", "साठवण सुविधा संबंध"]',
  '["Farmers in Maharashtra", "Must produce marketable surplus", "Registration required", "Quality produce standards to be met"]',
  '["महाराष्ट्रातील शेतकरी", "विक्री करण्यायोग्य अतिरिक्त उत्पादन असणे आवश्यक", "नोंदणी आवश्यक", "गुणवत्ता उत्पादन मानके पूर्ण करणे"]',
  'Register on ABN portal, upload produce details, connect with buyers, agree on prices, arrange logistics.',
  'ABN पोर्टलवर नोंदणी करा, उत्पादन तपशील अपलोड करा, खरेदीदारांशी संपर्क साधा, किमतींवर सहमत व्हा, लॉजिस्टिक्सची व्यवस्था करा.',
  '["Aadhaar Card", "Land Records", "Bank Account", "Mobile Number", "Produce Photos"]',
  '["आधार कार्ड", "जमीन नोंदी", "बँक खाते", "मोबाईल नंबर", "उत्पादन फोटो"]',
  'https://abn.maharashtra.gov.in/',
  'state',
  ARRAY['landholder', 'tenant', 'small_farmer'],
  ARRAY['marketing', 'market linkage', 'Maharashtra', 'better prices', 'direct selling'],
  NULL, NULL, true,
  '{"phone": "022-22025131", "email": "abn@maharashtra.gov.in"}'::jsonb
),
(
  'Magel Tyala Sadabahaar Pani (MTP)',
  'मागेल त्याला सदाबहार पानी (MTP)',
  'irrigation',
  'Micro-irrigation',
  'Promotes water-efficient irrigation through drip and sprinkler systems. Provides subsidy for installation of micro-irrigation equipment.',
  'ठिबक आणि फवारा प्रणालीद्वारे पाणी-कार्यक्षम सिंचन प्रोत्साहित करते. सूक्ष्म सिंचन उपकरणे स्थापनेसाठी अनुदान प्रदान करते.',
  '["60-80% subsidy on equipment", "Water saving up to 50%", "Increased crop yield", "Reduced labor cost", "Electricity savings"]',
  '["उपकरणांवर ६०-८०% अनुदान", "५०% पर्यंत पाणी बचत", "पीक उत्पादन वाढले", "मजूर खर्च कमी", "वीज बचत"]',
  '["Farmers with assured water source", "Minimum 0.2 hectare land", "Must not have availed subsidy in last 7 years", "Small and marginal farmers get priority"]',
  '["खात्रीशीर पाणी स्रोत असलेले शेतकरी", "किमान ०.२ हेक्टर जमीन", "गेल्या ७ वर्षात अनुदान घेतलेले नसावे", "लहान आणि किरकोळ शेतकऱ्यांना प्राधान्य"]',
  'Apply through agriculture department, site inspection, approval, purchase from authorized dealer, installation, subsidy disbursement.',
  'कृषी विभागामार्फत अर्ज करा, साइट तपासणी, मंजूरी, अधिकृत विक्रेत्याकडून खरेदी, स्थापना, अनुदान वितरण.',
  '["Application Form", "7/12 Extract", "Water Source Certificate", "Quotation from Dealer", "Bank Details", "Aadhaar Card"]',
  '["अर्ज फॉर्म", "७/१२ उतारा", "पाणी स्रोत प्रमाणपत्र", "डीलरकडून कोटेशन", "बँक तपशील", "आधार कार्ड"]',
  'https://krishi.maharashtra.gov.in/mtp',
  'state',
  ARRAY['landholder', 'small_farmer'],
  ARRAY['drip irrigation', 'sprinkler', 'subsidy', 'Maharashtra', 'water conservation'],
  NULL, 250000, true,
  '{"phone": "020-26123974", "email": "mtp@maharashtra.gov.in"}'::jsonb
),
(
  'Sheep & Goat Development Scheme',
  'मेंढी व शेळी विकास योजना',
  'financial_aid',
  'Livestock Development',
  'Provides subsidy for sheep and goat units to promote livestock-based livelihoods. Includes training and veterinary support.',
  'पशुधन-आधारित उपजीविका प्रोत्साहित करण्यासाठी मेंढी आणि शेळी युनिट्ससाठी अनुदान प्रदान करते. प्रशिक्षण आणि पशुवैद्यकीय समर्थन समाविष्ट.',
  '["50% subsidy on unit cost", "Free training on animal husbandry", "Veterinary support", "Market linkage for wool and meat", "Insurance coverage"]',
  '["युनिट खर्चावर ५०% अनुदान", "पशुपालनावर मोफत प्रशिक्षण", "पशुवैद्यकीय समर्थन", "लोकर आणि मांससाठी बाजार संबंध", "विमा संरक्षण"]',
  '["Farmers interested in livestock", "Minimum land requirement: 0.2 hectare", "Shed construction capability", "Small and marginal farmers priority"]',
  '["पशुधनात स्वारस्य असलेले शेतकरी", "किमान जमीन आवश्यकता: ०.२ हेक्टर", "शेड बांधकाम क्षमता", "लहान आणि किरकोळ शेतकऱ्यांना प्राधान्य"]',
  'Apply through animal husbandry department, submit project proposal, approval, purchase animals from authorized source, subsidy release.',
  'पशुसंवर्धन विभागामार्फत अर्ज करा, प्रकल्प प्रस्ताव सबमिट करा, मंजूरी, अधिकृत स्रोताकडून प्राणी खरेदी, अनुदान प्रकाशन.',
  '["Application Form", "Land Documents", "Caste Certificate (if applicable)", "Bank Details", "Project Proposal", "Shed Layout"]',
  '["अर्ज फॉर्म", "जमीन कागदपत्रे", "जात प्रमाणपत्र (लागू असल्यास)", "बँक तपशील", "प्रकल्प प्रस्ताव", "शेड लेआउट"]',
  'https://www.mahaahd.org/',
  'state',
  ARRAY['small_farmer', 'landholder', 'women'],
  ARRAY['livestock', 'sheep', 'goat', 'subsidy', 'Maharashtra', 'animal husbandry'],
  25000, 75000, true,
  '{"phone": "020-26123654", "email": "ahd@maharashtra.gov.in"}'::jsonb
);