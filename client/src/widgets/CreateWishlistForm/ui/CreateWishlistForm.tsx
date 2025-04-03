import { useCallback, useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { Button, Form, Input, notification, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { type CreateWishListData, createWishListThunk } from '@/entities/wishlist';
import { closeModalCreateWishlist } from '@/shared/model/slices/modalSlice';

export function CreateWishListForm(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.wishlist);
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleFieldsChange = useCallback((): void => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length > 0);
    const isFieldsTouched = form.isFieldsTouched(true);
    setIsButtonDisabled(!isFieldsTouched || hasErrors);
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

  const onFinish = async (values: CreateWishListData): Promise<void> => {
    const formData = new FormData();
    formData.append('title', values.title);

    if (file) {
      formData.append('image', file);
    } else {
      notification.error({
        message: 'Ошибка загрузки',
        description: 'Пожалуйста, загрузите задний фон для вишлиста.',
      });
      return;
    }

    try {
      const resultAction = await dispatch(createWishListThunk(formData));

      unwrapResult(resultAction);

      form.resetFields();
      setFile(null);
      setIsButtonDisabled(true);
      dispatch(closeModalCreateWishlist());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form
      form={form}
      name="auth"
      layout="vertical"
      initialValues={{ remember: true }}
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
        label="Загрузка аватара"
        required
        tooltip="Выберите изображение для вашего профиля"
      >
        <Upload
          beforeUpload={onBeforeUpload}
          listType="picture"
          maxCount={1}
          onChange={handleFieldsChange}
          onRemove={() => setFile(null)}
        >
          <Button icon={<UploadOutlined />}>Нажмите для загрузки</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          disabled={isButtonDisabled}
        >
          Создать
        </Button>
      </Form.Item>
    </Form>
  );
}
