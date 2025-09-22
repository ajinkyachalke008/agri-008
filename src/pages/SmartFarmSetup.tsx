import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Camera, CloudRain, Leaf, ChevronRight, ChevronLeft, Phone, Mail, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for Indian states and districts
const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Andaman & Nicobar Islands', 'Chandigarh', 
  'Dadra & Nagar Haveli & Daman & Diu', 'Delhi (NCT)', 'Jammu & Kashmir (UT)', 
  'Ladakh', 'Lakshadweep', 'Puducherry'
];

const DISTRICTS = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Nanded', 'Kolhapur', 'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Parbhani', 'Jalgaon', 'Bhiwandi', 'Navi Mumbai', 'Sangli', 'Malegaon', 'Jalna'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Nadiad', 'Gandhinagar', 'Anand', 'Bharuch'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Belgaum', 'Mangalore', 'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga']
};

const TALUKAS = {
  'Pune': ['Pune City', 'Pimpri-Chinchwad', 'Haveli', 'Mulshi', 'Velhe', 'Bhor', 'Purandar', 'Baramati', 'Indapur', 'Khedabad'],
  'Mumbai': ['Mumbai City', 'Mumbai Suburban', 'Thane', 'Kalyan-Dombivli', 'Navi Mumbai', 'Panvel', 'Mira-Bhayander', 'Bhiwandi', 'Vasai-Virar', 'Ulhasnagar']
};

interface FormData {
  // Location
  state: string;
  district: string;
  taluka: string;
  village: string;
  pincode: string;
  
  // Personal Details
  fullName: string;
  phone: string;
  email: string;
  language: string;
  
  // Farm Details
  farmSize: string;
  farmSizeUnit: string;
  irrigationType: string;
  waterSource: string;
  soilType: string;
  currentCrops: string[];
  cropHistory: string;
  urgentChallenges: string;
  
  // Photos
  photos: File[];
  
  // Preferences
  joinPilot: boolean;
  followUpMethod: string;
  consent: boolean;
}

const SmartFarmSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    state: '', district: '', taluka: '', village: '', pincode: '',
    fullName: '', phone: '', email: '', language: 'english',
    farmSize: '', farmSizeUnit: 'acres', irrigationType: '', waterSource: '', soilType: '',
    currentCrops: [], cropHistory: '', urgentChallenges: '',
    photos: [], joinPilot: true, followUpMethod: 'call', consent: false
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 5) {
      alert('Maximum 5 photos allowed');
      return;
    }
    updateFormData('photos', files);
  }, []);

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
    setAnalysisComplete(true);
  };

  const sendOTP = () => {
    setOtpSent(true);
  };

  const nextStep = () => {
    if (currentStep === 3 && formData.photos.length > 0) {
      simulateAnalysis();
    }
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const languages = {
    english: { 
      title: 'Smart Farm Setup',
      subtitle: 'Get personalized crop & weather advice for your farm',
      location: 'Use my location',
      selectState: 'Select state → district → taluka',
      uploadPhotos: 'Upload 2–5 photos: wide field shot + close-up leaf + soil',
      analyzing: 'Analyzing your photos — results will appear in a few moments',
      otpPrompt: 'Enter OTP sent to your mobile to confirm your number'
    },
    marathi: {
      title: 'स्मार्ट फार्म सेटअप',
      subtitle: 'आपल्या शेतासाठी वैयक्तिकृत पिक व हवामान सल्ला मिळवा',
      location: 'माझे स्थान वापरा',
      selectState: 'राज्य → जिल्हा → तालुका निवडा',
      uploadPhotos: '2–5 फोटो अपलोड करा: शेताचा विस्तृत फोटो + पानांचा क्लोज-अप + माती',
      analyzing: 'आपले फोटो विश्लेषित केले जात आहेत — काही क्षणांत निकाल दिसेल',
      otpPrompt: 'आपला मोबाईल नंबर पुष्टी करण्यासाठी पाठवलेला OTP टाका'
    },
    hindi: {
      title: 'स्मार्ट फार्म सेटअप',
      subtitle: 'अपने खेत के लिए व्यक्तिगत फसल और मौसम सलाह प्राप्त करें',
      location: 'मेरा स्थान उपयोग करें',
      selectState: 'राज्य → जिला → तहसील चुनें',
      uploadPhotos: '2–5 फोटो अपलोड करें: खेत का चौड़ा शॉट + पत्तियों का क्लोज-अप + मिट्टी',
      analyzing: 'आपकी तस्वीरों का विश्लेषण किया जा रहा है — परिणाम कुछ ही क्षणों में दिखेंगे',
      otpPrompt: 'अपना मोबाइल नंबर पुष्टि करने के लिए भेजा गया OTP दर्ज करें'
    }
  };

  const t = languages[formData.language as keyof typeof languages];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <React.Fragment key={step}>
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            {step}
          </div>
          {step < 5 && (
            <div className={cn(
              "w-8 h-0.5 mx-2",
              currentStep > step ? "bg-primary" : "bg-muted"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderLocationStep = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Choose Location
        </CardTitle>
        <CardDescription>
          Select your farm location for accurate weather and crop recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={() => {
            navigator.geolocation?.getCurrentPosition((pos) => {
              console.log('GPS:', pos.coords.latitude, pos.coords.longitude);
            });
          }}
          className="w-full" 
          variant="outline"
        >
          <MapPin className="w-4 h-4 mr-2" />
          {t.location}
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="state">State</Label>
            <Select value={formData.state} onValueChange={(value) => updateFormData('state', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {STATES.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="district">District</Label>
            <Select 
              value={formData.district} 
              onValueChange={(value) => updateFormData('district', value)}
              disabled={!formData.state}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {(DISTRICTS[formData.state as keyof typeof DISTRICTS] || []).map(district => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="taluka">Taluka</Label>
            <Select 
              value={formData.taluka} 
              onValueChange={(value) => updateFormData('taluka', value)}
              disabled={!formData.district}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select taluka" />
              </SelectTrigger>
              <SelectContent>
                {(TALUKAS[formData.district as keyof typeof TALUKAS] || []).map(taluka => (
                  <SelectItem key={taluka} value={taluka}>{taluka}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="village">Village/Area</Label>
            <Input 
              id="village"
              value={formData.village}
              onChange={(e) => updateFormData('village', e.target.value)}
              placeholder="Enter village name"
            />
          </div>
          <div>
            <Label htmlFor="pincode">PIN Code</Label>
            <Input 
              id="pincode"
              value={formData.pincode}
              onChange={(e) => updateFormData('pincode', e.target.value)}
              placeholder="Enter PIN code"
            />
          </div>
        </div>
        
        {formData.state && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Climate Zone: Tropical wet/dry • Avg annual rainfall: 1200mm
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderPhotoStep = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Upload Farm Photos
        </CardTitle>
        <CardDescription>
          {t.uploadPhotos}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Click to upload photos</p>
            <p className="text-sm text-muted-foreground">
              JPG, PNG up to 5MB each • 2-5 photos required
            </p>
          </label>
        </div>
        
        {formData.photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {formData.photos.map((photo, index) => (
              <div key={index} className="relative">
                <img 
                  src={URL.createObjectURL(photo)} 
                  alt={`Farm photo ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Photo Tips:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Take one wide shot of the whole field</li>
            <li>• Take one close-up of leaves/soil</li>
            <li>• Take shots in good daylight; avoid motion blur</li>
            <li>• Include any problem areas or concerns</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  const renderDetailsStep = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Farm Details</CardTitle>
        <CardDescription>
          Tell us about your farm for personalized recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input 
              id="fullName"
              value={formData.fullName}
              onChange={(e) => updateFormData('fullName', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="flex gap-2">
              <Input 
                id="phone"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                placeholder="Enter phone number"
              />
              {!otpSent && (
                <Button onClick={sendOTP} variant="outline">
                  <Phone className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {otpSent && (
          <div>
            <Label htmlFor="otp">OTP Verification</Label>
            <Input 
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder={t.otpPrompt}
              maxLength={6}
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email (Optional)</Label>
            <Input 
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div>
            <Label htmlFor="language">Preferred Language</Label>
            <Select value={formData.language} onValueChange={(value) => updateFormData('language', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="marathi">मराठी</SelectItem>
                <SelectItem value="hindi">हिंदी</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="farmSize">Farm Size *</Label>
            <div className="flex gap-2">
              <Input 
                id="farmSize"
                type="number"
                value={formData.farmSize}
                onChange={(e) => updateFormData('farmSize', e.target.value)}
                placeholder="Enter size"
              />
              <Select value={formData.farmSizeUnit} onValueChange={(value) => updateFormData('farmSizeUnit', value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acres">Acres</SelectItem>
                  <SelectItem value="hectares">Hectares</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="irrigationType">Irrigation Type</Label>
            <Select value={formData.irrigationType} onValueChange={(value) => updateFormData('irrigationType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drip">Drip</SelectItem>
                <SelectItem value="sprinkler">Sprinkler</SelectItem>
                <SelectItem value="flood">Flood</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="waterSource">Water Source</Label>
            <Select value={formData.waterSource} onValueChange={(value) => updateFormData('waterSource', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="canal">Canal</SelectItem>
                <SelectItem value="well">Well</SelectItem>
                <SelectItem value="borewell">Borewell</SelectItem>
                <SelectItem value="rainfed">Rainfed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="soilType">Soil Type</Label>
          <Select value={formData.soilType} onValueChange={(value) => updateFormData('soilType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select soil type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sandy">Sandy</SelectItem>
              <SelectItem value="loamy">Loamy</SelectItem>
              <SelectItem value="clay">Clay</SelectItem>
              <SelectItem value="laterite">Laterite</SelectItem>
              <SelectItem value="unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="urgentChallenges">Any Urgent Challenges?</Label>
          <Textarea 
            id="urgentChallenges"
            value={formData.urgentChallenges}
            onChange={(e) => updateFormData('urgentChallenges', e.target.value)}
            placeholder="Describe any current issues with your farm..."
            rows={3}
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="joinPilot"
              checked={formData.joinPilot}
              onCheckedChange={(checked) => updateFormData('joinPilot', checked)}
            />
            <Label htmlFor="joinPilot">Join free pilot program</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="consent"
              checked={formData.consent}
              onCheckedChange={(checked) => updateFormData('consent', checked)}
            />
            <Label htmlFor="consent" className="text-sm">
              I consent to process my photos and location data for agronomic suggestions *
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAnalysisStep = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="w-5 h-5" />
          {isAnalyzing ? 'Analyzing Your Farm...' : 'Analysis Complete'}
        </CardTitle>
        <CardDescription>
          {isAnalyzing ? t.analyzing : 'Here are your personalized recommendations'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAnalyzing ? (
          <div className="text-center py-8">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Processing your photos and location data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Weather Panel */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <CloudRain className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">7-Day Weather Forecast</h3>
              </div>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <p className="font-medium">Today</p>
                  <p className="text-2xl">34°</p>
                  <p className="text-muted-foreground">Sunny</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">Tomorrow</p>
                  <p className="text-2xl">32°</p>
                  <p className="text-muted-foreground">Cloudy</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">Day 3</p>
                  <p className="text-2xl">28°</p>
                  <p className="text-muted-foreground">Rain</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">Day 4</p>
                  <p className="text-2xl">30°</p>
                  <p className="text-muted-foreground">Partly Cloudy</p>
                </div>
              </div>
              <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-sm">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Heavy rain expected in 2 days — delay fertilizer application
              </div>
            </div>

            {/* Photo Analysis */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Photo Analysis Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Leaf Health:</span> Yellowing detected in ~18% of visible plants</p>
                  <p><span className="font-medium">Soil Condition:</span> Appears slightly dry</p>
                </div>
                <div>
                  <p><span className="font-medium">Weed Coverage:</span> Estimated 12%</p>
                  <p><span className="font-medium">Pest Signs:</span> Possible caterpillar damage (72% confidence)</p>
                </div>
              </div>
            </div>

            {/* Crop Recommendations */}
            <div>
              <h3 className="font-semibold mb-4">Top Crop Recommendations for This Season</h3>
              <div className="space-y-3">
                {[
                  {
                    name: 'Bajra (Pearl Millet)',
                    reason: 'Drought tolerant, good market demand',
                    window: 'Jun-Jul',
                    water: 'Low',
                    profit: '₹25,000-35,000/acre',
                    risk: 'Low'
                  },
                  {
                    name: 'Sunflower',
                    reason: 'Good returns & fits rainfall forecast',
                    window: 'Jul-Aug',
                    water: 'Medium',
                    profit: '₹30,000-40,000/acre',
                    risk: 'Medium'
                  },
                  {
                    name: 'Sorghum',
                    reason: 'Tolerant to low rainfall, low input cost',
                    window: 'Jun-Jul',
                    water: 'Low',
                    profit: '₹20,000-30,000/acre',
                    risk: 'Low'
                  }
                ].map((crop, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-lg">{crop.name}</h4>
                      <div className="text-right text-sm">
                        <p className="text-green-600 dark:text-green-400 font-medium">{crop.profit}</p>
                        <p className="text-muted-foreground">{crop.risk} Risk</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-3">{crop.reason}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Sowing Window</p>
                        <p>{crop.window}</p>
                      </div>
                      <div>
                        <p className="font-medium">Water Need</p>
                        <p>{crop.water}</p>
                      </div>
                      <div>
                        <Button size="sm" variant="outline">
                          Save to Calendar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advisory */}
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Immediate Advisory</h3>
              <p className="text-sm">
                Soil looks slightly acidic and dry — apply 100 kg/ha of NPK 10:26:26 as starter after testing; 
                irrigate short burst in evening in 2 days if no rain.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderSubmitStep = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Start Your Smart Farming Journey
        </CardTitle>
        <CardDescription>
          Review your information and submit to start your pilot program
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Summary</h3>
          <div className="text-sm space-y-1">
            <p><span className="font-medium">Location:</span> {formData.taluka}, {formData.district}, {formData.state}</p>
            <p><span className="font-medium">Farm Size:</span> {formData.farmSize} {formData.farmSizeUnit}</p>
            <p><span className="font-medium">Photos:</span> {formData.photos.length} uploaded</p>
            <p><span className="font-medium">Language:</span> {formData.language}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button className="w-full" size="lg">
            Submit & Start Pilot Program
          </Button>
          <div className="text-center">
            <Button variant="outline" className="mr-2">
              Download PDF Report
            </Button>
            <Button variant="outline">
              Request Agronomist Visit
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>After submission, you'll receive:</p>
          <ul className="list-disc list-inside mt-1">
            <li>SMS/WhatsApp confirmation</li>
            <li>Detailed PDF report via email</li>
            <li>Agronomist follow-up within 24 hours</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50 dark:from-green-950/10 dark:via-blue-950/10 dark:to-cyan-950/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && renderLocationStep()}
          {currentStep === 2 && renderPhotoStep()}
          {currentStep === 3 && renderDetailsStep()}
          {currentStep === 4 && renderAnalysisStep()}
          {currentStep === 5 && renderSubmitStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between max-w-2xl mx-auto">
          <Button 
            onClick={prevStep} 
            disabled={currentStep === 1}
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button 
            onClick={nextStep}
            disabled={
              (currentStep === 1 && (!formData.state || !formData.district || !formData.taluka)) ||
              (currentStep === 2 && formData.photos.length === 0) ||
              (currentStep === 3 && (!formData.fullName || !formData.phone || !formData.farmSize || !formData.consent)) ||
              (currentStep === 4 && !analysisComplete) ||
              currentStep === 5
            }
          >
            {currentStep === 5 ? 'Complete' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SmartFarmSetup;