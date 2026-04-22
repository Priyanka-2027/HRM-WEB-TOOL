import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import BorderGlow from '../components/ui/BorderGlow';
import { skillService } from '../api/skillService';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Layers, Star, AlertCircle } from 'lucide-react';

const PROFICIENCY_LABELS = ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'];
const PROFICIENCY_COLORS = ['', '#6b7280', '#3b82f6', '#22d3ee', '#a78bfa', '#fbbf24'];

const CATEGORY_COLORS = {
  Technical:    '#22d3ee',
  Design:       '#a78bfa',
  Management:   '#fbbf24',
  'Soft Skills':'#34d399',
  Default:      '#fb923c',
};

const StatCard = ({ label, value, accent }) => {
  const clrs = {
    white:  'from-white/5 to-white/0 border-white/10 text-white',
    amber:  'from-amber-500/10 to-amber-500/0 border-amber-500/20 text-amber-400',
    cyan:   'from-cyan-500/10 to-cyan-500/0 border-cyan-500/20 text-cyan-400',
  }[accent] || 'from-white/5 to-white/0 border-white/10 text-white';

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border bg-gradient-to-b p-5 ${clrs}`}>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">{label}</p>
      <p className="text-3xl font-black">{value}</p>
    </motion.div>
  );
};

const EmployeeSkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const total   = skills.length;
  const expert  = skills.filter(s => s.proficiencyLevel >= 4).length;
  const beginner= skills.filter(s => s.proficiencyLevel <= 2).length;

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await skillService.getMySkills();
        if (result.success) {
          setSkills(result.data || []);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError('No employee profile found. Please contact an admin to link your account.');
        } else {
          setError('Failed to load your skills. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <AppShell>
      <PageHeader title="My Skills" subtitle="Your current skill proficiency profile" />

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Skills"  value={total}    accent="white"  />
        <StatCard label="Expert Level"  value={expert}   accent="amber"  />
        <StatCard label="Beginner Level"value={beginner} accent="cyan"   />
      </div>

      {/* Skill Cards */}
      <BorderGlow borderRadius={28}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <Layers className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Skill Inventory</h3>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-6 h-6 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
              <p className="text-slate-500 text-sm">Loading skills…</p>
            </div>
          ) : skills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Zap className="w-10 h-10 text-slate-700" />
              <p className="text-slate-500 text-sm">No skills have been assigned yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence>
                {skills.map((skill, idx) => {
                  const lvl   = skill.proficiencyLevel || 1;
                  const pct   = (lvl / 5) * 100;
                  const color = PROFICIENCY_COLORS[lvl] || '#6b7280';
                  const catColor = CATEGORY_COLORS[skill.skillId?.category] || CATEGORY_COLORS.Default;

                  return (
                    <motion.div key={skill._id}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                      className="p-5 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-lg" style={{ background: `${catColor}15`, border: `1px solid ${catColor}25` }}>
                          <Zap className="w-3.5 h-3.5" style={{ color: catColor }} />
                        </div>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} className="w-3 h-3"
                              style={{ color: i <= lvl ? color : '#ffffff10', fill: i <= lvl ? color : 'transparent' }} />
                          ))}
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-0.5">{skill.skillId?.name || '—'}</h4>
                      <div className="flex items-center gap-1.5 mb-4">
                        <div className="w-2 h-2 rounded-full" style={{ background: catColor }} />
                        <span className="text-[10px] text-slate-500">{skill.skillId?.category || '—'}</span>
                      </div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold" style={{ color }}>{PROFICIENCY_LABELS[lvl]}</span>
                        <span className="text-[10px] text-slate-600">{skill.yearsOfExperience}yr exp</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5">
                        <motion.div className="h-full rounded-full"
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: idx * 0.05 + 0.3, duration: 0.6 }}
                          style={{ background: color }} />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </BorderGlow>
    </AppShell>
  );
};

export default EmployeeSkillsPage;
