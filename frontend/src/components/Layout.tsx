import React, { useState } from 'react';
import { Building2, ChevronDown, Plus, Loader2 } from 'lucide-react';
import { useGraphQLData } from '../context/GraphQLDataContext';
import { Organization } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { currentOrg, setCurrentOrg, organizations, organizationsLoading, organizationsError } = useGraphQLData();
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">ProjectHub</h1>
            </div>

            {/* Organization Selector */}
            <div className="relative">
              <button
                onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                disabled={organizationsLoading}
              >
                {organizationsLoading ? (
                  <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                ) : (
                  <Building2 className="w-4 h-4 text-gray-600" />
                )}
                <span className="text-sm font-medium text-gray-900">
                  {organizationsLoading ? 'Loading...' : currentOrg?.name || 'Select Organization'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {showOrgDropdown && !organizationsLoading && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-2">
                    {organizationsError ? (
                      <div className="px-3 py-2 text-sm text-red-600">
                        Error loading organizations
                      </div>
                    ) : organizations.length > 0 ? (
                      organizations.map((org) => (
                        <button
                          key={org.id}
                          onClick={() => {
                            setCurrentOrg(org);
                            setShowOrgDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                            currentOrg?.id === org.id
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="font-medium">{org.name}</div>
                          <div className="text-xs text-gray-500">{org.contactEmail}</div>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        No organizations found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentOrg ? children : (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No Organization Selected</h3>
            <p className="mt-2 text-sm text-gray-500">
              Please select an organization from the dropdown above to continue.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}