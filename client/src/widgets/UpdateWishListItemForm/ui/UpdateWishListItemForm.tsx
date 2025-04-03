import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, Upload, Button, Space, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import {
  updateWishListItemThunk,
  type WishlistItemType,
  type WishlistItemRawDataType,
} from '@/entities/wishlist';
import { closeModalUpdateWishListItem } from '@/shared/model/slices/modalSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { Priority } from '@/entities/wishlist';
import { TextEditor } from '@/shared/ui/TextEditor';
import type { LinkType } from '@/entities/wishlist/model';

type UpdateWishListItemFormProps = {
  wishListItem: WishlistItemType;
};

export function UpdateWishListItemForm({
  wishListItem,
}: UpdateWishListItemFormProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.wishlist);

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [description, setDescription] = useState<string>('1234321234');

  const [existingLinks, setExistingLinks] = useState<LinkType[]>([]);
  const [linksToAdd, setLinksToAdd] = useState<string[]>([]);
  const [linksToRemove, setLinksToRemove] = useState<LinkType[]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      title: wishListItem.title,
      minPrice: wishListItem.minPrice,
      maxPrice: wishListItem.maxPrice,
      priority: wishListItem.priority,
      links: wishListItem.links.map((el) => el.src) || [],
    });

    setDescription(wishListItem.description || '');
    setExistingLinks(wishListItem.links);

    if (wishListItem.images?.length > 0) {
      const initialFiles = wishListItem.images.map(({ src }, index) => ({
        uid: `init_${index}`,
        name: `Image_${index + 1}`,
        status: 'done',
        src: `${import.meta.env.VITE_IMAGES}/${src}`,
        thumbUrl: `${import.meta.env.VITE_IMAGES}/${src}`,
      }));
      setFileList(initialFiles);
    }
  }, [wishListItem, form]);

  const onBeforeUpload = (file: UploadFile): boolean => {
    setFileList((prev) => [...prev, file]);
    return false;
  };

  const onRemoveImage = (file: UploadFile): void => {
    setFileList((prev) => prev.filter((existingFile) => existingFile.uid !== file.uid));
  };

  const onFinish = async (values: WishlistItemRawDataType): Promise<void> => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', description);
    formData.append('priority', values.priority);
    formData.append('minPrice', values.minPrice.toString());
    formData.append('maxPrice', values.maxPrice.toString());

    if (linksToAdd.length > 0) {
      linksToAdd.forEach((link, index) => {
        formData.append(`linksToAdd[${index}]`, link);
      });
    }
    if (linksToRemove.length > 0) {
      linksToRemove.forEach((link, index) => {
        formData.append(`linksToRemove[${index}]`, String(link.id));
      });
    }

    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append('images', file.originFileObj);
      }
    });

    try {
      const resultAction = await dispatch(
        updateWishListItemThunk({ id: wishListItem.id, formData }),
      );
      unwrapResult(resultAction);
      message.success('Желание успешно обновлено!');
      dispatch(closeModalUpdateWishListItem());
    } catch (error) {
      console.error(error);
      message.error('Ошибка при обновлении желания.');
    }
  };

  return (
    <Form
      form={form}
      name="wishlist-item-update-form"
      layout="vertical"
      onFinish={onFinish}
      style={{ width: '100%' }}
    >
      <Form.Item
        name="title"
        label="Название"
        rules={[{ required: true, message: 'Введите название желания.' }]}
      >
        <Input placeholder="Введите название" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Описание"
        rules={[{ required: true, message: 'Введите описание желания.' }]}
      >
        <TextEditor value={description} onChange={(value) => setDescription(value)} />
      </Form.Item>

      <Form.Item
        name="minPrice"
        label="Минимальная цена"
        rules={[{ required: true, message: 'Введите минимальную цену.' }]}
      >
        <InputNumber placeholder="Минимальная цена" style={{ width: '100%' }} min={0} />
      </Form.Item>

      <Form.Item
        name="maxPrice"
        label="Максимальная цена"
        rules={[{ required: true, message: 'Введите максимальную цену.' }]}
      >
        <InputNumber placeholder="Максимальная цена" style={{ width: '100%' }} min={0} />
      </Form.Item>

      <Form.Item
        name="priority"
        label="Приоритет"
        rules={[{ required: true, message: 'Укажите приоритет.' }]}
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
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={name}
                    rules={[{ required: true, message: 'Введите ссылку или удалите поле.' }]}
                  >
                    <Input
                      placeholder="Ссылка"
                      onBlur={(e) => {
                        const { value } = e.target;

                        if (existingLinks.map((el) => el.src).includes(value)) {
                          setLinksToRemove((prev) => prev.filter(({ src }) => src !== value));
                        } else if (!linksToAdd.includes(value)) {
                          setLinksToAdd((prev) => [...prev, value]);
                        }
                      }}
                    />
                  </Form.Item>
                  <MinusCircleOutlined
                    onClick={() => {
                      const linkValue = form.getFieldValue(['links', name]);

                      const existingLink = existingLinks.find((link) => link.src === linkValue);
                      if (existingLink) {
                        setLinksToRemove((prev) => [...prev, existingLink]);
                      }

                      setLinksToAdd((prev) => prev.filter((link) => link !== linkValue));
                      remove(name);
                    }}
                  />
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                Добавить ссылку
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item label="Картинки">
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
        <Button type="primary" htmlType="submit" loading={loading}>
          Обновить желание
        </Button>
      </Form.Item>
    </Form>
  );
}
