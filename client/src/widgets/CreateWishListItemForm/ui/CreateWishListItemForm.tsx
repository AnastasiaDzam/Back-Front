import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { Form, Input, InputNumber, Select, Upload, Button, Space, message } from 'antd';
import React, { useState } from 'react';
import { createWishListItemThunk, type WishlistItemRawDataType } from '@/entities/wishlist';
import { Priority } from '@/entities/wishlist';
import { closeModalCreateWishListItem } from '@/shared/model/slices/modalSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import type { UploadFile } from 'antd/es/upload/interface';
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { TextEditor } from '@/shared/ui/TextEditor';

export function CreateWishListItemForm(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { loading, currentWishlist } = useAppSelector((state) => state.wishlist);
  const [fileError, setFileError] = useState(false);
  const [description, setDescription] = useState<string>('');

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onBeforeUpload = (file: UploadFile): boolean => {
    setFileError(false);
    setFileList((prev) => [...prev, file]);
    return false;
  };

  const onRemoveImage = (file: UploadFile): void => {
    const updatedFileList = fileList.filter((existingFile) => existingFile.uid !== file.uid);
    setFileList(updatedFileList);

    if (updatedFileList.length === 0) {
      setFileError(true);
    }
  };

  const onFinish = async (values: WishlistItemRawDataType): Promise<void> => {
    if (fileList.length === 0) {
      message.error('Пожалуйста, добавьте хотя бы один файл.');
      return;
    }

    if (values.links.length === 0) {
      message.error('Пожалуйста, добавьте хотя бы одну ссылку.');
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', description);
    formData.append('priority', values.priority);
    formData.append('minPrice', values.minPrice.toString());
    formData.append('maxPrice', values.maxPrice.toString());
    formData.append('wishlistId', currentWishlist!.id.toString());
    values.links.forEach((link, index) => {
      formData.append(`links[${index}]`, link);
    });
    fileList.forEach((file) => formData.append('images', file as unknown as File));

    try {
      const resultAction = await dispatch(createWishListItemThunk(formData));
      unwrapResult(resultAction);

      form.resetFields();
      setFileList([]);
      setDescription('');
      dispatch(closeModalCreateWishListItem());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form
      form={form}
      name="wishlist-item-form"
      layout="vertical"
      initialValues={{ priority: Priority.MEDIUM }}
      onFinish={onFinish}
      style={{ width: '100%' }}
    >
      <Form.Item
        name="title"
        label="Название"
        rules={[{ required: true, message: 'Пожалуйста, укажите название желания.' }]}
      >
        <Input placeholder="Введите название желания" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Описание"
        rules={[{ required: true, message: 'Пожалуйста, укажите описание желания.' }]}
      >
        <TextEditor value={description} onChange={(value) => setDescription(value)} />
      </Form.Item>

      <Form.Item
        name="minPrice"
        label="Минимальная цена"
        rules={[{ required: true, message: 'Пожалуйста, укажите минимальную цену.' }]}
      >
        <InputNumber placeholder="Минимальная цена (₽)" style={{ width: '100%' }} min={0} />
      </Form.Item>
      <Form.Item
        name="maxPrice"
        label="Максимальная цена"
        rules={[{ required: true, message: 'Пожалуйста, укажите максимальную цену.' }]}
      >
        <InputNumber placeholder="Максимальная цена (₽)" style={{ width: '100%' }} min={0} />
      </Form.Item>

      <Form.Item
        name="priority"
        label="Приоритет"
        rules={[{ required: true, message: 'Пожалуйста, укажите приоритет.' }]}
      >
        <Select>
          {Object.values(Priority).map((priority) => (
            <Select.Option key={priority} value={priority}>
              {priority}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Ссылки">
        <Form.List name="links">
          {(fields, { add, remove }) => (
            <div>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={name}
                    rules={[
                      {
                        required: true,
                        message: 'Пожалуйста, введите ссылку или удалите это поле.',
                      },
                      { type: 'url', message: 'Введите корректную ссылку.' },
                    ]}
                  >
                    <Input placeholder="Введите ссылку" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Добавить ссылку
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item
        label="Картинки"
        validateStatus={fileError ? 'error' : ''}
        help={fileError ? 'Добавьте хотя бы один файл.' : ''}
      >
        <Upload
          beforeUpload={onBeforeUpload}
          onRemove={(file) => onRemoveImage(file)}
          fileList={fileList}
          multiple
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>Загрузить картинки</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>
          Создать желание
        </Button>
      </Form.Item>
    </Form>
  );
}
