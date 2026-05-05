import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { extraService } from '../../../services/extraService';
import type { ExtraService } from '../../../services/extraServiceManagement';

import { Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Select } from '../../ui/Select';

interface ExtraServiceFormProps {
  initialData?: ExtraService;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function ExtraServiceForm({ initialData, onSubmit, onCancel, isLoading }: ExtraServiceFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    categoryId: initialData?.categoryId?.toString() || '',
    discountPercentage: initialData?.discountPercentage?.toString() || '0',
    discountAllowed: initialData?.discountAllowed ? 'true' : 'false',
    image: null as File | null,
  });

  const fetchCategories = async () => {
    try {
      const response = await extraService.getServiceCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newCategory.name) return toast.error('Category name is required');
    
    setIsCategorySubmitting(true);
    try {
      const response = await extraService.createCategory(newCategory);
      if (response.success) {
        toast.success('Category created successfully');
        await fetchCategories();
        setFormData(prev => ({ ...prev, categoryId: response.data.id.toString() }));
        setIsAddingCategory(false);
        setNewCategory({ name: '', description: '' });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create category');
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('categoryId', formData.categoryId);
    data.append('discountPercentage', formData.discountPercentage);
    data.append('discountAllowed', formData.discountAllowed);
    if (formData.image) {
      data.append('image', formData.image);
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-neutral-text-secondary">Service Name</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Extra Bed, Airport Shuttle"
            required
            className="h-12 rounded-xl border-none bg-neutral-light shadow-inner font-bold"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-widest text-neutral-text-secondary">Category</label>
            <button
              type="button"
              onClick={() => setIsAddingCategory(!isAddingCategory)}
              className="text-primary-green hover:text-primary-dark transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
            >
              {isAddingCategory ? <X size={14} /> : <Plus size={14} />}
              {isAddingCategory ? 'Cancel' : 'Add New'}
            </button>
          </div>
          
          {isAddingCategory ? (
            <div className="flex flex-col gap-2 p-3 bg-neutral-light rounded-xl animate-in fade-in slide-in-from-top-2">
              <input
                type="text"
                placeholder="Category Name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border-none bg-white shadow-sm text-sm font-bold focus:ring-2 focus:ring-primary-green outline-none"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border-none bg-white shadow-sm text-sm font-bold focus:ring-2 focus:ring-primary-green outline-none"
              />
              <Button
                onClick={handleCreateCategory}
                isLoading={isCategorySubmitting}
                className="h-10 rounded-lg bg-primary-green text-white text-[10px] font-black uppercase tracking-widest"
              >
                Save Category
              </Button>
            </div>
          ) : (
            <Select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full h-12 px-4 rounded-xl border-none bg-neutral-light shadow-inner font-bold focus:ring-2 focus:ring-primary-green outline-none"
            options={categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))}
            />
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-neutral-text-secondary">Price (NPR)</label>
          <Input
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            required
            className="h-12 rounded-xl border-none bg-neutral-light shadow-inner font-bold"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-neutral-text-secondary">Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-neutral-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-primary-dark/5 file:text-primary-dark hover:file:bg-primary-dark/10 transition-all cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-neutral-text-secondary">Discount %</label>
          <Input
            name="discountPercentage"
            type="number"
            min="0"
            max="100"
            value={formData.discountPercentage}
            onChange={handleChange}
            placeholder="0"
            className="h-12 rounded-xl border-none bg-neutral-light shadow-inner font-bold"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-neutral-text-secondary">Discount Allowed</label>
          <Select
            name="discountAllowed"
            value={formData.discountAllowed}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl border-none bg-neutral-light shadow-inner font-bold focus:ring-2 focus:ring-primary-green outline-none"
            options={[{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }]}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-neutral-text-secondary">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Describe the service..."
          required
          className="w-full p-4 rounded-xl border-none bg-neutral-light shadow-inner font-bold focus:ring-2 focus:ring-primary-green outline-none resize-none"
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="ghost"
          className="h-12 px-8 rounded-xl text-xs font-black uppercase tracking-widest text-neutral-text-secondary hover:bg-neutral-light transition-all"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="h-12 px-8 rounded-xl bg-primary-dark hover:bg-black text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-primary-dark/20 transition-all"
        >
          {initialData ? 'Update Service' : 'Create Service'}
        </Button>
      </div>
    </form>
  );
}
