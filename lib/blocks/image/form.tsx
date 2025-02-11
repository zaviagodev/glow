import { Form, Formik, FormikHelpers } from 'formik';
import { Loader2 } from 'lucide-react';

import { FormFileUpload } from '@/components/FormFileUpload';

import { Button } from '@/components/ui/button';

import { EditFormProps } from '../types';
import { ImageBlockConfig, ImageSchema } from './config';
import { FormField } from '@/app/components/FormField';

export function EditForm({
  initialValues,
  onSave,
  onClose,
  blockId,
}: EditFormProps<ImageBlockConfig>) {
  const onSubmit = async (
    values: ImageBlockConfig,
    { setSubmitting }: FormikHelpers<ImageBlockConfig>
  ) => {
    setSubmitting(true);
    onSave(values);
  };

  return (
    <Formik
      initialValues={{
        src: initialValues?.src ?? '',
        url: initialValues?.url ?? '',
      }}
      validationSchema={ImageSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ isSubmitting, setValues, errors }) => (
        <Form className="w-full flex flex-col">
          <FormFileUpload
            htmlFor="image-src"
            onUploaded={(url) => setValues(prev => ({...prev, src: url}))}
            initialValue={initialValues?.src}
            referenceId={blockId}
            assetContext="blockAsset"
            blockType="image-block"
          />
          <FormField
            label="Url"
            name="url"
            id="url"
            placeholder="https://example.com"
            className='mt-4'
          />
          <div className="flex flex-shrink-0 justify-between py-4 border-t border-stone-200">
            <Button variant="secondary" onClick={onClose}>
              ← Cancel
            </Button>
            <Button type="submit">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
