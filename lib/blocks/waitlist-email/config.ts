import * as Yup from 'yup';

export interface WaitlistEmailBlockConfig {
  title: string;
  label: string;
  buttonLabel: string;
  items: ItemType[]
  // waitlistId: string;
}

export interface ItemType {
  // id: number;
  text: string;
  color: string
}

export const defaults: WaitlistEmailBlockConfig = {
  title: 'Get the latest updates',
  label: 'Fresh content straigt to your inbox, just for you ✨',
  buttonLabel: 'Subscribe',
  items: []
  // waitlistId: '',
};

export const WaitlistEmailBlockSchema = Yup.object().shape({
  title: Yup.string().required('Please provide a title'),
  label: Yup.string().required('Please provide a label'),
  buttonLabel: Yup.string().required('Please provide a button label'),
  items: Yup.array()
  .of(
    Yup.object({
      text: Yup.string().required('Option text is required'),
      color: Yup.string(),
    })
  ),
  // waitlistId: Yup.string().required('Please provide your waitlist ID'),
});


// For ui component
export interface WaitlistFormConfig {
  pageId: string
  email: string
  text?: string
  blockType: string
  option?: ItemType
}

export const defaultFormValues: WaitlistFormConfig = {
  pageId: '',
  email: '',
  text: '',
  blockType: '',
  option: {text: '', color: ''}
}

export const WaitlistFormSchema = Yup.object({
  pageId: Yup.string(),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  text: Yup.string(),
  option: Yup.object(),
});