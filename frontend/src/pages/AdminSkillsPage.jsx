import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import BorderGlow from '../components/ui/BorderGlow';
import GlassSelect from '../components/ui/GlassSelect';
import { employeeService } from '../api/employeeService';
import { skillService } from '../api/skillService';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Zap, BookOpen, Star, AlertCircle, CheckCircle,
  Award, Layers
} from 'lucide-react';

const PROFICIENCY_LABELS = ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'];
const PROFICIENCY_COLORS = ['', '#6b7280', '#3b82f6', '#22d3ee', '#a78bfa', '#fbbf24'];

const glassSelect = "w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500/50 outline-none transition-all appearance-none cursor-pointer";
const glassInput  = "w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500/50 outline-none transition-all";

const CATEGORY_COLORS = {
  Technical: '#22d3ee',
  Design:    '#a78bfa',
  Management:'#fbbf24',
  'Soft Skills': '#34d399',
  Default:   '#fb923c',
};

const AdminSkillsPage = () => {
  const [searchParams] = useSearchParams();
  const initialEmpId = searchParams.get('employeeId') || '';
  const [skills, setSkills] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [skillSubmitting, setSkillSubmitting] = useState(false);
  const [assignSubmitting, setAssignSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState(initialEmpId ? 'assign' : 'library'); // 'library' | 'create' | 'assign'

  const [skillForm, setSkillForm] = useState({ name: '', category: '', description: '' });
  const [assignForm, setAssignForm] = useState({ 
    employeeId: initialEmpId, 
    skillId: '', 
    proficiencyLevel: 3, 
    yearsOfExperience: 0 
  });

  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const loadData = async () => {
    try {
      setLoading(true);
      const [skillResult, employeeResult] = await Promise.all([
        skillService.getSkills(),
        employeeService.getAllEmployees({ limit: 200 }),
      ]);
      if (skillResult.success) setSkills(skillResult.data || []);
      if (employeeResult.success) setEmployees(employeeResult.data || []);
    } catch (err) { setError('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const createSkill = async (e) => {
    e.preventDefault();
    try {
      setSkillSubmitting(true);
      const result = await skillService.createSkill(skillForm);
      if (result.success) {
        setSkills(prev => [result.data, ...prev]);
        setSkillForm({ name: '', category: '', description: '' });
        showSuccess(`Skill "${result.data.name}" created successfully!`);
        setActiveSection('library');
      }
    } catch (err) { setError(err.response?.data?.message || 'Failed to create skill'); }
    finally { setSkillSubmitting(false); }
  };

  const assignSkill = async (e) => {
    e.preventDefault();
    try {
      setAssignSubmitting(true);
      const result = await skillService.assignSkill({
        ...assignForm,
        proficiencyLevel: Number(assignForm.proficiencyLevel),
        yearsOfExperience: Number(assignForm.yearsOfExperience),
      });
      if (result.success) {
        setAssignments(prev => [result.data, ...prev.filter(a => a._id !== result.data._id)]);
        setAssignForm({ employeeId: '', skillId: '', proficiencyLevel: 3, yearsOfExperience: 0 });
        showSuccess('Skill assigned successfully!');
      }
    } catch (err) { setError(err.response?.data?.message || 'Failed to assign skill'); }
    finally { setAssignSubmitting(false); }
  };

  const loadAssignmentsForEmployee = async (employeeId) => {
    if (!employeeId) return;
    try {
      const result = await skillService.getEmployeeSkills(employeeId);
      if (result.success) setAssignments(result.data || []);
    } catch (err) { setError('Failed to load employee skills'); }
  };

  const sectionTabs = [
    { id: 'library', label: 'Skill Library', Icon: BookOpen },
    { id: 'create',  label: 'Create Skill',  Icon: Plus     },
    { id: 'assign',  label: 'Assign Skill',  Icon: Award    },
  ];

  return (
    <AppShell userRole="admin">
      <PageHeader title="Skill Matrix" subtitle="Manage the master skill library and employee competencies" />

      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div key="err" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />{error}
            <button onClick={() => setError('')} className="ml-auto text-red-400/50 hover:text-red-400">✕</button>
          </motion.div>
        )}
        {successMsg && (
          <motion.div key="ok" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-400">
            <CheckCircle className="w-4 h-4 shrink-0" />{successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Tab Switcher */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {sectionTabs.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setActiveSection(id)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeSection === id ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-white/5 border border-white/5 text-slate-400 hover:bg-white/10'
            }`}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* SKILL LIBRARY */}
        {activeSection === 'library' && (
          <motion.div key="library" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <BorderGlow borderRadius={28}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Skill Library</h3>
                    <p className="text-[10px] text-slate-500">{skills.length} skills in the master library</p>
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-16 gap-3">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
                    <span className="text-slate-500 text-sm">Loading skills…</span>
                  </div>
                ) : skills.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <BookOpen className="w-10 h-10 text-slate-700" />
                    <p className="text-slate-500 text-sm">No skills yet. Create the first one!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {skills.map((skill, idx) => {
                      const catColor = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.Default;
                      return (
                        <motion.div key={skill._id}
                          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.04 }}
                          className="group p-5 rounded-2xl bg-white/4 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all">
                          <div className="flex items-start justify-between mb-3">
                            <div className="p-2 rounded-lg" style={{ background: `${catColor}15`, border: `1px solid ${catColor}25` }}>
                              <Zap className="w-3.5 h-3.5" style={{ color: catColor }} />
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${skill.isActive ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-500 bg-white/5 border-white/5'}`}>
                              {skill.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">{skill.name}</h4>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ background: catColor }} />
                            <span className="text-[10px] text-slate-500 font-medium">{skill.category}</span>
                          </div>
                          {skill.description && (
                            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed line-clamp-2">{skill.description}</p>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </BorderGlow>
          </motion.div>
        )}

        {/* CREATE SKILL */}
        {activeSection === 'create' && (
          <motion.div key="create" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <BorderGlow borderRadius={28}>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <Plus className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Create New Skill</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Add a skill to the master library</p>
                  </div>
                </div>
                <form onSubmit={createSkill} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Skill Name *</label>
                      <input type="text" placeholder="e.g. React, Figma, Leadership…"
                        value={skillForm.name}
                        onChange={e => setSkillForm(p => ({ ...p, name: e.target.value }))}
                        className={glassInput} required />
                    </div>
                    <GlassSelect label="Category *"
                      value={skillForm.category}
                      onChange={v => setSkillForm(p => ({ ...p, category: v }))}
                      options={Object.keys(CATEGORY_COLORS).map(c => ({ value: c, label: c }))}
                      placeholder="Select Category"
                      required />
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Description</label>
                      <input type="text" placeholder="Brief description (optional)…"
                        value={skillForm.description}
                        onChange={e => setSkillForm(p => ({ ...p, description: e.target.value }))}
                        className={glassInput} />
                    </div>
                  </div>
                  <motion.button type="submit" disabled={skillSubmitting}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-900/30 disabled:opacity-50">
                    <Plus className="w-4 h-4" />{skillSubmitting ? 'Adding…' : 'Add Skill'}
                  </motion.button>
                </form>
              </div>
            </BorderGlow>
          </motion.div>
        )}

        {/* ASSIGN SKILL */}
        {activeSection === 'assign' && (
          <motion.div key="assign" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <BorderGlow borderRadius={28}>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Assign Skill to Employee</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Endorse a skill on an employee's profile</p>
                  </div>
                </div>

                <form onSubmit={assignSkill} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <GlassSelect label="Employee *"
                      value={assignForm.employeeId}
                      onChange={v => { setAssignForm(p => ({ ...p, employeeId: v })); loadAssignmentsForEmployee(v); }}
                      options={employees.map(emp => ({ value: emp._id, label: emp.email }))}
                      placeholder="Select Employee"
                      required />

                    <GlassSelect label="Skill *"
                      value={assignForm.skillId}
                      onChange={v => setAssignForm(p => ({ ...p, skillId: v }))}
                      options={skills.map(s => ({ value: s._id, label: `${s.name} (${s.category})` }))}
                      placeholder="Select Skill"
                      required />

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                        Proficiency Level * —
                        <span className="ml-1" style={{ color: PROFICIENCY_COLORS[assignForm.proficiencyLevel] || '#fff' }}>
                          {PROFICIENCY_LABELS[assignForm.proficiencyLevel] || ''}
                        </span>
                      </label>
                      <div className="flex items-center gap-3">
                        <input type="range" min={1} max={5} value={assignForm.proficiencyLevel}
                          onChange={e => setAssignForm(p => ({ ...p, proficiencyLevel: Number(e.target.value) }))}
                          className="flex-1 accent-violet-500 h-2 rounded-full" />
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border"
                          style={{ background: `${PROFICIENCY_COLORS[assignForm.proficiencyLevel]}20`, color: PROFICIENCY_COLORS[assignForm.proficiencyLevel], borderColor: `${PROFICIENCY_COLORS[assignForm.proficiencyLevel]}40` }}>
                          {assignForm.proficiencyLevel}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Years of Experience</label>
                      <input type="number" min={0} value={assignForm.yearsOfExperience}
                        onChange={e => setAssignForm(p => ({ ...p, yearsOfExperience: e.target.value }))}
                        className={glassInput} />
                    </div>
                  </div>

                  <motion.button type="submit" disabled={assignSubmitting}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-amber-900/20 disabled:opacity-50">
                    <Award className="w-4 h-4" />{assignSubmitting ? 'Assigning…' : 'Assign Skill'}
                  </motion.button>
                </form>
              </div>
            </BorderGlow>

            {/* Employee's current skills */}
            {assignments.length > 0 && (
              <BorderGlow borderRadius={24}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <Layers className="w-4 h-4 text-slate-400" />
                    <h3 className="text-sm font-bold text-white">Current Skills</h3>
                    <span className="ml-auto text-[10px] font-bold text-slate-600">{assignments.length} endorsed</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {assignments.map((a, idx) => {
                      const lvl = a.proficiencyLevel || 1;
                      const pctColor = PROFICIENCY_COLORS[lvl] || '#6b7280';
                      return (
                        <motion.div key={a._id}
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                          className="p-4 rounded-xl bg-white/4 border border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-white">{a.skillId?.name || '—'}</span>
                            <span className="text-[10px] font-bold" style={{ color: pctColor }}>{PROFICIENCY_LABELS[lvl]}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-white/5">
                              <div className="h-full rounded-full transition-all" style={{ width: `${(lvl / 5) * 100}%`, background: pctColor }} />
                            </div>
                            <span className="text-[10px] text-slate-500">{a.yearsOfExperience}yr</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </BorderGlow>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
};

export default AdminSkillsPage;
