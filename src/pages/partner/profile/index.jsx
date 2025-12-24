import { useState, useEffect } from 'react';
import { ConfigProvider, theme, Form, Input, Button, Upload, Modal, message as antdMessage } from 'antd';
import {
    SaveOutlined,
    DeleteOutlined,
    UploadOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { usePartnerProfile } from '../../../hooks/partner/usePartnerProfile';
import { useUserData } from '../../../hooks/useUserData';

const { TextArea } = Input;
const { confirm } = Modal;

const PartnerProfile = () => {
    const [form] = Form.useForm();
    const { userInfo, isLoading: isLoadingUser } = useUserData();
    const { createProfile, updateProfile, deleteProfile } = usePartnerProfile();

    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [hasProfile, setHasProfile] = useState(false);

    // Store original logo URL for reference
    const originalLogoUrl = userInfo?.partnerProfile?.logoUrl || null;

    // Check if profile exists
    useEffect(() => {
        if (userInfo?.partnerProfile) {
            const profile = userInfo.partnerProfile;
            setHasProfile(true);

            // Set form values from userInfo
            form.setFieldsValue({
                companyName: profile.companyName || '',
                website: profile.website || '',
                description: profile.description || '',
            });

            // Set logo preview if exists
            if (profile.logoUrl) {
                setLogoPreview(profile.logoUrl);
            }
        } else {
            setHasProfile(false);
            form.resetFields();
            setLogoFile(null);
            setLogoPreview(null);
        }
    }, [userInfo, form]);

    // Handle logo file change
    const handleLogoChange = (info) => {
        if (info.file.status === 'removed') {
            setLogoFile(null);
            setLogoPreview(null);
            return;
        }

        const file = info.file.originFileObj || info.file;
        if (file) {
            setLogoFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submit
    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();

            // Append fields - using exact API field names (case-sensitive for multipart/form-data)
            // All fields are required, so we can directly append them
            formData.append('CompanyName', values.companyName);
            formData.append('Website', values.website);
            formData.append('Description', values.description);

            // Handle logo file - MUST send logo in all cases
            if (logoFile) {
                // New file selected - use it
                formData.append('LogoFile', logoFile);
            } else if (hasProfile && originalLogoUrl) {
                // Update mode: no new file selected, but must send existing logo
                // Fetch logo from URL and convert to File
                const existingLogoFile = await urlToFile(originalLogoUrl, 'logo.png');
                if (existingLogoFile) {
                    formData.append('LogoFile', existingLogoFile);
                } else {
                    // If failed to fetch, show error
                    antdMessage.error('Không thể tải logo hiện có. Vui lòng chọn logo mới.');
                    return;
                }
            } else {
                // Create mode: logo is required, should be validated by form
                antdMessage.error('Vui lòng chọn logo');
                return;
            }

            if (hasProfile) {
                await updateProfile.mutateAsync(formData);
            } else {
                await createProfile.mutateAsync(formData);
            }

            // Reset form after successful submit
            setLogoFile(null);
            form.resetFields();
        } catch (error) {
            console.error('Error submitting profile:', error);
        }
    };

    // Handle delete
    const handleDelete = () => {
        confirm({
            title: <span className="text-white">Xác nhận xóa hồ sơ</span>,
            icon: <ExclamationCircleOutlined className="text-yellow-500" />,
            content: (
                <span className="text-white">
                    Bạn có chắc chắn muốn xóa hồ sơ này không? Hành động này không thể hoàn tác.
                </span>
            ),
            okText: 'Xóa',
            okButtonProps: { danger: true },
            cancelText: 'Hủy',
            className:
                '[&_.ant-modal-content]:bg-dark-secondary [&_.ant-modal-content]:border-white/10 [&_.ant-modal-header]:border-white/10 [&_.ant-modal-body]:text-white [&_.ant-modal-close]:text-white [&_.ant-modal-confirm-title]:text-white [&_.ant-modal-confirm-content]:text-white',
            onOk: async () => {
                try {
                    await deleteProfile.mutateAsync();
                    form.resetFields();
                    setLogoFile(null);
                    setLogoPreview(null);
                    setHasProfile(false);
                } catch (error) {
                    console.error('Error deleting profile:', error);
                }
            },
        });
    };

    // Convert URL to File for upload
    const urlToFile = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new File([blob], filename || 'logo.png', { type: blob.type });
            return file;
        } catch (error) {
            console.error('Error converting URL to File:', error);
            return null;
        }
    };

    // Handle reset form - clear everything including logo
    const handleReset = () => {
        form.resetFields();
        setLogoFile(null);
        setLogoPreview(null);
        // Don't restore any data - completely clear form
    };

    if (isLoadingUser) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
            <div className="bg-dark-secondary border border-dark-accent rounded-xl p-6 shadow-md h-full flex flex-col max-h-[calc(100vh-112px)]">
                <div className="mb-4 flex-shrink-0">
                    <div className="px-6 flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-1 text-white">
                                {hasProfile ? 'Cập nhật hồ sơ' : 'Tạo hồ sơ mới'}
                            </h1>
                            <p className="text-gray-400 text-sm">
                                {hasProfile
                                    ? 'Cập nhật thông tin hồ sơ đối tác của bạn'
                                    : 'Thiết lập thông tin hồ sơ đối tác'}
                            </p>
                        </div>
                        {hasProfile && (
                            <Button
                                size="large"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={handleDelete}
                                loading={deleteProfile.isPending}
                                className="!text-red-400 !border-red-400/50 hover:!border-red-400 hover:!bg-red-400/10"
                            >
                                Xóa hồ sơ
                            </Button>
                        )}
                    </div>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="px-6 flex-1 overflow-hidden flex flex-col"
                >
                    <div className="flex-1 overflow-y-auto pr-2">
                        {/* Company Name */}
                        <Form.Item
                            label={<span className="text-gray-300 text-sm font-medium">Tên công ty</span>}
                            name="companyName"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên công ty' },
                            ]}
                            className="mb-4"
                        >
                            <Input
                                placeholder="Nhập tên công ty"
                                className="h-10 text-base text-white placeholder:text-gray-400 bg-neutral-900 border border-neutral-700 rounded hover:bg-neutral-800 hover:border-primary focus:bg-neutral-800 focus:border-primary"
                            />
                        </Form.Item>

                        {/* Logo Upload */}
                        <Form.Item
                            label={<span className="text-gray-300 text-sm font-medium">Logo</span>}
                            name="logoFile"
                            rules={[
                                {
                                    validator: (_, value) => {
                                        // Logo is required: either new file selected OR existing logo from server (when updating)
                                        if (logoFile) {
                                            return Promise.resolve();
                                        }
                                        if (hasProfile && originalLogoUrl) {
                                            // In update mode, if original logo exists, it's valid
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Vui lòng chọn logo'));
                                    }
                                },
                            ]}
                            className="mb-4"
                        >
                            <div className="space-y-2">
                                {logoPreview && (
                                    <div className="mb-2">
                                        <img
                                            src={logoPreview}
                                            alt="Logo preview"
                                            className="max-w-xs max-h-24 object-contain rounded border border-neutral-700 p-2 bg-neutral-900"
                                        />
                                    </div>
                                )}
                                <Upload
                                    beforeUpload={() => false} // Prevent auto upload
                                    onChange={handleLogoChange}
                                    onRemove={() => {
                                        setLogoFile(null);
                                        // If updating, restore original logo preview; otherwise clear it
                                        if (hasProfile && originalLogoUrl) {
                                            setLogoPreview(originalLogoUrl);
                                        } else {
                                            setLogoPreview(null);
                                        }
                                        form.setFieldsValue({ logoFile: null });
                                        form.validateFields(['logoFile']);
                                    }}
                                    accept="image/*"
                                    maxCount={1}
                                    showUploadList={true}
                                >
                                    <Button
                                        icon={<UploadOutlined />}
                                        className="!text-primary !border-primary/50 hover:!border-primary hover:!bg-primary/10"
                                    >
                                        Chọn logo
                                    </Button>
                                </Upload>
                                <p className="text-gray-400 text-xs">
                                    Chọn file ảnh logo của công ty (JPG, PNG, GIF)
                                </p>
                            </div>
                        </Form.Item>

                        {/* Website */}
                        <Form.Item
                            label={<span className="text-gray-300 text-sm font-medium">Website</span>}
                            name="website"
                            rules={[
                                { required: true, message: 'Vui lòng nhập website' },
                                { type: 'url', message: 'Vui lòng nhập URL hợp lệ' },
                            ]}
                            className="mb-4"
                        >
                            <Input
                                placeholder="https://example.com"
                                className="h-10 text-base text-white placeholder:text-gray-400 bg-neutral-900 border border-neutral-700 rounded hover:bg-neutral-800 hover:border-primary focus:bg-neutral-800 focus:border-primary"
                            />
                        </Form.Item>

                        {/* Description */}
                        <Form.Item
                            label={<span className="text-gray-300 text-sm font-medium">Mô tả</span>}
                            name="description"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mô tả' },
                            ]}
                            className="mb-4"
                        >
                            <TextArea
                                rows={3}
                                placeholder="Nhập mô tả về công ty..."
                                className="text-base text-white placeholder:text-gray-400 bg-neutral-900 border border-neutral-700 rounded hover:bg-neutral-800 hover:border-primary focus:bg-neutral-800 focus:border-primary"
                                maxLength={1000}
                                showCount
                            />
                        </Form.Item>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800 flex-shrink-0">
                        <Button
                            size="large"
                            onClick={handleReset}
                            className="!text-text-primary !bg-dark-accent/30 hover:!bg-dark-accent/60 !border !border-dark-accent rounded-md"
                        >
                            Làm mới
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={createProfile.isPending || updateProfile.isPending}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {hasProfile ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    </div>
                </Form>
            </div>
        </ConfigProvider>
    );
};

export default PartnerProfile;

