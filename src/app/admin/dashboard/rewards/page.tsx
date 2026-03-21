"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Reward } from "@/lib/gameTypes";
import { Trophy, Plus, Pencil, Trash2, X, Save, ToggleLeft, ToggleRight, AlertCircle } from "lucide-react";

const EMPTY_REWARD: Partial<Reward> = {
  name: "",
  code: "",
  description: "",
  rewardType: "free_item",
  rewardValue: "",
  couponPrefix: "",
  probabilityWeight: 10,
  isActive: true,
  validFrom: "",
  validTo: "",
  stockLimit: -1,
  dailyLimit: -1,
  displayColor: "#D4A373",
  displayIcon: "🎁",
};

const REWARD_TYPES = [
  { value: "free_item", label: "Free Item" },
  { value: "discount", label: "Discount" },
  { value: "addon", label: "Add-on" },
  { value: "no_reward", label: "No Reward (Lose)" },
];

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReward, setEditingReward] = useState<Partial<Reward> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchRewards();
  }, []);

  async function fetchRewards() {
    try {
      const snap = await getDocs(collection(db, "rewards"));
      setRewards(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Reward)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const openAdd = () => {
    setEditingReward({ ...EMPTY_REWARD });
    setShowModal(true);
  };

  const openEdit = (reward: Reward) => {
    setEditingReward({ ...reward });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingReward || !editingReward.name) return;
    setSaving(true);

    try {
      const { id, createdAt, updatedAt, ...data } = editingReward as any;

      if (id) {
        // Update
        await updateDoc(doc(db, "rewards", id), {
          ...data,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create
        await addDoc(collection(db, "rewards"), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setShowModal(false);
      setEditingReward(null);
      fetchRewards();
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "rewards", id));
      setRewards((prev) => prev.filter((r) => r.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const toggleActive = async (reward: Reward) => {
    try {
      await updateDoc(doc(db, "rewards", reward.id), {
        isActive: !reward.isActive,
        updatedAt: serverTimestamp(),
      });
      setRewards((prev) =>
        prev.map((r) =>
          r.id === reward.id ? { ...r, isActive: !r.isActive } : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const updateField = (field: string, value: any) => {
    setEditingReward((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-4 border-caramel-500/20 border-t-caramel-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-black italic text-cream-50 flex items-center gap-3">
            <Trophy className="text-caramel-500" /> Rewards
          </h1>
          <p className="text-cream-100/30 text-sm mt-1 italic">
            Manage rewards for all games. {rewards.length} total rewards.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-caramel-500 text-chocolate-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-caramel-600 transition-colors shadow-lg"
        >
          <Plus size={14} /> Add Reward
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-chocolate-900/40 border border-white/5 rounded-2xl p-4">
          <span className="text-xl font-black text-cream-50">{rewards.filter(r => r.isActive).length}</span>
          <p className="text-[10px] text-cream-100/30 font-bold uppercase tracking-widest mt-1">Active</p>
        </div>
        <div className="bg-chocolate-900/40 border border-white/5 rounded-2xl p-4">
          <span className="text-xl font-black text-cream-50">{rewards.filter(r => r.rewardType === "no_reward").length}</span>
          <p className="text-[10px] text-cream-100/30 font-bold uppercase tracking-widest mt-1">No Reward</p>
        </div>
        <div className="bg-chocolate-900/40 border border-white/5 rounded-2xl p-4">
          <span className="text-xl font-black text-cream-50">
            {rewards.reduce((sum, r) => sum + r.probabilityWeight, 0)}
          </span>
          <p className="text-[10px] text-cream-100/30 font-bold uppercase tracking-widest mt-1">Total Weight</p>
        </div>
      </div>

      {/* Rewards Table */}
      <div className="bg-chocolate-900/40 border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-cream-100/30 px-6 py-4">Reward</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-cream-100/30 px-4 py-4">Type</th>
                <th className="text-center text-[10px] font-black uppercase tracking-widest text-cream-100/30 px-4 py-4">Weight</th>
                <th className="text-center text-[10px] font-black uppercase tracking-widest text-cream-100/30 px-4 py-4">Status</th>
                <th className="text-right text-[10px] font-black uppercase tracking-widest text-cream-100/30 px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((reward) => (
                <tr key={reward.id} className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${!reward.isActive ? "opacity-40" : ""}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{reward.displayIcon}</span>
                      <div>
                        <span className="text-sm font-bold text-cream-50">{reward.name}</span>
                        <p className="text-[10px] text-cream-100/20">{reward.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                      reward.rewardType === "no_reward"
                        ? "bg-white/5 text-cream-100/30"
                        : reward.rewardType === "discount"
                        ? "bg-amber-500/10 text-amber-400"
                        : reward.rewardType === "addon"
                        ? "bg-violet-500/10 text-violet-400"
                        : "bg-emerald-500/10 text-emerald-400"
                    }`}>
                      {reward.rewardType.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-black text-caramel-500">{reward.probabilityWeight}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button onClick={() => toggleActive(reward)} className="mx-auto">
                      {reward.isActive ? (
                        <ToggleRight size={24} className="text-emerald-400" />
                      ) : (
                        <ToggleLeft size={24} className="text-cream-100/20" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(reward)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-cream-100/40 hover:text-caramel-500">
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(reward.id)}
                        className="p-2 hover:bg-rose-500/10 rounded-lg transition-colors text-cream-100/20 hover:text-rose-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && editingReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-chocolate-950/90 backdrop-blur-md" onClick={() => setShowModal(false)} />

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-lg bg-chocolate-900 border border-white/10 rounded-3xl p-8 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-heading font-black italic text-cream-50">
                  {editingReward.id ? "Edit Reward" : "Add Reward"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-cream-100/30 hover:text-cream-50">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-[auto_1fr] gap-4 items-end">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">Icon</label>
                    <input
                      value={editingReward.displayIcon || ""}
                      onChange={(e) => updateField("displayIcon", e.target.value)}
                      className="w-16 bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-center text-xl focus:border-caramel-500/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">Reward Name</label>
                    <input
                      value={editingReward.name || ""}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="e.g. Free Brownie Laddu"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">Description</label>
                  <input
                    value={editingReward.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Short description of the reward"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">Reward Type</label>
                    <select
                      value={editingReward.rewardType || "free_item"}
                      onChange={(e) => updateField("rewardType", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none"
                    >
                      {REWARD_TYPES.map((t) => (
                        <option key={t.value} value={t.value} className="bg-chocolate-950">{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">Reward Value</label>
                    <input
                      value={editingReward.rewardValue || ""}
                      onChange={(e) => updateField("rewardValue", e.target.value)}
                      placeholder="e.g. 10 or Brownie"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">Coupon Prefix</label>
                    <input
                      value={editingReward.couponPrefix || ""}
                      onChange={(e) => updateField("couponPrefix", e.target.value.toUpperCase())}
                      placeholder="e.g. LADDU"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">
                      Probability Weight
                    </label>
                    <input
                      type="number"
                      value={editingReward.probabilityWeight || 0}
                      onChange={(e) => updateField("probabilityWeight", parseInt(e.target.value) || 0)}
                      min={0}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">Daily Limit (-1 = unlimited)</label>
                    <input
                      type="number"
                      value={editingReward.dailyLimit ?? -1}
                      onChange={(e) => updateField("dailyLimit", parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-cream-100/30 mb-2 block">Stock Limit (-1 = unlimited)</label>
                    <input
                      type="number"
                      value={editingReward.stockLimit ?? -1}
                      onChange={(e) => updateField("stockLimit", parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream-50 text-sm focus:border-caramel-500/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white/5 rounded-xl px-5 py-4">
                  <span className="text-sm text-cream-50 font-bold">Active</span>
                  <button
                    onClick={() => updateField("isActive", !editingReward.isActive)}
                    className={editingReward.isActive ? "text-emerald-400" : "text-cream-100/20"}
                  >
                    {editingReward.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving || !editingReward.name}
                  className="w-full bg-caramel-500 text-chocolate-950 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-caramel-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={14} /> {saving ? "Saving..." : "Save Reward"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-chocolate-950/90 backdrop-blur-md" onClick={() => setDeleteConfirm(null)} />
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative z-10 bg-chocolate-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center"
            >
              <AlertCircle size={48} className="text-rose-400 mx-auto mb-4" />
              <h3 className="text-lg font-heading font-black italic text-cream-50 mb-2">Delete Reward?</h3>
              <p className="text-cream-100/30 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-cream-100/60 text-sm font-bold hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-3 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
