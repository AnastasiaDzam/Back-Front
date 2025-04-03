import React, { useCallback, useState } from 'react';
import { Button, Form, Input, notification, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
  UserValidator,
  signInThunk,
  signUpThunk,
  isEmailExistsChecker,
  type SignInDataType,
  type SignUpDataType,
} from '@/entities/user';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { unwrapResult } from '@reduxjs/toolkit';

type Props = {
  type: 'signin' | 'signup';
  onSuccess?: () => void;
};

export default function AuthForm({ type, onSuccess }: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.user.loading);
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleFieldsChange = useCallback((): void => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length > 0);
    const isFieldsTouched = form.isFieldsTouched(true);

    if (type === 'signin') {
      setIsButtonDisabled(!isFieldsTouched || hasErrors);
    } else {
      const passwordsMatch =
        form.getFieldValue('password') === form.getFieldValue('confirmPassword');
      setIsButtonDisabled(!isFieldsTouched || hasErrors || !file || !passwordsMatch);
    }
  }, [file, form, type]);

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

  const onSignInFinish = async (values: SignInDataType): Promise<void> => {
    const normalizedEmail = values.email.toLowerCase();
    try {
      const resultAction = await dispatch(
        signInThunk({
          email: normalizedEmail,
          password: values.password,
        }),
      );

      unwrapResult(resultAction);
      form.resetFields();
      setFile(null);
      setIsButtonDisabled(true);
      onSuccess?.();
    } catch (error) {
      console.log(error);
    }
  };

  const onSignUpFinish = async (values: SignUpDataType): Promise<void> => {
    const normalizedEmail = values.email.toLowerCase();
    const formData = new FormData();
    formData.append('email', normalizedEmail);
    formData.append('password', values.password);
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);

    const isEmailExistsData = await isEmailExistsChecker(normalizedEmail);

    if (!isEmailExistsData.data?.exists) {
      message.error(isEmailExistsData.message);
      return;
    }

    if (file) {
      formData.append('image', file);
    } else {
      notification.error({
        message: 'Ошибка загрузки',
        description: 'Пожалуйста, загрузите аватар.',
      });
      return;
    }

    try {
      const resultAction = await dispatch(signUpThunk(formData));

      unwrapResult(resultAction);

      notification.success({
        message: 'Добро пожаловать',
        description: 'Теперь тебе доступны все возможности приложения!',
      });

      form.resetFields();
      setFile(null);
      setIsButtonDisabled(true);
      onSuccess?.();
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    handleFieldsChange();
  }, [file, handleFieldsChange]);

  return (
    <Form
      form={form}
      name="auth"
      layout="vertical"
      initialValues={{ remember: true }}
      onFinish={type === 'signin' ? onSignInFinish : onSignUpFinish}
      onFieldsChange={handleFieldsChange}
      style={{ width: '100%' }}
    >
      <Form.Item
        name="email"
        required
        hasFeedback
        tooltip="Это обязательное поле"
        validateDebounce={1000}
        rules={[
          { required: true, message: 'Введите email' },
          {
            validator: (_, value: string) =>
              UserValidator.validateEmail(value)
                ? Promise.resolve()
                : Promise.reject(new Error('Некорректный email')),
          },
        ]}
      >
        <Input placeholder="Введите email" />
      </Form.Item>

      <Form.Item
        name="password"
        hasFeedback
        validateDebounce={1000}
        rules={[
          { required: true, message: 'Введите ваш пароль' },
          {
            validator: async (_, value: string) => {
              if (UserValidator.validatePassword(value)) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(
                  'Пароль должен быть не менее 8 символов, содержать заглавные и строчные буквы, цифры и специальные символы.',
                ),
              );
            },
          },
        ]}
      >
        <Input.Password placeholder="Введите пароль" />
      </Form.Item>

      {type === 'signup' && (
        <>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Пожалуйста, подтвердите пароль.' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && value === getFieldValue('password')) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают.'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Подтвердите пароль" />
          </Form.Item>

          <Form.Item
            name="firstName"
            hasFeedback
            rules={[{ required: true, message: 'Пожалуйста, укажите ваше имя.' }]}
          >
            <Input placeholder="Введите имя" />
          </Form.Item>
          <Form.Item
            name="lastName"
            hasFeedback
            rules={[{ required: true, message: 'Пожалуйста, укажите вашу фамилию.' }]}
          >
            <Input placeholder="Введите фамилию" />
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
        </>
      )}

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          disabled={isButtonDisabled}
        >
          {type === 'signup' ? 'Регистрация' : 'Вход'}
        </Button>
      </Form.Item>
    </Form>
  );
}
