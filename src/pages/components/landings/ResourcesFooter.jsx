import React from 'react';
import { Phone, MapPin, Heart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const resources = [
  {
    name: "National Homeless Hotline",
    description: "24/7 support and local resources",
    phone: "1-800-231-6946",
    icon: Phone
  },
  {
    name: "211 Services",
    description: "Food, shelter, and health services",
    phone: "211",
    icon: Heart
  },
  {
    name: "Find a Shelter",
    description: "Locate nearby shelters",
    url: "https://www.shelterlistings.org",
    icon: MapPin
  }
];

export default function ResourcesFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-lg mx-auto">
        <h3 className="text-2xl font-bold mb-6 text-center">
          Support Resources
        </h3>
        
        <div className="space-y-4 mb-8">
          {resources.map((resource, index) => (
            <div 
              key={index}
              className="bg-gray-800 rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <resource.icon className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{resource.name}</h4>
                <p className="text-gray-400 text-sm">{resource.description}</p>
              </div>
              {resource.phone ? (
                <a 
                  href={`tel:${resource.phone}`}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
                >
                  {resource.phone}
                </a>
              ) : (
                <a 
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 p-2 rounded-xl transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col items-center gap-4">
            <Link 
              to="/resources"
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2"
            >
              View All Resources <ExternalLink className="w-4 h-4" />
            </Link>
            <p className="text-gray-500 text-sm text-center">
              © 2026 skillRealms. Education for everyone.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}