import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBolt, FaStar, FaClock, FaTools, FaRobot, FaEdit } from 'react-icons/fa';

export const ElectricianDashboard = () => {
  const { t } = useTranslation();
  const [bio, setBio] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(85);
  const [availability, setAvailability] = useState(true);

  const generateAIBio = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newBio = t('i18n.language') === 'ar'
      ? "كهربائي محترف معتمد بخبرة 12 سنة في التركيبات السكنية والتجارية. متخصص في تحديث الأنظمة القديمة وتركيب أنظمة الطاقة الشمسية. أسعار تنافسية وضمان على العمل."
      : "Professional licensed electrician with 12 years of residential and commercial experience. Specializes in upgrading old systems and installing solar power systems. Competitive rates with work guarantee.";
    
    setBio(newBio);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('dashboard.electrician.title')}
            </h1>
            <p className="text-blue-100">
              Welcome back! Manage your profile, services, and connect with customers.
            </p>
          </div>
          <FaBolt className="text-5xl opacity-25" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Rating</p>
              <p className="text-2xl font-bold">4.8</p>
            </div>
            <FaStar className="text-yellow-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed Jobs</p>
              <p className="text-2xl font-bold">245</p>
            </div>
            <FaTools className="text-blue-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg. Response Time</p>
              <p className="text-2xl font-bold">15 min</p>
            </div>
            <FaClock className="text-emerald-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Bio Generator */}
          <div className="bg-white rounded-xl shadow border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaRobot className="text-blue-600" />
                {t('ai.generateBio')}
              </h2>
            </div>

            <button
              onClick={generateAIBio}
              disabled={isGenerating}
              className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-3 font-semibold transition-all ${
                isGenerating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow hover:shadow-lg'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {t('ai.generating')}
                </>
              ) : (
                <>
                  <FaRobot />
                  {t('ai.generateBio')}
                </>
              )}
            </button>

            {bio && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-blue-800">{t('ai.bioGenerated')}</h3>
                  <button
                    onClick={() => setBio('')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear
                  </button>
                </div>
                <p className="text-gray-700 leading-relaxed">{bio}</p>
                <button className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                  <FaEdit />
                  Edit Bio
                </button>
              </div>
            )}
          </div>

          {/* Services Section */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Your Services</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Residential Wiring', 'Panel Upgrades', 'Solar Installation', 'Smart Home', 'Emergency Services', 'Maintenance'].map((service) => (
                <div key={service} className="border rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaBolt className="text-blue-600" />
                    </div>
                    <span className="font-medium">{service}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          {/* Hourly Rate Card */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="font-bold text-gray-800 mb-4">{t('electrician.hourlyRate', { rate: '' }).replace(' SAR/hour', '')}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Rate</span>
                <span className="text-2xl font-bold text-emerald-600">${hourlyRate}/hr</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>$50/hr</span>
                <span>$200/hr</span>
              </div>
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Update Rate
              </button>
            </div>
          </div>

          {/* Availability Card */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="font-bold text-gray-800 mb-4">Availability</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Currently Available</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availability}
                    onChange={(e) => setAvailability(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  {availability 
                    ? 'You are currently visible to customers' 
                    : 'You are not accepting new jobs'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow p-6 text-white">
            <h3 className="font-bold mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Jobs Completed</span>
                <span className="font-bold">18</span>
              </div>
              <div className="flex justify-between">
                <span>Earnings</span>
                <span className="font-bold">$3,420</span>
              </div>
              <div className="flex justify-between">
                <span>Avg. Rating</span>
                <span className="font-bold">4.9 ★</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};