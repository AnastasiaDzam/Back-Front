import { useCallback, useEffect, useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { Button, Form, Input, notification, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { updateWishListByIdThunk } from '@/entities/wishlist';
import { closeModalUpdateWishlist } from '@/shared/model/slices/modalSlice';

export function UpdateWishlistForm(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { loading, currentWishlist } = useAppSelector((state) => state.wishlist);
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    if (currentWishlist) {
      form.setFieldsValue({
        title: currentWishlist.title,
      });
    }
  }, [currentWishlist, form]);

  const handleFieldsChange = useCallback((): void => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length > 0);
    setIsButtonDisabled(hasErrors);
  }, [form]);

  const onBeforeUpload = (avatar: File): boolean => {
    const isImage = avatar.type.startsWith('image/');
    if (!isImage) {
      notification.error({
        message: 'Ошибка загрузки',
        description: 'Можно загружать только файлы изображений.',
      });
      return false;
    }
    setFile(avatar);
    handleFieldsChange();
    return false;
  };

  const onFinish = async (values: { title: string }): Promise<void> => {
    if (!currentWishlist) {
      notification.error({
        message: 'Ошибка',
        description: 'Не удалось найти текущий вишлист для обновления.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);

    if (file) {
      formData.append('image', file);
    }

    try {
      const resultAction = await dispatch(
        updateWishListByIdThunk({
          id: currentWishlist.id,
          updatedWishlistData: formData,
        }),
      );
      unwrapResult(resultAction);

      form.resetFields();
      setFile(null);
      setIsButtonDisabled(true);
      dispatch(closeModalUpdateWishlist());
    } catch (error) {
      notification.error({
        message: 'Ошибка',
        description: 'Не удалось обновить вишлист. Попробуйте снова.',
      });
      console.error(error);
    }
  };

  return (
    <Form
      form={form}
      name="updateWishlist"
      layout="vertical"
      initialValues={{ title: currentWishlist?.title, remember: true }}
      onFinish={onFinish}
      onFieldsChange={handleFieldsChange}
      style={{ width: '100%' }}
    >
      <Form.Item
        name="title"
        hasFeedback
        rules={[{ required: true, message: 'Пожалуйста, укажите название вишлиста.' }]}
      >
        <Input placeholder="Введите название вишлиста" />
      </Form.Item>

      <Form.Item
        label="Загрузка нового изображения"
        tooltip="Выберите новое изображение для вишлиста"
      >
        <Upload
          beforeUpload={onBeforeUpload}
          listType="picture"
          maxCount={1}
          onRemove={() => setFile(null)}
        >
          <Button icon={<UploadOutlined />}>Нажмите для загрузки</Button>
        </Upload>
        {currentWishlist?.backgroundPictureSrc && !file && (
          <img
            src={`${import.meta.env.VITE_IMAGES}/${currentWishlist.backgroundPictureSrc}`}
            alt="Current background"
            style={{ width: '100%', marginTop: '10px', borderRadius: '8px' }}
          />
        )}
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          disabled={isButtonDisabled}
        >
          Обновить
        </Button>
      </Form.Item>
    </Form>
  );
}
