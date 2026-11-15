import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { formatCurrency } from '../../utils/formatters';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
  Flame,
  Leaf
} from 'lucide-react';

export default function MenuPage() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleItemAvailability, toggleItemQrVisibility } = useCafe();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    category: 'Coffee',
    price: '',
    description: '',
    isVeg: true,
    isBestseller: false,
    available: true,
    image: '',
    prepTime: '5 mins'
  });

  const categories = [
    'All',
    'Coffee',
    'Tea',
    'Pizza',
    'Burger',
    'Sandwich',
    'Cold Drinks',
    'Desserts',
    'Snacks',
    'Other'
  ];

  const standardCategories = categories.filter(c => c !== 'All' && c !== 'Other');

  // Image presets for quick demo item creation
  const imagePresets = {
    Coffee: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    Tea: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
    Pizza: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80",
    Burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    Sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
    "Cold Drinks": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
    Desserts: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80",
    Snacks: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80"
    ,Other: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80"
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Coffee',
      customCategory: '',
      price: '',
      description: '',
      isVeg: true,
      isBestseller: false,
      available: true,
      image: imagePresets.Coffee,
      prepTime: '5 mins'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: standardCategories.includes(item.category) ? item.category : 'Other',
      customCategory: standardCategories.includes(item.category) ? '' : item.category,
      price: item.price,
      description: item.description,
      isVeg: item.isVeg,
      isBestseller: item.isBestseller,
      available: item.available,
      image: item.image,
      prepTime: item.prepTime || '5 mins'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    const finalCategory = formData.category === 'Other'
      ? formData.customCategory.trim() || 'Other'
      : formData.category;

    if (editingItem) {
      updateMenuItem(editingItem.id, {
        ...formData,
        category: finalCategory,
        price: Number(formData.price)
      });
    } else {
      addMenuItem({
        ...formData,
        category: finalCategory,
        price: Number(formData.price),
        image: formData.image || imagePresets[formData.category] || imagePresets.Coffee
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#241A14] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#5C3A21]" />
            Menu Catalog & Pricing
          </h2>
          <p className="text-xs text-[#8A7A6E]">
            Add culinary creations, update real-time pricing, and manage instant customer availability.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#E58A3A] hover:bg-[#D77A28] text-white text-xs font-bold shadow-md shadow-[#E58A3A]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Controls: Search & Category Tabs */}
      <div className="bg-white p-4 rounded-3xl border border-[#E8E0D5] shadow-sm space-y-3">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7A6E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu catalog..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#5C3A21]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => {
            const count = cat === 'All' ? menuItems.length : menuItems.filter(i => i.category === cat).length;
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#5C3A21] text-white border-[#5C3A21] shadow-sm'
                    : 'bg-[#FAF7F2] text-[#665A4F] border-[#E8E0D5] hover:bg-[#EAE3D9]'
                }`}
              >
                {cat} <span className="opacity-70 ml-1">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`bg-white rounded-3xl border overflow-hidden flex flex-col justify-between transition-all hover:shadow-md ${
              item.available ? 'border-[#E8E0D5]' : 'border-gray-200 opacity-60 bg-gray-50'
            }`}
          >
            <div>
              {/* Image banner */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span
                    className={`w-4 h-4 rounded-md border flex items-center justify-center p-0.5 ${
                      item.isVeg ? 'border-emerald-600 bg-white' : 'border-rose-600 bg-white'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    />
                  </span>
                  {item.isBestseller && (
                    <span className="px-2 py-0.5 rounded-md bg-[#E58A3A] text-white text-[10px] font-extrabold shadow-sm">
                      Bestseller
                    </span>
                  )}
                </div>

                <div className="absolute top-2 right-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#241A14]/80 backdrop-blur-sm text-white font-extrabold text-xs">
                    {formatCurrency(item.price)}
                  </span>
                </div>
              </div>

              {/* Item Info */}
              <div className="p-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#8A7A6E]">
                  <span>{item.category}</span>
                  <span>{item.prepTime || '5 mins'}</span>
                </div>
                <h3 className="font-bold text-sm text-[#241A14] line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-xs text-[#665A4F] line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Bottom Actions: stock + QR visibility + edit + delete */}
            <div className="p-3 bg-[#FAF7F2] border-t border-[#E8E0D5] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleItemAvailability(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold transition-colors ${item.available ? 'text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200' : 'text-gray-500 bg-gray-200 hover:bg-gray-300'}`}
                  title="Toggle kitchen stock"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-emerald-600' : 'bg-gray-400'}`} />
                  <span>{item.available ? 'In Stock' : 'Sold Out'}</span>
                </button>
                <button
                  onClick={() => toggleItemQrVisibility(item.id)}
                  className={`p-1.5 rounded-lg transition-colors ${item.showOnQr === false ? 'text-gray-400 hover:bg-gray-200' : 'text-[#E58A3A] bg-orange-50 hover:bg-orange-100'}`}
                  title={item.showOnQr === false ? 'Show on QR menu' : 'Hide from QR menu'}
                >
                  {item.showOnQr === false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 text-[#5C3A21] hover:bg-[#E8E0D5] rounded-lg transition-colors"
                  title="Edit Dish"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${item.name}" from menu?`)) {
                      deleteMenuItem(item.id);
                    }
                  }}
                  className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                  title="Delete Dish"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#241A14]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E0D5] relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F8F5F0] text-[#665A4F] hover:text-[#241A14] flex items-center justify-center font-bold text-sm"
            >
              ✕
            </button>

            <h3 className="text-xl font-extrabold text-[#241A14] mb-4">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-[#665A4F] block mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Belgian Waffle with Berries"
                    className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#5C3A21]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#665A4F] block mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setFormData({
                        ...formData,
                        category: newCat,
                        image: imagePresets[newCat] || formData.image
                      });
                    }}
                    className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {formData.category === 'Other' && (
                    <input
                      type="text"
                      required
                      value={formData.customCategory}
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                      placeholder="Type your category name"
                      className="w-full mt-2 text-xs font-semibold py-2 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14] focus:outline-none focus:ring-2 focus:ring-[#E58A3A]"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#665A4F] block mb-1">
                    Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="240"
                    className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#665A4F] block mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Gourmet ingredients, presentation, tasting notes..."
                  className="w-full text-xs font-normal py-2 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#665A4F] block mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs py-2 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#241A14]">
                  <input
                    type="checkbox"
                    checked={formData.isVeg}
                    onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Vegetarian (Green badge)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#241A14]">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="w-4 h-4 rounded text-[#E58A3A] focus:ring-[#E58A3A]"
                  />
                  <span>Bestseller Star</span>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E8E0D5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#665A4F] hover:bg-[#F8F5F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#5C3A21] hover:bg-[#4B2E19] text-white text-xs font-extrabold shadow-md transition-all"
                >
                  {editingItem ? 'Save Changes' : 'Publish Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
