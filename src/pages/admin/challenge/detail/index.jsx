import { Spin, ConfigProvider, theme, Tag, Button, Space } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../../../constants/index.js';
import EntityDetail from '../../../../components/ui/EntityDetail.jsx';
import { DownloadOutlined, FileOutlined } from '@ant-design/icons';
import { useChallenges } from '../../../../hooks/admin/challanges/useChallenges.js';

const ChallengeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchChallenge } = useChallenges();
    const { data: challenge, isLoading, error } = fetchChallenge(id);

    const safe = (val, fallback = 'N/A') => val ?? fallback;

    // Xác định loại file để preview
    const getPreviewUrl = (filePath) => {
        if (!filePath) return null;
        const base = 'https://www.sealfall25.somee.com';
        const url = filePath.startsWith('http') ? filePath : base + filePath;
        const ext = filePath.split('.').pop().toLowerCase();
        if (['pdf', 'doc', 'docx'].includes(ext)) {
            // Google Docs Viewer cho DOC/PDF
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
                key: 'File đính kèm',
                type: 'custom',
                render: (record) => {
                    const filePath = record.filePath;
                    if (!filePath) return <span className="text-gray-500">Không có file</span>;

                    const fileName = filePath.split('/').pop();
                    const downloadUrl = `https://www.sealfall25.somee.com${filePath}`;
                    const previewUrl = getPreviewUrl(filePath);

                    return (
                        <div className="space-y-3">
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
                                    href={downloadUrl}
                                    target="_blank"
                                    type="link"
                                    className="text-emerald-400 p-0"
                                />
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
                }
            },

            { key: 'Trạng thái', type: 'tag', name: 'status', tagColor: (v) => v === 'Complete' ? 'success' : 'processing' },

            // === CHỈ 2 CỘT CHO MÙA & NGƯỜI TẠO ===
            {
                type: 'column',
                items: [
                    [
                        {
                            key: 'Mùa',
                            type: 'tag',
                            name: 'seasonName',
                            tagColor: 'blue',
                            transform: (v) => v ? v : 'Chưa gán mùa'
                        }
                    ],
                    [
                        {
                            key: 'Người tạo',
                            type: 'input',
                            name: 'userName',
                            transform: (v) => v ? v : 'Ẩn danh'
                        }
                    ]
                ]
            },

            { key: 'Ngày tạo', type: 'datetime', name: 'createdAt', format: 'DD/MM/YYYY HH:mm:ss' }
        ]
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-400">
                Lỗi tải dữ liệu thử thách.
            </div>
        );
    }

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
                    borderRadius: 6
                }
            }}
        >
            <EntityDetail
                entityName="Thử thách"
                model={model}
                data={challenge || {}}
                onBack={() => navigate(PATH_NAME.ADMIN_CHALLENGES || '/admin/challenges')}
                onEdit={(rec) => navigate(`${PATH_NAME.ADMIN_CHALLENGES}/edit/${rec.challengeId}`)}
                showEdit
            />
        </ConfigProvider>
    );
};

export default ChallengeDetail;