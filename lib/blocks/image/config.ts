import * as Yup from 'yup';

export interface ImageBlockConfig {
  src: string;
  url: string;
}

export const defaults: ImageBlockConfig = {
  src: 'https://cdn.glow.as/default-data/image.png',
  url: '',
};

export const ImageSchema = Yup.object().shape({
  src: Yup.string().required('Please provide an image URL.'),
  url: Yup.string(),
});
