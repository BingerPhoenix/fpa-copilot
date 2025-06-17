'use client';

import React, { useState } from 'react';
import { Download, Share2, Mail, Link2, FileText, Image, Table, Copy, Check, X } from 'lucide-react';

interface ExportData {
  type: 'insight' | 'chart' | 'summary' | 'report';
  title: string;
  data: any;
  metadata?: {
    generatedBy?: string;
    timestamp?: Date;
    department?: string;
    period?: string;
  };
}

interface ExportManagerProps {
  data: ExportData;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const ExportManager: React.FC<ExportManagerProps> = ({
  data,
  isOpen,
  onClose,
  className = ''
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | 'csv' | 'png' | 'svg'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  const formatOptions = [
    {
      value: 'pdf',
      label: 'PDF Report',
      icon: <FileText className="w-4 h-4" />,
      description: 'Professional report with charts and insights',
      fileSize: '~2-5 MB'
    },
    {
      value: 'excel',
      label: 'Excel Workbook',
      icon: <Table className="w-4 h-4" />,
      description: 'Spreadsheet with data and calculations',
      fileSize: '~1-3 MB'
    },
    {
      value: 'csv',
      label: 'CSV Data',
      icon: <Table className="w-4 h-4" />,
      description: 'Raw data for further analysis',
      fileSize: '~100-500 KB'
    },
    {
      value: 'png',
      label: 'PNG Image',
      icon: <Image className="w-4 h-4" />,
      description: 'High-quality image for presentations',
      fileSize: '~500 KB - 2 MB'
    },
    {
      value: 'svg',
      label: 'SVG Vector',
      icon: <Image className="w-4 h-4" />,
      description: 'Scalable vector for high-resolution printing',
      fileSize: '~50-200 KB'
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const sanitizedTitle = data.title.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${sanitizedTitle}_${timestamp}.${selectedFormat}`;
      
      // In a real implementation, this would generate and download the actual file
      console.log(`Exporting ${filename} in ${selectedFormat} format`);
      
      // Trigger download (mock)
      const link = document.createElement('a');
      link.href = '#'; // Would be the actual file URL
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateShareLink = async () => {
    // Generate shareable link (mock)
    const linkId = Math.random().toString(36).substr(2, 9);
    const generatedUrl = `https://fpa-copilot.app/shared/${linkId}`;
    setShareUrl(generatedUrl);
  };

  const handleCopyLink = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 2000);
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    }
  };

  const handleEmailShare = () => {
    const subject = emailSubject || `FP&A Insight: ${data.title}`;
    const body = emailMessage || `Please find the attached FP&A analysis: ${data.title}`;
    const mailtoUrl = `mailto:${emailRecipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const getDefaultEmailContent = () => {
    const timestamp = new Date().toLocaleDateString();
    return {
      subject: `FP&A Analysis: ${data.title}`,
      message: `Hi,

I'm sharing an important financial analysis from our FP&A Copilot system.

Report: ${data.title}
Generated: ${timestamp}
${data.metadata?.generatedBy ? `By: ${data.metadata.generatedBy}` : ''}

Key insights and recommendations are included in the attached report.

Best regards`
    };
  };

  React.useEffect(() => {
    if (isOpen && !emailSubject && !emailMessage) {
      const defaultContent = getDefaultEmailContent();
      setEmailSubject(defaultContent.subject);
      setEmailMessage(defaultContent.message);
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl animate-fade-in-up ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Export & Share</h2>
            <p className="text-sm text-gray-600 mt-1">{data.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          {/* Export Section */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Download className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Export Report</h3>
            </div>

            {/* Format Selection */}
            <div className="space-y-3 mb-6">
              <label className="text-sm font-medium text-gray-700">Choose Format</label>
              {formatOptions.map((format) => (
                <div
                  key={format.value}
                  onClick={() => setSelectedFormat(format.value as any)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedFormat === format.value
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        selectedFormat === format.value ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {format.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{format.label}</div>
                        <div className="text-sm text-gray-600">{format.description}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{format.fileSize}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export {formatOptions.find(f => f.value === selectedFormat)?.label}
                </>
              )}
            </button>

            {/* Metadata */}
            {data.metadata && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Report Details</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {data.metadata.generatedBy && (
                    <div>Generated by: {data.metadata.generatedBy}</div>
                  )}
                  {data.metadata.timestamp && (
                    <div>Created: {data.metadata.timestamp.toLocaleDateString()}</div>
                  )}
                  {data.metadata.department && (
                    <div>Department: {data.metadata.department}</div>
                  )}
                  {data.metadata.period && (
                    <div>Period: {data.metadata.period}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Share Section */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Share2 className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Share Report</h3>
            </div>

            {/* Generate Share Link */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Share Link
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleGenerateShareLink}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Link2 className="w-4 h-4" />
                  Generate Link
                </button>
              </div>
              
              {shareUrl && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                    >
                      {showCopySuccess ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-green-600 text-sm">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-sm">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">
                    This link will be valid for 30 days and allows view-only access.
                  </p>
                </div>
              )}
            </div>

            {/* Email Share */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Email Report
              </label>
              
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Recipients (comma separated)"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <input
                  type="text"
                  placeholder="Subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <textarea
                  placeholder="Message"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                
                <button
                  onClick={handleEmailShare}
                  disabled={!emailRecipients.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>
              </div>
            </div>

            {/* Share Options */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Sharing Options</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <div>• Recipients can view but not edit</div>
                <div>• Links expire after 30 days</div>
                <div>• Access logs are tracked</div>
                <div>• Data is encrypted in transit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick export button component
interface QuickExportProps {
  data: ExportData;
  variant?: 'button' | 'icon';
  className?: string;
}

export const QuickExport: React.FC<QuickExportProps> = ({
  data,
  variant = 'button',
  className = ''
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={() => setIsExportOpen(true)}
          className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
          title="Export & Share"
        >
          <Download className="w-4 h-4" />
        </button>
        
        <ExportManager
          data={data}
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsExportOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className}`}
      >
        <Download className="w-4 h-4" />
        Export & Share
      </button>
      
      <ExportManager
        data={data}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </>
  );
};

export default ExportManager; 