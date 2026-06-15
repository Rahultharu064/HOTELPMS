/** Preload room details chunk on hover for faster navigation */
export const prefetchRoomDetails = (): void => {
  void import('../pages/publicwebsite/RoomDetailspage');
};
