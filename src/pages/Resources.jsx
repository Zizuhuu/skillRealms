import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Heart, 
  Utensils, 
  Home, 
  Briefcase, 
  GraduationCap,
  ExternalLink,
  Shield,
  Users,
  Stethoscope
} from 'lucide-react';

const resourceCategories = [
  {
    title: "Emergency Help",
    icon: Phone,
    color: "bg-red-100 text-red-600",
    resources: [
      {
        name: "National Homeless Hotline",
        description: "24/7 crisis support and resource referrals",
        phone: "1-800-231-6946",
        type: "phone"
      },
      {
        name: "211 Services",
        description: "Connect to local health and human services",
        phone: "211",
        type: "phone"
      },
      {
        name: "National Suicide Prevention",
        description: "24/7 mental health crisis support",
        phone: "988",
        type: "phone"
      }
    ]
  },
  {
    title: "Housing & Shelter",
    icon: Home,
    color: "bg-blue-100 text-blue-600",
    resources: [
      {
        name: "HUD Housing Locator",
        description: "Find affordable housing options",
        url: "https://www.hud.gov/topics/rental_assistance",
        type: "link"
      },
      {
        name: "Shelter Listings",
        description: "Locate nearby emergency shelters",
        url: "https://www.shelterlistings.org",
        type: "link"
      },
      {
        name: "National Alliance to End Homelessness",
        description: "Policy info and local resources",
        url: "https://endhomelessness.org",
        type: "link"
      }
    ]
  },
  {
    title: "Food Assistance",
    icon: Utensils,
    color: "bg-green-100 text-green-600",
    resources: [
      {
        name: "Feeding America",
        description: "Find local food banks and pantries",
        url: "https://www.feedingamerica.org/find-your-local-foodbank",
        type: "link"
      },
      {
        name: "SNAP Benefits",
        description: "Apply for food assistance",
        url: "https://www.fns.usda.gov/snap/apply",
        type: "link"
      },
      {
        name: "Meals on Wheels",
        description: "Meal delivery for those in need",
        url: "https://www.mealsonwheelsamerica.org",
        type: "link"
      }
    ]
  },
  {
    title: "Healthcare",
    icon: Stethoscope,
    color: "bg-purple-100 text-purple-600",
    resources: [
      {
        name: "Free Clinics Directory",
        description: "Find free and low-cost medical care",
        url: "https://www.freeclinics.com",
        type: "link"
      },
      {
        name: "SAMHSA Helpline",
        description: "Mental health and substance abuse support",
        phone: "1-800-662-4357",
        type: "phone"
      },
      {
        name: "Healthcare.gov",
        description: "Affordable health insurance options",
        url: "https://www.healthcare.gov",
        type: "link"
      }
    ]
  },
  {
    title: "Employment",
    icon: Briefcase,
    color: "bg-orange-100 text-orange-600",
    resources: [
      {
        name: "CareerOneStop",
        description: "Job search and career resources",
        url: "https://www.careeronestop.org",
        type: "link"
      },
      {
        name: "Goodwill Job Training",
        description: "Free job training programs",
        url: "https://www.goodwill.org/find-jobs-and-services",
        type: "link"
      },
      {
        name: "American Job Centers",
        description: "Local employment services",
        url: "https://www.careeronestop.org/LocalHelp/AmericanJobCenters",
        type: "link"
      }
    ]
  },
  {
    title: "Education",
    icon: GraduationCap,
    color: "bg-indigo-100 text-indigo-600",
    resources: [
      {
        name: "GED Testing Service",
        description: "Official GED test information",
        url: "https://ged.com",
        type: "link"
      },
      {
        name: "Khan Academy",
        description: "Free online learning platform",
        url: "https://www.khanacademy.org",
        type: "link"
      },
      {
        name: "Public Library",
        description: "Free internet, books, and programs",
        url: "https://www.publiclibraries.com",
        type: "link"
      }
    ]
  }
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/dashboard" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Support Resources</h1>
            <p className="text-sm text-gray-500">Help is available</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Important Notice */}
        <div className="bg-gradient-to-br from-blue-500 to-green-500 rounded-3xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">You're Not Alone</h2>
              <p className="text-blue-100 leading-relaxed">
                These resources are here to help you. Don't hesitate to reach out – 
                asking for help is a sign of strength. Many services are free and confidential.
              </p>
            </div>
          </div>
        </div>

        {/* Resource Categories */}
        {resourceCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 pb-2">
              <div className="flex items-center gap-3 font-semibold text-gray-900 text-lg">
                <div className={`w-10 h-10 ${category.color} rounded-xl flex items-center justify-center`}>
                  <category.icon className="w-5 h-5" />
                </div>
                {category.title}
              </div>
            </div>
            <div className="px-6 pb-6 space-y-3">
              {category.resources.map((resource, resourceIndex) => (
                <div 
                  key={resourceIndex}
                  className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg">{resource.name}</h3>
                    <p className="text-gray-500 text-sm">{resource.description}</p>
                  </div>
                  {resource.type === 'phone' ? (
                    <a 
                      href={`tel:${resource.phone.replace(/-/g, '')}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold text-base transition-colors flex-shrink-0"
                    >
                      {resource.phone}
                    </a>
                  ) : (
                    <a 
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors flex-shrink-0"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Safety Notice */}
        <div className="bg-gray-100 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Your Privacy Matters</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Most of these services are confidential. If you're in an unsafe situation, 
                consider using a public computer or library to access resources. 
                You can also ask a trusted friend or social worker for help.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Learning */}
        <Link to="/dashboard" className="block w-full h-16 text-xl font-semibold text-white text-center leading-[4rem] bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-2xl transition-all">
          Back to Learning
        </Link>
      </main>
    </div>
  );
}