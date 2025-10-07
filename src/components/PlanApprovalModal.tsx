import React, { useState } from 'react';
import { CheckCircle, XCircle, Edit3, Clock, FileText, Code, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlanApprovalModalProps {
  plan: string;
  onApprove: () => void;
  onReject: () => void;
  onEdit: (editedPlan: string) => void;
  isVisible: boolean;
}

const PlanApprovalModal: React.FC<PlanApprovalModalProps> = ({
  plan,
  onApprove,
  onReject,
  onEdit,
  isVisible
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState(plan);
  const [estimatedTime, setEstimatedTime] = useState(30);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPlan(plan);
  };

  const handleSaveEdit = () => {
    onEdit(editedPlan);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedPlan(plan);
  };

  const parsePlan = (planText: string) => {
    const sections = {
      overview: '',
      fileTree: '',
      steps: '',
      features: '',
      techStack: ''
    };

    const lines = planText.split('\n');
    let currentSection = '';

    lines.forEach(line => {
      const lower = line.toLowerCase();
      if (lower.includes('overview') || lower.includes('description')) {
        currentSection = 'overview';
      } else if (lower.includes('file') && (lower.includes('tree') || lower.includes('structure'))) {
        currentSection = 'fileTree';
      } else if (lower.includes('step') || lower.includes('implementation')) {
        currentSection = 'steps';
      } else if (lower.includes('feature')) {
        currentSection = 'features';
      } else if (lower.includes('tech') || lower.includes('stack')) {
        currentSection = 'techStack';
      } else if (line.trim() && currentSection) {
        sections[currentSection as keyof typeof sections] += line + '\n';
      }
    });

    return sections;
  };

  const planSections = parsePlan(plan);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onReject}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-gradient-to-br from-purple-900 to-blue-900 border border-purple-500/30 rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-auto m-4 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Project Plan Review</h3>
                  <p className="text-purple-200">Review and approve the AI-generated plan</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-purple-200">
                <Clock className="w-4 h-4" />
                <span>Est. {estimatedTime} minutes</span>
              </div>
            </div>
            
            {!isEditing ? (
              <div className="space-y-6">
                {/* Plan Overview */}
                {planSections.overview && (
                  <div className="bg-black/30 border border-purple-500/20 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      Project Overview
                    </h4>
                    <div className="text-purple-100 whitespace-pre-wrap">{planSections.overview}</div>
                  </div>
                )}
                
                {/* File Structure */}
                {planSections.fileTree && (
                  <div className="bg-black/30 border border-blue-500/20 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Code className="w-5 h-5 text-blue-400" />
                      File Structure
                    </h4>
                    <pre className="text-blue-100 text-sm whitespace-pre-wrap font-mono">{planSections.fileTree}</pre>
                  </div>
                )}
                
                {/* Implementation Steps */}
                {planSections.steps && (
                  <div className="bg-black/30 border border-green-500/20 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Implementation Steps
                    </h4>
                    <div className="text-green-100 whitespace-pre-wrap">{planSections.steps}</div>
                  </div>
                )}
                
                {/* Full Plan Fallback */}
                {!planSections.overview && !planSections.fileTree && !planSections.steps && (
                  <div className="bg-black/30 border border-white/20 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Complete Plan</h4>
                    <pre className="text-purple-100 whitespace-pre-wrap text-sm">{plan}</pre>
                  </div>
                )}
                
                {/* Time Estimation */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-semibold">Time Estimation</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm text-gray-300">Estimated completion time:</label>
                    <input
                      type="range"
                      min="5"
                      max="120"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-white font-bold">{estimatedTime} min</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Edit Plan</h4>
                <textarea
                  value={editedPlan}
                  onChange={(e) => setEditedPlan(e.target.value)}
                  className="w-full h-96 bg-black/30 border border-purple-500/30 text-white rounded-xl p-4 text-sm font-mono focus:outline-none focus:border-purple-400 resize-none"
                  placeholder="Edit the plan..."
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {!isEditing && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
                <div className="flex gap-3">
                  <button
                    onClick={handleEdit}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="w-5 h-5" />
                    Edit Plan
                  </button>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={onReject}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                  <button
                    onClick={onApprove}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-lg"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve & Execute
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PlanApprovalModal;