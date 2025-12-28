
import React from 'react';
import { MeetingAnalysis, SentimentLabel, UrgencyLevel, DecisionStatus, ConfidenceLevel } from '../types';
import { 
  CheckCircle, 
  AlertTriangle, 
  Target, 
  User, 
  Calendar, 
  MessageSquare, 
  BarChart2, 
  Download, 
  Copy,
  ChevronRight,
  Flag,
  ShieldCheck
} from 'lucide-react';

interface AnalysisResultProps {
  analysis: MeetingAnalysis;
  onReset: () => void;
}

const SentimentBadge: React.FC<{ sentiment: { label: string, explanation: string } }> = ({ sentiment }) => {
  const colors = {
    [SentimentLabel.Positive]: 'bg-green-100 text-green-800 border-green-200',
    [SentimentLabel.Neutral]: 'bg-blue-100 text-blue-800 border-blue-200',
    [SentimentLabel.Tense]: 'bg-orange-100 text-orange-800 border-orange-200',
    [SentimentLabel.Conflicted]: 'bg-red-100 text-red-800 border-red-200',
  };
  
  return (
    <div className={`px-4 py-2 rounded-lg border flex flex-col gap-1 ${colors[sentiment.label as SentimentLabel] || 'bg-gray-100 text-gray-800'}`}>
      <span className="font-bold text-sm uppercase tracking-wider">{sentiment.label}</span>
      <p className="text-xs opacity-90 leading-tight">{sentiment.explanation}</p>
    </div>
  );
};

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const colors = {
    [UrgencyLevel.High]: 'bg-red-100 text-red-700',
    [UrgencyLevel.Medium]: 'bg-orange-100 text-orange-700',
    [UrgencyLevel.Low]: 'bg-green-100 text-green-700',
  };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${colors[priority as UrgencyLevel] || 'bg-gray-100'}`}>{priority}</span>;
};

const ConfidenceBadge: React.FC<{ level: string }> = ({ level }) => {
  const colors = {
    [ConfidenceLevel.High]: 'bg-indigo-100 text-indigo-700',
    [ConfidenceLevel.Medium]: 'bg-blue-100 text-blue-700',
    [ConfidenceLevel.Low]: 'bg-slate-100 text-slate-700',
  };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 ${colors[level as ConfidenceLevel] || 'bg-gray-100'}`}>
    <ShieldCheck size={10} /> {level} Confidence
  </span>;
};

const DecisionBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors = {
    [DecisionStatus.Final]: 'text-green-600',
    [DecisionStatus.Tentative]: 'text-blue-600',
    [DecisionStatus.NeedsApproval]: 'text-orange-600',
  };
  return <span className={`text-[11px] font-semibold italic flex items-center gap-1 ${colors[status as DecisionStatus] || 'text-gray-600'}`}>
    <ChevronRight size={12} /> {status}
  </span>;
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, onReset }) => {
  const copyToClipboard = () => {
    const formatted = `
Meeting Type: ${analysis.meetingType}
Overall Sentiment: ${analysis.overallSentiment.label}

Executive Summary:
${analysis.executiveSummary}

Decisions:
${analysis.decisions.map(d => `- ${d.text} (${d.status} | Confidence: ${d.confidence})`).join('\n')}

Action Items:
${analysis.actionItems.map(a => `- ${a.task} | ${a.owner} | ${a.priority} | ${a.deadline}`).join('\n')}

Ambiguities & Risks:
${analysis.ambiguitiesAndRisks.map(r => `- ${r.issue} | ${r.explanation}`).join('\n')}

Next Execution Checkpoint:
${analysis.nextExecutionCheckpoint.description} (Target: ${analysis.nextExecutionCheckpoint.deadline})

Productivity Insights:
${analysis.productivityInsights.map(i => `- ${i}`).join('\n')}
${analysis.suggestedImprovements.map(i => `- ${i}`).join('\n')}
    `.trim();
    navigator.clipboard.writeText(formatted);
    alert('Analysis copied to clipboard in corporate format.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Intelligence Report</h1>
          <p className="text-slate-500 font-medium">Meeting Type: <span className="text-slate-700">{analysis.meetingType}</span></p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-white transition-all text-slate-600 text-sm font-semibold shadow-sm"
          >
            <Copy size={16} /> Copy to Clipboard
          </button>
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all text-sm font-semibold shadow-md"
          >
            New Analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Summary */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <BarChart2 size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Executive Summary</h2>
            </div>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {analysis.executiveSummary}
            </p>
          </section>

          {/* Action Items */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Target size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Action Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-4">Task Description</th>
                    <th className="pb-3 px-4">Owner</th>
                    <th className="pb-3 px-4">Priority</th>
                    <th className="pb-3 pl-4">Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {analysis.actionItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 pr-4 text-sm font-medium text-slate-700">{item.task}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <User size={14} className="opacity-50" />
                          {item.owner || 'Unassigned'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <PriorityBadge priority={item.priority} />
                      </td>
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Calendar size={14} className="opacity-50" />
                          {item.deadline || 'TBD'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Decisions */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <CheckCircle size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Key Decisions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.decisions.map((decision, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                  <p className="text-sm font-semibold text-slate-800 leading-snug">{decision.text}</p>
                  <div className="flex flex-col gap-2">
                    <DecisionBadge status={decision.status} />
                    <ConfidenceBadge level={decision.confidence} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Next Execution Checkpoint */}
          <section className="bg-indigo-50 rounded-xl shadow-sm border border-indigo-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-600 text-white rounded-lg">
                <Flag size={20} />
              </div>
              <h2 className="text-xl font-bold text-indigo-900">Next Execution Checkpoint</h2>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-indigo-800 font-medium leading-relaxed">
                {analysis.nextExecutionCheckpoint.description}
              </p>
              <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold border border-indigo-200">
                <Calendar size={16} />
                By {analysis.nextExecutionCheckpoint.deadline}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Sentiment */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
             <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <MessageSquare size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Tone Analysis</h2>
            </div>
            <SentimentBadge sentiment={analysis.overallSentiment} />
          </section>

          {/* Risks & Ambiguities */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <AlertTriangle size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Risks & Ambiguities</h2>
            </div>
            <div className="space-y-4">
              {analysis.ambiguitiesAndRisks.map((risk, idx) => (
                <div key={idx} className="space-y-1">
                  <h4 className="text-sm font-bold text-red-700">{risk.issue}</h4>
                  <p className="text-xs text-slate-500 leading-normal">{risk.explanation}</p>
                </div>
              ))}
              {analysis.ambiguitiesAndRisks.length === 0 && (
                <p className="text-xs text-slate-400 italic">No significant risks detected.</p>
              )}
            </div>
          </section>

          {/* Productivity Insights */}
          <section className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl shadow-lg p-6 text-white">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BarChart2 size={18} /> Productivity Boosters
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider mb-2">Observations</p>
                <ul className="space-y-2">
                  {analysis.productivityInsights.map((insight, idx) => (
                    <li key={idx} className="text-sm leading-tight flex gap-2">
                      <span className="opacity-50 text-indigo-300">•</span> {insight}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-indigo-500/30">
                <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider mb-2">Suggestions</p>
                <ul className="space-y-2">
                  {analysis.suggestedImprovements.map((imp, idx) => (
                    <li key={idx} className="text-sm font-medium leading-tight flex gap-2">
                      <CheckCircle size={14} className="text-green-300 shrink-0 mt-0.5" />
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Participants */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <User size={18} className="text-slate-400" /> Participants
            </h2>
            <div className="flex flex-wrap gap-2">
              {analysis.participants.map((p, idx) => (
                <div key={idx} className="group relative">
                  <div className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold hover:bg-slate-200 transition-colors cursor-default">
                    {p.name}
                    {p.role && <span className="ml-1 text-[10px] opacity-60 font-normal">({p.role})</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
