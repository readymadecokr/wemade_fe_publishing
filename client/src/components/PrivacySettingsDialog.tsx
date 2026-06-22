import { X, Globe } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PrivacySettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacySettingsDialog({ isOpen, onClose }: PrivacySettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<"purposes" | "vendors">("purposes");
  const [marketing, setMarketing] = useState(true);
  const [functional, setFunctional] = useState(true);
  const [essential, setEssential] = useState(false);

  const handleSaveSettings = () => {
    toast.success("Privacy settings saved successfully");
    onClose();
  };

  const handleDenyAll = () => {
    setMarketing(false);
    setFunctional(false);
    setEssential(false);
    toast.info("All non-essential cookies denied");
  };

  const handleAcceptAll = () => {
    setMarketing(true);
    setFunctional(true);
    setEssential(true);
    toast.success("All cookies accepted");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#131313] border-b border-gray-200 dark:border-slate-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe size={24} className="text-blue-600" />
            <h2 className="text-2xl font-bold text-foreground dark:text-white">Privacy Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
          >
            <X size={24} className="text-gray-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-foreground/70 dark:text-white/70 mb-6">
            You can access more detailed information below regarding all purposes and third-party vendors. You can adjust your privacy settings based on specific purposes and/or at a vendor level at any time.
          </p>

          <p className="text-sm font-semibold text-foreground dark:text-white mb-6">Privacy Policy</p>

          {/* Tabs */}
          <div className="flex gap-6 mb-6 border-b border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab("purposes")}
              className={`pb-3 font-semibold text-sm transition-colors ${
                activeTab === "purposes"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Purposes
            </button>
            <button
              onClick={() => setActiveTab("vendors")}
              className={`pb-3 font-semibold text-sm transition-colors ${
                activeTab === "vendors"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Vendors
            </button>
          </div>

          {/* Purposes Tab */}
          {activeTab === "purposes" && (
            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-foreground dark:text-white mb-4">Non-IAB Purposes</h3>

              {/* Marketing */}
              <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground dark:text-white mb-1">Marketing</h4>
                    <p className="text-sm text-foreground/70 dark:text-white/70">
                      These technologies are used by advertisers to serve ads that are relevant to your interests.
                    </p>
                  </div>
                  <button
                    onClick={() => setMarketing(!marketing)}
                    className={`ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors ${
                      marketing ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        marketing ? "translate-x-5" : "translate-x-1"
                      } mt-0.5`}
                    />
                  </button>
                </div>
              </div>

              {/* Functional */}
              <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground dark:text-white mb-1">Functional</h4>
                    <p className="text-sm text-foreground/70 dark:text-white/70">
                      These technologies enable us to analyse usage behavior in order to measure and improve performance.
                    </p>
                  </div>
                  <button
                    onClick={() => setFunctional(!functional)}
                    className={`ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors ${
                      functional ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        functional ? "translate-x-5" : "translate-x-1"
                      } mt-0.5`}
                    />
                  </button>
                </div>
              </div>

              {/* Essential */}
              <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 bg-gray-50 dark:bg-slate-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground dark:text-white mb-1">Essential</h4>
                    <p className="text-sm text-foreground/70 dark:text-white/70">
                      These technologies are required to activate the core functionality of our service.
                    </p>
                  </div>
                  <button
                    disabled
                    className="ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-not-allowed rounded-full bg-gray-300"
                  >
                    <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-1 mt-0.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Vendors Tab */}
          {activeTab === "vendors" && (
            <div className="space-y-4 mb-8">
              <p className="text-sm text-foreground/70 dark:text-white/70">
                Various vendors process your data to provide personalized ads and content. You can manage your preferences for each vendor below.
              </p>
              <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 bg-gray-50 dark:bg-slate-800">
                <p className="text-sm text-foreground/70 dark:text-white/70">
                  Vendor management options will be available here. Currently, essential vendors only are active.
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-3 justify-center pt-6 border-t border-gray-200 dark:border-slate-700">
            <Button
              onClick={handleDenyAll}
              variant="outline"
              className="px-6 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold"
            >
              Deny all
            </Button>
            <Button
              onClick={handleSaveSettings}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Save Settings
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Accept all
            </Button>
          </div>

          {/* Footer Text */}
          <div className="text-center text-xs text-foreground/60 dark:text-white/60 mt-4">
            Powered by Usercentrics Consent Management
          </div>
        </div>
      </div>
    </div>
  );
}
