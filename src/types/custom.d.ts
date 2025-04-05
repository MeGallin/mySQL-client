declare module '@mui/icons-material' {
  import { SvgIconProps } from '@mui/material';
  import { ComponentType } from 'react';

  export const LockOutlined: ComponentType<SvgIconProps>;
  export const AccountCircle: ComponentType<SvgIconProps>;
  export const Add: ComponentType<SvgIconProps>;
  export const Delete: ComponentType<SvgIconProps>;
  export const Edit: ComponentType<SvgIconProps>;
  export const Search: ComponentType<SvgIconProps>;
  export const ArrowBack: ComponentType<SvgIconProps>;
}

declare module 'react-hook-form' {
  export interface UseFormProps<
    TFieldValues extends FieldValues = FieldValues,
  > {
    mode?: Mode;
    reValidateMode?: ReValidateMode;
    defaultValues?: DeepPartial<TFieldValues>;
    resolver?: Resolver<TFieldValues>;
    context?: any;
    shouldFocusError?: boolean;
    shouldUnregister?: boolean;
    shouldUseNativeValidation?: boolean;
    criteriaMode?: CriteriaMode;
    delayError?: number;
  }

  export type FieldValues = Record<string, any>;
  export type Mode = 'onSubmit' | 'onChange' | 'onBlur' | 'onTouched' | 'all';
  export type ReValidateMode = 'onSubmit' | 'onChange' | 'onBlur';
  export type CriteriaMode = 'firstError' | 'all';
  export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

  export interface UseFormReturn<
    TFieldValues extends FieldValues = FieldValues,
  > {
    control: Control<TFieldValues>;
    handleSubmit: (
      onSubmit: SubmitHandler<TFieldValues>,
    ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
    reset: (values?: DeepPartial<TFieldValues>) => void;
    formState: { errors: any; isSubmitting: boolean };
    register: (name: keyof TFieldValues) => {
      onChange: (event: any) => void;
      onBlur: () => void;
      name: keyof TFieldValues;
      ref: (instance: any) => void;
    };
  }

  export type Control<TFieldValues extends FieldValues = FieldValues> = any;
  export type SubmitHandler<TFieldValues extends FieldValues> = (
    data: TFieldValues,
    event?: React.BaseSyntheticEvent,
  ) => any | Promise<any>;

  export function useForm<TFieldValues extends FieldValues = FieldValues>(
    props?: UseFormProps<TFieldValues>,
  ): UseFormReturn<TFieldValues>;
  export function Controller<TFieldValues extends FieldValues = FieldValues>(
    props: any,
  ): JSX.Element;
}

declare module '@hookform/resolvers/yup' {
  import { Resolver } from 'react-hook-form';
  import { ObjectSchema } from 'yup';

  export function yupResolver<T extends Record<string, any>>(
    schema: ObjectSchema<T>,
  ): Resolver<T>;
}

declare module 'yup' {
  export type Maybe<T> = T | null | undefined;

  export class Schema<TType = any> {
    validate(value: any): Promise<TType>;
  }

  export class StringSchema<TType = string> extends Schema<TType> {
    min(limit: number, message?: string): StringSchema<TType>;
    max(limit: number, message?: string): StringSchema<TType>;
    email(message?: string): StringSchema<TType>;
    required(message?: string): StringSchema<TType>;
    oneOf(options: any[], message?: string): StringSchema<TType>;
    nullable(): StringSchema<TType | null>;
    ref(path: string): StringSchema<TType>;
  }

  export class DateSchema<TType = Date> extends Schema<TType> {
    nullable(): DateSchema<TType | null>;
    transform(fn: (value: any) => any): DateSchema<TType>;
  }

  export class ObjectSchema<TType = any> extends Schema<TType> {
    shape<U extends { [k: string]: any }>(fields: U): ObjectSchema<U>;
  }

  export function object<TType = any>(): ObjectSchema<TType>;
  export function string(): StringSchema;
  export function date(): DateSchema;
}
