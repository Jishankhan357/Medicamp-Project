import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory, addItem, deleteItem } from './redux/inventorySlice';
import { Package, AlertTriangle, Trash2, PlusCircle } from 'lucide-react';

function Inventory() {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.inventory);
  const [form, setForm] = useState({ itemName: '', category: 'Medicine', quantity: '', dailyUsage: '' });

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(addItem(form));
    setForm({ itemName: '', category: 'Medicine', quantity: '', dailyUsage: '' });
  };

  // --- THE AI LOGIC ---
  const getStatus = (qty, usage) => {
    const daysLeft = Math.floor(qty / usage);
    if (daysLeft < 7) return { color: 'bg-red-100 text-red-700 border-red-200', msg: `Critical: Ends in ${daysLeft} days!` };
    if (daysLeft < 30) return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', msg: `Low: Ends in ${daysLeft} days` };
    return { color: 'bg-green-100 text-green-700 border-green-200', msg: `Good: ${daysLeft} days stock` };
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* 1. ADD ITEM FORM */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 h-fit">
        <h2 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-400 border-b dark:border-slate-700 pb-2">Add Stock</h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <input type="text" placeholder="Item Name (e.g. Paracetamol)" value={form.itemName} onChange={e => setForm({...form, itemName: e.target.value})} className="p-3 rounded-lg border dark:bg-slate-700 dark:border-slate-600 outline-none" required />
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="p-3 rounded-lg border dark:bg-slate-700 dark:border-slate-600 outline-none">
            <option>Medicine</option>
            <option>Equipment</option>
            <option>Consumable</option>
          </select>
          <div className="flex gap-2">
            <input type="number" placeholder="Qty" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} className="w-1/2 p-3 rounded-lg border dark:bg-slate-700 dark:border-slate-600 outline-none" required />
            <input type="number" placeholder="Daily Use" value={form.dailyUsage} onChange={e => setForm({...form, dailyUsage: e.target.value})} className="w-1/2 p-3 rounded-lg border dark:bg-slate-700 dark:border-slate-600 outline-none" required />
          </div>
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2"><PlusCircle size={20}/> Add to Inventory</button>
        </form>
      </div>

      {/* 2. SMART LIST */}
      <div className="md:col-span-2 space-y-4">
        {list.map((item) => {
          const status = getStatus(item.quantity, item.dailyUsage);
          return (
            <div key={item._id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 flex justify-between items-center group">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${status.color.split(' ')[0]}`}>
                  <Package size={24} className={status.color.split(' ')[1]} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">{item.itemName}</h3>
                  <p className="text-sm text-slate-500">{item.category} • {item.quantity} Units Left</p>
                  
                  {/* PREDICTION BADGE */}
                  <div className={`mt-2 inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border ${status.color}`}>
                    <AlertTriangle size={12} /> {status.msg}
                  </div>
                </div>
              </div>
              <button onClick={() => dispatch(deleteItem(item._id))} className="text-slate-300 hover:text-red-500 p-2"><Trash2 /></button>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default Inventory;