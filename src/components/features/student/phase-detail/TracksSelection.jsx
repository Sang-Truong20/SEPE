import { useState } from 'react';
import { Card, Empty, Form, Spin } from 'antd';
import TrackCard from './TrackCard';
import TrackDetailModal from './TrackDetailModal';

const TracksSelection = ({ 
  tracks, 
  isLoading, 
  selectedTrackId, 
  onTrackSelect, 
  form,
  onFinish
}) => {
  const [selectedTrackForModal, setSelectedTrackForModal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <Card className="bg-card-background border border-card-border backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Chọn Track
      </h3>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : tracks && tracks.length > 0 ? (
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="trackId"
            rules={[{ required: true, message: 'Vui lòng chọn track!' }]}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tracks.map((track) => {
                const isSelected = selectedTrackId === track.trackId;
                return (
                  <TrackCard
                    key={track.trackId}
                    track={track}
                    isSelected={isSelected}
                    onSelect={() => {
                      setSelectedTrackForModal(track);
                      setModalVisible(true);
                    }}
                    onSubmit={() => {
                      form.submit();
                    }}
                  />
                );
              })}
            </div>
          </Form.Item>
        </Form>
      ) : (
        <Empty description="Chưa có track nào cho phase này" />
      )}

      <TrackDetailModal
        track={selectedTrackForModal}
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedTrackForModal(null);
        }}
        onSelectTrack={() => {
          if (selectedTrackForModal) {
            onTrackSelect(selectedTrackForModal.trackId);
            form.setFieldsValue({ trackId: selectedTrackForModal.trackId });
            form.submit();
          }
        }}
        isSelected={selectedTrackForModal?.trackId === selectedTrackId}
      />
    </Card>
  );
};

export default TracksSelection;

