import { Spin, ConfigProvider, theme, Tag, Button, Space } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../../../constants/index.js';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';
import { DownloadOutlined, FileOutlined } from '@ant-design/icons';
import { useChallenges } from '../../../../hooks/admin/challanges/useChallenges.js';
import { useMemo } from 'react';
import { useUsers } from '../../../../hooks/admin/users/useUsers.js';
import { useHackathons } from '../../../../hooks/admin/hackathons/useHackathons.js';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchChallenge } = useChallenges();
  const { fetchUsers,  } = useUsers();
  const { fetchHackathons  } = useHackathons();
  const { data: challenge, isLoading, error } = fetchChallenge(id);
  const { data: userData = [] } = fetchUsers;
  const { data: hackData = [] } = fetchHackathons;

  const safe = (val, fallback = 'N/A') => val ?? fallback;

  const modelData = useMemo(() => {
    if (!challenge) return null;
      const user = userData.find((u) => u.userId === challenge.userId);
      const hackathon = hackData.find((h) => h.hackathonId === challenge.hackathonId);

      return {
        ...challenge,
        user: user || { fullName: 'Ẩn danh' },
        hackathon: hackathon || { name: 'N/A' },
      };
  }, [challenge, userData, hackData]);

  const handleDownload = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(url, '_blank');
    }
  };

  // Xác định loại file để preview
  const getPreviewUrl = (filePath) => {
    if (!filePath) return null;
    const base = 'https://www.sealfall25.somee.com';
    const url = filePath.startsWith('http') ? filePath : base + filePath;
    const ext = filePath.split('.').pop().toLowerCase();
    if (['pdf', 'doc', 'docx'].includes(ext)) {
      return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
    }
    return null;
  };

  const model = {
    modelName: 'Challenges',
    fields: [
      { key: 'Tiêu đề', type: 'input', name: 'title' },
      { key: 'Mô tả', type: 'textarea', name: 'description' },

      // File với preview iframe
      {
        key: 'Tệp đính kèm',
        type: 'custom',
        render: (record) => {
          const filePath = record.filePath;
          if (!filePath)
            return <span className="text-gray-500">Không có file</span>;

          const fileName = filePath.split('/').pop();

          const downloadUrl = filePath.startsWith('http')
            ? filePath
            : `https://www.sealfall25.somee.com${filePath}`;
          const previewUrl = getPreviewUrl(filePath);

          return (
            <div className="space-y-3 w-full">
              <Space>
                <FileOutlined className="text-emerald-400" />
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  {fileName}
                </a>
                <Button
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(downloadUrl, fileName)}
                  type="link"
                  className="text-emerald-400 p-0"
                >
                  Tải xuống
                </Button>
              </Space>

              {previewUrl && (
                <div className="mt-3 border border-neutral-700 rounded-lg overflow-hidden">
                  <iframe
                    src={previewUrl}
                    title="Preview file"
                    className="w-full h-96"
                    style={{ minHeight: '400px' }}
                    frameBorder="0"
                  />
                </div>
              )}
            </div>
          );
        },
      },

      {
        key: 'Trạng thái',
        type: 'status',
        name: 'status',
        statusMap: {
          Complete: { text: 'Hoàn thành', color: 'success' },
          Pending: { text: 'Chờ xử lý', color: 'warning' },
          Cancel: { text: 'Đã hủy', color: 'error' },
        }
      },

      {
        key: 'Hackathon',
        type: 'input',
        name: ['hackathon', 'name'],
        transform: (v) => (v ? v : 'Ẩn danh'),
      },
      {
        key: 'Người tạo',
        type: 'input',
        name: ['user', 'fullName'],
        transform: (v) => (v ? v : 'Ẩn danh'),
      },
      {
        key: 'Ngày tạo',
        type: 'datetime',
        name: 'createdAt',
        format: 'DD/MM/YYYY HH:mm:ss',
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: '#111111',
          colorBgElevated: '#181818',
          colorBorder: '#2f2f2f',
          colorText: '#ffffff',
          colorTextPlaceholder: '#9ca3af',
          colorPrimary: '#10b981',
          borderRadius: 6,
        },
      }}
    >
      <EntityDetail
        entityName="Thử thách"
        model={model}
        data={modelData || {}}
        onBack={() =>
          navigate(PATH_NAME.PARTNER_CHALLENGES || '/admin/challenges')
        }
        onEdit={(rec) =>
          navigate(`${PATH_NAME.PARTNER_CHALLENGES}/edit/${rec.challengeId}`)
        }
        showEdit
      />
    </ConfigProvider>
  );
};

export default ChallengeDetail;
