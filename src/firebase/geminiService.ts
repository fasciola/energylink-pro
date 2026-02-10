// Gemini AI service for bio generation
export const generateElectricianBio = async (data: {
  name: string;
  experience: number;
  specialties: string[];
  hourlyRate: number;
  language?: 'en' | 'ar';
}): Promise<string> => {
  try {
    // Mock response for now (add real Gemini API later)
    const mockBioEn = `Professional electrician ${data.name} with ${data.experience} years of experience specializing in ${data.specialties.join(', ')}. Certified and licensed with a focus on safety, quality workmanship, and customer satisfaction. Hourly rate: $${data.hourlyRate}. Available for residential and commercial projects.`;
    
    const mockBioAr = `كهربائي محترف ${data.name} مع ${data.experience} سنوات من الخبرة متخصص في ${data.specialties.join('، ')}. معتمد ومرخص مع التركيز على السلامة وجودة العمل ورضا العملاء. السعر بالساعة: ${data.hourlyRate} ريال. متاح للمشاريع السكنية والتجارية.`;
    
    // Return mock data for now
    return data.language === 'ar' ? mockBioAr : mockBioEn;
    
  } catch (error) {
    console.error("Error generating bio:", error);
    return data.language === 'ar' 
      ? "كهربائي محترف بخبرة سنوات في المشاريع السكنية والتجارية."
      : "Professional electrician with years of experience in residential and commercial projects.";
  }
};