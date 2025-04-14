import React from "react";
import Link from "next/link";

interface CardProps {
  title: string;
  description: string;
  href: string;
  icon?: string;
}

export default function Card({ title, description, href, icon }: CardProps) {
  return (
    <Link 
      href={href}
      className="block group"
    >
      <div className="h-full bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-100">
        <div className="p-6">
          {icon && (
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">{icon}</span>
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center text-blue-600 text-sm font-medium">
            View Details
            <svg 
              className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
} 