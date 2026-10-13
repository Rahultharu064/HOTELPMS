import { useState } from "react";
import { Button } from "../../ui/Button";
import type { GalleryVenue } from "../../../data/venues";
import { VENUE_ICON_OPTIONS } from "../../../data/venues";
import { getImageUrl } from "../../../services/api";

interface GalleryVenueFormProps {
  initialData?: GalleryVenue;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function GalleryVenueForm({ initialData, onSubmit, onCancel, isLoading }: GalleryVenueFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    icon: initialData?.icon || "UtensilsCrossed",
    layout: initialData?.layout || "compact",
    sortOrder: initialData?.sortOrder?.toString() || "0",
    isActive: initialData?.isActive !== false ? "true" : "false",
    image: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    if (formData.slug) data.append("slug", formData.slug);
    data.append("description", formData.description);
    data.append("icon", formData.icon);
    data.append("layout", formData.layout);
    data.append("sortOrder", formData.sortOrder);
    data.append("isActive", formData.isActive);
    if (formData.image) data.append("image", formData.image);
    onSubmit(data);
  };

  const previewImage = formData.image
    ? URL.createObjectURL(formData.image)
    : initialData?.image
    ? initialData.image.startsWith("http")
      ? initialData.image
      : getImageUrl(initialData.image)
    : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-neutral-text-secondary">
            Venue Title
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Royal Dining"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-neutral-text-secondary">
            Slug (optional)
          </label>
          <input
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="input-field"
            placeholder="royal-dining"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-black uppercase tracking-widest text-neutral-text-secondary">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="input-field resize-none"
            placeholder="Describe the venue experience..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-neutral-text-secondary">Icon</label>
          <select name="icon" value={formData.icon} onChange={handleChange} className="input-field" title="Venue icon">
            {VENUE_ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-neutral-text-secondary">
            Grid Layout
          </label>
          <select name="layout" value={formData.layout} onChange={handleChange} className="input-field" title="Grid layout">
            <option value="featured">Featured (large left card)</option>
            <option value="compact">Compact (top right cards)</option>
            <option value="wide">Wide (bottom right card)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-neutral-text-secondary">
            Sort Order
          </label>
          <input
            name="sortOrder"
            type="number"
            min={0}
            value={formData.sortOrder}
            onChange={handleChange}
            className="input-field"
            title="Sort order"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-neutral-text-secondary">Status</label>
          <select name="isActive" value={formData.isActive} onChange={handleChange} className="input-field" title="Venue status">
            <option value="true">Active (visible on website)</option>
            <option value="false">Inactive (hidden)</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-black uppercase tracking-widest text-neutral-text-secondary">
            Venue Image
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            title="Upload venue image"
            className="input-field file:mr-4 file:rounded-lg file:border-0 file:bg-primary-green file:px-4 file:py-2 file:text-xs file:font-bold file:text-white"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-3 h-40 w-full rounded-2xl object-cover border border-neutral-border/50"
            />
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-neutral-border/50 pt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-[#14532D] hover:bg-[#111827] text-white">
          {isLoading ? "Saving..." : initialData ? "Update Venue" : "Create Venue"}
        </Button>
      </div>
    </form>
  );
}
