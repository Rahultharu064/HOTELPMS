import { useEffect, useState } from "react";
import { Plus, Edit2, Search, ImageOff, LayoutGrid } from "lucide-react";
import { toast } from "react-hot-toast";
import { galleryService } from "../../services/galleryService";
import type { GalleryVenue } from "../../data/venues";
import { resolveVenueIcon } from "../../data/venues";
import { GalleryVenueForm } from "../../components/Admin/Gallery/GalleryVenueForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { getImageUrl } from "../../services/api";
import { AdminCardGridSkeleton } from "../../components/ui/skeletons/AdminSkeletons";
import { DeleteIconButton } from "../../components/ui/ActionIconButton";

export default function GalleryVenuesPage() {
  const [venues, setVenues] = useState<GalleryVenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<GalleryVenue | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchVenues = async () => {
    setIsLoading(true);
    try {
      const response = await galleryService.getAllVenues();
      if (response.success && response.data) {
        setVenues(response.data);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Failed to fetch gallery venues");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleCreateOrUpdate = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (editingVenue) {
        const response = await galleryService.updateVenue(editingVenue.id, data);
        if (response.success) {
          toast.success("Gallery venue updated successfully");
          fetchVenues();
          handleCloseModal();
        }
      } else {
        const response = await galleryService.createVenue(data);
        if (response.success) {
          toast.success("Gallery venue created successfully");
          fetchVenues();
          handleCloseModal();
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Failed to save gallery venue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this gallery venue permanently?")) return;
    try {
      const response = await galleryService.deleteVenue(id);
      if (response.success) {
        toast.success("Gallery venue deleted successfully");
        fetchVenues();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Failed to delete gallery venue");
    }
  };

  const handleOpenModal = (venue?: GalleryVenue) => {
    setEditingVenue(venue);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVenue(undefined);
  };

  const filteredVenues = venues.filter(
    (v) =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.layout.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10 p-2 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase flex items-center gap-4">
            <div className="w-2 h-8 bg-[#14532D] rounded-full" />
            Gallery &amp; Venues
          </h1>
          <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mt-2 ml-6">
            Manage homepage gallery cards &amp; venue highlights
          </p>
        </div>

        <Button
          onClick={() => handleOpenModal()}
          className="bg-[#14532D] hover:bg-[#111827] text-white px-8 h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-[#14532D]/10 flex items-center gap-3"
        >
          <Plus size={20} strokeWidth={3} /> Add Venue
        </Button>
      </div>

      <Card className="p-4 border-none shadow-soft bg-white/60 backdrop-blur-md rounded-3xl">
        <div className="relative w-full md:w-[400px] group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-neutral-text-secondary" />
          </div>
          <input
            type="text"
            placeholder="Search venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-2xl border border-neutral-border/50 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#14532D]/20"
          />
        </div>
      </Card>

      {isLoading ? (
        <AdminCardGridSkeleton count={6} />
      ) : filteredVenues.length === 0 ? (
        <Card className="py-16 text-center border-dashed">
          <LayoutGrid size={40} className="mx-auto mb-4 text-gray-300" />
          <p className="text-sm font-bold text-gray-500">No gallery venues found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => {
            const Icon = resolveVenueIcon(venue.icon);
            const imageSrc = venue.image.startsWith("http") ? venue.image : getImageUrl(venue.image);

            return (
              <Card
                key={venue.id}
                className="overflow-hidden border-none shadow-soft bg-white rounded-3xl group hover:shadow-xl transition-all"
              >
                <div className="relative h-44 bg-neutral-light">
                  {venue.image ? (
                    <img src={imageSrc} alt={venue.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageOff size={32} className="text-gray-300" />
                    </div>
                  )}
                  <div className="absolute left-4 top-4 flex gap-2">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#14532D]">
                      {venue.layout}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                        venue.isActive ? "bg-primary-green text-white" : "bg-gray-500 text-white"
                      }`}
                    >
                      {venue.isActive ? "Active" : "Hidden"}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B]/15">
                      <Icon size={18} className="text-[#F59E0B]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#111827]">{venue.title}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Order: {venue.sortOrder}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-5">{venue.description}</p>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleOpenModal(venue)}
                      className="flex-1 h-11 rounded-xl bg-[#14532D]/5 text-[#14532D] hover:bg-[#14532D] hover:text-white text-[10px] font-black uppercase tracking-widest"
                    >
                      <Edit2 size={14} className="mr-2" /> Edit
                    </Button>
                    <DeleteIconButton
                      onClick={() => handleDelete(venue.id)}
                      title="Delete Venue"
                      className="h-11 w-11"
                      size={14}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingVenue ? "Edit Gallery Venue" : "Create Gallery Venue"}
        size="lg"
      >
        <GalleryVenueForm
          initialData={editingVenue}
          onSubmit={handleCreateOrUpdate}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}
